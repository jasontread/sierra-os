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
 * window manager for the imbedded contact popup window and other supporting 
 * javascript functionality. this window may be initialized using the 
 * following parameters:
 * 
 * contactId:        the id of the contact this window is being opened for (not 
 *                   specified for new contacts)
 * attribute:        MANDATORY: the attribute in entity where this contact is 
 *                   stored
 * attributeLabel:   MANDATORY: the attribute label
 * cardinality:      a hash of fixed cardinality constraints for this contact
 * cardinalityTypes: a hash of fixed cardinality types for this contact
 * container:        reference to the div containing the imbedded contact view
 * display:          the display parse string. if not specified, the
 *                   'getContactLabel()' method will be used
 * edit:             whether or not to display the contact in edit mode. default 
 *                   is false when 'contactId' is specified, true always when it 
 *                   is not
 * entity:           MANDATORY: the entity that this contact will be associated
 *                   to
 * entityLabel:      MANDATORY: the entity label
 * entityId:         MANDATORY: the primary key of the 'entity'
 * fieldName:        the name of the field this window was opened for
 * fields:           a space separated list of attribute names corresponding to 
 *                   the fields that should be displayed in the window. the 
 *                   user will NOT be able to view or enter values for fields 
 *                   that are not included in this list
 * hasCardinality:   whether or not attribute has cardinality
 * init:             a hash of contact attributes/values to automatically set 
 *                   (for new contacts only)
 * validate:         an optional contact validation constraint to trigger when 
 *                   creating or updating this contact. when this validation 
 *                   constraint fails, the corresponding 'resource' will be 
 *                   displayed to the user using an error popup dialog
 * viewOnly:         when true, the 'edit' link will not be available
 */
