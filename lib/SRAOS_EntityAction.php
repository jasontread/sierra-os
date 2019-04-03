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

// {{{ SRAOS_EntityAction
/**
 * defines an action that may occur within the context of a plugin for an 
 * instance of an entity. for example, the messaging plugin creates a new 
 * pre-addressed message window given an instance of the OsUser entity defined 
 * in the core plugin
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_EntityAction {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the identifier of the plugin this action pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this action pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * the entity identifier. this is the plugin id followed by a colon and the 
   * entity id (i.e. "core:OsUser")
	 * @type string
	 */
	var $_entity;
  
  /**
   * the static method to invoke this action. this should be just the method 
   * name without any parameters. the signature for this method should be: 
   * (entity : Object) : void where entity is the instance of the entity that 
   * the action should be invoked for
   * @type string
   */
  var $_action;
  
  /**
   * an optional static method that should be invoked as a condition for 
   * allowing an action to occur for an entity instance. if this method returns
   * true, the action will be allowed, otherwise it will not. the signature for 
   * this method should be (entity : Object) : boolean
   * @type string
   */
  var $_condition;
  
  /**
   * the icon to display to represent this action
   * @type string
   */
  var $_icon;
  
  /**
   * the resource identifier to display to represent this action
   * @type string
   */
  var $_resource;
  
  /**
   * array of window identifiers that this action should not be included in when 
   * the SRAOS.getActions method is invoked. each id should be the plugin id 
   * followed by a colon and the window is (i.e. core:HelpManualWin)
   * @type array
   */
  var $_skipWindows;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_EntityAction
	/**
	 * instantiates a new SRAOS_EntityAction object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the object
   * @param array $config the data to use to instantiate this object
   * @param SRAOS_Plugin $plugin the plugin that this object pertains to
   * @access  public
	 */
	function SRAOS_EntityAction($id, & $config, & $plugin) {
    if (!$id || !$plugin || !is_array($config) || !isset($config['attributes']['action']) || !isset($config['attributes']['icon']) || !isset($config['attributes']['resource'])) {
			$msg = "SRAOS_EntityAction::SRAOS_EntityAction: Failed - insufficient data to instantiate entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (!SRAOS_PluginManager::validateIcon($plugin->getId(), $config['attributes']['icon'])) {
			$msg = "SRAOS_EntityAction::SRAOS_EntityAction: Failed - icon " . $config['attributes']['icon']. " is not valid for action ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
		$this->_entity = $id;
    $this->_action = $config['attributes']['action'];
    $this->_condition = isset($config['attributes']['condition']) ? $config['attributes']['condition'] : NULL;
    $this->_icon = $config['attributes']['icon'];
    $this->_resource = $config['attributes']['resource'];
    $this->_skipWindows = isset($config['attributes']['skip-windows']) ? explode(' ', $config['attributes']['skip-windows']) : array();
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
   * SRAOS_EntityAction(pluginId, entity, action, condition, icon, iconUri, label, skipWindows)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_EntityAction("' . $this->_pluginId . '", ';
    $code .= '"' . $this->_entity . '", ';
    $code .= '"' . $this->_action . '", ';
    $code .= ($this->_condition ? '"' . $this->_condition . '"' : 'null') . ', ';
    $code .= '"' . $this->_icon . '", ';
    $code .= '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    $code .= '[';
    $keys = array_keys($this->_skipWindows);
    foreach($keys as $key) {
      $code .= $key == $keys[0] ? '' : ', ';
      $code .= '"' . $this->_skipWindows[$key] . '"';
    }
    $code .= '])';
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this action
   * @access  public
	 * @return string
	 */
	function getLabel() {
		return $this->_plugin->resources->getString($this->_resource);
	}
	// }}}
  
  
  // getters/setters
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this action
   * @access  public
	 * @return string
	 */
	function getPluginId() {
		return $this->_pluginId;
	}
	// }}}
	
	// {{{ setPluginId
	/**
	 * sets the action pluginId
	 * @param string $pluginId the pluginId to set
   * @access  public
	 * @return void
	 */
	function setPluginId($pluginId) {
		$this->_pluginId = $pluginId;
	}
	// }}}
  
	// {{{ getEntity
	/**
	 * returns the entity of this object
   * @access  public
	 * @return string
	 */
	function getEntity() {
		return $this->_entity;
	}
	// }}}
	
	// {{{ setEntity
	/**
	 * sets the action entity
	 * @param string $entity the entity to set
   * @access  public
	 * @return voentity
	 */
	function setEntity($entity) {
		$this->_entity = $entity;
	}
	// }}}
  
	// {{{ getAction
	/**
	 * returns the action of this object
   * @access  public
	 * @return string
	 */
	function getAction() {
		return $this->_action;
	}
	// }}}
	
	// {{{ setAction
	/**
	 * sets the action action
	 * @param string $action the action to set
   * @access  public
	 * @return voaction
	 */
	function setAction($action) {
		$this->_action = $action;
	}
	// }}}
  
	// {{{ getCondition
	/**
	 * returns the condition of this object
   * @access  public
	 * @return string
	 */
	function getCondition() {
		return $this->_condition;
	}
	// }}}
	
	// {{{ setCondition
	/**
	 * sets the action condition
	 * @param string $condition the condition to set
   * @access  public
	 * @return vocondition
	 */
	function setCondition($condition) {
		$this->_condition = $condition;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this object
   * @access  public
	 * @return string
	 */
	function getIcon() {
		return $this->_icon;
	}
	// }}}
	
	// {{{ setIcon
	/**
	 * sets the action icon
	 * @param string $icon the icon to set
   * @access  public
	 * @return voicon
	 */
	function setIcon($icon) {
		$this->_icon = $icon;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this object
   * @access  public
	 * @return string
	 */
	function getResource() {
		return $this->_resource;
	}
	// }}}
	
	// {{{ setResource
	/**
	 * sets the action resource
	 * @param string $resource the resource to set
   * @access  public
	 * @return voresource
	 */
	function setResource($resource) {
		$this->_resource = $resource;
	}
	// }}}
  
	// {{{ getSkipWindows
	/**
	 * returns the skipWindows of this object
   * @access  public
	 * @return array
	 */
	function getSkipWindows() {
		return $this->_skipWindows;
	}
	// }}}
	
	// {{{ setSkipWindows
	/**
	 * sets the action skipWindows
	 * @param array $skipWindows the skipWindows to set
   * @access  public
	 * @return void
	 */
	function setSkipWindows($skipWindows) {
		$this->_skipWindows = $skipWindows;
	}
	// }}}
  
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_EntityAction object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_entityaction');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
