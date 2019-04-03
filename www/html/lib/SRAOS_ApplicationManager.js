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
 * This is a template for creating custom application managers. application 
 * managers are assigned to each SRAOS_ApplicationInstance object instance. They 
 * contains event triggered callback methods that are invoked throughout the 
 * lifecycle of an application instance. the methods in this class represent all 
 * of the event based callback methods that can be defined for an application 
 * manager
 */
SRAOS_ApplicationManager = function() {
  
  /**
   * the instance of the application that this manager pertains to. this 
   * instance variable is set automatically when a application manager is 
   * instantiated
   * @type SRAOS_ApplicationInstance
   */
  this.app;
  
  /**
   * a reference to the params passed to the init method
   * @type Array
   */
  this.params;
  
  /**
   * the instance of the plugin that this manager pertains to. this instance 
   * variable is set automatically when a application manager is instantiated
   * @type SRAOS_Plugin
   */
  this.plugin;
  
  /**
   * used to reference the return values for command line applications
   * @type mixed
   */
  this.results = true;
  
  /**
   * identifies the current execution status for command line applications
   * @type int
   */
  this.status = SRAOS_ApplicationManager.STATUS_RUNNING;
  
  // {{{ getState
  /**
   * this method is called when the state of it's corresponding app instance 
   * is being saved. manager implementations may use it to save additional state 
   * information that will later be passed to the init method below when the 
   * app is restored. the return value should be an associative array of key
   * value initialization variables. Not used in cli applications
   * @access  public
	 * @return Array
	 */
	this.getState = function() {
		
	};
	// }}}
  
  // {{{ init
  /**
   * this method is called when the app is first opened and initialized. the 
   * params specified, are those generated from the previous "getState" call if 
   * this app is being restored
   * @param Array params the initialization parameters if this application is 
   * being restored, OR custom startup parameters specified by the application 
   * opener (if any) otherwise. for cli apps this array will contain the 
   * following values:
   *  'args' :     the full command line arguments string
   *  'argv':      an array containing the command line arguments. arguments are 
   *               delimited with spaces. spaces within single and double quotes 
   *               will not be delimited
   *  'argc':      the # of cli arguments (argv.length)
   *  'term':      a reference to the Terminal manager instance (Core_Terminal). 
   *               this object will contain the methods 'echo', 'exec', 
   *               'getHistory', 'getNode' and 'getEnv' which may be used within 
   *               the cli application instance. for more information on these 
   *               methods, see the api documentation provided in 
   *               Core_Terminal.js
   * params is also accessible via the params attribute
   * @access  public
	 * @return void
	 */
	this.init = function(params) {
		
	};
	// }}}
  
	// {{{ input
	/**
	 * Used only in cli applications. this is the method invoked after user input 
   * has been requested by the cli application instance (using the 
   * SRAOS_ApplicationManager.STATUS_WAIT status code returned by the 'run' or 
   * 'input' method) and that input has been provided by the user. It also 
   * should return one of the SRAOS_ApplicationManager.STATUS_* status codes 
   * indicating the new execution status. execution will either continue or 
   * terminate based on that return value
   * @param String input the input provided by the user
   * @access  public
	 * @return int
	 */
	this.input = function(input) {
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
  
	// {{{ onFocus
	/**
	 * this method is called when the the application is focused. return value is 
   * ignored. Not used in cli applications
   * @access  public
	 * @return void
	 */
	this.onFocus = function() {
		
	};
	// }}}
  
	// {{{ onLaunch
	/**
	 * this method is called when the application is first started. if it 
   * does not return true, the application launch will be aborted
   * @access  public
	 * @return boolean
	 */
	this.onLaunch = function() {
		return true;
	};
	// }}}
  
	// {{{ onTerminate
	/**
	 * this method is called when the application is terminated. if it 
   * does not return true, the application termination will be aborted. this 
   * method may be invoked while an application window is in the midst of a 
   * synchronouos wait process, so this method should be able to eliminate those 
   * processes if necessary prior to terminating
   * @param boolean force if true, the return value will be ignored and the 
   * application MUST terminate
   * @access  public
	 * @return boolean
	 */
	this.onTerminate = function(force) {
		return true;
	};
	// }}}
  
	// {{{ onWorkspaceToggleOff
	/**
	 * this method is called when an application is active in a given workspace 
   * and the user toggles to another workspace. return value is ignored. Not 
   * used in cli applications
   * @access  public
	 * @return void
	 */
	this.onWorkspaceToggleOff = function() {
		
	};
	// }}}
  
	// {{{ onWorkspaceToggleOn
	/**
	 * this method is called when the the application is restored after a 
   * workspace change. return value is ignored. Not used in cli applications
   * @access  public
	 * @return void
	 */
	this.onWorkspaceToggleOn = function() {
		
	};
	// }}}
  
	// {{{ onUnFocus
	/**
	 * this method is called when the the application is un-focused. return value 
   * is ignored. Not used in cli applications
   * @access  public
	 * @return void
	 */
	this.onUnFocus = function() {
		
	};
	// }}}
  
	// {{{ run
	/**
	 * Used only in cli applications. this is the method invoked when the 
   * application is first execute. it will be invoked after 'init'. It should 
   * return one of the SRAOS_ApplicationManager.STATUS_* status codes 
   * indicating the execution status. if the return status code is 
   * SRAOS_ApplicationManager.STATUS_RUNNING, the Terminal will poll the 
   * application using the 'status' attribute until that status changes. if 
   * the return status code is SRAOS_ApplicationManager.STATUS_WAIT, the 
   * Terminal will prompt the user for input and pass that input to the 
   * 'input' method once it is entered
   * @access  public
	 * @return int
	 */
	this.run = function() {
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};

// constaints
/**
 * status code used in cli applications to identify that the application 
 * execution is complete
 * @type int
 */
SRAOS_ApplicationManager.STATUS_TERMINATED = 1;

/**
 * status code used in cli applications to identify that the application 
 * execution is current pending. this could signify that the application is 
 * awainting an ajax invocation response for example. when this occurs, the 
 * Terminal will poll the manager for a change in status based on the 'status'
 * attribute
 * @type int
 */
SRAOS_ApplicationManager.STATUS_RUNNING = 2;

/**
 * status code used in cli applications to identify that the application 
 * execution is awaiting user input. when in this status, the terminal will 
 * allow the user to enter an input and when they have done so, that input will 
 * be passed to the 'input' method (see method api above)
 * @type int
 */
SRAOS_ApplicationManager.STATUS_WAIT = 3;


// static methods

// {{{ populateMethods
/**
 * this static method populates any missing SRAOS_ApplicationManager methods in 
 * object obj
 * @param Object obj the object to populate missing methods in
 * @access  public
 * @return SRAOS_ApplicationManager
 */
SRAOS_ApplicationManager.populateMethods = function(obj) {
  var base = new SRAOS_ApplicationManager();
  if (!obj.input) { obj.input = base.input; }
  if (!obj.getState) { obj.getState = base.getState; }
  if (!obj.init) { obj.init = base.init; }
  if (!obj.onFocus) { obj.onFocus = base.onFocus; }
  if (!obj.onLaunch) { obj.onLaunch = base.onLaunch; }
  if (!obj.onTerminate) { obj.onTerminate = base.onTerminate; }
  if (!obj.onWorkspaceToggleOff) { obj.onWorkspaceToggleOff = base.onWorkspaceToggleOff; }
  if (!obj.onWorkspaceToggleOn) { obj.onWorkspaceToggleOn = base.onWorkspaceToggleOn; }
  if (!obj.onUnFocus) { obj.onUnFocus = base.onUnFocus; }
  if (!obj.run) { obj.run = base.run; }
  if (!obj.results) { obj.results = base.results; }
  if (!obj.status) { obj.status = base.status; }
  return obj;
};
// }}}
