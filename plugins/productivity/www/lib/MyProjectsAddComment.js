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
 * Add comment window manager
 */
MyProjectsAddComment = function() {
  
  
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
   * a reference to the comments textarea
   * @type Object
   */
  this._commentField;
  
  /**
   * a reference to the files div
   * @type Object
   */
  this._filesDiv;
  
  /**
   * the message or whiteboard id that this comment pertains to
   * @type int
   */
  this._id;
  
  /**
   * whether or not this comment is for a message
   * @type boolean
   */
  this._isMessage;
  
  /**
   * the # of file fields currently displayed
   * @type int
   */
  this._numFiles = 0;
  
  /**
   * the plugin for this window
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  
	// {{{ addFile
	/**
	 * adds another file field
   * @access public
	 * @return void
	 */
	this.addFile = function() {
    this._numFiles++;
    var div = this.win.getElementById('myProjectsCommentFile' + this._numFiles);
    div.style.position = 'static';
    div.style.visibility = 'inherit';
    if (this._numFiles == 1) { 
      this._addFilesLink.innerHTML = this._plugin.getString('text.attachAnotherFile'); 
    }
    else if (this._numFiles == MyProjects.MAX_FILES_ATTACH) {
      this._addFilesDiv.style.position = 'absolute';
      this._addFilesDiv.style.visibility = 'hidden';
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
		this._commentField.focus();
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
    this._addFilesDiv = this.win.getElementById('myProjectsAddCommentFileDiv');
    this._addFilesLink = this.win.getElementById('myProjectsAddCommentFileLink');
    this._commentField = this.win.getElementById('myProjectsComment');
    this._filesDiv = this.win.getElementById('myProjectsCommentFiles');
    this._plugin = this.win.getPlugin();
    var tmp = this.params.id.split(':');
    this._isMessage = tmp[0] == 'message';
    this._id = tmp[1];
    this.win.getElementById('myProjectsCommentHeader').innerHTML = this._plugin.getString('MyProjects.commentBy', { name: OS.user.name });
    
		return true;
	};
	// }}}
  
	// {{{ preview
	/**
	 * shows a preview of the user's comments
   * @access public
	 * @return void
	 */
	this.preview = function() {
    if (!this._commentField.value || SRAOS_Util.trim(this._commentField.value) == '') {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.comment'));
    }
    else {
      this.win.syncWait(this._plugin.getString('text.loadingPreview'));
      OS.ajaxInvokeService(Core_Services.SERVICE_WIKI_TO_HTML, this, '_preview', null, null, { wiki: this._commentField.value });
    }
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
    var div = this.win.getElementById('myProjectsCommentFile' + id);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    this._numFiles--;
    if (this._numFiles == 0) { this._addFilesLink.innerHTML = this._plugin.getString('text.attachFile'); } 
	};
	// }}}
  
	// {{{ save
	/**
	 * saves the user's comment
   * @access public
	 * @return void
	 */
	this.save = function() {
    if (!this._commentField.value || SRAOS_Util.trim(this._commentField.value) == '') {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.comment'));
    }
    else {
      this.win.syncWait(this._plugin.getString('MyProjects.addingComment'));
      var params = new Array();
      if (this._numFiles > 0) {
        var counter = 0;
        for(var i=1; i<=MyProjects.MAX_FILES_ATTACH; i++) {
          if (this.win.getElementById('myProjectsCommentFile' + i).style.position == 'static') {
            counter++;
            params.push(new SRAOS_AjaxServiceParam('files_' + counter + '_file', 'myProjectsCommentFile' + i, SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE));
            if (counter == this._numFiles) { break; }
          }
        }
      }
      params.push(new SRAOS_AjaxServiceParam('comment', this._commentField.value));
      params.push(new SRAOS_AjaxServiceParam(this._isMessage ? 'messageId' : 'whiteboardId', this._id));
      
      OS.ajaxInvokeService(MyProjects.SERVICE_COMMENT, this, '_save', null, new SRAOS_AjaxRequestObj(null, params, SRAOS_AjaxRequestObj.TYPE_CREATE));
    }
	};
	// }}}
  
	// {{{ spellcheck
	/**
	 * launches the spellcheck for this comment
   * @access public
	 * @return void
	 */
	this.spellcheck = function() {
    Core_Services.spellcheck(this._commentField);
	};
	// }}}
  
  
	// {{{ _preview
	/**
	 * handles ajax invocation response to updating the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._preview = function(response) {
    if (!this.win.isClosed()) { this.win.syncFree(); }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadPreview'), response);
    }
    else {
      OS.msgBox(response.results, this._plugin.getString('MyProjects.commentBy', { name: OS.user.name }), this._plugin.getIconUri(32, 'comment.png'));
    }
  };
  // }}}
  
	// {{{ _save
	/**
	 * handles ajax invocation response to updating the project for this view
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._save = function(response) {
    if (!this.win.isClosed()) { this.win.syncFree(); }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToAddComment'), response);
    }
    else {
      var myProjects = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
      myProjects.refreshDiscussion(this.params.id);
      myProjects.reloadDashboardLatestActivity();
      OS.closeWindow(this.win);
    }
  };
  // }}}
};
// }}}
