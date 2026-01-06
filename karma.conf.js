module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma")
    ],

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible
    },

    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [{ type: "html" }, { type: "text-summary" }]
    },

    reporters: ["progress", "kjhtml"],

    // Increase various timeouts and tolerances to reduce flaky disconnects
    browserNoActivityTimeout: 120000,
    browserDisconnectTimeout: 20000,
    browserDisconnectTolerance: 3,
    captureTimeout: 120000,

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-extensions",
          "--disable-background-networking",
          "--disable-background-timer-throttling",
          "--disable-renderer-backgrounding",
          "--window-size=1400,1200"
        ]
      }
    },

    browsers: ["ChromeHeadlessNoSandbox"],
    restartOnFileChange: true,

    singleRun: false
  });
};
