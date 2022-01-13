describe("Chat component test suite", () => {
  beforeEach(() => {
    cy.signOutFromFirebase();
    cy.loginToTestAccount();
    cy.visit("/chat");
  });

  it("Should be logged in into test account", () => {
    cy.url().should("include", "chat");
    cy.contains("Chats");
  });
});
