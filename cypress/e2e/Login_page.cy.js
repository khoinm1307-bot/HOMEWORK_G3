import { LoginPage } from "../support/Pages/Login.js";

describe("Basic 01 - Login (data-driven array + forEach)", () => {
  const loginPage = new LoginPage();
  // Khởi tạo Object gom các thao tác UI của trang login thành hàm:visit(url);assertLoginPageVisible();login(username, password);el.logoutLink()…;
  //Lưu ý: đặt ở đầu suite giúp các test dùng chung instance này.

  before(() => {// Chạy 1 lần trước tất cả test trong suite
    cy.fixture("Loginarray").as("suite"); // Đọc file trong fixture ( file data test)
    //tạo alias @suite, và Cypress sẽ gắn nó vào Mocha context (this.suite) khi bạn dùng function () {} trong it=> lấy dữ liệu url, cases từ fixture để chạy test “data-driven”.
  });

  it(" Login page hiển thị đúng", function () {//Dùng function () {}ở trên
    loginPage.visit(this.suite.url);// Lấy url từ data-driven
    loginPage.assertLoginPageVisible(); // gọi hàm kiểm tra login load đúng
  });

  // forEach tạo test tự động từ mảng
  function buildTest(tc) { //Đây là “factory” tạo test động:truyển 1object tc (test case) vào buildTest=>Hàm sẽ tạo ra 1 it() tương ứng:
    it(`${tc.id} - ${tc.title}`, function () {
      loginPage.visit(this.suite.url);// mở trang
      loginPage.assertLoginPageVisible();// Check UI login page

      loginPage.login(tc.username, tc.password);//thực hiện login

      // Assert URL theo expected
      cy.url().should("include", tc.expected.urlIncludes);

      // Assert thông báo
      loginPage.assertFlashContains(tc.expected.messageContains);

      // Assert logout nếu case yêu cầu (case pass)
      if (tc.expected.logoutVisible) {
        loginPage.el.logoutLink().should("be.visible");
      }
    });
  }
  // Load suite rồi build test
  // Lưu ý: dùng function() để lấy this.suite từ Mocha context
 

});
const suite = require("../fixtures/Loginarray.json"); // Chạy data-driven ngay khi file spec  load =>> có dữ lieu suite ngaay để tạo it() bang forEarch
const loginPage2 = new LoginPage();

describe("Basic 01 - Login (auto cases)", () => {

  suite.cases.forEach((tc) => { // Duyệt tách test case trong suite.cases =>> Mỗi tc tạo ra 1 it()

    it(`${tc.id} - ${tc.title}`, () => {

      loginPage2.visit(suite.url);// Mowr trang
      loginPage2.assertLoginPageVisible();// Check load đúng trang
      loginPage2.login(tc.username, tc.password);//truyền data login=> thực hiện login
      cy.url().should("include", tc.expected.urlIncludes); //check url sau đăng nhập
      loginPage2.assertFlashContains(tc.expected.messageContains); // check message thông báo
      if (tc.expected.logoutVisible) {
        loginPage2.el.logoutLink().should("be.visible");// Những case có "logoutVisible": true mới chạy lệnh này
      }
    });
  });
});

