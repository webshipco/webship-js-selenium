const { Given } = require('@cucumber/cucumber');
const { When, Before } = require('@cucumber/cucumber');
const { Then } = require('@cucumber/cucumber');

const path = require('path');
const fs = require('fs');

/**
 * Opens homepage.
 * 
 * Example: Given I am on homepage
 * Example: Given I am on the homepage
 * 
 * @Given /^I am on( the)* homepage$/
 */
Given(/^I am on( the)* homepage$/, function (url) {
  return browser.url(browser.launch_url);
});

/**
 * Opens specified page
 * Example: Given I am on "about-us.html"
 *
 */
 Given(/^I am on "([^"]*)?"$/, function (url) {
  return browser.url(browser.launch_url + url);
});

/**
 * Opens homepage
 * Example: When I go to the homepage
 * Example: And I go to "/"
 *
 */
When(/^ I go to( the)* homepage$/, function () {
  return browser.url(browser.launch_url);
});

/**
 * Opens specified page
 * Example: When I go to "contact-us.html"
 *
 */
When(/^I go to "([^"]*)?"$/, function (url) {
  return browser.url(browser.launch_url + url);
});

/**
 * Asserting a text in the page.
 * 
 * Example:
 * - Then I should see "Welcome"
 * - Then I should not see "Access denied"
 * 
 * @Then /^I should( not)* see "([^"]*)?"$/
 */
 Then(/^I should( not)* see "([^"]*)?"$/, function (negativeCase, expectedText) {
  if (negativeCase) {
    return browser.assert.not.textContains('html', expectedText);
  }

  return browser.assert.textContains('html', expectedText);
});

/**
 * Moves forward one page in history
 * Example: And I move forward one page
 *
 * @When /^I move forward one page$/
 */
 When(/^I move forward one page$/, function () {
  return browser.forward();
});
  
/**
 * Moves backward one page in history
 * Example: When I move backward one page
 *
 * @When /^I move backward one page$/
 */
When(/^I move backward one page$/, function () {
  return browser.back();
});

/**
 * Presses button with specified id|name|title|alt|value
 * Example: When I press "Log In"
 * Example: And I press "Log In"
 *
 * @When /^I press "([^"]*)?"$/
 */
When(/^I press "([^"]*)?"$/, function (elementValue) {
  return browser.click("[value='" + elementValue + "']");
});

/**
 * Clicks link with specified id|title|alt|text
 * Example: When I follow "Log In"
 * Example: And I follow "Log In"
 *
 * @When /^I follow "([^"]*)?"$/
 */
 When(/^I follow "([^"]*)?"$/, function (elementValue) {
  return browser.click("link text", elementValue);
});

/**
 * Reloads current page
 * Example: When I reload the page
 * Example: And I reload the page
 *
 */
 When(/^I reload( the)* page$/, function (url) {
  return browser.refresh(browser.getCurrentUrl());
});

/**
 * Fills in form field with specified id|name|label|value
 * Example: When I fill in "username" with "bwayne"
 *
 * @When /^I fill in "([^"]*)?" with "([^"]*)?"$/
 */
When(/^I fill in "([^"]*)?" with "([^"]*)?"$/, function (fieldLabel, value) {
  fillInputByLabel(fieldLabel, value);
});

/**
 * Fills in form field with specified id|name|label|value
 * Example: When I fill in "username" with:
 *
 * @When /^I fill in "([^"]*)?" with:$/
 */
When(/^I fill in "([^"]*)?" with:$/, function (fieldLabel) {
  fillInputByLabel(fieldLabel, '');
});

/**
 * Fills in form field with specified id|name|label|value
 * Example: And I fill in "bwayne" for "username"
 *
 * @When /^I fill in "([^"]*)?" for "([^"]*)?"$/
 */
