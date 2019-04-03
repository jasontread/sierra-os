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

 This file contains the SRAOS_ApplicationManager classes for the core cli
 Terminal applications 
 */


// {{{
/**
 * displays or adds aliases
 */
Core_Cmds_alias = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (this.params.argv['alias']) {
      for(var alias in this.params.argv['alias']) {
        this.params.term.addAlias(alias, this.params.argv['alias'][alias], this.params.argv['commit'], this.params.argv['share']);
      }
    }
    else if (this.params.argv['print']) {
      var aliases = this.params.term.getAlias();
      this.results = aliases;
      if (!this.params.term.isHidden()) {
        var str = '';
        for(var alias in aliases) {
          str += 'alias ' + alias + "='" + aliases[alias] + "'\n";
        }
        this.params.term.echo(str);
      }
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * changes the current working directory
 */
Core_Cmds_cd = function() {
  
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var dir = this.params.term.convertPathsToAbsolute([this.params.argv['dir'] ? this.params.argv['dir'] : '~'])[0];
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core.cd.changingDirectory") + ' ' + dir); }
    VFS.getNodes(dir, this, '_vfsResponse');
		return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
  
	// {{{ _vfsResponse
	/**
   * handles the response from invocation to Core_Vfs.getNodes
   * @param Core_VfsNode[] nodes the node or error message returned from the 
   * invocation
   * @access  public
	 * @return void
	 */
	this._vfsResponse = function(node, status) {
    this.results = status != SRAOS.AJAX_STATUS_SUCCESS ? OS.getString(SRAOS.SYS_ERROR_RESOURCE) : (SRAOS_Util.isString(node) ? node : (!node.hasAccess(Core_Vfs.PBIT_EXECUTE) ? OS.getPlugin('core').getString('VFS.error.permissionDenied') : node));
    SRAOS_Util.isString(this.results) ? this.params.term.echo(this.results) : this.params.term.setNode(this.results);
    this.status = SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * manager for chown and chgrp
 */
Core_Cmds_owner = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var appId = this.app.getApplication().getId();
    var target = this.params.argv[appId == 'chgrp' ? 'group' : 'user'];
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core." + appId + ".processing") + ' ' + target); }
    this._process = Core_Cmds_outputResults;
    VFS[appId](this.params.term.convertPathsToAbsolute(this.params.argv['file']), target, this, '_process', this.params.argv['recursive'], this.params.argv['preserve-root'], this.params.argv['traverse-links'], this.params.argv['stop-dirs'], this.params.argv['max-recursion'] ? this.params.argv['max-recursion'] : null);
    return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
  
};
// }}}


// {{{
/**
 * Change File Access Permissions
 */
Core_Cmds_chmod = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core.chmod.processing")); }
    this._process = Core_Cmds_outputResults;
    VFS.chmod(this.params.term.convertPathsToAbsolute(this.params.argv['file']), this.params.argv['mode'], this, '_process', this.params.argv['recursive'], this.params.argv['preserve-root'], this.params.argv['traverse-links'], this.params.argv['stop-dirs'], this.params.argv['max-recursion'] ? this.params.argv['max-recursion'] : null);
    return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
};
// }}}


// {{{
/**
 * Clear the Terminal screen
 */
Core_Cmds_clear = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (!this.params.term.isHidden()) { 
      var terminal = this.params.term.getTerminal();
      terminal.innerHTML = this.params.term.getTerminalWelcome();
      this.params.term.rebuild();
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Copy Files and Directories
 */
Core_Cmds_cp = function() {
  /**
   * the current pending interactive nodes
   * @type String[]
   */
  this._interactive;
  
  /**
   * the current interactive prompt pointer
   * @type int
   */
  this._interactivePtr = 0;
  
  /**
   * the current force array populated when in interactive mode
   * @type String[]
   */
  this._force;
  
	// {{{ input
	/**
	 * processes the response from a user
   * @param String input the input provided by the user
   * @access  public
	 * @return int
	 */
	this.input = function(input) {
    if (input != 'y' && input != 'n' && input != 'A' && input != 'N') {
      this.params.term.echo(OS.getPlugin('core').getString('core.invalidInput') + '\n');
      this._prompt();
    }
    else {
      // add all
      if (input == 'A') {
        for(var i=this._interactivePtr; i<this._interactive.length; i++) {
          this._force.push(this._interactive[i]);
        }
      }
      // add one
      if (input == 'y') {
        this._force.push(this._interactive[this._interactivePtr]);
      }
      // increment pointer
      this._interactivePtr = input == 'A' || input == 'N' ? this._interactive.length : this._interactivePtr+1;
      
      if (this._interactivePtr >= this._interactive.length && force.length) {
        VFS.cp(force, this.params.argv['dest'], true, this.params.argv['link'], this.params.argv['preserve'] ? this.params.argv['preserve'].split(',') : null, this.params.argv['update'], false, this, '_process1', this.params.argv['recursive'], this.params.argv['preserve-root'], this.params.argv['traverse-links'], this.params.argv['stop-dirs'], this.params.argv['max-recursion'] ? this.params.argv['max-recursion'] : null);
      }
      else if (this._interactivePtr >= this._interactive.length) {
        return SRAOS_ApplicationManager.STATUS_TERMINATED;
      }
      else {
        this._prompt()
      }
    }
    return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
  
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core.cp.processing")); }
    this[this.params.argv['force'] || !this.params.argv['interative'] ? '_process' : '_process1'] = Core_Cmds_outputResults;
    VFS.cp(this.params.term.convertPathsToAbsolute(this.params.argv['source']), this.params.argv['dest'], this.params.argv['force'], this.params.argv['link'], this.params.argv['preserve'] ? this.params.argv['preserve'].split(',') : null, this.params.argv['update'], !this.params.argv['force'] && this.params.argv['interative'], this, '_process', this.params.argv['recursive'], this.params.argv['preserve-root'], this.params.argv['traverse-links'], this.params.argv['stop-dirs'], this.params.argv['max-recursion'] ? this.params.argv['max-recursion'] : null);
    return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
  
	// {{{ _process
  /**
   * used for interactive copying when overwriting will occur
   * @param Object results the request response. the user will be prompted when 
   * any results values are Core_Vfs.OVERWRITING
   * @param int status the request status code
   * @access  public
   * @return void
   */
  this._process = function(results, status) {
    if (status == SRAOS.AJAX_STATUS_SUCCESS) {
      // first separate interactive nodes from completed nodes and output the 
      // results for the initial processing
      var output = new Array();
      var outputCount = 0;
      this._interactive = new Array();
      var interactiveCount = 0;
      for(var i in results) {
        results[i] == Core_Vfs.OVERWRITING ? this._interactive.push(i) : output[i] = results[i];
        results[i] == Core_Vfs.OVERWRITING ? interactiveCount++ : outputCount++;
      }
      if (outputCount) { this._process1(output, status, true); }
      if (interactiveCount) {
        this._force = new Array();
        return this._prompt();
      }
      this.status = SRAOS_ApplicationManager.STATUS_TERMINATED;
    }
    else {
      this._process1(results, status);
    }
	};
	// }}}
  
	// {{{ _prompt
  /**
   * prompts the user interactively whether or not they want to force copy the 
   * current node in this._interactive
   * @access  public
   * @return void
   */
  this._prompt = function() {
    this.params.term.echo(OS.getPlugin('core').getString('core.cp.interactiveConfirm1') + ' ' + this._interactive[this._interactivePtr] + OS.getPlugin('core').getString('core.cp.interactiveConfirm2'));
    this.status = SRAOS_ApplicationManager.STATUS_WAIT;
  };
  // }}}
};
// }}}


// {{{
/**
 * displays today's date
 */
Core_Cmds_date = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    this.results = '' + new Date();
    this.params.term.echo(this.results);
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * outputs a string to the terminal output
 */
Core_Cmds_echo = function() {
	// {{{ run
	/**
	 * output the 'args' to the 'term' provided in the initialization params
   * @access  public
	 * @return int
	 */
	this.run = function() {
    this.results = this.params.args ? SRAOS_CliArg.subEnvironmentVar(this.params.args, this.params.term.getEnv()) : '';
    this._print(this.results);
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
  
  // {{{ _print
  /**
   * prints the string str to the terminal
   * @param String str the string to print
   * @return void
   */
  this._print = function(str) {
    if (!this.params.term.isHidden()) { 
      var terminal = this.params.term.getTerminal();
      terminal.innerHTML += SRAOS_Util.textToHtml(str);
      this.params.term.rebuild();
    }
  };
  // }}}
  
};
// }}}


// {{{
/**
 * Executes a command and outputs the results
 */
Core_Cmds_exec = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var cmd = this.params.argv['cmd'] + (this.params.argv['args'] ? ' ' + this.params.argv['args'] : '');
    if (this.params.argv['app'] && !this.params.term.isHidden()) {
      var results = this.params.term.win.getAppInstance().exec(cmd, '_terminate', this);
      if (results !== null) { this._terminate(results); }
      return results !== null ? SRAOS_ApplicationManager.STATUS_TERMINATED : SRAOS_ApplicationManager.STATUS_RUNNING;
    }
    else {
      var term = this.params.argv['clear'] ? new Core_Terminal(true) : this.params.term.duplicateEnvironment();
      var results = term.exec(cmd, this, '_terminate');
      if (term.getRunningStatus() == SRAOS_ApplicationManager.STATUS_TERMINATED) { this._terminate(results); }
      return term.getRunningStatus();
    }
	};
	// }}}
  
	// {{{ _terminate
	/**
   * invoked when asynchronous execution has terminated
   * @param mixed results the results of the invocation
   * @access  public
	 * @return void
	 */
	this._terminate = function(results) {
    this.params.term.echo(this.params.argv['method'] && results && results[this.params.argv['method']] ? results[this.params.argv['method']]() : results);
    this.status = SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * cause the Terminal application instance to exit
 */
Core_Cmds_exit = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (!this.params.term.isHidden()) {
      // remove focus, otherwise safari crashes
      if (SRAOS_Util.getBrowser() == SRAOS_Util.BROWSER_SAFARI) { document.getElementById("searchField").focus(); }
      
      OS.terminateAppInstance(this.params.term.win);
    }
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * displays or adds environment variables
 */
Core_Cmds_export = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (this.params.argv['name']) {
      for(var name in this.params.argv['name']) {
        this.params.term.setEnv(name, this.params.argv['name'][name], this.params.argv['commit'], this.params.argv['share']);
      }
    }
    else if (this.params.argv['print']) {
      var vars = this.params.term.getEnv();
      this.results = vars;
      if (!this.params.term.isHidden()) {
        var str = '';
        for(var name in vars) {
          str += 'export ' + name + "='" + vars[name] + "'\n";
        }
        this.params.term.echo(str);
      }
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Displays a help topic using the built-in help viewer
 */
Core_Cmds_help = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    // validate plugin
    var plugin = OS.getPlugin(this.params.argv['plugin']);
    if (!plugin) {
      this.params.term.echo(this.params.argv['plugin'] + ' ' + OS.getPlugin('core').getString('core.help.error.invalidPlugin'));
      this.results = false;
    }
    else if (!plugin.displayHelp(this.params.argv['topic'])) {
      this.params.term.echo(this.params.argv['topic'] + ' ' + OS.getPlugin('core').getString('core.help.error.invalidTopic') + ' ' + this.params.argv['plugin']);
      this.results = false;
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Used to display and manipulate the Terminal command history
 */
Core_Cmds_history = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (this.params.argv['buffer']) {
      this.params.term.updateHistoryBufferSize(this.params.argv['buffer'], this.params.argv['share']);
    }
    else if (this.params.argv['info']) {
      this.results = OS.user.coreTermHistoryBuffer;
      this.params.term.echo(this.results);
    }
    else if (this.params.argv['reset']) {
      this.params.term.clearHistory(true, this.params.argv['share']);
    }
    else {
      var history = this.params.term.getHistory();
      this.results = new Array();
      var str = '';
      for(var i=0; i<history.length; i++) {
        str += ' ' + (i + 1) + ' ' + history[i].cmd + '\n';
        this.results.push(history[i].cmd);
      }
      this.params.term.echo(str);
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Used to force termination of a running application process
 */
Core_Cmds_kill = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var plugin = OS.getPlugin('core');
    var str = '';
    var killTerm = false;
    for(var i in this.params.argv['pid']) {
      var pid = this.params.argv['pid'][i];
      
      // kill terminal last
      if (!this.params.term.isHidden() && pid == this.params.term.win.getAppInstance().getPid()) {
        killTerm = true;
      }
      else {
        var app = OS.getAppInstance(pid);
        if (app) {
          OS.terminateAppInstance(app, true);
        }
        else {
          str += pid + ' ' + plugin.getString('core.kill.error.invalidPid') + '\n';
        }
      }
    }
    if (str != '') {
      this.params.term.echo(str);
      this.results = false;
    }
    if (killTerm) {
      OS.terminateAppInstance(this.params.term.win.getAppInstance(), true);
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * displays an applications' description and argument constraints
 */
Core_Cmds_man = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var plugin = OS.getPlugin('core');
    var app = OS.getApplication(this.params.argv['app']);
    // invalid app
    if (!app) {
      this.params.term.echo(plugin.getString('core.man.error.invalidApp') + ' ' + this.params.argv['app']);
      this.results = null;
    }
    // naming conflict
    else if (SRAOS_Util.isArray(app)) {
      if (!this.params.term.isHidden()) {
        var str = this.params.argv['app'] + ': ' + OS.getPlugin('core').getString('Terminal.error.namingConflict') + ' - ';
        for(var i=0; i<app.length; i++) {
          str += i == 0 ? '' : ', ';
          str += app[i].getPluginId() + ':' + app[i].getId();
        }
        this.params.term.echo(str);
      }
      this.results = null;
    }
    else {
      var cliArgs = app.getCliArgs();
      var cliArgsLabel = app.getCliArgsApi();
      var str = '<div class="core_manHeader">' + plugin.getString('core.man.text.name') + '</div>';
      str += '<div class="core_manContent">' + app.getId() + ' - ' + app.getLabel() + '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.synopsis') + '</div>';
      str += '<div class="core_manContent">' + app.getId() + ' ' + (!cliArgs.length && cliArgsLabel ? '[' + plugin.getString('core.man.text.options').toLowerCase() + ']' : '');
      for(var i in cliArgs) {
        str += !cliArgs[i].isRequired() ? '[' : '';
        str += cliArgs[i].isFreeform() ? '[' + cliArgs[i].getId() + ']' : (cliArgs[i].getAbbr() ? '-' + cliArgs[i].getAbbr() : '--' + cliArgs[i].getId());
        str += !cliArgs[i].isBoolean() ? (!cliArgs[i].isFreeform() && cliArgs[i].getAbbr() ? ' ' : '=') + '<font class="core_manArgLabel">' + (cliArgs[i].isFreeform() ? plugin.getString('core.man.text.value') : cliArgs[i].getId()) + '</font>' : '';
        str += !cliArgs[i].isRequired() ? ']' : '';
        str += cliArgs[i].isMultiple() ? '*' : '';
        str += ' ';
      }
      str += '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.description') + '</div>';
      str += '<div class="core_manContent">' + app.getAbout() + '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.options') + '</div>';
      str += '<div class="core_manContent">' + (!cliArgs.length && !cliArgsLabel ? plugin.getString('core.man.text.none') : (cliArgsLabel ? cliArgsLabel : ''));
      for(var i in cliArgs) {
        str += cliArgs[i].isRequired() ? '<font class="core_manArgVal">' : '';
        str += cliArgs[i].isFreeform() ? '[' + cliArgs[i].getId() + ']' : (cliArgs[i].getAbbr() ? '-' + cliArgs[i].getAbbr() : '');
        str += !cliArgs[i].isBoolean() ? (!cliArgs[i].isFreeform() && cliArgs[i].getAbbr() ? ' ' : '=') + '<font class="core_manArgLabel">' + (cliArgs[i].isFreeform() ? plugin.getString('core.man.text.value') : cliArgs[i].getId()) + '</font>' : '';
        if (!cliArgs[i].isFreeform()) {
          str += cliArgs[i].getAbbr() ? ', ' : '';
          str += '--' + cliArgs[i].getId();
          str += !cliArgs[i].isBoolean() ? '=<font class="core_manArgLabel">' + cliArgs[i].getId() + '</font>' : '';
        }
        str += cliArgs[i].isRequired() ? '</font>' : '';
        str += cliArgs[i].getDefault() ? ' (' + plugin.getString('core.man.text.default') + ' ' + cliArgs[i].getDefault() + ')' : '';
        str += '<div class="core_manContent">' + cliArgs[i].getManEntry() + '</div>';
      }
      str += '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.async') + '</div>';
      str += '<div class="core_manContent">' + OS.getString(app.isCliAsync() ? 'text.yes' : 'text.no') + '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.return') + '</div>';
      str += '<div class="core_manContent">' + app.getCliRetType() + ' : ' + app.getCliRetApi() + '</div>';
      str += '<div class="core_manHeader">' + plugin.getString('core.man.text.additionalInfo') + '</div>';
      str += '<div class="core_manContent">' + (app.getHelpTopic() ? plugin.getString('core.man.text.type') + ' \'help ' + app.getPluginId() + ' ' + app.getHelpTopic() + '\'' : plugin.getString('core.man.text.none')) + '</div>';
      this.results = str;
      this.params.term.echo(str);
    }
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Display the Current Processes
 */
Core_Cmds_ps = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var plugin = OS.getPlugin('core');
    var apps = OS.getApplications();
    var str = '<table class="core_cmdList"><tr><th>' + plugin.getString('core.ps.pid') + '</td><th>' + plugin.getString('core.ps.app') + '</tr>';
    var results = new Array();
    for(var i in apps) {
      str += '<tr><td>' + apps[i].getPid() + '</td><td class="core_cmdListCmd">' + apps[i].getApplication().getId() + '</tr>';
      this.results[apps[i].getPid()] = apps[i].getApplication().getId();
    }
    str += '</table>';
    this.params.term.echo(str);
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Print name of current/working directory
 */
Core_Cmds_pwd = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    this.results = this.params.term.getNode();
    this.params.term.echo(this.results.getPathString(true));
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Run an Executable File
 */
Core_Cmds_run = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core.run.loading") + ' ' + this.params.argv['file']); }
    OS.ajaxInvokeService('core_getExecutableSource', this, '_evalCode', null, null, [new SRAOS_AjaxServiceParam('file', this.params.argv['file'])]);
    return SRAOS_ApplicationManager.STATUS_RUNNING;
	};
	// }}}
  
  
  // {{{ _evalCode
  /**
   * handles the response to the ajax request to retrieve the executable source
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._evalCode = function(response) {
    if (!this.params.term.isHidden()) { this.params.term.win.setStatusBarText(OS.getPlugin('core').getString("core.run.running") + ' ' + this.params.argv['file']); }
    var status = SRAOS_ApplicationManager.STATUS_TERMINATED;
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      this.params.term.echo(OS.getString(SRAOS.SYS_ERROR_RESOURCE));
    }
    else {
      if (response.results) {
        var term = this.params.term;
        var args = this.params.argv['args'];
        var manager = this;
        try { 
          eval(response.results); 
        }
        catch (e) {
          var tmp = "";
          for(i in e) {
            tmp += i + ": " + e[i] + "\n";
          }
          this.params.term.echo(tmp);
        }
      }
    }
    this.status = status;
  };
  // }}}
};
// }}}


// {{{
/**
 * Used to view or set the current user file-creation mask
 */
Core_Cmds_umask = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var umask = this.params.term.getUmask();
    if (this.params.argv['reset']) {
      umask = OS.user.umask;
      this.params.term.setUmask(umask, this.params.argv['commit'], this.params.argv['share']);
    }
    else if (this.params.argv['mode']) {
      var mode = this.params.argv['mode'];
      var newUmask = this.params.argv['mode'];
      // symbolic umask
      if (!SRAOS_Util.isNumeric(newUmask)) {
        newUmask = this.params.term.getUmask();
        for(var i in this.params.argv['mode']) {
          var mode = this.params.argv['mode'][i];
          var op = mode.indexOf('=') != -1 ? '=' : (mode.indexOf('+') != -1 ? '+' : '-');
          var target = mode.indexOf(op) ? mode.substr(0, mode.indexOf(op)) : 'a';
          target = target.indexOf('a') != -1 ? 'ugo' : target;
          var permissions = mode.substr(mode.indexOf(op) + 1);
          var setUmask = 0;
          for(var i=0; i<target.length; i++) {
            var targetBits = (op == '=' ? Core_Vfs.PBIT_DEFAULT_PERMISSIONS_DIR : newUmask) & (target[i] == 'u' ? Core_Vfs.PBIT_DEFAULT_UALL : (target[i] == 'g' ? Core_Vfs.PBIT_DEFAULT_GALL : Core_Vfs.PBIT_DEFAULT_OALL));
            newUmask = newUmask & ~(target[i] == 'u' ? Core_Vfs.PBIT_DEFAULT_UALL : (target[i] == 'g' ? Core_Vfs.PBIT_DEFAULT_GALL : Core_Vfs.PBIT_DEFAULT_OALL));
            for(var n=0; n<permissions.length; n++) {
              if (permissions[n] == 'i') { newUmask = op == '+' || op == '=' ? newUmask | Core_Vfs.PBIT_INHERIT : newUmask & ~Core_Vfs.PBIT_INHERIT; continue; }
              if (permissions[n] == 'h') { newUmask = op == '+' || op == '=' ? newUmask | Core_Vfs.PBIT_HIDDEN : newUmask & ~Core_Vfs.PBIT_HIDDEN; continue; }
              if (permissions[n] == 's' && target[i] == 'u') { newUmask = op == '+' || op == '=' ? newUmask | Core_Vfs.PBIT_USERID : newUmask & ~Core_Vfs.PBIT_USERID; continue; }
              if (permissions[n] == 's' && target[i] == 'g') { newUmask = op == '+' || op == '=' ? newUmask | Core_Vfs.PBIT_GROUPID : newUmask & ~Core_Vfs.PBIT_GROUPID; continue; }
              if (permissions[n] == 't' && target[i] == 'o') { newUmask = op == '+' || op == '=' ? newUmask | Core_Vfs.PBIT_STICKY : newUmask & ~Core_Vfs.PBIT_STICKY; continue; }
              
              var val = permissions[n] == 'r' ? Core_Vfs.PBIT_READ : (permissions[n] == 'w' ? Core_Vfs.PBIT_WRITE : (permissions[n] == 'x' ? Core_Vfs.PBIT_EXECUTE : 0));
              val = target[i] == 'g' ? val >> 3 : (target[i] == 'o' ? val >> 6 : val);
              
              targetBits = op == '+' || op == '=' ? targetBits & ~val : targetBits | val;
            }
            newUmask = newUmask | targetBits;
          }
        }
      }
      // octal mask
      else {
        newUmask = Core_Vfs.convertOctalPermissions(newUmask[0]);
      }
      umask = newUmask;
      this.params.term.setUmask(umask, this.params.argv['commit'], this.params.argv['share']);
    }
    else if (this.params.argv['commit']) {
      this.params.term.setUmask(this.params.term.getUmask(), this.params.argv['commit'], this.params.argv['share']);
    }
    else if (this.params.argv['print']) {
      var str = '';
      if (this.params.argv['symbolic']) {
        str += umask & Core_Vfs.PBIT_HIDDEN ? 'h' : '';
        str += umask & Core_Vfs.PBIT_INHERIT ? 'i' : '';
        str += (str == '' ? '' : ',') + 'u=' + (!(umask & Core_Vfs.PBIT_READ) ? 'r' : '') + (!(umask & Core_Vfs.PBIT_WRITE) ? 'w' : '') + (!(umask & Core_Vfs.PBIT_EXECUTE) ? (umask & Core_Vfs.PBIT_USERID ? 's' : 'x') : (umask & Core_Vfs.PBIT_EXECUTE && umask & Core_Vfs.PBIT_USERID ? 'S' : ''));
        str += ',g=' + (!(umask & Core_Vfs.PBIT_GREAD) ? 'r' : '') + (!(umask & Core_Vfs.PBIT_GWRITE) ? 'w' : '') + (!(umask & Core_Vfs.PBIT_GEXECUTE) ? (umask & Core_Vfs.PBIT_GROUPID ? 's' : 'x') : (umask & Core_Vfs.PBIT_GEXECUTE && umask & Core_Vfs.PBIT_GROUPID ? 'S' : ''));
        str += ',o=' + (!(umask & Core_Vfs.PBIT_OREAD) ? 'r' : '') + (!(umask & Core_Vfs.PBIT_OWRITE) ? 'w' : '') + (!(umask & Core_Vfs.PBIT_OEXECUTE) ? (umask & Core_Vfs.PBIT_STICKY ? 't' : 'x') : (umask & Core_Vfs.PBIT_OEXECUTE && umask & Core_Vfs.PBIT_STICKY ? 'T' : ''));
      }
      else {
        str += ((umask >> 12) & 7) + '' + ((umask >> 9) & 7) + '' + ((umask >> 6) & 7) + '' + ((umask >> 3) & 7) + '' + (umask & 7);
      }
      this.results = str;
      this.params.term.echo(str);
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Remove an alias or aliases to a command
 */
Core_Cmds_unalias = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var plugin = OS.getPlugin('core');
    var str = '';
    if (this.params.argv['alias']) {
      for(var i in this.params.argv['alias']) {
        if (!this.params.term.removeAlias(this.params.argv['alias'][i], this.params.argv['commit'], this.params.argv['share'])) {
          str += (str == '' ? '' : '\n') + this.params.argv['alias'][i] + ': ' + plugin.getString('core.unalias.error.invalidAlias')
        }
      }
    }
    else if (this.params.argv['reset']) {
      this.params.term.clearAliases(this.params.argv['commit'], this.params.argv['share']);
    }
    if (str != '') {
      this.results = false;
      this.params.term.echo(str);
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * Removes an existing environment variable set using the 'export' command
 */
Core_Cmds_unset = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var plugin = OS.getPlugin('core');
    var str = '';
    if (this.params.argv['name']) {
      for(var i in this.params.argv['name']) {
        if (!this.params.term.unsetEnv(this.params.argv['name'][i], this.params.argv['commit'], this.params.argv['share'])) {
          str += (str == '' ? '' : '\n') + this.params.argv['name'][i] + ': ' + plugin.getString('core.unset.error.invalidName')
        }
      }
    }
    else if (this.params.argv['reset']) {
      this.params.term.clearEnv(this.params.argv['commit'], this.params.argv['share']);
    }
    if (str != '') {
      this.results = false;
      this.params.term.echo(str);
    }
    return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{
/**
 * outputs the terminal user's userName
 */
Core_Cmds_whoami = function() {
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    this.results = OS.user.userName;
    this.params.term.echo(this.results);
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
};
// }}}


// {{{ Core_Cmds_outputResults
/**
 * generic output function for many of the core commands (processes the results 
 * of a Core_Vfs action
 * @param Object results the request response
 * @param int status the request status code
 * @access  public
 * @return void
 */
Core_Cmds_outputResults = function(results, status, dontSetStatus) {
  var output = status != SRAOS.AJAX_STATUS_SUCCESS && !this.params.argv['quiet'] ? (results ? results : OS.getString(SRAOS.SYS_ERROR_RESOURCE)) : '';
  if (status == SRAOS.AJAX_STATUS_SUCCESS) {
    for(var i in results) {
    if (!this.params.argv['quiet'] && ((this.params.argv['verbose'] && (results[i] === true || results[i] === false)) || (this.params.argv['changes'] && results[i] === true))) {
        output += this.params.term.removeRelativePrefix(i) + (this.params.argv['verbose'] ? ' (' + results[i] + ')' : '') + '\n';
      }
      else if (!this.params.argv['quiet'] && SRAOS_Util.isString(results[i])) {
        output += this.app.getApplication().getId() + ': ' + results[i] + '\n';
      }
    }
  }
  this.params.term.echo(output);
  this.results = results;
  if (!dontSetStatus) { this.status = SRAOS_ApplicationManager.STATUS_TERMINATED; }
};
// }}}
