// {{{ Header
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
// }}}

// {{{ SRAOS_CliArg
/**
 * defines a single command line argument. it is used in cli applications (see 
 * 'cli' attribute definition in SRAOS_Application). it facilitates argument 
 * validation, parsing and description within the core Terminal application. 
 * each argument is a name/value pair. the value may be either boolean or a text 
 * value. the arguments specified by the user when the cli application is 
 * executed will be passed to that application in the params.argv hash: 
 * sudocode- 'argv[[cli-arg key]] = [value]' (value will be true or false only 
 * for boolean arguments. arguments are provided by the user in either a short 
 * or long form where the long form uses the format: '--[key][=value]' and the 
 * short form uses the format '-[abbr-char][ value]'. the only exception to this 
 * rule is for freeform arguments (see 'freeform' attribute api below). [value] 
 * is only required for non-boolean arguments.
 * 
 * only the arguments explicitely specified for a cli application will be passed 
 * to that application in params.argv. however, params.args will also be 
 * provided. thus, to implement an alternative argument model, cli-arg elements 
 * should not be specified
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
SRAOS_CliArg = function(id, abbr, isBool, defaultValue, freeform, manEntry, matchName, matchValue, multiple, required) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the identifier for this argument. this will be the value by which is may be 
   * referenced in the argv hash. it should not contain any non-alphanumeric 
   * characters other than a dash
	 * @type string
	 */
	this._id = id;
  
  /**
	 * a single alphanumeric character abbreviation for this argument. this is the 
   * value by which the argument may be specified by the user in short form as 
   * described above. as with $_id, it MUST be unique within the its application. 
   * abbr IS case-sensitive. if not specified, the short form will not be 
   * allowed for this argument
	 * @type char
	 */
	this._abbr = abbr;
  
  /**
	 * whether or not this is a boolean argument. the [value] portion of boolean 
   * arguments is not required. if a boolean argument is specified in either 
   * short or long form without a value it will be assumed to be true. if a 
   * value is specified, only 0 will be considered non-true
	 * @type boolean
	 */
	this._boolean = isBool;
  
  /**
   * the default value for this argument. if true, this argument will ALWAYS be 
   * included in argv with either this value if it was not provided by the user, 
   * or the user provided value otherwise. if false, this argument will ONLY be 
   * included in argv if it was provided by the user. set to 0 for false, 1 for 
   * true for boolean arguments
   * @type string
   */
  this._default = defaultValue;
  
  /**
   * whether or not this argument is freeform. freeform arguments are those not 
   * entered using the short or long form specified above and whose hash index 
   * is defined by the user. a cli application can only have 1 freeform 
   * argument. free form arguments use the format: '[name][=value]'. the value 
   * for a freeform argument in argv will be a name/value pair in the form of a 
   * hash: sudocode - 'argv[[key]]={[name]: [value]}'. if 'multiple' is true, 
   * the value will be an array of name/value pairs: 
   * [{[name1]: [value1], ..., [nameN]: [valueN]"]. to support non-boolean 
   * freeform argument values 'boolean' MUST be changed to true. boolean 
   * freeform values will be converted to arrays of keys when multiple is true, 
   * and a single string when it is not
   */
  this._freeform = freeform;
  
  /**
   * the resource to use to describe this argument in the application man entry
   * @type string
   */
  this._manEntry = manEntry;
  
  /**
   * a regular expression to apply against the name values for freeform 
   * arguments. not applicable to non-freeform arguments. if a name value fails 
   * to match this regex the application will not be executed and a relevant 
   * error message will be displayed
   * @type string
   */
  this._matchName = matchName;
  
  /**
   * a regular expression to apply against the value(s) provided for this 
   * argument. if a value fails to match this regex the application will not be 
   * executed and a relevant error message will be displayed. ignored for 
   * 'boolean' arguments. if not specified for non-boolean arguments, any value 
   * will be allowed
   * @type string
   */
  this._matchValue = matchValue;
  
  /**
   * can the user provide multiple instances of this argument? if true, the 
   * value in the argv hash will always be an array. only non-boolean and 
   * freeform arguments support this option
   * @type boolean
   */
  this._multiple = multiple;
  
  /**
   * is this argument required for execution of the application
   * @type boolean
   */
  this._required = required;
	
  // }}}
  
  // {{{ Operations
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this plugin
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getAbbr
	/**
	 * returns the abbr of this plugin
   * @access  public
	 * @return string
	 */
	this.getAbbr = function() {
		return this._abbr;
	};
	// }}}
  
	// {{{ isBoolean
	/**
	 * returns the boolean of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isBoolean = function() {
		return this._boolean;
	};
	// }}}
  
	// {{{ getDefault
	/**
	 * returns the default of this plugin
   * @access  public
	 * @return string
	 */
	this.getDefault = function() {
		return this._default;
	};
	// }}}
  
	// {{{ isFreeform
	/**
	 * returns the freeform of this plugin
   * @access  public
	 * @return freeform
	 */
	this.isFreeform = function() {
		return this._freeform;
	};
	// }}}
  
	// {{{ getManEntry
	/**
	 * returns the manEntry of this plugin
   * @access  public
	 * @return string
	 */
	this.getManEntry = function() {
		return this._manEntry;
	};
	// }}}
  
	// {{{ getMatchName
	/**
	 * returns the matchName of this plugin
   * @access  public
	 * @return string
	 */
	this.getMatchName = function() {
		return this._matchName;
	};
	// }}}
  
	// {{{ getMatchValue
	/**
	 * returns the matchValue of this plugin
   * @access  public
	 * @return string
	 */
	this.getMatchValue = function() {
		return this._matchValue;
	};
	// }}}
  
	// {{{ isMultiple
	/**
	 * returns the multiple of this plugin
   * @access  public
	 * @return multiple
	 */
	this.isMultiple = function() {
		return this._multiple;
	};
	// }}}
  
	// {{{ isRequired
	/**
	 * returns the required of this plugin
   * @access  public
	 * @return required
	 */
	this.isRequired = function() {
		return this._required;
	};
	// }}}
	
  
  // private operations
  
  
};

