import { BasePage } from "@pages/Base.page";

export class PortfolioPage extends BasePage {
  async openHomepage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
