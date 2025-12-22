describe("Drag and Drop", () => {

  it("Kéo 3 hình tròn vào target theo thứ tự Đỏ - Xanh Lam - Xanh Lá", () => {

    cy.visit("https://practice.expandtesting.com/drag-and-drop-circles"); 

    const order = [".red", ".blue", ".green"];

    for (let i = 0; i < order.length; i++) {

      cy.get(order[i], { timeout: 10000 }).then($item => {

        const dataTransfer = new DataTransfer();

        cy.wrap($item).trigger("dragstart", { dataTransfer });

        cy.get("#target")
          .trigger("dragover", { dataTransfer })
          .trigger("drop", { dataTransfer });

      });
    }
  });
   });