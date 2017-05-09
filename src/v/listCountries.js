/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for retrieving all countries from storage
 */
"use strict";

pl.v.retrieveAndListCountries = {
  setupUserInterface: function () {
    let table = document.getElementById( "countryOutput" );
    let keys, key, i, row, lECell, relCell, relStr = "", relArray;

    pl.c.app.retrieveAllData();
    keys = Object.keys( Country.instances );
    
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      console.log(Country.instances[key].toString());

      row = table.insertRow( -1 ); // -1 adds row at the end of the table
      row.insertCell( -1 ).innerHTML = Country.instances[key].name;
      row.insertCell( -1 ).innerHTML = CountryCodeEL.enumLitNames[
        Country.instances[key].code];
      row.insertCell( -1 ).innerHTML = Country.instances[key].capital.name;
      row.insertCell( -1 ).innerHTML = Country.instances[key].population;
      lECell = row.insertCell( -1 );
      //optional value
      if (Country.instances[key].lifeExpectancy) {
        lECell.innerHTML =
            Country.instances[key].lifeExpectancy;
      }
      //optional values
      relCell = row.insertCell( -1 );

      if (Country.instances[key].religions) {
        
        relArray = Country.instances[key].religions;

        console.log("religions: " + relArray);
        for (let i = 0; i < relArray.length; i += 1) {
          relStr += ReligionsEL.enumLitNames[relArray[i]];
          if (i !== relArray.length - 1) {
            relStr += ",\n";
          }
        }
        console.log(relStr);
        relCell.innerHTML = relStr;
        relStr = "";
      }
    }
  }
};