describe("My First Test", () => {
  it("Should render the landing page", () => {
    cy.visit("/");
    cy.contains("ReactChat");
  });
});
