/// <reference types="Cypress" />

// This spec checks for the assertions on specfic fields

describe('tests for the gegevens page', () => {

  // I have decided to land on the page once and not restore the state
  // for every test. This will speed up the process still ensure
  // that the tests fail for one reason only

  // I also believe that these types of tests 'could' be written
  // on a lower level. These seem to be validate using client-side JS methods
  // which could have lower level tests, thus making these tests rather redundant.
  // Maybe 1 test of this type to see that the JS is loaded and methods are accessible

  before(function() {
    cy.disableCookieBar()
    cy.fixture('testData').then((testData) => {
      this.details = testData.user
    })
    cy.setStateToGegevensPage()
  })

  it('should validate email field', () => {
    cy.url().then(function (url) {
      if (url.includes('shop/')) {
        // old style
        cy.get('[data-testid=contracting-party--email]').type('blah').blur()
        cy.get('#msg-contracting_party_email .error-msg').should('be.visible')
      } else {
        // new style
        cy.get('#gegevens-initials').type(this.details.voorletters)
        cy.get('#gegevens-lastName').type(this.details.achternaam)
        cy.get('#gegevens-birthdate-day').type(this.details.dobDay)
        cy.get('#gegevens-birthdate-month').type(this.details.dobMonth)
        cy.get('#gegevens-birthdate-year').type(this.details.dobYear)
        cy.get('[data-testid="next-form-step-gegevens"] button[type="submit"]').click()

        // cy.url().should('have', 'persoonlijke-gegevens/contact')
        cy.get('#contact-email').should('be.enabled').clear().type('blah').blur()
        cy.contains('Vul een correct e-mailadres in')
      }
    })

  })

  it('should validate telephone field', () => {
    cy.url().then(function (url) {
      if (url.includes('shop/bestelling/gegevens')) {
        // old style
        cy.get('[data-testid=contracting-party--phone]').type('123456789').blur()
        cy.get('#msg-contracting_party_phone_1 > .error-msg')
      } else {
        cy.get('#gegevens-initials').type(this.details.voorletters)
        cy.get('#gegevens-lastName').type(this.details.achternaam)
        cy.get('#gegevens-birthdate-day').type(this.details.dobDay)
        cy.get('#gegevens-birthdate-month').type(this.details.dobMonth)
        cy.get('#gegevens-birthdate-year').type(this.details.dobYear)
        cy.get('[data-testid="next-form-step-gegevens"] button[type="submit"]').click()

        cy.url().should('have', 'persoonlijke-gegevens/contact')
        cy.get('#contact-phone1').should('be.enabled').clear().type('123456789').blur()
        cy.contains('Vul een correct (mobiel) telefoonnummer in')
      }
    })
  })

  // More tests can be added here for any field that is important
  // I would add the following but not fill them here today

  // it('should complete the correct billing address', () => {})
  // it('should validate correct IBAN account', () => {})
  // it('should validate correct document ID', () => {})

})