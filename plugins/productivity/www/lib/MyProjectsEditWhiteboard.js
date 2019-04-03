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
 * MyProjects edit whiteboard window manager. this window may be instantiated 
 * with the following parameters:
 *  id:         the id of the whiteboard this window is being opened for. if not 
 *              specified it will be assumed that this is for a new whiteboard
 *  projectIds: the ids of the projects that the user may select from in the 
 *              project/category selector (required)
 *  taskId:     if this whiteboard should be associated to a task, the id of  
 *              that task
 */
MyProjectsEditWhiteboard = function() {
  
  /**
   * a reference to the span containing the change restriction label
   * @type Object
   */
  this._changeRestrictionLabel;
  
  /**
   * the users that have been selected to be given change restriction privileges
   * (indexed by project id)
   * @type Array
   */
  this._changeRestrictionParticipants = new Array();
  
  /**
   * the current project id selected
   * @type int
   */
  this._currentProjectId;
  
  /**
   * a reference to the dimensions field
   * @type Object
   */
  this._dimensionsField;
  
  /**
   * if this window was opened for an existing whiteboard, this will be a 
   * reference to that whiteboard
   * @type Object
   */
  this._whiteboard;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
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
   * the subscribers currently included on the form
   * @type Array
   */
  this._subscribers = new Array();
  
  /**
   * a reference to the subscribers div
   * @type Object
   */
  this._subscribersDiv;
  
  /**
   * if this window is for an existing whiteboard, this determined whether or 
   * not that whiteboard's subscribers have already been loaded
   * @type boolean
   */
  this._subscribersLoaded = false;
  
  /**
   * a reference to the task selector field
   * @type Object
   */
  this._taskField;
  
  /**
   * a reference to the thumbnail span
   * @type Object
   */
  this._thumbnailSpan;
  
  /**
   * a reference to the title field
   * @type Object
   */
  this._titleField;

  
	// {{{ addParticipant
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
	this.addParticipant = function(participant, projectId) {
    projectId = projectId ? projectId : this._currentProjectId;
    if (!this._subscribers[projectId]) { this._subscribers[projectId] = new Array(); }
    var tmp = !SRAOS_Util.isNumeric(participant.pid) ? participant.pid.substr(0, 1) : null;
    participant.pid = tmp == 'e' ? participant.pid : (participant.id ? participant.id * 1 : (SRAOS_Util.isNumeric(participant.pid) ? participant.pid * 1 : participant.pid.substr(1) * 1));
    if (!this._subscribers[projectId][participant.pid]) {
      this._subscribers[projectId][participant.pid] = participant;
      this._renderSubscribers();
    }
	};
	// }}}
  
	// {{{ clearChangeRestriction
	/**
	 * clears the current change restriction
   * @access public
	 * @return void
	 */
	this.clearChangeRestriction = function() {
    this._changeRestrictionParticipants[this._currentProjectId] = null;
    this._renderChangeRestriction();
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
    return !this.win.isDirty() || (this.win.isDirty() && OS.confirm(this._plugin.getString('MyProjects.closeDirty')));
  };
  // }}}
  
	// {{{ deleteWhiteboard
	/**
	 * deletes an existing whiteboard
   * @access public
	 * @return void
	 */
	this.deleteWhiteboard = function() {
    if (this._whiteboard) {
      this.win.syncWait(this._plugin.getString('MyProjects.deletingWhiteboard'));
      OS.ajaxInvokeService(MyProjects.SERVICE_WHITEBOARD, this, '_deleteWhiteboard', null, new SRAOS_AjaxRequestObj(this._whiteboard.whiteboardId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
  };
  // }}}
  
	// {{{ getProjectId
	/**
	 * returns the currently selected project id
   * @access public
	 * @return int
	 */
	this.getProjectId = function() {
    return SRAOS_Util.getSelectValue(this._projectField).split(':')[0] * 1;
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
    
    this._changeRestrictionLabel = this.win.getElementById('myProjectWhiteboardChangeRestriction');
    
    this._projectField = this.win.getElementById('myProjectWhiteboardProject');
    
    this._subscribersDiv = this.win.getElementById('myProjectsWhiteboardSubscriberToggleDiv');
    
    this._dimensionsField = this.win.getElementById('myProjectWhiteboardDimensions');
    this._taskField = this.win.getElementById('myProjectWhiteboardTask');
    this._thumbnailSpan = this.win.getElementById('myProjectWhiteboardFileThumbnail');
    this._titleField = this.win.getElementById('myProjectWhiteboardTitle');
    this._titleField.focus();
    new SRAOS_ViewToggle(this._subscribersDiv, this.win.getElementById('myProjectsWhiteboardSubscriberToggle'), 'subscribers', true, false, this);
    
    if (!this.params || !this.params.id) {
      this.win.setTitleText(this._plugin.getString('MyProjects.newWhiteboard'));
      this.win.getElementById('myProjectsWhiteboardHeader').innerHTML = this._plugin.getString('MyProjects.createWhiteboard');
      this.win.getElementById('myProjectWhiteboardDeleteBtn').style.visibility = 'hidden';
      this.win.getElementById('myProjectWhiteboardSaveBtn').value = this._plugin.getString('MyProjects.createWhiteboard');
      this.win.setDirtyFlags();
    }
    this.win.syncWait(this._plugin.getString('MyProjects.loadingCategories'), 'initCancel', null, this.params && this.params.id ? 2 : null);
    OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadWhiteboardCategories', null, null, { projectIds: this.params.projectIds, messageOnly: true });
    
    // fix for firefox cursor bug
    if (SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_FIREFOX) {
      var fieldDivs = this.win.getDomElements({ className: "myProjectFields" });
      for(var i in fieldDivs) {
        fieldDivs[i].style.overflow = 'auto';
      }
    }
    
    return true;
  };
  // }}}
  
	// {{{ removeSubscriber
	/**
	 * removes a subscriber
   * @param String pid the identifier of the subscriber to remove
   * @access public
	 * @return void
	 */
	this.removeSubscriber = function(pid) {
    if (pid && this._subscribers[this._currentProjectId][pid]) {
      this._subscribers[this._currentProjectId] = SRAOS_Util.removeFromArray(pid, this._subscribers[this._currentProjectId], 1, null, true);
      this._renderSubscribers();
    }
	};
	// }}}
  
	// {{{ saveWhiteboard
	/**
	 * saves the whiteboard
   * @access public
	 * @return void
	 */
	this.saveWhiteboard = function() {
    // check permissions
    if (!this._validateProjectPermissions()) { return; }
    
    if (!this._titleField.value || SRAOS_Util.trim(this._titleField.value) == '') {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.whiteboard'));
    }
    else {
      this.win.syncWait(this._plugin.getString('MyProjects.savingWhiteboard'));
      var params = new Array();
      params.push(new SRAOS_AjaxServiceParam('taskId', SRAOS_Util.getSelectValue(this._taskField)));
      params.push(new SRAOS_AjaxServiceParam('projectId', this.getProjectId()));
      var category = SRAOS_Util.getSelectValue(this._projectField).split(':')[1];
      if (category) { params.push(new SRAOS_AjaxServiceParam('category', category)); }
      params.push(new SRAOS_AjaxServiceParam('changeRestriction', this._changeRestrictionParticipants[this._currentProjectId] ? this._changeRestrictionParticipants[this._currentProjectId].participantId : null));
      var dimensions = SRAOS_Util.getSelectValue(this._dimensionsField).split('x');
      if (!dimensions || dimensions.length != 2) { params.push(new SRAOS_AjaxServiceParam('calculateSize', true)); }
      if (dimensions.length == 2) { params.push(new SRAOS_AjaxServiceParam('height', dimensions[1])); }
      params.push(new SRAOS_AjaxServiceParam('title', this._titleField.value));
      params.push(new SRAOS_AjaxServiceParam('whiteboard', 'myProjectWhiteboardFile', SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE));
      if (dimensions.length == 2) { params.push(new SRAOS_AjaxServiceParam('width', dimensions[0])); }
      
      // set starting subscriber index
      var subscriberCounter = 0;
      if (this._whiteboard && this._whiteboard.subscribers) { for(var i in this._whiteboard.subscribers) { if (this._whiteboard.subscribers[i].subscriberId >= subscriberCounter) { subscriberCounter = this._whiteboard.subscribers[i].subscriberId + 1; } } }
      // subscribers added
      if (this._subscribers[this._currentProjectId]) {
        for(var i in this._subscribers[this._currentProjectId]) {
          if (!this._subscribers[this._currentProjectId][i].subscriberId) {
            subscriberCounter++;
            var attr = this._subscribers[this._currentProjectId][i].id ? 'uid' : 'participantId';
            params.push(new SRAOS_AjaxServiceParam('subscribers_' + subscriberCounter + '_' + attr, this._subscribers[this._currentProjectId][i][attr == 'uid' ? 'id' : attr]));
          }
        }
      }
      
      // subscribers removed
      if (this._whiteboard && this._whiteboard.subscribers) {
        for(var i in this._whiteboard.subscribers) {
          if (this._whiteboard.projectId != this._currentProjectId || !this._subscribers[this._currentProjectId][this._whiteboard.subscribers[i].pid]) {
            params.push(new SRAOS_AjaxServiceParam('subscribers_' + this._whiteboard.subscribers[i].subscriberId + '_remove', 1));
          }
        }
      }
      
      OS.ajaxInvokeService(MyProjects.SERVICE_WHITEBOARD, this, '_saveWhiteboard', null, new SRAOS_AjaxRequestObj(this._whiteboard ? this._whiteboard.whiteboardId : null, params));
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
    this.win.getAppInstance().launchWindow('ParticipantSelector', { callback: this, cbMethod: 'setChangeRestriction', permissions: MyProjects.PERMISSIONS_WHITEBOARD_WRITE, projectId: this._currentProjectId, skip: this._changeRestrictionParticipants[this._currentProjectId] ? [this._changeRestrictionParticipants[this._currentProjectId].pid] : null, types: MyProjects.PARTICIPANT_GROUP | MyProjects.PARTICIPANT_USER });
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
    projectId = projectId ? projectId : this._currentProjectId;
    this._changeRestrictionParticipants[projectId] = participant;
    this._renderChangeRestriction();
	};
	// }}}
  
	// {{{ showAddSubscriberPopup
	/**
	 * shows the popup window to add a subscriber
   * @access public
	 * @return void
	 */
	this.showAddSubscriberPopup = function() {
    this.win.getAppInstance().launchWindow('ParticipantSelector', { callback: this, multiple: true, permissions: MyProjects.PERMISSIONS_WHITEBOARD_READ, projectId: this._currentProjectId, skip: this._subscribers[this._currentProjectId] ? SRAOS_Util.getArrayKeys(this._subscribers[this._currentProjectId]) : null, types: MyProjects.PARTICIPANT_CREATOR | MyProjects.PARTICIPANT_EMAIL | MyProjects.PARTICIPANT_GROUP_USER | MyProjects.PARTICIPANT_USER });
	};
	// }}}
  
	// {{{ toggleOpen
	/**
	 * open toggle callback from SRAOS_ViewToggle
   * @param String id the toggle identifier
   * @access public
	 * @return void
	 */
	this.toggleOpen = function(id) {
    if (this._whiteboard) {
      if (id == 'subscribers' && !this._subscribersLoaded) {
        MyProjects.setWaitMsg(this._subscribersDiv, 'MyProjects.loadingSubscribers');
        OS.ajaxInvokeService(MyProjects.SERVICE_WHITEBOARD, this, '_loadWhiteboardSubscribers', null, new SRAOS_AjaxRequestObj(this._whiteboard.whiteboardId), null, null, null, ['subscribers']);
      }
    }
    if (id == 'subscribers') {
      this._subscribersLoaded = true;
    }
	};
	// }}}
  
	// {{{ updateProjectId
	/**
	 * updates the project id based on the current selection
   * @access public
	 * @return void
	 */
	this.updateProjectId = function() {
    if (this.getProjectId() != this._currentProjectId) {
      if (this._currentProjectId) {
        this._projectTaskIds[this._currentProjectId] = SRAOS_Util.getSelectValue(this._taskField);
      }
      this._currentProjectId = this.getProjectId();
      if (this.params.taskId) { 
        this._projectTaskIds[this._currentProjectId] = this.params.taskId;
        this.params.taskId = null;
      }
      this._renderChangeRestriction();
      if (!this._whiteboard || this._subscribersLoaded) { this._renderSubscribers(); }
      this._validateProjectPermissions();
      if (!this._whiteboard && !this._subscribers[this._currentProjectId]) { 
        this.addParticipant({ label: OS.user.name, pid: OS.user.uid, id: OS.user.uid });
      }
      MyProjects.populateTaskSelector(this._taskField, this._currentProjectId, true, false, this._projectTaskIds[this._currentProjectId], true);
    }
	};
	// }}}
  
  
	// {{{ _deleteWhiteboard
	/**
	 * handles ajax invocation response for deleting the whiteboard
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._deleteWhiteboard = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToDeleteWhiteboard'), response);
      }
      else {
        OS.closeWindow(this.win, true);
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        myProjects.refreshDiscussion();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
      }
    }
  };
  // }}}
  
	// {{{ _loadWhiteboard
	/**
	 * handles ajax invocation response for loading the whiteboard
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadWhiteboard = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results[0]) {
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadWhiteboard'), response);
        this.initCancel();
      }
      else {
        this._whiteboard = response.results[0];
        this.win.getElementById('myProjectsWhiteboardHeader').innerHTML = this._plugin.getString('MyProjects.editWhiteboard');
        for(var i=0; i<this._projectField.options.length; i++) {
          var pid = this._projectField.options[i].value.split(':')[0] * 1;
          if (pid == this._whiteboard.projectId && (!this._whiteboard.category || this._whiteboard.category == this._projectField.options[i].text)) {
            this._projectField.selectedIndex = i;
            break;
          }
        }
        this._projectTaskIds[this._whiteboard.projectId] = this._whiteboard.taskId;
        this._changeRestrictionParticipants[this._whiteboard.projectId] = this._whiteboard.changeRestriction ? { id: this._whiteboard.changeRestriction.id, label: this._whiteboard.changeRestriction.getLabel, participantId: this._whiteboard.changeRestriction.participantId, permissions: this._whiteboard.changeRestriction.permissions, pid: this._whiteboard.changeRestriction.getPid, type: this._whiteboard.changeRestriction.isGroup ? MyProjects.PARTICIPANT_GROUP : MyProjects.PARTICIPANT_USER } : null;
        var dimension = this._whiteboard.width + 'x' + this._whiteboard.height;
        if (!SRAOS_Util.setSelectValue(this._dimensionsField, dimension)) {
          SRAOS_Util.addOptionToSelectField(this._dimensionsField, new Option(dimension, dimension));
          SRAOS_Util.setSelectValue(this._dimensionsField, dimension);
        }
        if (this._whiteboard.whiteboardUri) { this._thumbnailSpan.innerHTML = '<a href="' + this._whiteboard.whiteboardUri + '" target="_blank">' + this._plugin.getString('text.viewCurrent') + '</a>'; }
        this._titleField.value = this._whiteboard.title;
        this.updateProjectId();
        this.win.setDirtyFlags();
      }
    }
  };
  // }}}
  
	// {{{ _loadWhiteboardCategories
	/**
	 * handles an ajax invocation response to load whiteboard categories
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadWhiteboardCategories = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadWhiteboardCategories'), response);
        this.initCancel();
      }
      else {
        MyProjects.populateProjectListDropDown(this._projectField, false, false, response.results, MyProjects.PERMISSIONS_WHITEBOARD_READ, this.params.projectIds);
        if (!this._projectField.options.length) {
          OS.displayErrorMessage(this._plugin.getString('MyProjects.error.noCreateWhiteboardPermissions'));
          OS.closeWindow(this.win);
        }
        else {
          if (this.params && this.params.id) {
            this.win.syncStep(this._plugin.getString('MyProjects.loadingWhiteboard'));
            OS.ajaxInvokeService(MyProjects.SERVICE_WHITEBOARD, this, '_loadWhiteboard', [new SRAOS_AjaxConstraintGroup([new SRAOS_AjaxConstraint('whiteboardId', this.params.id)])], null, null, null, ['active', 'activePort', 'activePortPrinter', 'activePortUsers', 'comments', 'created', 'lastUpdated', 'lastUpdatedBy', 'readOnly', 'subscribers', 'thumbnailUri']);
          }
          else {
            this.updateProjectId();
            this.win.syncFree();
          }
        }
      }
    }
  };
  // }}}
  
	// {{{ _loadWhiteboardSubscribers
	/**
	 * handles an ajax invocation response to load whiteboard subscribers
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadWhiteboardSubscribers = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadWhiteboardSubscribers'), response);
      }
      else {
        this._whiteboard.subscribers = response.results[0].subscribers;
        if (this._whiteboard.subscribers) {
          for(var i in this._whiteboard.subscribers) {
            this._whiteboard.subscribers[i].pid = this._whiteboard.subscribers[i].uid ? this._whiteboard.subscribers[i].uid : 'e' + this._whiteboard.subscribers[i].participantId;
            var participant = { label: this._whiteboard.subscribers[i].getLabel, pid: this._whiteboard.subscribers[i].pid, subscriberId: this._whiteboard.subscribers[i].subscriberId };
            if (this._whiteboard.subscribers[i].uid) { 
              participant.id = this._whiteboard.subscribers[i].uid; 
            }
            else {
              participant.participantId = this._whiteboard.subscribers[i].participantId; 
            }
            this.addParticipant(participant, this._whiteboard.projectId);
          }
        }
        this._renderSubscribers();
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
    this._changeRestrictionLabel.innerHTML = this._changeRestrictionParticipants[this._currentProjectId] ? '<a href="#" onclick="OS.getWindowInstance(this).getManager().clearChangeRestriction()"><img alt="' + OS.getString('form.clear') + '" src="' + this._plugin.getBaseUri() + '/images/remove.png" title="' + OS.getString('form.clear') + '" /></a>' + this._changeRestrictionParticipants[this._currentProjectId].label : this._plugin.getString('text.nobody');
	};
	// }}}
  
	// {{{ _renderSubscribers
	/**
	 * renders the subscribers div
   * @access public
	 * @return void
	 */
	this._renderSubscribers = function() {
    var html = '';
    var count = 0;
    if (this._subscribers[this._currentProjectId]) {
      for(var i in this._subscribers[this._currentProjectId]) {
        html += '<div>';
        html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().removeSubscriber(\'' + i + '\')"><img alt="' + this._plugin.getString('text.removeSubscriber') + '" src="' + this._plugin.getBaseUri() + '/images/remove.png" title="' + this._plugin.getString('text.removeSubscriber') + '" /></a>';
        html += this._subscribers[this._currentProjectId][i].label;
        html += '</div>\n';
        count++;
      }
    }
    html += '<div>';
    html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().showAddSubscriberPopup()"><img alt="' + this._plugin.getString('text.addSubscriber') + '" src="' + this._plugin.getBaseUri() + '/images/add.png" title="' + this._plugin.getString('text.addSubscriber') + '" /></a>';
    html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().showAddSubscriberPopup()">' + this._plugin.getString(count ? 'text.addAnotherSubscriber' : 'text.addSubscriber') + '</a>';
    html += '</div>\n';
    this._subscribersDiv.innerHTML = html;
	};
	// }}}
  
	// {{{ _saveWhiteboard
	/**
	 * handles ajax invocation response for saving the whiteboard
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveWhiteboard = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToSaveWhiteboard'), response);
      }
      else {
        this.win.setDirtyFlags();
        OS.closeWindow(this.win);
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        myProjects.refreshDiscussion();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
      }
    }
  };
  // }}}
  
	// {{{ _validateProjectPermissions
	/**
	 * checks if the user has permissions to add whiteboards to the selected project
   * @access public
	 * @return void
	 */
  this._validateProjectPermissions = function() {
    if ((this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager().getProject(this._currentProjectId).getUserPermissions & MyProjects.PERMISSIONS_WHITEBOARD_WRITE) != MyProjects.PERMISSIONS_WHITEBOARD_WRITE) {
      OS.displayErrorMessage(this._plugin.getString('MyProjectWhiteboard.error.noWriteAccess'));
      return false;
    }
    else {
      return true;
    }
  };
  // }}}
  
};
// }}}
