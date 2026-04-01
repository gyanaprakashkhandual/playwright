import { Before, After, ITestCaseHookParameter } from "@cucumber/cucumber";
import { PlaywrightWorld } from "@utils/world";

Before(async function (this: PlaywrightWorld) {
  console.log(">>> Before hook running");
  console.log(">>> this.page before init:", this.page);
  await this.init();
  console.log(">>> this.page after init:", this.page);
});

After(async function (this: PlaywrightWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === "FAILED") {
    if (this.page) {
      const screenshot = await this.page.screenshot();
      await this.attach(screenshot, "image/png");
    }
  }
  await this.close();
});