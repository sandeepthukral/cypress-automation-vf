# Cypress Automation Assignment for VF

## About
This is my attempt at the QA assignment for your company

## Requirements
- NodeJS

## Instructions for OsX
- Clone the repo \
`git clone https://github.com/sandeepthukral/cypress-automation-vf.git`
- Once done, move into the repo folder\
`cd cypress-automation-vf`
- Run the following command to install the requirements \
`npm install`
- Run the following command to run happy path spec only (read more about it below)\
`npm run test:happy`
- Run the following command to run all specs\
`npm run test:all`
- The report will be available in the folder `mochawesome-report`. Open it using the command \
`open mochawesome-report/mochawesome.html`

### Options
- The tests execute by default on Chrome. To run the tests on Firefox,\
`npm run test:happy -- -b 'firefox'`\
`npm run test:all -- -b 'firefox'`\
The options are `chrome`, `firefox`
(The project has been tested on OsX with Chrome and Firefox)


## Package information

### Framework used
- Cypress is the framework used because this was expressly mentioned in the assignment
- Mochawesome reports have been used for output reports

### Structure
- `cypress/integration/vf` - The spec files reside here
- `cypress/fixtures` - Fixtures for test data
- `cypress/plugins` - Plugins are defined here
- `cypress/support` - Custom commands reside here
- `cypress_test_runner.js` - Custom test runner


### Specs
- `happy_path.spec.js` - The one happy-day scenario where the user takes all standard options and creates an order.
- Other scenarios where each stage of the order flow is checked for options and assertions on the pages.

## Major issues faced

### Cookie Bar
The cookie bar would show up every time we ran the tests.

I solved it by debugging the process and identifying the cookie that is set when the accept button was checked.

### Synchronous XHR
It seems there is a synchronous XHR request that gets cancelled when navigating away from certain pages. It seems it is deprecated in Chrome and throws JS error in the console, failing the test

The solution was to launch the browser with the argument `--enable-features=AllowSyncXHRInPageDismissal`

### A/B Testing
This was the biggest ~~waste~~ spend of time for me. It took me a while to understand what was happening and how to identify when I get version A or B.\
Since I could not find a way to force one or the other version, I had to write the solution looking for the URL of the page.

I got busy writing one version and while running the test would get the other version. It meant I was less-than-productive when creating these tests.

### Pages took too much time to load
The product page was taking too long to load. Sometimes it would not even load in the 60 second page load timeout of Cypress.

The solution was to blacklist certain domains that are non-essential for the application to work. These were analytics or ad network domains. I added these to the blacklist (not all, but the worst ones) and it indeed made the tests more reliable and much faster than earlier.

### To Page-Object or not to Page-Object
I was torn between using or discarding the Page Object behaviour. I did start with it, still have some pages in ly local system, but I decided to go without them.

I realized there was not that much duplication of code. Indeed there is some on the details page, that too for the new, fancy page which splits the form into multiple 'sections'. But for this size of a project, I decided to go without them.

I instead created custom commands (could have been functions that could be imported).

### Execution in Firefox
In Firefox, the product page does not finish loading before cypress begins executing commands. Hence many tests were failing in this browser.
On Chrome, this is much more stable.
For now, it has been solved by a 1-sec sleep (dirty hack) but waiting for the elements to be enabled `(should('be.enabled')`) was not working. Some more effort is required for this wor work.

(This works on my faster machine where I was developing butnot on the slower machine where I later tested the code. I am not surprised. )

### How much to test

The scope of the assignment was not clear to me. Do I create one happy path or should I look at multiple variations a customer could choose when building their order?

In the end, I decided to create one spec with a Happy Path scenario. Here the user enters the bare minimum information, chooses no discounts, number retention or multiple addresses. This is the shortest path from selecting the phone to the Overview page.

To this, I added more specs that check for the most important items on each step of the ordering journey. In the spec files I have, in comments, also mentioned what other tests could be run. In one, I even mention where a lot of validations could be performed on a unit level rather than on UI level.

## Further, proposed improvements

### Screenshots on failure in the report
Currently, I can attach screenshots on failure to the report/assets folder with the name of the

### Executing tests in parallel
It seems easy to execute tests in parallel in Cypress, but it is suggested only to be done on a CI platform with multiple nodes and there too executing specs in serial on any given node.

### Execution on multiple viewports
A lot of people use their mobile devices or tablets to interact with websites. Using the example suggested here [https://github.com/cypress-io/cypress-documentation/issues/521#issuecomment-382498110] we can execute the tests across multiple viewports, as long as the pages are responsive and retain their selectors across viewports. The list of viewports can be moved to and later be read from a properties/fixture file.