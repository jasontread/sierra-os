<?php
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
/**
 * equality operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_EQ', '=');

/**
 * greater then operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_GT', '>');

/**
 * less then operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_LT', '<');

/**
 * starts with operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_STARTS_WITH', 'startsWith');

/**
 * ends with operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_ENDS_WITH', 'endsWith');

/**
 * substring operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_SUBSTRING', 'substr');

/**
 * inArray operator identifier
 * @type String
 */
define('SRAOS_CONSTRAINT_IN_ARRAY', 'inArray');
// }}}

// {{{ SRAOS_Constraint
/**
 * used to evaluate a single user object property within the context of the 
 * parent constraint group
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Constraint {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
   * whether or not to negate the return value of this constraint
   * @type boolean
   */
  var $_negate;
  
  /**
   * the operator to apply between the property and value:
   *
   *  EQUALITY CONSTRAINTS
   *   eq: attr and value are equal (case sensitive)
   *   gt: attr is greater than value
   *   lt: attr is less than value
   *
   *  STRING CONSTRAINTS
   *   startsWith: attr starts with value (case sensitive)
   *   endsWith: attr ends with value (case sensitive)
   *   substr: value is a sub-string of attr (case sensitive)
   *
   *  ARRAY CONSTRAINTS
   *   inArray: value is in the attr array (case sensitive)
   */
  var $_operator;
  
  /**
	 * the constraint OsUser object property identifier. this value may include 
   * attribute/method nesting. for example, to evaluate the names of all of the 
   * groups that the user belongs to, this value would be "getAllGroups_name"
	 * @type string
	 */
	var $_property;
  
  /**
   * the constraint value
   * @type string
   */
  var $_value;
  
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Constraint
	/**
	 * instantiates a new SRAOS_Constraint object based on the $config 
   * specified. if there are problems with the xml configuration for this 
   * constraint group, an SRA_Error object will be set to the instance variable 
   * $this->err
   * @param array $config the data to use to instantiate this object
   * @access  public
	 */
	function SRAOS_Constraint(& $config) {
    if (!is_array($config) || !isset($config['attributes']['key']) || !isset($config['attributes']['value'])) {
			$msg = 'SRAOS_Constraint::SRAOS_Constraint: Failed - insufficient data to instantiate object';
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
    $this->_negate = isset($config['attributes']['negate']) && $config['attributes']['negate'] == '1' ? TRUE : FALSE;
    $this->_operator = isset($config['attributes']['operator']) ? $config['attributes']['operator'] : SRAOS_CONSTRAINT_EQ;
    $this->_property = $config['attributes']['key'];
    $this->_value = $config['attributes']['value'];
    
	}
	// }}}
	
  
  // public operations
  
	// {{{ evaluate
	/**
	 * evaluates this constraint and returns TRUE/FALSE based on the results of 
   * that evaluation
	 * @access	public
	 * @return	boolean
	 */
	function evaluate() {
		global $user;
    $results = FALSE;
    if ($user && OsUserVO::isValid($user)) {
      $attr = $user->getAttribute($this->_property);
      switch($this->_operator) {
        case SRAOS_CONSTRAINT_EQ: 
          $results = $this->_value ? $attr == $this->_value : ($attr ? TRUE : FALSE);
          break;
        case SRAOS_CONSTRAINT_GT: 
          $results = $attr > $this->_value;
          break;
        case SRAOS_CONSTRAINT_LT: 
          $results = $attr < $this->_value;
          break;
        case SRAOS_CONSTRAINT_STARTS_WITH: 
          $results = SRA_Util::beginsWith($attr, $this->_value);
          break;
        case SRAOS_CONSTRAINT_ENDS_WITH: 
          $results = SRA_Util::endsWith($attr, $this->_value);
          break;
        case SRAOS_CONSTRAINT_SUBSTRING: 
          $results = is_string($attr) && strstr($attr, $this->_value) ? TRUE : FALSE;
          break;
        case SRAOS_CONSTRAINT_IN_ARRAY: 
          $results = is_array($attr) && in_array($this->_value, $attr);
          break;
      }
    }
    return $this->_negate ? !$results : $results;
	}
	// }}}
  
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Constraint object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_constraintgroup');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
