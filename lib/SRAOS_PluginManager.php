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
require_once('SRAOS_Plugin.php');
// }}}

// {{{ Constants
/**
 * the app relative directy containing the plugins
 * @type string
 */
define('SRAOS_PLUGIN_DIR', '/plugins/');

/**
 * the app relative plugin template directory
 * @type string
 */
define('SRAOS_PLUGIN_TPL_DIR', '/www/tpl/plugins/');

/**
 * the app relative plugin www directory
 * @type string
 */
define('SRAOS_PLUGIN_WWW_DIR', '/www/html/plugins/');

/**
 * the base plugin uri
 * @type string
 */
define('SRAOS_PLUGIN_URI', '/plugins/');

/**
 * the app relative directory to the default themes direction
 * @type string
 */
define('SRAOS_THEMES_DIR', '/www/html/themes/standard/icons/');

/**
 * the base themes uri
 * @type string
 */
define('SRAOS_THEMES_URI', '/themes/');

/**
 * the path to the ln command. used to create symbolic links between the plugin 
 * and the app directories lib/plugins/, www/tpl/plugins and www/html/plugins
 * @type string
 */
define('SRAOS_PLUGIN_LN_CMD', 'ln');

/**
 * the path to the rm command. used to remove symbolic links between the plugin 
 * and the app directories lib/plugins/, www/tpl/plugins and www/html/plugins
 * @type string
 */
define('SRAOS_PLUGIN_RM_CMD', 'rm');

/**
 * the name of the template variable that the SRAOS_Plugin instances should be 
 * references to
 * @type string
 */
define('SRAOS_PLUGIN_TPL_VAR', 'plugins');

/**
 * debug flag for the plugin manager
 * @type string
 */
define('SRAOS_PLUGIN_DEBUG', FALSE);

/**
 * defines that the SRAOS object instance is the callback target
 * @type string
 */
define('SRAOS_TARGET_OS', 'os');

/**
 * defines that the SRAOS_Application.manager object instance is the callback target
 * @type string
 */
define('SRAOS_TARGET_APP', 'app');

/**
 * defines that the SRAOS_Window.manager object instance is the callback target
 * @type string
 */
define('SRAOS_TARGET_WIN', 'win');
// }}}

