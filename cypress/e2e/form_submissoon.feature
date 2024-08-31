Feature: Form Submission

  Scenario: Simulate a network failure during form submission
    Given I am on the Submission Confirmation step of the form
    When I simulate a network failure during form submission
    Then The system should display an error message indicating the failure
    And The user should be given the option to save their progress

  Scenario: Verify reviewed submitted elements and confirm submission
    Given I am on the Submission Confirmation step of the form
    When I review the submitted elements
    And I see a confirm button
    And I click on the confirm button
    Then The form should be successfully submitted
    And I should see a success message
