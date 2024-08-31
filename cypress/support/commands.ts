interface UploadFileOptions {
    filePath: string;
    maxSizeInMB?: number;
    selector?: string;
    validFormats?: string[];
}

// we log errors with this function and we let the system handle the actual errors
Cypress.Commands.add('uploadFileAndCheckSize', ({filePath, maxSizeInMB = 10, selector = 'input[type="file"]', validFormats = ['pdf', 'docx']}: UploadFileOptions): void => {
    cy.fixture(filePath).then((fileContent) => {
      const fileSizeInMB = fileContent.length / (1024 * 1024); // Convert to MB
      const fileExtension = filePath.split('.').pop()?.toLowerCase();

      if (!fileExtension || !validFormats.includes(fileExtension)) {
        cy.log(`Error: File format .${fileExtension} is not supported. Only ${validFormats.join(', ')} are allowed.`); // we log the error and we let the system handle it
      }
  
      if (fileSizeInMB > maxSizeInMB) {
        cy.log(`Error: File ${filePath} exceeds the maximum size of ${maxSizeInMB} MB`); // we log the error and we let the system handle it
      }
        cy.get(selector).attachFile({ filePath, mimeType: 'application/octet-stream', encoding: "utf-8", });
    });
  });

declare global {
    namespace Cypress {
        interface Chainable {
            uploadFileAndCheckSize: ({
                filePath,
                maxSizeInMB,
                selector,
                validFormats,
            }: UploadFileOptions) => Cypress.Chainable;
        }
    }
}

export {};