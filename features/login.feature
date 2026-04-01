Feature: User Login

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the welcome message

  Scenario: Failed login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message "Username or password is incorrect"

  Scenario Outline: Login with multiple user types
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see the welcome message

    Examples:
      | username       | password     |
      | user_one       | pass_one     |
      | user_two       | pass_two     |