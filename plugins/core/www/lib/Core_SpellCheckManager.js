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
 * manager for the spellchecker window
 */
Core_SpellCheckManager = function() {
  
  /**
   * reference to the add button
   * @type Object
   */
  this._btnAdd;
  
  /**
   * reference to the change button
   * @type Object
   */
  this._btnChange;
  
  /**
   * reference to the change all button
   * @type Object
   */
  this._btnChangeAll;
  
  /**
   * reference to the ignore button
   * @type Object
   */
  this._btnIgnore;
  
  /**
   * reference to the ignore all button
   * @type Object
   */
  this._btnIgnoreAll;
  
  /**
   * the callback method to invoke each time a spelling correction is made. this 
   * method will accept 1 parameter which is the corrected string
   * @type String
   */
  this._callback;
  
  /**
   * the manager containing the callback method to invoke each time the user 
   * makes a spelling correction
   * @type SRAOS_WindowManager
   */
  this._callbackTarget;
  
  /**
   * reference to the input field containing the correction
   * @type Object
   */
  this._change;
  
  /**
   * the current error being evaluated
   * @type Object
   */
  this._currentErr;
  
  /**
   * reference to the input field containing the dictionary list
   * @type Object
   */
  this._dictionary;
  
  /**
   * the # of words that were mispelled (the # of values in this._results)
   * @type int
   */
  this._errorCount = 0;
  
  /**
   * the index of the error that is currently being evaluated
   * @type int
   */
  this._errorIndex = 0;
  
  /**
   * the field that this spellcheck window instance has been initiated for
   * @type Object
   */
  this._field;
  
  /** 
   * whether or not str is html formatted
   * @type boolean
   */
  this._html = false;
  
  /**
   * reference to the phrase div
   * @type Object
   */
  this._phrase;
  
  /**
   * the # of uncorrected spelling errors
   * @type int
   */
  this._remainingErrors = 0;
  
  /**
   * stores the results returned by the spellcheck operation
   * @type Array
   */
  this._results;
  
  /**
   * the string that is being spellchecked
   * @type String
   */
  this._str;
  
  /**
   * reference to the select field containing the suggestions
   * @type Object
   */
  this._suggestions;
  
  
	// {{{ add
	/**
	 * same as ignoreAll but permanently adds the current mispelled word to the 
   * user's dictionary
   * @access  public
	 * @return void
	 */
	this.add = function() {
    OS.ajaxInvokeService("core_updateUser", this, "_add", null, new SRAOS_AjaxRequestObj(OS.user.uid, { "customDictionary": this._currentErr.word }));
    this.ignoreAll();
	};
	// }}}
  
  
	// {{{ change
	/**
	 * changes the current spelling error to the value in the correction field
   * @param boolean skipLoad whether or not to skip the load next error call
   * @access  public
	 * @return void
	 */
	this.change = function(skipLoad) {
    this._currentErr.fixed = true;
    this._remainingErrors--;
    this._str = this._str.substring(0, this._currentErr.offset) + this._change.value + this._str.substring(this._currentErr.offset + this._currentErr.word.length, this._str.length);
    
    // adjust proceding offsets
    var diff = this._currentErr.word.length - this._change.value.length;
    var started = false;
    for(var n=0; n<this._results.length; n++) {
      if (started) {
        this._results[n].offset -= diff;
      }
      else if (this._results[n] == this._currentErr) {
        started = true;
      }
    }
    this._errorIndex++;
    if (!skipLoad) {
      if (this._field) {
        this._field.value = this._str;
      }
      else {
        this._callbackTarget[this._callback](this._str);
      }
      this._loadNextError(); 
    }
	};
	// }}}
  
  
	// {{{ changeAll
	/**
	 * changes all instance of the current spelling error to the value in the 
   * correction field
   * @access  public
	 * @return void
	 */
	this.changeAll = function() {
    for(var i=0; i<this._results.length; i++) {
      if (!this._results[i].fixed && this._results[i].word == this._currentErr.word) {
        this._currentErr = this._results[i];
        this.change(true);
      }
    }
    if (this._field) {
      this._field.value = this._str;
    }
    else {
      this._callbackTarget[this._callback](this._str);
    }
    this._loadNextError(); 
	};
	// }}}
  
  
	// {{{ ignore
	/**
	 * ignores the current spelling error
   * @param boolean skipLoad whether or not to skip the load next error call
   * @access  public
	 * @return void
	 */
	this.ignore = function(skipLoad) {
    this._currentErr.fixed = true;
    this._remainingErrors--;
    this._errorIndex++;
    if (!skipLoad) { this._loadNextError(); }
	};
	// }}}
  
  
	// {{{ ignoreAll
	/**
	 * ignores all instances of the current spelling error
   * @access  public
	 * @return void
	 */
	this.ignoreAll = function() {
    for(var i=0; i<this._results.length; i++) {
      if (!this._results[i].fixed && this._results[i].word == this._currentErr.word) {
        this._currentErr = this._results[i];
        this.ignore(true);
      }
    }
    this._loadNextError();
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
    if (params) {
      if (params.field) {
        this._str = params.field.value;
        this._field = params.field;
      }
      else {
        this._str = params.str;
        this._callback = params.callback;
        this._html = params.html;
      }
    }
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
    var divId = this.win.getDivId();
    this._btnAdd = document.getElementById(divId + "core_sc_add");
    this._btnChange = document.getElementById(divId + "core_sc_change");
    this._btnChangeAll = document.getElementById(divId + "core_sc_changeAll");
    this._btnIgnore = document.getElementById(divId + "core_sc_ignore");
    this._btnIgnoreAll = document.getElementById(divId + "core_sc_ignoreAll");
    this._callbackTarget = this.win.getModalTarget().getManager();
    this._change = this.win.getFormField("core_sc_change");
    this._dictionary = this.win.getFormField("coreDictionary");
    this._dictionary.value = OS.user.coreDictionary;
    this._phrase = this.win.getDomElements({ className: "core_sc_phrase" })[0];
    this._suggestions = this.win.getFormField("suggestions");
    this._suggestions.size = 6;
    this._suggestions._change = this._change;
    this._suggestions.onchange = function() {
      this._change.value = this.value;
      this._change.focus();
      this._change.select();
    };
    this._dictionary._manager = this;
    this._dictionary.onchange = function() {
      this._manager._run();
    };
    if (this._str && (this._field || this._callback)) {
      this._run();
    }
    else {
      this._spellcheckComplete();
    }
    return true;
  };
  // }}}
  
  
	// {{{ updateDictionary
	/**
	 * updates the user's default dictionary
   * @access  public
	 * @return void
	 */
	this.updateDictionary = function() {
    if (this.win.isDirty('coreDictionary')) {
      this.win.setStatusBarText(this.win.getPlugin().getString("SpellChecker.text.updatingDefaultDictionary"));
      OS.ajaxInvokeService("core_updateUser", this, "_updateDictionary", null, new SRAOS_AjaxRequestObj(OS.user.uid, { coreDictionary: this._dictionary.value }));
      this.win.setDirtyFlags('coreDictionary');
      OS.user.coreDictionary = this._dictionary.value;
    }
	};
	// }}}
  
  
  // private methods
  
  // {{{ _add
  /**
   * handles the response of an ajax request to add a word to the user's custom 
   * dictionary
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._add = function(response) {
    if (this.win.isClosed()) { return; }
    
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("SpellChecker.error.unableToAddWordToCustomDictionary"), response);
    }
  };
  // }}}
  
  
  // {{{ _spellcheckComplete
  /**
   * invoked when the spellcheck corrections have been completed
   * @access  public
	 * @return void
	 */
  this._spellcheckComplete = function() {
    this._phrase.innerHTML = "<font class='core_sc_complete'>" + this.win.getPlugin().getString("SpellChecker.text.complete") + "</font>";
    this._btnAdd.disabled = true;
    this._btnChange.disabled = true;
    this._btnChangeAll.disabled = true;
    this._btnIgnore.disabled = true;
    this._btnIgnoreAll.disabled = true;
    this._change.value = "";
    this._change.disabled = true;
    SRAOS_Util.clearSelectField(this._suggestions);
    this._suggestions.disabled = true;
    this._errorCount = 0;
  };
  // }}}
  
  
  // {{{ _loadNextError
  /**
   * loads the current spelling error, or sets completion status if no errors 
   * remain
   * @access  public
	 * @return void
	 */
  this._loadNextError = function() {
    if (this._remainingErrors > 0) {
      for(var i=0; i<this._results.length; i++) {
        var idx = i + this._errorIndex;
        if (idx >=this._results.length) {
          idx = 0;
          this._errorIndex = 0;
        }
        if (!this._results[idx].fixed) {
          this._currentErr = this._results[idx];
          break;
        }
      }
      
      var preOffset = this._results[idx].offset - 15;
      preOffset = preOffset < 0 ? 0 : preOffset;
      var postOffset = this._currentErr.offset + this._currentErr.word.length + 15;
      postOffset = postOffset > this._str.length ? this._str.length : postOffset;
      
      this._phrase.innerHTML = this._str.substring(preOffset, this._currentErr.offset) + "<font class='core_sc_error'>" + this._currentErr.word + "</font>" + this._str.substring(this._currentErr.offset + this._currentErr.word.length, postOffset);
      
      var changeVal = this._currentErr.word;
      SRAOS_Util.clearSelectField(this._suggestions);
      var options = new Array();
      if (this._currentErr.suggestions) {
        var started = false;
        for(var i in this._currentErr.suggestions) {
          var selected = false;
          if (!started) {
            selected = true;
            changeVal = this._currentErr.suggestions[i];
          }
          var opt = document.createElement('option');
          opt.text = this._currentErr.suggestions[i];
          opt.value = this._currentErr.suggestions[i];
          opt.selected = selected;
          options.push(opt);
          started = true;
        }
      }
      else {
        var opt = document.createElement('option');
        opt.text = this.win.getPlugin().getString("text.none");
        opt.value = this._currentErr.word;
        options.push(opt);
      }
      SRAOS_Util.addOptionsToSelectField(this._suggestions, options);
      this._change.value = changeVal;
      this._change.focus();
      this._change.select();
    }
    else {
      this._spellcheckComplete();
    }
    this._resetStatusBar();
  };
  // }}}
  
  
  // {{{ _processResults
  /**
   * handles the response of an ajax request to retrieve new mail
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._processResults = function(response) {
    if (this.win.isClosed()) { return; }
    
    this.win.syncFree();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("SpellChecker.error.unableToPerformSpellcheck"), response);
      OS.closeWindow(this.win);
    }
    else {
      this._results = new Array();
      this._errorCount = 0;
      for(var i in response.results) {
        for(var n=0; n<response.results[i].offsets.length; n++) {
          this._errorCount++;
          this._results.push({ "word" : response.results[i].word, "offset" : response.results[i].offsets[n], "suggestions" : (response.results[i].suggestions ? response.results[i].suggestions : null), "fixed" : false });
        }
      }
      this._results = SRAOS_Util.sort(this._results, 'offset');
      this._remainingErrors = this._errorCount;
      this._errorIndex = 0;
      this._loadNextError();
    }
  };
  // }}}
  
  
  // {{{ _resetStatusBar
  /**
   * resets the status bar text used to 
   * @access  public
	 * @return void
	 */
  this._resetStatusBar = function() {
    if (this._errorCount > 0) {
      this.win.setStatusBarText(this.win.getPlugin().getString("SpellChecker.text.displayingSpellError") + ' ' + (this._errorIndex+1) + ' ' + this.win.getPlugin().getString("text.of") + ' ' + this._errorCount);
    }
    else {
      this.win.clearStatusBarText();
    }
  };
  // }}}
  
  
  // {{{ _run
  /**
   * performs the spellcheck
   * @access  public
	 * @return void
	 */
  this._run = function() {
    this.win.syncWait(this.win.getPlugin().getString("SpellChecker.text.checkingSpelling"), "closeWindow");
    var params = new Array(new SRAOS_AjaxServiceParam('str', this._str), new SRAOS_AjaxServiceParam('lang', this._dictionary.value), new SRAOS_AjaxServiceParam('html', this._dictionary._html));
    OS.ajaxInvokeService("core_spellcheck", this, "_processResults", null, null, params);
  };
  // }}}
  
  
  // {{{ _updateDictionary
  /**
   * handles the response of an ajax request to retrieve new mail
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._updateDictionary = function(response) {
    if (this.win.isClosed()) { return; }
    
    this._resetStatusBar();
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("SpellChecker.error.unableToSetDefaultDictionary"), response);
    }
  };
  // }}}
  
};

