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
 * used to manage the projects permissions form
 * @param Object available select field containing the available participants
 * @param Object current select field containing the current participants
 * @param Array permissionFields the permissions checkboxes
 * @param Object addLink the form area containing the "Add" link
 * @param Object removeLink the form area containing the "Remove" link
 * @param Object updateLink the form area containing the "Update" link
 * @param Object currentLabel the span containing the current # of participants 
 * @param Object sendIntroEmailField reference to the send email intro checkbox
 * label
 */
MyProjectsPermissionsForm = function(available, current, permissionFields, addLink, removeLink, updateLink, currentLabel, sendIntroEmailField) {
  
  /**
   * the permissions allowed for an email participant
   * @type int
   */
  MyProjectsPermissionsForm.EMAIL_PARTICIPANT_MAX_PERMISSIONS = MyProjects.PERMISSIONS_MESSAGE_WRITE | MyProjects.PERMISSIONS_TASK_WRITE;

  // add link click events
  addLink.permissionsForm = this;
  removeLink.permissionsForm = this;
  updateLink.permissionsForm = this;
  
  // {{{ attributes
  
  /**
   * select field containing the available participants
   * @type Object
   */
  this._available = available;
  
  /**
   * the base email participants for this permissions form
   * @type Array
   */
  this._baseEmailParticipants;
  
  /**
   * the base participants for this permissions form
   * @type Array
   */
  this._baseParticipants;
  
  /**
   * select field containing the current participants
   * @type Object
   */
  this._current = current;
  this._current.permissionsForm = this;
  
  /**
   * the span containing the current # of participants
   * @type Object
   */
  this._currentLabel = currentLabel;
  
  /**
   * the permissions checkboxes
   * @type Array
   */
  this._permissionFields = permissionFields;
  for(var i in this._permissionFields) {
    this._permissionFields[i].permissionsForm = this;
  }
  
  /**
   * reference to the send email intro checkbox
   * @type Object
   */
  this._sendIntroEmailField = sendIntroEmailField;
  
  // }}}
  

  // {{{ addParticipant
  /**
   * this method adds a new participant to the permissions form (from available 
   * to current). the parameters for this method invocations are used to 
   * manually add a participant
   * @param int id the id for the participant
   * @param boolean permissions the permissions for the participant
   * @param boolean isGroup whether or not this is a group participant
   * @param boolean sendIntroEmail whether or not to send the intro email
   * @access public
   * @return void
   */
  this.addParticipant = function(id, permissions, isGroup) {
    if (id || permissions || isGroup) {
      var key = (isGroup ? 'gid:' : '') + id;
      var oldPermissions = this.getPermissions();
      for(var i in this._available.options) {
        if (this._available.options[i] && this._available.options[i].value == key) {
          this.updatePermissionFields(permissions);
          this._available.selectedIndex = i;
          this._sendIntroEmailField.checked = false;
          this.addParticipant();
          break;
        }
      }
      this.updatePermissionFields(oldPermissions);
      this._sendIntroEmailField.checked = true;
    }
    else {
      var plugin = OS.getPlugin('productivity');
      var permissions = this.getPermissions();
      if (this._available.selectedIndex == 0) {
        OS.displayErrorMessage(plugin.getString('MyProjects.error.selectParticipant'));
      }
      else if (!permissions) {
        OS.displayErrorMessage(plugin.getString('MyProjects.error.selectPermissions'));
      }
      else {
        var id = SRAOS_Util.getSelectValue(this._available);
        if (id == MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID) {
          if ((permissions & (MyProjectsPermissionsForm.EMAIL_PARTICIPANT_MAX_PERMISSIONS)) != permissions) {
            OS.displayErrorMessage(plugin.getString('MyProjects.error.emailParticipantPermissions'));
          }
          else {
            OS.getWindowInstance(this._available).getAppInstance().launchWindow('EmailParticipant', { callback: this, permissions: permissions });
          }
        }
        else {
          var newId = id + '|' + permissions + '|' + (this._sendIntroEmailField.checked ? '1' : '0');
          SRAOS_Util.addOptionToSelectField(this._current, new Option(SRAOS_Util.getSelectValue(this._available, false, true), newId));
          SRAOS_Util.removeOptionFromSelectField(this._available, id);
          this._available.selectedIndex = 0;
          SRAOS_Util.setSelectValue(this._current, newId);
          this.updateCurrentCount();
        }
      }
    }
    this.selectParticipant();
  };
  // }}}
  
  
  // {{{ addEmailParticipant
  /**
   * callback from the add email participant window
   * @param String email the email address of the participant (validated)
   * @param String name the name of the participant (optional)
   * @param int permissions the permissions to grant
   * @param String password the password for this email participant (if new)
   * @param boolean noSendIntro ignore the sendIntroEmailField (set to true 
   * when adding base email participants)
   * @access public
   * @return Object
   */
  this.addEmailParticipant = function(email, name, permissions, password, noSendIntro) {
    var newId = MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID + email + '|' + (name ? name : '') + '|' + permissions + '|' + (password ? password : '') + '|' + (!noSendIntro && this._sendIntroEmailField.checked ? '1' : '0');
    SRAOS_Util.addOptionToSelectField(this._current, new Option(name && email ? name + ' [' + email + ']' : email, newId));
    SRAOS_Util.setSelectValue(this._current, newId);
    this.updateCurrentCount();
    this.updatePermissionFields(permissions);
  };
  // }}}
  
  
  // {{{ getAjaxAttrs
  /**
   * returns the permissions ajax attributes for this form or null if no changes 
   * have been made
   * @access public
   * @return Object
   */
  this.getAjaxAttrs = function() {
    var attrs = new Array();
    var ids = new Array();
    var curEmailId = this._getMaxBaseEmailParticipantId();
    var curId = this._getMaxBaseParticipantId();
    for (var i=1; i<this._current.length; i++) {
      var participant = this._current.options[i].value.split('|');
      var isEmail = SRAOS_Util.beginsWith(participant[0], MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID);
      var id = isEmail ? participant[0].substr(MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID.length) : (participant[0].indexOf('gid:') != -1 ? participant[0].split(":")[1] : participant[0]);
      var isGroup = participant[0].indexOf('gid:') != -1;
      var name = isEmail && participant[1] && participant[1].length ? participant[1] : null;
      var permissions = (isEmail ? participant[2] : participant[1]) * 1;
      var sendIntroEmail = (isEmail ? participant[4] : participant[2]) == '1';
      ids.push(isEmail ? id : id + '_' + isGroup);
      var baseParticipant = isEmail ? this._getBaseEmailParticipant(id) : this._getBaseParticipant(id, isGroup);
      if (!baseParticipant || (permissions != baseParticipant.permissions) || sendIntroEmail == 1) {
        var key = (isEmail ? 'emailParticipants_' : 'participants_') + (isEmail ? curEmailId++ : curId++) + '_';
        if (isEmail) {
          if (id && id.length) { attrs[key + 'email'] = id; }
          if (name && name.length) { attrs[key + 'name'] = name; }
          if (participant[3] && participant[3].length) { attrs[key + 'password'] = participant[3]; }
        }
        else {
          attrs[key + 'id'] = id;
          attrs[key + 'isGroup'] = isGroup;
        }
        if (baseParticipant) {
          attrs[key + 'participantId'] = baseParticipant.participantId;
        }
        attrs[key + 'permissions'] = permissions;
        attrs[key + 'sendIntroEmail'] = sendIntroEmail == 1;
      }
    }
    if (this._baseEmailParticipants) {
      // check for removed participants
      for(var i in this._baseEmailParticipants) {
        if (!SRAOS_Util.inArray(this._baseEmailParticipants[i].email, ids)) {
          attrs['emailParticipants_' + this._baseEmailParticipants[i].participantId + '_remove'] = 1;
        }
      }
    }
    if (this._baseParticipants) {
      // check for removed participants
      for(var i in this._baseParticipants) {
        if (!SRAOS_Util.inArray(this._baseParticipants[i].id + '_' + this._baseParticipants[i].isGroup, ids)) {
          attrs['participants_' + this._baseParticipants[i].participantId + '_remove'] = 1;
        }
      }
    }
    return SRAOS_Util.getLength(attrs) > 0 ? attrs : null;
  };
  // }}}
  
  
  // {{{ getPermissions
  /**
   * returns the current selected permissions bitmask value
   * @access public
   * @return int
   */
  this.getPermissions = function() {
    var permissions = 0;
    for(var i in this._permissionFields) {
      i *= 1;
      if (this._permissionFields[i].checked) { permissions = permissions | i; }
    }
    return permissions;
  };
  // }}}
  
  
  // {{{ removeParticipant
  /**
   * this method removes a participant from the permissions form (from current 
   * back to available)
   * @access public
   * @return void
   */
  this.removeParticipant = function() {
    var plugin = OS.getPlugin('productivity');
    if (this._current.selectedIndex == 0) {
      OS.displayErrorMessage(plugin.getString('MyProjects.error.selectParticipant'));
    }
    else {
      var id = SRAOS_Util.getSelectValue(this._current);
      var newId = id.split('|')[0];
      if (!SRAOS_Util.beginsWith(newId, MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID)) {
        SRAOS_Util.addOptionToSelectField(this._available, new Option(SRAOS_Util.getSelectValue(this._current, false, true), newId));
        SRAOS_Util.setSelectValue(this._available, newId);
      }
      SRAOS_Util.removeOptionFromSelectField(this._current, id);
      this._current.selectedIndex = this._current.length - 1;
      this.updateCurrentCount();
      this.selectParticipant();
    }
  };
  // }}}
  
  
  // {{{ selectParticipant
  /**
   * changes the displayed permissions to match those of the selected
   * @access public
   * @return void
   */
  this.selectParticipant = function() {
    if (this._current.selectedIndex > 0) {
      var tmp = SRAOS_Util.getSelectValue(this._current).split('|');
      this.updatePermissionFields((SRAOS_Util.beginsWith(tmp[0], MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID) ? tmp[2] : tmp[1]) * 1);
    }
  };
  // }}}
  
  
  // {{{ setBaseEmailParticipants
  /**
   * sets the base emailparticipants for this instance of the participant form. 
   * this information is used to determine the participants that should be 
   * updated removed, and added when getAjaxAttrs is invoked. additionally, 
   * these participants are automatically set to the current participants 
   * selector
   * @access public
   * @return void
   */
  this.setBaseEmailParticipants = function(participants) {
    if (participants) {
      for(var i in participants) {
        this.addEmailParticipant(participants[i].email, participants[i].name, participants[i].permissions, participants[i].password, true);
      }
      this._baseEmailParticipants = participants;
    }
  };
  // }}}
  
  
  // {{{ setBaseParticipants
  /**
   * sets the base participants for this instance of the participant form. this 
   * information is used to determine the participants that should be updated
   * removed, and added when getAjaxAttrs is invoked. additionally, these 
   * participants are automatically set to the current participants selector
   * @access public
   * @return void
   */
  this.setBaseParticipants = function(participants) {
    if (participants) {
      for(var i in participants) {
        this.addParticipant(participants[i].id, participants[i].permissions, participants[i].isGroup);
      }
      this._baseParticipants = participants;
    }
  };
  // }}}
  
  
  // {{{ updateCurrentCount
  /**
   * updates the current participants count in the count label of the form
   * @access public
   * @return void
   */
  this.updateCurrentCount = function() {
    if (this._currentLabel) { 
      this._currentLabel.innerHTML = this._current.length - 1; 
    }
  };
  // }}}
  
  
  // {{{ updateParticipant
  /**
   * updates the permissions of the selected participant
   * @access public
   * @return void
   */
  this.updateParticipant = function() {
    var plugin = OS.getPlugin('productivity');
    var permissions = this.getPermissions();
    if (!permissions) {
      OS.displayErrorMessage(plugin.getString('MyProjects.error.selectPermissions'));
    }
    else if (this._current.selectedIndex > 0) {
      var tmp =this._current.options[this._current.selectedIndex].value.split('|');
      var isEmail = SRAOS_Util.beginsWith(tmp[0], MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID);
      if (isEmail && (permissions & MyProjectsPermissionsForm.EMAIL_PARTICIPANT_MAX_PERMISSIONS) != permissions) {
        OS.displayErrorMessage(plugin.getString('MyProjects.error.emailParticipantPermissions'));
      }
      else {
        tmp[isEmail ? 2 : 1] = permissions;
        tmp[isEmail ? 4 : 2] = this._sendIntroEmailField.checked ? '1' : '0';
        this._current.options[this._current.selectedIndex].value = tmp.join('|');
      }
    }
  };
  // }}}
  
  
  // {{{ updatePermissionFields
  /**
   * updates the permissions fields based on the current selection 
   * (enables/disables/unchecks irrelevant checkboxes)
   * @param int set the value to set (optional)
   * @access public
   * @return void
   */
  this.updatePermissionFields = function(set) {
    if (set) { set *= 1; }
    for(var i in MyProjects.PERMISSIONS) {
      i *= 1;
      this._permissionFields[i].disabled = false;
      if (set) { this._permissionFields[i].checked = (i & set) == i ? true : false; }
      for(var n in MyProjects.PERMISSIONS) {
        n *= 1;
        if (n >= i) { continue; }
        if (n & i && ((i != 255 && i != 511) || this._permissionFields[i].checked)) {
          if (this._permissionFields[i].checked) { this._permissionFields[n].checked = false; }
          this._permissionFields[n].disabled = this._permissionFields[i].checked;
        }
      }
    }
  };
  // }}}
  
  
  // {{{ _getBaseEmailParticipant
  /**
   * checks in this._baseEmailParticipants for a participant with the same email
   * returns null if no base email participant exists with that email
   * @param String email the email of the base participant to return
   * @access public
   * @return Object
   */
  this._getBaseEmailParticipant = function(email) {
    if (this._baseEmailParticipants) {
      for(var i in this._baseEmailParticipants) {
        if (this._baseEmailParticipants[i].email == email) {
          return this._baseEmailParticipants[i];
        }
      }
    }
    return null;
  };
  // }}}
  
  
  // {{{ _getBaseParticipant
  /**
   * checks in this._baseParticipants for a participant with the same id as 
   * specified. returns null if no base participant exists with that id
   * @param int id the id of the participant to check for
   * @param boolean isGroup whether or not id is for a group
   * @access public
   * @return Object
   */
  this._getBaseParticipant = function(id, isGroup) {
    if (this._baseParticipants) {
      for(var i in this._baseParticipants) {
        if (this._baseParticipants[i].id == id && ((isGroup && this._baseParticipants[i].isGroup) || (!isGroup && !this._baseParticipants[i].isGroup))) {
          return this._baseParticipants[i];
        }
      }
    }
    return null;
  };
  // }}}
  
  
  // {{{ _getMaxBaseEmailParticipantId
  /**
   * returns the max email participant id
   * @access public
   * @return int
   */
  this._getMaxBaseEmailParticipantId = function() {
    var max = -1;
    if (this._baseEmailParticipants) {
      for(var i in this._baseEmailParticipants) {
        if (this._baseEmailParticipants[i].participantId > max) { max = this._baseEmailParticipants[i].participantId; }
      }
    }
    return max + 1;
  };
  // }}}
  
  
  // {{{ _getMaxBaseParticipantId
  /**
   * returns the max participant id
   * @access public
   * @return int
   */
  this._getMaxBaseParticipantId = function() {
    var max = -1;
    if (this._baseParticipants) {
      for(var i in this._baseParticipants) {
        if (this._baseParticipants[i].participantId > max) { max = this._baseParticipants[i].participantId; }
      }
    }
    return max + 1;
  };
  // }}}
  
  
  this.updateCurrentCount();

};


/**
 * identifier for the email participant option
 * @type String
 */
MyProjectsPermissionsForm.EMAIL_PARTICIPANT_ID = '[email]';


// }}}
