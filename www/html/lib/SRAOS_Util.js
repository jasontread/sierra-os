/*
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 | SIERRA::OS : PHP RIA Framework      http://code.google.com/p/sierra-os  |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 | Copyright 2005 Jason Read                                               |
 |                                                                         |
 | Licensed under the Apache License, Version 2.0 (the "License");         |
 | you may not use this file except in compliance with the License.        |
 | You may obtain a copy of the License at                                 |
 |                                                                         |
 |     http://www.apache.org/licenses/LICENSE-2.0                          |
 |                                                                         |
 | Unless required by applicable law or agreed to in writing, software     |
 | distributed under the License is distributed on an "AS IS" BASIS,       |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.|
 | See the License for the specific language governing permissions and     |
 | limitations under the License.                                          |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 */

/**
 * contains utility methods used within SRAOS
 */
SRAOS_Util = function() {};



// {{{ addOnEnterEvent
/**
 * causes the method to be invoked whenever the enter key is pressed in the 
 * textField specified. the method should have the following signature: 
 * (String : value, Object, field)
 * @param Object textField the text field to add the event to
 * @param Object target the object containing the method
 * @param String method the method to invoke
 * @access public
 * @return void
 */
SRAOS_Util.addOnEnterEvent = function(textField, target, method) {
  textField._enterTarget = target;
  textField._enterMethod = method;
  textField.onkeypress = function(evt) {
    if (evt.keyCode == 13) {
      textField._enterTarget[textField._enterMethod](this.value, this);
      return false;
    }
  };
};
// }}}


// {{{ addOptionToSelectField
/**
 * adds a single option to the select field specified
 * @param Object field the select field to add the option to
 * @param Option option the option to add
 * @access public
 * @return void
 */
SRAOS_Util.addOptionToSelectField = function(field, option) {
  return SRAOS_Util.addOptionsToSelectField(field, [option]);
};
// }}}


// {{{ addOptionsToSelectField
/**
 * adds options to the select field specified
 * @param Object field the select field to add the options to
 * @param Array options the options to add
 * @access public
 * @return void
 */
SRAOS_Util.addOptionsToSelectField = function(field, options) {
  for(var i in options) {
    try {
      field.add(options[i], null); // standards compliant; doesn't work in IE
    }
    catch(e) {
      field.add(options[i]); // IE only
    }
  }
};
// }}}


// {{{ arrayKeyExists
/**
 * returns true if key exists in the array/object arr
 * @param Array arr the array to check
 * @param String key the key to check for
 * @access public
 * @return boolean
 */
SRAOS_Util.arrayKeyExists = function(arr, key) {
  if (arr) {
    for(var i in arr) {
      if (i == key) { return true; }
    }
  }
  return false;
};
// }}}


// {{{ arrayMerge
/**
 * merges 2 arrays or objects. if the values are arrays, the return value will 
 * be all of the values in arr1 + all of the values in arr2. if the values are 
 * objects (or associative arrays), the return value will be the union of arr1 
 * and arr2 where values in arr1 will not be overwritten if they also exist in 
 * arr2
 * @param Array arr1 the primary array to merge into
 * @param Array arr2 the array to merge with
 * @access public
 * @return Array
 */
SRAOS_Util.arrayMerge = function(arr1, arr2) {
  var merged = new Array();
  
  // array
  if (SRAOS_Util.isArray(arr1) && SRAOS_Util.isArray(arr2)) {
    for(var i in arr1) {
      merged.push(arr1[i]);
    }
    for(var i in arr2) {
      merged.push(arr2[i]);
    }
  }
  // object
  else {
    for(var i in arr1) {
      merged[i] = arr1[i];
    }
    for(var i in arr2) {
      if (!merged[i]) { merged[i] = arr2[i]; }
    }
  }
  return merged;
};
// }}}


// {{{ beginsWith
/**
 * returns TRUE if the str specified begins with substr
 * @param String str the string to check
 * @param String substr the string to check for
 * @param boolean caseSensitive whether or not case sensitive. default is true
 * @access public
 * @return boolean
 */
SRAOS_Util.beginsWith = function(str, substr, caseSensitive) {
  if (SRAOS_Util.isString(str) && SRAOS_Util.isString(substr)) {
    if (caseSensitive === false) {
      str = str.toLowerCase();
      substr = substr.toLowerCase();
    }
    return str.indexOf(substr) === 0;
  }
  else {
    return null;
  }
};
// }}}


// {{{ clearSelectField
/**
 * removes all options from the select field specified
 * @param Object field the select field to clear
 * @access public
 * @return void
 */
SRAOS_Util.clearSelectField = function(field) {
  for (var i=field.length - 1; i>= 0; i--) {
    field.remove(i);
  }
};
// }}}


// {{{ endsWith
/**
 * returns TRUE if the str specified ends with substr
 * @param string str the string to check
 * @param string substr the string to check for
 * @param boolean caseSensitive whether or not case sensitive. default is true
 * @access public
 * @return boolean
 */
SRAOS_Util.endsWith = function(str, substr, caseSensitive) {
  if (SRAOS_Util.isString(str) && SRAOS_Util.isString(substr)) {
    if (caseSensitive === false) {
      str = str.toLowerCase();
      substr = substr.toLowerCase();
    }
    return str.lastIndexOf(substr) == str.length - substr.length;
  }
  else {
    return null;
  }
};
// }}}


// {{{ escapeQuotes
/**
 * escapes quotes (both single and double) within str
 * @param String str the string to escape the quotes in
 * @access public
 * @return void
 */
SRAOS_Util.escapeQuotes = function(str) {
  return str && str.replace ? str.replace(new RegExp('"', "gim"), '\\"').replace(new RegExp("'", "gim"), "\\'") : str;
};
// }}}


// {{{ escapeDoubleQuotes
/**
 * escapes double quotes within str
 * @param String str the string to escape the quotes in
 * @param String replace the replace string. default is \"
 * @access public
 * @return void
 */
SRAOS_Util.escapeDoubleQuotes = function(str, replace) {
  return str && str.replace ? str.replace(new RegExp('"', "gim"), replace ? replace : '\\"') : str;
};
// }}}


// {{{ escapeSingleQuotes
/**
 * escapes double quotes within str
 * @param String str the string to escape the quotes in
 * @param String replace the replace string. default is \"
 * @access public
 * @return void
 */
SRAOS_Util.escapeSingleQuotes = function(str, replace) {
  return str && str.replace ? str.replace(new RegExp("'", "gim"), replace ? replace : "\\'") : str;
};
// }}}


// {{{ extractScript
/**
 * used to extract embedded javascript from a string and optionally execute it. 
 * returns the javascript code that was extracted as a string. returns null if 
 * there is no script in 'str'
 * @param String str the string containing the script to extract
 * @param boolean exec whether or not to execute the script that is extracted
 * @param boolean ignoreExceptions whether or not to ignore any exceptions that 
 * are thrown when 'exec' is true
 * @access public
 * @return String
 */
