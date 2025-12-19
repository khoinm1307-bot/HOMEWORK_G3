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
  it("Cách 1- Lấy dataURL từ canvas rồi OCR canvas (OCR)", () => {
    /*Chụp canvas => OCR bằng tesseract.js (đọc được mọi chữ vẽ) 
     * Biến nội dung được vẽ trên thẻ <canvas> thành một ảnh (dạng dataURL),
     *  sau đó dùng công nghệ OCR để nhận dạng chữ/số có trong ảnh đó. */
    cy.visit("https://practice.expandtesting.com/challenging-dom");

    cy.get("canvas")                 // canvas cuối trang
      .should("be.visible")
      .then(($c) => $c[0].toDataURL("image/png"))
      .then((dataUrl) => cy.task("ocrFromBase64", dataUrl))
      .then((text) => {
        const num = (text.match(/\b\d+\b/) || [null])[0]; // lấy số đầu tiên
        expect(num, "Answer number").to.match(/^\d+$/);
        // Log kết quả
        cy.log(`Answer: ${num}`);
      });
  });

  it("Cách 2- Sử dụng onBeforeLoad on canvas", () => {
    /**onBeforeLoad chạy TRƯỚC khi JavaScript của trang web thực thi */
    cy.visit("https://practice.expandtesting.com/challenging-dom", {
      onBeforeLoad(win) {
        // lưu nơi chứa các text được vẽ lên canvas
        win.__canvasTexts = [];//Tao tạo sẵn một cái hộp rỗng để lát nữa hứng chữ vẽ trên canvas
        const proto = win.CanvasRenderingContext2D.prototype;//Lấy object prototype chung cho TẤT CẢ canvas 2D trên trang
        /*CanvasRenderingContext2D làclass gốc của context 2D của <canvas>
        Vì sao phải lấy prototype? =>>Để hook / override / spy các hàm canvas trước khi trang vẽ.
         */
        if (!proto?.fillText) return;
        /*Nếu proto tồn tại =>> lấy proto.fillText
        return: Nếu không có fillText để hook thì ko làm gì cả
        */

        const originalFillText = proto.fillText; // vẽ những gì hứng được ở trên (là lưu lại hàm vẽ chữ gốc của canvas để sau khi hook vẫn giữ nguyên hành vi vẽ.)

        proto.fillText = function (text, ...rest) {
          try {
            win.__canvasTexts.push(String(text));
          } catch (e) {
            // ignore
          }
          return originalFillText.call(this, text, ...rest);
        };
      },
    });

    // Đợi canvas xuất hiện (trang này có canvas)
    cy.get("canvas", { timeout: 10000 }).should("be.visible");

    // Lấy chuỗi "Answer: ...." đã bị hook lại và tách số
    cy.window()
      .its("__canvasTexts")
      .should("be.an", "array")
      .then((texts) => {
        const answerLine = texts.find((t) => /answer\s*:/i.test(t));
        expect(answerLine, "Found 'Answer: ...' drawn on canvas").to.be.a("string");

        const number = answerLine.match(/\d+/)?.[0];
        expect(number, "Extracted number").to.match(/^\d+$/);

        // log ra kết quả để kiểm tra
        cy.log(`Answer number: ${number}`);
        // nếu muốn dùng lại về sau
        cy.wrap(number).as("answerNumber");
      });

    // Ví dụ: dùng lại alias
    cy.get("@answerNumber").then((n) => {
      // assert demo (chỉ minh hoạ)
      expect(String(n)).to.have.length.greaterThan(0);
    });
  });
  it("Cách 3-Lấy data  by “hook + reload”", () => {
    /*  Hook canvas kiểu “spy” bằng cy.window(). Không sử dụng OCR
    Cách này theo dõi hành vi vẽ canvas sau khi trang đã load, 
    không can thiệp logic gốc */
    // Đặt thêm vào cypress/support/e2e.js: Cypress.on() =>>Đăng ký event listener toàn cục cho toàn bộ test
    cy.visit("https://practice.expandtesting.com/challenging-dom");
    cy.get("canvas").should("be.visible");

    cy.window().its("__canvasTexts").then((texts) => {
      const line = texts.find((t) => /answer\s*:/i.test(t));
      const number = line?.match(/\d+/)?.[0];
      expect(number).to.match(/^\d+$/);
      cy.log(`Answer number: ${number}`);
    });
  });
});
