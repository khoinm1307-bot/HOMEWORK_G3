describe("BT16-Note.E2E", () => {
  it("Register-Login-Add Note-Verify Note-Delete Note- Verify đã xoá ", () => {
    cy.visit("https://practice.expandtesting.com/notes/app");
    //== Đặt biến===
    // const username = "testuser@mail.com";
    // const password = "Password123!";
    // const name ="Mèo Uno"
    // => Cách này chỉ chạy đăng ký được 1 lần , lần sau sẽ bị trùng
    const uid = Date.now();// Tạo ra 1 giá trị không trùng mỗi lần chạy test. Biến uid
    const user = {
      name: `User ${uid}`,
      email: `user${uid}@mailinator.com`,
      password: `Pwd@${uid}Aa!`
    };

    const note = {
      title: `Note ${uid}`,
      description: `This is a test note created at ${new Date(uid).toISOString()}`,
    };
    cy.intercept("DELETE", "/notes/api/notes/**").as("deleteNote");
    cy.intercept("GET", "/notes/**").as("getNote");
    //===Đăng ký======
    cy.get('[data-testid="open-register-view"]').click();
    cy.get('input[data-testid="register-email"]').type(user.email);
    cy.get('input[data-testid="register-name"]').type(user.name);
    cy.get('input[data-testid="register-password"]').type(user.password);
    cy.get('input[data-testid="register-confirm-password"]')
      .then($els => {//$els là jQuery collection: Lấy đúng password đã nhập ở ô Password =>> tự động nhập lại y hệt vào ô Confirm Password
        if ($els.length) cy.wrap($els.first()).clear().type(user.password);// dùng chung biến với ô passwword
      });
    cy.get('button[data-testid="register-submit"]:contains("Register")').click();
    // Check thông báo đăng ký thành công
    cy.get('div.alert-success')
      .contains('User account created successfully')
      .should('be.visible');
    // =====  Đăng nhập =====
    cy.contains('a[data-testid="login-view"]', 'Click here to Log In').click();
    cy.url().should("include", "/login");
    cy.get('input[data-testid="login-email"]').type(user.email);
    cy.get('input[data-testid="login-password"]').type(user.password);
    cy.get('button[data-testid="login-submit"]').click();

    //==== Add Note=====
    cy.get('button[data-testid="add-new-note"]').click();
    cy.get('input#title[data-testid="note-title"]').type(note.title);
    cy.get('textarea#description[data-testid="note-description"]').type(note.description);
    cy.get('button[data-testid="note-submit"]').click();
    cy.wait('@getNote', { timeout: 20000 }).its('response.statusCode').should('be.oneOf', [200, 201, 204])
    cy.get('div.card-header')
      .contains(note.title)
      .should('be.visible');

    //==== Delete Note===
    cy.get('button[data-testid="note-delete"]').click();
    cy.get('[data-testid="note-delete-confirm"]')
      .parents('.modal-content') // Check thằng cha nó xuất hiện
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="note-delete-confirm"]').click()// thì click comfirm
      })
    // cy.wait('@deleteNote', { timeout: 20000 }).its('response.statusCode').should('be.oneOf', [200, 201, 204])
    //==>> Có thể check cả Message đã xóa thành công:
    cy.wait('@deleteNote')
      .then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message)
          .to.contain('Note successfully deleted')
      })
    cy.contains(note.title).should("not.exist");

  });
});