SRAOS_Util.extractScript = function(str, exec, ignoreExceptions) {
  var script = null;
  if (SRAOS_Util.isString(str)) {
    var pieces = str.match(SRAOS_Util.SCRIPT_REGEX);
    if (pieces) {
      script = '';
      for(var i in pieces) {
        script += pieces[i].replace(/(<([^>]+)>)/ig,"") + "\n";
      }
    }
    if (script && exec) {
      if (ignoreExceptions) {
        try {
          eval(script); 
        }
        catch (e) {}
      }
      else {
        eval(script);
      }
    }
  }
  return script;
};
// }}}


// {{{ focusFirstField
/**
 * sets the focus to the first visible field in div. returns true on success 
 * false otherwise
 * @param Object container the xhtml container for the fields
 * @param mixed fieldType if specified, the first field of this type will be 
 * focused (input, select, textarea). if this parameter is an array, this method 
 * will attempt to focus each fieldType in the order specified, and stop when 
 * that field type is found and focused
 * @param Object match hash containing field attribute/value pairs to match. 
 * the first field matching these values will be focused (i.e. 'type': 'file'). 
 * the values in this hash may optionally be arrays where a match will occur if 
 * any value in that array is matched
 * @param boolean matchAll whether or not to match all of the values in 'match'. 
 * if false, only 1 value need match
 * @param boolean caseSensitive whether or not the matching should be case 
 * sensitive
 * @access public
 * @return boolean
 */
SRAOS_Util.focusFirstField = function(container, fieldType, match, matchAll, caseSensitive) {
  var focused = false;
  if (SRAOS_Util.isArray(fieldType)) {
    for(var i in fieldType) {
      if (focused = SRAOS_Util.focusFirstField(container, fieldType[i], match, matchAll, caseSensitive)) { break; }
    }
  }
  else {
    var fields = SRAOS_Util.getFormFields(container);
    if (fields) {
      for(var i in fields) {
        if (!fieldType || fields[i].nodeName && fields[i].nodeName.toLowerCase() == fieldType.toLowerCase()) {
          if ((!fields[i].type || fields[i].type != 'hidden') && !SRAOS_Util.isHidden(fields[i]) && (!match || SRAOS_Util.matchAttrs(fields[i], match, matchAll, caseSensitive))) {
            fields[i].focus();
            if (fields[i].select) {
              SRAOS_Util._tmpFocus = fields[i];
              setTimeout('if (SRAOS_Util._tmpFocus) { SRAOS_Util._tmpFocus.select(); SRAOS_Util._tmpFocus=null; }', 200); 
            }
            focused = true;
            break;
          }
        }
      }
    }
  }
  return focused;
};
// }}}


// {{{ getAbsoluteX
/**
 * returns the window relative x coordinate (the left edge) of obj
 * @param Object obj the xhtml element to return the absolute x coordinate for
 * @return int
 */
SRAOS_Util.getAbsoluteX = function(obj) {
  var x = 0;
  var prevVal = 0;
  while(!obj.tagName || obj.tagName != 'BODY') {
    if (obj.nodeName == 'FORM' || obj.tagName == 'FORM') { obj = obj.parentNode; continue; }
    x += obj.offsetLeft && prevVal != obj.offsetLeft ? obj.offsetLeft : 0;
    x -= obj.scrollLeft ? obj.scrollLeft : 0;
    prevVal = obj.offsetLeft;
    obj = obj.parentNode;
  }
  return x;
};
// }}}


// {{{ getAbsoluteY
/**
 * returns the window relative y coordinate (the top edge) of obj
 * @param Object obj the xhtml element to return the absolute y coordinate for
 * @return int
 */
SRAOS_Util.getAbsoluteY = function(obj) {
  var y = 0;
  var prevVal = 0;
  while(!obj.tagName || obj.tagName != 'BODY') {
    if (obj.nodeName == 'FORM' || obj.tagName == 'FORM') { obj = obj.parentNode; continue; }
    y += obj.offsetTop && prevVal != obj.offsetTop ? obj.offsetTop : 0;
    y -= obj.scrollTop ? obj.scrollTop : 0;
    prevVal = obj.offsetTop;
    obj = obj.parentNode;
  }
  return y;
};
// }}}


// {{{ getArrayKeys
/**
 * returns the keys for an array or object as an Array
 * @param Object obj the array or object to return the keys for
 * @return Array
 */
SRAOS_Util.getArrayKeys = function(obj) {
  var keys = new Array();
  if (obj) {
    for(var i in obj) {
      keys.push(i);
    }
  }
  return keys;
};
// }}}


// {{{ getBrowser
/**
 * returns the current browser identifier. this will be equal to one of the 
 * SRAOS_Util.BROWSER_* values
 * @return int
 */
SRAOS_Util.getBrowser = function() {
  var agt=navigator.userAgent.toLowerCase();
  if (agt.indexOf("opera") != -1) return SRAOS_Util.BROWSER_OPERA;
  if (agt.indexOf("firefox") != -1) return SRAOS_Util.BROWSER_FIREFOX;
  if (agt.indexOf("safari") != -1) return SRAOS_Util.BROWSER_SAFARI;
  if (agt.indexOf("msie") != -1) return SRAOS_Util.BROWSER_IE;
  if (agt.indexOf("netscape") != -1) return SRAOS_Util.BROWSER_NETSCAPE;
  if (agt.indexOf("mozilla/5.0") != -1) return SRAOS_Util.BROWSER_MOZILLA;
  return SRAOS_Util.BROWSER_OTHER;
};
// }}}

// {{{ browser identifiers
SRAOS_Util.BROWSER_FIREFOX = 1;
SRAOS_Util.BROWSER_IE = 2;
SRAOS_Util.BROWSER_MOZILLA = 3;
SRAOS_Util.BROWSER_NETSCAPE = 4;
SRAOS_Util.BROWSER_OPERA = 5;
SRAOS_Util.BROWSER_OTHER = 6;
SRAOS_Util.BROWSER_SAFARI = 7;
/// }}}


