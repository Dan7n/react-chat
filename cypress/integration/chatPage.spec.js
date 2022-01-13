describe("Chat component test suite", () => {
  before(() => {
    cy.signOutFromFirebase();
    cy.loginToTestAccount();
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

  it.only("Should be able to record and send audio", () => {});

  it("Should be able to log out", () => {});
});
