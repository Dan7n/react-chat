describe("My First Test", () => {
  it("Should render the landing page", () => {
    cy.visit("/");
    cy.contains("ReactChat");
  });
  it.only("Should redirect to /auth/login page if not already logged in from previous session", () => {
    cy.logout();
    cy.visit("/");
    cy.get("[data-cy='landingPageRedirect']").as("redirectBtn").click();
    cy.url().should("not.include", "chat").should("include", "login");
  });
  it("Should redirect to /chat page if already logged in from previous session", () => {
    const correctEmail = Cypress.env("email");
    cy.login();
    cy.visit("/");
    cy.contains(`Logged in as ${correctEmail}`);
    cy.get("[data-cy='landingPageRedirect']").as("redirectBtn").click();
    cy.url().should("include", "chat");
  });
});
