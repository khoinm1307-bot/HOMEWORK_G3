it("Spin wheel and answer correct color on first try", () => {
    cy.visit('https://practice.expandtesting.com/color-wheel');

    //  Lấy danh sách màu
    cy.get("#answers button")
        .then($buttons => {
            const colors = [...$buttons].map(b => b.innerText.trim());

            cy.log("Original colors:", colors.join(", "));

            //  Rotate array + reverse
            function rotateAndReverse(arr) {
                const rotated = [arr[arr.length - 1], ...arr.slice(0, -1)];
                return rotated.reverse();
            }

            const finalColors = rotateAndReverse(colors);
            cy.log("Processed colors:", finalColors.join(", "));

            const anglePerColor = 360 / finalColors.length;

            //  Click quay bảng màu
            cy.get("#picker").click();

            // Lấy góc rotate của canvas
            cy.get("#picker")
                .invoke("attr", "style")
                .then(style => {

                    // lấy kết quả quay rotate để tính vị trí
                    const match = style.match(/rotate\(([-\d.]+)deg\)/);
                    const rotateDeg = Math.abs(parseFloat(match[1]));

                    const normalizedDeg = rotateDeg % 360;

                    // Tính index màu trúng
                    let index = Math.floor(normalizedDeg / anglePerColor);

                    // fix edge case
                    if (index >= finalColors.length) index = 0;

                    const answerColor = finalColors[index];

                    cy.log(`Rotate: ${rotateDeg}`);
                    cy.log(`Index: ${index}`);
                    cy.log(`Answer: ${answerColor}`);

                    //  Trả lời màu
                    const normalizedAnswer = answerColor.trim().toLowerCase();

                    cy.contains("#answers button", normalizedAnswer)
                        .should("be.visible")
                    cy.log(colors);
                });
        });
});