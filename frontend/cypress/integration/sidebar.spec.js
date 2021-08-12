describe("Presentation schema", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  // future test to confirm that the sidebar is rendered correctly
  // confirming the element is rendered proprely
  it("the sidebarr renders proprely", () => {
    // title of the form
    cy.get("nav").should("contain", "Messages");
  });
});
