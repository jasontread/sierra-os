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
 * MyContacts Preferences window manager
 */
MyContactsPreferences = function() {
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
	// {{{ onOpen
	/**
	 * this method is called when the window is first opened. if it does not 
   * return true, the window open event will be aborted and the window will not 
   * be displayed
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access public
	 * @return boolean
	 */
	this.onOpen = function(height, width) {
    this._plugin = this.win.getPlugin();
    this.win.syncWait(this._plugin.getString('MyContactsPreferences.loadingPreferences'));
    OS.ajaxInvokeService(MyContactsPreferences.SERVICE_GET_PREFERENCES_FORM, this, '_loadPreferencesForm', [new SRAOS_AjaxConstraintGroup([new SRAOS_AjaxConstraint("preferencesId", OS.user.myContactsPreferences)])]);
    return true;
  };
  // }}}
  
	// {{{ updatePreferences
	/**
	 * updates a user's INDI preferences if the request invocation to do so is 
   * successful
   * @param Object response the response received for the service request
   * @access public
	 * @return void
	 */
	this.updatePreferences = function(response) {
    if (this.win.isClosed()) { return; }
    
    if (response.status == SRAOS.AJAX_STATUS_SUCCESS) {
      if (MyContacts._currentInstance) {
        MyContacts._currentInstance.loadContacts();
        MyContacts._currentInstance.reloadContact(); 
      }
      OS.closeWindow(this.win);
    }
  };
  // }}}
  
  
  // private methods
	// {{{ _loadPreferencesForm
	/**
	 * updates a user's INDI preferences if the request invocation to do so is 
   * successful
   * @param Object response the response received for the service request
   * @access public
	 * @return void
	 */
	this._loadPreferencesForm = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsPreferences.error.unableToLoadPreferences'), response);
      OS.closeWindow(this.win);
    }
    else {
      this.win.getElementById('myContactsPreferencesButtons').style.visibility = 'inherit';
      this.win.getElementById('myContactsPreferences').innerHTML = response.results;
    }
  };
  // }}}
};


// constants
/**
 * the name of the ajax service for retrieving the MyContacts preferences form
 * preferences
 * @type String
 */
MyContactsPreferences.SERVICE_GET_PREFERENCES_FORM = 'getMyContactsPreferencesForm';

/**
 * the name of the ajax service for updating the user's MyContacts preferences
 * @type String
 */
MyContactsPreferences.SERVICE_UPDATE_PREFERENCES = 'updateMyContactsPreferences';
// }}}
