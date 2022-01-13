const faker = require("@faker-js/faker");

describe("Sign up and login page", () => {
  beforeEach(() => {
    cy.signOutFromFirebase();
    cy.clearCookies();
    cy.visit("/auth/login");
  });
  it("Should render login page", () => {
    cy.contains("email adress?");
  });
  it("Should be able to create an account if an accout does not already exist", () => {
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();
    const randomName = faker.name.findName();
    const randomPhoneNumber = faker.phone.phoneNumberFormat();

    cy.get("input[name='email']").type(randomEmail);
    cy.contains("Continue").click();
    //At this point a query is made to cloud firestore to check if the account already exists
    cy.contains("Let's go ahead and create an account for you");
    cy.get("input[name='password']").type(randomPassword);
    cy.contains("Continue").click();
    cy.contains("Thank you for signing up to ReactChat");

    //When the account is created, the user should be redirected to the profile page
    cy.url().should("include", "profile");

    //Change avatar image
    cy.get("img[alt='Profile avatar']")
      .invoke("attr", "src")
      .then(initialSrc => {
        cy.get(".image-overlay").click();
        cy.get("img[alt='Profile avatar']").invoke("attr", "src").should("not.equal", initialSrc);
      });

    cy.get("input[name='displayName']").type(randomName);
    cy.contains("Submit").click();
    cy.contains("Please make sure both form fields are correctly filled");

    cy.get("input[name='phoneNumber']").type(randomPhoneNumber);
    cy.contains("Submit").click();
    cy.url().should("include", "chat");
  });

  it("Should not be able to user a weak password", () => {
    const randomEmail = faker.internet.email();
    const weakPassword = "password";
    cy.get("input[name='email']").type(randomEmail);
    cy.contains("Continue").click();
    cy.contains("Let's go ahead and create an account for you");
    cy.get("input[name='password']").type(weakPassword);
    cy.contains("At least 8 chars, including one number");
    cy.contains("Continue").should("be.disabled");
  });
  it("Should not be able to login with fake login information", () => {
    const correctEmail = Cypress.env("email");
    const fakePassword = faker.internet.password();
    cy.get("input[name='email']").type(correctEmail);
    cy.contains("Continue").click();
    cy.contains("Email adress found");
    cy.get("input[name='password']").type(fakePassword);
    cy.contains("Continue").click();
    cy.contains("the password you entered was incorrect");
  });

  it("Should be able to login with correct login information", () => {
    const correctEmail = Cypress.env("email");
    const correctPassword = Cypress.env("password");
    cy.get("input[name='email']").type(correctEmail);
    cy.contains("Continue").click();
    cy.contains("Email adress found");
    cy.get("input[name='password']").type(correctPassword);
    cy.contains("Continue").click();
    cy.url().should("include", "/chat");
  });
});
