import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { PlaywrightWorld } from "../../utils/world";
import { PortfolioNavPage } from "../../pages/utils/page.util.page";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

function getPage(world: PlaywrightWorld): PortfolioNavPage {
  return new PortfolioNavPage(world.page);
}

Given(
  "the portfolio application is open",
  async function (this: PlaywrightWorld) {
    const page = getPage(this);
    await page.openHomepage(BASE_URL);
  },
);

When(
  "the user clicks the {string} navigation button",
  async function (this: PlaywrightWorld, buttonName: string) {
    const page = getPage(this);
    await page.clickNavButton(buttonName);
  },
);

Then(
  "the section title should be {string}",
  async function (this: PlaywrightWorld, expectedTitle: string) {
    const page = getPage(this);
    const actualTitle = await page.getActiveSectionTitle();
    expect(actualTitle.toLowerCase()).toContain(expectedTitle.toLowerCase());
  },
);

Then(
  "the {string} navigation button should be visible",
  async function (this: PlaywrightWorld, buttonName: string) {
    const page = getPage(this);
    const visible = await page.isNavButtonVisible(buttonName);
    expect(visible).toBe(true);
  },
);

Then(
  "the {string} navigation button should not be visible",
  async function (this: PlaywrightWorld, buttonName: string) {
    const page = getPage(this);
    const absent = await page.isNavButtonAbsent(buttonName);
    expect(absent).toBe(true);
  },
);

Then(
  "the page should have a valid title",
  async function (this: PlaywrightWorld) {
    const page = getPage(this);
    const title = await page.getPageTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  },
);

Then(
  "the total navigation button count should be {int}",
  async function (this: PlaywrightWorld, expectedCount: number) {
    const page = getPage(this);
    const count = await page.getTotalNavButtonCount();
    expect(count).toBe(expectedCount);
  },
);
