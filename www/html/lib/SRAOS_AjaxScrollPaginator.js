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

// {{{ SRAOS_AjaxScrollPaginator
/**
 * adds scroll event driven pagination to a multiple value rendering div. this 
 * is accomplished by adding a scroll event handler to the div that will 
 * automatically refresh the contents of the div based on the current scroll 
 * position utilizing an ajax service to retrieve the corresponding values. the 
 * div container will always be filled with the maximum # of values it can 
 * accomodate. it will then be padded with blank space to simulate the behavior 
 * of the div containing all of the values. for example, if the total # of 
 * values is 10,000, and the div container can display only 25 at any given time 
 * based on it's current height (offsetHeight), then when the div is first 
 * rendered, those 25 initial values will be visible, and blank padding equal to 
 * the size of 9,975 additional values will automatically be added below those 
 * values. this will result in the browser rendering the appropriate scrollbar 
 * for those # of values. as the user scrolls down the padding will be adjusted 
 * so that it is added to both the top and the bottom of the items that are 
 * displayed. from the user's perspective (minus any lag time for ajax service 
 * invocations), it will appear as if the div contained all of the values from 
 * the start. they will not need to click on any "previous", "next" or page 
 * number links to manually navigate through the values
 * 
 * @param String id see api comments below
 * @param Div div see api comments below
 * @param String service see api comments below
 * @param int rowHeight see api comments below
 * @param Object callbackObj see api comments below
 * @param String errorCallback see api comments below
 * @param int buffer see api comments below
 * @param String headerRenderer see api comments below
 * @param String headerHtml see api comments below
 * @param String footerHtml see api comments below
 * @param String itemRenderer see api comments below
 * @param String waitCallback see api comments below
 * @param String waitHtml see api comments below
 * @param String releaseCallback see api comments below
 * @param String postDisplayCallback see api comments below
 * @param String paramsCallback see api comments below
 * @param String constraintsCallback see api comments below
 * @param String excludeAttrsCallback see api comments below
 * @param String includeAttrsCallback see api comments below
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_AjaxScrollPaginator = function(id, div, service, rowHeight, callbackObj, errorCallback, buffer, headerRenderer, headerHtml, footerHtml, itemRenderer, waitCallback, releaseCallback, postDisplayCallback, paramsCallback, constraintsCallback, excludeAttrsCallback, includeAttrsCallback) {
  // {{{ Attributes
  // public attributes
  
  // private attributes
  
  /**
   * the unique id for this instance. used to deal with synchronization issues
   * @type int
   */
  this._instanceId = SRAOS_AjaxScrollPaginator.idCounter++;
  
  /**
   * whether or not this paginator has a current ajax request pending
   * @type boolean
   */
  this._ajaxRequestPending = false;
  
  /**
	 * the # of page up/down buffered values to keep. this will increase 
   * scrollilng performance but potentially increase service invocation times. 
   * if not specified, no buffer will be applied. by applying a buffer, the 
   * pagination object will automatically retrieve enough extra (non-visible) 
   * values for the user to be able to pageUp/pageDown "buffer" times without 
   * having to wait for the ajax service to be invoked and return values. it is 
   * highly recommended to apply a buffer of at least 1
	 * @type int
	 */
	this._buffer = buffer;
  
  /**
   * a reference to the object containing all of the callback/renderer methods 
   * specified for this paginator
   * @type Object
   */
  this._callbackObj = callbackObj;
  
  /**
   * whether or not to cancel the next display for a pending ajax request
   * @type boolean
   */
  this._cancelNextLoadDisplay = false;
  
  /**
	 * a method that will determine any constraints to apply to the service 
   * invocation. this only applies to entity type ajax services. this function 
   * should have the following signature:
   * constraintsCallback(String : id) : SRAOS_AjaxConstraintGroup[]
	 * @type String
	 */
	this._constraintsCallback = constraintsCallback;
  
  /**
	 * the container to which the scroll pagination should be added
	 * @type Div
	 */
	this._div = div;
  
  /**
	 * this parameter specifies the function to invoke if an ajax service 
   * invocation failure occurs. it should have the following signature: 
   * errorCallback(String id, Div : div) : void
   * where id is the paginator id and div is the paginator div. if not 
   * specified, a generic error message will be displayed in a javascript 
   * alert
	 * @type String
	 */
	this._errorCallback = errorCallback;
  
  /**
	 * function that will return the attributes to "exclude" from the ajax service 
   * invocation (see SRAOS::ajaxInvokeService excludeAttrs param comments). this 
   * only applies to entity type services. this function should have the 
   * following signature:
   * excludeAttrsCallback(String : id) : String[]
	 * @type String
	 */
	this._excludeAttrsCallback = excludeAttrsCallback;
  
  /**
	 * optional html to append to the foot of the output (after all of the 
   * rendered items). this html should not consume any vertical space
	 * @type String
	 */
	this._footerHtml = footerHtml;
  
  /**
	 * a function that will return the html formatted header. if not specified, no 
   * header will be included. the header row must have the same rowHeight as the 
   * item rows. this method should have the following signature: 
   * headerRenderer(String : id) : String
   * the return value should include the line break (i.e. close tr). if used, 
   * headers will ALWAYS be visible and in the top position in the div
	 * @type String
	 */
	this._headerRenderer = headerRenderer;
  
  /**
	 * optional html to append to the head of the output (prior to the 
   * _headerRenderer output). this html should not consume any vertical space
	 * @type String
	 */
	this._headerHtml = headerHtml;
  
  /**
   * the identifier for this paginator. this value will be passed to all of the 
   * callback methods including errorCallback, excludeAttrsCallback, 
   * headerRenderer, includeAttrsCallback, itemRenderer, 
   * paramsCallback, postDisplayCallback, releaseCallback, and waitCallback. if 
   * not needed, set to null
   * @type String
   */
  this._id = id;
  
  /**
	 * function that will return the attributes to "include" in the ajax service 
   * invocation (see SRAOS::ajaxInvokeService includeAttrs param comments). this 
   * only applies to entity type services. this function should have the 
   * following signature:
   * includeAttrsCallback(String : id) : String[]
	 * @type String
	 */
	this._includeAttrsCallback = includeAttrsCallback;
  
  /**
   * this instances unique identifier. this is used to encode results to 
   * eliminate duplicate renderings
   * @type int
   */
  this._instanceId = SRAOS_AjaxScrollPaginator._INSTANCE_ID++;
  
  /**
	 * a function that will be invoked to render each of the value items returned 
   * in the results of invoking the "service". if not specified, the value items 
   * will be rendered as they are returned by the service. this method should 
   * have the following signature: 
   * itemRenderer(String : id, Object : item) : String
   * the return value should include the line break (i.e. close tr)
	 * @type String
	 */
	this._itemRenderer = itemRenderer;
  
  /**
	 * items that have been previously queried by this paginator. these will be 
   * ordered according to their position in the results. _items will be 
   * refreshed each time the render method is invoked. 
	 * @type Array
	 */
  this._items = new Array();
  
  /**
   * the total # of items in this pagination. this is the number of items 
   * without applying a limit or offset
   * @type int
   */
  this._itemsCount = -1;
  
  /**
	 * a method that will determine any ajax service params. this only applies to 
   * global ajax services. this function should have the following signature:
   * paramsCallback(String : id) : SRAOS_AjaxServiceParam[]
	 * @type String
	 */
	this._paramsCallback = paramsCallback;
  
  /**
	 * a method that will be invoked after any items are displayed in the 
   * paginated div. this method should have the following signature:
   * postDisplayCallback(String : id, Object[] : items) : void
   * where items, is an array of the objects that were displayed successfully
	 * @type String
	 */
  this._postDisplayCallback = postDisplayCallback;
  
  /**
	 * function to invoke after waitCallback once the values have been returned 
   * and rendered. ignored if waitCallback is not specified. this function 
   * should have the following signature:
   * waitCallback(String : id) : void
	 * @type String
	 */
	this._releaseCallback = releaseCallback;
  
  /**
   * whether or not this paginator has been rendered yet
   * @type boolean
   */
  this._rendered = false;
  
  /**
	 * the height of each value row (both header and values)
	 * @type int
	 */
	this._rowHeight = rowHeight;
  
  /**
	 * the # of items that should be displayed in the div at any given time
	 * @type int
	 */
	this._rows = Math.ceil(this._div.offsetHeight/this._rowHeight) - (this._headerRenderer ? 1 : 0);
  
  /**
	 * the name of the ajax service from which the values can be retrieved
	 * @type String
	 */
	this._service = service;
  
  /**
	 * function to invoke when the user has exceeded the buffer in a scroll event 
   * and the ajax service must be invoked in order to retrieve the necessary 
   * values to display. if not specified, the user will just see blank lines 
   * until the service returns and the appropriate values can be rendered. if 
   * specified, releaseCallback should also be specified. this function should 
   * have the following signature:
   * waitCallback(String : id) : void
	 * @type String
	 */
	this._waitCallback = waitCallback;
  
  // }}}
  
  // {{{ Operations
  
  // public 
  
	// {{{ cancelPendingRequests
	/**
	 * cancels any pending ajax requests (will cause the display function to not 
   * be invoked when the results are returned if a request is pending)
   * @access  public
	 * @return void
	 */
  this.cancelPendingRequests = function() {
    this._cancelNextLoadDisplay = this._ajaxRequestPending ? true : false;
  };
  // }}}
  
	// {{{ display
	/**
	 * attempts to display the items (or as many of them as possible) based on the 
   * div's current scroll state
   * @access  public
	 * @return void
	 */
  this.display = function() {
    var start = this.getStartPos();
    var end = this.getEndPos();
    var bufferTop = start * this._rowHeight;
    var ajaxScrollId = this._instanceId + "/" + start + "/" + end + "/" + this._rows;
    if (this._div.ajaxScrollId != ajaxScrollId) {
      var html = "";
      var bottom = end == this._itemsCount;
      var displayed = new Array();
      html += start > 0 ? "\n<div style='height: " + bufferTop + "px;'></div>" : "";
      html += this._headerHtml ? this._headerHtml + "\n" : "";
      html += this._headerRenderer ? this._callbackObj[this._headerRenderer](this._id) + "\n" : "";
      var incompleteDisplay = false;
      if (end) {
        for(var i=start; i<end; i++) {
          if (this._items[i]) {
            displayed.push(this._items[i]);
            html += this._itemRenderer ? this._callbackObj[this._itemRenderer](this._id, this._items[i]) : this._items[i];
            html += "\n";
          }
          else {
            incompleteDisplay = true;
          }
        }
      }
      html += this._footerHtml ? this._footerHtml + "\n" : "";
      var bufferBottom = (this._itemsCount - end) * this._rowHeight + ((end - start) >= (this._rows - 1) ? this._div.offsetHeight % this._rowHeight : 0);
      html += bufferBottom > 0 ? "\n<div style='height: " + bufferBottom + "px;'></div>" : "";
      this._div.ajaxScrollId = !incompleteDisplay ? ajaxScrollId : null;
      this._div.innerHTML = "<!-- " + ajaxScrollId + "-->\n" + html;
      if (this._postDisplayCallback && displayed.length) {
        this._callbackObj[this._postDisplayCallback](this._id, displayed);
      }
    }
    this._div.scrollTop = bufferTop;
  };
  // }}}
  
	// {{{ getEndPos
	/**
	 * returns the starting position based on the current scroll location
   * @access  public
	 * @return int
	 */
  this.getEndPos = function() {
    var start = this.getStartPos();
    return (this._rows + start) < this._itemsCount ? this._rows + start : this._itemsCount;
  };
  // }}}
  
	// {{{ getItem
	/**
	 * returns the first item with the specified matching property/value
   * @param String property the property to match
   * @param mixed  value the value of the property to match
	 * @return Object
	 */
  this.getItem = function(property, value) {
    for(var i in this._items) {
      if (this._items[i][property] == value) {
        return this._items[i];
      }
    }
    return null;
  };
  // }}}
  
	// {{{ getItems
	/**
	 * returns a reference to the current items for this paginator
   * @access  public
	 * @return Object[]
	 */
  this.getItems = function() {
    return this._items;
  };
  // }}}
  
	// {{{ getItemsCount
	/**
	 * returns the value of this._itemsCount
   * @access  public
	 * @return int
	 */
  this.getItemsCount = function() {
    return this._itemsCount;
  };
  // }}}
  
	// {{{ setItemsCount
	/**
	 * sets the value of this._itemsCount
   * @param int count the value to set
	 * @return int
	 */
  this.setItemsCount = function(count) {
    this._itemsCount = count;
  };
  // }}}
  
	// {{{ getStartPos
	/**
	 * returns the starting position based on the current scroll location
   * @access  public
	 * @return int
	 */
  this.getStartPos = function() {
    var scroll = this._div.scrollTop/this._rowHeight;
    var start = this._div._lastScrollTop && this._div._lastScrollTop > this._div.scrollTop ? Math.floor(scroll) : Math.ceil(scroll);
    if ((start + this._rows) == (this._itemsCount + 2)) {
      start--;
    }
    return start;
  };
  // }}}
  
	// {{{ loadItems
	/**
	 * attempts to load the appropriate items based on the current scroll position
   * returns true if the items are already loaded, false if an ajax service 
   * invocation was made to load them
   * @access  public
	 * @return boolean
	 */
  this.loadItems = function() {
    if (this._itemsCount == -1 || this._itemsCount > 0) {
      var start = this.getStartPos();
      var offset = start - (this._buffer ? this._buffer * this._rows : 0);
      var limit = this._rows + (this._buffer ? this._buffer * this._rows * 2 : 0) + (offset >= 0 ? 0 : offset);
      offset = offset >= 0 ? offset : 0;
      if (this._itemsCount != -1 && (limit + offset) > this._itemsCount) {
        limit = this._itemsCount - offset;
      }
      // see if items are already loaded
      var load = false;
      for(var i=offset; i<limit+offset; i++) {
        if (!this._items[i]) {
          offset = i;
          load = true;
          break;
        }
      }
      if (limit > 0 && load) {
        // alert("offset: " + offset + " limit: " + limit);
        if (SRAOS_AjaxScrollPaginator._invokeAjaxTimers[this._instanceId]) {
          clearTimeout(SRAOS_AjaxScrollPaginator._invokeAjaxTimers[this._instanceId]);
        }
        SRAOS_AjaxScrollPaginator._instances[this._instanceId] = this;
        SRAOS_AjaxScrollPaginator._invokeAjaxTimers[this._instanceId] = setTimeout("SRAOS_AjaxScrollPaginator.invokeAjaxLoad(" + this._instanceId + ", " + limit + ", " + offset + ")", SRAOS_AjaxScrollPaginator.INVOKE_AJAX_SERVICE_TIMEOUT);
        for(var i=this.getStartPos(); i<this.getEndPos(); i++) {
          if (!this._items[i]) {
            return false;
          }
        }
      }
    }
    return true;
  };
  // }}}
  
	// {{{ refresh
	/**
	 * this method refreshes the current view of paginated items including a 
   * re-calculation of the # of rows to display
   * @param int height an alternate height to use for the row calculation. if 
   * not specified, the offsetHeight of the div used by this paginator will be 
   * used
   * @access  public
	 * @return void
	 */
  this.refresh = function(height) {
    height = height ? height : this._div.offsetHeight;
    this._rows = Math.ceil(height/this._rowHeight) - (this._headerRenderer ? 1 : 0);
    if (this._rendered) { this.scroll(); }
  };
  // }}}
  
	// {{{ removeItem
	/**
	 * removes an item from this paginators' current items list and refreshes the 
   * view
   * @param Object item the object to remove
   * @param String property if the items managed by this ajax paginator are 
   * objects or associative arrays, this parameter can be specified to be used 
   * to determine equality between different arrays/objects. if specified, the 
   * properties will be compared instead of the instance references
   * @access  public
	 * @return void
	 */
  this.removeItem = function(item, property) {
    var baseCount = this._items.length;
    this._items = SRAOS_Util.removeFromArray(item, this._items, null, property);
    if (baseCount > this._items.length) {
      this._div.ajaxScrollId = null;
      this._itemsCount--;
      this.scroll();
    }
  };
  // }}}
  
	// {{{ render
	/**
	 * this method must be invoked when the div should be initially populated 
   * with values, or whenever its state changes. a state change includes such 
   * things as vertical resizing of the div, or any other related changes 
   * relevant to the values displayed in the div (changes to constraints, 
   * params, sorting, exclude/include attrs, etc.)
   * @access  public
	 * @return void
	 */
  this.render = function() { 
    this._div.paginator = this;
    this._div.onscroll = function() { this.paginator.scroll(); };
    this._div.innerHTML = "";
    this._div.ajaxScrollId = null;
    this._rendered = true;
    this.loadItems();
    this.display();
  };
  // }}}
  
	// {{{ reset
	/**
	 * this method resets any cached paginated items and re-displays
   * @param boolean display whether or not to display after resetting
   * @access  public
	 * @return void
	 */
  this.reset = function(display) { 
    this._itemsCount = -1;
    this._items = new Array();
    this._cancelNextLoadDisplay = false;
    if (display) { this.scroll(); }
  };
  // }}}
  
	// {{{ scroll
	/**
	 * handler for the div scroll events
   * @access  public
	 * @return void
	 */
  this.scroll = function() {
    if (this.loadItems()) {
      this.display();
    }
    this._div._lastScrollTop = this._div.scrollTop;
  };
  // }}}
  
  
  // private
	// {{{ _loadItems
	/**
	 * handles the response from a loadItems request
   * @access  public
	 * @return void
	 */
  this._loadItems = function(response) {
    SRAOS_AjaxScrollPaginator._ajaxRequestPending = false;
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      alert(SRAOS_Util.objToStr(response));
      this._errorCallback ? this._callbackObj[this._errorCallback](this._id, this._div) : alert(OS.getString('error.ajaxScrollPaginator'));
    }
    else {
      this._itemsCount = response.count;
      for(var i=0; i<response.results.length; i++) {
        this._items[response.offset + i] = response.results[i];
      }
      if (!this._cancelNextLoadDisplay) { this.display(); }
    }
    if (this._releaseCallback) { this._callbackObj[this._releaseCallback](this._id); }
    this._cancelNextLoadDisplay = false;
  };
  // }}}

};

