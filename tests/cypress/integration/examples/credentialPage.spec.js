describe("Credential Page tests", () => {
  beforeEach(() => {
    cy.visit("/credentials");
  });
  
  //INFO: skipped test
  it.skip("the page renders proprely", () => {
    // title of the form
    cy.wrap(['ID','ISSUANCE DATE','ISSUER','NAME'])
      .each((heading) => {
        //BUG: can't grab the dom
        cy.get("thead")
          .should('be.visible')
          .and('match', heading)
      })
    })
})
