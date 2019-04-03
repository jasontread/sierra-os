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

/**
 * This class manages behavior and state of a SIERRA::OS application
 */
SRAOS_Application = function(id, pluginId, about, cli, cliArgs, cliArgsApi, cliAsync, cliRetApi, cliRetType, group, helpTopic, hidden, icon, iconUri, label, manager, mainWindow, multiInstance, permaDocked, preferences, searchResponder, service, windows) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique application identifier
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this application pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
	 * the about description for this application
	 * @type string
	 */
	this._about = about;
  
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
  this._cli = cli;
  
  /**
   * defines the command line arguments supported by this application using the 
   * default argument model. this only applies to cli applications. for more 
   * information, see the SRAOS_CliArg api
   * @type array
   */
  this._cliArgs = cliArgs;
  
  /**
   * for cli apps. if the standard argument model is not used using _cliArgs 
   * attributes, and this application accepts arguments, this should reference a 
   * string to display in the options section of the man entry for this 
   * application. if both this attribute and cli-arg sub-elements are specified, 
   * this value will be displayed at the top of the options section of the man 
   * entry
   * @type string
   */
  this._cliArgsApi = cliArgsApi;
  
  /**
   * whether or not this cli application executes asynchronously. the return 
   * value for asynchronous cli applications will not be immediately available 
   * when invoked using OS.exec. for more details, see the api for OS.exec
   * @type boolean
   */
  this._cliAsync = cliAsync;
  
  /**
   * the string to use to describe the return value for cli applications. if not 
   * specified, the default api will be used: "true on success, false otherwise"
   * @type string
   */
  this._cliRetApi = cliRetApi;
  
  /**
   * the return data type for cli applications. by default, the return type is 
   * 'boolean'. the return value of a cli execution should be set to the 
   * corresponding SRAOS_ApplicationManager.results instance attribute for that
   * application. this value is used when for cli applications invoked using the 
   * SRAOS.exec method
   * @type string
   */
  this._cliRetType = cliRetType;
  
  /**
	 * resource identifier for this application's group. grouped applications are 
   * not displayed immediately in the applications popup menu, but instead are 
   * grouped into a sub-menu item of that menu with other applications sharing 
   * the same group
	 * @type string
	 */
	this._group = group;
  
  /**
	 * the identifier of the plugin help topic that should be displayed for help 
   * related information about this application
	 * @type string
	 */
	this._helpTopic = helpTopic;
  
  /**
	 * whether or not this application is hidden. hidden applications do not 
   * appear in the dock applications launcher or process list
	 * @type boolean
	 */
	this._hidden = hidden;
  
  /**
	 * the name of the plugin icon to use to represent this application
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
	 * the label for this application. this value will be displayed in the 
   * applications directory and other locations referencing this application
	 * @type string
	 */
	this._label = label;
  
  /**
	 * the name of the javascript class (within one of the plugin javascript 
   * source files) that should be instantiated to act as the manager for this 
   * application when it is invoked. one manager per instance of an 
   * SRAOS_ApplicationInstance will be instantiated. for more information on the 
   * methods that may be implemented in this class, review the api documentation
   * in: sraos/www/html/lib/SRAOS_ApplicationManager.js
	 * @type string
	 */
	this._manager = manager;
  
  /**
	 * the identifier of the main window for this application
	 * @type string
	 */
	this._mainWindow = mainWindow;
  
  /**
	 * whether or not this application supports multiple concurrent instances. by 
   * default, an application only supports a single concurrent instance. change 
   * this attribute to true to allow multiple instances of this application to 
   * be active concurrently within a given os instance
	 * @type string
	 */
	this._multiInstance = multiInstance;
  
  /**
	 * whether or not this application should have a permanent dock icon. 
   * permanent dock icons cannot be moved or removed from the user's dock. they 
   * are placed first in the dock starting from the left side after the 
   * workspace selector
	 * @type boolean
	 */
	this._permaDocked = permaDocked;
  
  /**
	 * an optional application window identifier that should be displayed for this 
   * application's preferences panel. the preferences panel is opened when the 
   * user selects preferences from the application menu (the left most menu). if 
   * not specified, preferences will not be displayed in the application menu
	 * @type string
	 */
	this._preferences = preferences;
  
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
	this._searchResponder = searchResponder;
  
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
	this._service = service;
  
  /**
	 * the windows this application uses
	 * @type SRAOS_Window[]
	 */
	this._windows = windows;
	
  // }}}
	
  
  // public operations
  
  // accessors
  
	// {{{ getId
	/**
	 * returns the id of this application
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this application
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getAbout
	/**
	 * returns the about of this application
   * @access  public
	 * @return string
	 */
	this.getAbout = function() {
		return this._about;
	};
	// }}}
  
	// {{{ isCli
	/**
	 * returns the cli of this application
   * @access  public
	 * @return boolean
	 */
	this.isCli = function() {
		return this._cli;
	};
	// }}}
  
	// {{{ getCliArgs
	/**
	 * returns the cliArgs of this application
   * @access  public
	 * @return string
	 */
	this.getCliArgs = function() {
		return this._cliArgs;
	};
	// }}}
  
	// {{{ getCliArgsApi
	/**
	 * returns the cliArgsApi of this application
   * @access  public
	 * @return string
	 */
	this.getCliArgsApi = function() {
		return this._cliArgsApi;
	};
	// }}}
  
	// {{{ isCliAsync
	/**
	 * returns the cliAsync of this application
   * @access  public
	 * @return boolean
	 */
	this.isCliAsync = function() {
		return this._cliAsync;
	};
	// }}}
  
	// {{{ getCliRetApi
	/**
	 * returns the cliRetApi of this application
   * @access  public
	 * @return string
	 */
	this.getCliRetApi = function() {
		return this._cliRetApi;
	};
	// }}}
  
	// {{{ getCliRetType
	/**
	 * returns the cliRetType of this application
   * @access  public
	 * @return string
	 */
	this.getCliRetType = function() {
		return this._cliRetType;
	};
	// }}}
  
	// {{{ getGroup
	/**
	 * returns the group of this application
   * @access  public
	 * @return string
	 */
	this.getGroup = function() {
		return this._group;
	};
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the help topic of this application or null if it does not have one
   * @access  public
	 * @return string
	 */
	this.getHelpTopic = function() {
		return this._helpTopic;
	};
	// }}}
  
	// {{{ isHidden
	/**
	 * returns the hidden of this application
   * @access  public
	 * @return boolean
	 */
	this.isHidden = function() {
		return this._hidden;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this application
   * @access  public
	 * @return string
	 */
	this.getIcon = function() {
		return this._icon;
	};
	// }}}
  
	// {{{ getIconPath
	/**
	 * returns the full uri path to the icon of the specified size
   * @access  public
	 * @return string
	 */
	this.getIconPath = function(size) {
		return this._icon && size ? this.getIconUri(size, this._icon) : null;
	};
	// }}}
  
	// {{{ getIconUri
	/**
	 * returns the iconUri of this application
   * @param int size an optional icon size. if not specified, the path to the 
   * base icon uri will be returned
   * @param String icon an optional icon. if not specified, the path to the icon
   * directory will be returned
   * @access  public
	 * @return string
	 */
	this.getIconUri = function(size, icon) {
		return this._iconUri + (size ? size : "") + (size && icon ? "/" + icon : "");
	};
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label of this window
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
  
	// {{{ getManager
	/**
	 * returns the manager of this application
   * @access  public
	 * @return string
	 */
	this.getManager = function() {
		return this._manager;
	};
	// }}}
  
	// {{{ getMainWindow
	/**
	 * returns the mainWindow of this application
   * @access  public
	 * @return SRAOS_Window
	 */
	this.getMainWindow = function() {
		return this.getWindow(this._mainWindow);
	};
	// }}}
  
	// {{{ isMultiInstance
	/**
	 * returns the multiInstance of this application
   * @access  public
	 * @return boolean
	 */
	this.isMultiInstance = function() {
		return this._multiInstance;
	};
	// }}}
  
	// {{{ isPermaDocked
	/**
	 * returns the permaDocked of this application
   * @access  public
	 * @return boolean
	 */
	this.isPermaDocked = function() {
		return this._permaDocked;
	};
	// }}}
  
	// {{{ getPreferences
	/**
	 * returns the preferences of this application
   * @access  public
	 * @return SRAOS_Window
	 */
	this.getPreferences = function() {
		return this.getWindow(this._preferences);
	};
	// }}}
  
	// {{{ isSearchResponder
	/**
	 * returns the searchResponder of this application
   * @access  public
	 * @return boolean
	 */
	this.isSearchResponder = function() {
		return this._searchResponder;
	};
	// }}}
  
	// {{{ isService
	/**
	 * returns the service of this application
   * @access  public
	 * @return boolean
	 */
	this.isService = function() {
		return this._service;
	};
	// }}}
  
	// {{{ getWindow
	/**
	 * returns the window specified or null if id is not valid
   * @param string id the id of the window to return
   * @access  public
	 * @return SRAOS_Window
	 */
	this.getWindow = function(id) {
		for(var i=0; i<this._windows.length; i++) {
      if (this._windows[i].getId() == id) {
        return this._windows[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getWindows
	/**
	 * returns the windows of this application
   * @access  public
	 * @return SRAOS_Window[]
	 */
	this.getWindows = function() {
		return this._windows;
	};
	// }}}
};