// {{{ getDomElements
/**
 * used to retrieve dom elements through downward traversal starting at start. 
 * only those sub-elements with matching match will be returned
 * @param Object start the starting point for the search
 * @param Object match hash containing element attribute/value pairs to match.  
 * the values in this hash may optionally be arrays where a match will occur if 
 * any value in that array is matched. if a match value is null, the element 
 * will match it as long as it contains something for that attribute. if null, 
 * all elements will be returned
 * @param boolean matchAll whether or not to match all of the values in 'match'. 
 * if false, only 1 value need match
 * @param boolean caseSensitive whether or not the matching should be case 
 * sensitive
 * @param int limit an optional limit for the number of elements to return. if 
 * specified, the search will stop and that # of elements will be returned when 
 * limit is reached. if limit is 1, the return value will be a reference to 
 * the first element and NOT an array
 * @param int direction bitmask defining which direction(s) to transcend the 
 * dom in this search. if not specified, SRAOS_Util.GET_DOM_ELEMENTS_DOWN will 
 * be assumed. for more information, see the api documentation for 
 * SRAOS_Util.GET_DOM_ELEMENTS_* below. the transcending order is: Down, Left, 
 * Right, Up
 * @param Object skip hash containing element attribute/value pairs to skip.  
 * the values in this hash may optionally be arrays where a match will occur if 
 * any value in that array is matched. if a match value is null, the element 
 * will match it as long as it contains something for that attribute
 * @param boolean skipAll whether or not to match all of the values in 'skip'. 
 * if false, only 1 value need match
 * @param boolean skipApplyChildren when true, and the direction is DOWN, 'skip' 
 * and 'skipAll' will also be applied to against children and will be used to 
 * determine whether or not child branches should be traversed. if a child 
 * matches a skip constraint, it will not be traversed
 * @access public
 * @return mixed
 */
SRAOS_Util.getDomElements = function(start, match, matchAll, caseSensitive, limit, direction, skip, skipAll, skipApplyChildren) {
  direction = (direction ? direction : SRAOS_Util.GET_DOM_ELEMENTS_DOWN) * 1;
  var elements = null;
  if (start && direction) {
    elements = new Array();
    // Down
    if ((!limit || elements.length < limit) && (direction & (SRAOS_Util.GET_DOM_ELEMENTS_DOWN | SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE))) {
      for(var i=0; i<start.childNodes.length; i++) {
        if (SRAOS_Util.matchAttrs(start.childNodes[i], match, matchAll, caseSensitive) && (!skip || !SRAOS_Util.matchAttrs(start.childNodes[i], skip, skipAll, caseSensitive))) {
          elements.push(start.childNodes[i]);
        }
        if (!(direction & SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE) && (!limit || elements.length < limit) && (!skip || !skipApplyChildren || !SRAOS_Util.matchAttrs(start.childNodes[i], skip, skipAll, caseSensitive))) {
          var children = SRAOS_Util.getDomElements(start.childNodes[i], match, matchAll, caseSensitive, limit ? limit - elements.length : null, (direction & (SRAOS_Util.GET_DOM_ELEMENTS_DOWN | SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE)), skip, skipAll, skipApplyChildren);
          if (children) {
            if (SRAOS_Util.isArray(children)) {
              for(var n=0; n<children.length; n++) {
                elements.push(children[n]);
              }
            }
            else {
              elements.push(children);
            }
          }
        }
        if (limit && elements.length == limit) { break; }
      }
    }
    // Left
    if ((!limit || elements.length < limit) && (direction & SRAOS_Util.GET_DOM_ELEMENTS_LEFT)) {
      var sibling = start;
      do {
        sibling = sibling.previousSibling;
        if (SRAOS_Util.matchAttrs(sibling, match, matchAll, caseSensitive) && (!skip || !SRAOS_Util.matchAttrs(sibling, skip, skipAll, caseSensitive))) {
          elements.push(sibling);
        }
      } while(sibling && (!limit || elements.length < limit));
    }
    // Right
    if ((!limit || elements.length < limit) && (direction & SRAOS_Util.GET_DOM_ELEMENTS_RIGHT)) {
      var sibling = start;
      do {
        sibling = sibling.nextSibling;
        if (SRAOS_Util.matchAttrs(sibling, match, matchAll, caseSensitive) && (!skip || !SRAOS_Util.matchAttrs(sibling, skip, skipAll, caseSensitive))) {
          elements.push(sibling);
        }
      } while(sibling && (!limit || elements.length < limit));
    }
    // Up
    if ((!limit || elements.length < limit) && (direction & SRAOS_Util.GET_DOM_ELEMENTS_UP)) {
      var parent = start;
      do {
        parent = parent.parentNode;
        if (SRAOS_Util.matchAttrs(parent, match, matchAll, caseSensitive) && (!skip || !SRAOS_Util.matchAttrs(parent, skip, skipAll, caseSensitive))) {
          elements.push(parent);
        }
      } while(parent && (!limit || elements.length < limit));
    }
  }
  return limit == 1 && elements && elements.length == 1 ? elements[0] : elements;
};

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * downward
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_DOWN = 1;

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * downward but not recurse past the immediate node children
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE = 2;

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * left (previousSibling)
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_LEFT = 4;

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * right (nextSibling)
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_RIGHT = 8;

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * left and right (both previousSibling and nextSibling)
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_SIDEWAYS = SRAOS_Util.GET_DOM_ELEMENTS_LEFT | SRAOS_Util.GET_DOM_ELEMENTS_RIGHT;

/**
 * 'getDomElements' direction bit identifying that the dom should be transcended 
 * upward
 * @type int
 */
SRAOS_Util.GET_DOM_ELEMENTS_UP = 16;
// }}}


// {{{ getFormFields
/**
 * returns a reference to all of the form field objects in the div specified. 
 * any nested dom 'input', 'select' or 'textarea' element with a 'name' 
 * attribute will be returned
 * @param Object container the container level element of the form fields to 
 * return
 * @param Object skip hash containing element attribute/value pairs of child 
 * container elements in 'container' whose form elements should be skipped
 * @param boolean skipAll whether or not to match all of the values in 'skip'. 
 * if false, only 1 value need match
 * @access public
 * @return Array
 */
SRAOS_Util.getFormFields = function(container, skip, skipAll) {
  var fields = SRAOS_Util.getDomElements(container, { 'nodeName': ['input', 'select', 'textarea'], 'name': null }, true, false, null, SRAOS_Util.GET_DOM_ELEMENTS_DOWN, skip, skipAll, true);
  var results = new Array();
  for(i in fields) {
    results.push(fields[i]);
  }
  return results;
};
// }}}


// {{{ getFormValues
/**
 * returns the form values contained within div as an associative array, where 
 * the key in the array is the form input name, and the value is the current 
 * value of that field. this method works for all form input types (input, 
 * select, multiple select, textarea, checkbox, radio buttons) except file input 
 * fields (these fields are skipped). values for multiple select and duplicate 
 * named checkbox field values will be an array. another way to skip form values 
 * is to set the attribute '_skip' in those fields to true. additionally, 
 * alternative values, including complex data types can be specified for any 
 * field using the attribute '_value' in those fields
 * @param Object container the container level element containing the form 
 * fields to return the values for this method will recursively traverse down 
 * the dom tree for this component using recursion
 * @param Object skip hash containing element attribute/value pairs of child 
 * container elements in 'container' whose form elements should be skipped
 * @param boolean skipAll whether or not to match all of the values in 'skip'. 
 * if false, only 1 value need match
 * @param boolean includeFiles whether or not to include file fields (default is 
 * false)
 * @access public
 * @return Array
 */
