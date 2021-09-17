let fixtures;

describe("WACI Presentation Exchange", () => {
  beforeEach(function () {
    fixtures = require("../fixtures/waci-pex");
    cy.log(fixtures);
  });

  it("verifier creates presentation request & invitation", () => {
    cy.visit("http://localhost:3000/demo-auth");

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-V").click().wait(500);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(1000)
      .type("Create a New Presentation Request")
      .wait(2000);

    // go to the presentations page
    cy.get("nav a#presentations-btn").click();
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });
    cy.wait(2000);

    // open new presentation
    cy.get("#new-btn").click();
    cy.wait(2000);

    cy.get("select#cy-schema-hook-select > option")
      .eq(0)
      .then((element) => cy.get("select").select(element.val()));
    cy.wait(1000);

    // select required fields and submit
    cy.contains("Family Name").click();
    expect(cy.contains("$.credentialSubject.recipient.familyName")).to.exist;
    cy.wait(1000);
    cy.contains("Given Name").click();
    cy.wait(1000);
    expect(cy.contains("$.credentialSubject.recipient.givenName")).to.exist;

    cy.get("#submit-btn").click().wait(2000);

    cy.get("#copy-btn").click();

    cy.get(".swal-text").then((text) => (fixtures.invitationUrl = text.text()));
  });

  it.only("prover accepts invitation", () => {
    cy.visit("http://localhost:3001/demo-auth/");

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-H").click().wait(500);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(1000)
      .type("Accept Invitation")
      .wait(2000);

    cy.get("nav a#presentations-btn").click().wait(2000);
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get("#accept-invitation-btn").click().wait(2000);
    cy.get(".swal-content__input")
      .type(`${fixtures.invitationUrl}`)
      .wait(500)
      .type(`{enter}`);

    cy.get(".swal-button--confirm").click().wait(500);
    cy.get(".swal-button--confirm").click();
  });
});