// static functions

// {{{ parseArgs
/**
 * parses an argument string based on the cli arguments definition specified 
 * in cliArgs. returns a hash containing two values: 'argv' and 'argc' if 
 * successful or an error message (String) if args is not valid based on the 
 * cliArgs definition provided or if it fails to parse. this method uses 
 * recursive descent parsing based on the following grammar:
 *  G=<N,T,P,S>
 *  N={args,arg,name,abbr,key,val,str,chars,alphanum,spaces}
 *  T={-,=, ,',",EOL}
 *  S=ARGS
 *  P=
 *    <args>    ::= [<ws><arg>]*EOL
 *    <arg>     ::= --<name>|--<name>|--<name>=<val>|-<abbr>|-<abbr><ws><val>|<key>|<key>=<val>
 *    <name>    ::= <str> (parse tree leaf)
 *    <abbr>    ::= [a-zA-Z0-9] (regex) (parse tree leaf)
 *    <key>     ::= <str> (parse tree leaf)
 *    <val>     ::= <str> (parse tree leaf)
 *    <str>     ::= "<chars>"|'<chars>'|<nonws>
 *    <chars>   ::= .* (regex)
 *    <nonws>   ::= [^\s = ]* (regex) (whitespace can be inserted if preceded by a backslash)
 *    <ws>      ::= \s+ (regex)
 * @param String args the arguments string to parse
 * @param SRAOS_CliArg[] args the cli arguments definition
 * @param Array environment a hash containing all of the current environment 
 * variables. these will be converted where they exist within args
 * @return Object
 */
