/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for updating country data
 */
"use strict";
pl.v.updateCountry = {
  setupUserInterface: function () {
    const formObj = document.forms["countryUpdate"],
      selCountry = document.getElementById( "selName" ),
      selectCode = formObj["cCode"],
      selectCapital = formObj["cCapital"],
      fldSetReligion = document.getElementById( "cReligions" ),
      selectCities = formObj["cCities"];
    let tempReligions = JSON.parse( JSON.stringify( ReligionsEL.labels ) );

    pl.c.app.retrieveAllData();

    util.fillSelectWithOptionsFromArr( selectCode,
      (CountryCodeEL.labels), true );
    util.fillSelectWithOptions( City.instances, selectCapital,
      "name", "name" );
    util.createChoiceWidget( fldSetReligion, "religion", [], "checkbox",
      tempReligions.splice( 0 ) );
    util.fillSelectWithOptionsFromArr( selectCities,
      Object.keys( City.instances ), false );

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
    selectCapital.addEventListener( "input", function () {
      selectCapital.setCustomValidity(
        Country.checkCapital(
          City.instances[selectCapital.value] ).message );
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
      let values = formObj.cReligions.childNodes;
      let relArr = [], i;
      for (i = 5; i < values.length; i += 1) {
        if (values[i].firstChild.checked) {
          relArr.push( parseInt( values[i].firstChild.value, 10 ) );
        }
      }
      formObj["cReligions"].setCustomValidity(
        Country.checkReligions(
          relArr ).message );
    } );

    formObj["cCities"].addEventListener( "input", function () {
      let myCities = {};
      for (let el of (formObj["cCities"].selectedOptions)) {
        myCities[el.text] = City.instances[el.text];
      }
      formObj["cCities"].setCustomValidity(
        Country.checkCities( formObj["cCities"].selectedOptions ).message );
    } );

    // neutralize the submit event
    formObj.addEventListener( "submit", function ( e ) {
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


  /**
   * updates the values in the input/output fields
   */
  handleCountrySelectEvent: function () {
    const formObj = document.forms["countryUpdate"];
    const selectedName = document.getElementById( "selName" ).value;
    const country = Country.instances[selectedName];

    formObj.reset();

    if (country) {
      document.getElementById( "cName" ).value = country.name;
      document.getElementById( "cCode" ).value = country.code;
      document.getElementById( "cCapital" ).value = country.capital.name;
      document.getElementById( "cPopulation" ).value = country.population;
      document.getElementById( "cLifeExpectancy" ).value =
        country.lifeExpectancy ? country.lifeExpectancy : "";

      // for religions
      let relArr = country.religions;
      if (relArr) {
        let values = formObj.cReligions.elements, i, j;

        for (i = 0; i < relArr.length; i += 1) {
          for (j = 0; j < values.length; j += 1) {

            if (values[j].value - 1 === relArr[i]) {
              values[j].checked = true;
              break;
            }
          }
        }
      }


      util.selectMultipleValues( formObj["cCities"],
        Object.keys( country.cities ) );

      ["cCode", "cCapital", "cPopulation", "cLifeExpectancy",
        "cReligions"].forEach(
        function ( p ) {
          // delete custom validation error message which may have been set
          // before
          formObj[p].setCustomValidity( "" );
        } );
    } else {
      formObj.reset();
    }
  },

  /**
   * saves the possibly altered values
   *
   * no validation here, see comment at end of method
   */
  handleSaveBtnClickEvent: function () {
    const slots = {};
    let userConfirmed;
    const formObj = document.forms["countryUpdate"];

    slots.name = document.getElementById( "cName" ).value;
    slots.code = document.getElementById( "cCode" ).value;
    slots.capital = City.instances[formObj["cCapital"].value];
    slots.population = document.getElementById( "cPopulation" ).value;
    // optional value
    if (formObj["cLifeExpectancy"].value) {
      slots.lifeExpectancy = parseInt( formObj["cLifeExpectancy"].value, 10 );
    }

    // for religions
    let values = document.getElementById( "cReligions" ).childNodes;
    let relArr = [], i;
    for (i = 5; i < values.length; i += 1) {
      if (values[i].firstChild.checked) {
        relArr.push( parseInt( values[i].firstChild.value, 10 ) );
      }
    }
    if (relArr !== []) {
      slots.religions = relArr;
    }

    // cities
    let myCities = {};
    for (let el of (formObj["cCities"].selectedOptions)) {
      myCities[el.text] = City.instances[el.text];
    }
    slots.cities = myCities;


    // confirm update with user
    let outputStr = "New values:\n\tName: " + slots.name + "\n\tCode: " +
      CountryCodeEL.labels[slots.code] + "\n\tCapital city: " +
      slots.capital.name + "\n\tPopulation: " + slots.population;
    if (slots.lifeExpectancy) {
      outputStr += "\n\tLife Expectancy: " + slots.lifeExpectancy;
    }
    if (slots.religions) {
      outputStr += "\n\tReligions: " + slots.religions;
    }
    outputStr += "\n\tCities: " + Object.keys( slots.cities );

    userConfirmed = confirm( outputStr + "\nPlease confirm." );

    // formObj.checkValidity() cannot be used: Unique values throw errors
    // since they are already in the database during input. However, the
    // values are still tested in the update method,
    // so validity is still granted.
    if (userConfirmed) {
      console.log( "test" );
      Country.instances[slots.name].update( slots );
      formObj.reset();
    } else {
      console.log( "failed" );
    }

  }

};
