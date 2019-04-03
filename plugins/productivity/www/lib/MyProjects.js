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
 * MyProjects window manager. this window can be invoked with the following 
 * params:
 *   projectId: the id of a project to initially load
 *   tab:       the tab to focus initially
 */
MyProjects = function() {
  
  /**
   * keeps track of the current lookup mode
   * @type boolean
   */
  this._advLookupMode = false;
  
  /**
   * a hash of current cell a elements for the calendars indexed by the calendar 
   * div id where the value is another hash indexed by month day
   * @type Array
   */
  this._aElements = new Array();
  
  /**
   * reference to the calendar popup div
   * @type Object
   */
  this._calendarPopup;
  
  /**
   * the div containing the tabs
   * @type Object
   */
  this._canvasTabs;
  
  /**
   * tab set for the canvas area (dashboard, discussions, tasks, files)
   * @type Object
   */
  this._canvasTabSet;
  
  /**
   * a reference to the 1st dashboard calendar
   * @type Object
   */
  this._dashboardCal1;
  
  /**
   * a reference to the 2nd dashboard calendar
   * @type Object
   */
  this._dashboardCal2;
  
  /**
   * a reference to the 3rd dashboard calendar
   * @type Object
   */
  this._dashboardCal3;
  
  /**
   * the current start date for the dashboard calendars
   * @type Date
   */
  this._dashboardCalStart = new Date();
  
  /**
   * the current loaded discussion items
   * @type Array
   */
  this._discussion;
  
  /**
   * a reference to discussion "Group by" selector
   * @type Object
   */
  this._discussionGroupBy;
  
  /**
   * a reference to discussion "hide older than" selector
   * @type Object
   */
  this._discussionHideOlder;
  
  /**
   * a specific id of an message that should be loaded the next time the 
   * discussion tab is loaded
   * @type int
   */
  this._discussionMessageId;
  
  /**
   * a reference to discussion show selector
   * @type Object
   */
  this._discussionShow;
  
  /**
   * whether or not to show the comments of this._discussionMessageId
   * @type boolean
   */
  this._discussionShowComments;
  
  /**
   * a reference to discussion project/category selector
   * @type Object
   */
  this._discussionShowFrom;
  
  /**
   * a specific id of an whiteboard that should be loaded the next time the 
   * discussion tab is loaded
   * @type int
   */
  this._discussionWhiteboardId;
  
  /**
   * a reference to the canvas div
   * @type Object
   */
  this._divCanvas;
  
  /**
   * a reference to the div containing the project(s) dashboard
   * @type Object
   */
  this._divDashboard;
  
  /**
   * a reference to the div containing the project(s) dashboard left side
   * @type Object
   */
  this._divDashboardContent;
  
  /**
   * a reference to the dashboard div containing the late items for the selected
   * projects
   * @type Object
   */
  this._divDashboardLate;
  
  /**
   * a reference to the dashboard late items container
   * @type Object
   */
  this._divDashboardLateContainer;
  
  /**
   * a reference to the dashboard div containing the latest activity for the 
   * selected projects
   * @type Object
   */
  this._divDashboardLatestActivity;
  
  /**
   * a reference to the dashboard div containing the upcoming deadlines for the 
   * selected projects
   * @type Object
   */
  this._divDashboardUpcoming;
  
  /**
   * a reference to the div containing project(s) discussion
   * @type Object
   */
  this._divDiscussion;
  
  /**
   * a reference to the left side discussion div
   * @type Object
   */
  this._divDiscussionContent;
  
  /**
   * a reference to the div containing project(s) files
   * @type Object
   */
  this._divFiles;
  
  /**
   * a reference to the left side files div
   * @type Object
   */
  this._divFilesContent;
  
  /**
   * a reference to the files popup div
   * @type Object
   */
  this._divFilesPopup;
  
  /**
   * a reference to the lookup div
   * @type Object
   */
  this._divLookup;
  
  /**
   * a reference to the advanced lookup div
   * @type Object
   */
  this._divLookupAdv;
  
  /**
   * a reference to the basic lookup div
   * @type Object
   */
  this._divLookupBasic;
  
  /**
   * a reference to the no project selected div
   * @type Object
   */
  this._divNoSelection;
  
  /**
   * a reference to the project list div
   * @type Object
   */
  this._divProjectList;
  
  /**
   * a reference to the div containing project(s) tasks
   * @type Object
   */
  this._divTasks;
  
  /**
   * a reference to the left side tasks div
   * @type Object
   */
  this._divTasksContent;
  
  /**
   * the id of a task to expand when the next time the task trees are rendered
   * @type int
   */
  this._expandTaskIds = new Array();
  
  /**
   * the files that are currently displayed in the files panel
   * @type Array
   */
  this._files;
  
  /**
   * select field determining how the files panel should be grouped
   * @type Object
   */
  this._filesGroupBy;
  
  /**
   * a reference to files search field
   * @type Object
   */
  this._filesSearch;
  
  /**
   * a reference to files project/category selector
   * @type Object
   */
  this._filesShowFrom;
  
  /**
   * the current hide calendar popup timer
   * @type Object
   */
  this._hideCalendarPopupTimer;
  
  /**
   * the current hide project list timer
   * @type Object
   */
  this._hideProjectListTimer;
  
  /**
   * if the assigned to task tab drop down is currently being populated, this 
   * value determines whether or not the next selection will be for anyone
   * @type boolean
   */
  this._lastSelectedAssignedAnyone;
  
  /**
   * the name of the currently loaded saved search
   * @type String
   */
  this._loadedSavedSearch;
  
  /**
   * used to keep track of which tabs have already been loaded with the current 
   * project selection
   * @type Array
   */
  this._loadedTabs = new Array();
  
  /**
   * whether or not the no projects selected message is currently rendered
   * @type boolean
   */
  this._noProjectSelected = false;
  
  /**
   * the number of projects currently listed in the projects selector
   * @type int
   */
  this._numProjects = 0;
  
  /**
   * the current loaded projects
   * @type Array
   */
  this._projects;
  
  /**
   * the counter used to set div ids in the this._renderGroups method
   * @type int
   */
  this._renderGroupsCounter = 0;
  
  /**
   * used by refreshProjectList/_loadProjects to determine whether or not the 
   * project selection should be changed
   * @type boolean
   */
  this._resetSelected;
  
  /**
   * counter used to keep track of search requests
   * @type int
   */
  this._searchCounter = 0;
  
  /**
   * the current lookup constraints
   * @type SRAOS_AjaxServiceParam
   */
  this._searchParams;
  
  /**
   * a reference to the basic search input box
   * @type Object
   */
  this._searchField;
  
  /**
   * a reference to the end date search field
   * @type Object
   */
  this._searchFieldEnd;
  
  /**
   * a reference to the include archived search field
   * @type Object
   */
  this._searchFieldIncludeArchived;
  
  /**
   * a reference to the keyword search field
   * @type Object
   */
  this._searchFieldKeyword;
  
  /**
   * a reference to the schedule (overdue) search field
   * @type Object
   */
  this._searchFieldOverdue;
  
  /**
   * a reference to the owner search field
   * @type Object
   */
  this._searchFieldOwner;
  
  /**
   * a reference to the pending tasks search field
   * @type Object
   */
  this._searchFieldParticipant;
  
  /**
   * a reference to the project id search field
   * @type Object
   */
  this._searchFieldProjectId;
  
  /**
   * a reference to the project type search field
   * @type Object
   */
  this._searchFieldProjectType;
  
  /**
   * a reference to the start date search field
   * @type Object
   */
  this._searchFieldStart;
  
  /**
   * the search panel tabset
   * @type SRAOS_TabSet
   */
  this._searchTabSet;
  
  /**
   * a reference to the status search field
   * @type Object
   */
  this._searchFieldStatus;
  
  /**
   * a reference to the span containing the current project selection label
   * @type Object
   */
  this._selectedProjectLabel;
  
  /**
   * an array containing the ids of all of the projects that are currently 
   * selected
   * @type Array
   */
  this._selectedProjects = new Array();
  
  /**
   * whether or not to skip the next resize event
   * @type boolean
   */
  this._skipNextResizeEnd = true;
  
  /**
   * the current rendered task trees indexed by project id
   * @type SRAOS_Tree[]
   */
  this._taskTrees;
  
  /**
   * the current selected/visible task in the tasks panel
   * @type Array
   */
  this._tasks;
  
  /**
   * a reference to the tasks assigned to selector 
   * @type Object
   */
  this._tasksAssignedTo;
  
  /**
   * a reference to the 1st tasks panel calendar
   * @type Object
   */
  this._tasksCalendar1;
  
  /**
   * a reference to the tasks group by selector 
   * @type Object
   */
  this._tasksGroupBy;
  
  /**
   * a reference to the hide late/upcoming checkbox in the tasks panel 
   * @type Object
   */
  this._tasksShowLateUpcoming;
  
  /**
   * a reference to the tasks project selector 
   * @type Object
   */
  this._tasksShowFrom;
  
  /**
   * a reference to the tasks status selector 
   * @type Object
   */
  this._tasksStatus;
  
  /**
   * a specific id of an task that should be loaded the next time the tasks tab 
   * is loaded
   * @type int
   */
  this._tasksTaskId;
  
  /**
   * a hash of current cell elements for the calendars indexed by the calendar 
   * div id where the value is another hash indexed by month day
   * @type Array
   */
  this._tdElements = new Array();
  
  /**
   * a reference to the vertical divider
   * @type Object
   */
  this._vertDivider;
  
  /**
   * all of the view toggles associated with the MyProjects window
   * @type Array
   */
  this._viewToggles = new Array();
  
  
  
	// {{{ activateWhiteboard
	/**
	 * opens the whiteboard specified
   * @param int whiteboardId the id of the whiteboard to open
   * @access  public
	 * @return void
	 */
	this.activateWhiteboard = function(whiteboardId) {
    this.win.setStatusBarText(this.plugin.getString('MyProjects.activatingWhiteboard'));
    OS.ajaxInvokeService(MyProjects.SERVICE_ACTIVATE_WHITEBOARD, this, '_activateWhiteboard', null, null, { 'whiteboardId': whiteboardId });
	};
	// }}}
  
	// {{{ addComment
	/**
	 * used to add a comment to a discussion item
   * @param String id the id of the discussion item to add the comment to. 
   * either "message:[messageId]" or "whiteboard:[whiteboardId]"
   * @access public
	 * @return void
	 */
	this.addComment = function(id) {
    this.win.getAppInstance().launchWindow('AddComment', { "id": id });
	};
	// }}}
  
	// {{{ changeCompletionStatus
	/**
	 * changes the completion status of the project or task specified
   * @param boolean complete whether to complete 
   * (status=MyProjects.STATUS_COMPLETED) or uncomplete 
   * (status=MyProjects.STATUS_ACTIVE) the project/task
   * @param int id the project or task id
   * @param boolean isTask whether id is for a task or a project
   * @param Object checkbox the checkbox that triggered this event
   * @access public
	 * @return void
	 */
	this.changeCompletionStatus = function(complete, id, isTask, checkbox) {
    this.toggleCalendarPopup(true);
    if (checkbox) { checkbox.checked = complete ? false : true; }
    // task
    if (isTask) {
      if (complete) {
        this.win.syncWait(this.plugin.getString('MyProjects.completingTask'));
        OS.ajaxInvokeService(MyProjects.SERVICE_COMPLETE_TASK, this, '_completeTask', null, null, { '_taskId': id }, id);
      }
      else {
        this.win.syncWait(this.plugin.getString('MyProjects.uncompletingTask'));
        OS.ajaxInvokeService(MyProjects.SERVICE_TASK, this, '_updateTask', null, new SRAOS_AjaxRequestObj(id, { status: MyProjects.STATUS_ACTIVE }, SRAOS_AjaxRequestObj.TYPE_UPDATE));
      }
    }
    // project
    else {
      var project = this.getProject(id);
      if (project.getUserPermissions == MyProjects.PERMISSIONS_ADMIN) {
        if (complete) {
          this.win.syncWait(this.plugin.getString('MyProjects.completingProject'));
          OS.ajaxInvokeService(MyProjects.SERVICE_COMPLETE_PROJECT, this, '_completeProject', null, null, { 'projectId': id }, id);
        }
        else {
          this.win.syncWait(this.plugin.getString('MyProjects.uncompletingProject'));
          OS.ajaxInvokeService(MyProjects.SERVICE_UPDATE, this, '_updateProject', null, new SRAOS_AjaxRequestObj(id, { status: MyProjects.STATUS_ACTIVE }, SRAOS_AjaxRequestObj.TYPE_UPDATE));
        }
      }
      else {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.onlyProjectAdmin'));
      }
    }
	};
	// }}}
  
	// {{{ deactivateWhiteboard
	/**
	 * deactivates the whiteboard specified
   * @param int whiteboardId the id of the whiteboard to open
   * @access  public
	 * @return void
	 */
	this.deactivateWhiteboard = function(whiteboardId) {
    this.win.setStatusBarText(this.plugin.getString('MyProjects.deactivatingWhiteboard'));
    OS.ajaxInvokeService(MyProjects.SERVICE_WHITEBOARD, this, '_deactivateWhiteboard', null, new SRAOS_AjaxRequestObj(whiteboardId, { active: false }));
	};
	// }}}
  
	// {{{ deleteDiscussionComment
	/**
	 * deletes a discussion comment
   * @param int id the id of the comment to delete
   * @param int messageId the id of the message this comment pertains to (when 
   * applicable)
   * @param int whiteboardId the id of the whiteboard this comment pertains to 
   * (when applicable)
   * @access public
	 * @return void
	 */
	this.deleteDiscussionComment = function(id, messageId, whiteboardId) {
    if (OS.confirm(this.plugin.getString('text.deleteConfirmComment'))) {
      this.win.setStatusBarText(this.plugin.getString('MyProjects.deletingComment'));
      OS.ajaxInvokeService(MyProjects.SERVICE_COMMENT, this, '_deleteDiscussionComment', null, new SRAOS_AjaxRequestObj(id, null, SRAOS_AjaxRequestObj.TYPE_DELETE), null, messageId ? 'message:' + messageId : 'whiteboard:' + whiteboardId);
    }
	};
	// }}}
  
	// {{{ deleteDiscussionItem
	/**
	 * deletes a discussion item
   * @param String id the id of the discussion item to delete. either 
   * "message:[messageId]" or "whiteboard:[whiteboardId]"
   * @access public
	 * @return void
	 */
	this.deleteDiscussionItem = function(id) {
    id = id.split(':');
    var isMessage = id[0] == 'message';
    id = id[1];
    if (OS.confirm(this.plugin.getString(isMessage ? 'text.deleteConfirmMessage'  : 'text.deleteConfirmWhiteboard'))) {
      this.win.setStatusBarText(this.plugin.getString(isMessage ? 'MyProjects.deletingMessage' : 'MyProjects.deletingWhiteboard'));
      OS.ajaxInvokeService(isMessage ? MyProjects.SERVICE_MESSAGE : MyProjects.SERVICE_WHITEBOARD, this, '_deleteDiscussionItem', null, new SRAOS_AjaxRequestObj(id, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
	};
	// }}}
  
	// {{{ deleteFile
	/**
	 * deletes a file
   * @param int fileId the id of the file
   * @access public
	 * @return void
	 */
  this.deleteFile = function(fileId) {
    for(var i in this._files) {
      if (this._files[i].fileId == fileId && !this._files[i].readOnly && OS.confirm(this.plugin.getString('MyProjects.fileDeleteConfirm'))) {
        this.win.setStatusBarText(this.plugin.getString('MyProjects.deletingFile', { name: this._files[i].name }));
        OS.ajaxInvokeService(MyProjects.SERVICE_FILE, this, '_deleteFile', null, new SRAOS_AjaxRequestObj(fileId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
      }
    }
  };
  // }}}
  
	// {{{ deleteSavedSearch
	/**
	 * deletes the currently selected saved search
   * @access public
	 * @return void
	 */
	this.deleteSavedSearch = function() {
    var search = MyProjects.getSavedSearch(this._loadedSavedSearch);
    if (search) {
      this.win.setStatusBarText(this.plugin.getString('MyProjects.deletingSavedSearch') + ' ' + this._loadedSavedSearch);
      OS.ajaxInvokeService('myProjectsManageSavedSearches', this, '_processAjaxResponse', null, new SRAOS_AjaxRequestObj(search.searchId, null, SRAOS_AjaxRequestObj.TYPE_DELETE), null, 'MyProjects.error.unableToDeleteSearch');
      OS.user.myProjectsSavedSearches = SRAOS_Util.removeFromArray(search, OS.user.myProjectsSavedSearches, 1, 'searchId');
      this.win.disableMenuItem('deleteSavedSearch');
      this.win.disableMenuItem('rssSubscribe');
      this.win.disableMenuItem('icalSubscribe');
      this.win.disableButton('btnDeleteSavedSearch');
      this.win.disableButton('btnRssSubscribe');
      this.win.disableButton('btnIcalSubscribe');
      this._loadedSavedSearch = null;
      this._populateSavedSearches();
    }
	};
	// }}}
  
	// {{{ displayFilePopup
	/**
	 * invoked when a file is clicked in the files panel. this method either 
   * displays the file popup selector (single click) or opens the file (double 
   * click)
   * @param Object cell the table cell that was clicked
   * @param int fileId the id of the file that was clicked
   * @param boolean force set to true after the double click timeout
   * @access public
	 * @return void
	 */
  this.displayFilePopup = function(cell, fileId, force) {
    for(var i in this._files) {
      if (this._files[i].fileId == fileId) {
        if (force && this._displayFilePopupCell) {
          this._divFilesPopup.onmouseover();
          var encl = SRAOS_Util.getDomElements(this._displayFilePopupCell, { nodeName: 'table' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
          var enclRow = SRAOS_Util.getDomElements(this._displayFilePopupCell, { nodeName: 'tr' }, true, false, 1, SRAOS_Util.GET_DOM_ELEMENTS_UP);
          var priorRows = SRAOS_Util.getDomElements(enclRow, { nodeName: 'tr' }, true, false, null, SRAOS_Util.GET_DOM_ELEMENTS_LEFT);
          var topOffset = 0;
          for(var n in priorRows) {
            topOffset += priorRows[n].offsetHeight;
          }
          topOffset += topOffset ? enclRow.offsetHeight + 2 : 0;
          var leftOffset = topOffset ? 22 : parseInt(this._displayFilePopupCell.offsetWidth/2);
          this._divFilesPopup.style.left = (encl.offsetLeft + leftOffset) + 'px';
          this._divFilesPopup.style.top = (encl.offsetTop + topOffset) + 'px';
          this._divFilesPopup.style.display = 'block';
          var html = '<a href="' + this._files[i].uri + '" style="background-image:url(' + OS.getIconUri(16, 'fileopen.png') + '); font-weight: bold" target="_blank">' + OS.getString('text.open') + '</a>';
          if (this._files[i].preview) { html += '<a href="#" onclick="MyProjects.getManager().win.getAppInstance().launchWindow(\'FilePreview\', { file: MyProjects.getManager().getFile(' + fileId + ') })" style="background-image:url(' + OS.getIconUri(16, 'filesearch.png') + ')">' + this.plugin.getString('text.preview') + '</a>'; }
          html += '<a href="#" onclick="MyProjects.getManager().win.getAppInstance().launchWindow(\'EditFile\', { file: MyProjects.getManager().getFile(' + fileId + '), properties: true })" style="background-image:url(' + OS.getIconUri(16, 'info.png') + ')">' + OS.getString('text.properties') + '</a>';
          if (this._files[i].versioning && this._files[i].versions) { html += '<a href="#" onclick="MyProjects.getManager().displayFileVersionsPopup(' + fileId + ')" style="background-image:url(' + this.plugin.getIconUri(16, 'file-versions.png') + ')">' + this.plugin.getString('text.versions') + '</a>'; }
          if (!this._files[i].readOnly) {
            html += '<a href="#" onclick="MyProjects.getManager().win.getAppInstance().launchWindow(\'EditFile\', { file: MyProjects.getManager().getFile(' + fileId + '), projectIds: MyProjects.getManager()._selectedProjects })" style="background-image:url(' + OS.getIconUri(16, 'edit.png') + ')">' + OS.getString('text.edit') + '</a>';
            html += '<a href="#" onclick="MyProjects.getManager().deleteFile(' + fileId + ')" style="background-image:url(' + OS.getIconUri(16, 'delete.png') + ')">' + OS.getString('text.delete') + '</a>';
          }
          if (this._files[i].messageId || this._files[i].taskId) {
            html += '<div>';
            html += this._files[i].taskId ? MyProjects.renderTaskTitle({ taskId: this._files[i].taskId, title: this._files[i].taskTitle }, true).replace(new RegExp('a href', "gim"), 'a style="background-image:url(' + this.plugin.getIconUri(16, 'task.png') + ')" href') : '';
            html += this._files[i].messageId ? MyProjects.renderMessageTitle({ messageId: this._files[i].messageId, title: this._files[i].messageTitle, commentId: this._files[i].commentId }, true).replace(new RegExp('a href', "gim"), 'a style="background-image:url(' + this.plugin.getIconUri(16, 'message.png') + ')" href') : '';
            html += '</div>';
          }
          this._divFilesPopup.innerHTML = html;
          this._displayFilePopupCell = null;
          this._divFilesPopup.onmouseout();
        }
        else if (this._displayFilePopupCell) {
          this._displayFilePopupCell = null;
          window.open(this._files[i].uri);
        }
        else if (!force) {
          this._displayFilePopupCell = cell;
          setTimeout('MyProjects.getManager().displayFilePopup(null, ' + fileId + ', true);', SRAOS.DBL_CLICK_MAX_INTERVAL);
        }
        break;
      }
    }
  };
  // }}}
  
	// {{{ displayFileVersionsPopup
	/**
	 * displays the versions for a file in a popup window
   * @param int fileId the id of the file
   * @access public
	 * @return void
	 */
  this.displayFileVersionsPopup = function(fileId) {
    for(var i in this._files) {
      if (this._files[i].fileId == fileId && this._files[i].versioning && this._files[i].versions) {
        var html = '';
        for(var n in this._files[i].versions) {
          html += '<a href="' + this._files[i].versions[n].uri + '" style="background-image:url(' + SRAOS_Util.substituteParams(this._files[i].versions[n].icon, {size: '16'}) + ')" target="_blank">' + this._files[i].versions[n].name + ' [' + this._files[i].versions[n].versionLabel + ']</a>';
        }
        this._divFilesPopup.innerHTML = html;
        break;
      }
    }
  };
  // }}}
  
	// {{{ editDiscussionItem
	/**
	 * edits a discussion item
   * @param String id the id of the discussion item to edit. either 
   * "message:[messageId]" or "whiteboard:[whiteboardId]"
   * @access public
	 * @return void
	 */
	this.editDiscussionItem = function(id) {
    var tmp = id.split(':');
    this.win.getAppInstance().launchWindow(tmp[0] == 'message' ? 'EditMessage' : 'EditWhiteboard', { 'id': tmp[1], 'projectIds': this._selectedProjects });
	};
	// }}}
  
  // {{{ focusProjectTasks
  /**
   * focuses the tasks of a particular project by changing to the Task panel, 
   * hiding all of the other visible project tasks and placing this projects' 
   * tasks at the top
   * @param int projectId the id of the project to focus the tasks for
   * @access public
	 * @return void
	 */
	this.focusProjectTasks = function(projectId) {
    this._skipRefreshTasks = true;
    this._canvasTabSet.setActive(MyProjects.TAB_TASKS);
    this._skipRefreshTasks = false;
    this._tasksShowFrom.value = projectId;
    this.refreshTasks();
	};
	// }}}
  
	// {{{ getFile
	/**
	 * returns the file corresponding with fileId if that file is currently loaded
   * @param int fileId the id of the file to return
   * @access public
	 * @return void
	 */
  this.getFile = function(fileId) {
    for(var i in this._files) {
      if (this._files[i].fileId == fileId) {
        return this._files[i];
      }
    }
  };
  // }}}
  
  // {{{ getProject
  /**
   * returns the project object from this._projects identified by projectId. if 
   * the project is not currently in this._projects, null will be returned
   * @param int projectId the id of the project to return
   * @access public
	 * @return Object
	 */
	this.getProject = function(projectId) {
    if (this._projects) {
      for(var i in this._projects) {
        if (this._projects[i].projectId == projectId) { return this._projects[i]; }
      }
    }
    return null;
	};
	// }}}
  
  // {{{ getState
  /**
   * this method is called when the state of it's corresponding window instance 
   * is being saved. manager implementations may use it to save additional state 
   * information that will later be passed to the init method below when the 
   * window is restored. the return value should be an associative array of key
   * value initialization variables
   * @access public
	 * @return Array
	 */
	this.getState = function() {
    var state = new Array();
    state['restore'] = true;
    state['_advLookupMode'] = this._advLookupMode;
    state['_searchField'] = this._searchField.value;
    state['_searchFieldEnd'] = this._searchFieldEnd.value;
    state['_searchFieldIncludeArchived'] = SRAOS_Util.getSelectValue(this._searchFieldIncludeArchived);
    state['_searchFieldKeyword'] = this._searchFieldKeyword.value;
    state['_searchFieldOverdue'] = SRAOS_Util.getSelectValue(this._searchFieldOverdue);
    state['_searchFieldOwner'] = SRAOS_Util.getSelectValue(this._searchFieldOwner);
    state['_searchFieldParticipant'] = SRAOS_Util.getSelectValue(this._searchFieldParticipant);
    state['_searchFieldProjectId'] = this._searchFieldProjectId.value;
    state['_searchFieldProjectType'] = SRAOS_Util.getSelectValue(this._searchFieldProjectType);
    state['_searchFieldStart'] = this._searchFieldStart.value;
    state['_searchFieldStatus'] = SRAOS_Util.getSelectValue(this._searchFieldStatus);
    state['_selectedProjects'] = this._selectedProjects;
    state['searchPanelVisible'] = this._divLookup.style.visibility != 'hidden';
    state['viewToggleHidden'] = new Array();
    for(var i in this._viewToggles) {
      state['viewToggleHidden'][this._viewToggles[i].id] = this._viewToggles[i].isHidden();
    }
    state['activeTab'] = this._canvasTabSet.getActive();
    return state;
	};
	// }}}
  
  // {{{ getTask
  /**
   * returns the task identified by taskId
   * @param int taskId the id of the task to return
   * @access public
	 * @return Object
	 */
	this.getTask = function(taskId, tasks) {
    if (!tasks) { tasks = this._tasks; }
    
    for(var i in tasks) {
      if (tasks[i].taskId == taskId) { return tasks[i]; }
      if (tasks[i].subTasks) {
        var task = this.getTask(taskId, tasks[i].subTasks);
        if (task) { return task; }
      }
    }
    return null;
	};
	// }}}
  
  // {{{ getViewToggle
  /**
   * returns the view toggle identified by id
   * @param String id the id of the view toggle to return
   * @access public
	 * @return SRAOS_ViewToggle
	 */
	this.getViewToggle = function(id) {
    for(var i in this._viewToggles) {
      if (this._viewToggles[i].id == id) { return this._viewToggles[i]; }
    }
    return null;
	};
	// }}}
  
	// {{{ hideCalendarPopup
	/**
	 * starts the timer to hide the calendar popup
   * @access public
	 * @return void
	 */
  this.hideCalendarPopup = function() {
    this._hideCalendarPopupTimer = setTimeout("if (OS.getWindowInstance('" + this.win.getDivId() + "')) { OS.getWindowInstance('" + this.win.getDivId() + "').getManager().toggleCalendarPopup(true); }", MyProjects.HIDE_CALENDAR_POPUP_WAIT);
  };
  // }}}
  
	// {{{ hideProjectList
	/**
	 * starts the timer to hide the project list
   * @access public
	 * @return void
	 */
  this.hideProjectList = function() {
    this._hideProjectListTimer = setTimeout("if (OS.getWindowInstance('" + this.win.getDivId() + "')) { OS.getWindowInstance('" + this.win.getDivId() + "').getManager().toggleProjectList(true); }", MyProjects.HIDE_PROJECT_LIST_WAIT);
  };
  // }}}
  
	// {{{ icalSubscribe
	/**
	 * displays the information necessary to subscribe to ical feed for the 
   * selected saved search
   * @access public
	 * @return void
	 */
	this.icalSubscribe = function() {
    var search = MyProjects.getSavedSearch(this.win.getElementById('myProjectsSavedSearches').value);
    OS.msgBox(this.plugin.getString('MyProjects.icalSubscribeDescr', { search: search.name, icalUrl: SRAOS_Util.substituteParams(MyProjects.ICAL_WEBCAL_URL, { id: search.searchId }), url: SRAOS_Util.substituteParams(MyProjects.ICAL_URL, { id: search.searchId }) }), this.plugin.getString('MyProjects.icalSubscribeTitle', { search: search.name }), this.plugin.getIconUri(32, 'ical.png'));
	};
	// }}}
  
	// {{{ loadSavedSearch
	/**
	 * loads and processes a saved search. returns true on success
   * @param String name the name of the saved search to load
   * @access public
	 * @return boolean
	 */
  this.loadSavedSearch = function(name) {
    var search = MyProjects.getSavedSearch(name);
    if (search) {
      this._searchFieldEnd.value = search.end;
      this._searchFieldKeyword.value = search.keyword;
      SRAOS_Util.setSelectValue(this._searchFieldIncludeArchived, search.includeArchived);
      SRAOS_Util.setSelectValue(this._searchFieldOverdue, search.overdue);
      SRAOS_Util.setSelectValue(this._searchFieldOwner, search.owner);
      SRAOS_Util.setSelectValue(this._searchFieldParticipant, search.participant);
      this._searchFieldProjectId.value = search.projectId;
      SRAOS_Util.setSelectValue(this._searchFieldProjectType, search.projectType);
      this._searchFieldStart.value = search.start;
      SRAOS_Util.setSelectValue(this._searchFieldStatus, search.status);
      this._loadedSavedSearch = name;
      this.win.enableMenuItem('deleteSavedSearch');
      this.win.enableMenuItem('rssSubscribe');
      this.win.enableMenuItem('icalSubscribe');
      this.win.enableButton('btnDeleteSavedSearch');
      this.win.enableButton('btnRssSubscribe');
      this.win.enableButton('btnIcalSubscribe');
      this.searchAdv();
      return true;
    }
    this.win.disableMenuItem('deleteSavedSearch');
    this.win.disableMenuItem('rssSubscribe');
    this.win.disableMenuItem('icalSubscribe');
    this.win.disableButton('btnDeleteSavedSearch');
    this.win.disableButton('btnRssSubscribe');
    this.win.disableButton('btnIcalSubscribe');
    this._loadedSavedSearch = null;
    return false;
  };
  // }}}
  
  // {{{ newFile
  /**
   * displays the new file window
   * @param int projectId an optional id of a project that the new file should 
   * be associated to
   * @param int taskId an optional id of a task that the new file should be 
   * associated to
   * @access public
   * @return void
   */
  this.newFile = function(projectId, taskId) {
    this.win.getAppInstance().launchWindow('EditFile', { projectIds: projectId ? [ projectId ] : this._selectedProjects, taskId: taskId });
  };
  // }}}
  
  // {{{ newMessage
  /**
   * displays the new message window
   * @param int projectId an optional id of a project that the new message 
   * should be associated to
   * @param int taskId an optional id of a task that the new message should be 
   * associated to
   * @access public
   * @return void
   */
  this.newMessage = function(projectId, taskId) {
    this.win.getAppInstance().launchWindow('EditMessage', { projectIds: projectId ? [ projectId ] : this._selectedProjects, taskId: taskId });
  };
  // }}}
  
  // {{{ newProject
  /**
   * starts the new project wizard for the type specified
   * @param String type the new project type
   * @param Object params an optional set of initiation params for the project 
   * of the type specified. when valid and applicable, these will cause the 
   * first screen of the project creation wizard to be skipped
   * @access public
   * @return void
   */
  this.newProject = function(type, params) {
    if (this.win.getAppInstance().getFocusedWindow().getWindow().getId() == this.win.getWindow().getId()) {
      if (type && !params) { params = new Array(); }
      if (type) { params[MyProjectsNew.PROJECT_TYPE_KEY] = type; }
      this.win.getAppInstance().launchWindow('NewProject', params);
    }
  };
  // }}}
  
  // {{{ newTask
  /**
   * displays the new task window
   * @param int projectId an optional id of a project that the new task should 
   * be associated to
   * @param int taskId an optional id of a task that the new task should be a
   * sub task to
   * @access public
   * @return void
   */
  this.newTask = function(projectId, taskId) {
    this.win.getAppInstance().launchWindow('EditTask', { projectId: projectId, projectIds: projectId ? [ projectId ] : this._selectedProjects, taskId: taskId });
  };
  // }}}
  
  // {{{ newWhiteboard
  /**
   * displays the new whiteboard window
   * @param int projectId an optional id of a project that the new whiteboard 
   * should be associated to
   * @param int taskId an optional id of a task that the new whiteboard should 
   * be associated to
   * @access public
   * @return void
   */
  this.newWhiteboard = function(projectId, taskId) {
    this.win.getAppInstance().launchWindow('EditWhiteboard', { projectIds: projectId ? [ projectId ] : this._selectedProjects, taskId: taskId });
  };
  // }}}
  
	// {{{ onFocus
	/**
	 * this method is called when the the window is focused. return value is 
   * ignored
   * @access  public
	 * @return void
	 */
	this.onFocus = function() {
		this._divDashboardContent.style.overflow = 'auto';
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
    
    if (!MyProjects.LATE_STR) {
      MyProjects.LATE_STR = this.plugin.getString(MyProjects.SCHEDULE_LATE);
      MyProjects.UPCOMING_STR = this.plugin.getString(MyProjects.SCHEDULE_UPCOMING);
    }
    
    this._calendarPopup = this.win.getElementById('myProjectsCalendarPopup');
    this._calendarPopup._manager = this;
    
    this._dashboardCal1 = this.win.getElementById('myProjectsDashboardCalendar1');
    this._dashboardCal2 = this.win.getElementById('myProjectsDashboardCalendar2');
    this._dashboardCal3 = this.win.getElementById('myProjectsDashboardCalendar3');
    
    this._discussionGroupBy = this.win.getElementById('myProjectsDiscussionGroupBy');
    this._discussionHideOlder = this.win.getElementById('myProjectsDiscussionHideOlder');
    this._discussionShow = this.win.getElementById('myProjectsDiscussionShow');
    this._discussionShowFrom = this.win.getElementById('myProjectsDiscussionShowFrom');
    
    this._filesGroupBy = this.win.getElementById('myProjectsFilesGroupBy');
    this._filesSearch = this.win.getElementById('myProjectsFilesSearch');
    this._filesShowFrom = this.win.getElementById('myProjectsFilesShowFrom');
    SRAOS_Util.addOnEnterEvent(this._filesSearch, this, 'refreshFiles');
    
    this._tasksAssignedTo = this.win.getElementById('myProjectsTasksAssignedTo');
    this._tasksCalendar1 = this.win.getElementById('myProjectsTasksCalendar1');
    this._tasksGroupBy = this.win.getElementById('myProjectsTasksGroupBy');
    this._tasksShowFrom = this.win.getElementById('myProjectsTasksShowFrom');
    this._tasksShowLateUpcoming = this.win.getElementById('myProjectsTasksShowLateUpcoming');
    this._tasksStatus = this.win.getElementById('myProjectsTasksStatus');
    
    this._divDashboardLate = this.win.getElementById('myProjectsDashboardLate');
    this._divDashboardLateContainer = this.win.getElementById('myProjectsDashboardLateContainer');
    this._viewToggles.push(new SRAOS_ViewToggle(this._divDashboardLate, this.win.getElementById('myProjectsDashboardLateToggle'), 'myProjectsDashboardLateToggle'));
    this._divDashboardLatestActivity = this.win.getElementById('myProjectsDashboardLatestActivity');
    this._viewToggles.push(new SRAOS_ViewToggle(this._divDashboardLatestActivity, this.win.getElementById('myProjectsDashboardLatestActivityToggle'), 'myProjectsDashboardLatestActivityToggle'));
    this._divDashboardUpcoming = this.win.getElementById('myProjectsDashboardUpcoming');
    this._viewToggles.push(new SRAOS_ViewToggle(this._divDashboardUpcoming, this.win.getElementById('myProjectsDashboardUpcomingToggle'), 'myProjectsDashboardUpcomingToggle'));
    
    this._divLookup = this.win.getElementById("myProjectsLookup");
    this._divLookupAdv = this.win.getElementById("myProjectsLookupAdv");
    this._divLookupBasic = this.win.getElementById("myProjectsLookupBasic");
    this._divCanvas = this.win.getElementById("myProjectsCanvas");
    this._divDashboard = this.win.getElementById("myProjectsDashboard");
    this._divDashboardContent = this.win.getElementById("myProjectsDashboardContent");
    this._divDiscussion = this.win.getElementById("myProjectsDiscussion");
    this._divDiscussionContent = this.win.getElementById("myProjectsDiscussionContent");
    this._divNoSelection = this.win.getElementById("myProjectsNoSelection");
    this._divProjectList = this.win.getElementById("myProjectsList");
    this._divProjectList._manager = this;
    this.win.getDomElements({ 'className': 'myProjectsSelector' })[0]._manager = this;
    this._divTasks = this.win.getElementById("myProjectsTasks");
    this._divTasksContent = this.win.getElementById("myProjectsTasksContent");
    this._divFiles = this.win.getElementById("myProjectsFiles");
    this._divFilesContent = this.win.getElementById("myProjectsFilesContent");
    this._divFilesPopup = this.win.getElementById("myProjectsFilesPopup");
    
    this._vertDivider = this.win.getElementById("myProjectsVertDivider");
    this._vertDivider.onDragResetEnd = function() {
      OS.setMenuItemChecked('searchPanel', MyProjects.getManager()._divLookup.style.visibility != 'hidden');
    };
    var baseWidth = this._divLookup.offsetWidth - 3;
    this._divCanvas.style.width = (width - baseWidth) + "px";
    this._divCanvas.style.height = height + "px";
    this._divCanvas.style.left = baseWidth + "px";
    this._divLookup.style.width = (baseWidth - 2) + "px";
    this._vertDivider.style.left = (baseWidth - 2) + "px";
    this._vertDivider.style.height = "100%";
    var canvas = document.getElementById(this.win.getDivId());
    new SRAOS_Divider(this._vertDivider, canvas, 50, 300, false, new Array(this._divLookup), new Array(this._divCanvas), 1, 5);
    this._searchField = this.win.getElementById('myProjectsSearch');
    this._searchFieldEnd = this.win.getElementById('end');
    OS.addDateChooser(this._searchFieldEnd, this.win.getDivId() + 'endChooser', true, MyProjects.DATE_CHOOSER_FORMAT);
    this._searchFieldIncludeArchived = this.win.getElementById('includeArchived');
    this._searchFieldKeyword = this.win.getElementById('myProjectsKeyword');
    this._searchFieldOverdue = this.win.getElementById('overdue');
    this._searchFieldOwner = this.win.getElementById('owner');
    this._searchFieldParticipant = this.win.getElementById('partcipant');
    this._searchFieldProjectId = this.win.getElementById('projectId');
    this._searchFieldProjectType = this.win.getElementById('projectType');
    this._searchFieldStart = this.win.getElementById('start');
    OS.addDateChooser(this._searchFieldStart, this.win.getDivId() + 'startChooser', true, MyProjects.DATE_CHOOSER_FORMAT);
    
    SRAOS_DateChooser.renderCalendar(this._dashboardCal1, this._dashboardCalStart, this, false, false, [this._dashboardCal2, this._dashboardCal3]);
    var cal2Date = new Date(this._dashboardCalStart);
    cal2Date.incrementMonth();
    SRAOS_DateChooser.renderCalendar(this._dashboardCal2, cal2Date, this, true, true);
    var cal3Date = new Date(this._dashboardCalStart);
    cal3Date.incrementMonth(2);
    SRAOS_DateChooser.renderCalendar(this._dashboardCal3, cal3Date, this, true, true);
    
    SRAOS_DateChooser.renderCalendar(this._tasksCalendar1, this._dashboardCalStart, this);
    
    this._searchFieldStatus = this.win.getElementById('status');
    this._searchTabSet = new SRAOS_TabSet([new SRAOS_Tab(MyProjects.TAB_BASIC_SEARCH, this.plugin.getString('MyProjects.search'), this._divLookupBasic), new SRAOS_Tab(MyProjects.TAB_ADVANCED_SEARCH, this.plugin.getString('MyProjects.advancedSearch'), this._divLookupAdv)], this.win.getElementById('myProjectsSearchTabs'), OS.user.myProjectsSearchAdv && !this._advLookupMode ? MyProjects.TAB_ADVANCED_SEARCH : MyProjects.TAB_BASIC_SEARCH, this);
    
    this._selectedProjectLabel = this.win.getElementById('selectProjectLabel');
    
    this._canvasTabs = this.win.getElementById('myProjectsCanvasTabs');
    this._canvasTabSet = new SRAOS_TabSet([new SRAOS_Tab(MyProjects.TAB_DASHBOARD, this.plugin.getString('MyProjects.dashboard'), this._divDashboard), new SRAOS_Tab(MyProjects.TAB_DISCUSSION, this.plugin.getString('MyProjects.discussion'), this._divDiscussion), new SRAOS_Tab(MyProjects.TAB_TASKS, this.plugin.getString('MyProjects.tasks'), this._divTasks), new SRAOS_Tab(MyProjects.TAB_FILES, this.plugin.getString('MyProjects.files'), this._divFiles)], this._canvasTabs, this.params && this.params['restore'] && this.params['activeTab'] ? this.params['activeTab'] : MyProjects.TAB_DASHBOARD, this, null, 'activeTab');
    SRAOS_Util.addOnEnterEvent(this._searchField, this, 'search');
    SRAOS_Util.addOnEnterEvent(this._searchFieldEnd, this, 'searchAdv');
    SRAOS_Util.addOnEnterEvent(this._searchFieldKeyword, this, 'searchAdv');
    SRAOS_Util.addOnEnterEvent(this._searchFieldStart, this, 'searchAdv');
    SRAOS_Util.addOnEnterEvent(this._searchFieldProjectId, this, 'searchAdv');
    this._populateSavedSearches();
    
    this.updateUpcomingThreshold();
    
    // restore state
    var baseLookupMode = this._advLookupMode;
    if (this.params && this.params['restore']) {
      for(var i in this.params) {
        if (i.indexOf('_searchField') === 0) {
          if (i == '_searchFieldIncludeArchived' || i == '_searchFieldOverdue' || i == '_searchFieldOwner' || i == '_searchFieldParticipant' || i == '_searchFieldProjectType' || i == '_searchFieldStatus') {
            SRAOS_Util.setSelectValue(this[i], this.params[i]);
          }
          else {
            this[i].value = this.params[i];
          }
        }
        else if (i.indexOf('_') === 0) {
          this[i] = this.params[i];
        }
      }
      if (!this.params['searchPanelVisible']) {
        setTimeout('MyProjects.getManager().toggleSearchPanel()', 100);
      }
      if (this.params['viewToggleHidden']) {
        for (var i in this.params['viewToggleHidden']) {
          if (this.params['viewToggleHidden'][i]) {
            setTimeout('MyProjects.getManager().getViewToggle("' + i + '").hide()', 2000);
          }
        }
      }
    }
    else {
      setTimeout('MyProjects.getManager().toggleSearchPanel()', 100);
    }
    // set default tab
    if (this.params && this.params.tab) { this._canvasTabSet.setActive(this.params.tab); }
    // advanced lookup mode
    if (baseLookupMode != this._advLookupMode) {
      this._searchTabSet.setActive(this._advLookupMode ? IndiDesktop.TAB_ADVANCED_SEARCH : IndiDesktop.TAB_BASIC_SEARCH);
      this.params && this.params.projectId ? this.selectProject(this.params.projectId) : this.searchAdv(this.params && this.params['restore'] ? true : false);
    }
    else {
      this.params && this.params.projectId ? this.selectProject(this.params.projectId) : this.search(this.params && this.params['restore'] ? true : false);
    }
		return true;
	};
	// }}}
  
  // {{{ onResizeEnd
	/**
	 * this method is called when a window resize event is ended. return value is 
   * ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access public
	 * @return void
	 */
	this.onResizeEnd = function(height, width) {
    if (!this._skipNextResizeEnd && this._divCanvas && !this.win.isMaximized()) { 
      this._divCanvas.style.width = (width - this._divLookup.offsetWidth - 1) + "px";
      this._divCanvas.style.height = (height - 2) + "px";
    }
    else if (this.win.isMaximized()) {
      this._skipNextResizeEnd = true;
    }
    else if (this._skipNextResizeEnd) {
      this._skipNextResizeEnd = false;
    }
	};
	// }}}
  
	// {{{ onUnFocus
	/**
	 * this method is called when the the window is un-focused. return value is 
   * ignored.
   * @access  public
	 * @return void
	 */
	this.onUnFocus = function() {
		this._divDashboardContent.style.overflow = 'hidden';
	};
	// }}}
  
	// {{{ printMessage
	/**
	 * opens the print view for the message specified
   * @param int messageId the id of the message to print
   * @access public
	 * @return void
	 */
	this.printMessage = function(messageId) {
    OS.print(MyProjectsEditMessage.SERVICE_PRINT, messageId);
	};
	// }}}
  
	// {{{ refreshDiscussion
	/**
	 * refreshes the currently displayed discussion
   * @access private
	 * @return void
	 */
	this.refreshDiscussion = function() {
    if (this._canvasTabSet.getActive() == MyProjects.TAB_DISCUSSION) {
      if (this._discussionMessageId || this._discussionWhiteboardId) {
        MyProjects.setWaitMsg(this._divDiscussionContent, 'MyProjects.discussion.loading');
        OS.ajaxInvokeService(MyProjects.SERVICE_GET_DISCUSSION, this, '_refreshDiscussion', null, null, { id: this._discussionMessageId ? 'message:' + this._discussionMessageId : 'whiteboard:' + this._discussionWhiteboardId } );
        this._loadedTabs[MyProjects.TAB_DISCUSSION] = false;
      }
      else {
        var params = new Array();
        var projectIds = MyProjects.getProjectDropDownIds(this._discussionShowFrom);
        var categoryId = this._discussionShowFrom.value.indexOf(':') != -1 ? this._discussionShowFrom.value.split(':')[1] : null;
        if (projectIds.length > 0) {
          params['projectIds'] = projectIds;
          if (categoryId) { params['categoryId'] = categoryId; }
          if (this._discussionShow.value == 'messages') {
            params['messagesOnly'] = true;
          }
          else if (this._discussionShow.value == 'whiteboards') {
            params['whiteboardsOnly'] = true;
          }
          if (this._discussionHideOlder.value) {
            params['updatedWithin'] = this._discussionHideOlder.value;
          }
          MyProjects.setWaitMsg(this._divDiscussionContent, 'MyProjects.discussion.loading');
          OS.ajaxInvokeService(MyProjects.SERVICE_GET_DISCUSSION, this, '_refreshDiscussion', null, null, params);
        }
        else {
          this._divDiscussionContent.innerHTML = this._divNoSelection.innerHTML;
        }
      }
    }
    else {
      this._loadedTabs[MyProjects.TAB_DISCUSSION] = false;
    }
  };
  // }}}
  
	// {{{ refreshFiles
	/**
	 * refreshes the currently displayed files
   * @access private
	 * @return void
	 */
	this.refreshFiles = function() {
    if (this._canvasTabSet.getActive() == MyProjects.TAB_FILES) {
      var params = new Array();
      var projectIds = MyProjects.getProjectDropDownIds(this._filesShowFrom);
      var categoryId = this._filesShowFrom.value.indexOf(':') != -1 ? this._filesShowFrom.value.split(':')[1] : null;
      if (projectIds.length > 0) {
        params['versions'] = true;
        params['projectIds'] = projectIds;
        if (categoryId) { params['categoryId'] = categoryId; }
        if (SRAOS_Util.trim(this._filesSearch.value) != '') { params['search'] = SRAOS_Util.trim(this._filesSearch.value); }
        params['sortCol'] = OS.user.myProjectsFilesSortBy;
        params['sortDesc'] = OS.user.myProjectsFilesSortBy == 'name' ? false : true;
        MyProjects.setWaitMsg(this._divFilesContent, 'MyProjects.files.loading');
        OS.ajaxInvokeService(MyProjects.SERVICE_GET_FILES, this, '_refreshFiles', null, null, params);
      }
      else {
        this._divFilesContent.innerHTML = this._divNoSelection.innerHTML;
      }
    }
    else {
      this._loadedTabs[MyProjects.TAB_FILES] = false;
    }
  };
  // }}}
  
	// {{{ refreshProjectList
	/**
	 * invokes the ajax service request to refresh the project list based on the 
   * current _searchParam
   * @param boolean resetSelected whether or not to reset the current selected 
   * projects
   * @access private
	 * @return void
	 */
	this.refreshProjectList = function(resetSelected) {
    this._projects = new Array();
    this._resetSelected = resetSelected || this._selectedProjects.length == 0;
    if (resetSelected) { this._selectedProjects = new Array(); }
    this._divProjectList.innerHTML = '';
    this.win.setStatusBarText(this.plugin.getString('MyProjects.loadingProjects'));
    OS.ajaxInvokeService('myProjectsSearch', this, '_loadProjects', null, null, this._searchParams, ++this._searchCounter);
  };
  // }}}
  
	// {{{ refreshTasks
	/**
	 * refreshes the tasks panel
   * @access private
	 * @return void
	 */
	this.refreshTasks = function(resetSelected) {
    if (this._skipRefreshTasks) { return; }
    
    if (this._canvasTabSet.getActive() == MyProjects.TAB_TASKS) {
      this._tasks = null;
      this._renderCalendarDueDates(this._tasksCalendar1, new Array());
      if (this._tasksTaskId) {
        MyProjects.setWaitMsg(this._divTasksContent, 'MyProjects.tasks.loading');
        OS.ajaxInvokeService(MyProjects.SERVICE_GET_TASKS, this, '_refreshTasks', null, null, { files: true, hierarchy: true, messages: true, taskIds: [ this._tasksTaskId ], whiteboards: true });
        this._loadedTabs[MyProjects.TAB_TASKS] = false;
      }
      else {
        var params = new Array();
        var projectIds = MyProjects.getProjectDropDownIds(this._tasksShowFrom);
        if (projectIds.length > 0) {
          MyProjects.setWaitMsg(this._divTasksContent, 'MyProjects.tasks.loading');
          var params = { files: true, hierarchy: true, messages: true, projectIds: projectIds, status: this._tasksStatus.value, whiteboards: true };
          if (this._tasksAssignedTo.value != '') { 
            params['pid'] = this._tasksAssignedTo.value; 
          }
          else if (this._refreshingTasksAssignedTo && !this._lastSelectedAssignedAnyone) {
            params['pid'] = 'u' + OS.user.uid;
          }
          OS.ajaxInvokeService(MyProjects.SERVICE_GET_TASKS, this, '_refreshTasks', null, null, params);
        }
        else {
          this._divTasksContent.innerHTML = this._divNoSelection.innerHTML;
        }
      }
    }
    else {
      this._loadedTabs[MyProjects.TAB_TASKS] = false;
    }
  };
  // }}}
  
	// {{{ refreshTasksAssignedTo
	/**
	 * invokes the ajax service request to load the assigned to selector in the 
   * tasks tab based on the project selector selection
   * @access private
	 * @return void
	 */
	this.refreshTasksAssignedTo = function() {
    this._lastSelectedAssignedAnyone = this._tasksAssignedTo.selectedIndex == 1;
    SRAOS_Util.clearSelectField(this._tasksAssignedTo);
    SRAOS_Util.addOptionToSelectField(this._tasksAssignedTo, new Option(OS.getString('text.wait'), ''));
    OS.ajaxInvokeService(MyProjects.SERVICE_GET_PARTICIPANTS, this, '_refreshTasksAssignedTo', null, null, { permissions: MyProjects.PERMISSIONS_TASK_WRITE, projectId: MyProjects.getProjectDropDownIds(this._tasksShowFrom), skip: ['u' + OS.user.uid], types: MyProjects.PARTICIPANT_ALL });
    this._refreshingTasksAssignedTo = true;
  };
  // }}}
  
	// {{{ reloadComments
	/**
	 * reloads the comments for the id specified
   * @param String id the id of the message or whiteboard to reload the comments 
   * for (using the format 'message:[message id]' or 
   * 'whiteboard:[whiteboard id]'
   * @access public
	 * @return void
	 */
  this.reloadComments = function(id) {
    var div = this.win.getElementById('DiscussionGroupCommentsToggle' + id);
    if (div) {
      div._viewToggle.hide();
      div._viewToggle.show();
    }
  };
  // }}}
  
	// {{{ reloadDashboard
	/**
	 * reloads the entire dashboard
   * @access private
	 * @return void
	 */
  this.reloadDashboard = function() {
    MyProjects.getManager()._loadDashboardLateItems();
    setTimeout('MyProjects.getManager()._loadDashboardUpcomingItems()', 500);
    setTimeout('MyProjects.getManager()._loadDashboardCalendars()', 1000);
    setTimeout('MyProjects.getManager().reloadDashboardLatestActivity()', 1000);
  };
  // }}}
  
	// {{{ reloadDashboardLatestActivity
	/**
	 * invokes the ajax service loads the dashboard late items
   * @access private
	 * @return void
	 */
	this.reloadDashboardLatestActivity = function() {
    if (this._selectedProjects && this._selectedProjects.length) {
      MyProjects.setWaitMsg(this._divDashboardLatestActivity, 'MyProjects.dashboard.loadingLatestActivity');
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_LATEST_ACTIVITY, this, '_reloadDashboardLatestActivityResponse', null, null, { projectIds: this._selectedProjects });
    }
  };
  // }}}
  
	// {{{ renderCalendarEnd
	/**
	 * callback when a calendar has completed rendering
   * @param Date start 
   * @param Array tdElements
   * @param Array aElements
   * @param Object container 
   * @access public
	 * @return void
	 */
  this.renderCalendarEnd = function(start, tdElements, aElements, container) {
    this._tdElements[container.id] = tdElements;
    this._aElements[container.id] = aElements;
    if (container == this._dashboardCal3) {
      this._loadDashboardCalendars();
    }
    else if (container == this._tasksCalendar1) {
      this._loadTaskCalendars();
    }
  };
  // }}}
  
	// {{{ resetCalendarPopupTimer
	/**
	 * starts the timer to hide the project list
   * @access public
	 * @return void
	 */
  this.resetCalendarPopupTimer = function() {
    if (this._hideCalendarPopupTimer) {
      clearTimeout(this._hideCalendarPopupTimer);
      this._hideCalendarPopupTimer = null;
    }
  };
  // }}}
  
	// {{{ resetProjectListTimer
	/**
	 * starts the timer to hide the project list
   * @access public
	 * @return void
	 */
  this.resetProjectListTimer = function() {
    if (this._hideProjectListTimer) {
      clearTimeout(this._hideProjectListTimer);
      this._hideProjectListTimer = null;
    }
  };
  // }}}
  
	// {{{ rssSubscribe
	/**
	 * displays the information necessary to subscribe to rss feed for the 
   * selected saved search
   * @access public
	 * @return void
	 */
	this.rssSubscribe = function() {
    var search = MyProjects.getSavedSearch(this.win.getElementById('myProjectsSavedSearches').value);
    OS.msgBox(this.plugin.getString('MyProjects.rssSubscribeDescr', { search: search.name, rssUrl: SRAOS_Util.substituteParams(MyProjects.RSS_FEED_URL, { id: search.searchId }), url: SRAOS_Util.substituteParams(MyProjects.RSS_URL, { id: search.searchId }) }), this.plugin.getString('MyProjects.rssSubscribeTitle', { search: search.name }), this.plugin.getIconUri(32, 'rss.png'));
	};
	// }}}
  
	// {{{ saveSearch
	/**
	 * saves a search
   * @access public
	 * @return void
	 */
	this.saveSearch = function() {
    var searchName = OS.prompt(this.plugin.getString('MyProjects.enterSearchName'), this._loadedSavedSearch);
    if (searchName) {
      var search = MyProjects.getSavedSearch(searchName);
      this.win.setStatusBarText(this.plugin.getString('MyProjects.' + (search ? 'updatingSavedSearch' : 'creatingSavedSearch')) + ' ' + searchName);
      OS.ajaxInvokeService('myProjectsManageSavedSearches', this, '_saveSearch', null, new SRAOS_AjaxRequestObj(search ? search.searchId : null, { "name": searchName, "end": this._searchFieldEnd.value, "includeArchived": SRAOS_Util.getSelectValue(this._searchFieldIncludeArchived), "keyword": this._searchFieldKeyword.value, "participant": SRAOS_Util.getSelectValue(this._searchFieldParticipant), "owner": SRAOS_Util.getSelectValue(this._searchFieldOwner), "overdue": SRAOS_Util.getSelectValue(this._searchFieldOverdue), "projectId": this._searchFieldProjectId.value, "projectType": SRAOS_Util.getSelectValue(this._searchFieldProjectType), "start": this._searchFieldStart.value, "status": SRAOS_Util.getSelectValue(this._searchFieldStatus) }, search ? SRAOS_AjaxRequestObj.TYPE_UPDATE : SRAOS_AjaxRequestObj.TYPE_CREATE));
    }
	};
	// }}}
  
	// {{{ search
	/**
	 * performs a basic search
   * @param boolean noReset whether or not to reset the current selection
   * @access public
	 * @return void
	 */
	this.search = function(noReset) {
    this._searchParams = new Array(new SRAOS_AjaxServiceParam('search', "keyword=" + this._searchField.value));
    this._searchField.select();
    this.refreshProjectList(!noReset);
	};
	// }}}
  
	// {{{ searchAdv
	/**
	 * performs an advanced search
   * @param boolean noReset whether or not to reset the current selection
   * @access public
	 * @return void
	 */
	this.searchAdv = function(noReset) {
    var search = "";
    if (this._searchFieldEnd.value) { search += "\nended=" + this._searchFieldEnd.value + "\n"; }
    if (this._searchFieldIncludeArchived.selectedIndex > 0) { search += "\nincludeArchived=" + SRAOS_Util.getSelectValue(this._searchFieldIncludeArchived); }
    if (this._searchFieldOverdue.selectedIndex > 0) { search += "\noverdue=" + SRAOS_Util.getSelectValue(this._searchFieldOverdue); }
    if (this._searchFieldOwner.selectedIndex > 0) { search += "\nowner=" + SRAOS_Util.getSelectValue(this._searchFieldOwner); }
    if (this._searchFieldParticipant.selectedIndex > 0) { search += "\nparticipant=" + SRAOS_Util.getSelectValue(this._searchFieldParticipant); }
    if (this._searchFieldProjectId.value) { search += "\nprojectId=" + this._searchFieldProjectId.value; }
    if (this._searchFieldProjectType.selectedIndex > 0) { search += "\ntype=" + SRAOS_Util.getSelectValue(this._searchFieldProjectType); }
    if (this._searchFieldStart.value) { search += "\nstarted=" + this._searchFieldStart.value; }
    if (this._searchFieldStatus.selectedIndex != 0) { search += "\nstatus=" + SRAOS_Util.getSelectValue(this._searchFieldStatus); }
    if (this._searchFieldKeyword.value) { search += "\nkeyword=" + this._searchFieldKeyword.value; }
    this._searchParams = new Array(new SRAOS_AjaxServiceParam('search', search));
    this.refreshProjectList(!noReset);
	};
	// }}}
  
	// {{{ selectProject
	/**
	 * selects the project specified
   * @param int id the id of the project to select
   * @access public
	 * @return void
	 */
	this.selectProject = function(id) {
    var project = this.getProject(id);
    if (project) {
      for(var i in this._projects) {
        if (this._projects[i].projectId == id && !SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects)) {
          this._selectedProjects.push(this._projects[i].projectId);
          this.win.getElementById('_prj' + this._projects[i].projectId).checked = true;
        }
        else if (this._projects[i].projectId != id && SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects)) {
          this._selectedProjects = SRAOS_Util.removeFromArray(this._projects[i].projectId, this._selectedProjects);
          this.win.getElementById('_prj' + this._projects[i].projectId).checked = false;
        }
      }
      this._updateSelectAll();
      this._updateSelectType(-1);
      this._refreshDisplay();
    }
    else {
      this._searchParams = new Array(new SRAOS_AjaxServiceParam('search', "projectId=" + id + ";includeArchived=1;participant=NULL;status=NULL"));
      this.refreshProjectList(true);
    }
	};
	// }}}
  
	// {{{ subscribe
	/**
	 * subscribes the user to the discussion item specified
   * @param String id the discussion item id
   * @access  public
	 * @return void
	 */
	this.subscribe = function(id) {
    this.win.setStatusBarText(this.plugin.getString('MyProjects.subscribingUser'));
    OS.ajaxInvokeService(MyProjects.SERVICE_SUBSCRIBE, this, '_processAjaxResponse', null, null, { id: id });
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
    if (id == MyProjects.TAB_BASIC_SEARCH) {
      this._searchField.focus();
      this.win.disableMenuItem('saveSearch');
      this.win.disableMenuItem('deleteSavedSearch');
      this.win.disableMenuItem('rssSubscribe');
      this.win.disableMenuItem('icalSubscribe');
      this.win.disableButton('btnSaveSearch');
      this.win.disableButton('btnDeleteSavedSearch');
      this.win.disableButton('btnRssSubscribe');
      this.win.disableButton('btnIcalSubscribe');
      this._advLookupMode = false;
    }
    else if (id == MyProjects.TAB_ADVANCED_SEARCH) {
      this._searchFieldKeyword.focus();
      this.win.enableMenuItem('saveSearch');
      this.win.enableButton('btnSaveSearch');
      if (this._loadedSavedSearch) { 
        this.win.enableMenuItem('deleteSavedSearch'); 
        this.win.enableMenuItem('rssSubscribe');
        this.win.enableMenuItem('icalSubscribe');
        this.win.enableButton('btnDeleteSavedSearch'); 
        this.win.enableButton('btnRssSubscribe');
        this.win.enableButton('btnIcalSubscribe');
      }
      this._advLookupMode = true;
    }
    else {
      if (this._projects && !this._noProjectSelected && !this._loadedTabs[id]) {
        this._loadedTabs[id] = true;
        if (id == MyProjects.TAB_DASHBOARD) {
          this.reloadDashboard();
        }
        else if (id == MyProjects.TAB_DISCUSSION) {
          SRAOS_Util.clearSelectField(this._discussionShowFrom);
          SRAOS_Util.addOptionToSelectField(this._discussionShowFrom, new Option(OS.getString('text.wait'), ''));
          MyProjects.setWaitMsg(this._divDiscussionContent, 'MyProjects.discussion.loading');
          OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadMessageCategories', null, null, { projectIds: this._selectedProjects, messageOnly: true });
        }
        else if (id == MyProjects.TAB_TASKS) {
          MyProjects.populateProjectListDropDown(this._tasksShowFrom, true, true, null, MyProjects.PERMISSIONS_TASK_READ);
          this.refreshTasksAssignedTo();
          this.refreshTasks();
        }
        else if (id == MyProjects.TAB_FILES) {
          SRAOS_Util.clearSelectField(this._filesShowFrom);
          SRAOS_Util.addOptionToSelectField(this._filesShowFrom, new Option(OS.getString('text.wait'), ''));
          MyProjects.setWaitMsg(this._divFilesContent, 'MyProjects.files.loading');
          OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadFileCategories', null, null, { projectIds: this._selectedProjects, fileOnly: true });
        }
      }
      this._resetContentOverflow();
    }
	};
	// }}}
  
	// {{{ toggleCalendarPopup
	/**
	 * displays/hides the calendar popup
   * @param boolean hide whether or not to hide the calendar popup
   * @access public
	 * @return void
	 */
	this.toggleCalendarPopup = function(hide) {
    var newVis = hide !== false && (this._calendarPopup.style.visibility == 'visible' || hide === true) ? 'hidden' : 'visible';
    if (newVis != this._calendarPopup.style.visibility) {
      this._calendarPopup.style.visibility = newVis;
      this._resetContentOverflow();
    }
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
    // divId, discussionId
    if (id && id.divId && id.discussionId) {
      var div = this.win.getElementById(id.divId);
      MyProjects.setWaitMsg(div, 'MyProjects.discussion.loadingComments');
      var params = new Array();
      var tmp = id.discussionId.split(':');
      tmp[0] == 'message' ? params['messageId'] = tmp[1] : params['whiteboardId'] = tmp[1];
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_COMMENTS, this, '_loadComments', null, null, params, id.divId);
    }
	};
	// }}}
  
	// {{{ toggleProjectList
	/**
	 * displays/hides the project list
   * @param boolean hide whether or not to hide the project list
   * @access public
	 * @return void
	 */
	this.toggleProjectList = function(hide) {
    var newVis = hide !== false && (this._divProjectList.style.visibility == 'visible' || hide === true) ? 'hidden' : 'visible';
    if (newVis != this._divProjectList.style.visibility) {
      this._divProjectList.style.visibility = newVis;
      this._divProjectList.style.overflow = this._divProjectList.style.visibility == 'visible' ? 'auto' : 'hidden';
    }
	};
	// }}}
  
	// {{{ toggleProjectGroupSelection
	/**
	 * toggles selection of the projects in the project selector
   * @param boolean select whether to select or de-select the projects
   * @param String type an optional type filter
   * @access public
	 * @return void
	 */
	this.toggleProjectGroupSelection = function(select, type) {
    var refreshDisplay = false;
    for(var i in this._projects) {
      if (!type || type == this._projects[i].type || (type == 1 && !this._projects[i].type)) {
        if (!type) { this.win.getElementById('_prj_type' + this._projects[i].type).checked = select; }
        this.win.getElementById('_prj' + this._projects[i].projectId).checked = select;
        if ((select && !SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects)) || (!select && SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects))) {
          refreshDisplay = true;
          select ? this._selectedProjects.push(this._projects[i].projectId) : this._selectedProjects = SRAOS_Util.removeFromArray(this._projects[i].projectId, this._selectedProjects);
        }
      }
    }
    this._updateSelectAll();
    if (refreshDisplay) { this._refreshDisplay(); }
	};
	// }}}
  
	// {{{ toggleProjectSelection
	/**
	 * toggles selection of a project in the project selector
   * @param boolean select whether to select or de-select the project
   * @param int projectId the project id to select/de-select
   * @access public
	 * @return void
	 */
	this.toggleProjectSelection = function(select, projectId) {
    var project = this.getProject(projectId);
    if (project && ((select && !SRAOS_Util.inArray(projectId, this._selectedProjects)) || (!select && SRAOS_Util.inArray(projectId, this._selectedProjects)))) {
      select ? this._selectedProjects.push(projectId) : this._selectedProjects = SRAOS_Util.removeFromArray(projectId, this._selectedProjects);
      this._updateSelectAll();
      this._updateSelectType(project.type);
      this._refreshDisplay();
    }
	};
	// }}}
  
	// {{{ toggleSearchPanel
	/**
	 * used to toggle display of the search panel
   * @access public
	 * @return void
	 */
	this.toggleSearchPanel = function() {
    this._vertDivider.toggleShowHide();
	};
	// }}}
  
	// {{{ toggleSubscribe
	/**
	 * used as an action for the subscribe/unsubscribe discussion links
   * @access public
	 * @return void
	 */
	this.toggleSubscribe = function(id, href) {
    subscribe = href.innerHTML == this.plugin.getString('text.subscribe');
    href.innerHTML = this.plugin.getString('text.' + (subscribe ? 'unsubscribe': 'subscribe'));
    subscribe ? this.subscribe(id) : this.unsubscribe(id);
	};
	// }}}
  
	// {{{ treeNodeExpanded
	/**
	 * invoked when a non-leaf node with children is expanded
   * @param SRAOS_Tree tree the tree that the node has been expanded in
   * @param SRAOS_TreeNode node the node that was expanded
   * @access  public
	 * @return void
	 */
  this.treeNodeExpanded = function(tree, node) {
    if (node._task) { this._expandTaskIds.push(node._task.taskId); }
    return false;
  };
  // }}}
  
	// {{{ treeNodeRetracted
	/**
	 * invoked when a non-leaf node with children is retracted
   * @param SRAOS_Tree tree the tree that the node has been retracted in
   * @param SRAOS_TreeNode node the node that was retracted
   * @access  public
	 * @return void
	 */
  this.treeNodeRetracted = function(tree, node) {
    if (node._task) { this._expandTaskIds = SRAOS_Util.removeFromArray(node._task.taskId, this._expandTaskIds); }
    return false;
  };
  // }}}
  
	// {{{ unsubscribe
	/**
	 * unsubscribes the user from the discussion item specified
   * @param String id the discussion item id
   * @access  public
	 * @return void
	 */
	this.unsubscribe = function(id) {
    this.win.setStatusBarText(this.plugin.getString('MyProjects.unsubscribingUser'));
		OS.ajaxInvokeService(MyProjects.SERVICE_UNSUBSCRIBE, this, '_processAjaxResponse', null, null, { id: id });
	};
	// }}}
  
	// {{{ updateUpcomingThreshold
	/**
	 * updates the upcoming threshold
   * @access public
	 * @return void
	 */
	this.updateUpcomingThreshold = function() {
    this.win.getElementById("myProjectsDashboardUpcomingHeader").innerHTML = this.plugin.getString('MyProjects.dashboard.upcomingItems') + ' <font class="myProjectsNonBold">(' + this.plugin.getString('text.dueInTheNext') + ' ' + OS.user.myProjectsUpcomingThreshold + ' ' + (this.plugin.getString(OS.user.myProjectsUpcomingThreshold == 1 ? 'text.day' : 'text.days')) + ')</font>';
	};
	// }}}
  
	// {{{ viewMessage
	/**
	 * displays a popup window containing the details pertaining a message
   * @param int messageId the id of the message to display
   * @param boolean showComments whether or not to show the comments
   * @access public
	 * @return void
	 */
	this.viewMessage = function(messageId, showComments) {
    this._discussionMessageId = messageId;
    this._discussionShowComments = showComments;
    if (this._loadedTabs[MyProjects.TAB_DISCUSSION]) {
      this.refreshDiscussion();
    }
    else {
      this._canvasTabSet.setActive(MyProjects.TAB_DISCUSSION);
    }
	};
	// }}}
  
	// {{{ viewProject
	/**
	 * displays a popup window containing the details pertaining to the project 
   * specified. this popup window can also be used to edit the project details 
   * if the user has access to do so
   * @param int projectId the id of the project to display
   * @access public
	 * @return void
	 */
	this.viewProject = function(projectId) {
    if (projectId && projectId.projectId) { projectId = projectId.projectId; }
    
    this.toggleProjectList(true);
    this.toggleCalendarPopup(true);
    this.win.getAppInstance().launchWindow('ViewProject', { "projectId": projectId });
	};
	// }}}
  
	// {{{ viewTask
	/**
	 * displays a popup window containing the details pertaining to the task 
   * specified. this popup window can also be used to edit the task details if 
   * the user has access to do so
   * @param int taskId the id of the task to display
   * @param boolean showEditView whether or not to show the view/edit task 
   * popup instead of focusing the task on the task panel
   * @access public
	 * @return void
	 */
	this.viewTask = function(taskId, showEditView) {
    if (taskId && showEditView) {
      this.win.getAppInstance().launchWindow('EditTask', { id: taskId });
    }
    else {
      this._tasksTaskId = taskId;
      if (this._loadedTabs[MyProjects.TAB_TASKS]) {
        this.refreshTasks();
      }
      else {
        this._canvasTabSet.setActive(MyProjects.TAB_TASKS);
      }
    }
	};
	// }}}
  
	// {{{ viewWhiteboard
	/**
	 * displays a popup window containing the details pertaining a whiteboard
   * @param int whiteboardId the id of the whiteboard to display
   * @access public
	 * @return void
	 */
	this.viewWhiteboard = function(whiteboardId) {
    this._discussionWhiteboardId = whiteboardId;
    if (this._loadedTabs[MyProjects.TAB_DISCUSSION]) {
      this.refreshDiscussion();
    }
    else {
      this._canvasTabSet.setActive(MyProjects.TAB_DISCUSSION);
    }
	};
	// }}}
  
  
	// {{{ _activateWhiteboard
	/**
	 * handles an ajax invocation response for activating a whitboard
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._activateWhiteboard = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results[0].active) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToActivateWhiteboard'), response);
    }
    else {
      this.refreshDiscussion();
    }
  };
  // }}}
  
	// {{{ _completeProject
	/**
	 * handles ajax invocation response to completing a project
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._completeProject = function(response) {
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToUpdateProject'), response);
    }
    // success
    else if (response.results === true) {
      this.refreshProjectList();
    }
    // pending tasks exist
    else if (response.results === false) {
      if (this._canvasTabSet.getActive() != MyProjects.TAB_TASKS) {
        this.focusProjectTasks(response.requestId);
      }
      OS.displayErrorMessage(this.plugin.getString('text.mustCompleteFollowingTasks'));
    }
    // confirmation dialog
    else if (SRAOS_Util.isString(response.results)) {
      if (OS.confirm(response.results)) {
        this.win.syncWait(this.plugin.getString('MyProjects.completingProject'));
        OS.ajaxInvokeService(MyProjects.SERVICE_COMPLETE_PROJECT, this, '_completeProject', null, null, { projectId: response.requestId, confirmed: true }, response.requestId);
      }
    }
    // validation error
    else {
      var msg = '';
      for(var i in response.results) {
        msg += response.results[i] + '<br />';
      }
      OS.displayErrorMessage(msg);
    }
  };
  // }}}
  
	// {{{ _completeTask
	/**
	 * handles ajax invocation response to completing a task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._completeTask = function(response) {
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToUpdateTask'), response);
    }
    else {
      switch (response.results.status) {
        case MyProjects.COMPLETE_TASK_STATUS_CONFIRM : 
          if (OS.confirm(response.results.confirm)) {
            this.win.syncWait(this.plugin.getString('MyProjects.completingTask'));
            OS.ajaxInvokeService(MyProjects.SERVICE_COMPLETE_TASK, this, '_completeTask', null, null, { '_taskId': response.requestId, '_confirmed': true }, response.requestId);
          }
          break;
        case MyProjects.COMPLETE_TASK_STATUS_ERROR : 
          OS.displayErrorMessage(response.results.error);
          break;
        case MyProjects.COMPLETE_TASK_STATUS_SUCCESS : 
          this.refreshTasks();
          this.reloadDashboard();
          break;
        case MyProjects.COMPLETE_TASK_STATUS_FORM : 
        case MyProjects.COMPLETE_TASK_STATUS_VIEW : 
          this.win.getAppInstance().launchWindow('TaskForm', { confirm: response.results.confirm, form: response.results.view, task: this.getTask(response.requestId), view: response.results.status == MyProjects.COMPLETE_TASK_STATUS_VIEW });
          break;
      }
    }
  };
  // }}}
  
	// {{{ _deactivateWhiteboard
	/**
	 * handles an ajax invocation response for deactivating a whitboard
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deactivateWhiteboard = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeactivateWhiteboard'), response);
    }
    else {
      this.refreshDiscussion();
    }
  };
  // }}}
  
	// {{{ _deleteDiscussionComment
	/**
	 * handles an ajax invocation response for deleting a comment
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deleteDiscussionComment = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteComment'), response);
    }
    else {
      this.reloadComments(response.requestId);
      this.reloadDashboardLatestActivity();
    }
  };
  // }}}
  
	// {{{ _deleteDiscussionItem
	/**
	 * handles an ajax invocation response for deleting a discussion item
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deleteDiscussionItem = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteDiscussion'), response);
    }
    else {
      this.refreshDiscussion();
      this.reloadDashboardLatestActivity();
      this.refreshTasks();
    }
  };
  // }}}
  
	// {{{ _deleteFile
	/**
	 * handles an ajax invocation response for deleting a file
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._deleteFile = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToDeleteFile'), response);
    }
    else {
      this.refreshFiles();
      this.reloadDashboardLatestActivity();
    }
  };
  // }}}
  
	// {{{ _getLateTasks
	/**
	 * iterates through 'tasks' and returns all of those (including sub-tasks) 
   * that are late
   * @param Array tasks the tasks to iterate through
   * @param boolean noSort whether or not to sort the results on dueDateTime
   * @access private
	 * @return Array
	 */
	this._getLateTasks = function(tasks, noSort) {
    var late = new Array();
    for(var i in tasks) {
      if (tasks[i].late) { late.push(tasks[i]); }
      if (tasks[i].subTasks) { late = SRAOS_Util.arrayMerge(late, this._getLateTasks(tasks[i].subTasks, true)); }
    }
    if (!noSort) { late = SRAOS_Util.sort(late, 'dueDateTime'); }
    return late;
  };
  // }}}
  
	// {{{ _getTaskTreeNode
	/**
	 * builds an SRAOS_Tree object based on the task provided. the task tree 
   * allows expansion of a task to view sub-tasks, messages, whiteboards and 
   * files
   * @param Object task the task to build the task tree from (as returned by 
   * the MyProjects.SERVICE_GET_TASKS service)
   * @param String divId the dom id of the div where this tree will be rendered
   * @param boolean render whether or not to render the tree once it has been 
   * created
   * @access private
	 * @return SRAOS_Tree
	 */
  this._getTaskTreeNode = function(task) {
    var project = this.getProject(task.projectId);
    var children = new Array();
    
    if (task.subTasks) {
      for(var i in task.subTasks) {
        children.push(this._getTaskTreeNode(task.subTasks[i]));
      }
    }
    
    if (project && (project.getUserPermissions & MyProjects.PERMISSIONS_MESSAGE_READ)) {
      var messages = new Array();
      if (task.messages) {
        for(var i in task.messages) {
          messages.push(new SRAOS_TreeNode(task.taskId + '_messages_' + task.messages[i].messageId, MyProjects.renderMessageTitle(task.messages[i], true), false, this.plugin.getIconUri(16, 'message.png')));
        }
      }
      if (!task.readOnly && (project.getUserPermissions & MyProjects.PERMISSIONS_MESSAGE_WRITE) == MyProjects.PERMISSIONS_MESSAGE_WRITE) { messages.push(new SRAOS_TreeNode(task.taskId + '_messages_new', '<a href="#" onclick="OS.getWindowInstance(this).getManager().newMessage(' + task.projectId + ', ' + task.taskId + ')">' + this.plugin.getString('MyProjects.tasks.addMessage') + '</a>', false, this.plugin.getBaseUri() + '/images/add.png')); }
      children.push(new SRAOS_TreeNode(task.taskId + '_messages', this.plugin.getString('text.messages') + ' (' + (messages.length - 1) + ')', false, this.plugin.getIconUri(16, 'message.png'), messages));
    }
    
    if (project && (project.getUserPermissions & MyProjects.PERMISSIONS_WHITEBOARD_READ)) {
      var whiteboards = new Array();
      if (task.whiteboards) {
        for(var i in task.whiteboards) {
          whiteboards.push(new SRAOS_TreeNode(task.taskId + '_whiteboards_' + task.whiteboards[i].whiteboardId, MyProjects.renderWhiteboardTitle(task.whiteboards[i], true), false, this.plugin.getIconUri(16, 'whiteboard.png')));
        }
      }
      if (!task.readOnly && (project.getUserPermissions & MyProjects.PERMISSIONS_WHITEBOARD_WRITE) == MyProjects.PERMISSIONS_WHITEBOARD_WRITE) { whiteboards.push(new SRAOS_TreeNode(task.taskId + '_whiteboards_new', '<a href="#" onclick="OS.getWindowInstance(this).getManager().newWhiteboard(' + task.projectId + ', ' + task.taskId + ')">' + this.plugin.getString('MyProjects.tasks.addWhiteboard') + '</a>', false, this.plugin.getBaseUri() + '/images/add.png')); }
      children.push(new SRAOS_TreeNode(task.taskId + '_whiteboards', this.plugin.getString('text.whiteboards') + ' (' + (whiteboards.length - 1) + ')', false, this.plugin.getIconUri(16, 'whiteboard.png'), whiteboards));
    }
    
    if (project && (project.getUserPermissions & MyProjects.PERMISSIONS_FILE_READ)) {
      var files = new Array();
      if (task.files) {
        for(var i in task.files) {
          files.push(new SRAOS_TreeNode(task.taskId + '_files_' + task.files[i].fileId, MyProjects.renderFileName(task.files[i], true), false, task.files[i].icon));
        }
      }
      if (!task.readOnly && (project.getUserPermissions & MyProjects.PERMISSIONS_FILE_WRITE) == MyProjects.PERMISSIONS_FILE_WRITE) { files.push(new SRAOS_TreeNode(task.taskId + '_files_new', '<a href="#" onclick="OS.getWindowInstance(this).getManager().newFile(' + task.projectId + ', ' + task.taskId + ')">' + this.plugin.getString('MyProjects.tasks.addFile') + '</a>', false, this.plugin.getBaseUri() + '/images/add.png')); }
      children.push(new SRAOS_TreeNode(task.taskId + '_files', this.plugin.getString('text.files') + ' (' + (files.length - 1) + ')', false, this.plugin.getIconUri(16, 'file.png'), files));
    }
    
    if (!task.readOnly && (project.getUserPermissions & MyProjects.PERMISSIONS_TASK_WRITE) == MyProjects.PERMISSIONS_TASK_WRITE) { children.push(new SRAOS_TreeNode(task.taskId + '_subtasks_new', '<a href="#" onclick="OS.getWindowInstance(this).getManager().newTask(' + task.projectId + ', ' + task.taskId + ')">' + this.plugin.getString('MyProjects.tasks.addSubTask') + '</a>', false, this.plugin.getBaseUri() + '/images/add.png')); }
    var node = new SRAOS_TreeNode(task.taskId, MyProjects.renderTaskTitle(task, true, true, false, false, true, true), false, this.plugin.getIconUri(16, task.icon), children, task.taskId == this._tasksTaskId || SRAOS_Util.inArray(task.taskId, this._expandTaskIds));
    node._task = task;
    return node;
  };
  // }}}
  
	// {{{ _getUpcomingTasks
	/**
	 * iterates through 'tasks' and returns all of those (including sub-tasks) 
   * that are upcoming
   * @param Array tasks the tasks to iterate through
   * @param boolean noSort whether or not to sort the results on dueDateTime
   * @access private
	 * @return Array
	 */
	this._getUpcomingTasks = function(tasks, noSort) {
    var upcoming = new Array();
    for(var i in tasks) {
      if (tasks[i].upcoming) { upcoming.push(tasks[i]); }
      if (tasks[i].subTasks) { upcoming = SRAOS_Util.arrayMerge(upcoming, this._getUpcomingTasks(tasks[i].subTasks, true)); }
    }
    if (!noSort) { upcoming = SRAOS_Util.sort(upcoming, 'dueDateTime'); }
    return upcoming;
  };
  // }}}
  
	// {{{ _groupByDate
	/**
	 * groups an array of items by last updated date. each item in items must be a 
   * hash with an index value 'lastUpdated' which is a javascript Date object. 
   * this value will be used to create the grouping (the grouping will be based 
   * on day. it does not take into consideration hour/minute/second). the keys 
   * in the return hash will be the date label to use to represent the group
   * @param Array items the items to group
   * @access private
	 * @return Array
	 */
	this._groupByDate = function(items) {
    var groups = new Array();
    for(var i in items) {
      var dateStr;
      if (items[i].lastUpdated && items[i].lastUpdated.getPHPDate) {
        var today = new Date();
        if (today.getPHPDate('Ymd') == items[i].lastUpdated.getPHPDate('Ymd')) {
          dateStr = this.plugin.getString('text.today');
        }
        else {
          today.decrementDay();
          if (today.getPHPDate('Ymd') == items[i].lastUpdated.getPHPDate('Ymd')) {
            dateStr = this.plugin.getString('text.yesterday');
          }
          else {
            today.incrementDay(2);
            if (today.getPHPDate('Ymd') == items[i].lastUpdated.getPHPDate('Ymd')) {
              dateStr = this.plugin.getString('text.tomorrow');
            }
            else {
              dateStr = items[i].lastUpdated.getPHPDate(MyProjects.DATE_GROUP_FORMAT);
            }
          }
        }
      }
      else {
        dateStr = this.plugin.getString('text.unknown');
      }
      if (!groups[dateStr]) { groups[dateStr] = new Array(); }
      groups[dateStr].push(items[i]);
    }
    return groups;
  };
  // }}}
  
	// {{{ _groupByProject
	/**
	 * groups an array of items by project. each item in items must be a hash with 
   * an index value 'projectId'. this value will be used to create the grouping
   * the keys in the return hash will be the project names
   * @param Array items the items to group
   * @param boolean useProjectId whether or not to use the project id as the 
   * hash index in the returned array
   * @param boolean includeCheckbox whether or not to append the project 
   * checkbox to the project names keys
   * @param boolean includeLink whether or not to link the project name
   * @access private
	 * @return Array
	 */
	this._groupByProject = function(items, useProjectId, includeCheckbox, includeLink) {
    var groups = new Array();
    for(var i in items) {
      var project = this.getProject(items[i].projectId);
      var key = useProjectId ? project.projectId : (project ? MyProjects.renderProjectName(project, includeLink, false, true, false, includeCheckbox) : this.plugin.getString('text.unknown'));
      if (!groups[key]) { groups[key] = new Array(); }
      groups[key].push(items[i]);
    }
    return groups;
  };
  // }}}
  
	// {{{ _groupByProjectType
	/**
	 * groups an array of items by project type. each item in items must be a hash 
   * with an index value 'projectId'. this value will be used to create the 
   * grouping. the keys in the return hash will be the project type labels
   * @param Array items the items to group
   * @access private
	 * @return Array
	 */
	this._groupByProjectType = function(items) {
    var groups = new Array();
    for(var i in items) {
      var project = this.getProject(items[i].projectId);
      var key = project && project.typeStr ? project.typeStr : this.plugin.getString('MyProject');
      if (!groups[key]) { groups[key] = new Array(); }
      groups[key].push(items[i]);
    }
    return groups;
  };
  // }}}
  
	// {{{ _groupByStatus
	/**
	 * groups an array of items by status. each item in items must be a hash with 
   * an index value 'status'. this value will be used to create the grouping. 
   * the keys in the return hash will be the status labels
   * @param Array items the items to group
   * @access private
	 * @return Array
	 */
	this._groupByStatus = function(items) {
    var groups = new Array();
    for(var i in items) {
      var key = this.plugin.getString('text.status.' + (items[i].status != 'wait' ? items[i].status : MyProjects.STATUS_ACTIVE));
      if (!groups[key]) { groups[key] = new Array(); }
      groups[key].push(items[i]);
    }
    return groups;
  };
  // }}}
  
	// {{{ _loadCalendars
	/**
	 * handles an ajax invocation response for loading calendars (task or 
   * dashboard)
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadCalendars = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString(response.requestId), response);
    }
    else {
      var calendar1 = null;
      var calendar2 = null;
      var calendar3 = null;
      if (response.requestId == 'dashboard') {
        calendar1 = this._dashboardCal1;
        calendar2 = this._dashboardCal2;
        calendar3 = this._dashboardCal3;
      }
      
      if (calendar1 && calendar2 && calendar3) {
        this._renderCalendarDueDates(calendar1, MyProjects.groupDueDatesByDay(response.results, calendar1.getStartDate().getTime(), calendar2.getStartDate().getTime()));
        this._renderCalendarDueDates(calendar2, MyProjects.groupDueDatesByDay(response.results, calendar2.getStartDate().getTime(), calendar2.getEndDate().getTime()));
        this._renderCalendarDueDates(calendar3, MyProjects.groupDueDatesByDay(response.results, calendar3.getStartDate().getTime(), calendar3.getEndDate().getTime()));
      }
    }
  };
  // }}}
  
	// {{{ _loadComments
	/**
	 * renders the comments
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadComments = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadDiscussion'), response);
    }
    else {
      var div = this.win.getElementById(response.requestId);
      if (div) {
        if (response.results.length > 0) {
          var html = '';
          for(var i in response.results) {
            var comment = response.results[i];
            html += '<div class="myProjectsCommentContainer' + ((i%2)!=0 ? ' myProjectsAltBg' : '') + '">\n';
            if (!comment.readOnly) { 
              html += '<span><a href="#" onclick="OS.getWindowInstance(this).getManager().deleteDiscussionComment(' + response.results[i].commentId + ', ' + response.results[i].messageId + ', ' + response.results[i].whiteboardId + ')">' + this.plugin.getString('text.delete') + '</a></span>\n'; 
            }
            html += '<h5>' + this.plugin.getString(comment.lastUpdated.getTime() > comment.created.getTime() ? 'text.updatedBy' : 'text.addedBy') + ' ' + comment.lastUpdatedBy + ' '; 
            html += this.plugin.getString('text.on') + ' ' + comment.lastUpdated.getPHPDate(MyProjects.DATE_MESSAGE_FORMAT);
            html += '</h5>\n';
            html += '<table><tr>\n';
            if (comment.thumbnailUri) { html += '<td><img alt="' + comment.createdBy + '" src="' + comment.thumbnailUri + '" title="' + comment.createdBy + '" /></td>\n'; }
            html += '<td>' + comment.commentHtml + '</td>\n';
            html += '</tr></table>\n';
            if (comment.files) {
              html += '<div class="myProjectsDiscussionLinks">\n';
              for(var n in comment.files) {
                html += '<div style="background-image: url(' + comment.files[n].icon + ')"><a href="' + comment.files[n].uri + '" target="newWindow">' + comment.files[n].name + '</a></div>\n';
              }
              html += '</div>\n';
            }
            html += '</div>\n';
          }
          div.innerHTML = html;
        }
        else {
          div.innerHTML = this.plugin.getString('MyProjects.discussion.noComments');
        }
        this.win.getElementById(response.requestId + 'Header').innerHTML = response.results.length + ' ' + this.plugin.getString(response.results.length != 1 ? 'text.comments' : 'text.comment').toLowerCase();
      }
    }
  };
  // }}}
  
	// {{{ _loadDashboardCalendars
	/**
	 * invokes the ajax service loads the dashboard calendars
   * @access private
	 * @return void
	 */
	this._loadDashboardCalendars = function() {
    if (this._selectedProjects && this._selectedProjects.length) {
      this.win.setStatusBarText(this.plugin.getString('MyProjects.loadingDashboardCalendars'));
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_DUE_DATES, this, '_loadCalendars', null, null, { projectIds: this._selectedProjects, end: this._dashboardCal3.getEndDate(), start: this._dashboardCal1.getStartDate() }, 'dashboard');
    }
    else {
      this._renderCalendarDueDates(this._dashboardCal1, new Array());
      this._renderCalendarDueDates(this._dashboardCal2, new Array());
      this._renderCalendarDueDates(this._dashboardCal3, new Array());
    }
  };
  // }}}
  
	// {{{ _loadDashboardLateItems
	/**
	 * invokes the ajax service loads the dashboard late items
   * @access private
	 * @return void
	 */
	this._loadDashboardLateItems = function() {
    if (this._selectedProjects && this._selectedProjects.length) {
      this._divDashboardLateContainer.style.position = 'static';
      this._divDashboardLateContainer.style.visibility = 'inherit';
      MyProjects.setWaitMsg(this._divDashboardLate, 'MyProjects.dashboard.loadingLateItems');
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_DUE_DATES, this, '_loadDashboardLateItemsResponse', null, null, { projectIds: this._selectedProjects, lateOnly: true });
    }
  };
  // }}}
  
	// {{{ _loadDashboardLateItemsResponse
	/**
	 * responds to the ajax service invocation to load the dashboard late items
   * @access private
	 * @return void
	 */
	this._loadDashboardLateItemsResponse = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString(response.requestId), response);
    }
    else {
      if (response.results.length > 0) {
        this._divDashboardLateContainer.style.position = 'static';
        this._divDashboardLateContainer.style.visibility = 'inherit';
        this._divDashboardLate.innerHTML = MyProjects.renderDueDates(response.results, null, true);
        this._resetContentOverflow();
      }
      else {
        this._divDashboardLate.innerHTML = '';
        this._divDashboardLateContainer.style.position = 'absolute';
        this._divDashboardLateContainer.style.visibility = 'hidden';
      }
    }
  };
  // }}}
  
	// {{{ _loadTaskCalendars
	/**
	 * invokes the ajax service loads the task calendars
   * @access private
	 * @return void
	 */
	this._loadTaskCalendars = function() {
    if (this._tasks) {
      var tasks = new Array();
      for(var i in this._tasks) {
        if (this._tasks[i].status != MyProjects.STATUS_COMPLETED) {
          tasks.push(this._tasks[i]);
        }
      }
      this._renderCalendarDueDates(this._tasksCalendar1, MyProjects.groupDueDatesByDay(tasks, this._tasksCalendar1.getStartDate().getTime(), this._tasksCalendar1.getEndDate().getTime(), 'subTasks'), MyProjects.groupDueDatesByDay(tasks, this._tasksCalendar1.getStartDate().getTime(), this._tasksCalendar1.getEndDate().getTime(), 'subTasks', true));
    }
  };
  // }}}
  
	// {{{ _loadDashboardUpcomingItems
	/**
	 * invokes the ajax service loads the dashboard late items
   * @access private
	 * @return void
	 */
	this._loadDashboardUpcomingItems = function() {
    if (this._selectedProjects && this._selectedProjects.length) {
      MyProjects.setWaitMsg(this._divDashboardUpcoming, 'MyProjects.dashboard.loadingUpcomingItems');
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_DUE_DATES, this, '_loadDashboardUpcomingItemsResponse', null, null, { projectIds: this._selectedProjects, upcomingOnly: true });
    }
  };
  // }}}
  
	// {{{ _loadDashboardUpcomingItemsResponse
	/**
	 * responds to the ajax service invocation to load the dashboard late items
   * @access private
	 * @return void
	 */
	this._loadDashboardUpcomingItemsResponse = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString(response.requestId), response);
    }
    else {
      if (response.results.length > 0) {
        this._divDashboardUpcoming.innerHTML = this._renderUpcoming(response.results);
        this._resetContentOverflow();
      }
      else {
        this._divDashboardUpcoming.innerHTML = OS.getString('text.none');
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
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadFileCategories'), response);
    }
    else {
      MyProjects.populateProjectListDropDown(this._filesShowFrom, true, true, response.results, MyProjects.PERMISSIONS_FILE_READ, this._selectedProjects);
      this.refreshFiles();
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
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadMessageCategories'), response);
    }
    else {
      MyProjects.populateProjectListDropDown(this._discussionShowFrom, true, true, response.results, MyProjects.PERMISSIONS_MESSAGE_READ, this._selectedProjects);
      this.refreshDiscussion();
    }
  };
  // }}}
  
	// {{{ _loadProjects
	/**
	 * handles an ajax invocation response to load projects
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._loadProjects = function(response) {
    if (response.requestId == this._searchCounter) {
      this.win.clearStatusBarText();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this.plugin.getString('MyProjects.error.searchFailed'), response);
      }
      else {
        this._projects = response.results;
        this._numProjects = SRAOS_Util.getLength(this._projects);
        var projectSelectorHtml = '<h4><input id="' + this.win.getDivId() + '_prj_all" onchange="MyProjects.getManager().toggleProjectGroupSelection(this.checked)" type="checkbox" />' + this.plugin.getString('MyProjects.allProjects') + '</h4>\n\n';
        if (this._numProjects > 0) {
          var prevType = -1;
          for(var i in this._projects) {
            if (prevType != this._projects[i].type) {
              if (prevType != -1) { projectSelectorHtml += '</div>\n\n'; }
              prevType = this._projects[i].type;
              projectSelectorHtml += '<h3 style="background-image:url(' + this._projects[i].icon16 + ')"><input id="' + this.win.getDivId() + '_prj_type' + this._projects[i].type + '" onchange="MyProjects.getManager().toggleProjectGroupSelection(this.checked, \'' + (this._projects[i].type ? this._projects[i].type : 1) + '\')" type="checkbox" />' + this._projects[i].typeStr + '</h3>\n<div>';
            }
            projectSelectorHtml += '  <input id="' + this.win.getDivId() + '_prj' + this._projects[i].projectId + '"' + (this._resetSelected || SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects) ? ' checked="checked"' : '') + ' onchange="MyProjects.getManager().toggleProjectSelection(this.checked, ' + this._projects[i].projectId + ')" type="checkbox" />' + MyProjects.renderProjectName(this._projects[i], true, true) + '<br />\n';
            if (this._resetSelected) { this._selectedProjects.push(this._projects[i].projectId); }
          }
          projectSelectorHtml += '</div>';
        }
        this._divProjectList.innerHTML = this._numProjects == 0 ? '<div class="noProjectsMsg">' + this.plugin.getString('MyProjects.noMatchingProjects') + '</div>' : projectSelectorHtml;
        this._selectedProjectLabel.innerHTML = this._numProjects + ' ' + OS.getString('text.of') + ' ' + this._numProjects + ' ' + this.plugin.getString(this._numProjects != 1 ? 'MyProjects.projectsSelected' : 'MyProjects.projectSelected');
      }
      if (!this._resetSelected) {
        // remove any project ids that are no longer valid
        for(var i in this._selectedProjects) {
          if (!this.getProject(this._selectedProjects[i])) {
            this._selectedProjects = SRAOS_Util.removeFromArray(this._selectedProjects[i], this._selectedProjects);
          }
        }
      }
      this._updateSelectAll();
      this._updateSelectType(-1);
      this._refreshDisplay();
    }
  };
  // }}}
  
	// {{{ _populateSavedSearches
	/**
	 * populate the saves search selector
   * @access private
	 * @return void
	 */
	this._populateSavedSearches = function() {
    var savedSearchesInput = this.win.getElementById('myProjectsSavedSearches');
    SRAOS_Util.clearSelectField(savedSearchesInput);
    
    var options = new Array(new Option(OS.getString('form.select'), ''));
    for(var i in OS.user.myProjectsSavedSearches) {
      options.push(new Option(OS.user.myProjectsSavedSearches[i].name, OS.user.myProjectsSavedSearches[i].name));
    }
    SRAOS_Util.addOptionsToSelectField(savedSearchesInput, options);
	};
	// }}}
  
	// {{{ _processAjaxResponse
	/**
	 * generically handles an ajax invocation response
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._processAjaxResponse = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString(response.requestId), response);
    }
  };
  // }}}
  
	// {{{ _refreshDiscussion
	/**
	 * renders the discussion tab content based on the response provided
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._refreshDiscussion = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadDiscussion'), response);
    }
    else {
      this._discussion = response.results;
      this._renderDiscussionPanel();
      this._discussionMessageId = null;
      this._discussionShowComments = null;
      this._discussionWhiteboardId = null;
    }
  };
  // }}}
  
	// {{{ _refreshDisplay
	/**
	 * refreshes the dashboard, discussion, tasks, and files panels based on the 
   * current project selection
   * @access private
	 * @return void
	 */
	this._refreshDisplay = function() {
    this._divNoSelection.style.visibility = 'hidden';
    this._loadedTabs = new Array();
    this._selectedProjectLabel.innerHTML = this._selectedProjects.length + ' ' + OS.getString('text.of') + ' ' + this._numProjects + ' ' + this.plugin.getString(this._numProjects != 1 ? 'MyProjects.projectsSelected' : 'MyProjects.projectSelected');
    if (this._selectedProjects.length > 0) {
      this._noProjectSelected = false;
      this.tabActivated(this._canvasTabSet.getActive());
      this.win.enableMenuItem('newMessage');
      this.win.enableMenuItem('newWhiteboard');
      this.win.enableMenuItem('newTask');
      this.win.enableMenuItem('newFile');
      this.win.enableButton('btnNewMessage');
      this.win.enableButton('btnNewWhiteboard');
      this.win.enableButton('btnNewTask');
      this.win.enableButton('btnNewFile');
    }
    else if (!this._noProjectSelected) {
      this._noProjectSelected = true;
      this._divNoSelection.style.visibility = 'inherit';
      this._resetContentOverflow();
      this.win.disableMenuItem('newMessage');
      this.win.disableMenuItem('newWhiteboard');
      this.win.disableMenuItem('newTask');
      this.win.disableMenuItem('newFile');
      this.win.disableButton('btnNewMessage');
      this.win.disableButton('btnNewWhiteboard');
      this.win.disableButton('btnNewTask');
      this.win.disableButton('btnNewFile');
    }
    else {
      return;
    }
  };
  // }}}
  
	// {{{ _refreshFiles
	/**
	 * renders the files tab content based on the response provided
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._refreshFiles = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadFiles'), response);
    }
    else {
      this._files = response.results;
      this._renderFilesPanel();
    }
  };
  // }}}
  
	// {{{ _refreshTasks
	/**
	 * renders the tasks tab content based on the response provided
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._refreshTasks = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadTasks'), response);
    }
    else {
      this._tasks = response.results;
      this._renderTasksPanel();
      this._tasksTaskId = null;
    }
    this._loadTaskCalendars();
  };
  // }}}
  
	// {{{ _refreshTasksAssignedTo
	/**
	 * renders the tasks tab assigned to selector
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._refreshTasksAssignedTo = function(response) {
    this._refreshingTasksAssignedTo = false;
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToLoadParticipants'), response);
    }
    else {
      var options = new Array();
      options.push(new Option(this.plugin.getString('text.me'), 'u' + OS.user.uid));
      options.push(new Option(this.plugin.getString('text.anyone'), ''));
      if (SRAOS_Util.getLength(response.results) > 0) {
        for(var i in response.results) {
          options.push(new Option(response.results[i].label, response.results[i].pid));
        }
      }
      SRAOS_Util.clearSelectField(this._tasksAssignedTo);
      SRAOS_Util.addOptionsToSelectField(this._tasksAssignedTo, options);
      if (this._lastSelectedAssignedAnyone) { this._tasksAssignedTo.selectedIndex = 1; }
    }
  };
  // }}}
  
	// {{{ _reloadDashboardLatestActivityResponse
	/**
	 * responds to the ajax service invocation to load the dashboard late items
   * @access private
	 * @return void
	 */
	this._reloadDashboardLatestActivityResponse = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString(response.requestId), response);
    }
    else {
      if (response.results.length > 0) {
        var html = '';
        var renderedPids = new Array();
        for(var i=0; i<response.results.length; i++) {
          if (!SRAOS_Util.inArray(response.results[i]['projectId'], renderedPids)) {
            renderedPids.push(response.results[i]['projectId']);
            var pid = response.results[i]['projectId'];
            var rowCount = 0;
            html += MyProjects.renderProjectName(this.getProject(pid), true, false, true, true);
            html += '<div class="myProjectsLatestActivityContainer"><table>';
            for(var n=i; n<response.results.length; n++) {
              if (response.results[n]['projectId'] == pid) {
                var renderFullDate = false;
                html += '<tr' + ((rowCount % 2) != 0 ? ' class="myProjectsAltBg"' : '') + '>';
                var type = response.results[n]['commentId'] ? 'MyProjectComment' : (response.results[n]['fileId'] ? 'MyProjectFile' : (response.results[n]['messageId'] ? 'MyProjectMessage' : (response.results[n]['whiteboardId'] ? 'MyProjectWhiteboard' : 'MyProjectTask')));
                html += '<th class="myProjectsLatestActivityIcon"><img alt="' + this.plugin.getString(type) + '" src="' + (response.results[n]['iconUri'] ? response.results[n]['iconUri'] : this.plugin.getIconUri(16, response.results[n]['icon'])) + '" title="' + this.plugin.getString(type) +'" /></th>';
                html += '<th class="myProjectsLatestActivityDays' + (response.results[n]['daysAgo']==0 ? ' myProjectsLatestActivityToday' : '') + '">';
                var daysAgo = response.results[n]['daysAgo'] * 1;
                html += daysAgo==0 ? this.plugin.getString('text.today') : (daysAgo==1 ? this.plugin.getString('text.yesterday') : ((daysAgo%7)==0 ? daysAgo/7 : daysAgo) + ' ' + (this.plugin.getString('text.' + (daysAgo==7 ? 'week' : ((daysAgo%7)==0 ? 'weeks' : 'days')))) + ' ' + this.plugin.getString('text.ago'));
                html += '</th>';
                html += '<th class="myProjectsLatestActivityDate' + (daysAgo==0 ? ' myProjectsLatestActivityToday' : '') + '">';
                html += response.results[n]['lastUpdated'].getPHPDate(MyProjects.DATE_FORMAT);
                html += '</th>';
                html += '<td class="myProjectsLatestActivityTitle">';
                html += response.results[n]['fileId'] ? MyProjects.renderFileName(response.results[n], true) : (response.results[n]['messageId'] ? MyProjects.renderMessageTitle(response.results[n], true) : (response.results[n]['taskId'] ? MyProjects.renderTaskTitle(response.results[n], true) : MyProjects.renderWhiteboardTitle(response.results[n], true)));
                html += '</td>';
                html += '<td class="myProjectsLatestActivityName">' + response.results[n]['lastUpdatedBy'] + '</td>';
                html += '</tr>';
                rowCount++;
              }
            }
            html += '</table></div>';
          }
        }
        this._divDashboardLatestActivity.innerHTML = html;
        this._resetContentOverflow();
      }
      else {
        this._divDashboardLatestActivity.innerHTML = OS.getString('text.none');
      }
    }
  };
  // }}}
  
	// {{{ _renderCalendarDueDates
	/**
	 * renders the due dates into the calendar
   * @param Object calendar the container for the calendar to render the due 
   * dates in
   * @param Array dueDates a hash of due dates (as returned from 
   * MyProjects.SERVICE_GET_DUE_DATES indexed by month day)
   * @param Array startDates an optional hash of start dates
   * @access private
	 * @return void
	 */
	this._renderCalendarDueDates = function(calendar, dueDates, startDates) {
    if (calendar) {
      var aElements = this._aElements[calendar.id];
      var tdElements = this._tdElements[calendar.id];
      if (aElements && tdElements) {
        var styles = new Array();
        for(var i in dueDates) {
          for(var n in dueDates[i]) {
            var style = dueDates[i][n].late ? 'myProjectsDueDateLate' : (dueDates[i][n].upcoming ? 'myProjectsDueDateUpcoming' : 'myProjectsDueDate');
            styles[i] = !styles[i] || style == 'myProjectsDueDateLate' || (style == 'myProjectsDueDateUpcoming' && styles[i] == 'myProjectsDueDate') ? style : styles[i];
          }
        }
        if (startDates) {
          for(var i in startDates) {
            for(var n in startDates[i]) {
              if (!styles[i]) { styles[i] = 'myProjectsStartDate'; }
            }
          }
        }
        for(var i in aElements) {
          aElements[i]._dueDates = dueDates[i] ? dueDates[i] : null;
          aElements[i]._startDates = startDates && startDates[i] ? startDates[i] : null;
          aElements[i]._myProjects = dueDates[i] || (startDates && startDates[i]) ? this : null;
          if (aElements[i]._myProjects) {
            aElements[i].onclick = MyProjects.displayCalendarDueDates;
            aElements[i].setAttribute('onmouseover', dueDates[i] || (startDates && startDates[i]) ? 'if (this._myProjects) { this._myProjects.resetCalendarPopupTimer(); }' : null);
            aElements[i].setAttribute('onmouseout', dueDates[i] || (startDates && startDates[i]) ? 'if (this._myProjects) { this._myProjects.hideCalendarPopup(); }' : null);
          }
        }
        for(var i in tdElements) {
          tdElements[i].className = styles[i] ? styles[i] : null;
        }
      }
    }
  };
  // }}}
  
  // {{{ _renderDiscussionPanel
  /**
   * renders the discussion panel
   * @access public
   * @return void
   */
  this._renderDiscussionPanel = function() {
    if (this._discussion && this._discussion.length > 0) {
      var html = '';
      if (this._discussionMessageId || this._discussionWhiteboardId) {
        html += '<div class="showAllDiscussionLink"><a href="#" onclick="OS.getWindowInstance(this).getManager().refreshDiscussion()">' + this.plugin.getString('MyProjects.showAllDiscussion') + '</a></div>\n';
      }
      else {
        this._loadedTabs[MyProjects.TAB_DISCUSSION] = true;
      }
      
      var groups = this._discussionGroupBy.value == 'date' ? this._groupByDate(this._discussion) : (this._discussionGroupBy.value == 'type' ? this._groupByProjectType(this._discussion) : this._groupByProject(this._discussion));
      html += this._renderGroups(groups, '_renderDiscussionPanelGroup', 'myProjectsDiscussion');
      this._divDiscussionContent.innerHTML = html;
      
      for(var i in groups) {
        for(var n in groups[i]) {
          var id = groups[i][n].messageId ? 'message:' + groups[i][n].messageId : 'whiteboard:' + groups[i][n].whiteboardId;
          var toggle = new SRAOS_ViewToggle(this.win.getElementById('DiscussionGroupComments' + id), this.win.getElementById('DiscussionGroupCommentsToggle' + id), { divId: 'DiscussionGroupComments' + id, discussionId: id }, true, false, this);
          if ((this._discussionMessageId && this._discussionMessageId == groups[i][n].messageId && this._discussionShowComments) || (this._discussionWhiteboardId && this._discussionWhiteboardId == groups[i][n].whiteboardId)) {
            toggle.show();
          }
        }
      }
    }
    else {
      this._divDiscussionContent.innerHTML = '<div class="myProjectsContainerMessage"><img alt="" src="' + this.plugin.getIconUri(64, 'message.png') + '" /><br />' + this.plugin.getString('MyProjects.discussion.none') + '</div>';
    }
  };
  // }}}
  
	// {{{ _renderDiscussionPanelGroup
	/**
	 * returns the html for an individual dicussion group container
   * @param Object group the goup to render
   * @param boolean late whether or not this is for a late group
   * @param boolean upcoming whether or not this is for a upcoming group
   * @access private
	 * @return String 
	 */
  this._renderDiscussionPanelGroup = function(group, late, upcoming) {
    var html = '';
    for(var i in group) {
      var id = group[i].messageId ? 'message:' + group[i].messageId : 'whiteboard:' + group[i].whiteboardId;
      html += '<div class="' + (group[i].messageId ? 'myProjectsMessage' : 'myProjectsWhiteboard') + '">';
      html += '<span>\n';
      if (group[i].messageId) { html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().printMessage(\'' + group[i].messageId + '\')">' + this.plugin.getString('text.print').toLowerCase() + '</a> | '; }
      html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().toggleSubscribe(\'' + id + '\', this)">' + this.plugin.getString('text.' + (group[i].subscribed ? 'unsubscribe' : 'subscribe')) + '</a>';
      if (!group[i].readOnly) { 
        html += ' | ';
        html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().' + (group[i].messageId || !group[i].active ? 'editDiscussionItem' : 'deactivateWhiteboard') + '(\'' + (group[i].messageId || !group[i].active ? id : group[i].whiteboardId) + '\')">' + this.plugin.getString(group[i].messageId || !group[i].active ? 'text.edit' : 'text.deactivate') + '</a> | ';
        html += '<a href="#" onclick="OS.getWindowInstance(this).getManager().deleteDiscussionItem(\'' + id + '\')">' + this.plugin.getString('text.delete') + '</a>\n'; 
      }
      html += '</span>\n';
      html += '<h4>' + group[i].title + '</h4>\n';
      html += '<div class="myProjectsDiscussionContainer">\n';
      html += '<h5>' + this.plugin.getString(group[i].lastUpdated.getTime() > group[i].created.getTime() ? 'text.lastUpdatedBy' : 'text.createdBy') + ' ' + group[i].lastUpdatedBy + ' ';
      html += this.plugin.getString('text.inProject').toLowerCase() + ' ' + MyProjects.renderProjectName(this.getProject(group[i].projectId), true, false, true) + (group[i].category ? ' :: ' + group[i].category : '') + ' ';
      if (group[i].taskId) { html += this.plugin.getString('text.andTask') + ' ' + '<a href="#" onclick="MyProjects.getManager().viewTask(' + group[i].taskId + ')">' + group[i].taskTitle + '</a> '; }
      html += this.plugin.getString('text.on') + ' ' + group[i].lastUpdated.getPHPDate(MyProjects.DATE_MESSAGE_FORMAT);
      html += '</h5>\n';
      if (group[i].messageId) {
        html += group[i].messageHtml + '\n';
      }
      else {
        html += '<table><tr><td style="text-align: center"><img alt="' + this.plugin.getString('MyProjects.discussion.whiteboardScreenshot') + '" src="' + group[i].thumbnailUri + '" title="' + this.plugin.getString('MyProjects.discussion.whiteboardScreenshot') + '" /><br />';
        html += '<a href="#" onclick="window.open(\'' + group[i].whiteboardUri + '\', \'' + id + '\', \'height=' + (group[i].height + 20) + ',width=' + (group[i].width + 20) + ',scrollbars=no\')">' + this.plugin.getString('MyProjects.discussion.actualSize') + '</a></td>\n';
        html += '<td>' + this.plugin.getString(group[i].active ? 'MyProjects.discussion.whiteboardActive' : 'MyProjects.discussion.whiteboardNotActive', { activeUsers: group[i].activeUsers ? group[i].activeUsers : 0 });
        if (group[i].active && group[i].sessionFull) {
          html += '<p>' + this.plugin.getString('MyProjects.discussion.whiteboardSessionFull') + '</p>';
        }
        else {
          html += '<p><a href="#" onclick="' + (group[i].active ? 'OS.popup(\'' + OS.getRequestUri() + '/plugins/productivity/drawboard/?whiteboardId=' + group[i].whiteboardId + '\', ' + (group[i].height + (!group[i].readOnly ? 65 : 15)) + ', ' + (group[i].width + (!group[i].readOnly ? 70 : 15)) + ', true)' : 'OS.getWindowInstance(this).getManager().activateWhiteboard(' + group[i].whiteboardId + ')') + '"><strong>' + this.plugin.getString(group[i].active ? 'MyProjects.discussion.joinIn' : 'MyProjects.discussion.startNewSession') + '</strong></a></p>';
        }
        html += '</td></tr></table>\n';
      }
      if (group[i].taskId || group[i].files) {
        html += '<div class="myProjectsDiscussionLinks">\n';
        if (group[i].taskId) {
          html += '<div><a href="#" onclick="OS.getWindowInstance(this).getManager().viewTask(' + group[i].taskId + ')">' + group[i].taskTitle + '</a></div>\n';
        }
        if (group[i].files) {
          for(var n in group[i].files) {
            html += '<div style="background-image: url(' + group[i].files[n].icon + ')"><a href="' + group[i].files[n].uri + '" target="newWindow">' + group[i].files[n].name + '</a></div>\n';
          }
        }
        html += '</div>\n';
      }
      html += '<div class="myProjectsContainer myProjectsComments">\n';
      html += '<div id="' + this.win.getDivId() + 'DiscussionGroupCommentsToggle' + id + '" class="myProjectsToggle"></div>\n';
      html += '<span style="margin-top: 4px"><a href="#" onclick="OS.getWindowInstance(this).getManager().addComment(\'' + id + '\')">' + this.plugin.getString('text.addComment') + '</a></span>';
      html += '<h3 id="' + this.win.getDivId() + 'DiscussionGroupComments' + id + 'Header">' + group[i].numComments + ' ' + this.plugin.getString(group[i].numComments != 1 ? 'text.comments' : 'text.comment').toLowerCase() + '</h3>\n';
      html += '<div id="' + this.win.getDivId() + 'DiscussionGroupComments' + id + '"></div>\n';
      html += '</div>\n';
      html += '</div>\n';
      html += '</div>\n';
    }
    return html;
  };
  // }}}
  
  // {{{ _renderFilesPanel
  /**
   * renders the files panel
   * @access public
   * @return void
   */
  this._renderFilesPanel = function() {
    if (this._files && this._files.length > 0) {
      var html = '';
      this._loadedTabs[MyProjects.TAB_FILES] = true;
      
      var groups = this._filesGroupBy.value == 'date' ? this._groupByDate(this._files) : (this._filesGroupBy.value == 'type' ? this._groupByProjectType(this._files) : this._groupByProject(this._files));
      html += this._renderGroups(groups, '_renderFilesPanelGroup', 'myProjectsFile');
      html += '<div class="myProjectsFilesFooter">' + this.plugin.getString('MyProjects.files.singleDblClick') + '</div>';
      this._divFilesContent.innerHTML = html;
    }
    else {
      this._divFilesContent.innerHTML = '<div class="myProjectsContainerMessage"><img alt="" src="' + this.plugin.getIconUri(64, 'file.png') + '" /><br />' + this.plugin.getString('MyProjects.files.none') + '</div>';
    }
  };
  // }}}
  
	// {{{ _renderFilesPanelGroup
	/**
	 * returns the html for an individual task group container
   * @param Object group the goup to render
   * @access private
	 * @return String 
	 */
  this._renderFilesPanelGroup = function(group) {
    return OS.user.myProjectsFilesFormat == 'list' ? this._renderFilesPanelGroupList(group) : this._renderFilesPanelGroupIcons(group, OS.user.myProjectsFilesFormat == 'iconLarge', OS.user.myProjectsFilesIcon);
  };
  // }}}
  
	// {{{ _renderFilesPanelGroupIcons
	/**
	 * returns the html for a file group rendered in icon format
   * @param Object group the goup to render
   * @param boolean large whether or not to use large icons
   * @param boolean thumbnails whether or not to use thumbnail icons
   * @access private
	 * @return String 
	 */
  this._renderFilesPanelGroupIcons = function(group, large, thumbnails) {
    var html = '';
    for(var i in group) {
      var hoverLabel = this.plugin.getString(group[i].versioning ? 'text.fileHoverLabelVersioned' : 'text.fileHoverLabel', { 'creator': group[i].creator, 'created': MyProjects.getFilesDateStr(group[i].created), 'lastUpdatedBy': group[i].lastUpdatedBy, 'lastUpdated': MyProjects.getFilesDateStr(group[i].lastUpdated), 'version': group[i].versionLabel });
      html += '<table class="myProjectsFilesIcon">';
      html += '<tr><td onclick="MyProjects.getManager().displayFilePopup(this, ' + group[i].fileId + ')"><img alt="' + hoverLabel + '" src="' + (thumbnails && !large && group[i].icon32 ? group[i].icon32 : (thumbnails && large && group[i].icon64 ? group[i].icon64 : SRAOS_Util.substituteParams(group[i].icon, {'size': large ? '64' : '32'}))) + '" title="' + hoverLabel + '" /><br />';
      html += '<a alt="' + hoverLabel + '" href="#" title="' + hoverLabel + '">' + group[i].name + '</a></td></tr>';
      html += '</table>';
    }
    return html;
  };
  // }}}
  
	// {{{ _renderFilesPanelGroupList
	/**
	 * returns the html for a file group rendered in list format
   * @param Object group the goup to render
   * @access private
	 * @return String 
	 */
  this._renderFilesPanelGroupList = function(group) {
    var hasCategory = false;
    var hasTask = false;
    var hasMessage = false;
    var hasVersioning = false;
    for(var i in group) {
      if (group[i].category) { hasCategory = true; }
      if (group[i].taskId) { hasTask = true; }
      if (group[i].messageId) { hasMessage = true; }
      if (group[i].versioning) { hasVersioning = true; }
    }
    var html = '<table class="myProjectsFilesTable">';
    html += '<tr>';
    html += '<th style="padding-left: 20px">' + this.plugin.getString('text.name') + '</th>';
    html += hasVersioning ? '<th>' + this.plugin.getString('text.version') + '</th>' : '';
    html += hasCategory ? '<th>' + this.plugin.getString('text.category') + '</th>' : '';
    html += '<th>' + this.plugin.getString('text.lastUpdatedFull') + '</th>';
    html += hasTask ? '<th>' + this.plugin.getString('MyProjectTask') + '</th>' : '';
    html += hasMessage ? '<th>' + this.plugin.getString('MyProjectMessage') + '</th>' : '';
    html += '</tr>';
    for(var i in group) {
      var hoverLabel = this.plugin.getString(group[i].versioning ? 'text.fileHoverLabelVersioned' : 'text.fileHoverLabel', { 'creator': group[i].creator, 'created': MyProjects.getFilesDateStr(group[i].created), 'lastUpdatedBy': group[i].lastUpdatedBy, 'lastUpdated': MyProjects.getFilesDateStr(group[i].lastUpdated), 'version': group[i].versionLabel });
      html += '<tr>';
      html += '<td onclick="MyProjects.getManager().displayFilePopup(this, ' + group[i].fileId + ')" class="myProjectsFilesTableName">';
      html += '<img alt="' + hoverLabel + '" src="' + SRAOS_Util.substituteParams(group[i].icon, {'size': '16'}) + '" title="' + hoverLabel + '" />';
      html += '<a alt="' + hoverLabel + '" href="#" title="' + hoverLabel + '">' + group[i].name + '</a></td>';
      html += hasVersioning ? '<td>' + (group[i].versioning ? group[i].versionLabel : OS.getString('text.na')) + '</td>' : '';
      html += hasCategory ? '<td>' + (group[i].category ? group[i].category : OS.getString('text.none')) + '</td>' : '';
      html += '<td>' + this.plugin.getString('text.lastUpdatedFullLabel', { 'date': MyProjects.getFilesDateStr(group[i].lastUpdated), 'user': group[i].lastUpdatedBy }) + '</td>';
      html += hasTask ? '<td>' + (group[i].taskId ? MyProjects.renderTaskTitle({ taskId: group[i].taskId, title: group[i].taskTitle }, true) : OS.getString('text.none')) + '</td>' : '';
      html += hasMessage ? '<td>' + (group[i].messageId ? MyProjects.renderMessageTitle({ messageId: group[i].messageId, title: group[i].messageTitle, commentId: group[i].commentId }, true) : OS.getString('text.none')) + '</td>' : '';
      html += '</tr>';
    }
    html += '</table>';
    return html;
  };
  // }}}
  
	// {{{ _renderGroups
	/**
	 * renders the containers for groups of items
   * @param Array groups the grouped items to render
   * @param String contentCallback the callback method for rendering the items. 
   * this method should have the signature: (group : Array, late : boolean, upcoming : boolean)
   * @param String contentClass an optional class to use for the div containing 
   * the content
   * @access private
	 * @return String
	 */
  this._renderGroups = function(groups, contentCallback, contentClass) {
    var html = '';
    var ids = '';
    for(var i in groups) {
      var project = null;
      for(var n in groups[i]) {
        if (groups[i][n].projectId) { project = this.getProject(groups[i][n].projectId); }
        break;
      }
      this._renderGroupsCounter++;
      ids += (ids != '' ? ', ' : '') + this._renderGroupsCounter;
      html += '<div class="myProjectsContainer' + (i == MyProjects.LATE_STR ? ' myProjectsLate' : (i == MyProjects.UPCOMING_STR ? ' myProjectsUpcoming' : '')) + '">\n';
      html += '<div id="' + this.win.getDivId() + 'Groups' + this._renderGroupsCounter + '" class="myProjectsToggle"></div>\n';
      html += '<h3' + (project && (i == project.typeStr || i.indexOf(project.name) != -1) ? ' class="myProjectsContainerIconHeader" style="background-image: url(' + project.icon16 + ')"' : '') + '>' + i + '</h3>\n';
      html += '<div id="' + this.win.getDivId() + 'GroupsContent' + this._renderGroupsCounter + '"' + (contentClass ? ' class="' + contentClass + '"' : '') + '>\n';
      html += this[contentCallback](groups[i], i == MyProjects.LATE_STR, i == MyProjects.UPCOMING_STR);
      html += '</div>\n';
      html += '</div>\n';
    }
    setTimeout("MyProjects._renderGroupToggles([" + ids + "])", 500);
    return html;
  };
  // }}}
  
  // {{{ _renderTasks
  /**
   * returns the xhtml to use to display tasks. an SRAOS_Tree object instance will 
   * be attached to each task in 'tasks' using the attribute name '_tree'. the 
   * render method will then need to be invoked on each of those elements in order 
   * for the task tree to be displayed
   * @param Array tasks the tasks to return the xhtml for
   * @param boolean includeProjectHeader whether or not to include the project 
   * header
   * @access public
   * @return String
   */
  this._renderTasks = function(tasks, includeProjectHeader) {
    // first sort due dates by project
    var projects = this._groupByProject(tasks, true);
    
    var html = '';
    for(var i in projects) {
      var project = this.getProject(i);
      html += '<div class="myProjectsTaskGroup" style="margin: 0; margin-bottom: 4px; padding: 0">';
      if (includeProjectHeader) {
        html += '<h4 style="' + (this._tasksGroupBy.value == 'type' ? 'background-image: none; padding-left: 0' : 'background-image: url(' + project.icon16 + ')') + '">';
        var name = MyProjects.renderProjectName(project, true, false, true, false, true);
        html += name + '</h4>';
      }
      // render tasks
      var projectTreeNodes = new Array();
      for(var n in projects[i]) {
        projectTreeNodes.push(this._getTaskTreeNode(projects[i][n]));
      }
      projectTreeNodes.push(new SRAOS_TreeNode(i + '_task_new', '<a href="#" onclick="OS.getWindowInstance(this).getManager().newTask(' + i + ')">' + this.plugin.getString('MyProjects.tasks.addTask') + '</a>', false, this.plugin.getBaseUri() + '/images/add.png'));
      var id = this.win.getDivId() + '_taskTree_' + i;
      html += '<div id="' + id + '" class="myProjectsTasks"' + (!includeProjectHeader ? ' style="margin: 0; padding: 0"' : '') + '>';
      this._taskTrees[i] = new SRAOS_Tree(id, id, projectTreeNodes, this.win.getDivId(), this, null, null, null, null, null, true);
      html += '</div>';
      html += '</div>';
    }
    return html;
  };
  // }}}
  
  // {{{ _renderTasksPanel
  /**
   * renders the tasks panel
   * @access public
   * @return void
   */
  this._renderTasksPanel = function() {
    if (!this._tasks) { return; }
    
    if (this._tasks.length > 0) {
      
      var groups = new Array();
      
      var lateTasks;
      var upcomingTasks;
      if (this._tasksShowLateUpcoming.checked) {
        lateTasks = this._getLateTasks(this._tasks);
        if (lateTasks.length > 0) { groups[MyProjects.LATE_STR] = lateTasks; }
        upcomingTasks = this._getUpcomingTasks(this._tasks);
        if (upcomingTasks.length > 0) { groups[MyProjects.UPCOMING_STR] = upcomingTasks; }
      }
      
      var html = '';
      if (this._tasksTaskId) {
        html += '<div class="showAllDiscussionLink"><a href="#" onclick="OS.getWindowInstance(this).getManager().refreshTasks()">' + this.plugin.getString('MyProjects.showAllTasks') + '</a></div>\n';
      }
      else {
        this._loadedTabs[MyProjects.TAB_TASKS] = true;
      }
      
      this._taskTrees = new Array();
      groups = SRAOS_Util.arrayMerge(groups, this._tasksGroupBy.value == 'status' ? this._groupByStatus(this._tasks) : (this._tasksGroupBy.value == 'type' ? this._groupByProjectType(this._tasks) : this._groupByProject(this._tasks, false, true, true)));
      html += this._renderGroups(groups, '_renderTasksPanelGroup');
      this._divTasksContent.innerHTML = html;
      
      for(var i in this._taskTrees) {
        this._taskTrees[i].render();
      }
    }
    else {
      this._divTasksContent.innerHTML = '<div class="myProjectsContainerMessage"><img alt="" src="' + this.plugin.getIconUri(64, 'task.png') + '" /><br />' + this.plugin.getString('MyProjects.tasks.none') + '</div>';
    }
  };
  // }}}
  
	// {{{ _renderTasksPanelGroup
	/**
	 * returns the html for an individual task group container
   * @param Object group the goup to render
   * @param boolean late whether or not this is for a late group
   * @param boolean upcoming whether or not this is for a upcoming group
   * @access private
	 * @return String 
	 */
  this._renderTasksPanelGroup = function(group, late, upcoming) {
    return late ? MyProjects.renderDueDates(group, null, true, true) : (upcoming ? this._renderUpcoming(group, true) : this._renderTasks(group, this._tasksGroupBy.value != 'project'));
  };
  // }}}
  
	// {{{ _renderUpcoming
	/**
	 * returns the xhtml to use to represent upcoming items
   * @param Array items the upcoming items to render
   * @param boolean noCreator whether or not to display the due date creator
   * @access private
	 * @return String 
	 */
  this._renderUpcoming = function(items, noCreator) {
    var dueDates = MyProjects.groupDueDatesByDay(items);
    var html = '<table>';
    var compare = new Date();
    var rowCount = 0;
    var lastMonth = null;
    for(var i=0; i<=OS.user.myProjectsUpcomingThreshold; i++) {
      for(var n in dueDates) {
        if (compare.getDate() == n) {
          html += '<tr' + ((rowCount % 2) != 0 ? ' class="myProjectsAltBg"' : '') + '>';
          html += '<th' + (i==0 ? ' class="myProjectsUpcomingToday"' : '') + '>';
          html += i==0 ? this.plugin.getString('text.today') : (i==1 ? this.plugin.getString('text.tomorrow') : this.plugin.getString('text.in') + ' ' + ((i%7)==0 ? i/7 : i) + ' ' + (this.plugin.getString('text.' + (i==7 ? 'week' : ((i%7)==0 ? 'weeks' : 'days')))));
          html += '</th>';
          html += '<th class="myProjectsLightFont' + (i==0 ? ' myProjectsUpcomingToday' : '') + '">';
          html += compare.getPHPDate(MyProjects.DATE_FORMAT);
          html += '</th>';
          html += '<td>';
          html += MyProjects.renderDueDates(dueDates[n], null, false, noCreator);
          html += '</td>';
          html += '</tr>';
          rowCount++;
        }
      }
      compare.incrementDay();
    }
    html += '</table>';
    return html;
  };
  // }}}
  
	// {{{ _resetContentOverflow
	/**
	 * resets the overflow style for the content divs
   * @access private
	 * @return void
	 */
	this._resetContentOverflow = function() {
    if (this._canvasTabSet) {
      // dashboard
      var newOverflow = this._noProjectSelected || this._calendarPopup.style.visibility == 'visible' || this._canvasTabSet.getActive() != MyProjects.TAB_DASHBOARD ? 'hidden' : 'auto';
      if (this._divDashboardContent.style.overflow != newOverflow) { this._divDashboardContent.style.overflow = newOverflow; }
      
      // discussion
      newOverflow = this._noProjectSelected || this._canvasTabSet.getActive() != MyProjects.TAB_DISCUSSION ? 'hidden' : 'auto';
      if (this._divDiscussionContent.style.overflow != newOverflow) { this._divDiscussionContent.style.overflow = newOverflow; }
      
      // tasks
      newOverflow = this._noProjectSelected || this._calendarPopup.style.visibility == 'visible' || this._canvasTabSet.getActive() != MyProjects.TAB_TASKS ? 'hidden' : 'auto';
      if (this._divTasksContent.style.overflow != newOverflow) { this._divTasksContent.style.overflow = newOverflow; }
      
      // files
      newOverflow = this._noProjectSelected || this._canvasTabSet.getActive() != MyProjects.TAB_FILES ? 'hidden' : 'auto';
      if (this._divFilesContent.style.overflow != newOverflow) { this._divFilesContent.style.overflow = newOverflow; }
    }
  };
  // }}}
  
	// {{{ _saveSearch
	/**
	 * handles the response from sending a message
   * @param Object response the response received
   * @access private
	 * @return void
	 */
	this._saveSearch = function(response) {
    this.win.clearStatusBarText();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToSaveSearch'), response);
    }
    else {
      var search = MyProjects.getSavedSearch(response.results[0].name);
      if (search) {
        search.end = response.results[0].end;
        search.includeArchived = response.results[0].includeArchived;
        search.keyword = response.results[0].keyword;
        search.overdue = response.results[0].overdue;
        search.owner = response.results[0].owner;
        search.participant = response.results[0].participant;
        search.projectType = response.results[0].projectType;
        search.start = response.results[0].start;
        search.status = response.results[0].status;
      }
      else {
        if (!OS.user.myProjectsSavedSearches) { OS.user.myProjectsSavedSearches = new Array(); }
        OS.user.myProjectsSavedSearches.push(response.results[0]);
      }
      this._populateSavedSearches();
      this._selectSavedSearch(response.results[0].name);
      this.win.enableMenuItem('deleteSavedSearch');
      this.win.enableMenuItem('rssSubscribe');
      this.win.enableMenuItem('icalSubscribe');
      this.win.enableButton('btnDeleteSavedSearch');
      this.win.enableButton('btnRssSubscribe');
      this.win.enableButton('btnIcalSubscribe');
      this._loadedSavedSearch = response.results[0].name;
    }
  };
  // }}}
  
	// {{{ _selectSavedSearch
	/**
	 * selects a saved search
   * @param String name the name of the saved search to select
   * @access private
	 * @return boolean
	 */
	this._selectSavedSearch = function(name) {
    var savedSearchesInput = this.win.getElementById('myProjectsSavedSearches');
    for(var i in savedSearchesInput.options) {
      if (savedSearchesInput.options[i].value == name) {
        savedSearchesInput.selectedIndex = i;
        return true;
      }
    }
    return false;
	};
	// }}}
  
	// {{{ _updateProject
	/**
	 * handles ajax invocation response to updating a project
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._updateProject = function(response) {
    this.win.clearStatusBarText();
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToUpdateProject'), response);
    }
    else {
      this.refreshProjectList();
    }
  };
  // }}}
  
	// {{{ _updateTask
	/**
	 * handles ajax invocation response to updating a task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._updateTask = function(response) {
    this.win.clearStatusBarText();
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.plugin.getString('MyProjects.error.unableToUpdateTask'), response);
    }
    else {
      this.refreshTasks();
      this.reloadDashboard();
    }
  };
  // }}}
  
	// {{{ _updateSelectAll
	/**
	 * updates the checked state of the Select All Projects checkbox
   * @access private
	 * @return void
	 */
  this._updateSelectAll = function() {
    var select = true;
    for(var i in this._projects) {
      if (!SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects)) {
        select = false;
        break;
      }
    }
    if (this.win.getElementById('_prj_all')) { this.win.getElementById('_prj_all').checked = select; }
  };
	// }}}
  
	// {{{ _updateSelectType
	/**
	 * updates the checked state of a select group checkbox
   * @param String type the type to update the group checkbox for. if -1, all 
   * types will be checked
   * @access private
	 * @return void
	 */
  this._updateSelectType = function(type) {
    if (type == -1) {
      for(var i in this._projects) {
        if (type != this._projects[i].type) {
          type = this._projects[i].type;
          this._updateSelectType(type);
        }
      }
    }
    else {
      var select = true;
      for(var i in this._projects) {
        if (this._projects[i].type == type && !SRAOS_Util.inArray(this._projects[i].projectId, this._selectedProjects)) {
          select = false;
          break;
        }
      }
      this.win.getElementById('_prj_type' + type).checked = select;
    }
  };
	// }}}
};


