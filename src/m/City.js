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

  constructor( name ) {
    this.name = name; // name[1] NonEmptyString {id}
    // no default values added, since a nameless city makes no sense
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
      } else if (Object.keys( City.instances ).indexOf( newName ) !== -1) {
        constraintViolation = new UniquenessConstraintViolation( "A city's" +
          " name has to be unique.", newName );
      }
    }
    return constraintViolation;
  }

  static checkNameAsRefId( newName ) {
    if (!City.instances[ newName ]) {
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
   * @param cityName
   */
  static add( cityName ) {
    let tempCity;

    try {
      tempCity = new City( cityName );
    } catch (e) {
      tempCity = null;
      console.log( e.constructor.name + ": " + e.message );
    }

    if (tempCity) {
      City.instances[ cityName ] = tempCity;
      console.log( "City " + City.instances[ cityName ].name + " added to" +
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

    let allCitiesString = "{}", allCities, keys, i;
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
      console.log( "allCitiesStr: " + allCitiesString );
      keys = Object.keys( allCities );

      // creates new city objects according to the data and adds them to the
      // instances collection
      for (i = 0; i < keys.length; i += 1) {
        City.add( keys[ i ] );
      }
    } else {
      console.log( "No cities in storage." );
    }
  }

  /**
   * destroys a city instance
   */
  destroy() {
    let cityName = this.name;

    delete City.instances[ this.name ];

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
    City.add( "Berlin" );
    City.add( "Frankfurt" );
    City.add( "Hamburg" );
    City.add( "Lyon" );
    City.add( "Marseilles" );
    City.add( "Moscow" );
    City.add( "Novosibirsk" );
    City.add( "Paris" );
    City.add( "Monaco" );
  }

  static clearAllData() {
    //TODO consider references in county!!
    throw new ReferentialIntegrityConstraintViolation( "Deleting all country" +
      " instances hasn't been implemented yet!" );
  }
}

City.instances = {};

