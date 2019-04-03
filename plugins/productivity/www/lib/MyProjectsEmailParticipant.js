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
 

// {{{
/**
 * MyProjects email participant window manager. this window should be invoked 
 * with a two params, 'callback' which is an object with the following 
 * callback method:
 *  addEmailParticipant(email : String, name : String, int : permissions) : void
 * and 'permissions' which are the permissions to grant to this email user. this 
 * method will be invoked when the user clicks on the save button. if the user 
 * closes the window or clicks on the cancel button, the callback method 
 * will not be invoked
 */
MyProjectsEmailParticipant = function() {
  
  /**
   * reference to the email field
   * @type Object
   */
  this._emailField;
  
  /**
   * reference to the name field
   * @type Object
   */
  this._nameField;
  
  /**
   * reference to the password field
   * @type Object
   */
  this._passwordField;
  
  /**
   * reference to the password confirm field
   * @type Object
   */
  this._passwordConfirmField;
  
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
    this._emailField = this.win.getElementById('myProjectsEmailParticipantEmail');
    this._nameField = this.win.getElementById('myProjectsEmailParticipantName');
    this._passwordField = this.win.getElementById('myProjectsEmailParticipantPassword');
    this._passwordConfirmField = this.win.getElementById('myProjectsEmailParticipantPasswordConfirm');
    SRAOS_Util.addOnEnterEvent(this._passwordConfirmField, this, 'save');
    this._emailField.focus();
		return true;
	};
	// }}}
  
	// {{{ save
	/**
	 * validates the email participant fields and if valid, invokes the callback 
   * and closes the window. if validation fails, displays an error message
   * @access public
	 * @return void
	 */
	this.save = function() {
    if (!SRAOS_Util.validateEmail(this._emailField.value)) {
      OS.displayErrorMessage(OS.getString('error.email', null, { attr: this._emailField.value }));
    }
    else if (this._passwordField.value.length < MyProjectsEmailParticipant.PASSWORD_MIN_LENGTH) {
      OS.displayErrorMessage(this.win.getPlugin().getString('MyProjectsEmailParticipant.error.minPswdLength', { min: MyProjectsEmailParticipant.PASSWORD_MIN_LENGTH }));
    }
    else if (this._passwordField.value != this._passwordConfirmField.value) {
      OS.displayErrorMessage(OS.getString('error.passwordsDoNotMatch'));
    }
    else {
      if (this.params.callback && this.params.callback.addEmailParticipant) {
        this.params.callback.addEmailParticipant(this._emailField.value, this._nameField.value, this.params.permissions, this._passwordField.value);
      }
      OS.closeWindow(this.win);
    }
  };
  // }}}
};

/**
 * the min length for a password
 * @type int
 */
MyProjectsEmailParticipant.PASSWORD_MIN_LENGTH = 6;
// }}}
