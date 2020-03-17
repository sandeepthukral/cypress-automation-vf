// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("disableCookieBar", () => {
  // This cookie, once set, disables the cookieBar and lets use test in peace
  cy.setCookie("_svs", "%7B%22c%22%3A%7B%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%7D%2C%22ct%22%3A1984185157556%7D");
})

Cypress.Commands.add('setStateToWinkelwagenPage', () => {
  cy
    .visit('shop/mobiel/pakket/apple-iphone-11-64gb-yellow/red61-red/2-jaar/false')
    .contains('Volgende stap')
    .scrollIntoView()
    .click()
  cy.get('body').then((body) => {
    // if the popup asking for new or extension, select new subscription
    if (body.find('#cucumber-selector-postpaid-device').length > 0){
      body.find('#cucumber-selector-postpaid-device').click()
      // Ensure I am on the winkelwagen page, irrespective of A/B testing
    }
  })
  cy.contains('Gegevens', {timeout: 10000})

  // my attempt to set the shopping cart using a network call
  // cy.request({
  //   url: 'https://www.vodafone.nl/rest/orders/new-with-package?is_converged=false&shop_section=consumer',
  //   method: 'POST',
  //   body: {subscription_sku: "4110639", devicerc_sku: "4701096", device_sku: "104046596", ctn: null},
  // })
  // cy.visit('shop/winkelwagen/')
})


Cypress.Commands.add('setStateToGegevensPage', () => {
  cy.setStateToWinkelwagenPage()
  cy.get('body').then((body) => {
    if (body.find('#cucumber-selector-postpaid-device').length > 0){
      cy.log('Clicking New Abonnement in popup')
      body.find('#cucumber-selector-postpaid-device').click()
    }
    cy.contains('Gegevens', {timeout: 10000})
    // Now on the winkelwagen page, click Next
    cy.url().should('have', 'winkelwagen')
    cy.contains('Volgende stap').click()
  })
})

Cypress.Commands.add('setStateToGegevensLeningPage', () => {
  cy.setStateToWinkelwagenPage()

  // Looks like I am fighting some A/B testing on this page.
  // Sometimes the page lets me extend with a specific button.
  // Sometimes it does that with a popup.
  // Here I attempt to select a new subscription.
  cy.get('body').then((body) => {
    if (body.find('#cucumber-selector-postpaid-device').length > 0){
      cy.log('Clicking New Abonnement in popup')
      body.find('#cucumber-selector-postpaid-device').click()
    }
    // Now on the winkelwagen page, click Next
    cy.wait(1000)
    cy.url().should('have', 'winkelwagen')
    cy.contains('Volgende stap').click()

    cy.wait(1000)
    cy.fixture('testData').then((testData) => {
      cy.enterAllDetailsOnGegevensPage(testData.user)
    })
  })
})


