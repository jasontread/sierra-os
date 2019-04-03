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
 | Unless required by winlicable law or agreed to in writing, software     |
 | distributed under the License is distributed on an "AS IS" BASIS,       |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.|
 | See the License for the specific language governing permissions and     |
 | limitations under the License.                                          |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 */

/**
 * manager for the wiki sandbox window
 */
Core_WikiSandbox = function() {
  
  /**
   * a reference to the comments textarea
   * @type Object
   */
  this._wikiField;
  
  /**
   * the plugin for this window
   * @type SRAOS_Plugin
   */
  this._plugin;
  
  
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
    this._wikiField = this.win.getElementById('coreWikiSandboxInput');
    this._plugin = this.win.getPlugin();
    
    this._wikiField.focus();
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
    if (!this._wikiField.value || SRAOS_Util.trim(this._wikiField.value) == '') {
      OS.displayErrorMessage(this._plugin.getString('WikiSandbox.error.wiki'));
    }
    else {
      this.win.syncWait(this._plugin.getString('WikiSandbox.loadingPreview'));
      OS.ajaxInvokeService(Core_Services.SERVICE_WIKI_TO_HTML, this, '_preview', null, null, { wiki: this._wikiField.value });
    }
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
      OS.displayErrorMessage(this._plugin.getString('WikiSandbox.error.unableToLoadPreview'), response);
    }
    else {
      OS.msgBox(response.results, this._plugin.getString('WikiSandbox.preview'), this._plugin.getIconUri(32, 'wiki.png'));
    }
  };
  // }}}
  
};

