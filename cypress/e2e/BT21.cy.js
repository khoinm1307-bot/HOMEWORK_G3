describe("Geolocation page", () => {
    it.only("BT-21.Click Where Am I -> mock geo -> verify City", () => {
        Cypress.automation('remote:debugger:protocol', {
            command: 'Emulation.setGeolocationOverride',
            params: {
                latitude: 21.0278,
                longitude: 105.8342,
                accuracy: 100
            }
        });
        cy.visit("https://practice.expandtesting.com/geolocation");

        // Click nút Where Am I
        cy.get("#geoBtn").should("be.visible").click();

        // Kiểm tra City hiển thị và có giá trị
        // (Nếu trang có phần tử #city thì dùng cách này là chuẩn nhất)
        cy.get('[data-testid="lat-value"]').invoke('text')
            .then(lat => {
                return cy.get('[data-testid="lon-value"]').invoke('text')
                    .then(lon => ({
                        lat: parseFloat(lat),
                        lon: parseFloat(lon)
                    }));
            })
            .then(({ lat, lon }) => {
                cy.log(`Lat: ${lat}`);
                cy.log(`Lon: ${lon}`);
            });
    });
});