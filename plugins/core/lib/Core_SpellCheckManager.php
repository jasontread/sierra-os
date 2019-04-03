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

// {{{ Core_SpellCheckManager
/**
 * 
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_SpellCheckManager {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_SpellCheckManager
	/**
	 * not used
   * @access  public
	 */
	function Core_SpellCheckManager() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
	// {{{ spellcheck
	/**
	 * spellchecks a string according to the params specified and returns the 
   * results from SRA_Util::spellcheck
   * @param array $params contains 3 properties: str - the string to spellcheck, 
   * lang - the spellcheck language, and html: whether or not the string is 
   * html formatted (default is FALSE)
   * @access  public
   * @return array
	 */
	function & spellcheck($params) {
    global $user;
    if ($user) {
      return SRA_Util::spellcheck($params['str'], $params['lang'] != 'auto' ? $params['lang'] : NULL, $params['html'], $user->getCustomDictionary());
    }
    $msg = 'Core_SpellCheckManager::spellcheck: Failed - no user session is active';
    return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
  }
	// }}}
  
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a Core_SpellCheckManager object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'core_spellcheckmanager');
	}
	// }}}
	
  
  // private operations
  
}
// }}}
?>
