let fixtures;
const dev = true;

const agent1Web = dev ? "http://localhost:3000" : "https://aviary.one";
const agent1Api = dev ? "http://localhost:3100" : "https://api.aviary.one";

const agent2Web = dev ? "http://localhost:3001" : "https://aviary.id";
const agent2Api = dev ? "http://localhost:3200" : "https://api.aviary.id";

Cypress.Commands.add("clearViewport", () => {
  const runnerContainer =
    window.parent.document.getElementsByClassName("iframes-container")[0];
  runnerContainer.setAttribute(
    "style",
    "left: 0; top: 0; width: 100%; height: 100%;"
  );

  const sizeContainer =
    window.parent.document.getElementsByClassName("size-container")[0];
  sizeContainer.setAttribute("style", "");

  const sidebar =
    window.parent.document.getElementsByClassName("reporter-wrap")[0];
  sidebar.setAttribute("style", "opacity: 0");

  const header = window.parent.document.querySelector(
    ".runner.container header"
  );
  header.setAttribute("style", "opacity: 0");
});

describe("WACI Presentation Exchange", () => {
  before(() => {
    cy.clearViewport();
    cy.request("POST", `${agent1Api}/admin/drop-db`);
    cy.request("POST", `${agent2Api}/admin/drop-db`);
  });

  beforeEach(function() {
    fixtures = require("../fixtures/waci-pex");
    cy.log(fixtures);
  });

  it("Step 1 - Generate QR Code", () => {
    cy.visit(`${agent1Web}/demo-auth`);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(1000)
      .type("Step 1 - Generate QR Code")
      .wait(1000);

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-V").click().wait(500);

    // narrate
    cy.get("#search-field").click().wait(1000);

    // go to the presentations page
    cy.get("nav a#presentations-btn").click();
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });
    cy.wait(2000);

    // open new presentation
    cy.get(".new-btn").click();
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

    cy.get("#slide-over .submit-btn").click().wait(2000);

    cy.get("#slide-over .copy-btn").click();

    cy.get(".swal-text").then((text) => (fixtures.invitationUrl = text.text()));

    cy.wait(5000);
  });

  it("Step 2 - Send Message Proposing Presentation", function() {
    // setup
    let url;
    cy.request(
      "POST",
      `${agent1Api}/presentations/definitions`,
      fixtures.presentationDefinition
    ).then((response) => {
      cy.request("POST", `${agent1Api}/presentations/requests`, {
        presentationDefinitionId: response.body.id,
      }).as("presentationRequest");
    });

    cy.visit(`${agent2Web}/demo-auth`);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(300)
      .type("Step 2 - Send Message Proposing Presentation")
      .wait(1000);

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-H").click().wait(500);

    cy.get("nav a#presentations-btn").click().wait(1000);
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get(".accept-invitation-btn").click().wait(1000);
    cy.get("@presentationRequest").then((req) => {
      cy.get(".swal-content__input").type(req.body.url, { delay: 2 });
    });

    cy.get(".swal-button--confirm").click().wait(3000);
    cy.get(".swal-button--confirm").click().wait(3000);
  });

  it("Step 3 - Send Message Requesting Presentation", () => {
    // setup
    let url;
    cy.request(
      "POST",
      `${agent1Api}/presentations/definitions`,
      fixtures.presentationDefinition
    ).then((response) => {
      cy.request("POST", `${agent1Api}/presentations/requests`, {
        presentationDefinitionId: response.body.id,
      }).as("presentationRequest");

      cy.get("@presentationRequest").then((req) => {
        cy.request("POST", `${agent2Api}/presentations/acceptInvitation`, {
          url: req.body.url,
        });
      });
    });

    cy.visit(`${agent1Web}/demo-auth`);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(1000)
      .type("Step 3 - Send Message Requesting Presentation (likely automated)")
      .wait(2000);

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-V").click().wait(500);

    cy.get("nav a#presentations-btn").click().wait(2000);
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get("@presentationRequest").then((req) => {
      cy.log(req);
      cy.get(`.view-${req.body.id}-btn`).click().wait(2000);
    });

    cy.get("#presentation-detail-view .accept-btn").click().wait(1000);
  });

  it("Step 4 - Present Proof", () => {
    // setup
    let url;
    cy.request(
      "POST",
      `${agent1Api}/presentations/definitions`,
      fixtures.presentationDefinition
    ).then((response) => {
      cy.request("POST", `${agent1Api}/presentations/requests`, {
        presentationDefinitionId: response.body.id,
      })
        .as("presentationRequest")
        .then((resp) => {
          cy.request("POST", `${agent2Api}/presentations/acceptInvitation`, {
            url: resp.body.url,
          }).then((resp) => {
            cy.wait(2000);
            cy.get("@presentationRequest").then((request) => {
              cy.log(request.body.id);
              cy.request("POST", `${agent1Api}/presentations/acceptProposal`, {
                presentationRequestId: request.body.id,
              });
            });
          });
        });
    });

    cy.visit(`${agent2Web}/demo-auth`);

    // narrate
    cy.get("#search-field")
      .click()
      .wait(1000)
      .type("Step 4 - Present Proof")
      .wait(2000);

    // set roles
    cy.get("button#user-menu-button").click().wait(500);
    cy.get("#tag-H").click().wait(500);

    cy.get("nav a#presentations-btn").click().wait(2000);
    cy.location().should((loc) => {
      expect(loc.href).to.contains("presentations");
    });

    cy.get("@presentationRequest").then((req) => {
      cy.get(`.submit-${req.body.id}-btn`).click();
    });

    cy.get("select#credential > option")
      .eq(1)
      .then((element) => cy.get("select").select(element.val()));
    cy.wait(2000);

    cy.get("#slide-over .submit-btn").click();

    cy.wait(750);

    cy.get("@presentationRequest").then((req) => {
      cy.get(`.view-${req.body.id}-btn`).click();
    });
    cy.wait(5000);
  });
});
