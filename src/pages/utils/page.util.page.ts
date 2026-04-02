import { BasePage } from "../Base.page";

const NAV_BUTTONS: Record<string, string> = {
  Skill: "/html/body/nav/div/div/div[1]/button[1]",
  Project: "/html/body/nav/div/div/div[1]/button[2]",
  Education: "/html/body/nav/div/div/div[1]/button[3]",
  Experience: "/html/body/nav/div/div/div[1]/button[4]",
  Blogs: "/html/body/nav/div/div/div[1]/button[5]",
  Docs: "/html/body/nav/div/div/div[1]/button[6]",
  Contact: "/html/body/nav/div/div/div[1]/button[7]",
};

const NAV_CONTAINER_XPATH = "/html/body/nav/div/div/div[1]";

export class PortfolioNavPage extends BasePage {
  async openHomepage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  getNavButtonXPath(buttonName: string): string {
    return NAV_BUTTONS[buttonName];
  }

  async clickNavButton(buttonName: string): Promise<void> {
    const xpath = this.getNavButtonXPath(buttonName);
    if (!xpath) {
      throw new Error(`No XPath defined for nav button: "${buttonName}"`);
    }
    await this.clickElement(`xpath=${xpath}`);
  }

  async isNavButtonVisible(buttonName: string): Promise<boolean> {
    const xpath = this.getNavButtonXPath(buttonName);
    if (!xpath) {
      return false;
    }
    return await this.isVisible(`xpath=${xpath}`);
  }

  async getActiveSectionTitle(): Promise<string> {
    await this.page.waitForTimeout(300);
    const activeSection = await this.page.$eval(
      "section.active h2, section.active h1, [data-section].active h2, [data-section].active h1",
      (el) => el.textContent?.trim() ?? "",
    );
    return activeSection;
  }

  async getNavButtonText(buttonName: string): Promise<string> {
    const xpath = this.getNavButtonXPath(buttonName);
    if (!xpath) {
      return "";
    }
    return await this.getText(`xpath=${xpath}`);
  }

  async getTotalNavButtonCount(): Promise<number> {
    const container = await this.page.$$(`xpath=${NAV_CONTAINER_XPATH}/button`);
    return container.length;
  }

  async isNavButtonAbsent(buttonName: string): Promise<boolean> {
    const xpath = this.getNavButtonXPath(buttonName);
    if (!xpath) {
      return true;
    }
    return !(await this.isVisible(`xpath=${xpath}`));
  }
}
