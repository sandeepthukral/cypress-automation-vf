/// <reference types="Cypress" />

describe('test for the Loan Details Page', function() {

  beforeEach(function() {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.disableCookieBar()
    cy.fixture('testData').then((data) => {
      this.incomeDetails = data.loadDetails
    })
    cy.setStateToGegevensLeningPage()
  })

  it('should show alternatives if income is not sufficient', function() {
    // select the user to be single
    cy.get('body').then((body) => {
      if (body.find('[data-test="snake"]').length > 0){
        cy.get('#familyType').select('1')
          .get('#ilt-form-income').clear().type(this.incomeDetails.invalidInput.incomeValue)
          .get('#ilt-form-housingCosts').clear().type(this.incomeDetails.invalidInput.housingCostsValue)
        cy.get('[data-testid="FAILED"]')
      } else {
        // old style does not show an error when customer earns less than his household costs
        // thus we skip this test here
        this.skip();
      }
    })

  })

  // it('should move to next step if income is sufficient', function() {

  //   cy.get('body').then((body) => {
  //     if (body.find('[data-test="snake"]').length > 0){
  //       cy.get('#familyType').select('1')
  //         .get('#ilt-form-income').clear().type(this.incomeDetails.validInput.incomeValue)
  //         .get('#ilt-form-housingCosts').clear().type(this.incomeDetails.validInput.housingCostsValue)
  //       cy.get('[data-testid="FAILED"]').should('not.exist')
  //     } else {
  //       // old style
  //       cy.get('#loan_details_family_type').select('Single')
  //         .get('[data-testid="loan-details--housing-costs"]').clear().type(this.incomeDetails.validInput.housingCostsValue)
  //         .get('[data-testid="loan-details--income"]').clear().type(this.incomeDetails.validInput.incomeValue)
  //     }
  //     cy.contains('Volgende stap').click()
  //     cy.url().should('include', 'nummerbehoud')
  //   })
  // })
})



