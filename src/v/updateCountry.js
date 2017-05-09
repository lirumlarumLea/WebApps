/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for updating country data
 */
"use strict";
pl.v.updateCountry = {
  setupUserInterface: function () {
    //noinspection JSLint
    const formObj = document.forms["countryUpdate"],
        //selCountry = document.getElementById( "selName" ),
        selCountry = document.getElementById( "selName" ),
        selectCode = formObj["cCode"],
        fldSetReligion = document.getElementById( "cReligions" );
    let tempReligions = JSON.parse( JSON.stringify( ReligionEL.labels ) );

    pl.c.app.retrieveAllData();
    
    util.fillSelectWithOptionsFromArr( selectCode,
        (CountryCodeEL.labels) );
    util.createChoiceWidget( fldSetReligion, "religion", [], "checkbox",
        tempReligions.splice( 1 ) );
    
    util.fillSelectWithOptions( Country.instances, selCountry, "name", "name" );
    
    
    // check fields on input
    formObj["cPopulation"].addEventListener( "input", function () {
      formObj["cPopulation"].setCustomValidity(
          Country.checkPopulation( formObj["cPopulation"].value ).message );
    } );
    formObj["cCode"].addEventListener( "input", function () {
      formObj["cCode"].setCustomValidity(
          Country.checkCode(
              parseInt( formObj["cCode"].value, 10 ) ).message );
    } );
    formObj["cPopulation"].addEventListener( "input", function () {
      formObj["cPopulation"].setCustomValidity(
          Country.checkPopulation( formObj["cPopulation"].value ).message );
    } );
    formObj["cLifeExpectancy"].addEventListener( "input", function () {
      formObj["cLifeExpectancy"].setCustomValidity(
          Country.checkLifeExpectancy(
              formObj["cLifeExpectancy"].value ).message );
    } );
    formObj["cReligions"].addEventListener( "input", function () {
      formObj["cReligions"].setCustomValidity(
          Country.checkReligions(
              formObj["cReligions"].value ).message );
    } );
    
    // neutralize the submit event
    formObj.addEventListener( "submit", function (e) {
      e.preventDefault();
    } );
    
    // after every new change of selection, form needs to change
    // -> listener needed
    selCountry.addEventListener( "change",
        pl.v.updateCountry.handleCountrySelectEvent );
    
    // save new country data
    formObj.saveBtn.addEventListener( "click",
        pl.v.updateCountry.handleSaveBtnClickEvent );
    
    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", Country.saveAllData );
  },
  
  // updates the values in the input/output fields
  handleCountrySelectEvent: function () {
    //noinspection JSLint
    const formObj = document.forms["countryUpdate"];
    const selectedName = document.getElementById( "selName" ).value;
    const country = Country.instances[selectedName];
    
    if (country) {
      document.getElementById( "cName" ).value = country.name;
      document.getElementById( "cCode" ).value =
          CountryCodeEL.labels[country.code + 1];
      document.getElementById( "cPopulation" ).value = country.population;
      document.getElementById( "cLifeExpectancy" ).value
          = country.lifeExpectancy || "";
      document.getElementById( "txtRels" ).value =
          country.religions.toString() || "";
      ["cCode", "cPopulation", "cLifeExpectancy", "cReligions"].forEach(
          function (p) {
            // delete custom validation error message which may have been set
            // before
            formObj[p].setCustomValidity( "" );
          } );
    } else {
      formObj.reset();
    }
  },
  
  // saves the possibly altered values
  handleSaveBtnClickEvent: function () {
    const slots = {};
    let userConfirmed;
    //noinspection JSLint
    const formObj = document.forms["countryUpdate"];
    
    slots.name = formObj.selectCountry.value;
    slots.code = formObj.cCode.value;
    slots.population = document.getElementById( "cPopulation" ).value;
    // lifeExpectancy see below
    
    // for religions
    let vals = formObj.cReligions.childNodes;
    let relArr = [];
    for (let i = 0; i < vals.length; i += 1) {
      if (vals[i].firstChild.checked) {
        relArr.push( parseInt( vals[i].firstChild.value, 10 ) );
      }
    }
    
    // check all newly entered values
    formObj["cName"].setCustomValidity(
        Country.checkNameAsId( slots.name ).message );
    formObj["cCode"].setCustomValidity(
        Country.checkCode( slots.code ).message );
    formObj["cPopulation"].setCustomValidity(
        Country.checkPopulation( slots.population ).message );
    // optional value
    if (formObj["cLifeExpectancy"].value) {
      slots.lifeExpectancy = formObj["cLifeExpectancy"].value;
      formObj["cLifeExpectancy"].setCustomValidity(
          Country.checkLifeExpectancy(
              slots.lifeExpectancy ).message );
    }
    if (relArr !== []) {
      slots.religions = relArr;
      formObj["cReligions"].setCustomValidity(
          Country.checkReligions(
              slots.religions ).message );
    }
    
    // confirm update with user
    let str = "New values:\n\tName: " + slots.name + "\n\tCode: "
        + CountryCodeEL.labels[slots.code] + "\n\tPopulation: "
        + slots.population;
    if (slots.lifeExpectancy) {
      str += "\n\tLife Expectancy: " + slots.lifeExpectancy;
    }
    if (slots.religions) {
      str += "\n\tReligions: " + slots.religions;
    }
    
    userConfirmed = confirm( str + "\nPlease confirm." );
    if (formObj.checkValidity() && userConfirmed) {
      Country.instances[slots.name].update( slots );
      formObj.reset();
    }
    
  }
  
};
