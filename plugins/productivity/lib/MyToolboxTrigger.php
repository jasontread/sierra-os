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
require_once('MyToolboxTriggerImpl.php');
// }}}

// {{{ Constants
/**
 * the params type for process artifact versioning
 * @type string
 */
define('MY_TOOLBOX_TRIGGER_REVTYPE_PARAMS_TYPE', 'revision-type');

/**
 * the params type for entity 'view-setup' values
 * @type string
 */
define('MY_TOOLBOX_TRIGGER_SETUP_PARAMS_TYPE', 'view-setup');
// }}}

// {{{ MyToolboxTrigger
/**
 * used to define when a process should be invoked automatically using a 
 * MyToolboxTrigger implementation. the $param will be passed into the $trigger
 * constructor. for more information, see the documentation provided in 
 * MyToolboxTrigger.php. 
 * 
 * if the process utilizes an entity and a $viewSetup that requires data entry, 
 * $params (type=MY_TOOLBOX_TRIGGER_SETUP_PARAMS_TYPE) may be used to specify 
 * the the data to automatically set in the 'view-setup' form where "id" is the 
 * attribute name and "value" is the value to set for that attribute. params of 
 * this type will be removed from the params passed to the MyToolboxTrigger 
 * implementation constructor
 * 
 * if the process has artifacts associated with it, $params 
 * (type=MY_TOOLBOX_TRIGGER_REVTYPE_PARAMS_TYPE) can be used to specify the 
 * revision type(s) to use for a given artifact, where the "id" is the artifact 
 * "key" and the "value" is the revision type (one of the 
 * MY_TOOLBOX_ARTIFACT_REVISION_TYPE_* values). params of this type will also be 
 * removed from the params passed to the MyToolboxTrigger implementation 
 * constructor. if not specified, the default revision type is 
 * MY_TOOLBOX_ARTIFACT_REVISION_TYPE_BUILD
 * 
 * if an entity is associated with the process this trigger pertains to, the 
 * same pre-invocation methods and validation will be invoked and must pass 
 * satisfactorily in order for the process to be invoked. if this does not 
 * occur, the process invocation will be cancelled, deleted, and an error logged
 * @author  Jason Read <jason@idir.org>
 */
class MyToolboxTrigger {
  // public attributes
  /**
   * the unique referencing identifier for this trigger
   * @type string
   */
  var $id;
  
  /**
   * specifies the max # of times that this trigger may occur. the value will be 
   * zero if the number of recurring invocations should not be capped
   * @type int
   */
  var $recur;
  
  /**
   * the name of the PHP class defined in $triggerSrc that will be used to 
   * determine when automatic process triggering should occur. if not specified, 
   * the basename of $triggerSrc (minus the ".php" file extension) will be 
   * assumed to be the class name. this class should extend the base class 
   * template defined in lib/MyToolboxTrigger.php. for more information, see the 
   * documentation provided in that class
   * @type string
   */
  var $trigger;
  
  /**
   * the absolute path to the PHP source file containing the $trigger class
   * @type string
   */
  var $triggerSrc;
  
  /**
   * the uid of the user to assign as the owner of any process instances created 
   * as the result of this trigger. if not specified, the root user will be used
   * @type int
   */
  var $uid;
  
  // private attributes
  /**
   * a reference to the process that this artifact pertains to
   * @type MyToolboxProject
   */
  var $_process;
  
  
	// {{{ MyToolboxTrigger
	/**
	 * instantiates this object including setting and validating of the attributes
   * included in the xml configuraiton $conf
   * @param mixed $conf the raw xml configuration for this trigger
   * @param MyToolboxProcess $process the process that this artifact is 
   * associated with
   * @access public
	 */
	function MyToolboxTrigger($conf, &$process) {
    $this->_process =& $process;
    $this->id = isset($conf['attributes']['key']) ? $conf['attributes']['key'] : NULL;
    if (!$this->id) {
      $this->err = SRA_Error::logError('MyToolboxTrigger::MyToolboxTrigger: Failed - "key" is required', __FILE__, __LINE__);
      return;
    }
    $this->recur = isset($conf['attributes']['recur']) ? $conf['attributes']['recur']*1 : 0;
    if (!is_int($this->recur) || $this->recur < 0) {
      $this->err = SRA_Error::logError('MyToolboxTrigger::MyToolboxTrigger: Failed -  "recur" ' . $this->recur . ' is not valid', __FILE__, __LINE__);
      return;
    }
    if (!isset($conf['attributes']['trigger-src']) || !($this->triggerSrc = MyToolboxTrigger::_getTriggerSrc($conf['attributes']['trigger-src'], $process->basedir))) {
      $this->err = SRA_Error::logError('MyToolboxTrigger::MyToolboxTrigger: Failed - trigger-src "' . $conf['attributes']['trigger-src'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!($this->trigger = MyToolboxTrigger::_getTrigger($this->triggerSrc, $conf['attributes']['trigger']))) {
      $this->err = SRA_Error::logError('MyToolboxTrigger::MyToolboxTrigger: Failed - trigger "' . $conf['attributes']['trigger'] . '" is not a valid class or is not a sub-class of MyToolboxTriggerImpl', __FILE__, __LINE__);
      return;
    }
    $this->uid = isset($conf['attributes']['uid']) ? $conf['attributes']['uid']*1 : OsUserVO::getRootUid();
    if (is_int($this->uid) || !OsUserVO::validateUid($this->uid)) {
      $this->err = SRA_Error::logError('MyToolboxTrigger::MyToolboxTrigger: Failed - uid "' . $conf['attributes']['uid'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
  }
	// }}}
  
  
	// static methods
  
  // {{{ _getTrigger
	/**
	 * returns the class name to use for the trigger $src specified. returns NULL 
   * if the the class could not be determined
   * @param string $src the relative source path
	 * @param string $trigger the name of the class to validate. if not 
   * specified, the base name of $src (minus the .php extension) will be used 
	 * @access public
	 * @return string
	 */
  function _getTrigger($src, $trigger) {
    return MyToolboxProject::_getBuildTool($src, $buildTool, 'MyToolboxTriggerImpl');
  }
  // }}}
  
  // {{{ _getTriggerSrc
	/**
	 * translates a relative build tool source path to an absolute path and 
   * returns the absolute path. if $src is already an absolute path, that same 
   * value will be returned. $src can also be relative to $basedir. the ".php" 
   * file extension is also optional for $src
   * @param string $src the relative source path
	 * @param string $basedir the base directory
	 * @access public
	 * @return string
	 */
  function _getTriggerSrc($src, $basedir) {
    return MyToolboxProject::_getBuildToolSrc($src, $basedir);
  }
  // }}}
	
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxTrigger is valid
	 * @param object $object the object to validate
	 * @access public
	 * @return boolean
	 */
	function isValid(&$object) {
		return is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'mytoolboxtrigger';
	}
	// }}}
}
// }}}
?>
