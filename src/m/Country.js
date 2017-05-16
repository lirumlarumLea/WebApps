/**
 * Created by Lea Weber on 13.04.2017.
 * WebApp17, Assignment 1
 */
"use strict";

/**
 * #############################################################################
 * CONSTRUCTOR and DATA MGMT ###################################################
 * #############################################################################
 */
/* global -CountryCodeEL */
const CountryCodeEL = new Enumeration( {
  "DE": "Germany", "FR": "France", "RU": "Russia", "MC": "Monaco",
  "IN": "India"
} );

/* global -ReligionsEL */
const ReligionsEL = new Enumeration( ["Catholic",
  "Protestant", "Orthodox", "Hindu",
  "Muslim", "Jewish"] );

class Country {
  /**
   * constructor for a country object
   *
   * @throws ConstraintViolation error via setters
   */
  constructor( slots ) {

    // this._name = "n.a."; // [1], NonEmptyString{id}
    // this._code = CountryCodeEL.DE; // [1], {key}
    // this._population = 1; // [1], PositiveInteger
    // this._capital = new City( "default" ); // [1], City
    // this._religions = [];

    if (arguments.length === 0) {

      // first, assign default values
      this.name = "n.a."; // [1], NonEmptyString{id}
      this.code = CountryCodeEL.DE; // [1], {key}
      this.population = 1; // [1], PositiveInteger
      this.capital = new City( "default" ); // [1], City
      this._memberOf = {}; // [*] derived map of all IntOrgs where country is
      // member

    } else {

      // if arguments were passed, set properties accordingly
      //try {
      this.name = slots._name ? slots._name : slots.name;
      this.code = slots._code ? slots._code : slots.code;
      this.population = parseInt(
        (slots._population ? slots._population : slots.population), 10 );
      this.cities = {}; // a country always has a city, namely the capital
      this.capital = slots._capital ? slots._capital : slots.capital;
      this._memberOf = {};

      // [0,1], PositiveDecimal{max:100}
      if (slots.lifeExpectancy || slots._lifeExpectancy) {
        this.lifeExpectancy = parseFloat( slots._lifeExpectancy ?
          slots._lifeExpectancy : slots.lifeExpectancy );
      }

      // [*] Array of ReligionEL
      if (slots.religions || slots._religions) {
        this.religions = slots._religions ?
          slots._religions : slots.religions;
      }

      // [1..*] map, always contains capital, master for city._inCountry
      if (slots.cities || slots._cities) {
        this.cities = slots._cities ? slots._cities : slots.cities;
      }

      // // semi-hidden since it's a derived property
      // if (slots._memberOf) {
      //   this._memberOf = slots._memberOf;
      // }
    }
  }


  /**
   * creates an new country object and adds it to the instances collection
   * @param slots
   */
  static add( slots ) {
    let country;
    try {
      country = new Country( slots );
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
      country = null;
    }

    if (country) {
      Country.instances[country.name] = country;
      console.log( "The country " + country.name + " has been added." );
    } else {
      console.log( "Error when adding country." );
    }
  }


  /**
   * retrieves all the countries saved in the LocalStorage and converts them
   * back to objects
   */
  static retrieveAllData() {
    console.log( "Country data retrieval entered." );

    let allCountriesString = "{}", allCountries, keys, i, slots;
    try {
      allCountriesString = localStorage.getItem( "countries" );
    } catch (e) {
      console.log( "Error when retrieving country data from " +
        "LocalStorage:\n" + e );
    }

    allCountries = JSON.parse( allCountriesString );
    if (allCountries) {
      keys = Object.keys( allCountries );

      // creates new country objects according to the data and adds them to the
      // instances collection
      for (i = 0; i < keys.length; i += 1) {
        slots = Country.convertRecToSlots( allCountries[keys[i]] );
        Country.add( slots );
      }
      console.log(City.instances);
    } else {
      console.log( "No countries in storage." );
    }
  }

