describe("Flaky demo - retry 10", () => {
  it(
    " flaky and pass after retries",
    { retries: 10 },
    () => {
      cy.visit("https://practice.expandtesting.com/flaky-test");

      // Lần đầu: Attempt 1 -> FAIL
      // Retry 1: Attempt 2 -> FAIL
      // Retry 2: Attempt 3 -> PASS
      cy.contains(/Attempt\s*3/i).should("be.visible");
    }
  );
});
