/**
 * Created by Lea on 19.04.2017.
 *
 * controller code for retrieving all countries from storage
 */
"use strict";

pl.v.retrieveAndListCountries = {
  setupUserInterface: function () {
    let table = document.getElementById( "countryOutput" );
    let keys, key, i, row, lECell, relCell, relStr = "", relArray, citiesCell,
      citiesStr, keyCities, j;

    pl.c.app.retrieveAllData();
    keys = Object.keys( Country.instances );

    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      // console.log( Country.instances[key].toString() );

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

        for (let j = 0; j < relArray.length; j += 1) {
          relStr += ReligionsEL.enumLitNames[relArray[j]];
          if (j !== relArray.length - 1) {
            relStr += ",\n";
          }
        }
        relCell.innerHTML = relStr;
        relStr = "";
      }


      // add all cities with their names
      citiesCell = row.insertCell( -1 );
      keyCities = Object.keys( Country.instances[key].cities );
      citiesStr = "";
      for (j = 0; j < keyCities.length; j += 1) {
        citiesStr += keyCities[j];
        if (j !== keyCities.length - 1) {
          citiesStr += ", ";
        }
      }
      citiesCell.innerHTML = citiesStr;


      // check if member of IntOgr
      let memberOfCell = row.insertCell( -1 );
      if (Country.instances[key]._memberOf) {
        let membershipsArr = Object.keys(Country.instances[key]._memberOf);
        let membershipsStr = "";
        for (let j = 0; j < membershipsArr.length; j += 1) {
          membershipsStr += membershipsArr[j];
          if (j !== membershipsArr.length - 1) {
            membershipsStr += ",\n";
          }
        }
        memberOfCell.innerHTML = membershipsStr;
        membershipsStr = "";
      }
    }
  }
};