  /**
   * replaces the references in a country record with referenced objects
   * @param countryRec
   * @returns {Object}
   */
  static convertRecToSlots( countryRec ) {
    let countrySlots = {};

    countrySlots.name = countryRec._name ? countryRec._name : countryRec.name;
    countrySlots.code = countryRec._code ? countryRec._code : countryRec.code;
    countrySlots.population = parseInt(
      (countryRec._population ?
        countryRec._population : countryRec.population), 10 );


    // replace capital city reference with object
    countrySlots.capital = City.instances[countryRec.capitalRef];
    console.log(countrySlots.capital);

    if (countryRec.lifeExpectancy || countryRec._lifeExpectancy) {
      countrySlots.lifeExpectancy = parseFloat( countryRec._lifeExpectancy ?
        countryRec._lifeExpectancy : countryRec.lifeExpectancy );
    }

    if (countryRec.religions || countryRec._religions) {
      countrySlots.religions = countryRec._religions ?
        countryRec._religions.slice() : countryRec.religions.slice();
    }

    // convert the cities map from references to objects
    if (countryRec.cityRefs) {
      let tempCities = {};
      for (let i = 0; i < countryRec.cityRefs.length; i += 1) {
        tempCities[countryRec.cityRefs[i]] =
          City.instances[countryRec.cityRefs[i]];
      }
      countrySlots.cities = tempCities;
    }

    // memberOf is set when IntOrgs are created

    return countrySlots;
  }

  /**
   * the information for a country is updated according to the passed values
   */
  update( slots ) {
    let oldCountry = Country.instances[this.name];
    let newCountry;

    // to avoid UniquenessConstraintViolation
    this.destroy( slots.name );

    try {
      newCountry = new Country( slots );
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }

    // assures that a new country was successfully created and that we update an
    // existing country
    if (newCountry) {

      Country.instances[newCountry.name] = newCountry;
      console.log( "Country " + newCountry.name + " updated. New data:\n" +
        newCountry.toString() );
    } else {
      Country.instances[oldCountry.name] = oldCountry;
      console.log( "The country " + slots.name + " could not be created." );
    }
  }


  /**
   * deletes the country from the instances collection
   */
  destroy() {
    let countryName = this.name;
    let internationalOrganisation = null, keys, i, j;
    //delete all references to this country in the international Organisations
    // (on delete cascade)
    keys = Object.keys( InternationalOrganisation.instances );

    for (i = 0; i < keys.length; i += 1) {
      internationalOrganisation =
        InternationalOrganisation.instances[keys[i]];
      //loop through the array to delete the right element
      for (j = 0; j < internationalOrganisation.members.length; j += 1) {
        if (internationalOrganisation.members[j] === countryName) {

          InternationalOrganisation.instances[keys[i]].members.splice(
            internationalOrganisation.members.indexOf( countryName ), 1 );
        }
      }
    }
    delete Country.instances[countryName];

    console.log( "Country " + countryName + " deleted." );

  }


  /**
   * writes all data from Country.instances to the LocalStorage
   */
  static saveAllData() {
    let allCountriesString, error = false, allCountries = {}, keys, i;

    keys = Object.keys( Country.instances );

    for (i = 0; i < keys.length; i += 1) {

      allCountries[keys[i]] = Country.instances[keys[i]].convertObjToRec();
    }


    try {
      allCountriesString = JSON.stringify( allCountries );
      localStorage.setItem( "countries", allCountriesString );
    }
    catch
      (e) {
      alert( "Country data could not be saved!\n" + e );
      error = true;
    }

    if (error) {
      console.log( "Error when saving country data!" );
    } else {
      console.log( "Data saved: " + localStorage.getItem( "countries" ) );
    }
  }

