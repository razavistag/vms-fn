module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  verbose: true,
  coverageReporters: ["html", "text-summary"],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Vue Unit Test", // place developer name inside the pageTitile
      },
    ],
  ],
};
