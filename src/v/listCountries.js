/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for retrieving all countries from storage
 */
"use strict";

pl.v.retrieveAndListCountries = {
  setupUserInterface: function () {
    let table = document.getElementById( "countryOutput" );
    let keys, key, i, row;

    pl.c.app.retrieveAllData();
    keys = Object.keys( Country.instances );
    
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      row = table.insertRow( -1 ); // -1 adds row at the end of the table
      row.insertCell( -1 ).innerHTML = Country.instances[key].name;
      row.insertCell( -1 ).innerHTML = Country.instances[key].code;
      row.insertCell( -1 ).innerHTML = Country.instances[key].capital.name;
      row.insertCell( -1 ).innerHTML = Country.instances[key].population;
      let lECell = row.insertCell( -1 );
      //optional value
      if (Country.instances[key].lifeExpectancy) {
        lECell.innerHTML =
            Country.instances[key].lifeExpectancy;
      }
      //optional values
      let relCell = row.insertCell( -1 );
      if (Country.instances[key].religions) {
        
        let relStr = "", relArr = Country.instances[key].religions;
        
        for (let i = 0; i < relArr.length; i += 1) {
          relStr += ReligionEL.labels[relArr[i]];
          if (i !== relArr.length - 1) {
            relStr += ",\n";
          }
        }
        
        relCell.innerHTML = relStr;
      }
    }
  }
};