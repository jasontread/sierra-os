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
 * manages the browser application in the core plugin
 */
Core_BrowserAppManager = function() {
  
  /**
   * the id of the initial node to select specified through the 'selectNode' 
   * application initialization parameter
   * @type int
   */
  this._initSelectNodeId;
  
  
  // {{{ init
  /**
   * @param Array params may contain the value 'selectNode' identifying the id 
   * or type of the node to initially select in the browser window. this 
   * parameter may be either a reference to Core_VfsNode object, or the id 
   * of a node, or one of the following unique node types: 
   * Core_Vfs.FOLDER_DESKTOP, Core_Vfs.FOLDER_HOME or 
   * Core_Vfs.FOLDER_TRASH
   * @access  public
	 * @return void
	 */
	this.init = function(params) {
		this._initSelectNodeId = params && params['selectNode'] ? params['selectNode'] : null;
	};
	// }}}
};
// }}}


// {{{
/**
 * manages the upload file window
 */
Core_BrowserUploadManager = function() {
  
  // attributes
  /**
   * if this window has been opened to replace an existing file, this attribute 
   * will be a reference to the node representing that file
   * @type Core_VfsNode
   */
  this._node;
  
  /**
   * the current # of form fields
   * @type int
   */
  this._numFields = 1;
  
	// {{{ addField
	/**
	 * adds a field to the file upload window. displays an error message if the 
   * max # of fields is already displayed
   * @access  public
	 * @return void
	 */
	this.addField = function() {
    if (this._numFields < Core_BrowserUploadManager.MAX_UPLOAD_FILES) {
      var divId = this.win.getDivId();
      var currAddSpan = document.getElementById(divId + "uploadFile" + this._numFields + "AddSpan");
      document.getElementById(divId + "uploadFile" + (this._numFields + 1) + "AddSpan").innerHTML = currAddSpan.innerHTML;
      currAddSpan.innerHTML = '';
      if (this._numFields > 1) {
        var currRemoveSpan = document.getElementById(divId + "uploadFile" + this._numFields + "RemoveSpan");
        document.getElementById(divId + "uploadFile" + (this._numFields + 1) + "RemoveSpan").innerHTML = currRemoveSpan.innerHTML;
        currRemoveSpan.innerHTML = '';
      }
      this._numFields++;
      document.getElementById(divId + "uploadFile" + this._numFields + "FieldSpan").innerHTML = '<input id="' + divId + 'coreFileData' + this._numFields + '" name="coreFileData' + this._numFields + '" type="file" />';
      var div = document.getElementById(divId + "uploadFile" + this._numFields);
      var divTop = (this._numFields - 1) * 35;
      div.style.top = divTop + "px";
      this.win.getDomElements({ "className": "coreFileUploadButtons" })[0].style.top = (divTop + 40) + "px";
      div.style.visibility = "inherit";
    }
	};
	// }}}
  
  // {{{ init
  /**
   * this method is called when the window is first opened and initialized. the 
   * params specified, are those generated from the previous "getState" call if 
   * this window is being restored. the window will not be visible when this 
   * method is invoked. 
   * @param Array params the initialization parameters if this window is being 
   * restored, OR custom startup parameters specified by the window opener 
   * (if any) otherwise
   * @access  public
	 * @return void
	 */
	this.init = function(params) {
		if (params && params.node) { this._node = params.node; }
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
    if (this._node) {
      var divId = this.win.getDivId();
      document.getElementById(divId + "uploadFile1AddSpan").innerHTML = '';
      document.getElementById(divId + "uploadFile1LabelSpan").innerHTML = this.win.getPlugin().getString('CoreFile') + ' ';
    }
		return true;
	};
	// }}}
  
	// {{{ removeField
	/**
	 * adds a field to the file upload window. displays an error message if the 
   * max # of fields is already displayed
   * @access  public
	 * @return void
	 */
	this.removeField = function() {
    if (this._numFields > 1) {
      var divId = this.win.getDivId();
      var currAddSpan = document.getElementById(divId + "uploadFile" + this._numFields + "AddSpan");
      document.getElementById(divId + "uploadFile" + (this._numFields - 1) + "AddSpan").innerHTML = currAddSpan.innerHTML;
      currAddSpan.innerHTML = '';
      if (this._numFields > 2) {
        var currRemoveSpan = document.getElementById(divId + "uploadFile" + this._numFields + "RemoveSpan");
        document.getElementById(divId + "uploadFile" + (this._numFields - 1) + "RemoveSpan").innerHTML = currRemoveSpan.innerHTML;
        currRemoveSpan.innerHTML = '';
      }
      document.getElementById(divId + "uploadFile" + this._numFields + "FieldSpan").innerHTML = '';
      var div = document.getElementById(divId + "uploadFile" + this._numFields);
      div.style.visibility = "hidden";
      div.style.top = "0px";
      this._numFields--;
      var divTop = (this._numFields - 1) * 35;
      this.win.getDomElements({ "className": "coreFileUploadButtons" })[0].style.top = (divTop + 40) + "px";
    }
	};
	// }}}
  
	// {{{ submit
	/**
	 * starts the upload process
   * @access  public
	 * @return void
	 */
  this.submit = function() {
    var plugin = OS.getPlugin('core');
    this.win.syncWait(plugin.getString('Browser.text.uploadingFile'));
    var params = new Array(new SRAOS_AjaxServiceParam(this._node ? 'fileId' : 'parent', this._node ? this._node.entityId : this.win.getModalTarget().getPrimaryWindow().getManager().getSelectedNode()));
    params.push(new SRAOS_AjaxServiceParam('file1', 'coreFileData1', SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE));
    if (!this._node) {
      for(var i=2; i<= this._numFields; i++) {
        params.push(new SRAOS_AjaxServiceParam('file' + i, 'coreFileData' + i, SRAOS_AjaxConstraint.CONSTRAINT_TYPE_FILE));
      }
    }
    OS.ajaxInvokeService('core_fileUpload', this, '_uploadComplete', null, null, params);
  };
  // }}}
  
  
	// {{{ _uploadComplete
	/**
	 * handles the response from sending a message
   * @param Object response the response received
   * @access  public
	 * @return void
	 */
	this._uploadComplete = function(response) {
    if (!this.win.isClosed()) { this.win.syncFree(); }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToUploadFile"), response);
    }
    else if (response.results) {
      var msg = '';
      for(var i in response.results) {
        msg += response.results[i] + "\n";
      }
      OS.displayErrorMessage(msg);
    }
    else {
      this.win.getModalTarget().getPrimaryWindow().getManager().reloadSelectedNode();
      OS.closeWindow(this.win);
    }
  };
  // }}}
};

// constants
/**
 * the max # of fields to allow in the upload file window
 * @type int
 */
Core_BrowserUploadManager.MAX_UPLOAD_FILES = 9;

// }}}


// {{{
/**
 * manages the browser window in the core plugin
 */
