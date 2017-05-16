/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for deleting a country from storage
 */
"use strict";
pl.v.deleteCountry = {
  setupUserInterface: function () {
    let selCountry, deleteBtn;

    selCountry = document.getElementById( "selectCountry" );
    deleteBtn = document.getElementById( "deleteBtn" );
    pl.c.app.retrieveAllData();
    util.fillSelectWithOptions( Country.instances, selCountry, "name", "name" );

    deleteBtn.addEventListener( "click",
      pl.v.deleteCountry.handleDeleteBtnClickEvent );

    // save all data on window/tab closed
    window.addEventListener( "beforeunload", pl.c.app.saveAllData );

  },
  handleDeleteBtnClickEvent: function () {
    let select, valuesChecked;

    select = document.getElementById( "selectCountry" );

    // confirm delete with user
    valuesChecked = confirm( Country.instances[select.value].toString() +
      "\nDo you wish to delete this entry?" );
    if (valuesChecked) {
      Country.instances[select.value].destroy();
      select.remove( select.selectedIndex );
    }
  }
};