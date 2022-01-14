/* eslint-disable jest/valid-expect */
const faker = require("@faker-js/faker");

describe("Chat component test suite", () => {
  before(() => {
    cy.signOutFromFirebase();
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
    const fakeTextMessage = faker.lorem.words();
    cy.get("div.side-panel__single-conversation").click();
    cy.get("textarea[name='chatInputField']").should("be.visible");
    cy.get("[data-cy=messagesContainer]").then(el => {
      const originalNumOfChildren = Cypress.$(el)[0].childElementCount;
      cy.get("textarea[name='chatInputField']").type(fakeTextMessage);
      cy.get("[data-cy=sendChat]").click();
      cy.get("textarea[name='chatInputField']").should("have.length", 1);
      cy.contains(fakeTextMessage);
      cy.get("[data-cy=messagesContainer]").then(updatedEl => {
        const updatedCount = Cypress.$(updatedEl)[0].childElementCount;
        cy.log(updatedCount);
        expect(updatedCount).to.be.greaterThan(originalNumOfChildren);
      });
    });
  });

  it("Should be able to record and send audio", () => {
    cy.get("div.side-panel__single-conversation").click();
    cy.get("[data-cy=attachmentHandler]").click();
    cy.contains("audio file").click();
    cy.get("[data-cy=recordIcon]").should("be.visible");

    cy.get("[data-cy=recordIcon]").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000).then(() => {
      cy.get("[data-cy=recordIcon]").click();
    });
    cy.get("[data-cy=audioRecording]").should("be.visible");
    cy.get("button[data-cy=uploadAudio]").click();
  });

  it.only("Should be able to upload an image", () => {
    cy.get("div.side-panel__single-conversation").click();
    cy.get("[data-cy=attachmentHandler]").click();
    cy.get("input[type='file']").attachFile("cute-cat.jpg");
    
  });

  it("Should be able to log out", () => {
    cy.contains("Logout").click();
    cy.url().should("not.include", "chat");
  });
});
