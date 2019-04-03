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
 * MyProjects edit task window manager. this window may be instantiated with the 
 * following parameters:
 *  id:         the id of the task this window is being opened for. if not 
 *              specified it will be assumed that this is for a new task
 *  projectId:  the default project id to select (optional)
 *  projectIds: the ids of the projects that the user may select from in the 
 *              project/category selector (required)
 *  taskId:     if this task should be a sub task to another test, the id of 
 *              parent task
 */
MyProjectsEditTask = function() {
  
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
   * stores objects that should be disassociated from the task
   * @type Object
   */
  this._disassociate = { messages: [], whiteboards: [], files: [] };
  
  /**
   * a reference to the buttons div
   * @type Object
   */
  this._divBtns;
  
  /**
   * the div containing the task links
   * @type Object
   */
  this._divLinks;
  
  /**
   * a reference to the message div
   * @type Object
   */
  this._divMsg;
  
  /**
   * the div containing the object links
   * @type Object
   */
  this._divObjectLinks;
  
  /**
   * a reference to the associations tab
   * @type Object
   */
  this._divTabAssociations;
  
  /**
   * a reference to the advanced information tab
   * @type Object
   */
  this._divTabAdvanced;
  
  /**
   * a reference to the general information tab
   * @type Object
   */
  this._divTabGeneral;
  
  /**
   * a reference to the scheduling information tab
   * @type Object
   */
  this._divTabSchedule;
  
  /**
   * a reference to tabs div
   * @type Object
   */
  this._divTabs;
  
  /**
   * a reference to the edit div
   * @type HTMLDiv
   */
  this._edit;
  
  /**
   * whether or not edit mode of the task has been displayed
   * @type boolean
   */
  this._edited = false;
  
  /**
   * the description field
   * @type Object
   */
  this._fieldDescription;
  
  /**
   * the disabled field
   * @type Object
   */
  this._fieldDisabled;
  
  /**
   * the due date field
   * @type Object
   */
  this._fieldDueDate;
  
  /**
   * the task list checkbox field
   * @type Object
   */
  this._fieldList;
  
  /**
   * the read only checkbox field
   * @type Object
   */
  this._fieldReadOnly;
  
  /**
   * the start date field
   * @type Object
   */
  this._fieldStartDate;
  
  /**
   * the name field
   * @type Object
   */
  this._fieldTitle;
  
  /**
   * the notify field
   * @type Object
   */
  this._fieldNotify;
  
  /**
   * the parent task selector field
   * @type Object
   */
  this._fieldParent;
  
  /**
   * the percent complete selector field
   * @type Object
   */
  this._fieldPercentComplete;
  
  /**
   * the predecessor task selector field
   * @type Object
   */
  this._fieldPredecessor;
  
  /**
   * the project selector field
   * @type Object
   */
  this._fieldProject;
  
  /**
   * the status field
   * @type Object
   */
  this._fieldStatus;
  
  /**
   * the show form link
   * @type Object
   */
  this._formLink;
  
  /**
   * the show status label (used when the status cannot be changed)
   * @type Object
   */
  this._labelStatus;
  
  /**
   * a reference to the cancel link
   * @type Object
   */
  this._linkCancel;
  
  /**
   * a reference to the edit link
   * @type Object
   */
  this._linkEdit;
  
  /**
   * used to keep track of how many object links are currently displayed
   * @type int
   */
  this._linksCounter = 0;
  
  /**
   * a reference to the preview div
   * @type HTMLDiv
   */
  this._previewDiv;
  
  /**
   * a reference to preview change restriction cell
   * @type Object
   */
  this._previewChangeRestriction;
  
  /**
   * a reference to preview dates cell
   * @type Object
   */
  this._previewDates;
  
  /**
   * a reference to preview duration cell
   * @type Object
   */
  this._previewDuration;
  
  /**
   * a reference to preview header
   * @type Object
   */
  this._previewHeader;
  
  /**
   * a reference to preview description cell
   * @type Object
   */
  this._previewDescription;
  
  /**
   * a reference to percent complete cell label
   * @type Object
   */
  this._previewPercentCompleteLabel;
  
  /**
   * a reference to percent complete cell left image
   * @type Object
   */
  this._previewPercentCompleteLeft;
  
  /**
   * a reference to percent complete cell right image
   * @type Object
   */
  this._previewPercentCompleteRight;
  
  /**
   * a reference to preview project cell
   * @type Object
   */
  this._previewProject;
  
  /**
   * a reference to preview status cell
   * @type Object
   */
  this._previewStatus;
  
  /**
   * a reference to preview title cell
   * @type Object
   */
  this._previewTitle;
  
  /**
   * the current project id selected
   * @type int
   */
  this._projectId;
  
  /**
   * the tabset for the popup
   * @type SRAOS_TabSet
   */
  this._tabs;
  
  /**
   * used to store the selected task parents on a per-project basis
   * @type Array
   */
  this._taskParents = new Array();
  
  /**
   * used to store the selected task predecessors on a per-project basis
   * @type Array
   */
  this._taskPredecessors = new Array();
  
  /**
   * the task that this window was opened for (if applicable)
   * @type Object
   */
  this._task;
  
  
	// {{{ cancel
	/**
	 * invoked when the user clicks on the cancel/close button
   * @access public
	 * @return void
	 */
	this.cancel = function() {
    !this.params.id || this._edit.style.display == 'none' ? OS.closeWindow(this.win) : this.cancelEdit();
  };
  // }}}
  
	// {{{ cancelEdit
	/**
	 * switchs back to preview mode
   * @access public
	 * @return void
	 */
	this.cancelEdit = function() {
    this._edit.style.display = 'none';
    this._previewDiv.style.display = 'block';
    this._btnDelete.style.display = 'none';
    this._linkEdit.style.display = 'inline';
    this._btnSave.style.display = 'none';
    this._linkCancel.innerHTML = OS.getString('form.close');
  };
  // }}}
  
	// {{{ clearChangeRestriction
	/**
	 * clears the current change restriction
   * @access public
	 * @return void
	 */
	this.clearChangeRestriction = function() {
    this._changeRestrictions[this._projectId] = null;
    this._renderChangeRestriction();
	};
	// }}}
  
	// {{{ deleteTask
	/**
	 * deletes an existing task
   * @access public
	 * @return void
	 */
	this.deleteTask = function() {
    if (this._task && !this._task.disabled && !this._task.readOnly && !this._task.wfLocked && OS.confirm(this.plugin.getString('text.deleteConfirmTask') + (this._task.view ? ' ' + this.plugin.getString('text.deleteConfirmTask1') : ''))) {
      this.win.syncWait(this.plugin.getString('MyProjects.deletingTask'));
      OS.ajaxInvokeService(MyProjects.SERVICE_TASK, this, '_deleteTask', null, new SRAOS_AjaxRequestObj(this._task.taskId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
  };
  // }}}
  
	// {{{ disassociateObject
	/**
	 * removes an object association
   * @param int id the id of the object to disassociate
   * @param string type the task attribute name for the new object 
   * (files|messages|whiteboards)
   * @param HTMLDiv div the div containing the object
   * @access public
	 * @return void
	 */
	this.disassociateObject = function(id, type, div) {
    this._disassociate[type].push(id);
    this._divObjectLinks.removeChild(div);
    this._linksCounter--;
    if (this._linksCounter == 0) {
      this._divObjectLinks.innerHTML = OS.getString('text.none');
    }
	};
	// }}}
  
	// {{{ editTask
	/**
	 * switchs to edit mode
   * @access public
	 * @return void
	 */
	this.editTask = function() {
    this._previewDiv.style.display = 'none';
    this._edit.style.display = 'block';
    if (!this._btnDelete.disabled && this.params.id) { this._btnDelete.style.display = 'inline'; }
    this._linkEdit.style.display = 'none';
    this._btnSave.style.display = 'inline';
    this._linkCancel.innerHTML = OS.getString('form.cancel');
    this._edited = true;
  };
  // }}}
  
	// {{{ getProjectId
	/**
	 * returns the currently selected project id
   * @access public
	 * @return int
	 */
	this.getProjectId = function() {
    return SRAOS_Util.getSelectValue(this._fieldProject) * 1;
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
    return !this._edited || (this._task && (this._task.disabled || this._task.readOnly || this._task.wfLocked)) || force || !this.win.isDirty() || OS.confirm(this.plugin.getString('MyProjects.closeDirty'));
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
    this._btnDelete = this.win.getElementById('myProjectTaskDeleteBtn');
    this._btnSave = this.win.getElementById('myProjectTaskSaveBtn');
    this._changeRestrictionLabel = this.win.getElementById('myProjectTaskChangeRestriction');
    this._divBtns = this.win.getElementById('viewTaskButtons');
    this._divLinks = this.win.getElementById('myProjectTaskLinksDiv');
    this._divMsg = this.win.getElementById('myProjectTaskMsg');
    this._divObjectLinks = this.win.getElementById('myProjectsTaskObjectLinks');
    this._divTabAssociations = this.win.getElementById('viewTaskTabAssociations');
    this._divTabAdvanced = this.win.getElementById('viewTaskTabAdvanced');
    this._divTabGeneral = this.win.getElementById('viewTaskTabGeneral');
    this._divTabSchedule = this.win.getElementById('viewTaskTabSchedule');
    this._divTabs = this.win.getElementById('viewTaskTabs');
    this._edit = this.win.getElementById('myProjectsEditTask');
    this._fieldDescription = this.win.getElementById('myProjectFieldTaskDescription');
    this._fieldDisabled = this.win.getElementById('myProjectFieldTaskDisabled');
    this._fieldDueDate = this.win.getElementById('myProjectFieldTaskDueDate');
    OS.addDateChooser(this._fieldDueDate, this.win.getDivId() + 'taskDueDateChooser', true, MyProjects.DATE_CHOOSER_FORMAT);
    this._fieldDurationActual = this.win.getElementById('myProjectFieldTaskDurationActual');
    this._fieldDurationPlanned = this.win.getElementById('myProjectFieldTaskDurationPlanned');
    this._fieldList = this.win.getElementById('myProjectFieldTaskList');
    this._fieldTitle = this.win.getElementById('myProjectFieldTaskTitle');
    this._fieldNotify = this.win.getElementById('myProjectFieldTaskNotify');
    this._fieldParent = this.win.getElementById('myProjectFieldTaskParent');
    this._fieldPercentComplete = this.win.getElementById('myProjectFieldTaskPercentComplete');
    var options = new Array(new Option(OS.getString('text.notSpecified'), ''));
    for(var i=0; i<=100; i+=5) {
      options.push(new Option(i, i));
    }
    SRAOS_Util.addOptionsToSelectField(this._fieldPercentComplete, options);
    this._fieldPredecessor = this.win.getElementById('myProjectFieldTaskPredecessor');
    this._fieldProject = this.win.getElementById('myProjectFieldTaskProject');
    this._fieldReadOnly = this.win.getElementById('myProjectFieldTaskReadOnly');
    this._fieldStartDate = this.win.getElementById('myProjectFieldTaskStartDate');
    OS.addDateChooser(this._fieldStartDate, this.win.getDivId() + 'taskStartDateChooser', true, MyProjects.DATE_CHOOSER_FORMAT);
    this._fieldStatus = this.win.getElementById('myProjectFieldTaskStatus');
    MyProjects.populateProjectListDropDown(this._fieldProject, false, false, null, MyProjects.PERMISSIONS_TASK_WRITE, this.params.projectIds, this.params.projectId);
    this._formLink = this.win.getElementById('myProjectsTaskFormLink');
    this._labelStatus = this.win.getElementById('myProjectLabelTaskStatus');
    this._linkCancel = this.win.getElementById('myProjectTaskCancelLink');
    this._linkEdit = this.win.getElementById('myProjectTaskEditLink');
    this._previewDiv = this.win.getElementById('myProjectsTasksPreview');
    this._previewChangeRestriction = this.win.getElementById('myProjectsTasksPreviewChangeRestriction');
    this._previewDates = this.win.getElementById('myProjectsTasksPreviewDates');
    this._previewDescription = this.win.getElementById('myProjectsTasksPreviewDescription');
    this._previewDuration = this.win.getElementById('myProjectsTasksPreviewDuration');
    this._previewHeader = this.win.getElementById('myProjectsTasksPreviewHeader');
    this._previewPercentCompleteLabel = this.win.getElementById('myProjectsTasksPreviewPercentCompleteLabel');
    this._previewPercentCompleteLeft = this.win.getElementById('myProjectsTasksPreviewPercentCompleteLeft');
    this._previewPercentCompleteRight = this.win.getElementById('myProjectsTasksPreviewPercentCompleteRight');
    this._previewProject = this.win.getElementById('myProjectsTasksPreviewProject');
    this._previewStatus = this.win.getElementById('myProjectsTasksPreviewStatus');
    this._previewTitle = this.win.getElementById('myProjectsTasksPreviewTitle');
    
    var tabs = new Array();
    tabs.push(new SRAOS_Tab('general', this.plugin.getString('MyProjects.task.tabGeneral'), this._divTabGeneral));
    tabs.push(new SRAOS_Tab('schedule', this.plugin.getString('MyProjects.task.tabSchedule'), this._divTabSchedule));
    tabs.push(new SRAOS_Tab('associations', this.plugin.getString('MyProjects.task.tabAssociations'), this._divTabAssociations));
    tabs.push(new SRAOS_Tab('advanced', this.plugin.getString('MyProjects.task.tabAdvanced'), this._divTabAdvanced));
    this._tabs = new SRAOS_TabSet(tabs, this._divTabs, null, this);
    
    if (!this.params.id) {
      this.win.disableButton('btnPrintTask');
      this.editTask();
      this._divLinks.style.display = 'none';
      this._btnSave.style.display = 'inline';
      this._btnSave.value = this.plugin.getString('MyProjects.createTask');
      this.win.setTitleText(this.plugin.getString('MyProjects.createTask'));
      if (this.params.projectId && this.params.taskId) { this._taskParents[this.params.projectId] = this.params.taskId; }
      this.updateProjectId();
      this.win.setDirtyFlags();
    }
    else {
      this.win.getElementById('myProjectsTaskNotify').style.display = 'none';
      
      var task = MyProjects.getManager().getTask(this.params.id);
      if (task) {
        this._setPreview(task, true);
      }
      else {
        this.win.syncWait(this.plugin.getString('MyProjects.loadingTask'));
      }
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_TASKS, this, '_loadTask', null, null, { changeRestriction: true, description: true, files: true, messages: true, taskId: this.params.id, topLevelOnly: true, whiteboards: true } );
    }
    return true;
  };
  // }}}
  
	// {{{ preview
	/**
	 * shows a preview of the message
   * @access public
	 * @return void
	 */
	this.preview = function() {
    this.win.syncWait(this.plugin.getString('text.loadingPreview'));
    OS.ajaxInvokeService(Core_Services.SERVICE_WIKI_TO_HTML, this, '_preview', null, null, { wiki: this._fieldDescription.value });
	};
	// }}}
  
	// {{{ print
	/**
	 * opens the print view for this project
   * @access public
	 * @return void
	 */
	this.print = function() {
    OS.print(MyProjectsEditTask.SERVICE_PRINT, this._task.taskId);
	};
	// }}}
  
	// {{{ saveTask
	/**
	 * saves the task
   * @access public
	 * @return void
	 */
	this.saveTask = function() {
    if (!this._task || (!this._task.readOnly && !this._task.wfLocked)) {
      var params = { disabled: this._fieldDisabled.checked };
      if (!this._task || !this._task.disabled) {
        params['description'] = this._fieldDescription.value;
        params['dueDate'] = this._fieldDueDate.value;
        params['durationActual'] = this._fieldDurationActual.value;
        params['durationPlanned'] = this._fieldDurationPlanned.value;
        params['percentComplete'] = this._fieldPercentComplete.selectedIndex > 0 ? SRAOS_Util.getSelectValue(this._fieldPercentComplete) : null;
        params['startDate'] = this._fieldStartDate.value;
        params['title'] = this._fieldTitle.value;
        if (!this._task || !this._task.wfGenerated) {
          params['list'] = this._fieldList.checked;
          if (!this._task) { params['notify'] = this._fieldNotify.checked; }
          params['parent'] = this._fieldParent.selectedIndex > 0 ? SRAOS_Util.getSelectValue(this._fieldParent) : null;
          params['predecessor'] = this._fieldPredecessor.selectedIndex > 0 ? SRAOS_Util.getSelectValue(this._fieldPredecessor) : null;
          params['projectId'] = SRAOS_Util.getSelectValue(this._fieldProject);
          if (!this._task || this._task.canToggleStatus || this._task.canToggleStatusCode == 3) { params['status'] = SRAOS_Util.getSelectValue(this._fieldStatus); }
          params['changeRestriction'] = this._changeRestriction;
          if (!this._task || !this._task.strictPermissions) { params['readOnly'] = this._fieldReadOnly.checked; }
        }
        if (this._disassociate['messages'].length) {
          for(var i in this._disassociate['messages']) {
            params['messages_' + this._disassociate['messages'][i] + '_remove'] = true;
          }
        }
        if (this._disassociate['whiteboards'].length) {
          for(var i in this._disassociate['whiteboards']) {
            params['whiteboards_' + this._disassociate['whiteboards'][i] + '_remove'] = true;
          }
        }
        if (this._disassociate['files'].length) {
          for(var i in this._disassociate['files']) {
            params['files_' + this._disassociate['files'][i] + '_remove'] = true;
          }
        }
      }
      this.win.syncWait(this.plugin.getString('MyProjects.savingTask'));
      OS.ajaxInvokeService(MyProjects.SERVICE_TASK, this, '_saveTask', null, new SRAOS_AjaxRequestObj(this._task ? this._task.taskId : null, params));
    }
  };
  // }}}
  
	// {{{ selectChangeRestriction
	/**
	 * shows the popup window to select the change restriction participant
   * @access public
	 * @return void
	 */
	this.selectChangeRestriction = function() {
    this.win.getAppInstance().launchWindow('ParticipantSelector', { callback: this, cbMethod: 'setChangeRestriction', permissions: MyProjects.PERMISSIONS_TASK_WRITE, projectId: this._projectId, skip: this._changeRestrictions[this._projectId] ? [this._changeRestrictions[this._projectId].pid] : null, types: MyProjects.PARTICIPANT_GROUP | MyProjects.PARTICIPANT_USER });
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
    projectId = projectId ? projectId : this._projectId;
    this._changeRestrictions[projectId] = participant;
    this._renderChangeRestriction();
	};
	// }}}
  
	// {{{ showForm
	/**
	 * shows the task form
   * @access public
	 * @return void
	 */
	this.showForm = function() {
    this.win.syncWait(this.plugin.getString('MyProjects.loadingTaskForm'));
    OS.ajaxInvokeService(MyProjects.SERVICE_GET_TASKS, this, '_showForm', null, null, { taskId: this.params.id, view: true } );
  };
  // }}}
  
	// {{{ tabActivated
	/**
	 * callback invoked when a tab is activated
   * @param String id the id of the tab that was activated
   * @access public
	 * @return void
	 */
	this.tabActivated = function(id) {
    this._fieldDescription.style.display = id == 'advanced' ? 'inline' : 'none';
	};
	// }}}
  
	// {{{ toggleEditMode
	/**
	 * toggles the edit mode
   * @access public
	 * @return void
	 */
	this.toggleEditMode = function() {
    this._edit.style.display == 'none' ? this.editTask() : this.cancelEdit();
  };
  // }}}
  
	// {{{ updateProjectId
	/**
	 * updates the project id based on the current selection
   * @param boolean force whether or not to force the update
   * @access public
	 * @return void
	 */
	this.updateProjectId = function() {
    if (this.getProjectId() != this._projectId) {
      if (this._projectId) {
        this._taskParents[this._projectId] = SRAOS_Util.getSelectValue(this._fieldParent);
        this._taskPredecessors[this._projectId] = SRAOS_Util.getSelectValue(this._fieldPredecessor);
      }
      this._projectId = this.getProjectId();
      
      MyProjects.populateTaskSelector(this._fieldParent, this._projectId, true, false, this._taskParents[this._projectId], true, this.params.id ? this.params.id : null);
      MyProjects.populateTaskSelector(this._fieldPredecessor, this._projectId, true, false, this._taskPredecessors[this._projectId], true, this.params.id ? this.params.id : null);
      this._renderChangeRestriction();
    }
	};
	// }}}
  
  
	// {{{ _addObjectLink
	/**
	 * adds a task object link (an association to a message, whiteboard or file)
   * @param int id the id of the object to link
   * @param string type the task attribute name for the new object 
   * (files|messages|whiteboards)
   * @param string title the title to use for this new object
   * @param string uri an optional uri to link this object to (in blank window)
   * @param string icon an optional custom icon uri to use
   * @access public
	 * @return void
	 */
	this._addObjectLink = function(id, type, title, uri, icon) {
    var div = document.createElement('div');
    div.innerHTML = '<img alt="' + OS.getString('form.remove') + '" onclick="OS.getWindowInstance(this).getManager().disassociateObject(' + id + ', \'' + type + '\', this.parentNode)" src="' + this.plugin.getBaseUri() + '/images/remove.png" title="' + OS.getString('form.remove') + '" style="cursor: pointer" /> <img alt="' + this.plugin.getString('text.' + type) + '" src="' + (icon ? icon : this.plugin.getIconUri(16, type.substr(0, type.length-1) + '.png')) + '" title="' + this.plugin.getString('text.' + type) + '" />' + (uri ? '<a href="' + uri + '" target="_blank">' : '') + title + (uri ? '</a>' : '');
    this._divObjectLinks.appendChild(div);
    this._linksCounter++;
	};
	// }}}
  
	// {{{ _deleteTask
	/**
	 * handles ajax invocation response for deleting the task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._deleteTask = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteTask'), response);
      }
      else {
        OS.closeWindow(this.win, true);
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        myProjects.refreshTasks();
        myProjects.reloadDashboardLatestActivity();
      }
    }
  };
  // }}}
  
	// {{{ _loadTask
	/**
	 * handles ajax invocation response to loading the task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadTask = function(response) {
    if (!this.win.isClosed()) { 
      this.win.syncFree();
      if (!response.results || response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadTask'), response);
        OS.closeWindow(this.win);
      }
      else {
        this._task = response.results;
        SRAOS_Util.setSelectValue(this._fieldProject, this._task.projectId);
        this._taskParents[this._task.projectId] = this._task.parent ? this._task.parent.taskId : null;
        this._taskPredecessors[this._task.projectId] = this._task.predecessor ? this._task.predecessor.taskId : null;
        this.updateProjectId();
        setTimeout('OS.getWindowInstance("' + this.win.getDivId() + '").setDirtyFlags()', 2000);
        
        if (this._task.view) { 
          this._formLink.style.display = 'inline';
          if (!this._task.viewForm) { this.win.getElementById('myProjectsTaskFormLinkA').innerHTML = OS.getString('text.show'); }
        }
        SRAOS_Util.setSelectValue(this._fieldProject, this._projectId);
        this._linkEdit.style.display = 'inline';
        this._fieldList.checked = this._task.list ? true : false;
        this._fieldTitle.value = this._task.title ? this._task.title : '';
        this._fieldDescription.value = this._task.description;
        this._fieldDisabled.checked = this._task.disabled ? true : false;
        SRAOS_Util.setSelectValue(this._fieldStatus, this._task.status);
        if (!this._task.canToggleStatus && this._task.canToggleStatusCode != 3) {
          this._fieldStatus.style.display = 'none';
          this._labelStatus.style.display = 'inline';
          this._labelStatus.innerHTML = this.plugin.getString('text.status.' + this._task.status);
        }
        this._fieldDueDate.value = this._task.dueDate ? this._task.dueDate.getPHPDate(MyProjects.DATE_CHOOSER_FORMAT) : '';
        this._fieldStartDate.value = this._task.startDate ? this._task.startDate.getPHPDate(MyProjects.DATE_CHOOSER_FORMAT) : '';
        this._fieldDurationActual.value = this._task.durationActual ? this._task.durationActual : '';
        this._fieldDurationPlanned.value = this._task.durationPlanned ? this._task.durationPlanned : '';
        SRAOS_Util.setSelectValue(this._fieldPercentComplete, this._task.percentComplete);
        if (this._task.changeRestriction) {
          this._changeRestrictions[this._projectId] = this._task.changeRestriction;
        }
        this._fieldReadOnly.checked = this._task.readOnlyAttr || this._task.strictPermissions ? true : false;
        this._fieldReadOnly.disabled = this._task.strictPermissions ? true : false;
        
        if (this._task.disabled || this._task.readOnly || this._task.wfLocked) {
          this._fieldProject.disabled = true;
          this._fieldList.disabled = true;
          this._fieldTitle.disabled = true;
          this._fieldDescription.disabled = true;
          if (this._task.readOnly || this._task.wfLocked) { this._fieldDisabled.disabled = true; }
          this._fieldStatus.disabled = true;
          this._fieldDueDate.disabled = true;
          this._fieldStartDate.disabled = true;
          this._fieldDurationActual.disabled = true;
          this._fieldDurationPlanned.disabled = true;
          this.win.getElementById('taskDueDateChooser').style.display = 'none';
          this._fieldParent.disabled = true;
          this._fieldPercentComplete.disabled = true;
          this._fieldPredecessor.disabled = true;
          this.win.getElementById('myProjectTaskChangeRestrictionLink').style.display = 'none';
          this._btnDelete.disabled = true;
          this._btnDelete.style.display = 'none';
          if (this._task.readOnly) { this._linkEdit.style.display = 'none'; }
          if (!this._task.disabled || this._task.readOnly || this._task.wfLocked) { this._divBtns.style.display = 'none'; }
          this._fieldReadOnly.disabled = true;
          
          this._divMsg.style.display = 'block';
          this._divMsg.innerHTML = this.plugin.getString(this._task.readOnly ? 'MyProjects.task.readOnlyMsg' : (this._task.disabled ? 'MyProjects.task.disabledMsg' : 'MyProjects.task.wfLockedMsg'));
        }
        else if (this._task.wfGenerated) {
          this._fieldProject.disabled = true;
          this._fieldList.disabled = true;
          this._fieldStatus.disabled = true;
          this._fieldParent.disabled = true;
          this._fieldPredecessor.disabled = true;
          this._btnDelete.style.display = 'none';
          
          this._divMsg.style.display = 'block';
          this._divMsg.innerHTML = this.plugin.getString('MyProjects.task.wfGeneratedMsg');
        }
        if ((this._task.messages && this._task.messages.length) || (this._task.whiteboards && this._task.whiteboards.length) || (this._task.files && this._task.files.length)) {
          if (this._task.messages) {
            for(var i in this._task.messages) {
              this._addObjectLink(this._task.messages[i].messageId, 'messages', this._task.messages[i].title);
            }
          }
          if (this._task.whiteboards) {
            for(var i in this._task.whiteboards) {
              this._addObjectLink(this._task.whiteboards[i].whiteboardId, 'whiteboards', this._task.whiteboards[i].title);
            }
          }
          if (this._task.files) {
            for(var i in this._task.files) {
              this._addObjectLink(this._task.files[i].fileId, 'files', this._task.files[i].name, this._task.files[i].uri, this._task.files[i].icon);
            }
          }
        }
        else {
          this._divObjectLinks.innerHTML = OS.getString('text.none');
        }
        this._renderChangeRestriction();
        this._setPreview(this._task);
      }
    }
  };
  // }}}
  
	// {{{ _preview
	/**
	 * handles ajax invocation response to show the message preview
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._preview = function(response) {
    if (!this.win.isClosed()) { 
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadPreview'), response);
      }
      else {
        OS.msgBox(response.results, this._fieldTitle.value ? this._fieldTitle.value : this.plugin.getString('MyProjectTask'), this.plugin.getIconUri(32, 'task.png'));
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
    var html = '';
    if (!this._task || !this._task.strictPermissions) {
      html = '<strong>' + (this._task ? this._task.creator : OS.user.name) + '</strong><br />';
    }
    html += this._changeRestrictions[this._projectId] ? '<a href="#" onclick="OS.getWindowInstance(this).getManager().clearChangeRestriction()"><img alt="' + OS.getString('form.clear') + '" src="' + this.plugin.getBaseUri() + '/images/remove.png" title="' + OS.getString('form.clear') + '" /></a><strong>' + this._changeRestrictions[this._projectId].label + '</strong>' : '';
    this._changeRestrictionLabel.innerHTML = html;
	};
	// }}}
  
	// {{{ _saveTask
	/**
	 * handles ajax invocation response for saving the task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveTask = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToSaveTask'), response);
      }
      else {
        OS.closeWindow(this.win, true);
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        myProjects.refreshTasks();
        myProjects.reloadDashboard();
      }
    }
  };
  // }}}
  
	// {{{ _setPreview
	/**
	 * renders the task preview
   * @param Object task the task to render the preview for
   * @param boolean whether or not to display the wait icon for the change 
   * restriction and description
   * @access public
	 * @return void
	 */
	this._setPreview = function(task, wait) {
    this._previewDates.innerHTML = '<div style="white-space: nowrap">' + task.datesLabel + '</div>';
    this._previewDuration.innerHTML = task.durationLabel;
    this._previewHeader.innerHTML = task.title;
    if (task.percentComplete !== null && typeof(task.percentComplete) !== 'undefined') {
      this._previewPercentCompleteLabel.innerHTML = task.percentCompleteLabel;
      this._previewPercentCompleteLabel.style.marginLeft = '40px';
      this._previewPercentCompleteLabel.style.position = 'absolute';
      this._previewPercentCompleteLeft.style.display = task.percentComplete > 0 ? 'inline' : 'none';
      this._previewPercentCompleteRight.style.display = task.percentComplete < 100 ? 'inline' : 'none';
      if (task.percentComplete > 0) { 
        this._previewPercentCompleteLeft.style.width = task.percentComplete + 'px';
        if (task.percentComplete < 100) { this._previewPercentCompleteRight.style.borderLeft = '0'; }
      }
      if (task.percentComplete < 100) { this._previewPercentCompleteRight.style.width = (100 - task.percentComplete) + 'px'; }
      this._previewPercentCompleteLeft.className = task.late ? 'late' : (task.upcoming ? 'upcoming' : 'ontime');
    }
    else {
      this._previewPercentCompleteLabel.innerHTML = OS.getString('text.notSpecified');
      this._previewPercentCompleteLabel.style.marginLeft = '0';
      this._previewPercentCompleteLabel.style.position = 'static';
      this._previewPercentCompleteLeft.style.display = 'none';
      this._previewPercentCompleteRight.style.display = 'none';
    }
    this._previewProject.innerHTML = SRAOS_Util.getSelectValue(this._fieldProject, false, true);
    this._previewStatus.innerHTML = this.plugin.getString('text.status.' + task.status);
    this._previewTitle.innerHTML = task.title;
    
    if (wait) {
      var waitStr = '<div class="myProjectsTasksPreviewWait" style="background-image: url(' + OS.getWaitImgUri() + ')">' + OS.getString('text.wait') + '</div>';
      this._previewChangeRestriction.innerHTML = waitStr;
      this._previewDescription.innerHTML = waitStr;
    }
    else {
      var html = '';
      if (!task.strictPermissions) { html = '<li>' + task.creator + '</li>'; }
      if (task.changeRestriction) { html += '<li>' + task.changeRestriction.label + '</li>'; }
      this._previewChangeRestriction.innerHTML = html != '' ? '<ul>' + html + '</ul>' : OS.getString('text.notSpecified');
      this._previewDescription.innerHTML = task.descriptionHtml ? task.descriptionHtml : OS.getString('text.notSpecified');
    }
  };
  // }}}
  
	// {{{ _showForm
	/**
	 * handles ajax invocation response to showing the task form
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._showForm = function(response) {
    if (!this.win.isClosed()) { 
      this.win.syncFree();
      if (!response.results || !response.results.viewContent || response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadTaskForm'), response);
      }
      else {
        this.win.getAppInstance().launchWindow('TaskForm', { form: response.results.viewContent, noSaveComplete: true, readOnly: this._task.readOnly || this._task.wfLocked, task: this._task, validateOnSave: this._task.isCompleted, view: !response.results.viewForm });
      }
    }
  };
  // }}}
};


/**
 * the name of the ajax service used print a task
 * @type String
 */
MyProjectsEditTask.SERVICE_PRINT = 'myProjectTaskPrint';
// }}}
