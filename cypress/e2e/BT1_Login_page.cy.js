import { LoginPage } from "../support/Pages/Login.js";
const suite = require("../fixtures/Loginarray.json"); // Chạy data-driven ngay khi file spec  load =>> có dữ lieu suite ngaay để tạo it() bang forEarch
const loginPage1 = new LoginPage();

describe("Basic 01 - Login", () => {

   before(() => {// Chạy 1 lần trước tất cả test trong suite
    cy.fixture("Loginarray").as("suite"); // Đọc file trong fixture ( file data test)
    //tạo alias @suite, và Cypress sẽ gắn nó vào Mocha context (this.suite) khi bạn dùng function () {} trong it=> lấy dữ liệu url, cases từ fixture để chạy test “data-driven”.
  });
  suite.cases.forEach((tc) => { // Duyệt tách test case trong suite.cases =>> Mỗi tc tạo ra 1 it()

    it(`${tc.id} - ${tc.title}`, () => {

      loginPage1.visit(suite.url);// Mowr trang
      loginPage1.assertLoginPageVisible();// Check load đúng trang
      loginPage1.login(tc.username, tc.password);//truyền data login=> thực hiện login
      cy.url().should("include", tc.expected.urlIncludes); //check url sau đăng nhập
      loginPage1.assertFlashContains(tc.expected.messageContains); // check message thông báo
      if (tc.expected.logoutVisible) {
        loginPage1.el.logoutLink().should("be.visible");// Những case có "logoutVisible": true mới chạy lệnh này
      }
    });
  });
});


