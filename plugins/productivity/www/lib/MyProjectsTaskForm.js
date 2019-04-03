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
 * MyProjects task form window manager. this window may be instantiated with the 
 * following parameters:
 *  confirm:        the complete task confirm message
 *  form:           the form to display
 *  noSaveComplete: whether or not the 'Save and Complete Task' button should be 
 *                  displayed when applicable (default behavior is to show it)
 *  readOnly:       whether or not to disable the input fields and save buttons 
 *                  in the form
 *  task:           the task this form pertains to
 *  validateOnSave: whether or not to validate the entity even if the user only 
 *                  clicks the 'Save' button
 *  view:           whether or not this window has been opened for a view 
 *                  (versus a form)
 */
MyProjectsTaskForm = function() {
  /**
   * a reference to the form fields 
   * @type Array
   */
  this._formFields;
  
  /**
   * a reference to the form fields that should be included in a spellcheck
   * @type Array
   */
  this._formFieldsSpellcheck = new Array();
  
  /**
   * the productivity plugin
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  /**
   * the project that the task pertains to
   * @type Object
   */
  this._project;
  
  /**
   * the task this window was opened for
   * @type Object
   */
  this._task;
  
  
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
    if (this._saved || this.params.readOnly || this.params.view || !this.win.isDirty() || OS.confirm(this._plugin.getString('MyProjects.closeDirty'))) {
      MyProjectsTaskForm.instance = null;
      return true;
    }
    else {
      return false;
    }
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
		MyProjectsTaskForm.instance = this;
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
    
    MyProjectsTaskForm.instance = this;
    
    this._plugin = this.win.getPlugin();
    
    if (!this.params.task || !this.params.form) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.taskForm'));
      return false;
    }
    
    this._task = this.params.task;
    this._project = MyProjects.getManager().getProject(this._task.projectId);
    
    this.win.getElementById('myProjectsTaskFormId').value = this._task.taskId;
    this.win.getElementById('myProjectsTaskFormValidate').value = this.params.validateOnSave ? '1' : '0';
    this.win.getElementById('myProjectsTaskFormHeader').innerHTML = this._task.title;
    
    var formDiv = this.win.getElementById('myProjectsTaskForm');
    
    // populate task, project and user attributes
    this.params.form = SRAOS_Util.substituteParams(this.params.form, this._task, 'task_', true);
    this.params.form = SRAOS_Util.substituteParams(this.params.form, this._project, 'project_', true);
    this.params.form = SRAOS_Util.substituteParams(this.params.form, OS.user, 'user_', true);
    
    // extract any script
    var execScript = SRAOS_Util.extractScript(this.params.form);
    if (execScript) { this.params.form = SRAOS_Util.stripScript(this.params.form); }
    
    // prefix ids
    this.params.form = SRAOS_Util.prefixIds(this.params.form, this.win.getDivId());
    
    formDiv.innerHTML = this.params.form;
    this._formFields = SRAOS_Util.getFormFields(formDiv);
    if (this.params.readOnly) {
      for(var i in this._formFields) {
        this._formFields[i].disabled = true;
      }
    }
    
    // spellcheck fields
    for(var i in this._formFields) {
      if (SRAOS_Util.isTextField(this._formFields[i])) {
        this._formFieldsSpellcheck.push(this._formFields[i]);
      }
    }
    
    // disable spellcheck when no fields are spellcheckable
    if (this._formFieldsSpellcheck.length == 0) {
      this.win.disableButton('btnTaskFormSpellcheck');
    }
    
    if (!this.params.readOnly && !this.params.view) {
      this.win.setDirtyFlags();
    }
    if (this.params.readOnly || this.params.view) {
      this.win.getElementById('myProjectsTaskFormButtonSave').style.visibility = 'hidden';
      this.win.getElementById('myProjectsTaskFormButtonSaveComplete').value = this.params.readOnly ? OS.getString('form.close') : this._plugin.getString('MyProjectTask.confirmAndComplete');
    }
    else if (this.params.noSaveComplete) {
      this.win.getElementById('myProjectsTaskFormButtonSaveComplete').style.display = 'none';
    }
    
    // evaluate javascript
    if (execScript) {
      try {
        eval(execScript); 
      }
      catch (e) {}
    }
    
    return true;
  };
  // }}}
  
	// {{{ save
	/**
	 * saves the data on the form without completing the task
   * @access public
	 * @return void
	 */
	this.save = function() {
    if (!this.params.readOnly && !this.params.view) {
      this.win.submitForm(MyProjectsTaskForm.SERVICE_UPDATE, null, null, 'MyProjects.savingTask', 'MyProjects.error.unableToUpdateTask', false, false, this, '_save');
    }
  };
  // }}}
  
	// {{{ saveComplete
	/**
	 * saves the data on the form and completes the task
   * @access public
	 * @return void
	 */
	this.saveComplete = function() {
    if (this.params.readOnly) {
      OS.closeWindow(this.win);
    }
    else {
      if (!this.params.confirm || OS.confirm(this.params.confirm)) {
        this.win.submitForm(MyProjects.SERVICE_COMPLETE_TASK, null, null, 'MyProjects.savingAndCompletingTask', 'MyProjects.error.unableToUpdateTask', false, false, this, '_saveComplete', { '_confirmed': true });
      }
    }
  };
  // }}}
  
	// {{{ spellcheck
	/**
	 * spellchecks the text fields on the form
   * @access public
	 * @return void
	 */
	this.spellcheck = function() {
    var check = false;
    var str = '';
    var started = false;
    for(var i in this._formFieldsSpellcheck) {
      str += started ? '....' : '';
      str += this._formFieldsSpellcheck[i].value.length > 0 ? this._formFieldsSpellcheck[i].value : '';
      if (SRAOS_Util.trim(this._formFieldsSpellcheck[i].value) != '') { check = true; }
      started = true;
    }
    str != '' ? Core_Services.spellcheckCallback(str, '_spellcheck') : OS.displayErrorMessage(this._plugin.getString('MyProjectTask.error.nothingToSpellcheck'));
  };
  // }}}
  
  
	// {{{ _save
	/**
	 * handles ajax invocation response to completing a task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._save = function(response) {
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToUpdateTask'), response);
    }
    else {
      if (SRAOS_Util.isString(response.results)) {
        OS.displayErrorMessage(response.results);
      }
      else {
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        this._saved = true;
        OS.closeWindow(this.win);
      }
    }
  };
  // }}}
  
	// {{{ _saveComplete
	/**
	 * handles ajax invocation response to completing a task
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._saveComplete = function(response) {
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToUpdateTask'), response);
    }
    else {
      if (response.results.error) {
        OS.displayErrorMessage(response.results.error);
      }
      else {
        var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
        myProjects.reloadDashboardLatestActivity();
        myProjects.refreshTasks();
        this._saved = true;
        OS.closeWindow(this.win);
      }
    }
  };
  // }}}
  
	// {{{ _spellcheck
	/**
	 * callback for the spellcheck process
   * @access public
	 * @return void
	 */
	this._spellcheck = function(str) {
    var pieces = str.split('....');
    for(var i in this._formFieldsSpellcheck) {
      this._formFieldsSpellcheck[i].value = pieces[i];
    }
  };
  // }}}
  
};

/**
 * the name of the ajax service for updating a task form
 * @type string
 */
MyProjectsTaskForm.SERVICE_UPDATE = "myProjectsUpdateTaskForm";

/**
 * stores a reference to the currently active task form window manager
 * @type MyProjectTaskForm
 */
MyProjectsTaskForm.instance;
// }}}