SRAOS_CliArg.parseArgs = function(args, cliArgs, environment) {
  var plugin = OS.getPlugin('core');
  var argv = new Array();
  var argc = 0;
  
  var parser;
  if (cliArgs && cliArgs.length > 0 && SRAOS_Util.isString(args)) {
    parser = new SRAOS_CliArgParser(args);
    parser.run();
  }
  if (parser && parser.failed) {
    return plugin.getString('Terminal.error.failedToParseArgs');
  }
  else {
    /*
    var tmp = '';
    for(var n in parser.parseTree.args) {
      var tmp1 = '';
      for(var i in parser.parseTree.args[n]) {
        tmp1 += i + '=' + parser.parseTree.args[n][i] + ',';
      }
      tmp += n + '=' + tmp1 + '\n';
    }
    alert(tmp);
    */
    
    var freeformArgCnt = 0;
    for(var i in cliArgs) {
      cliArgs[i].freeformCnt = cliArgs[i].isFreeform() ? freeformArgCnt++ : null;
      var argVals = new Array();
      var argCount = 0;
      if (parser && parser.parseTree.args && parser.parseTree.args.length > 0) {
        var freeformPtr = 0;
        for(var n in parser.parseTree.args) {
          var val = parser.parseTree.args[n].val ? (cliArgs[i].isBoolean() ? (parser.parseTree.args[n].val == '0' ? false : true) : parser.parseTree.args[n].val) : (cliArgs[i].getDefault() !== null ? cliArgs[i].getDefault() : true);
          // freeform
          if (cliArgs[i].isFreeform() && parser.parseTree.args[n].key && ((!cliArgs[i].isMultiple() && freeformPtr == cliArgs[i].freeformCnt) || (cliArgs[i].isMultiple() && freeformPtr >= cliArgs[i].freeformCnt))) {
            parser.parseTree.args[n].key += cliArgs[i].isBoolean() && parser.parseTree.args[n].val ? '=' + parser.parseTree.args[n].val : '';
            argVals[parser.parseTree.args[n].key] = val;
            argCount++;
          }
          // match abbreviation or name
          else if (!cliArgs[i].isFreeform() && ((parser.parseTree.args[n].abbr && parser.parseTree.args[n].abbr == cliArgs[i].getAbbr()) || (parser.parseTree.args[n].name && parser.parseTree.args[n].name == cliArgs[i].getId()))) {
            argVals.push(val);
            // work around for boolean abbreviated arguments followed by a freeform value
            if (cliArgs[i].isBoolean() && parser.parseTree.args[n].val && SRAOS_Util.isString(parser.parseTree.args[n].val) && parser.parseTree.args[n].val != '0' && parser.parseTree.args[n].val != '1') {
              parser.parseTree.args[n].key = parser.parseTree.args[n].val;
              parser.parseTree.args[n].val = null;
            }
            argCount++;
          }
          // increment freeform pointer
          if (parser.parseTree.args[n].key) {
            freeformPtr++;
          }
        }
      }
      
      // set default value
      if (cliArgs[i].getDefault() !== null && !argCount) {
        argVals.push(cliArgs[i].getDefault());
        argCount++;
      }
      // validate required
      if (cliArgs[i].isRequired() && !argCount) {
        return cliArgs[i].getId() + ' ' + plugin.getString('Terminal.error.argIsRequired');
      }
      // convert environment variables
      if (argCount > 0 && ((cliArgs[i].isFreeform() || !cliArgs[i].isBoolean()) && environment)) {
        var newArgVals = new Array();
        var isArray = SRAOS_Util.isArray(argVals);
        for(var n in argVals) {
          n = !isArray ? SRAOS_CliArg.subEnvironmentVar(n, environment) : n;
          newArgVals[n] = SRAOS_CliArg.subEnvironmentVar(argVals[n], environment);
        }
        argVals = newArgVals;
      }
      // validate name values
      if (cliArgs[i].isFreeform() && cliArgs[i].getMatchName()) {
        var regex = new RegExp(cliArgs[i].getMatchName());
        for(var name in argVals) {
          if (!regex.test(name)) {
            return cliArgs[i].getId() + ' ' + plugin.getString('Terminal.error.notProperlyFormatted') + ': ' + name + ' (' + cliArgs[i].getMatchName() + ')';
          }
        }
      }
      // validate values
      if (!cliArgs[i].isBoolean() && cliArgs[i].getMatchValue()) {
        var regex = new RegExp(cliArgs[i].getMatchValue());
        for(var id in argVals) {
          if (!regex.test(argVals[id])) {
            return cliArgs[i].getId() + ' ' + plugin.getString('Terminal.error.notProperlyFormatted') + ': ' + argVals[id] + ' (' + cliArgs[i].getMatchValue() + ')';
          }
        }
      }
      // multiple values not allowed
      if (argCount > 1 && !cliArgs[i].isMultiple()) {
        return plugin.getString('Terminal.error.multipleValuesNotAllowed') + ' ' + cliArgs[i].getId();
      }
      // convert boolean freeform values
      if (cliArgs[i].isFreeform() && cliArgs[i].isBoolean()) {
        // convert to an array of strings
        if (cliArgs[i].isMultiple()) {
          var newArgVals = new Array();
          for(var val in argVals) {
            newArgVals.push(val);
          }
          argVals = newArgVals;
        }
        // convert to a single value
        else {
          var val;
          for(val in argVals) { break; }
          argVals = val;
        }
      }
      if (argCount > 0) {
        argv[cliArgs[i].getId()] = cliArgs[i].isMultiple() || cliArgs[i].isFreeform() ? argVals : argVals[0];
        argc += argCount;
      }
    }
  }
  return { "argv": argv, "argc": argc };
};

