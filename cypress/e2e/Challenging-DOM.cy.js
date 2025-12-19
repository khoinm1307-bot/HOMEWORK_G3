describe("BT8", () => {

  it("Lấy danh sách các giá trị trong bảng", () => {
    cy.visit("https://practice.expandtesting.com/challenging-dom");

    // 1) Lấy danh sách header
    cy.get("table thead th").then(($ths) => {
      const headers = [...$ths].map((th) => th.innerText.trim());
      // headers: ["Lorem","Ipsum","Dolor","Sit","Amet","Diceret","Action"]

      // 2) Duyệt từng row và build array object
      cy.get("table tbody tr").then(($rows) => {
        const data = [...$rows].map((row) => {
          const cells = [...row.querySelectorAll("td")].map((td) =>
            td.innerText.trim()
          );
          // Map header -> cell thành object
          const obj = headers.reduce((acc, h, idx) => {
            acc[h] = cells[idx] ?? "";
            return acc;
          }, {});

          return obj;
        });

        // 3) Wrap để dùng tiếp trong Cypress chain
        cy.wrap(data, { log: false }).as("tableData");
      });
    });

    // Ví dụ dùng tiếp: in ra / assert
    cy.get("@tableData").then((tableData) => {
      cy.log(JSON.stringify(tableData, null, 2));
      expect(tableData).to.have.length.greaterThan(0);
      expect(tableData[0]).to.have.all.keys(
        "Lorem", "Ipsum", "Dolor", "Sit", "Amet", "Diceret", "Action"
      );
      /* Đoạn này mình dùng để ghi lại kết quả, sau khi chạy thì tạo thành file data lưu cypress/fixtures/tableData.json */
//       cy.get("@tableData").then((tableData) => {
//   cy.writeFile("cypress/fixtures/tableData.json", tableData);
// });

    });
  });
});
/*Bài 9*/
describe("BT9", () => {
 const url = "https://practice.expandtesting.com/challenging-dom";

  // locator nút vàng (ưu tiên class màu vàng)
  const yellowBtn = () =>
    cy.get('a.btn.btn-warning, button.btn.btn-warning').first();

  beforeEach(() => {
    cy.visit(url);
    // bắt mỗi lần trang reload/redirect lại challenging-dom
    cy.intercept("GET", "**/challenging-dom*").as("reloadPage");
    // Cái này có tác dụng chặn (intercept) request HTTP GET và đặt tên (alias) cho request đó để theo dõi hoặc chờ nó xảy ra.
  });

  it("Click yellow 10 times, wait redirect each time", () => {
    Cypress._.times(10, () => {
      yellowBtn().should("be.visible").click();

      // chờ trang reload xong (redirect/reload)
      cy.wait("@reloadPage");

      // xác nhận trang đã load lại (không dùng equal)
      cy.get("h1").should("contain", "Challenging DOM");
      cy.url().should("include", "/challenging-dom");
    });
  });
   });

/*Bài 10*/
describe("BT10", () => {
 it.only("Cách 1- Lấy từ canvas (OCR)", () => {
  cy.visit("https://practice.expandtesting.com/challenging-dom");

  cy.get("canvas")                 // canvas cuối trang
    .should("be.visible")
    .then(($c) => $c[0].toDataURL("image/png"))
    .then((dataUrl) => cy.task("ocrFromBase64", dataUrl))
    .then((text) => {
      const num = (text.match(/\b\d+\b/) || [null])[0]; // lấy số đầu tiên
      expect(num, "Answer number").to.match(/^\d+$/);
      // ví dụ ra 99900
      cy.log(`Answer: ${num}`);
    });
});
   });