// constants

/**
 * status code if a compleTask invocation failed because it requires display of 
 * a confirm message (the 'confirm' message will also be provided)
 * @type int
 */
MyProjects.COMPLETE_TASK_STATUS_CONFIRM = 1;

/**
 * status code if a compleTask invocation resulted in a validation error (the 
 * 'error' message will also be provided)
 * @type int
 */
MyProjects.COMPLETE_TASK_STATUS_ERROR = 2;

/**
 * status code if a compleTask invocation could not be completed because a 
 * workflow task form must be displayed and the data returned and validated 
 * first
 * @type int
 */
MyProjects.COMPLETE_TASK_STATUS_FORM = 3;

/**
 * status code if a compleTask invocation was successful
 * @type int
 */
MyProjects.COMPLETE_TASK_STATUS_SUCCESS = 4;

/**
 * status code if a compleTask invocation could not be completed because a 
 * workflow task view must be displayed first
 * @type int
 */
MyProjects.COMPLETE_TASK_STATUS_VIEW = 5;

/**
 * the date chooser format
 * @type String
 */
MyProjects.DATE_CHOOSER_FORMAT = 'm/d/Y';

/**
 * the date format for files
 * @type String
 */
MyProjects.DATE_FILE_FORMAT = 'D, M j g:i a';