When(/^I fill in "([^"]*)?" for "([^"]*)?"$/, function (value, fieldLabel) {
  fillInputByLabel(fieldLabel, value);
});

/**
 * Fills in form fields with provided table
 * Example: When I fill in the "([^"]*)?"following"
 *              | username | bruceWayne |
 *              | password | iLoveBats123 |
 * Example: And I fill in the following"
 *              | username | bruceWayne |
 *              | password | iLoveBats123 |
 *
 * @When /^I fill in the following:$/
 */
When(/^I fill in the following:$/, function (table) {
  var tableEle = [];
  table.rows().forEach(row => {

    var els = getElement(row[0]);
    els.value = row[1];
    tableEle.push(els);
  });
  return tableEle;
});

/**
 * Selects option in select field with specified id|name|label|value
 * Example: When I select "Bats" from "user_fears"
 * Example: And I select "Bats" from "user_fears"
 *
 * @When /^I select "([^"]*)?" from "([^"]*)?"$/
 */
When(/^I select "([^"]*)?" from "([^"]*)?"$/, function (value, fieldDefinition) {
  var els = getElement(fieldDefinition);
  for (var i = 0; i < els.options.length; i++) {
    if (els.options[i].text === value) {
      els.selectedIndex = i;
      break;
    }
  }
  return els;
});


// ****************** Functions  //
/**
 * Get Element 
 *
 * Find field with specified id|name|label|value. 
 */
 function fillInputByLabel(fieldLabel, value) {
  
  let element = null;
  browser.waitForElementVisible('label');
  browser.elements('css selector', 'label', function (elements) {
    for (let i = 0; i < elements.value.length; i++) {
      this.elementIdText(elements.value[i].ELEMENT, function (result) {
        if (result.value === fieldLabel) {
          element = elements.value[i].ELEMENT;
          browser.elementIdAttribute(element, 'for', function(eleAttribute){
            return browser.setValue('#' + eleAttribute.value, value);
          });
        }
      });
    }
  });

  //--------------------------------------------------------
  // var returnValue = '';
  // var labelElement = browser.getText('label', function(result) {
  //   this.assert.equal(typeof result, "object");
  //   this.assert.equal(result.status, 0);
  //   this.assert.equal(result.value, field);
  // });

  // labelElement.getAttribute("label", 'for',function(result){
  //   returnValue = '#' + result.value;
  //   console.log('returnValue:' + returnValue);
  //   return returnValue;

  // });


  //-----------------------------------------------------

  // var elementSelector = '#' + field;
  
  // let inputElement = browser.elementIdElements(elementSelector, 'css selector', 'input');
  // if(inputElement){
  //   return elementSelector;
  // }

  // elementSelector = '.' + field;
  // inputElement = browser.getAttribute('css selector', field, 'input');
  // if(inputElement){
  //   return elementSelector;
  // }  

  // if(browser.verify.visible('#' + field)){
  //   return '#' + field;
  // }else if(browser.verify.visible('.' + field)){
  //   return '.' + field;
  // }









  // browser.elements('css selector', 'input', function(elements){
  //   elements.value.forEach(function(eleObj){
  //     browser.elementIdValue(eleObj.ELEMENT, function(result){
  //       console.log('\n' + result.value)
  //     })
  //   })
  // });
  // resultElements.forEach(
  //   item => console.log('Element Id:', item.getId())
  //   );

  // var element;
  // var el = document.getElementById(fieldDefinition);
  // if(el != null){
  //   return  el;
  // }

  // var el = document.getElementsByName(fieldDefinition);
  // if(el.length > 0){
  //   return el[0];
  // }

  // var labels = document.getElementsByTagName('label');
  // var el;
  // for (var i = 0; i < labels.length; i++) {
  //   const lblText = labels[i].innerText.replace(":", '');
  //   const fieldKey = fieldDefinition.replace(":", '');

  //     if (lblText == fieldKey) {
  //       el = document.getElementById(labels[i].htmlFor);
  //       if(el != null){
  //         break;
  //       }
  //     }
  // }
  
  // if(el != null){
  //   if(el.length > 0){
  //       return el;
  //     }
  // }
  
  // var els = document.getElementsByTagName('input');
  // var el;

  // for (var i = 0, length = els.length; i < length; i++) {
  //     var localEl = els[i];

  //     if (localEl.value.toLowerCase() == elementValue.toLowerCase()) {
  //       el = localEl;
  //       break;
  //     }
  // }
  // if(el != null){
  //   return el.id;
  // }
}