// static variables and methods
/**
 * temporarily stores references to SRAOS_AjaxScrollPaginator instances 
 * currently waiting for an SRAOS_AjaxScrollPaginator.invokeAjaxLoad method 
 * invocation
 * @type SRAOS_AjaxScrollPaginator[]
 */
SRAOS_AjaxScrollPaginator._instances = new Array();

/**
 * the instance id counter
 * @type id
 */
SRAOS_AjaxScrollPaginator.idCounter = 1;

/**
 * the timer managing calls to invokeAjaxLoad. only 1 timer should be active at 
 * any given point
 * @type Timer
 */
SRAOS_AjaxScrollPaginator._invokeAjaxTimers = new Array();

// {{{ invokeAjaxLoad
/**
 * invokes an ajax service to load additional paginated items based on the limit 
 * and offset specified
 * @access  public
 * @return void
 */
SRAOS_AjaxScrollPaginator.invokeAjaxLoad = function(id, limit, offset) {
  //alert("Load: limit - " + limit + " offset - " + offset);
  SRAOS_AjaxScrollPaginator._invokeAjaxTimers[id] = null;
  SRAOS_AjaxScrollPaginator._instances[id]._ajaxRequestPending = true;
  if (SRAOS_AjaxScrollPaginator._instances[id]._waitCallback) { SRAOS_AjaxScrollPaginator._instances[id]._callbackObj[SRAOS_AjaxScrollPaginator._instances[id]._waitCallback](SRAOS_AjaxScrollPaginator._instances[id]._id); }
  OS.ajaxInvokeService(SRAOS_AjaxScrollPaginator._instances[id]._service, SRAOS_AjaxScrollPaginator._instances[id], "_loadItems", (SRAOS_AjaxScrollPaginator._instances[id]._constraintsCallback ? SRAOS_AjaxScrollPaginator._instances[id]._callbackObj[SRAOS_AjaxScrollPaginator._instances[id]._constraintsCallback](SRAOS_AjaxScrollPaginator._instances[id]._id) : null), null, (SRAOS_AjaxScrollPaginator._instances[id]._paramsCallback ? SRAOS_AjaxScrollPaginator._instances[id]._callbackObj[SRAOS_AjaxScrollPaginator._instances[id]._paramsCallback](SRAOS_AjaxScrollPaginator._instances[id]._id) : null), null, (SRAOS_AjaxScrollPaginator._instances[id]._excludeAttrsCallback ? SRAOS_AjaxScrollPaginator._instances[id]._callbackObj[SRAOS_AjaxScrollPaginator._instances[id]._excludeAttrsCallback](SRAOS_AjaxScrollPaginator._instances[id]._id) : null), (SRAOS_AjaxScrollPaginator._instances[id]._includeAttrsCallback ? SRAOS_AjaxScrollPaginator._instances[id]._callbackObj[SRAOS_AjaxScrollPaginator._instances[id]._includeAttrsCallback](SRAOS_AjaxScrollPaginator._instances[id]._id) : null), limit, offset);
  SRAOS_AjaxScrollPaginator._instances[id] = null;
};
// }}}

// constants
/**
 * the timeout milliseconds to apply when creating a timer for invokeAjaxLoad
 * @type int
 */
SRAOS_AjaxScrollPaginator.INVOKE_AJAX_SERVICE_TIMEOUT = 10;

/**
 * the height of a single page up/down scroll. this is the scroll value that 
 * firefox applies when the user clicks above or below the scroll bar. safari 
 * only applies a value os 62 pixels
 * @type int
 */
SRAOS_AjaxScrollPaginator.PAGE_HEIGHT = 87;

/**
 * used to track unique identifiers between different instances of 
 * SRAOS_AjaxScrollPaginator
 * @type int
 */
SRAOS_AjaxScrollPaginator._INSTANCE_ID = 0;

// }}}

