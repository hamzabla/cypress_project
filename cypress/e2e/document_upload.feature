Feature: Document Upload

  Scenario: Upload a document with a valid format and size
    Given I am on the Document Upload step of the form
    When I upload a document with a valid format and size
    Then The document should be uploaded successfully

  Scenario: Upload a document with an invalid format
    Given I am on the Document Upload step of the form
    When I upload a document with an invalid format
    Then The system should display an error message indicating the format is not supported

  Scenario: Upload a document that exceeds the maximum allowed size
    Given I am on the Document Upload step of the form
    When I upload a document that exceeds the maximum allowed size
    Then The system should display an error message indicating the file is too large
