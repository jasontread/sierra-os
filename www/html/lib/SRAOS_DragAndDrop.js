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
 * this class is used to add drag and drop functionality to an html component
 * 
 * @param dragComponent a reference to the component that should be displayed 
 * when dragging objects
 * @param minX the minimum left position for the dragComponent (null for none)
 * @param minY the minimum top position for the dragComponent (null for none)
 * @param maxX the maximum right position for the dragComponent (null for none)
 * @param maxY the maximum bottom position for the dragComponent (null for none)
 * @param xOffset the numeric x offset for displaying the dragComponent when a 
 * user first starts to drag an object. this will determine how far to the left 
 * of the mouse cursor the left edge of the dragComponent appears
 * @param yOffset the numeric y offset for displaying the dragComponent when a 
 * user first starts to drag an object. this will determine how far below the 
 * mouse cursor the bottom edge of the dragComponent appears
 */
function SRAOS_DragAndDrop(dragComponent, minX, minY, maxX, maxY, xOffset, yOffset) {
  
  this.dragComponent = dragComponent;
  this.dragTargets = new Array();
  this.minX = minX;
  this.minY = minY;
  this.maxX = maxX;
  this.maxY = maxY;
  this.xOffset = xOffset ? xOffset : 10;
  this.yOffset = yOffset ? yOffset : 20;
  
  // the dragComponent can reference an instance to this object using the 
  // dragAndDropObj reference
  dragComponent.dragAndDropObj = this;
  
  
  // when dragging starts (when the mouse moves at least 2 pixels after clicking 
  // and holding down the mouse button over a drag object handler) the 
  // dragComponent will be rewritten with an icon and a description retrieved 
  // from the drag object (methods 'getIcon' and 'getDescription' must 
  // be defined in that class)
  dragComponent.onDragStart = function(x, y) {
    this.style.visibility = "hidden";
    var left = x - this.dragAndDropObj.xOffset;
    var top = y - this.dragAndDropObj.yOffset;
    this.style.left = left + "px";
    this.style.top = top + "px";
    this.dragBaseX = left;
    this.dragBaseY = top;
    this.innerHTML = this.dragHandler.dragObj.getIcon ? '<img align="left" alt="" src="' + this.dragHandler.dragObj.getIcon() + '" /> ' : '';
    this.innerHTML += this.dragHandler.dragObj.getDescription();
    this._dragMatrix = new Array();
    for(var i in this.dragAndDropObj.dragTargets) {
      if (this.dragAndDropObj.dragTargets[i]) {
        var target = this.dragAndDropObj.dragTargets[i];
        var x = target.getDragX ? target.getDragX() : SRAOS_Util.getAbsoluteX(target) + (target._xOffset ? target._xOffset : 0);
        var y = target.getDragY ? target.getDragY() : SRAOS_Util.getAbsoluteY(target) + (target._yOffset ? target._yOffset : 0);
        var width = target.getDragWidth ? target.getDragWidth() : (target.offsetWidth ? target.offsetWidth : (target.width ? target.width : (target.style.width ? parseInt(target.style.width) : 0)));
        var height = target.getDragHeight ? target.getDragHeight() : (target.offsetHeight ? target.offsetHeight : (target.height ? target.height : (target.style.height ? parseInt(target.style.height) : 0)));
        if (width > 0 && height > 0 && x !== null && y !== null) {
          this._dragMatrix[i] = new Array();
          this._dragMatrix[i].x = x;
          this._dragMatrix[i].y = y;
          this._dragMatrix[i].width = width;
          this._dragMatrix[i].height = height;
        }
      }
    }
    /*
    tmp = "";
    for(var i in this._dragMatrix) {
      tmp += i + ' x=' + this._dragMatrix[i].x + ' y=' + this._dragMatrix[i].y + ' width=' + this._dragMatrix[i].width + ' height=' + this._dragMatrix[i].height + '\n';
    }
    alert(tmp);
    */
  };
  
  
  dragComponent.onDrag = function(x, y) {
    if (!this.dragging && ((Math.abs(this.dragBaseX - x) - this.dragAndDropObj.xOffset) > 1 || (Math.abs(this.dragBaseY - y) - this.dragAndDropObj.yOffset) > 1)) {
      this.style.visibility = "visible";
      this.dragging = true;
      if (this.dragHandler.dragObj.onDragStart) {
        this.dragHandler.dragObj.onDragStart();
      }
      if (this.dragHandler.onDragStart) {
        this.dragHandler.onDragStart();
      }
    }
    else if (this.dragging) {
      var dragPreviousTarget = this.dragCurrentTarget;
      var found = false;
      // determine if object is over any target containers
      for(var i in this._dragMatrix) {
        var obj = this._dragMatrix[i];
        if (x >= obj.x && x <= (obj.x + obj.width) && y >= obj.y && y <= (obj.y + obj.height)) {
          if (this.dragCurrentTarget != this.dragAndDropObj.dragTargets[i]) {
            this.dragAndDropObj.dragTargets[i]._onDragIn();
            this.dragCurrentTarget = this.dragAndDropObj.dragTargets[i];
          }
          found = true;
          break;
        }
      }
      if (dragPreviousTarget && (dragPreviousTarget != this.dragCurrentTarget || !found)) {
        dragPreviousTarget._onDragOut();
        if (!found) {
          this.dragCurrentTarget = null;
        }
      }
    }
  };
  
  
  dragComponent.onDragEnd = function(x, y) {
    if (this.style.visibility != "hidden") {
      if (this.dragCurrentTarget && this.dragCurrentTarget.dragObj) {
        if (this.dragHandler.dragObj.onDropped) {
          this.dragHandler.dragObj.onDropped(this.dragCurrentTarget.dragTarget);
        }
        else if (this.dragHandler.onDrop) {
          this.dragHandler.onDrop(this.dragCurrentTarget.dragTarget);
        }
        if (this.dragCurrentTarget.dragTarget.onDrop) {
          this.dragCurrentTarget.dragTarget.onDrop(this.dragCurrentTarget.dragObj);
        }
        else if (this.dragCurrentTarget.onDrop) {
          this.dragCurrentTarget.onDrop(this.dragCurrentTarget.dragObj);
        }
        this.style.visibility = "hidden";
      }
      else {
        if (this.dragHandler.dragObj.onDragEnd) {
          this.dragHandler.dragObj.onDragEnd();
        }
        if (this.dragHandler.onDragEnd) {
          this.dragHandler.onDragEnd();
        }
        this.dragBaseY += 15;
        this.moveBack(x, y);
      }
      if (this.dragCurrentTarget) {
        this.dragCurrentTarget._onDragOut();
      }
    }
    this.dragging = false;
    this.dragCurrentTarget = null;
  };
  
  
  dragComponent.moveBack = function(x, y) {
    if (x != this.dragBaseX || y != this.dragBaseY) {
      var leftAdd = this.dragBaseX > x;
      var topAdd = this.dragBaseY > y;
      var diffX = Math.abs(this.dragBaseX - x);
      var diffY = Math.abs(this.dragBaseY - y);
      var n = diffX > diffY ? diffX : diffY;
      SRAOS_DragAndDrop.movebackX = x;
      SRAOS_DragAndDrop.movebackY = y;
      SRAOS_DragAndDrop.dragComponent = this;
      for(var i=0; i<=n; i++) {
        SRAOS_DragAndDrop.movebackX = SRAOS_DragAndDrop.movebackX != this.dragBaseX ? (leftAdd ? SRAOS_DragAndDrop.movebackX + 1 : SRAOS_DragAndDrop.movebackX - 1) : SRAOS_DragAndDrop.movebackX;
        SRAOS_DragAndDrop.movebackY = SRAOS_DragAndDrop.movebackY != this.dragBaseY ? (topAdd ? SRAOS_DragAndDrop.movebackY + 1 : SRAOS_DragAndDrop.movebackY - 1) : SRAOS_DragAndDrop.movebackY;
        this.style.left = SRAOS_DragAndDrop.movebackX + "px";
        this.style.top = SRAOS_DragAndDrop.movebackY + "px";
        if (i > 0 && (i % 100) == 0) {
          setTimeout('SRAOS_DragAndDrop.dragComponent.moveBack(SRAOS_DragAndDrop.movebackX, SRAOS_DragAndDrop.movebackY)', 0);
          return;
        }
      }
    }
    this.style.visibility = "hidden";
  };
  
  /*
   * used to add a dragable object. this method requires 2 parameters. the first 
   * is a reference to the object that will be dragged. this object must have 
   * 'getDescription' and 'getType' methods defined, and optionally a 'getIcon' 
   * method. the handler is the component that will detect and determine when 
   * obj should be dragged. corresponding methods will be added to that object 
   * for dragging purposes. the following callback methods may be defined for 
   * either obj or handler (obj callbacks invoked first):
   *   onDragStart()  - called when dragging first begins
   *   onDragEnd()    - called when dragging ends without a drop
   *   onDropped(target) - called when the obj has been dropped into a target. a 
   *                    reference to target is provided
   *
   * @param obj the object to be dragged. must have a 'getType' and 
   *            'getDescription' method. may also have a 'getIcon' method
   * @param handler the component that will serve as the drag handler
   */
  this.addDragObject = function (obj, handler) {
    if (!handler.dragObj) {
      handler.dragObj = obj;
      handler.dragComponent = this.dragComponent;
      handler.onmouseover = function() {
        if (!this.dragComponent.dragging) {
          dragComponent.dragHandler = this;
        }
      };
      Drag.init(handler, this.dragComponent, this.minX, this.maxX, this.minY, this.maxY);
    }
  };
  
  
  /*
   * used to add a drop container/target. this is the location where a drabable 
   * object can be dropped. the following callback methods may be defined for 
   * either obj or target (obj callbacks invoked first):
   *   onDragIn(obj)  - called when a valid drag object (obj) first hovers over 
   *                    the target
   *   onDragOut(obj) - called when the drag object exits or after it is dropped
   *   onDrop(obj)    - called when a valid drag object (obj) is dropped into 
   *                    the target
   *
   * @param obj the target object
   * @param target the component that will serve as the drag container/target.
   *              the following methods may be implemented to provide 
   *              the x and y coordinates of target: getDragX, getDragY
   *              the width and height of this target will be accessed 1st via 
   *              custom getDragWidth/getDragHeight methods, 2nd, the 
   *              offsetWidth/offsetHeight properties and 3rd via the 
   *              width and height properties and 4th via 
   *              style.width/style.height properties
   * @param types the types of objects that can be dropped into this target. 
   *              this should be an array of type references. for example:
   *              new Array(McMessage)
   * @param hoverCssClass an optional css class to apply to the target whenever 
   *              a valid object is hovering over it
   * @param int xOffset if the target's x coordinate is being miscalculated, you 
   * may specify this parameter to apply an offset to the calculated value 
   * (positive or negative)
   * @param int yOffset if the target's y coordinate is being miscalculated, you 
   * may specify this parameter to apply an offset to the calculated value 
   * (positive or negative)
   */
  this.addDropTarget = function (obj, target, types, hoverCssClass, xOffset, yOffset) {
    target.dragTarget = obj;
    target.dragComponent = this.dragComponent;
    target.dragCssHoverClass = hoverCssClass;
    target.dragTypes = types;
    target._xOffset = xOffset;
    target._yOffset = yOffset;
    target._onDragIn = function() {
      this.dragCssClass = this.className;
      for(var i=0; i<this.dragTypes.length; i++) {
        if (this.dragComponent.dragHandler.dragObj.getType() == this.dragTypes[i]) {
          if (this.dragCssHoverClass) {
            this.className = this.dragCssHoverClass;
          }
          this.dragObj = this.dragComponent.dragHandler.dragObj;
          if (this.dragTarget.onDragIn) {
            this.dragTarget.onDragIn(this.dragObj);
          }
          if (this.onDragIn) {
            this.onDragIn(this.dragObj);
          }
          break;
        }
      }
    };
    target._onDragOut = function() {
      if (this.dragCssHoverClass) {
        this.className = this.dragCssClass ? this.dragCssClass : null;
      }
      if (this.dragTarget.onDragOut) {
        this.dragTarget.onDragOut(this.dragObj);
      }
      if (this.onDragOut) {
        this.onDragOut(this.dragObj);
      }
      this.dragObj = null;
    };
    this.dragTargets[target.id] = target;
    
    // remove invalid drop targets
    var newDropTargets = new Array();
    for(var i in this.dragTargets) {
      if (document.getElementById(i)) {
        newDropTargets[i] = this.dragTargets[i];
      }
    }
    this.dragTargets = newDropTargets;
  };
  
  
  /**
   * used to remove a drop target previously added through addDropTarget
   * @param target the drop target to remove
   * @return void
   */
  this.removeDropTarget = function (target) {
    this.dragTargets[target.id] = null;
  };
};