/**
 * the time only format for files
 * @type String
 */
MyProjects.DATE_FILE_FORMAT_TIME = 'g:i a';

/**
 * the due date format
 * @type String
 */
MyProjects.DATE_FORMAT = 'M j';

/**
 * the date group format
 * @type String
 */
MyProjects.DATE_GROUP_FORMAT = 'D, M j';

/**
 * the date format for messages and whiteboards
 * @type String
 */
MyProjects.DATE_MESSAGE_FORMAT = 'D, M j g:i a';

/**
 * the # of milliseconds to wait before hiding the calendar popup
 * @type int
 */
MyProjects.HIDE_CALENDAR_POPUP_WAIT = 500;

/**
 * the # of milliseconds to wait before hiding the project list
 * @type int
 */
MyProjects.HIDE_PROJECT_LIST_WAIT = 1000;

/**
 * the amount of padding to use for indentation
 * @type String
 */
MyProjects.INDENT_PADDING = '20px';

/**
 * the late string
 * @type String
 */
MyProjects.LATE_STR;

/**
 * bit identifier for the user that created the project
 * @type int
 */
MyProjects.PARTICIPANT_CREATOR = 1;

/**
 * bit identifier for a MyProjectEmailParticipant
 * @type int
 */
MyProjects.PARTICIPANT_EMAIL = 2;

