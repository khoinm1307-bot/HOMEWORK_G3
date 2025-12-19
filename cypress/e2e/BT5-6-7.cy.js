describe("The slow task", () => {

    it("Wait the slow task finnish", () => {
        cy.intercept("GET", "**/*").as("anyGet");   // bắt GET (trong đó có request chậm)
        /*Dùng để chặn (intercept) các request network.Cho phép:
-Theo dõi request
-Mock response
-Chờ request hoàn thành (cy.wait */
        cy.visit("https://practice.expandtesting.com/slow");

        // Chờ ít nhất 1 GET hoàn tất (nếu bạn muốn “đồng bộ” theo network)
        cy.wait("@anyGet");

        // Sau đó vẫn nên assert dấu hiệu hoàn tất trên UI
        cy.contains("The slow task has finished", { timeout: 20000 })
            .should("be.visible");

    });
});

describe("Query", () => {

    it("Lấy phần tử trong bảng", () => {
        cy.visit('https://practice.expandtesting.com/large');
        cy.get("table tbody tr td")
            .contains("48.48")
            .should("exist");
    });
});
describe("Cypress inject JS", () => {

   it.only('Shadow DOM ', () => {
  cy.visit('https://practice.expandtesting.com/shadowdom');

  // 1 Stub alert để khỏi bật popup thật
  cy.window().then((win) => {
    cy.stub(win, 'alert').as('alert');

    // 2 Tương đương chạy ở console: $("#my-btn").on("click", () => {alert("OK");});
    // (dùng JS thuần cho chắc, vì jQuery có thể không truy cập được shadow)
    const host = win.document.querySelector('#shadow-host');     // chỉnh lại đúng selector host
    const root = host.shadowRoot;
    const btn = root.querySelector('#my-btn');

    btn.addEventListener('click', () => win.alert('OK'));
  });

  // 3 Click nút "This button is inside a Shadow DOM."
  cy.get('#shadow-host')
    .shadow()
    .contains('button', 'This button is inside a Shadow DOM.')
    .click();

  // 4 Xác minh alert hiển thị "OK"
  cy.get('@alert').should('have.been.calledWith', 'OK');
});

});