  /**
   * replaces all the objects in a country object with reference values and
   * returns the resulting object
   *
   * @returns {Object}
   */
  convertObjToRec() {
    let countryRow = util.cloneObject( this ), keys, i;
    // create capital city Id reference
    countryRow.capitalRef = this.capital.name;

    if (this.religions) {
      countryRow.religions = (this.religions).slice();
    }

    if (this.cities) {
      countryRow.cityRefs = [];
      keys = Object.keys( this.cities );

      for (i = 0; i < keys.length; i += 1) {
        countryRow.cityRefs.push( keys[i] );
      }
    }

    delete countryRow.capital;
    delete countryRow._capital;
    delete countryRow.cities;
    delete countryRow._cities;
    delete countryRow._memberOf; // is a derived property and should not be
    // stored here. It will be restored when the IntOrgs are restored.

    return countryRow;
  }

  /**
   * adds some countries to the app so functionality can be tested
   */
  static createTestData() {
    // errors don't need to be caught here, they are handled in the add method
    if (Object.keys( City.instances ).length === 0) {
      // necessary, so users can easily create country data,
      // because a country always needs an existing city as capital
      City.createTestData();
    }

    let temp = {
      _name: "Germany",
      _code: CountryCodeEL.IN,
      _capital: City.instances["Berlin"],
      _population: 80854408,
      _lifeExpectancy: 80.57,
      _religions: [ReligionsEL.CATHOLIC],
      _cities: {
        "Hamburg": City.instances["Hamburg"],
        "Frankfurt": City.instances["Frankfurt"]
      }
    };
    Country.add( temp );


    Country.add( {
      _name: "France",
      _code: CountryCodeEL.FR,
      _capital: City.instances["Paris"],
      _population: 66553766,
      _lifeExpectancy: 81.75,
      _religions: [ReligionsEL["CATHOLIC"], ReligionsEL["MUSLIM"]],
      _cities: {
        "Lyon": City.instances["Lyon"], "Marseilles": City.instances[
          "Marseilles"], "Paris": City.instances["Paris"]
      }
    } );

    Country.add( {
      _name: "Russia",
      _code: CountryCodeEL.RU,
      _capital: City.instances["Moscow"],
      _population: 142423773,
      _lifeExpectancy: 70.47,
      _religions: [ReligionsEL["ORTHODOX"], ReligionsEL["MUSLIM"]],
      _cities: {
        "Moscow": City.instances["Moscow"],
        "Novosibirsk": City.instances["Novosibirsk"]
      }
    } );

    Country.add( {
      _name: "Monaco",
      _code: CountryCodeEL.MC,
      _capital: City.instances["Monaco"],
      _population: 30535,
      _lifeExpectancy: 89.52
    } );

    console.log( Country.instances );
    Country.saveAllData();
  }


  /**
   * clears all country data in the localStorage and instead sets an empty
   * object string
   */
  static clearAllData() {
    let i, keys;
    if (confirm( "Do you want to clear all country data?" )) {
      keys = Object.keys( Country.instances );
      for (i = 0; i < keys.length; i += 1) {
        // use destroy method to properly handle all references
        Country.instances[keys[i]].destroy();
      }

      // hard reset instances
      Country.instances = {};
      localStorage.setItem( "countries", "{}" );
      console.log( "Database cleared." );
    }
  }


  toString() {
    let str = "Country: " + this.name + "\n\tCountry Code: " +
      CountryCodeEL.labels[this.code] + "" + "\n\tCapital City: " +
      this.capital.name + "\n\tPopulation: " + this.population;
    let i, keys;

    // optional value
    if (this.lifeExpectancy) {
      str += ("\n\tAv. Life Expectancy: " + this.lifeExpectancy.toString());
    }

    // add all religions as strings
    if (this.religions) {
      str += "\n\tReligions: ";
      for (i = 0; i < this.religions.length; i += 1) {
        str += ReligionsEL.labels[this.religions[i]];
        if (i !== this.religions.length - 1) {
          str += ", ";
        }
      }
    }

    // add all cities with their names
    keys = Object.keys( this.cities );
    str += "\n\tCities: ";
    for (i = 0; i < keys.length; i += 1) {
      str += keys[i];
      if (i !== keys.length - 1) {
        str += ", ";
      }
    }

    // add all IntOrgs where this country is a member
    keys = Object.keys( this._memberOf );
    str += "\n\tMember of: ";
    for (i = 0; i < keys.length; i += 1) {
      str += keys[i];
      if (i !== keys.length - 1) {
        str += ", ";
      }
    }

    return str;
  }


