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
const CountryCodeEL = new Enumeration( {
  "DE": "Germany", "FR": "France", "RU": "Russia", "MC": "Monaco",
  "IN": "India"
} );
const ReligionEL = new Enumeration( ["Catholic", "Protestant", "Orthodox",
  "Hindu", "Muslim", "Jewish"] );

class Country {
  /**
   * constructor for a country object
   *
   * @throws ConstraintViolation error via setters
   */
  constructor(slots) {
    if (arguments.length === 0) {
      // first, assign default values
      this.name = "n.a."; // [1], NonEmptyString{id}
      this.code = CountryCodeEL.DE; // [1], {key}
      this.population = 1; // [1], PositiveInteger
    } else {
      
      // if arguments were passed, set properties accordingly
      //try {
      this.name = slots._name ? slots._name : slots.name;
      this.code = slots._code ? slots._code : slots.code;
      this.population = parseInt(
          (slots._population ? slots._population : slots.population), 10 );
      
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
      
      //} catch (e) {
      //  console.log( e.constructor.name + ": " + e.message );
      //  this.destroy();
      //  return;
      //}
    }
  }
  
  
  /**
   * creates an new country object and adds it to the instances collection
   * @param slots
   */
  static add(slots) {
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
   * converts record carrying country data to country object
   * @param countryData
   * @returns {Country}
   */
  /*
   convertRecordToObject(countryData) {
   let country;
   try {
   country = new Country( countryData );
   } catch (e) {
   console.log( e.constructor.name + ": " + e.message );
   }
   return country;
   }*/
  
  /**
   * retrieves all the countries saved in the LocalStorage and converts them
   * back to objects
   */
  static retrieveAllSaved() {
    console.log( "Data retrieval entered." );
    
    let allCountriesString = "{}", allCountries, keys, i;
    try {
      if (localStorage.getItem( "countries" )) {
        allCountriesString = localStorage.getItem( "countries" );
        
      } else {
        console.log( "No countries in storage." );
      }
    } catch (e) {
      console.log( "Error when retrieving data from LocalStorage:\n" + e );
    }
    
    allCountries = JSON.parse( allCountriesString );
    keys = Object.keys( allCountries );
    
    // creates new country objects according to the data and adds them to the
    // instances collection
    for (i = 0; i < keys.length; i += 1) {
      Country.add( allCountries[keys[i]] );
    }
  }
  
  /**
   * the information for a country is updated according to the passed values
   */
  update(slots) {
    let oldCountry = util.cloneObject( Country.instances[this.name] );
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
      console.log( "Country " + newCountry.name + " updated. New data:\n"
          + newCountry.toString() );
    } else {
      this.add( oldCountry );
      console.log( "The country " + slots.name + " could not be created." );
    }
  }
  
  
  /**
   * deletes the country from the instances collection
   */
  destroy() {
    let countryName = this.name;
    let internationalOrganisation=null, keys, i, j;
    //delete all references to this country in the international Organisations
    keys = Object.keys( InternationalOrganisation.instances);
    console.log(keys);
    console.log(InternationalOrganisation.instances);
    for (i=0; i<keys.length; i+=1) {
      internationalOrganisation = InternationalOrganisation.instances[keys[i]];
      //loop through the array to delete the right element
      for (j = 0; j < internationalOrganisation.members.length; j += 1) {
        if (internationalOrganisation.members[j] === countryName) {
          delete internationalOrganisation.members[j];
        }
      }
    }
    delete Country.instances[this.name];
    delete this;
    console.log( "Country " + countryName + " deleted." );
    
  }
  
  
  /**
   * writes all data from Country.instances to the LocalStorage
   */
  static saveAllData() {
    let allCountriesString, error = false;
    
    try {
      allCountriesString = JSON.stringify( Country.instances );
      localStorage.setItem( "countries", allCountriesString );
    }
    catch
        (e) {
      alert( "Data could not be saved!\n" + e );
      error = true;
    }
    
    if (error) {
      console.log( "Error when saving data!" );
    } else {
      console.log( "Data saved: " + localStorage.getItem( "countries" ) );
    }
  }
  
  
  /**
   * adds some countries to the app so functionality can be tested
   */
  static createTestData() {
    // errors don't need to be caught here, they are handled in the add method
    this.add( {
      _name: "Germany",
      _code: CountryCodeEL.DE,
      _population: 80854408,
      _lifeExpectancy: 80.57,
      _religions: [ReligionEL.CATHOLIC, ReligionEL.PROTESTANT,
        ReligionEL.MUSLIM]
    } );
    
    this.add( {
      _name: "France", _code: CountryCodeEL.FR, _population: 66553766,
      _lifeExpectancy: 81.75,
      _religions: [ReligionEL.CATHOLIC, ReligionEL.MUSLIM]
    } );
    
    this.add( {
      _name: "Russia", _code: CountryCodeEL.RU, _population: 142423773,
      _lifeExpectancy: 70.47,
      _religions: [ReligionEL.ORTHODOX, ReligionEL.MUSLIM]
    } );
    
    this.add( {
      _name: "Monaco", _code: CountryCodeEL.MC, _population: 30535,
      _lifeExpectancy: 89.52,
      _religions: [ReligionEL.CATHOLIC]
    } );
    
    Country.saveAllData();
  }
  
  
  /**
   * clears all country data in the localStorage and instead sets an empty
   * object string
   */
  static clearAllData() {
    if (confirm( "Do you want to clear all data?" )) {
      Country.instances = {};
      localStorage.setItem( "countries", "{}" );
      console.log( "Database cleared." );
    }
  }
  
  
  toString() {
    let str = "Country: " + this.name + "\n\tCountry Code: " + this.code + "" +
        "\n\tPopulation: " + this.population;
    
    if (this.lifeExpectancy) {
      str += ("\n\tAv. Life Expectancy: " + this.lifeExpectancy.toString());
    }
    if (this.religions) {
      str += "\n\tReligions: ";
      for (let i = 0; i < this.religions.length; i += 1) {
        str += ReligionEL.labels[this.religions[i]];
        if (i !== this.religions.length - 1) {
          str += ", ";
        }
      }
    }
    return str;
  }
  
  
  /**
   * ###########################################################################
   * CONSTRAINT CHECKS & SETTERS
   * ###########################################################################
   */
  
