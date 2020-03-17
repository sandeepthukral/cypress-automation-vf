/// <reference types="Cypress" />

describe('Pick iPhone 11 from ', () => {

  beforeEach(() => {
    cy.disableCookieBar();
  })

  it('should select iPhone 11 in color Yellow', () => {
    // select yellow color for iphone 11
    cy.visit('shop/mobiel/telefoon/')
      .get('[data-testid="vf-product--color-selector--apple-iphone-11-64gb-yellow"]')
      .click()
      // now 'select' this phone
      .get('[data-testid="vf-product--btn-cta--apple-iphone-11-64gb"]')
      .click()
      // expect the next URL to be the phone page
      .url().should('have', 'apple-iphone-11-64gb');
  })
})