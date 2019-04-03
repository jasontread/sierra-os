// {{{ Header
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
// }}}

// {{{ Imports

// }}}

// {{{ Constants

// }}}

// {{{ SRAOS_EntitySearchAttr
/**
 * defines a single constraint that should be applied when a search is invoked. 
 * for non-global services these are the names of the attributes within the 
 * entity that should be included in the search. this element is NOT used for 
 * global services.
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
SRAOS_EntitySearchAttr = function(id, matchRegex, operator) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the name of the attribute as specified in the entity model for non-global 
   * ajax services or internally for global ones
	 * @type string
	 */
	this._id = id;
  
  /**
   * a regular expression that must match the search term in order for this 
   * attribute to be added to the search constraints/params. if the search term 
   * does not match this expression, this attribute will be exclude from the 
   * service invocation
   * @type string
   */
  this._matchRegex = matchRegex;
  
  /**
   * the operator to apply between the search term and this attribute. this 
   * value will correspond with one ore more of the
   * SRA_AjaxConstraint::operator constraint bit values. the default is "32" 
   * which signifies that the search term must exist at least once within the 
   * attribute value for each entity in order for this constraint to match
   * @type int
   */
  this._operator = operator;
	
  // }}}
  
  // {{{ Operations
	
  
  // public operations

	// {{{ includeInSearch
	/**
	 * returns true if this search attribute should be included in a search 
   * invocation. the method response will be based on the values of search and 
   * this._matchRegex
   * @param String search the search term to evaluate
   * @access  public
	 * @return boolean
	 */
	this.includeInSearch = function(search) {
    search = !SRAOS_Util.isString(search) ? search + "" : search;
		return !this._matchRegex || search.search(new RegExp(this._matchRegex)) != -1;
	};
	// }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this object
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getMatchRegex
	/**
	 * returns the matchRegex of this object
   * @access  public
	 * @return string
	 */
	this.getMatchRegex = function() {
		return this._matchRegex;
	};
  // }}}
  
	// {{{ getOperator
	/**
	 * returns the operator of this object
   * @access  public
	 * @return string
	 */
	this.getOperator = function() {
		return this._operator;
	};
	// }}}
	
  // private operations
  
};
// }}}
