describe("Navigation", () => {
  it("should navigate to Tuesday", () => {
    cy.visit("/");

    cy.contains("[data-testid=DayListItemID]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});
