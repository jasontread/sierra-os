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
 * New Project window manager
 */
MyProjectsNew = function() {
  
  /**
   * a reference to the base fields div
   * @type Object
   */
  this._divBase;
  
  /**
   * a reference to the initialization div
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
   * a reference to the add participants checkbox
   * @type Object
   */
  this._fieldAddParticipants;
  
  /**
   * a reference to the back button
   * @type Object
   */
  this._fieldBackButton;
  
  /**
   * a reference to the project due date field
   * @type Object
   */
  this._fieldDueDate;
  
  /**
   * a reference to the project name field
   * @type Object
   */
  this._fieldName;
  
  /**
   * a reference to the next button
   * @type Object
   */
  this._fieldNextButton;
  
  /**
   * a reference to the other info checkbox
   * @type Object
   */
  this._fieldOtherInfo;
  
  /**
   * a reference to the project summary field
   * @type Object
   */
  this._fieldSummary;
  
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
   * whether or not step 0 should be disabled
   * @type boolean
   */
  this._skipStep0 = false;
  
  /**
   * the current step
   * @type int
   */
  this._step = 1;
  
  /**
   * whether or not step 1 has been displayed
   * @type boolean
   */
  this._step1Displayed = false;
  
  /**
   * whether or not step 2 has been displayed
   * @type boolean
   */
  this._step2Displayed = false;
  
  /**
   * whether or not step 3 has been displayed
   * @type boolean
   */
  this._step3Displayed = false;
  
  /**
   * a reference to the template for the new project
   * @type object
   */
  this._template;
  
	// {{{ back
	/**
	 * returns to the previous step of the project creation form
   * @access public
	 * @return void
	 */
	this.back = function() {
    if (this._step == 3 && this._fieldAddParticipants.checked) {
      this._divInit.style.visibility = "hidden";
      this._divBase.style.visibility = "hidden";
      this._divOtherInfo.style.visibility = "hidden";
      this._divParticipants.style.visibility = "inherit";
      this._step = 2;
      this.updateBackButtonVisibility();
      this.updateNextButtonText();
    }
    else if (this._step == 1 && this._template && this._template.wfStart) {
      this._divInit.style.visibility = "inherit";
      this._divBase.style.visibility = "hidden";
      this._divOtherInfo.style.visibility = "hidden";
      this._divParticipants.style.visibility = "hidden";
      this._step = 0;
      this.updateBackButtonVisibility();
      this.updateNextButtonText();
    }
    else if (this._step > 1) {
      this._divInit.style.visibility = "hidden";
      this._divBase.style.visibility = "inherit";
      this._divOtherInfo.style.visibility = "hidden";
      this._divParticipants.style.visibility = "hidden";
      this._step = 1;
      this.updateBackButtonVisibility();
      this.updateNextButtonText();
      this._fieldName.focus();
    }
  };
  // }}}
  
	// {{{ completeValidateParams
	/**
	 * handles ajax invocation response to loading a project template
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this.completeValidateParams = function(response) {
    if (this.win.isClosed()) { return; }
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString(response.requestId), response);
      this.initCancel();
    }
    else {
      if (SRAOS_Util.isString(response.results)) {
        OS.displayErrorMessage(response.results);
        this._skipStep0 ? this.initCancel() : this.setStep(0);
        return;
      }
      else if (response.results !== true) {
        this.params = response.results;
      }
      else {
        this.params = SRAOS_Util.getFormValues(this._divInit);
      }
      this.setStep(1);
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
  
	// {{{ loadProjectTemplate
	/**
	 * handles ajax invocation response to loading a project template
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this.loadProjectTemplate = function(response) {
    if (this.win.isClosed()) { return; }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString(response.requestId), response);
      this.initCancel();
    }
    else {
      this._template = response.results;
      if (this._template.icon32) {
        this.win.getElementById('newProjectHeader').style.backgroundImage = "url(" + this._template.icon32 + ")";
      }
      if (this._template.type) {
        this.win.getElementById('newProjectHeader').innerHTML = this._template.type;
      }
      if (this._template.wfStart) {
        this._divInit.innerHTML = SRAOS_Util.prefixIds(this._template.wfStart, this.win.getDivId());
        if (this._template.wfStartInit) {
          eval(this._template.wfStartInit + "('" + this.win.getDivId() + "');");
        }
      }
      if (this._template.wfStart && SRAOS_Util.getLength(this.params) > 0 && this._template.wfAjaxValidator) {
        // validate parameters
        this.win.syncWait(this._plugin.getString('MyProjects.validatingParameters'));
        OS.ajaxInvokeService(this._template.wfAjaxValidator, this, 'completeValidateParams', null, null, this.params);
        this._skipStep0 = true;
      }
      else {
        this.setStep(this._template.wfStart ? 0 : 1);
        this.win.syncFree();
      }
      // set custom labels
      if (this._template.pluginForLabels) {
        var plugin = OS.getPlugin(this._template.pluginForLabels);
        if (plugin) {
          var prefix = this._template.pluginLabelsPrefix ? this._template.pluginLabelsPrefix : '';
          
          if (plugin.getString(prefix + 'MyProjects.newProject.whatName')) this.win.getElementById('myProjectsLabelWhatName').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whatName');
          if (plugin.getString(prefix + 'MyProjects.newProject.whatNameHelp')) this.win.getElementById('myProjectsLabelWhatNameHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whatNameHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.whichParticipants')) {
            this.win.getElementById('myProjectsLabelWhichParticipants').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whichParticipants');
            this.win.getElementById('myProjectsLabelWhichParticipants1').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whichParticipants');
          }
          
          if (plugin.getString(prefix + 'MyProjects.newProject.whichParticipantsHelp')) this.win.getElementById('myProjectsLabelWhichParticipantsHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.whichParticipantsHelp');
          if (plugin.getString(prefix + 'MyProjects.newProject.addParticipants')) this.win.getElementById('myProjectsLabelAddParticipants').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.addParticipants');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.otherInfo')) this.win.getElementById('myProjectsLabelOtherInfo').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.otherInfo');
          if (plugin.getString(prefix + 'MyProjects.newProject.otherInfoHelp')) this.win.getElementById('myProjectsLabelOtherInfoHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.otherInfoHelp');
          if (plugin.getString(prefix + 'MyProjects.newProject.specifyOtherInfo')) this.win.getElementById('myProjectsLabelSpecifyOtherInfo').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.specifyOtherInfo');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.selectParticipantsHelp')) this.win.getElementById('myProjectsLabelSelectParticipantsHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.selectParticipantsHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.projectSummary')) this.win.getElementById('myProjectsLabelProjectSummary').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectSummary');
          if (plugin.getString(prefix + 'MyProjects.newProject.projectSummaryHelp')) this.win.getElementById('myProjectsLabelProjectSummaryHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectSummaryHelp');
          
          if (plugin.getString(prefix + 'MyProjects.newProject.projectDueDate')) this.win.getElementById('myProjectsLabelProjectDueDate').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectDueDate');
          if (plugin.getString(prefix + 'MyProjects.newProject.projectDueDateHelp')) this.win.getElementById('myProjectsLabelProjectDueDateHelp').innerHTML = plugin.getString(prefix + 'MyProjects.newProject.projectDueDateHelp');
        }
      }
    }
  };
  // }}}
  
	// {{{ next
	/**
	 * proceeds to the next step of the project creation form
   * @access public
	 * @return void
	 */
	this.next = function() {
    if (this._step == 1 && SRAOS_Util.trim(this._fieldName.value) == '') {
      OS.msgBox(this._plugin.getString('MyProjects.error.nameIsRequired'), null, SRAOS.ICON_ERROR);
    }
    else if (this._step == 0) {
      var data = SRAOS_Util.getFormValues(this._divInit);
      // validate
      if (this._template.wfValidator) {
        eval("results = " + this._template.wfValidator + "(data);");
        if (results !== true) {
          OS.displayErrorMessage(results);
          return;
        }
      }
      // ajax validate
      if (this._template.wfAjaxValidator) {
        this.win.syncWait(this._plugin.getString('MyProjects.validatingParameters'));
        OS.ajaxInvokeService(this._template.wfAjaxValidator, this, 'completeValidateParams', null, null, data);
      }
      else {
        this._divInit.style.visibility = "hidden";
        this._divBase.style.visibility = "visible";
        this._divOtherInfo.style.visibility = "hidden";
        this._divParticipants.style.visibility = "hidden";
        this._step = 1;
        this.params = SRAOS_Util.getFormValues(this._divInit);
        this._step1Init();
        this.updateBackButtonVisibility();
        this.updateNextButtonText();
        this._fieldName.focus();
      }
    }
    else if (this._step == 1 && this._fieldAddParticipants.checked) {
      this._divInit.style.visibility = "hidden";
      this._divBase.style.visibility = "hidden";
      this._divOtherInfo.style.visibility = "hidden";
      this._divParticipants.style.visibility = "visible";
      this._step = 2;
      this._step2Init();
      this.updateBackButtonVisibility();
      this.updateNextButtonText();
    }
    else if ((this._step == 1 && !this._fieldAddParticipants.checked && this._fieldOtherInfo.checked) || (this._step == 2 && this._fieldOtherInfo.checked)) {
      this._divInit.style.visibility = "hidden";
      this._divBase.style.visibility = "hidden";
      this._divOtherInfo.style.visibility = "visible";
      this._divParticipants.style.visibility = "hidden";
      this._step = 3;
      this._step3Init();
      this.updateBackButtonVisibility();
      this.updateNextButtonText();
      this._fieldSummary.focus();
    }
    else {
      var attrs = this._fieldAddParticipants.checked ? this._permissionsForm.getAjaxAttrs() : new Array();
      if (!attrs) { attrs = new Array(); }
      attrs['name'] = this._fieldName.value;
      // add advanced settings
      if (this._fieldOtherInfo.checked) {
        if (SRAOS_Util.trim(this._fieldSummary.value) != '') { attrs['summary'] = this._fieldSummary.value; }
        if (SRAOS_Util.trim(this._fieldDueDate.value) != '') { attrs['dueDate'] = this._fieldDueDate.value; }
      }
      if (this._template) {
        attrs['template'] = this._template.id;
        if (this._template.wfStart) {
          attrs['wfParams'] = this.params; 
        }
      }
      OS.ajaxInvokeService(MyProjects.SERVICE_CREATE, this, "_createProject", null, new SRAOS_AjaxRequestObj(null, attrs));
      this.win.syncWait(this._plugin.getString('MyProjects.creatingProject'));
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
    this._plugin = this.win.getPlugin();
    
    this._divBase = this.win.getElementById('newProjectBase');
    this._divInit = this.win.getElementById('newProjectInit');
    this._divOtherInfo = this.win.getElementById('newProjectOtherInfo');
    this._divParticipants = this.win.getElementById('newProjectParticipants');
    
    this._fieldAddParticipants = this.win.getElementById('myProjectAddParticipants');
    this._fieldBackButton = this.win.getElementById('myProjectBackButton');
    this._fieldDueDate = this.win.getElementById('myProjectDueDate');
    OS.addDateChooser(this._fieldDueDate, this.win.getDivId() + 'dueDateChooser', true, MyProjects.DATE_CHOOSER_FORMAT, new Date());
    this._fieldName = this.win.getElementById('myProjectName');
    SRAOS_Util.addOnEnterEvent(this._fieldName, this, 'next');
    this._fieldNextButton = this.win.getElementById('myProjectNextButton');
    this._fieldOtherInfo = this.win.getElementById('myProjectOtherInfo');
    this._fieldSummary = this.win.getElementById('myProjectSummary');
    
    var permissionFields = new Array();
    for(var i in MyProjects.PERMISSIONS) {
      permissionFields[i] = this.win.getElementById('newProjectPermissions' + i);
    }
    this._permissionsForm = new MyProjectsPermissionsForm(this.win.getElementById('newAvailableParticipantsField'), this.win.getElementById('newCurrentParticipantsField'), permissionFields, this.win.getElementById('myProjectsAddParticipantLink'), this.win.getElementById('myProjectsRemoveParticipantLink'), this.win.getElementById('myProjectsUpdateParticipantLink'), this.win.getElementById('newCurrentParticipantsCount'), this.win.getElementById('viewProjectPermissionsSendIntroEmail'));
    this._permissionsForm.updatePermissionFields();
    
    if (this.params && this.params[MyProjectsNew.PROJECT_TYPE_KEY]) {
      this._projectType = this.params[MyProjectsNew.PROJECT_TYPE_KEY];
      this.params = SRAOS_Util.removeFromArray(MyProjectsNew.PROJECT_TYPE_KEY, this.params, 1, null, true);
      this.win.syncWait(this._plugin.getString('MyProjects.loadingProjectTemplate'), 'initCancel');
      OS.ajaxInvokeService(MyProjectsNew.GET_PROJECT_TEMPLATE_SERVICE, this, 'loadProjectTemplate', null, null, { 'id': this._projectType });
    }
    else {
      this._divBase.style.visibility = "visible";
      this._fieldName.focus();
      this._step1Init();
    }
    
    if (SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_FIREFOX) {
      var fieldDivs = this.win.getDomElements({ className: "myProjectFields" });
      for(var i in fieldDivs) {
        fieldDivs[i].style.overflow = 'auto';
      }
    }
    
		return true;
	};
	// }}}
  
	// {{{ setStep
	/**
	 * sets the wizard to the step specified
   * @param int step the step to set
   * @access public
	 * @return void
	 */
	this.setStep = function(step) {
    this._step = step;
    switch (this._step) {
      case 0:
        this._divInit.style.visibility = "visible";
        this._divBase.style.visibility = "hidden";
        this._divOtherInfo.style.visibility = "hidden";
        this._divParticipants.style.visibility = "hidden";
        this.updateBackButtonVisibility();
        this.updateNextButtonText();
        break;
      case 1:
        this._divInit.style.visibility = "hidden";
        this._divBase.style.visibility = "visible";
        this._divOtherInfo.style.visibility = "hidden";
        this._divParticipants.style.visibility = "hidden";
        this._step1Init();
        this.updateBackButtonVisibility();
        this.updateNextButtonText();
        this._fieldName.focus();
        break;
      case 2:
        this._divInit.style.visibility = "hidden";
        this._divBase.style.visibility = "hidden";
        this._divOtherInfo.style.visibility = "hidden";
        this._divParticipants.style.visibility = "visible";
        this._step2Init();
        this.updateBackButtonVisibility();
        this.updateNextButtonText();
        break;
      case 3:
        this._divInit.style.visibility = "hidden";
        this._divBase.style.visibility = "hidden";
        this._divOtherInfo.style.visibility = "visible";
        this._divParticipants.style.visibility = "hidden";
        this._step3Init();
        this.updateBackButtonVisibility();
        this.updateNextButtonText();
        break;
    }
  };
  // }}}
  
	// {{{ updateBackButtonVisibility
	/**
	 * updates the visibility for the back button
   * @access public
	 * @return void
	 */
	this.updateBackButtonVisibility = function() {
    this._fieldBackButton.style.visibility = (this._step == 1 && this._template && this._template.wfStart && !this._skipStep0) || this._step > 1 ? 'inherit' : 'hidden';
  };
  // }}}
  
	// {{{ updateNextButtonText
	/**
	 * updates the text on the "Create project now" button
   * @access public
	 * @return void
	 */
	this.updateNextButtonText = function() {
    this._fieldNextButton.value = this._plugin.getString(this._step == 0 || (this._step == 1 && (this._fieldAddParticipants.checked || this._fieldOtherInfo.checked)) || (this._step == 2 && this._fieldOtherInfo.checked) ? 'text.next' : 'MyProjects.createProjectNow');
  };
  // }}}
  
	// {{{ _createProject
	/**
	 * handes ajax response to project creation request
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._createProject = function(response) {
    this.win.syncFree();
    
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToCreateProject'), response);
    }
    else {
      this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager().selectProject(response.results[0].projectId);
      OS.closeWindow(this.win);
    }
  };
  // }}}
  
	// {{{ _step1Init
	/**
	 * initializes step 1 the first time it is displayed
   * @access public
	 * @return void
	 */
	this._step1Init = function() {
    if (!this._step1Displayed ) {
      if (this._template) {
        if (this._template.name) { this._fieldName.value = SRAOS_Util.substituteParams(this._template.name, this.params); }
        if (SRAOS_Util.getLength(this._template.participants) > 0 || SRAOS_Util.getLength(this._template.emailParticipants) > 0) { this._fieldAddParticipants.checked = true; }
        if (this._template.summary || this._template.dueDate) { this._fieldOtherInfo.checked = true; }
      }
      this._step1Displayed = true;
    }
  };
  // }}}
  
	// {{{ _step2Init
	/**
	 * initializes step 2 the first time it is displayed
   * @access public
	 * @return void
	 */
	this._step2Init = function() {
    if (!this._step2Displayed ) {
      if (this._template && SRAOS_Util.getLength(this._template.participants) > 0) {
        for(var i in this._template.participants) {
          this._permissionsForm.addParticipant(this._template.participants[i].id, this._template.participants[i].permissions, this._template.participants[i].group, this._template.participants[i].sendIntroEmail);
        }
      }
      if (this._template && SRAOS_Util.getLength(this._template.emailParticipants) > 0) {
        for(var i in this._template.emailParticipants) {
          this._permissionsForm.addEmailParticipant(this._template.emailParticipants[i].email, this._template.emailParticipants[i].name, this._template.emailParticipants[i].permissions, this._template.emailParticipants[i].password, this._template.emailParticipants[i].sendIntroEmail);
        }
      }
      this._step2Displayed = true;
    }
  };
  // }}}
  
  
	// {{{ _step3Init
	/**
	 * initializes step 3 the first time it is displayed
   * @access public
	 * @return void
	 */
	this._step3Init = function() {
    if (!this._step3Displayed ) {
      if (this._template && this._template.summary) {
        this._fieldSummary.value = SRAOS_Util.substituteParams(this._template.summary, this.params);
      }
      if (this._template && this._template.dueDate) {
        this._fieldDueDate.value = this._template.dueDate;
        this._fieldDueDate.disabled = this._template.dueDateFixed;
        this.win.getElementById('dueDateChooser').style.visibility = this._template.dueDateFixed ? 'hidden' : 'inherit';
      }
      this._step3Displayed = true;
    }
  };
  // }}}
};


/**
 * the name of the ajax service used to retrieve a project template
 * @type String
 */
MyProjectsNew.GET_PROJECT_TEMPLATE_SERVICE = 'myProjectsGetTemplate';

/**
 * the params key to identify a specified project type
 * @type String
 */
MyProjectsNew.PROJECT_TYPE_KEY = '_projectType';
// }}}
