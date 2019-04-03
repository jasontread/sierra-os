/* =================================================================================================
 * TransMenu 
 * March, 2003
 *
 * Customizable multi-level animated DHTML menus with transparency.
 *
 * Copyright 2003-2004, Aaron Boodman (www.youngpup.net)
 * =================================================================================================
 * "Can I use this?"
 * 
 * Use of this library is governed by the Creative Commons Attribution 2.0 License. You can check it 
 * out at: http://creativecommons.org/licenses/by/2.0/
 *
 * Basically: You may copy, distribute, and eat this code as you wish. But you must give me credit 
 * for writing it. You may not misrepresent yourself as the author of this code.
 * =================================================================================================
 * "It's kinda hard to read, though"
 *
 * The uncompressed, commented version of this script can be found at: 
 * http://youngpup.net/projects/transMenus
 * =================================================================================================
 * updates:
 * 04.19.04 fixed cascade problem with menus nested greater than two levels.
 * 12.23.03 added hideCurrent for menu actuators with no menus. renamed to TransMenu.
 * 04.18.03	fixed render bug in IE 5.0 Mac by removing that browser from compatibility table ;)
 *			also made gecko check a little more strict by specifying build no.
 * ============================================================================================== */



//==================================================================================================
// Configuration properties
//==================================================================================================
TransMenu.spacerGif = "lib/transmenus/x.gif";                     // path to a transparent spacer gif
TransMenu.dingbatOn = "lib/transmenus/submenu-on.gif";            // path to the active sub menu dingbat
TransMenu.dingbatOff = "lib/transmenus/submenu-off.gif";          // path to the inactive sub menu dingbat
TransMenu.dingbatSize = 14;                            // size of the dingbat (square shape assumed)
TransMenu.menuPadding = 5;                             // padding between menu border and items grid
TransMenu.itemPadding = 3;                             // additional padding around each item
TransMenu.shadowSize = 2;                              // size of shadow under menu
TransMenu.shadowOffset = 3;                            // distance shadow should be offset from leading edge
TransMenu.shadowColor = "#888";                        // color of shadow (transparency is set in CSS)
TransMenu.shadowPng = "lib/transmenus/grey-40.png";               // a PNG graphic to serve as the shadow for mac IE5
TransMenu.backgroundColor = "#ddd";                   // color of the background (transparency set in CSS)
TransMenu.backgroundPng = "lib/transmenus/white-90.png";          // a PNG graphic to server as the background for mac IE5
TransMenu.hideDelay = 500;                            // number of milliseconds to wait before hiding a menu
TransMenu.slideTime = 300;                             // number of milliseconds it takes to open and close a menu


//==================================================================================================
// Internal use properties
//==================================================================================================
TransMenu.reference = {topLeft:1,topRight:2,bottomLeft:3,bottomRight:4};
TransMenu.direction = {down:1,right:2,bottom:3,left:4};
TransMenu.registry = [];
TransMenu._maxZ = 1003;
TransMenu.defaultOffsetWidth = 100;



//==================================================================================================
// Static methods
//==================================================================================================
// supporting win ie5+, mac ie5.1+ and gecko >= mozilla 1.0
TransMenu.isSupported = function() {
        var ua = navigator.userAgent.toLowerCase();
		var pf = navigator.platform.toLowerCase();
        var an = navigator.appName;
        var r = false;

        if (ua.indexOf("gecko") > -1 && navigator.productSub >= 20020605) r = true; // gecko >= moz 1.0
        else if (an == "Microsoft Internet Explorer") {
                if (document.getElementById) { // ie5.1+ mac,win
                        if (pf.indexOf("mac") == 0) {
							r = /msie (\d(.\d*)?)/.test(ua) && Number(RegExp.$1) >= 5.1;
						}
						else r = true;
                }
        }

        return r;
};

// call this in onload once menus have been created
TransMenu.initialize = function() {
        for (var i = 0, menu = null; menu = this.registry[i]; i++) {
                menu.initialize();
        }
};

