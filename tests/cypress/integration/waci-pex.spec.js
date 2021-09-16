let fixtures;

describe("WACI Presentation Exchange", () => {
  beforeEach(function () {
    fixtures = require("../fixtures/waci-pex");
    cy.log(fixtures);
  });

  it("verifier creates presentation request & invitation", () => {
    cy.visit("http://localhost:3000/demo-auth");
    cy.visit("http://localhost:3000/");

    cy.get("nav a#presentations-btn").click();
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get("#new-btn").click();

    cy.get("select#cy-schema-hook-select").select(fixtures.credentialId);
    cy.log("fixture", fixtures.credentialId);

    // select required fields and submit
    cy.contains("Family Name").click();
    expect(cy.contains("$.credentialSubject.recipient.familyName")).to.exist;
    cy.contains("Given Name").click();
    expect(cy.contains("$.credentialSubject.recipient.givenName")).to.exist;
    cy.wait(2000);

    cy.get("#submit-btn").click();
    cy.get("#copy-btn").click();

    cy.get(".swal-text").then((text) => (fixtures.invitationUrl = text.text()));
  });

  it.only("prover accepts invitation", () => {
    cy.visit("http://localhost:3001/demo-auth/");
    cy.visit("http://localhost:3001/");

    cy.get("nav a#presentations-btn").click();
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get("#accept-invitation-btn").click();
    cy.get(".swal-content__input").type(`${fixtures.invitationUrl}{enter}`, {
      delay: 0,
    });
    // .then(() => {
    //   cy.get(".swal-button.swal-button--confirm").click();
    // });
  });
});
