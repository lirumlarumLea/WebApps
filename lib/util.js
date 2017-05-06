/* global -util */
/**
 * @fileOverview  Defines utility procedures/functions
 * @author Gerd Wagner (reformatted + updated to strict mode by Lea Weber)
 * except where explicitly declared otherwise
 */
"use strict";


const util = {
  
  /**
   * Verifies if a value represents an integer
   * @param {string} x
   * @return {boolean}
   */
  isNonEmptyString: function (x) {
    return typeof(x) === "string" && x.trim() !== "";
  },
  
  /**
   * Verifies if a value represents an integer or integer string
   * @param {string} x
   * @return {boolean}
   */
  isIntegerOrIntegerString: function (x) {
    return (typeof(x) === "number" && x.toString().search( /^-?[0-9]+$/ ) === 0)
        || (typeof(x) === "string" && x.search( /^-?[0-9]+$/ ) === 0);
  },
  
  
  /**
   * Creates a typed "data clone" of an object
   * @param {object} obj
   */
  cloneObject: function (obj) {
    let key, keys, i;
    const clone = Object.create( Object.getPrototypeOf( obj ) );
    keys = Object.keys( obj );
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      if (obj.hasOwnProperty( key ) && typeof obj[key] !== "object") {
        clone[key] = obj[key];
      }
    }
    return clone;
  },
  
  /**
   * Fill a select element with option elements created from an
   * associative array of objects
   *
   * @author adapted by Lea Weber
   *
   * @param {object} selectEl  A select(ion list) element
   * @param {array} values
   */
  fillSelectWithOptionsFromArr: function (selectEl, values) {
    let i, optionEl = null;
    
    // delete old contents
    selectEl.innerHTML = "";
    
    // create "no selection yet" entry
    if (!selectEl.multiple) {
      selectEl.add( this.createOption( "", " --- " ) );
    }
    
    // create option elements from object property values
    for (i = 0; i < values.length; i += 1) {
      if (values[i] !== "") {
        optionEl = this.createOption( i.toString(), values[i] );
        selectEl.add( optionEl );
      }
    }
  },
  
  /**
   * Create option elements from a map of objects
   * and insert them into a selection list element
   *
   * @param {object} objMap  A map of objects
   * @param {object} selEl  A select(ion list) element
   * @param {string} stdIdProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text
   *                 to be displayed for each object
   */
  fillSelectWithOptions: function (objMap, selEl, stdIdProp, displayProp) {
    let optionEl = null, obj = null, i,
        keys = Object.keys( objMap );
    for (i = 0; i < keys.length; i += 1) {
      obj = objMap[keys[i]];
      obj.index = i + 1;  // store selection list index
      optionEl = document.createElement( "option" );
      optionEl.value = obj[stdIdProp];
      if (displayProp) {
        // show the values of displayProp in the select list
        optionEl.text = obj[displayProp];
      }
      else {
        // show the values of stdIdProp in the select list
        optionEl.text = obj[stdIdProp];
      }
      selEl.add( optionEl, null );
    }
  },
  //select multiple values in select multiple Box
  selectMultipleValues: function (selectObj, txtArr) {
    var i, j;
    //compare every element in the selection list(i)
    //with everything in the textArray(j)
    for (i=0; i<selectObj.length; i+=1) {
      for (j=0; j<txtArr.length; j+=1) {
        if (selectObj.options[i].value === txtArr[j] ) {
          selectObj.options[i].selected = true;
          break;
        } else {
         selectObj.options[i].selected = false;
       }
      }
    }
  },
  
  /**
   * Create a DOM option element
   *
   * @param {string} val
   * @param {string} txt
   *
   * @return {object}
   */
  createOption: function (val, txt) {
    let el = document.createElement( "option" );
    el.value = val;
    el.text = txt;
    return el;
  },
  
  /**
   * Create a choice widget in a given field set element.
   * A choice element is either an HTML radio button or an HTML checkbox.
   * @method
   */
  createChoiceWidget: function (containerEl, fld, values,
                                choiceWidgetType, choiceItems) {
    let j, el = null,
        choiceControls = containerEl.getElementsByTagName( "label" );
    // remove old content
    for (j = 0; j < choiceControls.length; j += 1) {
      containerEl.removeChild( choiceControls[j] );
    }
    if (!containerEl.hasAttribute( "data-bind" )) {
      containerEl.setAttribute( "data-bind", fld );
    }
    if (values.length >= 1) {
      if (choiceWidgetType === "radio") {
        containerEl.setAttribute( "data-value", values[0] );
      } else {  // checkboxes
        containerEl.setAttribute( "data-value", "[" + values.join() + "]" );
      }
    }
    for (j = 0; j < choiceItems.length; j += 1) {
      // button values = 1..n
      el = this.createLabeledChoiceControl( choiceWidgetType, fld,
          j + 1, choiceItems[j] );
      // check the radio button or checkbox
      if (values.includes( j + 1 )) {
        el.firstElementChild.checked = true;
      }
      containerEl.appendChild( el );
      el.firstElementChild.addEventListener( "click", function (e) {
        let btnEl = e.target, i = 0;
        if (choiceWidgetType === "radio") {
          if (containerEl.getAttribute( "data-value" ) !== btnEl.value) {
            containerEl.setAttribute( "data-value", btnEl.value );
          } else {
            // turn off radio button
            btnEl.checked = false;
            containerEl.setAttribute( "data-value", "" );
          }
        } else {  // checkbox
          values = JSON.parse( containerEl.getAttribute( "data-value" ) ) || [];
          i = values.indexOf( parseInt( btnEl.value ) );
          if (i > -1) {
            values.splice( i, 1 );  // delete from value list
          } else {  // add to value list
            values.push( btnEl.value );
          }
          containerEl.setAttribute( "data-value", "[" + values.join() + "]" );
        }
      } );
    }
    return containerEl;
  },
  
  /**
   * Create a radio button or checkbox element
   */
  createLabeledChoiceControl: function (t, n, v, lbl) {
    let ccEl = document.createElement( "input" ),
        lblEl = document.createElement( "label" );
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild( ccEl );
    lblEl.appendChild( document.createTextNode( lbl ) );
    return lblEl;
  }
};
