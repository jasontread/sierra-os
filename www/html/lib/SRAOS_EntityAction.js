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
SRAOS_EntityAction = function(pluginId, entity, action, condition, icon, iconUri, label, skipWindows) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the identifier of the plugin this action pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
	 * the entity identifier. this is the plugin id followed by a colon and the 
   * entity id (i.e. "core:OsUser")
	 * @type string
	 */
	this._entity = entity;
  
  /**
   * the static method to invoke this action. this should be just the method 
   * name without any parameters. the signature for this method should be: 
   * (entity : Object) : void where entity is the instance of the entity that 
   * the action should be invoked for
   * @type string
   */
  this._action = action;
  
  /**
   * an optional static method that should be invoked as a condition for 
   * allowing an action to occur for an entity instance. if this method returns
   * true, the action will be allowed, otherwise it will not. the signature for 
   * this method should be (entity : Object) : boolean
   * @type string
   */
  this._condition = condition;
  
  /**
   * the icon to display to represent this action
   * @type string
   */
  this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
   * the label identifier to display to represent this action
   * @type string
   */
  this._label = label;
  
  /**
   * array of window identifiers that this action should not be included in when 
   * the SRAOS.getActions method is invoked. each id should be the plugin id 
   * followed by a colon and the window is (i.e. core:HelpManualWin)
   * @type array
   */
  this._skipWindows = skipWindows;
	
  // }}}
  
  // {{{ Operations
  
  // public operations
  
  // getters/setters
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this action
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getEntity
	/**
	 * returns the entity of this object
   * @access  public
	 * @return string
	 */
	this.getEntity = function() {
		return this._entity;
	};
	// }}}
  
	// {{{ getAction
	/**
	 * returns the action of this object
   * @access  public
	 * @return string
	 */
	this.getAction = function() {
		return this._action;
	};
	// }}}
  
	// {{{ getCondition
	/**
	 * returns the condition of this object
   * @access  public
	 * @return string
	 */
	this.getCondition = function() {
		return this._condition;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this object
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
		return this._icon && size ?  this._iconUri + size + '/' + this._icon : null;
	};
	// }}}
  
	// {{{ getIconUri
	/**
	 * returns the iconUri of this action
   * @access  public
	 * @return string
	 */
	this.getIconUri = function() {
		return this._iconUri;
	};
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label of this object
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
  
	// {{{ getSkipWindows
	/**
	 * returns the skipWindows of this object
   * @access  public
	 * @return String[]
	 */
	this.getSkipWindows = function() {
		return this._skipWindows;
	};
	// }}}

  // }}}
};
// }}}
