/**
 * Created by Lea Weber on 08.05.2017.
 *
 * lists all cities in storage
 */
"use strict";
pl.v.retrieveAndListCities = {
  setupUserInterface: function () {
    let table = document.getElementById( "cityOutput" );
    let keys, key, i, row;

    City.retrieveAllData();

    keys = Object.keys( City.instances );

    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      row = table.insertRow( -1 ); // -1 adds row at the end of the table
      row.insertCell( -1 ).innerHTML = key;

      // check if inCountry
      let inCountryCell = row.insertCell( -1 );
      if (City.instances[key]._inCountry) {
        let inCountryArr = Object.keys(City.instances[key]._inCountry);
        let inCountryStr = "";
        for (let j = 0; j < inCountryArr.length; j += 1) {
          inCountryStr += inCountryArr[j];
          if (j !== inCountryArr.length - 1) {
            inCountryStr += ",\n";
          }
        }
        inCountryCell.innerHTML = inCountryStr;
        inCountryStr = "";
      }
    }
  }
};
