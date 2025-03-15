// Cấu hình Applitools Eyes
module.exports = {
  testConcurrency: 5,
  apiKey: process.env.APPLITOOLS_API_KEY || 'YOUR_API_KEY',
  browser: [
    { width: 800, height: 600, name: 'chrome' },
    { width: 1600, height: 1200, name: 'firefox' },
    { width: 1024, height: 768, name: 'safari' },
    { deviceName: 'iPhone X', screenOrientation: 'portrait' },
  ],
  batchName: 'Pregnancy Growth Tracking UI Tests',
  appName: 'Pregnancy Growth Tracking',
  showLogs: true,
  failCypressOnDiff: false,
  dontCloseBatches: false,
  notifyOnCompletion: true,
}; 