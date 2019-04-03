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

/**
 * the default process status query interval in minutes (the frequency to invoke 
 * MyToolboxBuildTool::getProcessStatus when MyToolboxBuildTool::invokeProcess 
 * return MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING for a given process)
 * @type int
 */
define('MY_TOOLBOX_BUILD_TOOL_QUERY_INTERVAL', 1);

/**
 * MyToolboxBuildTool::invokeProcess return value identifying that the process 
 * invocation failed. this is considered a completion status
 * @type string
 */
define('MY_TOOLBOX_BUILD_TOOL_STATUS_FAIL', 'fail');

/**
 * MyToolboxBuildTool::invokeProcess return value identifying that the process 
 * invocation was started successfully but could not be immediately completed 
 * (asynchronous). when this return value is used, the method 
 * MyToolboxBuildTool::getProcessStatus must also be implemented and will be 
 * invoked every MY_TOOLBOX_BUILD_TOOL_QUERY_INTERVAL minutes (unless 
 * MyToolboxBuildTool::getProcessStatusQueryInterval is also implemented and 
 * returns a different interval value), until a completion status is returned 
 * for that process. additionally, the optional 
 * MyToolboxBuildTool::getProcessTimeToCompletion method may be implemented 
 * providing an estimated time to completion for a given process in this status
 * @type string
 */
define('MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING', 'pending');

/**
 * MyToolboxBuildTool::invokeProcess return value identifying that the process 
 * was completed successfully. this is considered a completion status
 * @type string
 */
define('MY_TOOLBOX_BUILD_TOOL_STATUS_SUCCESS', 'success');
// }}}


// {{{ MyToolboxBuildTool
/**
 * this class is the template for a MyToolbox build tool implementation. it 
 * defines the methods and provides the documentation associated with those 
 * methods that are necessary in order to define a MyToolbox build tool. A build 
 * tool is responsible for completing processes defined for a project. in order 
 * to do so, the build tool must provide a means of accepting static and 
 * dynamic configuration parameters (both at the build tool and at the process 
 * level), invoking a process, providing the completion status of a process 
 * invocation, and returning the results from that same invocation once it is 
 * completed. additional optional functionality may also be provided. for more 
 * information, see the method documentation provided in this class. This class 
 * should NOT be used directly as a build tool. It is simply a template for 
 * implementing a build tool, similiar to an abstract class in object-oriented 
 * terms. MyToolbox build tool implementations MUST extend this class (see 
 * MyToolboxBuildToolAnt for an example of a build tool implementation)
 * 
 * Build Tool Parameters:
 * each implementation of this class should provide additional documentation in 
 * this class header section pertaining to the configuration parameters that may 
 * be used for that particular build tool (the parameters defined beneath the 
 * project level element in the xml definition)
 * 
 * Process Parameters:
 * each implementation of this class should also provide additional 
 * documentation in this class header section pertaining to the configuration 
 * parameters that may be used for a process invocation for the build tool (the 
 * parameters defined beneath the process level element in the xml definition)
 * @author Jason Read <jason@idir.org>
 */
class MyToolboxBuildTool {
  
