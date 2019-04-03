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
require_once('MyToolboxProject.php');
// }}}

// {{{ Constants
/**
 * the "type" value for MyToolbox project params in app-config
 * @type string
 */
define('MY_TOOLBOX_MANAGER_PARAM_TYPE', 'my-toolbox');

/**
 * the path to the productivity resources
 * @type string
 */
define('MY_TOOLBOX_MANAGER_PRODUCTIVITY_RESOURCES', 'etc/plugins/productivity/l10n/productivity');
// }}}

// {{{ MyToolboxManager
/**
 * contains static and ajax service methods used by the MyToolbox application
 * @author  Jason Read <jason@idir.org>
 */
class MyToolboxManager {
	// {{{ getProjectSetup
	/**
	 * returns the configuration for the project specified by $id where $id is the 
   * unique identifier for that project as specified in app-config. for example,
   * if the following were inserted into app-config.xml:
   * <param id="MySpecialProject" type="my-toolbox" value="plugins/myplugin/etc/my-toolbox.xml" />
   * this method should be invoked with $id='MySpecialProject'. the xml 
   * configuration "plugins/myplugin/etc/my-toolbox.xml" would then be parsed 
   * and the resulting MyToolboxProject instance representation of that data 
   * would be returned. an SRA_Error object instance will be returned if 
   * invalid data exists in the configuration
   * @param string $id the unique identifier for the project to return the 
   * configuration for. this is the "id" value from the app-config param for 
   * the corresponding project
   * @access public
   * @return MyToolboxProject
	 */
	function &getProjectSetup($id) {
    static $_myToolboxProjects = array();
    if (!isset($_myToolboxProjects[$id]) && ($path = SRA_Controller::getAppParams($id, MY_TOOLBOX_MANAGER_PARAM_TYPE))) {
      $conf = file_exists($path) ? $path : SRA_File::getRelativePath(FALSE, $path, basename(SRA_Controller::getAppConfDir()));
      if (!file_exists($conf) && !SRA_Util::endsWith($path, '.xml')) { $conf = file_exists($path . '.xml') ? $path . '.xml' : SRA_File::getRelativePath(FALSE, $path . '.xml', basename(SRA_Controller::getAppConfDir())); }
      if (file_exists($conf) && SRA_XmlParser::isValid($parser =& SRA_XmlParser::getXmlParser($conf, TRUE))) {
        $_myToolboxProjects[$id] = MyToolboxProject::isValid($project = new MyToolboxProject($parser->getData('project'), dirname($conf))) ? $project : SRA_Error::logError("MyToolboxManager::getProjectSetup: Failed - project xml configuration ${path} produced errors", __FILE__, __LINE__);
      }
      else {
        $_myToolboxProjects[$id] = SRA_Error::logError("MyToolboxManager::getProjectSetup: Failed - project xml configuration ${path} is not valid", __FILE__, __LINE__);
      }
    }
    return $_myToolboxProjects[$id];
  }
	// }}}
  
}
// }}}
?>
