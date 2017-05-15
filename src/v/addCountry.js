/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for adding a country to storage
 */
"use strict";

pl.v.addCountry = {
  setupUserInterface: function () {
    const inputForm = document.forms["countryInput"],
      selectCode = inputForm["cCode"],
      selectCapital = inputForm["cCapital"],
      fldSetReligion = document.getElementById( "cReligions" ),
      tempReligions = JSON.parse( JSON.stringify( ReligionsEL.labels ) ),
      selectCities = inputForm["cCities"];

    pl.c.app.retrieveAllData();

    util.fillSelectWithOptionsFromArr( selectCode,
      (CountryCodeEL.labels), true );
    util.fillSelectWithOptionsFromArr( selectCapital,
      Object.keys( City.instances ), false );
    util.createChoiceWidget( fldSetReligion, "religion", [], "checkbox",
      tempReligions.splice( 1 ) );
    util.fillSelectWithOptionsFromArr( selectCities,
      Object.keys( City.instances ), false );

    // check fields on input
    inputForm["cName"].addEventListener( "input", function () {
      inputForm["cName"].setCustomValidity(
        Country.checkNameAsId( inputForm["cName"].value ).message );
    } );

    inputForm["cCode"].addEventListener( "input", function () {
      inputForm["cCode"].setCustomValidity(
        Country.checkCode( selectCode.value ).message );
    } );
    selectCapital.addEventListener( "input", function () {
      selectCapital.setCustomValidity(
        Country.checkCapital(
          City.instances[selectCapital.value] ).message );
    } );
    inputForm["cPopulation"].addEventListener( "input", function () {
      inputForm["cPopulation"].setCustomValidity(
        Country.checkPopulation( inputForm["cPopulation"].value ).message );
    } );
    inputForm["cLifeExpectancy"].addEventListener( "input", function () {
      inputForm["cLifeExpectancy"].setCustomValidity(
        Country.checkLifeExpectancy(
          inputForm["cLifeExpectancy"].value ).message );
    } );
    inputForm["cReligions"].addEventListener( "input", function () {
      inputForm["cReligions"].setCustomValidity(
        Country.checkReligions(
          inputForm["cReligions"].value ).message );
    } );
    inputForm["cCities"].addEventListener( "input", function () {
      inputForm["cCities"].setCustomValidity(
        Country.checkCities( inputForm["cCities"].selectedOptions ).message );
    } );

    // save new country according to current input in fields
    inputForm["saveBtn"].addEventListener( "click",
      pl.v.addCountry.handleSaveButtonClickEvent );

    // neutralize the submit event
    inputForm.addEventListener( "submit", function ( e ) {
      e.preventDefault();
    } );

    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", Country.saveAllData );

  },

  handleSaveButtonClickEvent: function () {
    const inputForm = document.forms["countryInput"],
      fldSetReligion = document.getElementById( "cReligions" );

    const slots = {
      name: inputForm["cName"].value,
      code: inputForm["cCode"].value,
      capital: City.instances[inputForm["cCapital"].value],
      population: inputForm["cPopulation"].value
      // lifeExpectancy see below
      // religions see below
    };

    let myCities = {};
    for (let el of (inputForm["cCities"].selectedOptions)) {
      myCities[el.text] = City.instances[el.text];
    }
    slots.cities =  myCities;

    let values = fldSetReligion.childNodes;
    let relArr = [], i;

    // i= 0-2 hold plain text and the legend element, checkboxes start at 3
    for (i = 3; i < values.length; i += 1) {
      if (values[i].firstChild.checked) {
        relArr.push( parseInt( values[i].firstChild.value, 10 ) );
      }
    }

    inputForm["cName"].setCustomValidity(
      Country.checkNameAsId( slots.name ).message );
    inputForm["cCode"].setCustomValidity(
      Country.checkCode( slots.code ).message );
    inputForm["cCapital"].setCustomValidity(
      Country.checkCapital( slots.capital ).message );
    inputForm["cPopulation"].setCustomValidity(
      Country.checkPopulation( slots.population ).message );
    inputForm["cCities"].setCustomValidity(
      Country.checkCities( slots.cities ).message );
    // optional value
    if (inputForm["cLifeExpectancy"].value) {
      slots.lifeExpectancy = inputForm["cLifeExpectancy"].value;
      inputForm["cLifeExpectancy"].setCustomValidity(
        Country.checkLifeExpectancy(
          slots.lifeExpectancy ).message );
    }
    if (relArr !== []) {
      slots.religions = relArr;
      inputForm["cReligions"].setCustomValidity(
        Country.checkReligions(
          slots.religions ).message );
    }


    if (inputForm.checkValidity()) {
      Country.add( slots );
      alert( "New country added:\n" +
        Country.instances[slots.name].toString() );
      inputForm.reset();
    }
  }
};