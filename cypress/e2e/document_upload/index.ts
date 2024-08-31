import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import doc_data from "../../fixtures/urls.json";

beforeEach(() => {
  cy.visit('/'); // Added a before each so we isolate each scenario 
});

Given('I am on the Document Upload step of the form', () => {
  cy.visit(doc_data.document_upload_url); // URL path to the document upload step (step 1)
});

When('I upload a document with a valid format and size', () => {
    cy.get('tag#publishIcon').click(); // Assuming we are clicking on a button that pop up the document uplaod section 
    cy.uploadFileAndCheckSize({ filePath: 'path_to_valid_document.pdf'});
});

When('I upload a document with an invalid format', () => {
    cy.uploadFileAndCheckSize({ filePath: 'path_to_invalid_format.exe'});
});

When('I upload a document that exceeds the maximum allowed size', () => {
    cy.uploadFileAndCheckSize({ filePath: 'path_to_large_document.pdf'});
});

Then('The document should be uploaded successfully', () => {
  cy.get('.upload-success').should('be.visible'); // Success message selector
});

Then('The system should display an error message indicating the format is not supported', () => {
  cy.get('.error-message').should('contain', 'Format is not supported'); // Error message selector and content
});

Then('The system should display an error message indicating the file is too large', () => {
  cy.get('.error-message').should('contain', 'File is too large'); // Error message selector and content
});
