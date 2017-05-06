/**
 * Created by Levin-Can on 06.05.2017.
 */

class InternationalOrganisation {
  /**
   * constructor for an internationalOrganisation object
   *
   * @throws ConstraintViolation error via setters
   */
  constructor(slots) {
    if (arguments.length === 0) {
      // first, assign default values
      this.acronym = ""; //NonEmptyString{id}
      this.name = ""; //NonEmptyString
      this.members = []; //Country Object array
    } else {
      // if arguments were passed, set properties accordingly
      this.acronym = slots._acronym ? slots._acronym : slots.acronym;
      this.name = slots._name ? slots._name : slots.name;
      // [*] Array of Countries in members
      if (slots.members || slots._members) {
        this.members = (slots._members ?
            slots._members : slots.members)/* || slots._membersIdRef ? slots._membersIdRef : slots.membersIdRef*/;
      }
    }
}
  /**
   * creates an new International Organisations object and adds it to the instances collection
   * @param slots
   */
  static add(slots) {
    let internationalOrganisation;
    try {
      internationalOrganisation = new InternationalOrganisation( slots );
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
      internationalOrganisation = null;
    }
    
    if (internationalOrganisation) {
      InternationalOrganisation.instances[internationalOrganisation.acronym] = internationalOrganisation;
      console.log( "The internationalOrganisation " + internationalOrganisation.name + " has been added." );
    } else {
      console.log( "Error when adding internationalOrganisation." );
    }
  }
  /**
   * retrieves all the internationalOrganisations saved in the LocalStorage and converts them
   * back to objects
   */
  static retrieveAllSaved() {
    console.log( "Data retrieval entered." );
    
    let allInternationalOrganisationsString = "{}", allInternationalOrganisations, keys, i;
    try {
      if (localStorage.getItem( "internationalOrganisations" )) {
        allInternationalOrganisationsString = localStorage.getItem( "internationalOrganisations" );
        
      } else {
        console.log( "No internationalOrganisations in storage." );
      }
    } catch (e) {
      console.log( "Error when retrieving data from LocalStorage:\n" + e );
    }
    
    allInternationalOrganisations = JSON.parse( allInternationalOrganisationsString );
    keys = Object.keys( allInternationalOrganisations );
    
    // creates new internationalOrganisation objects according to the data and adds them to the
    // instances collection
    for (i = 0; i < keys.length; i += 1) {
      InternationalOrganisation.add( allInternationalOrganisations[keys[i]] );
    }
  }
  
  /**
   * the information for a internationalOrganisation is updated according to the passed values
   */
  update(slots) {
    let oldInternationalOrganisation = util.cloneObject( InternationalOrganisation.instances[this.acronym] );
    let newInternationalOrganisation;
    
    // to avoid UniquenessConstraintViolation
    this.destroy( slots.acronym );
    
    try {
      newInternationalOrganisation = new InternationalOrganisation( slots );
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message );
    }
    
