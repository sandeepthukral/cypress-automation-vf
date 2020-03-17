/// <reference types="Cypress" />

describe('the shortest happy path', function() {

  beforeEach(function() {
    cy.clearLocalStorage()
    cy.disableCookieBar()
    cy.fixture('testData').then((testData) => {
      this.testData = testData
    })
  })

  it('should enter an order with the shortest path', function() {
    cy.setStateToWinkelwagenPage()
    cy.contains('Volgende stap').click()
    cy.enterAllDetailsOnGegevensPage(this.testData.user)
    cy.enterAllDetailsOnGegevensLeningPage(this.testData.loadDetails)
    // nothing to fill on the number porting page, so just click 'Next'
    cy.contains('Volgende stap').click()

    cy.url().then(function(url) {
      if (url.includes('shop')) {
        // assert the important prices
        cy.get('.js-monthly-price-details > .cart-item-price-header > .cart-item-price')
            .should('have.text', this.testData.product.monthly.totalWithoutZiggoThuis).click()
        cy.get('.js-price-once-details > .cart-item-price-header > .cart-item-price')
            .should('have.text', this.testData.product.oneoff.total).click()
        cy.get('.js-device-price-per-month').should('have.text', this.testData.product.monthly.costPhoneSubscription)
        cy.get('.js-subscription-price-per-month').should('have.text', this.testData.product.monthly.costSubscription)
        cy.get('.js-invoice-discount > .cart-item-price').should('have.text', this.testData.product.monthly.discount)
        cy.get('.js-device-once > .cart-item-price').should('have.text', this.testData.product.oneoff.oneoffDevice)
        cy.get('.js-copying-levy > .cart-item-price').should('have.text', this.testData.product.oneoff.thuisKopieHeffing)
        cy.get('.js-subscription-connection-fee-price').should('have.text', this.testData.product.oneoff.aansluitkosten)

        // assert the rest of the page, the name, the addresses, the DOB etc.
      }
    })
  })
})