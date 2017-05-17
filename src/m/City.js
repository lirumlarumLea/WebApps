/**
 * Created by Lea Weber on 08.05.2017.
 *
 * class for city objects and their data management methods
 */
"use strict";


class City {

  /** ##########################################################################
   *  CONSTRUCTOR, SET/GET, CHECKS
   *  ##########################################################################
   */

  constructor( slots ) {
    if (arguments.length === 0) {
      // first, assign default values
      this.name = "n.a."; // [1], NonEmptyString{id}
      this._inCountry = {};

    } else {

      // if arguments were passed, set properties accordingly
      //try {
      this.name = slots._name ? slots._name : slots.name;
      this._inCountry = {};

      // semi-hidden since it's a derived property
      if (slots._inCountry) {
        this._inCountry = slots._inCountry;
      }
    }
  }

  set name( newName ) {
    const validationResult = City.checkNameAsId( newName );

    if (validationResult instanceof NoConstraintViolation) {
      this._name = newName; // only valid values should enter the database
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get name() {
    return this._name;
  }

  static checkName( newName ) {
    if (newName) {
      if (!util.isNonEmptyString( newName )) {
        return new RangeConstraintViolation( "A city's name must be a" +
          " non-empty string.", newName );
      }
    }
    return new NoConstraintViolation( newName );
  }

  static checkNameAsId( newName ) {
    let constraintViolation = City.checkName( newName );

    // continue testing only if previous test successful
    if (constraintViolation instanceof NoConstraintViolation) {
      if (!newName) {
        constraintViolation = new MandatoryValueConstraintViolation(
          "A city always needs to have a name.", newName );
      } else if (City.instances[newName]) {
        constraintViolation = new UniquenessConstraintViolation( "A city's" +
          " name has to be unique.", newName );
      }
    }
    return constraintViolation;
  }

  /**
   *
   * @param {String} newName - the id of a city
   * @returns {Object}
   */
  static checkNameAsRefId( newName ) {
    if (!City.instances[newName]) {
      return new ReferentialIntegrityConstraintViolation(
        "The city name you entered is unknown.", newName );
    }
    return new NoConstraintViolation( newName );
  }

  toString() {
    return ("City: " + this.name);
  }

  equals( anotherCity ) {
    return this.name === anotherCity.name;
  }

  /** ##########################################################################
   * DATA MGMT
   * ###########################################################################
   */

  /**
   * adds city to local storage
   * @param slots
   */
  static add( slots ) {
    let tempCity;

    try {
      tempCity = new City( slots );
    } catch (e) {
      tempCity = null;
      console.log( e.constructor.name + ": " + e.message );
    }

    if (tempCity) {
      City.instances[tempCity.name] = tempCity;
      console.log( "City " + tempCity.name + " added to" +
        " database." );
    } else {
      console.log( "Error when creating city." );
    }
  }

  /** no update method, since city currently only has id attribute and ids
   * shouldn't change value
   */

  /**
   * retrieves all cities from storage
   */
  static retrieveAllData() {
    console.log( "City data retrieval entered." );

    let allCitiesString = "{}", allCities, keys, i, slots;
    try {
      // if (localStorage.getItem( "cities" ) !== "{}") {
      allCitiesString = localStorage.getItem( "cities" );

      // }
    } catch (e) {
      console.log( "Error when retrieving city data from LocalStorage:\n" +
        e.message );
    }

    allCities = JSON.parse( allCitiesString );

    if (allCities) {
      keys = Object.keys( allCities );

      // creates new city objects according to the data and adds them to the
      // instances collection
      for (i = 0; i < keys.length; i += 1) {
        slots = City.convertRecToSlots( allCities[keys[i]] );
        City.add( slots );
      }
    } else {
      console.log( "No cities in storage." );
    }
  }

  static convertRecToSlots( cityRec ) {
    let citySlots = {};
    citySlots.name = cityRec._name ? cityRec._name : cityRec.name;
    return citySlots;
  }

  /**
   * destroys a city instance
   *
   * if needed, it cascades and deletes the country where it is a capital
   * removes city from the country's cities map
   */
  destroy() {
    let cityName = this.name, keys = Object.keys( Country.instances ), i,
      country;

    // on delete cascade (if a capital is deleted, then the country is too)
    for (i = 0; i < keys.length; i += 1) {
      if (Country.instances[keys[i]] && this.equals(
          Country.instances[keys[i]].capital )) {
        Country.instances[keys[i]].destroy();
      }
    }

    // check if city needs to be deleted from a country's cities
    // refresh keys because values might have been deleted
    keys = Object.keys(Country.instances);
    for (i = 0; i < keys.length; i += 1) {
      country = Country.instances[keys[i]];
      if (util.mapContains(country.cities, cityName)) {
        delete country.cities[cityName];
      }
    }

    delete City.instances[this.name];

    console.log( "City " + cityName + " deleted." );
  }


  /**
   * writes all data currently in City.instances to the LocalStorage
   */
  static saveAllData() {
    let allCitiesString, error = false;



    try {
      allCitiesString = JSON.stringify( City.instances );
      localStorage.setItem( "cities", allCitiesString );
    }
    catch
      (e) {
      alert( "City data could not be saved!\n" + e );
      error = true;
    }

    if (error) {
      console.log( "Error when saving city data!" );
    } else {
      console.log( "Data saved: " + localStorage.getItem( "cities" ) );
    }
  }

  /**
   * adds some cities to the app so functionality can be tested
   */
  static createTestData() {
    City.add( { _name: "Berlin" } );
    City.add( { _name: "Frankfurt" } );
    City.add( { _name: "Hamburg" } );
    City.add( { _name: "Lyon" } );
    City.add( { _name: "Marseilles" } );
    City.add( { _name: "Moscow" } );
    City.add( { _name: "Novosibirsk" } );
    City.add( { _name: "Paris" } );
    City.add( { _name: "Monaco" } );
  }

  static clearAllData() {
    let i, keys = Object.keys( City.instances );

    for (i = 0; i < keys.length; i += 1) {
      City.instances[keys[i]].destroy();
    }

    City.instances = {};
    localStorage.setItem( "cities", "{}" );
    console.log( "Database cleared." );
  }
}

City.instances = {};

