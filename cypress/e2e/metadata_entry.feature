Feature: Metadata Entry

  Scenario: Enter valid metadata and submit
    Given I am on the Metadata Entry step of the form
    When I enter valid metadata and submit
    Then The system should accept the metadata and move to the Submission Confirmation step

  Scenario: Enter invalid metadata and attempt to submit
    Given I am on the Metadata Entry step of the form
    When I enter <invalid_metadata> and attempt to submit
    Then The system should display an error message for <invalid_metadata> and prevent submission
    Examples:
        | invalid_metadata   |
        | empty              |
        | illegal_characters |

  Scenario: Handle dynamic elements based on document type selection
    Given I am on the Metadata Entry step of the form
    When I select the "Contract" category
    Then The "Contract Expiration Date" and "Contract Value" fields should appear dynamically
    And I should be able to fill out the "Contract Expiration Date" with a valid date and "Contract Value" with a valid amount
