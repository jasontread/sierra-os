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
 | Unless required by winlicable law or agreed to in writing, software     |
 | distributed under the License is distributed on an "AS IS" BASIS,       |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.|
 | See the License for the specific language governing permissions and     |
 | limitations under the License.                                          |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 */

 
// {{{
/**
 * SIERRA::OS date chooser window manager. this is a modal window that prompts 
 * the user to select a date using either a default or a custom prompt message. 
 * this window should be opened using the following parameters:
 *
 *  cbCancel:     the callback method to invoke if the 'Cancel' option is 
 *                selected or if 'Save' is selected without a value. this method 
 *                should have the following signature: cbCancel() : void and may 
 *                be either static or a member of cbObj
 *  cbMethod:     the callback method to invoke on cbObj. if cbObj is not 
 *                specified, this method will be invoked statically. this method 
 *                should have the following signature:
 *                cbMethod(date : Date) : void
 *                date will be null, if the date field does not a contain a 
 *                value (and when the 'required' parameter is not true). this 
 *                method will not be invoked when 'required' is not true and the 
 *                user selects 'Cancel'
 *  cbOjb:        a reference to the callback object
 *  initial:      the initial date chooser value (either a Date object or a 
 *                string) (optional)
 *  prompt:       the date chooser prompt string. if not specified, a default 
 *                will be displayed
 *  required:     whether or not the date selection is mandatory
 *  title:        the window title to set. if not specified, the default text 
 *                'Date Chooser' will be used
 */
Core_DateChooser = function() {
  
  /**
   * a reference to the date input field
   * @type HTMLInput
   */
  this._field;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * whether or not the user clicked 'Save'
   * @type boolean
   */
  this._saved = false;
  
  
	// {{{ onClose
	/**
	 * this method is called when the window is closed. if it does not return 
   * true, the close event will be aborted
   * @param boolean force if true, the return value will be ignored and the 
   * window MUST close
   * @access  public
	 * @return boolean
	 */
	this.onClose = function(force) {
    if (!this._saved && this.params.cbCancel) {
      this.params.cbOjb && this.params.cbOjb[this.params.cbCancel] ? this.params.cbOjb[this.params.cbCancel]() : eval(this.params.cbCancel + '();');
    }
		return true;
	};
	// }}}
  
	// {{{ onOpen
	/**
	 * this method is called when the window is first opened. if it does not 
   * return true, the window open event will be aborted and the window will not 
   * be displayed
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return boolean
	 */
	this.onOpen = function(height, width) {
    this._field = SRAOS_Util.getDomElements(this.win.getCanvas(), { name: 'dateChooserDate' }, true, true, 1);
    this._plugin = this.win.getPlugin();
    
    if (this.params.initial) { this._field.value = this.params.initial.getPHPDate ? this.params.initial.getPHPDate(OS.dateChooserFormat) : this.params.initial; }
    if (this.params.prompt) { this.win.getElementById('coreDateChooserLabel').innerHTML = this.params.prompt; }
    if (this.params.required) { this.win.getElementById('coreDateChooserCancelBtn').style.display = 'none'; }
    if (this.params.title) { this.win.setTitleText(this.params.title); }
    this._field.focus();
    this._field.select();
    return true;
  };
  // }}}
  
	// {{{ save
	/**
	 * invoked when the user clicks on the save button
   * @access  public
	 * @return void
	 */
	this.save = function() {
    var val = SRAOS_Util.trim(this._field.value);
    if (val == '') { val = null; }
    if (this.params.required && !val) {
      OS.displayErrorMessage(this._plugin.getString('DateChooser.required'));
    }
    else {
      if (val) {
        if (this.params.cbMethod) {
          if (this.params.cbOjb && this.params.cbOjb[this.params.cbMethod]) {
            this.params.cbOjb[this.params.cbMethod](val);
          }
          else {
            Core_DateChooser._tmpDate = val;
            eval(this.params.cbMethod + '(Core_DateChooser._tmpDate);');
            Core_DateChooser._tmpDate = null;
          }
        }
        this._saved = true;
      }
      OS.closeWindow(this.win);
    }
  };
  // }}}
};

// }}}
