/// <reference types="Cypress" />

describe('', function() {

  beforeEach(function() {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.disableCookieBar()
    cy.fixture('testData').then((testData) => {
      this.details = testData.user
    })
    cy.setStateToNummerBehoudPage()
  })

  it('should show options to port number in', function() {
    cy.url().then(function(url) {
      if (url.includes('shop')) {
        cy.get('.js-customer-requests-porting-true-label').click()
        cy.get('[data-testid=number-porting--input--phone-number]').should('be.visible')
        cy.get('[data-testid=number-porting--button--send-sms-code]').should('be.visible')
        cy.get('[data-testid=number-porting--input--pass-code]').should('be.visible')
      } else {
        cy.get('label[for="porting-1-true"]').click()
        cy.get('[data-test=nummerportering-msisdn]').should('be.visible')
        cy.get('[data-test=nummerportering-button-sendsms]').should('be.disabled')
        // this test can be extended further
        // enter the test data user mobile number
        // verify that the porting-button-sendsms button is enabled
        // click that button
        // then the field to enter a code (that is sent to the phone) is visible and enabled
      }
    })
  })
})