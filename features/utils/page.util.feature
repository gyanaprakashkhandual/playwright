@navbar-buttons

Feature: Portfolio Navigation

    Background:
        Given the portfolio application is open

    Scenario: Click Skill button and verify navigation
        When the user clicks the "Skill" navigation button
        Then the section title should be "Skill"

    Scenario: Click Project button and verify navigation
        When the user clicks the "Project" navigation button
        Then the section title should be "Project"

    Scenario: Click Education button and verify navigation
        When the user clicks the "Education" navigation button
        Then the section title should be "Education"

    Scenario: Click Experience button and verify navigation
        When the user clicks the "Experience" navigation button
        Then the section title should be "Experience"

    Scenario: Click Blogs button and verify navigation
        When the user clicks the "Blogs" navigation button
        Then the section title should be "Blogs"

    Scenario: Click Docs button and verify navigation
        When the user clicks the "Docs" navigation button
        Then the section title should be "Docs"

    Scenario: Click Contact button and verify navigation
        When the user clicks the "Contact" navigation button
        Then the section title should be "Contact"

    Scenario Outline: All navigation buttons are visible on load
        Then the "<button>" navigation button should be visible

        Examples:
            | button     |
            | Skill      |
            | Project    |
            | Education  |
            | Experience |
            | Blogs      |
            | Docs       |
            | Contact    |

    Scenario: Rapid sequential navigation through all sections
        When the user clicks the "Skill" navigation button
        And the user clicks the "Project" navigation button
        And the user clicks the "Education" navigation button
        And the user clicks the "Experience" navigation button
        And the user clicks the "Blogs" navigation button
        And the user clicks the "Docs" navigation button
        And the user clicks the "Contact" navigation button
        Then the section title should be "Contact"

    Scenario: Navigate to a section and return to another
        When the user clicks the "Blogs" navigation button
        Then the section title should be "Blogs"
        When the user clicks the "Skill" navigation button
        Then the section title should be "Skill"

    Scenario: Verify non-existent navigation button is not present
        Then the "Dashboard" navigation button should not be visible

    Scenario: Page title is present after navigating to any section
        When the user clicks the "Experience" navigation button
        Then the page should have a valid title

    Scenario: Navigation buttons count matches expected
        Then the total navigation button count should be 7