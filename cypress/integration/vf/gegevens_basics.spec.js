/// <reference types="Cypress" />

// This spec checks for the sunny day scenarios

describe('tests for the gegevens page', () => {

  beforeEach(function() {
    cy.disableCookieBar()
    cy.fixture('testData').then((testData) => {
      this.details = testData.user
    })
    cy.setStateToGegevensPage()
  })

  it('should work for zakelijk clients', function() {

    // Looks like there is an A/B test in progress, so need to identify
    // which type I get here and act accordingly

    cy.url().then(function (url) {
      if (url.includes('shop/bestelling/gegevens')) {
        // old style
        cy.get('#order_business_label').click()
        cy.get('[data-testid=business_details_company_coc_number]').should('be.visible')
        cy.get('[data-testid=business_details_company_coc_number]').clear().type(this.details.zakelijk.kvkNummer)
        cy.get('[data-testid=btn-get-company-details]').click()
        cy.get('#business_details_company_name').should('have.value', this.details.zakelijk.bedrijfNaam)
      } else {
        // new style
        // first select order type business
        cy.get('label[for="orderType-true"]').click()
        // now enter the name etc. before we can reach the KvK section
        cy.get('label[for="gender-MALE"]').click()
        cy.get('#gegevens-initials').clear().type(this.details.voorletters)
        cy.get('#gegevens-lastName').clear().type(this.details.achternaam)
        cy.get('#gegevens-birthdate-day').clear().type(this.details.dobDay)
        cy.get('#gegevens-birthdate-month').clear().type(this.details.dobMonth)
        cy.get('#gegevens-birthdate-year').clear().type(this.details.dobYear)
        cy.get('[data-testid="next-form-step-gegevens"] button[type="submit"]').click()

        cy.get('[name="company.cocNumber"]',{timeout: 10000}).clear().type(this.details.zakelijk.kvkNummer)
        cy.contains('Gegevens ophalen').click()
        cy.get('[name="bedrijfsgegevens"] h5', {timeout: 10000})
        cy.get('[name="companyname"]').should('have.value', this.details.zakelijk.bedrijfNaam)
      }
    })
  })

  it('should be able to deliver at an alternative address', function() {
    cy.url().then((url) => {
      if (url.includes('shop/bestelling/gegevens')) {
        // old style
        cy.get('[data-testid=contracting-party--postal-code]').clear().type(this.details.postcode)
        cy.get('[data-testid=contracting-party--house-number]').clear().type(this.details.huisnummer)
        cy.get('#contracting_party_invoice_address_street-container > .prefilled-value')
          .should('have.text', this.details.straat)
        // now opt to deliver on another address and fill the address
        cy.get('[data-testid=delivery-address--alternative-address]').click()
        cy.get('[data-testid=alternative-delivery-address--postcode]').clear().type(this.details.postcodeDelivery)
        cy.get('[data-testid=alternative-delivery-address--house_number]').clear().type(this.details.huisnummerDelivery)
        cy.get('[data-testid=alternative-delivery-address--prefilled-street]')
          .should('have.text', this.details.straatDelivery)

      } else {
        // new style
        // first enter the name and emal etc. before we reach the address part
        cy.get('label[for="gender-MALE"]').click()
        cy.get('#gegevens-initials').clear().type(this.details.voorletters)
        cy.get('#gegevens-lastName').clear().type(this.details.achternaam)
        cy.get('#gegevens-birthdate-day').clear().type(this.details.dobDay)
        cy.get('#gegevens-birthdate-month').clear().type(this.details.dobMonth)
        cy.get('#gegevens-birthdate-year').clear().type(this.details.dobYear)
        cy.get('[data-testid="next-form-step-gegevens"] button[type="submit"]').click()

        cy.get('#contact-phone1').should('be.enabled').type(this.details.telefoonnummer)
        cy.get('#contact-email').type(this.details.email)
        cy.get('[data-testid="next-form-step-contact"] button[type="submit"]').click()

        // now we enter different billing and delivery addresses
        cy.get('#adres-billingAddress\\.postcode').should('be.enabled')
        cy.get('#adres-billingAddress\\.postcode').clear().type(this.details.postcode)
        cy.get('#adres-billingAddress\\.houseNumber').clear().type(this.details.huisnummer)
        cy.get('[data-testid="billingAddress"]').should('include.text', this.details.straat)

        cy.get('span[for="alternativeChecked"]').click()
        cy.get('#adres-deliveryAddress\\.postcode').should('be.enabled').clear().type(this.details.postcodeDelivery)
        cy.get('#adres-deliveryAddress\\.houseNumber').clear().type(this.details.huisnummerDelivery)
        cy.get('[data-testid="deliveryAddressForm"]').should('include.text', this.details.straatDelivery)
      }
    })

  })
})