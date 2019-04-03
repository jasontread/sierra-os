/**************************************************
 * dom-drag.js
 * 09.25.2001
 * www.youngpup.net
 * Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
 **************************************************
 * 10.28.2001 - fixed minor bug where events
 * sometimes fired off the handle, not the root.
 **************************************************/

var Drag = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, noReset, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;
    
    o.canDrag = true;
		o.root = oRoot && oRoot != null ? oRoot : o ;
    o.baseX = parseInt(o.root.style.left);
    o.root.baseX = o.baseX;
    o.baseY = parseInt(o.root.style.top);
    o.root.baseY = o.baseY;
    if (!o.ondblclick) { o.ondblclick = Drag.reset; }

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

    if (!o.root.onDragStart) {
      o.root.onDragStart	= new Function();
    }
		if (!o.root.onDragEnd) {
      o.root.onDragEnd	= new Function();
    }
    if (!o.root.onDrag) {
      o.root.onDrag		= new Function();
    }
    if (!noReset) {
      if (!o.root.onDragResetStart) {
        o.root.onDragResetStart = new Function();
      }
      if (!o.root.onDragResetEnd) {
        o.root.onDragResetEnd = new Function();
      }
    }
	},

	start : function(e)
	{
		var o = Drag.obj = this;
    if (o.noDrag) {
      return;
    }
		e = Drag.fixE(e);
		o.root.onDragStart(e.clientX, e.clientY);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
    
    o.root.dragStartX = x;
    o.root.dragStartY = y;
    o.minX = o.root.minX != null ? o.root.minX : o.minX;
    o.minY = o.root.minY != null ? o.root.minY : o.minY;
    o.maxX = o.root.maxX != null ? o.root.maxX : o.maxX;
    o.maxY = o.root.maxY != null ? o.root.maxY : o.maxY;

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;
    
		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;
    if (o.noDrag) {
      return;
    }
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y);
		else if (o.yMapper)	ny = o.yMapper(x);

		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(ex, ey);
		return false;
	},

	end : function()
	{
    
    if (Drag.obj.root.noDrag) {
      return;
    }
    document.onmousemove = null;
    document.onmouseup   = null;
    
    // only call onDragEnd if actual drag occurred
    var o = Drag.obj;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
    if (x != o.root.dragStartX || y != o.root.dragStartY) {
      Drag.obj.root.onDragEnd(Drag.obj.lastMouseX, Drag.obj.lastMouseY);
    }
    
    Drag.obj = null;
	},
  
	reset : function()
	{
    if (this.root.onDragResetStart) {
      this.baseX = this.root.baseX ? this.root.baseX : this.baseX;
      this.baseY = this.root.baseY ? this.root.baseY : this.baseY;
      var y = parseInt(this.vmode ? this.root.style.top  : this.root.style.bottom);
      var x = parseInt(this.hmode ? this.root.style.left : this.root.style.right );
      this.root.onDragResetStart(x, y);
      if (parseInt(this.baseX) >= this.minX) {
        this.root.style["left"] = this.baseX + "px";
      }
      if (parseInt(this.baseY) >= this.minY) {
        this.root.style["top"] = this.baseY + "px";
      }
      this.root.onDragResetEnd(parseInt(this.root.style["left"]), parseInt(this.root.style["top"]));
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