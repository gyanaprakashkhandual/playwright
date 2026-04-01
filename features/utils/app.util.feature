@utils
Feature: Portfolio Website Validation

    Background:
        Given I open the portfolio website "https://gyanprakash.vercel.app/"

    Scenario: Verify exact page title
        Then the page title should be "Welcome to my Portfolio"

    Scenario: Verify partial page title
        Then the page title should contain "Portfolio"