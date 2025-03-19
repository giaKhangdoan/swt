import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
  env: {
    apiUrl: 'https://pregnancy-growth-tracking-web-api-a6hxfqhsenaagthw.australiasoutheast-01.azurewebsites.net/api'
  }
}) 