    // assures that a new internationalOrganisation was successfully created and that we update an
    // existing internationalOrganisation
    if (newInternationalOrganisation) {
      
      InternationalOrganisation.instances[newInternationalOrganisation.acronym] = newInternationalOrganisation;
      console.log( "InternationalOrganisation " + newInternationalOrganisation.name + " updated. New data:\n"
          + newInternationalOrganisation.toString() );
    } else {
      this.add( oldInternationalOrganisation );
      console.log( "The internationalOrganisation " + slots.name + " could not be created." );
    }
  }
  
  
  /**
   * deletes the internationalOrganisation from the instances collection
   */
  destroy() {
    let internationalOrganisationName = this.name; //name is easier readable
    delete InternationalOrganisation.instances[this.acronym]; //delete with ID
    delete this;
    console.log( "Internaltional Organisation " + internationalOrganisationName + " deleted." );
  }
  
  /**
   * writes all data from InternationalOrganisation.instances to the LocalStorage
   */
  static saveAllData() {
    let allInternationalOrganisationsString, error = false;
    
    try {
      allInternationalOrganisationsString = JSON.stringify( InternationalOrganisation.instances );
      localStorage.setItem( "internationalOrganisations", allInternationalOrganisationsString );
    }
    catch
        (e) {
      alert( "Data could not be saved!\n" + e );
      error = true;
    }
    
    if (error) {
      console.log( "Error when saving data!" );
    } else {
      console.log( "Data saved: " + localStorage.getItem( "internationalOrganisations" ) );
    }
  }
  
  /**
   * adds some internationalOrganisations to the app so functionality can be tested
   */
  static createTestData() {
    // errors don't need to be caught here, they are handled in the add method
    //not needed since creating test data is handled in c.app
    this.add( {
      _acronym: "UN",
      _name: "United nations"
    } );
    
    this.add( {
      _acronym: "WHO",
      _name: "World Health Organisation"
    } );
    
    this.add( {
      _acronym: "NATO",
      _name: "North Atlantic Treaty Organization"
    } );
    
    InternationalOrganisation.saveAllData();
  }
  
  /**
   * clears all international Organisation data in the localStorage and instead sets an empty
   * object string
   */
  static clearAllData() {
    if (confirm( "Do you want to clear all data?" )) {
      InternationalOrganisation.instances = {};
      localStorage.setItem( "internationalOrganisations", "{}" );
      console.log( "Database cleared." );
    }
  }
  
  toString() {
    let str = "Acronym: " + this.acronym + "\n\tFull name: " + this.name;
    if (this.members) {
      str += ("\n\tMembers: " + this.members.toString());
    }
    return str;
  }
  
  /**
   * ###########################################################################
   * CONSTRAINT CHECKS & SETTERS
   * ###########################################################################
   */
  
  static checkAcronym(myAcronym) {
    if (myAcronym) {
      if (!util.isNonEmptyString( myAcronym )) {
        return new RangeConstraintViolation( "An internationalOrganisation's acronym must be a" +
            " non-empty string.", myAcronym );
      }
    }
    return new NoConstraintViolation( myAcronym );
    
  }
  
  static checkAcronymAsId(myId) {
    let constraintViolation = InternationalOrganisation.checkAcronym( myId );
    
    // continue testing only if previous test successful
    //noinspection JSLint
    if (constraintViolation instanceof NoConstraintViolation) {
      if (!myId) {
        constraintViolation = new MandatoryValueConstraintViolation(
            "An internationalOrganisation" + " always needs to have a acronym.", myId );
      } else if (InternationalOrganisation.instances[myId]) {
        constraintViolation = new UniquenessConstraintViolation( "An internationalOrganisation's" +
            " acronym has to be unique.", myId );
      }
    }
    return constraintViolation;
  }
  
  
  set acronym(newAcronym) {
    const validationResult = InternationalOrganisation.checkAcronymAsId( newAcronym );
    
    //noinspection JSLint
    if (validationResult instanceof NoConstraintViolation) {
      this._acronym = newAcronym; // only valid values should enter the database
    } else {
      alert( validationResult.message );
      throw validationResult;
    }
  }
  
  get acronym() {
    return this._acronym;
  }
  
  
  static checkName(myName) {
    if (myName) {
      if (!util.isNonEmptyString( myName )) {
        return new RangeConstraintViolation( "A internationalOrganisation's name must be a" +
            " non-empty string.", myName );
      }
    }
    return new NoConstraintViolation( myName );
    
  }
  
  set name(newName) {
    const validationResult = InternationalOrganisation.checkName( newName );
    
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
  
  static checkMember(myMember) { //check single Member
    if (!myMember){
      return new NoConstraintViolation(); //Member is not Mandatory
    } else {
      return Country.checkCountryId( myMember); //function checks if this ID exists
    }
  }
  
  static checkMembers(myMembers){ //check Array of Members
    let i, constraintViolation;
    if (!Array.isArray( myMembers) && !(myMembers === undefined)){
      return new RangeConstraintViolation( //possibly not needed
          "The value of Members must be an array");
    } else {
      if (!(myMembers === undefined)){ //Members are not mandatory
        for (i=0; i<myMembers.length; i+=1) {
          constraintViolation = InternationalOrganisation.checkMember(myMembers[i])
          if (!(constraintViolation instanceof NoConstraintViolation)){
            return constraintViolation;
          }
        }
      }
    }
    return new NoConstraintViolation();
  }
  
  set members(newMembers) {
    const validationResult = InternationalOrganisation.checkMembers( newMembers);
    
    if (validationResult instanceof NoConstraintViolation) {
      this._members = newMembers; //only valid values
    } else {
      alert( validationResult.message );
      throw  validationResult;
    }
  }
  
  get members() {
    return this._members;
  }
}

InternationalOrganisation.instances = {};