/**
 * Created by Lea Weber on 08.05.2017.
 *
 * handles deletion of a city instance via UI
 */
pl.v.deleteCity = {
  /**
   * prepare UI for usage
   */
  setupUserInterface: function () {
    let selCity, deleteBtn;

    selCity = document.getElementById( "selectCity" );
    deleteBtn = document.getElementById( "deleteBtn" );

    pl.c.app.retrieveAllData();
    util.fillSelectWithOptions( City.instances, selCity, "name", "name" );

    deleteBtn.addEventListener( "click",
      pl.v.deleteCity.handleDeleteBtnClickEvent );

    // save all data on window/tab closed
    window.addEventListener( "beforeunload", City.saveAllData );
  },

  /**
   * handle click on delete button
   */
  handleDeleteBtnClickEvent: function () {
    let select, valuesChecked;

    select = document.getElementById( "selectCity" );

    // confirm delete with user
    valuesChecked = confirm( City.instances[select.value].toString() +
      "\nDo you wish to delete this entry?" );
    if (valuesChecked) {
      City.instances[select.value].destroy();
      select.remove( select.selectedIndex );
    }
  }
};