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
require_once('SRAOS_ConstraintGroup.php');
require_once('SRAOS_Menu.php');
require_once('SRAOS_ResizeComponent.php');
require_once('SRAOS_ToolbarButton.php');
// }}}

// {{{ Constants
/**
 * the default min height for windows
 * @type int
 */
define('SRAOS_WINDOW_DEFAULT_MIN_HEIGHT', 200);

/**
 * the default min width for windows
 * @type int
 */
define('SRAOS_WINDOW_DEFAULT_MIN_WIDTH', 300);
// }}}

// {{{ SRAOS_Window
/**
 * represents a plugin window
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Window {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique window identifier
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the plugin this window pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this application pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * whether or not the close icon/window option should be available for this 
   * window. the default is true
	 * @type boolean
	 */
	var $_canClose;
  
  /**
	 * whether or not this window can be minimized. by default, a window can 
   * always be minimized unless it is modal
	 * @type boolean
	 */
	var $_canMinimize;
  
  /**
	 * whether or not the window should be opened centered over whatever window 
   * was focused when it was opened. this value overrides _defaultCenter. if 
   * there is no windows active when this window is opened, it will be centered 
   * in the workspace
	 * @type boolean
	 */
	var $_centerOpener;
  
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
  var $_closeConfirm;
  
  /**
	 * whether or not the window should be centered in the os window by default
	 * @type boolean
	 */
	var $_defaultCenter;
  
  /**
	 * the default height of this window when it is first opened
	 * @type int
	 */
	var $_defaultHeight;
  
  /**
	 * whether or not the window should be maximized in the os window by default. 
   * if true, _defaultHeight, _defaultWidth, _defaultX and _defaultY will not be 
   * applicable
	 * @type boolean
	 */
	var $_defaultMaximize;
  
  /**
	 * the default width of this window when it is first opened
	 * @type int
	 */
	var $_defaultWidth;
  
  /**
	 * the default x position of this window when it is first opened
	 * @type int
	 */
	var $_defaultX;
  
  /**
	 * the default y position of this window when it is first opened
	 * @type int
	 */
	var $_defaultY;
  
  /**
	 * whether or not this window is in a fixed position. fixed position windows 
   * cannot be moved within the workspace
	 * @type boolean
	 */
	var $_fixedPosition;
  
  /**
	 * whether or not this window is a fixed size. if true, it will not be 
   * resizable from the initial size set by _defaultHeight and _defaultWidth 
   * (or _defaultMaximize) and max/min height/width will not be applicable and 
   * the resize image will not be displayed for the window
	 * @type boolean
	 */
	var $_fixedSize;
  
  /**
	 * the help topic identifier
	 * @type string
	 */
	var $_helpTopic;
  
  /**
	 * the icon to use for this window
	 * @type string
	 */
	var $_icon;
  
  /**
	 * the name of the javascript class (within one of the plugin javascript 
   * source files) that should be instantiated and assigned to the SRAOS_Window 
   * instance _manager variable. oone instance of this manager will exist per 
   * instance of this window. for more information, review the api documentation 
   * in www/html/lib/SRAOS_WindowManager.js
	 * @type string
	 */
	var $_manager;
  
  /**
	 * the maximum height of this window. if not specified, the window will be 
   * resizable up to the full height of the os window
	 * @type int
	 */
	var $_maxHeight;
  
  /**
	 * the maximum width of this window. if not specified, the window will be 
   * resizable up to the full width of the os window
	 * @type int
	 */
	var $_maxWidth;
  
  /**
	 * menus use by this window
	 * @type SRAOS_Menu[]
	 */
	var $_menus = array();
  
  /**
	 * modal windows are windows that must be responded to before any further 
   * activity can take place. they are displayed over top of any other window 
   * and cannot lose focus until they are closed. a good use for modal windows 
   * if for popup alerts or confirmation dialogs
	 * @type boolean
	 */
	var $_modal;
  
  /**
	 * similiar to "model" but blocking applies only to the current focused 
   * application (presumably the application that opened this window). if no 
   * application instances currently exit, no blocking will be performed. if an 
   * application window is _modalApp, then all other application windows 
   * (besides the modal window) will be blocked
	 * @type boolean
	 */
	var $_modalApp;
  
  /**
	 * identical to _modalApp but applies to the current focused window only 
   * (other windows in the same application instance will not be blocked)
	 * @type boolean
	 */
	var $_modalWin;
  
  /**
	 * whether or not this window supports multiple concurrent instances within a 
   * single application (or OS for non application windows) instance. by 
   * default, a window only supports a single concurrent instance
	 * @type boolean
	 */
	var $_multiInstance;
  
  /**
	 * resizable components use by this window
	 * @type SRAOS_ResizeComponent[]
	 */
	var $_resizeComponents = array();
  
  /**
	 * the label for this window. this should reference a string value in one of 
   * the resources properties files. this value will be displayed in the window 
   * title bar by default. If not specified, the invoking application resource 
   * will be used
	 * @type string
	 */
	var $_resource;
  
  /**
	 * whether or not the state of this window should be saved from 1 instance to 
   * another. this will include 'maximized', 'centered', 'x', 'y', 'height', and 
   * 'width' state information
	 * @type boolean
	 */
	var $_saveState;
  
  /**
	 * whether or not the canvas area of this window should be scrollable. by 
   * default the canvas is scrollable. if not scrollable, elements that do not 
   * fit within the canvas will be hidden from view
	 * @type boolean
	 */
	var $_scroll;
  
  /**
	 * whether or not to display the status bar in this window. the status bar is 
   * a small area at the bottom of the window where window specific messages can 
   * be displayed
	 * @type boolean
	 */
	var $_statusBar;
  
  /**
	 * toolbar buttons use by this window
	 * @type SRAOS_ToolbarButton[]
	 */
	var $_toolbarButtons = array();
  
  /**
	 * the smarty template that should be used for the initial canvas content
	 * @type string
	 */
	var $_tpl;
	
  // }}}

  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Window
	/**
	 * instantiates a new SRAOS_Window object based on the $id specified. if 
   * there are problems with the xml configuration for this window, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the entity
   * @param array $config the data to use to instantiate this entity
   * @param SRAOS_Plugin $plugin the plugin that this application pertains to
   * @param string $icon the application icon that this window is a part of. it 
   * will only be used if a window specific icon has not been specified
   * @param string $resource the application resource. will be used if a window 
   * specific resource has not been specified
   * @param SRAOS_Menu $appMenu if this window belongs to an application, this 
   * menu represents the application menu item. this is the first menu that is 
   * displayed in the menu bar containing application and not window specific  
   * menu items such as about, preferences and quit
   * @access  public
	 */
	function SRAOS_Window($id, & $config, & $plugin, $icon = FALSE, $resource = FALSE, $appMenu = FALSE) {
    if (!$id || !$plugin || !is_array($config) || !isset($config['attributes']['tpl']) || (!$icon && !isset($config['attributes']['icon'])) || 
        (!isset($config['attributes']['default-height']) && isset($config['attributes']['default-maximize']) && $config['attributes']['default-maximize'] == '0' && !isset($config['attributes']['default-width'])) || 
        (!isset($config['attributes']['resource']) && !$resource)) {
			$msg = "SRAOS_Window::SRAOS_Window: Failed - insufficient data to instantiate entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['help-topic']) && !SRAOS_HelpTopic::isValid($plugin->_helpTopics[$config['attributes']['help-topic']])) {
			$msg = "SRAOS_Window::SRAOS_Window: Failed - help topic " . $config['attributes']['help-topic']. " is not valid for window ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $icon = isset($config['attributes']['icon']) ? $config['attributes']['icon'] : $icon;
    if (!SRAOS_PluginManager::validateIcon($plugin->getId(), $icon)) {
			$msg = "SRAOS_Window::SRAOS_Window: Failed - icon ${icon} is not valid for window ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (!SRAOS_PluginManager::validateTemplate($plugin->getId(), $config['attributes']['tpl'])) {
			$msg = "SRAOS_Window::SRAOS_Window: Failed - template " . $config['attributes']['tpl']. " is not valid for window ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    $this->_canClose = isset($config['attributes']['can-close']) && $config['attributes']['can-close'] == '0' ? FALSE : TRUE;
    $this->_canMinimize = isset($config['attributes']['can-minimize']) && $config['attributes']['can-minimize'] == '0' ? FALSE : TRUE;
    $this->_centerOpener = isset($config['attributes']['center-opener']) && $config['attributes']['center-opener'] == '1' ? TRUE : FALSE;
    $this->_closeConfirm = isset($config['attributes']['close-confirm']) ? $config['attributes']['close-confirm'] : NULL;
    $this->_defaultCenter = isset($config['attributes']['default-center']) && $config['attributes']['default-center'] == '1' ? TRUE : FALSE;
    $this->_defaultHeight = isset($config['attributes']['default-height']) ? $config['attributes']['default-height'] : NULL;
    $this->_defaultMaximize = isset($config['attributes']['default-maximize']) && $config['attributes']['default-maximize'] == '0' ? FALSE : TRUE;
    $this->_defaultWidth = isset($config['attributes']['default-width']) ? $config['attributes']['default-width'] : NULL;
    $this->_defaultX = isset($config['attributes']['default-x']) ? $config['attributes']['default-x'] : 0;
    $this->_defaultY = isset($config['attributes']['default-y']) ? $config['attributes']['default-y'] : 0;
    $this->_fixedPosition = isset($config['attributes']['fixed-position']) && $config['attributes']['fixed-position'] == '1' ? TRUE : FALSE;
    $this->_fixedSize = isset($config['attributes']['fixed-size']) && $config['attributes']['fixed-size'] == '1' ? TRUE : FALSE;
    $this->_helpTopic = isset($config['attributes']['help-topic']) ? $config['attributes']['help-topic'] : NULL;
    $this->_icon = $icon;
    $this->_manager = isset($config['attributes']['manager']) ? $config['attributes']['manager'] : NULL;
    $this->_maxHeight = isset($config['attributes']['max-height']) ? $config['attributes']['max-height'] : NULL;
    $this->_maxWidth = isset($config['attributes']['max-width']) ? $config['attributes']['max-width'] : NULL;
    $this->_minHeight = isset($config['attributes']['min-height']) ? $config['attributes']['min-height'] : SRAOS_WINDOW_DEFAULT_MIN_HEIGHT;
    $this->_minWidth = isset($config['attributes']['min-width']) ? $config['attributes']['min-width'] : SRAOS_WINDOW_DEFAULT_MIN_WIDTH;
    $this->_modal = isset($config['attributes']['modal']) && $config['attributes']['modal'] == '1' ? TRUE : FALSE;
    $this->_modalApp = isset($config['attributes']['modal-app']) && $config['attributes']['modal-app'] == '1' ? TRUE : FALSE;
    $this->_modalWin = isset($config['attributes']['modal-win']) && $config['attributes']['modal-win'] == '1' ? TRUE : FALSE;
    $this->_multiInstance = isset($config['attributes']['multi-instance']) && $config['attributes']['multi-instance'] == '1' ? TRUE : FALSE;
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $resource;
    $this->_saveState = isset($config['attributes']['save-state']) && $config['attributes']['save-state'] == '0' ? FALSE : TRUE;
    $this->_scroll = isset($config['attributes']['scroll']) && $config['attributes']['scroll'] == '0' ? FALSE : TRUE;
    $this->_statusBar = isset($config['attributes']['status-bar']) && $config['attributes']['status-bar'] == '0' ? FALSE : TRUE;
    $this->_tpl = $config['attributes']['tpl'];
    
    if ($appMenu) {
      $this->_menus[SRAOS_APPLICATION_MENU_ID] =& $appMenu;
    }
    
    // menus
    if (isset($config['menu'])) {
      $keys = array_keys($config['menu']);
      foreach ($keys as $key) {
        $this->_menus[$key] = new SRAOS_Menu($key, $config['menu'][$key], $this->_id, $plugin, $this->_id);
        if (SRA_Error::isError($this->_menus[$key]->err)) {
          $msg = "SRAOS_Window::SRAOS_Window: Failed - Unable to instantiate SRAOS_Menu ${key} for window ${id}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
        if (SRAOS_ConstraintGroup::isValid($constraintGroup =& $this->_menus[$key]->getConstraintGroup()) && !$constraintGroup->evaluate()) {
          unset($this->_menus[$key]);
        }
      }
    }
    
    
    // resize components
    if (isset($config['resize-component'])) {
      $keys = array_keys($config['resize-component']);
      foreach ($keys as $key) {
        $this->_resizeComponents[$key] = new SRAOS_ResizeComponent($key, $config['resize-component'][$key], $plugin);
        if (SRA_Error::isError($this->_resizeComponents[$key]->err)) {
          $msg = "SRAOS_Window::SRAOS_Window: Failed - Unable to instantiate SRAOS_ResizeComponent ${key} for window ${id}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    
    // toolbar buttons
    if (isset($config['button'])) {
      $keys = array_keys($config['button']);
      foreach ($keys as $key) {
        $this->_toolbarButtons[$key] = new SRAOS_ToolbarButton($key, $config['button'][$key], $plugin);
        if (SRA_Error::isError($this->_toolbarButtons[$key]->err)) {
          $msg = "SRAOS_Window::SRAOS_Window: Failed - Unable to instantiate SRAOS_ToolbarButton ${key} for window ${id}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
        if (SRAOS_ConstraintGroup::isValid($constraintGroup =& $this->_toolbarButtons[$key]->getConstraintGroup()) && !$constraintGroup->evaluate()) {
          unset($this->_toolbarButtons[$key]);
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
		return $this->_icon ? SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . "${size}/" . $this->_icon : NULL;
	}
	// }}}
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_Window(id, pluginId, callBacks, defaultCenter, defaultHeight, defaultMaximize, 
   *              defaultWidth, defaultX, defaultY, fixedSize, helpTopic, icon, label, 
   *              manager, maxHeight, maxWidth, menus, modal, resizeComponents, scroll, 
   *              statusBar, toolbarButtons)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_Window("' . $this->_id . '", "' . $this->_pluginId . '", ';
    
    $code .= $this->_canClose ? 'true, ' : 'false, ';
    $code .= $this->_canMinimize ? 'true, ' : 'false, ';
    $code .= $this->_centerOpener ? 'true, ' : 'false, ';
    $code .= '"' . str_replace('"', '\"', $this->getCloseConfirm()) . '", ';
    $code .= $this->_defaultCenter ? 'true, ' : 'false, ';
    $code .= $this->_defaultHeight ? $this->_defaultHeight . ', ' : 'null, ';
    $code .= $this->_defaultMaximize ? 'true, ' : 'false, ';
    $code .= $this->_defaultWidth ? $this->_defaultWidth . ', ' : 'null, ';
    $code .= $this->_defaultX . ', ';
    $code .= $this->_defaultY . ', ';
    $code .= $this->_fixedPosition ? 'true, ' : 'false, ';
    $code .= $this->_fixedSize ? 'true, ' : 'false, ';
    $code .= $this->_helpTopic ? '"' . $this->_helpTopic . '", ' : 'null, ';
    $code .= '"' . $this->_icon . '", ';
    $code .= '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    $code .= $this->_manager? '"' . $this->_manager . '", ' : 'null, ';
    $code .= $this->_maxHeight ? $this->_maxHeight . ', ' : 'null, ';
    $code .= $this->_maxWidth ? $this->_maxWidth . ', ' : 'null, ';
    $code .= $this->_minHeight ? $this->_minHeight . ', ' : 'null, ';
    $code .= $this->_minWidth ? $this->_minWidth . ', ' : 'null, ';
    
    // menus
    $code .= '[';
    $keys = array_keys($this->_menus);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_menus[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    
    $code .= $this->_modal ? 'true, ' : 'false, ';
    $code .= $this->_modalApp ? 'true, ' : 'false, ';
    $code .= $this->_modalWin ? 'true, ' : 'false, ';
    $code .= $this->_multiInstance ? 'true, ' : 'false, ';
    
    // resizeComponents
    $code .= '[';
    $keys = array_keys($this->_resizeComponents);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_resizeComponents[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    
    $code .= $this->_saveState ? 'true, ' : 'false, ';
    $code .= $this->_scroll ? 'true, ' : 'false, ';
    $code .= $this->_statusBar ? 'true, ' : 'false, ';
    
    // toolbarButtons
    $code .= '[';
    $keys = array_keys($this->_toolbarButtons);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_toolbarButtons[$key]->getJavascriptInstanceCode();
    }
    $code .= '])';
    
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this window
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
	 * returns the id of this window
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
	 * returns the pluginId of this window
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
  
  // {{{ isCanClose
  /**
   * returns the canClose of this window
   * @access  public
   * @return string
   */
  function isCanClose() {
    return $this->_canClose;
  }
  // }}}
  
  // {{{ setCanClose
  /**
   * sets the plugin canClose
   * @param string $canClose the canClose to set
   * @access  public
   * @return void
   */
  function setCanClose($canClose) {
    $this->_canClose = $canClose;
  }
  // }}}
  
  // {{{ isCanMinimize
  /**
   * returns the canMinimize of this window
   * @access  public
   * @return string
   */
  function isCanMinimize() {
    return $this->_canMinimize;
  }
  // }}}
  
  // {{{ setCanMinimize
  /**
   * sets the plugin canMinimize
   * @param string $canMinimize the canMinimize to set
   * @access  public
   * @return void
   */
  function setCanMinimize($canMinimize) {
    $this->_canMinimize = $canMinimize;
  }
  // }}}
  
  // {{{ isCenterOpener
  /**
   * returns the centerOpener of this window
   * @access  public
   * @return string
   */
  function isCenterOpener() {
    return $this->_centerOpener;
  }
  // }}}
  
  // {{{ setCenterOpener
  /**
   * sets the plugin centerOpener
   * @param string $centerOpener the centerOpener to set
   * @access  public
   * @return void
   */
  function setCenterOpener($centerOpener) {
    $this->_centerOpener = $centerOpener;
  }
  // }}}
  
	// {{{ getCloseConfirm
	/**
	 * returns the closeConfirm of this window
   * @access  public
	 * @return string
	 */
	function getCloseConfirm() {
		return $this->_closeConfirm;
	}
	// }}}
	
	// {{{ setCloseConfirm
	/**
	 * sets the plugin closeConfirm
	 * @param string $closeConfirm the closeConfirm to set
   * @access  public
	 * @return vocloseConfirm
	 */
	function setCloseConfirm($closeConfirm) {
		$this->_closeConfirm = $closeConfirm;
	}
	// }}}
  
  // {{{ isDefaultCenter
  /**
   * returns the defaultCenter of this window
   * @access  public
   * @return string
   */
  function isDefaultCenter() {
    return $this->_defaultCenter;
  }
  // }}}
  
  // {{{ setDefaultCenter
  /**
   * sets the plugin defaultCenter
   * @param string $defaultCenter the defaultCenter to set
   * @access  public
   * @return void
   */
  function setDefaultCenter($defaultCenter) {
    $this->_defaultCenter = $defaultCenter;
  }
  // }}}
  
	// {{{ getDefaultHeight
	/**
	 * returns the defaultHeight of this window
   * @access  public
	 * @return string
	 */
	function getDefaultHeight() {
		return $this->_defaultHeight;
	}
	// }}}
	
	// {{{ setDefaultHeight
	/**
	 * sets the plugin defaultHeight
	 * @param string $defaultHeight the defaultHeight to set
   * @access  public
	 * @return void
	 */
	function setDefaultHeight($defaultHeight) {
		$this->_defaultHeight = $defaultHeight;
	}
	// }}}
  
  // {{{ isDefaultMaximize
  /**
   * returns the defaultMaximize of this window
   * @access  public
   * @return string
   */
  function isDefaultMaximize() {
    return $this->_defaultMaximize;
  }
  // }}}
  
  // {{{ setDefaultMaximize
  /**
   * sets the plugin defaultMaximize
   * @param string $defaultMaximize the defaultMaximize to set
   * @access  public
   * @return void
   */
  function setDefaultMaximize($defaultMaximize) {
    $this->_defaultMaximize = $defaultMaximize;
  }
  // }}}
  
	// {{{ getDefaultWidth
	/**
	 * returns the defaultWidth of this window
   * @access  public
	 * @return string
	 */
	function getDefaultWidth() {
		return $this->_defaultWidth;
	}
	// }}}
	
	// {{{ setDefaultWidth
	/**
	 * sets the plugin defaultWidth
	 * @param string $defaultWidth the defaultWidth to set
   * @access  public
	 * @return void
	 */
	function setDefaultWidth($defaultWidth) {
		$this->_defaultWidth = $defaultWidth;
	}
	// }}}
  
	// {{{ getDefaultX
	/**
	 * returns the defaultX of this window
   * @access  public
	 * @return string
	 */
	function getDefaultX() {
		return $this->_defaultX;
	}
	// }}}
	
	// {{{ setDefaultX
	/**
	 * sets the plugin defaultX
	 * @param string $defaultX the defaultX to set
   * @access  public
	 * @return void
	 */
	function setDefaultX($defaultX) {
		$this->_defaultX = $defaultX;
	}
	// }}}
  
	// {{{ getDefaultY
	/**
	 * returns the defaultY of this window
   * @access  public
	 * @return string
	 */
	function getDefaultY() {
		return $this->_defaultY;
	}
	// }}}
	
	// {{{ setDefaultY
	/**
	 * sets the plugin defaultY
	 * @param string $defaultY the defaultY to set
   * @access  public
	 * @return void
	 */
	function setDefaultY($defaultY) {
		$this->_defaultY = $defaultY;
	}
	// }}}
  
  // {{{ isFixedPosition
  /**
   * returns the fixedPosition of this window
   * @access  public
   * @return string
   */
  function isFixedPosition() {
    return $this->_fixedPosition;
  }
  // }}}
  
  // {{{ setFixedPosition
  /**
   * sets the plugin fixedPosition
   * @param string $fixedPosition the fixedPosition to set
   * @access  public
   * @return void
   */
  function setFixedPosition($fixedPosition) {
    $this->_fixedPosition = $fixedPosition;
  }
  // }}}
  
  // {{{ isFixedSize
  /**
   * returns the fixedSize of this window
   * @access  public
   * @return string
   */
  function isFixedSize() {
    return $this->_fixedSize;
  }
  // }}}
  
  // {{{ setFixedSize
  /**
   * sets the plugin fixedSize
   * @param string $fixedSize the fixedSize to set
   * @access  public
   * @return void
   */
  function setFixedSize($fixedSize) {
    $this->_fixedSize = $fixedSize;
  }
  // }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the helpTopic of this window
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
  
	// {{{ getIcon
	/**
	 * returns the icon of this window
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
	 * returns the manager of this window
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
  
	// {{{ getMaxHeight
	/**
	 * returns the maxHeight of this window
   * @access  public
	 * @return int
	 */
	function getMaxHeight() {
		return $this->_maxHeight;
	}
	// }}}
	
	// {{{ setMaxHeight
	/**
	 * sets the plugin maxHeight
	 * @param int $maxHeight the maxHeight to set
   * @access  public
	 * @return void
	 */
	function setMaxHeight($maxHeight) {
		$this->_maxHeight = $maxHeight;
	}
	// }}}
  
	// {{{ getMaxWidth
	/**
	 * returns the maxWidth of this window
   * @access  public
	 * @return int
	 */
	function getMaxWidth() {
		return $this->_maxWidth;
	}
	// }}}
	
	// {{{ setMaxWidth
	/**
	 * sets the plugin maxWidth
	 * @param int $maxWidth the maxWidth to set
   * @access  public
	 * @return void
	 */
	function setMaxWidth($maxWidth) {
		$this->_maxWidth = $maxWidth;
	}
	// }}}
  
	// {{{ getMenus
	/**
	 * returns the menus of this window
   * @access  public
	 * @return SRAOS_Menu[]
	 */
	function & getMenus() {
		return $this->_menus;
	}
	// }}}
	
	// {{{ setMenus
	/**
	 * sets the plugin menus
	 * @param SRAOS_Menu[] $menus the menu to set
   * @access  public
	 * @return void
	 */
	function setMenus(& $menus) {
		$this->_menus =& $menus;
	}
	// }}}
  
	// {{{ getMinHeight
	/**
	 * returns the minHeight of this window
   * @access  public
	 * @return int
	 */
	function getMinHeight() {
		return $this->_minHeight;
	}
	// }}}
	
	// {{{ setMinHeight
	/**
	 * sets the plugin minHeight
	 * @param int $minHeight the minHeight to set
   * @access  public
	 * @return void
	 */
	function setMinHeight($minHeight) {
		$this->_minHeight = $minHeight;
	}
	// }}}
  
	// {{{ getMinWidth
	/**
	 * returns the minWidth of this window
   * @access  public
	 * @return int
	 */
	function getMinWidth() {
		return $this->_minWidth;
	}
	// }}}
	
	// {{{ setMinWidth
	/**
	 * sets the plugin minWidth
	 * @param int $minWidth the minWidth to set
   * @access  public
	 * @return void
	 */
	function setMinWidth($minWidth) {
		$this->_minWidth = $minWidth;
	}
	// }}}
  
  // {{{ isModal
  /**
   * returns the modal of this window
   * @access  public
   * @return string
   */
  function isModal() {
    return $this->_modal;
  }
  // }}}
  
  // {{{ setModal
  /**
   * sets the plugin modal
   * @param string $modal the modal to set
   * @access  public
   * @return void
   */
  function setModal($modal) {
    $this->_modal = $modal;
  }
  // }}}
  
  // {{{ isModalApp
  /**
   * returns the modalApp of this window
   * @access  public
   * @return string
   */
  function isModalApp() {
    return $this->_modalApp;
  }
  // }}}
  
  // {{{ setModalApp
  /**
   * sets the plugin modalApp
   * @param string $modalApp the modalApp to set
   * @access  public
   * @return void
   */
  function setModalApp($modalApp) {
    $this->_modalApp = $modalApp;
  }
  // }}}
  
  // {{{ isModalWin
  /**
   * returns the modalWin of this window
   * @access  public
   * @return string
   */
  function isModalWin() {
    return $this->_modalWin;
  }
  // }}}
  
  // {{{ setModalWin
  /**
   * sets the plugin modalWin
   * @param string $modalWin the modalWin to set
   * @access  public
   * @return void
   */
  function setModalWin($modalWin) {
    $this->_modalWin = $modalWin;
  }
  // }}}
  
	// {{{ isMultiInstance
	/**
	 * returns the multiInstance of this plugin
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
  
	// {{{ getResizeComponents
	/**
	 * returns the resizeComponents of this window
   * @access  public
	 * @return SRAOS_ResizeComponent[]
	 */
	function & getResizeComponents() {
		return $this->_resizeComponents;
	}
	// }}}
	
	// {{{ setResizeComponents
	/**
	 * sets the plugin resizeComponents
	 * @param SRAOS_ResizeComponent[] $resizeComponents the resizeComponent to set
   * @access  public
	 * @return void
	 */
	function setResizeComponents(& $resizeComponents) {
		$this->_resizeComponents =& $resizeComponents;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this window
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
  
  // {{{ isScroll
  /**
   * returns the scroll of this window
   * @access  public
   * @return string
   */
  function isScroll() {
    return $this->_scroll;
  }
  // }}}
  
  // {{{ setScroll
  /**
   * sets the plugin scroll
   * @param string $scroll the scroll to set
   * @access  public
   * @return void
   */
  function setScroll($scroll) {
    $this->_scroll = $scroll;
  }
  // }}}
  
  
  // {{{ isStatusBar
  /**
   * returns the statusBar of this window
   * @access  public
   * @return string
   */
  function isStatusBar() {
    return $this->_statusBar;
  }
  // }}}
  
  // {{{ setStatusBar
  /**
   * sets the plugin statusBar
   * @param string $statusBar the statusBar to set
   * @access  public
   * @return void
   */
  function setStatusBar($statusBar) {
    $this->_statusBar = $statusBar;
  }
  // }}}
  
	// {{{ getToolbarButtons
	/**
	 * returns the toolbarButtons of this window
   * @access  public
	 * @return SRAOS_ToolbarButton[]
	 */
	function & getToolbarButtons() {
		return $this->_toolbarButtons;
	}
	// }}}
	
	// {{{ setToolbarButtons
	/**
	 * sets the plugin toolbarButtons
	 * @param SRAOS_ToolbarButton[] $toolbarButtons the toolbarButton to set
   * @access  public
	 * @return void
	 */
	function setToolbarButtons(& $toolbarButtons) {
		$this->_toolbarButtons =& $toolbarButtons;
	}
	// }}}
  
	// {{{ getTpl
	/**
	 * returns the tpl of this window
   * @access  public
	 * @return string
	 */
	function getTpl() {
		return $this->_tpl;
	}
	// }}}
	
	// {{{ setTpl
	/**
	 * sets the plugin tpl
	 * @param string $tpl the tpl to set
   * @access  public
	 * @return void
	 */
	function setTpl($tpl) {
		$this->_tpl = $tpl;
	}
	// }}}
  
  
	// {{{ getTplPath
	/**
	 * returns the platform relative path to the template for this window
   * @access  public
	 * @return string
	 */
	function getTplPath() {
		return 'plugins/' . $this->_pluginId . '/' . $this->_tpl;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Window object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_entity');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>