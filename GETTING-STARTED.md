# Playwright + Cucumber + Page Object Model + TypeScript + Allure Report

## Complete Test Framework Setup Guide

---

## Prerequisites

Before starting, ensure the following are installed on your machine:

- Node.js v18 or higher
- npm v9 or higher
- Visual Studio Code (recommended)
- Git

Verify your environment:

```bash
node --version
npm --version
```

---

## Step 1 - Initialize the Project

Create a new project directory and initialize it with npm.

```bash
mkdir playwright-cucumber-framework
cd playwright-cucumber-framework
npm init -y
```

---

## Step 2 - Install Core Dependencies

Install Playwright, Cucumber, TypeScript, and all related packages.

```bash
npm install --save-dev \
  @playwright/test \
  playwright \
  @cucumber/cucumber \
  @cucumber/pretty-formatter \
  typescript \
  ts-node \
  @types/node \
  allure-cucumberjs \
  allure-commandline \
  dotenv \
  cross-env
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Step 3 - Configure TypeScript

Create a `tsconfig.json` at the root of the project.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "dom"],
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@steps/*": ["src/steps/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 4 - Set Up the Project Folder Structure

Create the following directory structure:

```
playwright-cucumber-framework/
  src/
    pages/
      BasePage.ts
      LoginPage.ts
    steps/
      login.steps.ts
    hooks/
      hooks.ts
    utils/
      env.ts
      world.ts
  features/
    login.feature
  config/
    cucumber.json
  allure-results/
  allure-report/
  .env
  tsconfig.json
  package.json
```

Run the following to create all directories:

```bash
mkdir -p src/pages src/steps src/hooks src/utils features config allure-results allure-report
```

---

## Step 5 - Configure Cucumber

Create `config/cucumber.json` at the project root.

```json
{
  "default": {
    "require": ["src/hooks/hooks.ts", "src/steps/**/*.ts"],
    "requireModule": ["ts-node/register"],
    "format": ["allure-cucumberjs/reporter", "@cucumber/pretty-formatter"],
    "formatOptions": {
      "resultsDir": "allure-results"
    },
    "paths": ["features/**/*.feature"],
    "publishQuiet": true
  }
}
```

---

## Step 6 - Set Up Environment Configuration

Create a `.env` file at the root:

```env
BASE_URL=https://your-app-url.com
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000
```

Create `src/utils/env.ts` to load environment variables:

```typescript
import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  browser: process.env.BROWSER || "chromium",
  headless: process.env.HEADLESS === "true",
  slowMo: Number(process.env.SLOW_MO) || 0,
  timeout: Number(process.env.TIMEOUT) || 30000,
};
```

---

## Step 7 - Create the Custom World

The World object holds the Playwright browser, context, and page instances shared across steps.

Create `src/utils/world.ts`:

```typescript
import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
  webkit,
} from "playwright";
import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { ENV } from "./env";

export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async openBrowser(): Promise<void> {
    const browserType =
      ENV.browser === "firefox"
        ? firefox
        : ENV.browser === "webkit"
          ? webkit
          : chromium;

    this.browser = await browserType.launch({
      headless: ENV.headless,
      slowMo: ENV.slowMo,
    });

    this.context = await this.browser.newContext({
      baseURL: ENV.baseUrl,
      viewport: { width: 1280, height: 720 },
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(ENV.timeout);
  }

  async closeBrowser(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(PlaywrightWorld);
```

---

## Step 8 - Create Cucumber Hooks

Create `src/hooks/hooks.ts`:

```typescript
import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { PlaywrightWorld } from "../utils/world";

Before(async function (this: PlaywrightWorld) {
  await this.openBrowser();
});

After(async function (this: PlaywrightWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }
  await this.closeBrowser();
});
```

---

## Step 9 - Create the Base Page Object

Create `src/pages/BasePage.ts`:

```typescript
import { Page } from "playwright";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: "visible" });
  }

  async clickElement(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return await this.page.innerText(selector);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }
}
```

---

## Step 10 - Create a Page Object (Login Example)

Create `src/pages/LoginPage.ts`:

```typescript
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private selectors = {
    usernameInput: "#username",
    passwordInput: "#password",
    loginButton: '[data-testid="login-button"]',
    errorMessage: ".error-message",
    welcomeMessage: ".welcome-message",
  };

  async navigateToLogin(): Promise<void> {
    await this.navigate("/login");
  }

  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.selectors.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.selectors.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.errorMessage);
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.welcomeMessage);
  }
}
```

---

## Step 11 - Write a Feature File

Create `features/login.feature`:

```gherkin
Feature: User Login

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the welcome message

  Scenario: Failed login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message "Username or password is incorrect"

  Scenario Outline: Login with multiple user types
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see the welcome message

    Examples:
      | username       | password     |
      | user_one       | pass_one     |
      | user_two       | pass_two     |
