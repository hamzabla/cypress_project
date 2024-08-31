import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
  defaultCommandTimeout: 10000, // Adjust the timeout for commands
  chromeWebSecurity: false, // Some browsers handle iframe cross-origins differently than others
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL, // We used environment variable to handle the base url
    specPattern: 'cypress/e2e/**/*.feature', // Include .feature files for Cucumber
    fixturesFolder: 'fixtures',
    supportFile: 'cypress/support/e2e.ts',
    video: true, // To record videos of tests in case of failure
    screenshotsFolder: 'cypress/screenshots', // Folder for screenshots, where we can have screenshot when the test fails
    videosFolder: 'cypress/videos', // Folder for videos
    reporter: 'cypress-multi-reporters', // Use multi reporters
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports',
        overwrite: false,
        html: true,
        json: true,
      },
    },
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on('file:preprocessor', bundler);

      addCucumberPreprocessorPlugin(on, config);

      return config;
    },
  },
});