Core_BrowserManager = function() {
  
  /**
   * whether or not the back function is enabled
   * @type boolean
   */
  this._backEnabled = false;
  
  /**
   * the currently displayed nodes
   * @type Core_VfsNode[]
   */
  this._displayedNodes;
  
  /**
   * the properties that should be displayed in list view
   * @type String[]
   */
  this._displayProperties = new Array("dateModified", "size", "type");
  
  /**
   * whether or not the forward function is enabled
   * @type boolean
   */
  this._fwdEnabled = false;
  
  /**
   * the node that is currently highlighted in the content panel
   * @type Core_VfsNode
   */
  this._highlightedNode;
  
  /**
   * tracks the user's navigation history
   * @type Array
   */
  this._history = new Array();
  
  /**
   * tracks the size of _history
   * @type int
   */
  this._historyLength = 0;
  
  /**
   * the id of the initial node to select specified through the 'selectNode' 
   * application initialization parameter
   * @type int
   */
  this._initSelectNodeId;
  
  /**
   * tracks the user's current position relative to _history
   * @type int
   */
  this._position = -1;
  
  /**
   * the id of the currently selected node
   * @type int
   */
  this._selectedNode;
  
  /**
   * a reference to the select node object
   * @type Core_VfsNode
   */
  this._selectedNodeRef;
  
  /**
   * used to keep track of the nodes displayed in the sidebar. this is a hash 
   * where the key is the node id and the value is the div id for that node 
   * within the sidebar
   * @type Array
   */
  this._sidebarNodeDivs;
  
  /**
   * whether or not the node selection event should ignore history changes
   * @type boolean
   */
  this._skipHistory = false;
  
  /**
   * whether or not the node selection event should ignore history changes
   * @type Object
   */
  this._sortBy = { "name": SRAOS_AjaxConstraint.OP_SORT_ASC, "dateCreated": 0, "dateModified": 0, "nodeOwner": 0, "nodeGroup": 0, "permissions": 0, "size": 0, "type": 0, "parent": 0 };
  
  /**
   * used to track the order of the sorting
   * @type String[]
   */
  this._sortByProperties = [ "name" ];
  
  /**
   * whether or not the view by icon links should be enabled
   * @type boolean
   */
  this._viewByIconEnabled = false;
  
  
  // {{{ addDisplayedNodeEvents
  /**
   * adds events to the displayed nodes
   * @return void
   */
  this.addDisplayedNodeEvents = function() {
    if (this._displayedNodes) {
      for(var i=0; i<this._displayedNodes.length; i++) {
        var div = document.getElementById(this.win.getDivId() + 'Node' + this._displayedNodes[i].id);
        
        div._node = this._displayedNodes[i];
        div.ondblclick = function() {
          OS.getWindowInstance(this).getManager().open(this._node);
        };
        div.onclick = function() {
          OS.getWindowInstance(this).getManager().highlightNode(this._node);
        };
        if (this._displayedNodes[i].canMove()) {
          OS.dragAndDrop.addDragObject(div._node, div);
        }
      }
    }
  };
  // }}}
  
  // {{{ addToCommonPlaces
	/**
	 * adds an entity or folder to the user's common places
   * @access  public
	 * @return void
	 */
  this.addToCommonPlaces = function() {
    if (this._highlightedNode) {
      this.win.setStatusBarText(this.win.getPlugin().getString("Browser.text.addingToCommonPlaces"));
      OS.ajaxInvokeService("core_updateUser", this, "_updateCommonPlaces", null, new SRAOS_AjaxRequestObj(OS.user.uid, { "coreCommonPlaces": this._highlightedNode.id }));
      Core_BrowserManager.SIDEBAR_NODES[this._highlightedNode.id] = this._highlightedNode;
      this._enableNodeSelectionControls();
    }
  };
  // }}}
  
  // {{{ back
	/**
	 * selects the previous browser position
   * @access  public
	 * @return void
	 */
  this.back = function() {
    if (this._position > 0) {
      this._skipHistory = true;
      this._position--;
      this.selectNode(this._history[this._position]);
      this._enableBack(this._position != 0);
      this._enableFwd(true);
      this._skipHistory = false;
    }
    else {
      this._enableBack(false);
    }
  };
  // }}}
  
  // {{{ copyToFolder
	/**
	 * copies a selected folder or entity to another folder
   * @access  public
	 * @return void
	 */
  this.copyToFolder = function() {
    // TODO
    alert('copyToFolder');
  };
  // }}}
  
  // {{{ displayNodesIcons
	/**
	 * displays the current nodes using just the icons
   * @access  public
	 * @return void
	 */
  this.displayNodesIcons = function() {
    html = '';
    if (this._displayedNodes) {
      for(var i=0; i<this._displayedNodes.length; i++) {
        var divId = this.win.getDivId() + 'Node' + this._displayedNodes[i].id;
        html += '<div id="' + divId + '"' + (this._highlightedNode == this._displayedNodes[i] ? ' class="coreBrowserHighlighted"' : '') + ' style="overflow: hidden">';
        html += '<img alt="' + this._displayedNodes[i].getLabel() + '" src="' + this._displayedNodes[i].getIcon(32) + '" title="' + this._displayedNodes[i].getLabel() + '" /><br />';
        html += this._displayedNodes[i].getLabel();
        html += '</div>';
      }
    }
    this._divContent.innerHTML = html;
    this.positionIcons();
    this.addDisplayedNodeEvents();
  };
  // }}}
  
  // {{{ displayNodesList
	/**
	 * displays the current nodes using a list
   * @access  public
	 * @return void
	 */
  this.displayNodesList = function() {
    var plugin = this.win.getPlugin();
    
    html = '<table class="coreBrowserList"><tr>';
    html += '<th onclick="OS.getWindowInstance(this).getManager().toggleSort(\'name\')">';
    var sortImg = this._sortBy['name'] == SRAOS_AjaxConstraint.OP_SORT_DESC ? Core_BrowserManager.IMG_SORT_DESC : (this._sortBy['name'] == SRAOS_AjaxConstraint.OP_SORT_ASC ? Core_BrowserManager.IMG_SORT_ASC : null);
    html += (sortImg ? '<img alt="" src="' + this.win.getPlugin().getBaseUri() + "images/" + sortImg + '" />' : '') + plugin.getString('CoreVfsNode.name') + '</th>';
    for(var i in Core_BrowserManager.COLUMNS) {
      var property = Core_BrowserManager.COLUMNS[i];
      if (SRAOS_Util.inArray(property, this._displayProperties)) {
        html += '<th onclick="OS.getWindowInstance(this).getManager().toggleSort(\'' + property + '\')">';
        var sortImg = this._sortBy[property] == SRAOS_AjaxConstraint.OP_SORT_DESC ? Core_BrowserManager.IMG_SORT_DESC : (this._sortBy[property] == SRAOS_AjaxConstraint.OP_SORT_ASC ? Core_BrowserManager.IMG_SORT_ASC : null);
        html += (sortImg ? '<img alt="" src="' + this.win.getPlugin().getBaseUri() + "images/" + sortImg + '" />' : '') + plugin.getString('CoreVfsNode.' + property) + '</th>';
      }
    }
    html += '<th style="cursor: default">' + plugin.getString('Browser.text.actions') + '</th>';
    html += '</tr>\n';
    if (this._displayedNodes) {
      for(var i=0; i<this._displayedNodes.length; i++) {
        var divId = this.win.getDivId() + 'Node' + this._displayedNodes[i].id;
        html += '<tr id="' + divId + '"' + (this._highlightedNode == this._displayedNodes[i] ? ' class="coreBrowserHighlighted"' : '') + '>';
        html += '<td class="nodeName">';
        html += '<img alt="' + this._displayedNodes[i].getLabel() + '" src="' + this._displayedNodes[i].getIcon(16) + '" title="' + this._displayedNodes[i].getLabel() + '" />';
        html += this._displayedNodes[i].getProperty('name') + '</td>';
        for(var n in Core_BrowserManager.COLUMNS) {
          var property = Core_BrowserManager.COLUMNS[n];
          if (SRAOS_Util.inArray(property, this._displayProperties)) {
            html += '<td>' + this._displayedNodes[i].getProperty(property) + '</td>';
          }
        }
        html += "<td onclick='Core_BrowserManager._skipNextDisplay=true;setTimeout(\"Core_BrowserManager._skipNextDisplay=false\", 1);'>";
        if (!this._displayedNodes[i].isFolder()) {
          html += OS.getActions(this._displayedNodes[i].type, this._displayedNodes[i].getEntityInstance(), "document.getElementById('" + divId + "')._node.getEntityInstance()", this.win.getWindow(), 16);
        }
        html += '</td>';
        html += '</tr>\n';
      }
    }
    html += '</table>';
    this._divContent.innerHTML = html;
    this.addDisplayedNodeEvents();
  };
  // }}}
  
  // {{{ emptyTrash
	/**
	 * empties the user's trash
   * @access  public
	 * @return void
	 */
  this.emptyTrash = function() {
    return OS.emptyTrash();
  };
  // }}}
  
  // {{{ forward
	/**
	 * selects the next browser position
   * @access  public
	 * @return void
	 */
  this.forward = function() {
    if (this._position < this._historyLength) {
      this._skipHistory = true;
      this._position++;
      this.selectNode(this._history[this._position]);
      this._enableBack(true);
      this._enableFwd((this._position + 1) < this._historyLength);
      this._skipHistory = false;
    }
  };
  // }}}
  
  // {{{ getSelectedNode
	/**
	 * selects the next browser position
   * @access  public
	 * @return int
	 */
  this.getSelectedNode = function() {
    return this._selectedNode;
  };
  // }}}
  
	// {{{ getSidebarNodes
	/**
	 * retrieves the user's sidebar nodes. these are the user's home folder node, 
   * current desktop (workspace) folder node, the root network folder node, any 
   * user 'common place' nodes and the the trash folder node (in that order)
   * @param String target (see class api comments)
   * @param String callback (nodes : Core_VfsNode[]) - (see class api comments)
   * @param String updateCallback (nodes : Core_VfsNode[]) - (see class api comments)
   * @param String errorCallback (see class api comments)
   * @param boolean refresh whether or not to retrieve the node via ajax from 
   * the server even if it is already cached on the client
   * @access  public
	 * @return void
	 */
	this.getSidebarNodes = function(target, callback, updateCallback, errorCallback, refresh) {
    // TODO
	};
	// }}}
  
  // {{{ getState
  /**
   * this method is called when the state of it's corresponding win instance 
   * is being saved. manager implementations may use it to save additional state 
   * information that will later be passed to the init method below when the 
   * app is restored. the return value should be an associative array of key
   * value initialization variables
   * @access  public
	 * @return Array
	 */
	this.getState = function() {
		return { "restore": true, "backEnabled": this._backEnabled, "displayProperties": this._displayProperties, "fwdEnabled": this._fwdEnabled, "position": this._position, "skipHistory": this._skipHistory, "historyLength": this._historyLength, "history": this._history, "selectedNode": this._selectedNode ? this._selectedNode : 0, "sortBy": this._sortBy, "sortByProperties": this._sortByProperties, "viewByIconEnabled": this._viewByIconEnabled };
	};
	// }}}
  
  // {{{ highlightNode
  /**
   * highlights the node specified in the content panel
   * @access  public
	 * @return Array
	 */
	this.highlightNode = function(node) {
		var div = document.getElementById(this.win.getDivId() + 'Node' + node.id);
    if (node != this._highlightedNode && this._highlightedNode && document.getElementById(this.win.getDivId() + 'Node' + this._highlightedNode.id)) {
      document.getElementById(this.win.getDivId() + 'Node' + this._highlightedNode.id).className = null;
    }
    if (div && this._highlightedNode != node) {
      div.className = 'coreBrowserHighlighted';
      this._highlightedNode = node;
      this._enableNodeSelectionControls(true);
    }
	};
	// }}}
  
  // {{{ init
  /**
   * this method is called when the app is first opened and initialized. the 
   * params specified, are those generated from the previous "getState" call if 
   * this app is being restored
   * @param Array params the initialization parameters. may be null if not 
   * being restored
   * @access  public
	 * @return void
	 */
	this.init = function(params) {
    
		if (params && params.restore) {
      this._skipHistory = params.skipHistory;
      this._position = params.position;
      this._historyLength = params.historyLength;
      this._history = params.history;
      this._backEnabled = params.backEnabled;
      this._fwdEnabled = params.fwdEnabled;
      this._initSelectNodeId = params.selectedNode;
      this._sortBy = params.sortBy;
      this._sortByProperties = params.sortByProperties;
      this._viewByIconEnabled = params.viewByIconEnabled;
      this._displayProperties = params.displayProperties;
      this._restored = true;
    }
    
    Core_BrowserManager.SIDEBAR_TYPE_ORDER = [ Core_Vfs.FOLDER_DESKTOP, Core_Vfs.FOLDER_HOME, Core_Vfs.FOLDER_NETWORK, Core_Vfs.FOLDER_SYSTEM, Core_Vfs.FOLDER, '*', Core_Vfs.FOLDER_TRASH ];
	};
	// }}}
  
  // {{{ loadBrowser
	/**
	 * loads the browser tree
   * @access  public
	 * @return void
	 */
  this.loadBrowser = function() {
    OS.ajaxInvokeService("core_getRootNodes", this, "_loadBrowser");
  };
  // }}}
  
  // {{{ loadNodeContents
	/**
	 * invokes an ajax service to obtain a reference to the child nodes of the 
   * current selected node
   * @access  public
	 * @return void
	 */
  this.loadNodeContents = function() {
    this._divContent.innerHTML = '';
    if (this._selectedNode) {
//      Core_BrowserManager.displayNodes = function(this.win.getDivId(), this._selectedNode);
      Core_BrowserManager.getNode(this._selectedNode, this, '_setActiveNode');
    }
    else if (this._viewByIconEnabled) {
      this.displayNodesList();
    }
  };
  // }}}
  
  // {{{ loadSidebar
	/**
	 * loads the user's sidebar (common places)
   * @access  public
	 * @return void
	 */
  this.loadSidebar = function() {
    OS.ajaxInvokeService("core_getSidebarNodes", this, "_loadSidebar", null, null, [ new SRAOS_AjaxServiceParam("workspace", OS.workspace.workspaceId) ]);
  };
  // }}}
  
  // {{{ moveToFolder
	/**
	 * moves a selected folder or entity to another folder
   * @access  public
	 * @return void
	 */
  this.moveToFolder = function() {
    // TODO
    alert('moveToFolder');
  };
  // }}}
  
  // {{{ moveToTrash
	/**
	 * delete a selected item (entity or folder) by moving it to the trash
   * @param Core_VfsNode[] nodes the nodes to move to the trash. if not 
   * specified, the current highlighted node will be moved
   * @access  public
	 * @return void
	 */
  this.moveToTrash = function(nodes) {
    nodes = nodes ? nodes : [ this._highlightedNode ];
    if (nodes) {
      for(var i in nodes) {
        if (!nodes[i].hasAccess(Core_Vfs.PERMISSIONS_WRITE) || nodes[i].isSystemNode()) {
          OS.displayErrorMessage(this.win.getPlugin().getString(!nodes[i].hasAccess(Core_Vfs.PERMISSIONS_WRITE) ? "Browser.error.invalidPermissionsAmb" : "Browser.error.cannotMoveToTrash"));
          return;
        }
      }
      var params = new Array();
      for(var i in nodes) {
        if (nodes[i].parent.nodeId != Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id) {
          params.push(new SRAOS_AjaxServiceParam('node' + i, nodes[i].id));
        }
      }
      if (params.length > 0) {
        params.push(new SRAOS_AjaxServiceParam('dest', Core_Vfs.FOLDER_TRASH));
        this.win.setStatusBarText(this.win.getPlugin().getString("Browser.text.movingToTrash"));
        OS.ajaxInvokeService('core_moveNodes', this, '_moveComplete', null, null, params, this._selectedNode);
      }
    }
  };
  // }}}
  
  // {{{ newFolder
	/**
	 * creates a new folder
   * @access  public
	 * @return void
	 */
  this.newFolder = function() {
    var folderName = OS.prompt(this.win.getPlugin().getString('Browser.text.newFolderPrompt'));
    if (folderName) {
      this.win.setStatusBarText(this.win.getPlugin().getString("Browser.text.creatingNewFolder"));
      OS.ajaxInvokeService("core_manageVfsNodes", this, "_newFolder", null, new SRAOS_AjaxRequestObj(null, { "name": folderName, "parent": this._selectedNode }, SRAOS_AjaxRequestObj.TYPE_CREATE), null, this._selectedNode);
    }
  };
  // }}}
  
  // {{{ newLink
	/**
	 * creates a new link
   * @access  public
	 * @return void
	 */
  this.newLink = function() {
    // TODO
    alert('newLink');
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
		this._enableBack(this._backEnabled);
    this._enableFwd(this._fwdEnabled);
    this._enableViewByIcon(this._viewByIconEnabled);
    this._updateSortByMenu();
    this._updateColumnsMenu();
    this._enableFolderSelectionControls(this._selectedNode ? true : false);
    this._enableNodeSelectionControls(this._highlightedNode ? true : false);
    this._divContent.style.overflow = "auto";
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
    // initialize content and topic divs
    this._divTree = document.getElementById(this.win.getDivId() + "browserTree");
    this._divSidebar = document.getElementById(this.win.getDivId() + "browserSidebar");
    this._divContent = document.getElementById(this.win.getDivId() + "browserContent");
    var vertDivider = document.getElementById(this.win.getDivId() + "browserVertDivider");
    var horzDivider = document.getElementById(this.win.getDivId() + "browserHorzDivider");
    this._divContent.style.width = (width - 187) + "px";
    this._divContent.style.height = (height) + "px";
    this._divContent.style.left = "186px";
    this._divSidebar.style.width = "184px";
    this._divSidebar.style.height = "115px";
    this._divTree.style.width = "178px";
    this._divTree.style.height = (height - 123) + "px";
    this._divTree.style.top = "117px";
    vertDivider.style.left = "184px";
    vertDivider.style.height = "100%";
    horzDivider.style.top = "114px";
    horzDivider.style.width = "184px";
    var canvas = document.getElementById(this.win.getDivId());
    new SRAOS_Divider(vertDivider, canvas, 50, width - 50, false, new Array(this._divTree, this._divSidebar, horzDivider), new Array(this._divContent), 1, 5);
    new SRAOS_Divider(horzDivider, canvas, 50, height - 50, true, new Array(this._divSidebar), new Array(this._divTree), 1, 2);
    
    this._initSelectNodeId = !this._initSelectNodeId ? this.win.getAppInstance().getManager()._initSelectNodeId : this._initSelectNodeId;
    var syncMsgs = new Array();
    this.win.syncWait(null, null, null, 2, [ this.win.getPlugin().getString("Browser.text.loadingSidebar"), this.win.getPlugin().getString("Browser.text.loadingNavigation") ]);
    Core_BrowserManager.SIDEBAR_NODES ? this.populateSidebar() : this.loadSidebar();
    this.loadBrowser();
    
    if (this._restored) { 
      this.onFocus();
    }
    setTimeout('OS.getWindowInstance("' + this.win.getDivId() + '").getManager().updateTrashStatus()', 500);
    
		return true;
	};
	// }}}
  
  // {{{ onResizeEnd
	/**
	 * this method is called when a window resize event is ended. return value is 
   * ignored
   * @param int height the current height of the canvas area of the window
   * @param int width the current width of the canvas area of the window
   * @access  public
	 * @return void
	 */
	this.onResizeEnd = function(height, width) {
    if (!this._skipNextResizeEnd && this._divContent && !this.win.isMaximized()) { 
      this._divContent.style.width = (width - 187) + "px";
      this._divContent.style.height = (height) + "px";
    }
    else if (this.win.isMaximized()) {
      this._skipNextResizeEnd = true;
    }
    else if (this._skipNextResizeEnd) {
      this._skipNextResizeEnd = false;
    }
		if (this._divTree) { this.positionIcons(width - this._divTree.offsetWidth); }
	};
	// }}}
  
  // {{{ open
	/**
	 * opens a selected node (file or directory)
   * @param Core_VfsNode node the node to open. if not specified, the 
   * current highlighted node will be opened
   * @access  public
	 * @return void
	 */
  this.open = function(node) {
    node = node ? node : this._highlightedNode;
    if (node && node.hasAccess(Core_Vfs.PERMISSIONS_READ) && !Core_BrowserManager._skipNextDisplay) {
      if (node.isFolder()) {
        this.selectNode(node);
      }
      else {
        SRAOS_Entity.display(node.type, node.getEntityInstance());
      }
    }
  };
  // }}}
  
  // {{{ populateSidebar
  /**
   * populates the sidebar with the user's common place nodes
   * @return void
   */
  this.populateSidebar = function() {
    var html = '';
    this._sidebarNodeDivs = new Array();
    var sidebarNodes = new Array();
    var nodeIds = new Array();
    for(var n=0; n<Core_BrowserManager.SIDEBAR_TYPE_ORDER.length; n++) {
      for(var i in Core_BrowserManager.SIDEBAR_NODES) {
        var node = Core_BrowserManager.SIDEBAR_NODES[i];
        // don't put nodes in sidebar that are in the trash
        if (Core_BrowserManager.BASE_NODES && node.parent.nodeId == Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id) { continue; }
        
        if ((Core_BrowserManager.SIDEBAR_TYPE_ORDER[n] == '*' && !node.isFolder()) || (node.type == Core_BrowserManager.SIDEBAR_TYPE_ORDER[n])) {
          var label = node.getLabel(true);
          this._sidebarNodeDivs[node.id] = this.win.getDivId() + 'SbNode' + node.id;
          sidebarNodes[node.id] = node;
          nodeIds.push(node.id);
          html += '<div id="' + this._sidebarNodeDivs[node.id] + '" onclick="OS.getWindowInstance(this).getManager().selectNode(' + node.id + ')"' + (this._initSelectNodeId == node.id || this._selectedNode == node.id ? ' class="coreBrowserHighlighted"' : '') + '><img ' + (node.type == Core_Vfs.FOLDER_TRASH ? 'id="' + this.win.getDivId() + 'SbTrashImg" ' : '') + 'alt="' + label + '" src="' + node.getIcon(16) + '" title="' + label + '" />' + label + '</div>\n';
        }
      }
    }
    this._divSidebar.innerHTML = html;
    var pos = 0;
    for(var i in nodeIds) {
      i = nodeIds[i];
      var div = document.getElementById(this._sidebarNodeDivs[i]);
      div._windowInstance = this.win;
      div._sidebarPos = pos;
      if (sidebarNodes[i].hasAccess(Core_Vfs.PERMISSIONS_WRITE)) {
        sidebarNodes[i]._div = div;
        sidebarNodes[i].onDrop = function(node) {
          Core_BrowserManager.move(node, this);
        };
        OS.dragAndDrop.addDropTarget(sidebarNodes[i], div, new Array(Core_VfsNode), "coreBrowserHighlighted");
      }
      pos++;
    }
    this.win.syncStep();
  };
  // }}}
  
  // {{{ positionIcons
	/**
	 * positions the icons based on the current width of the content canvas
   * @param int width the width of the content area
   * @access  public
	 * @return void
	 */
  this.positionIcons = function(width) {
    if (!this._viewByIconEnabled && this._displayedNodes) {
      width = width ? width : this._divContent.offsetWidth;
      var left = Core_BrowserManager.ICON_PADDING;
      var top = Core_BrowserManager.ICON_PADDING;
      for(var i=0; i<this._displayedNodes.length; i++) {
        var divId = this.win.getDivId() + 'Node' + this._displayedNodes[i].id;
        document.getElementById(divId).style.left = left + "px";
        document.getElementById(divId).style.top = top + "px";
        left += Core_BrowserManager.ICON_WIDTH;
        if ((left + Core_BrowserManager.ICON_WIDTH) > width) {
          top +=  Core_BrowserManager.ICON_HEIGHT;
          left = Core_BrowserManager.ICON_PADDING;
        }
      }
    }
  };
  // }}}
  
  // {{{ properties
	/**
	 * shows the properties a selected entity or folder
   * @access  public
	 * @return void
	 */
  this.properties = function() {
    // TODO
    alert('properties');
  };
  // }}}
  
  // {{{ refreshDisplay
	/**
	 * refreshes the node display for this browser instance
   * @access  public
	 * @return void
	 */
  this.refreshDisplay = function() {
    this.refreshTitleAndStatus();
    this._viewByIconEnabled ? this.displayNodesList() : this.displayNodesIcons();
  };
  // }}}
  
  // {{{ refreshTitleAndStatus
	/**
	 * updates the title and status text for this window
   * @access  public
	 * @return void
	 */
  this.refreshTitleAndStatus = function() {
    var label = this._selectedNodeRef ? this._selectedNodeRef.getLabel(true) : this.win.getWindow().getLabel();
    if (this._selectedNodeRef && label != this._selectedNodeRef.getLabel()) {
      label += ' - ' + this._selectedNodeRef.getLabel();
    }
    this.win.setTitleText(label);
    this.win.setStatusBarText(this._selectedNodeRef ? this._selectedNodeRef.numChildren + ' ' + OS.getString(this._selectedNodeRef.numChildren != 1 ? "text.items" : "text.item") : '');
  };
  // }}}
  
  // {{{ reloadSelectedNode
	/**
	 * reloads the contents of the current selected node
   * @param mixed node either the node id or the node type of the node that was 
   * changed. if this parameter is specified, the refresh will only occur if the 
   * current node is that same node. if this parameter is not specified, the 
   * reload will occur regardless
   * @access  public
	 * @return void
	 */
  this.reloadSelectedNode = function(node) {
    if (!node || node == this._selectedNode || (this._selectedNodeRef && node == this._selectedNodeRef.type)) {
      var node = this._selectedNode;
      this._selectedNode = null;
      this.selectNode(node);
    }
  };
  // }}}
  
  // {{{ reloadTrashNode
	/**
	 * reloads the trash node
   * @access  public
	 * @return void
	 */
  this.reloadTrashNode = function() {
    OS.ajaxInvokeService("core_getTrashNode", this, "_reloadTrashNode");
  };
  // }}}
  
  // {{{ removeFromCommonPlaces
	/**
	 * removes an entity or folder from the user's common places
   * @access  public
	 * @return void
	 */
  this.removeFromCommonPlaces = function() {
    if (this._selectedNode) {
      this.win.setStatusBarText(this.win.getPlugin().getString("Browser.text.removingFromCommonPlaces"));
      OS.ajaxInvokeService("core_updateUser", this, "_updateCommonPlaces", null, new SRAOS_AjaxRequestObj(OS.user.uid, { "coreCommonPlaces_remove": this._selectedNode }));
      Core_BrowserManager.SIDEBAR_NODES = SRAOS_Util.removeFromArray(this._selectedNode, Core_BrowserManager.SIDEBAR_NODES, 1, 'id');
    }
  };
  // }}}
  
  // {{{ rename
	/**
	 * renames a selected entity or folder
   * @access  public
	 * @return void
	 */
  this.rename = function() {
    if (this._highlightedNode) {
      var newName = OS.prompt(this.win.getPlugin().getString('Browser.text.renamePrompt'), this._highlightedNode.name);
      if (newName && newName != this._highlightedNode.name) {
        this.win.setStatusBarText(this.win.getPlugin().getString("Browser.text.renamingObject"));
        OS.ajaxInvokeService("core_manageVfsNodes", this, "_rename", null, new SRAOS_AjaxRequestObj(this._highlightedNode.id, { "name": newName }), null, this._selectedNode);
      }
    }
  };
  // }}}
  
  // {{{ reuploadFile
	/**
	 * re-uploads a file replacing the current file but not renaming the file
   * @access  public
	 * @return void
	 */
  this.reuploadFile = function() {
    if (this._highlightedNode) { 
      this.win.getAppInstance().launchWindow('BrowserUpload', { "node": this._highlightedNode }, { "title": this.win.getPlugin().getString('Browser.text.reupload') + ' - ' + this._highlightedNode.getLabel() }); 
    }
  };
  // }}}
  
  // {{{ selectNode
	/**
	 * selects the node specified in this browser window. an error message will 
   * be displayed if the node is not valid or the user does not have read 
   * permission to it
   * @param mixed node if not specified, the this._initSelectNodeId value will 
   * be used. if specified, this parameter may be either a reference to 
   * Core_VfsNode object, or the id of a node, or one of the following 
   * unique node types: Core_Vfs.FOLDER_DESKTOP, 
   * Core_Vfs.FOLDER_HOME or Core_Vfs.FOLDER_TRASH
   * @access  public
	 * @return void
	 */
  this.selectNode = function(node) {
    node = node ? node : this._initSelectNodeId;
    node = node.id ? node.id : node;
    node = Core_BrowserManager.BASE_NODES && Core_BrowserManager.BASE_NODES[node] ? Core_BrowserManager.BASE_NODES[node].id : node;
    
    // reset init selection node
    var skipHistory = false;
    if (this._initSelectNodeId) { 
      this._initSelectNodeId = null;
      skipHistory = this._restored;
    }
    
    if (node && SRAOS_Util.isNumeric(node)) {
      if (this._selectedNode != node) {
        // reset sidebar selection
        for(var id in this._sidebarNodeDivs) {
          document.getElementById(this._sidebarNodeDivs[id]).className = id == node ? 'sidebarActive' : null;
        }
        this._selectedNode = node;
        if (!skipHistory) { this._updateHistory(node); }
        
        if (this._selectNodeTimer) { clearTimeout(this._selectNodeTimer); }
        this._selectNodeTimer = setTimeout('OS.getWindowInstance("' + this.win.getDivId() + '").getManager().loadNodeContents()', 250);
        this._highlightedNode = null;
        this._enableNodeSelectionControls(false);
        this._enableFolderSelectionControls(false);
      }
      return;
    }
    else if (node) {
      OS.displayErrorMessage(OS.getString(SRAOS.SYS_ERROR_RESOURCE));
    }
    this._enableFolderSelectionControls(false);
  };
  // }}}
  
  // {{{ toggleColumn
	/**
	 * toggles whether or not a node property is displayed in list views
   * @param String property the property to toggle. this value should be one of 
   * the values in Core_BrowserManager.COLUMNS
   * @access  public
	 * @return void
	 */
  this.toggleColumn = function(property) {
    if (SRAOS_Util.inArray(property, this._displayProperties)) {
      this._displayProperties = SRAOS_Util.removeFromArray(property, this._displayProperties);
    }
    else {
      this._displayProperties.push(property);
    }
    this._updateColumnsMenu();
    this.displayNodesList();
  };
  // }}}
  
  // {{{ toggleSort
	/**
	 * toggles sorting of nodes on the property specified
   * @param String property the property to toggle. this value should be one of 
   * the values in Core_BrowserManager.COLUMNS
   * @access  public
	 * @return void
	 */
  this.toggleSort = function(property) {
    this._sortBy[property] = this._sortBy[property] == 0 ? SRAOS_AjaxConstraint.OP_SORT_DESC : (this._sortBy[property] == SRAOS_AjaxConstraint.OP_SORT_DESC ? SRAOS_AjaxConstraint.OP_SORT_ASC : 0);
    if (SRAOS_Util.inArray(property, this._sortByProperties) && this._sortBy[property] == 0) {
      this._sortByProperties = SRAOS_Util.removeFromArray(property, this._sortByProperties);
    }
    else if (!SRAOS_Util.inArray(property, this._sortByProperties)) {
      this._sortByProperties.push(property);
    }
    this._updateSortByMenu();
    this.loadNodeContents();
  };
  // }}}
  
  // {{{ updateTrashStatus
  /**
   * updates the trash icon image
   * @return void
   */
  this.updateTrashStatus = function() {
    var full = Core_BrowserManager.BASE_NODES && Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH] && Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].numChildren > 0;
    full ? this.win.enableMenuItem('bw_emptyTrash') : this.win.disableMenuItem('bw_emptyTrash');
    var img = document.getElementById(this.win.getDivId() + 'SbTrashImg');
    if (img && Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH]) {
      img.src = Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].getIcon(16);
    }
    if (!this._skipReloadTrash) {
      this.reloadSelectedNode(Core_BrowserManager.BASE_NODES ? Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id : null);
    }
  };
  // }}}
  
  // {{{ viewIcons
	/**
	 * view items using icons
   * @access  public
	 * @return void
	 */
  this.viewIcons = function() {
    this._enableViewByIcon(false);
    this.displayNodesIcons();
  };
  // }}}
  
  // {{{ viewList
	/**
	 * view items using a list
   * @access  public
	 * @return void
	 */
  this.viewList = function() {
    this._enableViewByIcon(true);
    this.displayNodesList();
  };
  // }}}
  
  
  // private methods
  
	// {{{ _enableBack
	/**
	 * enables or disables the back function
   * @param boolean enabled whether or not the back function should be enabled
   * @access  public
	 * @return void
	 */
  this._enableBack = function(enabled) {
    enabled ? this.win.enableButton('bw_btn_back') : this.win.disableButton('bw_btn_back');
    enabled ? this.win.enableMenuItem('bw_back') : this.win.disableMenuItem('bw_back');
    this._backEnabled = enabled;
  };
  // }}}
  
  // {{{ _enableFolderSelectionControls
	/**
	 * enables/disables the controls relevant to the current selected folder in 
   * the navigation panel
   * @param boolean enabled whether to enable or disable the controls
   * @access  public
	 * @return void
	 */
  this._enableFolderSelectionControls = function(enabled) {
    var writeAccess = this._selectedNodeRef && this._selectedNodeRef.hasAccess(Core_Vfs.PERMISSIONS_WRITE);
    enabled && writeAccess ? this.win.enableMenuItem('bw_upload') : this.win.disableMenuItem('bw_upload');
    enabled && writeAccess ? this.win.enableMenuItem('bw_newfolder') : this.win.disableMenuItem('bw_newfolder');
    enabled && writeAccess ? this.win.enableMenuItem('bw_newlink') : this.win.disableMenuItem('bw_newlink');
    enabled && writeAccess ? this.win.enableButton('bw_btn_upload') : this.win.disableButton('bw_btn_upload');
    enabled && this._selectedNodeRef && this._selectedNodeRef.canRemoveFromSidebar() ? this.win.enableMenuItem('bw_removeFromCommonPlaces') : this.win.disableMenuItem('bw_removeFromCommonPlaces');
  };
  // }}}
  
	// {{{ _enableFwd
	/**
	 * enables or disables the forward function
   * @param boolean enabled whether or not the fwd function should be enabled
   * @access  public
	 * @return void
	 */
  this._enableFwd = function(enabled) {
    enabled ? this.win.enableButton('bw_btn_fwd') : this.win.disableButton('bw_btn_fwd');
    enabled ? this.win.enableMenuItem('bw_fwd') : this.win.disableMenuItem('bw_fwd');
    this._fwdEnabled = enabled;
  };
  // }}}
  
  // {{{ _enableNodeSelectionControls
	/**
	 * enables/disables the controls relevant to the current selected node in the 
   * content panel
   * @param boolean enabled whether to enable or disable the controls
   * @access  public
	 * @return void
	 */
  this._enableNodeSelectionControls = function(enabled) {
    var readAccess = this._highlightedNode && this._highlightedNode.hasAccess(Core_Vfs.PERMISSIONS_READ);
    var writeAccess = this._highlightedNode && this._highlightedNode.hasAccess(Core_Vfs.PERMISSIONS_WRITE);
    var entity = this._highlightedNode ? this._highlightedNode.getEntity() : null;
    enabled && writeAccess && this._highlightedNode.isFile() ? this.win.enableMenuItem('bw_reupload') : this.win.disableMenuItem('bw_reupload');
    enabled && readAccess ? this.win.enableMenuItem('bw_open') : this.win.disableMenuItem('bw_open');
    var canDelete = enabled && this._highlightedNode.canMove() && this._selectedNode != Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id;
    canDelete ? this.win.enableMenuItem('bw_delete') : this.win.disableMenuItem('bw_delete');
    canDelete ? this.win.enableButton('bw_btn_delete') : this.win.disableButton('bw_btn_delete');
    enabled && writeAccess && !this._highlightedNode.isSystemNode() && (!entity || entity.isCanRename()) ? this.win.enableMenuItem('bw_rename') : this.win.disableMenuItem('bw_rename');
    enabled && readAccess ? this.win.enableMenuItem('bw_properties') : this.win.disableMenuItem('bw_properties');
    enabled && writeAccess && this._highlightedNode && this._highlightedNode.isFolder() && !Core_BrowserManager.SIDEBAR_NODES[this._highlightedNode.id] ? this.win.enableMenuItem('bw_addToCommonPlaces') : this.win.disableMenuItem('bw_addToCommonPlaces');
    enabled && this._highlightedNode.canCopy() ? this.win.enableMenuItem('bw_copyToFolder') : this.win.disableMenuItem('bw_copyToFolder');
    enabled && this._highlightedNode.canMove() ? this.win.enableMenuItem('bw_moveToFolder') : this.win.disableMenuItem('bw_moveToFolder');
  };
  // }}}
  
  // {{{ _enableViewByIcon
	/**
	 * enable the buttons and menu items to allow viewing by icons
   * @param boolean enabled whether or not the view icons links should be 
   * enabled
   * @access  public
	 * @return void
	 */
  this._enableViewByIcon = function(enabled) {
    if (!enabled) {
      this.win.disableButton('bw_btn_viewicons');
      this.win.enableButton('bw_btn_viewlist');
      this.win.disableMenuItem('bw_viewicons');
      this.win.enableMenuItem('bw_viewlist');
      this.win.disableMenuItem('bw_columns');
      OS.setMenuItemChecked("bw_viewlist", false);
      OS.setMenuItemChecked("bw_viewicons", true);
    }
    else {
      this.win.disableButton('bw_btn_viewlist');
      this.win.enableButton('bw_btn_viewicons');
      this.win.disableMenuItem('bw_viewlist');
      this.win.enableMenuItem('bw_viewicons');
      this.win.enableMenuItem('bw_columns');
      OS.setMenuItemChecked("bw_viewlist", true);
      OS.setMenuItemChecked("bw_viewicons", false);
    }
    this._viewByIconEnabled = enabled;
  };
  // }}}
  
  // {{{ _loadBrowser
  /**
   * handles the response of an ajax request to load the sidebar
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._loadBrowser = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncStep();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.terminateAppInstance(this.win.getAppInstance());
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToLoadBrowser"), response);
    }
    else {
      if (this._initSelectNodeId) { this.selectNode(); }
    }
  };
  // }}}
  
  // {{{ _loadSidebar
  /**
   * handles the response of an ajax request to load the sidebar
   * @param Object response the ajax response
   * @param boolean propagated whether or not this invocation was propagated 
   * from another browser instance
   * @access  public
	 * @return void
	 */
  this._loadSidebar = function(response, propagated) {
    if (this.win.isClosed()) { return; }
    
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.terminateAppInstance(this.win.getAppInstance());
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToLoadSidebar"), response);
    }
    else {
      if (!propagated) {
        if (this._initSelectNodeId) { this.selectNode(); }
        Core_BrowserManager.SIDEBAR_NODES = new Array();
        for(var i=0; i<response.results.length; i++) {
          var node = Core_VfsNode.newInstanceFromEntity(response.results[i]);
          Core_BrowserManager.SIDEBAR_NODES[node.id] = node;
        }
        this._propagateResponse('_loadSidebar', response); 
      }
      this.populateSidebar();
    }
  };
  // }}}
  
  // {{{ _moveComplete
  /**
   * handles the response of an ajax request to move nodes
   * @param Object response the ajax response
   * @param boolean propagated whether or not this invocation was propagated 
   * from another browser instance
   * @access  public
	 * @return void
	 */
  this._moveComplete = function(response, propagated) {
    if (this.win.isClosed()) { return; }
    
    this.refreshTitleAndStatus();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToMoveNode"), response);
    }
    else if (SRAOS_Util.isString(response.results)) {
      OS.displayErrorMessage(response.results);
    }
    else {
      this.reloadSelectedNode(response.requestId);
      if (!propagated) { 
        if (Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH]) {
          var reloadTrash = false;
          var reloadSidebar = false;
          if (Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id == response.requestId) {
            reloadTrash = true;
          }
          else {
            for(var i in response.results) {
              if (response.results[i].parent.nodeId == Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH].id) {
                reloadTrash = true;
              }
              if (Core_BrowserManager.SIDEBAR_NODES[response.results[i].nodeId]) {
                Core_BrowserManager.SIDEBAR_NODES[response.results[i].nodeId] = Core_VfsNode.newInstanceFromEntity(response.results[i]);
                reloadSidebar = true;
              }
            }
          }
          if (reloadTrash) { this.reloadTrashNode(); }
          if (reloadSidebar) { this.populateSidebar(); }
        }
        this._propagateResponse('_moveComplete', response); 
      }
    }
  };
  // }}}
  
  // {{{ _newFolder
  /**
   * handles the response of an ajax request for a new folder to be created
   * @param Object response the ajax response
   * @param boolean propagated whether or not this invocation was propagated 
   * from another browser instance
   * @access  public
	 * @return void
	 */
  this._newFolder = function(response, propagated) {
    if (this.win.isClosed()) { return; }
    
    this.refreshTitleAndStatus();
    // could not create folder
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || response.results.length != 1) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToCreateFolder"), response);
    }
    else {
      this.reloadSelectedNode(response.requestId);
      if (!propagated) { this._propagateResponse('_newFolder', response); }
    }
  };
  // }}}
  
  // {{{ _propagateResponse
  /**
   * propagates an ajax response to all instances of the browser application
   * @param String method the name of the method to propagate invocation of
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._propagateResponse = function(method, response) {
    var apps = OS.getApplications();
    for(var i in apps) {
      if (apps[i].getPid() != this.win.getAppInstance().getPid() && apps[i].getApplication().getPluginId() == 'core' && apps[i].getApplication().getId() == 'BrowserApp' && apps[i].getPrimaryWindow()) {
        var manager = apps[i].getPrimaryWindow().getManager();
        manager[method](response, true);
      }
    }
  };
  // }}}
  
  // {{{ _reloadTrashNode
  /**
   * reloads the trash node
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._reloadTrashNode = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || !response.results) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToLoadTrashNode"), response);
    }
    else {
      Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH] = Core_VfsNode.newInstanceFromEntity(response.results);
      OS.updateTrashIcon();
    }
  };
  // }}}
  
  // {{{ _rename
  /**
   * handles the response of an ajax request for a node to be renamed
   * @param Object response the ajax response
   * @param boolean propagated whether or not this invocation was propagated 
   * from another browser instance
   * @access  public
	 * @return void
	 */
  this._rename = function(response, propagated) {
    if (this.win.isClosed()) { return; }
    
    this.refreshTitleAndStatus();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || response.results.length != 1) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToRenameObject"), response);
    }
    else {
      this.reloadSelectedNode(response.requestId);
      if (!propagated) { this._propagateResponse('_rename', response); }
    }
  };
  // }}}
  
  // {{{ _setActiveNode
  /**
   * sets the active node
   * @param Core_VfsNode node the node object
   * @access  public
	 * @return void
	 */
  this._setActiveNode = function(node) {
    if (this.win.isClosed()) { return; }
    
    this._selectedNodeRef = node;
    this.refreshTitleAndStatus();
    this._enableFolderSelectionControls(true);
  };
  // }}}
  
	// {{{ _updateColumnsMenu
	/**
	 * updates the "Columns" menu
   * @access  public
	 * @return void
	 */
  this._updateColumnsMenu = function() {
    for(i in Core_BrowserManager.COLUMNS) {
      var property = Core_BrowserManager.COLUMNS[i];
      if (property == "name") { continue; }
      OS.setMenuItemChecked("bw_columns_" + property, SRAOS_Util.inArray(property, this._displayProperties));
    }
  };
  // }}}
  
  
  // {{{ _updateCommonPlaces
  /**
   * handles the response of an ajax request for a node to be added to or 
   * removed from the user's common places
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._updateCommonPlaces = function(response) {
    this.refreshTitleAndStatus();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS || response.results.length != 1) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToUpdateCommonPlaces"), response);
    }
    else {
      this._enableNodeSelectionControls(this._highlightedNode ? true : false);
      this.loadSidebar();
    }
  };
  // }}}
  
	// {{{ _updateHistory
	/**
	 * udpates the history based on selection of the nodeId specified
   * @param int nodeId the node that was selected
   * @access  public
	 * @return void
	 */
  this._updateHistory = function(nodeId) {
    if (!this._skipHistory) {
      this._position++;
      this._history[this._position] = nodeId;
      this._historyLength = this._position + 1;
      this._enableBack(this._position != 0);
      this._enableFwd(false);
    }
  };
  // }}}
  
	// {{{ _updateSortByMenu
	/**
	 * updates the "Sort by" menu
   * @access  public
	 * @return void
	 */
  this._updateSortByMenu = function() {
    for(i in Core_BrowserManager.COLUMNS) {
      var property = Core_BrowserManager.COLUMNS[i];
      OS.setMenuItemChecked("bw_sort_" + property, this._sortBy[property] != 0);
    }
  };
  // }}}
  
};

