describe("Geolocation page", () => {
  it("Click Where Am I -> mock geo -> verify City", () => {
    cy.visit("https://practice.expandtesting.com/geolocation", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
          (success) => {
            success({
              coords: {
                latitude: 21.0278,  // Hà Nội
                longitude: 105.8342,
              },
            });
          }
        );
      },
    });

    // Click nút Where Am I
    cy.get("#geoBtn").should("be.visible").click();

    // Kiểm tra City hiển thị và có giá trị
    // (Nếu trang có phần tử #city thì dùng cách này là chuẩn nhất)
    cy.get("#city")
      .should("be.visible")
      .invoke("text")
      .then((txt) => {
        expect(txt.trim(), "City text").to.not.equal("");
      });
  });
});

