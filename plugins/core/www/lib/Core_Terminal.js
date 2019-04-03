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
 * manages the terminal application in the core plugin
 */
Core_Terminal = function(hidden) {
  
  /**
   * the current environment aliases
   * @type Array
   */
  this._aliases = new Array();
  if (OS.user.coreTermAliases) {
    for(var i in OS.user.coreTermAliases) {
      this._aliases[OS.user.coreTermAliases[i].alias] = OS.user.coreTermAliases[i].value;
    }
  }

  /**
   * a reference to the window canvas area for this terminal instance
   * @type Object
   */
  this._canvas;
  
  /**
   * a reference to the input control field where the user's commands and 
   * program output are entered
   * @type Object
   */
  this._ctrlField;
  
  /**
   * used to cover the control field horzontal borders in Safari because border 
   * manipulation is not supported via css in that browser. this array will 
   * reference 2 divs with a white background that will be positioned on top of 
   * the input field borders
   * @type Array
   */
  this._ctrlFieldBorderHorz;
  
  /**
   * used to cover the control vertical field borders in Safari because border 
   * manipulation is not supported via css in that browser. this array will 
   * reference 2 divs with a white background that will be positioned on top of 
   * the input field borders
   * @type Array
   */
  this._ctrlFieldBorderVert;
  
  /**
   * keeps track of the current control field input value
   * @type String
   */
  this._currentVal;
  
  /**
   * the current environment variables
   * @type Array
   */
  this._env = new Array();
  if (OS.user.coreTermEnv) {
    for(var i in OS.user.coreTermEnv) {
      this._env[OS.user.coreTermEnv[i].name] = OS.user.coreTermEnv[i].value;
    }
  }
  
  /**
   * whether or not this terminal instance is hidden (not associated with a 
   * Terminal window
   * @type boolean
   */
  this._hidden = hidden;
  
  /**
   * stores the user's input history
   * @type Array
   */
  OS.user.coreTermHistory = OS.user.coreTermHistory ? OS.user.coreTermHistory : new Array();
  this._history = OS.user.coreTermHistory;
  
  /**
   * the current history position
   * @type int
   */
  this._historyPtr = this._history.length ? this._history.length : 0;
  
  /**
   * the unique polling identifier for this Core_Terminal instance
   * @type int
   */
  this._tmpId = Core_Terminal._tmpPollingId++;
  
  /**
   * whether or not the browser is safari
   * @type boolean
   */
  this._isSafari;
  
  /**
   * the node representing the current vfs location of the terminal instance
   * @type Core_VfsNode
   */
  this._node = OS.user.homeDir;
  
  /**
   * a reference to the core plugin
   * @type SRAOS_Plugin
   */
  this._plugin = OS.getPlugin('core');
  
  /**
   * a reference to the _pollWait timer
   * @type int
   */
  this._pollWaitTimer;
  
  /**
   * the applications currenting running in this terminal instance
   * @type SRAOS_ApplicationManager[]
   */
  this._running = new Array();
  
  /**
   * a reference to the terminal output div
   * @type Object
   */
  this._terminal;
  
  /**
   * the terminal/user file-creation mask
   * @type int
   */
  this._umask = OS.user.umask;
  
  
	// {{{ addAlias
	/**
	 * creates a command alias. aliases have first priority when evaluating an 
   * exec string
   * @param String alias the command to alias
   * @param String value the exec string to alias to
   * @param boolean commit whether or not to commit this change globally 
   * including to the server
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return Array
	 */
  this.addAlias = function(alias, value, commit, share) {
    this._aliases[alias] = value;
    if (commit || share) {
      var found = false;
      for(var i in OS.user.coreTermAliases) {
        if (OS.user.coreTermAliases[i].alias == alias) {
          found = true;
          OS.user.coreTermAliases[i].value = value;
        }
      }
      if (!found) {
        OS.user.coreTermAliases.push({ "alias": alias, "value": value });
      }
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'alias'), new SRAOS_AjaxServiceParam('id', alias), new SRAOS_AjaxServiceParam('value', value));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_addTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToAddAlias');
    }
  };
  // }}}
  
  
  // {{{ addLeadString
	/**
	 * adds the lead string and rebuilds the terminal output if it is not already 
   * there
   * @param boolean force whether or not to force the new lead string output 
   * even if that is what is currently displayed
   * @access  public
	 * @return void
	 */
	this.addLeadString = function(force) {
    if (!this._hidden && this._running.length == 0) {
      var leadString = this.getLeadString();
      var leadStringHtml = this.getLeadStringHtml();
      if (force || (!SRAOS_Util.endsWith(this._terminal.innerHTML, leadStringHtml) && !SRAOS_Util.endsWith(this._terminal.innerHTML, leadString))) {
        this._terminal.innerHTML += (this.endsWithNewline() ? "" : "<br />") + leadString;
        this.rebuild();
      }
    }
	};
	// }}}
  
  
	// {{{ appendHistoryRecord
	/**
	 * appends a command to the user's history and saves it to the user's profile
   * on the server
   * @param String cmd the command to append
   * @access  public
	 * @return void
	 */
  this.appendHistoryRecord = function(cmd) {
    if ((this._history.length == 0 || cmd != this._history[this._history.length - 1].cmd) && cmd.indexOf('!') !== 0) {
      this._history.push({ "cmd": cmd });
      this._historyPtr = this._history.length;
      OS.ajaxInvokeService('core_updateUser', this, '_ajaxResponse', null, new SRAOS_AjaxRequestObj(OS.user.uid, { "coreTermHistory_0_cmd": cmd }), null, 'Terminal.error.unableToUpdateHistory');
      if (this._history.length > OS.user.coreTermHistoryBuffer) {
        this._history = this._history.slice(this._history.length - OS.user.coreTermHistoryBuffer);
      }
    }
  };
  // }}}
  
  
	// {{{ autoComplete
	/**
	 * displays node hints based on the current control field input
   * @param String cmd the current command string
   * @access  public
	 * @return void
	 */
  this.autoComplete = function(cmd) {
    if (!this._hidden) {
      // TODO
    }
  };
  // }}}
  
  
	// {{{ clearAliases
	/**
	 * clears this terminal's current aliases
   * @param boolean commit whether or not to commit this change globally 
   * including to the server
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.clearAliases = function(commit, share) {
    this._aliases = new Array();
    if (commit || share) {
      OS.user.coreTermAliases = new Array();
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'alias'));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_clearTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToClearAliases');
    }
  };
  // }}}
  
  
	// {{{ clearEnv
	/**
	 * clears this terminal's current environment variables
   * @param boolean commit whether or not to commit this change globally 
   * including to the server
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.clearEnv = function(commit, share) {
    this._env = new Array();
    if (commit || share) {
      OS.user.coreTermEnv = new Array();
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'env'));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_clearTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToClearEnv');
    }
  };
  // }}}
  
  
	// {{{ clearHistory
	/**
	 * clears the user's terminal buffer history both locally and on the server
   * @param boolean commit whether or not to commit this change globally 
   * including to the server
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.clearHistory = function(commit, share) {
    this._history = new Array();
    if (commit || share) {
      OS.user.coreTermHistory = new Array();
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'history'));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_clearTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToClearHistory');
    }
  };
  // }}}
  
  
  // {{{ convertPathsToAbsolute
  /**
   * converts relative paths to absolute values including the '~' home 
   * identifier, and the '..' descend 1 directory identifier.
   * @param String[] nodes the paths of the nodes to prefix. all nodes that do 
   * not begin with '/' will be prefixed
   * @return String[]
   */
  this.convertPathsToAbsolute = function(nodes) {
    var paths = new Array();
    for(var i in nodes) {
      paths[i] = nodes[i].indexOf('/') === 0 ? nodes[i] : (nodes[i].indexOf('~') === 0 ? OS.user.homeDir.getPathString(true) + (nodes[i] != '~' && nodes[i] != '~/' ? '/' + nodes[i].substring(nodes[i].indexOf('~/') === 0 ? 2 : 1) : '') : this._node.getPathString(true) + (this._node.getPathString(true) != '/' ? '/' : '') + nodes[i]);
    }
    for(var i in paths) {
      if (paths[i].indexOf('..') != -1 || paths[i].indexOf('./') != -1) {
        var dirs = paths[i].split('/');
        var dirStack = new Array();
        for(var n=1; n<dirs.length; n++) {
          if (dirs[n] == '.') { continue; }
          if (dirs[n] == '..') { dirStack.pop(); continue; }
          dirStack.push(dirs[n]);
        }
        paths[i] = '/';
        for(var n=0; n<dirStack.length; n++) {
          paths[i] += n != 0 ? (n == dirStack.length - 1 && !dirStack[n] ? '' : '/') : '';
          paths[i] += dirStack[n];
        }
      }
    }
    return paths;
  };
  // }}}
  
  
	// {{{ duplicateEnvironment
	/**
	 * returns a new 'hidden' Core_Terminal instance with a duplicate (copy) of 
   * this terminal instance environment
   * @access  public
	 * @return Core_Terminal
	 */
  this.duplicateEnvironment = function() {
    var term = new Core_Terminal(true);
    term.clearAliases();
    for(var i in this._aliases) {
      term.addAlias(i, this._aliases[i]);
    }
    term.clearEnv();
    for(var i in this._env) {
      term.addAlias(i, this._env[i]);
    }
    term.clearHistory();
    for(var i in this._history) {
      term._history[i] = this._history[i];
    }
    term._historyPtr = this._historyPtr;
    term.setNode(this._node);
    term.setUmask(this._umask);
    return term;
  };
  // }}}
  
  
  // {{{ echo
	/**
	 * a shortcut to exec('echo ' + str + (noNewLine ? '' : '<br />'))
   * @param String str the string to output. if it is not html formatted, it 
   * will be converted to html format by replacing linebreaks with <br /> html 
   * tags
   * @access  public
	 * @return void
	 */
	this.echo = function(str) {
    if (!this._hidden) { this.exec('echo ' + str); }
	};
	// }}}
  
  
  // {{{ endsWithNewline
	/**
	 * returns true if the current terminal output ends with a newline
   * @access  public
	 * @return boolean
	 */
	this.endsWithNewline = function() {
    return !this._hidden && (SRAOS_Util.endsWith(this._terminal.innerHTML, "<br>") || SRAOS_Util.endsWith(this._terminal.innerHTML, "<BR>") || SRAOS_Util.endsWith(this._terminal.innerHTML, "<br />"));
	};
	// }}}
  
  
  // {{{ exec
	/**
	 * executes a Terminal command and returns the results of that execution (if 
   * execution is not asynchronous)
   * @param String cmd the command to execute
   * @param Object target the object containing the 'callback' method. if not 
   * specified, callback will be invoked statically (used only when execution is 
   * asynchronous)
   * @param String callback the method to invoke with the return value value 
   * if the invoked application is asynchronous. this method should have the 
   * following signature: (mixed : results) : void
   * @access  public
	 * @return mixed
	 */
	this.exec = function(cmd, target, callback) {
    // add line break
    if (!this._hidden && !this.endsWithNewline()) {
      this._terminal.innerHTML += "<br />";
      this.rebuild();
    }
    
    var app = null;
    var cmdApp = null;
    var params = null;
    cmd = SRAOS_CliArg.subEnvironmentVar(cmd, this._env);
    if (SRAOS_Util.isString(cmd)) {
      cmdApp = cmd.indexOf(' ') != -1 ? cmd.substring(0, cmd.indexOf(' ')) : cmd;
      params = cmd.indexOf(' ') != -1 ? cmd.substr(cmd.indexOf(' ') + 1) : params;
      
      // execute program
      if (cmd.indexOf('./') === 0 || cmd.indexOf('../') === 0 || cmd.indexOf('/') === 0 || cmd.indexOf('~') === 0) {
        return this.exec("run " + (cmd.indexOf('./') === 0 || cmd.indexOf('../') === 0 ? this._node.getPathString(true) + '/' + (cmd.indexOf('./') === 0 ? cmd.substring(2) : cmd) : cmd));
      }
      
      // invoke history command
      if (cmdApp.indexOf('!') === 0 && cmdApp.length > 1 && this._history[cmdApp.substring(1) - 1]) {
        this.appendHistoryRecord(this._history[cmdApp.substring(1) - 1].cmd);
        if (!this._hidden) {
          this._terminal.innerHTML += this._history[cmdApp.substring(1) - 1].cmd + '<br />';
          this.rebuild();
        }
        return this.exec(this._history[cmdApp.substring(1) - 1].cmd);
      }
      
      // display command list
      if (!this._hidden && cmdApp.indexOf('?') === 0 && cmdApp.length == 1) {
        var str = '<table class="core_cmdList">';
        var apps = OS.getAllApplications();
        for(var i=0; i<apps.length; i++) {
          if (apps[i].isCli()) {
            str += '<tr><td class="core_cmdListCmd">' + apps[i].getId() + '</td><td class="core_cmdListFullCmd">' + apps[i].getPluginId() + '</td><td>' + apps[i].getLabel() + '</td></tr>';
          }
        }
        str += '</table>';
        return this.echo(str);
      }
      
      // look for alias
      for(var alias in this._aliases) {
        if (cmdApp == alias) {
          return this.exec(this._aliases[cmdApp] + (params ? ' ' + params : ''));
        }
      }
      
      app = OS.getApplication(cmdApp);
    }
    // invalid app
    if (!app) {
      if (!this._hidden) {
        this.echo(cmdApp + ': ' + this._plugin.getString('Terminal.error.commandNotFound'));
        this.addLeadString();
      }
      return false;
    }
    // naming conflict
    else if (SRAOS_Util.isArray(app)) {
      if (!this._hidden) {
        var str = cmdApp + ': ' + this._plugin.getString('Terminal.error.namingConflict') + ' - ';
        for(var i=0; i<app.length; i++) {
          str += i == 0 ? '' : ', ';
          str += app[i].getPluginId() + ':' + app[i].getId();
        }
        this.echo(str);
        this.addLeadString();
      }
      return false;
    }
    else {
      // retrieve and validate cli arguments
      var args = SRAOS_CliArg.parseArgs(params, app.getCliArgs(), this._env);
      if (!SRAOS_Util.isString(args)) {
        var app = OS.launchApplication(app.getPluginId(), app.getId(), { "args": params, "argv": args.argv, "argc": args.argc, "term": this });
        if (app && app.getApplication().isCli()) {
          var manager = app.getManager();
          manager._termTarget = target;
          manager._termCallback = callback;
          this._running.push(manager);
          var status = manager.run();
          switch(status) {
            case SRAOS_ApplicationManager.STATUS_TERMINATED:
              var results = app.getManager().results;
              OS.terminateAppInstance(app, true);
              this._running.pop();
              this.addLeadString();
              return results;
            case SRAOS_ApplicationManager.STATUS_RUNNING:
              Core_Terminal._tmpPolling[this._tmpId] = this;
              this._disableCtrlField();
              this._poll();
              return null;
            case SRAOS_ApplicationManager.STATUS_WAIT:
              Core_Terminal._tmpPolling[this._tmpId] = this;
              if (!this._hidden && !this.endsWithNewline()) {
                this._terminal.innerHTML += "<br />";
              }
              this.rebuild();
              this._pollWait();
              return null;
          }
        }
        else if (!app) {
          this.echo(OS.getString(SRAOS.SYS_ERROR_RESOURCE));
          return false;
        }
      }
      else {
        this.echo(args);
        return false;
      }
    }
	};
	// }}}
  
  
	// {{{ getAlias
	/**
	 * returns a hash containing all of the current environment aliases
   * @param String name if specified, the particular alias specified will be 
   * returned, otherwise the entire aliases hash will be returned
   * @access  public
	 * @return Array
	 */
  this.getAlias = function(name) {
    return name ? this._aliases[name] : this._aliases;
  };
  // }}}
  
  
	// {{{ getEnv
	/**
	 * returns a hash containing all of the current environment variables
   * @param String name if specified, the particular value in the environment 
   * for this value will be returned, otherwise the entire environment variables 
   * hash will be returned
   * @access  public
	 * @return Array
	 */
  this.getEnv = function(name) {
    return name ? this._env[name] : this._env;
  };
  // }}}
  
  
	// {{{ isHidden
	/**
	 * returns true if this terminal instance is hidden
   * @access  public
	 * @return boolean
	 */
  this.isHidden = function() {
    return this._hidden;
  };
  // }}}
  
  
	// {{{ getHistory
	/**
	 * returns the current Terminal history
   * @access  public
	 * @return Array
	 */
  this.getHistory = function() {
    return this._history;
  };
  // }}}
  
  
	// {{{ getLeadString
	/**
	 * returns the lead string to display in the terminal window
   * @access  public
	 * @return string
	 */
  this.getLeadString = function() {
    return OS.user.userName + ':' + (this._node ? this._node.getPathString() : '') + '>';
  };
  // }}}
  
  
	// {{{ getLeadStringHtml
	/**
	 * returns the lead string in html format
   * @access  public
	 * @return string
	 */
  this.getLeadStringHtml = function() {
    return OS.user.userName + ':' + (this._node ? this._node.getPathString() : '') + '&gt;';
  };
  // }}}
  
  
	// {{{ getNode
	/**
	 * returns a reference to the node representing the current terminal location
   * @access  public
	 * @return Core_VfsNode
	 */
  this.getNode = function() {
    return this._node;
  };
  // }}}
  
  
	// {{{ getRunningApp
	/**
	 * returns the top running app in the this._running stack
   * @access  public
	 * @return SRAOS_ApplicationManager
	 */
  this.getRunningApp = function() {
    return this._running.length > 0 ? this._running[this._running.length - 1] : null;
  };
  // }}}
  
  
	// {{{ getRunningStatus
	/**
	 * returns the status of the current running application. either 
   * SRAOS_ApplicationManager.STATUS_TERMINATED if execution has completed OR 
   * no application is currently running, 
   * SRAOS_ApplicationManager.STATUS_RUNNING or 
   * SRAOS_ApplicationManager.STATUS_WAIT
   * @access  public
	 * @return int
	 */
  this.getRunningStatus = function() {
    return this._running.length > 0 ? this.getRunningApp().status : SRAOS_ApplicationManager.STATUS_TERMINATED;
  };
  // }}}
  
  
	// {{{ getTerminal
	/**
	 * returns a reference to the terminal output div
   * @access  public
	 * @return Object
	 */
  this.getTerminal = function() {
    return this._terminal;
  };
  // }}}
  
  
	// {{{ getTerminalWelcome
	/**
	 * returns the terminal welcome message
   * @access  public
	 * @return String
	 */
  this.getTerminalWelcome = function() {
    return OS.getPlugin('core').getString('Terminal.welcome') + '<br /><br />';
  };
  // }}}
  
  
	// {{{ getUmask
	/**
	 * returns the current Terminal umask
   * @access  public
	 * @return Object
	 */
  this.getUmask = function() {
    return this._umask;
  };
  // }}}
  
  
	// {{{ historyNext
	/**
	 * moves to the next history item
   * @access  public
	 * @return void
	 */
  this.historyNext = function() {
    if (this._history.length && this._historyPtr < this._history.length) {
      this._historyPtr++;
      this._ctrlField.value = this._historyPtr == this._history.length ? this._currentVal : this._history[this._historyPtr].cmd;
    }
  };
  // }}}
  
  
	// {{{ historyPrev
	/**
	 * moves to the previous history item
   * @access  public
	 * @return void
	 */
  this.historyPrev = function() {
    if (this._historyPtr > 0) {
      if (this._historyPtr == this._history.length) {
        this._currentVal = this._ctrlField.value;
      }
      this._historyPtr--;
      this._ctrlField.value = this._history[this._historyPtr].cmd;
    }
  };
  // }}}
  
  
	// {{{ onClick
	/**
	 * re-focus the ctrlField whenever the window is clicked
   * @access  public
	 * @return void
	 */
	this.onClick = function() {
    this.onFocus();
	};
	// }}}
  
  
	// {{{ onFocus
	/**
	 * re-focus the ctrlField whenever the window is focused
   * @access  public
	 * @return void
	 */
	this.onFocus = function() {
    if (!this._hidden) { this._ctrlField.focus(); }
	};
	// }}}
  
  
	// {{{ onOpen
	/**
	 * set instance reference to textarea control field and canvas, perform 
   * resize, and set up input monitoring on the control field
   * @access  public
	 * @return boolean
	 */
	this.onOpen = function(height, width) {
    
    this._isSafari = SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_SAFARI;
    this._terminal = this.win.getDomElements( { "className": "coreTerminal" })[0];
    this._ctrlField = this.win.getDomElements( { "className": "coreTerminalInput" })[0];
    this._ctrlField.setAttribute('autocomplete', 'off');
    this._canvas = document.getElementById(this.win.getDivId() + 'Canvas');
    
    // safari border blockers
    if (this._isSafari) {
      this._ctrlFieldBorderHorz = this.win.getDomElements( { "className": "coreTerminalInputBorderHorz" });
      this._ctrlFieldBorderVert = this.win.getDomElements( { "className": "coreTerminalInputBorderVert" });
      this._ctrlFieldBorderHorz[0].style.visibility = "visible";
      this._ctrlFieldBorderHorz[1].style.visibility = "visible";
      this._ctrlFieldBorderVert[0].style.visibility = "visible";
      this._ctrlFieldBorderVert[1].style.visibility = "visible";
    }
    
    this._ctrlField._terminalManager = this;
    
    // add input monitoring to control field
    this._ctrlField._enabled = true;
    this._ctrlField.onkeypress = function(evt) {
      if (!this._enabled) { return false; }
      switch (evt.keyCode) {
        // tab
        case 9:
          this._terminalManager.autoComplete(this.value);
          return false;
        // enter
        case 13:
          this._terminalManager.parseInput(SRAOS_Util.trim(this.value));
          return false;
        // up
        case 38:
        case 63232:
          return false;
        // down
        case 40:
        case 63233:
          return false;
      }
      return true;
    };
    this._ctrlField.onkeyup = function(evt) {
      if (!this._skipNext) {
        // resolves safari double entry bug
        this._skipNext = true;
        setTimeout('document.getElementById("' + this.id + '")._skipNext=false', 1);
        
        switch (evt.keyCode) {
          // up
          case 38:
            this._terminalManager.historyPrev();
            break;
          // down
          case 40:
            this._terminalManager.historyNext();
            break;
        }
      }
    };
    
    if (!this._hidden) {
      var startMsg = this.getTerminalWelcome();
      this._terminal.innerHTML = startMsg;
      if (this.params && this.params.exec) { this.exec(this.params.exec); }
      this.addLeadString();
    }
    
		return true;
	};
	// }}}
  
  // {{{ onResizeEnd
	/**
	 * resize the textarea control field
   * @access  public
	 * @return void
	 */
	this.onResizeEnd = function(height, width) {
    this.rebuild();
	};
	// }}}
  
  // {{{ parseInput
	/**
	 * invoked when the user types 'return' at the command line
   * @access  public
	 * @return void
	 */
	this.parseInput = function(ctrlFieldVal) {
    this._ctrlField.value = "";
    this._currentVal = "";
    this._terminal.innerHTML += ' ' + ctrlFieldVal + "<br />";
    this.rebuild();
    if (this._running.length == 0) {
      if (ctrlFieldVal) {
        this.appendHistoryRecord(ctrlFieldVal);
        this.exec(ctrlFieldVal);
      }
      else {
        this.addLeadString(true);
      }
      this._historyPtr = this._history.length;
    }
    else {
      this.getRunningApp().status = this.getRunningApp().input(ctrlFieldVal);
      this._poll();
    }
	};
	// }}}
  
  
  // {{{ rebuild
	/**
	 * re-formats and re-positions the terminal elements based on the current 
   * output and window size
   * @access  public
	 * @return void
	 */
	this.rebuild = function(height, width) {
    if (!this._hidden) {
      var waitStatus = this._running.length ? true : false;
      var leadStringBuffer = this._node ? (this.getLeadString().length * 7) + (this._isSafari ? 7 : 11) : 0;
      this._ctrlField.style.width = (this._terminal.offsetWidth - (waitStatus ? 5 : leadStringBuffer) - 5) + "px";
      this._ctrlField.style.left = (waitStatus ? 5 : leadStringBuffer) + "px";
      this._ctrlField.style.top = (this._terminal.offsetHeight - (waitStatus ? 0 : this._ctrlField.offsetHeight) - 3) + "px";
      
      // cover input field borders in safari (does not support removal of borders via css)
      if (this._isSafari) {
        // horizontal
        this._ctrlFieldBorderHorz[0].style.width = this._ctrlField.style.width;
        this._ctrlFieldBorderHorz[0].style.left = this._ctrlField.style.left;
        this._ctrlFieldBorderHorz[1].style.width = this._ctrlField.style.width;
        this._ctrlFieldBorderHorz[1].style.left = this._ctrlField.style.left;
        this._ctrlFieldBorderHorz[0].style.top = (parseInt(this._ctrlField.style.top) - 1) + "px";
        this._ctrlFieldBorderHorz[1].style.top = (parseInt(this._ctrlFieldBorderHorz[0].style.top) + this._ctrlField.offsetHeight + 1) + "px";
        
        //vertical
        this._ctrlFieldBorderVert[0].style.left = (parseInt(this._ctrlField.style.left) - 3) + "px";
        this._ctrlFieldBorderVert[0].style.top = this._ctrlField.style.top;
        this._ctrlFieldBorderVert[1].style.left = (parseInt(this._ctrlFieldBorderVert[0].style.left) + this._ctrlField.offsetWidth + 1) + "px";
        this._ctrlFieldBorderVert[1].style.top = this._ctrlField.style.top;
      }
      if (this._canvas.scrollHeight > this._canvas.offsetHeight) {
        this._canvas.scrollTop = this._canvas.scrollHeight - this._canvas.offsetHeight;
      }
      this.onFocus();
    }
	};
	// }}}
  
  
	// {{{ removeAlias
	/**
	 * removes an environment alias. removes true on success, false otherwise
   * @param String alias the alias command to remove
   * @param boolean commit whether or not to commit this change globally
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return boolean
	 */
  this.removeAlias = function(alias, commit, share) {
    if (!this._aliases[alias] && !commit && !share) { return false; }
    
    if (this._aliases[alias]) {
      this._aliases = SRAOS_Util.removeFromArray(alias, this._aliases, null, null, true);
    }
    if (commit || share) {
      OS.user.coreTermAliases = SRAOS_Util.removeFromArray(alias, OS.user.coreTermAliases, 1, 'alias');
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'alias'), new SRAOS_AjaxServiceParam('id', alias));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_removeTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToRemoveAlias');
    }
    return true;
  };
  // }}}
  
  
  // {{{ removeRelativePrefix
  /**
   * removes a relative prefix from a path. this is the path to the pwd
   * @param String path the path to remove the relative prefix from 
   * @return String
   */
  this.removeRelativePrefix = function(path) {
    var curPath = this._node.getPathString(true);
    return curPath != '/' && path.indexOf(curPath) === 0 && path != curPath ? path.substring(curPath.length + 1) : path;
  };
  // }}}
  
  
	// {{{ setEnv
	/**
	 * sets an environment variable
   * @param String name the environment variable name
   * @param String value the environment variable value
   * @param boolean commit whether or not to commit this change globally
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.setEnv = function(name, value, commit, share) {
    this._env[name] = value;
    if (commit || share) {
      var found = false;
      for(var i in OS.user.coreTermEnv) {
        if (OS.user.coreTermEnv[i].name == name) {
          found = true;
          OS.user.coreTermEnv[i].value = value;
        }
      }
      if (!found) {
        OS.user.coreTermEnv.push({ "name": name, "value": value });
      }
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'env'), new SRAOS_AjaxServiceParam('id', name), new SRAOS_AjaxServiceParam('value', value));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_addTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToAddEnv');
    }
  };
  // }}}
  
  
	// {{{ setNode
	/**
	 * sets the Terminal node (current working directory)
   * @param Core_VfsNode node the node to set
   * @access  public
	 * @return void
	 */
  this.setNode = function(node) {
    this._node = node;
  };
  // }}}
  
  
	// {{{ setUmask
	/**
	 * sets the Terminal umask
   * @param int umask the umask to set
   * @param boolean commit whether or not to commit this change to the user's 
   * profile
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.setUmask = function(umask, commit, share) {
    this._umask = umask;
    if (commit || share) {
      OS.user.umask = umask;
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('attr', 'umask'), new SRAOS_AjaxServiceParam('value', umask));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_updateTermUserAttr', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToUpdateUmask');
    }
  };
  // }}}
  
  
	// {{{ updateHistoryBufferSize
	/**
	 * appends a command to the user's history and saves it to the user's profile
   * on the server
   * @param int size the new buffer size to apply
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return void
	 */
  this.updateHistoryBufferSize = function(size, share) {
    if (size < Core_Terminal.BUFFER_MIN || size > Core_Terminal.BUFFER_MAX) {
      this.echo(this._plugin.getString('Terminal.error.bufferSize'));
    }
    else {
      OS.user.coreTermHistoryBuffer = size;
      if (this._history.length > OS.user.coreTermHistoryBuffer) {
        this._history = this._history.slice(this._history.length - OS.user.coreTermHistoryBuffer);
      }
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('attr', 'coreTermHistoryBuffer'), new SRAOS_AjaxServiceParam('value', size));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_updateTermUserAttr', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToUpdateHistoryBufferSize');
    }
  };
  // }}}
  
  
	// {{{ unsetEnv
	/**
	 * unsets an environment variable. removes true on success, false otherwise
   * @param String name the environment variable name
   * @param boolean commit whether or not to save this change globally
   * @param boolean share whether or not to extend this change to any sub-users
   * @access  public
	 * @return boolean
	 */
  this.unsetEnv = function(name, commit, share) {
    if (!this._env[name] && !commit && !share) { return false; }
    
    if (this._env[name]) {
      this._env = SRAOS_Util.removeFromArray(name, this._env, null, null, true);
    }
    if (commit || share) {
      OS.user.coreTermEnv = SRAOS_Util.removeFromArray(name, OS.user.coreTermEnv, 1, 'name');
      this.win.setStatusBarText(this._plugin.getString("Terminal.text.commit"));
      var params = new Array(new SRAOS_AjaxServiceParam('type', 'env'), new SRAOS_AjaxServiceParam('id', name));
      if (share) { params.push(new SRAOS_AjaxServiceParam('propagate', true)); }
      OS.ajaxInvokeService('core_removeTermEnv', this, '_ajaxResponse', null, null, params, 'Terminal.error.unableToUnsetEnv');
    }
    return true;
  };
  // }}}
  
  
  // {{{ _ajaxResponse
  /**
   * generic handler for ajax requests (displays an error message when 
   * unsuccessful)
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._ajaxResponse = function(response) {
    if (!this._hidden) { this.win.clearStatusBarText(); }
    if (!this._hidden && response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      this.echo(this._plugin.getString(response.requestId));
    }
  };
  // }}}
  
  
  // {{{ _disableCtrlField
  /**
   * disables the control field
   * @return void
   */
  this._disableCtrlField = function() {
    if (!this._hidden) {
      this._ctrlField._enabled = false;
    }
  };
  // }}}
  
  
  // {{{ _enableCtrlField
  /**
   * enabled the control field
   * @return void
   */
  this._enableCtrlField = function() {
    if (!this._hidden) {
      this._ctrlField._enabled = true;
      this.onFocus();
    }
  };
  // }}}
  
  
  // {{{ _poll
  /**
   * polls the current running application (this.getRunningApp()) until its status 
   * changes to SRAOS_ApplicationManager.STATUS_WAIT or 
   * SRAOS_ApplicationManager.STATUS_TERMINATED
   * @access  public
	 * @return void
	 */
  this._poll = function() {
    if (this._pollWaitTimer) {
      clearTimeout(this._pollWaitTimer);
      this._pollWaitTimer = null;
    }
    var running = this.getRunningApp();
    if (running) {
      switch(running.status) {
        case SRAOS_ApplicationManager.STATUS_RUNNING:
          this._disableCtrlField();
          setTimeout('Core_Terminal._tmpPolling[' + this._tmpId + ']._poll()', Core_Terminal.POLL_FREQ);
          break;
        case SRAOS_ApplicationManager.STATUS_TERMINATED:
          if (!this._hidden) { this.win.clearStatusBarText(); }
          this._terminateRunningApp();
          break;
        case SRAOS_ApplicationManager.STATUS_WAIT:
          this._enableCtrlField();
          if (!this._hidden && !this.endsWithNewline()) {
            this._terminal.innerHTML += "<br />";
          }
          this.rebuild();
          this._pollWait();
          break;
      }
    }
  };
  // }}}
  
  
  // {{{ _pollWait
  /**
   * polls the running application while in a wait status
   * @access  public
	 * @return void
	 */
  this._pollWait = function() {
    var running = this.getRunningApp();
    if (running) {
      switch(running.status) {
        case SRAOS_ApplicationManager.STATUS_TERMINATED:
          this._terminateRunningApp();
          break;
        default:
          this._pollWaitTimer = setTimeout('Core_Terminal._tmpPolling[' + this._tmpId + ']._pollWait()', Core_Terminal.POLL_FREQ);
          break;
      }
    }
  };
  // }}}
  
  
  // {{{ _terminateRunningApp
  /**
   * terminates the current running application
   * @access  public
	 * @return void
	 */
  this._terminateRunningApp = function() {
    var running = this.getRunningApp();
    if (running) {
      if (!this._hidden) { 
        this.win.clearStatusBarText();
        this._enableCtrlField();
      }
      OS.terminateAppInstance(running.app, true);
      // invoke callback
      if (running._termCallback) {
        Core_Terminal._tmpPolling[this._tmpId] = running.results;
        running._termTarget && running._termTarget[running._termCallback] ? running._termTarget[running._termCallback](running.results) : eval(callback + '(Core_Terminal._tmpPolling[' + this._tmpId + '])');
      }
      this._running.pop();
      this.addLeadString();
      Core_Terminal._tmpPolling[this._tmpId] = null;
    }
  };
  // }}}
  
  
};


/**
 * static variable used to temporarily store references to running Core_Terminal
 * instances in a polling status
 * @type Array
 */
Core_Terminal._tmpPolling = new Array();


/**
 * static variable used to provide a unique id for each running Core_Terminal 
 * instance within the Core_Terminal._tmpPolling array
 * @type int
 */
Core_Terminal._tmpPollingId = 1;

// constants
/**
 * the min history buffer size
 * @type int
 */
Core_Terminal.BUFFER_MIN = 10;

/**
 * the max history buffer size
 * @type int
 */
Core_Terminal.BUFFER_MAX = 1000;

/**
 * frequency in milliseconds to poll running applications for a status change
 * @type int
 */
Core_Terminal.POLL_FREQ = 500;

// }}}
