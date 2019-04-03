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

/**
 * Used to manage all of the general SIERRA::OS functionality
 */
SRAOS = function(uriPrefix, ajaxGateway, appId, appName, appShortName, workspace, plugins, resources, themeUri, user, dateChooserFormat, dateTimeFormat, dateFormat, serverUri) {
  // public attributes
  
  /**
   * SRAOS_DATE_CHOOSER_FORMAT
   * @type String
   */
  this.dateChooserFormat = dateChooserFormat;
  
  /**
   * the app "date-format"
   * @type String
   */
  this.dateTimeFormat = dateTimeFormat;
  
  /**
   * the app "date-only-format"
   * @type String
   */
  this.dateFormat = dateFormat;
  
  /**
   * manages drag and drop functionality
   * @type SRAOS_DragAndDrop
   */
  this.dragAndDrop;
  
  /**
   * a reference to /home
   * @type Core_VfsNode
   */
  this.homeDir;
  
  /**
   * the time it took to load the OS instance
   * @type float
   */
  this.loadTime;
  
  /**
   * a reference to /network
   * @type Core_VfsNode
   */
  this.networkDir;
  
  /**
   * set to true when the os is restoring a workspace
   * @type boolean
   */
  this.restoring = false;
  
  /**
   * a reference to /
   * @type Core_VfsNode
   */
  this.rootDir;
  
  /**
   * the base uri to the server
   * @type String
   */
  this.serverUri = serverUri;
  
  /**
   * the uri prefix to use when sraos is loaded in a relative url
   * @type String
   */
  this.uriPrefix = uriPrefix;
  
  /**
   * represents the user that this instance of SRAOS is being instantiated for. 
   * this value will contain the following hash values:
   *  uid: the user's id
   *  email: the user's email address
   *  name: the user's name
   *  userName: the user's user name
   *  any additional plugin defined user attributes
   *  commonPlaces: Core_VfsNode[] a reference to the current common places for 
   *  this user
   *  homeDir: the Core_VfsNode reference to the user's home directory
   *  trashDir: the Core_VfsNode reference to the user's trash directory
   *  workspacesDir: the Core_VfsNode reference to the user's workspaces directory
   *  workspaceDir: the Core_VfsNode reference to the user's current workspace directory
   * @type Array
   */
  this.user = user;
  // convert history to a numeric array
  tmp = this.user.coreTermHistory;
  this.user.coreTermHistory = new Array();
  for(var i in tmp) {
    this.user.coreTermHistory.push(tmp[i]);
  }
  
  /**
   * represents the current selected user workspace. this value will contain the 
   * following hash values:
   *  workspaceId: the id of the workspace
   *  dockApplications: the users' dock application icons
   *  dockHide: whether or not the dock is auto-hidden
   *  dockSize: the size of the dock (16|32|64)
   *  any additional plugin defined user attributes
   * @type Array
   */
  this.workspace = workspace;
  
  // private attributes
  
  /**
   * buffer for delayed menu additions
   * @type Array
   */
  this._addMenusDelayed = new Array();
  
  /**
   * the uri to the ajax gateway
   * @type String
   */
  this._ajaxGateway = ajaxGateway;
  
  /**
   * the last ajax service invocation time
   * @type float
   */
  this._ajaxLastTime;
  
  /**
   * used to track ajax service requests
   * @type Array
   */
  this._ajaxRequests = new Array();
  
  /**
   * the # of successful ajax service requests
   * @type float
   */
  this._ajaxRequestSuccess = 0;
  
  /**
   * used to track response times for individual ajax services
   * @type Array
   */
  this._ajaxServiceTimes = {};
  
  /**
   * the # of ajax request timeouts
   * @type float
   */
  this._ajaxTimeouts = 0;
  
  /**
   * the total response time in seconds for all successful ajax requests
   * @type float
   */
  this._ajaxTotalResponseTime = 0;
  
  /**
   * the application identifier (see SRA_Controller::getCurrentAppId())
   * @type String
   */
  this._appId = appId;
  
  /**
   * the name of the application (see SRA_Controller::getAppName())
   * @type String
   */
  this._appName = appName;
  
  /**
   * the short name of the application (see SRA_Controller::getAppShortName())
   * @type String
   */
  this._appShortName = appShortName;
  
  /**
   * the current active application instances
   * @type SRAOS_ApplicationInstance[]
   */
  this._applications = new Array();
  
  /**
   * the current focused application
   */
  this._focusedApp;
  
  /**
   * the current focused window
   */
  this._focusedWin;
  
  /**
   * keeps track of the focus order
   */
  this._focusStack = new Array();
  
  
  /**
   * stack used to keep track of which iframes are available
   * @type Array
   */
  this._layerContainers = Array();
  
  /**
   * this attribute is used to store a map of all of the page components with 
   * menus assigned. the key in this map is the css id of the component
   */
  this._menus = new Array();
  
  /**
   * this attribute is used to store all of the added menu items. individual 
   * items can be retrieved using the getMenuItem method
   */
  this._menuItems = new Array();
  
  /**
   * the current # of application icons in the dock
   * @type int
   */
  this._numAppIcons = 0;
  
  /**
   * the current # of minimized applications in the dock
   * @type int
   */
  this._numMinimizedIcons = 0;
  
  /**
   * used to store pending dock icon text. this is typically used when an 
   * application invokes updateDockIconText before the dock icon for that 
   * application has been rendered
   * @type Array
   */
  this._pendingDockIconText = new Array();
  
  /**
   * the current pid counter
   * @type int
   */
  this._pidCounter = 1;
  
  /**
   * an array of the plugins installed into the OS
   * @type SRAOS_Plugin[]
   */
  this._plugins = plugins;
  
  /**
   * an associative array of strings used by the os where the key in the 
   * array is the resource identifier. strings in this array can be accessed 
   * using the getString(id) method
   * @type Array
   */
  this._resources = resources;
  
  /**
   * used to track if the search field lost focus
   * @type boolean
   */
  this._searchFieldLostFocus = false;
  
  /**
   * used to avoid double focus issue when window is opened by clicking on a 
   * toolbar icon
   * @type boolean
   */
  this._skipNextFocus = false;
  
  /**
   * the base theme uri
   * @type string
   */
  this._themeUri = themeUri;
  
  /**
   * stack used to keep track of which window container divs are available
   * @type Array
   */
  this._windowContainers = Array();
  
  // public methods
  
  /**
   * displays the OS "about" popup dialog
   * 
   * @return void
   */
   this.about = function() {
     var about = this.getString('sraos.about');
     
     about += "<p>" + this.getString('text.loadTime') + ": " + this.loadTime;
     about += "<p>" + this.getString('text.pluginsInstalled') + ": <ol>";
     for(var i=0; i<this._plugins.length; i++) {
       about += "<li>" + this._plugins[i].getLabel() + "</li>";
     }
     about += "</ol></p>";
     
     about += "<p>" + this.getString('text.currentProcesses') + ": <ul>";
     var processes = 0;
     if (this._applications.length > 0) {
       var killStr = this.getString('text.kill');
       for(var i=0; i<this._applications.length; i++) {
         // don't show hidden services
         if (this._applications[i].getApplication().isService() && this._applications[i].getApplication().isHidden()) { continue; }
         var pid = this._applications[i].getPid();
         about += "<li>[<span class='link' onclick='OS.terminateAppInstance(OS.getAppInstance(" + pid + "), true);OS.closeWindow(this);OS.about();'>" + killStr + "</span>] " + this._applications[i].getApplication().getLabel() + " (PID " + pid + ")</li>";
         processes++;
       }
     }
     if (processes == 0) {
       about += "<li>" + this.getString('text.none') + "</li>";
     }
     about += "</ul></p>";
     
     about += "<p>" + this.getString('text.windowStats') + ": " + (this._windowContainers.length - 1) + "/" + SRAOS.MAX_WINDOWS + "</p>";
     
     // ajax stats
     if (this._ajaxRequests.length > 0) {
       about += "<p>" + this.getString('text.ajaxRequestStats') + ": <ul>";
       about += "<li>" + this.getString('text.ajaxTotalRequests') + ": " + this._ajaxRequests.length + "</li>";
       about += "<li>" + this.getString('text.ajaxSuccessfulRequests') + ": " + this._ajaxRequestSuccess + "</li>";
       about += "<li>" + this.getString('text.ajaxTimedoutRequests') + ": " + this._ajaxTimeouts + "</li>";
       about += "<li>" + this.getString('text.ajaxFailedRequests') + ": " + (this._ajaxRequests.length - this._ajaxRequestSuccess - this._ajaxTimeouts) + "</li>";
       about += "<li>" + this.getString('text.ajax.LastInvocationTime') + ": " + this._ajaxLastTime + "</li>";
       about += "<li onclick='OS.displayAjaxServiceTimes()'>" + this.getString('text.ajaxAvgResponseTime') + ": " + this.getAvgAjaxResponseTime(2) + "</li>";
       about += "</ul>";
     }
     
     this.msgBox(about, this.getString('text.about') + ' ' + this.getAppShortName(), this.getIconUri(32, 'about.png'), "AboutOs");
   };
   
  /**
   * displays the about dialog for the current active application
   * 
   * @return void
   */
   this.aboutApplication = function() {
     var app = this.getFocusedApp();
     if (app) {
       this.msgBox(app.getApplication().getAbout(), this.getString('text.about') + ' ' + app.getApplication().getLabel(), app.getApplication().getIconPath(32));
     }
   };
   
  /**
   * adds a date chooser popup for the field specified
   *
   * @param Object field. the field to add the date chooser for
   * @param Object chooser the object that will handle displaying the date 
   * chooser
   * @param boolean renderIcon whether or not to render the date chooser icon in 
   * chooser. chooser should be a span or div if true
   * @param String format the PHP Date format string to use for the date 
   * display. if not specified, SRAOS_DATE_CHOOSER_FORMAT will be used
   * @param Date earliestDate the earliest date allowed by this chooser
   * @param Date latestDate the latest date allowed by this chooser
   * @param Array allowedDays the days of week allowed by this chooser where 
   * (0=Sunday to 6=Satruday)
   * @return SRAOS_DateChooser
   */
  this.addDateChooser = function(field, chooser, renderIcon, format, earliestDate, latestDate, allowedDays) {
    field = SRAOS_Util.isObject(field) ? field : document.getElementById(field);
    chooser = SRAOS_Util.isObject(chooser) ? chooser : document.getElementById(chooser);
    format = format ? format : this.dateChooserFormat;
    if (renderIcon) { chooser.innerHTML = '<img alt="' + this.getString('text.chooseDate') + '" src="' + SRAOS_DateChooser.getIcon() + '" title="' + this.getString('text.chooseDate') + '" style="cursor: pointer;" />'; }
    var dateChooser = new SRAOS_DateChooser();
    if (earliestDate) { dateChooser.setEarliestDate(earliestDate); }
    if (latestDate) { dateChooser.setLatestDate(latestDate); }
    if (allowedDays) { dateChooser.setAllowedDays(allowedDays); }
    dateChooser.setUpdateField(field.id, format);
    chooser.onclick = dateChooser.display;
    return dateChooser;
  };
  
  /**
   * this method is used to create a new menu
   * @param String componentId the css id of the component to initialize as the 
   * handler for this menu
   * @param String event the event that should invoke display of the window. if 
   * not specified, the onmouseover event will be assumed
   * @param String label an optional label to use for this menu. if specified, 
   * the innerHTML of the component specified will be rewritten with this value
   * @param int leftOffset the # of pixels to offset the menu to the left
   * @param int topOffset the # of pixels to offset the menu to the top
   * @param int direction determines the direction that the menu should appear 
   * when it is invoked. this should be one of the following constant values:
   *   TransMenu.direction.(down|right)
   * the default direction is TransMenu.direction.down
   * @param int reference where the menu should appear in reference to the 
   * handler. this should be one of the following constant values:
   *   TransMenu.reference.(topLeft|topRight|bottomLeft|bottomRight)
   * the default reference is TransMenu.reference.bottomLeft
   * @return TransMenu
   */
   this.addMenu = function(componentId, event, label, leftOffset, topOffset, direction, reference) {
     event = event ? event : "onmouseover";
     leftOffset = leftOffset ? leftOffset : 0;
     topOffset = topOffset ? topOffset : 0;
     direction = direction ? direction : TransMenu.direction.down;
     reference = reference ? reference : TransMenu.reference.bottomLeft;
     this._menus[componentId] = new Array();
     this._menus[componentId]["menuSet"] = new TransMenuSet(direction, leftOffset, topOffset, reference);
     this._menus[componentId]["menu"] = this._menus[componentId]['menuSet'].addMenu(document.getElementById(componentId), event);
     if (label) {
       document.getElementById(componentId).innerHTML = label;
     }
     return this._menus[componentId]["menu"];
   };
  
  /**
   * this method is used to add a menu item to an existing menu (the component 
   * must have already been initialized with addMenu)
   * @param String pluginId the identifer of the plugin that this menu item 
   * pertains to
   * @param String id the unique identifier for this menu item
   * @param String componentId the css id of the component to add the menu item 
   * to OR the TransMenuItem that this menu item should be a sub-item of OR the 
   * TransMenu to add this item to
   * @param String label the menu item label
   * @param String img an optional image to include in the menu item
   * @param String onClick javascript to invoke when the menu item is clicked 
   * (invoked prior to re-direction to the link specified)
   * @param boolean dividerAbove whether or not to display a divider above this 
   * menu item
   * @param boolean dividerBelow whether or not to display a divider below this 
   * menu item
   * @param boolean checked whether or not this menu item is checked. 
   * if === true, a small checked image will be displayed to the left of the 
   * menu item. if === false, a spacer image will be placed to the left of the 
   * item. otherwise, no checked image will be displayed
   * @return TransMenuItem
   */
  this.addMenuItem = function(pluginId, id, componentId, label, img, onClick, dividerAbove, dividerBelow, checked) {
    var menu = componentId.isTransMenu ? componentId : this._menus[componentId]["menu"];
    label = img ? "<img alt='" + label + "' class='menuImg' src='" + img + "' title='" + label + "' />" + label : label;
    if (checked === false || checked === true) { label = '<img id="menuChecked' + id + '" alt="" class="menuCheckedImg" src="' + (checked === true ? this._themeUri + 'menu-checked.gif' : SRAOS.PIXEL_IMAGE) + '" />' + label; }
    var item = null;
    if (menu) {
      if (dividerAbove) { menu.addDivider(); }
      item = menu.addItem(label, null, onClick);
      this._menuItems[pluginId + id] = item;
      if (dividerBelow) { menu.addDivider(); }
    }
    return item;
  };
  
  /**
   * same as "addMenuItem" but allows for delays menu additions. the only 
   * parameter that is different from the method above is 'parentId' which 
   * should be the id of the parent menu. this method may be invoked at 
   * OS initialization by the plugin templates to dynamically add menu items 
   * in addition to those defined in their corresponding plugin.xml file
   * @return void
   */
  this.addMenuItemDelayed = function(pluginId, id, parentId, label, img, onClick, dividerAbove, dividerBelow, checked) {
    this._addMenusDelayed.push({ pluginId: pluginId, id: id, parentId: parentId, label: label, img: img, onClick: onClick, dividerAbove: dividerAbove, dividerBelow: dividerBelow, checked: checked });
  };
  
	/**
	 * used to retrieve invoke an asynchronous ajax service from the server. this 
   * method will automatically switch between ajax and standard form posting to 
   * a hidden layer based on the parameter types specified in constraintGroups 
   * and params. if any of those parameters specify a 
   * SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET or 
   * SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST value, the latter method will be 
   * utilized. this may be useful for posting files for example. 
   * @param String service the id of the ajax service to invoke as defined in 
   * the base or a plugin entity model
   * @param Object target the object to invoke callback on. if null, callback 
   * will be invoked statically
   * @param String callback the name of the callback function in target to call 
   * when this service invocation is completed. the function should contain 1 
   * input parameters which will be an associative array containing the 
   * following values:
   *  count:          the total # of results regardless of limit/offset. for 
   *                  create/update actions this will be 1 on success. for delete 
   *                  actions it will be 0
   *  limit:          the limit that was applied to the request
   *  offset:         the offset that was applied to the request
   *  results:        an array representing the output of the service request.
   *
   *                  for entity ajax service requests this will be an array of 
   *                  associative arrays containing the entity attributes returned
   *                  or an array of strings if a view was specified. if the 
   *                  action invoked by the server is create or update, the 
   *                  results will be an array of those entities (or their 
   *                  corresponding views) that were created/updated. if the 
   *                  action is delete, results will be empty. if a validation 
   *                  error fails duing a create or update action, results will be 
   *                  an array of error messages applicable to the validation 
   *                  error
   *                  
   *                  for global service requests, the output will depend on the 
   *                  service type. (see api and dtd documentation for more info)
   *  requestId:      the requestId specified when this method was invoked
   *  status:         the result code for the service request. this value will be 
   *                  equal to one of the SRAOS.AJAX_STATUS_* constants. if 
   *                  the request fails, ONLY the status code will be returned in 
   *                  the output. if the request was for an entity write 
   *                  transaction (create, delete, or update), the results will 
   *                  contain a single entity instance for the entity that was 
   *                  modified
   *  time            the time in seconds (w/ 3 decimal places) that this 
   *                  request took to fulfill
   * If target is null, this function will be invoked statically
   * @param SRAOS_AjaxConstraintGroups[] constraintGroups the constraint groups 
   * to apply to this service request (see class api comments for more info)
   * @param SRAOS_AjaxRequestObj requestObj if this request is being made to 
   * create, delete or update an object, this parameter should reference that 
   * corresponding object
   * @param SRAOS_AjaxServiceParam[] params service invocation params. these 
   * apply only to global ajax services
   * @param String requestId a request specific identifier. this value will be 
   * returned in the "response" if the invocation is successful
   * @param String[] excludeAttrs attributes to exclude from the results of this 
   * service invocation. these will be added to those defined in the entity 
   * model for the service
   * @param String[] includeAttrs a restricted set of attributes that should be 
   * included in the output of the service request. these attributes can ONLY be 
   * those already permitted in the service definition (a sub-set of the allowed 
   * attributes)
   * @param int limit the request limit
   * @param int offset the request offset
   * @param int timeout the amount of time in milliseconds to wait for a 
   * response before invoking the callback function with the 
   * SRAOS.AJAX_STATUS_TIMEOUT status code. if not specified, the callback 
   * method will not be invoked until a resonse is received
   * @param string validator an optional additional validator to invoke (applies 
   * only to non-global, create/update invocations)
   * @access public
	 * @return void
	 */
	this.ajaxInvokeService = function(service, target, callback, constraintGroups, requestObj, params, requestId, excludeAttrs, includeAttrs, limit, offset, timeout, validator) {

    var formAction = SRAOS.getFormAction(constraintGroups, params, requestObj);
		this._ajaxRequests.push({});
    var id = this._ajaxRequests.length - 1;
    if (this._ajaxRequests[id] && this._ajaxGateway && this._appId) {
      var req = this._getAjaxRequestParams(service, constraintGroups, requestObj, params, excludeAttrs, includeAttrs, limit, offset);
      this._ajaxRequests[id].ajaxService = service;
      this._ajaxRequests[id].ajaxTarget = target;
      this._ajaxRequests[id].ajaxCallback = callback;
      this._ajaxRequests[id].ajaxRequestId = requestId;
      this._ajaxRequests[id].ajaxParams = "ws-app=" + this._appId + "&ws-request-id=" + id + (!formAction ? ("&ws-request-xml=" + req) : "");
      this._ajaxRequests[id].ajaxParams += requestId ? '&ws-request-id1=' + SRAOS_Util.urlEncode(requestId) : '';
      this._ajaxRequests[id].ajaxParams += validator ? '&ws-validators=' + SRAOS_Util.urlEncode(validator) : '';
      
      // submit silent request when formAction is required
      if (formAction && this.getAjaxTargetWindow(target)) {
        var form = this.getAjaxTargetWindow(target).getForm();
        form.action = this._ajaxGateway + '?' + this._ajaxRequests[id].ajaxParams + '&ws-asynchronous=1&ws-request-xml=' + req;
        form.method = formAction;
        form.submit();
        setTimeout('OS._ajaxSubmitRequest(' + id + ', true)', OS.getAvgAjaxResponseTime(3) * 1000);
      }
      else {
        this._ajaxSubmitRequest(id);
      }
      if (timeout) { setTimeout("SRAOS._ajaxAbortRequest(" + id + ")", timeout); }
    }
    else {
      OS.msgBox(this.getString(SRAOS.SYS_ERROR_RESOURCE), null, SRAOS.ICON_ERROR);
    }
	};
  
  /**
   * used to block all active windows and controls except for those with a 
   * z-index >= SRAOS.MODAL_WINDOW_Z_INDEX
   * @return void
   */
  this.block = function() {
    document.getElementById("launchbar").style.zIndex = SRAOS.FOCUSED_WINDOW_Z_INDEX - 1;
    document.getElementById("launchbarPanel").style.zIndex = SRAOS.FOCUSED_WINDOW_Z_INDEX - 1;
    document.getElementById("modalWindowBg").style.visibility = "visible";
  };
   
  /**
   * this method changes the current active workspace
   * 
   * @param int workspaceId the id of the workspace to change to
   *
   * @return void
   */
  this.changeWorkspace = function(workspaceId) {
    document.getElementById('workspaceId').value = workspaceId;
    for(var i=0; i<this._applications.length; i++) {
      this._applications[i].getManager().onWorkspaceToggleOff();
      var windows = this._applications[i].getWindowInstances();
      for (var n=0; n<windows.length; n++) {
        windows[n].getManager().onWorkspaceToggleOff();
      }
    }
    this.reload();
  };
  
  /**
   * this method clears the os title (the text in the os title bar). it is 
   * typically invoked when a menu needs to be displayed in the title bar
   *
   * @return void
   */
  this.clearOsTitle = function() {
    document.getElementById("osTitle").innerHTML = "";
  };
  
	/**
	 * closes an open window
   * @param Object component the main div, or some child of it containing the 
   * .windowInstance to close
   * @param boolean force whether or not to force the window to close (results 
   * of the manager 'onTerminate' method invocation will be ignored)
	 * @return boolean
	 */
	this.closeWindow = function(component, force) {
    var win = this.getWindowInstance(component);
    if (win) {
      if (!win.getAppInstance()) {
        this.focusNextWindow();
      }
      var ret = win.getAppInstance() ? win.getAppInstance().closeWindow(win, force) : win.getPlugin().closeWindow(win, force);
      if (ret) {
        this.focusNextWindow();
      }
      return ret;
    }
    return false;
	};
  
  /**
   * asks the user a question using a popup dialog. returns true if the user 
   * responds yes, false otherwise
   * @param String question the question to ask
   * @return boolean
   */
  this.confirm = function(question) {
    return confirm(question);
  };
  
	/**
	 * disables one of the OS menu items. returns true on success, false on 
   * failure
   * @param String id the id of the menu item to disable
   * @access public
	 * @return boolean
	 */
	this.disableMenuItem = function(id) {
		var menuItem = this.getMenuItem(null, id);
    if (menuItem) {
      return menuItem.disable();
    }
    return false;
	};
  
	/**
	 * displays the average response times for individual ajax services in a popup 
   * window
   * @access public
	 * @return void
	 */
	this.displayAjaxServiceTimes = function() {
		var msg = '';
    for (var i in this._ajaxServiceTimes) {
      var sum = 0;
      for(var n in this._ajaxServiceTimes[i]) sum += this._ajaxServiceTimes[i][n];
      msg += i + ': ' + (sum/this._ajaxServiceTimes[i].length).toFixed(2) + ' (' + this._ajaxServiceTimes[i].length + ')<br />';
    }
    this.msgBox(msg, this.getString('text.ajaxServiceResponseTimes'));
	};
  
  
  /**
   * displays an error message
   * @param String message the error message to display
   * @param Object response an optional ajax response that generated the error
   * @param boolean htmlFormatted whether or not message is already html 
   * formatted. if not true (default), linebreaks will be substituted with 
   * <br />
   * @return void
   */
  this.displayErrorMessage = function(message, response, htmlFormatted) {
    if (response && response.status == SRAOS.AJAX_STATUS_INVALID_INPUT) {
      message = "";
      for(i in response.response) {
        message += message != "" ? "\n" : "";
        message += response.response[i];
      }
    }
    this.msgBox((htmlFormatted ? message : SRAOS_Util.textToHtml(message)) + (response ? ' <font color="white">[' + response.status + ']</font>' : ''), this.getString('error'), SRAOS.ICON_ERROR);
  };
   
  /**
   * this method creates a popup window displaying the user's preferences
   * @return void
   */
  this.displaySettings = function() {
    this.popup(this.uriPrefix + '/settings.php', SRAOS.SETTINGS_HEIGHT, SRAOS.SETTINGS_WIDTH);
  };
  
  /**
   * renders a window according to the configuration of the window provided
   * returns true on success, false otherwise
   * @param SRAOS_WindowInstance the window to render
   * @param boolean primary whether or not this is the primary application 
   * window for the application instance. if true, when this window is closed, 
   * the application instance will be terminated
   * @param Array vars an associative array of imbedded variable values within 
   * the specified window content that should be replaced. the syntax for 
   * declaring a variable within the template is "#variable_name". any keys in 
   * this array with matching variables in the window's corresponding html will 
   * be replaced with the values for those keys in the array
   * @return boolean
   */
  this.displayWindow = function(instance, primary, vars) {
    // if modal window is displayed, don't do anything
    if (document.getElementById("modalWindowBg").style.visibility == "visible") {
      return;
    }
    
    var divId = instance.getDivId();
    var pluginUri = this.uriPrefix + "/plugins/" + instance.getPlugin().getId() + "/";
    var window = '<div id="' + divId + 'Header" class="header">\n';
    window += '  <div class="controlBar">\n';
    var changeCursorCss = '';
    if (instance.getWindow().isFixedPosition()) {
      changeCursorCss = ' style="cursor: auto"';
    }
    window += '    <span class="icon"' + changeCursorCss + '><img id="' + divId + 'Icon" alt="' + instance.getWindow().getLabel() + '" src="' + instance.getWindow().getIconPath(16) + '" title="' + instance.getWindow().getLabel() + '" /></span>\n';
    window += '    <div id="' + divId + 'TitleText" class="title"' + changeCursorCss + '>' + instance.getTitle() + '</div>\n';
    window += '    <span class="windowControls">\n';
    window += instance.getModalTarget() || !instance.getWindow().isCanMinimize() ? '' : '    <div onclick="OS.minimize(this)"><img alt="' + this.getString('window.minimize') + '" src="' + this._themeUri + 'minimize.gif" title="' + this.getString('window.minimize') + '" /></div>\n';
    window += !primary || instance.getModalTarget() || !instance.getWindow().isCanMinimize() ? '' : '    <div onclick="OS.hide(this)"><img alt="' + this.getString('window.hide') + '" src="' + this._themeUri + 'hide.gif" title="' + this.getString('window.hide') + '" /></div>\n';
    window += instance.getWindow().isFixedSize() ? '' : '    <div onclick="OS.resizeWindow(\'' + divId + '\')"><img id="' + divId + "ResizeImg" + '" src="' + SRAOS.PIXEL_IMAGE + '" /></div>\n';
    var closeMsg = instance.getCloseMsg();
    window += !instance.getWindow().isCanClose() ? '' : '    <div onclick="OS.' + (instance.getAppInstance() && primary ? 'terminateAppInstance' : 'closeWindow') + '(this)"><img alt="' + closeMsg + '" src="' + this._themeUri + 'close.gif" title="' + closeMsg + '" /></div>\n';
    window += '    </span>\n';
    if (instance.getWindow().hasToolbar()) {
      var buttons = instance.getWindow().getToolbarButtons();
      window += '    <div class="toolbar">\n';
      for(var i=0; i<buttons.length; i++) {
        window += '    <span id="' + divId + buttons[i].getPluginId() + buttons[i].getId() + '" class="toolbarButton" onclick="'  + buttons[i].getCode() + '">';
        window += '<img id="' + divId + buttons[i].getPluginId() + buttons[i].getId() + 'Img" alt="' + buttons[i].getLabel() + '"';
        window += buttons[i].isDividerLeft() ? ' class="dividerLeft"' : (buttons[i].isDividerRight() ? ' class="dividerRight"' : '');
        window += ' src="' + buttons[i].getIconPath(16) + '"';
        window += ' title="' + buttons[i].getLabel() + '" /></span>\n';
      }
      window += '    </div>\n';
    }
    window += '  </div>\n';
    window += '  <span class="leftCorner"></span>\n';
    window += '  <span class="rightCorner"></span>\n';
    window += '</div>\n';
    window += '<div id="' + divId + 'Canvas" class="canvas"' + (instance.getWindow().isScroll() ? '' : ' style="overflow: hidden;"') + '>';
    var content = document.getElementById(instance.getPlugin().getId() + ":" + instance.getWindow().getId()).innerHTML;
    if (vars) {
      for (var key in vars) {
        content = content.replace(new RegExp("#" + key, "gim"), vars[key]);
      }
    }
    content = content.replace(new RegExp("<!--img", "gim"), '<img');
    content = content.replace(new RegExp("img-->", "gim"), '/>');
    
    // replace ids and fors
    content = SRAOS_Util.prefixIds(content, divId);
    window += content;
    window += '</div>\n';
    window += '<div class="' + (instance.getWindow().isStatusBar() ? 'statusBar' : 'statusBarEmpty') + '">\n';
    if (instance.getWindow().isStatusBar()) {
      window += '<span id="' + divId + 'StatusBarText" class="statusText">' + (instance.getStatus() ? instance.getStatus() : "") + "</span>";
    }
    window += instance.getWindow().isFixedSize() ? '' : '<span id="' + divId + 'ResizeHandler" class="resize"></span>\n';
    window += '</div>\n';
    window += '<div id="' + divId + 'Wait" class="waitCover"></div>';
    window += '<div id="' + divId + 'WaitContent" class="waitCoverMsg"><span id="' + divId + 'WaitProgress"></span><br /><span id="' + divId + 'WaitMsg" class="waitMsg"></span><br /><span id="' + divId + 'WaitCancel"></div>';
    var div = document.getElementById(divId);
    div.innerHTML = window;
    
    // open window
    if (instance.open()) {
      // set SRAOS_WindowInstance to div
      div.windowInstance = instance;
      
      div.onclick = function() {
        if (this.style.visibility != "hidden") {
          OS.focus(this);
        }
        this.windowInstance.getManager().onClick();
      };
      return true;
    }
    else {
      primary ? this.terminateAppInstance(instance) : this.closeWindow(instance);
      return false;
    }
  };
  
	/**
	 * enables one of the OS menu items. returns true on success, false on 
   * failure
   * @param String id the id of the menu item to disable
   * @access public
	 * @return boolean
	 */
	this.enableMenuItem = function(id) {
		var menuItem = this.getMenuItem(null, id);
    if (menuItem) {
      return menuItem.enable();
    }
    return false;
	};
  
	/**
	 * used to execute a single cli command. if the application being executed is 
   * asynchronous, then the return value will not be immediately available and 
   * the 'callback' and 'target' (optional) parameters must be specified. these 
   * will be invoked once the execution has completed. null will be returned if 
   * the executed application is asynchronous
   * @param String cmd the command to execute. this command must be constructed 
   * in the format: [app id] [args]. if the application specified is NOT a cli 
   * app, it will be launched and the return value will be true. otherwise, the 
   * cli application will be launched and the return value resulting from that 
   * execution will be returned (unless the cli application is asynchronous in 
   * which case the results will be returned later to the target/callback 
   * specified)
   * @param int pid the pid of the application executing this command. if 
   * specified, the execution environment (environment variables, aliases, 
   * current working directory, etc.) will be persisted accross multiple 
   * executions (environment changes will be carried over to other executions 
   * specifying the same pid). otherwise, the execution will be run within a 
   * "clean-slate" environment and that environment will be discarded upon 
   * termination
   * @param Object target the object containing the 'callback' method. if not 
   * specified, callback will be invoked statically
   * @param String callback the method to invoke with the return value value 
   * if the invoked application is asynchronous. this method should have the 
   * following signature: (mixed : results) : void
   * @access public
	 * @return mixed
	 */
	this.exec = function(cmd, pid, target, callback) {
    var app = pid ? this.getAppInstance(pid) : null;
    if (app && !app.term) { app.term = new Core_Terminal(true); }
		var term = app ? app.term : new Core_Terminal(true);
    return term.exec(cmd, target, callback);
	};
  
	/**
	 * sets the current focus to the specified window instance
   * @param Object component the main div, or some child of it containing the 
   * .windowInstance to focus
   * @param boolean skipNextFocus wether or not to skip an subsequent focus 
   * attempts over the next 1 millisecond. set to true if launching a window 
   * from another window object (otherwise the initial window will receive the 
   * focus again after the new window opens)
   * @access public
	 * @return void
	 */
	this.focus = function(component, skipNextFocus) {
    // check for service
    if (component && component.isService && component.isService()) { return; }
    
    var window = this.getWindowInstance(component);
    if (!this._skipNextFocus && window && !window.isBlocked()) {
      var app = window.getAppInstance();
      if ((app && (!app.isFocused() || app.isHidden())) || !window.isFocused() || window.isMinimized() || window.isHidden()) {
        for(var i=0; i<this._applications.length; i++) {
          if (!app || this._applications[i].getPid() != app.getPid()) {
            this._applications[i].unFocus();
          }
        }
        for(var i=0; i<this._plugins.length; i++) {
          var windowInstances = this._plugins[i].getWindowInstances();
          for(var n=0; n<windowInstances.length; n++) {
            if (windowInstances[n].getDivId() != window.getDivId()) {
              windowInstances[n].unFocus();
              windowInstances[n].setFocused(false);
            }
          }
        }
        if (window.isMinimized()) {
          window.restore();
        }
        else if (app && app.isHidden() && app != window.getAppInstance()) {
          app.show();
          var windows = app.getWindowInstances();
          for(var i=0; i<windows.length; i++) {
            if (windows[i] != window) {
              this._focusStack.push(windows[i].getDivId());
            }
          }
        }
        if (app) { app.focus(); }
        if (this._focusedWin && window.getDivId() != this._focusedWin.getDivId()) {
          this._focusedWin.unFocus();
        }
        if (app) { app.resetWindowFocus(window); }
        window.focus();
        this._focusStack.push(window.getDivId());
        this._focusedWin = window;
        this._focusedApp = app;
        if (skipNextFocus) {
          this._skipNextFocus = true;
          setTimeout("OS._skipNextFocus = false", 1);
        }
      }
    }
	};
  
  
  /**
   * unhides an application
   * @param SRAOS_ApplicationInstance app the application instance to unhide
   * @return void
   */
  this.focusApp = function(app) {
    if (app.isService()) { return; }
    
    if (app.isHidden()) {
      app.show();
    }
    if (app != this._focusedApp && !app.getFocusedWindow().isMinimized()) {
      this.focus(app.getFocusedWindow());
    }
  };
  
  
  /**
   * used to set the focus to the next window in the focus stack
   * @access public
   * @return void
   */
   this.focusNextWindow = function() {
     var div;
     var found = false;
     while(div = this._focusStack.pop()) {
       var div = document.getElementById(div);
       var window = this.getWindowInstance(div);
       if (div.style.visibility == "visible" && window && !window.isHidden() && !window.isMinimized()) {
         this.focus(div);
         this._focusStack.push(div.id);
         found = true;
         break;
       }
     }
     if (!found) {
       this._focusedApp = null;
       this._focusedWin = null;
     }
   };
   
  /**
   * returns the html necessary to display action links for a given entity 
   * instance
   * @param String entityId the id of the entity to return the actions for. this 
   * can be obtained using the entity.getCode method
   * @param Object entityInstance the instance of the entity of the type 
   * specified that the action links should be returned for
   * @param String entityInstanceCode the javascript code that will reference 
   * on a global scale the entityInstance specified. DO NOT use double quotes in
   * this string
   * @param SRAOS_Window the window the actions are being generated for
   * @param int iconSize the size of the icon to use to represent the action. if 
   * not specified, the label will be used in the form of a text link
   * @param String sep html to insert between the action links. this html will 
   * not be added in the beginning or end of the actions html, only between 
   * individual action links. this parameter is optional
   * @return String
   */
  this.getActions = function(entityId, entityInstance, entityInstanceCode, win, iconSize, sep) {
    win = win && win.getWindow ? win.getWindow() : win;
    var actions = new Array();
    for(var i=0; i<this._plugins.length; i++) {
      var action = this._plugins[i].getEntityAction(entityId, entityInstance, win);
      if (action) { actions.push(action); }
    }
    var actionsHtml = "";
    for(var i=0; i<actions.length; i++) {
      actionsHtml += sep && i > 0 ? sep : '';
      var onClick = 'onclick="' + actions[i].getAction() + '(' + entityInstanceCode + ')"';
      if (iconSize) {
        actionsHtml += '<img alt="' + actions[i].getLabel() + '" ' + onClick + ' src="' + actions[i].getIconPath(iconSize) + '" title="' + actions[i].getLabel() + '" />';
      }
      else {
        actionsHtml += '<a href="#" ' + onClick + '>' + actions[i].getLabel() + '</a>';
      }
    }
    return actionsHtml;
  };
   
	/**
	 * returns all of the currently open and visible windows
   * @param SRAOS_WindowInstance skip a window instance to skip in the return
   * @access public
	 * @return SRAOS_WindowInstance[]
	 */
	this.getActiveWindows = function(skip) {
    var active = new Array();
		for(var i=0; i<this._applications.length; i++) {
      var windows = this._applications[i].getWindowInstances();
      for(var n=0; n<windows.length; n++) {
        if ((!skip || skip != windows[n]) && !windows[n].isHidden() && !windows[n].isMinimized()) {
          active.push(windows[n]);
        }
      }
    }
		for(var i=0; i<this._plugins.length; i++) {
      var windows = this._plugins[i].getWindowInstances();
      for(var n=0; n<windows.length; n++) {
        if ((!skip || skip != windows[n]) && !windows[n].isHidden() && !windows[n].isMinimized()) {
          active.push(windows[n]);
        }
      }
    }
    return active;
	};
  
  /**
   * attempts to determine the window instance from an ajax invocation target.
   * used to appropriately block windows and determine correct forms to post
   * @param Object target the ajax invocation target
   * @return SRAOS_WindowInstance
   */
  this.getAjaxTargetWindow = function(target) {
    return target.isWindowInstance ? target : (target.win ? target.win : (target.isApplicationInstance && target.getFocusedWindow() ? target.getFocusedWindow() : (target.app && target.app.getFocusedWindow() ? target.app.getFocusedWindow() : this._focusedWin)));
  };
  
	/**
	 * returns an array reference containing all of the applications defined in 
   * the plugins for this instance of the OS
   * @access public
	 * @return SRAOS_Application[]
	 */
	this.getAllApplications = function() {
    var apps = new Array();
		for(var i=0; i<this._plugins.length; i++) {
      var pluginApps = this._plugins[i].getApplications();
      for(var n=0; n<pluginApps.length; n++) {
        apps.push(pluginApps[n]);
      }
    }
    return apps;
	};
  
	/**
	 * returns the SRAOS_ApplicationInstance running under the pid specified or 
   * null if invalid
   * @param int pid the process id of the application instance to return
   * @access public
	 * @return SRAOS_ApplicationInstance
	 */
	this.getAppInstance = function(pid) {
		for(var i=0; i<this._applications.length; i++) {
      if (this._applications[i].getPid() == pid) {
        return this._applications[i];
      }
    }
    return null;
	};
  
	/**
	 * returns all of the SRAOS_Application instance with the id specified. 
   * this id may be either the application identifier, or a combination of 
   * plugin and application identifiers in the format [plugin id]:[app id]. 
   * null will be returned if the id specified is not valid. if multiple 
   * applications exist with the id specified, the return value will be an 
   * array
   * @param String id the id of the application to return
   * @access public
	 * @return SRAOS_Application
	 */
	this.getApplication = function(id) {
    var apps = new Array();
		for(var i=0; i<this._plugins.length; i++) {
      var pluginApps = this._plugins[i].getApplications();
      for(var n=0; n<pluginApps.length; n++) {
        if (pluginApps[n].getId() == id || (this._plugins[i].getId() + ':' + pluginApps[n].getId()) == id) {
          apps.push(pluginApps[n]);
        }
      }
    }
    return apps.length > 0 ? (apps.length == 1 ? apps[0] : apps) : null;
	};
  
	/**
	 * returns the current active application instances
   * @access public
	 * @return SRAOS_ApplicationInstance[]
	 */
	this.getApplications = function() {
    return this._applications;
	};
  
	/**
	 * returns the appName
   * @access public
	 * @return String
	 */
	this.getAppName = function() {
    return this._appName;
	};
  
	/**
	 * returns the appShortName
   * @access public
	 * @return String
	 */
	this.getAppShortName = function() {
    return this._appShortName;
	};
  
  /**
   * returns the average ajax response time in seconds rounded to decimalPlaces
   * @param int decimalPlaces the rounding precision
   * @return float
   */
  this.getAvgAjaxResponseTime = function(decimalPlaces) {
    decimalPlaces = decimalPlaces ? decimalPlaces : 0;
    var val = (this._ajaxTotalResponseTime/this._ajaxRequestSuccess).toFixed(decimalPlaces);
    return !decimalPlaces ? Math.round(val) : val;
  };
  
	/**
	 * returns the default search entities for the current user
   * @access public
	 * @return SRAOS_Entity[]
	 */
	this.getDefaultSearchEntities = function() {
    var entities = this.getEntities();
    var searchEntities = new Array();
    for(var i=0; i<entities.length; i++) {
      if (!SRAOS_Util.inArray(entities[i].getCode(), OS.user.coreSearchExclude)) {
        searchEntities.push(entities[i]);
      }
    }
    return searchEntities;
	};
  
	/**
	 * returns an array reference containing all of the entities defined in the 
   * plugins for this instance of the OS
   * @access public
	 * @return SRAOS_Entity[]
	 */
	this.getEntities = function() {
    var entities = new Array();
		for(var i=0; i<this._plugins.length; i++) {
      var pluginEntities = this._plugins[i].getEntities();
      for(var n=0; n<pluginEntities.length; n++) {
        entities.push(pluginEntities[n]);
      }
    }
    return entities;
	};
  
	/**
	 * returns a reference to the workspace form
   * @access public
	 * @return Object
	 */
	this.getForm = function() {
    return document.getElementById('workspaceForm');
	};
  
	/**
	 * returns the current focused application or null if none
   * @access public
	 * @return SRAOS_ApplicationInstance
	 */
	this.getFocusedApp = function() {
    return this._focusedApp;
	};
  
	/**
	 * returns the current focused window or null if none
   * @access public
	 * @return SRAOS_WindowInstance
	 */
	this.getFocusedWin = function() {
    return this._focusedWin;
	};
  
	/**
	 * returns the uri to the icon specified
   * @param int size the icon size (16, 32, or 64)
   * @param int icon the icon identifier. either one of the SRAOS.ICON_* 
   * constants or the name of the icon image file
   * @access public
	 * @return String
	 */
  this.getIconUri = function(size, icon) {
    return icon ? this.getThemeUri() + 'icons/' + size + '/' + icon : null;
  };
  
  /**
   * returns the maximized height for the window instance specified
   * @param SRAOS_WindowInstance instance the instance to return the max height 
   * for
   * @return int
   */
  this.getMaxWindowHeight = function(instance) {
    var buffer = instance.getWindow().isStatusBar() ? 18 : 0;
    buffer -= instance.getWindow().hasToolbar() ? 0 : 18; 
    return parseInt(document.getElementById("workspace").style.height) - buffer;
  };
  
  /**
   * returns a reference to the TransMenu specified
   * @param String pluginId the id of the plugin that the menu belongs to
   * @param String id the unique id of the menu item
   * @return TransMenuItem
   */
  this.getMenu = function(pluginId, id) {
    return this._menus[(pluginId ? pluginId : "") + id];
  };
  
  /**
   * returns a reference to the TransMenuItem for a specific menu item 
   * previously added using the addMenuItem method
   * @param String pluginId the id of the plugin that the menu belongs to
   * @param String id the unique id of the menu item within that plugin 
   * configuration
   * @return TransMenuItem
   */
  this.getMenuItem = function(pluginId, id) {
    return this._menuItems[(pluginId ? pluginId : "") + id];
  };
  
  /**
   * returns the # of icons currently displayed in the dock
   * @return int
   */
  this.getNumDockIcons = function() {
    // base icons
    var num = 2 + (document.getElementById('dockWorkspaces') ? 1 : 0);
    num += this._numAppIcons;
    num += this._numMinimizedIcons;
    return num;
  };
  
	/**
	 * returns an array of process ids (pids) for the application type specified. 
   * this array will be empty if that application is not currently running
   * @param String applicationId the SRAOS_Application id to return the pids for
   * if not specified, the pids for all active applications will be returned
   * @access public
	 * @return int[]
	 */
	this.getPids = function(applicationId) {
    var pids = new Array();
		for(var i=0; i<this._applications.length; i++) {
      if (!applicationId || this._applications[i].getApplication().getId() == applicationId) {
        pids.push(this._applications[i].getPid());
      }
    }
    return pids;
	};
  
	/**
	 * returns the plugin specified or null if id is not valid
   * @param string id the id of the plugin to return
   * @access public
	 * @return SRAOS_Plugin
	 */
	this.getPlugin = function(id) {
		for(var i=0; i<this._plugins.length; i++) {
      if (this._plugins[i].getId() == id) {
        return this._plugins[i];
      }
    }
    return null;
	};
  
	/**
	 * returns the plugins loaded
   * @access public
	 * @return SRAOS_Plugin[]
	 */
	this.getPlugins = function() {
		return this._plugins;
	};
  
	/**
	 * returns the request URI for this sierra-os instance
   * @access public
	 * @return String
	 */
	this.getRequestUri = function() {
    return this.serverUri + this.uriPrefix;
	};
  
  /**
   * returns the uri to the sort ascending image that can be used in sorted 
   * tables
   * @access public
   * @return String
   */
  this.getSortAscImgUri = function() {
    return this._themeUri + SRAOS._SORT_ASC_IMAGE;
  };
  
  /**
   * returns the uri to the sort descending image that can be used in sorted 
   * tables
   * @access public
   * @return String
   */
  this.getSortDescImgUri = function() {
    return this._themeUri + SRAOS._SORT_DESC_IMAGE;
  };
  
	/**
	 * returns a string from this plugin's resources
   * @param string id the identifier of the string to return
   * @param string plugin optional plugin identifier. the plugin's resources 
   * will be checked first if specified
   * @param Array params a hash of key/value pairs that should be substituted in 
   * the resource string, where the key is imbedded into the original string in 
   * the format '{$[key]}'
   * @access public
	 * @return string
	 */
	this.getString = function(id, plugin, params) {
    plugin = plugin ? this.getPlugin(plugin) : null;
    if (plugin && plugin.getString(id)) {
      return plugin.getString(id);
    }
    else {
      for (var key in this._resources) {
        if (id == key) {
          return SRAOS_Util.substituteParams(this._resources[key], params);
        }
      }
    }
    return null;
	};
  
	/**
	 * returns the base theme uri
   * @access public
	 * @return String
	 */
	this.getThemeUri = function() {
    return this._themeUri;
	};
  
  /**
   * returns the uri to the wait image
   * @access public
   * @return String
   */
  this.getWaitImgUri = function() {
    return this._themeUri + SRAOS._WAIT_IMAGE;
  };
  
	/**
	 * returns the window instance associated with the component specified
   * @param Object component the main div, or some child of it containing the 
   * .windowInstance to close. returns null if a window instance is not found 
   * in the components dom tree. can also be the div id of the main window or 
   * some sub-element of it
   * @access public
	 * @return SRAOS_WindowInstance
	 */
	this.getWindowInstance = function(component) {
    if (component) {
      if (component.isWindowInstance) {
        return component;
      }
      else if (component.isApplicationInstance) {
        return component.getFocusedWindow();
      }
      else if (component.win) {
        return component.win;
      }
      else if (SRAOS_Util.isString(component)) {
        component = document.getElementById(component);
      }
      
      do {
        if (component.windowInstance) {
          return component.windowInstance;
        }
      } while(component = component.parentNode);
    }
    return null;
	};
  
	/**
	 * returns the height of the workspace
   * @access public
	 * @return int
	 */
	this.getWorkspaceHeight = function() {
    return parseInt(document.getElementById("workspace").style.height);
	};
  
	/**
	 * returns the width of the workspace
   * @access public
	 * @return int
	 */
	this.getWorkspaceWidth = function() {
    return window.innerWidth > 0 ? window.innerWidth : (document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : document.body.clientWidth);
	};
  
  /**
   * hides a window or application
   * @param Object obj the application instance to hide or null to hide the 
   * current application
   * @return void
   */
   this.hide = function(obj) {
     obj = !obj ? this._focusedApp : obj;
     obj = obj.hide ? obj : this.getWindowInstance(obj);
     obj = obj.syncWait ? obj.getAppInstance() : obj;
     if (obj.hide) {
       var focused = obj == this._focusedApp;
       obj.hide();
       if (focused) { this.focusNextWindow(); }
       this.renderApplicationIcons();
     }
   };
  
  /**
   * hides the search panel
   * @return void
   */
   this.hideSearchPanel = function() {
     document.getElementById("searchPanel").style.visibility = "hidden";
     this._searchFieldLostFocus = true;
     setTimeout("OS._searchFieldLostFocus=false", 1000);
   };
  
  /**
   * initializes the dock
   * 
   * @return void
   */
  this.initDock = function() {
    if (this.workspace.dockHide) {
      var launchbar = document.getElementById("launchbar");
      var launchbarPanel = document.getElementById("launchbarPanel");
      launchbarPanel._dockSize = this.workspace.dockSize;
      launchbarPanel.hide = function() {
        var minSize = (-1 * OS.workspace.dockSize);
        var a = new Accelimation(0, minSize, 500, 1);
        a.onend = function() {
          document.getElementById("launchbarPanel").raised = false;
          document.getElementById("launchbarPanel").style.opacity = "0" 
        };
        a.onframe = function(y) { document.getElementById("launchbarPanel").style.bottom = y + "px"; };
        var a1 = new Accelimation(0, minSize, 500, 1);
        a1.onend = function() { document.getElementById("launchbar").style.visibility = "hidden" };
        a1.onframe = function(y) { document.getElementById("launchbar").style.bottom = y + "px"; };
        a.start();
        a1.start();
      };
      launchbarPanel.onmouseout = function() {
        document.getElementById("launchbarPanel").timer = setTimeout('document.getElementById("launchbarPanel").hide()', 1000);
      };
      launchbar.onmouseout = launchbarPanel.onmouseout;
      
      launchbarPanel.onmouseover = function() {
        if (document.getElementById("launchbarPanel").timer) {
          clearTimeout(document.getElementById("launchbarPanel").timer);
          document.getElementById("launchbarPanel").timer = null;
        }
        if (!document.getElementById("launchbarPanel").raising && !document.getElementById("launchbarPanel").raised) {
          document.getElementById("launchbarPanel").raising = true;
          
          document.getElementById("launchbarPanel").style.opacity = ".2";
          document.getElementById("launchbar").style.visibility = "visible";
          var minSize = (-1 * OS.workspace.dockSize);
          var a = new Accelimation(minSize, 0, 200, -1);
          a.onframe = function(y) { document.getElementById("launchbarPanel").style.bottom = y + "px"; };
          a.onend = function() { 
            document.getElementById("launchbarPanel").raising = false;
            document.getElementById("launchbarPanel").raised = true;
          };
          var a1 = new Accelimation(minSize, 0, 200, -1);
          a1.onframe = function(y) { document.getElementById("launchbar").style.bottom = y + "px"; };
          a.start();
          a1.start();
        }
      };
      launchbar.onmouseover = launchbarPanel.onmouseover;
      document.getElementById("launchbarPanel").raised = true;
      document.getElementById("launchbarPanel").timer = setTimeout('document.getElementById("launchbarPanel").hide()', 4000);
    }
    this.renderApplicationIcons();
  };
  
  /**
   * returns true if user is the same as the active user
   * @param Object user the user object to compare to. the uids will be compared
   * @return boolean
   */
  this.isActiveUser = function(user) {
    return user.uid == this.user.uid;
  };
  
  /**
   * returns true if the help manual is enabled for the current user
   * @return boolean
   */
  this.isHelpManualEnabled = function() {
    return this.getPlugin('core') && this.getPlugin('core').getApplication('HelpManual');
  };
  
  /**
   * returns true if the menu item specified is checked
   * @param String id the unique identifier for the menu item
   * @return boolean
   */
  this.isMenuItemChecked = function(id) {
    var img = document.getElementById("menuChecked" + id);
    return img ? img.src.indexOf(SRAOS.PIXEL_IMAGE) == -1 : false;
  };
  
  /**
   * returns true if the application specified is running already
   * @param string applicationId the application identifier
   * @return boolean
   */
  this.isRunning = function(applicationId) {
    return this.getPids(applicationId).length > 0;
  };
  
  /**
   * launches an application and returns the its instance. if the 
   * application is already running and it does not support multiple instances, 
   * it will be given focus and the instance of that existing application will be 
   * returned. if the application cannot be started due to insufficient 
   * resources or another problem, null will be returned
   * @param string pluginId the plugin identifier
   * @param string applicationId the application identifier
   * @param Array params initialization params if this application is being 
   * restored or accepts custom initialization params
   * @param boolean delay whether or not to delay the launch using the setTimout 
   * function
   * @return SRAOS_ApplicationInstance
   */
  this.launchApplication = function(pluginId, applicationId, params, delay) {
    if (params == -1) {
      params = this._tmpLaunchAppParams;
      this._tmpLaunchAppParams = null;
    }
    if (delay) {
      this._tmpLaunchAppParams = params;
      setTimeout('OS.launchApplication("' + pluginId + '", "' + applicationId + '", -1)', 500);
      return;
    }
    
    if (!this.getPlugin(pluginId) || !this.getPlugin(pluginId).getApplication(applicationId)) {
      alert(this.getString(SRAOS.SYS_ERROR_RESOURCE));
    }
    else {
      var app = this.getPlugin(pluginId).getApplication(applicationId);
      var pids = this.getPids(applicationId);
      
      // app is already running and does not support multiple instances
      if (!app.isMultiInstance() && pids.length > 0) {
        app = this.getAppInstance(pids[0]);
        this.focus(app.getFocusedWindow());
      }
      // try to start app
      else {
        // cli applications
        if (app.isCli() && !params) {
          app = this.launchApplication('core', 'Terminal', { "exec": app.getPluginId() + ':' + app.getId() });
        }
        else {
          var pid = this._pidCounter++;
          this._pendingDockIconText[pid] = null;
          var app = new SRAOS_ApplicationInstance(pid, pluginId, applicationId);
          if (app.init(params)) {
            this._applications.push(app);
            if (!this.restoring) {
              if (app.getManager().onLaunch() && !app.isService() && !app.isCli()) {
                this.focus(app);
                setTimeout("OS.focus(document.getElementById('" + app.getFocusedWindow().getDivId() + "'))", 0);
              }
              else if (!app.isService() && !app.isCli()) {
                this.terminateAppInstance(app);
                return null;
              }
            }
            else {
              var windows = app.getWindowInstances();
              for(var i=0; i<windows.length; i++) {
                this._focusStack.push(windows[i].getDivId());
              }
            }
          }
          else {
            this.terminateAppInstance(app);
          }
        }
      }
      if (!app.isService() && !app.isCli()) { this.renderApplicationIcons(); }
      return app;
    }
    return null;
  };
  
  /**
   * displays a plugin window and returns true on success, false otherwise
   * @param string pluginId the plugin identifier
   * @param string windowId the window identifier
   * @param Array params initialization params if this window is being restored
   * or accepts custom initialization params
   * @param Array vars window content variables: see SRAOS.displayWindow
   * @return SRAOS_WindowInstance
   */
  this.launchWindow = function(pluginId, windowId, params, vars) {
    if (!this.getPlugin(pluginId) || !this.getPlugin(pluginId).getWindow(windowId)) {
      alert(this.getString(SRAOS.SYS_ERROR_RESOURCE));
    }
    else {
      var win = this.getPlugin(pluginId).displayWindow(windowId, vars, params);
      if (win) {
        if (!this.restoring) { 
          this.focus(win);
          setTimeout("OS.focus(document.getElementById('" + win.getDivId() + "'))", 0);
        }
        else {
          this._focusStack.push(win.getDivId());
        }
        return win;
      }
    }
    return null;
  };
  
  /**
   * logs the user out
   * @return void
   */
  this.logout = function() {
    document.location.replace("./?logout=1");
  };
  
  /**
   * 
   * @return void
   */
  this.minimize = function(component) {
    var win = this.getWindowInstance(component);
    var focused = win == this._focusedWin;
    if (win && !win.isMinimized() && win.minimize()) {
      this.renderMinimizedIcons();
      if (focused) { this.focusNextWindow(); }
    }
  };
  
  /**
   * displays a modal message box
   * @param string msg the message box text
   * @param string title the title for the message box. if not specified and 
   * icon is one of the standard SRAOS.ICON_* icons, a default title will be 
   * applied
   * @param string icon the msg box icon uri. if not specified, SRAOS.ICON_INFO 
   * will be displayed. if specified, the icon should be 32x32 pixels. if using 
   * a standard icon, the constant identifier for that icon should be used
   * @param string windowId an alternate window identifier. 
   * SRAOS.WIN_MSGBOX_MODAL is the default window
   * @param string onClose code to execute when the window is closed
   * @return SRAOS_WindowInstance
   */
  this.msgBox = function(msg, title, icon, windowId, onClose) {
    icon = icon ? icon : SRAOS.ICON_INFO;
    windowId = windowId ? windowId : SRAOS.WIN_MSGBOX_MODAL;
    var window = this.getPlugin("core").getWindow("MsgBox");
    if (icon == SRAOS.ICON_INFO) {
      icon = this.getIconUri(32, SRAOS.ICON_INFO);
      title = title ? title: this.getString('msgBox.info');
    }
    else if (icon == SRAOS.ICON_WARN) {
      icon = this.getIconUri(32, SRAOS.ICON_WARN);
      title = title ? title: this.getString('msgBox.warn');
    }
    else if (icon == SRAOS.ICON_ERROR) {
      icon = this.getIconUri(32, SRAOS.ICON_ERROR);
      title = title ? title: this.getString('msgBox.error');
    }
    else if (icon == SRAOS.ICON_QUESTION) {
      icon = this.getIconUri(32, SRAOS.ICON_QUESTION);
      title = title ? title: this.getString('msgBox.question');
    }
    
    var window = this.launchWindow("core", windowId, null, { "title" : title, "msg" : msg, "icon" : (icon ? icon : this.getIconUri(32, SRAOS.ICON_INFO)) });
    if (onClose) { window.setOnCloseExecute(onClose); }
    return window;
  };
   
  /**
   * this method is invoked immediately prior to the close body html tag
   * @return void
   */
  this.onBodyInitAfter = function() {
    for(var i in this._addMenusDelayed) {
      this.addMenuItem(this._addMenusDelayed[i].pluginId, this._addMenusDelayed[i].id, this.getMenu(this._addMenusDelayed[i].pluginId, this._addMenusDelayed[i].parentId), this._addMenusDelayed[i].label, this._addMenusDelayed[i].img, this._addMenusDelayed[i].onClick, this._addMenusDelayed[i].dividerAbove, this._addMenusDelayed[i].dividerBelow, this._addMenusDelayed[i].checked)
    }
    TransMenu.renderAll();
    TransMenu.initialize();
    document.getElementById('bodyLoading').fadeout = function() {
      // change - value to add fadein load effect
      var newOpacity = this.style.opacity ? this.style.opacity - 1 : 1;
      if (newOpacity == 0) {
        this.style.visibility = 'hidden';
      }
      else {
        this.style.opacity = newOpacity;
        setTimeout("document.getElementById('bodyLoading').fadeout()", 500);
      }
    };
    
    // load window container divs
    for(var i=SRAOS.MAX_WINDOWS; i>0; i--) {
      this._windowContainers.push("window" + i);
    }
    
    // load iframes
    for(var i=SRAOS.MAX_LAYERS; i>0; i--) {
      this._layerContainers.push("iframe" + i);
    }
    
    setTimeout("document.getElementById('bodyLoading').fadeout()", 600);
  };
  
  /**
   * this method is assigned to the body onload event
   * @return void
   */
  this.onLoad = function() {
    this._resizeContent();
    TransMenu.initialize();
    this.dragAndDrop = new SRAOS_DragAndDrop(document.getElementById("dragObject"), 0, SRAOS.TOP_OFFSET);
    this.disableMenuItem('dockTrash_empty');
  };
  
  /**
   * this method is assigned to the body onresize event
   * @return void
   */
  this.onResize = function() {
    this._resizeContent();
    for(var i=0; i<this._applications.length; i++) {
      this._applications[i].onResize();
    }
    for(var i=0; i<this._plugins.length; i++) {
      var windowInstances = this._plugins[i].getWindowInstances();
      for(var n=0; n<windowInstances.length; n++) {
        windowInstances[n].onResize();
      }
    }
  };
  
  /**
   * displays a new popup window
   * 
   * @param String url the url of the file to display in the popup
   * 
   * @param int height the height of the new window
   *
   * @param int width the width of the new window
   *
   * @param boolean noScroll whether or not the new window should have scrollbars
   *
   * @return a reference to the new window object
   */
  this.popup = function(url, height, width, noScroll) {
    var top = (screen.height - height) / 2;
    var left = (screen.width - width) / 2;
    
    pageId = Math.round(Math.random() * 100) % 1000 + 1;
    var scrollbars = noScroll ? ',scrollbars=no' : ',scrollbars=yes';
    var pageType = 'resizable=yes,hotkeys=no,dependent=yes,toolbar=no,directories=no'+scrollbars+',status=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
    var newwindow = window.open(url,pageId,pageType);
    newwindow.opener = window;
    newwindow.focus();
    return newwindow;
  };
  
  /**
   * invoked to print an entity in a separate browser window. this is 
   * accomplished via a synchronous communication to a "raw" formatted ajax 
   * service
   * @param String service the id of the ajax service responsible for the 
   * entity's print view rendering. this service must have the "retrieve" flag 
   * set to true and produce "raw" output (if non-global)
   * @param int id the primary key of the entity (for non-global services only)
   * @param SRAOS_AjaxServiceParam[] params if the ajax service is global (non-
   * entity specified), then id should be null and this parameter should be used 
   * to specify the service invocation params instead. if the service is 
   * non-global, this parameter should be null
   * @param int workflowId if the entity is stored within a workflow instance 
   * (see lib/workflow for more info), this parameter may be used to specify the 
   * workflow identifier. if this value is specified, 'id' should be the 
   * identifier for that entity within the workflow (applies only to non-global 
   * services)
   * @return void
   */
  this.print = function(service, id, params, workflowId) {
    var url = this._ajaxGateway + '?ws-app=' + this._appId + "&ws-request-xml=" + this._getAjaxRequestParams(service, null, id ? new SRAOS_AjaxRequestObj(id, null, null, workflowId) : null, params);
    window.open(url, service + id, 'height=' + (this.getWorkspaceHeight() + 10) + ',width=' + (this.getWorkspaceWidth() - 10) + ',scrollbars=yes');
  };
  
  /**
   * prompt the user for data using a popup dialog. returns the value provided 
   * by the user
   * @param String question the question to ask
   * @param String text the initial text to display
   * @return String
   */
  this.prompt = function(question, text) {
    return prompt(question, text ? text : '');
  };
  
  /**
   * releases the OS from a previous "block"
   * @return void
   */
  this.release = function() {
    document.getElementById("launchbar").style.zIndex = SRAOS.FOCUSED_WINDOW_Z_INDEX + 1;
    document.getElementById("launchbarPanel").style.zIndex = SRAOS.FOCUSED_WINDOW_Z_INDEX + 1;
    document.getElementById("modalWindowBg").style.visibility = "hidden";
  };
  
	/**
	 * releases a layer previously reserved using the reserveLayer method
   * @param String id the id of the iframe to release
   * @access public
	 * @return void
	 */
	this.releaseLayer = function(id) {
    document.getElementById(id).src = SRAOS.BLANK_HTML;
    this._layerContainers.push(id);
	};
  
	/**
	 * hides a window container and adds it back into the available window 
   * containers stack
   * @param String id the div id of the window container to release
   * @access public
	 * @return void
	 */
	this.releaseWindowContainer = function(id) {
    document.getElementById(id).innerHTML = "";
    document.getElementById(id).windowInstance = null;
    this._windowContainers.push(id);
	};
  
  /**
   * reload the OS including saving of the current state and other activities 
   * necessary prior to a reload
   * 
   * @return boolean
   */
  this.reload = function() {
    // save state from any active applications/windows
    var state = "{windows:[";
    var windowAdded = false;
    for(var i=0; i<this._plugins.length; i++) {
      var windowInstances = this._plugins[i].getWindowInstances();
      for(var n=0; n<windowInstances.length; n++) {
        if (!windowInstances[n].isModal()) {
          state += windowAdded ? "," : "";
          state += "{" + windowInstances[n].getState() + "}";
          var windowAdded = true;
        }
        else {
          var target = windowInstances[n].getModalTarget();
          // cancel if close of modal window is not successful
          if (!this.closeWindow(windowInstances[n])) {
            return false;
          }
          target.release(true);
        }
      }
    }
    state += "]";
    var serviceState = "{applications:[";
    state += ",applications:[";
    if (this._applications.length > 0) {
      var apps = 0;
      var services = 0;
      for(var i=0; i<this._applications.length; i++) {
        // cancel if close of modal windows is not successful
        var appState = this._applications[i].getState();
        if (appState === false) {
          return false;
        }
        var isService = this._applications[i].getApplication().isService();
        var tmp = isService && services > 0 ? "," : (!isService && apps > 0 ? "," : "");
        tmp += "{" + appState + "}";
        state += !isService ? tmp : "";
        serviceState += isService ? tmp : "";
        apps = !isService ? apps + 1 : apps;
        services = isService ? services + 1 : services;
      }
    }
    state += "]}";
    serviceState += "]}";
    document.getElementById('workspaceState').value = state;
    document.getElementById('serviceState').value = serviceState;
    this.getForm().submit();
    return true;
  };
  
	/**
	 * renders the dock based on the following criteria:
   *  1. any perma-docked icons (including running perma-dock applications and 
   *     multiple instances of them)
   *  2. user docked applications
   *  3. other running applications
   * @access public
	 * @return void
	 */
	this.renderApplicationIcons = function() {
    this._numAppIcons = 0;
    
    var iconHtml = "";
    var iconBgHtml = "";
    
    // perma docked icons
    for(var i=0; i<this._plugins.length; i++) {
      var applications = this._plugins[i].getApplications();
      for(var n=0; n<applications.length; n++) {
        if (applications[n].isPermaDocked()) {
          var html = this._getDockIconHtml(applications[n]);
          iconHtml += html.iconHtml;
          iconBgHtml += html.iconBgHtml;
        }
      }
    }
    // user docked applications
    if (this.workspace.dockApplications && this.workspace.dockApplications.length > 0) {
      for(var m=0; m<this.workspace.dockApplications.length; m++) {
        for(var i=0; i<this._plugins.length; i++) {
          var applications = this._plugins[i].getApplications();
          for(var n=0; n<applications.length; n++) {
            if (this._plugins[i].getId() + ':' + applications[n].getId() == this.workspace.dockApplications[m]) {
              var html = this._getDockIconHtml(applications[n]);
              iconHtml += html.iconHtml;
              iconBgHtml += html.iconBgHtml;
            }
          }
        }
      }
    }
    // other running applications
    for(var i=0; i<this._plugins.length; i++) {
      var applications = this._plugins[i].getApplications();
      for(var n=0; n<applications.length; n++) {
        if (!applications[n].isCli() && !applications[n].isPermaDocked() && !SRAOS_Util.inArray(this._plugins[i].getId() + ':' + applications[n].getId(), this.workspace.dockApplications)) {
          var html = this._getDockIconHtml(applications[n]);
          iconHtml += html.iconHtml;
          iconBgHtml += html.iconBgHtml;
        }
      }
    }
    document.getElementById('dockApps').innerHTML = iconHtml;
    document.getElementById('dockAppsBg').innerHTML = iconBgHtml;
    this._updateDockPosition();
	};
  
	/**
	 * renders the minimized window icons
   * @access public
	 * @return void
	 */
	this.renderMinimizedIcons = function() {
    var iconHtml = "";
    var iconBgHtml = "";
    this._numMinimizedIcons = 0;
    // application window instances
    for(var i=0; i<this._applications.length; i++) {
      var app = this._applications[i].getApplication();
      var windows = this._applications[i].getWindowInstances();
      for(var n=0; n<windows.length; n++) {
        if (windows[n].isMinimized()) {
          this._numMinimizedIcons++;
          var label = app.getLabel() == windows[n].getTitleText() ? app.getLabel() : app.getLabel() + ' - ' + windows[n].getTitleText();
          iconHtml += '<div onclick="OS.focus(document.getElementById(\'' + windows[n].getDivId() + '\'))">';
          iconHtml += '<img alt="' + label + '" height="' + this.workspace.dockSize + '" src="' + windows[n].getWindow().getIconPath(this.workspace.dockSize) + '" style="background-image: url(' + this.getIconUri(this.workspace.dockSize, 'window.png') + ');" title="' + label + '" width="' + this.workspace.dockSize + '" /></div>';
          iconBgHtml += '<img alt="" height="' + this.workspace.dockSize + '" src="' + this.getIconUri(this.workspace.dockSize, 'dock-minimized.gif') + '" width="' + this.workspace.dockSize + '" />';
        }
      }
    }
    // plugin window instances
    for(var i=0; i<this._plugins.length; i++) {
      var windows = this._plugins[i].getWindowInstances();
      for(var n=0; n<windows.length; n++) {
        if (windows[n].isMinimized()) {
          this._numMinimizedIcons++;
          var label = windows[n].getTitleText();
          iconHtml += '<div onclick="OS.focus(document.getElementById(\'' + windows[n].getDivId() + '\'))">';
          iconHtml += '<img alt="' + label + '" height="' + this.workspace.dockSize + '" src="' + windows[n].getWindow().getIconPath(this.workspace.dockSize) + '" style="background-image: url(' + this.getIconUri(this.workspace.dockSize, 'window.png') + ');" title="' + label + '" width="' + this.workspace.dockSize + '" /></div>';
          iconBgHtml += '<img alt="" height="' + this.workspace.dockSize + '" src="' + this.getIconUri(this.workspace.dockSize, 'dock-minimized.gif') + '" width="' + this.workspace.dockSize + '" />';
        }
      }
    }
    document.getElementById('dockMinimizedApps').innerHTML = iconHtml;
    document.getElementById('dockMinimizedAppsBg').innerHTML = iconBgHtml;
    this._updateDockPosition();
	};
  
	/**
	 * reserves a single hidden layer that may be used to post a form to
   * @access public
	 * @return iFrame
	 */
  this.reserveLayer = function() {
    if (this._layerContainers.length >= 1) {
      return this._layerContainers.pop();
    }
    alert(this.getString("error.maxWindows"));
    return null;
  };
  
	/**
	 * reserves num window containers if they are available. if they are not 
   * available returns null and displays a javascript alert error message. 
   * otherwise, an array of the div ids for the reserved window containers are 
   * returned
   * @param int num the number of window containers to reserve
   * @access public
	 * @return Array
	 */
	this.reserveWindowContainers = function(num) {
    if (this._windowContainers.length >= num) {
      var ids = new Array();
      for(var i=0; i<num; i++) {
        ids.push(this._windowContainers.pop());
      }
      return ids;
    }
    alert(this.getString("error.maxWindows"));
    return null;
	};
  
  /**
   * this method resets the os title (the text in the os title bar). it is 
   * typically invoked when a menu is being removed. it restores the title to 
   * the appName instance variable
   *
   * @return void
   */
  this.resetOsTitle = function() {
    var render = true;
    for(var i=0; i<this._applications.length; i++) {
      if (this._applications[i].getFocusedWindow()) { render = false; break; }
    }
    if (render) { document.getElementById("osTitle").innerHTML = this._appName; }
  };
  
  /**
   * resizes a window according to its current state. if maximized, the window 
   * will be restored, otherwise it will be maximized. returns true on success 
   * false otherwise
   * @param String divId 
   * @return void
   */
  this.resizeWindow = function(divId) {
    var div = document.getElementById(divId);
    if (div && div.windowInstance) {
      var action = div.windowInstance.isMaximized() ? div.windowInstance.restore() : div.windowInstance.maximize();
      return true;
    }
    return false;
  };
  
  /**
   * restores the workspace based on the state specified
   * @param Array state an associative array containing the state to restore
   * @return void
   */
   this.restore = function(state) {
     this.restoring = true;
     var focus = null;
     // applications
     if (state["applications"]) {
       for(var i=0; i<state["applications"].length; i++) {
         var app = this.launchApplication(state["applications"][i]["pluginId"], state["applications"][i]["applicationId"], state["applications"][i]);
         if (state["applications"][i]["focused"]) {
           focus = app.getFocusedWindow();
           app.setFocused(false);
         }
       }
     }
     // windows
     if (state["windows"]) {
       for(var i=0; i<state["windows"].length; i++) {
         var win = this.launchWindow(state["windows"][i]["pluginId"], state["windows"][i]["windowId"], state["windows"][i], state["windows"][i]["vars"]);
         if (state["windows"][i]["focused"]) {
           focus = win;
         }
       }
     }
     if (focus) {
       this.focus(focus);
     }
     for(var i=0; i<this._applications.length; i++) {
       this._applications[i].getManager().onWorkspaceToggleOn();
       var windows = this._applications[i].getWindowInstances();
       for (var n=0; n<windows.length; n++) {
         windows[n].getManager().onWorkspaceToggleOn();
       }
     }
     this.restoring = false;
   };
  
  /**
   * used to perform a search based on a search string and optional 
   * search-responder specific params. calling this method will result in any 
   * applications designated as search-responder being launched with the params 
   * specified. the search string will be included in the params under the key 
   * "search". the entity selection (if specified) will be included in the 
   * params under the key "entities"
   * @param String search the search string. if not specified, the value from 
   * the OS search box (loaded in the upper right corner) will be used
   * @param Array entities an array of entity identifiers to restrict the search 
   * to. each of these must have been defined in a plugin config using the 
   * entity element. if not specified, it will be the responsibility of the 
   * search responders to determine which entities to include in the search. if 
   * this parameter is specified, it will be passed to each search responder 
   * under the key "entities"
   * @param Array params optional search-responder specific launch parameters
   * @param String an optional search-responder application identifier. if 
   * specified, only that application will be launched
   * @return void
   */
  this.search = function(search, entities, params, appId) {
    search = search ? search : document.getElementById('searchField').value;
    entities = entities ? entities : this.getDefaultSearchEntities();
    document.getElementById('searchField').blur();
    if (search) {
      // look for and launch search responders
      for(var i=0; i<this._plugins.length; i++) {
        var apps = this._plugins[i].getApplications();
        for(var n=0; n<apps.length; n++) {
          if (apps[n].isSearchResponder() && (!appId || appId == apps[n].getId())) {
            params = params ? params : new Array();
            params["entities"] = entities;
            params["search"] = search;
            this.launchApplication(this._plugins[i].getId(), apps[n].getId(), params );
            if (appId) { return; }
          }
        }
      }
    }
  };
  
  /**
   * sets a menu item to checked or unchecked. this menu item specified, MUST 
   * have been previously created using the addMenuItem method with the checked 
   * parameter === true or false. returns true on success, false otherwise
   * @param String id the unique identifier for the menu item
   * @param boolean checked whether or not the menu item should be checked
   * @return boolean
   */
  this.setMenuItemChecked = function(id, checked) {
    var img = document.getElementById("menuChecked" + id);
    if (img) {
      img.src = checked ? this._themeUri + 'menu-checked.gif' : SRAOS.PIXEL_IMAGE;
      return true;
    }
    return false;
  };
  
  /**
   * this method sets the os title text (the text in the os title bar)
   *
   * @param String title the text to set
   * @return void
   */
  this.setOsTitle = function(title) {
    document.getElementById("osTitle").innerHTML = title;
  };
   
  /**
   * displays the search panel
   * @return void
   */
  this.showSearchPanel = function() {
   if (!this._searchFieldLostFocus) {
     document.getElementById("searchPanel").style.visibility = "visible";
     document.getElementById("searchField").focus();
     document.getElementById("searchField").select();
   }
   else {
     document.getElementById("searchPanel").style.visibility = "hidden";
   }
   this._searchFieldLostFocus = false;
  };
  
  
  /**
   * terminates the application specified by pid including closing all windows 
   * that application has currently spawned. returns true on success, false 
   * otherwise
   * @param Object component the main div, or some child of it containing the 
   * .windowInstance to close the app for
   * @param boolean force whether or not to force the application to terminate
   * (results of the manager 'onTerminate' method invocation will be ignored)
   * @return boolean
   */
  this.terminateAppInstance = function(component, force) {
    var app;
    if (component && component.isApplicationInstance) {
      app = component;
    }
    else {
      var win = component ? this.getWindowInstance(component) : this._focusedWin;
      app = win ? win.getAppInstance() : null;
    }
    
    if (app && (app.getManager().onTerminate(force) || force) && (app.closeWindows(force) || force)) {
      var applications = new Array();
      for(var i=0; i<this._applications.length; i++) {
        if (this._applications[i].getPid() != app.getPid()) {
          applications.push(this._applications[i]);
        }
      }
      this._applications = applications;
      if (!app.getApplication().isCli()) {
        this.resetOsTitle();
        this.focusNextWindow();
        this.renderApplicationIcons();
        this.renderMinimizedIcons();
      }
      app.getManager().status = SRAOS_ApplicationManager.STATUS_TERMINATED;
      SRAOS_Entity.appTerminated(app.getPid());
      return true;
    }
    return false;
  };
  
  
  /**
   * updates the hover tip that is displayed for a given application dock icon. 
   * this method is automatically invoked whenever "setTitleText" is invoked for 
   * an application instance primary window
   * @param int pid the process id of the application
   * @param String txt the new text to display
   * @return void
   */
  this.updateDockIconText = function(pid, txt) {
    if (pid && txt) {
      this._pendingDockIconText[pid] = txt;
      var icon = document.getElementById('appDockIcon' + pid);
      if (icon) {
        icon.alt = txt;
        icon.title = txt;
      }
    }
  };
  

  /**
   * updates the trash icon image
   * @return void
   */
  this.updateTrashIcon = function(pid, txt) {
    if (Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH]) {
      var trashNode = Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH];
      document.getElementById('dockTrashImg').src = trashNode.getIcon(this.workspace.dockSize);
      var msg = trashNode.getLabel() + ' (' + trashNode.numChildren + ' ' + this.getString('text.items') + ')';
      document.getElementById('dockTrashImg').alt = msg;
      document.getElementById('dockTrashImg').title = msg;
      // update the status for any running browser application instances
      for(var i=0; i<this._applications.length; i++) {
        var win = this._applications[i].getPrimaryWindow();
        if (win && win.getManager().updateTrashStatus) {
          win.getManager().updateTrashStatus();
        }
      }
      trashNode.numChildren > 0 ? this.enableMenuItem('dockTrash_empty') : this.disableMenuItem('dockTrash_empty');
    }
  };
  
  
  // private methods
  /**
   * submits a previously prepared ajax request
   * @param int id the request id
   * @param boolean query whether or not this should be a query request
   * @return void
   */
  this._ajaxSubmitRequest = function(id, query) {
    if (this._ajaxRequests[id]) {
      var params = this._ajaxRequests[id].ajaxParams + (query ? '&ws-query=1' : '');
      this._ajaxRequests[id].xmlHttp = SRAOS_Util.getXmlHttpObject(SRAOS._ajaxResponseHandler);
      this._ajaxRequests[id].xmlHttp.open("POST", this._ajaxGateway , true);
      this._ajaxRequests[id].xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      this._ajaxRequests[id].xmlHttp.setRequestHeader("Content-length", params.length);
      this._ajaxRequests[id].xmlHttp.setRequestHeader("Connection", "close");
      this._ajaxRequests[id].xmlHttp.send(params);
    }
  };
  
	/**
	 * returns an http encoded ajax request 
   * @param String service the id of the ajax service to invoke as defined in 
   * the base or a plugin entity model
   * @param SRAOS_AjaxConstraintGroups[] constraintGroups the constraint groups 
   * to apply to this service request (see class api comments for more info)
   * @param SRAOS_AjaxRequestObj requestObj if this request is being made to 
   * create, delete or update an object, this parameter should reference that 
   * corresponding object
   * @param SRAOS_AjaxServiceParam[] params service invocation params. these 
   * apply only to global ajax services
   * @param String requestId a request specific identifier. this value will be 
   * returned in the "response" if the invocation is successful
   * @param String[] excludeAttrs attributes to exclude from the results of this 
   * service invocation. these will be added to those defined in the entity 
   * model for the service
   * @param String[] includeAttrs a restricted set of attributes that should be 
   * included in the output of the service request. these attributes can ONLY be 
   * those already permitted in the service definition (a sub-set of the allowed 
   * attributes)
   * @param int limit the request limit
   * @param int offset the request offset
   * @access public
	 * @return String
	 */
	this._getAjaxRequestParams = function(service, constraintGroups, requestObj, params, excludeAttrs, includeAttrs, limit, offset) {
    var request = '<ws-request key="' + service + '"';
    if (excludeAttrs) {
      for(var i=0; i<excludeAttrs.length; i++) {
        request += i!=0 ? ' ' : ' exclude-attrs="';
        request += excludeAttrs[i];
      }
      request += '"';
    }
    if (includeAttrs) {
      for(var i=0; i<includeAttrs.length; i++) {
        request += i!=0 ? ' ' : ' include-attrs="';
        request += includeAttrs[i];
      }
      request += '"';
    }
    request += limit!=null ? ' limit="' + limit + '"' : '';
    request += offset!=null ? ' offset="' + offset + '"' : '';
    request += '>';
    if (constraintGroups) {
      for(var i=0; i<constraintGroups.length; i++) {
        request += "\n  " + constraintGroups[i].toXml();
      }
    }
    request += requestObj ? requestObj.toXml() : '';
    if (params) {
      for(var i in params) {
        if (!params[i] || !params[i].toXml) { params[i] = new SRAOS_AjaxServiceParam(i, params[i]); }
        request += "\n  " + params[i].toXml();
      }
    }
    request += '</ws-request>';
    // alert(request);
    return SRAOS_Util.urlEncode(request);
	};
  
	/**
	 * returns a hash containing the html necessary to render dock icons for the 
   * application specified. the return value will contain 2 keys: iconHtml and 
   * iconBgHtml. this method also increments this._numAppIcons for each icon 
   * included in the return results
   * @param SRAOS_Application app the application to return the html for
   * @access public
	 * @return Array
	 */
	this._getDockIconHtml = function(app) {
    var iconHtml = "";
    var iconBgHtml = "";
    
    if (!app.isService()) {
      var instances = new Array();
      if (app.isMultiInstance() && (app.isPermaDocked() || SRAOS_Util.inArray(app.getPluginId() + ':' + app.getId(), this.workspace.dockApplications))) {
        instances.push(null);
      }
      for(var m=0; m<this._applications.length; m++) {
        if (this._applications[m].getApplication().getId() == app.getId()) {
          instances.push(this._applications[m]);
        }
      }
      if (instances.length == 0 && (app.isPermaDocked() || SRAOS_Util.inArray(app.getPluginId() + ':' + app.getId(), this.workspace.dockApplications))) {
        instances.push(null);
      }
      for(var m=0; m<instances.length; m++) {
        this._numAppIcons++;
        iconHtml += '<div onclick="' + (instances[m] ? 'OS.focusApp(OS.getAppInstance(' + instances[m].getPid() + '))' : 'OS.launchApplication(\'' + app.getPluginId() + '\', \'' + app.getId() + '\', -1, true)') + '"><img ';
        var label = app.getLabel();
        if (instances[m]) {
          iconHtml += 'id="appDockIcon' + instances[m].getPid() + '" ';
          if (this._pendingDockIconText[instances[m].getPid()]) {
            label = this._pendingDockIconText[instances[m].getPid()];
          }
        }
        iconHtml += 'alt="' + label + '" src="' + app.getIconPath(this.workspace.dockSize) + '" title="' + label + '" /></div>';
        iconBgHtml += '<img alt="" height="' + this.workspace.dockSize + '" src="' + (instances[m] ? this.getIconUri(this.workspace.dockSize, (instances[m].isHidden() ? 'dock-hidden.gif' : 'dock-active.gif')) : SRAOS.PIXEL_IMAGE) + '" width="' + this.workspace.dockSize + '" />';
      }
    }

    return { iconHtml: iconHtml, iconBgHtml: iconBgHtml };
	};
  
  /**
   * this method resizes the workspace to the maximum width and height of the 
   * current window. it is called when the page is initially rendered and when
   * the window is resized
   * @return void
   */
  this._resizeContent = function() {
    var buffer = this.workspace.dockHide ? 0 : this.workspace.dockSize + 10;
    document.getElementById("workspace").style.height = (window.innerHeight - 65 - buffer) + "px";
  };
  
  /**
   * centers the dock in the window based on the current width of the workspace 
   * and the # of icons displayed in the dock
   * @return void
   */
  this._updateDockPosition = function() {
    var numDockIcons = this.getNumDockIcons();
    var size = (-1 * (((this.workspace.dockSize * numDockIcons)/2) + (4 * numDockIcons)));
    var launchbarPanel = document.getElementById("launchbarPanel");
    var launchbar = document.getElementById("launchbar");
    launchbarPanel.style.marginLeft = size + "px";
    launchbar.style.marginLeft = size + "px";
  };
};

