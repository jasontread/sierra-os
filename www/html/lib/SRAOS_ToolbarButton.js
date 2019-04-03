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

// {{{ SRAOS_ToolbarButton
/**
 * represents a plugin window toolbar button
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_ToolbarButton = function(id, pluginId, code, dividerLeft, dividerRight, enabled, icon, iconUri, label) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique identifier of the toolbar button
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this toolbar button pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
   * the code to execute when this button is clicked
   * @type string
   */
  this._code = code;
  
  /**
	 * whether or not to display a divider to the left of this button
	 * @type boolean
	 */
	this._dividerLeft = dividerLeft;
  
  /**
	 * whether or not to display a divider to the right of this button
	 * @type boolean
	 */
	this._dividerRight = dividerRight;
  
  /**
	 * whether or not this button item is enabled by default. this can be changed 
   * using the window manager enable/disableButton methods
	 * @type boolean
	 */
	this._enabled = enabled;
  
  /**
	 * the icon to use for this button
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
	 * the label for this button. this value will be used as the alt and title 
   * attributes of the rendered image (displays a tooltip when the button is 
   * hovered over)
	 * @type string
	 */
	this._label = label;
	
  // }}}
  
  // {{{ Operations
  
  // public operations
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this plugin
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this plugin
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getCode
	/**
	 * returns the code of this menu
   * @access  public
	 * @return string
	 */
	this.getCode = function() {
		return this._code;
	};
	// }}}
  
	// {{{ getDividerLeft
	/**
	 * returns the dividerLeft of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isDividerLeft = function() {
		return this._dividerLeft;
	};
	// }}}
  
	// {{{ getDividerRight
	/**
	 * returns the dividerRight of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isDividerRight = function() {
		return this._dividerRight;
	};
	// }}}
  
	// {{{ isEnabled
	/**
	 * returns the enabled of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isEnabled = function() {
		return this._enabled;
	};
	// }}}
  
	// {{{ setEnabled
	/**
	 * sets the enabled status for this button
   * @param boolean enabled the status to set
   * @access  public
	 * @return void
	 */
	this.setEnabled = function(enabled) {
		this._enabled = enabled;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this plugin
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
	 * returns the iconUri of this application
   * @access  public
	 * @return string
	 */
	this.getIconUri = function() {
		return this._iconUri;
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
  
	// {{{ getOnClickBase
	/**
	 * returns the onClickBase of this window
   * @access  public
	 * @return string
	 */
	this.getOnClickBase = function() {
		return this._onClickBase;
	};
	// }}}
  
  // private operations

  
};
// }}}
