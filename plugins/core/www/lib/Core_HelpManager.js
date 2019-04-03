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
 * manages the HelpManual window in the core plugin. this window can be invoked 
 * with the following parameters:
 *   plugin  the name of the plugin containing library
 *   library the top-level help-topic identifying the library to load
 *   topic   an optional topic to load in library (a nested help-topic element 
 *           in library)
 */
Core_HelpManager = function() {
  /**
   * whether or not the back function is enabled
   * @type boolean
   */
  this._backEnabled = false;
  
  /**
   * the div containing the content
   * @type Object
   */
  this._divContent;
  
  /**
   * the div containing the topics list
   * @type Object
   */
  this._divTopics;
  
  /**
   * whether or not the forward function is enabled
   * @type boolean
   */
  this._fwdEnabled = false;
  
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
   * the library that is currently active
   * @type SRAOS_HelpTopic
   */
  this._library;
  
  /**
   * whether or not the print function is enabled
   * @type boolean
   */
  this._printEnabled = false;
  
  /**
   * tracks the user's current position relative to _history
   * @type int
   */
  this._position = -1;
  
  /**
   * the current selected topic
   * @type SRAOS_HelpTopic
   */
  this._selectedTopic;
  
  /**
   * whether or not the node selection event should ignore history changes
   * @type boolean
   */
  this._skipHistory = false;
  
  /**
   * a reference to the navigation tree for this instance of the help manager
   * @type SRAOS_Tree
   */
  this._tree;
	
  // {{{ back
	/**
	 * selects the previous help topic
   * @access  public
	 * @return void
	 */
  this.back = function() {
    if (this._position > 0) {
      this._skipHistory = true;
      this._position--;
      this._tree.selectNode(this._history[this._position]);
      this._enableBack(this._position != 0);
      this._enableFwd(true);
      this._skipHistory = false;
    }
    else {
      this._enableBack(false);
    }
  };
  // }}}
  
  // {{{ displayArticle
  /**
   * displays the article specified
   * @param String topic the id of the article to display
   * @access  public
	 * @return void
	 */
  this.displayArticle = function(topic) {
    this._tree.selectNode(topic);
  };
  // }}}
  
  // {{{ getState
  /**
   * this method is called when the state of it's corresponding app instance 
   * is being saved. manager implementations may use it to save additional state 
   * information that will later be passed to the init method below when the 
   * app is restored. the return value should be an associative array of key
   * value initialization variables
   * @access  public
	 * @return Array
	 */
	this.getState = function() {
		var state = null;
    if (this._library) {
      state = { "backEnabled": this._backEnabled, "fwdEnabled": this._fwdEnabled, "printEnabled": this._printEnabled, "plugin": this._library.getPluginId(), "library": this._library.getId(), "selectedNode": (this._selectedTopic ? this._selectedTopic.getId() : null), "position": this._position, "skipHistory": this._skipHistory, "historyLength": this._historyLength, "history": this._history };
    }
    return state;
	};
	// }}}
  
	// {{{ loadLibrary
	/**
	 * loads the library specified
   * @param SRAOS_HelpTopic library the library to load
   * @param String subTopic an optional topic in the library specified to 
   * immediately open to. if not specified, the first topic will be displayed
   * @access  public
	 * @return void
	 */
	this.loadLibrary = function(library, topic) {
    this._library = library;
    this._initTree(topic);
  };
	// }}}
  
  // {{{ forward
	/**
	 * selects the next help topic
   * @access  public
	 * @return void
	 */
  this.forward = function() {
    if (this._position < this._historyLength) {
      this._skipHistory = true;
      this._position++;
      this._tree.selectNode(this._history[this._position]);
      this._enableBack(true);
      this._enableFwd((this._position + 1) < this._historyLength);
      this._skipHistory = false;
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
    
		if (params && params.plugin && params.library) {
      this._library = OS.getPlugin(params.plugin).getHelpTopic(params.library);
      if (params.skipHistory) this._skipHistory = params.skipHistory;
      if (params.position) this._position = params.position;
      if (params.historyLength) this._historyLength = params.historyLength;
      if (params.history) this._history = params.history;
      if (params.selectedNode || params.topic) this._selectedNode = params.selectedNode ? params.selectedNode : params.topic;
      if (params.backEnabled) this._backEnabled = params.backEnabled;
      if (params.fwdEnabled) this._fwdEnabled = params.fwdEnabled;
      if (params.printEnabled) this._printEnabled = params.printEnabled;
      this._restored = true;
    }
    else if (params && params.library) {
      this._library = params.library;
      this._selectedNode = params.subTopic;
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
		this._enableBack(this._backEnabled);
    this._enableFwd(this._fwdEnabled);
    this._enablePrint(this._printEnabled);
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
    this._divContent = document.getElementById(this.win.getDivId() + "content");
    this._divTopics = document.getElementById(this.win.getDivId() + "topics");
    var divider = document.getElementById(this.win.getDivId() + "divider");
    this._divContent.style.width = (width - 166) + "px";
    this._divContent.style.height = (height - 10) + "px";
    this._divTopics.style.width = "150px";
    this._divTopics.style.height = (height - 3) + "px";
    new SRAOS_Divider(divider, document.getElementById(this.win.getDivId()), 100, 300, false, new Array(this._divTopics), new Array(this._divContent), 1, 5);
    
    if (this._library) {
      if (this._restored) {
        this._initTree(-1);
        if (this._selectedNode) {
          var baseSkipHistory = this._skipHistory;
          this._skipHistory = true;
          this._selectedTopic = this._tree.selectNode(this._selectedNode);
          this._skipHistory = baseSkipHistory;
        }
      }
      else {
        this._initTree(this._selectedNode);
      }
    }
    
		return true;
	};
	// }}}
  
  // {{{ print
	/**
	 * loads a new window with a print formatted view of the selected topic
   * @access  public
	 * @return void
	 */
  this.print = function() {
    if (this._selectedTopic) {
      OS.print("core_printHelp", null, [ new SRAOS_AjaxServiceParam("plugin", this._selectedTopic.getPluginId()), new SRAOS_AjaxServiceParam("topic", this._selectedTopic.getId()) ]);
    }
  };
  // }}}
  
  
  // {{{ SRAOS_Tree Manager methods
	// {{{ treeNodeSelected
	/**
	 * invoked when a user clicks on the label for a given node. if this method 
   * returns true, that node will change to a selected (highlighted) state
   * @param SRAOS_Tree tree the tree that the node has been selected in
   * @param SRAOS_TreeNode node the node that was selected
   * @param boolean leaf whether or not node is a leaf
   * @access  public
	 * @return boolean
	 */
  this.treeNodeSelected = function(tree, node, leaf) {
    this._updateHistory(node);
    if (node.isHasContent()) {
      this._selectedTopic = node;
      this._enablePrint(true);
      this.win.setStatusBarText(this.win.getPlugin().getString("HelpManualHelp.text.loadingTopic"));
      this._divContent.innerHTML = "<h1>" + node.getLabel() + "</h1>" + this.win.getPlugin().getString("HelpManualHelp.text.loadingTopic");
      OS.ajaxInvokeService("core_getHelp", this, "_displayArticle", null, null, [ new SRAOS_AjaxServiceParam("plugin", node.getPluginId()), new SRAOS_AjaxServiceParam("topic", node.getId()) ], node.getId());
    }
    return node.isHasContent();
  };
  // }}}
  
	// {{{ treeNodeUnselected
	/**
	 * invoked when a user clicks on the label for a given node that is already 
   * selected. if this method returns true, that node will change to an 
   * unselected (unhighlighted) state
   * @param SRAOS_Tree tree the tree that the node has been unselected in
   * @param SRAOS_TreeNode node the node that was selected
   * @param boolean leaf whether or not node is a leaf
   * @access  public
	 * @return boolean
	 */
  this.treeNodeUnselected = function(tree, node, leaf) {
    this._updateHistory(node);
    if (node.isHasContent()) {
      this._selectedTopic = null;
      this._enablePrint(false);
      this.win.clearStatusBarText();
      this._divContent.innerHTML = "";
    }
    return node.isHasContent();
  };
  // }}}
  // }}}
  
  
  // private methods
  // {{{ _displayArticle
  /**
   * handles the response of an ajax request to retrieve new mail
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._displayArticle = function(response) {
    this.win.clearStatusBarText();
    if (this._selectedTopic) { this._divContent.innerHTML = "<h1>" + this._selectedTopic.getLabel() + "</h1>"; }
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("HelpManualHelp.error.unableToRetrieveArticle"), response);
    }
    else if (this._selectedTopic && this._selectedTopic.getId() == response.requestId) {
      for(var attr in OS.user) {
        response.results = response.results.replace(new RegExp("#" + attr, "gim"), OS.user[attr]);
      }
      response.results = response.results.replace(new RegExp("#appName", "gim"), OS.getAppName());
      response.results = response.results.replace(new RegExp("#appShortName", "gim"), OS.getAppShortName());
      this._divContent.innerHTML += response.results;
      this.win.setStatusBarText(this.win.getPlugin().getString("HelpManualHelp.text.displayingHelpTopic") + ' ' + this._selectedTopic.getLabel());
    }
  };
  // }}}
  
	// {{{ _enableBack
	/**
	 * enables or disables the back function
   * @param boolean enabled whether or not the back function should be enabled
   * @access  public
	 * @return void
	 */
  this._enableBack = function(enabled) {
    enabled ? this.win.enableButton('hm_btn_back') : this.win.disableButton('hm_btn_back');
    enabled ? this.win.enableMenuItem('hm_back') : this.win.disableMenuItem('hm_back');
    this._backEnabled = enabled;
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
    enabled ? this.win.enableButton('hm_btn_fwd') : this.win.disableButton('hm_btn_fwd');
    enabled ? this.win.enableMenuItem('hm_fwd') : this.win.disableMenuItem('hm_fwd');
    this._fwdEnabled = enabled;
  };
  // }}}
  
	// {{{ _enablePrint
	/**
	 * enables or disables the print function
   * @param boolean enabled whether or not the print function should be enabled
   * @access  public
	 * @return void
	 */
  this._enablePrint = function(enabled) {
    enabled ? this.win.enableButton('hm_btn_print') : this.win.disableButton('hm_btn_print');
    enabled ? this.win.enableMenuItem('hm_print') : this.win.disableMenuItem('hm_print');
    this._printEnabled = enabled;
  };
  // }}}
  
	// {{{ _initTree
	/**
	 * initializes this help application instance
   * @param String topic the initial topic to select. set to -1 to not load any 
   * node
   * @access  public
	 * @return void
	 */
  this._initTree = function(topic) {
    this.win.setTitleText(this._library.getLabel());
    this._tree = new SRAOS_Tree(this._library.getPluginId(), this._divTopics, this._library.getHelpTopics(), this.win.getDivId(), this, this.win.getWindow());
    this._tree.render();
    if (topic != -1) {
      this._tree.selectNode(topic ? topic : this._library.getHelpTopics()[0].getId());
    }
  };
  // }}}
  
	// {{{ _updateHistory
	/**
	 * udpates the history based on selection of the node specified
   * @param SRAOS_TreeNode node the node that was selected
   * @access  public
	 * @return void
	 */
  this._updateHistory = function(node) {
    if (node.isHasContent() && !this._skipHistory) {
      this._position++;
      this._history[this._position] = node.getId();
      this._historyLength = this._position + 1;
      this._enableBack(this._position != 0);
      this._enableFwd(false);
    }
  };
  // }}}
};


// {{{ load
/**
 * opens a new help manager window and loads the plugin, library and topic 
 * specified
 * @param String plugin the name of the plugin containing library
 * @param String library the top-level help-topic identifying the library to 
 * load
 * @param String topic an optional topic to load in library (a nested help-topic 
 * element in library)
 * @access  public
 * @return Core_HelpManager
 */
Core_HelpManager.load = function(plugin, library, topic) {
  return OS.launchApplication('core', 'HelpManual', { plugin: plugin, library: library, topic: topic }).getFocusedWindow().getManager();
};
// }}}

// }}}

