import PresentationSchemaBuilder from '../../src/lib/SchemaBuilder.svelte'
import { mount } from 'cypress-svelte-unit-test'
it('The presentation Schema', () => {
  mount(PresentationSchemaBuilder)
  cy.contains('h2', 'Schema builder')
})