/**
 * bit identifier for a group type MyProjectParticipant
 * @type int
 */
MyProjects.PARTICIPANT_GROUP = 4;

/**
 * bit identifier for a user within a group type MyProjectParticipant
 * @type int
 */
MyProjects.PARTICIPANT_GROUP_USER = 8;

/**
 * bit identifier for an user type MyProjectParticipant
 * @type int
 */
MyProjects.PARTICIPANT_USER = 16;

/**
 * bit identifier for an all participants. see 'getParticipants' below
 * @type int
 */
MyProjects.PARTICIPANT_ALL = 31;

/**
 * the column mappings for projects
 * @type Object
 */
MyProjects.PROJECT_COL_MAPPINGS = { 'currentStep': 'getCurrentStepDispl', 'currentRole': 'currentRoleDispl', 'currentUser': 'currentUserDispl', 'dueDate': 'dueDate', 'ended': 'ended', 'error': 'error', 'icon': 'getIcon', 'started': 'started' };

/**
 * the columns that are always displayed in the search results projects table
 * @type Array
 */
MyProjects.PROJECT_DEFAULT_COLS = new Array('icon', 'owner', 'status');

/**
 * an associative array of permission bits/resource identifiers
 * @type Array
 */
MyProjects.PERMISSIONS = { 1: 'text.permissions.fileRead',  3: 'text.permissions.fileWrite',  4: 'text.permissions.messageRead',  12: 'text.permissions.messageWrite',  16: 'text.permissions.taskRead',  48: 'text.permissions.taskWrite',  64: 'text.permissions.whiteboardRead',  192: 'text.permissions.whiteboardWrite',  255: 'text.permissions.fullParticipant',  511: 'text.permissions.all' };

