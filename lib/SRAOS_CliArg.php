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
 * the regular expression to use to validate argument ids
 * @type String
 */
define('SRAOS_CLI_ARG_ABBR_REGEX', '^[a-zA-Z0-9]$');

/**
 * the regular expression to use to validate argument ids
 * @type String
 */
define('SRAOS_CLI_ARG_ID_REGEX', '^[a-zA-Z0-9\-]*$');
// }}}

// {{{ SRAOS_CliArg
/**
 * defines a single command line argument. it is used in cli applications (see 
 * 'cli' attribute definition in SRAOS_Application). it facilitates argument 
 * validation, parsing and description within the core Terminal application. 
 * each argument is a name/value pair. the value may be either boolean or a text 
 * value. the arguments specified by the user when the cli application is 
 * executed will be passed to that application in the params.argv hash: 
 * sudocode- 'argv[[cli-arg key]] = [value]' (value will be true or false only 
 * for boolean arguments. arguments are provided by the user in either a short 
 * or long form where the long form uses the format: '--[key][=value]' and the 
 * short form uses the format '-[abbr-char][ value]'. the only exception to this 
 * rule is for freeform arguments (see 'freeform' attribute api below). [value] 
 * is only required for non-boolean arguments.
 * 
 * only the arguments explicitely specified for a cli application will be passed 
 * to that application in params.argv. however, params.args will also be 
 * provided. thus, to implement an alternative argument model, cli-arg elements 
 * should not be specified
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_CliArg {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the plugin this application pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * the identifier for this argument. this will be the value by which is may be 
   * referenced in the argv hash. it should not contain any non-alphanumeric 
   * characters other than a dash
	 * @type string
	 */
	var $_id;
  
  /**
	 * a single alphanumeric character abbreviation for this argument. this is the 
   * value by which the argument may be specified by the user in short form as 
   * described above. as with $_id, it MUST be unique within the its application. 
   * abbr IS case-sensitive. if not specified, the short form will not be 
   * allowed for this argument
	 * @type char
	 */
	var $_abbr;
  
  /**
	 * whether or not this is a boolean argument. the [value] portion of boolean 
   * arguments is not required. if a boolean argument is specified in either 
   * short or long form without a value it will be assumed to be true. if a 
   * value is specified, only 0 will be considered non-true
	 * @type boolean
	 */
	var $_boolean;
  
  /**
   * the default value for this argument. if true, this argument will ALWAYS be 
   * included in argv with either this value if it was not provided by the user, 
   * or the user provided value otherwise. if false, this argument will ONLY be 
   * included in argv if it was provided by the user. set to 0 for false, 1 for 
   * true for boolean arguments
   * @type string
   */
  var $_default;
  
  /**
   * whether or not this argument is freeform. freeform arguments are those not 
   * entered using the short or long form specified above and whose hash index 
   * is defined by the user. a cli application can only have 1 freeform 
   * argument. free form arguments use the format: '[name][=value]'. the value 
   * for a freeform argument in argv will be a name/value pair in the form of a 
   * hash: sudocode - 'argv[[key]]={[name]: [value]}'. if 'multiple' is true, 
   * the value will be an array of name/value pairs: 
   * [{[name1]: [value1], ..., [nameN]: [valueN]"]. to support non-boolean 
   * freeform argument values 'boolean' MUST be changed to true. boolean 
   * freeform values will be converted to arrays of keys when multiple is true, 
   * and a single string when it is not
   * @type boolean
   */
  var $_freeform;
  
  /**
   * a regular expression to apply against the name values for freeform 
   * arguments. not applicable to non-freeform arguments. if a name value fails 
   * to match this regex the application will not be executed and a relevant 
   * error message will be displayed
   * @type string
   */
  var $_matchName;
  
  /**
   * a regular expression to apply against the value(s) provided for this 
   * argument. if a value fails to match this regex the application will not be 
   * executed and a relevant error message will be displayed. ignored for 
   * 'boolean' arguments. if not specified for non-boolean arguments, any value 
   * will be allowed
   * @type string
   */
  var $_matchValue;
  
  /**
   * can the user provide multiple instances of this argument? if true, the 
   * value in the argv hash will always be an array. only non-boolean and 
   * freeform arguments support this option
   * @type boolean
   */
  var $_multiple;
  
  /**
   * is this argument required for execution of the application
   * @type boolean
   */
  var $_required;
  
  /**
   * the resource to use to describe this argument in the application man entry
   * @type string
   */
  var $_resource;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_CliArg
	/**
	 * instantiates a new SRAOS_CliArg object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the cli argument
   * @param array $config the data to use to instantiate this cli argument
   * @param SRAOS_Plugin $plugin the plugin that this argument pertains to
   * @access  public
	 */
	function SRAOS_CliArg($id, & $config, & $plugin) {
    if (!$id || !is_array($config) || !isset($config['attributes']['resource'])) {
			$msg = "SRAOS_CliArg::SRAOS_CliArg: Failed - insufficient data to instantiate cli argument ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    else if (!ereg(SRAOS_CLI_ARG_ID_REGEX, $id)) {
			$msg = "SRAOS_CliArg::SRAOS_CliArg: Failed - id is not valid for cli argument ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    else if (isset($config['attributes']['abbr']) && !ereg(SRAOS_CLI_ARG_ABBR_REGEX, $config['attributes']['abbr'])) {
			$msg = "SRAOS_CliArg::SRAOS_CliArg: Failed - abbr is not valid for cli argument ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
    $this->_plugin =& $plugin;
		$this->_id = $id;
    $this->_abbr = isset($config['attributes']['abbr']) ? $config['attributes']['abbr'] : NULL;
    $this->_boolean = isset($config['attributes']['boolean']) && $config['attributes']['boolean'] == '0' ? FALSE : TRUE;
    $this->_default = isset($config['attributes']['default']) ? $config['attributes']['default'] : NULL;
    $this->_freeform = isset($config['attributes']['freeform']) && $config['attributes']['freeform'] == '1' ? TRUE : FALSE;
    $this->_matchName = isset($config['attributes']['match-name']) ? $config['attributes']['match-name'] : NULL;
    $this->_matchValue = isset($config['attributes']['match-value']) ? $config['attributes']['match-value'] : NULL;
    $this->_multiple = isset($config['attributes']['multiple']) && $config['attributes']['multiple'] == '1' ? TRUE : FALSE;
    $this->_required = isset($config['attributes']['required']) && $config['attributes']['required'] == '1' ? TRUE : FALSE;
    $this->_resource = $config['attributes']['resource'];
	}
	// }}}
	
  
  // public operations
  
	// {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   * 
   * SRAOS_CliArg(id, abbr, isBool, defaultValue, freeform, manEntry, matchName, matchValue, multiple, required)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_CliArg("' . $this->_id . '", '; 
    $code .= $this->_abbr ? '"' . $this->_abbr . '", ' : 'null, ';
    $code .= $this->_boolean ? 'true, ' : 'false, ';
    $code .= $this->_default ? '"' . str_replace('"', '\"', $this->_default) . '", ' : 'null, ';
    $code .= $this->_freeform ? 'true, ' : 'false, ';
    $code .= '"' . str_replace('"', '\"', $this->getManEntry()) . '", ';
    $code .= $this->_matchName ? '"' . str_replace('"', '\"', $this->_matchName) . '", ' : 'null, ';
    $code .= $this->_matchValue ? '"' . str_replace('"', '\"', $this->_matchValue) . '", ' : 'null, ';
    $code .= $this->_multiple ? 'true, ' : 'false, ';
    $code .= $this->_required ? 'true' : 'false';
    $code .= ')';
    
    return $code;
  }
  // }}}
  
  
	// {{{ getManEntry
	/**
	 * returns the man entry for this argument
   * @access  public
	 * @return string
	 */
	function getManEntry() {
		return $this->_plugin->resources->getString($this->_resource);
	}
	// }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this plugin
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
  
	// {{{ getAbbr
	/**
	 * returns the abbr of this plugin
   * @access  public
	 * @return string
	 */
	function getAbbr() {
		return $this->_abbr;
	}
	// }}}
	
	// {{{ setAbbr
	/**
	 * sets the plugin abbr
	 * @param string $abbr the abbr to set
   * @access  public
	 * @return void
	 */
	function setAbbr($abbr) {
		$this->_abbr = $abbr;
	}
	// }}}
  
	// {{{ isBoolean
	/**
	 * returns the boolean of this plugin
   * @access  public
	 * @return boolean
	 */
	function isBoolean() {
		return $this->_boolean;
	}
	// }}}
	
	// {{{ setBoolean
	/**
	 * sets the plugin boolean
	 * @param boolean $boolean the boolean to set
   * @access  public
	 * @return void
	 */
	function setBoolean($boolean) {
		$this->_boolean = $boolean;
	}
	// }}}
  
	// {{{ getDefault
	/**
	 * returns the default of this plugin
   * @access  public
	 * @return string
	 */
	function getDefault() {
		return $this->_default;
	}
	// }}}
	
	// {{{ setDefault
	/**
	 * sets the plugin default
	 * @param string $default the default to set
   * @access  public
	 * @return void
	 */
	function setDefault($default) {
		$this->_default = $default;
	}
	// }}}
  
	// {{{ isFreeform
	/**
	 * returns the freeform of this plugin
   * @access  public
	 * @return freeform
	 */
	function isFreeform() {
		return $this->_freeform;
	}
	// }}}
	
	// {{{ setFreeform
	/**
	 * sets the plugin freeform
	 * @param freeform $freeform the freeform to set
   * @access  public
	 * @return void
	 */
	function setFreeform($freeform) {
		$this->_freeform = $freeform;
	}
	// }}}
  
	// {{{ getMatchName
	/**
	 * returns the matchName of this plugin
   * @access  public
	 * @return string
	 */
	function getMatchName() {
		return $this->_matchName;
	}
	// }}}
	
	// {{{ setMatchName
	/**
	 * sets the plugin matchName
	 * @param string $matchName the matchName to set
   * @access  public
	 * @return void
	 */
	function setMatchName($matchName) {
		$this->_matchName = $matchName;
	}
	// }}}
  
	// {{{ getMatchValue
	/**
	 * returns the matchValue of this plugin
   * @access  public
	 * @return string
	 */
	function getMatchValue() {
		return $this->_matchValue;
	}
	// }}}
	
	// {{{ setMatchValue
	/**
	 * sets the plugin matchValue
	 * @param string $matchValue the matchValue to set
   * @access  public
	 * @return void
	 */
	function setMatchValue($matchValue) {
		$this->_matchValue = $matchValue;
	}
	// }}}
  
	// {{{ isMultiple
	/**
	 * returns the multiple of this plugin
   * @access  public
	 * @return multiple
	 */
	function isMultiple() {
		return $this->_multiple;
	}
	// }}}
	
	// {{{ setMultiple
	/**
	 * sets the plugin multiple
	 * @param multiple $multiple the multiple to set
   * @access  public
	 * @return void
	 */
	function setMultiple($multiple) {
		$this->_multiple = $multiple;
	}
	// }}}
  
	// {{{ isRequired
	/**
	 * returns the required of this plugin
   * @access  public
	 * @return required
	 */
	function isRequired() {
		return $this->_required;
	}
	// }}}
	
	// {{{ setRequired
	/**
	 * sets the plugin required
	 * @param required $required the required to set
   * @access  public
	 * @return void
	 */
	function setRequired($required) {
		$this->_required = $required;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this plugin
   * @access  public
	 * @return string
	 */
	function getResource() {
		return $this->_resource;
	}
	// }}}
	
	// {{{ setResource
	/**
	 * sets the plugin resource
	 * @param string $resource the resource to set
   * @access  public
	 * @return void
	 */
	function setResource($resource) {
		$this->_resource = $resource;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_CliArg object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_cliarg');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
