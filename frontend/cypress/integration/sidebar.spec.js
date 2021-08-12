describe("Presentation schema", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  // future test to confirm that the sidebar is rendered correctly
  // confirming the element is rendered proprely
  it("the sidebar renders proprely", () => {
    // elements of the sidebar
    cy.wrap(['Credentials','Presentation','Messages','Connections'])
      .each((msg) => {
        cy.get("nav").should("contain", msg);
      })
  });
  console.log('plugin works')
  it.skip('the sidebar directs you to the right page', () => {
    cy.wrap(['Credentials','Presentation','Messages','Connections'])
      .each((msg) => {
        console.log(msg)
        cy.get(`nav > a[href=${msg.toLowerCase()}]`)
          .then((href) => {
            cy.visit(href)
            cy.url().should("include", `/${msg.toLowerCase()}`)
           })
      }) 
  })
});
