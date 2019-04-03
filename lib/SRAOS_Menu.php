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

// }}}

// {{{ Constants

// }}}

// {{{ SRAOS_Menu
/**
 * represents a plugin window menu item
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Menu {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique identifier of the menu item
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the parent of this menu (either a window or another menu)
	 * @type string
	 */
	var $_parentId;
  
  /**
	 * the identifier of the plugin this menu pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this menu pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * the identifier of the window that this menu belongs to
	 * @type string
	 */
	var $_windowId;
  
  /**
	 * whether or not this menu item is checked. a small checkmark is placed to 
   * the left of checked menu items
	 * @type boolean
	 */
	var $_checked;
  
  /**
   * determines whether or not this menu is visible. It is evaluated only once 
   * when the OS is loaded
   * @type SRAOS_ConstraintGroup
   */
  var $_constraintGroup;
  
  /**
	 * whether or not to display a divider above this menu. not applicable for 
   * top-level menus
	 * @type boolean
	 */
	var $_dividerAbove;
  
  /**
	 * whether or not to display a divider below this menu. not applicable for 
   * top-level menus
	 * @type boolean
	 */
	var $_dividerBelow;
  
  /**
	 * whether or not this menu item is enabled by default. this can be changed 
   * using the window manager enable/disableMenu methods
	 * @type boolean
	 */
	var $_enabled;
  
  /**
	 * an optional icon to display to the left of the menu label
	 * @type string
	 */
	var $_icon;
  
  /**
	 * sub-menus
	 * @type SRAOS_Menu[]
	 */
	var $_menus = array();
  
  /**
	 * the name of the method to invoke when this menu item is clicked. this will 
   * be either an instance method of _target or a global/static method
	 * @type string
	 */
	var $_method;
  
  /**
	 * 0..* key/value pairs that should be used as method invocation parameters. 
   * they will be passed to the method in the form of an associative array
	 * @type string[]
	 */
	var $_params = array();
  
  /**
	 * the label for this help topic. this should reference a string value in one 
   * of the plugin resources properties files
	 * @type string
	 */
	var $_resource;
  
  /**
	 * the target object containing the "method" to invoke. possible targets 
   * include "os" for the SRAOS object, "app" for the invoking application 
   * SRAOS_ApplicationInstance object, or "win" for the invoking window 
   * SRAOS_WindowInstance object. if not specified, the "method" will be assumed 
   * to be global or static and invoked as such. The order of precedence for 
   * method calls to "app" or "win" targets is, 1) the corresponding manager for 
   * that app/win  (see application and window manager attribute, 2) the app/win 
   * instance (SRAOS_ApplicationInstance or SRAOS_WindowInstance), and 3) the 
   * app/win object (SRAOS_Application or SRAOS_Window)
	 * @type string
	 */
	var $_target;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Menu
	/**
	 * instantiates a new SRAOS_Menu object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the menu
   * @param array $config the data to use to instantiate this menu
   * @param string $parentId the identifier of the parent of this menu (either a window or another menu)
   * @param SRAOS_Plugin $plugin the plugin that this menu pertains to
   * @access  public
	 */
	function SRAOS_Menu($id, & $config, $parentId, & $plugin, $windowId) {
    if (!$id || !$plugin || !$parentId || !$windowId || !is_array($config) || (!isset($config['attributes']['method']) && !isset($config['menu']))) {
			$msg = "SRAOS_Menu::SRAOS_Menu: Failed - insufficient data to instantiate menu ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['icon']) && !SRAOS_PluginManager::validateIcon($plugin->getId(), $config['attributes']['icon'])) {
			$msg = "SRAOS_Menu::SRAOS_Menu: Failed - icon " . $config['attributes']['icon']. " is not valid for menu ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['target']) && $config['attributes']['target'] != SRAOS_TARGET_OS && $config['attributes']['target'] != SRAOS_TARGET_APP && $config['attributes']['target'] != SRAOS_TARGET_WIN) {
			$msg = "SRAOS_Menu::SRAOS_Menu: Failed - target " . $config['attributes']['target']. " is not valid for menu ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_parentId = $parentId;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    $this->_windowId = $windowId;
    $this->_checked = isset($config['attributes']['checked']) && $config['attributes']['checked'] == '1' ? TRUE : (isset($config['attributes']['checked']) && $config['attributes']['checked'] == '0' ? FALSE : NULL);
    if (isset($config['constraint-group'])) {
      $keys = array_keys($config['constraint-group']);
      $this->_constraintGroup = new SRAOS_ConstraintGroup($config['constraint-group'][$keys[0]]);
      if (SRA_Error::isError($this->_constraintGroup->err)) {
        $msg = "SRAOS_Menu::SRAOS_Menu: Failed - Unable to instantiate SRAOS_ConstraintGroup for menu ${id}";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
    }
    $this->_dividerAbove = isset($config['attributes']['divider-above']) && $config['attributes']['divider-above'] == '1' ? TRUE : FALSE;
    $this->_dividerBelow = isset($config['attributes']['divider-below']) && $config['attributes']['divider-below'] == '1' ? TRUE : FALSE;
    $this->_enabled = isset($config['attributes']['enabled']) && $config['attributes']['enabled'] == '0' ? FALSE : TRUE;
    $this->_icon = isset($config['attributes']['icon']) ? $config['attributes']['icon'] : NULL;
    $this->_method = isset($config['attributes']['method']) ? $config['attributes']['method'] : NULL;
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $id;
    $this->_target = isset($config['attributes']['target']) ? $config['attributes']['target'] : NULL;
    
    // menus
    if (isset($config['menu'])) {
      $keys = array_keys($config['menu']);
      foreach ($keys as $key) {
        $this->_menus[$key] = new SRAOS_Menu($key, $config['menu'][$key], $this->_id, $plugin, $windowId);
        if (SRA_Error::isError($this->_menus[$key]->err)) {
          $msg = "SRAOS_Menu::SRAOS_Menu: Failed - Unable to instantiate SRAOS_Menu ${key} for menu ${id}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
        if (SRAOS_ConstraintGroup::isValid($constraintGroup =& $this->_menus[$key]->getConstraintGroup()) && !$constraintGroup->evaluate()) {
          unset($this->_menus[$key]);
        }
      }
    }
    
    // add params
    if (isset($config['param'])) {
      $keys = array_keys($config['param']);
      foreach ($keys as $key) {
        $this->_params[$key] = $config['param'][$key]['attributes']['value'];
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
  
  // {{{ getJavascriptAddMenuItemCode
	/**
	 * returns the javascript code necessary to add this menu item to the parent 
   * container specified. this includes adding of sub-menus
   * @access  public
	 * @return string
	 */
  function getJavascriptAddMenuItemCode() {
    $code = "currentParent = menuStack.pop()\n";
    $code .= "menuStack.push(currentParent)\n";
    $code .= "menu = currentParent.isTransMenu ? currentParent : currentParent.parentMenu.addMenu(currentParent.parentMenu.items[0]);\n";
    $code .= "OS._menus['" . $this->_pluginId . $this->_id . "'] = menu;\n";
    $code .= 'menuItem = OS.addMenuItem("' . $this->_pluginId . '", "' . $this->_id . '", menu, "' . $this->getLabel() . '", ' . ($this->_icon ? '"' . $this->getIconPath(16) . '"' : 'null') . ', "' . SRAOS_PluginManager::getJavascriptMethodCode($this->_method, $this->_target, $this->_params) . '", ' . ($this->_dividerAbove ? 'true' : 'false') . ', ' . ($this->_dividerBelow ? 'true' : 'false') . ', ' . ($this->_checked === TRUE ? 'true' : ($this->_checked === FALSE ? 'false' : 'null')) . ");\n";
    if (count($this->_menus)) {
      $code .= "OS._menus['" . $this->_pluginId . $this->_id . "'] = menu.addMenu(menuItem);\n";
      $code .= "menuStack.push(OS._menus['" . $this->_pluginId . $this->_id . "']);\n";
      $keys = array_keys($this->_menus);
      foreach($keys as $key) {
        $code .= $this->_menus[$key]->getJavascriptAddMenuItemCode();
      }
      $code .= "menuStack.pop();\n";
    }
    return $code;
  }
  // }}}
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_Menu(id, parentId, pluginId, windowId, code, dividerAbove, dividerBelow, enabled, icon, iconUri, label, menus)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_Menu("' . $this->_id . '", "' . $this->_parentId . '", "' . $this->_pluginId . '", "' . $this->_windowId . '", ';
    $code .= $this->_checked ? 'true, ' : 'false, ';
    $code .= '"' . SRAOS_PluginManager::getJavascriptMethodCode($this->_method, $this->_target, $this->_params) . '", ';
    $code .= $this->_dividerAbove ? 'true, ' : 'false, ';
    $code .= $this->_dividerBelow ? 'true, ' : 'false, ';
    $code .= $this->_enabled ? 'true, ' : 'false, ';
    $code .= $this->_icon ? '"' . $this->_icon . '", ' : 'null, ';
    $code .= $this->_icon ? '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ' : 'null, ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    
    // menus
    $code .= '[';
    $keys = array_keys($this->_menus);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_menus[$key]->getJavascriptInstanceCode();
    }
    $code .= '])';
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this menu
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
	 * returns the id of this plugin
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
  
	// {{{ getParentId
	/**
	 * returns the parentId of this menu
   * @access  public
	 * @return string
	 */
	function getParentId() {
		return $this->_parentId;
	}
	// }}}
  
	// {{{ setParentId
	/**
	 * sets the parent parentId
	 * @param string $parentId the parentId to set
   * @access  public
	 * @return void
	 */
	function setParentId($parentId) {
		$this->_parentId = $parentId;
	}
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this plugin
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
  
	// {{{ getWindowId
	/**
	 * returns the windowId of this menu
   * @access  public
	 * @return string
	 */
	function getWindowId() {
		return $this->_windowId;
	}
	// }}}
  
	// {{{ setWindowId
	/**
	 * sets the window windowId
	 * @param string $windowId the windowId to set
   * @access  public
	 * @return void
	 */
	function setWindowId($windowId) {
		$this->_windowId = $windowId;
	}
	// }}}
  
	// {{{ isChecked
	/**
	 * returns the checked of this plugin
   * @access  public
	 * @return boolean
	 */
	function isChecked() {
		return $this->_checked;
	}
	// }}}
	
	// {{{ setChecked
	/**
	 * sets the plugin checked
	 * @param boolean $checked the checked to set
   * @access  public
	 * @return void
	 */
	function setChecked($checked) {
		$this->_checked = $checked;
	}
	// }}}
  
	// {{{ getConstraintGroup
	/**
	 * returns the SRAOS_ConstraintGroup of this menu
   * @access  public
	 * @return SRAOS_ConstraintGroup
	 */
	function & getConstraintGroup() {
		return $this->_constraintGroup;
	}
	// }}}
	
	// {{{ setConstraintGroup
	/**
	 * sets the plugin SRAOS_ConstraintGroup
	 * @param SRAOS_ConstraintGroup $constraintGroup the SRAOS_ConstraintGroup to 
   * set
   * @access  public
	 * @return void
	 */
	function setConstraintGroup($constraintGroup) {
		$this->_constraintGroup = $constraintGroup;
	}
	// }}}
  
	// {{{ isDividerAbove
	/**
	 * returns the dividerAbove of this plugin
   * @access  public
	 * @return boolean
	 */
	function isDividerAbove() {
		return $this->_dividerAbove;
	}
	// }}}
	
	// {{{ setDividerAbove
	/**
	 * sets the plugin dividerAbove
	 * @param boolean $dividerAbove the dividerAbove to set
   * @access  public
	 * @return void
	 */
	function setDividerAbove($dividerAbove) {
		$this->_dividerAbove = $dividerAbove;
	}
	// }}}
  
	// {{{ isDividerBelow
	/**
	 * returns the dividerBelow of this plugin
   * @access  public
	 * @return boolean
	 */
	function isDividerBelow() {
		return $this->_dividerBelow;
	}
	// }}}
	
	// {{{ setDividerBelow
	/**
	 * sets the plugin dividerBelow
	 * @param boolean $dividerBelow the dividerBelow to set
   * @access  public
	 * @return void
	 */
	function setDividerBelow($dividerBelow) {
		$this->_dividerBelow = $dividerBelow;
	}
	// }}}
  
	// {{{ isEnabled
	/**
	 * returns the enabled of this plugin
   * @access  public
	 * @return boolean
	 */
	function isEnabled() {
		return $this->_enabled;
	}
	// }}}
	
	// {{{ setEnabled
	/**
	 * sets the plugin enabled
	 * @param boolean $enabled the enabled to set
   * @access  public
	 * @return void
	 */
	function setEnabled($enabled) {
		$this->_enabled = $enabled;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this plugin
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
  
	// {{{ getMethod
	/**
	 * returns the method of this plugin
   * @access  public
	 * @return string
	 */
	function getMethod() {
		return $this->_method;
	}
	// }}}
	
	// {{{ setMethod
	/**
	 * sets the plugin method
	 * @param string $method the method to set
   * @access  public
	 * @return void
	 */
	function setMethod($method) {
		$this->_method = $method;
	}
	// }}}
  
	// {{{ getParams
	/**
	 * returns the params of this plugin
   * @access  public
	 * @return stringp[]
	 */
	function getParams() {
		return $this->_params;
	}
	// }}}
	
	// {{{ setParams
	/**
	 * sets the plugin params
	 * @param string[] $params the params to set
   * @access  public
	 * @return void
	 */
	function setParams($params) {
		$this->_params = $params;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this plugin
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
  
	// {{{ getTarget
	/**
	 * returns the target of this plugin
   * @access  public
	 * @return string
	 */
	function getTarget() {
		return $this->_target;
	}
	// }}}
	
	// {{{ setTarget
	/**
	 * sets the plugin target
	 * @param string $target the target to set
   * @access  public
	 * @return void
	 */
	function setTarget($target) {
		$this->_target = $target;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Menu object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_menu');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>