```

---

## Step 12 - Write Step Definitions

Create `src/steps/login.steps.ts`:

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { LoginPage } from "../pages/LoginPage";
import { PlaywrightWorld } from "../utils/world";
import { expect } from "@playwright/test";

let loginPage: LoginPage;

Given("I am on the login page", async function (this: PlaywrightWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigateToLogin();
});

When(
  "I enter username {string}",
  async function (this: PlaywrightWorld, username: string) {
    await loginPage.enterUsername(username);
  },
);

When(
  "I enter password {string}",
  async function (this: PlaywrightWorld, password: string) {
    await loginPage.enterPassword(password);
  },
);

When("I click the login button", async function (this: PlaywrightWorld) {
  await loginPage.clickLogin();
});

Then(
  "I should see the welcome message",
  async function (this: PlaywrightWorld) {
    const isVisible = await loginPage.isWelcomeMessageVisible();
    expect(isVisible).toBeTruthy();
  },
);

Then(
  "I should see an error message {string}",
  async function (this: PlaywrightWorld, message: string) {
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain(message);
  },
);
```

---

## Step 13 - Configure npm Scripts

Update `package.json` scripts section:

```json
{
  "scripts": {
    "test": "cross-env CUCUMBER_PUBLISH_QUIET=true cucumber-js --config config/cucumber.json",
    "test:headed": "cross-env HEADLESS=false cucumber-js --config config/cucumber.json",
    "test:chrome": "cross-env BROWSER=chromium cucumber-js --config config/cucumber.json",
    "test:firefox": "cross-env BROWSER=firefox cucumber-js --config config/cucumber.json",
    "test:webkit": "cross-env BROWSER=webkit cucumber-js --config config/cucumber.json",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:report": "npm run allure:generate && npm run allure:open",
    "test:report": "npm test && npm run allure:report"
  }
}
```

---

## Step 14 - Install the Allure Command Line Tool

Install Allure CLI globally to generate and view reports:

```bash
npm install -g allure-commandline
```

Verify the installation:

```bash
allure --version
```

If you prefer not to install globally, you can use npx:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## Step 15 - Add Code Generation Support (Playwright Codegen)

Playwright includes a built-in code generation tool. Add the following scripts to make it easy to launch.

Add to `package.json` scripts:

```json
"codegen": "playwright codegen",
"codegen:url": "playwright codegen --target=playwright-test"
```

Usage examples:

```bash
# Open codegen against a specific URL
npx playwright codegen https://your-app-url.com

# Generate code in TypeScript (default)
npx playwright codegen --target=playwright-test https://your-app-url.com

# Record and save directly to a file
npx playwright codegen --target=playwright-test -o src/steps/generated.steps.ts https://your-app-url.com

# Run codegen with a specific browser
npx playwright codegen --browser=firefox https://your-app-url.com
```

The Codegen tool opens a browser and a code panel side by side. Every action you perform in the browser is translated into Playwright code in real time. Copy the generated locators and actions directly into your Page Object classes and step definitions.

---

## Step 16 - Run the Tests

Run the full test suite:

```bash
npm test
```

Run in headed (visible browser) mode:

```bash
npm run test:headed
```

Run on a specific browser:

```bash
npm run test:firefox
npm run test:webkit
```

---

## Step 17 - Generate and View the Allure Report

After the tests complete, generate and open the HTML report:

```bash
npm run allure:generate
npm run allure:open
```

Or run both in one command:

```bash
npm run allure:report
```

The Allure report will open automatically in your browser and display test results, timelines, categories, suite breakdowns, and screenshots attached on failure.

---

## Final Project Structure

After completing all steps, your project should look like this:

```
playwright-cucumber-framework/
  config/
    cucumber.json
  features/
    login.feature
  src/
    hooks/
      hooks.ts
    pages/
      BasePage.ts
      LoginPage.ts
    steps/
      login.steps.ts
    utils/
      env.ts
      world.ts
  allure-results/
  allure-report/
  .env
  package.json
  tsconfig.json
```

---

## Quick Reference

| Command                    | Description                     |
| -------------------------- | ------------------------------- |
| npm test                   | Run all tests headlessly        |
| npm run test:headed        | Run with visible browser        |
| npm run test:firefox       | Run on Firefox                  |
| npm run allure:report      | Generate and open Allure report |
| npx playwright codegen URL | Launch code generation tool     |

---

## Notes

- The `.env` file should never be committed to source control. Add it to `.gitignore`.
- Always place shared locators inside the relevant Page Object class, not inside step definitions.
- Use the `BasePage` class for all reusable browser interactions to keep Page Objects DRY.
- Screenshots are automatically captured on test failure and embedded in the Allure report.
- The Codegen tool is for accelerating step and locator authoring. Always review and refactor generated code before committing.