// static methods and attributes

/**
 * keeps track of any canvas areas currently displaying nodes. this is a hash 
 * where the key is the canvas xhtml id and the value is another hash containing 
 * the following keys:
 *  parent: the id of the node whose contents are being displayed
 *  size:   the icon size
 *  style:  the display style
 *  nodes:  the nodes (Core_VfsNode[]) currently displayed
 * @type Object
 */
Core_BrowserManager._nodeContainers = new Array();


// {{{ displayFile
/**
 * displays a file
 * @param Object file the file to display
 * @access public
 * @return void
 */
Core_BrowserManager.displayFile = function(file) {
  if (file.nodeId || file.entityId) {
    OS.print("core_displayFile", null, [ new SRAOS_AjaxServiceParam("node", file.entityId ? file.entityId : file.nodeId) ]);
  }
};
// }}}


// {{{ displayNodes
/**
 * used to render the nodes within an existing xhtml area such as a div
 * @param String canvasId the xhtml id of the div or other element within 
 * which the nodes should be rendered. all innerHTML contents in this container 
 * will be replaced upon completion of the rendering
 * @param int parent the id of the node whose children should be rendered within 
 * the canvas
 * @param int size the size of icons to use (for the
 * Core_BrowserManager.DISPLAY_NODES_STYLE_ICONS display style only)
 * @param int style the rendering style to use. this value must correspond with 
 * one of the Core_BrowserManager.DISPLAY_NODES_STYLE_* constants
 * @access public
 * @return void
 */