/**
 * identifier for file read permissions
 * @type int
 */
MyProjects.PERMISSIONS_FILE_READ = 1;

/**
 * identifier for file read/write permissions
 * @type int
 */
MyProjects.PERMISSIONS_FILE_WRITE = 3;

/**
 * identifier for message read permissions
 * @type int
 */
MyProjects.PERMISSIONS_MESSAGE_READ = 4;

/**
 * identifier for message read/write permissions
 * @type int
 */
MyProjects.PERMISSIONS_MESSAGE_WRITE = 12;

/**
 * identifier for task read permissions
 * @type int
 */
MyProjects.PERMISSIONS_TASK_READ = 16;

/**
 * identifier for task read/write permissions
 * @type int
 */
MyProjects.PERMISSIONS_TASK_WRITE = 48;

/**
 * identifier for whiteboard read permissions
 * @type int
 */
MyProjects.PERMISSIONS_WHITEBOARD_READ = 64;

/**
 * identifier for whiteboard read/write permissions
 * @type int
 */
MyProjects.PERMISSIONS_WHITEBOARD_WRITE = 192;

/**
 * identifier for full participation permissions
 * @type int
 */
MyProjects.PERMISSIONS_FULL_PARTICIPANT = 255;

/**
 * identifier for file admin permissions
 * @type int
 */
