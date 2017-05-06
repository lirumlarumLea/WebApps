/**
 * Created by Levin-Can on 06.05.2017.
 * Script for global create and delete operations
 */
/*
var pl = {
  m: {},
  v: { addCountry:{}, deleteCountry: {}, retrieveAndListData: {}, updateCountry: {}, internationalOrganisations: {}},
  c: { initialize: {}}
};*/

pl.c.app = {
  createTestData: function() {
    try {
      Country.add({
        _name: "Germany",
        _code: CountryCodeEL.DE,
        _population: 80854408,
        _lifeExpectancy: 80.57,
        _religions: [ReligionEL.CATHOLIC, ReligionEL.PROTESTANT,
          ReligionEL.MUSLIM]
      } );
  
      Country.add( {
        _name: "France", _code: CountryCodeEL.FR, _population: 66553766,
        _lifeExpectancy: 81.75,
        _religions: [ReligionEL.CATHOLIC, ReligionEL.MUSLIM]
      } );
  
      Country.add( {
        _name: "Russia", _code: CountryCodeEL.RU, _population: 142423773,
        _lifeExpectancy: 70.47,
        _religions: [ReligionEL.ORTHODOX, ReligionEL.MUSLIM]
      } );
  
      Country.add( {
        _name: "Monaco", _code: CountryCodeEL.MC, _population: 30535,
        _lifeExpectancy: 89.52,
        _religions: [ReligionEL.CATHOLIC]
      } );
      
      InternationalOrganisation.add( {
        _acronym: "UN",
        _name: "United nations",
        _members: ["Germany", "France", "Russia"]
      } );
  
      InternationalOrganisation.add( {
        _acronym: "WHO",
        _name: "World Health Organisation",
        _members: ["Germany", "France", "Russia"]
      } );
  
      InternationalOrganisation.add( {
        _acronym: "NATO",
        _name: "North Atlantic Treaty Organization",
        _members: ["Germany", "France"]
      } );
  
      Country.saveAllData();
      InternationalOrganisation.saveAllData();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  },
  clearData: function() {
    try {
      Country.instances = {};
      localStorage.setItem( "countries", "{}" );
      InternationalOrganisation.instances = {};
      localStorage.setItem( "internationalOrganisations", "{}" );
      console.log( "Database cleared." );
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  }
};