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
 * represents a single window instance
 * @param SRAOS_ApplicationInstance appInstance the application instance that this window pertains to
 * @param String windowId the identifier of the SRAOS_Window this window instance represents
 * @param String divId the id of the div this window is contained within
 * @param boolean focused whether or not this window currently has the application focus
 * @param int height the current height of this window. if not specified, the default window value will be used.
 * @param int maximized whether or not this window is currently maximized. if not specified, the default window value will be used.
 * @param String status the current status bar text for this window (if applicable). if not specified, the default window value will be used.
 * @param String title the current title text for this window (if other than the default). if not specified, the default window value will be used.
 * @param int width the current width of this window. if not specified, the default window value will be used.
 * @param x the current window x position. if not specified, the default window value will be used.
 * @param y the current window y position. if not specified, the default window value will be used.
 */
SRAOS_WindowInstance = function(appInstance, pluginId, windowId, divId, focused, height, maximized, status, title, width, x, y) {

  // {{{ Attributes
  // public attributes
  this.isWindowInstance = true;
  
  // private attributes
  /**
	 * the application instance that this window pertains to
	 * @type SRAOS_ApplicationInstance
	 */
	this._appInstance = appInstance;
  
  /**
	 * the plugin that this window instance pertains to
	 * @type SRAOS_Plugin
	 */
	this._plugin = OS.getPlugin(pluginId);
  
  /**
	 * the SRAOS_Window this window instance represents
	 * @type SRAOS_Window
	 */
	this._window = appInstance ? appInstance.getApplication().getWindow(windowId) : this._plugin.getWindow(windowId);
  
  /**
   * if this window instance is blocked by another window, this will be a 
   * reference to the blocking window
   * @type SRAOS_WindowInstance
   */
  this._blockedBy = null;
  
  /**
   * used to keep track of the enabled/disabled status of buttons
   * @type Array
   */
  this._buttonStatus = new Array();
  
  /**
   * set to true when this window instance is closed via the close method
   * @type boolean
   */
  this._closed = false;
  
  /**
	 * the id of the div this window is contained within
	 * @type String
	 */
	this._divId = divId;
  
  /**
	 * whether or not this window currently has the application focus
	 * @type boolean
	 */
	this._focused = focused ? true : false;
  
  /**
	 * the current height of this window
	 * @type int
	 */
	this._height = height ? height : this._window.getDefaultHeight();
  
  /**
   * whether or not this window instance is currently blocked (see methods 
   * "block" and "release" for more information on blocking)
   * @type boolean
   */
  this._isBlocked = false;
  
  /**
   * the manager instance for this window instance
   * @type Object
   */
  this._manager = this._window.getManager() ? eval("SRAOS_WindowManager.populateMethods(new " + this._window.getManager() + ")") : new SRAOS_WindowManager();
  this._manager.plugin = this._plugin;
  this._manager.win = this;
  
  /**
	 * whether or not this window is currently maximized
	 * @type boolean
	 */
	this._maximized = maximized != null ? maximized : this._window.isDefaultMaximize();
  
  /**
	 * whether or not this window is currently minimized
	 * @type boolean
	 */
	this._minimized = false;
  
  /**
   * used to keep track of the enabled/disabled status of menus
   * @type Array
   */
  this._menuStatus = new Array();
  
  /**
   * if this window instance is modal, this attribute contains a reference to 
   * the object (SRAOS, SRAOS_ApplicationInstance or SRAOS_WindowInstance) that 
   * should be blocked/released when it is opened/closed
   * @type Object
   */
  this._modalTarget = this._window.isModal() ? OS : (this._window.isModalApp() ? OS.getFocusedApp() : (this._window.isModalWin() ? OS.getFocusedWin() : null));
  
  /**
   * code to execute (using eval) when this window is closed
   * @type String
   */
  this._onCloseExecute;
  
  /**
   * a reference to the window that had the focus when this application was 
   * launched. used to apply opener modal behavior
   * @type SRAOS_WindowInstance
   */
  this._opener = OS.getFocusedWin();
  
  /**
	 * whether or not this is the primary application window. closing it will 
   * close the application
	 * @type boolean
	 */
	this._primary = false;
  
  /**
   * whether or not the scrollbars for this window are currently hidden
   * @type boolean
   */
  this._scrollbarsHidden = false;
  
  /**
	 * whether or not the next window close should skip any window specified 
   * confirmation messages
	 * @type boolean
	 */
	this._skipCloseConfirm = false;
  
  /**
	 * the current status bar text for this window (if applicable)
	 * @type String
	 */
	this._status = status ? status : "";
  
  /**
   * temporarily stores the parameters associated with a submitForm invocation
   * @type Array
   */
  this._submitFormParams;
  
  /**
   * used to keep track of the current step in a syncWait operation
   * @type int
   */
  this._syncCurrentStep = 0;
  
  /**
   * the current sync message
   * @type String
   */
  this._syncMsg = "";
  
  /**
   * the current sync message append text
   * @type String
   */
  this._syncMsgAppend = "";
  
  /**
   * used to temporarily store the # of steps specified through a syncWait 
   * method invocation
   * @type int
   */
  this._syncWaitSteps = 0;
  
  /**
	 * the current title text for this window (if other than the default)
	 * @type String
	 */
	this._title = title ? title : this._window.getLabel();
  
  /**
   * vars used to initialize content for this window instance
   * @type Array
   */
  this._vars;
  
  /**
	 * the current width of this window
	 * @type int
	 */
	this._width = width ? width : this._window.getDefaultWidth();
  
  /**
	 * the current window x position
	 * @type int
	 */
	this._x = x ? x : this._window.getDefaultX();
  
  /**
	 * the current window y position
	 * @type int
	 */
	this._y = y ? y : this._window.getDefaultY();
  
  
  /**
	 * whether or not this window should be centered
	 * @type boolean
	 */
	this._centered = !this._maximized && !x && !y && (this._window.isDefaultCenter() || this._window.isCenterOpener());

  // }}}
  
  
  // public methods
  
	// {{{ adjustDragConstraints
	/**
	 * adjusts the drag constraints for this window instance
   * @access  public
	 * @return void
	 */
  this.adjustDragConstraints = function() {
    if (!this._window.isFixedPosition()) {
      var div = document.getElementById(this._divId);
      x = this.getX();
      y = this.getY();
      var height = this.getHeight() + y <= OS.getWorkspaceHeight() ? this.getHeight() : OS.getWorkspaceHeight() - y;
      var width = this.getWidth() + x <= OS.getWorkspaceWidth() ? this.getWidth() : OS.getWorkspaceWidth() - x;
      div.maxX = OS.getWorkspaceWidth() - width;
      div.maxY = OS.getWorkspaceHeight() - height + this._window.getHeightBuffer();
    }
  };
  // }}}
  
	// {{{ block
	/**
	 * blocks this window instance. no controls will be available while the window 
   * is blocked
   * @param SRAOS_WindowInstance window the window that is blocking this window 
   * (if applicable)
   * @access  public
	 * @return void
	 */
  this.block = function(window) {
    this.getElementById("Wait").style.visibility = "visible";
    this._isBlocked = true;
    this._blockedBy = window;
    this.hideScrollbars();
  };
  // }}}
  
	// {{{ center
	/**
	 * centers the window container used by this window instance
   * @param SRAOS_WindowInstance window optional param specifying a window 
   * instance that this new window should be centered over
   * @access  public
	 * @return void
	 */
	this.center = function(window) {
    var div = document.getElementById(this._divId);
    var workspaceHeight = window ? window.getHeight() : OS.getWorkspaceHeight();
    var workspaceWidth = window ? window.getWidth() : OS.getWorkspaceWidth();
    var x = Math.round((workspaceWidth - parseInt(div.style.width)) / 2) + (window ? window.getX() : 0);
    var y = Math.round((workspaceHeight - parseInt(div.style.height)) / 2) + (window ? window.getY() : 0);
    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    div.style.left = x + "px";
    div.style.top = y + "px";
    this._x = x;
    this._y = y;
	};
	// }}}
  
	// {{{ clearStatusBarText
	/**
	 * clears the status text for this window instance
   * @access  public
	 * @return void
	 */
	this.clearStatusBarText = function() {
		this.setStatusBarText("");
	};
	// }}}
  
	// {{{ close
	/**
	 * closes this window instance. returns true on success
   * @param boolean force whether or not to foce the window closure. if true, 
   * the return value of the window manager 'onClose' will be ignored
   * @access  public
	 * @return boolean
	 */
	this.close = function(force) {
    var closeConfirm = this._window.getCloseConfirm();
    if ((!this._blockedBy || OS.closeWindow(this._blockedBy)) && (this._skipCloseConfirm || !closeConfirm || !this.isDirty() || OS.confirm(this._plugin.getString(closeConfirm))) && (this._manager.onClose(force) || force)) {
      // save window state
      if (this._window.isSaveState()) { SRAOS_WindowInstance.STATE[this._window.getId()] = {'maximized': this.isMaximized(), 'centered': this.isCentered(), 'x': this.getX(), 'y': this.getY(), 'height': this.getHeight(), 'width': this.getWidth()}; }
      
      this._skipCloseConfirm = false;
      var div = document.getElementById(this._divId);
      var resizeHandler = this.getElementById("ResizeHandler");
      div.style.visibility = "hidden";
      if (resizeHandler) {
        resizeHandler.style.visibility = "inherit";
      }
      if (this._modalTarget) { this._modalTarget.release(); }
      
      // hide menus
      if (this._window.getMenus().length > 0) {
        document.getElementById(this._plugin.getId() + ":" + this._window.getId() + ":menu").style.visibility = "hidden";
        OS.resetOsTitle();
      }
      document.getElementById("windowMenu").style.visibility = "hidden";
      OS.releaseWindowContainer(this._divId);
      this._closed = true;
      if (this._onCloseExecute) { eval(this._onCloseExecute); }
      return true;
    }
    return false;
	};
	// }}}
  
	// {{{ disableButton
	/**
	 * disables a window button. returns true on success, false on failure
   * @param String id the id of the button to disable
   * @access  public
	 * @return boolean
	 */
	this.disableButton = function(id) {
    var component = this.getElementById(this._plugin.getId() + id);
    if (component && component.onclick != null) {
      component.style.opacity = SRAOS_WindowInstance.DISABLED_BUTTON_OPACITY;
      component.onClickBase = component.onclick;
      component.onclick = null;
      component.style.cursor = "default";
      this._buttonStatus[id] = false;
      return true;
    }
    return false;
	};
	// }}}
  
	// {{{ disableMenuItem
	/**
	 * disables a menu item used by this window. returns true on success, false on 
   * failure
   * @param String id the id of the menu item to disable
   * @access  public
	 * @return boolean
	 */
	this.disableMenuItem = function(id) {
		var menuItem = OS.getMenuItem(this._plugin.getId(), id);
    if (menuItem) {
      this._menuStatus[id] = false;
      return menuItem.disable();
    }
    return false;
	};
	// }}}
  
	// {{{ displayHelp
	/**
	 * displays the help topics for this window if they have been defined in 
   * the plugin definition
   * @param String topic an optional sub-topic to display the help content for
   * @access  public
	 * @return void
	 */
	this.displayHelp = function(topic) {
    if (this._window.getHelpTopic()) {
      this._plugin.displayHelp(this._window.getHelpTopic(), topic);
    }
    else if (this._appInstance) {
      this._appInstance.displayHelp(topic);
    }
  };
  // }}}
  
	// {{{ enableButton
	/**
	 * enables a window button. returns true on success, false on failure
   * @param String id the id of the button to disable
   * @access  public
	 * @return boolean
	 */
	this.enableButton = function(id) {
    var component = this.getElementById(this._plugin.getId() + id);
    if (component && component.onClickBase) {
      component.style.opacity = SRAOS_WindowInstance.ENABLED_BUTTON_OPACITY;
      component.onclick = component.onClickBase;
      component.style.cursor = "pointer";
      this._buttonStatus[id] = true;
      return true;
    }
    return false;
	};
	// }}}
  
	// {{{ enableMenuItem
	/**
	 * enables a menu item used by this window. returns true on success, false on 
   * failure
   * @param String id the id of the menu item to enable
   * @access  public
	 * @return boolean
	 */
	this.enableMenuItem = function(id) {
		var menuItem = OS.getMenuItem(this._plugin.getId(), id);
    if (menuItem) {
      this._menuStatus[id] = true;
      return menuItem.enable();
    }
    return false;
	};
	// }}}
  
	// {{{ focus
	/**
	 * focuses this window instance
   * @access  public
	 * @return void
	 */
	this.focus = function() {
		var div = document.getElementById(this._divId);
    if (div.style.visibility != "visible" || div.style.opacity != 1) {
      div.style.zIndex = this._window.isModal() ? SRAOS.MODAL_WINDOW_Z_INDEX : (this.isFocused() ? SRAOS.FOCUSED_WINDOW_Z_INDEX : SRAOS.FOCUSED_APPLICATION_Z_INDEX);
      div.style.visibility = "visible";
      div.style.opacity = 1;
      // show menus
      if (this._window.getMenus().length > 0) {
        OS.clearOsTitle();
        document.getElementById(this._plugin.getId() + ":" + this._window.getId() + ":menu").style.visibility = "visible";
      }
      this.initWindowMenu();
      this._manager.onFocus();
      this.setFocused(true);
      this.showScrollbars();
    }
	};
	// }}}
  
	// {{{ getCanvas
	/**
	 * returns a reference to the canvas div instance
   * @access  public
	 * @return Object
	 */
  this.getCanvas = function() {
    return this.getElementById("Canvas");
  };
  // }}}
  
	// {{{ getCanvasHeight
	/**
	 * returns the height of the window canvas area
   * @access  public
	 * @return int
	 */
  this.getCanvasHeight = function() {
    return this.getElementById("Canvas").offsetHeight-1;
  };
  // }}}
  
	// {{{ getCanvasWidth
	/**
	 * returns the width of the window canvas area
   * @access  public
	 * @return int
	 */
  this.getCanvasWidth = function() {
    return this.getElementById("Canvas").offsetWidth-2;
  };
  // }}}
  
	// {{{ getCloseMsg
	/**
	 * returns the message to display in the close icon for this window
   * @access  public
	 * @return String
	 */
  this.getCloseMsg = function() {
    return this.getAppInstance() && this._primary ? OS.getString('text.exit') + ' ' + this.getAppInstance().getApplication().getLabel() : OS.getString('window.close');
  };
  // }}}
  
	// {{{ getCurrentSyncStep
	/**
	 * returns the current sync step
   * @access  public
	 * @return int
	 */
  this.getCurrentSyncStep = function() {
    return this._syncCurrentStep;
  };
  // }}}
  
  // {{{ getDomElements
  /**
   * used to retrieve dom elements through downward traversal through the window
   * canvas area. only those sub-elements with matching matchAttrs will be 
   * returned
   * @param Object match hash containing element attribute/value pairs to match.  
   * the values in this hash may optionally be arrays where a match will occur if 
   * any value in that array is matched. if a match value is null, the element 
   * will match it as long as it contains something for that attribute. if null, 
   * all elements will be returned
   * @param boolean matchAll whether or not to match all of the values in 'match'. 
   * if false, only 1 value need match
   * @param boolean caseSensitive whether or not the matching should be case 
   * sensitive
   * @param int limit an optional limit for the number of elements to return. if 
   * specified, the search will stop and that # of elements will be returned when 
   * limit is reached. if limit is 1, the return value will be a reference to 
   * the first element and NOT an array
   * @param int direction bitmask defining which direction(s) to transcend the 
   * dom in this search. if not specified, SRAOS_Util.GET_DOM_ELEMENTS_DOWN will 
   * be assumed. for more information, see the api documentation for 
   * SRAOS_Util.GET_DOM_ELEMENTS_* below
   * @access  public
   * @return mixed
   */
  this.getDomElements = function(match, matchAll, caseSensitive, limit, direction) {
    return SRAOS_Util.getDomElements(this.getElementById('Canvas'), match, matchAll, caseSensitive, limit, direction);
  };
  // }}}
  
  // {{{ getElementById
  /**
   * returns the element within this window with the id specified
   * @param String id the id of the element to return. the standard 
   * document.getElementById method will not work because each id is prefixed by 
   * the unique window div id
   * @access  public
   * @return Object
   */
  this.getElementById = function(id) {
    return document.getElementById(this._divId + id);
  };
  // }}}
  
	// {{{ getForm
	/**
	 * returns a reference to the form used by this window
   * @access  public
	 * @return Object
	 */
  this.getForm = function() {
    return this.getElementById("Form");
  };
  // }}}
  
	// {{{ getFormField
	/**
	 * returns a reference to the form field specified
   * @param String name the name of the form field to return
   * @access  public
	 * @return String
	 */
  this.getFormField = function(name) {
    var fields = this.getFormFields();
    for(var i=0; i<fields.length; i++) {
      if (name == fields[i].name) {
        return fields[i];
      }
    }
    return null;
  };
  // }}}
  
	// {{{ getFormFields
	/**
	 * returns the form fields contained within this window as an array
   * @param Object skip hash containing element attribute/value pairs of child 
   * container elements in 'container' whose form elements should be skipped
   * @param boolean skipAll whether or not to match all of the values in 'skip'. 
   * if false, only 1 value need match
   * @access  public
	 * @return Array
	 */
  this.getFormFields = function(skip, skipAll) {
    return SRAOS_Util.getFormFields(this.getElementById('Canvas'), skip, skipAll);
  };
  // }}}
  
	// {{{ getFormValue
	/**
	 * returns the value of the form field specified
   * @param String name the name of the form field to return the value for
   * @access  public
	 * @return String
	 */
  this.getFormValue = function(name) {
    var vals = this.getFormValues();
    return vals[name];
  };
  // }}}
  
	// {{{ getFormValues
	/**
	 * returns the form values contained within this window as an associative 
   * array, where the key in the array is the form input name, and the value is 
   * the current value of that field. this method works for all form input types 
   * (input, select, textarea) except file input fields
   * @param Object skip hash containing element attribute/value pairs of child 
   * container elements in 'container' whose form elements should be skipped
   * @param boolean skipAll whether or not to match all of the values in 'skip'. 
   * if false, only 1 value need match
   * @param boolean includeFiles whether or not to include file fields (default is 
   * false)
   * @access  public
	 * @return Array
	 */
  this.getFormValues = function(skip, skipAll, includeFiles) {
    return SRAOS_Util.getFormValues(this.getElementById('Canvas'), skip, skipAll, includeFiles);
  };
  // }}}
  
	// {{{ getState
	/**
	 * returns the encoded state for this window
   * @access  public
	 * @return string
	 */
	this.getState = function() {
    var state = 'windowId:"' + this._window.getId();
    state += '",pluginId:"' + this._plugin.getId();
    state += '",maximized:' + this._maximized;
    state += ',primary:' + this._primary;
    state += ',status:' + (this._status ? SRAOS_Util.serialize(this._status) : 'null');
    state += ',title:' + (this._title ? SRAOS_Util.serialize(this._title) : 'null');
    state += ',centered:' + this._centered;
    state += ',focused:' + (this == OS.getFocusedWin());
    state += ',x:' + this.getX();
    state += ',y:' + this.getY();
    state += ',height:' + this.getHeight();
    state += ',width:' + this.getWidth();
    state += ',manager:{';
    var params = this._manager.getState();
    var started = false;
    for (name in params) {
      state += started ? "," : "";
      state += '"' + SRAOS_Util.escapeQuotes(name) + '":' + SRAOS_Util.serialize(params[name]);
      started = true;
    }
    state += "}";
    if (this._vars) {
      state += ",vars:{";
      var started = false;
      for (name in this._vars) {
        state += started ? "," : "";
        state += '"' + SRAOS_Util.escapeQuotes(name) + '":' + SRAOS_Util.serialize(this._vars[name]);
        started = true;
      }
      state += "}";
    }
    // button enabled status
    if (this._window.getToolbarButtons()) {
      state += ",buttons:{";
      var started = false;
      for(id in this._buttonStatus) {
        state += started ? "," : "";
        state += '"' + id + '":' + this._buttonStatus[id];
        started = true;
      }
      state += "}";
    }
    // menu item enabled status
    if (this._window.getMenus()) {
      state += ",menus:{";
      var started = false;
      for(id in this._menuStatus) {
        state += started ? "," : "";
        state += '"' + id + '":' + this._menuStatus[id];
        started = true;
      }
      state += "}";
    }
    
    // dirty flags
    state += ',dirtyFlags: ' + SRAOS_Util.serializeDirtyFlags(this.getElementById("Canvas"));
    
    // form values
    state += ',fields: { ' + SRAOS_Util.serializeFields(this.getElementById("Canvas")) + ' }';
    
    return state;
	};
	// }}}
  
	// {{{ hide
	/**
	 * hides this window (if it is current visible)
   * @access  public
	 * @return void
	 */
	this.hide = function() {
    if (document.getElementById(this._divId)) {
      this.unFocus();
      document.getElementById(this._divId).style.visibility = "hidden";
      if (this._isBlocked) {
        this.getElementById("Wait").style.visibility = "hidden";
      }
      if (this.getElementById('ResizeHandler')) { this.getElementById('ResizeHandler').style.visibility = "hidden"; }
      this._hideMenu();
    }
  };
  // }}}
  
	// {{{ hideScrollbars
	/**
	 * hides any scrollbars currently active in this window instance where 
   * necessary (firefox 1 has a problem with not applying the correct z-index 
   * property to scrollbars)
   * @access  public
	 * @return void
	 */
	this.hideScrollbars = function() {
    if (SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_FIREFOX && !this._scrollbarsHidden && !this._closed) {
      SRAOS_Util.hideScrollbars(document.getElementById(this._divId), true);
      this._scrollbarsHidden = true;
    }
  };
  // }}}
  
	// {{{ init
	/**
	 * initializes this window instance. returns true on success, false on 
   * failure. this method should ONLY be called once for a given instance of 
   * this window
   * @param boolean primary whether or not this window is a primary application 
   * window
   * @param Array vars window content variables: see SRAOS.displayWindow. if 
   * this array contains an index "title", that corresponding value will be used 
   * as the initial window title
   * @param Array params initialization params if this window is being restored
   * @access  public
	 * @return boolean
	 */
	this.init = function(primary, vars, params) {
    var div = document.getElementById(this._divId);
		if (!this._initialized) {
      this._initialized = true;
      this._manager.params = params && params['manager'] ? params['manager'] : params;
      this._manager.init(params && params['manager'] ? params['manager'] : params);
      this._title = vars && vars['title'] ? vars['title'] : this._title;
      var addButtonStatus = true;
      var addMenuStatus = true;
      if (OS.restoring && params) {
        this._maximized = params["maximized"];
        this._status = params["status"];
        this._title = params["title"];
        this._centered = params["centered"] && !this._window.isCenterOpener();
        this._focused = this._appInstance ? params["focused"] : null;
        this._x = params["x"];
        this._y = params["y"];
        this._height = params["height"];
        this._width = params["width"];
        vars = params["vars"];
        // buttons
        if (params["buttons"]) {
          addButtonStatus = false;
          for(buttonId in params["buttons"]) {
            if (!SRAOS_Util.arrayKeyExists(this._buttonStatus, buttonId)) {
              this._buttonStatus[buttonId] = params["buttons"][buttonId];
            }
          }
        }
        // menus
        if (params["menus"]) {
          addMenuStatus = false;
          for(menuId in params["menus"]) {
            if (!SRAOS_Util.arrayKeyExists(this._menuStatus, menuId)) {
              this._menuStatus[menuId] = params["menus"][menuId];
            }
          }
        }
      }
      else if (SRAOS_WindowInstance.STATE[this._window.getId()]) {
        var winState = SRAOS_WindowInstance.STATE[this._window.getId()];
        this._maximized = winState["maximized"];
        this._centered = winState["centered"] && !this._window.isCenterOpener();
        this._x = winState["x"];
        this._y = winState["y"];
        this._height = winState["height"];
        this._width = winState["width"];
      }
      
      this._vars = vars;
      this._primary = primary;
      
      if (OS.displayWindow(this, primary, vars)) {
        // disable buttons
        if (this._window.getToolbarButtons()) {
          var buttons = this._window.getToolbarButtons();
          for(i in buttons) {
            if (!SRAOS_Util.arrayKeyExists(this._buttonStatus, buttons[i].getId())) {
              this._buttonStatus[buttons[i].getId()] = addButtonStatus ? buttons[i].isEnabled() : this._buttonStatus[buttons[i].getId()];
            }
            this._buttonStatus[buttons[i].getId()] ? this.enableButton(buttons[i].getId()) : this.disableButton(buttons[i].getId());
          }
        }
        // disable menu items
        if (this._window.getMenus()) {
          var menus = this._window.getMenus();
          for(i in menus) {
            var subMenus = menus[i].getAllMenus();
            for(n in subMenus) {
              if (!SRAOS_Util.arrayKeyExists(this._menuStatus, subMenus[n].getId())) {
                this._menuStatus[subMenus[n].getId()] = addMenuStatus ? subMenus[n].isEnabled() : this._menuStatus[subMenus[n].getId()];
              }
              this._menuStatus[subMenus[n].getId()] ? this.enableMenuItem(subMenus[n].getId()) : this.disableMenuItem(subMenus[n].getId());
            }
          }
        }
        if (!this._window.isFixedPosition()) {
          Drag.init(this.getElementById("Header"), div, 0, null, 0, null, true);
          div.onDragStart = function(x, y) {
            OS.focus(this);
          };
          div.onDragEnd = function(x, y) {
            this.windowInstance.setX(parseInt(this.style.left));
            this.windowInstance.setY(parseInt(this.style.top));
            this.windowInstance.setCentered(false);
            this.windowInstance.initWindowMenuPosition();
            if (!this.windowInstance.getWindow().isFixedSize()) {
              document.getElementById(this.windowInstance._divId + "ResizeHandler").maxX = this.windowInstance.getMaxWidth();
              document.getElementById(this.windowInstance._divId + "ResizeHandler").maxY = this.windowInstance.getMaxHeight();
            }
          };
          div.onDragResetEnd = div.onDragEnd;
        }
        if (!this._window.isFixedSize()) {
          SRAOS_Resize.init(this.getElementById("ResizeHandler"), div, this.getMinWidth(), this.getMaxWidth(), this.getMinHeight(), this.getMaxHeight(), true, 5, this._window.getHeightResizeBuffer());
          div._resizeComponents = new Array();
          var resizeComponents = this._window.getResizeComponents();
          if (resizeComponents) {
            for(i in resizeComponents) {
              eval("var id = { " + resizeComponents[i].getId() + " }");
              var elements = this.getDomElements(id);
              for(var n in elements) {
                elements[n]._resizeProps = resizeComponents[i];
                div._resizeComponents.push(elements[n]);
              }
            }
          }
          div.onResizeEnd = function(x, y) {
            this.windowInstance.setHeight(y);
            this.windowInstance.setWidth(x);
            this.windowInstance.adjustDragConstraints();
            this.windowInstance.getManager().onResizeEnd(this.windowInstance.getCanvasHeight(), this.windowInstance.getCanvasWidth());
            this.windowInstance.resizeWaitCover();
            if (this.resizeComponents) { this._resizeStarted = false; }
          };
          div.onResizeResetEnd = div.onResizeEnd;
          div.onResizeStart = function(x, y) {
            this.windowInstance.getManager().onResizeStart(this.windowInstance.getCanvasHeight(), this.windowInstance.getCanvasWidth());
          };
          div.onResize = function(x, y) {
            this.windowInstance.getManager().onResize(this.windowInstance.getCanvasHeight(), this.windowInstance.getCanvasWidth());
            if (this.resizeComponents) {
              if (!this._resizeStarted) {
                this._baseResizeX = x;
                this._baseResizeY = y;
                this._resizeStarted = true;
              }
              else {
                var changeHeight = y - this._baseResizeY;
                var changeWidth = x - this._baseResizeX;
                this.resizeComponents(changeHeight, changeWidth);
                this._baseResizeX += changeWidth;
                this._baseResizeY += changeHeight;
              }
            }
          };
          if (div._resizeComponents.length > 0) {
            div.resizeComponents = function(changeHeight, changeWidth) {
              for(i in this._resizeComponents) {
                // height
                if (changeHeight != 0 && this._resizeComponents[i]._resizeProps.isHeight()) {
                  var yFactor = this._resizeComponents[i]._resizeProps.getYFactor();
                  var height = (this._resizeComponents[i].style.height ? parseInt(this._resizeComponents[i].style.height) : this._resizeComponents[i].offsetHeight) + (changeHeight / yFactor);
                  if (yFactor != 1) {
                    height += this._resizeComponents[i]._resizeHeightBuffer ? this._resizeComponents[i]._resizeHeightBuffer : 0;
                    this._resizeComponents[i]._resizeHeightBuffer = height - Math.floor(height);
                    height = Math.floor(height);
                  }
                  this._resizeComponents[i].style.height = height + "px";
                }
                // width
                if (changeWidth != 0 && this._resizeComponents[i]._resizeProps.isWidth()) {
                  var xFactor = this._resizeComponents[i]._resizeProps.getXFactor();
                  var width = (this._resizeComponents[i].style.width ? parseInt(this._resizeComponents[i].style.width) : this._resizeComponents[i].offsetWidth) + (changeWidth / xFactor);
                  if (xFactor != 1) {
                    width += this._resizeComponents[i]._resizeWidthBuffer ? this._resizeComponents[i]._resizeWidthBuffer : 0;
                    this._resizeComponents[i]._resizeWidthBuffer = width - Math.floor(width);
                    width = Math.floor(width);
                  }
                  this._resizeComponents[i].style.width = width + "px";
                }
              }
            };
          }
        }
        
        // dirty flags
        params && params.dirtyFlags ? SRAOS_Util.unserializeDirtyFlags(this.getElementById("Canvas"), params.dirtyFlags) : this.setDirtyFlags();
        
        // fields
        if (params && params.fields) {
          SRAOS_Util.unserializeFields(this.getElementById("Canvas"), params.fields);
        }
        
        return true;
      }
    }
    return false;
	};
	// }}}
  
	// {{{ initWindowMenu
	/**
	 * positions and initializes the window menu (the menu that appears when you 
   * click the upper left icon of the window
   * @access  public
	 * @return void
	 */
  this.initWindowMenu = function() {
    var menu = document.getElementById("windowMenu");
    var img = document.getElementById("windowMenuImg");
    this.initWindowMenuPosition();
    !this._modalTarget && this._appInstance && this._primary ? OS.getMenuItem("", "windowMenu_hide").enable() : OS.getMenuItem("", "windowMenu_hide").disable();
    if (this._maximized) {
      this._window.isFixedSize() ? OS.getMenuItem("", "windowMenu_restore").disable() : OS.getMenuItem("", "windowMenu_restore").enable();
      OS.getMenuItem("", "windowMenu_maximize").disable();
    }
    else {
      this._window.isFixedSize() ? OS.getMenuItem("", "windowMenu_maximize").disable() : OS.getMenuItem("", "windowMenu_maximize").enable();
      OS.getMenuItem("", "windowMenu_restore").disable();
    }
    this._modalTarget || !this._window.isCanMinimize() ? OS.getMenuItem("", "windowMenu_minimize").disable() : OS.getMenuItem("", "windowMenu_minimize").enable();
    var exitMenu = OS.getMenuItem("", "windowMenu_exit");
    exitMenu.onClick = 'OS.' + (this._primary ? 'terminateAppInstance' : 'closeWindow') + '(document.getElementById("' + this._divId + '"))';
    var closeMsg = this.getCloseMsg();
    exitMenu.setText('<img alt="' + closeMsg + '" src="' + OS.getThemeUri() + 'close.gif" title="' + closeMsg + '" />' + closeMsg);
    this._window.isCanClose() ? exitMenu.enable() : exitMenu.disable();
    menu.style.visibility = "visible";
    document.getElementById("windowMenu").style.zIndex = document.getElementById(this._divId).style.zIndex + 1;
  };
  // }}}
  
	// {{{ initWindowMenuPosition
	/**
	 * positions the window menu (the menu that appears when you click the upper 
   * left icon of the window
   * @access  public
	 * @return void
	 */
  this.initWindowMenuPosition = function() {
    var menu = document.getElementById("windowMenu");
    var x = (this._maximized ? 0 : this._x) + 4;
    var y = (this._maximized ? 0 : this._y) + 2;
    menu.style.left = x + "px";
    menu.style.top = y + "px";
  };
  // }}}
  
	// {{{ isBlocked
	/**
	 * returns true if this window is currently blocked
   * @access  public
	 * @return boolean
	 */
  this.isBlocked = function() {
    return this._isBlocked;
  };
  // }}}
  
  // {{{ isDirty
  /**
   * returns true if any of the canvas area fields were modified since 
   * setDirtyFlags was last invoked
   * @param String name the name of the field to exclusively check. if not 
   * specified, the entire form will be checked
   * @access  public
   * @return boolean
   */
  this.isDirty = function(name) {
    return SRAOS_Util.isDirty(this.getElementById("Canvas"), name);
  };
  // }}}
  
	// {{{ isHidden
	/**
	 * returns true if this window is currently hidden
   * @access  public
	 * @return boolean
	 */
	this.isHidden = function() {
    return !this._minimized && document.getElementById(this._divId).style.visibility == "hidden";
  };
  // }}}
  
	// {{{ isModal
	/**
	 * returns true if this window instance is modal (OS, app, or win)
   * @access  public
	 * @return boolean
	 */
	this.isModal = function() {
		return this.getModalTarget() ? true : false;
	};
	// }}}
  
	// {{{ isPrimary
	/**
	 * returns true if this window instance is the primary window for the running 
   * app
   * @access  public
	 * @return boolean
	 */
	this.isPrimary = function() {
		return this._primary;
	};
	// }}}
  
	// {{{ maximize
	/**
	 * maximizes the window container used by this window instance
   * @param boolean opening whether or not this window is in the process of 
   * opening
   * @access  public
	 * @return void
	 */
	this.maximize = function(opening) {
    if (this._manager.onMaximize(this.getCanvasHeight(), this.getCanvasWidth())) {
      var div = document.getElementById(this._divId);
      var img = this.getElementById("ResizeImg");
      var resizeHandler = this.getElementById("ResizeHandler");
      div.style.top = "0";
      div.style.left = "0";
      var priorHeight = div.offsetHeight;
      var priorWidth = div.offsetWidth;
      div.style.height = OS.getMaxWindowHeight(this) + "px";
      div.style.width = "100%";
      if (img) {
        img.src = OS.getThemeUri() + "restore.gif";
        img.alt = OS.getString("window.restore");
        img.title = OS.getString("window.restore");
      }
      if (resizeHandler) {
        resizeHandler.style.visibility = "hidden";
      }
      // set drag constraints
      if (!this._window.isFixedPosition()) {
        div.maxX = 0;
        div.maxY = 0;
      }
      this.setMaximized(true);
      this.initWindowMenu();
      this.resizeWaitCover();
      if (!opening) {
        this._manager.onResizeEnd(this.getCanvasHeight(), this.getCanvasWidth());
      }
      if (div.resizeComponents) { div.resizeComponents(div.offsetHeight - priorHeight, div.offsetWidth - priorWidth); }
    }
	};
	// }}}
  
	// {{{ minimize
	/**
	 * minimizes the window container used by this window instance. returns true 
   * if successful, false otherwise
   * @access  public
	 * @return boolean
	 */
	this.minimize = function() {
    if (this._manager.onMinimize()) {
      this._minimized = true;
      this.hide();
      return true;
    }
    return false;
	};
	// }}}
  
  // {{{ onResize
  /**
   * invoked whenever the browser window is resized
   * @return void
   */
  this.onResize = function() {
    if (this.isMaximized()) {
      this.maximize();
      this._manager.onResize(this.getCanvasHeight(), this.getCanvasWidth());
    }
  };
  // }}}
  
	// {{{ open
	/**
	 * opens this window instance. returns true if the manager.onOpen method 
   * returns true
   * @access  public
	 * @return boolean
	 */
	this.open = function() {
		var div = document.getElementById(this._divId);
    if (this.isMaximized()) {
      this.maximize(true);
    }
    else {
      this.restore(true);
      if (this.isCentered()) {
        this.center(this._window.isCenterOpener() && this._opener && !this._opener.isMaximized() ? this._opener : null);
      }
    }
    if (this._modalTarget) { this._modalTarget.block(this); }
    
    if (OS.restoring) {
      document.getElementById(this._divId).style.visibility = "visible";
      if (!this._focused) { this.unFocus(); }
    }
    
    // tile if necessary
    var windows = OS.getActiveWindows(this);
    for(var i=0; i<windows.length; i++) {
      if (this.getX() == windows[i].getX() && this.getY() == windows[i].getY() && this.getHeight() == windows[i].getHeight() && this.getWidth() == windows[i].getWidth()) {
        this._x += SRAOS_WindowInstance.TILE_OFFSET;
        this._y += SRAOS_WindowInstance.TILE_OFFSET;
        if ((this._y + this._height) > OS.getWorkspaceHeight()) { this._y -= (SRAOS_WindowInstance.TILE_OFFSET * 2); }
        if ((this._x + this._width) > OS.getWorkspaceWidth()) { this._x -= (SRAOS_WindowInstance.TILE_OFFSET * 2); }
        this._x = this._x < 0 ? 0 : this._x;
        this._y = this._y < 0 ? 0 : this._y;
        this._centered = false;
        var div = document.getElementById(this._divId);
        div.style.left = this._x + "px";
        div.style.top = this._y + "px";
      }
    }
    
    return this._manager.onOpen(this.getCanvasHeight(), this.getCanvasWidth());
	};
	// }}}
  
	// {{{ release
	/**
	 * releases this window instance from a blocked state (caused by an previous 
   * "block" invocation)
   * @param boolean cancelled true if the modal window was cancelled due to a 
   * workspace save state event (because modal windows are not preserved when 
   * a workspace state is saved)
   * @access  public
	 * @return void
	 */
  this.release = function(cancelled) {
    if (this.getElementById("Wait")) { this.getElementById("Wait").style.visibility = "hidden"; }
    this._isBlocked = false;
    this._blockedBy = null;
    this.showScrollbars();
  };
  // }}}
  
	// {{{ resizeWaitCover
	/**
	 * resizes the wait cover displayed on top of this window when in a wait 
   * status
   * @access  public
	 * @return void
	 */
  this.resizeWaitCover = function() {
    this.getElementById("Wait").style.height = ((this._maximized ? OS.getMaxWindowHeight(this) : this._height) + this._window.getHeightResizeBuffer() - 16) + "px";
  };
  // }}}
  
	// {{{ restore
	/**
	 * restores the window container used by this window instance
   * @param boolean opening whether or not this window is in the process of 
   * opening
   * @access  public
	 * @return void
	 */
	this.restore = function(opening) {
    if ((!this._maximized && !this._minimized) || (this._maximized && this._manager.onRestoreMaximized(this.getCanvasHeight(), this.getCanvasWidth())) || (this._minimized && this._manager.onRestoreMinimized(this.getCanvasHeight(), this.getCanvasWidth()))) {
      if (this._minimized) {
        this.show();
        return;
      }
      var div = document.getElementById(this._divId);
      var img = this.getElementById("ResizeImg");
      var resizeHandler = this.getElementById("ResizeHandler");
      var x = this.getX() + "px";
      var y = this.getY() + "px";
      var priorHeight = div.offsetHeight;
      var priorWidth = div.offsetWidth;
      var height = (!OS.getWorkspaceHeight() || this.getHeight() + parseInt(y) - this._window.getHeightBuffer() <= OS.getWorkspaceHeight() ? this.getHeight() : OS.getWorkspaceHeight() - parseInt(y)) + "px";
      var width = (!OS.getWorkspaceWidth() || this.getWidth() + parseInt(x) <= OS.getWorkspaceWidth() ? this.getWidth() : OS.getWorkspaceWidth() - parseInt(x)) + "px";
      div.style.height = height;
      div.style.width = width;
      if (!this.isCentered()) {
        div.style.left = x;
        div.style.top = y;
      }
      else {
        this.center(this._window.isCenterOpener() && this._opener && !this._opener.isMaximized() ? this._opener : null);
      }
      if (img) {
        img.src = OS.getThemeUri() + "maximize.gif";
        img.alt = OS.getString("window.maximize");
        img.title = OS.getString("window.maximize");
      }
      if (resizeHandler) {
        resizeHandler.style.visibility = "visible";
      }
      // set drag constraints
      if (!this._window.isFixedPosition()) {
        this.adjustDragConstraints();
      }
      this.setMaximized(false);
      this.setMinimized(false);
      this.initWindowMenu();
      this.resizeWaitCover();
      if (!opening) {
        this._manager.onResizeEnd(this.getCanvasHeight(), this.getCanvasWidth());
      }
      if (div.resizeComponents) { div.resizeComponents(div.offsetHeight - priorHeight, div.offsetWidth - priorWidth); }
    }
	};
	// }}}
  
  // {{{ setDirtyFlags
  /**
   * sets dirty flags for input fields within the canvas area of this window 
   * instance. this method is automatically invoked when the window is first 
   * initialized
   * @param String name the name of a field that the dirty flag should be 
   * exclusively set for. if not specified, all fields within top will have their 
   * dirty flags set
   * @access  public
   * @return void
   */
  this.setDirtyFlags = function(name) {
    SRAOS_Util.setDirtyFlags(this.getElementById("Canvas"), name);
  };
  // }}}
  
	// {{{ setIcon
	/**
	 * sets the title bar icon for this window instance
   * @param String src the icon uri. if this uri contains the keyword '{$size}', 
   * that value will be replaced with 16
   * @access  public
	 * @return void
	 */
	this.setIcon = function(src) {
    if (!this._closed) {
      src = SRAOS_Util.substituteParams(src, {'size': '16'});
      this.getElementById('Icon').src = src;
    }
	};
	// }}}
  
	// {{{ setSkipCloseConfirm
	/**
	 * sets the value of the _skipCloseConfirm  attribute
   * @param boolean skipCloseConfirm the value to set
   * @access  public
	 * @return void
	 */
	this.setSkipCloseConfirm = function(skipCloseConfirm) {
		this._skipCloseConfirm = skipCloseConfirm;
	};
	// }}}
  
	// {{{ getStatusBarText
	/**
	 * returns the current status text for this window instance
   * @access  public
	 * @return String
	 */
	this.getStatusBarText = function(status) {
		if (!this._closed && this._window.isStatusBar()) {
      return this.getElementById("StatusBarText").innerHTML;
    }
    return null;
	};
	// }}}
  
	// {{{ setStatusBarText
	/**
	 * sets the status text for this window instance
   * @param String status the status text to set
   * @access  public
	 * @return void
	 */
	this.setStatusBarText = function(status) {
		if (!this._closed && this._window.isStatusBar()) {
      this.getElementById("StatusBarText").innerHTML = status;
      this.setStatus(status);
    }
	};
	// }}}
  
	// {{{ getTitleText
	/**
	 * returns the current title text for this window instance
   * @access  public
	 * @return String
	 */
	this.getTitleText = function() {
    if (!this._closed) {
      return this.getElementById("TitleText").innerHTML;
    }
    return null;
	};
	// }}}
  
	// {{{ setTitleText
	/**
	 * sets the title text for this window instance. this method also 
   * automatically sets the dock icon text for this application instance to the 
   * title value pre-pended by the application name
   * @param String title the title text to set
   * @access  public
	 * @return void
	 */
	this.setTitleText = function(title) {
    if (!this._closed) {
      if (!title) { title = '&nbsp;'; }
      this.getElementById('TitleText').innerHTML = title;
      this.setTitle(title);
      // update the dock icon tool-tip hover text if this is the primary window
      if (this._appInstance && this._primary) {
        OS.updateDockIconText(this._appInstance.getPid(), this._appInstance.getApplication().getLabel() + ' - ' + title);
      }
    }
	};
	// }}}
  
	// {{{ show
	/**
	 * shows this window (if it is current hidden)
   * @access  public
	 * @return void
	 */
	this.show = function() {
    if (document.getElementById(this._divId)) {
      if (this._focused) { this.showScrollbars(); }
      document.getElementById(this._divId).style.visibility = "visible";
      if (this.getElementById('ResizeHandler')) { this.getElementById('ResizeHandler').style.visibility = "visible"; }
      if (this._focused && this._window.getMenus().length > 0) {
        OS.clearOsTitle();
        document.getElementById(this._plugin.getId() + ":" + this._window.getId() + ":menu").style.visibility = "visible";
      }
      if (this._minimized) {
        this._minimized = false;
        OS.renderMinimizedIcons();
      }
      if (this._isBlocked) {
        this.getElementById("Wait").style.visibility = "visible";
      }
    }
  };
  // }}}
  
	// {{{ showScrollbars
	/**
	 * shows any scrollbars that were previously hidden using hideScrollbars
   * @access  public
	 * @return void
	 */
	this.showScrollbars = function() {
    if (SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_FIREFOX && this._scrollbarsHidden && !this._closed) {
      SRAOS_Util.showScrollbars(document.getElementById(this._divId), true);
      this._scrollbarsHidden = false;
    }
  };
  // }}}
  
	// {{{ submitForm
	/**
	 * used to submit form data in the window to an ajax service
   * @param String service the name of the ajax service to submit the form to
   * @param String type the type of request that should be invoked. this value 
   * may be any of the following:
   *  SRAOS_AjaxRequestObj.TYPE_CREATE, SRAOS_AjaxRequestObj.TYPE_DELETE, 
   *  SRAOS_AjaxRequestObj.TYPE_UPDATE or null. If null, the ajax service will 
   *  be assumed to be global (non entity specific). null is the default value
   * for this parameter
   * @param String id if this type is update or delete, this parameter should 
   * specify the primary key value or the name of the field containing that 
   * value
   * @param String waitMsg the message to display as the window waits for the 
   * form submission to occur. the default value is 
   * "text.updatingPreferencesOnServer"
   * @param String errorMsg error message to display if the form submission is 
   * unsuccessful. entity validation errors will override this message. this 
   * value should reference a properties file string. the default value is 
   * "error.form"
   * @param boolean closeOnSuccess whether or not to close the window if the 
   * form submission is successful. false is the default value
   * @param boolean closeOnError whether or not to close the window if an error 
   * occurs. false is the default value
   * @param Object callbackObj an optional callback object
   * @param String callbackMethod the name of the callbackObj method that should
   * be invoked. this method should accept as the first parameter, the ajax 
   * service invocation response. it is invoked prior to closing the window if 
   * closeOnSuccess is true. it is also invoked regardless of whether or not the 
   * invocation was successful
   * @param Array addlParams an hash or array of SRAOS_AjaxServiceParam objects 
   * that should be added to the form params
   * @param Object skip hash containing element attribute/value pairs of child 
   * container elements in 'container' whose form elements should be skipped
   * @param boolean skipAll whether or not to match all of the values in 'skip'. 
   * if false, only 1 value need match
   * @access  public
	 * @return void
	 */
	this.submitForm = function(service, type, id, waitMsg, errorMsg, closeOnSuccess, closeOnError, callbackObj, callbackMethod, addlParams, skip, skipAll) {
		waitMsg = waitMsg ? waitMsg : 'text.updatingPreferencesOnServer';
    errorMsg = errorMsg ? errorMsg : 'error.form';
    
    this.syncWait(this._plugin.getString(waitMsg));
    var formVals = this.getFormValues(skip, skipAll, true);
    id = id ? (formVals[id] ? formVals[id] : id) : null;
    var requestObj = null;
    
    // construct params/attrs
    var params = new Array();
    for(var i in formVals) {
      var field = this.getFormField(i);
      var isFile = field && field.type && field.type.toLowerCase() == 'file';
      params.push(new SRAOS_AjaxServiceParam(i, isFile ? null : formVals[i], isFile ? SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE : null));
    }
    if (addlParams) {
      for(var i in addlParams) {
        params.push(addlParams[i] && addlParams[i].toXml ? addlParams[i] : new SRAOS_AjaxServiceParam(i, addlParams[i]));
      }
    }
    
    // entity service
    if (type) {
      requestObj = new SRAOS_AjaxRequestObj(id, params, type);
    }
    
    this._submitFormParams = { errorMsg: errorMsg, closeOnSuccess: closeOnSuccess, closeOnError: closeOnError, callbackObj: callbackObj, callbackMethod: callbackMethod };
    OS.ajaxInvokeService(service, this, '_submitForm', null, requestObj, requestObj ? null : params);
	};
	// }}}
  
	// {{{ syncCancel
	/**
	 * invoked when the user clicks on the cancel button in a sync wait state
   * @param String cancel the cancel callback. this method is search for in the 
   * following order: window manager, window instance, application manager, 
   * application instance, OS. this method will be passed 1 parameter 
   * which is the SRAOS_WindowInstance where it was invoked from
   * @access  public
	 * @return void
	 */
	this.syncCancel = function(cancel) {
    this.syncFree();
    if (this._manager[cancel]) {
      this._manager[cancel](this);
    }
    else if (this[cancel]) {
      this[cancel](this);
    }
    else if (this._appInstance && this._appInstance.getManager()[cancel]) {
      this._appInstance.getManager()[cancel](this);
    }
    else if (this._appInstance && this._appInstance[cancel]) {
      this._appInstance[cancel](this);
    }
    else if (OS[cancel]) {
      OS[cancel](this);
    }
	};
	// }}}
  
	// {{{ syncFree
	/**
	 * invoke this method after syncWait when the synchronous operation invoked 
   * has completed and the window may resume functionality
   * @param int delay if specified, the window will not be freed for this many 
   * milliseconds
   * @access  public
	 * @return void
	 */
	this.syncFree = function(delay) {
    if (delay) {
      setTimeout('document.getElementById("' + this._divId + '").windowInstance.syncFree()', delay);
    }
    else {
      if (!this._closed) {
        this._syncWaitSteps = null;
        this._syncCurrentStep = null;
        this._syncMsg = null;
        this._syncMsgAppend = null;
        this._syncStepMsgs = null;
        this.getElementById("Wait").style.visibility = "hidden";
        this.getElementById("WaitContent").style.visibility = "hidden";
        if (this._window.getMenus()) {
          var menus = this._window.getMenus();
          for(var i in menus) {
            var subMenus = menus[i].getAllMenus();
            for(var n in subMenus) {
              if (this._menuStatus[subMenus[n].getId()]) {
                OS.getMenuItem(this._plugin.getId(), subMenus[n].getId()).enable();
              }
            }
          }
        }
      }
    }
	};
	// }}}
  
	// {{{ syncMsg
	/**
	 * changes the current syncWait message
   * @param String msg the message to set
   * @access  public
	 * @return void
	 */
	this.syncMsg = function(msg) {
    if (msg) {
      this._syncMsg = msg;
    }
		this.getElementById("WaitMsg").innerHTML = this._syncMsg + this._syncMsgAppend;
	};
	// }}}
  
	// {{{ syncMsgAppend
	/**
	 * appends msg to the current sync message
   * @param String msg the text to append
   * @access  public
	 * @return void
	 */
	this.syncMsgAppend = function(msg) {
    this._syncMsgAppend = msg;
		this.syncMsg();
	};
	// }}}
  
	// {{{ syncStep
	/**
	 * used to proceed through one step in of the current synchronous wait 
   * operation this method can be invoked up to the # of steps specified when 
   * syncWait was invoked. it will cause the progress indicator to advance 
   * proportionately according to the # of steps in the operation. if the 
   * current step already equals the total # of steps, then syncFree will be 
   * invoked
   * @param String msg can be specified to change the wait message displayed 
   * below the progress indicator. if not specified, the current message will be 
   * maintained
   * @access  public
	 * @return void
	 */
	this.syncStep = function(msg) {
    this._syncCurrentStep++;
		if (msg) {
      this.syncMsg(msg);
    }
    else if (this._syncStepMsgs && this._syncStepMsgs[this._syncCurrentStep]) {
      this.syncMsg(this._syncStepMsgs[this._syncCurrentStep]);
    }
    if (this._syncCurrentStep <= this._syncWaitSteps) {
      var progress = Math.round(this._syncCurrentStep * (100/this._syncWaitSteps));
      progress = progress > 100 ? 100 : progress;
      this.getElementById("WaitProgressRight").style.width = (100 - progress) + "px";
      this.getElementById("WaitProgressLeft").style.width = progress + "px";
    }
    if (this._syncCurrentStep >= this._syncWaitSteps) {
      setTimeout('document.getElementById("' + this._divId + '").windowInstance.syncFree()', 200);
    }
	};
	// }}}
  
	// {{{ syncWait
	/**
	 * invoke this method when the window instance needs to wait for a synchronous 
   * operation to complete. typically this may be invoked in order to wait for 
   * an ajax operation to complete. invoking this method will essentially 
   * eliminate the user's ability to access any controls (including drop down 
   * menus) for this window or manipulate it (close, resize, etc.) it in any way
   * @param String msg an optional wait message. the default is the resource 
   * "text.wait" (Loading).
   * @param String cancel if the wait message should include a cancel button, 
   * this parameter should specify the name of the method to invoke if the user 
   * clicks on it. the search order for this method will be the following:
   * window manager, window instance, application manager, application instance, 
   * OS. when the user clicks on the cancel button, syncFree will be invoked 
   * followed by the cancel method specified. if this parameter is not 
   * specified, the wait screen will not include a cancel button. this method 
   * will be passed 1 parameter which is the SRAOS_WindowInstance where it was 
   * invoked from. if you simply want a cancel button enabled, that will soley 
   * free the sync state, then specify this parameter using the boolean value 
   * true
   * @param int msecs the # of milliseconds to disable the window. if not 
   * specified, the window will be disabled until the syncFree method is invoked
   * if this parameter is specified in conjunction with steps, then the 
   * progress indicator will automatically advance proportionate to the # of 
   * steps specified (each step will occur at msecs/steps) and the window will 
   * automatically be re-enabled at msecs + (msecs/steps)
   * @param int steps if the synchronous operation consists of a set # of steps 
   * that must be completed, this parameter may be specified to indicate that #. 
   * the result of this is that instead of displaying the generic wait image, a 
   * progress bar will be used which can be stepped through using the syncStep. 
   * steps must be > 0 and <= 100
   * @param Array stepMsgs if steps has been specified, this parameter may be 
   * specified to indicate the messages that should be displayed during a 
   * progress step. the index in this array should be the step indicator, and 
   * the value, the message to display at that step. step will be a value 
   * between 1 and Math.round(msecs/steps). if a message is missing for a given 
   * step, the previous step message will be used method
   * @param boolean remainingTime if msecs is specified, setting this parameter 
   * to true will result in a seconds count-down timer being displayed in the 
   * wait message in the format: [current msg] (N seconds remaining) where N is 
   * the # of seconds remaining before the wait operation is completed
   * @access  public
	 * @return void
	 */
	this.syncWait = function(msg, cancel, msecs, steps, stepMsgs, remainingTime) {
    this._syncWaitSteps = 0;
    this._syncCurrentStep = 0;
    this._syncMsg = "";
    this._syncMsgAppend = "";
    this._syncStepMsgs = stepMsgs;
    msg = msg ? msg : (steps && this._syncStepMsgs && this._syncStepMsgs[this._syncCurrentStep] ? this._syncStepMsgs[this._syncCurrentStep] : OS.getString('text.wait'));
    this.syncMsg(msg);
    if (steps && steps > 0 && steps <= 100) {
      this._syncWaitSteps = steps;
      this.getElementById("WaitProgress").innerHTML = '<img id="' + this._divId + 'WaitProgressLeft" alt="' + msg + '" class="progressImgStatus" src="/images/pixel.gif" title="' + msg + '" /><img id="' + this._divId + 'WaitProgressRight" alt="' + msg + '" class="progressImg" src="/images/pixel.gif" title="' + msg + '" />';
    }
    else {
      this.getElementById("WaitProgress").innerHTML = '<img alt="' + msg + '" src="' + OS.getThemeUri() + 'wait.gif" title="' + msg + '" />';
    }
		this.getElementById("Wait").style.visibility = "visible";
    this.getElementById("WaitContent").style.visibility = "visible";
    if (this._window.getMenus()) {
      var menus = this._window.getMenus();
      for(var i in menus) {
        var subMenus = menus[i].getAllMenus();
        for(var n in subMenus) {
          OS.getMenuItem(this._plugin.getId(), subMenus[n].getId()).disable();
        }
      }
    }
    if (msecs && msecs > 0) {
      if (!steps) {
        setTimeout("document.getElementById('" + this._divId + "').windowInstance.syncFree()", msecs);
      }
      else {
        var interval = Math.round(msecs/steps);
        for(var i=1; i<=steps; i++) {
          var stepMsg = stepMsgs && stepMsgs[i] ? '"' + stepMsgs[i] + '"' : 'null';
          setTimeout('document.getElementById("' + this._divId + '").windowInstance.syncStep(' + stepMsg + ')', interval * i);
          if (i == steps) {
            setTimeout("document.getElementById('" + this._divId + "').windowInstance.syncFree()", interval * (i+1));
          }
        }
      }
      if (remainingTime) {
        var intervals = Math.round(msecs/1000);
        var secondTxt = OS.getString('text.seconds');
        var remainingTxt = OS.getString('text.remaining');
        this.syncMsgAppend(" (" + intervals + " " + secondTxt + " " + remainingTxt + ")");
        for(var i=1; i<=intervals; i++) {
          var secs = Math.round((msecs - (i * 1000)) / 1000);
          var msg = " (" + secs + " " + secondTxt + " " + remainingTxt + ")";
          setTimeout('document.getElementById("' + this._divId + '").windowInstance.syncMsgAppend("' + msg + '")', i * 1000);
        }
      }
    }
    this.getElementById("WaitCancel").innerHTML = cancel ? '<input onClick="document.getElementById(\'' + this._divId + '\').windowInstance.syncCancel(\'' + cancel + '\')" type="button" value="' + OS.getString('form.cancel') + '" />' : '';
	};
	// }}}
  
	// {{{ unFocus
	/**
	 * un-focuses this window instance (assuming that the application instance is 
   * no longer active)
   * @access  public
	 * @return void
	 */
	this.unFocus = function() {
		var div = document.getElementById(this._divId);
    if (div.style.opacity != SRAOS_WindowInstance.UNFOCUSED_OPACITY) {
      var unfocus = div.style.opacity == "1";
      div.style.zIndex = SRAOS.UNFOCUSED_APPLICATION_Z_INDEX;
      div.style.opacity = SRAOS_WindowInstance.UNFOCUSED_OPACITY;
      this._hideMenu();
      if (unfocus) {
        document.getElementById("windowMenu").style.visibility = "hidden";
        this._manager.onUnFocus();
      }
      this.hideScrollbars();
    }
	};
	// }}}
  
	// {{{ updateButton
	/**
	 * updates the image/alt text associated with a window button. returns true on 
   * success, false on failure
   * @param String id the id of the button to update
   * @param String src the new uri for the button image (if not specified image 
   * will not be changed)
   * @param String label the new alt/title text for the button (if not specified 
   * alt/title text will not be changed)
   * @access  public
	 * @return boolean
	 */
	this.updateButton = function(id, src, label) {
    var button = this.getElementById(this._plugin.getId() + id + 'Img');
    if (button) {
      if (src) { button.src = src; }
      if (label) { 
        button.alt = label;
        button.title = label;
      }
      return true;
    }
    return false;
	};
	// }}}
  
  
  // accessors
  
	// {{{ getAppInstance
	/**
	 * returns the appInstance of this window
   * @access  public
	 * @return String
	 */
	this.getAppInstance = function() {
		return this._appInstance;
	};
	// }}}
  
	// {{{ getDivId
	/**
	 * returns the divId of this window
   * @access  public
	 * @return String
	 */
	this.getDivId = function() {
		return this._divId;
	};
	// }}}
  
  // {{{ isCentered
  /**
   * returns the centered of this window
   * @access  public
   * @return string
   */
  this.isCentered = function() {
    return this._centered;
  };
  // }}}
  
  // {{{ setCentered
  /**
   * sets the centered attribute of this window instance
   * @param boolean centered the value to set
   * @access  public
   * @return string
   */
  this.setCentered = function(centered) {
    this._centered = centered;
  };
  // }}}
  
  // {{{ isClosed
  /**
   * returns the closed of this window
   * @access  public
   * @return string
   */
  this.isClosed = function() {
    return this._closed;
  };
  // }}}
  
	// {{{ isFocused
	/**
	 * returns true if this window instance is currently focused
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
  
	// {{{ getHeight
	/**
	 * returns the height of this window
   * @access  public
	 * @return int
	 */
	this.getHeight = function() {
		return this._height;
	};
	// }}}
  
	// {{{ setHeight
	/**
	 * sets the _height instance variable
   * @param int height the value to set
   * @access  public
	 * @return void
	 */
	this.setHeight = function(height) {
		this._height = height;
	};
	// }}}
  
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
  
	// {{{ getMaxHeight
	/**
	 * returns the resize height for this window based on it's current y position
   * and the max height defined for its window
   * @access  public
	 * @return int
	 */
	this.getMaxHeight = function() {
    return (this._window.getMaxHeight() ? this._window.getMaxHeight() : OS.getWorkspaceHeight()) - this._y + this._window.getHeightBuffer() + this._window.getHeightResizeBuffer(); 
	};
	// }}}
  
	// {{{ getMaxWidth
	/**
	 * returns the resize width for this window based on it's current x position
   * and the max width defined for its window
   * @access  public
	 * @return int
	 */
	this.getMaxWidth = function() {
		return (this._window.getMaxWidth() ? this._window.getMaxWidth() : OS.getWorkspaceWidth()) - this._x - 5;
	};
	// }}}
  
	// {{{ isMaximized
	/**
	 * returns true if this window instance is currently maximized
   * @access  public
	 * @return boolean
	 */
	this.isMaximized = function() {
		return this._maximized;
	};
	// }}}
  
	// {{{ setMaximized
	/**
	 * sets the _maximized instance variable
   * @param boolean maximized the value to set
   * @access  public
	 * @return void
	 */
	this.setMaximized = function(maximized) {
		this._maximized = maximized;
	};
	// }}}
  
	// {{{ isMinimized
	/**
	 * returns true if this window instance is currently minimized
   * @access  public
	 * @return boolean
	 */
	this.isMinimized = function() {
		return this._minimized;
	};
	// }}}
  
	// {{{ setMinimized
	/**
	 * sets the _minimized instance variable
   * @param boolean minimized the value to set
   * @access  public
	 * @return void
	 */
	this.setMinimized = function(minimized) {
		this._minimized = minimized;
	};
	// }}}
  
	// {{{ getMinHeight
	/**
	 * returns the resize min height for this window based on it's current y 
   * position and the min height defined for its window
   * @access  public
	 * @return int
	 */
	this.getMinHeight = function() {
		return this._y + this._window.getMinHeight() > OS.getWorkspaceHeight() ? OS.getWorkspaceHeight() - y : this._window.getMinHeight();
	};
	// }}}
  
	// {{{ getMinWidth
	/**
	 * returns the resize min width for this window based on it's current x 
   * position and the min width defined for its window
   * @access  public
	 * @return int
	 */
	this.getMinWidth = function() {
		return this._x + this._window.getMinWidth() > OS.getWorkspaceWidth() ? OS.getWorkspaceWidth() - x : this._window.getMinWidth();
	};
	// }}}
  
	// {{{ getModalTarget
	/**
	 * returns the modalTarget of this window instance
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getModalTarget = function() {
		return this._modalTarget;
	};
	// }}}
  
	// {{{ getOnCloseExecute
	/**
	 * returns the onCloseExecute of this window instance
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getOnCloseExecute = function() {
		return this._onCloseExecute;
	};
	// }}}
  
	// {{{ setOnCloseExecute
	/**
	 * sets the _onCloseExecute instance variable
   * @param SRAOS_WindowInstance onCloseExecute the value to set
   * @access  public
	 * @return void
	 */
	this.setOnCloseExecute = function(onCloseExecute) {
		this._onCloseExecute = onCloseExecute;
	};
	// }}}
  
	// {{{ getOpener
	/**
	 * returns the opener of this window instance
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.getOpener = function() {
		return this._opener;
	};
	// }}}
  
	// {{{ setOpener
	/**
	 * sets the _opener instance variable
   * @param SRAOS_WindowInstance opener the value to set
   * @access  public
	 * @return void
	 */
	this.setOpener = function(opener) {
		this._opener = opener;
	};
	// }}}
  
	// {{{ getPlugin
	/**
	 * returns the plugin of this window instance
   * @access  public
	 * @return SRAOS_Plugin
	 */
	this.getPlugin = function() {
		return this._plugin;
	};
	// }}}
  
	// {{{ getStatus
	/**
	 * returns the status of this window
   * @access  public
	 * @return String
	 */
	this.getStatus = function() {
		return this._status;
	};
	// }}}
  
	// {{{ setStatus
	/**
	 * sets the _status instance variable
   * @param String status the value to set
   * @access  public
	 * @return void
	 */
	this.setStatus = function(status) {
		this._status = status;
	};
	// }}}
  
	// {{{ getTitle
	/**
	 * returns the title of this window
   * @access  public
	 * @return String
	 */
	this.getTitle = function() {
		return this._title;
	};
	// }}}
  
	// {{{ setTitle
	/**
	 * sets the _title instance variable
   * @param String title the value to set
   * @access  public
	 * @return void
	 */
	this.setTitle = function(title) {
		this._title = title;
	};
	// }}}
  
	// {{{ getWidth
	/**
	 * returns the width of this window
   * @access  public
	 * @return int
	 */
	this.getWidth = function() {
		return this._width;
	};
	// }}}
  
	// {{{ setWidth
	/**
	 * sets the _width instance variable
   * @param int width the value to set
   * @access  public
	 * @return void
	 */
	this.setWidth = function(width) {
		this._width = width;
	};
	// }}}
  
	// {{{ getWindow
	/**
	 * returns the window of this window
   * @access  public
	 * @return SRAOS_Window
	 */
	this.getWindow = function() {
		return this._window;
	};
	// }}}
  
	// {{{ getX
	/**
	 * returns the x of this window
   * @access  public
	 * @return int
	 */
	this.getX = function() {
		return this._x;
	};
	// }}}
  
	// {{{ setX
	/**
	 * sets the _x instance variable
   * @param int x the value to set
   * @access  public
	 * @return void
	 */
	this.setX = function(x) {
		this._x = x;
	};
	// }}}
  
	// {{{ getY
	/**
	 * returns the y of this window
   * @access  public
	 * @return int
	 */
	this.getY = function() {
		return this._y;
	};
	// }}}
  
	// {{{ setY
	/**
	 * sets the _y instance variable
   * @param int y the value to set
   * @access  public
	 * @return void
	 */
	this.setY = function(y) {
		this._y = y;
	};
	// }}}
  
  
  // private methods
  
	// {{{ _hideMenu
	/**
	 * hides this window instance menu
   * @access  public
	 * @return void
	 */
  this._hideMenu = function() {
    // hide menus
    if (this._window.getMenus().length > 0) {
      document.getElementById(this._plugin.getId() + ":" + this._window.getId() + ":menu").style.visibility = "hidden";
      OS.resetOsTitle();
    }
  };
  // }}}
  
  
	// {{{ _submitForm
	/**
	 * handles the response from a submitForm invocation
   * @param Object response the response of the ajax invocation
   * @access  public
	 * @return void
	 */
	this._submitForm = function(response) {
    this.syncFree();
    if (this._submitFormParams["callbackObj"] && this._submitFormParams["callbackMethod"] && this._submitFormParams["callbackObj"][this._submitFormParams["callbackMethod"]]) {
      this._submitFormParams["callbackObj"][this._submitFormParams["callbackMethod"]](response);
    }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString(this._submitFormParams["errorMsg"]), response);
      if (this._submitFormParams["closeOnError"]) {
        OS.closeWindow(this);
      }
    }
    else {
      if (this._submitFormParams["closeOnSuccess"]) {
        OS.closeWindow(this);
      }
    }
	};
	// }}}
  
};


/**
 * the opacity to apply to an unfocused window
 * @type float
 */
SRAOS_WindowInstance.UNFOCUSED_OPACITY = .9;


/**
 * the opacity to apply to a disabled toolbar button
 * @type float
 */
SRAOS_WindowInstance.DISABLED_BUTTON_OPACITY = .4;

/**
 * the opacity to apply to a enabled toolbar button
 * @type float
 */
SRAOS_WindowInstance.ENABLED_BUTTON_OPACITY = .9;

/**
 * used to store the state of a window
 * @type hash
 */
SRAOS_WindowInstance.STATE = {};

/**
 * the offset to apply when tiling windows
 * @type int
 */
SRAOS_WindowInstance.TILE_OFFSET = 10;
