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
 * SIERRA::OS User/Group selector window manager. this window should be opened 
 * using the following parameters:
 *  callback:     the callback object. this object must have the following 
 *                methods:
 *                 selectUser(uid : int, value : mixed, callbackId : mixed) : void
 *                 selectGroup(gid : int, value : mixed, callbackId : mixed) : void
 *                where 'id' is the user/group attribute specified by 'id' and 
 *                'value' is the user/group attribute specified by 'value' (see 
 *                parameter definitions for id/value below)
 *  callbackId:   this value will be passed back to the callback methods. may be 
 *                used if you need multiple invocations of the user/group 
 *                selector using the same callback and the ability to 
 *                distinguish between the different types of invocations
 *  excludeGids:  an array of gids for groups that should NOT be included
 *  excludeUids:  an array of uids for users that should NOT be included
 *  expandGroups: whether or not to display the users of the groups that are not 
 *                already included in the selector. default is true. if this 
 *                parameter is false, ONLY sub-users are displayed
 *  groupsOnly:   only display groups
 *  header:       the header text to use (in place of the default header)
 *  includeGids:  an array of gids for groups that should be included (all other 
 *                groups will be left out)
 *  includeUids:  an array of uids for users that should be included (all other 
 *                users will be left out)
 *  includeUser:  whether or not to include the current user in the selector 
 *                (default is false)
 *  multiple:     whether or not to allow the user to select multiple 
 *                users/groups. the callback will be invoked once for each 
 *                user/group selected. default value is false
 *  usersOnly:    only display users
 *  valueGroups:  the value attribute to use for groups in the selectGroup 
 *                callback. default is 'name'
 *  valueUsers:   the value attribute to use for users in the selectUser 
 *                callback. default is 'name'
 */
Core_UserGroupSelector = function() {
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
   * a reference to the groups div containing the group list
   * @type Object
   */
  this._divGroupsDiv;
  
  /**
   * a reference to the users div
   * @type Object
   */
  this._divUsers;
  
  /**
   * a reference to the users div containing the user list
   * @type Object
   */
  this._divUsersDiv;
  
  /**
   * a hash of id/value pairs corresponding with the values to use for the users 
   * and groups (the keys for groups will be prefixed with 'g')
   * @type Array
   */
  this._values = new Array();
  
  
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
    
    if (!this.params || !this.params.callback || (!this.params.groupsOnly && !this.params.callback['selectUser']) || (!this.params.usersOnly && !this.params.callback['selectGroup']) || (this.params.groupsOnly && this.params.usersOnly)) {
      OS.displayErrorMessage(this._plugin.getString('UserGroupSelector.error'));
      return false;
    }
    else {
      this._divGroups = this.win.getElementById('userGroupSelectorGroups');
      this._divGroupsDiv = this.win.getElementById('userGroupSelectorGroupsDiv');
      if (this.params.usersOnly) {
        this._divGroups.style.visibility = 'hidden';
        this._divGroups.style.position = 'absolute';
      }
      else {
        new SRAOS_ViewToggle(this._divGroupsDiv, this.win.getElementById('userGroupSelectorGroupsToggle'));
      }
      this._divUsers = this.win.getElementById('userGroupSelectorUsers');
      this._divUsersDiv = this.win.getElementById('userGroupSelectorUsersDiv');
      if (this.params.groupsOnly) {
        this._divUsers.style.visibility = 'hidden';
        this._divUsers.style.position = 'absolute';
      }
      else {
        new SRAOS_ViewToggle(this._divUsersDiv, this.win.getElementById('userGroupSelectorUsersToggle'));
      }
      
      var title = this.params.header ? this.params.header : this._plugin.getString('UserGroupSelector.' + (this.params.groupsOnly ? 'group' : (this.params.usersOnly ? 'user' : 'userGroup')) + 'Header');
      this.win.getElementById('userGroupSelectorHeader').innerHTML = title;
      this.win.setTitleText(title);
      
      this.win.syncWait(OS.getString('text.wait'), 'initCancel');
      
      OS.ajaxInvokeService(Core_UserGroupSelector.SERVICE, this, '_load', null, null, { 'excludeGids': this.params.excludeGids, 'excludeUids': this.params.excludeUids, 'expandGroups': this.params.expandGroups, 'groupsOnly': this.params.groupsOnly, 'includeGids': this.params.includeGids, 'includeUids': this.params.includeUids, 'includeUser': this.params.includeUser, 'usersOnly': this.params.usersOnly, 'valueGroups': this.params.valueGroups, 'valueUsers': this.params.valueUsers });
      return true;
    }
  };
  // }}}
  
	// {{{ select
	/**
	 * invoked when the user clicks on the 'Select' button
   * @access public
	 * @return void
	 */
	this.select = function() {
    var fields = this.win.getFormFields();
    for(var i in fields) {
      if (fields[i].checked) {
        var isGroup = SRAOS_Util.beginsWith(fields[i].value, 'g');
        this.params.callback[isGroup ? 'selectGroup' : 'selectUser'](isGroup ? fields[i].value.substr(1) : fields[i].value, this._values[fields[i].value], this.params.callbackId);
      }
    }
    OS.closeWindow(this.win);
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
      OS.displayErrorMessage(this._plugin.getString('UserGroupSelector.error.init'), response);
      OS.closeWindow(this.win);
    }
    else {
      if (!response.results) {
        OS.displayErrorMessage(this._plugin.getString('UserGroupSelector.error.noMatches'));
        OS.closeWindow(this.win);
      }
      else {
        if (response.results['groups']) {
          this._loadItems(this._divGroupsDiv, response.results['groups'], true);
        }
        if (response.results['users']) {
          this._loadItems(this.win.getElementById('userGroupSelectorUsersDiv'), response.results['users']);
        }
      }
    }
  };
  // }}}
  
	// {{{ _loadItems
	/**
	 * loads the user/group selector divs
   * @param Object the div to load
   * @param Array hash the user/group hash to load
   * @param boolean group whether or not the hash contains groups
   * @access public
	 * @return void
	 */
	this._loadItems = function(div, hash, group) {
    var html = '';
    for(var id in hash) {
      var value = (group ? 'g' : '') + id;
      html += '<div style="background-image: url(' + OS.getIconUri(16, group ? 'accounts.png' : 'account.png') + ')">';
      html += '<input name="id' + (this.params.multiple ? value : '') + '" type="' + (this.params.multiple ? 'checkbox' : 'radio') + '" value="' + value + '" />' + hash[id] + '</div>\n';
      this._values[value] = hash[id];
    }
    div.innerHTML = html;
  };
  // }}}
  
};

// constants
/**
 * the ajax service to use to retrieve users/groups for this selector
 * @type String
 */
Core_UserGroupSelector.SERVICE = 'core_userGroupSelector';

// }}}
