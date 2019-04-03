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
require_once('SRAOS_Constraint.php');
// }}}

// {{{ Constants
/**
 * constant identifying a conjunctive constraint group
 * @type String
 */
define('SRAOS_CONSTRAINT_GROUP_CONJUNCTIVE', 'and');

/**
 * constant identifying a disjunctive constraint group
 * @type String
 */
define('SRAOS_CONSTRAINT_GROUP_DISJUNCTIVE', 'or');
// }}}

// {{{ SRAOS_ConstraintGroup
/**
 * specify 1 or more constraints that will be evaluated as a whole based on the 
 * _connective specified for the group (either conjunction or disjunction). the 
 * evaluation includes short-circuiting for conjunctive join types (and)
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_ConstraintGroup {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * whether the connective between constraints of this group should be 
   * conjunctively or disjunctively joined
	 * @type string
	 */
	var $_connective;
  
  /**
	 * the constraints that are included in this group
	 * @type SRAOS_Constraint
	 */
	var $_constraints = array();
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_ConstraintGroup
	/**
	 * instantiates a new SRAOS_ConstraintGroup object based on the $config 
   * specified. if there are problems with the xml configuration for this 
   * constraint group, an SRA_Error object will be set to the instance variable 
   * $this->err
   * @param array $config the data to use to instantiate this object
   * @access  public
	 */
	function SRAOS_ConstraintGroup(& $config) {
    if (!is_array($config) || !isset($config['constraint'])) {
      print_r($config);
			$msg = 'SRAOS_ConstraintGroup::SRAOS_ConstraintGroup: Failed - insufficient data to instantiate object';
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
    $this->_connective = isset($config['attributes']['connective']) ? $config['attributes']['connective'] : SRAOS_CONSTRAINT_GROUP_CONJUNCTIVE;
    // constraints
    $keys = array_keys($config['constraint']);
    foreach ($keys as $key) {
      $this->_constraints[] = new SRAOS_Constraint($config['constraint'][$key]);
      if (SRA_Error::isError($this->_constraints[count($this->_constraints) - 1]->err)) {
        $msg = "SRAOS_ConstraintGroup::SRAOS_ConstraintGroup: Failed - Unable to instantiate SRAOS_ConstraintGroup ${key}";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
    }
	}
	// }}}
	
  
  // public operations
  
	// {{{ evaluate
	/**
	 * evaluates this constraint group and returns TRUE/FALSE based on the results 
   * of that evaluation
	 * @access	public
	 * @return	boolean
	 */
	function evaluate() {
		$keys = array_keys($this->_constraints);
    foreach($keys as $key) {
      if ($this->_constraints[$key]->evaluate()) {
        if ($this->_connective == SRAOS_CONSTRAINT_GROUP_DISJUNCTIVE) { return TRUE; }
      }
      else {
        if ($this->_connective == SRAOS_CONSTRAINT_GROUP_CONJUNCTIVE) { return FALSE; }
      }
    }
    return $this->_connective == SRAOS_CONSTRAINT_GROUP_CONJUNCTIVE ? TRUE : FALSE;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_ConstraintGroup object.
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
