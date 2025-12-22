describe("Form Validation page", () => {

    beforeEach(() => {

        cy.visit("https://practice.expandtesting.com/form-validation");
    });

    it("Validation Heading", () => {
        cy.get("h1")
            .should("be.visible")
            .and("have.text", "Form Validation page for Automation Testing Practice");
    });

    it("Validation Contact Name", () => {

        /*   - Nhập giá trị hợp lệ
           - Kiểm tra trạng thái hợp lệ
        ========================== */
        cy.get("input[name='ContactName']").clear().type("dodo");
        cy.get("button[type='submit']").click();

        cy.contains("Looks good!").should("be.visible");
    });
    it("Validation Contact Number", () => {
        /* =========================
                - Nhập sai / để trống
                - Assert lỗi + border
             ========================== */
        // nhập sai
        cy.get('input[name="contactnumber"]')
            .clear()
            .type("123")

        // submit để hiển thị validation
        cy.get("button[type='submit']").click();
        // assert message lỗi
        // cy.contains("Please provide your Contact number.")
        //     .should("be.visible");
        cy.get("#validationCustom05")
            .parent()
            .find(".invalid-feedback")
            .should("contain.text", "Please provide your Contact number.")
            .should("be.visible");

        // Chưa check được boder/icon-eror.  ?????????? Đã nhờ trợ giúp nhưng hông được
        /* =========================
           - Nhập đúng định dạng
           - Lỗi biến mất
        ========================== */
        cy.get('input[name="contactnumber"]')
            .clear()
            .type("012-3456789")
            .blur();
        // Check invalid-feedback ẩn ( chỉ ẩn hiện bằng CSS)
        cy.get('input[name="contactnumber"]')
            .parent()                         //lấy thẻ cha của phần tử get(div.col-md-6)
            .find(".invalid-feedback")
            .should("not.be.visible");
    });

    it("Validation PickupDate", () => {
        cy.get('input[name="pickupdate"]')
            .clear()
            .type("2025-08-17")//
            .blur();

        cy.get('input[name="pickupdate"]')
            .parent()
            .find('.invalid-feedback')
            .should('not.be.visible');
    });
    it("Validation Payment Method", () => {
        cy.get('select[name="payment"]')
            .select('card');

        cy.get('select[name="payment"]')
            .parent()
            .find('.invalid-feedback')
            .should('not.be.visible');
    });
    it("Validation Button Register_Sucuess", () => {
        /*Trường hợp nhập đầy đủ các thông tin hợp lệ*/
        // Nhập các thông tin hợp lệ
        cy.get('input[name="ContactName"]')
            .clear()
            .type('Nguyen Van A');
        cy.get('input[name="contactnumber"]')
            .clear()
            .type('012-3456789');
        cy.get('input[type="date"][name="pickupdate"]')
            .type('2025-08-12');
        // Payment Method
        cy.get('select[name="payment"]')
            .select('card');
        // Click Register
        cy.contains('button[type="submit"]', 'Register').click();
        // Check thành công hiển thị text Thankyou....
        cy.get('div[role="alert"]').contains('Thank you for validating your ticket')
    });
    it("Validation Button Register_Fail", () => {
        /*- Trường hợp Fail
        - Không chọn PaymentMethod
         */
        cy.get('input[name="ContactName"]')
            .clear()
            .type('Nguyen Van A');
        cy.get('input[name="contactnumber"]')
            .clear()
            .type('012-3456789');
        cy.get('input[type="date"][name="pickupdate"]')
            .type('2025-08-12');
        // Click Register khi form chưa hợp lệ
        cy.contains('button[type="submit"]', 'Register').click();

        // Assert: vẫn ở trang Form Validation
        cy.url().should('include', '/form-validation');

        // Assert: lỗi Payment Method vẫn hiển thị
        cy.get('select[name="payment"]')
            .parent()
            .find('.invalid-feedback')
            .should('be.visible');
    });

});    