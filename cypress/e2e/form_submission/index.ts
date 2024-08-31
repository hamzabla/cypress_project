import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import form_data from "../../fixtures/form.json";
import doc_data from "../../fixtures/urls.json";

beforeEach(() => {
  cy.visit('/');
});

Given('I am on the Submission Confirmation step of the form', () => {
	cy.visit(doc_data.document_upload_url);
	cy.get('tag#publishIcon').click();
	cy.uploadFileAndCheckSize({ filePath: 'path_to_valid_document.pdf'});
	cy.get('.upload-success').should('be.visible');
	cy.contains('Next').click();
	cy.get('input[name="title"]').type(form_data.form_title);
	cy.get('textarea[name="description"]').type(form_data.form_description);
  cy.get('select[name="category"]').select(form_data.form_category);
  cy.get('button[type="submit"]').click();
});

When('I simulate a network failure during form submission', () => {
  cy.intercept('POST', '/submit-form', { forceNetworkError: true }).as('formSubmit');
  cy.get('button[type="submit"]').contains('Confirm').click();  // Contains confirmation button
});

Then('The system should display an error message indicating the failure', () => {
  cy.contains('Network error, please try again later').should('be.visible'); // Verify the network error message
});

Then('The user should be given the option to save their progress', () => {
  cy.contains('Save Progress').should('be.visible'); // Verify that the Save Progress button is visible
  cy.contains('Save Progress').click();
});

When('I review the submitted elements', () => {
  cy.get('div.review-section').should('be.visible');
  cy.get('div.review-section').contains(form_data.form_title).should('be.visible');
  cy.get('div.review-section').contains(form_data.form_description).should('be.visible');
  cy.get('div.review-section').contains(form_data.form_category).should('be.visible');
});

Then('I see a confirm button', () => {
  cy.get('button[type="submit"]').contains('Confirm').should('be.visible');
});

When('I click on the confirm button', () => {
  cy.get('button[type="submit"]').contains('Confirm').click();
});

Then('The form should be successfully submitted', () => {
  cy.intercept('POST', '/submit-form', { statusCode: 200 }).as('formSubmitSuccess');
  cy.wait('@formSubmitSuccess').its('response.statusCode').should('eq', 200);
});

Then('I should see a success message', () => {
  cy.contains('Your submission was successful!').should('be.visible');
});