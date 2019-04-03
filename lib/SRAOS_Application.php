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
require_once('SRAOS_CliArg.php');
require_once('SRAOS_Window.php');
// }}}

// {{{ Constants
/**
 * the default value for SRAOS_Application._cliRetApi
 * @type string
 */
define('SRAOS_APPLICATION_DEFAULT_CLI_RET_API', 'text.cliReturnDefault');

/**
 * the default value for SRAOS_Application._cliRetType
 * @type string
 */
define('SRAOS_APPLICATION_DEFAULT_CLI_RET_TYPE', 'boolean');

/**
 * identifier for a focus window event
 * @type string
 */
define('SRAOS_APPLICATION_EVENT_MAXIMIZE', 'focus');

/**
 * identifier for a un-focus window event
 * @type string
 */
define('SRAOS_APPLICATION_EVENT_MAXIMIZE', 'unFocus');

/**
 * the identifier in a SRAOS_Menu array that identifies the application menu
 * @type string
 */
define('SRAOS_APPLICATION_MENU_ID', 'application');
// }}}

// {{{ SRAOS_Application
/**
 * represents a plugin application
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Application {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique application identifier
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the plugin this application pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this application pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * the content to display in the about dialog for this application. this may 
   * be any of the following values:
   *               1. a plugin resource bundle string identifier
   *               2. a platform relative localized file name. for example, if 
   *                  this value is "myhelp.html", the help topic content should 
   *                  exist in a file "plugin-dir/etc/l10n/myhelp.html". 
   *                  additional country/language specific help files may also 
   *                  be specified using the convention described in the 
   *                  following api documentation:
   *                  sierra/lib/util/l10n/SRA_ResourceBundle::findLocaleFile()
   * all content should be html formatted including line breaks
	 * @type string
	 */
	var $_about;
  
  /**
   * whether or not this application should be run via the core Terminal as a 
   * command line (non-GUI) application. cli applications are different from gui 
   * applications in the following ways:
   *
   *              1) the application identifier (key) should be unique globally 
   *              accross ALL plugins. this is the value through which this 
   *              application can be run from the Terminal. if duplicate names 
   *              exist a naming conflict error will be displayed when 
   *              executing that command and the full application identifier
   *              ([plugin id]:[app id]) will be necessary in order to execute 
   *              that application
   *              
   *              2) Unless otherwise specified, cli applications are hidden 
   *              (see 'hidden' attribute below). 
   *              
   *              3) if an icon is not specified the Terminal icon will be used
   *              
   *              4) 'main-window' is ignored
   *              
   *              5) 'about' is accessible via the 'man' command. the about 
   *              content can be html formatted
   *              
   *              6) 'help-topic' is accessible via the 'help' command
   *              
   *              7) 'multi-instance' is always true
   *              
   *              8) 'preferences' is ignored
   *              
   *              9) 'search-responder' is ignored
   *              
   *              10) 'service' is ignored
   *              
   *              11) onFocus and onUnFocus SRAOS_ApplicationManager methods are 
   *              never invoked
   *              
   *              12) cli application instances are terminated when a workspace 
   *              toggle or OS reload occurs, so the SRAOS_ApplicationManager 
   *              getState, onWorkspaceToggleOff, and onWorkspaceToggleOn 
   *              methods are never invoked. when a cli application (or any 
   *              other application) is terminated in this way, the onTerminate 
   *              method (with force set to true) should handle any necessary 
   *              clean up activities
   *              
   *              13) the params parameter of the init method will contain a 
   *              hash of all of the current environment variables as well as 
   *              the following initialization arguments:
   *               'args' :     the full command line arguments string
   *               'argv':      an array containing the command line arguments. 
   *                            arguments according to the cli-arg sub-element 
   *                            definitions
   *               'argc':      the # arguments in argv
   *               'term':      a reference to the Terminal manager instance
   *                            (Core_Terminal). this object will contain the 
   *                            methods 'echo', 'exec', 'getHistory', 'getNode' 
   *                            'getEnv', 'getTerminal' and other methods which 
   *                            may be used within the cli application instance. 
   *                            for more information on these methods, see the  
   *                            api documentation provided in Core_Terminal.js
   *                            If the application is being executed outside of 
   *                            a Terminal shell, the 'isHidden' method of term
   *                            will return true
   *                            
   *              14) all cli applications MUST specify a manager class and 
   *              this class must additionally contain the 'run' method.
   *
   *              15) application menus and windows are ignored
   * @type boolean
   */
  var $_cli;
  
  /**
   * defines the command line arguments supported by this application using the 
   * default argument model. this only applies to cli applications. for more 
   * information, see the SRAOS_CliArg api
   * @type array
   */
  var $_cliArgs = array();
  
  /**
   * for cli apps. if the standard argument model is not used using _cliArgs 
   * attributes, and this application accepts arguments, this should reference a 
   * string to display in the options section of the man entry for this 
   * application. if both this attribute and cli-arg sub-elements are specified, 
   * this value will be displayed at the top of the options section of the man 
   * entry
   * @type string
   */
  var $_cliArgsApi;
  
  /**
   * whether or not this cli application executes asynchronously. the return 
   * value for asynchronous cli applications will not be immediately available 
   * when invoked using OS.exec. for more details, see the api for OS.exec
   * @type boolean
   */
  var $_cliAsync;
  
  /**
   * the resource bundle string to use to describe the return value for cli 
   * applications. if not specified, the default api will be used: 
   * "true on success, false otherwise"
   * @type string
   */
  var $_cliRetApi;
  
  /**
   * the return data type for cli applications. by default, the return type is 
   * 'boolean'. the return value of a cli execution should be set to the 
   * corresponding SRAOS_ApplicationManager.results instance attribute for that
   * application. this value is used when for cli applications invoked using the 
   * SRAOS.exec method
   * @type string
   */
  var $_cliRetType;
  
  /**
	 * resource identifier for this application's group. grouped applications are 
   * not displayed immediately in the applications popup menu, but instead are 
   * grouped into a sub-menu item of that menu with other applications sharing 
   * the same group
	 * @type string
	 */
	var $_group;
  
  /**
	 * the identifier of the plugin help topic that should be displayed for help 
   * related information about this application
	 * @type string
	 */
	var $_helpTopic;
  
  /**
	 * whether or not this application is hidden. hidden applications do not 
   * appear in the dock applications launcher or process list
	 * @type boolean
	 */
	var $_hidden;
  
  /**
	 * the name of the plugin icon to use to represent this application
	 * @type string
	 */
	var $_icon;
  
  /**
   * the id of the plugin containing this application's icon
   * @type string
   */
  var $_iconPluginId;
  
  /**
	 * the name of the javascript class (within one of the plugin javascript 
   * source files) that should be instantiated and assigned to the 
   * SRAOS_Application instance _manager variable. one instance of this manager 
   * will exist per instance of this application. for more information, review 
   * the api documentation in www/html/lib/SRAOS_ApplicationManager.js
	 * @type string
	 */
	var $_manager;
  
  /**
	 * the main window for this application
	 * @type SRAOS_Window
	 */
	var $_mainWindow;
  
  /**
	 * the application menu
	 * @type SRAOS_Menu
	 */
	var $_menu;
  
  /**
	 * whether or not this application supports multiple concurrent instances. by 
   * default, an application only supports a single concurrent instance. change 
   * this attribute to true to allow multiple instances of this application to 
   * be active concurrently within a given os instance
	 * @type boolean
	 */
	var $_multiInstance;
  
  /**
	 * whether or not this application should have a permanent dock icon. 
   * permanent dock icons cannot be moved or removed from the user's dock. they 
   * are placed first in the dock starting from the left side after the 
   * workspace selector
	 * @type boolean
	 */
	var $_permaDocked;
  
  /**
	 * an optional application window identifier that should be displayed for this 
   * application's preferences panel. the preferences panel is opened when the 
   * user selects preferences from the application menu (the left most menu). if 
   * not specified, preferences will not be displayed in the application menu
	 * @type SRAOS_Window
	 */
	var $_preferences;
  
  /**
	 * the label for this application. this should reference a string value in one 
   * of the resources properties files. this value will be displayed in the 
   * applications directory and other locations referencing this application
	 * @type string
	 */
	var $_resource;
  
  /**
	 * should this application respond to user searches? user searches are 
   * performed utilizing the search icon in the upper right corner of the OS 
   * workspace. generally, only 1 application within a sierra::os instance 
   * should respond to user searches. search-responder applications must be 
   * multi-instance. each time a search is performed a new instance of the 
   * application will be launched with the initialization parameter "search" set 
   * to the search string entered by the user, and an optional "entities" 
   * parameter set to an array of entity identifiers specifying which entities 
   * should be included in the search
	 * @type boolean
	 */
	var $_searchResponder;
  
  /**
	 * services are applications that are started when the user first logs in and 
   * run in the background throughout the duration of the user's session. 
   * services can have windows but NOT a main-window, so when the service is 
   * started,a window will not appear. all of the same manager callbacks apply 
   * to an service application. only 1 instance of a service will be run accross 
   * multiple workspaces. services cannot be multi-instance. they will also 
   * appear in the "About" process list where the user will be able to terminate 
   * them unless the service is "hidden"
	 * @type boolean
	 */
	var $_service;
  
  /**
	 * the windows this application uses
	 * @type SRAOS_Window[]
	 */
	var $_windows = array();
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Application
	/**
	 * instantiates a new SRAOS_Plugin object based on the $id specified. if there 
   * are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the application
   * @param array $config the data to use to instantiate this application
   * @param SRAOS_Plugin $plugin the plugin that this application pertains to
   * @access  public
	 */
	function SRAOS_Application($id, & $config, & $plugin) {
    $this->_service = isset($config['attributes']['service']) && $config['attributes']['service'] == '1';
    $this->_cli = isset($config['attributes']['cli']) && $config['attributes']['cli'] == '1' ? TRUE : FALSE;
    if (!$id || !$plugin || !is_array($config) || (!isset($config['attributes']['about']) && isset($config['window']) && !$this->_cli) || 
        (!$this->_service && !$this->_cli && (!isset($config['window']) || !is_array($config['window']))) || 
        (isset($config['window']) && !isset($config['attributes']['icon'])) || 
        (isset($config['attributes']['main-window']) && !isset($config['window'][$config['attributes']['main-window']])) || 
        (isset($config['attributes']['preferences']) && !isset($config['window'][$config['attributes']['preferences']]))) {
			$msg = "SRAOS_Application::SRAOS_Application: Failed - insufficient data to instantiate application ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $this->_about = $config['attributes']['about'];
    $file = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $plugin->getId() . '/etc/l10n/' . $this->_about;
    if (!$plugin->resources->containsKey($this->_about) && !file_exists($file)) {
			$msg = "SRAOS_Application::SRAOS_Application: Failed - about " . $this->_about . " is not valid for application ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['help-topic']) && !SRAOS_HelpTopic::isValid($plugin->_helpTopics[$config['attributes']['help-topic']])) {
			$msg = "SRAOS_Application::SRAOS_Application: Failed - help topic " . $config['attributes']['help-topic']. " is not valid for application ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    // set default icon for cli applications
    $this->_iconPluginId = $plugin->getId();
    if (!$config['attributes']['icon'] && $this->_cli) {
      $config['attributes']['icon'] = 'terminal.png';
      $this->_iconPluginId = 'core';
    }
    
    if (!SRAOS_PluginManager::validateIcon($this->_iconPluginId, $config['attributes']['icon'])) {
			$msg = "SRAOS_Application::SRAOS_Application: Failed - icon " . $config['attributes']['icon']. " is not valid for application ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    // validate service
    if ($this->_service) {
      if (isset($config['attributes']['main-window'])) {
        $msg = "SRAOS_Application::SRAOS_Application: Failed - service application ${id} cannot have a main-window";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
      if (isset($config['attributes']['multi-instance']) && $config['attributes']['multi-instance'] == '1') {
        $msg = "SRAOS_Application::SRAOS_Application: Failed - service application ${id} cannot be multi-instance";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    $this->_cliArgsApi = isset($config['attributes']['cli-args-api']) ? $config['attributes']['cli-args-api'] : NULL;
    $this->_cliAsync = isset($config['attributes']['cli-async']) && $config['attributes']['cli-async'] == '1' ? TRUE : FALSE;
    $this->_cliRetApi = isset($config['attributes']['cli-ret-api']) ? $config['attributes']['cli-ret-api'] : SRAOS_APPLICATION_DEFAULT_CLI_RET_API;
    $this->_cliRetType = isset($config['attributes']['cli-ret-type']) ? $config['attributes']['cli-ret-type'] : SRAOS_APPLICATION_DEFAULT_CLI_RET_TYPE;
    $this->_icon = $config['attributes']['icon'];
    $this->_group = isset($config['attributes']['group']) ? $config['attributes']['group'] : NULL;
    $this->_helpTopic = isset($config['attributes']['help-topic']) ? $config['attributes']['help-topic'] : NULL;
    $this->_hidden = $this->_cli ? (isset($config['attributes']['hidden']) && $config['attributes']['hidden'] == '0' ? FALSE : TRUE) : (isset($config['attributes']['hidden']) && $config['attributes']['hidden'] == '1' ? TRUE : FALSE);
    $this->_manager = $config['attributes']['manager'];
    $this->_multiInstance = $this->_cli ? TRUE : (isset($config['attributes']['multi-instance']) && $config['attributes']['multi-instance'] == '1' ? TRUE : FALSE);
    $this->_permaDocked = isset($config['attributes']['perma-docked']) && $config['attributes']['perma-docked'] == '1' ? TRUE : FALSE;
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $id;
    $this->_searchResponder = $this->_cli ? FALSE : (isset($config['attributes']['search-responder']) && $config['attributes']['search-responder'] == '1' ? TRUE : FALSE);
    $this->_service = $this->_cli ? FALSE : (isset($config['attributes']['service']) && $config['attributes']['service'] == '1' ? TRUE : FALSE);
    
    // validate search-responder
    if ($this->_searchResponder && !$this->_multiInstance) {
			$msg = "SRAOS_Application::SRAOS_Application: Failed - application ${id} is designated as a search-responder but is not multi-instance";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
    // add application menu (about, preferences, quit)
    if (!$this->_cli) {
      $menuConfig = array('attributes' => array('resource' => $plugin->resources->getString($this->_resource)));
      $menuConfig['menu'] = array();
      
      // add additional menu items
      if (isset($config['menu'])) {
        $keys = array_keys($config['menu']);
        foreach ($keys as $key) {
          $menuConfig['menu'][$key] = $config['menu'][$key];
        }
        $menuConfig['menu'][$key]['attributes']['divider-below'] = '1';
      }
      
      // about menu
      $menuConfig['menu']['about_' . $id] = array('attributes' => array('method' => 'aboutApplication', 'resource' => $plugin->resources->getString('text.about') . ' ' . $plugin->resources->getString($this->_resource), 'target' => 'os'));
      
      // preferences
      if (isset($config['attributes']['preferences'])) {
        $menuConfig['menu']['preferences_' . $id] = array('attributes' => array('divider-above' => '1', 'method' => 'launchWindow(\'' . $config['attributes']['preferences'] . '\')', 'resource' => 'text.preferences', 'target' => 'app'));
      }
      
      // hide
      $menuConfig['menu']['hide_' . $id] = array('attributes' => array('divider-above' => '1', 'method' => 'hide', 'resource' => 'window.hide', 'target' => 'os'));
      
      // quit
      $menuConfig['menu']['quit_' . $id] = array('attributes' => array('divider-above' => '1', 'method' => 'terminateAppInstance', 'resource' => 'text.exit', 'target' => 'os'));
      
      // instantiate application menu
      $this->_menu = new SRAOS_Menu($id . 'Menu', $menuConfig, $this->_id, $plugin, $this->_id);
      if (SRA_Error::isError($this->_menu)) {
        $msg = "SRAOS_Application::SRAOS_Application: Failed - Unable to instantiate application menu for ${id}";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
      
      // add windows
      if (isset($config['window'])) {
        $keys = array_keys($config['window']);
        foreach ($keys as $key) {
          $this->_windows[$key] = new SRAOS_Window($key, $config['window'][$key], $plugin, $this->_icon, $this->_resource, $this->_menu);
          if (SRA_Error::isError($this->_windows[$key]->err)) {
            $msg = "SRAOS_Application::SRAOS_Application: Failed - Unable to instantiate SRAOS_Window ${key}";
            $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
            return;
          }
        }
      }
      if ($config['attributes']['main-window']) {
        $this->_mainWindow =& $this->_windows[$config['attributes']['main-window']];
      }
      if (isset($config['attributes']['preferences'])) {
        $this->_preferences =& $this->_windows[$config['attributes']['preferences']];
      }
    }
    // add cli argument
    else if (isset($config['cli-arg'])) {
      $keys = array_keys($config['cli-arg']);
      foreach ($keys as $key) {
        $this->_cliArgs[$key] = new SRAOS_CliArg($key, $config['cli-arg'][$key], $plugin);
        if (SRA_Error::isError($this->_cliArgs[$key]->err)) {
          $msg = "SRAOS_Application::SRAOS_Application: Failed - Unable to instantiate SRAOS_CliArg ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
	}
	// }}}
	
  
  // public operations
  
	// {{{ getIconPath
	/**
	 * returns the full path to this icon for the size specified
   * @param int $size the size of the icon
   * @access  public
	 * @return string
	 */
	function getIconPath($size) {
		return $this->_icon ? SRAOS_PluginManager::getIconUri($this->_iconPluginId, $this->_icon) . "${size}/" . $this->_icon : NULL;
	}
	// }}}
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   * 
   * SRAOS_Application(id, pluginId, about, cli, cliArgs, cliArgsApi, cliAsync, cliRetApi, cliRetLabel, group, helpTopic, hidden, icon, iconUri, label, manager, mainWindow, multiInstance, permaDocked, preferences, searchResponder, service, windows)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_Application("' . $this->_id . '", "' . $this->_pluginId . '", ';
    $code .= '"' . str_replace('"', '\"', str_replace("\n", "", SRAOS_PluginManager::getLocalizedContent($this->_plugin, $this->_about))) . '", ';
    $code .= $this->_cli ? 'true, ' : 'false, ';
    
    // cli args
    $code .= '[';
    if ($this->_cliArgs) {
      $keys = array_keys($this->_cliArgs);
      foreach($keys as $key) {
        $code .= $keys[0] != $key ? ', ' : '';
        $code .= $this->_cliArgs[$key]->getJavascriptInstanceCode();
      }
    }
    $code .= '],';
    
    $code .= $this->_cliArgsApi ? '"' . str_replace('"', '\"', $this->_plugin->resources->getString($this->_cliArgsApi)) . '", ' : 'null, ';
    $code .= $this->_cliAsync ? 'true, ' : 'false, ';
    $code .= '"' . str_replace('"', '\"', $this->_plugin->resources->getString($this->_cliRetApi)) . '", ';
    $code .= '"' . str_replace('"', '\"', $this->_cliRetType) . '", ';
    $code .= $this->_group ? '"' . $this->_group . '", ' : 'null, ';
    $code .= $this->_helpTopic ? '"' . $this->_helpTopic . '", ' : 'null, ';
    $code .= $this->_hidden ? 'true, ' : 'false, ';
    $code .= '"' . $this->_icon . '", ';
    $code .= '"' . SRAOS_PluginManager::getIconUri($this->_iconPluginId, $this->_icon) . '", ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    $code .= $this->_manager ? '"' . $this->_manager . '", ' : 'null, ';
    $code .= $this->_mainWindow ? '"' . $this->_mainWindow->getId() . '", ' : 'null, ';
    $code .= $this->_multiInstance ? 'true, ' : 'false, ';
    $code .= $this->_permaDocked ? 'true, ' : 'false, ';
    $code .= $this->_preferences ? '"' . $this->_preferences->getId() . '", ' : 'null, ';
    $code .= $this->_searchResponder ? 'true, ' : 'false, ';
    $code .= $this->_service ? 'true, ' : 'false, ';
    
    // windows
    $code .= '[';
    if ($this->_windows) {
      $keys = array_keys($this->_windows);
      foreach($keys as $key) {
        $code .= $keys[0] != $key ? ', ' : '';
        $code .= $this->_windows[$key]->getJavascriptInstanceCode();
      }
    }
    $code .= '])';
    
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this application
   * @access  public
	 * @return string
	 */
	function getLabel() {
		return $this->_plugin->resources->getString($this->_resource);
	}
	// }}}
  
  
  // getters/setters
	// {{{ getId
	/**
	 * returns the id of this application
   * @access  public
	 * @return string
	 */
	function getId() {
		return $this->_id;
	}
	// }}}
	
	// {{{ setId
	/**
	 * sets the plugin id
	 * @param string $id the id to set
   * @access  public
	 * @return void
	 */
	function setId($id) {
		$this->_id = $id;
	}
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this application
   * @access  public
	 * @return string
	 */
	function getPluginId() {
		return $this->_pluginId;
	}
	// }}}
	
	// {{{ setPluginId
	/**
	 * sets the plugin pluginId
	 * @param string $pluginId the pluginId to set
   * @access  public
	 * @return void
	 */
	function setPluginId($pluginId) {
		$this->_pluginId = $pluginId;
	}
	// }}}
  
	// {{{ getAbout
	/**
	 * returns the about of this application
   * @access  public
	 * @return string
	 */
	function getAbout() {
		return $this->_about;
	}
	// }}}
	
	// {{{ setAbout
	/**
	 * sets the plugin about
	 * @param string $about the about to set
   * @access  public
	 * @return void
	 */
	function setAbout($about) {
		$this->_about = $about;
	}
	// }}}
  
	// {{{ isCli
	/**
	 * returns the cli of this application
   * @access  public
	 * @return boolean
	 */
	function isCli() {
		return $this->_cli;
	}
	// }}}
	
	// {{{ setCli
	/**
	 * sets the plugin cli
	 * @param boolean $cli the cli to set
   * @access  public
	 * @return void
	 */
	function setCli($cli) {
		$this->_cli = $cli;
	}
	// }}}
  
	// {{{ getCliArgs
	/**
	 * returns the cliArgs of this application
   * @access  public
	 * @return string
	 */
	function getCliArgs() {
		return $this->_cliArgs;
	}
	// }}}
	
	// {{{ setCliArgs
	/**
	 * sets the plugin cliArgs
	 * @param string $cliArgs the cliArgs to set
   * @access  public
	 * @return void
	 */
	function setCliArgs($cliArgs) {
		$this->_cliArgs = $cliArgs;
	}
	// }}}
  
	// {{{ getCliArgsApi
	/**
	 * returns the cliArgsApi of this application
   * @access  public
	 * @return string
	 */
	function getCliArgsApi() {
		return $this->_cliArgsApi;
	}
	// }}}
	
	// {{{ setCliArgsApi
	/**
	 * sets the plugin cliArgsApi
	 * @param string $cliArgsApi the cliArgsApi to set
   * @access  public
	 * @return void
	 */
	function setCliArgsApi($cliArgsApi) {
		$this->_cliArgsApi = $cliArgsApi;
	}
	// }}}
  
	// {{{ isCliAsync
	/**
	 * returns the cliAsync of this application
   * @access  public
	 * @return boolean
	 */
	function isCliAsync() {
		return $this->_cliAsync;
	}
	// }}}
	
	// {{{ setCliAsync
	/**
	 * sets the plugin cliAsync
	 * @param boolean $cliAsync the cliAsync to set
   * @access  public
	 * @return void
	 */
	function setCliAsync($cliAsync) {
		$this->_cliAsync = $cliAsync;
	}
	// }}}
  
	// {{{ getCliRetApi
	/**
	 * returns the cliRetApi of this application
   * @access  public
	 * @return string
	 */
	function getCliRetApi() {
		return $this->_cliRetApi;
	}
	// }}}
	
	// {{{ setCliRetApi
	/**
	 * sets the plugin cliRetApi
	 * @param string $cliRetApi the cliRetApi to set
   * @access  public
	 * @return void
	 */
	function setCliRetApi($cliRetApi) {
		$this->_cliRetApi = $cliRetApi;
	}
	// }}}
  
	// {{{ getCliRetType
	/**
	 * returns the cliRetType of this application
   * @access  public
	 * @return string
	 */
	function getCliRetType() {
		return $this->_cliRetType;
	}
	// }}}
	
	// {{{ setCliRetType
	/**
	 * sets the plugin cliRetType
	 * @param string $cliRetType the cliRetType to set
   * @access  public
	 * @return void
	 */
	function setCliRetType($cliRetType) {
		$this->_cliRetType = $cliRetType;
	}
	// }}}
  
	// {{{ getGroup
	/**
	 * returns the group of this application
   * @access  public
	 * @return string
	 */
	function getGroup() {
		return $this->_group;
	}
	// }}}
	
	// {{{ setGroup
	/**
	 * sets the plugin group
	 * @param string $group the group to set
   * @access  public
	 * @return void
	 */
	function setGroup($group) {
		$this->_group = $group;
	}
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the helpTopic of this application
   * @access  public
	 * @return string
	 */
	function getHelpTopic() {
		return $this->_helpTopic;
	}
	// }}}
	
	// {{{ setHelpTopic
	/**
	 * sets the plugin helpTopic
	 * @param string $helpTopic the helpTopic to set
   * @access  public
	 * @return void
	 */
	function setHelpTopic($helpTopic) {
		$this->_helpTopic = $helpTopic;
	}
	// }}}
  
	// {{{ isHidden
	/**
	 * returns the hidden of this application
   * @access  public
	 * @return boolean
	 */
	function isHidden() {
		return $this->_hidden;
	}
	// }}}
	
	// {{{ setHidden
	/**
	 * sets the plugin hidden
	 * @param boolean $hidden the hidden to set
   * @access  public
	 * @return void
	 */
	function setHidden($hidden) {
		$this->_hidden = $hidden;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this application
   * @access  public
	 * @return string
	 */
	function getIcon() {
		return $this->_icon;
	}
	// }}}
	
	// {{{ setIcon
	/**
	 * sets the plugin icon
	 * @param string $icon the icon to set
   * @access  public
	 * @return void
	 */
	function setIcon($icon) {
		$this->_icon = $icon;
	}
	// }}}
  
	// {{{ getManager
	/**
	 * returns the manager of this application
   * @access  public
	 * @return string
	 */
	function getManager() {
		return $this->_manager;
	}
	// }}}
	
	// {{{ setManager
	/**
	 * sets the plugin manager
	 * @param string $manager the manager to set
   * @access  public
	 * @return void
	 */
	function setManager($manager) {
		$this->_manager = $manager;
	}
	// }}}
  
	// {{{ getMainWindow
	/**
	 * returns the mainWindow of this application
   * @access  public
	 * @return SRAOS_Window
	 */
	function getMainWindow() {
		return $this->_mainWindow;
	}
	// }}}
	
	// {{{ setMainWindow
	/**
	 * sets the plugin mainWindow
	 * @param SRAOS_Window $mainWindow the mainWindow to set
   * @access  public
	 * @return void
	 */
	function setMainWindow($mainWindow) {
		$this->_mainWindow = $mainWindow;
	}
	// }}}
  
	// {{{ getMenu
	/**
	 * returns the menu of this application
   * @access  public
	 * @return SRAOS_Menu
	 */
	function getMenu() {
		return $this->_menu;
	}
	// }}}
	
	// {{{ setMenu
	/**
	 * sets the plugin menu
	 * @param SRAOS_Menu $menu the menu to set
   * @access  public
	 * @return void
	 */
	function setMenu($menu) {
		$this->_menu = $menu;
	}
	// }}}
  
	// {{{ isMultiInstance
	/**
	 * returns the multiInstance of this application
   * @access  public
	 * @return boolean
	 */
	function isMultiInstance() {
		return $this->_multiInstance;
	}
	// }}}
	
	// {{{ setMultiInstance
	/**
	 * sets the plugin multiInstance
	 * @param boolean $multiInstance the multiInstance to set
   * @access  public
	 * @return void
	 */
	function setMultiInstance($multiInstance) {
		$this->_multiInstance = $multiInstance;
	}
	// }}}
  
	// {{{ isPermaDocked
	/**
	 * returns the permaDocked of this application
   * @access  public
	 * @return boolean
	 */
	function isPermaDocked() {
		return $this->_permaDocked;
	}
	// }}}
	
	// {{{ setPermaDocked
	/**
	 * sets the plugin permaDocked
	 * @param boolean $permaDocked the permaDocked to set
   * @access  public
	 * @return void
	 */
	function setPermaDocked($permaDocked) {
		$this->_permaDocked = $permaDocked;
	}
	// }}}
  
	// {{{ getPreferences
	/**
	 * returns the preferences of this application
   * @access  public
	 * @return SRAOS_Window
	 */
	function getPreferences() {
		return $this->_preferences;
	}
	// }}}
	
	// {{{ setPreferences
	/**
	 * sets the plugin preferences
	 * @param SRAOS_Window $preferences the preferences to set
   * @access  public
	 * @return void
	 */
	function setPreferences($preferences) {
		$this->_preferences = $preferences;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this application
   * @access  public
	 * @return string
	 */
	function getResource() {
		return $this->_resource;
	}
	// }}}
	
	// {{{ setResource
	/**
	 * sets the plugin resource
	 * @param string $resource the resource to set
   * @access  public
	 * @return void
	 */
	function setResource($resource) {
		$this->_resource = $resource;
	}
	// }}}
  
	// {{{ isSearchResponder
	/**
	 * returns the searchResponder of this application
   * @access  public
	 * @return boolean
	 */
	function isSearchResponder() {
		return $this->_searchResponder;
	}
	// }}}
	
	// {{{ setSearchResponder
	/**
	 * sets the plugin searchResponder
	 * @param boolean $searchResponder the searchResponder to set
   * @access  public
	 * @return void
	 */
	function setSearchResponder($searchResponder) {
		$this->_searchResponder = $searchResponder;
	}
	// }}}
  
	// {{{ isService
	/**
	 * returns the service of this application
   * @access  public
	 * @return boolean
	 */
	function isService() {
		return $this->_service;
	}
	// }}}
	
	// {{{ setService
	/**
	 * sets the plugin service
	 * @param boolean $service the service to set
   * @access  public
	 * @return void
	 */
	function setService($service) {
		$this->_service = $service;
	}
	// }}}
  
	// {{{ getWindow
	/**
	 * returns the window specified
   * @access  public
	 * @return SRAOS_Application
	 */
	function & getWindow($winId) {
		return $this->_windows[$winId];
	}
	// }}}
  
	// {{{ getWindows
	/**
	 * returns the windows of this application
   * @access  public
	 * @return SRAOS_Window[]
	 */
	function & getWindows() {
		return $this->_windows;
	}
	// }}}
	
	// {{{ setWindows
	/**
	 * sets the plugin windows
	 * @param SRAOS_Window[] $windows the windows to set
   * @access  public
	 * @return void
	 */
	function setWindows(& $windows) {
		$this->_windows =& $windows;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Application object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_application');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>