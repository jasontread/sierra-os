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
 * window manager for MyContacts
 */
MyContacts = function() {
  // private attributes
  /**
   * the id of the current active contact tab
   * @type string
   */
  this._activeTab;
  
  /**
   * used by '_getCardinalityAttributes' as a cache
   * @type Sting[]
   */
  this._cardinalityAttrs;
  
  /**
   * whether or not the columns are currently displayed
   * @type boolean
   */
  this._columnsDisplayed = true;
  
  /**
   * the id of the contact that is currently selected
   * @type int
   */
  this._contactId;
  
  /**
   * whether or not the currently loaded contact is read-only
   * @type int
   */
  this._contactReadOnly;
  
  /**
   * the divs currently displayed in the contact panel
   * @type Object
   */
  this._contactTabDivs;
  
  /**
   * the tabset for the contact panel
   * @type SRAOS_TabSet
   */
  this._contactTabSet;
  
  /**
   * a reference to the contacts list paginator
   * @type SRAOS_AjaxScrollPaginator
   */
  this._contactsPaginator;
  
  /**
   * whether or not the contact form is current dirty
   * @type boolean
   */
  this._dirty;
  
  /**
   * a reference to the canvas div
   * @type Object
   */
  this._divCanvas;
  
  /**
   * a reference to the contact div
   * @type Object
   */
  this._divContact;
  
  /**
   * a reference to the contact tabs div
   * @type Object
   */
  this._divContactTabs;
  
  /**
   * a reference to the contacts div
   * @type Object
   */
  this._divContacts;
  
  /**
   * a reference to the contacts list div
   * @type Object
   */
  this._divContactsList;
  
  /**
   * a reference to the contact controls div
   * @type Object
   */
  this._divControls;
  
  /**
   * a reference to the groups div
   * @type Object
   */
  this._divGroups;
  
  /**
   * a reference to the groups list div
   * @type Object
   */
  this._divGroupsList;
  
  /**
   * a reference to the search div
   * @type Object
   */
  this._divSearch;
  
  /**
   * whether or not the contact view is currently in edit mode
   * @type boolean
   */
  this._editMode = false;
  
  /**
   * the id of the group that is currently selected (or null if the All Contacts 
   * option is selected)
   * @type int
   */
  this._groupId;
  
  /**
   * true when the selected contact is a company
   * @type boolean
   */
  this._isCompany;
  
  /**
   * a reference to the search field
   * @type Object
   */
  this._fieldSearch;
  
  /**
   * used by 'addAttribute' to specify fixed cardinality types. this attribute 
   * should be a hash indexed by attribute name where the value is an array of 
   * cardinality types ordered as they should be specified for the attribute. 
   * for example, if the first phone # should be type 'work' and the second 
   * type 'fax', this attribute should contain a hash value for 'phones' with a 
   * value of ['work', 'fax']
   * @type hash
   */
  this._fixedCardinalityTypes;
  
  /**
   * used by '_adjustAddLinks' to specify a cap on the # of instances of a given 
   * cardinality attribute that can be added on a form. when used, this 
   * attribute should be hash indexed by attribute name where the value is the 
   * max # of instances of that attribute type
   * @type hash
   */
  this._maxCardinality;
  
  /**
   * the name of a callback method to invoke after a new contact is created
   * @type String
   */
  this._newCbMethod;
  
  /**
   * the object containing '_newCbMethod'
   * @type Object
   */
  this._newCbTarget;
  
  /**
   * whether or not to close MyContacts after the new contact is created
   * @type boolean
   */
  this._newClose;
  
  /**
   * a window instance or window component that should be used to focus another 
   * window when a new contact is created successfully
   * @type mixed
   */
  this._newFocus;
  
  /**
   * an optional validator to invoke for the current new contact
   * @type String
   */
  this._newValidator;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * if any search string is currently applied
   * @type String
   */
  this._searchStr = '';
  
  /**
   * used to keep track of which tabs have and have not been loaded
   * @type Array
   */
  this._tabsLoaded;
  
  /**
   * if a group is currently selected, whether or not that group is a 
   * subscription
   * @type boolean
   */
  this._selectedGroupIsSubscription = false;
  
  /**
   * a reference to the contacts vertical divider
   * @type Object
   */
  this._vertDividerContacts;
  
  /**
   * a reference to the groups vertical divider
   * @type Object
   */
  this._vertDividerGroups;
  
  
  // {{{ addAjaxRegionLookup
  /**
   * adds an ajax region lookup to an address region field
   * @param object field the region field to add the lookup to
   * @access public
   * @return void
   */
  this.addAjaxRegionLookup = function(field) {
    if (!field._ajaxLookupInitialized) {
      field._ajaxLookupInitialized = true;
      var tipsDiv = document.createElement('div');
      tipsDiv.setAttribute('class', 'inputSuggestion');
      field.parentNode.insertBefore(tipsDiv, field);
      ajaxTipsAddSelector(field, MyContacts.REGION_LOOKUP_LIMIT, 1, null, MyContacts.SERVICE_GET_ADDRESS_FIELD_OPTIONS, 'value', 'inputSuggestion', 'selected', tipsDiv, field, OS.getWaitImgUri(), OS.getString('text.wait'), null, null, null, this);
      field.onfocus2 = field.onfocus1;
      field._tipsDiv = tipsDiv;
      field.onfocus1 = function() {
        this._alignLookupDiv();
        this.onfocus2();
      };
      field._alignLookupDiv = function() {
        var left = 0;
        var node = this.parentNode.parentNode.previousSibling;
        while(node) {
          if (node.nodeName.toLowerCase() == 'span') { 
            left += node.offsetWidth;
          }
          node = node.previousSibling;
        }
        if (left) { this._tipsDiv.style.marginLeft = left + "px"; }
      };
      field._alignLookupDiv();
    }
  };
  // }}}
  
	// {{{ addAttribute
	/**
	 * used to add a cardinal attribute (names, phones, emails, etc)
   * @param mixed attr the attribute name (or the add image that was clicked)
   * @access public
	 * @return boolean
	 */
	this.addAttribute = function(attr) {
    attr = SRAOS_Util.isString(attr) ? attr : this._getCardinalityAttributeName(attr);
    if (attr) {
      var blankRow = this.win.getElementById(attr + '_blank');
      var newRow = document.createElement('tr');
      var cells = SRAOS_Util.getDomElements(blankRow, { 'nodeName': 'td' }, true, false, null, SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE);
      for(var i in cells) {
        var cell = cells[i].cloneNode(true);
        newRow.appendChild(cell);
      }
      // apply fixed cardinality
      if (this._fixedCardinalityTypes && this._fixedCardinalityTypes[attr] && this._fixedCardinalityTypes[attr].length <= SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' }).length) {
        var select = SRAOS_Util.getDomElements(newRow, { 'nodeName': 'select' }, true, false, 1);
        var type = this._fixedCardinalityTypes[attr][SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' }).length - 1];
        if (select && type) {
          var found = false;
          for(var n in select.options) {
            if (select.options[n].value == type) {
              select.selectedIndex = n;
              found = true;
              break;
            }
          }
          if (!found) {
            var idx = select.options.length - 1;
            select.selectedIndex = idx;
            select.options[idx].value = type;
            select.options[idx].text = type;
          }
          select.disabled = true;
          this.updateTypeLabel(select, select.options[select.selectedIndex].value, select.options[select.selectedIndex].text);
        }
      }
      blankRow.parentNode.insertBefore(newRow, blankRow);
      
      var id = 0;
      var values = SRAOS_Util.getFormValues(blankRow.parentNode);
      for(var i in values) {
        var pieces = i.split('_');
        if (pieces.length == 3 && (pieces[1] * 1) >= id) { id = (pieces[1] * 1) + 1; }
      }
      var fields = SRAOS_Util.getFormFields(newRow);
      for(var i in fields) {
        if (fields[i].name) { fields[i].name = attr + '_' + id + '_' + fields[i].name; }
      }
      this._addId(newRow, attr + '_newAttr'); 
      SRAOS_Util.setDirtyFlags(newRow);
      
      this._adjustAddLinks();
      SRAOS_Util.focusFirstField(newRow, ['input', 'textarea', 'select']);
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
	// {{{ addContactToGroup
	/**
	 * adds a contact to a group
   * @param int contactId the id of the contact. if not specified, the selected 
   * contact will be used
   * @param int groupId the id of the group
   * @access public
	 * @return void
	 */
	this.addContactToGroup = function(contactId, groupId) {
    contactId = contactId ? contactId : this._contactId;
    if (contactId && groupId && groupId != this._groupId) {
      this.win.setStatusBarText(this._plugin.getString('MyContacts.addingContactToGroup'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_addContactToGroup', null, new SRAOS_AjaxRequestObj(groupId, { 'contacts': contactId }), null, contactId);
    }
	};
	// }}}
  
  // {{{ cancelEdit
  /**
   * cancels the current contact edit (confirms with user if form is dirty)
   * @access public
   * @return void
   */
  this.cancelEdit = function() {
    this.toggleEditMode();
  };
  // }}}
  
	// {{{ deleteContact
	/**
	 * deletes the selected contact
   * @access public
	 * @return void
	 */
	this.deleteContact = function() {
    if (this._contactId && OS.confirm(this._plugin.getString('MyContacts.deleteConfirm'))) {
      this.win.syncWait(this._plugin.getString('MyContacts.deletingContact'));
      OS.ajaxInvokeService(MyContacts.SERVICE_UPDATE_CONTACTS, this, '_deleteContact', null, new SRAOS_AjaxRequestObj(this._contactId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
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
    if (this._groupId && OS.confirm(this._plugin.getString('MyContactsGroup.deleteConfirm'))) {
      this.win.setStatusBarText(this._plugin.getString('MyContactsGroup.deletingGroup'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_deleteGroup', null, new SRAOS_AjaxRequestObj(this._groupId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
	};
	// }}}
  
	// {{{ displayColumns
	/**
	 * displays the MyContacts left navigation columns
   * @access public
	 * @return void
	 */
	this.displayColumns = function() {
    if (!this._columnsDisplayed) {
      this._columnsDisplayed = true;
      this._vertDividerContacts.show();
      this._vertDividerGroups.show();
      OS.setMenuItemChecked('myContactsCardColumns', true);
      OS.setMenuItemChecked('myContactsCardOnly', false);
      this.win.updateButton('myContactsColumnsToggle', this._plugin.getIconUri(16, 'card-only.png'), this._plugin.getString('MyContacts.cardOnly'));
    }
	};
	// }}}
  
	// {{{ edit
	/**
	 * places the selected contact in edit mode
   * @access public
	 * @return void
	 */
	this.edit = function() {
    if (this._contactId && !this._editMode) {
      this.toggleEditMode();
    }
	};
	// }}}
  
	// {{{ editGroup
	/**
	 * displays the edit group popup for the selected group
   * @access public
	 * @return void
	 */
	this.editGroup = function() {
    if (this._groupId) {
      this.win.getAppInstance().launchWindow('MyContactsGroup', { groupId: this._groupId });
    }
	};
	// }}}
  
	// {{{ getAddressField
	/**
	 * returns all of the address field specified by name
   * @param Object field any field from the div containing the address
   * @param String name the name of the field to return
   * @access public
	 * @return Object[]
	 */
	this.getAddressField = function(field, name) {
    var fields = this.getAddressFields(field);
    for(var i in fields) {
      if (SRAOS_Util.endsWith(fields[i].name, name)) {
        return fields[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getAddressFields
	/**
	 * returns all of the address fields associated with the field specified
   * @param Object field any field from the div containing the address
   * @access public
	 * @return Object[]
	 */
	this.getAddressFields = function(field) {
    return SRAOS_Util.getFormFields(field.parentNode.parentNode.parentNode.parentNode);
	};
	// }}}
  
	// {{{ getAjaxTipsParams
	/**
	 * used to retrieve ajax tip lookup params dynamically. this method is 
   * invoked by the region field
   * @param Object field the field that the ajax lookup is assigned to
   * @access public
	 * @return Object
	 */
	this.getAjaxTipsParams = function(field) {
    var params = new Array();
    // region lookup
    if (SRAOS_Util.endsWith(field.name, 'region')) {
      params['field'] = 'region';
      params['country'] = this.getAddressField(field, 'country').value;
    }
    return params;
	};
	// }}}
  
	// {{{ hideColumns
	/**
	 * hides the MyContacts left navigation columns
   * @access public
	 * @return void
	 */
	this.hideColumns = function() {
    if (this._columnsDisplayed) {
      this._columnsDisplayed = false;
      this._vertDividerGroups.hide();
      this._vertDividerContacts.hide();
      OS.setMenuItemChecked('myContactsCardColumns', false);
      OS.setMenuItemChecked('myContactsCardOnly', true);
      this.win.updateButton('myContactsColumnsToggle', this._plugin.getIconUri(16, 'card-columns.png'), this._plugin.getString('MyContacts.cardAndColumns'));
    }
	};
	// }}}
  
	// {{{ hideSearch
	/**
	 * hides the search div. returns true on success, false otherwise
   * @access public
	 * @return boolean
	 */
	this.hideSearch = function() {
    if (this._divSearch.style.visibility == 'inherit') {
      this._divSearch.style.visibility = 'hidden';
      this._divSearch.style.position = 'absolute';
      this.win.enableButton('myContactsSearchBtn');
      this.win.enableMenuItem('myContactsSearch');
      this._fieldSearch.value = this._plugin.getString('MyContacts.search');
      if (this._searchStr != '') {
        this._searchStr = '';
        this.loadContacts();
      }
      this._divContactsList.style.height = (parseInt(this._divContactsList.style.height) + this._divSearch.offsetHeight) + "px";
      this._contactsPaginator.refresh();
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
	// {{{ hideTabs
	/**
	 * hides the contact div tabs
   * @access public
	 * @return void
	 */
	this.hideTabs = function() {
    this._divContactTabs.style.height = 0;
    this._divContactTabs.style.position = 'absolute';
    this._divContactTabs.style.visibility = 'hidden';
	};
	// }}}
  
	// {{{ isCompany
	/**
	 * returns TRUE if there is a selected contact and that contact is a company
   * @access public
	 * @return boolean
	 */
	this.isCompany = function() {
    return this._contactId && this._isCompany;
	};
	// }}}
  
	// {{{ isDirty
	/**
	 * returns TRUE if the contact view is in edit mode and the view is currently 
   * dirty
   * @access public
	 * @return boolean
	 */
	this.isDirty = function() {
    var dirty = this._dirty;
    if (!dirty && this._editMode && SRAOS_Util.getLength(this._tabsLoaded)) {
      if (this._contactTabDivs) {
        for(var i in this._contactTabDivs) {
          if (dirty = SRAOS_Util.isDirty(this.win.getElementById(this._contactTabDivs[i]))) { break; }
        }
      }
      else {
        dirty = this.win.isDirty();
      }
    }
    return dirty;
	};
	// }}}
  
	// {{{ loadContact
	/**
	 * loads the contact specified by contactId. returns true on success, false 
   * otherwise
   * @param mixed contactId or object containing 'contactId' specifying the id 
   * of the contact to load
   * @param boolean force whether or not to force the load even if contactId is 
   * already loaded
   * @param boolean skipDirtyCheck whether or not to skip the dirty check
   * @param mixed attrs if the load is for a new contact, this parameter may be 
   * a hash of initial attributes that should be set for that new contact
   * @access public
	 * @return boolean
	 */
	this.loadContact = function(contactId, force, skipDirtyCheck, attrs) {
    // convert contactId parameter
    contactId = contactId && contactId.contactId ? contactId.contactId : contactId;
    
    if ((contactId != this._contactId || force) && (!this._editMode || skipDirtyCheck || !this.isDirty() || OS.confirm(this._plugin.getString('MyContacts.cancelEditConfirm')))) {
      this._divControls.innerHTML = '';
      this.hideTabs();
      if (this._contactId) {
        var selected = this.win.getElementById('_contact' + this._contactId);
        if (selected) { selected.className = 'myContactCard'; }
      }
      var current = this.win.getElementById('_contact' + contactId);
      if (current) { this.win.getElementById('_contact' + contactId).className = 'myContactCardSelected'; }
      this._contactId = contactId;
      if (this._contactId || this._editMode) {
        var div = this.win.getElementById('_contact' + contactId);
        
        var msg = this._plugin.getString(!this._contactId ? 'MyContacts.loadingNewContact' : ('MyContacts.loadingContact' + (div ? 'Name' : ''), div ? { 'name': div.innerHTML } : null));
        this._setWaitMsg(this._divContact, msg);
        this.win.setStatusBarText(msg);
        this._tabsLoaded = new Array();
        this._dirty = false;
        var params = !this._contactId && attrs ? attrs : {};
        params['contactId'] = this._contactId;
        params['_edit_'] = this._editMode;
        params['_view_'] = this._activeTab;
        OS.ajaxInvokeService(MyContacts.SERVICE_GET_CONTACT_VIEW, this, '_loadContact', null, null, params);
      }
      else {
        this._noCardSelected();
      }
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
	// {{{ loadContacts
	/**
	 * loads the contacts list based on the current group/search selection state
   * @access public
	 * @return void
	 */
	this.loadContacts = function() {
    this._contactsPaginator.reset(true);
	};
	// }}}
  
	// {{{ loadGroup
	/**
	 * loads the group specified by groupId. returns true on success, false 
   * otherwise
   * @param int groupId the id of the group to load
   * @access public
	 * @return boolean
	 */
	this.loadGroup = function(groupId) {
    if (groupId != this._groupId && this.win.getElementById('groups' + (groupId ? groupId : ''))) {
      var selected = this.win.getElementById('groups' + (this._groupId ? this._groupId : ''));
      if (selected) { selected.className = null; }
      this.win.getElementById('groups' + (groupId ? groupId : '')).className = 'selected';
      this._groupId = groupId;
      this.refreshMenu();
      this.loadContacts();
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
  // {{{ newContact
  /**
   * displays the new contact form based on the parameters specified
   * @param mixed attrs hash of initial attributes that should be set
   * @param string cbMethod all callback method with the following signature:
   * cbMethod(Contact : contact) : void
   * this method will ONLY be invoked if the contact is created successfully
   * @param Object cbTarget the object containing the 'cbMethod' to invoke
   * @param String validator an optional validator to invoke prior to creating the 
   * contact. if that validator fails, the corresponding error message will be 
   * displayed
   * @param mixed focus a window instance or window component that should be 
   * used to focus another window when a new contact is created successfully
   * @param boolean close whether or not to close MyContacts after the new 
   * contact is created
   * @access public
   * @return void
   */
  this.newContact = function(attrs, cbMethod, cbTarget, validator, focus, close) {
    this._editMode = true;
    this.refreshMenu();
    this.loadContact(null, true, false, attrs);
    this._newCbMethod = cbMethod;
    this._newCbTarget = cbTarget;
    this._newClose = close;
    this._newFocus = focus;
    this._newValidator = validator;
  };
  // }}}
  
  // {{{ newGroup
  /**
   * displays the new group form
   * @access public
   * @return void
   */
  this.newGroup = function() {
    this.win.getAppInstance().launchWindow('MyContactsGroup');
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
	this.onClose = function(force) {
    MyContacts._currentInstance = null;
		return true;
	};
	// }}}
  
	// {{{ onFocus
	/**
	 * this method is called when the the window is focused. return value is 
   * ignored
   * @access public
	 * @return void
	 */
	this.onFocus = function() {
    if (MyContacts._currentInstance._removeHorzScroll) {
      setTimeout('MyContacts._currentInstance._removeHorzScroll()', 10);
    }
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
    MyContacts._currentInstance = this;
    this._plugin = this.win.getPlugin();
    
    this._fieldSearch = this.win.getElementById("myContactsSearchField");
    SRAOS_Util.addOnEnterEvent(this._fieldSearch, this, 'search');
    this._fieldSearch.style.width = (MyContacts.CONTACTS_WIDTH - 50) + 'px';
    
    this._divCanvas = this.win.getElementById("myContactsCanvas");
    
    this._divContact = this.win.getElementById("myContact");
    this._divContactTabs = this.win.getElementById("myContactsTabs");
    this._divControls = this.win.getElementById("myContactsControls");
    
    this._divContacts = this.win.getElementById("myContactsContacts");
    this._vertDividerContacts = this.win.getElementById("myContactsVertDividerContacts");
    
    this._divContactsList = this.win.getElementById("myContactsContactsList");
    this._divContactsList.style.height = (height - this.win.getElementById("myContactsNameHeader").offsetHeight) + "px";
    this._contactsPaginator = new SRAOS_AjaxScrollPaginator('contactsList', this._divContactsList, MyContacts.SERVICE_SEARCH, MyContacts.CARD_HEIGHT, this, null, MyContacts.CONTACTS_LIST_PAGINATOR_BUFFER, null, null, null, '_contactsListRender', '_contactsListWait', '_contactsListRelease', '_contactListPostRender', '_contactsListParams', null, null, null);
    
    this._divGroups = this.win.getElementById("myContactsGroups");
    this._divGroupsList = this.win.getElementById("myContactsGroupsList");
    this._vertDividerGroups = this.win.getElementById("myContactsVertDividerGroups");
    
    this._divSearch = this.win.getElementById("myContactsSearch");
    
    this._divCanvas.style.height = height + "px";
    this._divCanvas.style.left = (MyContacts.CONTACTS_WIDTH + MyContacts.GROUPS_WIDTH) + "px";
    this._divCanvas.style.width = (width - MyContacts.CONTACTS_WIDTH - MyContacts.GROUPS_WIDTH) + "px";
    this._divContactTabs.style.width = this._divCanvas.style.width;
    
    this._divContacts.style.left = MyContacts.GROUPS_WIDTH + "px";
    this._divContacts.style.width = (MyContacts.CONTACTS_WIDTH - 2) + "px";
    
    this._vertDividerContacts.style.left = (MyContacts.GROUPS_WIDTH + MyContacts.CONTACTS_WIDTH - 2) + "px";
    this._vertDividerContacts.style.height = "100%";
    new SRAOS_Divider(this._vertDividerContacts, document.getElementById(this.win.getDivId()), MyContacts.GROUPS_WIDTH + MyContacts.CONTACTS_MIN_WIDTH, MyContacts.GROUPS_WIDTH + MyContacts.CONTACTS_MAX_WIDTH, false, [this._divContacts, this._fieldSearch], [this._divCanvas, this._divContactTabs], 1, MyContacts.GROUPS_WIDTH + MyContacts.DIVIDER_HIDE_BUFFER);
    
    this._divGroups.style.width = (MyContacts.GROUPS_WIDTH - 2) + "px";
    this._vertDividerGroups.style.left = (MyContacts.GROUPS_WIDTH - 2) + "px";
    this._vertDividerGroups.style.height = "100%";
    new SRAOS_Divider(this._vertDividerGroups, document.getElementById(this.win.getDivId()), MyContacts.GROUPS_MIN_WIDTH, MyContacts.GROUPS_MAX_WIDTH, false, [this._divGroups], [this._divContacts, this._divCanvas, this._divContactTabs], 1, MyContacts.DIVIDER_HIDE_BUFFER);
    
    this._vertDividerContacts._myContacts = this;
    this._vertDividerContacts.onDragResetEndDivider = function() {
      if (this.noDrag) { 
        this._showMyContactsSearch = this._myContacts.hideSearch();
        this._myContacts._divContactsList.style.visibility = 'hidden';
        this._showContactList = true;
      }
      else {
        if (this._showMyContactsSearch) {
          this._showMyContactsSearch = false;
          this._myContacts.showSearch();
        }
        if (this._showContactList) {
          this._showContactList = false;
          this._myContacts._divContactsList.style.visibility = 'inherit';
        }
      }
    };
    this._vertDividerGroups._divContacts = this._divContacts;
    this._vertDividerGroups._divCanvas = this._divCanvas;
    this._vertDividerGroups._vertDividerContacts = this._vertDividerContacts;
    this._vertDividerGroups.onDragResetEndDivider = function() {
      var left = parseInt(this.style.left);
      this._vertDividerContacts.dividerHideBuffer = left + (MyContacts.DIVIDER_HIDE_BUFFER * 2);
      this._vertDividerContacts.baseX = left + MyContacts.CONTACTS_WIDTH;
      this._vertDividerContacts.minX = left + MyContacts.CONTACTS_MIN_WIDTH;
      this._vertDividerContacts.maxX = left + MyContacts.CONTACTS_MAX_WIDTH;
      this._vertDividerContacts.style.left = (parseInt(this._divCanvas.style.left) - MyContacts.DIVIDER_HIDE_BUFFER) + "px";
      this._divContacts.style.width = (parseInt(this._vertDividerContacts.style.left) - left) + "px";
    };
    this._vertDividerGroups.onDragDivider = this._vertDividerGroups.onDragResetEndDivider;
    
    this.renderGroups();
    this._contactsPaginator.render();
    this._noCardSelected();
		return true;
	};
	// }}}
  
  // {{{ onResizeEnd
	/**
	 * this method is called when a window resize event is ended. this includes  
   * after a maximize and restore has occurred. return value is ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access public
	 * @return void
	 */
	this.onResizeEnd = function(height, width) {
		setTimeout('MyContacts._currentInstance._contactsPaginator.refresh()', 10);
    this.onFocus();
	};
	// }}}
  
  // {{{ print
  /**
   * used to print the current selected card
   * @access public
   * @return void
   */
  this.print = function() {
    if (this._contactId) { OS.print(MyContacts.SERVICE_PRINT, null, { 'contactId': this._contactId }); }
  };
  // }}}
  
	// {{{ reload
	/**
	 * reloads MyContacts by first reloading the address book and then reloading 
   * the contacts list and displayed contact
   * @param int loadGroupId if a new group should be loaded after the reload 
   * is complete, this parameter may be used to specify the id of that group
   * @param boolean skipUser whether or not to skip reloading the current 
   * selected contact
   * @access public
	 * @return void
	 */
  this.reload = function(loadGroupId, skipContact) {
    // remove current group drop targets
    if (this._groupDropTargets) {
      for(i in this._groupDropTargets) {
        OS.dragAndDrop.removeDropTarget(document.getElementById(this._groupDropTargets[i]));
      }
      this._groupDropTargets = null;
    }
    this._setWaitMsg(this._divGroupsList, this._plugin.getString('MyContacts.loadingGroups'));
    this.win.setStatusBarText(this._plugin.getString('MyContacts.loadingGroups'));
    loadGroupId = loadGroupId ? loadGroupId : this._groupId;
    this._groupId = null;
    OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_ADDRESS_BOOK, this, '_loadAddressBook', null, null, null, loadGroupId);
    this._setWaitMsg(this._divContactsList, this._plugin.getString('MyContacts.loadingContacts'));
    if (!skipContact && this._contactId) { this.reloadContact(); }
  };
  // }}}
  
	// {{{ reloadContact
	/**
	 * reloads the contact
   * @access public
	 * @return void
	 */
  this.reloadContact = function() {
    if (this._contactId) {
      this.loadContact(this._contactId, true);
    }
  };
  // }}}
  
	// {{{ removeContactFromGroup
	/**
	 * removes the current selected contact from the current selected group
   * @access public
	 * @return void
	 */
  this.removeContactFromGroup = function() {
    if (this._contactId && this._groupId) {
      this.win.setStatusBarText(this._plugin.getString('MyContacts.removingContactFromGroup'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_CONTACT_GROUPS, this, '_removeContactFromGroup', null, new SRAOS_AjaxRequestObj(this._groupId, { 'contacts_remove': this._contactId }));
    }
  };
  // }}}
  
	// {{{ removeAttribute
	/**
	 * used to remove a cardinal attribute (names, phones, emails, etc)
   * @param Object img the remove image that was clicked
   * @param int id the attribute primary key (applies to existing records only)
   * @access public
	 * @return boolean
	 */
	this.removeAttribute = function(img, id) {
    var attr = this._getCardinalityAttributeName(img);
		var row = this._getRow(img);
    if (row && attr) {
      row.parentNode.deleteRow(row.sectionRowIndex);
      if (id) {
        this._dirty = true;
        var remove = document.createElement('input');
        remove.setAttribute('name', attr + '_' + id + '_remove');
        remove.setAttribute('value', '1');
        remove.setAttribute('type', 'hidden');
        this.win.getElementById('contactRemove').appendChild(remove);
      }
      this._addMissingAttributes(attr);
      this._adjustAddLinks(attr);
      var rows = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'nodeName': 'tr' }, true, false, null, SRAOS_Util.GET_DOM_ELEMENTS_DOWN_NO_RECURSE);
      if (rows && rows.length > 1) {
        SRAOS_Util.focusFirstField(rows[rows.length-2], ['input', 'textarea', 'select']);
      }
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
	// {{{ renderGroups
	/**
	 * renders the groups div
   * @param boolean skipLoadGroup whether or not to skip loading a group if no 
   * active groups are detected after rendering the list
   * @access public
	 * @return void
	 */
  this.renderGroups = function(skipLoadGroup) {
    var html = '<div id="' + this.win.getDivId() + 'groups" onclick="MyContacts._currentInstance.loadGroup()"';
    html += !this._groupId ? ' class="selected"' : '';
    html += ' style="background-image: url(' + this._plugin.getIconUri(16, 'my-contacts.png') + ')">' + this._plugin.getString('MyContacts.allGroups') + '</div>\n';
    var groupSelected = !this._groupId;
    if (OS.user.addressBook.getAllGroupsHash) {
      this._groupDropTargets = new Array();
      for(var i in OS.user.addressBook.getAllGroupsHash) {
        var id = this.win.getDivId() + 'groups' + i;
        html += '<div id="' + id + '" onclick="MyContacts._currentInstance.loadGroup(' + i + ')"';
        html += !OS.user.addressBook.getAllGroupsHash[i].isSubscription ? ' ondblclick="MyContacts._currentInstance.editGroup()"' : '';
        html += this._groupId == i ? ' class="selected"' : '';
        html += (OS.user.addressBook.getAllGroupsHash[i].gid || OS.user.addressBook.getAllGroupsHash[i].isSubscription ? ' style="background-image: url(' + (OS.user.addressBook.getAllGroupsHash[i].gid ? OS.getIconUri(16, 'accounts.png') : this._plugin.getIconUri(16, 'contacts-subscription.png')) + ')"' : '');
        html += '>' + OS.user.addressBook.getAllGroupsHash[i].name + '</div>\n';
        if (this._groupId == i) { groupSelected = true; }
        if (!OS.user.addressBook.getAllGroupsHash[i].isReadOnly) { this._groupDropTargets.push(id); }
      }
    }
    this._divGroupsList.innerHTML = html;
    if (!skipLoadGroup && !groupSelected) { this.loadGroup(); }
    
    // add new group drop targets
    if (OS.user.addressBook.getAllGroupsHash) {
      for(var i in OS.user.addressBook.getAllGroupsHash) {
        if (!OS.user.addressBook.getAllGroupsHash[i].isReadOnly) { OS.dragAndDrop.addDropTarget(new MyContactsGroupDropTarget(OS.user.addressBook.getAllGroupsHash[i]), this.win.getElementById('groups' + i), new Array(MyContactsCardDragTarget), 'dropHover', 0, this.win.getElementById("myContactsNameHeader").offsetHeight*-1); }
      }
    }
  };
  // }}}
  
	// {{{ refreshMenu
	/**
	 * enables/disables buttons in the application window based on the current 
   * status
   * @access public
	 * @return void
	 */
  this.refreshMenu = function() {
    var group = this._groupId ? OS.user.addressBook.getAllGroupsHash[this._groupId] : null;
    this.win[this._contactId && !this._contactReadOnly && !this._editMode ? 'enableMenuItem' : 'disableMenuItem']('editContact');
    this.win[this._contactId && !this._contactReadOnly ? 'enableMenuItem' : 'disableMenuItem']('deleteContact');
    this.win[this._contactId ? 'enableMenuItem' : 'disableMenuItem']('myContactsPrint');
    this.win[this._contactId ? 'enableButton' : 'disableButton']('myContactsPrintBtn');
    this.win[group && !group.isSubscription ? 'enableMenuItem' : 'disableMenuItem']('editContactGroup');
    this.win[group && !group.isReadOnly && this._contactId ? 'enableMenuItem' : 'disableMenuItem']('removeContactFromGroup');
    this.win[group && !group.isSubscription && !group.isReadOnly ? 'enableMenuItem' : 'disableMenuItem']('deleteContactGroup');
    this.win[group && group.isSubscription ? 'enableMenuItem' : 'disableMenuItem']('unsubscribeFromContactGroup');
  };
  // }}}
  
  // {{{ save
  /**
   * saves the current contact
   * @access public
   * @return void
   */
  this.save = function() {
    if (this._editMode) {
      this.win.syncWait(this._plugin.getString('MyContacts.saving'));
      var skip = { 'id': [ /_blank/ ], 'name': /Tmp/ };
      var attrRows = SRAOS_Util.getDomElements(this._divContact, { 'id': [ /_existingAttr/, /_newAttr/ ] });
      for(var i in attrRows) {
        if (!SRAOS_Util.isDirty(attrRows[i])) { skip['id'].push(attrRows[i].id); }
      }
      var values = SRAOS_Util.getFormValues(this._divContact, skip);
      
      var attrs = [];
      if (SRAOS_Util.getDomElements(this._divContact, { 'nodeName': 'input', 'name': 'picture' })) { attrs.push(new SRAOS_AjaxServiceParam('picture', null, SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE)); }
      
      for(var i in values) {
        attrs.push(new SRAOS_AjaxServiceParam(i, values[i]));
      }
      OS.ajaxInvokeService(MyContacts.SERVICE_UPDATE_CONTACTS, this, '_save', null, new SRAOS_AjaxRequestObj(this._contactId, attrs), null, null, null, null, null, null, null, this._newValidator);
    }
  };
  // }}}
  
  // {{{ search
  /**
   * prompts the user for a search string and performs the search
   * @access public
   * @return void
   */
  this.search = function() {
    this._searchStr = SRAOS_Util.trim(this._fieldSearch.value);
    this.loadContacts();
  };
  // }}}
  
	// {{{ showSearch
	/**
	 * shows the search div. returns true on success, false otherwise
   * @access public
	 * @return boolean
	 */
	this.showSearch = function() {
    if (this._divSearch.style.visibility != 'inherit') {
      this._divSearch.style.visibility = 'inherit';
      this._divSearch.style.position = 'static';
      this._fieldSearch.focus();
      this._fieldSearch.select();
      this.win.disableButton('myContactsSearchBtn');
      this.win.disableMenuItem('myContactsSearch');
      this._divContactsList.style.height = (parseInt(this._divContactsList.style.height) - this._divSearch.offsetHeight) + "px";
      this._contactsPaginator.refresh();
      return true;
    }
    else {
      return false;
    }
	};
	// }}}
  
	// {{{ showTabs
	/**
	 * displays the contact div tabs
   * @access public
	 * @return void
	 */
	this.showTabs = function() {
    this._divContactTabs.style.height = 'auto';
    this._divContactTabs.style.position = 'static';
    this._divContactTabs.style.visibility = 'inherit';
	};
	// }}}
  
  // {{{ subscribeToGroup
  /**
   * displays the contact groups that the user can subscribe to
   * @access public
   * @return void
   */
  this.subscribeToGroup = function() {
    this.win.getAppInstance().launchWindow('MyContactsAddSubscription');
  };
  // }}}
  
  // {{{ tabActivated
  /**
   * SRAOS_TabSet callback for the contact tab
   * @param String id the id of the tab that has been activated
   * @access public
   * @return void
   */
  this.tabActivated = function(id) {
    this._activeTab = id;
    if (!this._tabsLoaded[id]) {
      this._setWaitMsg(this.win.getElementById(this._contactTabDivs[id]));
      this.win.setStatusBarText(this._plugin.getString('MyContacts.loadingTab', { 'tab': id }));
      OS.ajaxInvokeService(MyContacts.SERVICE_GET_CONTACT_VIEW, this, '_loadTab', null, null, { 'contactId': this._contactId, '_edit_': this._editMode, '_view_': id }, id);
    }
    else if (this._editMode && id == this._plugin.getString('Contact')) {
      this._focusFirstContactField();
    }
    this.onFocus();
  };
  // }}}
  
	// {{{ toggleColumns
	/**
	 * toggles the columns displayed
   * @access public
	 * @return void
	 */
	this.toggleColumns = function() {
    this._columnsDisplayed ? this.hideColumns() : this.displayColumns();
	};
	// }}}
  
	// {{{ toggleEditMode
	/**
	 * toggles between edit and view-only mode for a contact
   * @param boolean skipDirtyCheck whether or not to skip the dirty check
   * @access public
	 * @return void
	 */
	this.toggleEditMode = function(skipDirtyCheck) {
    this._editMode = !this._editMode;
    skipDirtyCheck = skipDirtyCheck ? skipDirtyCheck : this._editMode;
    this.refreshMenu();
    this.loadContact(this._contactId, true, skipDirtyCheck);
	};
	// }}}
  
  // {{{ toggleNameCompany
  /**
   * toggles a name from company to non-company
   * @param object cb the company checkbox that was clicked
   * @access public
   * @return void
   */
  this.toggleNameCompany = function(cb) {
    var parent = SRAOS_Util.getDomElements(SRAOS_Util.getDomElements(cb, { 'nodeName': 'td' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP), { 'nodeName': 'span' }, true, false, 1);
    if (parent) {
      this._addId(parent);
      var values = SRAOS_Util.getFormValues(parent);
      var msg = this._plugin.getString('MyContacts.updatingName');
      this._setWaitMsg(parent, msg, !SRAOS_Util.endsWith(parent.id, 'name_view'));
      this.win.setStatusBarText(msg);
      
      if (!SRAOS_Util.endsWith(parent.id, 'name_view')) { values['_attribute_'] = 'otherNames'; }
      values['_view_'] = !SRAOS_Util.endsWith(parent.id, 'name_view') ? 'fields' : 'input-name';
      // update missing picture image
      if (SRAOS_Util.endsWith(parent.id, 'name_view')) {
        var img = SRAOS_Util.getDomElements(this._divContact, { 'src': null }, true, false, 1);
        if (SRAOS_Util.endsWith(img.src,  values['company'] == '1' ? MyContacts.MISSING_PICTURE : MyContacts.MISSING_PICTURE_COMPANY)) {
          img.src = values['company'] == '1' ? MyContacts.MISSING_PICTURE_COMPANY : MyContacts.MISSING_PICTURE;
        }
      }
      
      OS.ajaxInvokeService(MyContacts.SERVICE_GET_CONTACT_ATTRIBUTE_VIEW, this, '_loadContactAttributeView', null, null, values, parent.id);
    }
  };
  // }}}
  
  // {{{ unsubscribeFromGroup
  /**
   * unsubscribes the user from the selected subscribed-to contact group
   * @access public
   * @return void
   */
  this.unsubscribeFromGroup = function() {
    if (this._groupId && OS.user.addressBook.getAllGroupsHash[this._groupId].isSubscription) {
      this.win.setStatusBarText(this._plugin.getString('MyContacts.unsubscribing'));
      OS.ajaxInvokeService(MyContacts.SERVICE_MANAGE_ADDRESS_BOOK, this, '_unsubscribe', null, new SRAOS_AjaxRequestObj(OS.user.addressBook.addressBookId, { 'subscriptions_remove': this._groupId }));
    }
  };
  // }}}
  
	// {{{ updateAddressCountry
	/**
	 * updates the format of an address for the selected contact based on an 
   * updated country selection
   * @param Object field the field where the country was changed
   * @access public
	 * @return void
	 */
  this.updateAddressCountry = function(field) {
    var parent = SRAOS_Util.getDomElements(SRAOS_Util.getDomElements(field, { 'nodeName': 'td' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP), { 'nodeName': 'div' }, true, false, 1);
    if (parent) {
      this._addId(parent);
      var values = SRAOS_Util.getFormValues(parent);
      var msg = this._plugin.getString('MyContacts.updatingAddress');
      this._setWaitMsg(parent, msg);
      this.win.setStatusBarText(msg);
      values['_attribute_'] = 'addresses';
      values['_view_'] = 'form';
       
      OS.ajaxInvokeService(MyContacts.SERVICE_GET_CONTACT_ATTRIBUTE_VIEW, this, '_loadContactAttributeView', null, null, values, parent.id);
    }
  };
  // }}}
  
	// {{{ updateTypeLabel
	/**
	 * updates the type label when the user selects the "custom" option
   * @param Object field the field that the option was selected in
   * @param String value the value that was selected (not used)
   * @param String text the option label (this value will be displayed)
   * @access public
	 * @return void
	 */
  this.updateTypeLabel = function(field, value, text) {
    var span = SRAOS_Util.getDomElements(SRAOS_Util.getDomElements(field, { 'nodeName': 'span' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP), { 'nodeName': 'span' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_RIGHT);
    if (span) {
      span.className = 'editModeSelector';
      span.innerHTML = text;
    }
  };
  // }}}
  
  // {{{ viewMyCard
  /**
   * displays the user's card
   * @access public
   * @return void
   */
  this.viewMyCard = function() {
    this.loadContact(OS.user.addressBook.getUserContact.contactId);
  };
  // }}}
  
  
  // private methods
  
	// {{{ _addContactToGroup
	/**
	 * handles ajax invocation response to add a contact to a group
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._addContactToGroup = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToAddContactToGroup'), response);
    }
    else if (response.requestId == this._contactId) {
      this.reloadContact();
    }
  };
  // }}}
  
	// {{{ _addId
	/**
	 * adds a unique 'id' attribute to 'element' if it does not already have one. 
   * returns true if the id was added, false otherwise
   * @param Object element the element to add the id to
   * @param String suffix an optional id suffix
   * @access private
	 * @return boolean
	 */
	this._addId = function(element, suffix) {
    if (element && !element.id) {
      var id = this.win.getDivId() + SRAOS_Util.randomInt(100000, 1000000) + (suffix ? suffix : '');
      if (this.win.getElementById(id)) {
        return this._addId(element);
      }
      else {
        element.id = id;
      }
    }
    else {
      return false;
    }
  };
  // }}}
  
	// {{{ _addMissingAttributes
	/**
	 * checks if there is at least 1 form row for 'attr'. if there is none, a new 
   * row will be added
   * @param String attr the name of the attribute to check. if not specified, 
   * all cardinal attributes will be checked
   * @access private
	 * @return boolean
	 */
	this._addMissingAttributes = function(attr) {
    if (!attr) {
      var attrs = this._getCardinalityAttributes();
      for(var i in attrs) {
        this._addMissingAttributes(attrs[i]);
      }
    }
    else {
      var nextRow = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'nodeName': 'tr' }, true, false, 1);
      if (nextRow && nextRow.style && nextRow.style.display == 'none') {
        this.addAttribute(attr);
        return true;
      }
    }
    return false;
  };
  // }}}
  
	// {{{ _adjustAddLinks
	/**
	 * hides all of the 'add' links for 'attr' so that only the last add link is 
   * displayed
   * @param String attr the name of the attribute to check. if not specified, 
   * all cardinal attributes will be checked
   * @access private
	 * @return void
	 */
	this._adjustAddLinks = function(attr) {
    if (!attr) {
      var attrs = this._getCardinalityAttributes();
      for(var i in attrs) {
        this._adjustAddLinks(attrs[i]);
      }
    }
    else {
      var cols = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' });
      for(var i=0; i<cols.length-1; i++) {
        SRAOS_Util.getDomElements(cols[i], { 'nodeName': 'img', 'alt': OS.getString('form.add') }, true, false, 1).style.display = i == (cols.length - 2) && (!this._maxCardinality || !this._maxCardinality[attr] || ((i+1) < this._maxCardinality[attr])) ? 'inline' : 'none';
      }
    }
  };
  // }}}
  
	// {{{ _contactsListParams
	/**
	 * params callback for the ajax contact list paginator
   * @param String id not used
   * @param Object contact the contact to add to the contact list
   * @access private
	 * @return SRAOS_AjaxServiceParam[]
	 */
	this._contactsListParams = function() {
    var params = new Array(new SRAOS_AjaxServiceParam('attr', 'list'));
    if (this._groupId) { params.push(new SRAOS_AjaxServiceParam('groupId', this._groupId)); }
    if (this._divSearch.style.visibility != 'hidden' && SRAOS_Util.trim(this._fieldSearch.value) != '' && this._fieldSearch.value != this._plugin.getString('MyContacts.search')) {
      params.push(new SRAOS_AjaxServiceParam('search', SRAOS_Util.trim(this._fieldSearch.value)));
    }
    return params;
  };
  // }}}
  
	// {{{ _contactListPostRender
	/**
	 * post render callback for the ajax contact list paginator
   * @param String id not used
   * @param Array contact the contacts that were rendered
   * @access private
	 * @return void
	 */
	this._contactListPostRender = function(id, contacts) {
    for(var i in contacts) {
      OS.dragAndDrop.addDragObject(new MyContactsCardDragTarget(contacts[i]), this.win.getElementById('_contact' + contacts[i].contactId));
    }
  };
  // }}}
  
	// {{{ _contactsListRelease
	/**
	 * release callback for the ajax contact list paginator
   * @param String id not used
   * @param Object contact the contact to add to the contact list
   * @access private
	 * @return void
	 */
	this._contactsListRelease = function() {
    this.win.clearStatusBarText();
  };
  // }}}
  
	// {{{ _contactsListRender
	/**
	 * render item callback for the ajax contact list paginator
   * @param String id not used
   * @param Object contact the contact to add to the contact list
   * @access private
	 * @return String
	 */
	this._contactsListRender = function(id, contact) {
    var myCard = contact.contactId == OS.user.addressBook.getUserContact.contactId;
    var div = '<div id="' + this.win.getDivId() + '_contact' + contact.contactId + '"';
    div += contact.isCompany || myCard ? 'style="background-image: url(' + this._plugin.getIconUri(16, myCard ? 'my-card.png' : 'contact-company.png') + ')"' : '';
    div += ' class="' + (contact.contactId == this._contactId ? 'myContactCardSelected' : 'myContactCard') + '"';
    div += ' onclick="MyContacts._currentInstance.loadContact(' + contact.contactId + ')">' + contact.label + '</div>';
    return div;
  };
  // }}}
  
	// {{{ _contactsListWait
	/**
	 * wait callback for the ajax contact list paginator
   * @param String id not used
   * @param Object contact the contact to add to the contact list
   * @access private
	 * @return void
	 */
	this._contactsListWait = function() {
    this.win.setStatusBarText(this._plugin.getString('MyContacts.loadingContacts'));
  };
  // }}}
  
	// {{{ _deleteContact
	/**
	 * handles ajax invocation response to deleting a contact
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deleteContact = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToDeleteContact'), response);
    }
    else {
      this.loadContact();
      this.loadContacts();
    }
  };
  // }}}
  
	// {{{ _deleteGroup
	/**
	 * handles ajax invocation response to deleting a group
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deleteGroup = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsGroup.error.unableToDeleteGroup'), response);
    }
    else {
      this.reload();
    }
  };
  // }}}
  
  // {{{ _focusFirstContactField
  /**
   * focused the first text field in the contact table
   * @access public
   * @return boolean
   */
  this._focusFirstContactField = function() {
    return SRAOS_Util.focusFirstField(this._divContact, 'input', { 'type': [null, 'text'] });
  };
  // }}}
  
	// {{{ _getCardinalityAttributeName
	/**
	 * returns the name of the cardinality attribute that 'component' resides in
   * @param Object component an element within the attribute form row
   * @access private
	 * @return String
	 */
	this._getCardinalityAttributeName = function(component) {
    var tbody = this._getCardinalityAttributeBody(component);
    var matches = tbody && tbody.id ? tbody.id.match(MyContacts.CARDINALITY_TBODY_REGEX) : null;
    return matches ? matches[1].substr(this.win.getDivId().length) : null;
  };
  // }}}
  
	// {{{ _getCardinalityAttributeBody
	/**
	 * returns spacer row for the cardinality attribute that 'component' resides 
   * in
   * @param Object component an element within the attribute form row
   * @access private
	 * @return String
	 */
	this._getCardinalityAttributeBody = function(component) {
    return SRAOS_Util.getDomElements(component, MyContacts.CARDINALITY_TBODY_MATCH, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
  };
  // }}}
  
	// {{{ _getCardinalityAttributes
	/**
	 * returns the names of the contact cardinality attributes (phone, email, 
   * dates, etc.) that are currently displayed on the contact form
   * @access private
	 * @return String[]
	 */
	this._getCardinalityAttributes = function() {
    if (!this._cardinalityAttrs) {
      this._cardinalityAttrs = new Array();
      var cBodies = SRAOS_Util.getDomElements(this.win.getElementById('contactTable'), MyContacts.CARDINALITY_TBODY_MATCH, true);
      for(var i in cBodies) {
        var matches = cBodies[i].id.match(MyContacts.CARDINALITY_TBODY_REGEX);
        this._cardinalityAttrs.push(matches[1].substr(this.win.getDivId().length));
      }
    }
    return this._cardinalityAttrs;
  };
  // }}}
  
	// {{{ _getRow
	/**
	 * returns the row that 'component' resides in
   * @param Object component an element within the row
   * @access private
	 * @return Object
	 */
	this._getRow = function(component) {
    return SRAOS_Util.getDomElements(component, { 'nodeName': 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
  };
  // }}}
  
	// {{{ _loadAddressBook
	/**
	 * handles ajax invocation response to reloadinig the user's address book
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadAddressBook = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results[0]) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToLoadGroups'), response);
    }
    else {
      OS.user.addressBook = response.results[0];
      this.renderGroups(response.requestId);
      if (!response.requestId || (response.requestId && !this.loadGroup(response.requestId))) {
        this.loadContacts();
      }
    }
  };
  // }}}
  
	// {{{ _loadContact
	/**
	 * handles ajax invocation response to loading a contact
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadContact = function(response) {
    if (this.win.isClosed()) { return; }
    
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      this.win.clearStatusBarText();
      this._noCardSelected();
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToLoadContact'), response);
    }
    else if (this._contactId == response.results.contactId && this._editMode && response.results.readOnly) {
      this.win.clearStatusBarText();
      this._noCardSelected();
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.noEditPermissions'));
    }
    else if (this._contactId == response.results.contactId) {
      var loadCardinalityAttrs = false;
      this.win.clearStatusBarText();
      this._contactId = response.results.contactId;
      this._contactReadOnly = response.results.readOnly;
      this._isCompany = response.results.isCompany;
      this.refreshMenu();
      if (SRAOS_Util.getLength(response.results.views) == 1) {
        this._divContactTabs.innerHTML = '';
        this.hideTabs();
        for(var i in response.results.views) {
          this._tabsLoaded[i] = true;
          this._divContact.innerHTML = SRAOS_Util.prefixIds(response.results.views[i], this.win.getDivId());
          loadCardinalityAttrs = i == this._plugin.getString('Contact');
          SRAOS_Util.extractScript(response.results.views[i], true);
        }
      }
      else {
        var html = '';
        this._contactTabDivs = new Array();
        var counter = 1;
        var labels = new Array();
        for(var i in response.results.views) {
          if (i == this._plugin.getString('Contact') && response.results.views[i]) { loadCardinalityAttrs = true; }
          labels[i] = i;
          var id = 'myContactsContact' + counter++;
          this._contactTabDivs[i] = id;
          this._tabsLoaded[i] = response.results.views[i] ? true : false;
          html += '<div id="' + this.win.getDivId() + id + '" style="position: absolute; top: 25px">' + (response.results.views[i] ? SRAOS_Util.prefixIds(response.results.views[i], this.win.getDivId()) : '') + '</div>';
        }
        this._divContact.innerHTML = html;
        SRAOS_Util.extractScript(html, true);
        this.showTabs();
        
        var tabs = new Array();
        var activeTab = null;
        for(var i in this._contactTabDivs) {
          var div = this.win.getElementById(this._contactTabDivs[i]);
          tabs.push(new SRAOS_Tab(i, labels[i], div, false, false, true));
          if (i == this._activeTab) { activeTab = this._activeTab; }
        }
        this._contactTabSet = new SRAOS_TabSet(tabs, this._divContactTabs, activeTab, this);
        this._removeHorzScroll();
      }
      // edit/save/cancel links
      this._divControls.innerHTML = this._contactReadOnly ? '' : '<a href="#" onclick="MyContacts._currentInstance.' + (this._editMode ? 'save' : 'edit') + '()">' + OS.getString(this._editMode ? 'text.save' : 'text.edit').toLowerCase() + "</a> " + (this._editMode ? '<a href="#" onclick="MyContacts._currentInstance.cancelEdit()" style="font-weight:normal">' + OS.getString('form.cancel').toLowerCase() + '</a>' : '');
      if (this._editMode && loadCardinalityAttrs) {
        var attrRows = SRAOS_Util.getDomElements(this._divContact, { 'id': [ /_existingAttr/ ] });
        for(var i in attrRows) {
          SRAOS_Util.setDirtyFlags(attrRows[i]);
        }
        this._cardinalityAttrs = null;
        if (!this._addMissingAttributes()) { 
          this._adjustAddLinks();
          this._focusFirstContactField();
        }
      }
      if (this._editMode) {
        if (SRAOS_Util.getLength(response.results.views) == 1) {
          this.win.setDirtyFlags();
        }
        else {
          for(var i in response.results.views) {
            if (response.results.views[i]) { SRAOS_Util.setDirtyFlags(this.win.getElementById(this._contactTabDivs[i])); }
          }
        }
      }
    }
  };
  // }}}
  
	// {{{ _loadContactAttributeView
	/**
	 * handles ajax invocation response to updating a contact attribute view
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadContactAttributeView = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToLoadContactAttributeView'), response);
    }
    else {
      var parent = document.getElementById(response.requestId);
      // update positioning for otherNames
      parent.innerHTML = response.results;
      SRAOS_Util.extractScript(response.results, true);
      var row = SRAOS_Util.getDomElements(parent, { 'nodeName': 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
      if (row.id.match(/otherNames_/)) {
        var div = SRAOS_Util.getDomElements(parent, { 'nodeName': 'div', 'style': null }, true, false, 1);
        div.style.position = 'static';
        div.style.visibility = 'inherit';
      }
    }
  };
  // }}}
  
	// {{{ _loadTab
	/**
	 * handles ajax invocation response to loading a contact view tab
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadTab = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results.views) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToLoadTab'), response);
    }
    else if (response.results.contactId == this._contactId && this.win.getElementById(this._contactTabDivs[response.requestId])) { 
      
      this._tabsLoaded[response.requestId] = true;
      this.win.getElementById(this._contactTabDivs[response.requestId]).innerHTML = SRAOS_Util.prefixIds(response.results.views[response.requestId], this.win.getDivId());
      this._removeHorzScroll();
      if (this._editMode) { 
        SRAOS_Util.setDirtyFlags(this.win.getElementById(this._contactTabDivs[response.requestId]));
        if (response.requestId == this._plugin.getString('Contact')) {
          this._cardinalityAttrs = null;
          this._addMissingAttributes();
          this._adjustAddLinks();
          this._focusFirstContactField();
        }
      }
    }
  };
  // }}}
  
	// {{{ _noCardSelected
	/**
	 * displays the "No Card Selected" message in the contact panel
   * @access private
	 * @return void
	 */
  this._noCardSelected = function() {
    this._divContact.innerHTML = '<div class="myContactsNoContact">' + this._plugin.getString('MyContacts.noCardSelected') + '</div>';
  };
  // }}}
  
	// {{{ _removeContactFromGroup
	/**
	 * handles ajax invocation response to removing a contact from a group
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._removeContactFromGroup = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToRemoveContactFromGroup'), response);
    }
    else {
      this.reloadContact();
      this.loadContacts();
    }
  };
  // }}}
  
	// {{{ _removeHorzScroll
	/**
	 * removes any unnecessary horizontal scrollbars in the contact view panel
   * @access private
	 * @return void
	 */
  this._removeHorzScroll = function() {
    this._divCanvas.style.overflowX = (this._divCanvas.scrollWidth-this._divCanvas.clientWidth) <= MyContacts.HORZ_SCROLL_REMOVE_BUFFER ? 'hidden' : 'auto';
  };
  // }}}
  
	// {{{ _save
	/**
	 * handles ajax invocation response to saving a card
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._save = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToSave'), response);
    }
    else {
      // invoke callback
      if (!this._contactId && this._newCbMethod && this._newCbTarget && this._newCbTarget[this._newCbMethod]) {
        this._newCbTarget[this._newCbMethod](response.results[0]);
      }
      // focus callback window
      if (!this._contactId && this._newFocus) {
        var win = OS.getWindowInstance(this._newFocus);
        if (win.getAppInstance()) {
          OS.focusApp(win.getAppInstance());
        }
        else {
          OS.focus(win);
        }
      }
      // close MyContacts
      if (!this._contactId && this._newClose) {
        OS.terminateAppInstance(this.win.getAppInstance());
      }
      else {
        this._newCbMethod = null;
        this._newCbTarget = null;
        this._newClose = null;
        this._newFocus = null;
        this._newValidator = null;
        
        this._editMode = false;
        this.loadContact(response.results[0].contactId, true, true);
        this.loadContacts();
      }
    }
  };
  // }}}
  
  // {{{ _setWaitMsg
  /**
   * sets a wait message/image in the div specified
   * @param Object div the div to set the wait message to
   * @param String msg the wait message to display. if not specified, the 
   * default "loading..." message will be displayed
   * @param boolean useSpan whether or not to use a span instead a div
   * @access public
   * @return void
   */
  this._setWaitMsg = function(div, msg, useSpan) {
    var tag = useSpan ? 'span' : 'div';
    div.innerHTML = '<' + tag + ' class="myContactsWait" style="background-image: url(' + OS.getWaitImgUri() + ')">' + (msg ? msg : OS.getString('text.wait')) + '</' + tag + '>';
  };
  // }}}
  
	// {{{ _unsubscribe
	/**
	 * handles ajax invocation response to unsubscribing from a group
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._unsubscribe = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContactsGroup.error.unableToUnsubscribe'), response);
    }
    else {
      this.reload();
    }
  };
  // }}}
  
};


// constants
/**
 * the height of individual cards in the card list
 * @type int
 */
MyContacts.CARD_HEIGHT = 22;

/**
 * the regular expression to use to match the id of cardinality tbody elements
 * @type RegExp
 */
MyContacts.CARDINALITY_TBODY_REGEX = new RegExp("^(.*)_body$");

/**
 * the match constraints to use to find a cardinality tbody elements
 * @type Object
 */
MyContacts.CARDINALITY_TBODY_MATCH = { 'nodeName': 'tbody', 'id': MyContacts.CARDINALITY_TBODY_REGEX };

/**
 * the # of contact list paginator buffer pages
 * @type int
 */
MyContacts.CONTACTS_LIST_PAGINATOR_BUFFER = 1;

/**
 * the max width of the contacts div
 * @type int
 */
MyContacts.CONTACTS_MAX_WIDTH = 275;

/**
 * the min width of the contacts div
 * @type int
 */
MyContacts.CONTACTS_MIN_WIDTH = 125;

/**
 * the width of the contacts div
 * @type int
 */
MyContacts.CONTACTS_WIDTH = 175;

/**
 * the max width of the groups div
 * @type int
 */
MyContacts.DIVIDER_HIDE_BUFFER = 2;

/**
 * the max width of the groups div
 * @type int
 */
MyContacts.GROUPS_MAX_WIDTH = 180;

/**
 * the min width of the groups div
 * @type int
 */
MyContacts.GROUPS_MIN_WIDTH = 80;

/**
 * the width of the groups div
 * @type int
 */
MyContacts.GROUPS_WIDTH = 130;

/**
 * the max threshold for removing the horizontal scrolling in the contact div
 * @type int
 */
MyContacts.HORZ_SCROLL_REMOVE_BUFFER = 20;

/**
 * the uri to the missing picture to use for non-company contacts
 * @type String
 */
MyContacts.MISSING_PICTURE = '/images/no-picture.jpg';

/**
 * the uri to the missing picture to use for company contacts
 * @type String
 */
MyContacts.MISSING_PICTURE_COMPANY = 'plugins/accessories/images/no-picture-company.jpg';

/**
 * the max # of results for the region lookup
 * @type int
 */
MyContacts.REGION_LOOKUP_LIMIT = 10;

/**
 * the name of the global ajax service for retrieving address field options
 * @type String
 */
MyContacts.SERVICE_GET_ADDRESS_FIELD_OPTIONS = 'myContactsGetAddressFieldOptions';

/**
 * the name of the global ajax service for retrieving a contact attribute view
 * @type String
 */
MyContacts.SERVICE_GET_CONTACT_ATTRIBUTE_VIEW = 'myContactsGetContactAttributeView';

/**
 * the name of the global ajax service for retrieving a contact view
 * @type String
 */
MyContacts.SERVICE_GET_CONTACT_VIEW = 'myContactsGetContactView';

/**
 * the name of the ajax service for retrieving/updating the user's address book
 * @type String
 */
MyContacts.SERVICE_MANAGE_ADDRESS_BOOK = 'manageAddressBook';

/**
 * the name of the ajax service for updating contact groups
 * @type String
 */
MyContacts.SERVICE_MANAGE_CONTACT_GROUPS = 'manageContactGroups';

/**
 * the name of the ajax service for printing a card
 * @type String
 */
MyContacts.SERVICE_PRINT = 'myContactsPrintContact';

/**
 * the name of the ajax service for retrieving contacts
 * @type String
 */
MyContacts.SERVICE_RETRIEVE_CONTACTS = 'retrieveContacts';

/**
 * the name of the ajax service for updating contacts
 * @type String
 */
MyContacts.SERVICE_UPDATE_CONTACTS = 'updateContacts';

/**
 * the name of the global ajax service for searching contacts
 * @type String
 */
MyContacts.SERVICE_SEARCH = 'myContactsSearchContacts';


// static methods and attributes

/**
 * if MyContacts is currently running, a reference to this manager class will 
 * be stored in this static variable
 * @type MyContacts
 */
MyContacts._currentInstance;

// {{{ createContact
/**
 * launches MyContacts (if it is not already opened) and displays the new 
 * new contact form based on the parameters specified. once the new contact is 
 * created, the focus will be set back to 'focus'
 * @param string cbMethod all callback method with the following signature:
 * cbMethod(Contact : contact) : void
 * this method will ONLY be invoked if the contact is created successfully
 * @param Object cbTarget the object containing the 'cbMethod' to invoke
 * @param mixed attrs has of initial attributes to set for this new contact
 * @param String validator an optional validator to invoke prior to creating the 
 * contact. if that validator fails, the corresponding error message will be 
 * displayed
 * @param SRAOS_WindowInstance the window to focus after the new contact is 
 * created. if not specified, the current focused window will be used. if you 
 * do not want to re-focus that window, set this parameter to -1
 * @param boolean close whether or not to close MyContacts after the contact is 
 * created (if it is launched as part of this invocation)
 * @access public
 * @return void
 */
MyContacts.createContact = function(cbMethod, cbTarget, attrs, validator, focus, close) {
  focus = focus == -1 ? null : (focus ? focus : OS.getFocusedWin());
  close = close && !MyContacts._currentInstance;
  // start MyContacts if it is not already running
  if (!MyContacts._currentInstance) { OS.launchApplication('accessories', 'MyContacts'); }
  
  setTimeout('OS.focus(MyContacts._currentInstance.win)', 10);
  MyContacts._currentInstance.newContact(attrs, cbMethod, cbTarget, validator, focus, close);
};
// }}}

// {{{ displayContact
/**
 * launches MyContacts (if it is not already opened) and displays the contact 
 * specified by contactId
 * @param int contactId the id of the contact to display
 * @access public
 * @return void
 */
MyContacts.displayContact = function(contactId) {
  // start MyContacts if it is not already running
  if (!MyContacts._currentInstance) { OS.launchApplication('accessories', 'MyContacts'); }
  
  setTimeout('OS.focus(MyContacts._currentInstance.win)', 10);
  MyContacts._currentInstance.loadContact(contactId && contactId.contactId ? contactId.contactId : contactId);
};
// }}}

// {{{ displayGroup
/**
 * launches MyContacts (if it is not already opened) and displays the group 
 * specified by groupId
 * @param int groupId the id of the group to display
 * @access public
 * @return void
 */
MyContacts.displayGroup = function(groupId) {
  // start MyContacts if it is not already running
  if (!MyContacts._currentInstance) { OS.launchApplication('accessories', 'MyContacts'); }
  
  setTimeout('OS.focus(MyContacts._currentInstance.win)', 10);
  MyContacts._currentInstance.loadGroup(groupId);
};
// }}}

// {{{ getCurrentInstance
/**
 * returns a reference to the current instance of MyContacts IF it is currently 
 * running
 * @access public
 * @return MyContacts
 */
MyContacts.getCurrentInstance = function() {
  return MyContacts._currentInstance;
};
// }}}

// {{{ renderCard
/**
 * callback method for rendering a card within the OS search results window
 * @param String id not used
 * @param Object contact the contact to render
 * @access public
 * @return String
 */
MyContacts.renderCard = function(id, contact) {
  var myCard = contact.contactId == OS.user.addressBook.getUserContact.contactId;
  return '<div class="myContactCard"' + (contact.isCompany || myCard ? 'style="background-image: url(' + OS.getPlugin('accessories').getIconUri(16, myCard ? 'my-card.png' : 'contact-company.png') + ')"' : '') + '>' + contact.getContactLabel + '</div>';
};
// }}}

// }}}



// {{{
/**
 * wrapper class for cards displayed in the contacts list. used for drag and 
 * drop functionality
 */
MyContactsCardDragTarget = function(card) {
  /**
   * the card that this wrapper object represents
   * @type Object
   */
  this._card = card;
  
  // {{{ getCard
  /**
   * getter for this._card
   * @access public
	 * @return Object
	 */
  this.getCard = function() {
    return this._card;
  };
  // }}}
  
  // {{{ getDescription
  /**
   * returns the contact description
   * @access public
	 * @return String
	 */
  this.getDescription = function() {
    return this._card.label;
  };
  // }}}
  
  // {{{ getIcon
  /**
   * returns the contact icon uri
   * @access public
	 * @return String
	 */
  this.getIcon = function() {
    if (!this._card.icon) { this._card.icon = OS.getPlugin('accessories').getIconUri(16, this._card.contactId == OS.user.addressBook.getUserContact.contactId ? 'my-card.png' : (this._card.isCompany ? 'contact-company.png' : 'contact.png')); }
    return this._card.icon;
  };
  // }}}
  
  // {{{ getType
  /**
   * returns the type of this object
   * @access public
	 * @return Class
	 */
  this.getType = function() {
    return MyContactsCardDragTarget;
  };
  // }}}
};
// }}}



// {{{
/**
 * wrapper class for MyContacts groups. used for drag and drop functionality
 */
MyContactsGroupDropTarget = function(group) {
  /**
   * the group that this wrapper object represents
   * @type Object
   */
  this._group = group;
  
  // {{{ onDrop
  /**
   * returns the contact description
   * @access public
	 * @return void
	 */
  this.onDrop = function(contact) {
    if (MyContacts._currentInstance) { MyContacts._currentInstance.addContactToGroup(contact.getCard().contactId, this._group.groupId); }
  };
  // }}}
};
// }}}