// call this in document body to write out menu html
TransMenu.renderAll = function() {
        var aMenuHtml = [];
        for (var i = 0, menu = null; menu = this.registry[i]; i++) {
                aMenuHtml[i] = menu.toString();
        }
        document.write(aMenuHtml.join(""));
};

//==================================================================================================
// TransMenu constructor (only called internally)
//==================================================================================================
// oActuator            : The thing that causes the menu to be shown when it is mousedover. Either a
//                        reference to an HTML element, or a TransMenuItem from an existing menu.
// iDirection           : The direction to slide out. One of TransMenu.direction.
// iLeft                : Left pixel offset of menu from actuator
// iTop                 : Top pixel offset of menu from actuator
// iReferencePoint      : Corner of actuator to measure from. One of TransMenu.referencePoint.
// parentMenuSet        : Menuset this menu will be added to.
// event                : the event that should result in the menu being displayed. the default 
//                        event is onmouseover. you may alternatively pick onclick or ondblclick etc
//==================================================================================================
function TransMenu(oActuator, iDirection, iLeft, iTop, iReferencePoint, parentMenuSet, event) {
    this.isTransMenu = true;
    
    // set the event when the menu should appear
    oActuator.menuEvent = event ? event : "onmouseover";
    oActuator.baseMenuEvent = oActuator.menuEvent;
    
    // public methods
    this.addItem = addItem;
    this.addDivider = addDivider;
    this.changeActuatorEvent = changeActuatorEvent;
    this.addMenu = addMenu;
    this.toString = toString;
    this.initialize = initialize;
    this.isOpen = false;
    this.show = show;
    this.hide = hide;
    this.items = [];

    // events
    this.onactivate = new Function();       // when the menu starts to slide open
    this.ondeactivate = new Function();     // when the menu finishes sliding closed
    this.onmouseover = new Function();      // when the menu has been moused over
    this.onqueue = new Function();          // hack .. when the menu sets a timer to be closed a little while in the future
		this.ondequeue = new Function();

        // initialization
        this.index = TransMenu.registry.length;
        TransMenu.registry[this.index] = this;

        var id = "TransMenu" + this.index;
        var contentHeight = null;
        var contentWidth = null;
        var childMenuSet = null;
        var animating = false;
        var childMenus = [];
        var slideAccel = -1;
        var elmCache = null;
        var ready = false;
        var thisRef = this;
        var a = null;

        var pos = iDirection == TransMenu.direction.down ? "top" : (iDirection == TransMenu.direction.bottom ? "bottom" : (TransMenu.direction.right ? "left" : "right"));
        var dim = null;

        // private and public method implimentations
        function addItem(sText, sUrl, onClick) {
          var item = new TransMenuItem(sText, sUrl, onClick, this);
          item._index = this.items.length;
          this.items[item._index] = item;
          return item;
        }
        
        function addDivider() {
          var item = new TransMenuDivider();
          item._index = this.items.length;
          this.items[item._index] = item;
          return item;
        }
        
        function changeActuatorEvent(event) {
          event = event ? event : oActuator.baseMenuEvent;
          if (oActuator.menuEvent != event) {
            oActuator[oActuator.menuEvent] = null;
            oActuator.menuEvent = event;
            oActuator[oActuator.menuEvent] = actuator_mouseover;
          }
        }

        function addMenu(oMenuItem) {
                if (!oMenuItem.parentMenu == this) throw new Error("Cannot add a menu here");

                if (childMenuSet == null) childMenuSet = new TransMenuSet(TransMenu.direction.right, -5, 2, TransMenu.reference.topRight, parentMenuSet);

                var m = childMenuSet.addMenu(oMenuItem);

                childMenus[oMenuItem._index] = m;
                m.onmouseover = child_mouseover;
                m.ondeactivate = child_deactivate;
                m.onqueue = child_queue;
                m.ondequeue = child_dequeue;

                return m;
        }

        function initialize() {
                initCache();
                initEvents();
                initSize();
                ready = true;
        }

        function show() {
                //dbg_dump("show");
                if (ready) {
                        thisRef.isOpen = true;
                        animating = true;
                        setContainerPos();
                        elmCache["clip"].style.visibility = "visible";
                        elmCache["clip"].style.zIndex = TransMenu._maxZ++;
                        //dbg_dump("maxZ: " + TransMenu._maxZ);
                        slideStart();
                        thisRef.onactivate();
                }
        }

        function hide() {
                if (ready) {
                        thisRef.isOpen = false;
                        animating = true;

                        for (var i = 0, item = null; item = elmCache.item[i]; i++) 
                                dehighlight(item);

                        if (childMenuSet) childMenuSet.hide();

                        slideStart();
                        thisRef.ondeactivate();
                }
        }

        function setContainerPos() {
                var sub = oActuator.constructor == TransMenuItem; 
                var act = sub ? oActuator.parentMenu.elmCache["item"][oActuator._index] : oActuator; 
                var el = act;
                
                var x = 0;
                var y = 0;

                
                var minX = 0;
                var maxX = (window.innerWidth ? window.innerWidth : document.body.clientWidth) - parseInt(elmCache["clip"].style.width);
                var minY = 0;
                var maxY = (window.innerHeight ? window.innerHeight : document.body.clientHeight) - parseInt(elmCache["clip"].style.height);
                // add up all offsets... subtract any scroll offset
                while (sub ? el.parentNode.className.indexOf("transMenu") == -1 : el.offsetParent) {
                        x += el.offsetLeft;
                        y += el.offsetTop;

                        if (el.scrollLeft) x -= el.scrollLeft;
                        if (el.scrollTop) y -= el.scrollTop;
                        
                        el = el.offsetParent;
                }

                if (oActuator.constructor == TransMenuItem) {
                        x += parseInt(el.parentNode.style.left);
                        y += parseInt(el.parentNode.style.top);
                }

                switch (iReferencePoint) {
                        case TransMenu.reference.topLeft:
                                break;
                        case TransMenu.reference.topRight:
                                x += act.offsetWidth > 0 ? act.offsetWidth : TransMenu.defaultOffsetWidth;
                                break;
                        case TransMenu.reference.bottomLeft:
                                y += act.offsetHeight;
                                break;
                        case TransMenu.reference.bottomRight:
                                x += act.offsetWidth > 0 ? act.offsetWidth : TransMenu.defaultOffsetWidth;
                                y += act.offsetHeight;
                                break;
                }

                x += iLeft;
                y += iTop;

                x = Math.max(Math.min(x, maxX), minX);
                y = Math.max(Math.min(y, maxY), minY);

                elmCache["clip"].style.left = x + "px";
                elmCache["clip"].style.top = y + "px";
        }

        function slideStart() {
                var x0 = parseInt(elmCache["content"].style[pos]);
                var x1 = thisRef.isOpen ? 0 : -dim;

                if (a != null) a.stop();
                a = new Accelimation(x0, x1, TransMenu.slideTime, slideAccel);

                a.onframe = slideFrame;
                a.onend = slideEnd;

                a.start();
        }

        function slideFrame(x) {
                elmCache["content"].style[pos] = x + "px";
        }

        function slideEnd() {
                if (!thisRef.isOpen) elmCache["clip"].style.visibility = "hidden";
                animating = false;
        }

        function initSize() {
                // everything is based off the size of the items table...
                var ow = elmCache["items"].offsetWidth > 0 ? elmCache["items"].offsetWidth : TransMenu.defaultOffsetWidth;
                var oh = elmCache["items"].offsetHeight;
                var ua = navigator.userAgent.toLowerCase();

                // clipping container should be ow/oh + the size of the shadow
                elmCache["clip"].style.width = ow + TransMenu.shadowSize +  2 + "px";
                elmCache["clip"].style.height = oh + TransMenu.shadowSize + 2 + "px";

                // same with content...
                elmCache["content"].style.width = ow + TransMenu.shadowSize + "px";
                elmCache["content"].style.height = oh + TransMenu.shadowSize + "px";

                contentHeight = oh + TransMenu.shadowSize;
                contentWidth = ow + TransMenu.shadowSize;
                
                dim = iDirection == TransMenu.direction.down ? contentHeight : contentWidth;

                // set initially closed
                elmCache["content"].style[pos] = -dim - TransMenu.shadowSize + "px";
                elmCache["clip"].style.visibility = "hidden";

                // if *not* mac/ie 5
                if (ua.indexOf("mac") == -1 || ua.indexOf("gecko") > -1) {
                        // set background div to offset size
                        elmCache["background"].style.width = ow + "px";
                        elmCache["background"].style.height = oh + "px";
                        elmCache["background"].style.backgroundColor = TransMenu.backgroundColor;

                        // shadow left starts at offset left and is offsetHeight pixels high
                        elmCache["shadowRight"].style.left = ow + "px";
                        elmCache["shadowRight"].style.height = oh - (TransMenu.shadowOffset - TransMenu.shadowSize) + "px";
                        elmCache["shadowRight"].style.backgroundColor = TransMenu.shadowColor;

                        // shadow bottom starts at offset height and is offsetWidth - shadowOffset 
                        // pixels wide (we don't want the bottom and right shadows to overlap or we 
                        // get an extra bright bottom-right corner)
                        elmCache["shadowBottom"].style.top = oh + "px";
                        elmCache["shadowBottom"].style.width = ow - TransMenu.shadowOffset + "px";
                        elmCache["shadowBottom"].style.backgroundColor = TransMenu.shadowColor;
                }
                // mac ie is a little different because we use a PNG for the transparency
                else {
                        // set background div to offset size
                        elmCache["background"].firstChild.src = TransMenu.backgroundPng;
                        elmCache["background"].firstChild.width = ow;
                        elmCache["background"].firstChild.height = oh;

                        // shadow left starts at offset left and is offsetHeight pixels high
                        elmCache["shadowRight"].firstChild.src = TransMenu.shadowPng;
                        elmCache["shadowRight"].style.left = ow + "px";
                        elmCache["shadowRight"].firstChild.width = TransMenu.shadowSize;
                        elmCache["shadowRight"].firstChild.height = oh - (TransMenu.shadowOffset - TransMenu.shadowSize);

                        // shadow bottom starts at offset height and is offsetWidth - shadowOffset 
                        // pixels wide (we don't want the bottom and right shadows to overlap or we 
                        // get an extra bright bottom-right corner)
                        elmCache["shadowBottom"].firstChild.src = TransMenu.shadowPng;
                        elmCache["shadowBottom"].style.top = oh + "px";
                        elmCache["shadowBottom"].firstChild.height = TransMenu.shadowSize;
                        elmCache["shadowBottom"].firstChild.width = ow - TransMenu.shadowOffset;
                }
        }
        
        function initCache() {
                var menu = document.getElementById(id);
                var all = menu.all ? menu.all : menu.getElementsByTagName("*"); // IE/win doesn't support * syntax, but does have the document.all thing

                elmCache = {};
                elmCache["clip"] = menu;
                elmCache["item"] = [];
                
                for (var i = 0, elm = null; elm = all[i]; i++) {
                        switch (elm.className) {
                                case "items":
                                case "content":
                                case "background":
                                case "shadowRight":
                                case "shadowBottom":
                                        elmCache[elm.className] = elm;
                                        break;
                                case "item":
                                        elm._index = elmCache["item"].length;
                                        elmCache["item"][elm._index] = elm;
                                        break;
                                case "itemDivider":
                                        elm._index = elmCache["item"].length;
                                        elmCache["item"][elm._index] = elm;
                                        break;
                        }
                }

                // hack!
                thisRef.elmCache = elmCache;
        }

        function initEvents() {
                // hook item mouseover
                for (var i = 0, item = null; item = elmCache.item[i]; i++) {
                  if (item.className != "itemDivider") {
                        item.onmouseover = item_mouseover;
                        item.onmouseout = item_mouseout;
                        item.onclick = item_click;
                  }
                }

                // hook actuation
                if (typeof oActuator.tagName != "undefined") {
                        oActuator[oActuator.menuEvent] = actuator_mouseover;
                        oActuator.onmouseout = actuator_mouseout;
                }

                // hook menu mouseover
                elmCache["content"].onmouseover = content_mouseover;
                elmCache["content"].onmouseout = content_mouseout;
        }

        function highlight(oRow) {
                oRow.className = "item hover";
                if (childMenus[oRow._index]) 
                        oRow.lastChild.firstChild.src = TransMenu.dingbatOn;
        }

        function dehighlight(oRow) {
                oRow.className = "item";
                if (childMenus[oRow._index]) 
                        oRow.lastChild.firstChild.src = TransMenu.dingbatOff;
        }

        function item_mouseover() {
                if (!animating) {
                        if (!this.itemIsDisabled)
                          highlight(this);

                        if (childMenus[this._index]) 
                                childMenuSet.showMenu(childMenus[this._index]);
                        else if (childMenuSet) childMenuSet.hide();
                }
        }

        function item_mouseout() {
                if (!animating) {
                        if (childMenus[this._index])
                                childMenuSet.hideMenu(childMenus[this._index]);
                        else {
                          if (!this.itemIsDisabled)
                                dehighlight(this);
                        }
                }
        }

        function item_click() {
                if (!animating) {
                        if (thisRef.items[this._index].onClick)
                            eval(thisRef.items[this._index].onClick);
                        if (thisRef.items[this._index].url) 
                            location.href = thisRef.items[this._index].url;
                        parentMenuSet.hideAll();
                }
        }

        function actuator_mouseover() {
          parentMenuSet.showMenu(thisRef);
        }

        function actuator_mouseout() {
          parentMenuSet.hideMenu(thisRef);
        }

        function content_mouseover() {
                if (!animating) {
                        parentMenuSet.showMenu(thisRef);
                        thisRef.onmouseover();
                }
        }

        function content_mouseout() {
                if (!animating) {
                        parentMenuSet.hideMenu(thisRef);
                }
        }

        function child_mouseover() {
                if (!animating) {
                        parentMenuSet.showMenu(thisRef);
                }
        }

        function child_deactivate() {
                for (var i = 0; i < childMenus.length; i++) {
                        if (childMenus[i] == this) {
                                dehighlight(elmCache["item"][i]);
                                break;
                        }
                }
        }

        function child_queue() {
                parentMenuSet.hideMenu(thisRef);
        }

		function child_dequeue() {
				parentMenuSet.showMenu(thisRef);
		}

        function toString() {
                var aHtml = [];
                var sClassName = "transMenu" + (oActuator.constructor != TransMenuItem ? " top" : "");

                for (var i = 0, item = null; item = this.items[i]; i++) {
                        aHtml[i] = item.toString(childMenus[i]);
                }

                return '<div id="' + id + '" class="' + sClassName + '">' + 
                        '<div class="content"><table class="items" cellpadding="0" cellspacing="0" border="0">' + 
                        '<tr><td colspan="2"><img src="' + TransMenu.spacerGif + '" width="1" height="' + TransMenu.menuPadding + '"></td></tr>' + 
                        aHtml.join('') + 
                        '<tr><td colspan="2"><img src="' + TransMenu.spacerGif + '" width="1" height="' + TransMenu.menuPadding + '"></td></tr></table>' + 
                        '<div class="shadowBottom"><img src="' + TransMenu.spacerGif + '" width="1" height="1"></div>' + 
                        '<div class="shadowRight"><img src="' + TransMenu.spacerGif + '" width="1" height="1"></div>' + 
		        '<div class="background"><img src="' + TransMenu.spacerGif + '" width="1" height="1"></div>' + 
	                '</div></div>';
        }
}


