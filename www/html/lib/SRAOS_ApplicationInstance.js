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
 * represents a single running application instance
 * @param int pid the unique process id for this application instance
 * @param String pluginId the identifier of the plugin that this application instance 
 * pertains to
 * @param String applicationId the identifier of the application that this is an 
 * instance of
 * @param boolean focused whether or not this application is currently focused
 * only 1 application can be in focus at any given point in time
 */
SRAOS_ApplicationInstance = function(pid, pluginId, applicationId) {
  // {{{ Attributes
  // public attributes
  this.isApplicationInstance = true;
  
  /**
   * the Core_Terminal for this app instance. this is instantiated the first 
   * time that 'exec' is invoked for this app instance
   * @type Core_Terminal
   */
  this.term;
  
	
  // private attributes
  /**
   * the unique process id for this application instance
   * @type int
   */
  this._pid = pid;
  
  /**
	 * the plugin that this application instance pertains to
	 * @type SRAOS_Plugin
	 */
	this._plugin = OS.getPlugin(pluginId);
  
  /**
	 * the application that this is an instance of
	 * @type string
	 */
	this._application = this._plugin.getApplication(applicationId);
  
  /**
	 * whether or not this application is currently focused only 1 application can 
   * be in focus at any given point in time
	 * @type boolean
	 */
	this._focused = false;
  
  /**
   * whether or not this application instance has been initialized
   * @type boolean
   */
  this._initialized = false;
  
  /**
   * the manager instance for this application instance
   * @type Object
   */
  this._manager = this._application.getManager() ? eval("SRAOS_ApplicationManager.populateMethods(new " + this._application.getManager() + ")") : new SRAOS_ApplicationManager();
  this._manager.app = this;
  this._manager.plugin = this._plugin;
  
  /**
	 * the windows that this application instance is already using
	 * @type SRAOS_WindowInstance[]
	 */
	this._windowInstances = new Array();
	
  // }}}
	
  
  // public operations
  
	// {{{ block
	/**
	 * blocks all windows active in this application instance
   * @param SRAOS_WindowInstance skip a window to not block if it is part of 
   * this applications' window instances
   * @access  public
	 * @return void
	 */
  this.block = function(skip) {
    for(i in this._windowInstances) {
      if (skip != this._windowInstances[i]) {
        this._windowInstances[i].block();
      }
    }
  };
  // }}}
  
	// {{{ closeWindow
	/**
	 * closes a specific active window instances for this application. returns 
   * true if windowInstance was valid and closed
   * @param SRAOS_WindowInstance windowInstance the window to close
   * @param boolean force whether or not to foce the window closure. if true, 
   * the return value of the window manager 'onClose' will be ignored
   * @access  public
	 * @return boolean
	 */
	this.closeWindow = function(windowInstance, force) {
    var divId = windowInstance.getDivId();
    var windowInstances = new Array();
    var found = false;
    for(i in this._windowInstances) {
      var check = this._windowInstances[i];
      if (check.getDivId() == divId && (check.close(force) || force)) {
        found = true;
      }
      else {
        windowInstances.push(check);
      }
    }
    this._windowInstances = windowInstances;
    return found;
  };
  // }}}
  
	// {{{ closeWindows
	/**
	 * closes all of the active window instances for this application. returns 
   * @param boolean force whether or not to foce the windows closure. if true, 
   * the return value of the window managers 'onClose' will be ignored
   * @access  public
	 * @return boolean
	 */
	this.closeWindows = function(force) {
    var primary;
    for(var i=0; i<this._windowInstances.length; i++) {
      if (!this._windowInstances[i].isPrimary()) {
        if (!this._windowInstances[i].close(force)) {
          return false;
        }
      }
      else {
        primary = this._windowInstances[i];
      }
    }
    if (primary && !primary.close(force)) {
      return false;
    }
    this._windowInstances = new Array();
    return true;
  };
  // }}}
  
	// {{{ displayHelp
	/**
	 * displays the help topics for this application if they have been defined in 
   * the plugin definition
   * @param String topic an optional sub-topic to display the help content for
   * @access  public
	 * @return void
	 */
	this.displayHelp = function(topic) {
    if (this._application.getHelpTopic()) {
      this._plugin.displayHelp(this._application.getHelpTopic(), topic);
    }
  };
  // }}}
  
	// {{{ displayWindow
	/**
	 * displays the window specified
   * @param int id the id of the SRAOS_Window to display. if not specified, the 
   * main window will be displayed
   * @param Array params initialization params if this application is being 
   * restored or custom parameters otherwise
   * @param Array vars window content variables: see SRAOS.displayWindow. if 
   * this array contains an index "title", that corresponding value will be used 
   * as the initial window title
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.displayWindow = function(id, params, vars) {
    // return current window if it is already active
    var baseWindow = this._application.getWindow(id);
    if (baseWindow && !baseWindow.isMultiInstance()) {
      for(i in this._windowInstances) {
        if (this._windowInstances[i].getWindow().getId() == id) {
          return this._windowInstances[i];
        }
      }
    }
    // create new window
    var containers;
    if (containers = OS.reserveWindowContainers(1)) {
      primary = id ? (params && params["primary"] ? true : false) : true;
      var mainWindow = this._application.getMainWindow();
      id = id ? id : (mainWindow ? mainWindow.getId() : null);
      if (id) {
        var window = new SRAOS_WindowInstance(this, this._plugin.getId(), id, containers[0]);
        this._windowInstances.push(window);
        if (window.init(primary, vars, params)) {
          return window;
        }
      }
    }
    return null;
  };
  // }}}
  
  // {{{ exec
	/**
	 * this is an alias to the SRAOS.exec method where the 'pid' parameter is the 
   * pid of this app instance  and the 'target' parameter is the manager for 
   * this app instance (or null if 'callback' is static)
   * @param String cmd the command to execute
   * @param String callback the callback method. this method should be either 
   * static or exist in the SRAOS_ApplicationManager instance for this 
   * application
   * @param Object target an optional object containing the callback method
   * @access  public
	 * @return mixed
	 */
	this.exec = function(cmd, callback, target) {
		return OS.exec(cmd, this._pid, target ? target : (callback && this._manager[callback] ? this._manager : null), callback);
	};
  // }}}
  
	// {{{ focus
	/**
	 * sets the focus to this application instance
   * @access  public
	 * @return void
	 */
	this.focus = function() {
    if (!this.isFocused()) {
      this._manager.onFocus();
      this.setFocused(true);
    }
	};
	// }}}
  
	// {{{ getFocusedWindow
	/**
	 * returns a reference to the currently focused window for this application 
   * or null if no windows are focused
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getFocusedWindow = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      if (this._windowInstances[i].isFocused()) {
        return this._windowInstances[i];
      }
    }
    // if not window is currently focused, set the focus to the last window
    if (this._windowInstances.length > 0) {
      this.resetWindowFocus(this._windowInstances[this._windowInstances.length - 1]);
      return this._windowInstances[this._windowInstances.length - 1];
    }
    return null;
  };
  // }}}
  
	// {{{ getPrimaryWindow
	/**
	 * returns a reference to the primary window for this application
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getPrimaryWindow = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      if (this._windowInstances[i].isPrimary()) {
        return this._windowInstances[i];
      }
    }
    return null;
  };
  // }}}
  
	// {{{ getState
	/**
	 * returns the encoded state for this application. returns false if modal 
   * modal windows could not be closed
   * @access  public
	 * @return string
	 */
	this.getState = function() {
    var state = 'applicationId:"' + this._application.getId();
    state += '",pluginId:"' + this._plugin.getId();
    state += '",focused:' + this._focused;
    state += ',windows:[';
    var started = false;
    for(var i=0; i<this._windowInstances.length; i++) {
      if (!this._windowInstances[i].isModal()) {
        state += started ? "," : "";
        state += "{" + this._windowInstances[i].getState() + "}";
        started = true;
      }
      else {
        var target = this._windowInstances[i].getModalTarget();
        // cancel if close of modal window is not successful
        if (!this.closeWindow(this._windowInstances[i])) {
          return false;
        }
        target.release(true);
      }
    }
    state += "]";
    state += ",manager:{";
    var params = this._manager.getState();
    var started = false;
    for (name in params) {
      state += started ? "," : "";
      state += '"' + SRAOS_Util.escapeQuotes(name) + '":' + SRAOS_Util.serialize(params[name]);
      started = true;
    }
    state += "}";
    return state;
	};
	// }}}
  
	// {{{ hide
	/**
	 * hides any windows open for this application
   * @access  public
	 * @return void
	 */
	this.hide = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      this._windowInstances[i].hide();
    }
    this._focused = false;
  };
  // }}}
  
	// {{{ init
	/**
	 * initializes this application instance including display of any windows 
   * returns true on success, false on failure. this method should ONLY be 
   * called once for a given instance of this class
   * @param Array params initialization params if this application is being 
   * restored
   * @access  public
	 * @return boolean
	 */
	this.init = function(params) {
		if (!this._initialized) {
      this._initialized = true;
      this._manager.params = params && params["manager"] ? params["manager"] : params;
      this._manager.init(params && params["manager"] ? params["manager"] : params);
      this._focused = params ? params["focused"] : this._focused;
      
      var focusWin = null;
      if (params && params["windows"]) {
        for(var i=0; i<params["windows"].length; i++) {
          win = this.displayWindow(params["windows"][i]["windowId"], params["windows"][i]);
          focusWin = !focusWin || (win && win.isFocused()) ? win : focusWin;
        }
      }
      else if (this._application.getMainWindow() && !(focusWin = this.displayWindow(null, params))) {
        return false;
      }
      if (focusWin) {
        this.resetWindowFocus(focusWin);
      }
      
      return !focusWin && this._application.getMainWindow() ? false : true;
    }
    return false;
	};
	// }}}
  
	// {{{ isHidden
	/**
	 * returns true if this application is currently hidden (any of its windows 
   * are hidden)
   * @access  public
	 * @return boolean
	 */
	this.isHidden = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      if (this._windowInstances[i].isHidden()) {
        return true;
      }
    }
    return false;
  };
  // }}}
  
	// {{{ launchWindow
	/**
	 * displays and sets focus to the window specified
   * @param int id the id of the SRAOS_Window to launch
   * @param Array params initialization params if this application is being 
   * restored or custom parameters otherwise
   * @param Array vars window content variables: see SRAOS.displayWindow. if 
   * this array contains an index "title", that corresponding value will be used 
   * as the initial window title
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.launchWindow = function(id, params, vars) {
    var window = this.displayWindow(id, params, vars);
    OS.focus(window, true);
    return window;
  };
  // }}}
  
	// {{{ onResize
	/**
	 * resizes this applications' window instances
   * @access  public
	 * @return void
	 */
	this.onResize = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      this._windowInstances[i].onResize();
    }
  };
  // }}}
  
	// {{{ release
	/**
	 * releases all windows active in this application instance. invoked after a 
   * "block" invocation
   * @access  public
	 * @return void
	 */
  this.release = function() {
    for(i in this._windowInstances) {
      this._windowInstances[i].release();
    }
  };
  // }}}
  
	// {{{ resetWindowFocus
	/**
	 * removes the focus from the current focused window to window
   * @param SRAOS_WindowInstance window the window to set the focus to
   * @access  public
	 * @return void
	 */
	this.resetWindowFocus = function(window) {
    for(var i=0; i<this._windowInstances.length; i++) {
      if (this._windowInstances[i].getDivId() != window.getDivId() && this._windowInstances[i].isFocused()) {
        this._windowInstances[i].setFocused(false);
      }
      else if (this._windowInstances[i].getDivId() == window.getDivId() && !this._windowInstances[i].isFocused()) {
        this._windowInstances[i].setFocused(true);
      }
    }
	};
	// }}}
  
	// {{{ show
	/**
	 * shows any hidden windows open for this application
   * @access  public
	 * @return void
	 */
	this.show = function() {
    if (this.isHidden()) {
      for(var i=0; i<this._windowInstances.length; i++) {
        if (this._windowInstances[i].isHidden()) {
          this._windowInstances[i].show();
        }
      }
      OS.renderApplicationIcons();
    }
  };
  // }}}
  
	// {{{ unFocus
	/**
	 * removes the focus from this application instance
   * @access  public
	 * @return void
	 */
	this.unFocus = function() {
    for(var i=0; i<this._windowInstances.length; i++) {
      this._windowInstances[i].unFocus();
    }
    if (this._focused) {
      OS.resetOsTitle();
      this._manager.onUnFocus();
    }
    this.setFocused(false);
	};
	// }}}
  
  
  // accessors
  
	// {{{ getManager
	/**
	 * returns the manager of this plugin
   * @access  public
	 * @return string
	 */
	this.getManager = function() {
		return this._manager;
	};
	// }}}
  
	// {{{ getPid
	/**
	 * returns the pid of this application instance
   * @access  public
	 * @return int
	 */
	this.getPid = function() {
		return this._pid;
	};
	// }}}
  
	// {{{ getPlugin
	/**
	 * returns the plugin of this application instance
   * @access  public
	 * @return SRAOS_Plugin
	 */
	this.getPlugin = function() {
		return this._plugin;
	};
	// }}}
  
	// {{{ getApplication
	/**
	 * returns the application of this application instance
   * @access  public
	 * @return SRAOS_Application
	 */
	this.getApplication = function() {
		return this._application;
	};
	// }}}
  
	// {{{ isCli
	/**
	 * returns true if this application instance is a command line program
   * @access  public
	 * @return boolean
	 */
	this.isCli = function() {
		return this._application.isCli();
	};
	// }}}
  
	// {{{ isFocused
	/**
	 * returns true if this application instance is currently focused
   * @access  public
	 * @return boolean
	 */
	this.isFocused = function() {
		return this._focused;
	};
	// }}}
  
	// {{{ setFocused
	/**
	 * sets the _focused instance variable
   * @param boolean focused the value to set
   * @access  public
	 * @return void
	 */
	this.setFocused = function(focused) {
		this._focused = focused;
	};
	// }}}
  
	// {{{ isService
	/**
	 * returns true if this application instance is a service
   * @access  public
	 * @return boolean
	 */
	this.isService = function() {
		return this._application.isService();
	};
	// }}}
  
	// {{{ getWindowInstance
	/**
	 * returns the first instance of the window identified by id
   * @param String id the id of the window instance to reeturn
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getWindowInstance = function(id) {
		for(var i in this._windowInstances) {
      if (this._windowInstances[i].getWindow().getId() == id) { return this._windowInstances[i]; }
    }
      return null;
	};
	// }}}
  
	// {{{ getWindowInstances
	/**
	 * returns the windows of this plugin
   * @access  public
	 * @return SRAOS_WindowInstance[]
	 */
	this.getWindowInstances = function() {
		return this._windowInstances;
	};
	// }}}
  
	// {{{ setWindowInstances
	/**
	 * sets the _windowInstances instance variable
   * @param SRAOS_WindowInstance[] windows the value to set
   * @access  public
	 * @return void
	 */
	this.setWindowInstances = function(windowInstances) {
		this._windowInstances = windowInstances;
	};
	// }}}
  
};

