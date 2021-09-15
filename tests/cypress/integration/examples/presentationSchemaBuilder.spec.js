describe("Presentation schema", () => {
  beforeEach(() => {
    cy.visit("/presentations");
  });
  // confirming the element is rendered proprely
  it("the schema builder renders proprely", () => {
    // title of the form
    cy.contains("h2", "Schema builder");

    // title of the name input box
    cy.get("#cy-name").should("contain", "Name");

    // name input box
    cy.get("#cy-name-hook-input").type("Johnny").should("have.value", "Johnny");

    // title of drop down menu
    cy.get("#cy-schema").should("contain", "Schema");

    // that an error message is present if there's no schema selected
    cy.get("#cy-error-msg").should("contain", "Please select a schema");

    // the checkboxes aren't showing initially
    cy.get('[type="checkbox"]').should("not.exist");

    // the submit button is present
    cy.get('button[type="submit"]').should("exist");

    // drop down menu works
    cy.get("#cy-schema-hook-select")
      .select("Vaccine")
      .should("have.value", "Vaccine");

    // confirming that the hidden checkbox from the select are interactive
    cy.get('input[type="checkbox"]') // selects all the checkboxes
      .first()
      .check()
      .should("be.checked");
  });

  it("communicates proprely with the backend", () => {
    // setting the test
    cy.get("#cy-schema-hook-select").select("VaccinationEvent");

    cy.get('[type="checkbox"]').last().check();

    cy.get('button[type="submit"]').click();
  });
});
