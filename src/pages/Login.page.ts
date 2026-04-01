import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private selectors = {
    usernameInput: '#username',
    passwordInput: '#password',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '.error-message',
    welcomeMessage: '.welcome-message',
  };

  async navigateToLogin(): Promise<void> {
    await this.navigate('/login');
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