//==================================================================================================
// TransMenuSet
//==================================================================================================
// iDirection           : The direction to slide out. One of TransMenu.direction.
// iLeft                : Left pixel offset of menus from actuator
// iTop                 : Top pixel offset of menus from actuator
// iReferencePoint      : Corner of actuator to measure from. One of TransMenu.referencePoint.
// parentMenuSet        : the parent menu set
//==================================================================================================
TransMenuSet.registry = [];

TransMenuSet.resetActuatorEvents = function(index, force) {
  if (TransMenuSet.registry[index] && (TransMenuSet.registry[index].resetActuatorEvents || force)) {
    TransMenuSet.registry[index].changeActuatorEvents();
  }
};

function TransMenuSet(iDirection, iLeft, iTop, iReferencePoint, parentMenuSet) {
        // public methods
        this.addMenu = addMenu;
        this.showMenu = showMenu;
        this.hideMenu = hideMenu;
        this.hide = hide;
        this.hideCurrent = hideCurrent;
        this.hideAll = hideAll;
        this.parentMenuSet = parentMenuSet;
        this.changeActuatorEvents = changeActuatorEvents;

        // initialization
        var menus = [];
        var thisRef = this;
        var current = null;

        this.index = TransMenuSet.registry.length;
        TransMenuSet.registry[this.index] = this;

        // method implimentations...
        function addMenu(oActuator, event) {
                var m = new TransMenu(oActuator, iDirection, iLeft, iTop, iReferencePoint, this, event);
                menus[menus.length] = m;
                return m;
        }
        
        function changeActuatorEvents(event) {
          for(var i=0; i<menus.length; i++) {
            menus[i].changeActuatorEvent(event);
          }
        }

        function showMenu(oMenu) {
          this.resetActuatorEvents = false;
          this.changeActuatorEvents("onmouseover");
          if (oMenu != current) {
                  // close currently open menu
                  if (current != null) hide(current);        

                  // set current menu to this one
                  current = oMenu;

                  // if this menu is closed, open it
                  oMenu.show();
          }
          else {
                  // hide pending calls to close this menu
                  cancelHide(oMenu);
          }
        }

        function hideMenu(oMenu) {
          //dbg_dump("hideMenu a " + oMenu.index);
          if (current == oMenu && oMenu.isOpen) {
                  //dbg_dump("hideMenu b " + oMenu.index);
                  if (!oMenu.hideTimer) scheduleHide(oMenu);
          }
        }

        function scheduleHide(oMenu) {
                //dbg_dump("scheduleHide " + oMenu.index);
                oMenu.onqueue();
                oMenu.hideTimer = window.setTimeout("TransMenuSet.registry[" + thisRef.index + "].hide(TransMenu.registry[" + oMenu.index + "])", TransMenu.hideDelay);
        }

        function cancelHide(oMenu) {
                //dbg_dump("cancelHide " + oMenu.index);
                if (oMenu.hideTimer) {
						oMenu.ondequeue();
                        window.clearTimeout(oMenu.hideTimer);
                        oMenu.hideTimer = null;
                }
        }

        function hide(oMenu) {   
          if (!oMenu && current) oMenu = current;

          if (oMenu && current == oMenu && oMenu.isOpen) {
                  hideCurrent();
          }
          this.resetActuatorEvents = true;
          setTimeout("TransMenuSet.resetActuatorEvents(" + this.index + ")", 500);
        }
        
        function hideAll() {
          for(var i=0; i<menus.length; i++) {
            this.hide(menus[i]);
          }
          if (this.parentMenuSet) {
            this.parentMenuSet.hideAll();
          }
          setTimeout("TransMenuSet.resetActuatorEvents(" + this.index + ", true)", 500);
        }

        function hideCurrent() {
          if (null != current) {
            cancelHide(current);
            current.hideTimer = null;
            current.hide();
            current = null;
          }
        }
}

