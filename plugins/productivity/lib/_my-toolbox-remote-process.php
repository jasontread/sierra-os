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
 * the path to a writable directory this script may use to store temporary files
 * @type string
 */
define('MY_TOOLBOX_REMOTE_PROCESS_TMP_DIR', '/tmp');
// }}}


// {{{ _my-toolbox-remote-process
/**
 * this script is used to remotely invoke MyToolbox processes as defined using 
 * my-toolbox_1_0.dtd. in order to remotely invoke these processes, this script 
 * must be installed on the remote system and made web visible (http or https) 
 * to the MyToolbox host system. then the uri to this script must be specified 
 * using the "remote-uri" xml configuration attribute for that process. the 
 * Apache user must have permission to complete the process
 * @author Jason Read <jason@idir.org>
 */

// TODO
 
// }}}
?>