SRAOS_Util.getFormValues = function(container, skip, skipAll, includeFiles) {
  var fields = SRAOS_Util.getFormFields(container, skip, skipAll);
  if (fields) {
    var vals = new Array();
    for(var i=0; i<fields.length; i++) {
      // skip files
      if (fields[i]._skip || (!includeFiles && fields[i].type && fields[i].type.toLowerCase() == 'file')) { continue; }
      
      // text
      var val = fields[i]._value ? fields[i]._value : fields[i].value;
      
      // multiple select fields
      if (fields[i].multiple) {
        val = [];
        for(var n=0; n<fields[i].options.length; n++) {
          if (fields[i].options[n].selected) {
            val.push(fields[i].options[n].value);
          }
        }
      }
      // handle php array fields
      var isArray = false;
      var key = fields[i].name;
      if (SRAOS_Util.endsWith(key, '[]')) {
        key = key.substring(0, key.length - 2);
        isArray = fields[i].multiple ? false : true;
      }
      
      // checkbox
      if (fields[i].type && fields[i].type.toLowerCase() == "checkbox" && !fields[i].checked) {
        // remove entity (replace pk with 1 for removal)
        if (SRAOS_Util.endsWith(key, val) && SRAOS_Util.isNumeric(val)) { val = '1'; }
        
        key = key + '_remove';
      }
      
      if (fields[i].type.toLowerCase() != "radio" || fields[i].checked) {
        if (SRAOS_Util.isArray(vals[key])) {
          vals[key].push(val);
        }
        else if (isArray) {
          vals[key] = new Array(val);
        }
        else {
          vals[key] = vals[key] ? new Array(vals[key], val) : val;
        }
      }
    }
    return vals;
  }
  return null;
};
// }}}


// {{{ getInputSelection
/**
 * returns a substring from input. if both start and end are not specified, the 
 * current highlighted text will be returned. null will be returned if the 
 * browser does not support this function
 * @param Object input the input field (input or textarea) to return the 
 * substring or highlighted text from
 * @param int start the starting position. 
 * @param int end the ending position
 * @access public
 * @return String
 */
SRAOS_Util.getInputSelection = function(input, start, end) {
  // Mozilla and compatible
  if (input.setSelectionRange){
    if (!start && !end) {
      start = input.selectionStart;
      end = input.selectionEnd;
    }
    return input.value.substring(start, end);
  }
  // IE and compatible
  else if (document.selection) {
    if (start || end) {
      var range = input.createTextRange(); 
      range.collapse(true); 
      range.moveStart('character', start);
      range.moveEnd('character', end);  
      return range.text;
    }
    else {
      return document.selection.createRange().text;
    }
  }
  // Other broswers can't do it
  else {
    return null;
  }
};
// }}}


// {{{ getNestedProperty
/**
 * returns a nested property of base based on the stack specified. for example, 
 * if base contained a property 'address' that contained a property 'zip', the 
 * zip property could be retrieved where stack = Array('address', 'zip'). if the 
 * property specified is not valid, null will be returned
 * @param Object base the base object containing the property to be returned
 * @param Array stack stack specifying the nested property to return
 * @access public
 * @return mixed
 */
SRAOS_Util.getNestedProperty = function(base, stack) {
  var obj = base;
  for(var i in stack) {
    obj = SRAOS_Util.isObject(obj) ? obj[stack[i]] : null;
  }
  return obj != undefined ? obj : null;
};
// }}}


// {{{ getLength
/**
 * returns the length of obj which is either the array length or the # of 
 * properties it contains if it is an object
 * @param Object obj the array or object to return the length for
 * @return int
 */
SRAOS_Util.getLength = function(obj) {
  var length = 0;
  if (obj) {
    for(var i in obj) {
      length++;
    }
  }
  return length;
};
// }}}


// {{{ getSelectValue
/**
 * returns the value(s) selected in the select field specified
 * @param Object field a reference to the select field
 * @param boolean multiple whether or not to check for multiple selected values
 * if true, the return value will be any array
 * @param boolean text whether or not to return the option text instead of value 
 * (by default the value is returned)
 * @access public
 * @return mixed
 */
SRAOS_Util.getSelectValue = function(field, multiple, text) {
  if (field && field.options) {
    if (!multiple) {
      return field.selectedIndex >=0 ? field.options[field.selectedIndex][text ? 'text' : 'value'] : null;
    }
    else {
      var values = new Array();
      for(var i in field.options) {
        if (field.options[i].selected) {
          values.push(field.options[i][text ? 'text' : 'value']);
        }
      }
      return values;
    }
  }
  else {
    return null;
  }
};
// }}}


// {{{ getXmlHttpObject
/**
 * a cross browser compatible method of retrieving a reference to an 
 * XMLHttpRequest object that can be used to invoke an ajax request
 * @param Function handler the method that should be invoked when the request 
 * is completed. required only if invocation is asynchronous
 * @access public
 * @return XMLHttpRequest
 */
SRAOS_Util.getXmlHttpObject = function(handler) { 
  var objXmlHttp=null;

  if (navigator.userAgent.indexOf("MSIE")>=0) { 
    var strName="Msxml2.XMLHTTP";
    if (navigator.appVersion.indexOf("MSIE 5.5")>=0) {
      strName="Microsoft.XMLHTTP";
    } 
    try { 
      objXmlHttp=new ActiveXObject(strName);
      if (handler) {
        objXmlHttp.onreadystatechange=handler;
      }
      return objXmlHttp;
    } 
    catch(e) { 
      return null;
    }
  } 
  if (navigator.userAgent.indexOf("Mozilla")>=0) {
    objXmlHttp=new XMLHttpRequest();
    if (handler) {
      objXmlHttp.onload=handler;
      objXmlHttp.onerror=handler;
    }
    return objXmlHttp;
  }
};
// }}}


// {{{ hideScrollbars
/**
 * hides any scrollbars in component or any of its children. 
 * @param Object component the dom object to hide the scrollbars in
 * @param boolean skipLevel whether or not to skip this level and just proceed 
 * with evaluating the children
 * @access public
 * @return void
 */
SRAOS_Util.hideScrollbars = function(component, skipLevel) {
  if (!skipLevel && component.nodeName && component.nodeName.toLowerCase() == 'select' && component.size > 1) {
    component._showScrollbarsSize = component.size;
    component.size = component.options.length;
    component.style.height = '0px';
  }
  else if (!skipLevel && component.style && (component.offsetHeight && component.scrollHeight && component.scrollHeight > component.offsetHeight) || (component.offsetWidth && component.scrollWidth && component.scrollWidth > component.offsetWidth)) {
    component._showScrollbars = component.style.overflow ? component.style.overflow : 'auto';
    component.style.overflow = "hidden";
  }
  if (component.childNodes && component.childNodes.length > 0) {
    for(var i=0; i<component.childNodes.length; i++) {
      SRAOS_Util.hideScrollbars(component.childNodes[i]);
    }
  }
};
// }}}