  /**
   * ###########################################################################
   * CONSTRAINT CHECKS & SETTERS
   * ###########################################################################
   */

  static checkName( myName ) {
    if (myName) {
      if (!util.isNonEmptyString( myName )) {
        return new RangeConstraintViolation( "A country's name must be a" +
          " non-empty string.", myName );
      }
    }
    return new NoConstraintViolation( myName );

  }

  static checkNameAsId( myId ) {
    let constraintViolation = Country.checkName( myId );

    // continue testing only if previous test successful
    if (constraintViolation instanceof NoConstraintViolation) {
      if (!myId) {
        constraintViolation = new MandatoryValueConstraintViolation(
          "A country" + " always needs to have a name.", myId );
      } else if (Country.instances[myId]) {
        constraintViolation = new UniquenessConstraintViolation( "A country's" +
          " name has to be unique.", myId );
      }
    }
    return constraintViolation;
  }

  set name( newName ) {
    const validationResult = Country.checkNameAsId( newName );

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

  static checkCode( myCode ) {
    // mandatory

    if (myCode === 0 || myCode !== undefined) {

      // valid country code
      if (!util.isIntegerOrIntegerString( myCode ) ||
        myCode < 0 || myCode >= CountryCodeEL.MAX) {
        return new RangeConstraintViolation( "The entered country code is" +
          " unknown.", myCode );
      }
      // uniqueness test
      let allCountryKeys = Object.keys( Country.instances );
      if (allCountryKeys.length > 0) {

        for (let i = 0; i < allCountryKeys.length; i += 1) {

          let key = allCountryKeys[i];
          if (Country.instances[key].code === myCode) {
            return new UniquenessConstraintViolation( "A country code must be" +
              " unique! " + myCode, myCode );
          }
        }
      }
      return new NoConstraintViolation( myCode ); // all tests passed

    } else {
      return new MandatoryValueConstraintViolation( "A country always has an" +
        " official code.", myCode );
    }
  }

  set code( newCode ) {
    let validationResult = Country.checkCode( newCode );

    if (validationResult instanceof NoConstraintViolation) {
      this._code = newCode; // only valid values should enter the database
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get code() {
    return this._code;
  }

  static checkPopulation( myPopulation ) {
    if (myPopulation) {
      if (isNaN( myPopulation ) ||
        !util.isIntegerOrIntegerString( myPopulation ) || myPopulation < 0) {
        return new RangeConstraintViolation(
          "The population of a country must" +
          " be a positive whole number.", myPopulation );
      }
    } else {
      return new MandatoryValueConstraintViolation( "A country has to have a" +
        " specified population.", myPopulation );
    }
    return new NoConstraintViolation( myPopulation );
  }

  set population( newPopulation ) {
    const validationResult = Country.checkPopulation( newPopulation );

    if (validationResult instanceof NoConstraintViolation) {
      // only valid values should enter the database
      this._population = newPopulation;
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get population() {
    return this._population;
  }


  static checkCapital( myCapital ) {
    let i, keys, values,
      constraintViolation = new NoConstraintViolation( myCapital );

    // mandatory
    if (!myCapital) {
      console.log( myCapital );
      constraintViolation = new MandatoryValueConstraintViolation(
        "A country always needs to have a capital city. ", myCapital );
    } else {
      constraintViolation = City.checkNameAsRefId( myCapital.name );

      // unique
      keys = Object.keys( Country.instances );
      values = Object.values( Country.instances );
      for (i = 0; i < keys.length; i += 1) {
        if (myCapital.equals( values[i].capital )) {
          constraintViolation = new UniquenessConstraintViolation(
            "A capital city has to be unique!", myCapital );
        }
      }
    }
    return constraintViolation;
  }


  set capital( newCapital ) {
    const validationResult = Country.checkCapital( newCapital );

    // only valid values should enter the database
    if (validationResult instanceof NoConstraintViolation) {
      this._capital = newCapital;
      this.capital._inCountry = this; // set bidirectional reference
      if (!util.mapContains( this.cities, this._capital.name )) {
        console.log( "adding capital" );
        this.cities[this._capital.name] = this._capital;
      } else {
        console.log( this.cities[this._capital.name] );
      }
    } else {
      console.log( this );
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get capital() {
    return this._capital;
  }


  static checkLifeExpectancy( myLifeExpect ) {
    if (myLifeExpect) {
      if (isNaN( myLifeExpect )) {
        return new RangeConstraintViolation( "A country's average life" +
          " expectancy muss be a decimal number value.",
          myLifeExpect );
      } else if (myLifeExpect < 0 || myLifeExpect > 100) {
        return new IntervalConstraintViolation( "A country's life expectancy " +
          "must be between 0 and 100.", myLifeExpect );
      } else {
        // return ok
        return new NoConstraintViolation( myLifeExpect );
      }
    }
  }

  set lifeExpectancy( newLifeExpectancy ) {
    const validationResult = Country.checkLifeExpectancy( newLifeExpectancy );
    //noinspection JSLint
    if (validationResult instanceof NoConstraintViolation) {
      // only valid values should enter the database
      this._lifeExpectancy = newLifeExpectancy;
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get lifeExpectancy() {
    return this._lifeExpectancy;
  }

  static checkReligions( myReligions ) {
    if (myReligions) { // myReligions should be an array
      if (!Array.isArray( myReligions )) {
        return new RangeConstraintViolation( "Religions must be stored in an" +
          " array.", myReligions );
      }

      for (let i = 0; i < myReligions.length; i += 1) {

        if (!util.isIntegerOrIntegerString( myReligions[i] ) ||
          myReligions[i] < 0 || myReligions[i] > ReligionsEL.MAX) {

          return new RangeConstraintViolation( "The religion " +
            ReligionsEL.enumLitNames[myReligions[i]] +
            " is unknown.", myReligions );
        }

      }
    }
    return new NoConstraintViolation( myReligions );
  }

  set religions( newReligions ) {
    const validationResult = Country.checkReligions( newReligions );
    if (validationResult instanceof NoConstraintViolation) {
      // only valid values should enter the database
      this._religions = newReligions;
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }

  get religions() {
    return this._religions;
  }

  //check if the referenced Country is existent
  static checkCountryId( id ) {
    if (Country.instances[id]) {
      return new NoConstraintViolation();
    } else {
      return new ReferentialIntegrityConstraintViolation(
        "Country does not exist" );
    }
  }

  set cities( newCities ) {
    const validationResult = Country.checkCities( newCities );

    if (validationResult instanceof NoConstraintViolation) {
      this._cities = newCities;
      //only valid values

      // handle bidirectional referencing
      let keys = Object.keys( City.instances );
      for (let i = 0; i < keys.length; i += 1) {
        if ((util.mapContains( this._cities, keys[i] ))) {
          // City is in country -> add reference
          City.instances[keys[i]]._inCountry = this;
        } else {
          // make sure there is no reference where there shouldn't be
          delete City.instances[keys[i]]._inCountry;
        }
      }

      // contains capital? if no, add it automatically
      if (this.capital &&
        !util.mapContains( this._cities, this._capital.name )) {
        this._cities[this._capital.name] = this._capital;
      }
    } else {
      alert( validationResult.message );
      throw  validationResult;
    }
  }

  get cities() {
    return this._cities;
  }

  /**
   *
   * @param {Object} myCities - map of cities
   * @returns {*}
   */
  static checkCities( myCities ) {
    let i, keysCities;
    let constraintViolation = new NoConstraintViolation( myCities );
    if (myCities) {

      // known cities only
      keysCities = Object.keys( myCities );

      for (i = 0; i < keysCities; i += 1) {
        constraintViolation = City.checkNameAsRefId( keysCities[i] );
      }


    }
    return constraintViolation;
  }
}

Country.instances = {};