//==================================================================================================
// TransMenuItem (internal)
// represents an item in a dropdown
//==================================================================================================
// sText        : The item display text
// sUrl         : URL to load when the item is clicked
// onClick      : javascript to invoke when this item is clicked
// oParent      : Menu this item is a part of
//==================================================================================================
function TransMenuItem(sText, sUrl, onClick, oParent) {
  this._id = "TransMenuItem" + TransMenuItem._nextId++;
  this._enabled = true;
  this.isTransMenuItem = true;
  this.toString = toString;
  this.text = sText;
  this.url = sUrl;
  this.onClick = onClick;
  this.parentMenu = oParent;
  
  /**
	 * the onclick function for this menu item. only set when the button is first 
   * disabled
	 * @type function
	 */
	this._onClickBase = null;
  
  function toString(bDingbat) {
          var sDingbat = bDingbat ? TransMenu.dingbatOff : TransMenu.spacerGif;
          var iEdgePadding = TransMenu.itemPadding + TransMenu.menuPadding;
          var sPaddingLeft = "padding:" + TransMenu.itemPadding + "px; padding-left:" + iEdgePadding + "px;";
          var sPaddingRight = "padding:" + TransMenu.itemPadding + "px; padding-right:" + iEdgePadding + "px;";

          return '<tr id="' + this._id + 'Row" class="item"><td nowrap style="' + sPaddingLeft + '"><span id="' + this._id + '">' + 
                  sText + '</span></td><td width="14" style="' + sPaddingRight + '">' + 
                  '<img src="' + sDingbat + '" width="14" height="14"></td></tr>';
  }
  
  /**
   * disables this menu item
   */
  this.disable = function() {
    if (this._enabled) {
      this._onClickBase = this.onClick;
      this.onClick = null;
      this._enabled = false;
      document.getElementById(this._id).style.opacity = ".4";
      document.getElementById(this._id + "Row").style.cursor = "default";
      document.getElementById(this._id + "Row").itemIsDisabled = true;
      return true;
    }
    return false;
  };
  
  /**
   * enables this menu item
   */
  this.enable = function() {
    if (!this._enabled) {
      this.onClick = this._onClickBase;
      this._enabled = true;
      document.getElementById(this._id).style.opacity = "1";
      document.getElementById(this._id + "Row").style.cursor = null;
      document.getElementById(this._id + "Row").itemIsDisabled = false;
      return true;
    }
    return false;
  };
  
  /**
   * sets the menu item text
   */
  this.setText = function(text) {
    document.getElementById(this._id).innerHTML = text;
  };
}

