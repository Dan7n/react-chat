describe("Chat component test suite", () => {
  before(() => {
    cy.signOutFromFirebase();
    // cy.loginToTestAccount();
    cy.login();
  });

  beforeEach(() => {
    cy.visit("/chat");
  });

  it("Should be logged in into test account", () => {
    cy.url().should("include", "chat");
    cy.contains("Chats");
  });

  it("Should be able to send a text message", () => {
    cy.get("div.side-panel__single-conversation").click();
  });

  it("Should be able to record and send audio", () => {});

  it("Should be able to log out", () => {
    cy.contains("Logout").click();
    cy.url().should("not.include", "chat");
  });
});
