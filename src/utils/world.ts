import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { ENV } from './env';

export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async openBrowser(): Promise<void> {
    const browserType =
      ENV.browser === 'firefox' ? firefox :
      ENV.browser === 'webkit' ? webkit :
      chromium;

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