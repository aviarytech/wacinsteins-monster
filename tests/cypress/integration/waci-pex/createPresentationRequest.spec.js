let fixture

describe('create a presentation request', () => {

  //cy.visit()
  // function() {} can use this (liek a class)
  before(function() {
    //because cypress takes the baseUrl and appends
    cy.fixture('newPresentation').then((val) => { fixture = val })
    cy.visit('demo-auth')
  })
  beforeEach(() => {
    cy.wait(250)
  })

  //assuming we are home
  it('use the sidebar in the desktop view to visit the presentation page', () => {
    cy.get('nav a#presentations-btn').click()
    cy.location().should((loc) => {
      expect(loc.href).to.eq(
        'https://aviary.one/presentations'
      )
    })
  })

  it('opens the new presentation request', () => {
    cy.get('#new-btn').click()
    //expect(cy.get('#slide-over-title')).to.eq('New Presentation Request')
  })

  it('select the drop down', () => {
    cy.get('select#cy-schema-hook-select').select(fixture.credentialId)
    //ez logs into the ui
    cy.log("fixture", fixture.credentialId)
    //INFO: logs in the dev tools
    //console.log('you will not see me right?')
  })
  it('select 2 fields and click the review button', () => {
    cy.contains('Batch Number').click()
    expect(cy.contains("$.credentialSubject.batchNumber")).to.exist
    cy.get("#review-btn").click()
  })


})
