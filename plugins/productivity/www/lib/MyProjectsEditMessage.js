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
 * MyProjects edit message window manager. this window may be instantiated 
 * with the following parameters:
 *  id:         the id of the message this window is being opened for. if not 
 *              specified it will be assumed that this is for a new message
 *  projectIds: the ids of the projects that the user may select from in the 
 *              project/category selector (required)
 *  taskId:     if this message should be associated to a task, the id of that 
 *              task
 */
MyProjectsEditMessage = function() {
  
  /**
   * a reference to the add files div
   * @type Object
   */
  this._addFilesDiv;
  
  /**
   * a reference to the add files link
   * @type Object
   */
  this._addFilesLink;
  
  /**
   * the current project id selected
   * @type int
   */
  this._currentProjectId;
  
  /**
   * a reference to the existing files div
   * @type Object
   */
  this._existingFilesDiv;
  
  /**
   * used to keep track of which existing files have been removed
   * @type Array
   */
  this._existingFilePtrs = new Array();
  
  /**
   * if this window is for an existing message, this determined whether or not 
   * that message's files have already been loaded
   * @type boolean
   */
  this._filesLoaded = false;
  
  /**
   * if this window was opened for an existing message, this will be a reference
   * to that message
   * @type Object
   */
  this._message;
  
  /**
   * a reference to the message field
   * @type Object
   */
  this._messageField;
  
  /**
   * the # of file fields currently displayed
   * @type int
   */
  this._numFiles = 0;
  
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
   * if this window is for an existing message, this determined whether or not 
   * that message's subscribers have already been loaded
   * @type boolean
   */
  this._subscribersLoaded = false;
  
  /**
   * a reference to the task selector field
   * @type Object
   */
  this._taskField;
  
  /**
   * a reference to the title field
   * @type Object
   */
  this._titleField;
  
  
	// {{{ addFile
	/**
	 * adds another file field
   * @access public
	 * @return void
	 */
	this.addFile = function() {
    this._numFiles++;
    var div = this.win.getElementById('myProjectsMessageFile' + this._numFiles);
    div.style.position = 'static';
    div.style.visibility = 'inherit';
    var chooser = this.win.getElementById('myProjectsMessageFileChooser' + this._numFiles);
    chooser.style.visibility = 'inherit';
    if (this._numFiles == 1) { 
      this._addFilesLink.innerHTML = this.plugin.getString('text.attachAnotherFile'); 
    }
    else if (this._numFiles == MyProjects.MAX_FILES_ATTACH) {
      this._addFilesDiv.style.position = 'absolute';
      this._addFilesDiv.style.visibility = 'hidden';
    }
	};
	// }}}
  
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
  
	// {{{ deleteMessage
	/**
	 * deletes an existing message
   * @access public
	 * @return void
	 */
	this.deleteMessage = function() {
    if (this._message) {
      this.win.syncWait(this.plugin.getString('MyProjects.deletingMessage'));
      OS.ajaxInvokeService(MyProjects.SERVICE_MESSAGE, this, '_deleteMessage', null, new SRAOS_AjaxRequestObj(this._message.messageId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
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
    
    this._addFilesDiv = this.win.getElementById('myProjectsAddMessageFileDiv');
    this._addFilesLink = this.win.getElementById('myProjectsAddMessageFileLink');
    this._existingFilesDiv = this.win.getElementById('myProjectsMessageExistingFiles');
    this._messageField = this.win.getElementById('myProjectMessage');
    this._projectField = this.win.getElementById('myProjectMessageProject');
    this._taskField = this.win.getElementById('myProjectMessageTask');
    
    this._subscribersDiv = this.win.getElementById('myProjectsMessageSubscriberToggleDiv');
    this._titleField = this.win.getElementById('myProjectMessageTitle');
    this._titleField.focus();
    new SRAOS_ViewToggle(this.win.getElementById('myProjectsMessageFilesToggleDiv'), this.win.getElementById('myProjectsMessageFilesToggle'), 'files', true, false, this);
    new SRAOS_ViewToggle(this._subscribersDiv, this.win.getElementById('myProjectsMessageSubscriberToggle'), 'subscribers', true, false, this);
    
    if (!this.params || !this.params.id) {
      this.win.setTitleText(this.plugin.getString('MyProjects.newMessage'));
      this.win.getElementById('myProjectsMessageHeader').innerHTML = this.plugin.getString('MyProjects.messageFrom', { name: OS.user.name });
      this.win.getElementById('myProjectMessageDeleteBtn').style.visibility = 'hidden';
      this.win.getElementById('myProjectMessageSaveBtn').value = this.plugin.getString('MyProjects.createMessage');
      this.win.setDirtyFlags();
    }
    this.win.syncWait(this.plugin.getString('MyProjects.loadingCategories'), 'initCancel', null, this.params && this.params.id ? 2 : null);
    OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadMessageCategories', null, null, { projectIds: this.params.projectIds, messageOnly: true });
    
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
  
	// {{{ preview
	/**
	 * shows a preview of the message
   * @access public
	 * @return void
	 */
	this.preview = function() {
    if (!this._titleField.value || SRAOS_Util.trim(this._titleField.value) == '' || !this._messageField.value || SRAOS_Util.trim(this._messageField.value) == '') {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.messagePreview'));
    }
    else {
      this.win.syncWait(this.plugin.getString('text.loadingPreview'));
      OS.ajaxInvokeService(Core_Services.SERVICE_WIKI_TO_HTML, this, '_preview', null, null, { wiki: this._messageField.value });
    }
	};
	// }}}
  
	// {{{ print
	/**
	 * opens the print view for this project
   * @access public
	 * @return void
	 */
	this.print = function() {
    OS.print(MyProjectsEditMessage.SERVICE_PRINT, this._message.messageId);
	};
	// }}}
  
	// {{{ removeFile
	/**
	 * removes a file field
   * @param int id the id of the field to remove
   * @access public
	 * @return void
	 */
	this.removeFile = function(id) {
    if (this._numFiles == MyProjects.MAX_FILES_ATTACH) {
      this._addFilesDiv.style.position = 'static';
      this._addFilesDiv.style.visibility = 'inherit';
    }
    var div = this.win.getElementById('myProjectsMessageFile' + id);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    this._numFiles--;
    if (this._numFiles == 0) { this._addFilesLink.innerHTML = this.plugin.getString('text.attachFile'); }
    if (this._existingFilePtrs[id]) {
      this._existingFilePtrs = SRAOS_Util.removeFromArray(id, this._existingFilePtrs, 1, null, true);
    }
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
  
	// {{{ saveMessage
	/**
	 * saves the message
   * @access public
	 * @return void
	 */
	this.saveMessage = function() {
    // check permissions
    if (!this._validateProjectPermissions()) { return; }
    
    if (!this._titleField.value || SRAOS_Util.trim(this._titleField.value) == '' || !this._messageField.value || SRAOS_Util.trim(this._messageField.value) == '') {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.message'));
    }
    else {
      this.win.syncWait(this.plugin.getString('MyProjects.savingMessage'));
      var params = new Array();
      params.push(new SRAOS_AjaxServiceParam('taskId', SRAOS_Util.getSelectValue(this._taskField)));
      params.push(new SRAOS_AjaxServiceParam('projectId', this.getProjectId()));
      var category = SRAOS_Util.getSelectValue(this._projectField).split(':')[1];
      if (category) { params.push(new SRAOS_AjaxServiceParam('category', category)); }
      params.push(new SRAOS_AjaxServiceParam('title', this._titleField.value));
      params.push(new SRAOS_AjaxServiceParam('message', this._messageField.value));
      
      // set starting file index
      var fileCounter = 0;
      if (this._message && this._message.files) { for(var i in this._message.files) { if (this._message.files[i].fileId >= fileCounter) { fileCounter = this._message.files[i].fileId + 1; } } }
      // files added
      if (this._numFiles > 0) {
        for(var i=1; i<=MyProjects.MAX_FILES_ATTACH; i++) {
          if (this.win.getElementById('myProjectsMessageFile' + i).style.position == 'static') {
            if (!this._existingFilePtrs[i]) {
              fileCounter++;
              params.push(new SRAOS_AjaxServiceParam('files_' + fileCounter + '_file', 'myProjectsMessageFile' + i, SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE));
            }
            if (fileCounter == this._numFiles) { break; }
          }
        }
      }
      // files removed
      if (this._message && this._message.files) {
        for(var i in this._message.files) {
          if (!SRAOS_Util.inArray(this._message.files[i], this._existingFilePtrs)) {
            params.push(new SRAOS_AjaxServiceParam('files_' + this._message.files[i].fileId + '_remove', 1));
          }
        }
      }
      
      // set starting subscriber index
      var subscriberCounter = 0;
      if (this._message && this._message.subscribers) { for(var i in this._message.subscribers) { if (this._message.subscribers[i].subscriberId >= subscriberCounter) { subscriberCounter = this._message.subscribers[i].subscriberId + 1; } } }
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
      if (this._message && this._message.subscribers) {
        for(var i in this._message.subscribers) {
          if (this._message.projectId != this._currentProjectId || !this._subscribers[this._currentProjectId][this._message.subscribers[i].pid]) {
            params.push(new SRAOS_AjaxServiceParam('subscribers_' + this._message.subscribers[i].subscriberId + '_remove', 1));
          }
        }
      }
      
      OS.ajaxInvokeService(MyProjects.SERVICE_MESSAGE, this, '_saveMessage', null, new SRAOS_AjaxRequestObj(this._message ? this._message.messageId : null, params));
    }
  };
  // }}}
  
	// {{{ showAddSubscriberPopup
	/**
	 * shows the popup window to add a subscriber
   * @access public
	 * @return void
	 */
	this.showAddSubscriberPopup = function() {
    this.win.getAppInstance().launchWindow('ParticipantSelector', { callback: this, multiple: true, permissions: MyProjects.PERMISSIONS_MESSAGE_READ, projectId: this._currentProjectId, skip: this._subscribers[this._currentProjectId] ? SRAOS_Util.getArrayKeys(this._subscribers[this._currentProjectId]) : null, types: MyProjects.PARTICIPANT_CREATOR | MyProjects.PARTICIPANT_EMAIL | MyProjects.PARTICIPANT_GROUP_USER | MyProjects.PARTICIPANT_USER });
	};
	// }}}
  
	// {{{ spellcheck
	/**
	 * launches the spellcheck for this comment
   * @access public
	 * @return void
	 */
	this.spellcheck = function() {
    Core_Services.spellcheck(this._messageField);
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
    if (this._message) {
      if (id == 'files' && !this._filesLoaded) {
        this._existingFilesDiv.style.position = 'static';
        this._existingFilesDiv.style.visibility = 'inherit';
        MyProjects.setWaitMsg(this._existingFilesDiv, 'MyProjects.loadingFiles');
        OS.ajaxInvokeService(MyProjects.SERVICE_MESSAGE, this, '_loadMessageFiles', null, new SRAOS_AjaxRequestObj(this._message.messageId), null, null, null, ['files_fileId', 'files_fileUri', 'files_getIconUri', 'files_name']);
      }
      else if (id == 'subscribers' && !this._subscribersLoaded) {
        MyProjects.setWaitMsg(this._subscribersDiv, 'MyProjects.loadingSubscribers');
        OS.ajaxInvokeService(MyProjects.SERVICE_MESSAGE, this, '_loadMessageSubscribers', null, new SRAOS_AjaxRequestObj(this._message.messageId), null, null, null, ['subscribers']);
      }
    }
    if (id == 'files') {
      this._filesLoaded = true;
    }
    else if (id == 'subscribers') {
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
      if (!this._message || this._subscribersLoaded) { this._renderSubscribers(); }
      if (this._validateProjectPermissions()) {
        MyProjects.populateTaskSelector(this._taskField, this._currentProjectId, true, false, this._projectTaskIds[this._currentProjectId], true);
        if (!this._message && !this._subscribers[this._currentProjectId]) { 
          this.addParticipant({ label: OS.user.name, pid: OS.user.uid, id: OS.user.uid });
        }
      }
      else {
        SRAOS_Util.clearSelectField(this._taskField);
      }
    }
	};
	// }}}
  
  
	// {{{ _deleteMessage
	/**
	 * handles ajax invocation response for deleting the message
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._deleteMessage = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteMessage'), response);
      }
      else {
        OS.closeWindow(this.win, true);
        var myProjects = MyProjects.getManager();
        myProjects.refreshDiscussion();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
      }
    }
  };
  // }}}
  
	// {{{ _loadMessage
	/**
	 * handles ajax invocation response for loading the message
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadMessage = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results[0]) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadMessage'), response);
        this.initCancel();
      }
      else {
        this._message = response.results[0];
        this.win.getElementById('myProjectsMessageHeader').innerHTML = this.plugin.getString('MyProjects.messageFrom', { name: this._message.getCreatorName });
        for(var i=0; i<this._projectField.options.length; i++) {
          var pid = this._projectField.options[i].value.split(':')[0] * 1;
          if (pid == this._message.projectId && (!this._message.category || this._message.category == this._projectField.options[i].text)) {
            this._projectField.selectedIndex = i;
            break;
          }
        }
        this._projectTaskIds[this._message.projectId] = this._message.taskId;
        this._titleField.value = this._message.title;
        this._messageField.value = this._message.message;
        this.updateProjectId();
        this.win.setDirtyFlags();
      }
    }
  };
  // }}}
  
	// {{{ _loadMessageCategories
	/**
	 * handles an ajax invocation response to load message categories
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadMessageCategories = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadMessageCategories'), response);
        this.initCancel();
      }
      else {
        MyProjects.populateProjectListDropDown(this._projectField, false, false, response.results, MyProjects.PERMISSIONS_MESSAGE_READ, this.params.projectIds);
        if (!this._projectField.options.length) {
          OS.displayErrorMessage(this.plugin.getString('MyProjects.error.noCreateMessagePermissions'));
          OS.closeWindow(this.win);
        }
        else {
          if (this.params && this.params.id) {
            this.win.syncStep(this.plugin.getString('MyProjects.loadingMesssage'));
            OS.ajaxInvokeService(MyProjects.SERVICE_MESSAGE, this, '_loadMessage', [new SRAOS_AjaxConstraintGroup([new SRAOS_AjaxConstraint('messageId', this.params.id)])], null, null, null, ['comments', 'files', 'messageHtml', 'created', 'lastUpdated', 'lastUpdatedBy', 'subscribers']);
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
  
	// {{{ _loadMessageFiles
	/**
	 * handles an ajax invocation response to load message files
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadMessageFiles = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadMessageFiles'), response);
      }
      else {
        this._message.files = response.results[0].files;
        this._existingFilesDiv.innerHTML = '';
        this._existingFilesDiv.style.position = 'absolute';
        this._existingFilesDiv.style.visibility = 'hidden';
        if (this._message.files) {
          for(var i in this._message.files) {
            this.addFile();
            this._existingFilePtrs[this._numFiles] = this._message.files[i];
            this.win.getElementById('myProjectsMessageFileExisting' + this._numFiles).innerHTML = '<a class="myProjectsDiscussionLink" href="' + this._message.files[i].fileUri + '" style="background-image: url(' + this._message.files[i].getIconUri + ')" target="_blank">' + this._message.files[i].name + '</a>';
            var chooser = this.win.getElementById('myProjectsMessageFileChooser' + this._numFiles);
            chooser.style.visibility = 'hidden';
          }
        }
      }
    }
  };
  // }}}
  
	// {{{ _loadMessageSubscribers
	/**
	 * handles an ajax invocation response to load message subscribers
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadMessageSubscribers = function(response) {
    if (!this.win.isClosed()) { 
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        this.win.syncFree();
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadMessageSubscribers'), response);
      }
      else {
        this._message.subscribers = response.results[0].subscribers;
        if (this._message.subscribers) {
          for(var i in this._message.subscribers) {
            this._message.subscribers[i].pid = this._message.subscribers[i].uid ? this._message.subscribers[i].uid : 'e' + this._message.subscribers[i].participantId;
            var participant = { label: this._message.subscribers[i].getLabel, pid: this._message.subscribers[i].pid, subscriberId: this._message.subscribers[i].subscriberId };
            if (this._message.subscribers[i].uid) { 
              participant.id = this._message.subscribers[i].uid; 
            }
            else {
              participant.participantId = this._message.subscribers[i].participantId; 
            }
            this.addParticipant(participant, this._message.projectId);
          }
        }
        this._renderSubscribers();
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
        OS.msgBox(response.results, this._titleField.value, this.plugin.getIconUri(32, 'message.png'));
      }
    }
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
        html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().removeSubscriber(\'' + i + '\')"><img alt="' + this.plugin.getString('text.removeSubscriber') + '" src="' + this.plugin.getBaseUri() + '/images/remove.png" title="' + this.plugin.getString('text.removeSubscriber') + '" /></a>';
        html += this._subscribers[this._currentProjectId][i].label;
        html += '</div>\n';
        count++;
      }
    }
    html += '<div>';
    html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().showAddSubscriberPopup()"><img alt="' + this.plugin.getString('text.addSubscriber') + '" src="' + this.plugin.getBaseUri() + '/images/add.png" title="' + this.plugin.getString('text.addSubscriber') + '" /></a>';
    html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().showAddSubscriberPopup()">' + this.plugin.getString(count ? 'text.addAnotherSubscriber' : 'text.addSubscriber') + '</a>';
    html += '</div>\n';
    this._subscribersDiv.innerHTML = html;
	};
	// }}}
  
	// {{{ _saveMessage
	/**
	 * handles ajax invocation response for saving the message
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveMessage = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToSaveMessage'), response);
      }
      else {
        OS.closeWindow(this.win, true);
        var myProjects = MyProjects.getManager();
        myProjects.refreshDiscussion();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
      }
    }
  };
  // }}}
  
	// {{{ _validateProjectPermissions
	/**
	 * checks if the user has permissions to add messages to the selected project
   * @access public
	 * @return void
	 */
  this._validateProjectPermissions = function() {
    if ((MyProjects.getManager().getProject(this._currentProjectId).getUserPermissions & MyProjects.PERMISSIONS_MESSAGE_WRITE) != MyProjects.PERMISSIONS_MESSAGE_WRITE) {
      OS.displayErrorMessage(this.plugin.getString('MyProjectMessage.error.noWriteAccess'));
      return false;
    }
    else {
      return true;
    }
  };
  // }}}
  
};


/**
 * the name of the ajax service used print a message
 * @type String
 */
MyProjectsEditMessage.SERVICE_PRINT = 'myProjectMessagePrint';
// }}}
