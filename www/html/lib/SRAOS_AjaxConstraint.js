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

// {{{ SRA_AjaxConstraint
/**
 * used to add a service request filtering constraint
 * 
 * @param String attr the constraint attribute (required)
 * @param String value the constraint value
 * @param String operator the operator. default is 1 (equal)
 * @param String attrType the attribute type identifier. default is 
 * CONSTRAINT_TYPE_ATTR
 * @param String valueType the constraint value type. default is null (value is 
 * an explicit value)
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_AjaxConstraint = function(attr, value, operator, attrType, valueType) {
  // {{{ Attributes
  // public attributes
	
  /**
	 * the constraint attribute identifier (see attrType for more info). 
   * if attrType is specified, and the attr desired is part of an entity within 
   * that type, then the attr and attribute can be separated by a '.'. for 
   * example, if the attr-type was "global" and there existed an User object 
   * within the globals indexed under the key "user", and the actual attr 
   * desired was the "uid" attribute of that object, the attr value would be 
   * "user.uid". the "uid" portion will then be passed to the "getAttribute" 
   * method of the User object
	 * @type string
	 */
	this.attr = attr;
  
  /**
	 * defines where the attribute to be constrained exists. only entity instances 
   * that exist where this constraint is true will be included in the service 
   * output. following is a definition of the applicable types:
   *
   *  attr:    attr is the name of an attribute in the entity
   *  get:     attr is the name of a value in the get headers
   *  global:  attr is the name of a php global variable
   *  post:    attr is the name of a value in the post headers
   *  session: attr is the name of a session variable
   *            
   * both attr and col are converted to sql constraints
	 * @type string
	 */
	this.attrType = attrType;
  
  /**
	 * a bitmask containing one or more of the following operator values. this 
   * define how attr and value should be compared:
   *
   *   EQUALITY CONSTRAINTS
   *   1:   attr and value must be equal
   *   2:   attr is greater than value
   *   4:   attr is less than value
   *   
   *   STRING CONSTRAINTS (only 1 constraint allowed if used)
   *   8:   attr starts with value
   *   16:  attr ends with value
   *   32:  attr is a sub-string of value (full text search)
   *   
   *   SORTING CONSTRAINTS
   *   64:  sort the results by attr in ascending order
   *   128: sort the results by attr in descending order
   *   
   *   NEGATE BIT
   *   256: negate the results of any of the above operator constraints
	 * @type int
	 */
	this.operator = operator;
  
  /**
	 * the constraint value or value identifier if value-type is specified. if 
   * valueType is specified, and the value desired is part of an entity within 
   * that type, then the key and attribute can be separated by a '.'. for 
   * example, if the value-type was "global" and there existed an User object 
   * within the globals indexed under the key "user", and the actual value 
   * desired was the "uid" attribute of that object, the value would be 
   * "user.uid". the "uid" portion will then be passed to the "getAttribute" 
   * method of the User object
	 * @type string
	 */
	this.value = value;
  
  /**
	 * if the value for this constraint is not provided explicitely in the value 
   * attribute above (the default behavior), then this attribute defines where 
   * the value exists. must be one of the following values:
   *
   *  file:    value is the name of an uploaded file
   *  get:     value is the name of a value in the get headers
   *  global:  value is the name of a php global variable
   *  post:    value is the name of a value in the post headers
   *  session: value is the name of a session variable
	 * @type string
	 */
	this.valueType = valueType;
  
  // private attributes
  
	
  // }}}
  
  // {{{ Operations

	// {{{ toXml
	/**
	 * returns the xml representation of this object
   * @access  public
	 * @return String
	 */
	this.toXml = function() {
		return '<ws-constraint attr="' + SRAOS_Util.escapeDoubleQuotes(this.attr, '&quot;') + '"' + (this.attrType ? ' attr-type="' + this.attrType + '"' : '') + (this.operator ? ' operator="' + this.operator + '"' : '') + (this.value ? ' value="' + SRAOS_AjaxServiceParam.encodeValue(SRAOS_Util.escapeDoubleQuotes(this.value, '&quot;')) + '"' : '') + (this.valueType ? ' value-type="' + this.valueType + '"' : '') + ' />';
	};
	// }}}
  
  // }}}
};

// constants
/**
 * identifies the equals operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_EQUAL = 1;

/**
 * identifies the greater then operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_GREATER = 2;

/**
 * identifies the less then operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_LESS = 4;

/**
 * identifies the starts with operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_STARTS_WITH = 8;

/**
 * identifies the ends with operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_ENDS_WITH= 16;

/**
 * identifies the substring operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_SUBSTRING = 32;

/**
 * identifies the sort ascending operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_SORT_ASC = 64;

/**
 * identifies the sort descending operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_SORT_DESC = 128;

/**
 * identifies the negate operator
 * @type int
 */
SRAOS_AjaxConstraint.OP_NEGATE = 256;

/**
 * specifies that an attr is the name of an attribute in the entity
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_ATTR = "attr";

/**
 * specifies that a value is the name of an uploaded file
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE = "file";

/**
 * specifies that an attr/value is the name of a value in the get headers
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET = "get";

/**
 * specifies that an attr/value is the name of a php global variable
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GLOBAL = "global";

/**
 * specifies that an attr/value is the name of a value in the post headers
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST = "post";

/**
 * specifies that an attr/value is the name of a session variable
 * @type string
 */
SRAOS_AjaxConstraint.CONSTRAINT_TYPE_SESSION = "session";

// }}}
