// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('adsbygoogle')) {
    return false
  }
})
import '@4tw/cypress-drag-drop';
import "@testing-library/cypress/add-commands";
import "cypress-xpath";
 // Cho cách 3 bài 10
  Cypress.on("window:before:load", (win) => {
  win.__canvasTexts = [];

  const proto = win.CanvasRenderingContext2D?.prototype;
  if (!proto?.fillText) return;

  const original = proto.fillText;
  proto.fillText = function (text, ...rest) {
    win.__canvasTexts.push(String(text));
    return original.call(this, text, ...rest);
  };
});