TransMenuItem._nextId = 1;


function TransMenuDivider() {
        this.toString = toString;
        function toString() {
          return '<tr class="itemDivider"><td colspan="2">' + 
                  '<div style="background: ' + TransMenu.shadowColor + '; height: 1px; margin: 3px 0 3px 0; opacity: .4" ></div></td></tr>';
        }
}






//=====================================================================
// Accel[erated] [an]imation object
// change a property of an object over time in an accelerated fashion
//=====================================================================
// obj  : reference to the object whose property you'd like to animate
// prop : property you would like to change eg: "left"
// to   : final value of prop
// time : time the animation should take to run
// zip	: optional. specify the zippiness of the acceleration. pick a 
//		  number between -1 and 1 where -1 is full decelerated, 1 is 
//		  full accelerated, and 0 is linear (no acceleration). default
//		  is 0.
// unit	: optional. specify the units for use with prop. default is 
//		  "px".
//=====================================================================
// bezier functions lifted from the lib_animation.js file in the 
// 13th Parallel API. www.13thparallel.org
//=====================================================================

function Accelimation(from, to, time, zip) {
	if (typeof zip  == "undefined") zip  = 0;
	if (typeof unit == "undefined") unit = "px";

        this.x0         = from;
        this.x1		= to;
	this.dt		= time;
	this.zip	= -zip;
	this.unit	= unit;
	this.timer	= null;
	this.onend	= new Function();
        this.onframe    = new Function();
}



