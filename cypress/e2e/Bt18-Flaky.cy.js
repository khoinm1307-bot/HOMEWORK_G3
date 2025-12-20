describe("Flaky demo - retry 10", () => {
  it(
    "flaky and pass after retries",
    { retries: 10 },
    () => {
      cy.visit("https://practice.expandtesting.com/flaky-test");

      // Trang này ngẫu nhiên fail/pass
      // Cypress sẽ retry cho tới khi pass
      cy.contains(/success|passed/i, { timeout: 10000 })
        .should("be.visible");
    }
  );
});