// {{{ inArray
/**
 * Checks if a value exists in an array
 * @param mixed needle the value to search for
 * @param Array haystack the array to search in
 * @param String property if the needle and values in haystack are objects, this 
 * value may be specified which is the property to use for comparisons between 
 * those objects
 * @access public
 * @return boolean
 */
SRAOS_Util.inArray = function(needle, haystack, property) {
  for(var i in haystack) {
    if ((property && haystack[i] && haystack[i][property] && needle && needle[property] && haystack[i][property] == needle[property]) || (!property && (haystack[i] == needle || (needle && needle.equals && haystack[i] && haystack[i].equals && haystack[i].equals(needle))))) {
      return true;
    }
  }
  return false;
};
// }}}


// {{{ include
/**
 * imports a javascript source file
 * @param String src the source file to import
 * @access public
 * @return void
 */
SRAOS_Util.include = function(src) {
  var xmlHttp = SRAOS_Util.getXmlHttpObject();
  xmlHttp.open("GET", src, false);
  xmlHttp.send('');
  eval(xmlHttp.responseText);
};
// }}}


// {{{ isArray
/**
 * tests if val is an array
 * @param Object val the value to test
 * @access public
 * @return boolean
 */
SRAOS_Util.isArray = function(val) {
  if (!SRAOS_Util.isString(val)) {
    var nextPos = 0;
    var started = false;
    for(var i in val) {
      started = true;
      if (nextPos != i) {
        return false;
      }
      nextPos++;
    }
    if (started || (val && val.length === 0)) {
      return true;
    }
  }
  return false;
};
// }}}


// {{{ isDirty
/**
 * checks if any form elements within top have been modified since 
 * SRAOS_Util.setDirtyFlags was last invoked for it
 * @param Object top the top level element containing the form fields to check 
 * dirty flags for. alternatively, this can be the field object itself
 * @param String name the name of the field to exclusively check. if not 
 * specified, the entire form will be checked.
 * @access public
 * @return boolean
 */
SRAOS_Util.isDirty = function(top, name) {
  if (top && top._dirtyFlags) {
    var fields = SRAOS_Util.getFormFields(top);
    var vals = SRAOS_Util.getFormValues(top);
    var count = 0;
    for(var i=0; i<fields.length; i++) {
      if (vals[fields[i].name]) {
        var compare = typeof(top._dirtyFlags[fields[i].name]) == "object" ? SRAOS_Util.serialize(top._dirtyFlags[fields[i].name]) : top._dirtyFlags[fields[i].name];
        var val = typeof(vals[fields[i].name]) == "object" ? SRAOS_Util.serialize(vals[fields[i].name]) : vals[fields[i].name];
        if (compare != val && (!name || name == fields[i].name)) {
          // alert(i + " is dirty (" + compare + " != " + val + ")");
          return true;
        }
        else if (name == fields[i].name) {
          return false;
        }
        count++;
      }
    }
    if (name || top._dirtyFlagCount != count) { return true; }
  }
  return false;
};
// }}}


// {{{ isHidden
/**
 * returns true if 'component' is hidden itself or somewhere above it. it is 
 * assumed to be hidden is it (or any of its' parents) has style display=='none' 
 * or visibility=='hidden'
 * @param Object component the component to check
 * @access public
 * @return boolean
 */
SRAOS_Util.isHidden = function(component) {
  while(component) {
    if (component.style && (component.style.display == 'none' || component.style.visibility == 'hidden')) { return true; }
    component = component.parentNode;
  }
  return false;
};
// }}}


// {{{ isHtml
/**
 * returns true if str is html formatted. it performs a very simple test, simply
 * checking if str contains both < and >
 * @param String str the value to test
 * @access public
 * @return boolean
 */
SRAOS_Util.isHtml = function(str) {
  return SRAOS_Util.isString(str) && str.indexOf('<') != -1 && str.indexOf('>') != -1;
};
// }}}


// {{{ isNumeric
/**
 * tests if val is numeric
 * @param Object val the value to test
 * @access public
 * @return boolean
 */
SRAOS_Util.isNumeric = function(val) {
  return val === 0 || (val && val !== null && val !== undefined && val * 1 == (val * 2)/2);
};
// }}}


// {{{ isObject
/**
 * tests if obj is an object
 * @param Object obj the object to test
 * @access public
 * @return boolean
 */
SRAOS_Util.isObject = function(obj) {
  return typeof(obj) == "object";
};
// }}}


// {{{ isString
/**
 * tests if str is a String object
 * @param Object str the string to test
 * @access public
 * @return boolean
 */
SRAOS_Util.isString = function(str) {
  return typeof(str) == "string";
};
// }}}


// {{{ isTextField
/**
 * returns true if 'field' is an input text box or a textarea
 * @param Object field the field to check
 * @access public
 * @return boolean
 */
SRAOS_Util.isTextField = function(field) {
  return field && (field.nodeName && ((field.nodeName.toLowerCase() == 'input' && (!field.type || field.type.toLowerCase() == 'text')) || field.nodeName.toLowerCase() == 'textarea'));
};
// }}}


// {{{ match
/**
 * an extension of the String 'match' function with the following parameters
 * @param String str the string to match. if this is not a string, false will be 
 * returned
 * @param mixed match the match pattern OR an array of match patterns OR a 
 * single comparison string OR an array of comparison strings OR a mixed array 
 * containing both patterns and comparison strings. returns true if 1 or more of 
 * the patterns match or comparison strings equal 'str'
 * @param boolean caseSensitive for comparison strings ONLY, whether or not that
 * comparison should be case sensitive
 * @access public
 * @return boolean
 */
SRAOS_Util.match = function(str, match, caseSensitive) {
  var matched = false;
  if (!SRAOS_Util.isArray(match)) { match = [ match ]; }
  if (str && str.match) {
    for(var i in match) {
      if (matched = ((typeof(match[i]) == 'function' || typeof(match[i]) == 'object') && str.match(match[i])) || (SRAOS_Util.isString(match[i]) && ((caseSensitive && str == match[i]) || (!caseSensitive && str.toLowerCase() == match[i].toLowerCase())))) {
        break; 
      }
    }
  }
  return matched;
};
// }}}


// {{{ matchAttrs
/**
 * checks if a dom element contains the match attributes/values specified
 * @param Object element the dom element to match against
 * @param Object match hash containing element attribute/value pairs to match.  
 * the values in this hash may optionally be arrays where a match will occur if 
 * any value in that array is matched. if a match value is null, the element 
 * will match it as long as it contains something for that attribute. if null, 
 * the return value will be true if element is something (not null/false/0/etc.)
 * if the value is a regular expression, the match will occur if the element 
 * attribute value is present and matches that regular expression. alternatively
 * match may be an array of regular expressions or an array of fixed strings, or 
 * a mixed array containing both regular expressions and fixed strings
 * @param boolean matchAll whether or not to match all of the values in 'match'. 
 * if false, only 1 value need match
 * @param boolean caseSensitive whether or not the matching should be case 
 * sensitive
 * @access public
 * @return boolean
 */
