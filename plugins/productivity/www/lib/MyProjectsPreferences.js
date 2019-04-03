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
 * MyProjects Preferences window manager
 */
MyProjectsPreferences = function() {
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
    // set form fields with correct values
    this.win.getFormField("myProjectsFilesFormat").value = OS.user.myProjectsFilesFormat;
    this.win.getFormField("myProjectsFilesIcon").selectedIndex = OS.user.myProjectsFilesIcon ? 1 : 0;
    this.win.getFormField("myProjectsFilesSortBy").value = OS.user.myProjectsFilesSortBy;
    this.win.getFormField("myProjectsSearchAdv").selectedIndex = OS.user.myProjectsSearchAdv ? 1 : 0;
    this.win.getFormField("myProjectsUpcomingThreshold").selectedIndex = OS.user.myProjectsUpcomingThreshold - 1;
    return true;
  };
  // }}}
  
  
	// {{{ updatePreferences
	/**
	 * updates a user's INDI preferences if the request invocation to do so is 
   * successful
   * @param Object response the response received for the service request
   * @access public
	 * @return void
	 */
	this.updatePreferences = function(response) {
    if (this.win.isClosed()) { return; }
    
    if (response.status == SRAOS.AJAX_STATUS_SUCCESS) {
      OS.user.myProjectsFilesFormat = this.win.getFormValue("myProjectsFilesFormat");
      OS.user.myProjectsFilesIcon = this.win.getFormValue("myProjectsFilesIcon") == '1';
      OS.user.myProjectsFilesSortBy = this.win.getFormValue("myProjectsFilesSortBy");
      OS.user.myProjectsSearchAdv = this.win.getFormValue("myProjectsSearchAdv") == '1';
      OS.user.myProjectsUpcomingThreshold = this.win.getFormValue("myProjectsUpcomingThreshold");
      var manager = this.win.getAppInstance().getWindowInstance('MyProjectsWin').getManager();
      manager.refreshProjectList(true);
      manager.updateUpcomingThreshold();
    }
  };
  // }}}
};
// }}}
