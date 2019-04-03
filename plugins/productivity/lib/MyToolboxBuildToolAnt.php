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
require_once('MyToolboxBuildTool.php');
// }}}


// {{{ constants
/**
 * the name of the ant program
 * @type string
 */
define('MY_TOOLBOX_BUILD_ANT', 'ant');

/**
 * the default name of the "buildfile" file name
 * @type string
 */
define('MY_TOOLBOX_BUILD_ANT_BUILDFILE', 'build.xml');
// }}}


// {{{ MyToolboxBuildTool
/**
 * MyToolboxBuildTool implementation based on the Apache Ant build tool 
 * (http://ant.apache.org)
 * 
 * Build Tool Parameters:
 * 
 *  ant:          the path to the ant executable. if not specified, 
 *                MY_TOOLBOX_BUILD_ANT will be used and searched for in the 
 *                standard $PATH
 *  buildfile:    the ant "-buildfile <file>" option: the basedir/app/sys 
 *                relative or absolute path to the build file to use. if not 
 *                specified, the standard "build.xml" in the process invocation 
 *                $basedir will be assumed. an error will result if no build 
 *                file can be located
 *
 *  lib:          the ant "-lib <path>" option: specifies a basedir/app/sys 
 *                relative or absolute path to search for jars and classes
 *
 *  propertyfile: the ant "-propertyfile <name>" option: loads all properties 
 *                in this file. the file path may be basedir/app/sys relative or
 *                absolute. duplicate runtime properties will override these 
 *                values. this file may be localized (SRA_ResourceBundle will 
 *                attempt to locate if the path provided is not immediatly 
 *                found)
 * 
 * Process Parameters: with the exception of the 'ant' parameter, a process may 
 * override any of the project-level parameters defines above and may 
 * additionally specify the following:
 * 
 *  target:       the ant target associated with a process. if not specified, 
 *                the default/implicit target in "buildfile" will be used
 * 
 * @author Jason Read <jason@idir.org>
 */
class MyToolboxBuildToolAnt extends MyToolboxBuildTool {
  /**
   * stores a reference to the project-level parameters
   * @type SRA_Params
   */
  var $_params;
  
	// {{{ MyToolboxBuildToolAnt
	/**
	 * the constructor validates the presence of and execution privileges to the 
   * 'ant' program
   * @param string $basedir the absolute path to the base directory from where 
   * the ant invocation should occur. this value will be passed into ant using 
   * the "basedir" option: -Dbasedir=[ant-basedir]
   * @param SRA_Params $params set to the $_params instance attribute. 
   * validation occurs only when 'invokeProcess' is called
   * @param MyToolboxProject $project not used
   * @access public
	 */
	function MyToolboxBuildToolAnt($basedir, &$params, &$project) {
    // TODO: validate presence of ant program
    $this->_params = $params;
  }
  // }}}
  
	// {{{ getProcessResultsLog
	/**
	 * returns the command-line output from the ant command line invocation 
   * including the error message returns if the ant invocation does not return 
   * a return code of 0
   * @param int $pid the MyToolbox defined unique identifier for this process 
   * invocation. this is the same value that was passed to the original 
   * 'invokeProcess' call
   * @access public
   * @return string
	 */
	function getProcessResultsLog($pid) {
    // TODO
  }
  // }}}
  
	// {{{ invokeProcess
	/**
	 * this method invokes ant using the $basedir and other invocations parameters 
   * specified. it returns an SRA_Error object if the buildfile or target 
   * specified is not valid. it returns status MY_TOOLBOX_BUILD_TOOL_STATUS_FAIL 
   * if the ant invocation return code is not 0. otherwise it return the status 
   * MY_TOOLBOX_BUILD_TOOL_STATUS_SUCCESS. ant process invocation is always 
   * synchronous
   * @param string $id the identifier for the process
   * @param int $pid the unique identifier for this process
   * @param string $basedir may override the $basedir from the constructor
   * @param SRA_Params $params the ant invocation parameters. this value may 
   * include the build tool and process parameters documented above as well as 
   * any target specific parameters. the former will be removed from the params 
   * hash and not passed in to the ant execution. the latter will be passed in 
   * using the -D<property>=<value> ant invocation
   * @param MyToolboxProcess $process not used
   * @access public
   * @return string
	 */
	function invokeProcess($id, $pid, $basedir, &$params, &$process) {
    // TODO
  }
  // }}}
  
}
// }}}
?>