Core_BrowserManager.displayNodes = function(canvasId, parent, size, style) {
  style = style ? style : Core_BrowserManager.DISPLAY_NODES_STYLE_ICONS;
  size = style == Core_BrowserManager.DISPLAY_NODES_STYLE_LIST ? 16 : (size ? size : (style == Core_BrowserManager.DISPLAY_NODES_STYLE_ICONS ? 32 : 16));
  
  var canvas = document.getElementById(canvasId);
  if (canvas && SRAOS_Util.isNumeric(parent) && (size == 16 || size == 32 || size == 64) && (style==Core_BrowserManager.DISPLAY_NODES_STYLE_ICONS || style==Core_BrowserManager.DISPLAY_NODES_STYLE_LIST)) {
    Core_BrowserManager._nodeContainers[canvasId] = { "parent": parent, "size": size, "style": style };
    var manager = Core_BrowserManager._getManager(canvasId);
    
    // see if nodes already have been retrieved
    Core_BrowserManager._nodeContainers[canvasId].nodes = Core_BrowserManager._getExistingNodes(parent, manager);
    if (Core_BrowserManager._nodeContainers[canvasId].nodes !== null) {
      Core_BrowserManager._renderNodes(canvasId);
    }
    else {
      Core_BrowserManager._nodeContainers[canvasId].nodes = new Array();
      var constraints = new Array(new SRAOS_AjaxConstraint('parent', parent));
      if (manager) {
        manager.win.setStatusBarText(OS.getPlugin('core').getString("Browser.text.loadingFolderContents"));
        for(var i=0; i<manager._sortByProperties.length; i++) {
          constraints.push(new SRAOS_AjaxConstraint(manager._sortByProperties[i], null, manager._sortBy[manager._sortByProperties[i]]));
        }
      }
      OS.ajaxInvokeService('core_manageVfsNodes', null, 'Core_BrowserManager._displayNodes', constraints, null, null, canvasId);
    }
  }
};
// }}}


