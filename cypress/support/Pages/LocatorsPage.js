export class LocatorsPage {
  visit(url) {
    cy.visit(url);
  }

  // 1. getByRole
  //Thay bằng câu này vì button hay bị che
  // btnContact() {
  //   return cy.findAllByRole("link", { name: /contact/i })
  //     .filter(":visible")
  //     .first()
  //     .should("be.visible");
  // }
  btnContact() {
    return cy.findByRole("link", { name: "Contact" });
  }

  // 2. getByText
  //  hotDealBanner() {// cách này để ko dính hidden
  //   return cy.findAllByText("Hot Deal: Buy 1 Get 1 Free")
  //     .filter(":visible")
  //     .first();
  // }
  hotDealBanner() {
    return cy.findByText(/hot deal/i);
  }

  // 3. getByLabel
  countryInput() {
    return cy.findByLabelText("Choose a country");
  }
  newsletterEmailInput() {
    return cy.findByLabelText("Email for newsletter");
  }

  // 4. getByPlaceHolder
  searchInput() {
    return cy.findByPlaceholderText("Search the site");
  }

  // 5. getByAltText
  userAvatarImg() {
    return cy.findByAltText("User avatar");
  }

  // 6. getByTitle
  settingsPanel() {
    return cy.findByTitle("Settings panel");
  }

  // 7. getByTestId
  statusMessage() {
    return cy.findByTestId("status-message");
  }
  userName() {
    return cy.findByTestId("user-name");
  }

  // 8. Legacy class
  // legacyTarget() {
  //   return cy.get(".legacy-target");
  // }
  legacyTarget() {
    return cy.get(".legacy-css").scrollIntoView();
  }

  // 9. XPath – List: đếm <li> trong #tasks
  legacyListItems() {
    return cy.xpath("//ul[contains(@class,'legacy-list')]/li");
  }

  // 10a. XPath - Table: lấy Stock của “Headphones”
  stockOfHeadphones() {
    // chỉnh XPath nếu table của bạn khác cấu trúc
    return cy.xpath(
      '//table//tr[td[normalize-space()="Headphones"]]/td[contains(@class,"stock") or position()=3]'
    );
  }

  // 10b. XPath - Table: tổng stock của các dòng Status = "Available"
  availableStocksCells() {
    // giả sử mỗi row có 1 cột Status và 1 cột Stock
    return cy.xpath(
      '//table//tr[td[normalize-space()="Available"]]/td[contains(@class,"stock") or position()=3]'
    );
  }
}
