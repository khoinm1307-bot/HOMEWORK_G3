const { defineConfig } = require("cypress");
const { createWorker } = require("tesseract.js");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
     on("task", {
        async ocrFromBase64(base64Image) {
          const worker = await createWorker("eng");

          const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );

          const {
            data: { text },
          } = await worker.recognize(buffer);

          await worker.terminate();
          return text;
        },
      });

      return config;
    },
  },
  // e2e: {
  //   supportFile: "cypress/support/e2e.js",
  // }

});
// cho bài 17
module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    retries: 10,
  },
});
//
// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     retries: {
//       runMode: 10,   // khi chạy cypress run
//       openMode: 10, // khi chạy cypress open
//     },
//   },
// });