// {{{ move
/**
 * moves node into dest
 * @param Core_VfsNode node the node to move
 * @param Core_VfsNode dest the destination folder
 * @access public
 * @return void
 */
Core_BrowserManager.move = function(node, dest) {
  if (node.parent.nodeId != dest.id && node.id != dest.id) {
    OS.ajaxInvokeService('core_moveNodes', null, 'Core_BrowserManager._moveComplete', null, null, [ new SRAOS_AjaxServiceParam('node', node.id), new SRAOS_AjaxServiceParam('dest', dest.id) ], node.parent.nodeId);
  }
  else if (node.id == dest.id) {
    OS.displayErrorMessage(OS.getPlugin('core').getString("Browser.error.nodeCannotBeParentToItself"));
  }
};
// }}}


// {{{ _displayNodes
/**
 * handes the ajax response generated by Core_BrowserManager.displayNodes
 * @param Object response the ajax invocation results
 * @access private
 * @return void
 */
Core_BrowserManager._displayNodes = function(response) {
  var manager = Core_BrowserManager._getManager(response.requestId);
  if (manager) { manager.refreshTitleAndStatus(); }
  
  if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
    Core_BrowserManager._nodeContainers = SRAOS_Util.removeFromArray(Core_BrowserManager._nodeContainers[response.requestId], Core_BrowserManager._nodeContainers);
    OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToDisplayNodes"), response);
  }
  else if (Core_BrowserManager._nodeContainers[response.requestId]) {
    var rec = Core_BrowserManager._nodeContainers[response.requestId];
    if (document.getElementById(response.requestId)) {
      var nodes = new Array();
      for(var i=0; i<response.results.length; i++) {
//        var nodes.push(Core_VfsNode.newInstanceFromEntity(response.results[i]));
      }
      Core_BrowserManager._refreshNodes(rec.parent, nodes, manager);
    }
    else {
      Core_BrowserManager._nodeContainers = SRAOS_Util.removeFromArray(rec, Core_BrowserManager._nodeContainers);
    }
  }
};
// }}}


