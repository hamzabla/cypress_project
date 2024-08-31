import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import form_data from "../../fixtures/form.json";
import doc_data from "../../fixtures/urls.json";

beforeEach(() => {
  cy.visit('/'); // added a before each so we isolate each scenario 
});

Given('I am on the Metadata Entry step of the form', () => {
  cy.visit(doc_data.document_upload_url);
	cy.get('tag#publishIcon').click();
	cy.uploadFileAndCheckSize({ filePath: 'path_to_valid_document.pdf'});
	cy.get('.upload-success').should('be.visible');
	cy.contains('Next').click();
});

When('I enter valid metadata and submit', () => {
  cy.get('input[name="title"]').type(form_data.form_title);
  cy.get('textarea[name="description"]').type(form_data.form_description);
  cy.get('select[name="category"]').select(form_data.form_category);
  cy.get('button[type="submit"]').click();
});

Then('The system should accept the metadata and move to the Submission Confirmation step', () => {
  cy.url().should('include', '/submission-confirmation-url'); // Verify the URL change
  cy.contains('Review and Confirm').should('be.visible');
});

When('I enter ${string} and attempt to submit', (invalidData: string) => {
	switch(invalidData){
			case 'empty':
				cy.get('input[name="title"]').clear();
				cy.get('textarea[name="description"]').clear(); // Leave description blank
				cy.get('select[name="category"]').select(''); // Select an empty category
				cy.get('button[type="submit"]').click(); // Attempt to submit
				break;
			case 'illegal_characters':
				cy.get('input[name="title"]').type('illeg@a|Tit|e');
				cy.get('textarea[name="description"]').type('illeg@a|D&scription'); // description with illegal characters
				cy.get('select[name="category"]').select('');
				cy.get('button[type="submit"]').click();
				break;
			default:
				throw new Error(`${invalidData} not managed`);
	}
});

Then('The system should display an error message for ${string} and prevent submission', (invalidData: string) => {
	switch(invalidData){
		case 'empty':
			cy.contains('Title is required').should('be.visible'); // Verify that an error message for the title is displayed
			cy.contains('Description is required').should('be.visible'); // Verify that an error message for the description is displayed
			cy.contains('Category is required').should('be.visible'); // Verify that an error message for the category is displayed
			break;
		case 'illegal_characters':
			cy.contains('Title contains illegal characters').should('be.visible');
			cy.contains('Description contains illegal characters').should('be.visible');
			cy.contains('Category is required').should('be.visible'); // we left it empty
			break;
		default:
			throw new Error(`${invalidData} not managed`);
}
});

When('I select the "Contract" category', () => {
  // Selecting the "Contract" category from a dropdown menu means here new field will apear ( dynamic field )
  cy.get('select[name="category"]').select('Contract');
});

Then('The "Contract Expiration Date" and "Contract Value" fields should appear dynamically', () => {
  // Verifying that the "Contract Expiration Date" field appears
  cy.get('input[name="contract-expiration-date"]').should('be.visible');
  cy.get('input[name="contract-value"]').should('be.visible');
});

Then('I should be able to fill out the "Contract Expiration Date" with a valid date and "Contract Value" with a valid amount', () => {
  // Fill out the "Contract Expiration Date" and "Contract Contract Value" with valid data
  cy.get('input[name="contract-expiration-date"]').type(form_data.dynamic_elements.contract.expiration_date);
  cy.get('input[name="contract-value"]').type(form_data.dynamic_elements.contract.value);
});