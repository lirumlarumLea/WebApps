/**
 * Created by Levin-Can on 06.05.2017.
 * All-in-one Code to manage IOs
 */

"use strict";

/**********************************************
 * Use case List International Organisations
 **********************************************/

pl.v.retrieveAndListInternationalOrganisations = {
  setupUserInterface: function () {
    let table = document.getElementById( "internationalOrganisationsOutput" );
    let keys, key, i, row;
    
    Country.retrieveAllSaved();
    InternationalOrganisation.retrieveAllSaved();
    keys = Object.keys( InternationalOrganisation.instances );
    
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      row = table.insertRow( -1 ); // -1 adds row at the end of the table
      row.insertCell( -1 ).innerHTML = InternationalOrganisation.instances[key].acronym;
      row.insertCell( -1 ).innerHTML = InternationalOrganisation.instances[key].name;
      //optional values
      let memCell = row.insertCell( -1 );
      if (InternationalOrganisation.instances[key].members) {
        
        let memStr = "", memArr = InternationalOrganisation.instances[key].members;
        
        for (let i = 0; i < memArr.length; i += 1) {
          memStr += memArr[i];
          if (i !== memArr.length - 1) {
            memStr += ",\n";
          }
        }
        
        memCell.innerHTML = memStr;
      }
    }
  }
};
/**********************************************
 * Use case Create International Organisations
 **********************************************/

pl.v.addInternationalOrganisation = {
  setupUserInterface: function () {
    //noinspection JSLint
    const inputForm = document.forms["internationalOrganisationInput"],
        mulSelMembers = document.getElementById("ioSelMembers");
    
    Country.retrieveAllSaved();
    InternationalOrganisation.retrieveAllSaved();
  
    util.fillSelectWithOptions( Country.instances, mulSelMembers, "name", "name");
    
    // check fields on input
    inputForm["ioAcronym"].addEventListener( "input", function () {
      inputForm["ioAcronym"].setCustomValidity(
          InternationalOrganisation.checkAcronymAsId( inputForm["ioAcronym"].value ).message );
    } );
  
    inputForm["ioName"].addEventListener( "input", function () {
      inputForm["ioName"].setCustomValidity(
          InternationalOrganisation.checkName(
              inputForm["ioName"].value ).message );
    } );
    //Not useful, since it is impossible to select a false value
    /*inputForm["ioSelMembers"].addEventListener( "input", function () {
      inputForm["ioSelMembers"].setCustomValidity(
          InternationalOrganisation.checkMembers(
              inputForm["ioSelMembers"].value ).message );
    } );*/
    
    // save new internationalOrganisation according to current input in fields
    inputForm["saveBtn"].addEventListener( "click",
        pl.v.addInternationalOrganisation.handleSaveButtonClickEvent );
    
    // neutralize the submit event
    inputForm.addEventListener( "submit", function (e) {
      e.preventDefault();
    } );
    
    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", InternationalOrganisation.saveAllData );
    
  },
  
  handleSaveButtonClickEvent: function () {
    //noinspection JSLint
    const inputForm = document.forms["internationalOrganisationInput"],
        mulSelMembers = document.getElementById("ioSelMembers"),
        arr = [];
  
    //loop through the select element and add to array
    for ( var i = 0; i < mulSelMembers.selectedOptions.length; i+=1) {
      arr.push( mulSelMembers.selectedOptions[i].value);
    };
    
    const slots = {
      acronym: inputForm["ioAcronym"].value,
      name: inputForm["ioName"].value,
      members: arr
    };
  
    inputForm["ioAcronym"].setCustomValidity(
        InternationalOrganisation.checkAcronymAsId( slots.acronym ).message );
    inputForm["ioName"].setCustomValidity(
        InternationalOrganisation.checkName( slots.name ).message );
    if (inputForm.checkValidity()) {
      InternationalOrganisation.add( slots );
      alert( "New internationalOrganisation added:\n" +
          InternationalOrganisation.instances[slots.acronym].toString() );
      inputForm.reset();
    }
  }
};
/**********************************************
 * Use case Update International Organisation
 **********************************************/

