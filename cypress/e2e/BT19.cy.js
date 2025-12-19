describe("Windows - open new window", () => {
  it('Tìm text ở trang mới bằng cách mở cùng tab (remove target)', () => {
    cy.visit("https://practice.expandtesting.com/windows");

    // Tìm link mở cửa sổ mới (đa số là "Click Here")
    cy.contains("a", /click here/i)
      .should("have.attr", "href")
      .then((href) => {
        // Bỏ target để không mở tab mới
        cy.contains("a", /click here/i).invoke("removeAttr", "target").click();

        // Sang trang mới rồi assert nội dung cần tìm
        cy.contains("Example of a new window page for Automation Testing Practice")
          .should("be.visible");

        // (tuỳ chọn) kiểm tra URL đúng là href
        cy.url().should("include", href);
      });
  });
});
