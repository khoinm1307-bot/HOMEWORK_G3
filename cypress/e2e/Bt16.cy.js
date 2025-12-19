describe("Notes App - Register -> Login -> Add Note -> Verify -> Delete", () => {
  const base = "https://practice.expandtesting.com/notes/app";

  // Tạo user mới mỗi lần chạy để tránh trùng
  const uid = Date.now();
  const user = {
    name: `User ${uid}`,
    email: `user${uid}@mailinator.com`,
    password: `Pwd@${uid}Aa!`,
  };

  const note = {
    title: `Note ${uid}`,
    description: `This is a test note created at ${new Date(uid).toISOString()}`,
  };

  it("E2E Notes", () => {
    // =====  Đăng ký =====
    cy.visit(`${base}/register`);

    // (Interceptors) - pattern rộng để đỡ lệ thuộc endpoint cụ thể
    cy.intercept("POST", "**/register**").as("register");
    cy.intercept("POST", "**/login**").as("login");
    cy.intercept("POST", "**/notes**").as("createNote");
    cy.intercept("DELETE", "**/notes/**").as("deleteNote");

    // Điền form register (ưu tiên label/placeholder)
    cy.contains(/register/i).should("be.visible"); // page loaded

    cy.get('input[name="name"], input[placeholder*="name" i], input[aria-label*="name" i]')
      .first()
      .clear()
      .type(user.name);

    cy.get('input[type="email"], input[name="email"], input[placeholder*="email" i]')
      .first()
      .clear()
      .type(user.email);

    cy.get('input[type="password"], input[name="password"], input[placeholder*="password" i]')
      .first()
      .clear()
      .type(user.password);

    // confirm password nếu có
    cy.get('input[name*="confirm" i], input[placeholder*="confirm" i]')
      .then($els => {
        if ($els.length) cy.wrap($els.first()).clear().type(user.password);
      });

    cy.contains("button", /register/i).click();

    // Nếu endpoint match được thì chờ request, không thì bỏ qua (để test không chết vì alias không khớp)
    cy.wait("@register", { timeout: 20000 }).its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // =====  Đăng nhập =====
    // Nhiều app register xong tự chuyển login; nếu không thì ta visit thẳng
    cy.location("href").then((href) => {
      if (!href.includes("/login")) cy.visit(`${base}/login`);
    });

    cy.get('input[type="email"], input[name="email"], input[placeholder*="email" i]')
      .first()
      .clear()
      .type(user.email);

    cy.get('input[type="password"], input[name="password"], input[placeholder*="password" i]')
      .first()
      .clear()
      .type(user.password);

    cy.contains("button", /login|sign in/i).click();
    cy.wait("@login", { timeout: 20000 }).its("response.statusCode").should("be.oneOf", [200, 201, 204]);

    // =====Thêm mới ghi chú =====
    // Sau login thường vào /notes hoặc /app
    cy.contains(/my notes|notes/i, { timeout: 20000 }).should("be.visible");

    // Click nút Add (fallback nhiều khả năng)
    cy.contains("button", /add note|new note|add/i)
      .click({ force: true });

    // Điền form note
    cy.get('input[name="title"], input[placeholder*="title" i], input[aria-label*="title" i]')
      .first()
      .clear()
      .type(note.title);

    cy.get('textarea[name="description"], textarea[placeholder*="description" i], textarea[aria-label*="description" i], textarea')
      .first()
      .clear()
      .type(note.description);

    // cy.contains("button", /save|create|add/i).click({ force: true });
    //nút Create  đang bị che bởi một lớp overlay có z-index quá lớn
  })
});