pl.v.updateInternationalOrganisation = {
  setupUserInterface: function () {
    //noinspection JSLint
    const formObj = document.forms["internationalOrganisationUpdate"],
        //selInternationalOrganisation = document.getElementById( "selName" ),
        selInternationalOrganisation = document.getElementById( "selAcronym" ),
        mulSelMembers = document.getElementById("selMembers");
    
    InternationalOrganisation.retrieveAllSaved();
    
    util.fillSelectWithOptions( InternationalOrganisation.instances, selInternationalOrganisation, "acronym", "acronym" );
    util.fillSelectWithOptions( Country.instances, mulSelMembers, "name", "name");
    
    
    // check fields on input
    formObj["ioName"].addEventListener( "input", function () {
      formObj["ioName"].setCustomValidity(
          InternationalOrganisation.checkName( formObj["ioName"].value ).message );
    });
    formObj["ioMembers"].addEventListener( "input", function () {
      formObj["ioMembers"].setCustomValidity(
          InternationalOrganisation.checkMembers( formObj["ioMembers"].value ).message );
    });
    // neutralize the submit event
    formObj.addEventListener( "submit", function (e) {
      e.preventDefault();
    } );
    
    // after every new change of selection, form needs to change
    // -> listener needed
    selInternationalOrganisation.addEventListener( "change",
        pl.v.updateInternationalOrganisation.handleInternationalOrganisationSelectEvent );
    
    // save new internationalOrganisation data
    formObj.saveBtn.addEventListener( "click",
        pl.v.updateInternationalOrganisation.handleSaveBtnClickEvent );
    
    // save all data when window/tab is closed
    window.addEventListener( "beforeunload", InternationalOrganisation.saveAllData );
  },
  
  // updates the values in the input/output fields
  handleInternationalOrganisationSelectEvent: function () {
    //noinspection JSLint
    const formObj = document.forms["internationalOrganisationUpdate"];
    const selectedAcronym = document.getElementById( "selAcronym" ).value;
    const internationalOrganisation = InternationalOrganisation.instances[selectedAcronym];
    
    if (internationalOrganisation) {
      document.getElementById( "ioAcronym" ).value = internationalOrganisation.acronym;
      document.getElementById( "ioName" ).value = internationalOrganisation.name;
      document.getElementById( "ioMembers").value = internationalOrganisation.members;
      ["ioAcronym", "ioName", "ioMembers"].forEach(
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
    const formObj = document.forms["internationalOrganisationUpdate"];
    
    slots.acronym = formObj.selectInternationalOrganisation.value;
    slots.name = document.getElementById( "ioName" ).value;
    slots.members = document.getElementById( "ioMembers"). value;
    
    // check all newly entered values
    formObj["ioAcronym"].setCustomValidity(
        InternationalOrganisation.checkAcronymAsId( slots.acronym ).message );
    formObj["ioName"].setCustomValidity(
        InternationalOrganisation.checkName( slots.name ).message );
    formObj["ioMembers"].setCustomValidity(
        InternationalOrganisation.checkMembers( slots.members ).message );
    
    // confirm update with user
    let str = "New values:\n\tAcronym: " + slots.acronym + "\n\tName: " +
        slots.name;
    if (slots.members) {
      str += "\n\tMembers: " + slots.members;
    }
    
    userConfirmed = confirm( str + "\nPlease confirm." );
    if (formObj.checkValidity() && userConfirmed) {
      InternationalOrganisation.instances[slots.acronym].update( slots );
      formObj.reset();
    }
    
  }
};
/**********************************************
 * Use case Delete Book
 **********************************************/

pl.v.deleteInternationalOrganisation = {
  setupUserInterface: function () {
    let selInternationalOrganisation, deleteBtn, keys;
    
    selInternationalOrganisation = document.getElementById( "selectInternationalOrganisation" );
    deleteBtn = document.getElementById( "deleteBtn" );
    InternationalOrganisation.retrieveAllSaved();
    keys = Object.keys( InternationalOrganisation.instances );
    console.log( "keys[0]= " + keys );
    util.fillSelectWithOptions( InternationalOrganisation.instances, selInternationalOrganisation, "acronym", "acronym" );
    
    deleteBtn.addEventListener( "click",
        pl.v.deleteInternationalOrganisation.handleDeleteBtnClickEvent );
    
    // save all data on window/tab closed
    window.addEventListener( "beforeunload", InternationalOrganisation.saveAllData );
    
  },
  handleDeleteBtnClickEvent: function () {
    let select, valuesChecked;
    
    select = document.getElementById( "selectInternationalOrganisation" );
    
    // confirm delete with user
    valuesChecked = confirm( InternationalOrganisation.instances[select.value].toString()
        + "\nDo you wish to delete this entry?" );
    if (valuesChecked) {
      InternationalOrganisation.instances[select.value].destroy();
      select.remove( select.selectedIndex );
    }
  }
};