  static checkName(myName) {
    if (myName) {
      if (!util.isNonEmptyString( myName )) {
        return new RangeConstraintViolation( "A country's name must be a" +
            " non-empty string.", myName );
      }
    }
    return new NoConstraintViolation( myName );
    
  }
  
  static checkNameAsId(myId) {
    let constraintViolation = Country.checkName( myId );
    
    // continue testing only if previous test successful
    //noinspection JSLint
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
  
  set name(newName) {
    const validationResult = Country.checkNameAsId( newName );
    
    //noinspection JSLint
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
  
  static checkCode(myCode) {
    // mandatory
    if (myCode === 0 || myCode !== undefined) {
      
      // valid country code
      if (!util.isIntegerOrIntegerString( myCode ) ||
          myCode < 0 || myCode > CountryCodeEL.MAX) {
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
  
  set code(newCode) {
    let validationResult = Country.checkCode( newCode );
    
    //noinspection JSLint
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
  
  static checkPopulation(myPopulation) {
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
  };
  
  set population(newPopulation) {
    const validationResult = Country.checkPopulation( newPopulation );
    
    //noinspection JSLint
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
  
  static checkLifeExpectancy(myLifeExpect) {
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
  };
  
  set lifeExpectancy(newLifeExpectancy) {
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
  
  static checkReligions(myReligions) {
    if (myReligions) {
      for (let i = 0; i < myReligions.length; i += 1) {
        if (!util.isIntegerOrIntegerString( myReligions[i] ) ||
            myReligions[i] < 0 || myReligions[i] > ReligionEL.MAX) {
          return new RangeConstraintViolation( "The religion " + myReligions[i]
              + " is unknown.", myReligions );
        }
      }
    }
    return new NoConstraintViolation( myReligions );
  }
  
  set religions(newReligions) {
    const validationResult = Country.checkReligions( newReligions );
    //noinspection JSLint
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
  static checkCountryId ( id) {
    if (Country.instances[id]) {
      return new NoConstraintViolation();
    } else {
      return new ReferentialIntegrityConstraintViolation(
          "Country does not exist");
    }
}
}

Country.instances = {};