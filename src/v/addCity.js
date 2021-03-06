/**
 * Created by Lea Weber on 08.05.2017.
 *
 * View code for adding a city
 */

pl.v.addCity = {
  /**
   * necessary tasks for preparing the UI
   */
  setupUserInterface: function () {
    const inputForm = document.forms["cityInput"];

    City.retrieveAllData();

    // check field on input
    inputForm["cityName"].addEventListener( "input", function () {
      inputForm["cityName"].setCustomValidity(
        City.checkNameAsId( inputForm["cityName"].value ).message );
    } );

    inputForm["saveBtn"].addEventListener( "click", function () {
      pl.v.addCity.handleSaveBtnClickEvent();
    } );

    // neutralize the submit event
    inputForm.addEventListener( "submit", function ( e ) {
      e.preventDefault();
    } );

    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", City.saveAllData );
  },

  /**
   * handles click on save button
   */
  handleSaveBtnClickEvent: function () {
    const inputForm = document.forms["cityInput"],
      newName = inputForm["cityName"].value;

    const slots = {
      name: inputForm["cityName"].value
    };

    inputForm["cityName"].setCustomValidity(
      City.checkNameAsId( slots.name ).message );

    if (inputForm.checkValidity()) {
      City.add( slots );
      console.log("1");
      alert( "New city added:\n" +
        City.instances[slots.name].toString() );
      inputForm.reset();
    }
  }
};