MyProjects.PERMISSIONS_ADMIN = 511;

/**
 * the name of the ajax service used for searching
 * @type string
 */
MyProjects.PROJECT_SEARCH_SERVICE = "myProjectsSearch";

/**
 * the late string identifier
 * @type String
 */
MyProjects.SCHEDULE_LATE = 'text.schedule.late';

/**
 * the upcoming string identifier
 * @type String
 */
MyProjects.SCHEDULE_UPCOMING = 'text.schedule.upcoming';

/**
 * the amount of padding to use for each level in 
 * @type int
 */
MyProjects.SELECT_HIERARCHY_PADDING = 15;

/**
 * the name of the ajax service for activating a whiteboard
 * @type string
 */
MyProjects.SERVICE_ACTIVATE_WHITEBOARD = "myProjectsActivateWhiteboard";

/**
 * the name of the ajax service for deleting comments
 * @type string
 */
MyProjects.SERVICE_COMMENT = "myProjectCommentService";

/**
 * the name of the ajax service for completing a project
 * @type string
 */
MyProjects.SERVICE_COMPLETE_PROJECT = "myProjectsCompleteProject";

/**
 * the name of the ajax service for completing a task
 * @type string
 */
MyProjects.SERVICE_COMPLETE_TASK = "myProjectsCompleteTask";

