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
 * Guess My Number game
 */
Accessories_GuessMyNumber = function() {
  
  /**
   * the attempt counter
   * @type int
   */
  this._guesses = 0;
  
  /**
   * the max # of guesses allowed
   * @type int
   */
  this._maxAttempts;
  
  /**
   * the random number that was picked
   * @type int
   */
  this._number;
  
  /**
   * the accessories plugin
   * @type SRAOS_Plugin
   */
  this._plugin = OS.getPlugin('accessories');
   
	// {{{ run
	/**
   * @access  public
	 * @return int
	 */
	this.run = function() {
    var min = this.params.argv.min * 1;
    var max = this.params.argv.max * 1;
    this._maxAttempts = this.params.argv.attempts * 1;
    if (!min || !max || min >= max) {
      this.status = false;
      this.params.term.echo(this._plugin.getString('guessMyNumber.invalidRange'));
      return SRAOS_ApplicationManager.STATUS_TERMINATED;
    }
    this._number = SRAOS_Util.randomInt(min, max);
    this.params.term.echo(this._plugin.getString('guessMyNumber.intro1') + ' ' + min + ' ' + this._plugin.getString('guessMyNumber.intro2') + ' ' + max + this._plugin.getString('guessMyNumber.intro3') + ' ' + this._maxAttempts + ' ' + this._plugin.getString('guessMyNumber.intro4'));
    return SRAOS_ApplicationManager.STATUS_WAIT;
	};
	// }}}
  
  
	// {{{ input
	/**
	 * invoked when the user guesses a number
   * @param String input the input provided by the user
   * @access  public
	 * @return int
	 */
	this.input = function(input) {
    this._guesses++;
    if (input == this._number) {
      this.params.term.echo(this._plugin.getString('guessMyNumber.success1') + ' ' + this._guesses + ' ' + this._plugin.getString('guessMyNumber.success2'));
    }
    else if (this._guesses == this._maxAttempts) {
      this.params.term.echo(this._plugin.getString('guessMyNumber.maxAttempts1') + ' ' + this._maxAttempts + ' ' + this._plugin.getString('guessMyNumber.maxAttempts2') + ' ' + this._number);
    }
    else {
      this.params.term.echo(this._plugin.getString('guessMyNumber.tryAgain1') + ' ' + this._plugin.getString('guessMyNumber.tryAgain2-' + (input < this._number ? '1' : '2')) + ' ' + this._plugin.getString('guessMyNumber.tryAgain3') + ' ' + (this._maxAttempts - this._guesses) + ' ' + this._plugin.getString('guessMyNumber.tryAgain4'));
      return SRAOS_ApplicationManager.STATUS_WAIT;
    }
		return SRAOS_ApplicationManager.STATUS_TERMINATED;
	};
	// }}}
  
};
// }}}