SRAOS_Util.matchAttrs = function(element, match, matchAll, caseSensitive) {
  var matched = element ? true : false;
  if (element && match) {
    matched = matchAll;
    var compare;
    for(var i in match) {
      var isMatch = (match[i] == null && element[i]) || SRAOS_Util.match(element[i], match[i], caseSensitive);
      if (matchAll && !isMatch) {
        matched = false;
        break;
      }
      else if (!matchAll && isMatch) {
        matched = true;
        break;
      }
    }
  }
  return matched;
};
// }}}


// {{{ objToStr
/**
 * converts an object to a string for debugging purposes
 * @param Object obj the object to convert
 * @param boolean recursive whether or not this method should be recursively 
 * applied
 * @param Array skip an array of keys that should be skipped
 * @param String spaces leading spaces
 * @access public
 * @return String
 */
SRAOS_Util.objToStr = function(obj, recursive, skip, spaces) {
  var str = '';
  var spaces = spaces ? spaces : '';
  if (typeof(obj) == 'object') {
    if (!recursive || !SRAOS_Util.inArray(obj, SRAOS_Util.objToStrStack)) {
      if (recursive) { SRAOS_Util.objToStrStack.push(obj); }
      for(var i in obj) {
        if (typeof(obj[i]) == 'function' || SRAOS_Util.inArray(obj[i], SRAOS_Util.objToStrStack) || (skip && SRAOS_Util.inArray(i, skip))) { continue; }
        str += i + '=' + (obj[i] && obj[i].getPHPDate ? obj[i].getPHPDate('Y-m-d H:i:s') : (recursive && typeof(obj[i]) == 'object' ? SRAOS_Util.objToStr(obj[i], recursive, skip, spaces + '  ') : (obj[i] && obj[i].toString ? obj[i].toString() : null))) + '\n';
      }
      if (recursive) { SRAOS_Util.objToStrStack = SRAOS_Util.removeFromArray(obj, SRAOS_Util.objToStrStack); }
    }
    else {
      str += '***recursion***';
    }
  }
  else {
    str += obj;
  }
  return str;
};
// }}}


// {{{ prefixIds
/**
 * prefixes the ids in content with prefix
 * @param String content the content with the ids to prefix
 * @param String prefix the prefix to use
 * @access public
 * @return String
 */
SRAOS_Util.prefixIds = function(content, prefix) {
  if (SRAOS_Util.isString(content)) {
    content = content.replace(new RegExp('id="', "gim"), 'id="' + prefix);
    content = content.replace(new RegExp("id='", "gim"), "id='" + prefix);
    content = content.replace(new RegExp('for="', "gim"), 'for="' + prefix);
    content = content.replace(new RegExp("for='", "gim"), "for='" + prefix);
    content = content.replace(new RegExp('ById\\("', "gim"), 'ById("' + prefix);
    content = content.replace(new RegExp("ById\\('", "gim"), "ById('" + prefix);
  }
  return content;
};
// }}}


// {{{ randomInt
/**
 * returns a random # between min and max
 * @param int min the min value in the range
 * @param int max the max value in the range
 * @access public
 * @return String
 */
SRAOS_Util.randomInt = function(min, max) {
  var num = Math.round(Math.random() * max);
  return num < min ? SRAOS_Util.randomInt(min, max) : num;
};
// }}}


// {{{ removeFromArray
/**
 * removes all instances of needle from haystack and returns a new Array 
 * instance with it removed
 * @param mixed needle the value to search for
 * @param Array haystack the array to search in
 * @param int limit the max # of removals. if not specified, all needles will be 
 * removed
 * @param String property if needle and the items contained in haystack are 
 * objects or associative arrays, this parameter can be specified to be used to 
 * determine equality between different arrays/objects. if specified, the 
 * properties will be compared instead of the instance references
 * @param boolean needleIsKey whether or not needle is a key value in haystack 
 * to remove (either a numerical index for arrays or a associative key for 
 * hashes)
 * @access public
 * @return Array
 */
SRAOS_Util.removeFromArray = function(needle, haystack, limit, property, needleIsKey) {
  var isArray = SRAOS_Util.isArray(haystack);
  var arr = new Array();
  var count = 0;
  for(var i in haystack) {
    if (((needleIsKey && i == needle) || (!needleIsKey && (haystack[i] == needle || (property && needle[property] && haystack[i][property] && needle[property] == haystack[i][property])))) && (!limit || count < limit)) {
      count++;
    }
    else {
      isArray ? arr.push(haystack[i]) : arr[i] = haystack[i];
    }
  }
  return arr;
};
// }}}


// {{{ removeOptionFromSelectField
/**
 * removes an option from an select field
 * @param Object field the select field to remove the option from
 * @param mixed either the value of the option to remove or the actual option 
 * to remove
 * @access public
 * @return void
 */
SRAOS_Util.removeOptionFromSelectField = function(field, value) {
  for (var i=0; i<field.length; i++) {
    if (field.options[i] == value || field.options[i].value == value) {
      field.remove(i);
      break;
    }
  }
};
// }}}


// {{{ serialize
/**
 * serializes obj into a single-line, quote-escaped code string that can be 
 * eval'd or imbedded into javascript code
 * @param Object obj the object to serialize. this may be a scalar or object 
 * value
 * @access public
 * @return String
 */
SRAOS_Util.serialize = function(obj) {
  var str = "";
  if (typeof(obj) == 'function') { return str; }
  
  if (SRAOS_Util.isArray(obj)) {
    str = "[";
    for(var i=0; i<obj.length; i++) {
      str += str == "[" ? "" : ", ";
      str += SRAOS_Util.serialize(obj[i]);
    }
    str += "]";
  }
  else if (typeof(obj) == "object") {
    str = "{ ";
    for(var i in obj) {
      if (typeof(obj[i]) == 'function') { continue; }
      str += str == "{ " ? "" : ", ";
      str += (SRAOS_Util.isNumeric(i) ? i : '"' + SRAOS_Util.escapeQuotes(i) + '"') + ': ' + SRAOS_Util.serialize(obj[i]);
    }
    str += " }";
  }
  else {
    if (obj === true) {
      str = 'true';
    }
    else if (obj === false) {
      str = 'false';
    }
    else if (obj === null) {
      str = 'null';
    }
    else {
      str = SRAOS_Util.isNumeric(obj) ? (obj ? obj : '0') : 'SRAOS_Util.unserialize("' + (SRAOS_Util.isString(obj) ? obj.replace(new RegExp("\n", "gim"), "#nl#").replace(new RegExp('"', "gim"), "#qt#").replace(new RegExp("'", "gim"), "#sqt#") : obj) + '")';
    }
  }
  return str;
};
// }}}