//=====================================================================
// public methods
//=====================================================================

// after you create an accelimation, you call this to start it-a runnin'
Accelimation.prototype.start = function() {
	this.t0 = new Date().getTime();
	this.t1 = this.t0 + this.dt;
	var dx	= this.x1 - this.x0;
	this.c1 = this.x0 + ((1 + this.zip) * dx / 3);
	this.c2 = this.x0 + ((2 + this.zip) * dx / 3);
	Accelimation._add(this);
};

// and if you need to stop it early for some reason...
Accelimation.prototype.stop = function() {
	Accelimation._remove(this);
};



//=====================================================================
// private methods
//=====================================================================

// paints one frame. gets called by Accelimation._paintAll.
Accelimation.prototype._paint = function(time) {
	if (time < this.t1) {
		var elapsed = time - this.t0;
	        this.onframe(Accelimation._getBezier(elapsed/this.dt,this.x0,this.x1,this.c1,this.c2));
        }
	else this._end();
};

// ends the animation
Accelimation.prototype._end = function() {
	Accelimation._remove(this);
        this.onframe(this.x1);
	this.onend();
};




//=====================================================================
// static methods (all private)
//=====================================================================

// add a function to the list of ones to call periodically
Accelimation._add = function(o) {
	var index = this.instances.length;
	this.instances[index] = o;
	// if this is the first one, start the engine
	if (this.instances.length == 1) {
		this.timerID = window.setInterval("Accelimation._paintAll()", this.targetRes);
	}
};