	// {{{ MyToolboxBuildTool
	/**
	 * implementation of this method is OPTIONAL. the constructor instantiates a 
   * new instance of the build tool which will later be used to invoke a 
   * process, check on the status of a process or get the results from a 
   * completed process. it should accept to parameters, $params and $project 
   * defined below. it may trigger an error by setting the instance variable 
   * $this->err to an error object with an appropriate error message. when this 
   * occurs, the build tool action will be aborted, and the error message logged 
   * with the attempt
   * @param string $basedir the base directory from where processes should be 
   * invoked for this project. relative path determinations will be calculated 
   * first based on this directory. if not specified, the directory containing 
   * the xml file configuration will be assumed
   * @param SRA_Params $params the configuration parameters defined for the 
   * build tool at the project level. these are the params specified beneath the 
   * project level element in the xml definition and NOT the params specified 
   * for a specific process. the definition of which params may be used by a 
   * particular build tool should be documented in the class header for the 
   * implementing class
   * @param MyToolboxProject $project a reference to the full project level 
   * configuration defined in the xml definition. this parameter may or may not 
   * be needed by a particular implementation. for more information see the 
   * api documentation provided in MyToolboxProject.php
   * @access public
	 */
	function MyToolboxBuildTool($basedir, &$params, &$project) {
    $msg = 'MyToolboxBuildTool::MyToolboxBuildTool - This class should not be instantiated directly';
    $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__);
  }
  // }}}
  
	// {{{ getProcessPendingLabel
	/**
	 * implementation of this method is OPTIONAL. this method may be used to 
   * return a pending label to use when the process status is currently 
   * MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING. if not implemented, a generic 
   * "Process Pending" label will be used
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return string
	 */
	function getProcessPendingLabel($pid) {}
  // }}}
  
	// {{{ getProcessResultsLog
	/**
	 * implementation of this method is OPTIONAL. this method may be used to 
   * return a plaintext or html formatted results log for the process invocation 
   * identified by $pid. this log will be stored permanently with the process 
   * invocation record and be visible to MyToolbox users with access to view the 
   * process. if this method is not implemented, no results log value will be 
   * associated with the process invocation
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return string
	 */
	function getProcessResultsLog($pid) {}
  // }}}
  
	// {{{ getProcessStatus
	/**
	 * implementation of this method is OPTIONAL unless an 'invokeProcess' call 
   * will ever return the MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING status (see 
   * documentation provided above). this method allows MyToolbox to periodically 
   * query for the updated status of the process invocation identified by $pid 
   * (the same $pid passed to the original 'invokeProcess' call). this method 
   * should return a value corresponding with one of the 3 
   * MY_TOOLBOX_BUILD_TOOL_STATUS_* constants identifying the current results of 
   * the process invocation. it may also return an SRA_Error object if a system 
   * related error has occurred. the process status querying will cease when 
   * this method returns a completion status (MY_TOOLBOX_BUILD_TOOL_STATUS_FAIL 
   * or MY_TOOLBOX_BUILD_TOOL_STATUS_SUCCESS) or an error
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return string
	 */
	function getProcessStatus($pid) {
    $msg = 'MyToolboxBuildTool::getProcessStatus - This method MUST be implemented by the build tool implementation';
    return SRA_Error::logError($msg, __FILE__, __LINE__);
  }
  // }}}
  
	// {{{ getProcessStatusQueryInterval
	/**
	 * implementation of this method is OPTIONAL. if an 'invokeProcess' call 
   * returns the MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING status (see documentation 
   * provided above), this method may be implemented and used to return a custom 
   * status query interval in minutes. if provided, this value will override the 
   * default status query interval defined by the constant 
   * MY_TOOLBOX_BUILD_TOOL_QUERY_INTERVAL
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return int
	 */
	function getProcessStatusQueryInterval($pid) {
    return MY_TOOLBOX_BUILD_TOOL_QUERY_INTERVAL;
  }
  // }}}
  
	// {{{ getProcessTimeToCompletion
	/**
	 * implementation of this method is OPTIONAL. if an 'invokeProcess' call 
   * returns the MY_TOOLBOX_BUILD_TOOL_STATUS_PENDING status (see documentation 
   * provided above), this method may be implemented and used to return an 
   * estimated time to completion (in minutes) for the process invocation 
   * identified by $pid. this value will be used by MyToolbox to provide the 
   * user an estimated completion time for the process
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return int
	 */
	function getProcessTimeToCompletion($pid) {}
  // }}}
  
	// {{{ invokeProcess
	/**
	 * implementation of this method is MANDATORY. this method is responsible for 
   * starting the invocation of a process by the build tool. it should return a 
   * value corresponding with one of the 3 MY_TOOLBOX_BUILD_TOOL_STATUS_* 
   * constants identifying the results of the process invocation. it may also 
   * return an SRA_Error object if the invocation cannot occur due to a 
   * misconfiguration or other system related error
   * @param string $id the identifier for the process. this is the "key" value 
   * for the process in the xml definition
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this same value will be used for future reference to this 
   * process invocation when MyToolbox calls other process related methods
   * @param string $basedir the absolute path to the base directory from where 
   * this invocation should occur. this value may override the project $basedir 
   * specified in the constructor
   * @param SRA_Params $params the configuration parameters defined for the 
   * build tool for this process. these are the params specified beneath the 
   * corresponding process element in the xml definition. the definition of 
   * which params may be used by a particular build tool process should also be 
   * documented in the class header for the implementing class
   * @param MyToolboxProcess $process a reference to the full process level 
   * configuration defined in the xml definition. this parameter may or may not 
   * be needed by a particular implementation. for more information see the 
   * api documentation provided in MyToolboxProcess.php
   * @access public
   * @return string
	 */
	function invokeProcess($id, $pid, $basedir, &$params, &$process) {
    $msg = 'MyToolboxBuildTool::invokeProcess - This method MUST be implemented by the build tool implementation';
    return SRA_Error::logError($msg, __FILE__, __LINE__);
  }
  // }}}
  
  
	// static methods
	
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxBuildTool is valid. 
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
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && (strtolower(get_class($object)) == 'mytoolboxbuildtool' || is_subclass_of($object, 'MyToolboxBuildTool')));
	}
	// }}}
  
}
// }}}
?>
