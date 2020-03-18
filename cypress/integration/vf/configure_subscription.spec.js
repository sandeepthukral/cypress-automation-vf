/// <reference types="Cypress" />

describe('iPhone product page configuration', () => {

  const URL = 'shop/mobiel/pakket/apple-iphone-11-64gb-yellow/red61-red/2-jaar/false'

  beforeEach(function () {
    cy.disableCookieBar();
    cy.fixture('testData').then((testData) => {
      this.product = testData.product
    })
    cy.visit(URL)
  })

  it('should display all prices correctly', function () {
    cy
      .get('.product-receipt__monthly .product-receipt__header h2')
      .should('have.text', this.product.monthly.totalWithoutZiggoThuis)
    cy
      .get('[data-testid="vf-product-receipt--subscription-price"]')
      .should('have.text', this.product.monthly.costSubscription)
    cy
      .get('[data-testid="vf-product-receipt--price-recurring--device-title"] span')
      .should('have.text', this.product.monthly.costPhoneSubscription)
    cy
      .get('[data-testid="vf-product-receipt--invoice-discount"] span')
      .should('have.text', this.product.monthly.discount)
    cy
      .get('.product-receipt__onetime .product-receipt__header h2')
      .should('have.text', this.product.oneoff.total)
    cy
      .get('[data-testid="vf-product-receipt--price-once--device-title"] span')
      .should('have.text', this.product.oneoff.oneoffDevice)

    cy
      .get("vf-product-credit-table div:nth-child(1) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsNormal.totalToestelkost)
    cy
      .get("vf-product-credit-table div:nth-child(2) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsNormal.eenmaligeBetaling)
    cy
      .get("vf-product-credit-table div:nth-child(3) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsNormal.kreditBedrag)
    cy
      .get("vf-product-credit-table div:nth-child(4) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsNormal.termijnBedrag)
    cy
      .get("vf-product-credit-table div:nth-child(5) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsNormal.duurOvereenkomst)
  })

  it('should get extra discount on selecting ziggo thuis', function() {
    // toggle the Ziggo Thuis toggle
    cy.get('[data-testid="regular-pdp--converged-toggle-slider"] .toggle-button').click()
    // Ziggo Thuis benefits should display
    cy.get('[data-testid="vf-product-benefits"]')
    // New prices should be displayed
    cy
      .get('.product-receipt__monthly .product-receipt__header h2')
      .should('have.text', this.product.monthly.totalWithZiggoThuis)
    cy
      .get('[data-testid="vf-product-receipt--invoice-discount"]+li span')
      .should('have.text', this.product.monthly.discountZiggoThuis)
  })

  it('should be able to select alternative payment plan', function () {
    // cy.visit(url)

    // select to pay off telephone in one off cost
    // hack to let the selector be enabled
    cy.wait(1000)
    cy.get('input[type=range]')
      .invoke('val', 27)
      .trigger('change')

    // verify that the credit information is updated accordingly
    cy
      .get("vf-product-credit-table div:nth-child(1) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsAllOneff.totalToestelkost)
    cy
      .get("vf-product-credit-table div:nth-child(2) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsAllOneff.eenmaligeBetaling)
    cy
      .get("vf-product-credit-table div:nth-child(3) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsAllOneff.kreditBedrag)
    cy
      .get("vf-product-credit-table div:nth-child(4) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsAllOneff.termijnBedrag)
    cy
      .get("vf-product-credit-table div:nth-child(5) > div.cel.row.ng-binding")
      .should("have.text", this.product.loanAmountsAllOneff.duurOvereenkomst)

    // you can extend this to verify the monthly and one-off costs as well.
  })
})