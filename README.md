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
`npm run test:hapy`
- Run the following command to run all specs\
`npm run test:all`
- The report will be available in the folder `mochawesome-report`. Open it using the command \
`open mochawesome-report/mochawesome.html`

### Options
- The tests execute by default on Chrome. In order to run the tests on Firefox,\
`npm test -- -b 'firefox'`\
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
The product page was taking too long to laod. Sometimes it would not even load int eh 60 second page load timeout of Cypress.

The solution was to blacklist ertain domains that are non-essential for the applciaiton to work. These were analytics or ad network domains. I added these to the blacklist (not all, but the worst ones) and it indeed made the tests more reliable and much faster then earlier.

### To Page-Object or not to Page-Object
I was torn between using or discarding the Page Object behaviour. I did start with it, still have some pages in ly local system, but I decided to go without them.

I realized there was not that much duplication of code. Indeed there is some on the details page, that too for the new, fancy page which splits the form into multiple 'sections'. But for this size of a project, I decided to go without them.

I instead created custom commands (could have been functions that could be imported).

### How much to test

The scope of the assignment was not clear to me. Do I create one happy path or should I look at multiple variations a customer could choose when building their order?

In the end, I decided to create one spec with a Happy Path scenario. Here the user enters the bare minimum information, chooses no discounts, number retention or multiple addresses. This is the shortest path from selecting the phone to the Overview page.

To this, I added more specs that check for the most important items on each step of the ordering journey. In the spec files I have, in comments, also mentioned what other tests could be run. In one, I even mention where a lot of validations could be performed on a unit level rather than on UI level.

## Further, proposed improvements

### Screenshots on failure in the report
Currently, I can attach screenshots on failure to the report/assets folder with the name of the

### Executing tests in parallel
It is easy to execute tests in parallel in Cypress, but I have not yet attempted to do that in this project.

### Execution in Firefox
The initial addition of the product to the shopping cart is not yet stable on Firefox. It seems Cypress clicks on the cutton even before it is really available to be clicked.
On Chrome this is much more stabe.
For now, it has been solved by a 1 sec sleep (dirty hack) but waiting for it to be enabled was not working. Some more effort is required for this wor work.