// {{{ _moveComplete
/**
 * handes the ajax response generated by Core_BrowserManager.move
 * @param Object response the ajax invocation results
 * @access private
 * @return void
 */
Core_BrowserManager._moveComplete = function(response) {
  if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
    OS.displayErrorMessage(this.win.getPlugin().getString("Browser.error.unableToMoveNode"), response);
  }
  else if (SRAOS_Util.isString(response.results)) {
    OS.displayErrorMessage(response.results);
  }
  else {
    var node = response.results[0];
    var trash = Core_BrowserManager.BASE_NODES[Core_Vfs.FOLDER_TRASH];
    var updateSidebar = false;
    if (node.parent.nodeId == trash.id) {
      trash.numChildren++;
      OS.updateTrashIcon();
    }
    else if (response.requestId == trash.id) {
      trash.numChildren--;
      OS.updateTrashIcon();
    }
    if (Core_BrowserManager.SIDEBAR_NODES[node.nodeId]) {
      updateSidebar = true;
      Core_BrowserManager.SIDEBAR_NODES[node.nodeId] = Core_VfsNode.newInstanceFromEntity(node);
    }
    
    // update browser apps
    var apps = OS.getApplications();
    for(var i in apps) {
      if (apps[i].getApplication().getPluginId() == 'core' && apps[i].getApplication().getId() == 'BrowserApp' && apps[i].getPrimaryWindow()) {
        var manager = apps[i].getPrimaryWindow().getManager();
        if (manager._selectedNode == response.requestId || manager._selectedNode == node.parent.nodeId) {
          manager.reloadSelectedNode();
        }
        if (updateSidebar) {
          manager.populateSidebar();
        }
      }
    }
  }
};
// }}}


