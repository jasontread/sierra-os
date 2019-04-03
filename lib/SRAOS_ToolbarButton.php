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

// {{{ SRAOS_ToolbarButton
/**
 * represents a plugin window toolbar button
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_ToolbarButton {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique identifier of the toolbar button
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the plugin this toolbar button pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this application pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
   * determines whether or not this button is visible. It is evaluated only once 
   * when the OS is loaded
   * @type SRAOS_ConstraintGroup
   */
  var $_constraintGroup;
  
  /**
	 * whether or not to display a divider to the left of this button
	 * @type boolean
	 */
	var $_dividerLeft;
  
  /**
	 * whether or not to display a divider to the right of this button
	 * @type boolean
	 */
	var $_dividerRight;
  
  /**
	 * whether or not this button item is enabled by default. this can be changed 
   * using the window manager enable/disableButton methods
	 * @type boolean
	 */
	var $_enabled;
  
  /**
	 * the icon to use for this button
	 * @type string
	 */
	var $_icon;
  
  /**
	 * the name of the method to invoke when this button is clicked. this will be 
   * either an instance method of _target or a global/static method
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
	 * the label for this button. this should reference a string in the plugin's 
   * resources properties files. this value will be used as the alt and title 
   * attributes of the rendered image (displays a tooltip when the button is 
   * hovered over)
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
	// {{{ SRAOS_ToolbarButton
	/**
	 * instantiates a new SRAOS_ToolbarButton object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the menu
   * @param array $config the data to use to instantiate this menu
   * @param SRAOS_Plugin $plugin the plugin that this menu pertains to
   * @access  public
	 */
	function SRAOS_ToolbarButton($id, & $config, & $plugin) {
    if (!$id || !$plugin || !is_array($config) || !isset($config['attributes']['icon']) || !isset($config['attributes']['method'])) {
			$msg = "SRAOS_ToolbarButton::SRAOS_ToolbarButton: Failed - insufficient data to instantiate toolbar button ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (!SRAOS_PluginManager::validateIcon($plugin->getId(), $config['attributes']['icon'])) {
			$msg = "SRAOS_ToolbarButton::SRAOS_ToolbarButton: Failed - icon " . $config['attributes']['icon']. " is not valid for toolbar button ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['target']) && $config['attributes']['target'] != SRAOS_TARGET_OS && $config['attributes']['target'] != SRAOS_TARGET_APP && $config['attributes']['target'] != SRAOS_TARGET_WIN) {
			$msg = "SRAOS_ToolbarButton::SRAOS_ToolbarButton: Failed - target " . $config['attributes']['target']. " is not valid for toolbar button ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    if (isset($config['constraint-group'])) {
      $keys = array_keys($config['constraint-group']);
      $this->_constraintGroup = new SRAOS_ConstraintGroup($config['constraint-group'][$keys[0]]);
      if (SRA_Error::isError($this->_constraintGroup->err)) {
        $msg = "SRAOS_ToolbarButton::SRAOS_ToolbarButton: Failed - Unable to instantiate SRAOS_ConstraintGroup for toolbar button ${id}";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
    }
    $this->_dividerLeft = isset($config['attributes']['divider-left']) && $config['attributes']['divider-left'] == '1' ? TRUE : FALSE;
    $this->_dividerRight = isset($config['attributes']['divider-right']) && $config['attributes']['divider-right'] == '1' ? TRUE : FALSE;
    $this->_enabled = isset($config['attributes']['enabled']) && $config['attributes']['enabled'] == '0' ? FALSE : TRUE;
    $this->_icon = $config['attributes']['icon'];
    $this->_method = $config['attributes']['method'];
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $id;
    $this->_target = isset($config['attributes']['target']) ? $config['attributes']['target'] : NULL;
    
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
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_ToolbarButton(id, pluginId, code, dividerLeft, dividerRight, enabled, icon, iconUri, label)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_ToolbarButton("' . $this->_id . '", "' . $this->_pluginId . '", ';
    $code .= '"' . SRAOS_PluginManager::getJavascriptMethodCode($this->_method, $this->_target, $this->_params) . '", ';
    $code .= $this->_dividerLeft ? 'true, ' : 'false, ';
    $code .= $this->_dividerRight ? 'true, ' : 'false, ';
    $code .= $this->_enabled ? 'true, ' : 'false, ';
    $code .= '"' . $this->_icon . '", ';
    $code .= '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '")';
    
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this button
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
  
	// {{{ getDividerLeft
	/**
	 * returns the dividerLeft of this plugin
   * @access  public
	 * @return boolean
	 */
	function isDividerLeft() {
		return $this->_dividerLeft;
	}
	// }}}
	
	// {{{ setDividerLeft
	/**
	 * sets the plugin dividerLeft
	 * @param boolean $dividerLeft the dividerLeft to set
   * @access  public
	 * @return void
	 */
	function setDividerLeft($dividerLeft) {
		$this->_dividerLeft = $dividerLeft;
	}
	// }}}
  
	// {{{ getDividerRight
	/**
	 * returns the dividerRight of this plugin
   * @access  public
	 * @return boolean
	 */
	function isDividerRight() {
		return $this->_dividerRight;
	}
	// }}}
	
	// {{{ setDividerRight
	/**
	 * sets the plugin dividerRight
	 * @param boolean $dividerRight the dividerRight to set
   * @access  public
	 * @return void
	 */
	function setDividerRight($dividerRight) {
		$this->_dividerRight = $dividerRight;
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
	 * Static method that returns true if the object parameter is a SRAOS_ToolbarButton object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_toolbarbutton');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>