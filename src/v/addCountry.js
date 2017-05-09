/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for adding a country to storage
 */
"use strict";

pl.v.addCountry = {
  setupUserInterface: function () {
    const inputForm = document.forms[ "countryInput" ],
      selectCode = inputForm[ "cCode" ],
      selectCapital = inputForm[ "cCapital" ],
      fldSetReligion = document.getElementById( "cReligions" ),
      tempReligions = JSON.parse( JSON.stringify( ReligionsEL.labels ) );

    pl.c.app.retrieveAllData();

    util.fillSelectWithOptionsFromArr( selectCode,
      (CountryCodeEL.labels) );
    util.fillSelectWithOptions( City.instances, selectCapital,
      "name", "name" );
    util.createChoiceWidget( fldSetReligion, "religion", [], "checkbox",
      tempReligions.splice( 1 ) );

    // check fields on input
    inputForm[ "cName" ].addEventListener( "input", function () {
      inputForm[ "cName" ].setCustomValidity(
        Country.checkNameAsId( inputForm[ "cName" ].value ).message );
    } );

    inputForm[ "cCode" ].addEventListener( "input", function () {
      inputForm[ "cCode" ].setCustomValidity(
        Country.checkCode(
          parseInt( inputForm[ "cCode" ].value, 10 ) ).message );
    } );
    selectCapital.addEventListener( "input", function () {
      selectCapital.setCustomValidity(
        Country.checkCapital(
          City.instances[selectCapital.value] ).message );
    } );
    inputForm[ "cPopulation" ].addEventListener( "input", function () {
      inputForm[ "cPopulation" ].setCustomValidity(
        Country.checkPopulation( inputForm[ "cPopulation" ].value ).message );
    } );
    inputForm[ "cLifeExpectancy" ].addEventListener( "input", function () {
      inputForm[ "cLifeExpectancy" ].setCustomValidity(
        Country.checkLifeExpectancy(
          inputForm[ "cLifeExpectancy" ].value ).message );
    } );
    inputForm[ "cReligions" ].addEventListener( "input", function () {
      inputForm[ "cReligions" ].setCustomValidity(
        Country.checkReligions(
          inputForm[ "cReligions" ].value ).message );
    } );

    // save new country according to current input in fields
    inputForm[ "saveBtn" ].addEventListener( "click",
      pl.v.addCountry.handleSaveButtonClickEvent );

    // neutralize the submit event
    inputForm.addEventListener( "submit", function ( e ) {
      e.preventDefault();
    } );

    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", Country.saveAllData );

  },

  handleSaveButtonClickEvent: function () {
    const inputForm = document.forms[ "countryInput" ],
      fldSetReligion = document.getElementById( "cReligions" );

    const slots = {
      name: inputForm[ "cName" ].value,
      code: inputForm[ "cCode" ].value,
      capital: City.instances[inputForm["cCapital"].value],
      population: inputForm[ "cPopulation" ].value
      // lifeExpectancy see below
      // religions see below
    };
    let values = fldSetReligion.childNodes;
    let relArr = [], i;

    //auf i= 0-2 sind leerer Text und legende, ab drei fangen die Checkboxen an
    for (i = 3; i < values.length; i += 1) {
      if (values[ i ].firstChild.checked) {
        relArr.push( parseInt( values[ i ].firstChild.value, 10 ) );
      }
    }

    inputForm[ "cName" ].setCustomValidity(
      Country.checkNameAsId( slots.name ).message );
    inputForm[ "cCode" ].setCustomValidity(
      Country.checkCode( slots.code ).message );
    inputForm[ "cCapital" ].setCustomValidity(
      Country.checkCapital( slots.capital ).message );
    inputForm[ "cPopulation" ].setCustomValidity(
      Country.checkPopulation( slots.population ).message );
    // optional value
    if (inputForm[ "cLifeExpectancy" ].value) {
      slots.lifeExpectancy = inputForm[ "cLifeExpectancy" ].value;
      inputForm[ "cLifeExpectancy" ].setCustomValidity(
        Country.checkLifeExpectancy(
          slots.lifeExpectancy ).message );
    }
    if (relArr !== []) {
      slots.religions = relArr;
      inputForm[ "cReligions" ].setCustomValidity(
        Country.checkReligions(
          slots.religions ).message );
    }


    if (inputForm.checkValidity()) {
      Country.add( slots );
      alert( "New country added:\n" +
        Country.instances[ slots.name ].toString() );
      inputForm.reset();
    }
  }
};