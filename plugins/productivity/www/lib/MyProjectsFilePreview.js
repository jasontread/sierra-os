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
 * this window is used to display a file preview. it requires the parameter 
 * 'file' which is the file hash including the 'preview' key returned from the 
 * MyProjects.SERVICE_GET_FILES ajax service
 */
MyProjectsFilePreview = function() {
  /**
   * the file that this window was opened for
   * @type Object
   */
  this._file;
  
  /**
   * the image object
   * @type Object
   */
  this._img;
  
  /**
   * the navigation div
   * @type Object
   */
  this._nav;
  
  /**
   * the current page number
   * @type int
   */
  this._pageNum = 0;
  
  
	// {{{ displayPage
	/**
	 * displays the page specified by pageNum
   * @param int pageNum the # of the page to display
   * @access public
	 * @return void
	 */
	this.displayPage = function(pageNum) {
    var label = this.plugin.getString('MyProjectsFilePreview.label', { name: this._file.name, pageNum: pageNum });
    this._img.alt = label;
    this._img.src = this._file.preview[pageNum-1].uri;
    this._img.title = label;
    var navHtml = '';
    if (pageNum > 1) {
      navHtml += '<a href="#" onclick="OS.getWindowInstance(this).getManager().back()">';
      navHtml += OS.getString('text.back');
      navHtml += '</a>';
    }
    else {
      navHtml += '<font>' + OS.getString('text.back') + '</font>';
    }
    navHtml += '<select onchange="OS.getWindowInstance(this).getManager().displayPage(this.value)" size="1">';
    for(var i in this._file.preview) {
      navHtml += '<option value="' + this._file.preview[i].pageNum + '"' + (this._file.preview[i].pageNum == pageNum ? ' selected="selected"' : '') + '>' + this._file.preview[i].pageNum + '</option>';
    }
    navHtml += '</select>';
    if (pageNum < this._file.preview.length) {
      navHtml += '<a href="#" onclick="OS.getWindowInstance(this).getManager().next()">';
      navHtml += OS.getString('text.next');
      navHtml += '</a>';
    }
    else {
      navHtml += '<font>' + OS.getString('text.next') + '</font>';
    }
    this._nav.innerHTML = navHtml;
    this._pageNum = pageNum;
  };
  // }}}
  
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
    this._file = this.params['file'];
    this._img = this.win.getElementById('myProjectsFilePreviewImg');
    this._nav = this.win.getElementById('myProjectsFilePreviewNav');
    var header = this.win.getElementById('myProjectsFilePreviewHeader');
    header.style.backgroundImage = 'url(' + SRAOS_Util.substituteParams(this._file.icon, {size: '32'}) + ')';
    header.innerHTML = this._file.name;
    if (this._file && this._file.preview) { this.next(); }
    if (this._file.preview.length == 1) { this._nav.style.display = 'none'; }
    return this._file && this._file.preview ? true : false;
  };
  // }}}
  
	// {{{ next
	/**
	 * displays the next page
   * @access public
	 * @return void
	 */
	this.next = function() {
    this.displayPage(this._pageNum < this._file.preview.length ? this._pageNum+1 : this._pageNum);
  };
  // }}}
  
	// {{{ back
	/**
	 * displays the back page
   * @access public
	 * @return void
	 */
	this.back = function() {
    this.displayPage(this._pageNum > 0 ? this._pageNum-1 : this._pageNum);
  };
  // }}}
};
// }}}
