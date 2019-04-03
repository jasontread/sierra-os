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

// {{{ SRAOS_EntityDisplAttr
/**
 * defines an attribute that should be included in the display of an entity in 
 * the search results view
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
SRAOS_EntityDisplAttr = function(id, label, sort, sortable) {
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
   * the string that should be used as a header for this 
   * attribute. this value will only be used if a _headerCallback is not 
   * specified for its entity. for global services either the _headerCallback or 
   * this value MUST be specified. for non-global services, if neither are 
   * specified, the default entity label will be used
   * @type string
   */
  this._label = label;
  
  /**
   * the default sort method to apply for this attribute. this value will only 
   * be used if a _sortCallback is not specified for the entity. it should be 
   * equal to SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_ASC or 
   * SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_DESC
   * @type int
   */
  this._sort = sort;
  
  /**
   * whether or not this attribute should be sortable. if specified, this value 
   * will override the sortable flag in the enclosing entity element
   * @type boolean
   */
  this._sortable = sortable;
	
  // }}}
  
  // {{{ Operations
  
  
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
  
	// {{{ getLabel
	/**
	 * returns the label of this object
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
  
	// {{{ getSort
	/**
	 * returns the sort of this object
   * @access  public
	 * @return string
	 */
	this.getSort = function() {
		return this._sort;
	};
	// }}}
  
	// {{{ isSortable
	/**
	 * returns the sortable of this object
   * @access  public
	 * @return string
	 */
	this.isSortable = function() {
		return this._sortable;
	};
	// }}}
	
  
  // private operations

};
// }}}
