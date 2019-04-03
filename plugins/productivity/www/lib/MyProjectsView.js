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
 * View Project window manager
 */
MyProjectsView = function() {
  
  /**
   * a reference to the close window link label
   * @type Object
   */
  this._closeWindowLink;
  
  /**
   * a reference to the base fields div
   * @type Object
   */
  this._divBase;
  
  /**
   * a reference to the buttons div
   * @type Object
   */
  this._divButtons;
  
  /**
   * a reference to the categories div
   * @type Object
   */
  this._divCategories;
  
  /**
   * a reference to the initialization (project template) div
   * @type Object
   */
  this._divInit;
  
  /**
   * a reference to the other info div
   * @type Object
   */
  this._divOtherInfo;
  
  /**
   * a reference to the participants div
   * @type Object
   */
  this._divParticipants;
  
  /**
   * a reference to the tabs div
   * @type Object
   */
  this._divTabs;
  
  /**
   * a reference to the view project div
   * @type Object
   */
  this._divView;
  
  /**
   * whether or not the view is currently in edit mode
   * @type boolean
   */
  this._edit = false;
  
  /**
   * the edit project toggle link
   * @type Object
   */
  this._editProjectToggle;
  
  /**
   * a reference to the project archived/no field
   * @type Object
   */
  this._fieldArchivedNo;
  
  /**
   * a reference to the project archived/yes field
   * @type Object
   */
  this._fieldArchivedYes;
  
  /**
   * a reference to the project due date field
   * @type Object
   */
  this._fieldDueDate;
  
  /**
   * a reference to the select box containing the current file categories
   * @type Object
   */
  this._fieldFileCategories;
  
  /**
   * a reference to the input box used to create a new file category
   * @type Object
   */
  this._fieldFileCategoryAdd;
  
  /**
   * a reference to the select box containing the current message categories
   * @type Object
   */
  this._fieldMessageCategories;
  
  /**
   * a reference to the input box used to create a new message category
   * @type Object
   */
  this._fieldMessageCategoryAdd;
  
  /**
   * a reference to the project name field
   * @type Object
   */
  this._fieldName;
  
  /**
   * a reference to the other info checkbox
   * @type Object
   */
  this._fieldOtherInfo;
  
  /**
   * a reference to the project status field
   * @type Object
   */
  this._fieldStatus;
  
  /**
   * a reference to the project summary field
   * @type Object
   */
  this._fieldSummary;
  
  /**
   * the current project participants
   * @type Array
   */
  this._participants;
  
  /**
   * the object that manages the permissions form
   * @type MyProjectsPermissionsForm
   */
  this._permissionsForm;
  
  /**
   * a reference to the INDI plugin
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * the project this view has been displayed for
   * @type Object
   */
  this._project;
  
  /**
   * file categories to remove when the project is updated
   * @type Array
   */
  this._removeFileCategories = new Array();
  
  /**
   * message categories to remove when the project is updated
   * @type Array
   */
  this._removeMessageCategories = new Array();
  
  /**
   * whether or not the project was saved
   * @type boolean
   */
  this._saved = false;
  
  /**
   * a reference to the template for the project
   * @type object
   */
  this._template;
  
  /**
   * a reference to the view project header
   * @type object
   */
  this._viewProjectHeader;
  
  
	// {{{ addFileCategory
	/**
	 * adds a new file category
   * @access public
	 * @return void
	 */
	this.addFileCategory = function() {
    if (this._fieldFileCategoryAdd.value) {
      if (this._fieldFileCategories.options[0].value == '') { SRAOS_Util.clearSelectField(this._fieldFileCategories); }
      SRAOS_Util.addOptionToSelectField(this._fieldFileCategories, new Option(this._fieldFileCategoryAdd.value, 'add'));
      this._fieldFileCategories.selectedIndex = this._fieldFileCategories.options.length - 1;
      this._fieldFileCategoryAdd.value = '';
    }
  };
  // }}}
  
	// {{{ addMessageCategory
	/**
	 * adds a new message category
   * @access public
	 * @return void
	 */
	this.addMessageCategory = function() {
    if (this._fieldMessageCategoryAdd.value) {
      if (this._fieldMessageCategories.options[0].value == '') { SRAOS_Util.clearSelectField(this._fieldMessageCategories); }
      SRAOS_Util.addOptionToSelectField(this._fieldMessageCategories, new Option(this._fieldMessageCategoryAdd.value, 'add'));
      this._fieldMessageCategories.selectedIndex = this._fieldMessageCategories.options.length - 1;
      this._fieldMessageCategoryAdd.value = '';
    }
  };
  // }}}
  
	// {{{ deleteProject
	/**
	 * deletes the project
   * @access public
	 * @return void
	 */
	this.deleteProject = function() {
    if (OS.confirm(this._plugin.getString('text.deleteConfirm'))) {
      this.win.syncWait(this._plugin.getString('MyProjects.deletingProject'));
      OS.ajaxInvokeService(MyProjects.SERVICE_UPDATE, this, '_deleteProject', null, new SRAOS_AjaxRequestObj(this._project.projectId, null, SRAOS_AjaxRequestObj.TYPE_DELETE));
    }
  };
  // }}}
  
	// {{{ initCancel
	/**
	 * cancels new project initialization (loading template)
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
    var close = !force && this._project && this._project.getUserPermissions == MyProjects.PERMISSIONS_ADMIN && this.win.isDirty() ? OS.confirm(this._plugin.getString('MyProjects.closeDirty')) : true;
    if (close && (this._saved || this._deleted)) {
      var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
      if (this._deleted && myProjects._selectedProjects.length == 1 && myProjects._searchParams.length == 1) {
        myProjects.search();
      }
      else {
        myProjects.refreshProjectList(true);
      }
    }
    return close;
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
    
    this._closeWindowLink = this.win.getElementById('myProjectsViewCloseWindowLink');
    this._divBase = this.win.getElementById('viewProjectBase');
    this._divButtons = this.win.getElementById('viewProjectButtons');
    this._divCategories = this.win.getElementById('viewProjectCategories');
    this._divInit = this.win.getElementById('viewProjectInit');
    this._divOtherInfo = this.win.getElementById('viewProjectOtherInfo');
    this._divParticipants = this.win.getElementById('viewProjectParticipants');
    this._divTabs = this.win.getElementById('viewProjectTabs');
    this._divView = this.win.getElementById('viewProject');
    this._editProjectToggle = this.win.getElementById('editProjectToggle');
    this._fieldArchivedNo = this.win.getElementById('myProjectArchivedNo');
    this._fieldArchivedYes = this.win.getElementById('myProjectArchivedYes');
    this._fieldDueDate = this.win.getElementById('myProjectDueDate1');
    OS.addDateChooser(this._fieldDueDate, this.win.getDivId() + 'dueDateChooser1', true, MyProjects.DATE_CHOOSER_FORMAT, new Date());
    this._fieldFileCategories = this.win.getElementById('fileCategories1');
    this._fieldFileCategoryAdd = this.win.getElementById('addFileCategory');
    this._fieldMessageCategories = this.win.getElementById('messageCategories1');
    this._fieldMessageCategoryAdd = this.win.getElementById('addMessageCategory');
    this._fieldName = this.win.getElementById('myProjectName1');
    SRAOS_Util.addOnEnterEvent(this._fieldName, this, 'next');
    this._fieldOtherInfo = this.win.getElementById('myProjectOtherInfo');
    this._fieldSummary = this.win.getElementById('myProjectSummary1');
    this._fieldStatus = this.win.getElementById('myProjectStatus');
    
    var permissionFields = new Array();
    for(var i in MyProjects.PERMISSIONS) {
      permissionFields[i] = this.win.getElementById('viewProjectPermissions' + i);
    }
    this._permissionsForm = new MyProjectsPermissionsForm(this.win.getElementById('newAvailableParticipantsField1'), this.win.getElementById('newCurrentParticipantsField1'), permissionFields, this.win.getElementById('myProjectsAddParticipantLink1'), this.win.getElementById('myProjectsRemoveParticipantLink1'), this.win.getElementById('myProjectsUpdateParticipantLink1'), this.win.getElementById('newCurrentParticipantsCount1'), this.win.getElementById('viewProjectPermissionsSendIntroEmail1'));
    this._permissionsForm.updatePermissionFields();
    this._viewProjectHeader = this.win.getElementById('viewProjectHeader');
    
    this.win.syncWait(this._plugin.getString('MyProjects.loadingProject'), 'initCancel', null, 2);
    OS.ajaxInvokeService(MyProjectsView.LOAD_PROJECT_SERVICE, this, '_loadProject', null, null, { 'projectId': this.params.projectId });
    
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
  
	// {{{ print
	/**
	 * opens the print view for this project
   * @access public
	 * @return void
	 */
	this.print = function() {
    OS.print(MyProjectsView.SERVICE_PRINT, this._project.projectId);
	};
	// }}}
  
	// {{{ removeFileCategory
	/**
	 * removes the selected file category
   * @access public
	 * @return void
	 */
	this.removeFileCategory = function() {
    var option = this._fieldFileCategories.options[this._fieldFileCategories.selectedIndex];
    if (option.value != '') {
      SRAOS_Util.removeOptionFromSelectField(this._fieldFileCategories, option);
      if (!this._fieldFileCategories.options.length) { SRAOS_Util.addOptionToSelectField(this._fieldFileCategories, new Option(OS.getString('text.none'), '')); }
      if (option.value != 'add') {
        this._removeFileCategories.push(option.value);
      }
    }
  };
  // }}}
  
	// {{{ removeMessageCategory
	/**
	 * removes the selected message category
   * @access public
	 * @return void
	 */
	this.removeMessageCategory = function() {
    var option = this._fieldMessageCategories.options[this._fieldMessageCategories.selectedIndex];
    if (option.value != '') {
      SRAOS_Util.removeOptionFromSelectField(this._fieldMessageCategories, option);
      if (!this._fieldMessageCategories.options.length) { SRAOS_Util.addOptionToSelectField(this._fieldMessageCategories, new Option(OS.getString('text.none'), '')); }
      if (option.value != 'add') {
        this._removeMessageCategories.push(option.value);
      }
    }
  };
  // }}}
  
	// {{{ saveProject
	/**
	 * saves the project
   * @access public
	 * @return void
	 */
	this.saveProject = function() {
    var attrs = this._permissionsForm.getAjaxAttrs();
    if (this._categoriesDirty() || this.win.isDirty() || attrs) {
      if (!attrs) { attrs = new Array(); }
      attrs['name'] = this._fieldName.value;
      attrs['archived'] = this._fieldArchivedYes.checked;
      var newStatus = SRAOS_Util.getSelectValue(this._fieldStatus);
      if (newStatus != this._project.status) {
        // cancel if user does not confirm completion of the project
        if (this._project.getCompleteConfirmMsg && newStatus == 'completed' && !OS.confirm(this._project.getCompleteConfirmMsg)) {
          return;
        }
        attrs['status'] = newStatus;
      }
      this.win.syncWait(this._plugin.getString('MyProjects.savingProject'));
      attrs['summary'] = this._tabs.getActive() == 'otherInfo' ? this._fieldSummary.value : this._project.summary;
      if (!this._project.dueDateFixed) { attrs['dueDate'] = this._fieldDueDate.value; }
      
      // add categories
      var fileCategoryCounter = 0;
      for(var i=0; i<this._fieldFileCategories.options.length; i++) {
        if (this._fieldFileCategories.options[i].value == 'add') {
          attrs['fileCategories_' + (fileCategoryCounter++) + '_name'] = this._fieldFileCategories.options[i].text;
        }
      }
      var messageCategoryCounter = 0;
      for(var i=0; i<this._fieldMessageCategories.options.length; i++) {
        if (this._fieldMessageCategories.options[i].value == 'add') {
          attrs['messageCategories_' + (messageCategoryCounter++) + '_name'] = this._fieldMessageCategories.options[i].text;
        }
      }
      
      // remove categories
      for(var i in this._removeFileCategories) {
        attrs['fileCategories_' + this._removeFileCategories[i] + '_remove'] = 1;
      }
      for(var i in this._removeMessageCategories) {
        attrs['messageCategories_' + this._removeMessageCategories[i] + '_remove'] = 1;
      }
      OS.ajaxInvokeService(MyProjects.SERVICE_UPDATE, this, '_saveProject', null, new SRAOS_AjaxRequestObj(this._project.projectId, attrs, SRAOS_AjaxRequestObj.TYPE_UPDATE));
    }
    else {
      OS.closeWindow(this.win);
    }
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
    if (id == 'otherInfo') {
      this._fieldSummary.value = this._project.summary ? this._project.summary : '';
      this._fieldSummary.style.overflow = 'auto';
    }
    else if (this._activeTab == 'otherInfo') {
      this._project.summary = this._fieldSummary.value;
      this._fieldSummary.value = '';
      this._fieldSummary.style.overflow = 'hidden';
    }
    this._activeTab = id;
	};
	// }}}
  
	// {{{ toggleEditMode
	/**
	 * handles ajax invocation response to loading the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this.toggleEditMode = function() {
    if (this._project && this._project.getUserPermissions == MyProjects.PERMISSIONS_ADMIN) {
      this._edit = !this._edit;
      if (this._edit) {
        this._divView.style.overflow = 'hidden';
        this._divView.style.visibility = 'hidden';
        this._viewProjectHeader.style.visibility = 'hidden';
        this._divButtons.style.visibility = 'inherit';
        this._tabs.show();
      }
      else {
        this._divView.style.overflow = 'auto';
        this._divView.style.visibility = 'inherit';
        this._viewProjectHeader.style.visibility = 'inherit';
        this._divButtons.style.visibility = 'hidden';
        this._tabs.hide();
      }
      this._editProjectToggle.innerHTML = OS.getString(this._edit ? 'text.view' : 'text.edit');
    }
  };
  // }}}
  
  
	// {{{ _categoriesDirty
	/**
	 * returns true if any of the categories have been changed
   * @access public
	 * @return void
	 */
	this._categoriesDirty = function() {
    if (this._removeFileCategories.length || this._removeMessageCategories.length) { return true; }
    for(var i=0; i<this._fieldFileCategories.options.length; i++) {
      if (this._fieldFileCategories.options[i].value == 'add') {
        return true;
      }
    }
    for(var i=0; i<this._fieldMessageCategories.options.length; i++) {
      if (this._fieldMessageCategories.options[i].value == 'add') {
        return true;
      }
    }
    return false;
  };
  // }}}
  
	// {{{ _deleteProject
	/**
	 * handles ajax invocation response to deleting the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._deleteProject = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToDeleteProject'), response);
      }
      else {
        this._deleted = true;
        OS.closeWindow(this.win, true);
      }
    }
  };
  // }}}
  
	// {{{ _loadCategories
	/**
	 * handles ajax invocation response to loading the project categories
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadCategories = function(response) {
    if (this.win.isClosed()) { return; }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadProjectCategories'), response);
      this.initCancel();
    }
    else {
      this.win.syncStep();
      SRAOS_Util.clearSelectField(this._fieldFileCategories);
      var fileCategories = new Array();
      for(var i in response.results) {
        if (response.results[i].file) {
          fileCategories.push(new Option(response.results[i].name, response.results[i].categoryId));
        }
      }
      if (!fileCategories.length) { fileCategories.push(new Option(OS.getString('text.none'), '')); }
      SRAOS_Util.addOptionsToSelectField(this._fieldFileCategories, fileCategories);
      
      SRAOS_Util.clearSelectField(this._fieldMessageCategories);
      var messageCategories = new Array();
      for(var i in response.results) {
        if (!response.results[i].file) {
          messageCategories.push(new Option(response.results[i].name, response.results[i].categoryId));
        }
      }
      if (!messageCategories.length) { messageCategories.push(new Option(OS.getString('text.none'), '')); }
      SRAOS_Util.addOptionsToSelectField(this._fieldMessageCategories, messageCategories);
    }
  };
  // }}}
  
	// {{{ _loadProject
	/**
	 * handles ajax invocation response to loading the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadProject = function(response) {
    if (this.win.isClosed()) { return; }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadProject'), response);
      this.initCancel();
    }
    else {
      this._participants = response.results.participants ? response.results.participants : null;
      this._project = response.results.project;
      this._divView.innerHTML = response.results.viewHtml;
      this._editProjectToggle.style.visibility = this._project.getUserPermissions == MyProjects.PERMISSIONS_ADMIN ? 'inherit' : 'hidden';
      this._viewProjectHeader.style.backgroundImage = "url(" + this._project.getIcon.replace(new RegExp("\\$\\{size\\}", "gim"), "32") + ")";
      this._viewProjectHeader.innerHTML = this._project.name;
      
      // set custom labels
      if (response.results.pluginForLabels) {
        var plugin = OS.getPlugin(response.results.pluginForLabels);
        if (plugin) {
          var prefix = response.results.pluginLabelsPrefix ? response.results.pluginLabelsPrefix : '';
          
          if (plugin.getString(prefix + 'MyProjects.newProject.whatName')) this.win.getElementById('myProjectsLabelWhatName1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whatName');
          if (plugin.getString(prefix + 'MyProjects.newProject.whatNameHelp')) this.win.getElementById('myProjectsLabelWhatNameHelp1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whatNameHelp');
          
          if (plugin.getString(prefix + 'MyProjects.viewProject.archived')) this.win.getElementById('myProjectsLabelProjectArchived').innerHTML = plugin.getString(prefix + 'MyProjects.viewProject.archived');
          if (plugin.getString(prefix + 'MyProjects.viewProject.archivedHelp')) this.win.getElementById('myProjectsLabelProjectArchivedHelp').innerHTML = plugin.getString(prefix + 'MyProjects.viewProject.archived');
          
          if (plugin.getString(prefix + 'MyProjects.viewProject.status')) this.win.getElementById('myProjectsLabelProjectStatus').innerHTML = plugin.getString(prefix + 'MyProjects.viewProject.status');
          if (plugin.getString(prefix + 'MyProjects.viewProject.statusHelp')) this.win.getElementById('myProjectsLabelProjectStatusHelp').innerHTML = plugin.getString(prefix + 'MyProjects.viewProject.statusHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.whichParticipants')) this.win.getElementById('myProjectsLabelWhichParticipants2').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whichParticipants');
          if (plugin.getString(prefix + 'MyProjects.newProject.selectParticipantsHelp')) this.win.getElementById('myProjectsLabelSelectParticipantsHelp1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.selectParticipantsHelp');
          
          if (plugin.getString(prefix + 'MyProject.fileCategories')) this.win.getElementById('myProjectsLabelFileCategories').innerHTML = plugin.getString(prefix + 'MyProject.fileCategories');
          if (plugin.getString(prefix + 'MyProject.fileCategoriesHelp')) this.win.getElementById('myProjectsLabelFileCategoriesHelp').innerHTML = plugin.getString(prefix + 'MyProject.fileCategoriesHelp');
          
          if (plugin.getString(prefix + 'MyProject.messageCategories')) this.win.getElementById('myProjectsLabelMessageCategories').innerHTML = plugin.getString(prefix + 'MyProject.messageCategories');
          if (plugin.getString(prefix + 'MyProject.messageCategoriesHelp')) this.win.getElementById('myProjectsLabelMessageCategoriesHelp').innerHTML = plugin.getString(prefix + 'MyProject.messageCategoriesHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.projectSummary')) this.win.getElementById('myProjectsLabelProjectSummary1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectSummary');
          if (plugin.getString(prefix + 'MyProjects.newProject.projectSummaryHelp')) this.win.getElementById('myProjectsLabelProjectSummaryHelp1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectSummaryHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.projectDueDate')) this.win.getElementById('myProjectsLabelProjectDueDate1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectDueDate');
          if (plugin.getString(prefix + 'MyProjects.newProject.projectDueDateHelp')) this.win.getElementById('myProjectsLabelProjectDueDateHelp1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectDueDateHelp');
        }
      }
      
      // load edit tabs
      if (this._project.getUserPermissions == MyProjects.PERMISSIONS_ADMIN) {
        this.win.syncStep(this._plugin.getString('MyProjects.loadingCategories'));
        OS.ajaxInvokeService(MyProjects.SERVICE_GET_CATEGORIES, this, '_loadCategories', null, null, { 'projectId': this.params.projectId });
        
        if (response.results.wfViewTpl) { this._divInit.innerHTML = '<h3>' + this._plugin.getString('MyProjects.infoCannotBeEdited') + '</h3>\n' + response.results.wfViewTpl; }
        this._fieldArchivedNo.checked = !this._project.archived;
        this._fieldArchivedYes.checked = this._project.archived;
        this._fieldDueDate.value = this._project.dueDate ? this._project.dueDate : '';
        if (this._project.dueDateFixed) {
          this.win.getElementById('dueDateChooser1').style.visibility = 'hidden';
          this._fieldDueDate.disabled = true;
        }
        this._fieldName.value = this._project.name;
        this._permissionsForm.setBaseEmailParticipants(response.results.emailParticipants);
        this._permissionsForm.setBaseParticipants(response.results.participants);
        SRAOS_Util.setSelectValue(this._fieldStatus, this._project.status);
        
        this.win.setDirtyFlags();
        var tabs = new Array();
        tabs.push(new SRAOS_Tab('base', this._plugin.getString('MyProject.baseInfo'), this._divBase));
        tabs.push(new SRAOS_Tab('participants', this._plugin.getString('text.participants'), this._divParticipants));
        tabs.push(new SRAOS_Tab('categories', this._plugin.getString('text.categories'), this._divCategories));
        tabs.push(new SRAOS_Tab('otherInfo', OS.getString('text.other'), this._divOtherInfo));
        if (response.results.wfViewTpl) {
          tabs.push(new SRAOS_Tab('init', this._plugin.getString('text.initialization'), this._divInit));
        }
        this._tabs = new SRAOS_TabSet(tabs, this._divTabs, null, this);
        this._tabs.hide();
      }
      else {
        this.win.syncFree();
      }
    }
  };
  // }}}
  
	// {{{ _saveProject
	/**
	 * handles ajax invocation response to updating the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveProject = function(response) {
    if (!this.win.isClosed()) { this.win.syncFree(); }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToUpdateProject'), response);
    }
    else {
      this._saved = true;
      this.win.setDirtyFlags();
      OS.closeWindow(this.win);
    }
  };
  // }}}

};


/**
 * the name of the ajax service used to load a project
 * @type String
 */
MyProjectsView.LOAD_PROJECT_SERVICE = 'myProjectsLoad';

/**
 * the name of the ajax service used print a project
 * @type String
 */
MyProjectsView.SERVICE_PRINT = 'myProjectPrint';
// }}}
