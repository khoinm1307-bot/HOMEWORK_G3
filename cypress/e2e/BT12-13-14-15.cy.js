describe(" BT-12Context Menu", () => {
  it('BT12-Right-click', () => {
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
describe(" BT13- Horizontal Slider", () => {
  it.only("BT13-Kéo slider tới giá trị 3", () => {
    cy.visit("https://practice.expandtesting.com/horizontal-slider");

   cy.get("#range")
  .invoke("val", 3)
  .trigger("input")
  .should("have.value", "3");
  });
});
describe("Dynamic Controls", () => {
  it("BT14-Remove/Checkbox ", () => {
    cy.visit("https://practice.expandtesting.com/dynamic-controls");
    const box = () => cy.get("#checkbox-example");

    // Click "Remove"
    box().within(() => {
      cy.contains("button", /^Remove$/).click();
    });

    // Chờ xử lý async xong: loading biến mất + message xuất hiện
    box().find("#loading").should("not.be.visible");      // loading ẩn khỏi DOM
    box().find("#message").should("be.visible");         // có message báo kết quả

    //  Kiểm tra checkbox được xóa chưa
    box().find('input[type="checkbox"]').should("not.exist");

    // Click "Add"
    box().within(() => {
      cy.contains("button", /^Add$/).click();
    });

    // Chờ async xong
    box().find("#loading").should("not.be.visible");
    box().find("#message").should("be.visible");

    //  Kiểm tra checkbox được thêm lại chưa
    box().find('input[type="checkbox"]').should("exist").and("be.visible");
  });
});
describe("BT15 Dynamic Controls ", () => {
  it("BT15-Enable/Disable", () => {
    cy.visit("https://practice.expandtesting.com/dynamic-controls");

    const inputBox = () => cy.get("#input-example");

    //Click Enable
    inputBox().contains("button", "Enable").click();

    //  Chờ cho đến khi quá trình tải hoàn tất.
    inputBox().find("#loading").should("not.be.visible");

    // Check input = enabled 
    inputBox()
      .find('input[type="text"]')
      .should("be.enabled");

    // Click Disable
    inputBox().contains("button", "Disable").click();

    // Wait loading invisible and check disabled
    inputBox().find("#loading").should("not.be.visible");

    inputBox()
      .find('input[type="text"]')
      .should("be.disabled");
  });
});

