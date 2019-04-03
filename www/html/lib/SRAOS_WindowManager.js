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
 | Unless required by winlicable law or agreed to in writing, software     |
 | distributed under the License is distributed on an "AS IS" BASIS,       |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.|
 | See the License for the specific language governing permissions and     |
 | limitations under the License.                                          |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 */

/**
 * This is a template for creating custom window managers. window managers are 
 * assigned to each SRAOS_WindowInstance object instance. They contains event 
 * triggered callback methods that are invoked throughout the lifecycle of a 
 * window instance. the methods in this class represent all of the event based 
 * callback methods that can be defined for an window manager. all managers will 
 * have the instance variable, "win" automatically set to the window instance 
 * they pertain to
 */
SRAOS_WindowManager = function() {
  
  /**
   * a reference to the params passed to the init method
   * @type Array
   */
  this.params;
  
  /**
   * the instance of the plugin that this manager pertains to. this instance 
   * variable is set automatically when a window manager is instantiated
   * @type SRAOS_Plugin
   */
  this.plugin;
  
  /**
   * the instance of the window that this manager pertains to. this instance 
   * variable is set automatically when a window manager is instantiated
   * @type SRAOS_WindowInstance
   */
  this.win;
  
  
  // {{{ getState
  /**
   * this method is called when the state of it's corresponding window instance 
   * is being saved. manager implementations may use it to save additional state 
   * information that will later be passed to the init method below when the 
   * window is restored. the return value should be an associative array of key
   * value initialization variables
   * @access  public
	 * @return Array
	 */
	this.getState = function() {
		
	};
	// }}}
  
  // {{{ init
  /**
   * this method is called when the window is first opened and initialized. the 
   * params specified, are those generated from the previous "getState" call if 
   * this window is being restored. the window will not be visible when this 
   * method is invoked. 
   * @param Array params the initialization parameters if this window is being 
   * restored, OR custom startup parameters specified by the window opener 
   * (if any) otherwise
   * params is also accessible via the params attribute
   * @access  public
	 * @return void
	 */
	this.init = function(params) {
		
	};
	// }}}
  
	// {{{ onClick
	/**
	 * invoked whenever the window is clicked on. a window click may or may not 
   * invoke the onFocus event depending on whether or not the window is already 
   * focused. however, this method will always be invoked when the window is 
   * clicked. this event method may be useful for re-focusing form elements 
   * whenever the window is clicked. it is invoked AFTER the focus occurs
   * @access  public
	 * @return void
	 */
	this.onClick = function() {
		
	};
	// }}}
  
	// {{{ onClose
	/**
	 * this method is called when the window is closed. if it does not return 
   * true, the close event will be aborted
   * @param boolean force if true, the return value will be ignored and the 
   * window MUST close
   * @access  public
	 * @return boolean
	 */
	this.onClose = function(force) {
		return true;
	};
	// }}}
  
	// {{{ onFocus
	/**
	 * this method is called when the the window is focused. return value is 
   * ignored
   * @access  public
	 * @return void
	 */
	this.onFocus = function() {
		
	};
	// }}}
  
	// {{{ onMinimize
	/**
	 * this method is called when an window is minimized. if it does not return 
   * true, the window will not be minimized
   * @access  public
	 * @return boolean
	 */
	this.onMinimize = function() {
    // TODO
		return true;
	};
	// }}}
  
	// {{{ onMaximize
	/**
	 * this method is called when an window is maximized. if it does not return 
   * true, the window will not be maximized
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return boolean
	 */
	this.onMaximize = function(height, width) {
		return true;
	};
	// }}}
  
	// {{{ onOpen
	/**
	 * this method is called when the window is first opened. if it does not 
   * return true, the window open event will be aborted and the window will not 
   * be displayed
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return boolean
	 */
	this.onOpen = function(height, width) {
		return true;
	};
	// }}}
  
  // {{{ onResize
	/**
	 * this method is called when a window resize event occurs. return value is 
   * ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return void
	 */
	this.onResize = function(height, width) {
		
	};
	// }}}
  
  // {{{ onResizeEnd
	/**
	 * this method is called when a window resize event is ended. this includes  
   * after a maximize and restore has occurred. return value is ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return void
	 */
	this.onResizeEnd = function(height, width) {
		
	};
	// }}}
  
  // {{{ onResizeStart
	/**
	 * this method is called when a window resize event is started. return value 
   * is ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return void
	 */
	this.onResizeStart = function(height, width) {
		
	};
	// }}}
  
	// {{{ onRestoreMaximized
	/**
	 * this method is called when an window is restored from a maximized position. 
   * if it does not return true, the window will not be restored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return boolean
	 */
	this.onRestoreMaximized = function(height, width) {
		return true;
	};
	// }}}
  
	// {{{ onRestoreMinimized
	/**
	 * this method is called when an window is restored from a minimized position. 
   * if it does not return true, the window will not be restored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return boolean
	 */
	this.onRestoreMinimized = function(height, width) {
		return true;
	};
	// }}}
  
	// {{{ onWorkspaceToggleOff
	/**
	 * this method is called when an window is active in a given workspace and the 
   * user toggles to another workspace. return value is ignored.
   * @access  public
	 * @return void
	 */
	this.onWorkspaceToggleOff = function() {
		
	};
	// }}}
  
	// {{{ onWorkspaceToggleOn
	/**
	 * this method is called when the the window is restored after a workspace 
   * change. return value is ignored
   * @access  public
	 * @return void
	 */
	this.onWorkspaceToggleOn = function() {
		
	};
	// }}}
  
	// {{{ onUnFocus
	/**
	 * this method is called when the the window is un-focused. return value is 
   * ignored.
   * @access  public
	 * @return void
	 */
	this.onUnFocus = function() {
		
	};
	// }}}
  
};


// {{{ populateMethods
/**
 * this static method populates any missing SRAOS_ApplicationManager methods in 
 * object obj
 * @param Object obj the object to populate missing methods in
 * @access  public
 * @return SRAOS_ApplicationManager
 */
SRAOS_WindowManager.populateMethods = function(obj) {
  var base = new SRAOS_WindowManager();
  if (!obj.getState) { obj.getState = base.getState; }
  if (!obj.init) { obj.init = base.init; }
  if (!obj.onClick) { obj.onClick = base.onClick; }
  if (!obj.onClose) { obj.onClose = base.onClose; }
  if (!obj.onFocus) { obj.onFocus = base.onFocus; }
  if (!obj.onMinimize) { obj.onMinimize = base.onMinimize; }
  if (!obj.onMaximize) { obj.onMaximize = base.onMaximize; }
  if (!obj.onOpen) { obj.onOpen = base.onOpen; }
  if (!obj.onResize) { obj.onResize = base.onResize; }
  if (!obj.onResizeEnd) { obj.onResizeEnd = base.onResizeEnd; }
  if (!obj.onResizeStart) { obj.onResizeStart = base.onResizeStart; }
  if (!obj.onRestoreMaximized) { obj.onRestoreMaximized = base.onRestoreMaximized; }
  if (!obj.onRestoreMinimized) { obj.onRestoreMinimized = base.onRestoreMinimized; }
  if (!obj.onWorkspaceToggleOff) { obj.onWorkspaceToggleOff = base.onWorkspaceToggleOff; }
  if (!obj.onWorkspaceToggleOn) { obj.onWorkspaceToggleOn = base.onWorkspaceToggleOn; }
  if (!obj.onUnFocus) { obj.onUnFocus = base.onUnFocus; }
  return obj;
};
// }}}
