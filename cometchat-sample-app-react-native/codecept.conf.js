const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  name: 'DateChecker Tests',
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Appium: {
      platform: 'Android',
      app: 'C:/swt/cometchat-sample-app-react-native/android/app/build/outputs/apk/debug/app-debug.apk',
      desiredCapabilities: {
        platformName: 'Android',
        deviceName: 'emulator-5554',
        appPackage: 'com.demosampleapp',
        appActivity: '.MainActivity',
        automationName: 'UiAutomator2',
        noReset: true,
        fullReset: false,
        newCommandTimeout: 3600,
        waitForTimeout: 30000,
        waitForInterval: 1000
      },
      host: '127.0.0.1',
      port: 4723,
      path: '/wd/hub'
    }
  },
  include: {
    I: './steps_file.js'
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  hooks: [],
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 3,
      minTimeout: 3000
    },
    tryTo: {
      enabled: true
    }
  }
}