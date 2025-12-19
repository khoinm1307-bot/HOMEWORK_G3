describe("Context Menu", () => {
  it('Right-click', () => {
    cy.visit("https://practice.expandtesting.com/context-menu");

    // Bắt alert trước khi trigger hành động
    cy.on("window:alert", (text) => {
      expect(text).to.eq("You selected a context menu");
    });
    /**Giải thích câu lệnh trên
     * cy.on("window:alert", ...)
    cy.on() là event listener trong Cypress.
    "window:alert" là sự kiện được Cypress phát ra khi trang web gọi window.alert().
    Khi alert xuất hiện, Cypress không hiển thị popup thật, mà tự động bắt sự kiện này.
    text là nội dung (message) của alert.
    expect....:Kiểm tra xem nội dung alert có đúng bằng "You selected a context menu" hay không.
     */
    // Vùng cần right click 
    cy.get("#hot-spot")
      .should("be.visible")
      .rightclick();
  });
});
describe("Horizontal Slider", () => {
  it("Kéo slider tới giá trị 3", () => {
    cy.visit("https://practice.expandtesting.com/horizontal-slider");

   cy.get("#range")
  .invoke("val", 3)
  .trigger("input")
  .should("have.value", "3");
  });
});