Cypress.Commands.add('enterAllDetailsOnGegevensPage', (userDetails) => {
  cy.url().then(function (url) {
    if (url.includes('shop/bestelling/gegevens')) {
      // old style
      cy.get('[data-testid="contracting-party--email"]').clear().type(userDetails.email)
      cy.get('[data-testid="contracting-party--gender-male"]').click()
      cy.get('[data-testid="contracting-party--initials"]').clear().type(userDetails.voorletters)
      cy.get('[data-testid="contracting-party--last-name"]').clear().type(userDetails.achternaam)
      cy.get('[data-testid="contracting-party--birthdate"]').clear().type(userDetails.dob)
      cy.get('[data-testid="contracting-party--phone"]').clear().type(userDetails.telefoonnummer)

      cy.get('[data-testid="contracting-party--postal-code"]').clear().type(userDetails.postcode)
      cy.get('[data-testid="contracting-party--house-number"]').clear().type(userDetails.huisnummer)

      cy.get('[data-testid="identity_identity_number"]').clear().type(userDetails.idCardNumber)
      cy.get('[data-testid="identity_identity_expiry_date"]').clear().type(userDetails.idCardExpiryDate)

      cy.get('[data-testid="payment_details_account_nr"]').clear().type(userDetails.iban)
      cy.contains('Volgende stap').click()

    } else {
      // new style
      cy.get('label[for="gender-MALE"]').click()
      cy.get('#gegevens-initials').clear().type(userDetails.voorletters)
      cy.get('#gegevens-lastName').clear().type(userDetails.achternaam)
      cy.get('#gegevens-birthdate-day').clear().type(userDetails.dobDay)
      cy.get('#gegevens-birthdate-month').clear().type(userDetails.dobMonth)
      cy.get('#gegevens-birthdate-year').clear().type(userDetails.dobYear)
      cy.get('[data-testid="next-form-step-gegevens"] button[type="submit"]').should('be.enabled').click()

      cy.url().should('have', 'persoonlijke-gegevens/contact')
      cy.get('#contact-phone1').should('be.enabled')
      cy.get('#contact-phone1').clear().type(userDetails.telefoonnummer)
      cy.get('#contact-email').clear().type(userDetails.email)
      cy.get('[data-testid="next-form-step-contact"] button[type="submit"]').should('be.enabled').click()

      cy.url().should('have', 'persoonlijke-gegevens/adres')
      cy.get('#adres-billingAddress\\.postcode').should('be.enabled')
      cy.get('#adres-billingAddress\\.postcode').clear().type(userDetails.postcode)
      cy.get('#adres-billingAddress\\.houseNumber').clear().type(userDetails.huisnummer)
      cy.get('[data-testid="billingAddress"]').should('include.text', userDetails.straat)
      cy.get('[data-testid="next-form-step-address"] button[type="submit"]').should('be.enabled').click()

      cy.url().should('have', 'persoonlijke-gegevens/identificatie')
      cy.get('#type').should('be.enabled')
      cy.get('#type').select('ID_CARD')
      cy.get('#legitimatie-documentNumber').clear().type(userDetails.idCardNumber)
      cy.get('#legitimatie-expiryDate-day').clear().type(userDetails.idCardExpiryDateDay)
      cy.get('#legitimatie-expiryDate-month').clear().type(userDetails.idCardExpiryDateMonth)
      cy.get('#legitimatie-expiryDate-year').clear().type(userDetails.idCardExpiryDateYear)
      cy.get('[data-testid="identification"] button[type="submit"]').should('be.enabled').click()

      cy.url().should('have', 'persoonlijke-gegevens/betaling')
      cy.get('[data-testid="ibanBankDigits"]').should('be.enabled')
      cy.get('[data-testid="ibanBankDigits"]').clear().type(userDetails.ibanDigits)
      cy.get('[data-testid="ibanBankCode"]').clear().type(userDetails.ibanCode)
      cy.get('[data-testid="ibanAccountNumber"]').clear().type(userDetails.ibanNumber)
      cy.contains('Volgende stap').click()
    }
  })
})


Cypress.Commands.add('enterAllDetailsOnGegevensLeningPage', (leningData) => {
  cy.get('body').then((body) => {
    if (body.find('[data-test="snake"]').length > 0){
      cy.get('#familyType').select('1')
        .get('#ilt-form-income').clear().type(leningData.validInput.incomeValue)
        .get('#ilt-form-housingCosts').clear().type(leningData.validInput.housingCostsValue)
      cy.get('[data-testid="FAILED"]').should('not.exist')
    } else {
      // old style
      cy.get('#loan_details_family_type').select('Single')
        .get('[data-testid="loan-details--housing-costs"]').clear().type(leningData.validInput.housingCostsValue)
        .get('[data-testid="loan-details--income"]').clear().type(leningData.validInput.incomeValue)
    }
    cy.contains('Volgende stap').click()
    cy.url().should('include', 'nummerbehoud')
  })
})

Cypress.Commands.add('setStateToNummerBehoudPage', () => {
  cy.setStateToWinkelwagenPage()

  // Looks like I am fighting some A/B testing on this page.
  // Sometimes the page lets me extend with a specific button.
  // Sometimes it does that with a popup.
  // Here I attempt to select a new subscription.
  cy.get('body').then((body) => {
    if (body.find('#cucumber-selector-postpaid-device').length > 0){
      cy.log('Clicking New Abonnement in popup')
      body.find('#cucumber-selector-postpaid-device').click()
    }
    // Now on the winkelwagen page, click Next
    cy.wait(1000)
    cy.url().should('have', 'winkelwagen')
    cy.contains('Volgende stap').click()

    cy.wait(1000)
    cy.fixture('testData').then((testData) => {
      cy.enterAllDetailsOnGegevensPage(testData.user)
      cy.enterAllDetailsOnGegevensLeningPage(testData.loadDetails)
    })

  })
})