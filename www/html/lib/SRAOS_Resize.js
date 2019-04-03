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

/*
 * allows right/downward resizing of a div. this script assumes that the handle 
 * is located in the bottom portion of the div and re-positions it accordingly 
 */
var SRAOS_Resize = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, noReset, xBuffer, yBuffer)
	{
		o.onmousedown	= SRAOS_Resize.start;

		o.root = oRoot;
    o.handle = o;
    if (typeof minX != 'undefined' && typeof minY != 'undefined') {      
      o.ondblclick = SRAOS_Resize.reset;
    }
    
		if (isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;
    o.baseWidth = parseInt(o.root.style.width);
    o.root.baseWidth = o.baseWidth;
    o.baseHeight = parseInt(o.root.style.height);
    o.root.baseHeight = o.baseHeight;
    o.xBuffer = xBuffer ? xBuffer : 0;
    o.yBuffer = yBuffer ? yBuffer : 0;
    
		o.root.onResizeStart = new Function();
		o.root.onResizeEnd = new Function();
		o.root.onResize	= new Function();
    if (!noReset) {
      o.root.onResizeResetStart = new Function();
      o.root.onResizeResetEnd = new Function();
    }
	},

	start : function(e)
	{
		var o = SRAOS_Resize.obj = this;
		e = SRAOS_Resize.fixE(e);
		o.top = parseInt(o.root.style.top);
		o.left = parseInt(o.root.style.left);
    o.handleHeight = parseInt(o.handle.style.height);
		o.root.onResizeStart(parseInt(SRAOS_Resize.obj.root.style["width"]), parseInt(SRAOS_Resize.obj.root.style["height"]));
    o.minX = o.root.minWidth ? o.root.minWidth : o.minX;
    o.minY = o.root.minHeight ? o.root.minHeight : o.minY;
    o.maxX = o.root.maxWidth ? o.root.maxWidth : o.maxX;
    o.maxY = o.root.maxHeight ? o.root.maxHeight : o.maxY;
		document.onmousemove	= SRAOS_Resize.drag;
		document.onmouseup		= SRAOS_Resize.end;
		return false;
	},

	drag : function(e)
	{
		e = SRAOS_Resize.fixE(e);
		var o = SRAOS_Resize.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var nx, ny;

		nx = ex - o.left;
    ny = ey - o.top;
    nx = o.minX != null && nx < o.minX ? o.minX : (nx <= 0 ? 1 : nx);
    ny = o.minY != null && ny < o.minY ? o.minY : (ny <= 0 ? 1 : ny);
    nx = o.maxX != null && nx > o.maxX ? o.maxX : nx;
    ny = o.maxY != null && ny > o.maxY ? o.maxY : ny;

		SRAOS_Resize.obj.root.style["width"] = nx + o.xBuffer + "px";
		SRAOS_Resize.obj.root.style["height"] = ny - o.yBuffer + "px";
    
		SRAOS_Resize.obj.root.onResize(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		SRAOS_Resize.obj.root.onResizeEnd(parseInt(SRAOS_Resize.obj.root.style["width"]), parseInt(SRAOS_Resize.obj.root.style["height"]));
		SRAOS_Resize.obj = null;
	},
  
	reset : function()
	{
    if (this.root.onResizeResetStart) {
      this.root.onResizeResetStart(parseInt(this.root.style["width"]), parseInt(this.root.style["height"]));
      this.baseWidth = this.root.baseWidth ? this.root.baseWidth : this.baseWidth;
      this.baseHeight = this.root.baseHeight ? this.root.baseHeight : this.baseHeight;
      var baseWidth = this.maxX == undefined || this.baseWidth < this.maxX ? this.baseWidth : this.maxX;
      var baseHeight = this.maxY == undefined || this.baseHeight < this.maxY ? this.baseHeight : this.maxY;
      this.root.style["width"] = baseWidth + "px";
      this.root.style["height"] = baseHeight + "px";
      this.root.onResizeResetEnd(parseInt(this.root.style["width"]), parseInt(this.root.style["height"]));
    }
	},

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};