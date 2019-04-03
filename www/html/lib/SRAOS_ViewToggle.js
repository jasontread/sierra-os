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
 * used to create a view toggler
 * @param Object view the view (i.e. a div instance) to toggle
 * @param Object toggle the location where the toggle link should be added
 * @param mixed id an optional identifier for this view toggle instance
 * @param boolean hidden whether or not to start the view hidden by default
 * @param boolean white whether or not to use the white toggle icons
 * @param Object callbackObj an optional callback object. the methods 
 * "toggleOpen(id)" and "toggleClose(id)" will be invoked on that object if 
 * they exist
 */
SRAOS_ViewToggle = function(view, toggle, id, hidden, white, callbackObj) {
  // {{{ Attributes
  
  // public attributes
  /**
   * identifier for this view toggle instance
   * @type mixed
   */
  this.id = id;
  
  // private attributes
  
  /**
   * an optional callback object. the methods "toggleOpen(id)" and 
   * "toggleClose(id)" will be invoked on that object if they exist
   * @type Object
   */
  this._callbackObj = callbackObj;
  
  /**
   * the location where the toggle link should be added
   * @type Object
   */
  this._toggle = toggle;
  
  /**
   * the view (i.e. a div instance) to toggle
   * @type Object
   */
  this._view = view;
  
  /**
   * whether or not to use the white toggle icons
   * @type Object
   */
  this._white = white;
  
  // }}}
  
  this._toggle.innerHTML = SRAOS_ViewToggle._getImage(true, white);
  this._toggle._toggleVisible = true;
  this._toggle._viewToggle = this;
  this._toggle.onclick = SRAOS_ViewToggle.toggle;
  this._view._basePosition = this._view.style.position ? this._view.style.position : 'inherit';
  
  /**
   * hides the view if not already hidden
   * @return void
   */
  this.hide = function() {
    if (!this.isHidden()) { this.toggle(); }
  };
  
  /**
   * returns true if this toggle is currently in a hidden state
   * @return void
   */
  this.isHidden = function() {
    return this._view.style.visibility == 'hidden';
  };
  
  /**
   * shows the view if it is hidden
   * @return void
   */
  this.show = function() {
    if (this.isHidden()) { this.toggle(); }
  };
  
  /**
   * toggles the view state
   * @return void
   */
  this.toggle = function() {
    this._toggle.onclick();
  };
  
  if (hidden) { this._toggle.onclick(); }
};


/**
 * the less icon
 * @type String
 */
SRAOS_ViewToggle.LESS_ICON = 'less.gif';

/**
 * the less white icon
 * @type String
 */
SRAOS_ViewToggle.LESS_WHITE_ICON = 'less-white.gif';

/**
 * the more icon
 * @type String
 */
SRAOS_ViewToggle.MORE_ICON = 'more.gif';

/**
 * the more white icon
 * @type String
 */
SRAOS_ViewToggle.MORE_WHITE_ICON = 'more-white.gif';


/**
 * the main toggle method
 * @return void
 */
SRAOS_ViewToggle.toggle = function() {
  this._toggleVisible = !this._toggleVisible;
  this._viewToggle._view.style.position = this._toggleVisible ? this._viewToggle._view._basePosition : 'absolute';
  this._viewToggle._view.style.visibility = this._toggleVisible ? 'inherit' : 'hidden';
  this._viewToggle._toggle.innerHTML = SRAOS_ViewToggle._getImage(this._toggleVisible, this._viewToggle._white);
  if (this._viewToggle._callbackObj && this._viewToggle.isHidden() && this._viewToggle._callbackObj.toggleClose) {
    this._viewToggle._callbackObj.toggleClose(this._viewToggle.id);
  }
  else if (this._viewToggle._callbackObj && !this._viewToggle.isHidden() && this._viewToggle._callbackObj.toggleOpen) {
    this._viewToggle._callbackObj.toggleOpen(this._viewToggle.id);
  }
};


/**
 * returns the xhtml image element for for more or less image
 * @param boolean less whether or not to use the less icon
 * @param boolean white whether or not to use the white icons
 * @return String
 */
SRAOS_ViewToggle._getImage = function(less, white) {
  var alt = OS.getString(less ? 'text.hide' : 'text.show');
  return '<img alt="' + alt + '" src="' + OS.getThemeUri() + (less ? (white ? SRAOS_ViewToggle.LESS_WHITE_ICON : SRAOS_ViewToggle.LESS_ICON) : (white ? SRAOS_ViewToggle.MORE_WHITE_ICON : SRAOS_ViewToggle.MORE_ICON)) + '" title="' + alt + '" />';
};