// remove a function from the list
Accelimation._remove = function(o) {
	for (var i = 0; i < this.instances.length; i++) {
		if (o == this.instances[i]) {
			this.instances = this.instances.slice(0,i).concat( this.instances.slice(i+1) );
			break;
		}
	}
	// if that was the last one, stop the engine
	if (this.instances.length == 0) {
		window.clearInterval(this.timerID);
		this.timerID = null;
	}
};

// "engine" - call each function in the list every so often
Accelimation._paintAll = function() {
	var now = new Date().getTime();
	for (var i = 0; i < this.instances.length; i++) {
		this.instances[i]._paint(now);
	}
};


// Bezier functions:
Accelimation._B1 = function(t) { return t*t*t };
Accelimation._B2 = function(t) { return 3*t*t*(1-t) };
Accelimation._B3 = function(t) { return 3*t*(1-t)*(1-t) };
Accelimation._B4 = function(t) { return (1-t)*(1-t)*(1-t) };


//Finds the coordinates of a point at a certain stage through a bezier curve
Accelimation._getBezier = function(percent,startPos,endPos,control1,control2) {
	return endPos * this._B1(percent) + control2 * this._B2(percent) + control1 * this._B3(percent) + startPos * this._B4(percent);
};


//=====================================================================
// static properties
//=====================================================================

Accelimation.instances = [];
Accelimation.targetRes = 10;
Accelimation.timerID = null;


//=====================================================================
// IE win memory cleanup
//=====================================================================

if (window.attachEvent) {
	var cearElementProps = [
		'data',
		'onmouseover',
		'onmouseout',
		'onmousedown',
		'onmouseup',
		'ondblclick',
		'onclick',
		'onselectstart',
		'oncontextmenu'
	];

	window.attachEvent("onunload", function() {
        var el;
        for(var d = document.all.length;d--;){
            el = document.all[d];
            for(var c = cearElementProps.length;c--;){
                el[cearElementProps[c]] = null;
            }
        }
	});
}