ImbeddedContact = function() {
  
  /**
   * a reference to the MyContacts window manager instance if it was running 
   * when this window was opened
   * @type MyContacts
   */
  this.myContactsManager;
  
  /**
   * whether or not the imbedded attribute view that opened this contact should 
   * be updated by adding a new contact to it when the card view is loaded
   * @type boolean
   */
  this._addContactNext;
  
  /**
   * a reference to the save button
   * @type Object
   */
  this._btnSave;
  
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
   * a reference to the canvas div
   * @type Object
   */
  this._divCanvas;
  
  /**
   * a reference to the contact card div
   * @type Object
   */
  this._divContact;
  
  /**
   * whether or not the card is currently in edit mode
   * @type boolean
   */
  this._editMode;
  
  /**
   * whether or not the window has been initialized
   * @type boolean
   */
  this._initialized;
  
  /**
   * true when the selected contact is a company
   * @type boolean
   */
  this._isCompany;
  
  /**
   * a reference to the edit link
   * @type Object
   */
  this._linkEdit;
  
  /**
   * a reference to the MyContacts object that this object extends
   * @type MyContacts
   */
  this._myContacts;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * whether or not the label of imbedded attribute view that opened this 
   * contact should be updated when the card view is loaded
   * @type boolean
   */
  this._updateContactNext;
  
  
	// {{{ getCard
	/**
	 * invokes the ajax method for retrieving the card view
   * @param boolean toggleEdit whether or not to toggle the edit mode
   * @access private
	 * @return void
	 */
  this.getCard = function(toggleEdit) {
    if (!toggleEdit || !this.isDirty() || OS.confirm(this._plugin.getString('MyContacts.cancelEditConfirm'))) {
      if (toggleEdit) { this._editMode = !this._editMode; }
      
      var params = !this._contactId && this.params['init'] ? this.params['init'] : {};
      params['contactId'] = this._contactId;
      params['imbedded'] = true;
      params['_edit_'] = this._editMode;
      params['_excludeGroups_'] = true;
      if (this.params['display']) { params['_label_'] = this.params['display']; }
      if (this.params['fields']) { params['_fields_'] = this.params['fields']; }
      
      this.win.syncWait(this._plugin.getString('MyContacts.loadingContact'));
      OS.ajaxInvokeService(MyContacts.SERVICE_GET_CONTACT_VIEW, this, '_loadContact', null, null, params);
    }
  };
  // }}}
  
	// {{{ isDirty
	/**
	 * returns TRUE if the contact window is in edit mode and currently dirty
   * @access public
	 * @return boolean
	 */
	this.isDirty = function() {
    return this._editMode && this.win.isDirty();
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
    if (force || !this.isDirty() || OS.confirm(this._plugin.getString('MyContacts.cancelEditConfirm'))) {
      MyContacts._currentInstance = this.myContactsManager;
      return true;
    }
    else {
      return false;
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
   * @access  public
	 * @return boolean
	 */
	this.onOpen = function(height, width) {
    this._plugin = this.win.getPlugin();
    this._contactId = this.params['contactId'];
    this._divCanvas = this.win.getElementById('Canvas');
    this._divContact = this.win.getElementById('imbeddedContact');
    this._linkEdit = this.win.getElementById('imbeddedContactEdit');
    this._btnSave = this.win.getElementById('imbeddedContactSave');
    
    // partially extend MyContacts window manager
    this._newValidator = this.params['validate'];
    this._myContacts = new MyContacts();
    this.addAjaxRegionLookup= this._myContacts.addAjaxRegionLookup;
    this.addAttribute= this._myContacts.addAttribute;
    this.getAddressField= this._myContacts.getAddressField;
    this.getAddressFields= this._myContacts.getAddressFields;
    this.getAjaxTipsParams= this._myContacts.getAjaxTipsParams;
    this.isCompany= this._myContacts.isCompany;
    this.print= this._myContacts.print;
    this.removeAttribute= this._myContacts.removeAttribute;
    this.save1= this._myContacts.save;
    this.toggleNameCompany= this._myContacts.toggleNameCompany;
    this.updateAddressCountry= this._myContacts.updateAddressCountry;
    this.updateTypeLabel= this._myContacts.updateTypeLabel;
    this._addId= this._myContacts._addId;
    this._addMissingAttributes= this._myContacts._addMissingAttributes;
    this._adjustAddLinks= this._myContacts._adjustAddLinks;
    this._focusFirstContactField= this._myContacts._focusFirstContactField;
    this._getCardinalityAttributeName= this._myContacts._getCardinalityAttributeName;
    this._getCardinalityAttributeBody= this._myContacts._getCardinalityAttributeBody;
    this._getCardinalityAttributes= this._myContacts._getCardinalityAttributes;
    this._getRow= this._myContacts._getRow;
    this._loadContactAttributeView= this._myContacts._loadContactAttributeView;
    this._setWaitMsg= this._myContacts._setWaitMsg;
    this.myContactsManager = MyContacts._currentInstance;
    MyContacts._currentInstance = this;
    
    // fixed cardinality
    if (this.params['cardinality'] && !this.params['_cardinalityAdjusted']) {
      for(var attr in this.params['cardinality']) {
        if (!this.params['cardinality'][attr]) { this.params['cardinality'][attr] = ImbeddedContact.DEFAULT_FIXED_CARDINALITY; }
        var min = this.params['cardinality'][attr].split('..')[0];
        var max = this.params['cardinality'][attr].split('..')[1];
        this.params['cardinality'][attr] = { 'min': min, 'max': max };
      }
    }
    this.params['_cardinalityAdjusted'] = true;
    this.win.setTitleText(this.params.attributeLabel);
    this._editMode = this.params['edit'] || !this._contactId;
    this.getCard();
		return true;
	};
	// }}}
  
  // {{{ save
  /**
   * saves the current contact
   * @access public
   * @return void
   */
  this.save = function() {
    var errorMsg = '';
    // check for fixed cardinality errors
    if (this.params['cardinality']) {
      for(var attr in this.params['cardinality']) {
        if (this.params['cardinality'][attr].min > 0) {
          // get attribute rows
          var rows = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'nodeName': 'tr' });
          for(var i=0; i<this.params['cardinality'][attr].min; i++) {
            var field, entity;
            if (attr == 'dates') {
              field = 'date';
              entity = 'ContactDate';
            }
            else if (attr == 'emails') {
              field = 'email';
              entity = 'ContactEmail';
            }
            else if (attr == 'imIds') {
              field = 'id';
              entity = 'ContactImId';
            }
            else if (attr == 'phones') {
              field = 'number';
              entity = 'ContactPhone';
            }
            if (field) {
              var input;
              var fields = SRAOS_Util.getDomElements(rows[i], { 'nodeName': 'input' });
              for(var n in fields) {
                if (SRAOS_Util.endsWith(fields[n].name, field)) { 
                  input = fields[n]; 
                  break;
                }
              }
              if (input && SRAOS_Util.trim(input.value) == '') {
                errorMsg += OS.getString('error.required', null, { 'attr': this._plugin.getString(entity + '.' + field) }) + '\n';
              }
            }
          }
        }
      }
    }
    if (errorMsg == '') {
      this.save1();
    }
    else {
      OS.displayErrorMessage(errorMsg);
    }
  };
  // }}}
  
  
	// {{{ _associate
	/**
	 * handles ajax invocation response to associating a new imbedded contact
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._associate = function(response) {
    if (this.win.isClosed()) { return; }
    
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results) {
      OS.closeWindow(this.win, true);
      OS.ajaxInvokeService(MyContacts.SERVICE_UPDATE_CONTACTS, this, '_save', null, new SRAOS_AjaxRequestObj(this._contactId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToSave'), response);
    }
    else {
      this.getCard();
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
    var label = this._plugin.getString('Contact');
    
    this.win.syncFree();
    if (!response.results.views[label] || response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyContacts.error.unableToLoadContact'), response);
      OS.closeWindow(this.win, true);
    }
    else {
      this._contactReadOnly = response.results.readOnly;
      this._isCompany = response.results.isCompany;
      
      SRAOS_Util.extractScript(response.results.views[label], true);
      this._divContact.innerHTML = SRAOS_Util.prefixIds(response.results.views[label], this.win.getDivId());
      this._linkEdit.style.display = !this._contactId || this.params['viewOnly'] || this._contactReadOnly ? 'none' : 'inline';
      this._linkEdit.style.fontWeight = this._editMode ? 'normal' : 'bold';
      this._linkEdit.innerHTML = OS.getString(!this._editMode ? 'text.edit' : 'form.cancel').toLowerCase();
      this._btnSave.style.display = !this._editMode ? 'none' : 'inline';
      if (!this._initialized) { 
        this.win.getDomElements({ className: 'imbeddedContactButtons' })[0].style.display = 'block'; 
      }
      if (this._editMode) {
        this._addMissingAttributes();
        
        // fixed cardinality
        if (this.params['cardinality']) {
          this._maxCardinality = new Array();
          for(var attr in this.params['cardinality']) {
            var cols = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' });
            if (this.params['cardinality'][attr].min > 1) {
              var add = SRAOS_Util.getDomElements(cols[0], { 'nodeName': 'img', 'alt': OS.getString('form.add') }, true, false, 1);
              for(var i=1; i<this.params['cardinality'][attr].min; i++) { add.onclick(); }
              cols = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' });
            }
            for(var i=0; i<cols.length-1; i++) {
              if (i < this.params['cardinality'][attr].min) {
                SRAOS_Util.getDomElements(cols[i], { 'nodeName': 'img', 'alt': OS.getString('form.remove') }, true, false, 1).style.display = 'none';
              }
            }
            if (this.params['cardinality'][attr].max != '*') {
              this._maxCardinality[attr] = this.params['cardinality'][attr].max;
            }
          }
        }
        // fixed cardinality types
        if (this.params['cardinalityTypes']) {
          this._fixedCardinalityTypes = new Array();
          for(var attr in this.params['cardinalityTypes']) {
            // get type columns
            var cols = SRAOS_Util.getDomElements(this.win.getElementById(attr + '_body'), { 'className': 'contactCardinalityCol' });
            for(var i in cols) {
              cols[i] = SRAOS_Util.getDomElements(cols[i], { 'nodeName': 'td' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_RIGHT);
            }
            
            var types = this.params['cardinalityTypes'][attr].split(' ');
            this._fixedCardinalityTypes[attr] = types;
            for(var i in types) {
              var select = SRAOS_Util.getDomElements(cols[i], { 'nodeName': 'select' }, true, false, 1);
              if (SRAOS_Util.beginsWith(select.name, attr)) {
                if (!this._contactId) {
                  var original = select.options[select.selectedIndex].value;
                  var found = false;
                  for(var n in select.options) {
                    if (select.options[n].value == types[i]) {
                      select.selectedIndex = n;
                      found = true;
                      break;
                    }
                  }
                  if (!found) {
                    var idx = select.options.length - 1;
                    select.selectedIndex = idx;
                    select.options[idx].value = types[i];
                    select.options[idx].text = types[i];
                  }
                  this.updateTypeLabel(select, select.options[select.selectedIndex].value, select.options[select.selectedIndex].text);
                }
                select.disabled = true;
              }
            }
          }
        }
        this._cardinalityAttrs = null;
        this._adjustAddLinks();
        this._focusFirstContactField();
        
        var attrRows = SRAOS_Util.getDomElements(this._divContact, { 'id': [ /_existingAttr/ ] });
        for(var i in attrRows) {
          SRAOS_Util.setDirtyFlags(attrRows[i]);
        }
        this.win.setDirtyFlags();
      }
      this.win[this._contactId ? 'enableButton' : 'disableButton']('imbeddedContactPrintBtn');
      
      this._initialized = true;
      this._divCanvas.style.overflowX = 'hidden';
      
      // add imbedded contact attribute
      if (this._addContactNext) {
        var div = document.createElement('div');
        div._icParams = this.params;
        div._icParams['contactId'] = this._contactId;
        div.setAttribute('style', 'margin-bottom: 3px');
        div.innerHTML = '<img alt="' + OS.getString('form.remove') + '" onclick="ImbeddedContact.remove(this, \'' + this.params['fieldName'] + '\', ' + this._contactId + ', ' + (this.params['hasCardinality'] ? 'true' : 'false') + ')" src="plugins/accessories/images/remove.png" style="float: left; margin-right: 3px;" title="' + OS.getString('form.remove') + '" /><a href="#" onclick="OS.launchWindow(\'accessories\', \'ImbeddedContact\', this.parentNode._icParams)">' + response.results.label + '</a>';
        this.params['container'].parentNode.insertBefore(div, this.params['container']);
      }
      // update imbedded contact attribute
      else if (this._updateContactNext) {
        this.params['container'].innerHTML = response.results.label;
      }
      this.win.getElementById('Canvas').scrollTop = 0;
    }
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
      if (!this._contactId) {
        this.win.syncWait(this._plugin.getString('MyContacts.saving'));
        OS.ajaxInvokeService(ImbeddedContact.ASSOCIATE_SEARCH, this, '_associate', null, null, { 'contactId': response.results[0].contactId, 'entity': this.params['entity'], 'entityId': this.params['entityId'], 'attribute': this.params['attribute'] });
        this._addContactNext = true;
      }
      else {
        this._updateContactNext = true;
      }
      this._contactId = response.results[0].contactId;
      this._editMode = false;
      if (this._updateContactNext) { this.getCard(); }
    }
  };
  // }}}
};


/**
 * the name of the global ajax service for associating a new imbedded contact to 
 * an entity/attribute
 * @type String
 */
ImbeddedContact.ASSOCIATE_SEARCH = 'myContactsAssociateImbedded';

/**
 * the default fixed cardinality
 * @type String
 */
ImbeddedContact.DEFAULT_FIXED_CARDINALITY = '1..1';


// {{{ remove
/**
 * removes an imbedded contact
 * @param HTMLImage img the remove image that was clicked
 * @param int contactId the contact id
 * @param boolean cardinality whether or not cardinality exists
 * @access private
 * @return void
 */
ImbeddedContact.remove = function(img, fieldName, contactId, cardinality) {
  img.parentNode.innerHTML='<input name="' + fieldName + '_' + (cardinality ? contactId + '_' : '') + 'remove" type="hidden" value="1" />';
};
// }}}

// }}}