// {{{ serializeDirtyFlags
/**
 * serializes the dirty flags for top and returns the serialized value as a 
 * string
 * @param Object top the element containing the dirty flags
 * @access public
 * @return String
 */
SRAOS_Util.serializeDirtyFlags = function(top) {
  var str = "";
  if (top._dirtyFlags) {
    str = '{ "count": ' + top._dirtyFlagCount + ', "flags": { ';
    var started = false;
    for(var i in top._dirtyFlags) {
      str += started ? ", " : "";
      str += (SRAOS_Util.isNumeric(i) ? i : '"' + SRAOS_Util.escapeQuotes(i) + '"') + ': ' + SRAOS_Util.serialize(top._dirtyFlags[i]);
      started = true;
    }
    str += " }} ";
  }
  return str;
};
// }}}


// {{{ serializeFields
/**
 * returns a serialization code frament containing the current form state of top
 * the form state can be restored using this code and the 
 * SRAOS_Util.unserializeFields method
 * @param Object top the element containing the fields to serialize the state of
 * @access public
 * @return String
 */
SRAOS_Util.serializeFields = function(top) {
  var str = "";
  var vals = SRAOS_Util.getFormValues(top);
  var started = false;
  for(var i in vals) {
    str += started ? ", " : "";
    str += (SRAOS_Util.isNumeric(i) ? i : '"' + SRAOS_Util.escapeQuotes(i) + '"') + ': ' + (SRAOS_Util.isNumeric(vals[i]) ? vals[i] : SRAOS_Util.serialize(vals[i]));
    started = true;
  }
  return str;
};
// }}}


// {{{ setDirtyFlags
/**
 * sets dirty flags on all input elements within top. the dirty flags can later 
 * be set using SRAOS_Util.isDirty
 * @param Object top the top level element containing the form fields to set the 
 * dirty flags for
 * @param String name the name of a field that the dirty flag should be 
 * exclusively set for. if not specified, all fields within top will have their 
 * dirty flags set
 * @access public
 * @return void
 */
SRAOS_Util.setDirtyFlags = function(top, name) {
  top._dirtyFlags = new Array();
  top._dirtyFlagCount = 0;
  var fields = SRAOS_Util.getFormFields(top);
  var vals = SRAOS_Util.getFormValues(top);
  for(var i=0; i<fields.length; i++) {
    if ((!name || name == fields[i].name) && vals[fields[i].name]) {
      top._dirtyFlags[fields[i].name] = vals[fields[i].name];
      top._dirtyFlagCount++;
    }
  }
};
// }}}


// {{{ setInputSelection
/**
 * sets the selection range (highlighted text) within an input field (input or 
 * textarea). if start and end are the same value or end is not specified, the 
 * cursor will be moved to that position. returns true on success, false 
 * otherwise
 * @param Object input the input field (input or textarea) to set the selection 
 * area in
 * @param int start the starting cursor position
 * @param int end the end cursor position
 * @access public
 * @return boolean
 */
SRAOS_Util.setInputSelection = function(input, start, end) {
  end = end ? end : start;
  try {
    if (input.setSelectionRange) {  
      input.setSelectionRange(start, end); 
    } 
    else if (input.createTextRange) { 
      var range = input.createTextRange(); 
      range.collapse(true); 
      range.moveStart('character', start);
      range.moveEnd('character', end);  
      range.select(); 
    }
    else {
      return false;
    }
  }
  catch (e) { 
    return false;
  }
  return true;
};
// }}}


// {{{ setSelectValue
/**
 * selects the value(s) specified within the select field. returns true on 
 * success, false otherwise
 * @param Object field a reference to the select field
 * @param mixed value the value(s) to selects. if this is any array, all options 
 * in the select field with matching values will be selected
 * @access public
 * @return boolean
 */
SRAOS_Util.setSelectValue = function(field, value) {
  var results = false;
  if (field && field.options) {
    var arr = SRAOS_Util.isArray(value);
    for(var i in field.options) {
      if (field.options[i] && ((!arr && (field.options[i].value == value || ((field.options[i].value == '' || field.options[i].value == 'NULL') && value == null))) || (arr && SRAOS_Util.inArray(field.options[i].value, value)))) {
        field.options[i].selected = true;
        results = true;
      }
      else if (field.options[i]) {
        field.options[i].selected = false;
      }
    }
  }
  return results;
};
// }}}


// {{{ showScrollbars
/**
 * shows any scrollbars previously hidden through the "hideScrollbars" method in 
 * component or any of its children. 
 * @param Object component the dom object to show the scrollbars in
 * @param boolean skipLevel whether or not to skip this level and just proceed 
 * with evaluating the children
 * @access public
 * @return void
 */
SRAOS_Util.showScrollbars = function(component, skipLevel) {
  if (!skipLevel && component.style && component._showScrollbars) {
    component.style.overflow = component._showScrollbars;
    if (component.onscroll) { component.onscroll(); }
    component._showScrollbars = null;
  }
  else if (!skipLevel && component._showScrollbarsSize) {
    component.size = component._showScrollbarsSize;
    component._showScrollbarsSize = null;
    component.style.height = 'auto';
  }
  if (component.childNodes && component.childNodes.length > 0) {
    for(var i=0; i<component.childNodes.length; i++) {
      SRAOS_Util.showScrollbars(component.childNodes[i]);
    }
  }
};
// }}}


// {{{ sort
/**
 * Used to sort objects based on an attribute or method that they each contain. 
 * if all of the values are numeric (or false/null), the sort will be numeric 
 * also, if any of them are not, the sort will be alphabetical
 * @param Object[] objects the objects to sort
 * @param String attr the name of the attr or function in 'objects' to sort on
 * @param String desc set to true to sort in descending order (default is asc)
 * @return Object[]
 */
SRAOS_Util.sort = function(objects, attr, desc) {
  var numeric = true;
  var sortVals = new Array();
  for(var i in objects) {
    var val = objects[i] && objects[i][attr] ? (typeof(objects[i][attr]) == 'function' ? objects[i][attr]() : objects[i][attr]) : '__unknown__';
    if (!SRAOS_Util.isNumeric(val)) { numeric = false; }
    sortVals.push(val);
  }
  for(var i in sortVals) {
    sortVals[i] = sortVals[i] == '__unknown__' ? (numeric ? 0 : '') : (numeric ? sortVals[i] * 1 : sortVals[i]);
  }
  numeric ? sortVals.sort(function(a, b) { return a - b; }) : sortVals.sort();
  if (desc) { sortVals.reverse(); }
  
  var sorted = new Array();
  var added = new Array();
  for(var i in sortVals) {
    for(var n in objects) {
      if (!added[n]) {
        var val = objects[n] && objects[n][attr] ? (typeof(objects[n][attr]) == 'function' ? objects[n][attr]() : objects[n][attr]) : (numeric ? 0 : '');
        if (numeric) { val *= 1; }
        if (val == sortVals[i]) {
          sorted.push(objects[n]);
          added[n] = true;
        }
      }
    }
  }
  
  return sorted;
};
// }}}


