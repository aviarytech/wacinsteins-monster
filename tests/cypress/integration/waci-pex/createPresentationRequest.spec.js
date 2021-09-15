describe('create a presentation request', () => {
  //cy.visit()
  before(() => {
    cy.visit('demo-auth')//.then(() => { cy.visit('https://aviary.one/presentations/') })
  })
  beforeEach(() => {
    cy.wait(2500)
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
  it('click the new button to generate a new request', () => { cy.get() })
  it('renders all the required components for this transaction', () => {
    console.log('test')
  })
})
