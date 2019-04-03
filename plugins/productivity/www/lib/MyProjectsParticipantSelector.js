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
 * MyProjects participant selector window manager. this window should be opened 
 * using the following parameters:
 *  callback:     the callback object. this object must have the following 
 *                method:
 *                 addParticipant(participant : Object, projectId : int) : void
 *                where 'participant' is an object with the following 
 *                attributes:
 *                 id:           the group or user id (for all types except 
 *                               MyProjects.PARTICIPANT_EMAIL)
 *                 label:        the participant label
 *                 participantId:the participant id (for all types except 
 *                               MyProjects.PARTICIPANT_CREATOR)
 *                 permissions:  the participant permissions
 *                 pid:          the unique identifier for this participant. 
 *                               will be one of the following values:
 *                                 c[id]: id=creator uid (type=MyProjects.PARTICIPANT_CREATOR)
 *                                 p[id]: id=participant id (type=MyProjects.PARTICIPANT_USER or MyProjects.PARTICIPANT_GROUP)
 *                                 e[id]: id=participant id (type=MyProjects.PARTICIPANT_EMAIL)
 *                                 u[id]: id=uid (type=MyProjects.PARTICIPANT_GROUP_USER)
 *                 type:         the participant type. one of the 
 *                               MyProjects.PARTICIPANT_* constants. if not 
 *                               specified, only the 
 *                               MyProjects.PARTICIPANT_USER, 
 *                               MyProjects.PARTICIPANT_GROUP and 
 *                               MyProjects.PARTICIPANT_EMAIL types will be 
 *                               returned
 *  cbMethod:     the name of an alternative callback method with the same 
 *                signature show above for the default 'addParticipant' method
 *  header:       the header to use (in place of the default header)
 *  multiple:     whether or not to allow the user to select multiple 
 *                participants. the callback will be invoked once for each 
 *                participant. default value is false
 *  permissions:  a minimum permissions threshold. if not specified, no 
 *                minimum permissions threshold will be applied
 *  projectId:    the id of the project to return the participants for 
 *                (required)
 *  skip:         an array of pids to skip in the return results (see pid 
 *                format description below). if a value in this array is 
 *                numeric (not prefixed with c, p, e or u), then it will be 
 *                treated as a uid and any participants with that uid will be
 *                removed (of type c, p or u)
 *  types:        the types of participants to include. this is a bitmask 
 *                containing one or more of the 
 *                MyProjects.PARTICIPANT_* constant values
 */
MyProjectsParticipantSelector = function() {
  
  /**
   * the participants that were loaded
   * @type Array
   */
  this._participants = new Array();
  
  /**
   * the div containing the participant fields
   * @type Object
   */
  this._participantsDiv;
  
  /**
   * a reference to the plugin this manager pertains to
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  
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
    
    if (!this.params.callback || !this.params.callback[this.params.cbMethod ? this.params.cbMethod : 'addParticipant'] || !this.params.projectId) {
      OS.displayErrorMessage(this._plugin.getString('MyProjects.error.participantSelector'));
      return false;
    }
    else {
      this._participantsDiv = this.win.getElementById('myProjectsParticipantSelector');
      this.win.getElementById('myProjectsParticipantSelectorHeader').innerHTML = this.params.header ? this.params.header : this._plugin.getString(this.params.multiple ? 'MyProjects.participantSelector.participants' : 'MyProjects.participantSelector.participant');
      
      this.win.syncWait(this._plugin.getString('MyProjects.loadingParticipants'), 'initCancel');
      var params = { 'projectId': this.params.projectId };
      if (this.params.permissions) { params['permissions'] = this.params.permissions; }
      if (this.params.skip) { params['skip'] = this.params.skip; }
      if (this.params.types) { params['types'] = this.params.types; }
      OS.ajaxInvokeService(MyProjects.SERVICE_GET_PARTICIPANTS, this, '_loadParticipants', null, null, params);
      return true;
    }
  };
  // }}}
  
	// {{{ selectParticipants
	/**
	 * selects the participants and invokes the callback
   * @access public
	 * @return void
	 */
	this.selectParticipants = function() {
    for(var i in this._participants) {
      if (document.getElementById(this._participants[i].fieldId).checked) {
        this.params.callback[this.params.cbMethod ? this.params.cbMethod : 'addParticipant'](this._participants[i], this.params.projectId);
      }
    }
    OS.closeWindow(this.win);
  };
  // }}}
  
  
	// {{{ _loadParticipants
	/**
	 * handles ajax invocation response for loading the participants
   * @param Object response the response received
   * @access public
	 * @return void
	 */
	this._loadParticipants = function(response) {
    if (!this.win.isClosed()) {
      this.win.syncFree();
      if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
        OS.displayErrorMessage(this._plugin.getString('MyProjects.error.unableToLoadParticipants'), response);
        this.initCancel();
      }
      else {
        this._participants = response.results;
        if (!SRAOS_Util.getLength(this._participants)) {
          OS.displayErrorMessage(this._plugin.getString('MyProjects.error.noMatchingParticipants'));
          this.initCancel();
        }
        else {
          var html = '';
          for(var i in this._participants) {
            this._participants[i].fieldId = this.win.getDivId() + 'myProjectsParticipantSelector' + this._participants[i].pid;
            html += '<div class="myProjectParticipantField"' + (this._participants[i].type & (MyProjects.PARTICIPANT_GROUP | MyProjects.PARTICIPANT_EMAIL) ? ' style="background-image: url(plugins/productivity/images/' + (this._participants[i].type & MyProjects.PARTICIPANT_GROUP ? 'group' : 'email') + '-participant.png)"' : '') + '>';
            html += '<input id="' + this._participants[i].fieldId + '"' + (!this.params.multiple ? ' name="' + this.win.getDivId() + 'myProjectsParticipantSelectorField' + '"' : '') + ' type="' + (this.params.multiple ? 'checkbox' : 'radio') + '" />' + this._participants[i].label;
            html += '</div>\n';
          }
          this._participantsDiv.innerHTML = html;
        }
      }
    }
  };
  // }}}
};


// }}}
