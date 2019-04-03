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
 * javascript class providing misc core services functionality. for more info, 
 * see also Core_Services.php
 */
Core_Services = function() {
  
};

/**
 * the name of the global ajax service for converting wiki markup to html
 * @type String
 */
Core_Services.SERVICE_WIKI_TO_HTML = 'core_wikiToHtml';


// {{{ spellcheck
/**
 * used to spellcheck text within a field
 * @param Object field a reference to the field to spellcheck
 * @param boolean html whether or not str is html formatted (html tags will be 
 * ignored)
 * @return void
 */
Core_Services.spellcheck = function(field, html) {
  OS.launchWindow('core', 'SpellCheckWin', { "field": field, "html": html });
};
// }}}


// {{{ spellcheckCallback
/**
 * used to spellcheck text using a callback
 * @param String str the text to spellcheck
 * @param String callback the name of the method in the current running app or 
 * window manager that should be invoked whenever a spelling change is made. the 
 * signature for this method should be (newStr : String) : void where newStr is 
 * the entired corrected string
 * @param boolean html whether or not str is html formatted (html tags will be 
 * ignored)
 * @return void
 */
Core_Services.spellcheckCallback = function(str, callback, html) {
  OS.launchWindow('core', 'SpellCheckWin', { "str": str, "callback": callback, "html": html });
};
// }}}


// {{{ displayWikiHelp
/**
 * displays the wiki formatting help topic
 * @return void
 */
Core_Services.displayWikiHelp = function() {
  OS.launchApplication('core', 'HelpManual', { 'library': OS.getPlugin('core').getHelpTopic('WikiHelp') } );
};
// }}}

// }}}
