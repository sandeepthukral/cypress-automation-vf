/// <reference types="Cypress" />

describe('tests for the shopping cart start page', () => {
  beforeEach(function() {
    cy.disableCookieBar()
    cy.fixture('testData').then((testData) => {
      this.product = testData.product
    })
    cy.setStateToWinkelwagenPage()
  })

  it('should display correct product and prices', function() {
    cy.get('body').then((body) => {
      if (body.find('[data-test="snake"]').length > 0){
        cy.get('[data-testid="itemHeaderVodafone"]').invoke('text').should('contain', this.product.name)
        cy.get('[data-testid="apple-iphone-11-64gb-yellow"]')
        cy.get('[data-testid="apple-iphone-11-64gb-yellow"] [data-testid="recurringCharge"]').should('have.text', this.product.monthly.costPhoneSubscription)
        cy.get('[data-testid="red61-red-2jr"] [data-testid="recurringCharge"]').should('have.text', this.product.monthly.costSubscription)
        cy.get('[data-testid="x-hawaii-copy-levy-07"] [data-testid="oneTimeCharge"]').should('have.text', this.product.monthly.costSubscription)
      } else {
        cy.get('.device .name').should('have.text', this.product.name)
        cy.get('.device-price-per-month').should('have.text', this.product.monthly.costPhoneSubscription)
        cy.get('.thuisheffing').should('have.text', this.product.oneoff.thuisKopieHeffing)
        cy.get('.subscription-price-per-month').should('have.text', this.product.monthly.costSubscription)
        cy.get('.amount').should('have.text', this.product.monthly.discount)
      }
    })
  })

  it('user should be able to add insurance', function() {
    cy.url().then(function (url) {
      if (url.includes('shop/winkelwagen')) {
        cy.get('[data-testid="cart-item--insurance-dropdown"]').click()
        cy.get('[data-testid="cart-item--insurance-dropdown--options"] #garant-bas-cat3').click()
        cy.get('.insurance-information').should('be.visible')
        cy.get('.insurance-subtotals').should('contain.text', '€ 10,50')
      } else {
        cy.get('[data-testid="INSURANCEAddOn"] label').click()
        cy.get('[data-testid="1-4300572"]').should('be.visible')
        //TODO add checks for pricing
      }
    })
  })

  it('should be able to remove the product from the shopping cart', function(){
    cy.url().then(function (url) {
      if (url.includes('shop/winkelwagen')) {
        cy.get('[data-testid="regular-cart--remove-button"]').click()
        cy.get('[data-testid="cart--empty-cart-message"]').should('be.visible')
      } else {
        cy.get('[data-testid="removeItem"]').click().click()
        cy.contains('Je hebt geen producten in je winkelwagen').should('be.visible')
      }
    })
  })
})