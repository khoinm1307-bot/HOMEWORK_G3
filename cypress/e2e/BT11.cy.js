describe("JS Dialogs handling", () => {

  beforeEach(() => {
    cy.visit("https://practice.expandtesting.com/js-dialogs");
  });

  it("alert: click OK", () => {
    // handle alert
    cy.on("window:alert", (text) => {
      expect(text).to.contain("I am a Js Alert"); // nếu có message
    });
    /*Giải thích
    cy.on(...):Đăng ký event listener trong Cypress.Lắng nghe sự kiện của trình duyệt
    window:alert": Tên sự kiện đặc biệt của Cypress
     */

    cy.get("#js-alert").click();
    // alert auto accepted
  });

  it("prompt: enter text and accept", () => {
    const promptInput = "Hello Cypress";

    cy.window().then((win) => {
      cy.stub(win, "prompt").returns(promptInput);
    });

    cy.get("#js-prompt").click();

    // sau khi xử lý prompt, kiểm tra kết quả
    cy.get("#dialog-response")
      .should("contain.text", promptInput);
  });

  it("confirm: click Cancel", () => {
    cy.on("window:confirm", (text) => {
      expect(text).to.contain("I am a Js Confirm");
      return false; // Cancel
    });

    cy.get("#js-confirm").click();

    // Cancel → có thể text phản hồi là "Cancel"
    cy.get("#dialog-response").should("contain.text", "Cancel");
  });

});