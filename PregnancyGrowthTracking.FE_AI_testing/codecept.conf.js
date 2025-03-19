const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './tests/codecept/**/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:5173', // Cổng mặc định của Vite
      show: true,
      browser: 'chromium',
      windowSize: '1200x900'
    },
    GeminiHelper: {
      require: './tests/helpers/gemini_helper'
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      mochaFile: 'output/result.xml',
      reportDir: 'output'
    }
  },
  name: 'PregnancyGrowthTracking.FE_AI_testing',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: false
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}; 