// static methods

// {{{ subEnvironmentVar
/**
 * substitutes any environment variables in val (environment variables begin 
 * with $
 * 
 * @param String val the value to check
 * @param Array environment the environment to check in. this is a hash 
 * containing the name/value pairs to check in for substitution
 * @return String
 */
SRAOS_CliArg.subEnvironmentVar = function(val, environment) {
  if (environment && SRAOS_Util.isString(val)) {
    for(var name in environment) {
      val = val.replace(new RegExp('\\$' + name, "gim"), environment[name]);
    }
  }
  return val;
};
// }}}

// }}}


// {{{ SRAOS_CliArgParser
/**
 * implements the top-down recursive descent parser used by 
 * SRAOS_CliArg.parseArgs
 * 
 * @param String str the string to parse
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
SRAOS_CliArgParser = function(str) {
  /**
   * whether or not a parse error occurred
   * @type boolean
   */
  this.failed = false;
  
  /**
   * the parse tree generated from args
   * @type Object
   */
  this.parseTree;
  
  
  /**
   * the string to parse
   * @type String
   */
  this._parseStr = str;
  
  /**
   * pointer the current token in str being evaluated
   * @type int
   */
  this._ptr = 0;
  
  /**
   * this stack pointing to the current working location in this.parseTree
   * @type Object
   */
  this._stack;
  
  
  /**
   * parses <abbr> ::= [a-zA-Z0-9] (regex) [parse tree leaf]
   * @return void
   */
   this.abbr = function() {
     this._stack.push('abbr');
     if (SRAOS_CliArgParser.ALPHA.test(this.token())) {
       this.push(this.token());
       this.next();
     }
     else {
       throw new Error("this.abbr: " + this.token() + " is not alphanumeric");
     }
     this._stack.pop();
   };
  
  /**
   * parses <args> ([<ws><arg>]*EOL)
   * @return void
   */
   this.args = function() {
     var counter = 0;
     this._stack.push('args');
     this.ws();
     while(!this.eol()) {
       this._stack.push(counter++);
       this.arg();
       if (!this.eol() && this.token() != ' ') {
         throw new Error("this.args: " + this.token() + " encountered. expecting a space");
       }
       this.ws();
       this._stack.pop();
     }
     this._stack.pop();
   };
   
  /**
   * parses <arg> ::= --<name>|--<name>|--<name>=<val>|-<abbr>|-<abbr><ws><val>|<key>|<key>=<val>
   * @return void
   */
   this.arg = function() {
     if (this.token() == '-' && this.token(1) == '-') {
       this.next(); this.next();
       this.name();
       if (!this.eol() && this.token() == '=') {
         this.next();
         this.val();
       }
     }
     else if (this.token() == '-') {
       this.next();
       this.abbr();
       if (!this.eol() && this.token() == ' ') {
         this.ws();
         !this.eol() && this.token() != '-' ? this.val() : this._ptr--; 
       }
     }
     else {
       this.key();
       if (this.token() == '=') {
         this.next();
         this.val();
       }
     }
   };
   
  /**
   * parses <chars> ::= .* (regex)
   * @param char end the end delimeter ('|")
   * @return void
   */
   this.chars = function(end) {
     var str = '';
     var skipNextEndCheck = false;
     while((skipNextEndCheck || this.token() != end) && /^.$/.test(this.token())) {
       // escape character
       if (this.token() == '\\' && this.token(1) == end) {
         skipNextEndCheck = true;
         this.next();
         continue;
       }
       skipNextEndCheck = false;
       str+= this.token();
       this.next();
       if (this.eol()) { throw new Error("this.chars: end delimeter " + end + " was not found"); }
     }
     this.push(str);
   };
   
   /**
    * returns true if this._ptr is currently at the EOL or this._parseStr
    * @return boolean
    */
   this.eol = function() {
     return !this._parseStr.length || this._ptr >= this._parseStr.length;
   };
   
   /**
    * returns the parse tree index string for the stack location specified. this 
    * string can be eval'd to return or set a particular parse tree value
    * @param int stackEnd the ending stack location. if null, the parse tree 
    * index string will be for the full stack
    * @return String
    */
   this.getEvalParseTreeStr = function(stackEnd) {
     stackEnd = stackEnd !== null ? stackEnd : this._stack.length - 1;
     var evalStr = 'this.parseTree';
     for(i=0; i<=stackEnd; i++) {
       var numeric = this._stack[i] + 0 == this._stack[i] ? true : false;
       evalStr += '[' + (numeric ? '' : '"') + this._stack[i] + (numeric ? '' : '"') + ']';
     }
     return evalStr;
   };
   
  /**
   * returns true if the current token is a whitespace character
   * @param int advance the # of characters to peak ahead. default is 0
   * @return boolean
   */
   this.isWhitespace = function(advance) {
     var evalChar = this.token(advance);
     return !this.eol() && (evalChar == ' ' || /\s/.test(evalChar));
   };
   
  /**
   * parses <key> ::= <str> [parse tree leaf]
   * @return void
   */
   this.key = function() {
     this._stack.push('key');
     this.str();
     this._stack.pop();
   };
   
  /**
   * parses <name> ::= <str> [parse tree leaf]
   * @return void
   */
   this.name = function() {
     this._stack.push('name');
     this.str();
     this._stack.pop();
   };
   
  /**
   * advances this._ptr to the next token and returns that token
   * @param int advance the # of characters to advance ahead. default is 1
   * @return char
   */
   this.next = function(advance) {
     advance = advance ? advance : 1;
     for(var i=0; i<advance; i++) {
       this._ptr++;
     }
     return this.token();
   };
   
  /**
   * parses <nonws> ::= [^\s =]* (regex) (whitespace can be inserted if preceded by a backslash)
   * @return void
   */
   this.nonws = function() {
     var str = '';
     while(!this.eol() && !this.isWhitespace() && this.token() != '=') {
       var ws = this.token() == BACKSLASH_CHAR && this.isWhitespace(1) ? true : false;
       str+= this.token(ws ? 1 : 0);
       this.next(ws ? 2 : 1);
     }
     this.push(str);
   };
   
  /**
   * returns the current value in the parse tree based on the current stack 
   * location (this._stack). returns null if there is no value in the current 
   * stack location
   * @return String
   */
   this.peak = function() {
     var cur = this.parseTree;
     for(var i=0; i<this._stack.length; i++) {
       if (!cur[this._stack[i]]) {
         return null;
       }
       cur = cur[this._stack[i]];
     }
     return cur;
   };
   
  /**
   * pushes val to the current location (this._stack) in this.parseTree
   * @param String val the value to push
   * @return void
   */
   this.push = function(val) {
     for(var i=0; i<this._stack.length-1; i++) {
       var evalStr = this.getEvalParseTreeStr(i);
       if (!eval(evalStr)) {
         eval(evalStr + '=new Array()');
       }
     }
     eval(this.getEvalParseTreeStr(null) + '=val');
   };
   
  /**
   * parses this._parseStr and populates this.parseTree
   * @return void
   */
   this.run = function() {
     this.failed = this._parseStr.replace ? false : true;
     this.parseTree = new Array();
     this._stack = new Array();
     if (!this.failed) {
       try {
         this._ptr = 0;
         this.args();
       }
       catch (e) {
         this.failed = true;
       }
     }
   };
   
  /**
   * parses <str> ::= "<chars>"|'<chars>'|<nonws>
   * @return void
   */
   this.str = function() {
     var token = this.token();
     switch(token) {
       case '"':
       case "'":
         this.next();
         this.chars(token);
         this.next();
         break;
       default:
         this.nonws();
     }
   };
   
  /**
   * returns the current parse token
   * @param int advance the # of characters to peak ahead. default is 0
   * @return char
   */
   this.token = function(advance) {
     return this.eol() ? null : this._parseStr[this._ptr + (advance ? advance : 0)];
   };
   
  /**
   * parses <val> ::= <str> [parse tree leaf]
   * @return void
   */
   this.val = function() {
     this._stack.push('val');
     this.str();
     this._stack.pop();
   };
   
  /**
   * parses <ws> ::= \s+ (regex)
   * @return void
   */
   this.ws = function() {
     while(!this.eol() && this.isWhitespace()) {
       this.next();
     }
   };
};

// constants
/**
 * alphanumeric regular expression
 * @type RegEx
 */
SRAOS_CliArgParser.ALPHA = /^[\da-zA-Z]$/;

// }}}