/**
 * the name of the ajax service for creating projects
 * @type string
 */
MyProjects.SERVICE_CREATE = "createMyProject";

/**
 * the name of the ajax service for manipulating files
 * @type string
 */
MyProjects.SERVICE_FILE = "myProjectsFileService";

/**
 * the name of the ajax service for retrieving project categories
 * @type string
 */
MyProjects.SERVICE_GET_CATEGORIES = "myProjectsGetCategories";

/**
 * the name of the ajax service for retrieving comments
 * @type string
 */
MyProjects.SERVICE_GET_COMMENTS = "myProjectsGetComments";

/**
 * the name of the ajax service for retrieving discussion items
 * @type string
 */
MyProjects.SERVICE_GET_DISCUSSION = "myProjectsGetDiscussion";

/**
 * the name of the ajax service for retrieving project due dates
 * @type string
 */
MyProjects.SERVICE_GET_DUE_DATES = "myProjectsGetDueDates";

/**
 * the name of the ajax service for retrieving files
 * @type string
 */
MyProjects.SERVICE_GET_FILES = "myProjectsGetFiles";

/**
 * the name of the ajax service for retrieving the latest project activity
 * @type string
 */
MyProjects.SERVICE_GET_LATEST_ACTIVITY = "myProjectsGetLatestActivity";

/**
 * the name of the ajax service for retrieving project participants
 * @type string
 */
MyProjects.SERVICE_GET_PARTICIPANTS = "myProjectsGetParticipants";

/**
 * the name of the ajax service for retrieving project tasks
 * @type string
 */
MyProjects.SERVICE_GET_TASKS = "myProjectsGetTasks";

/**
 * the name of the ajax service for updating messages
 * @type string
 */
MyProjects.SERVICE_MESSAGE = "myProjectMessageService";

/**
 * the name of the ajax service for subscribing to a discussion item
 * @type string
 */
MyProjects.SERVICE_SUBSCRIBE = "myProjectsSubscribe";

/**
 * the name of the ajax service for updating whiteboards
 * @type string
 */
MyProjects.SERVICE_WHITEBOARD = "myProjectWhiteboardService";

/**
 * the name of the ajax service for unsubscribing from a discussion item
 * @type string
 */
MyProjects.SERVICE_UNSUBSCRIBE = "myProjectsUnsubscribe";

/**
 * the name of the ajax service for updating projects
 * @type string
 */
MyProjects.SERVICE_UPDATE = "updateMyProject";

/**
 * the name of the ajax service for updating project tasks
 * @type string
 */
MyProjects.SERVICE_TASK = "myProjectTaskService";

/**
 * the identifier for the active status
 * @type String
 */
MyProjects.STATUS_ACTIVE = 'active';

/**
 * the identifier for the completed status
 * @type String
 */
MyProjects.STATUS_CANCELLED = 'cancelled';

/**
 * the identifier for the completed status
 * @type String
 */
MyProjects.STATUS_COMPLETED = 'completed';

/**
 * the identifier for the dashboard tab
 * @type String
 */
MyProjects.TAB_DASHBOARD = 'dashboard';

/**
 * the identifier for the discussion tab
 * @type String
 */
MyProjects.TAB_DISCUSSION = 'discussion';

/**
 * the identifier for the files tab
 * @type String
 */
MyProjects.TAB_FILES = 'files';

/**
 * the identifier for the advanced search tab
 * @type String
 */
MyProjects.TAB_ADVANCED_SEARCH = 'advanced';

/**
 * the identifier for the basic search tab
 * @type String
 */
MyProjects.TAB_BASIC_SEARCH = 'basic';

/**
 * the identifier for the tasks tab
 * @type String
 */
MyProjects.TAB_TASKS = 'tasks';

/**
 * the upcoming string
 * @type String
 */
MyProjects.UPCOMING_STR;


// {{{ displayCalendarDueDates
/**
 * invoked when a day is clicked in a calendar and displays the items associated 
 * with that day using a popup div
 * @param Object aElement the day element in the calendar
 * @access public
 * @return void
 */
MyProjects.displayCalendarDueDates = function(e) {
  if (!this._myProjects) { return; }
  
  e = e || window.event;
  
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  }
  else if (e.clientX || e.clientY) {
    x = e.clientX + ndBodyElement.scrollLeft;
    y = e.clientY + ndBodyElement.scrollTop;
  }
  
  this._myProjects._calendarPopup.innerHTML = MyProjects.renderDueDates(this._dueDates, this._startDates, true);
  this._myProjects._calendarPopup.style.right = ((this._myProjects.win.isMaximized() ? 0 : this._myProjects.win.getX()) + (this._myProjects._divLookup.style.visibility != 'hidden' ? this._myProjects._divLookup.offsetWidth : 0) + this._myProjects._divCanvas.offsetWidth - x) + 'px';
  this._myProjects._calendarPopup.style.top = (y - this._myProjects._canvasTabs.offsetHeight - 38 - (this._myProjects.win.isMaximized() ? 0 : this._myProjects.win.getY())) + 'px';
  this._myProjects.toggleCalendarPopup(false);
};
// }}}


  
// {{{ getFilesDateStr
/**
 * returns the data string to use for a file's last updated date
 * @param date dte the date to return the string for
 * @access private
 * @return string
 */
MyProjects.getFilesDateStr = function(dte) {
  var plugin = OS.getPlugin('productivity');
  var today = new Date();
  var str = dte.getPHPDate(MyProjects.DATE_FILE_FORMAT);
  if (today.getPHPDate('Ymd') == dte.getPHPDate('Ymd')) { str = plugin.getString('text.today') + ' ' + dte.getPHPDate(MyProjects.DATE_FILE_FORMAT_TIME); }
  today.decrementDay();
  if (today.getPHPDate('Ymd') == dte.getPHPDate('Ymd')) { str = plugin.getString('text.yesterday') + ' ' + dte.getPHPDate(MyProjects.DATE_FILE_FORMAT_TIME); }
  return str;
};
// }}}


// {{{ getTaskHoverLabel
/**
 * returns the hover label to use for the task provides. this label includes the 
 * scheduled dates and duration
 * @param Object task 
 * @access public
 * @return String
 */
MyProjects.getTaskHoverLabel = function(task) {
  var label = '';
  if (task) {
    if (task.startDate || task.dueDate) {
      label = task.datesLabel;
    }
    if (task.durationActual || task.durationPlanned) {
      label += label == '' ? '' : ', ';
      label += task.durationLabel;
    }
  }
  return label;
};
// }}}


// {{{ getLateDaysSuffix
/**
 * returns the string to use to represent the # of late days for the days 
 * specified
 * @param int days the # of late days
 * @access public
 * @return String
 */
MyProjects.getLateDaysSuffix = function(days) {
  return ' <font class="myProjectsLateFont">(' + days + ' ' + OS.getString(days == 1 ? 'MyProjects.dayLate' : 'MyProjects.daysLate', 'productivity') + ')</font>';
};
// }}}


// {{{ getManager
/**
 * returns the manager for the current MyProjects primary window instance
 * @access public
 * @return void
 */
MyProjects.getManager = function() {
  var pids = OS.getPids('MyProjects');
  return pids && pids[0] ? OS.getAppInstance(pids[0]).getWindowInstance('MyProjectsWin').getManager() : null;
};
// }}}


// {{{ getProjectDropDownIds
/**
 * returns the project ids that are applicable to the drop down selector 
 * provided where 'dropDown' was previously populated using the 
 * 'MyProjects.populateProjectListDropDown' method
 * @param Object dropDown the drop down to return the selected project ids from
 * @access public
 * @return int[]
 */
MyProjects.getProjectDropDownIds = function(dropDown) {
  var myProject = OS.getFocusedApp().getWindowInstance('MyProjectsWin').getManager();
  var projectIds = new Array();
  if (dropDown.value == 'all') {
    projectIds = myProject._selectedProjects;
  }
  else if (dropDown.value.indexOf('type:') === 0) {
    for(var i in myProject._selectedProjects) {
      if (('type:' + myProject.getProject(myProject._selectedProjects[i]).type) == dropDown.value) {
        projectIds.push(myProject._selectedProjects[i]);
      }
    }
  }
  else if (dropDown.value.indexOf(':') !== -1) {
    var pieces = dropDown.value.split(':');
    projectIds.push(pieces[0]);
  }
  else {
    projectIds.push(dropDown.value);
  }
  return projectIds;
};
// }}}
  

// {{{ getSavedSearch
/**
 * returns a saved user search
 * @param String name the name of the saved search to return
 * @access public
 * @return Object
 */
MyProjects.getSavedSearch = function(name) {
  for(var i in OS.user.myProjectsSavedSearches) {
    if (name == OS.user.myProjectsSavedSearches[i].name) {
      return OS.user.myProjectsSavedSearches[i];
    }
  }
  return null;
};
// }}}


