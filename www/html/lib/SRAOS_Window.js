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
 * This class manages behavior and state of an individual SIERRA::OS window
 */
SRAOS_Window = function(id, pluginId, canClose, canMinimize, centerOpener, closeConfirm, defaultCenter, defaultHeight, defaultMaximize, defaultWidth, defaultX, defaultY, fixedPosition, fixedSize, helpTopic, icon, iconUri, label, manager, maxHeight, maxWidth, minHeight, minWidth, menus, modal, modalApp, modalWin, multiInstance, resizeComponents, saveState, scroll, statusBar, toolbarButtons) {
  // {{{ Attributes
  // public attributes
  
  
  // private attributes
  /**
	 * the unique window identifier
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this window pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
	 * whether or not the close icon/window option should be available for this 
   * window. the default is true
	 * @type boolean
	 */
	this._canClose = canClose;
  
  /**
	 * whether or not this window can be minimized. by default, a window can 
   * always be minimized unless it is modal
	 * @type boolean
	 */
	this._canMinimize = canMinimize;
  
  /**
	 * whether or not the window should be opened centered over whatever window 
   * was focused when it was opened. this value overrides _defaultCenter. if 
   * there is no windows active when this window is opened, it will be centered 
   * in the workspace
	 * @type boolean
	 */
	this._centerOpener = centerOpener;
  
  /**
   * specifying this parameter if you wish to prompt the user if they attempt to 
   * close the window after making modifications to the form fields contained 
   * within it. when the window is first initialized (and after each time 
   * SRAOS_Window.resetDirtyFlags is invoked), the state of its fields is 
   * records. if they user makes any changes to those fields, the window will 
   * become "dirty" as verified by the SRAOS_Window.isDirty method. If the user 
   * attempts to close the window in a dirty state, and this attribute has been 
   * specified, the user will be prompted by the resource string represented by 
   * this attribute. if they confirm the close, the window will be closed, 
   * otherwise it will stay open
   * @type boolean
   */
  this._closeConfirm = closeConfirm;
  
  /**
	 * whether or not the window should be centered in the os window by default
	 * @type boolean
	 */
	this._defaultCenter = defaultCenter;
  
  /**
	 * the default height of this window when it is first opened
	 * @type int
	 */
	this._defaultHeight = defaultHeight ? defaultHeight : SRAOS.DEFAULT_HEIGHT;
  
  /**
	 * whether or not the window should be maximized in the os window by default. 
   * if true, _defaultHeight, _defaultWidth, _defaultX and _defaultY will not be 
   * applicable
	 * @type boolean
	 */
	this._defaultMaximize = defaultMaximize;
  
  /**
	 * the default width of this window when it is first opened
	 * @type int
	 */
	this._defaultWidth = defaultWidth ? defaultWidth : SRAOS.DEFAULT_WIDTH;
  
  /**
	 * the default x position of this window when it is first opened
	 * @type int
	 */
	this._defaultX = defaultX ? defaultX : SRAOS.DEFAULT_X;
  
  /**
	 * the default y position of this window when it is first opened
	 * @type int
	 */
	this._defaultY = defaultY ? defaultY : SRAOS.DEFAULT_Y;
  
  /**
	 * whether or not this window is in a fixed position. fixed position windows 
   * cannot be moved within the workspace
	 * @type boolean
	 */
	this._fixedPosition = fixedPosition;
  
  /**
	 * whether or not this window is a fixed size. if true, it will not be 
   * resizable from the initial size set by _defaultHeight and _defaultWidth 
   * (or _defaultMaximize) and max/min height/width will not be applicable and 
   * the resize image will not be displayed for the window
	 * @type boolean
	 */
	this._fixedSize = fixedSize;
  
  /**
	 * help topic identifier for this window
	 * @type string
	 */
	this._helpTopic = helpTopic;
  
  /**
	 * the icon to use for this window
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
	 * the label for this window. this should reference a string value in one of 
   * the resources properties files. this value will be displayed in the window 
   * title bar by default. If not specified, the invoking application resource 
   * will be used
	 * @type string
	 */
	this._label = label;
  
  /**
	 * the name of the javascript class (within one of the plugin javascript 
   * source files) that should be instantiated to act as the manager for this 
   * window when it is invoked. one manager per instance of an 
   * SRAOS_WindowInstance will be instantiated. for more information on the 
   * methods that may be implemented in this class, review the api documentation
   * in: sraos/www/html/lib/SRAOS_WindowManager.js
	 * @type string
	 */
	this._manager = manager;
  
  /**
	 * the maximum height of this window. if not specified, the window will be 
   * resizable up to the full height of the os workspace
	 * @type int
	 */
	this._maxHeight = maxHeight;
  
  /**
	 * the maximum width of this window. if not specified, the window will be 
   * resizable up to the full width of the os workspace
	 * @type int
	 */
	this._maxWidth = maxWidth;
  
  /**
	 * the minimum height of this window. if not specified, the window will be 
   * resizable up to the full height of the os window
	 * @type int
	 */
	this._minHeight = minHeight;
  
  /**
	 * the minimum width of this window. if not specified, the window will be 
   * resizable up to the full width of the os window
	 * @type int
	 */
	this._minWidth = minWidth;
  
  /**
	 * menus use by this window
	 * @type SRAOS_Menu[]
	 */
	this._menus = menus;
  
  /**
	 * modal windows are windows that must be responded to before any further 
   * activity can take place. they are displayed over top of any other window 
   * and cannot lose focus until they are closed. a good use for modal windows 
   * if for popup alerts or confirmation dialogs
	 * @type boolean
	 */
	this._modal = modal;
  
  /**
	 * similiar to "model" but blocking applies only to the current focused 
   * application (presumably the application that opened this window). if no 
   * application instances currently exit, no blocking will be performed. if an 
   * application window is _modalApp, then all other application windows 
   * (besides the modal window) will be blocked
	 * @type boolean
	 */
	this._modalApp = modalApp;
  
  /**
	 * identical to _modalApp but applies to the current focused window only 
   * (other windows in the same application instance will not be blocked)
	 * @type boolean
	 */
	this._modalWin = modalWin;
  
  /**
	 * whether or not this window supports multiple concurrent instances within a 
   * single application (or OS for non application windows) instance. by 
   * default, a window only supports a single concurrent instance
	 * @type boolean
	 */
	this._multiInstance = multiInstance;
  
  /**
	 * resizable components use by this window
	 * @type SRAOS_ResizeComponent[]
	 */
	this._resizeComponents = resizeComponents;
  
  /**
	 * whether or not the state of this window should be saved from 1 instance to 
   * another. this will include 'maximized', 'centered', 'x', 'y', 'height', and 
   * 'width' state information
	 * @type boolean
	 */
	this._saveState = saveState;
  
  /**
	 * whether or not the canvas area of this window should be scrollable. by 
   * default the canvas is scrollable. if not scrollable, elements that do not 
   * fit within the canvas will be hidden from view
	 * @type boolean
	 */
	this._scroll = scroll;
  
  /**
	 * whether or not to display the status bar in this window. the status bar is 
   * a small area at the bottom of the window where window specific messages can 
   * be displayed
	 * @type boolean
	 */
	this._statusBar = statusBar;
  
  /**
	 * toolbar buttons use by this window
	 * @type SRAOS_ToolbarButton[]
	 */
	this._toolbarButtons = toolbarButtons;
  
  // }}}
  
  
  // public methods
  
	// {{{ getCode
	/**
	 * returns the unique code for this window ([plugin id]:[window id])
   * @access  public
	 * @return string
	 */
	this.getCode = function() {
		return this._pluginId + ':' + this._id;
	};
	// }}}
  
	// {{{ getHeightBuffer
	/**
	 * returns the height buffer for this window
   * @access  public
	 * @return int
	 */
  this.getHeightBuffer = function() {
    var buffer = 20;
    buffer -= this.isStatusBar() ? 18 : 0;
    buffer -= this.hasToolbar() ? 22 : 0;
    return buffer;
  };
  // }}}
  
	// {{{ getHeightResizeBuffer
	/**
	 * returns the height adjustment for this window
   * @access  public
	 * @return int
	 */
  this.getHeightResizeBuffer = function() {
    var buffer = 39;
    buffer += this.isStatusBar() ? 18 : 0;
    buffer += this.hasToolbar() ? 18 : 0;
    return buffer;
  };
  // }}}
  
	// {{{ hasToolbar
	/**
	 * returns the true if this window has a toolbar
   * @access  public
	 * @return boolean
	 */
	this.hasToolbar = function() {
		return this._toolbarButtons && this._toolbarButtons.length > 0;
	};
	// }}}
  
  // accessors
  
	// {{{ getId
	/**
	 * returns the id of this window
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this window
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getCanvasHtml
	/**
	 * returns the base canvas html content for this window
   * @access  public
	 * @return string
	 */
	this.getCanvasHtml = function() {
		return document.getElementById(this._pluginId + ':' + this._id);
	};
	// }}}
  
  // {{{ isCanClose
  /**
   * returns the canClose of this window
   * @access  public
   * @return string
   */
  this.isCanClose = function() {
    return this._canClose;
  };
  // }}}
  
  // {{{ isCanMinimize
  /**
   * returns the canMinimize of this window
   * @access  public
   * @return string
   */
  this.isCanMinimize = function() {
    return this._canMinimize;
  };
  // }}}
  
  // {{{ isCenterOpener
  /**
   * returns the centerOpener of this window
   * @access  public
   * @return string
   */
  this.isCenterOpener = function() {
    return this._centerOpener;
  };
  // }}}
  
	// {{{ getCloseConfirm
	/**
	 * returns the closeConfirm of this window
   * @access  public
	 * @return string
	 */
	this.getCloseConfirm = function() {
		return this._closeConfirm;
	};
	// }}}
  
  // {{{ isDefaultCenter
  /**
   * returns the defaultCenter of this window
   * @access  public
   * @return string
   */
  this.isDefaultCenter = function() {
    return this._defaultCenter;
  };
  // }}}
  
	// {{{ getDefaultHeight
	/**
	 * returns the defaultHeight of this window
   * @access  public
	 * @return string
	 */
	this.getDefaultHeight = function() {
		return this._defaultHeight;
	};
	// }}}
  
  // {{{ isDefaultMaximize
  /**
   * returns the defaultMaximize of this window
   * @access  public
   * @return string
   */
  this.isDefaultMaximize = function() {
    return this._defaultMaximize;
  };
  // }}}
  
	// {{{ getDefaultWidth
	/**
	 * returns the defaultWidth of this window
   * @access  public
	 * @return string
	 */
	this.getDefaultWidth = function() {
		return this._defaultWidth;
	};
	// }}}
  
	// {{{ getDefaultX
	/**
	 * returns the defaultX of this window
   * @access  public
	 * @return string
	 */
	this.getDefaultX = function() {
		return this._defaultX;
	};
	// }}}
  
	// {{{ getDefaultY
	/**
	 * returns the defaultY of this window
   * @access  public
	 * @return string
	 */
	this.getDefaultY = function() {
		return this._defaultY;
	};
	// }}}
  
  // {{{ isFixedPosition
  /**
   * returns the fixedPosition of this window
   * @access  public
   * @return string
   */
  this.isFixedPosition = function() {
    return this._fixedPosition;
  };
  // }}}
  
  // {{{ isFixedSize
  /**
   * returns the fixedSize of this window
   * @access  public
   * @return string
   */
  this.isFixedSize = function() {
    return this._fixedSize;
  };
  // }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the help topic of this plugin or null if it does not have one
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	this.getHelpTopic = function() {
		return this._helpTopic;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this window
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
   * @param int size the icon size
   * @access  public
	 * @return string
	 */
	this.getIconPath = function(size) {
		return this._icon && size ? this.getIconUri(size, this._icon) : null;
	};
	// }}}
  
	// {{{ getIconUri
	/**
	 * returns the iconUri of this window
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
	 * returns the manager of this window
   * @access  public
	 * @return string
	 */
	this.getManager = function() {
		return this._manager;
	};
	// }}}
  
	// {{{ getMaxHeight
	/**
	 * returns the maxHeight of this window
   * @access  public
	 * @return int
	 */
	this.getMaxHeight = function() {
    
		return this._maxHeight;
	};
	// }}}
  
	// {{{ getMaxWidth
	/**
	 * returns the maxWidth of this window
   * @access  public
	 * @return int
	 */
	this.getMaxWidth = function() {
		return this._maxWidth;
	};
	// }}}
  
	// {{{ getMenu
	/**
	 * returns the menu specified or null if id is not valid
   * @param string id the id of the menu to return
   * @access  public
	 * @return SRAOS_Menu
	 */
	this.getMenu = function(id) {
		for(var i in this._menus) {
      if (this._menus[i].getId() == id) {
        return this._menus[i];
      }
      // check children
      var subMenus = this._menus[i].getAllMenus();
      for (var n in subMenus) {
        if (subMenus[n].getId() == id) {
          return subMenus[n];
        }
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getMenus
	/**
	 * returns the menus of this window
   * @access  public
	 * @return SRAOS_Menu[]
	 */
	this.getMenus = function() {
		return this._menus;
	};
	// }}}
  
	// {{{ getMinHeight
	/**
	 * returns the minHeight of this window
   * @access  public
	 * @return int
	 */
	this.getMinHeight = function() {
		return this._minHeight;
	};
	// }}}
  
	// {{{ getMinWidth
	/**
	 * returns the minWidth of this window
   * @access  public
	 * @return int
	 */
	this.getMinWidth = function() {
		return this._minWidth;
	};
	// }}}
  
  // {{{ isModal
  /**
   * returns the modal of this window
   * @access  public
   * @return string
   */
  this.isModal = function() {
    return this._modal;
  };
  // }}}
  
  // {{{ isModalApp
  /**
   * returns the modalApp of this window
   * @access  public
   * @return string
   */
  this.isModalApp = function() {
    return this._modalApp;
  };
  // }}}
  
  // {{{ isModalWin
  /**
   * returns the modalWin of this window
   * @access  public
   * @return string
   */
  this.isModalWin = function() {
    return this._modalWin;
  };
  // }}}
  
	// {{{ isMultiInstance
	/**
	 * returns the multiInstance of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isMultiInstance = function() {
		return this._multiInstance;
	};
	// }}}
  
	// {{{ getResizeComponent
	/**
	 * returns the resizeComponent specified or null if id is not valid
   * @param string id the id of the resizeComponent to return
   * @access  public
	 * @return SRAOS_ResizeComponent
	 */
	this.getResizeComponent = function(id) {
		for(var i=0; i<this._resizeComponents.length; i++) {
      if (this._resizeComponents[i].getId() == id) {
        return this._resizeComponents[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getResizeComponents
	/**
	 * returns the resizeComponents of this window
   * @access  public
	 * @return SRAOS_ResizeComponent[]
	 */
	this.getResizeComponents = function() {
		return this._resizeComponents;
	};
	// }}}
  
  // {{{ isSaveState
  /**
   * returns the saveState of this window
   * @access  public
   * @return string
   */
  this.isSaveState = function() {
    return this._saveState;
  };
  // }}}
  
  // {{{ isScroll
  /**
   * returns the scroll of this window
   * @access  public
   * @return string
   */
  this.isScroll = function() {
    return this._scroll;
  };
  // }}}
  
  
  // {{{ isStatusBar
  /**
   * returns the statusBar of this window
   * @access  public
   * @return string
   */
  this.isStatusBar = function() {
    return this._statusBar;
  };
  // }}}
  
	// {{{ getToolbarButton
	/**
	 * returns the toolbarButton specified or null if id is not valid
   * @param string id the id of the toolbarButton to return
   * @access  public
	 * @return SRAOS_ToolbarButton
	 */
	this.getToolbarButton = function(id) {
		for(var i=0; i<this._toolbarButtons.length; i++) {
      if (this._toolbarButtons[i].getId() == id) {
        return this._toolbarButtons[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getToolbarButtons
	/**
	 * returns the toolbarButtons of this window
   * @access  public
	 * @return SRAOS_ToolbarButton[]
	 */
	this.getToolbarButtons = function() {
		return this._toolbarButtons;
	};
	// }}}
  
  // private methods
  
  
};


// {{{ constants
/**
 * identifier for a close window event
 * @type string
 */
SRAOS_Window.EVENT_CLOSE = 'close';

/**
 * identifier for a maximize window event
 * @type string
 */
SRAOS_Window.EVENT_MAXIMIZE = 'maximize';

/**
 * identifier for a minimize window event
 * @type string
 */
SRAOS_Window.EVENT_MINIMIZE = 'minimize';

/**
 * identifier for a open window event
 * @type string
 */
SRAOS_Window.EVENT_OPEN = 'open';

/**
 * identifier for a resize window event
 * @type string
 */
SRAOS_Window.EVENT_RESIZE = 'resize';

/**
 * identifier for a restore window event
 * @type string
 */
SRAOS_Window.EVENT_RESTORE = 'restore';
// }}}
