const { firebaseApp } = require("./../../src/firebase-config");
const { getAuth, signOut } = require("firebase/auth");

//**************************************************** Custom Command to log out of firebase when needed
Cypress.Commands.add("signOutFromFirebase", async () => {
  const auth = getAuth(firebaseApp);
  await signOut(auth);
});

Cypress.Commands.add("loginToTestAccount", () => {
  const testAccEmail = Cypress.env("email");
  const testAccPassword = Cypress.env("password");
  cy.visit("auth/login");
  cy.get("input[name='email']").type(testAccEmail);
  cy.contains("Continue").click();
  cy.contains("Email adress found");
  cy.get("input[name='password']").type(testAccPassword);
  cy.contains("Continue").click();
  cy.url().should("include", "/chat");
});
