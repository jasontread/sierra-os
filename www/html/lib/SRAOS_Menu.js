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

// {{{ SRAOS_Menu
/**
 * represents a plugin window menu item
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_Menu = function(id, parentId, pluginId, windowId, checked, code, dividerAbove, dividerBelow, enabled, icon, iconUri, label, menus) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique identifier of the menu item
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the parent of this menu (either a window or another menu)
	 * @type string
	 */
	this._parentId = parentId;
  
  /**
	 * the identifier of the plugin this help topic pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
	 * the identifier of the window that this menu belongs to
	 * @type string
	 */
	this._windowId = windowId;
  
  /**
	 * whether or not this menu item is checked. a small checkmark is placed to 
   * the left of checked menu items
	 * @type boolean
	 */
	this._checked = checked;
  
  /**
   * the code to execute when this menu is clicked
   * @type string
   */
  this._code = code;
  
  /**
	 * whether or not to display a divider above this menu. not applicable for 
   * top-level menus
	 * @type boolean
	 */
	this._dividerAbove = dividerAbove;
  
  /**
	 * whether or not to display a divider below this menu. not applicable for 
   * top-level menus
	 * @type boolean
	 */
	this._dividerBelow = dividerBelow;
  
  /**
	 * whether or not this menu item is enabled by default. this can be changed 
   * using the window manager enable/disableMenu methods
	 * @type boolean
	 */
	this._enabled = enabled;
  
  /**
	 * an optional icon to display to the left of the menu label
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
	 * the label for this help topic
	 * @type string
	 */
	this._label = label;
  
  /**
	 * sub-menus
	 * @type SRAOS_Menu[]
	 */
	this._menus = menus;
	
  // }}}
  
  // {{{ Operations
	
  
  // public operations
  
	// {{{ getAllMenus
	/**
	 * returns an array of including all sub-menus
   * @access  public
	 * @return Array
	 */
	this.getAllMenus = function() {
		var menus = new Array();
    if (this._menus) {
      for(i in this._menus) {
        menus.push(this._menus[i]);
        var subMenus = this._menus[i].getAllMenus();
        for(n in subMenus) {
          menus.push(subMenus[n]);
        }
      }
    }
    return menus;
	};
	// }}}
  
	// {{{ getDisabledMenus
	/**
	 * returns an array of including all of the disabled sub-menu items 
   * @access  public
	 * @return Array
	 */
	this.getDisabledMenus = function() {
		var disabled = new Array();
    if (this._menus) {
      for(i in this._menus) {
        if (!this._menus[i].isEnabled()) {
          disabled.push(this._menus[i]);
        }
        var subDisabled = this._menus[i].getDisabledMenus();
        for(n in subDisabled) {
          disabled.push(subDisabled[n]);
        }
      }
    }
    return disabled;
	};
	// }}}
  
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
  
	// {{{ getParentId
	/**
	 * returns the parentId of this menu
   * @access  public
	 * @return string
	 */
	this.getParentId = function() {
		return this._parentId;
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
  
	// {{{ getWindowId
	/**
	 * returns the windowId of this menu
   * @access  public
	 * @return string
	 */
	this.getWindowId = function() {
		return this._windowId;
	};
	// }}}
  
	// {{{ isChecked
	/**
	 * returns the checked of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isChecked = function() {
		return this._checked;
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
  
	// {{{ isDividerAbove
	/**
	 * returns the dividerAbove of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isDividerAbove = function() {
		return this._dividerAbove;
	};
	// }}}
  
	// {{{ isDividerBelow
	/**
	 * returns the dividerBelow of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isDividerBelow = function() {
		return this._dividerBelow;
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
	 * returns the label for this plugin
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
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
		for(var i=0; i<this._menus.length; i++) {
      if (this._menus[i].getId() == id) {
        return this._menus[i];
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
	
  
  // private operations

  
};
// }}}
