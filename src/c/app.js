/**
 * Created by Levin-Can on 06.05.2017.
 * Script for global create and delete operations
 */
    "use strict";
/*
 var pl = {
 m: {},
 v: { addCountry:{}, deleteCountry: {}, retrieveAndListCountries: {},
 updateCountry: {}, internationalOrganisations: {}},
 c: { initialize: {}}
 };*/

pl.c.app = {
  createTestData: function () {

    City.createTestData();
    Country.createTestData();
    InternationalOrganisation.createTestData();
  },

  saveAllData: function () {

    Country.saveAllData();
    City.saveAllData();
    InternationalOrganisation.saveAllData();
  },

  retrieveAllData: function () {

    City.retrieveAllData();
    Country.retrieveAllData();
    InternationalOrganisation.retrieveAllData();

    },

  clearData: function () {
    try {

      InternationalOrganisation.clearAllData();
      Country.clearAllData();
      City.clearAllData();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }
  }
};