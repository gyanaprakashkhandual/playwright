import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '@pages/Login.page';
import { PlaywrightWorld } from '../utils/world';
import { expect } from '@playwright/test';

let loginPage: LoginPage;

Given('I am on the login page', async function (this: PlaywrightWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigateToLogin();
});

When('I enter username {string}', async function (this: PlaywrightWorld, username: string) {
  await loginPage.enterUsername(username);
});

When('I enter password {string}', async function (this: PlaywrightWorld, password: string) {
  await loginPage.enterPassword(password);
});

When('I click the login button', async function (this: PlaywrightWorld) {
  await loginPage.clickLogin();
});

Then('I should see the welcome message', async function (this: PlaywrightWorld) {
  const isVisible = await loginPage.isWelcomeMessageVisible();
  expect(isVisible).toBeTruthy();
});

Then('I should see an error message {string}', async function (this: PlaywrightWorld, message: string) {
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain(message);
});