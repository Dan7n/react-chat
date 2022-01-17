describe("Testing different application routes and their safety", () => {
  it("Should not be able to access the /chat page if not logged in", () => {
    cy.logout();
    cy.visit("/chat");
    cy.url().should("not.include", "chat").should("include", "login");
  });
  it("Should not be able to access the profile page if not logged in", () => {
    cy.logout();
    cy.visit("/auth/profile");
    cy.url().should("not.include", "profile").should("include", "login");
  });

  it("Should be able to access the /chat page when logged in", () => {
    cy.login();
    cy.visit("/chat");
    cy.url().should("include", "chat");
  });
});