// {{{ _refreshNodes
/**
 * refreshes any containers displaying the nodes of parent
 * @param int parent the id of the node to refresh
 * @param Core_VfsNode[] nodes the new nodes to display
 * @param Core_BrowserManager manager the manager from where these nodes were 
 * derived (if applicable)
 * @access private
 * @return void
 */
/*
Core_BrowserManager._refreshNodes(parent, nodes, manager) {
  for(var i in Core_BrowserManager._nodeContainers) {
    if (document.getElementById(i) && Core_BrowserManager._nodeContainers[i].parent == rec.parent) {
      var windowInstance = OS.getWindowInstance(i);
      // refresh nodes in browser window
      if (windowInstance && windowInstance.getManager() && windowInstance.getManager().displayNodesIcons) {
        windowInstance.getManager()._displayedNodes = nodes;
        windowInstance.getManager().refreshDisplay();
      }
      else {
        // display nodes in custom canvas
        // TODO
      }
    }
    else if (!document.getElementById(i)) {
      Core_BrowserManager._nodeContainers = SRAOS_Util.removeFromArray(Core_BrowserManager._nodeContainers[i], Core_BrowserManager._nodeContainers);
    }
  }
};
// }}}
*/

// constants
/**
 * permantently stores a reference to the user's base nodes. this value is 
 * initialized only once the first time a browser application is launched. this 
 * value will be a hash where the key is the node type: 
 * Core_Vfs.FOLDER_DESKTOP, Core_Vfs.FOLDER_HOME, or 
 * Core_Vfs.FOLDER_TRASH
 * @type Core_VfsNode[]
 */