// {{{ SRAOS_PluginManager
/**
 * manages SIERRA::OS plugins. all methods are static
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_PluginManager {
	// Static methods
  
	// {{{ getApplication
	/**
	 * returns the application corresponding with the pluginId and appId specified
	 *
   * @param string $pluginId the application plugin id
   * @param string $appId the application id
	 * @access	public static
	 * @return	SRAOS_Application[]
	 */
	function &getApplication($pluginId, $appId) {
    if ($plugin =& SRAOS_PluginManager::getPlugin($pluginId)) {
      return $plugin->getApplication($appId);
    }
    return null;
	}
	// }}}
  
	// {{{ getApplicationOptions
	/**
	 * returns all of the applications from all of the plugins as an associative 
   * array where the array key is the unique application identifier, and the 
   * value is the label for that application
	 *
	 * @access	public static
	 * @return	array
	 */
	function getApplicationOptions() {
    static $appMap = array();
    
    if (!count($appMap)) {
      $plugins =& SRAOS_PluginManager::getPlugins();
      $keys = array_keys($plugins);
      foreach($keys as $key) {
        $apps =& $plugins[$key]->getApplications();
        $akeys = array_keys($apps);
        foreach($akeys as $akey) {
          $appMap[$plugins[$key]->getId() . ':' . $apps[$akey]->getId()] = $plugins[$key]->resources->getString($apps[$akey]->getResource());
        }
      }
    }
    return $appMap;
	}
	// }}}
  
	// {{{ getFirstPlugin
	/**
	 * returns the first plugin
   * 
   * @access  public
	 * @return SRAOS_Plugin
	 */
  function &getFirstPlugin() {
    $plugins =& SRAOS_PluginManager::getPlugins();
    $keys = array_keys($plugins);
    return $plugins[$keys[0]];
  }
  // }}}
  
	// {{{ getIconUri
	/**
	 * validates that an icon exists in the images/icons/16,32, and 64 directories
	 *
   * @param string $id the identifier of the plugin
   * @param string $icon the name of the icon.
	 * @access	public static
	 * @return	void
	 */
	function getIconUri($id, $icon) {
    global $user;
    $workspace =& $user->getActiveWorkspace();
    $theme = $workspace->myTheme->getName();
    $baseDir = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $id . '/www/icons/';
    return SRAOS_URI_PREFIX . (file_exists("${baseDir}16/${icon}") ? SRAOS_PLUGIN_URI . $id . '/icons/' : SRAOS_THEMES_URI . $theme . '/icons/');
	}
	// }}}
  
	// {{{ getJavascriptMethodCode
	/**
	 * returns the javascript code necessary in order to invoke the method defined 
   * by the method, target and params specified. returns the string 'null' if 
   * $method is not specified
	 *
   * @param string $method the name of the method
   * @param string $target the method target. null, "os", "app" or "win"
   * @param array $params params that should be passed in the method call in the 
   * form of an associative array
	 * @access	public static
	 * @return	string
	 */
	function getJavascriptMethodCode($method, $target, $params) {
    if ($method) {
      $pieces = explode('(', $method);
      $mparams = $pieces[1] ? str_replace(')', '', $pieces[1]) . ', ' : '';
      switch ($target) {
        case "os": 
          $method = 'OS.' . $pieces[0] . '(' . $mparams;
          break;
        case "app": 
          $method = "var target = OS.getFocusedApp().getManager() && OS.getFocusedApp().getManager()['" . $pieces[0] . "'] ? OS.getFocusedApp().getManager() : (OS.getFocusedApp()['" . $pieces[0] . "'] ? OS.getFocusedApp() : OS.getFocusedApp().getApplication()); target['" . $pieces[0] . "'](" . $mparams;
          break;
        case "win": 
          $method = "var target = OS.getFocusedWin().getManager() && OS.getFocusedWin().getManager()['" . $pieces[0] . "'] ? OS.getFocusedWin().getManager() : (OS.getFocusedWin()['" . $pieces[0] . "'] ? OS.getFocusedWin() : OS.getFocusedWin().getWindow()); target['" . $pieces[0] . "'](" . $mparams;
          break;
        default:
          $method = $pieces[0] . '(' . $mparams;
      }
      $method = str_replace('"', '\"', $method);
      if ($params) {
        $method .= '{';
        $keys = array_keys($params);
        foreach($keys as $key) {
          $method .= $key == $keys[0] ? '' : ', ';
          $method .= "'" . str_replace("'", "\'", $key) . "': " . str_replace("'", "\'", $params[$key]);
        }
        $method .= '}';
      }
      else if (SRA_Util::endsWith(trim($method), ',')) {
        $method .= 'null';
      }
      if (!SRA_Util::endsWith($method, ')')) {
        $method .= ')';
      }
      return $method;
    }
    return 'null';
	}
	// }}}
  
  
	// {{{ getLocalizedContent
	/**
	 * returns localized content based on the resource or file identifier specified
   * 
   * @access  public
	 * @return string
	 */
  function getLocalizedContent(& $plugin, $id) {
    if ($id && $plugin->resources->containsKey($id)) {
      return $plugin->resources->getString($id);
    }
    else if ($id) {
      $file = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $plugin->getId() . '/etc/l10n/' . $id;
      $extension = '';
      $pieces = explode('.', $id);
      if (count($pieces > 1)) {
        $file = '';
        $extension = $pieces[count($pieces) - 1];
        for($i=0; $i<count($pieces) - 1; $i++) {
          $file .= $i ? '.' : '';
          $file .= $pieces[$i];
        }
        $file = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $plugin->getId() . '/etc/l10n/' . $file;
      }
      $bundle = SRA_ResourceBundle::findLocaleFile($file, $extension);
      if (is_array($bundle) && isset($bundle['bundle'])) {
        return SRA_File::toString($bundle['bundle']);
      }
      else {
        $msg = "SRAOS_PluginManager::getLocalizedContent: Failed - Content '" . $id . "' is not valid";
        SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      }
    }
    return null;
  }
  // }}}
  
  
	// {{{ getPlugin
	/**
	 * returns the plugin specified by $pluginId
   * 
   * @access  public
	 * @return SRAOS_Plugin
	 */
  function &getPlugin($pluginId) {
    $plugins =& SRAOS_PluginManager::getPlugins();
    return $plugins[$pluginId];
  }
  // }}}
  
  
	// {{{ getPlugins
	/**
	 * returns an array of all of the installed plugins
   * 
   * @access  public
	 * @return SRAOS_Plugin[]
	 */
  function &getPlugins() {
    return SRAOS_PluginManager::init();
  }
  // }}}
  
  
	// {{{ init
	/**
	 * this method checks for any installed/uninstalled plugins and performs the 
   * steps necessary to complete those actions. if any errors occur in the 
   * process, an error will be logged but the initialization will continue. It 
   * returns an array of all of the valid installed plugins. this array is also 
   * set to the template variable SRAOS_PLUGIN_TPL_VAR
	 *
	 * @access	public static
	 * @return	SRAOS_Plugin
	 */
	function init() {
		static $plugins;
    if (!isset($plugins)) {
      // initialize plugins
      $plugins = array();
      $dirs = SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR, '*', FALSE, 2);
      foreach ($dirs as $dir) {
        if (substr(basename($dir), 0, 1) != '.') {
          if (SRAOS_Plugin::isValid($plugin =& SRAOS_PluginManager::initPlugin(basename($dir)))) {
            $plugins[basename($dir)] =& $plugin;
          }
        }
      }
      
      // remove deleted plugins
      $dirs = SRA_File::getFileList(SRA_Controller::getAppLibDir() . '/plugins');
      foreach ($dirs as $dir) {
        if (substr(basename($dir), 0, 1) != '.' && basename($dir) != 'README' && !isset($plugins[basename($dir)])) {
          SRAOS_PluginManager::removePlugin(basename($dir));
        }
      }
      
      // check dependencies, remove any plugins with un-satisfied dependencies
      $keys = array_keys($plugins);
      foreach ($keys as $key) {
        if (!$plugins[$key]->satisfiesDepedencies($keys)) {
          unset($plugins[$key]);
        }
      }
      
      // assign valid plugins in template
      $tpl =& SRA_Controller::getAppTemplate();
      $tpl->assignByRef(SRAOS_PLUGIN_TPL_VAR, $plugins);
    }
    return $plugins;
	}
	// }}}
  
  
	// {{{ initPlugin
	/**
	 * this method initializes an individual plugin
	 *
   * @param string $id the identifier of the plugin to initialize. this is the 
   * name of the directory in SRAOS_PLUGIN_DIR containing the plugin to 
   * initialize
	 * @access	public static
	 * @return	SRAOS_Plugin
	 */
	function &initPlugin($id) {
    $path = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $id;
    // validate structure of plugin directory
    if (!file_exists($path) || !file_exists("${path}/plugin.xml") || !file_exists("${path}/etc") || 
        !file_exists("${path}/etc/l10n") || !file_exists("${path}/lib") || !file_exists("${path}/tpl") || 
        !file_exists("${path}/www") || !file_exists("${path}/www/css") || !file_exists("${path}/www/lib") || 
        !file_exists("${path}/www/images") || !file_exists("${path}/www/icons") || !file_exists("${path}/www/icons/16") || 
        !file_exists("${path}/www/icons/32") || !file_exists("${path}/www/icons/64")) {
      $msg = "SRAOS_PluginManager::initPlugin: failed - Plugin ${id} does not contain mandatory structure in ${path} ";
      return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
    }
    
    // check if plugin symbolic links exist, create if they do not
    $etcLink = SRA_Controller::getAppConfDir() . "/plugins/${id}";
    if (!file_exists($etcLink)) {
      $ret = exec(SRA_File::findInPath(SRAOS_PLUGIN_LN_CMD) . " -s ${path}/etc " . $etcLink);
      if (!file_exists($etcLink)) {
        $msg = "SRAOS_PluginManager::initPlugin: failed - Unable to create symbolic link to etc directory: ${ret}";
        return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      }
    }
    $libLink = SRA_Controller::getAppLibDir() . "/plugins/${id}";
    if (!file_exists($libLink)) {
      $ret = exec(SRA_File::findInPath(SRAOS_PLUGIN_LN_CMD) . " -s ${path}/lib " . $libLink);
      if (!file_exists($libLink)) {
        $msg = "SRAOS_PluginManager::initPlugin: failed - Unable to create symbolic link to lib directory: ${ret}";
        return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      }
    }
    $tplLink = SRA_Controller::getAppDir() . "/www/tpl/plugins/${id}";
    if (!file_exists($tplLink)) {
      $ret = exec(SRA_File::findInPath(SRAOS_PLUGIN_LN_CMD) . " -s ${path}/tpl " . $tplLink);
      if (!file_exists($tplLink)) {
        $msg = "SRAOS_PluginManager::initPlugin: failed - Unable to create symbolic link to lib directory: ${ret}";
        return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      }
    }
    $wwwLink = SRA_Controller::getAppDir() . "/www/html/plugins/${id}";
    if (!file_exists($wwwLink)) {
      $ret = exec(SRA_File::findInPath(SRAOS_PLUGIN_LN_CMD) . " -s ${path}/www " . $wwwLink);
      if (!file_exists($wwwLink)) {
        $msg = "SRAOS_PluginManager::initPlugin: failed - Unable to create symbolic link to lib directory: ${ret}";
        return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      }
    }
    
    // instantiate and return new SRAOS_Plugin instance
		if (SRA_Error::isError($xmlParser =& SRA_XmlParser::getXmlParser("${path}/plugin.xml", TRUE))) {
			$msg = "SRAOS_PluginManager::initPlugin: Failed - plugin.xml could not be parsed for plugin ${id}";
			return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
		}
    $plugin = new SRAOS_Plugin($id, $xmlParser->getData('plugin'));
    
    if (!SRA_Error::isError($plugin->err)) {
      // include any php source files
      $files = SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . "${id}/lib");
      foreach ($files as $file) {
        if (!SRA_Util::beginsWith(basename($file), '.') && !SRA_Util::beginsWith(basename($file), '_') && SRA_Util::endsWith($file, '.php')) {
          include_once($file);
        }
      }
    }
    
    return SRA_Error::isError($plugin->err) ? $plugin->err : $plugin;
	}
	// }}}
  
  
	// {{{ removePlugin
	/**
	 * this method removes a plugin. this process basically involves simply 
   * removing any lingering symbolic links to that plugin in the lib/plugins, 
   * www/tpl/plugins or www/html/plugins directories
	 *
   * @param string $id the identifier of the plugin to remove.
	 * @access	public static
	 * @return	void
	 */
	function removePlugin($id) {
    $libLink = SRA_Controller::getAppLibDir() . "/plugins/${id}";
    exec(SRA_File::findInPath(SRAOS_PLUGIN_RM_CMD) . " -f ${libLink}");
    $tplLink = SRA_Controller::getAppDir() . "/www/tpl/plugins/${id}";
    exec(SRA_File::findInPath(SRAOS_PLUGIN_RM_CMD) . " -f ${tplLink}");
    $wwwLink = SRA_Controller::getAppDir() . "/www/html/plugins/${id}";
    exec(SRA_File::findInPath(SRAOS_PLUGIN_RM_CMD) . " -f ${wwwLink}");
	}
	// }}}
  
  
	// {{{ validateIcon
	/**
	 * validates that an icon exists in the images/icons/16,32, and 64 directories
	 *
   * @param string $id the identifier of the plugin
   * @param string $icon the name of the icon.
	 * @access	public static
	 * @return	void
	 */
	function validateIcon($id, $icon) {
    $baseDir = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $id . '/www/icons/';
    $themeDir = SRA_Controller::getAppDir() . SRAOS_THEMES_DIR;
    return (file_exists("${baseDir}16/${icon}") && file_exists("${baseDir}32/${icon}") && file_exists("${baseDir}64/${icon}") || 
           (file_exists("${themeDir}16/${icon}") && file_exists("${themeDir}32/${icon}") && file_exists("${themeDir}64/${icon}")));
	}
	// }}}
  
  
	// {{{ validateModel
	/**
	 * validates a plugin entity model
	 *
   * @param string $id the identifier of the plugin
   * @param string $model the entity model xml file to validate
	 * @access	public static
	 * @return	void
	 */
	function validateModel($id, $model) {
    $model = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $id . '/etc/' . $model;
    return file_exists($model);
	}
	// }}}
  

	// {{{ validateTemplate
	/**
	 * validates that an template exists in the tpl directory for the plugin
	 *
   * @param string $id the identifier of the plugin
   * @param string $tpl the name of the template
	 * @access	public static
	 * @return	void
	 */
	function validateTemplate($id, $tpl) {
    $baseDir = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $id . '/tpl/';
    return file_exists("${baseDir}${tpl}");
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
