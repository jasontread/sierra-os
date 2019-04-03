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

// {{{ imports
require_once('MyToolboxTriggerImpl.php');
// }}}


// {{{ constants

// }}}


// {{{ MyToolboxTriggerAlways
/**
 * a simple trigger that always returns TRUE
 * @author Jason Read <jason@idir.org>
 */
class MyToolboxTriggerAlways extends MyToolboxTriggerImpl {
  // attributes
  
  
  // instance methods
  
	// {{{ MyToolboxTriggerAlways
	/**
	 * does nothing
   * @param SRA_Params $params not used
   * @access public
	 */
	function MyToolboxTriggerAlways(&$params) {}
  // }}}
  
	// {{{ invokeProcess
	/**
	 * returns TRUE
   * @param string $id not used
   * @param string $basedir not used
   * @param object $entity not used
   * @access public
   * @return boolean
	 */
	function invokeProcess($id, $basedir, &$entity) {
    return TRUE;
  }
  // }}}
  
}
// }}}
?>