Core_BrowserManager.BASE_NODES;

/**
 * maintains a single reference to the user's sidebar nodes. these are loaded 
 * with the first instance of the browser application
 * @type Core_VfsNode[]
 */
Core_BrowserManager.SIDEBAR_NODES;

/**
 * specifies the possible columns and their designated order for sorting and 
 * designating which properties should be displayed in list view
 * @type String[]
 */
Core_BrowserManager.COLUMNS = [ "name", "dateCreated", "dateModified", "nodeOwner", "nodeGroup", "permissions", "size", "type", "parent" ];

/**
 * the icon height when displaying in icon view
 * @type int
 */
Core_BrowserManager.ICON_HEIGHT = 80;

/**
 * the top/left padding to apply when displaying icons
 * @type int
 */
Core_BrowserManager.ICON_PADDING = 5;

/**
 * the icon width when displaying in icon view
 * @type int
 */
Core_BrowserManager.ICON_WIDTH = 80;

/**
 * the image to display when a column is sorted in ascending order
 * @type String
 */
Core_BrowserManager.IMG_SORT_ASC = "sort-asc.gif";

/**
 * the image to display when a column is sorted in descending order
 * @type String
 */
Core_BrowserManager.IMG_SORT_DESC = "sort-desc.gif";

/**
 * identifies the type order to use when rendering the sidebar
 * @type Array
 */
Core_BrowserManager.SIDEBAR_TYPE_ORDER;

// }}}
