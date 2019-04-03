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
 * this window allows the user to select one or more groups to subscribe to in 
 * their address book
 */
MyContactsAddSubscription = function() {
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * a reference to the groups div
   * @type Object
   */
  this._divGroups;
  
  /**
   * the id of the group that is selected
   * @type int
   */
  this._groupId;
  
  
	// {{{ initCancel
	/**
	 * cancels initial load
   * @access public
	 * @return void
	 */
	this.initCancel = function() {
    OS.closeWindow(this.win);
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
    this._plugin = this.win.getPlugin();
    this._divGroups = this.win.getElementById('MyContactsAddSubscriptionGroups');
    this.win.syncWait(this._plugin.getString('MyContactsAddSubscription.loading'), 'initCancel');
    OS.ajaxInvokeService(MyContactsAddSubscription.SERVICE, this, '_load');
    return true;
  };
  // }}}
  
	// {{{ select
	/**
	 * invoked when the user clicks on the 'Select' button
   * @access public
	 * @return void
	 */
	this.select = function() {
    var values = this.win.getFormValues();
    
    if (!values['subscriptions']) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsAddSubscription.error.nothingSelected'));
    }
    else {
      this._groupId = values['subscriptions'];
      this.win.syncWait(this._plugin.getString('MyContactsAddSubscription.subscribing'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_ADDRESS_BOOK, this, '_select', null, new SRAOS_AjaxRequestObj(OS.user.addressBook.addressBookId, values));
    }
  };
  // }}}
  
  
  // private methods
	// {{{ _load
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._load = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsAddSubscription.error.init'), response);
      OS.closeWindow(this.win);
    }
    else {
      if (!response.results) {
        OS.displayErrorMessage(this._plugin.getString('MyContactsAddSubscription.error.noMatches'));
        OS.closeWindow(this.win);
      }
      else {
        var anyReadOnly = false;
        var html = '';
        for(var i in response.results) {
          html += '<div' + (response.results[i]['gid'] ? ' style="background-image: url(' + OS.getIconUri(16, 'accounts.png') + ')"' : '') + '>';
          html += '<input name="subscriptions" type="radio" value="' + i + '" />';
          html += response.results[i]['name'] + ' (' + this._plugin.getString('MyContactsAddSubscription.createdBy');
          html += ' ' + response.results[i]['owner'] + ')' + (response.results[i]['readOnly'] ? '*' : '') + '</div>\n';
          if (response.results[i]['readOnly']) { anyReadOnly = true; }
        }
        this._divGroups.innerHTML = html;
        if (!anyReadOnly) {
          var div = this.win.getElementById('MyContactsAddSubscriptionReadOnly');
          div.style.visibility = 'hidden';
          div.style.position = 'absolute';
        }
      }
    }
  };
  // }}}
  
	// {{{ _select
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._select = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsAddSubscription.error.unableToSelect'), response);
    }
    else {
      OS.closeWindow(this.win);
      if (!this._group && MyContacts._currentInstance) { MyContacts._currentInstance.reload(this._groupId, true); }
    }
  };
  // }}}
  
};

// constants
/**
 * the name of the entity ajax service for retrieving available subscriptions
 * @type String
 */
MyContactsAddSubscription.SERVICE = 'myContactsGetAvailableSubscriptions';

// }}}
