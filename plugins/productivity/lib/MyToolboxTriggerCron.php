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


// {{{ MyToolboxTriggerCron
/**
 * used to trigger a process based on a cron-formatted schedule string. this 
 * trigger implementation uses a single parameter, 'cron' which is the cron 
 * formatted schedule string to use to base the triggering on
 * 
 * Trigger Parameters:
 *   cron:     the cron-formatted schedule string. this string is a space 
 *             separated list of time identifiers in the following order:
 *               1: the schedule minute of the hour (between 0 and 59)
 *               2: the schedule hour (0 and 23 where 0 is midnight)
 *               3: the schedule day of month
 *               4: the schedule month (1-12)
 *               5: the schedule day of week (0-6 where 0=sunday)
 *             '*' in any of these identifiers means that the schedule should 
 *             occur in all instances of that type of identifier. additionally, 
 *             multiple comma separated values may be specified for each 
 *             identifier. for more information, there are a variety of 
 *             resources available on the web regarding "cron scheduling"
 * @author Jason Read <jason@idir.org>
 */
class MyToolboxTriggerCron extends MyToolboxTriggerImpl {
  /**
	 * the cron-formatted schedule for this task. for more information, see the 
   * Trigger Parameter documentation above
	 * @type string
	 */
	var $_cron;
  
	// {{{ MyToolboxTriggerCron
	/**
	 * the constructor validates the trigger 'cron' parameter
   * @param SRA_Params $params must contain the 'cron' parameter documented 
   * above
   * @access public
	 */
	function MyToolboxTriggerCron(&$params) {
    if (!isset($params['cron']) || SRA_GregorianDate::cron($params['cron']) === NULL) {
      $msg = 'MyToolboxTriggerCron::MyToolboxTriggerCron - Failed: the cron parameter "' . $params['cron'] . '" is not valid';
      $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__);
    }
    else {
      $this->_cron = $params['cron'];
    }
  }
  // }}}
  
	// {{{ invokeProcess
	/**
	 * returns TRUE if the process should be triggered based on the cron schedule 
   * defined for it
   * @param string $id not used
   * @param string $basedir not used
   * @param object $entity not used
   * @access public
   * @return boolean
	 */
	function invokeProcess($id, $basedir, &$entity) {
    return SRA_GregorianDate::cron($this->_cron);
  }
  // }}}
  
}
// }}}
?>
