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
 * represents that data associated with a set of tabs
 * @param SRAOS_Tab[] tabs see api below
 * @param Object container see api below
 * @param String active see api below
 * @param Object callbackObj see api below
 * @param String tabsClass an alternate css class for the tabs
 * @param String activeTabClass an alternate css class for the active tab
 * @param String inactiveTabClass an alternate css class for the inactive tabs
 * enabled by default
 */
SRAOS_TabSet = function(tabs, container, active, callbackObj, tabsClass, activeTabClass, inactiveTabClass) {
  // {{{ Attributes
  // private attributes
  /**
	 * the id of the current active tab. if not specified, the first tab will be 
   * set to active
	 * @type String
	 */
	this._active = active ? active : (tabs && tabs[0] ? tabs[0].id : null);
  
  /**
   * an alternate css class for the active tab
   * @type String
   */
  this._activeTabClass = activeTabClass;
  
  /**
	 * an event callback object. may implement any of the following event methods:
   *  tabActivated(id): invoked when a tab is activated
	 * @type Object
	 */
	this._callbackObj = callbackObj;
  
  /**
	 * the container where the tabs should be rendered to (the innerHTML will be
   * overwritten completely)
	 * @type String
	 */
	this._container = container;
  this._container.className = tabsClass ? tabsClass : "tabs";
  
  /**
   * an alternate css class for the inactive tab
   * @type String
   */
  this._inactiveTabClass = inactiveTabClass;
  
  /**
   * the tabs to display
   * @type SRAOS_Tab[]
   */
  this._tabs = tabs;
  
  // public attributes
  
  // }}}
  
  
  // public methods
  
	// {{{ add
	/**
	 * adds a new tab to the tab set and re-renders the tabs
   * @param SRAOS_Tab tab the tab to add
   * @param String before the identifier of the tab that this tab should appear 
   * before. if not specified, it will be added to the end
   * @access  public
	 * @return string
	 */
	this.add = function(tab, before) {
    if (before && this.getTab(before)) {
      var tabs = new Array();
      for(var i in this._tabs) {
        if (this._tabs[i].id == before) { tabs.push(tab); }
        tabs.push(this._tabs[i]);
      }
      this._tabs = tabs;
    }
    else {
      this._tabs.push(tab);
    }
    this.render();
	};
	// }}}
  
	// {{{ disable
	/**
	 * disables the tab specified
   * @param String id the id of the tab to disable
   * @access  public
	 * @return string
	 */
	this.disable = function(id) {
    if (this.getTab(id)) { 
      this.getTab(id).disabled = true; 
      this.render();
    }
	};
	// }}}
  
	// {{{ enable
	/**
	 * enables the tab specified
   * @param String id the id of the tab to enable
   * @access  public
	 * @return string
	 */
	this.enable = function(id) {
    if (this.getTab(id)) { 
      this.getTab(id).disabled = false; 
      this.render();
    }
	};
	// }}}
  
	// {{{ getActive
	/**
	 * returns the id of the current active tab
   * @access  public
	 * @return String
	 */
	this.getActive = function() {
    return this._active;
	};
	// }}}
  
	// {{{ getTab
	/**
	 * returns the tab specified by id
   * @param String id the identifier of the tab to return
   * @access  public
	 * @return SRAOS_Tab
	 */
	this.getTab = function(id) {
    for(var i in this._tabs) {
      if (this._tabs[i].id == id) { return this._tabs[i]; }
    }
    return null;
	};
	// }}}
  
	// {{{ hide
	/**
	 * hides the tab specified or the full tabset if id is not specified
   * @param String id the id of the tab to hide
   * @access  public
	 * @return string
	 */
	this.hide = function(id) {
    if (id && this.getTab(id)) { 
      this.getTab(id).hidden = true; 
      this.render();
    }
    else if (!id) {
      if (this._active && this.getTab(this._active)) {
        this.getTab(this._active).setInactive();
      }
      this._container.innerHTML = '';
    }
	};
	// }}}
  
	// {{{ remove
	/**
	 * removes the tab specified
   * @param String id the id of the tab to remove
   * @access  public
	 * @return string
	 */
	this.remove = function(id) {
    if (this.getTab(id)) {
      this._tabs = SRAOS_Util.removeFromArray(id, this._tabs, 1, 'id');
      this.render();
    }
	};
	// }}}
  
	// {{{ render
	/**
	 * renders the tabs into the container for this tab set
   * @access  public
	 * @return string
	 */
	this.render = function() {
    var html = '<table><tr>';
    for(var i in this._tabs) {
      if (this._tabs[i].hidden) { continue; }
      html += '<td id="' + this._tabs[i].domId + '"' + (this._tabs[i].disabled ? '' : ' onclick="this._tabSet.setActive(\'' + this._tabs[i].id + '\')"') + '>' + this._tabs[i].label + '</td>';
    }
    html += '<td class="spacer">&nbsp;</td></tr></table>';
    this._container.innerHTML = html;
    for(var i in this._tabs) {
      if (this._tabs[i].hidden) { continue; }
      document.getElementById(this._tabs[i].domId)._tabSet = this;
    }
    this.setActive(this._active);
	};
	// }}}
  
	// {{{ setActive
	/**
	 * sets the tab specified by id to active and displays its canvas
   * @param String id the id of the tab to set active. if not specified, all 
   * tabs will be set to innactive
   * @access  public
	 * @return string
	 */
	this.setActive = function(id) {
    for(var i in this._tabs) {
      if (this._tabs[i].id != id) { 
        this._tabs[i].setInactive(this._inactiveTabClass); 
      }
    }
    for(var i in this._tabs) {
      if (this._tabs[i].id == id) { 
        this._tabs[i].setActive(this._inactiveTabClass);
        this._active = id;
      }
    }
    if (id && this._callbackObj && this._callbackObj.tabActivated) { this._callbackObj.tabActivated(id); }
	};
	// }}}
  
	// {{{ show
	/**
	 * shows (un-hides) the tab specified or the full tabset if id is not 
   * specified
   * @param String id the id of the tab to show
   * @access  public
	 * @return string
	 */
	this.show = function(id) {
    if (id && this.getTab(id)) { 
      this.getTab(id).hidden = false; 
      this.render();
    }
    else if (!id && this._container.innerHTML == '') {
      this.render();
    }
	};
	// }}}
  
  // private methods
  
  
  // render tabs
  this.render();
};

