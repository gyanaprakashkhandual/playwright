import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { PortfolioPage } from "@pages/utils/app.util.page";
import { PlaywrightWorld } from "@utils/world";

let portfolioPage: PortfolioPage;

Given(
  "I open the portfolio website {string}",
  async function (this: PlaywrightWorld, url: string) {
    portfolioPage = new PortfolioPage(this.page); // ← passes this.page from world
    await portfolioPage.openHomepage(url);
  },
);

Then(
  "the page title should be {string}",
  async function (this: PlaywrightWorld, expectedTitle: string) {
    const actualTitle = await portfolioPage.getPageTitle();
    expect(actualTitle).toBe(expectedTitle);
  },
);

Then(
  "the page title should contain {string}",
  async function (this: PlaywrightWorld, partialTitle: string) {
    const actualTitle = await portfolioPage.getPageTitle();
    expect(actualTitle).toContain(partialTitle);
  },
);