// static methods

/**
 * returns the appropriate form action, if any, to utilize given a constraint 
 * groups and params. basically, this method will return "get" or "post" if any 
 * of the constraints or params utilize that attribute or value type. otherwise, 
 * it will return null meaning that the form can be submitted utilizing either 
 * action or via ajax
 * @param SRAOS_AjaxConstraintGroup[] constraintGroups the constraint groups to 
 * evaluate
 * @param SRAOS_AjaxServiceParam[] params the service invocation params to 
 * evaluate
 * @param SRAOS_AjaxRequestObj requestObj the request object if applicable
 * @return String
 */
SRAOS.getFormAction = function(constraintGroups, params, requestObj) {
  var formAction = null;
  if (constraintGroups) {
    for(var i=0; i<constraintGroups.length; i++) {
      for(var n=0; n<constraintGroups[i].constraints.length; n++) {
        if (constraintGroups[i].constraints[n].attrType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET || constraintGroups[i].constraints[n].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET) {
          formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET;
          break;
        }
        else if (constraintGroups[i].constraints[n].attrType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST || constraintGroups[i].constraints[n].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST || constraintGroups[i].constraints[n].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE) {
          formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST;
          break;
        }
      }
      if (formAction) { break; }
    }
  }
  if (!formAction && params) {
    for(var i=0; i<params.length; i++) {
      if (params[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET) {
        formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET;
        break;
      }
      else if (params[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST || params[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE) {
        formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST;
        break;
      }
    }
  }
  if (!formAction && requestObj && requestObj.attrs) {
    for(var i=0; i<requestObj.attrs.length; i++) {
      if (requestObj.attrs[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET) {
        formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_GET;
        break;
      }
      else if (requestObj.attrs[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST || requestObj.attrs[i].valueType == SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE) {
        formAction = SRAOS_AjaxConstraint.CONSTRAINT_TYPE_POST;
        break;
      }
    }
  }
  return formAction;
};


/**
 * aborts an ajax requests invoked through ajaxInvokeService
 * @access private
 * @return void
 */
SRAOS._ajaxAbortRequest = function(id) {
  if (OS._ajaxRequests[id]) {
    var request = OS._ajaxRequests[id];
    OS._ajaxRequests[id] = null;
    if (request.formAction) { OS.releaseLayer(request.id); }
    request.ajaxTarget[request.ajaxCallback]({ status: SRAOS.AJAX_STATUS_TIMEOUT , requestId: request.ajaxRequestId });
    OS._ajaxTimeouts++;
  }
};

/**
 * handles responses to ajax requests invoked through ajaxInvokeService
 * @access private
 * @return void
 */
SRAOS._ajaxResponseHandler = function() {
  if (!OS) { return; }
  
  // semaphore to support concurrency
  if (SRAOS._ajaxWait) {
    return setTimeout("SRAOS._ajaxResponseHandler()", 100);
  }
  SRAOS._ajaxWait = true;
  var reset = false;
  // look for a completed request
  for(id in OS._ajaxRequests) {
    if (OS._ajaxRequests[id] && (OS._ajaxRequests[id].xmlHttp.readyState==SRAOS.AJAX_READYSTATE_COMPLETE || OS._ajaxRequests[id].xmlHttp.readyState=="complete")) {
      var request = OS._ajaxRequests[id];
      OS._ajaxRequests[id] = null;
      var failedResponse = { status: SRAOS.AJAX_STATUS_FAILED };
      SRAOS._tempAjaxResults[id] = failedResponse;
      SRAOS._ajaxWait = false;
      reset = true;
      try {
        if (request.xmlHttp.status == SRAOS.AJAX_STATUSCODE_VALID) {
          eval('var response=' + request.xmlHttp.responseText + ';');
          
          // results not available yet, check again later
          if (response.status == SRAOS.AJAX_STATUS_RESULTS_NOT_AVAILABLE) {
            OS._ajaxRequests[id] = request;
            setTimeout('OS._ajaxSubmitRequest(' + id + ', true)', OS.getAvgAjaxResponseTime(3) * 1000);
            return;
          }
          SRAOS._tempAjaxResults[id] = response ? response : failedResponse;
          SRAOS._tempAjaxResults[id].requestId = request.ajaxRequestId;
          if (SRAOS._tempAjaxResults[id].validateErrors) {
            SRAOS._tempAjaxResults[id].results = [ { validateErrors: SRAOS._tempAjaxResults[id].validateErrors } ];
          }
          else if (SRAOS._tempAjaxResults[id].queryResults) {
            SRAOS._tempAjaxResults[id].results = [ SRAOS._tempAjaxResults[id].queryResults ];
          }
          else if (SRAOS._tempAjaxResults[id].response) {
            SRAOS._tempAjaxResults[id].results = !SRAOS._tempAjaxResults[id].global && !SRAOS_Util.isArray(SRAOS._tempAjaxResults[id].response) ? [ SRAOS._tempAjaxResults[id].response ] : SRAOS._tempAjaxResults[id].response;
          }
          else {
            SRAOS._tempAjaxResults[id].results = [];
          }
          request.ajaxTarget ? request.ajaxTarget[request.ajaxCallback](SRAOS._tempAjaxResults[id]) : eval(request.ajaxCallback + '(SRAOS._tempAjaxResults[' + id + '])');
          
          if (!response) {
            alert(OS.getString("error.ajax"));
          }
          else {
            OS._ajaxRequestSuccess++;
            OS._ajaxTotalResponseTime += response.time;
            OS._ajaxLastTime = response.time;
            if (!OS._ajaxServiceTimes[request.ajaxService]) OS._ajaxServiceTimes[request.ajaxService] = [];
            OS._ajaxServiceTimes[request.ajaxService].push(response.time);
          }
        }
        // invalid response from server
        else {
          request.ajaxTarget ? request.ajaxTarget[request.ajaxCallback](SRAOS._tempAjaxResults[id]) : eval(request.ajaxCallback + '(SRAOS._tempAjaxResults[' + id + '])');
        }
      }
      catch (e) {
        var tmp = "";
        for(i in e) {
          tmp += i + ": " + e[i] + "\n";
        }
        OS.displayErrorMessage(OS.getString(SRAOS.SYS_ERROR_RESOURCE) + "\n\n" + tmp);
        request.ajaxTarget ? request.ajaxTarget[request.ajaxCallback](SRAOS._tempAjaxResults[id]) : eval(request.ajaxCallback + '(SRAOS._tempAjaxResults[' + id + '])');
      }
      OS._ajaxRequests[id] = null;
    }
  }
  // reset the semaphore if it has not already been done. this is the result 
  // of an error or timeout, because if this method was called, there should 
  // have been a completed request
  if (!reset) {
    SRAOS._ajaxWait = false;
  }
};

/**
 * used to store temporary references to ajax results
 * @type Array
 */
SRAOS._tempAjaxResults = new Array();

// constants

/**
 * uri to a blank html page
 * @type String
 */
SRAOS.BLANK_HTML = "/blank.html";

/**
 * the default height for windows
 * @type int
 */
SRAOS.DEFAULT_HEIGHT = 300;

/**
 * the default width for windows
 * @type int
 */
SRAOS.DEFAULT_WIDTH = 500;

/**
 * the default x (left) position for windows
 * @type int
 */
SRAOS.DEFAULT_X = 0;

/**
 * the default y (top) position for windows
 * @type int
 */
SRAOS.DEFAULT_Y = 0;

/**
 * defines the preferenes popup window height
 * @type int
 */
SRAOS.SETTINGS_HEIGHT=550;

/**
 * defines the preferenes popup window width
 * @type int
 */
SRAOS.SETTINGS_WIDTH=600;

/**
 * the z-index to apply to focused windows. this will cause those windows to 
 * appear above any other windows
 * @type int
 */
SRAOS.FOCUSED_WINDOW_Z_INDEX = 1000;

/**
 * the z-index to apply to focused applications
 * @type int
 */
SRAOS.FOCUSED_APPLICATION_Z_INDEX = 999;

/**
 * the z-index to apply to un-focused applications
 * @type String
 */
SRAOS.UNFOCUSED_APPLICATION_Z_INDEX = "auto";

/**
 * the z-index for a modal window
 * @type int
 */
SRAOS.MODAL_WINDOW_Z_INDEX = 1003;

/**
 * identifies the information icon. the uri to this icon can be accessed using 
 * SRAOS.getIconUri(iconId, size). the default title for this icon is 
 * msgBox.info
 * @type String
 */
SRAOS.ICON_INFO = "info.png";

/**
 * identifies the warning icon. the uri to this icon can be accessed using 
 * SRAOS.getIconUri(iconId, size). the default title for this icon is 
 * msgBox.warn
 * @type String
 */
SRAOS.ICON_WARN = "warn.png";

/**
 * identifies the error icon. the uri to this icon can be accessed using 
 * SRAOS.getIconUri(iconId, size). the default title for this icon is 
 * msgBox.error
 * @type String
 */
SRAOS.ICON_ERROR = "error.png";

/**
 * identifies the question icon. the uri to this icon can be accessed using 
 * SRAOS.getIconUri(iconId, size). the default title for this icon is 
 * msgBox.question
 * @type String
 */
SRAOS.ICON_QUESTION = "help.png";

/**
 * how frequently (in milliseconds) to poll for an ajax form post results
 * @type int
 */
SRAOS.AJAX_POLL_FREQ = 250;

/**
 * how frequently (in milliseconds) to poll for an ajax form post results
 * @type int
 */
SRAOS.AJAX_READYSTATE_COMPLETE = 4;

/**
 * the ajax status code indicating that the request was successful
 * @type int
 */
SRAOS.AJAX_STATUSCODE_VALID = 200;

// ajaxInvokeService status codes
/**
 * identifies that a request could not be performed because the app specified 
 * was not valid
 * @type string
 */
SRAOS.AJAX_STATUS_INVALID_APP = 'invalid-app';

/**
 * identifies that a request could not be performed because attributes were set 
 * that are not allowed to be set by the service
 * @type string
 */
SRAOS.AJAX_STATUS_INVALID_ATTRS = 'invalid-attrs';

/**
 * identifies that a request could not be performed because the output format 
 * requested is not valid for this service
 * @type string
 */
SRAOS.AJAX_REQUEST_STATUS_INVALID_FORMAT = 'invalid-format';

/**
 * identifies that a request could not be performed because the input specified 
 * for an update or create action did not pass validation. if this occurs, the 
 * "results" will be populated with the error messages resulting from the failed
 * validation
 * @type string
 */
SRAOS.AJAX_STATUS_INVALID_INPUT = 'validation-error';

/**
 * identifies that a request could not be performed because the limit requested 
 * is not allowed for this service
 * @type string
 */
SRAOS.AJAX_REQUEST_STATUS_INVALID_LIMIT = 'invalid-limit';

/**
 * identifies that a request could not be performed because the output 
 * meta-format requested is not valid for this service
 * @type string
 */
SRAOS.AJAX_REQUEST_STATUS_INVALID_META_FORMAT ='invalid-meta-format';

/**
 * identifies that a request could not be performed because the user does not 
 * have permission. this will occur if a user attempts to create, delete, or 
 * update an entity and the service definition does not permit such an action
 * @type string
 */
SRAOS.AJAX_STATUS_INVALID_PERMISSIONS = 'invalid-permissions';

/**
 * identifies that a request could not be performed because the request 
 * specified was not valid. the server logs will provide more detail on the 
 * reason for this error
 * @type string
 */
SRAOS.AJAX_STATUS_INVALID_REQUEST = 'invalid-request';

/**
 * identifies that a request could not be performed because a request was made 
 * for an invalid service
 * @type string
 */
SRAOS.AJAX_REQUEST_STATUS_INVALID_SERVICE = 'invalid-service';

/**
 * identifies that a request could not be performed because the client IP 
 * address is not allowed
 * @type string
 */
SRAOS.AJAX_REQUEST_STATUS_IP_NOT_ALLOWED = 'ip-not-allowed';

/**
 * identifies that a request could not be performed because of another 
 * unspecified error. basically, anything else that can go wrong will fall under 
 * this category. the server logs will provide more detail on the reason for 
 * this error. this will include http response errors
 * @type string
 */
SRAOS.AJAX_STATUS_FAILED = 'failed';

/**
 * identifies that a request could not be performed because the action requested 
 * (create, delete or update) is not allowed via the ajax service specified
 * @type string
 */
SRAOS.AJAX_STATUS_NOT_ALLOWED = 'not-allowed';

/**
 * identifies that a request to retrieve buffered results from a prior silent 
 * invocation could not be performed because the buffer result is not available 
 * yet. if this response code is returned, you may wish to retry your request 
 * again after a short interval
 * @type string
 */
SRAOS.AJAX_STATUS_RESULTS_NOT_AVAILABLE = 'not-available';

/**
 * identifies that a request failed because the timeout threshold occurred prior 
 * to receiving a response from the ajax gateway for the service invocation 
 * OR
 * identifies that a request to retrieve buffered results from a prior silent 
 * invocation could not be performed because the 
 * SRA_AJAX_GATEWAY_REQUEST_BUFFER_TIMEOUT theshold was reached
 * @type string
 */
SRAOS.AJAX_STATUS_TIMEOUT = 'timeout';

/**
 * identifies that a request was performed successfully
 * @type string
 */
SRAOS.AJAX_STATUS_SUCCESS = 'success';

/**
 * the max interval between 2 clicks for a click action to be considered a 
 * double click
 * @type int
 */
SRAOS.DBL_CLICK_MAX_INTERVAL = 250;

/**
 * the uri to the pixel image
 * @type String
 */
SRAOS.PIXEL_IMAGE;

/**
 * the resource identifier for the system error message
 * @type String
 */
SRAOS.SYS_ERROR_RESOURCE = "error.sys";

/**
 * the top offset for the workspace (the height of the menu bar)
 * @type int
 */
SRAOS.TOP_OFFSET = 23;


/**
 * window identifier for the non-modal message box window
 * @type String
 */
SRAOS.WIN_MSGBOX = "MsgBox";


/**
 * window identifier for the modal message box window
 * @type String
 */
SRAOS.WIN_MSGBOX_MODAL = "MsgBoxModal";


/**
 * the base name of the sort ascending image. the uri to this image can be 
 * retrieved using the SRAOS.getSortAscImgUri method
 * @type String
 */
SRAOS._SORT_ASC_IMAGE = 'sort-asc.gif';


/**
 * the base name of the sort descending image. the uri to this image can be 
 * retrieved using the SRAOS.getSortDescImgUri method
 * @type String
 */
SRAOS._SORT_DESC_IMAGE = 'sort-desc.gif';


/**
 * the base name of the wait image
 * @type String
 */
SRAOS._WAIT_IMAGE = 'wait.gif';
