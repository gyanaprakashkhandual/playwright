import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
  webkit,
} from "@playwright/test";

export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    const browserName =
      (process.env.BROWSER as "chromium" | "firefox" | "webkit") || "chromium";
    const headless = process.env.HEADLESS !== "false";

    const browserMap = { chromium, firefox, webkit };
    this.browser = await browserMap[browserName].launch({ headless });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(PlaywrightWorld);