// {{{ groupDueDatesByDay
/**
 * groups due dates by day. the return value will be an array indexed by month 
 * day where the value is an array of due dates that are applicable to that date
 * @param Array dueDates the due dates to group
 * @param int min the minimum date threshold (if applicable)
 * @param int max the maximum date threshold (if applicable)
 * @param String recursiveAttr an optional member attribute of the objects in 
 * dueDates that should be used to recursively invoke this method
 * @param boolean startDate whether or not to use the 'startDate' parameter 
 * instead of 'dueDate'
 * @access public
 * @return Array
 */
MyProjects.groupDueDatesByDay = function(dueDates, min, max, recursiveAttr, startDate) {
  var attr = startDate ? 'startDate' : 'dueDate';
  var groupedDueDates = new Array();
  for(var i in dueDates) {
    if (dueDates[i][attr] && dueDates[i][attr].getTime && (!min || dueDates[i][attr].getTime() >= min) && (!max || dueDates[i][attr].getTime() < max)) {
      if (!groupedDueDates[dueDates[i][attr].getDate()]) { groupedDueDates[dueDates[i][attr].getDate()] = new Array(); }
      groupedDueDates[dueDates[i][attr].getDate()].push(dueDates[i]);
    }
    
    if (recursiveAttr && dueDates[i][recursiveAttr]) {
      var recursiveDueDates = MyProjects.groupDueDatesByDay(dueDates[i][recursiveAttr], min, max, recursiveAttr, startDate);
      for(var n in recursiveDueDates) {
        if (!groupedDueDates[n]) { groupedDueDates[n] = new Array(); }
        for(var m in recursiveDueDates[n]) {
          groupedDueDates[n].push(recursiveDueDates[n][m]);
        }
      }
    }
  }
  return groupedDueDates;
};
// }}}


// {{{ newProject
/**
 * starts the new project wizard for the type specified. this method can be 
 * invoked statically. it launches the MyProjects application if it has not 
 * already been launched
 * @param String type the new project type
 * @param Object params an optional set of initiation params for the project 
 * of the type specified. when valid and applicable, these will cause the 
 * first screen of the project creation wizard to be skipped
 * @access public
 * @return void
 */
MyProjects.newProject = function(type, params) {
  OS.launchApplication('productivity', 'MyProjects').getFocusedWindow().getManager().newProject(type, params);
};
// }}}
  

// {{{ populateProjectListDropDown
/**
 * populates a project list selector based on the parameters specified. the 
 * value for the options will be the project id unless they are for the "All 
 * Projects" option, a project type option, or a category option (see below 
 * for the format of those option values)
 * @param Object dropDown the drop down to populate (required)
 * @param boolean includeAllProjects whether or not an option for "All 
 * Selected Projects" should be included (using the key "all")
 * @param boolean includeTypeGroups whether or not project type options should 
 * be included using the key format "type:[type id]"
 * @param Array categories project categories to include in the selection 
 * using the key format "[project id]:[category id]"
 * @param int permissions permissions to check for in each project. if these 
 * permissions are not satisfied, the project will be left out of the drop down
 * @param Array projectIds an optional parameter specifying the minimum projects 
 * that should be included in the selector. if not specified, only the projects 
 * in 'categories' will be included
 * @param int selectedProjectId an optional default selected project id
 * @access public
 * @return void
 */
MyProjects.populateProjectListDropDown = function(dropDown, includeAllProjects, includeTypeGroups, categories, permissions, projectIds, selectedProjectId) {
  SRAOS_Util.clearSelectField(dropDown);
  var myProject = MyProjects.getManager();
  var options = new Array();
  
  if (includeAllProjects) { options.push(new Option(myProject.plugin.getString('MyProjects.allSelectedProjects'), 'all')); }
  
  if (includeTypeGroups) {
    var types = new Array();
    for(var i in myProject._selectedProjects) {
      var project = myProject.getProject(myProject._selectedProjects[i]);
      if (project.type && (!permissions || (project.getUserPermissions & permissions) == permissions)) {
        !types[project.type] ? types[project.type] = { count: 1, label: project.typeStr } : types[project.type]['count']++;
      }
    }
    for(var i in types) {
      options.push(new Option(myProject.plugin.getString('text.All') + ' ' + types[i]['label'] + ' (' + types[i]['count'] + ')', 'type:' + i));
    }
  }
  
  for(var i in myProject._selectedProjects) {
    var project = myProject.getProject(myProject._selectedProjects[i]);
    if (!permissions || (project.getUserPermissions & permissions) == permissions) {
      if (categories) {
        found = false;
        for(var n in categories) {
          if (categories[n].projectId == project.projectId) {
            if (!found) { options.push(new Option(project.name, project.projectId)); }
            var option = new Option(categories[n].name, project.projectId + ':' + categories[n].categoryId);
            option.setAttribute('style', 'padding-left: ' + MyProjects.INDENT_PADDING);
            options.push(option);
            found = true;
          }
        }
        if (!found && projectIds && SRAOS_Util.inArray(project.projectId, projectIds)) {
          options.push(new Option(project.name, project.projectId));
        }
      }
      else {
        options.push(new Option(project.name, project.projectId));
      }
    }
  }
  SRAOS_Util.addOptionsToSelectField(dropDown, options);
  if (selectedProjectId) { SRAOS_Util.setSelectValue(dropDown, selectedProjectId); }
};
// }}}


// {{{ populateTaskSelector
/**
 * used to populate a task selector
 * @param Object selector the select field to populate
 * @param int projectId the id of the project to render the tasks selector for
 * @param boolean hierarchy whether or not to display the tasks in a 
 * hierarchical format
 * @param boolean topLevelOnly whether or not to just display the top-level 
 * tasks only
 * @param boolean includeNoneOption whether or not to include a "none" option
 * @param int[] skipTasks an optional array ids of tasks to skip
 * @access public
 * @return void
 */
MyProjects.populateTaskSelector = function(selector, projectId, hierarchy, topLevelOnly, selectedTaskId, includeNoneOption, skipTasks) {
  if (!selector._loadTasks) {
    selector._loadTasks = function(response) {
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(OS.getString('MyProjects.error.unableToLoadTasks', 'productivity'), response);
      }
      else {
        SRAOS_Util.clearSelectField(this);
        if (SRAOS_Util.getLength(response.results) > 0) {
          if (this._includeNoneOption) { SRAOS_Util.addOptionToSelectField(this, new Option(OS.getString('text.none'), '')); }
          this._populateTasks(response.results, 0);
          if (this._selectedTaskId) { SRAOS_Util.setSelectValue(this, this._selectedTaskId); }
        }
        else {
          SRAOS_Util.addOptionToSelectField(this, new Option(OS.getString('MyProjects.noMatchingTasks', 'productivity'), ''));
        }
      }
    };
    selector._populateTasks = function(tasks, padding) {
      for(var i in tasks) {
        var option = new Option(tasks[i].title, tasks[i].taskId);
        if (padding) { option.style.paddingLeft = padding + 'px'; }
        SRAOS_Util.addOptionToSelectField(this, option);
        if (tasks[i].subTasks) {
          this._populateTasks(tasks[i].subTasks, padding + MyProjects.SELECT_HIERARCHY_PADDING);
        }
      }
    }
  }
  selector._selectedTaskId = selectedTaskId;
  selector._includeNoneOption = includeNoneOption;
  
  SRAOS_Util.clearSelectField(selector);
  SRAOS_Util.addOptionToSelectField(selector, new Option(OS.getString('MyProjects.loadingTasks', 'productivity'), ''));
  OS.ajaxInvokeService(MyProjects.SERVICE_GET_TASKS, selector, '_loadTasks', null, null, { hierarchy: hierarchy, projectIds: projectId, skipTasks: skipTasks, topLevelOnly: topLevelOnly } );
};
// }}}


// {{{ renderCheckbox
/**
 * returns the xhtml to use to provides a checkoff checkbox for the object 
 * provided
 * @param Object obj either a project, task or due date instance
 * @param boolean disabled whether or not the checkbox should be disabled
 * @param boolean noHighlight whether or not to highlight the checkbox if it is 
 * late or upcoming (default is to highlight)
 * @access public
 * @return String
 */
MyProjects.renderCheckbox = function(obj, disabled, noHighlight) {
  return '<input' + (obj.status == MyProjects.STATUS_CANCELLED || obj.status == MyProjects.STATUS_COMPLETED ? ' checked="checked"' : '') + (obj.disabled || disabled ? ' disabled="disabled"' : '') + ' onclick="if (!this.disabled) { MyProjects.getManager().changeCompletionStatus(this.checked, ' + (obj.taskId ? obj.taskId : obj.projectId) + ', ' + (obj.taskId ? 'true' : 'false') + ', this); }" class="myProjectsCheckbox' + (!noHighlight && obj.late ? ' myProjectsCheckboxLate' : (!noHighlight && obj.upcoming ? ' myProjectsCheckboxUpcoming' : '')) + '" type="checkbox" />';
};
// }}}


// {{{ renderDueDates
/**
 * returns the xhtml to use to display due dates
 * @param Array dueDates the due dates to return the xhtml for
 * @param Array startDates optional start dates to return the xhtml for
 * @param boolean includeDaysLate whether or not to prefix late items with the # 
 * of days that item is late (i.e. "5 days late")
 * @param boolean whether or not to display the due date creator
 * @access public
 * @return String
 */
MyProjects.renderDueDates = function(dueDates, startDates, includeDaysLate, noCreator) {
  // first sort due dates by project
  var myProjects = MyProjects.getManager();
  var projects = myProjects._groupByProject(dueDates, true);
  if (startDates) {
    var startProjects = myProjects._groupByProject(startDates, true);
    for(var i in startProjects) {
      for(var n in startProjects[i]) if (startProjects[i][n].taskId) startProjects[i][n] = { dueDate: startProjects[i][n], isStartDate: true };
      if (!projects[i]) {
        projects[i] = startProjects[i];
      }
      else {
        for(var n in startProjects[i]) {
          if (startProjects[i][n].isStartDate && !SRAOS_Util.inArray(startProjects[i][n].dueDate, projects[i], 'taskId')) {
            projects[i].push(startProjects[i][n]);
          }
        }
      }
    }
  }
  
  var html = '';
  for(var i in projects) {
    var project = myProjects.getProject(i);
    html += '<div class="myProjectsDueDateGroup">';
    html += '<h4 style="background-image: url(' + project.icon16 + ')">';
    var name = MyProjects.renderProjectName(project, true, false, true);
    var projectDueDate = false;
    // render project checkbox (if applicable)
    for(var n in projects[i]) {
      if (!projects[i][n].isStartDate && !projects[i][n].taskId) {
        html += MyProjects.renderCheckbox(projects[i][n], projects[i][n].readOnly);
        if (!noCreator && projects[i][n].creator) { name += '<font class="myProjectsNonBold myProjectsLightFont"> :: ' + projects[i][n].creator + '</font>'; }
        if (includeDaysLate && projects[i][n].late) { name += MyProjects.getLateDaysSuffix(projects[i][n].lateDays); }
        projectDueDate = true;
      }
    }
    html += name + '</h4>';
    // render tasks
    for(var n in projects[i]) {
      if (projects[i][n].isStartDate || projects[i][n].taskId) {
        html += '<div' + (projectDueDate ? ' style="margin-left: 34px"' : '') + '>';
        html += MyProjects.renderTaskTitle(projects[i][n].isStartDate ? projects[i][n].dueDate : projects[i][n], true, true, !noCreator, includeDaysLate && !projects[i][n].isStartDate, false, false, projects[i][n].isStartDate);
        html += '</div>';
      }
    }
    html += '</div>';
  }
  return html;
};
// }}}


// {{{ renderFileName
/**
 * returns the xhtml to use to display the file name based on the parameters 
 * specified
 * @param Object file the file to render the name for
 * @param boolean link whether or not to link the name to the "view file" popup 
 * window
 * @return String
 */
MyProjects.renderFileName = function(file, link) {
  return (link ? '<a href="' + (file.uri ? file.uri : file.fileUri) + '" target="_blank">' : '') + file.name + (link ? '</a>' : '');
};
// }}}


// {{{ renderMessageTitle
/**
 * returns the xhtml to use to display the message title based on the parameters 
 * specified
 * @param Object message the message to render the title for
 * @param boolean link whether or not to link the message to the "view message" 
 * popup window
 * @access public
 * @return String
 */
MyProjects.renderMessageTitle = function(message, link) {
  return (link ? '<a href="#" onclick="MyProjects.getManager().viewMessage(' + message.messageId + ', ' + (message.commentId ? 'true' : 'false') + ')">' : '') + (message.commentId ? OS.getString('text.re', 'productivity') + ' ' : '') + (message.name ? message.name : message.title) + (link ? '</a>' : '');
};
// }}}
  

// {{{ renderProjectAttr
/**
 * returns the string to use to represent a project attribute
 * @param String attr the name of the attribute to render
 * @param Object project the project to render the attribute for
 * @access public
 * @return String
 */
MyProjects.renderProjectAttr = function(attr, project) {
  if (attr == 'dueDate') {
    return project['dueDate'] ? project['dueDate'].getPHPDate(MyProjects.DATE_FORMAT) : OS.getString('text.na');
  }
  else if (attr == 'name') {
    return MyProjects.renderProjectName(project);
  }
  else {
    return project[attr];
  }
};
// }}}


// {{{ renderProjectName
/**
 * returns the xhtml to use to display the project name based on the parameters 
 * specified
 * @param Object project the project to render the name for
 * @param boolean link whether or not to link the name to the "view project" 
 * popup window
 * @param boolean score whether or not to include the search results score
 * @param boolean includeIcon whether or not to include the project icon
 * @param boolean includeCheckbox whether or not to include a checkoff checkbox
 * (if the user has permissions)
 * @access public
 * @return String
 */
MyProjects.renderProjectName = function(project, link, score, noPid, includeIcon, includeCheckbox) {
  var name = '';
  if (includeIcon) { name+= '<h4 class="myProjectsNameHeader" style="background-image: url(' + project.icon16 + ')">'; }
  name += includeCheckbox ? MyProjects.renderCheckbox(project, (!project.permissions || project.permissions != MyProjects.PERMISSIONS_ADMIN) && (!project.getUserPermissions || project.getUserPermissions != MyProjects.PERMISSIONS_ADMIN)) : '';
  name += (link ? '<a href="#" onclick="MyProjects.getManager().viewProject(' + project.projectId + ')">' : '') + project.name + (link ? '</a>' : '') + (score && project.score ? MyProjects._getScoreIndicator(project.score) : '') + (!noPid ? ' <font class="myProjectsLightFont">[' + OS.getString('text.id') + ': ' + project.projectId + ']</font>' : '');
  if (includeIcon) { name+= '</h4>'; }
  return name;
};
// }}}


// {{{ renderTaskTitle
/**
 * returns the xhtml to use to display the task name based on the parameters 
 * specified
 * @param Object task the task to render the name for
 * @param boolean link whether or not to link the name to the "view task" 
 * popup window
 * @param boolean includeCheckbox whether or not to include a checkoff checkbox
 * when task status can be toggled (checkbox is disabled) a lock icon will be 
 * displayed next to the checkbox with a hover message detailing why the task 
 * status cannot be toggled
 * @param boolean useTable whether or not to use a table in the rendering
 * @param boolean includeCreator whether or not to include a creator suffix
 * @param boolean includeDaysLate whether or not to include a late days suffix
 * @param boolean showEditView if 'link' is true, whether or not the link should 
 * show the view/edit task popup instead of focusing the task on the task panel
 * @param boolean showPercentage whether or not to show the percentage complete
 * @param boolean isStartDate whether or not to flag this title rendering as the 
 * start date for this task
 * @access public
 * @return String
 */
MyProjects.renderTaskTitle = function(task, link, includeCheckbox, includeCreator, includeDaysLate, showEditView, showPercentage, isStartDate) {
  var toggleMsg = includeCheckbox && !task.canToggleStatus && task.canToggleStatusMsg ? SRAOS_Util.escapeDoubleQuotes(task.canToggleStatusMsg) : '';
  var name = '';
  name += includeCheckbox ? '<td class="myProjectsTaskTitleCell">' + MyProjects.renderCheckbox(task, !task.canToggleStatus, isStartDate) + '</td>' : '';
  name += '<td class="myProjectsTaskTitleCell">' + 
          (link ? '<a href="#" onclick="MyProjects.getManager().viewTask(' + task.taskId + (showEditView ? ', true' : '') + ')" title="' + MyProjects.getTaskHoverLabel(task) + '">' : '') + 
          (task.name ? task.name : task.title) + 
          (link ? '</a>' : '') + 
          (includeCreator && task.creator ? '<font class="myProjectsLightFont"> :: ' + task.creator + '</font>' : '') + 
          (isStartDate ? ' (' + OS.getPlugin('productivity').getString('MyProjectTask.startDate') + ')' : '') + 
          (includeDaysLate && task.late ? ' ' + MyProjects.getLateDaysSuffix(task.lateDays) : '') + '</td>' + 
          (showPercentage && task.percentComplete !== null && typeof(task.percentComplete) !== 'undefined' ? '<td class="' + (task.late ? 'myProjectsTaskPercentCompleteLate' : (task.upcoming ? 'myProjectsTaskPercentCompleteUpcoming' : 'myProjectsTaskPercentComplete')) + '">' + (task.percentComplete > 0 ? '<img alt="' + task.percentComplete + '%" src="' + SRAOS.PIXEL_IMAGE + '" style="width: ' + (task.percentComplete/5) + 'px" title="' + task.percentComplete + '%" /></td>' : '') + (task.percentComplete < 100 ? '<td class="' + (task.late ? 'myProjectsTaskPercentCompleteLate' : (task.upcoming ? 'myProjectsTaskPercentCompleteUpcoming' : 'myProjectsTaskPercentComplete')) + '"><img alt="' + task.percentComplete + '%" src="' + SRAOS.PIXEL_IMAGE + '" style="' + (task.percentComplete > 0 ? 'border-left: 0; ' : '') + 'background-color: white; width: ' + ((100 - task.percentComplete)/5) + 'px" title="' + task.percentComplete + '%" /></td>' : '') : '');
  name += includeCheckbox && !task.canToggleStatus ? '<td class="myProjectsTaskTitleCell">' + '<img alt="' + toggleMsg + '" onclick="OS.msgBox(\'' + SRAOS_Util.escapeSingleQuotes(toggleMsg) + '\', \'' + SRAOS_Util.escapeSingleQuotes(task.name ? task.name : task.title) + '\', \'' + OS.getPlugin('productivity').getIconUri(32, task.icon) + '\')" " src="' + OS.getPlugin('productivity').getIconUri(16, 'lock.png') + '" title="' + toggleMsg + '" />' + '</td>' : '';
  return '<table class="myProjectsTaskTitleTable" style="width: 10px"><tr>' + name + '</tr></table>';
};
// }}}


// {{{ renderWhiteboardTitle
/**
 * returns the xhtml to use to display the whiteboard title based on the 
 * parameters specified
 * @param Object whiteboard the whiteboard to render the title for
 * @param boolean link whether or not to link the message to the 
 * "view whiteboard" popup window
 * @access public
 * @return String
 */
MyProjects.renderWhiteboardTitle = function(whiteboard, link) {
  return (link ? '<a href="#" onclick="MyProjects.getManager().viewWhiteboard(' + whiteboard.whiteboardId + ')">' : '') + (whiteboard.name ? whiteboard.name : whiteboard.title) + (link ? '</a>' : '');
};
// }}}


// {{{ selectProject
/**
 * selects the project specified. this method can be invoked statically. it 
 * launches the MyProjects application if it has not already been launched
 * @param int id the id of the project to select
 * @param String tab an optional parameter specifying the tab that should be 
 * selected. this value should correspond with one of the MyProjects.TAB_* 
 * constants
 * @access public
 * @return void
 */
MyProjects.selectProject = function(id, tab) {
  if (!MyProjects.getManager()) { 
    OS.launchApplication('productivity', 'MyProjects', { projectId: id, tab: tab } ); 
  }
  else {
    setTimeout('OS.focus(MyProjects.getManager())', 250);
    setTimeout('MyProjects.getManager().selectProject(' + id + ')', 500);
    if (tab) { setTimeout('MyProjects.getManager()._canvasTabSet.setActive("' + tab + '")', 600); }
  }
};
// }}}


// {{{ setWaitMsg
/**
 * sets a wait message/image in the div specified
 * @param Object div the div to set the wait message to
 * @param String msg the message resource
 * @access public
 * @return void
 */
MyProjects.setWaitMsg = function(div, msg) {
  div.innerHTML = '<div class="myProjectsWait" style="background-image: url(' + OS.getWaitImgUri() + '); padding-left: 20px">' + OS.getPlugin('productivity').getString(msg) + '</div>';
};
// }}}


// {{{ _getScoreIndicator
/**
 * returns a "scored" indicator meter based on the score specified
 * @param float score the score to return the indicator for
 * @access private
 * @return void
 */
MyProjects._getScoreIndicator = function(score) {
  var width = Math.round(score * 25);
  return '<img class="scoreIndicator" src="' + SRAOS.PIXEL_IMAGE + '" style="width: ' + width + 'px" />';
};
// }}}


// {{{ _renderGroupToggles
/**
 * renders the toggles for a given set of groups
 * @param int[] groups the ids of the groups to render the toggles for
 * @access private
 * @return void
 */
MyProjects._renderGroupToggles = function(groups) {
  var myProjects = MyProjects.getManager();
  for(var i in groups) {
    new SRAOS_ViewToggle(myProjects.win.getElementById('GroupsContent' + groups[i]), myProjects.win.getElementById('Groups' + groups[i]));
  }
};
// }}}

// }}}

