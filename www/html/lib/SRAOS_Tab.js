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
 * represents that data and functionality associated with a tab within an 
 * SRAOS_TabSet
 * @param id see api below
 * @param label see api below
 * @param canvas see api below
 * @param disabled see api below
 * @param hidden see api below
 */
SRAOS_Tab = function(id, label, canvas, disabled, hidden) {
  // {{{ Attributes
  
  // private attributes
  
  /**
   * the base overflow css style property for the div
   * @type String
   */
  this._baseOverflowStyle = canvas.style.overflow ? canvas.style.overflow : null;
  
  // public attributes
  
  /**
   * the canvas to display/hide this tab
   * @type Object
   */
  this.canvas = canvas;
  
  /**
	 * whether or not this tab is currently disabled
	 * @type boolean
	 */
	this.disabled = disabled;
  
  /**
   * the dom id to use for this tab
   * @type string
   */
  this.domId = id + Math.round(10000*Math.random());
  
  /**
	 * the identifier for this node. this value must be unique in the tab set that 
   * this tab belongs to. should be an alphanumeric value
	 * @type String
	 */
	this.id = id;
  
  /**
	 * whether or not this tab is currently hidden
	 * @type boolean
	 */
	this.hidden = hidden;
  
  /**
	 * the tab label
	 * @type String
	 */
	this.label = label;
  
  // }}}
  
  
  // public methods
	// {{{ setActive
	/**
	 * sets this tab to active
   * @param String cssClass an overriding css class to use for this tab
   * @access  public
	 * @return string
	 */
	this.setActive = function(cssClass) {
    if (this.canvas && this.canvas.style) {
      SRAOS_Util.showScrollbars(this.canvas);
      this.canvas.style.visibility = 'inherit';
      if (this._baseOverflowStyle) { this.canvas.style.overflow = this._baseOverflowStyle; }
    }
    if (!this.hidden) { document.getElementById(this.domId).className = (cssClass ? cssClass + ' ' : '') + 'active'; }
	};
	// }}}
  
	// {{{ setInactive
	/**
	 * sets this tab to inactive
   * @param String cssClass an overriding css class to use for this tab
   * @access  public
	 * @return string
	 */
	this.setInactive = function(cssClass) {
    if (this.canvas && this.canvas.style) {
      SRAOS_Util.hideScrollbars(this.canvas);
      this.canvas.style.visibility = 'hidden';
      if (this._baseOverflowStyle) { this.canvas.style.overflow = 'hidden'; }
    }
    if (!this.hidden) { document.getElementById(this.domId).className = (cssClass ? cssClass + ' ' : '') + (this.disabled ? 'disabled': 'inactive'); }
	};
	// }}}
  
  // private methods
  
  
};