// {{{ stripScript
/**
 * removes any imbedded javascript in 'str' and returns the cleaned string
 * @param String str the string containing the script to strip
 * @access public
 * @return String
 */
SRAOS_Util.stripScript = function(str) {
  return SRAOS_Util.isString(str) ? str.replace(SRAOS_Util.SCRIPT_REGEX, '') : str;
};
// }}}


// {{{ substituteParams
/**
 * substitutes param keys in str with their corresponding values in params where 
 * the key format is "{$[key]}" (without the quotes)
 * @param String str the string to substitute the params in
 * @param Object params the params hash - key/value pairs to substitute in str
 * @param String prefix each key in params will be prefixed with this value
 * @param boolean useBrackets whether or not to use [] instead of {}
 * @access public
 * @return String
 */
SRAOS_Util.substituteParams = function(str, params, prefix, useBrackets) {
  if (!prefix) { prefix = ''; }
  if (params) {
    for(var key in params) {
      str = str.replace(new RegExp("\\" + (useBrackets ? '[' : '{') + "\\$" + prefix + key + "\\" + (useBrackets ? ']' : '}') + "", "gim"), params[key]);
    }
  }
  return str;
};
// }}}


// {{{ textToHtml
/**
 * html formats the string str if it is not already in html format
 * @param String str the string to format
 * @access public
 * @return String
 */
SRAOS_Util.textToHtml = function(str) {
  return SRAOS_Util.isString(str) && !SRAOS_Util.isHtml(str) ? str.replace(new RegExp("\n", "gim"), "<br />\n") : str;
};
// }}}


// {{{ trim
/**
 * trims any leading or trailing whitespace in str
 * @param String str the string to trim
 * @access public
 * @return String
 */
SRAOS_Util.trim = function(str) {
  return str.replace ? str.replace(/^\s+/g, '').replace(/\s+$/g, '') : str;
};
// }}}


// {{{ unserialize
/**
 * unencodes quotes
 * @param String str the string to unencode
 * @access public
 * @return void
 */
SRAOS_Util.unserialize = function(str) {
  return SRAOS_Util.isString(str) ? str.replace(new RegExp("#nl#", "gim"), "\n").replace(new RegExp('#qt#', "gim"), '"').replace(new RegExp("#sqt#", "gim"), "'") : str;
};
// }}}


// {{{ unserializeDirtyFlags
/**
 * restores the dirty flags to top from serialized
 * @param Object top the element containing to set the dirty flags to
 * @param String serialized the serialized form of the dirty flags
 * @access public
 * @return void
 */
SRAOS_Util.unserializeDirtyFlags = function(top, serialized) {
  if (serialized) {
    top._dirtyFlagCount = serialized.count;
    top._dirtyFlags = serialized.flags;
  }
};
// }}}


// {{{ unserializeFields
/**
 * returns the form fields in top to the state represented by serialized
 * @param Object top the element containing the fields to restore
 * @param Object serialized the serialized state of the form as returned by 
 * SRAOS_Util.serializeFields
 * @access public
 * @return void
 */
SRAOS_Util.unserializeFields = function(top, serialized) {
  var fields = SRAOS_Util.getFormFields(top);
  for(var i=0; i<fields.length; i++) {
    if (serialized[fields[i].name]) {
      
      // multiple select fields
      if (fields[i].multiple) {
        var val = new Array();
        for(var n=0; n<fields[i].options.length; n++) {
          var selected = false;
          for(var m in serialized[fields[i].name]) {
            if (serialized[fields[i].name][m] == fields[i].options[n].value) {
              selected = true;
              break;
            }
          }
          fields[i].options[n].selected = selected;
        }
      }
      // radio button/checkbox
      else if (fields[i].type && (fields[i].type.toLowerCase() == "radio" || fields[i].type.toLowerCase() == "checkbox")) {
        serialized[fields[i].name] = typeof(serialized[fields[i].name]) == "object" ? serialized[fields[i].name] : new Array(serialized[fields[i].name]);
        var checked = false;
        for(var m in serialized[fields[i].name]) {
          if (serialized[fields[i].name][m] == fields[i].value) {
            checked = true;
            break;
          }
        }
        fields[i].checked = checked;
      }
      // other
      else {
        fields[i].value = serialized[fields[i].name];
      }
    }
    else {
      fields[i].value = null;
    }
  }
};
// }}}


// {{{ urlEncode
/**
 * encodes a string for insertion into a url (same as the PHP urlencode 
 * function)
 * @param String str the string to encode
 * @access public
 * @return String
 */
SRAOS_Util.urlEncode = function(str) {
  if (!str.replace) {
    return str;
  }
  str = escape(str);
  str = str.replace(new RegExp('\\+', "gim"), '%2B');
  str = str.replace(new RegExp('\\/', "gim"), '%2F');
  return str;
};


/**
 * used to avoid recursion in the SRAOS_Util.objToStr method
 * @type Array
 */
SRAOS_Util.objToStrStack = new Array();
// }}}


// {{{ validateEmail
/**
 * used to validate an email address. returns true if it is valid, false 
 * otherwise
 * @param String email the email address to validate
 * @access public
 * @return boolean
 */
SRAOS_Util.validateEmail = function(email) {
  var emailPat=/^(.+)@(.+)$/;
  var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
  var validChars="\[^\\s" + specialChars + "\]";
  var quotedUser="(\"[^\"]*\")";
  var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
  var atom=validChars + '+';
  var word="(" + atom + "|" + quotedUser + ")";
  var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
  var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");
  var matchArray=email.match(emailPat);
  if (matchArray==null) { return false; }
  var user=matchArray[1];
  var domain=matchArray[2];

  if (user.match(userPat)==null) { return false; }

  var IPArray=domain.match(ipDomainPat);
  if (IPArray!=null) {
	  for (var i=1;i<=4;i++) {
	    if (IPArray[i]>255) { return false; }
    }
    return true;
  }

  var domainArray=domain.match(domainPat);
  if (domainArray==null) { return false; }

  var atomPat=new RegExp(atom,"g");
  var domArr=domain.match(atomPat);
  var len=domArr.length;
  if (domArr[domArr.length-1].length<2 || domArr[domArr.length-1].length>3) { return false; }

  if (len<2) { return false; }
  
  return true;
};
// }}}


/**
 * the regular expression to use to retrieve <script> contents
 * @type string
 */
SRAOS_Util.SCRIPT_REGEX = new RegExp("<script[^>]*>[^<]*<\/script>", "gi");

