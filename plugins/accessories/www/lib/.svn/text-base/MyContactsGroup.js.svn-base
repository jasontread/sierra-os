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
 * MyContacts Group window manager. This window can be invoked with the 
 * initialization parameter 'groupId' if it is being opened to edit an existing 
 * group. otherwise, it will be assumed that the window has been opened for a 
 * new group
 */
MyContactsGroup = function() {
  
  /**
   * a hash containing the current access restrictions
   * @type Array
   */
  this._accessRestrictions = new Array();
  
  /**
   * a reference to the delete button
   * @type Object
   */
  this._btnDelete;
  
  /**
   * a reference to the save button
   * @type Object
   */
  this._btnSave;
  
  /**
   * a reference to the div containing the access restrictions
   * @type Object
   */
  this._divAccessRestrictions;
  
  /**
   * a reference to the div containing the public attributes
   * @type Object
   */
  this._divPublicAttrs;
  
  /**
   * a reference to the name field
   * @type Object
   */
  this._fieldName;
  
  /**
   * a reference to the public 'No' checkbox
   * @type Object
   */
  this._fieldPublicNo;
  
  /**
   * a reference to the public 'Yes' checkbox
   * @type Object
   */
  this._fieldPublicYes;
  
  /**
   * a reference to the public read-only 'No' checkbox
   * @type Object
   */
  this._fieldPublicReadOnlyNo;
  
  /**
   * a reference to the public read-only 'Yes' checkbox
   * @type Object
   */
  this._fieldPublicReadOnlyYes;
  
  /**
   * a reference to the restrict access 'No' checkbox
   * @type Object
   */
  this._fieldRestrictAccessNo;
  
  /**
   * a reference to the restrict access 'Yes' checkbox
   * @type Object
   */
  this._fieldRestrictAccessYes;
  
  /**
   * the group this window has been opened for (if applicable)
   * @type Object
   */
  this._group;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  
	// {{{ addAccessRestriction
	/**
	 * adds a new access restriction
   * @param String id the gid or uid of the group/user to add (gids are prefixed 
   * with 'g'). if this parameter is not specified, the addRestriction popup 
   * window will be displayed using this method as the callback
   * @param String name the name of the user or group that id pertains to
   * @access public
	 * @return void
	 */
  this.addAccessRestriction = function(id, name) {
    if (id) {
      this._accessRestrictions[id] = name;
      this.updateViewOfAccessRestrictions();
    }
    else {
      OS.launchWindow('core', 'UserGroupSelector', { 'excludeGids': this.getAccessRestrictionGids(), 'excludeUids': this.getAccessRestrictionUids(), 'callback': this, 'multiple': true });
    }
  };
  // }}}
  
	// {{{ deleteGroup
	/**
	 * deletes the selected group
   * @access public
	 * @return void
	 */
  this.deleteGroup = function() {
    if (this._group && OS.confirm(this._plugin.getString('MyContactsGroup.deleteConfirm'))) {
      this.win.syncWait(this._plugin.getString('MyContactsGroup.deletingGroup'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_delete', null, new SRAOS_AjaxRequestObj(this._group.groupId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
  };
  // }}}
  
	// {{{ getAccessRestrictionGids
	/**
	 * returns the current access restriction gids
   * @access public
	 * @return Array
	 */
  this.getAccessRestrictionGids = function() {
    var gids = new Array();
    for(var i in this._accessRestrictions) {
      if (SRAOS_Util.beginsWith(i, 'g')) { gids.push(i.substr(1)); }
    }
    return gids;
  };
  // }}}
  
	// {{{ getAccessRestrictionUids
	/**
	 * returns the current access restriction uids
   * @access public
	 * @return Array
	 */
  this.getAccessRestrictionUids = function() {
    var uids = new Array();
    for(var i in this._accessRestrictions) {
      if (!SRAOS_Util.beginsWith(i, 'g')) { uids.push(i); }
    }
    return uids;
  };
  // }}}
  
	// {{{ onClose
	/**
	 * this method is called when the window is closed. if it does not return 
   * true, the close event will be aborted
   * @param boolean force if true, the return value will be ignored and the 
   * window MUST close
   * @access  public
	 * @return boolean
	 */
	this.onClose = function() {
    return !this._group || !this.win.isDirty() || (this.win.isDirty() && OS.confirm(this._plugin.getString('MyContactsGroup.closeDirty')));
  };
  // }}}
  
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
    
    this._btnDelete = this.win.getElementById('myContactsGroupDeleteBtn');
    this._btnSave = this.win.getElementById('myContactsGroupSaveBtn');
    this._divAccessRestrictions = this.win.getElementById('myContactsGroupRestrictAccess');
    this._divPublicAttrs = this.win.getElementById('myContactsGroupPublicAttrs');
    this._fieldName = this.win.getElementById('myContactsGroupName');
    this._fieldPublicNo = this.win.getElementById('myContactsGroupPublicNo');
    this._fieldPublicYes = this.win.getElementById('myContactsGroupPublicYes');
    this._fieldPublicReadOnlyNo = this.win.getElementById('myContactsGroupPublicReadOnlyNo');
    this._fieldPublicReadOnlyYes = this.win.getElementById('myContactsGroupPublicReadOnlyYes');
    this._fieldRestrictAccessNo = this.win.getElementById('myContactsGroupRestrictAccessNo');
    this._fieldRestrictAccessYes = this.win.getElementById('myContactsGroupRestrictAccessYes');
    SRAOS_Util.addOnEnterEvent(this._fieldName, this, 'save');
    this._fieldName.focus();
    this.updateViewOfAccessRestrictions();
    this.updateViewOfPublicAttrs();
    this.refreshAccessRestrictions();
    
    if (this.params && this.params.groupId) {
      this.win.setTitleText(this._plugin.getString('MyContactsGroup.edit'));
      var header = this.win.getElementById('MyContactsGroupHeader');
      header.innerHTML = this._plugin.getString('MyContactsGroup.edit');
      header.style.backgroundImage = 'url(' + this._plugin.getIconUri(32, 'contacts-edit.png') + ')';
      
      this.win.syncWait(this._plugin.getString('MyContacts.loadingGroups'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_loadGroup', [new SRAOS_AjaxConstraintGroup([new SRAOS_AjaxConstraint('groupId', this.params.groupId)])]);
      this._btnDelete.style.visibility = 'inherit';
      this._btnSave.value = OS.getString('form.update');
    }
    return true;
  };
  // }}}
  
	// {{{ refreshAccessRestrictions
	/**
	 * updates the access restrictions list
   * @access public
	 * @return void
	 */
  this.refreshAccessRestrictions = function() {
    var html = '';
    var addStr = OS.getString('form.add');
    var removeStr = OS.getString('form.remove');
    for(var i in this._accessRestrictions) {
      html += '<div class="myContactsGroupAccessRestriction" style="background-image: url(' + OS.getIconUri(16, 'edit_remove.png') + ')">';
      html += '<img alt="' + removeStr + '" onclick="OS.getWindowInstance(this).getManager().removeAccessRestriction(\'' + i + '\')"';
      html += ' src="' + SRAOS.PIXEL_IMAGE + '" title="' + removeStr + '" />';
      html += '<span style="background-image: url(' + OS.getIconUri(16, SRAOS_Util.isString(i) && SRAOS_Util.beginsWith(i, 'g') ? 'accounts.png' : 'account.png') + ')">';
      html += this._accessRestrictions[i] + '</span></div>\n';
    }
    html += '<div class="myContactsGroupAccessRestriction" style="background-image: url(' + OS.getIconUri(16, 'edit_add.png') + ')">';
    html += '<img alt="' + addStr + '" onclick="OS.getWindowInstance(this).getManager().addAccessRestriction()"';
    html += ' src="' + SRAOS.PIXEL_IMAGE + '" title="' + addStr + '" />';
    html += '<span style="padding-left: 2px">';
    html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().addAccessRestriction()">';
    html += this._plugin.getString(SRAOS_Util.getLength(this._accessRestrictions) > 0 ? 'MyContactsGroup.addRestriction' : 'MyContactsGroup.addRestrictionRequired');
    html += '</a></span></div>\n';
    this._divAccessRestrictions.innerHTML = html;
  };
  // }}}
  
	// {{{ removeAccessRestriction
	/**
	 * creates or updates the group
   * @access public
	 * @return void
	 */
  this.removeAccessRestriction = function(id) {
    this._accessRestrictions = SRAOS_Util.removeFromArray(id, this._accessRestrictions, null, null, true);
    this.refreshAccessRestrictions();
  };
  // }}}
  
	// {{{ save
	/**
	 * creates or updates the group
   * @access public
	 * @return void
	 */
  this.save = function() {
    if (this._fieldPublicYes.checked && this._fieldRestrictAccessYes.checked && SRAOS_Util.getLength(this._accessRestrictions) == 0) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsGroup.error.accessRestriction'));
    }
    else {
      var attrs = { 'addressBook': OS.user.addressBook.addressBookId, 'name': this._fieldName.value, 'public': this._fieldPublicYes.checked ? true : false, 'publicReadOnly': !this._fieldPublicReadOnlyYes.checked ? true : false };
      if (this._group || (this._fieldPublicYes.checked && this._fieldRestrictAccessYes.checked)) {
        attrs['publicGids'] = this._fieldPublicYes.checked && this._fieldRestrictAccessYes.checked ? this.getAccessRestrictionGids() : null;
        attrs['publicUids'] = this._fieldPublicYes.checked && this._fieldRestrictAccessYes.checked ? this.getAccessRestrictionUids() : null;
      }
      this.win.syncWait(this._plugin.getString(this._group ? 'MyContactsGroup.updatingGroup' : 'MyContactsGroup.creatingGroup'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_save', null, new SRAOS_AjaxRequestObj(this._group ? this._group.groupId : null, attrs));
    }
  };
  // }}}
  
	// {{{ selectGroup
	/**
	 * group selected callback for the Core_UserGroupSelector
   * @param int gid the gid of the group
   * @param String name the name of the group
   * @access public
	 * @return void
	 */
  this.selectGroup = function(gid, name) {
    this.addAccessRestriction('g' + gid, name);
    this.refreshAccessRestrictions();
  };
  // }}}
  
	// {{{ selectUser
	/**
	 * user selected callback for the Core_UserGroupSelector
   * @param int uid the uid of the user
   * @param String name the name of the user
   * @access public
	 * @return void
	 */
  this.selectUser = function(uid, name) {
    this.addAccessRestriction(uid, name);
    this.refreshAccessRestrictions();
  };
  // }}}
  
	// {{{ updateViewOfAccessRestrictions
	/**
	 * shows or hides the access restrictions depending on whether or not the  
   * yes radio button is checked
   * @access public
	 * @return void
	 */
  this.updateViewOfAccessRestrictions = function() {
    this._divAccessRestrictions.style.visibility = this._fieldRestrictAccessYes.checked ? 'inherit' : 'hidden';
    this._divAccessRestrictions.style.position = this._fieldRestrictAccessYes.checked ? 'static' : 'absolute';
    if (this._fieldPublicYes.checked && this._fieldRestrictAccessYes.checked && SRAOS_Util.getLength(this._accessRestrictions) == 0) { this.addAccessRestriction(); }
  };
  // }}}
  
	// {{{ updateViewOfPublicAttrs
	/**
	 * shows or hides the public attributes depending on whether or not the public 
   * yes radio button is checked
   * @access public
	 * @return void
	 */
  this.updateViewOfPublicAttrs = function() {
    this._divPublicAttrs.style.visibility = this._fieldPublicYes.checked ? 'inherit' : 'hidden';
    this._divPublicAttrs.style.position = this._fieldPublicYes.checked ? 'static' : 'absolute';
  };
  // }}}
  
  
  // private methods
  
	// {{{ _delete
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._delete = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsGroup.error.unableToDeleteGroup'), response);
    }
    else {
      if (MyContacts._currentInstance) {
        MyContacts._currentInstance.reload(); 
      }
      this.win.setDirtyFlags();
      OS.closeWindow(this.win);
    }
  };
  // }}}
  
	// {{{ _loadGroup
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadGroup = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results[0]) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsGroup.error.unableToLoadGroup'), response);
      OS.closeWindow(this.win);
    }
    else {
      this._group = response.results[0];
      this._fieldName.value = this._group.name;
      this._fieldPublicNo.checked = !this._group['public'];
      this._fieldPublicYes.checked = this._group['public'];
      this._fieldPublicReadOnlyNo.checked = this._group.publicReadOnly;
      this._fieldPublicReadOnlyYes.checked = !this._group.publicReadOnly;
      this._fieldRestrictAccessNo.checked = !this._group.getAccessRestrictionsHash ? true : false;
      this._fieldRestrictAccessYes.checked = this._group.getAccessRestrictionsHash ? true : false;
      if (this._group.getAccessRestrictionsHash) { 
        this._accessRestrictions = this._group.getAccessRestrictionsHash;
        this.refreshAccessRestrictions();
      }
      this.updateViewOfAccessRestrictions();
      this.updateViewOfPublicAttrs();
      this.win.setDirtyFlags();
      this._fieldName.select();
    }
  };
  // }}}
  
	// {{{ _save
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._save = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString(this._group ? 'MyContactsGroup.error.unableToUpdateGroup' : 'MyContactsGroup.error.unableToCreateGroup'), response);
    }
    else {
      if (!this._group && MyContacts._currentInstance) {
        MyContacts._currentInstance.reload(response.results[0].groupId, true); 
      }
      this.win.setDirtyFlags();
      OS.closeWindow(this.win);
    }
  };
  // }}}
  
};
// }}}
