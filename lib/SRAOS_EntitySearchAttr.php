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
class SRAOS_EntitySearchAttr {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the name of the attribute as specified in the entity model for non-global 
   * ajax services or internally for global ones
	 * @type string
	 */
	var $_id;
  
  /**
   * a regular expression that must match the search term in order for this 
   * attribute to be added to the search constraints/params. if the search term 
   * does not match this expression, this attribute will be exclude from the 
   * service invocation
   * @type string
   */
  var $_matchRegex;
  
  /**
   * the operator to apply between the search term and this attribute. this 
   * value will correspond with one ore more of the
   * SRA_AjaxConstraint::operator constraint bit values. the default is "32" 
   * which signifies that the search term must exist at least once within the 
   * attribute value for each entity in order for this constraint to match
   * @type int
   */
  var $_operator;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_EntitySearchAttr
	/**
	 * instantiates a new SRAOS_EntitySearchAttr object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the object
   * @param array $config the data to use to instantiate this object
   * @param SRAOS_Entity $entity the entity that this object pertains to
   * @access  public
	 */
	function SRAOS_EntitySearchAttr($id, & $config, & $entity) {
    if (!$id || !$entity || !is_array($config)) {
			$msg = "SRAOS_EntityDisplAttr::SRAOS_EntityDisplAttr: Failed - insufficient data to instantiate object ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (!SRA_QueryBuilderConstraint::validateConstraint(($this->_operator = isset($conf['attributes']['operator']) ? $conf['attributes']['operator'] : SRA_QUERY_BUILDER_CONSTRAINT_TYPE_IN_STR))) {
      $msg = "SRAOS_EntityDisplAttr::SRAOS_EntityDisplAttr: Failed - invalid operator " . $conf['attributes']['operator'] . " for attr ${id}";
      $this->err = SRA_Error::logError($msg, __FILE__, __LINE__);
      return;
    }
    
		$this->_id = $id;
    $this->_matchRegex = isset($config['attributes']['match-regex']) ? $config['attributes']['match-regex'] : NULL;
    
	}
	// }}}
	
  
  // public operations
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_EntitySearchAttr(id, matchRegex, operator)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    return 'new SRAOS_EntitySearchAttr("' . $this->_id . '", ' . ($this->_matchRegex ? '"' . str_replace('"', '\"', $this->_matchRegex) . '"' : 'null') . ', ' . $this->_operator . ')';
  }
  // }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this object
   * @access  public
	 * @return string
	 */
	function getId() {
		return $this->_id;
	}
	// }}}
	
	// {{{ setId
	/**
	 * sets the plugin id
	 * @param string $id the id to set
   * @access  public
	 * @return void
	 */
	function setId($id) {
		$this->_id = $id;
	}
	// }}}
  
	// {{{ getMatchRegex
	/**
	 * returns the matchRegex of this object
   * @access  public
	 * @return string
	 */
	function getMatchRegex() {
		return $this->_matchRegex;
	}
	// }}}
	
	// {{{ setMatchRegex
	/**
	 * sets the plugin matchRegex
	 * @param string $matchRegex the matchRegex to set
   * @access  public
	 * @return vomatchRegex
	 */
	function setMatchRegex($matchRegex) {
		$this->_matchRegex = $matchRegex;
	}
	// }}}
  
	// {{{ getOperator
	/**
	 * returns the operator of this object
   * @access  public
	 * @return string
	 */
	function getOperator() {
		return $this->_operator;
	}
	// }}}
	
	// {{{ setOperator
	/**
	 * sets the plugin operator
	 * @param string $operator the operator to set
   * @access  public
	 * @return vooperator
	 */
	function setOperator($operator) {
		$this->_operator = $operator;
	}
	// }}}
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_EntitySearchAttr object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_entitysearchattr');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
