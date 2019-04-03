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
 * MyProjectsEditFile window manager. this window may be opened with the 
 * following params:
 * 
 *   file:       the file hash returned from MyProjects.SERVICE_GET_FILES
 * 
 *   fileId:     the id of the file this window was opened for. the properties 
 *               of this file will be accessed using 
 *               MyProjects.SERVICE_GET_FILES
 * 
 *   projectIds: the ids of the projects that the user may select from in the 
 *               project/category selector (required if 'properties' is not 
 *               true)
 * 
 *   properties: set this parameter to true if you only want the properties tab 
 *               to be displayed
 * 
 *   taskId:     if this file should be associated to a task, the id of that 
 *               task
 * 
 * If neither 'file' nor 'fileId' parameters are specified, it will be assumed 
 * that the window was opened for a new file
 */
MyProjectsEditFile = function() {
  
  /**
   * the id of the current change restriction participant
   * @type int
   */
  this._changeRestriction;
  
  /**
   * a reference to the span containing the change restriction label
   * @type Object
   */
  this._changeRestrictionLabel;
  
  /**
   * used to store the change restrictions on a per-project basis
   * @type Array
   */
  this._changeRestrictions = new Array();
  
  /**
   * the current project id selected
   * @type int
   */
  this._currentProjectId = null;
  
  /**
   * a reference to the file name field
   * @type Object
   */
  this._fieldFileName;
  
  /**
   * a reference to the revision type selector field
   * @type Object
   */
  this._fieldRevisionType;
  
  /**
   * a reference to the versioning selector field
   * @type Object
   */
  this._fieldVersioning;
  
  /**
   * the file that this window was opened for (if it was not opened for a new 
   * file
   * @type Object
   */
  this._file;
  
  /**
   * a reference to the project selector field
   * @type Object
   */
  this._projectField;
  
  /**
   * the tasks currently selected on a per-project basis
   * @type Array
   */
  this._projectTaskIds = new Array();
  
  /**
   * a reference to the task selector field
   * @type Object
   */
  this._taskField;
  
  
	// {{{ clearChangeRestriction
	/**
	 * clears the current change restriction
   * @access public
	 * @return void
	 */
	this.clearChangeRestriction = function() {
    this._changeRestrictions[this.getProjectId()] = null;
    this._renderChangeRestriction();
	};
	// }}}
  
	// {{{ delete
	/**
	 * deletes an existing file
   * @access public
	 * @return void
	 */
	this.deleteFile = function() {
    if (this._file && OS.confirm(this.plugin.getString('MyProjects.fileDeleteConfirm'))) {
      this.win.syncWait(this.plugin.getString('MyProjects.deletingFile', { name: this._file.name }));
      OS.ajaxInvokeService(MyProjects.SERVICE_FILE, this, '_deleteFile', null, new SRAOS_AjaxRequestObj(this._file.fileId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
  };
  // }}}
  
	// {{{ deleteVersion
	/**
	 * deletes a file version
   * @param int versionId the id of the version to delete
   * @param string link the link that was clicked
   * @access public
	 * @return void
	 */
	this.deleteVersion = function(versionId, link) {
    var cell = SRAOS_Util.getDomElements(link, { nodeName: 'td' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
    var row = SRAOS_Util.getDomElements(link, { nodeName: 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
    cell.innerHTML = '<input name="versions_' + versionId + '_remove" type="hidden" value="1" />';
    row.style.display = 'none';
  };
  // }}}
  
	// {{{ getProjectId
	/**
	 * returns the currently selected project id
   * @access public
	 * @return int
	 */
	this.getProjectId = function() {
    var projectId = SRAOS_Util.getSelectValue(this._projectField).split(':')[0] * 1;
    return projectId ? projectId : (this._file ? this._file.projectId : null);
  };
  // }}}
  
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
  
	// {{{ loadMessage
	/**
	 * invoked when the user clicks on a message link from the properties tab
   * @param int messageId the id of the message to load
   * @access public
	 * @return void
	 */
	this.loadMessage = function(messageId) {
    if (OS.closeWindow(this.win)) {
      MyProjects.getManager().viewMessage(messageId);
    }
  };
  // }}}
  
	// {{{ loadTask
	/**
	 * invoked when the user clicks on a task link from the properties tab
   * @param int taskId the id of the task to load
   * @access public
	 * @return void
	 */
	this.loadTask = function(taskId) {
    if (OS.closeWindow(this.win)) {
      MyProjects.getManager().viewTask(taskId);
    }
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
    return force || !this.win.isDirty() || OS.confirm(this.plugin.getString('MyProjects.closeDirty'));
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
    this._changeRestrictionLabel = this.win.getElementById('myProjectFileChangeRestriction');
    this._fieldFileName = this.win.getElementById('myProjectFieldFileName');
    this._fieldRevisionType = this.win.getElementById('myProjectFieldRevisionType');
    this._fieldVersioning = this.win.getElementById('myProjectFieldVersioning');
    this._projectField = this.win.getElementById('myProjectFileProject');
    this._taskField = this.win.getElementById('myProjectFileTask');
    
    if (!this.params || !this.params.properties) {
      var tabs = new Array();
      tabs.push(new SRAOS_Tab('file', this.plugin.getString('MyProjects.file.tabFile'), this.win.getElementById('editFileTabFile')));
      tabs.push(new SRAOS_Tab('versioning', this.plugin.getString('MyProjects.file.tabVersioning'), this.win.getElementById('editFileTabVersioning')));
      tabs.push(new SRAOS_Tab('associations', this.plugin.getString('MyProjects.file.tabAssociations'), this.win.getElementById('editFileTabAssociations')));
      if (this.params.file || this.params.fileId) { tabs.push(new SRAOS_Tab('properties', this.plugin.getString('MyProjects.file.tabProperties'), this.win.getElementById('editFileTabProperties'))); }
      new SRAOS_TabSet(tabs, this.win.getElementById('editFileTabs'), null, this);
      
      if (this.params.file) {
        this._file = this.params.file;
        this.setupFile();
      }
      else if (!this.params.fileId) {
        this.win.getElementById('myProjectFileDeleteBtn').style.display = 'none';
        this.win.getElementById('myProjectFileSaveBtn').value = this.plugin.getString('MyProjects.createFile');
        this.win.setDirtyFlags();
      }
      this.win.syncWait(this.plugin.getString('MyProjects.loadingCategories'), 'initCancel', null, this.params && this.params.fileId && !this.params.file ? 2 : null);
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadFileCategories', null, null, { projectIds: this.params.projectIds, fileOnly: true });
    }
    else {
      this.win.getElementById('editFileButtons').style.display = 'none';
      this.win.getElementById('editFileCancel').style.display = 'none';
      this.win.getElementById('editFileTabs').style.display = 'none';
      this.win.getElementById('myProjectsFileHeader').style.marginTop = '0';
      var properties = this.win.getElementById('editFileTabProperties');
      properties.style.visibility = 'inherit';
      properties.style.top = '5px';
      if (this.params.file) {
        this._file = this.params.file;
        this.setupFile();
      }
      else if (this.params.fileId) {
        this.win.syncWait(this.plugin.getString('MyProjects.loadingFile'));
        OS.ajaxInvokeService(MyProjects.SERVICE_GET_FILES, this, '_load', null, null, {fileId: this.params.fileId, versions: true});
      }
    }
    return true;
  };
  // }}}
  
	// {{{ saveFile
	/**
	 * saves the file
   * @access public
	 * @return void
	 */
	this.saveFile = function() {
    // check permissions
    if (!this._validateProjectPermissions()) { return; }
    
    var addlParams = { projectId: this.getProjectId() };
    var category = SRAOS_Util.getSelectValue(this._projectField).split(':')[1];
    addlParams['category'] = category ? category : null;
    this.win.submitForm(MyProjects.SERVICE_FILE, this._file ? SRAOS_AjaxRequestObj.TYPE_UPDATE : SRAOS_AjaxRequestObj.TYPE_CREATE, this._file ? this._file.fileId : null, 'MyProjects.savingFile', 'MyProjects.error.unableToSaveFile', false, false, this, '_saveFile', addlParams);
  };
  // }}}
  
	// {{{ selectChangeRestriction
	/**
	 * shows the popup window to select the change restriction participant
   * @access public
	 * @return void
	 */
	this.selectChangeRestriction = function() {
    var projectId = this.getProjectId();
    if (projectId) {
      this.win.getAppInstance().launchWindow('ParticipantSelector', { callback: this, cbMethod: 'setChangeRestriction', permissions: MyProjects.PERMISSIONS_FILE_WRITE, projectId: projectId, skip: this._changeRestrictions[projectId] ? [this._changeRestrictions[projectId].pid] : null, types: MyProjects.PARTICIPANT_GROUP | MyProjects.PARTICIPANT_USER });
    }
	};
	// }}}
  
	// {{{ setChangeRestriction
	/**
	 * adds another subscriber
   * @param Object participant an object with the following attributes: 
   *   id:           the group or user id (for all types except 
   *                 MyProjects.PARTICIPANT_EMAIL)
   *   label:        the participant label
   *   participantId:the participant id (for all types except 
   *                 MyProjects.PARTICIPANT_CREATOR)
   *   permissions:  the participant permissions
   *   pid:          the unique identifier for this participant. 
   *                 will be one of the following values:
   *                   c[id]: id=creator uid (type=MyProjects.PARTICIPANT_CREATOR)
   *                   p[id]: id=participant id (type=MyProjects.PARTICIPANT_USER or MyProjects.PARTICIPANT_GROUP)
   *                   e[id]: id=participant id (type=MyProjects.PARTICIPANT_EMAIL)
   *                   u[id]: id=uid (type=MyProjects.PARTICIPANT_GROUP_USER)
   *   type:         the participant type. one of the MyProjects.PARTICIPANT_* 
   *                 constants. if not specified, only the 
   *                 MyProjects.PARTICIPANT_USER, MyProjects.PARTICIPANT_GROUP 
   *                 and MyProjects.PARTICIPANT_EMAIL types will be returned
   * @param int projectId the project id that this potential subscriber belongs 
   * to. if not specified, the current project id will be used
   * @access public
	 * @return void
	 */
	this.setChangeRestriction = function(participant, projectId) {
    this._changeRestriction = participant ? participant.participantId : null;
    projectId = projectId ? projectId : this.getProjectId();
    this._changeRestrictions[projectId] = participant;
    this._renderChangeRestriction();
	};
	// }}}
  
	// {{{ setupFile
	/**
	 * sets up the window/form for an existing file
   * @access public
	 * @return void
	 */
	this.setupFile = function() {
    this.win.setIcon(this._file.icon);
    this.win.setTitleText(this._file.name);
    
    // file tab
    this._fieldFileName.value = this._file.name;
    if (this._file.changeRestriction) {
      this._changeRestrictions[this._file.projectId] = this._file.changeRestriction;
      this._renderChangeRestriction();
    }
    this.win.getElementById('myProjectFieldFileReadOnly').checked = this._file.readOnlyFlag ? true : false;
    
    // versioning tab
    if (this._file.versioning) { 
      this._fieldVersioning.selectedIndex = this._file.versioning;
      this.updateVersioning();
    }
    var html = this.plugin.getString('MyProjects.file.versionsNone');
    if (this._file.versions) {
      html = '<table class="editFileVersionsTable">';
      html += '<tr>';
      html += '<th>' + this.plugin.getString('text.version') + '</th>';
      html += '<th>' + this.plugin.getString('text.name') + '</th>';
      html += '<th>' + this.plugin.getString('text.replaced') + '</th>';
      html += '</tr>';
      for(var i in this._file.versions) {
        html += '<tr>';
        html += '<td><img alt="' + OS.getString('text.delete') + '" onclick="OS.getWindowInstance(this).getManager().deleteVersion(' + this._file.versions[i].versionId + ', this)" src="plugins/productivity/images/remove.png" title="' + OS.getString('text.delete') + '" />' + this._file.versions[i].versionLabel + '</td>';
        html += '<td><a class="versionNameLink" href="' + this._file.versions[i].uri + '" style="background-image:url(' + SRAOS_Util.substituteParams(this._file.versions[i].icon, {size: '16'}) + ')" target="_blank">' + this._file.versions[i].name + '</a></td>';
        html += '<td>' + this.plugin.getString('text.lastUpdatedFullLabel', { 'date': MyProjects.getFilesDateStr(this._file.versions[i].lastUpdated), 'user': this._file.versions[i].lastUpdatedBy }) + '</td>';
        html += '</tr>';
      }
      html += '</table>';
    }
    this.win.getElementById('editFileVersions').innerHTML = html;
    
    // associations tab
    
    if (this._file.taskId) {
      this._projectTaskIds[this._file.projectId] = this._file.taskId;
    }
    
    // properties tab
    var header = this.win.getElementById('myProjectsFileHeader');
    header.style.backgroundImage = 'url(' + (this._file.icon32 ? this._file.icon32 : SRAOS_Util.substituteParams(this._file.icon, {size: '32'})) + ')';
    header.innerHTML = this._file.name;
    this.win.getElementById('myProjectsFilePropertiesSize').innerHTML = this._file.size;
    if (this._file.versioning) {
      this.win.getElementById('myProjectsFilePropertiesVersion').innerHTML = this._file.versionLabel;
    }
    else {
      this.win.getElementById('myProjectsFilePropertiesVersionRow').style.display = 'none';
    }
    this.win.getElementById('myProjectsFilePropertiesCreated').innerHTML = this.plugin.getString('text.lastUpdatedFullLabel', { 'date': MyProjects.getFilesDateStr(this._file.created), 'user': this._file.creator });
    this.win.getElementById('myProjectsFilePropertiesLastUpdated').innerHTML = this.plugin.getString('text.lastUpdatedFullLabel', { 'date': MyProjects.getFilesDateStr(this._file.lastUpdated), 'user': this._file.lastUpdatedBy });
    if (this._file.taskId) {
      this.win.getElementById('myProjectsFilePropertiesTask').innerHTML = '<a href="#" onclick="OS.getWindowInstance(this).getManager().loadTask(' + this._file.taskId + ')">' + this._file.taskTitle + '</a>';
    }
    else {
      SRAOS_Util.getDomElements(this.win.getElementById('myProjectsFilePropertiesTask'), { nodeName: 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP).style.display = 'none';
    }
    if (this._file.messageId) {
      this.win.getElementById('myProjectsFilePropertiesMessage').innerHTML = '<a href="#" onclick="OS.getWindowInstance(this).getManager().loadMessage(' + this._file.messageId + ')">' + this._file.messageTitle + '</a>';
    }
    else {
      SRAOS_Util.getDomElements(this.win.getElementById('myProjectsFilePropertiesMessage'), { nodeName: 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP).style.display = 'none';
    }
    this.win.setDirtyFlags();
  };
  // }}}
  
	// {{{ updateProjectId
	/**
	 * updates the project id based on the current selection
   * @access public
	 * @return void
	 */
	this.updateProjectId = function() {
    if (this._currentProjectId === null && this._file) {
      for(var i in this._projectField.options) {
        var ids = this._projectField.options[i].value.split(':');
        if (ids[0] == this._file.projectId && (!this._file.category || this._file.category == ids[1] || this._file.category == SRAOS_Util.trim(this._projectField.options[i].text))) {
          this._projectField.selectedIndex = i;
          break;
        }
      }
    }
    if (this.getProjectId() != this._currentProjectId) {
      if (this._currentProjectId) {
        this._projectTaskIds[this._currentProjectId] = SRAOS_Util.getSelectValue(this._taskField);
      }
      this._currentProjectId = this.getProjectId();
      if (this.params.taskId) { 
        this._projectTaskIds[this._currentProjectId] = this.params.taskId;
        this.params.taskId = null;
      }
      if (this._validateProjectPermissions()) {
        MyProjects.populateTaskSelector(this._taskField, this._currentProjectId, true, false, this._projectTaskIds[this._currentProjectId], true);
      }
      else {
        SRAOS_Util.clearSelectField(this._taskField);
      }
    }
	};
	// }}}
  
	// {{{ updateVersioning
	/**
	 * updates the revision types selector based on the versioning levels 
   * specified
   * @access public
	 * @return void
	 */
	this.updateVersioning = function() {
    SRAOS_Util.clearSelectField(this._fieldRevisionType);
    this.win.getElementById('editFileRevisionType').style.display = this._fieldVersioning.selectedIndex == 0 ? 'none' : 'block';
    var version = this._file && this._file.version ? this._file.version + '' : '0.0.0';
    var versionIds = version.split('.');
    while(versionIds.length < 3) versionIds.push('0');
    var version3 = versionIds[0] + '.' + versionIds[1] + '.' + (++versionIds[2]);
    var version2 = versionIds[0] + '.' + (++versionIds[1]) + (this._fieldVersioning.selectedIndex > 2 ? '.0' : '');
    var version1 = (++versionIds[0]) + (this._fieldVersioning.selectedIndex > 1 ? '.0' : '') + (this._fieldVersioning.selectedIndex > 2 ? '.0' : '');
    
    var options = [];
    if (this._file) options.push(new Option(this.plugin.getString('MyProjectFile.revisionType.0'), '0'));
    if (this._fieldVersioning.selectedIndex > 2) options.push(new Option(this.plugin.getString('MyProjectFile.revisionType.3', { version: version3 }), '3'));
    if (this._fieldVersioning.selectedIndex > 1) options.push(new Option(this.plugin.getString('MyProjectFile.revisionType.2', { version: version2 }), '2'));
    if (this._fieldVersioning.selectedIndex > 0) options.push(new Option(this.plugin.getString('MyProjectFile.revisionType.1', { version: version1 }), '1'));
    SRAOS_Util.addOptionsToSelectField(this._fieldRevisionType, options);
    
    this.win.getElementById('editFileVersionsDiv').style.display = !this._file || this._fieldVersioning.selectedIndex == 0 ? 'none' : 'block';
	};
	// }}}
  
  
	// {{{ _deleteFile
	/**
	 * handles ajax invocation response for deleting the file
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._deleteFile = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteFile'), response);
      }
      else {
        var myProjects = MyProjects.getManager();
        if (myProjects) {
          myProjects.refreshFiles();
          myProjects.reloadDashboardLatestActivity();
        }
        OS.closeWindow(this.win, true);
      }
    }
  };
  // }}}
  
	// {{{ _load
	/**
	 * handles ajax invocation response to loading the file
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._load = function(response) {
    if (!this.win.isClosed()) { 
      this.win.syncFree();
      if (!response.results || response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadFile'), response);
        OS.closeWindow(this.win);
      }
      else {
        this._file = response.results;
        this.setupFile();
        this.updateProjectId();
      }
    }
  };
  // }}}
  
	// {{{ _loadFileCategories
	/**
	 * handles an ajax invocation response to load file categories
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadFileCategories = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadFileCategories'), response);
        this.initCancel();
      }
      else {
        MyProjects.populateProjectListDropDown(this._projectField, false, false, response.results, MyProjects.PERMISSIONS_FILE_READ, this.params.projectIds);
        if (!this._projectField.options.length) {
          OS.displayErrorMessage(this.plugin.getString('MyProjects.error.noCreateMessagePermissions'));
          OS.closeWindow(this.win);
        }
        else {
          if (this.params && this.params.fileId && !this.params.file) {
            this.win.syncStep(this.plugin.getString('MyProjects.loadingFile'));
            OS.ajaxInvokeService(MyProjects.SERVICE_GET_FILES, this, '_load', null, null, {fileId: this.params.fileId, versions: true});
          }
          else {
            this.updateProjectId();
            this.win.syncFree();
            this.win.setDirtyFlags();
          }
        }
      }
    }
  };
  // }}}
  
	// {{{ _renderChangeRestriction
	/**
	 * renders the change restriction label
   * @access public
	 * @return void
	 */
	this._renderChangeRestriction = function() {
    var html = '<strong>' + (this._file ? this._file.creator : OS.user.name) + '</strong><br />';
    html += this._changeRestrictions[this.getProjectId()] ? '<a href="#" onclick="OS.getWindowInstance(this).getManager().clearChangeRestriction()"><img alt="' + OS.getString('form.clear') + '" src="' + this.plugin.getBaseUri() + '/images/remove.png" title="' + OS.getString('form.clear') + '" /></a><strong>' + this._changeRestrictions[this.getProjectId()].label + '</strong>' : '';
    var pid = '';
    if (this._changeRestrictions[this.getProjectId()]) {
      var pid = this._changeRestrictions[this.getProjectId()].participantId ? this._changeRestrictions[this.getProjectId()].participantId : this._changeRestrictions[this.getProjectId()].pid;
      if (SRAOS_Util.beginsWith(pid, 'p')) pid = pid.substr(1);
    }
    html += '<input name="changeRestriction" type="hidden" value="' + pid + '" />';
    this._changeRestrictionLabel.innerHTML = html;
	};
	// }}}
  
	// {{{ _saveFile
	/**
	 * handles ajax invocation response for saving the file
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveFile = function(response) {
    if (response.status == SRAOS.AJAX_STATUS_SUCCESS) {
      var myProjects = MyProjects.getManager();
      if (myProjects) {
        myProjects.refreshFiles();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
      }
      OS.closeWindow(this.win, true);
    }
  };
  // }}}
  
	// {{{ _validateProjectPermissions
	/**
	 * checks if the user has permissions to add files to the selected project
   * @access public
	 * @return void
	 */
  this._validateProjectPermissions = function() {
    if ((MyProjects.getManager().getProject(this._currentProjectId).getUserPermissions & MyProjects.PERMISSIONS_FILE_WRITE) != MyProjects.PERMISSIONS_FILE_WRITE) {
      OS.displayErrorMessage(this.plugin.getString('MyProjectFile.error.noWriteAccess'));
      return false;
    }
    else {
      return true;
    }
  };
  // }}}
};
// }}}
