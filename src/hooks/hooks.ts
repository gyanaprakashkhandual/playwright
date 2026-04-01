import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../utils/world';

Before(async function (this: PlaywrightWorld) {
  await this.openBrowser();
});

After(async function (this: PlaywrightWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  await this.closeBrowser();
});