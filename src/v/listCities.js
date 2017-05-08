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

    City.retrieveAllSaved();

    keys = Object.keys( City.instances );

    for (i = 0; i < keys.length; i += 1) {
      key = keys[ i ];
      row = table.insertRow( -1 ); // -1 adds row at the end of the table
      row.insertCell( -1 ).innerHTML = City.instances[ key ].name;
    }
  }
};
