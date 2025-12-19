import { LocatorsPage } from "../support/Pages/LocatorsPage";

describe("Locators page - Cypress + POM", () => {
  const page = new LocatorsPage();
  const url = "https://practice.expandtesting.com/locators";
  beforeEach(() => {
    page.visit(url);
  });

  it("01 - Verify locators (Role/Text/Label/Placeholder/Alt/Title/TestId/Class)", () => {
    // 1. getByRole: nút Contact
    page.btnContact().should("be.visible");
    // 2. getByText
    page.hotDealBanner().should("be.visible");

    // 3. getByLabel: 2 input theo label
    page.countryInput().should("be.visible");
    page.newsletterEmailInput().should("be.visible");

    // 4. getByPlaceHolder
    page.searchInput().should("be.visible");

    // 5. getByAltText
    page.userAvatarImg().should("be.visible");

    // 6. getByTitle
    page.settingsPanel().should("be.visible");

    // 7. getByTestId
    page.statusMessage().should("be.visible");
    page.userName().should("be.visible");

    // 8. Legacy class
    page.legacyTarget().should("be.visible");
  });

  it("XPath – List: đếm số <li> trong legacy list = 3", () => {
  page.legacyListItems().should("have.length", 3);
});

  it('03 - XPath table: Stock của "Headphones" = 12; Tổng stock Status=Available = 17', () => {
    // 10a: stock headphones
    page.stockOfHeadphones()
      .invoke("text")
      .then((txt) => Number(txt.trim()))
      .should("eq", 12);

    // 10b: sum stock available
    page.availableStocksCells().then(($cells) => {
      const sum = [...$cells].reduce((acc, cell) => {
        const n = Number(cell.innerText.trim());
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0);

      expect(sum).to.eq(17);
    });
  });
});
