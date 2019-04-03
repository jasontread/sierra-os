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

// }}}


// {{{ constants

// }}}


// {{{ MyToolboxTriggerImpl
/**
 * this class is the template for a MyToolbox trigger implementation. it defines 
 * the methods and provides the documentation associated with those methods that 
 * are necessary in order to define a MyToolbox trigger. A trigger is 
 * responsible for determining whether or not a process should be automatically 
 * invoked. in order to do so, the trigger must provide a means of accepting 
 * static and dynamic configuration parameters, and determining whether or not a 
 * process should be invoked. This class should NOT be used directly as a 
 * trigger. It is simply a template for implementing a trigger, similiar to an 
 * abstract class in object-oriented terms. MyToolbox trigger implementations 
 * MUST extend this class (see MyToolboxTriggerAlways and MyToolboxTriggerCron 
 * for an example of a trigger implementation)
 * 
 * Trigger Parameters:
 * each implementation of this class should provide additional documentation in 
 * this class header section pertaining to the configuration parameters that may 
 * be used for that particular trigger (the parameters defined beneath the 
 * project level element in the xml definition)
 * @author Jason Read <jason@idir.org>
 */
class MyToolboxTriggerImpl {
  // attributes
  
  
  // instance methods
  
	// {{{ MyToolboxTriggerImpl
	/**
	 * the trigger parameters (which may or may not be used by the trigger 
   * implementation) are passed to the constructor
   * @param SRA_Params $params the trigger parameters
   * @access public
	 */
	function MyToolboxTriggerImpl(&$params) {}
  // }}}
  
	// {{{ invokeProcess
	/**
	 * implementation of this method is MANDATORY. this method is responsible for 
   * determining whether or not a process should be triggered. it returns TRUE 
   * when the process should be invoked, FALSE otherwise
   * @param string $id the identifier for the process. this is the "key" value 
   * for the process in the xml definition
   * @param string $basedir the absolute path to the base directory from where 
   * this invocation should occur. this value may override the project $basedir 
   * specified in the constructor
   * @param object $entity a reference to the entity instance associated with 
   * the process (if applicable)
   * @access public
   * @return boolean
	 */
	function invokeProcess($id, $basedir, &$entity) {
    $msg = 'MyToolboxTriggerImpl::invokeProcess - This method MUST be implemented by the build tool implementation';
    return SRA_Error::logError($msg, __FILE__, __LINE__);
  }
  // }}}
  
	// static methods
	
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxTriggerImpl is valid. 
   * this includes sub-classes. this method should not be overriden as it will 
   * always be invoked statically using this template class. a build tool 
   * implementation may set the instance variable $this->err to an SRA_Error 
   * object in the constructor to identify invalid or insufficient configuration 
   * parameters for that build tool
	 * @param object $object the object to validate
	 * @access public
	 * @return boolean
	 */
	function isValid(&$object) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && (strtolower(get_class($object)) == 'mytoolboxtriggerimpl' || is_subclass_of($object, 'MyToolboxTriggerImpl')));
	}
	// }}}
}
// }}}
?>
