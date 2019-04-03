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
 * controls a veritical or horizontal resize divider this divider can be dragged 
 * from left to right top to bottom or vise versa. components to the 
 * left/right/top/bottom will automatically be resized. This class is dependent 
 * on Drag.js
 * 
 * @param div   - reference to the div that should act as the divider. the top 
 *                and left sytle properties of this component must be set. this 
 *                div may contain the same callback functions support by 
 *                SRAOS_Drag
 * @param container - the container where the div resides
 * @param min   - the min position (top or left)
 * @param max   - the max position (bottom or right)
 * @param horz  - is this is a horizontal divider (moved top to bottom). default
 *                is vertical
 * @param comp1 - array of left/top components to be resize/moved. if an 
 *                element in this array is a string, it will be dynamically 
 *                referenced using document.getElementById
 * @param comp2 - array of right/bottom components to be resize/moved
 * @param hide  - the components to hide if the divider is double clicked in a 
 *                reset position (the original position of the divider). this 
 *                parameter may be 0 (none), 1 (comp1), or 2 (comp2). when this 
 *                occurs, the divider will provide the visible components with 
 *                the full width/height of the container. to display all of the 
 *                components again, the user will simple need to double click on 
 *                the divider. the width/height style property of div must be 
 *                set in order to properly use this feature
 * @param hideBuffer - an optional buffer to apply when the hide effects are 
 *                applied. this will result in the divider being placed this 
 *                many pixels away from the left/right/top/bottom of the 
 *                container
 * @param hideThreshold - an optional parameter specifying how many pixels of 
 *                width/height for a given component should result in that 
 *                component being hidden rather than resized any further. the 
 *                default value for this parameter is 5 pixels
 */
function SRAOS_Divider(div, container, min, max, horz, comp1, comp2, hide, hideBuffer, hideThreshold) {
  div.dividerContainer = container;
  div.dividerHorz = horz;
  div.dividerComp1 = comp1;
  div.dividerComp2 = comp2;
  div.dividerHide = hide;
  div.dividerHideBuffer = hideBuffer;
  div.dividerVisibility = div.style.visibility ? div.style.visibility : 'inherit';
  div.hideThreshold = hideThreshold ? hideThreshold : 5;
  
  div.onDragStartDivider = div.onDragStart ? div.onDragStart : null;
  div.onDragStart = function(x, y) {
    this.baseDividerPos = this.dividerHorz ? y : x;
    for(var i=0; i<this.dividerComp1.length; i++) {
      var div = typeof this.dividerComp1[i] == 'string' ? document.getElementById(this.dividerComp1[i]) : this.dividerComp1[i];
      if (div) {
        div.baseDividerLen = this.dividerHorz ? parseInt(div.style.height) : parseInt(div.style.width);
      }
      //alert(this.dividerComp1[i].id + ' base: ' + this.dividerComp1[i].baseDividerLen);
    }
    for(var i=0; i<this.dividerComp2.length; i++) {
      var div = typeof this.dividerComp2[i] == 'string' ? document.getElementById(this.dividerComp2[i]) : this.dividerComp2[i];
      if (div) {
        div.baseDividerLen = this.dividerHorz ? parseInt(div.style.height) : parseInt(div.style.width);
        div.baseDividerPos = this.dividerHorz ? parseInt(div.style.top) : parseInt(div.style.left);
      }
      //alert(this.dividerComp2[i].id + ' base len/pos: ' + this.dividerComp2[i].baseDividerLen + '/' + this.dividerComp2[i].baseDividerPos);
    }
    if (this.onDragStartDivider) { this.onDragStartDivider(); }
  };
  
  div.onDragDivider = div.onDrag ? div.onDrag : null;
  div.onDrag = function(x, y) {
    var pos = this.dividerHorz ? y : x;
    for(var i=0; i<this.dividerComp1.length; i++) {
      var div = typeof this.dividerComp1[i] == 'string' ? document.getElementById(this.dividerComp1[i]) : this.dividerComp1[i];
      if (div) {
        if (this.dividerHide == 1 && this.noDrag) {
          if (div.style.visibility != 'hidden') {
            div.style.visibility = 'hidden';
            div._dividerShow = true;
          }
        }
        else {
          if (this.dividerHide == 1 && div._dividerShow) {
            div.style.visibility = 'inherit';
            div._dividerShow = false;
          }
          else {
            var newLen = div.baseDividerLen + (pos - this.baseDividerPos);
            newLen = newLen < 0 ? 0 : newLen;
            div.style[this.dividerHorz ? 'height' : 'width'] = newLen + "px";
            div.style.visibility = newLen > this.hideThreshold ? this.dividerVisibility : "hidden";
            //alert(div.id + ' base: ' + div.baseDividerLen + ' new ' + (this.dividerHorz ? 'height' : 'width') + ': ' + newLen + " visible: " + div.style.visibility);
          }
        }
      }
    }
    for(var i=0; i<this.dividerComp2.length; i++) {
      var div = typeof this.dividerComp2[i] == 'string' ? document.getElementById(this.dividerComp2[i]) : this.dividerComp2[i];
      if (div) {
        if (this.dividerHide == 2 && this.noDrag) {
          if (div.style.visibility != 'hidden') {
            div.style.visibility = 'hidden';
            div._dividerShow = true;
          }
        }
        else {
          var newPos = div.baseDividerPos + (pos - this.baseDividerPos);
          newPos = newPos < 0 ? 0 : newPos;
          div.style[this.dividerHorz ? 'top' : 'left'] = newPos + "px";
          if (div.canDrag) {
            if (this.dividerHorz) {
              var diff = newPos - div.baseY;
              div.baseY = newPos;
              if (div.minY) {
                div.minY = div.minY + diff;
                div.maxY = div.maxY + diff;
              }
            }
            else {
              var diff = newPos - div.baseX;
              div.baseX = newPos;
              if (div.minX) {
                div.minX = div.minX + diff;
                div.maxX = div.maxX + diff;
              }
            }
          }
          
          if (this.dividerHide == 2 && div._dividerShow) {
            div.style.visibility = 'inherit';
            div._dividerShow = false;
          }
          else {
            var newLen = div.baseDividerLen - (pos - this.baseDividerPos);
            newLen = newLen < 0 ? 0 : newLen;
            div.style[this.dividerHorz ? 'height' : 'width'] = newLen + "px";
            div.style.visibility = newLen > this.hideThreshold ? this.dividerVisibility : "hidden";
          }
        }
      
        //alert(div.id + ' base len/pos: ' + div.baseDividerLen + '/' + div.baseDividerPos + ' new ' + (this.dividerHorz ? 'height' : 'width') + '/' + (this.dividerHorz ? 'top' : 'left') + ': ' + newLen + '/' + newPos + " visible: " + div.style.visibility);
      }
    }
    if (this.onDragDivider) { this.onDragDivider(); }
  };
  
  if (hide == 1 || hide == 2) {
    div.onDragResetStartDivider = div.onDragResetStart ? div.onDragResetStart : null;
    div.onDragResetStart = function(x, y) {
      this.noDrag = false;
      
      // hide components
      if (parseInt(this.dividerHorz ? this.style.top : this.style.left) == (this.dividerHorz ? this.baseY : this.baseX)) {
        this.noDrag = true;
      }
      
      // show components
      else if ((this.dividerHorz ? this.style.top : this.style.left) == (this.dividerHide == 1 ? "0px" : this.dividerContainer.offsetWidth)) {
        this.style[this.dividerHorz ? 'top' : 'left'] = (this.dividerHorz ? this.baseY : this.baseX) + "px";
      }
      this.onDragStart(parseInt(this.style.left), parseInt(this.style.top));
      if (this.onDragResetStartDivider) { this.onDragResetStartDivider(); }
    };
    div.hide = function() {
      this.ondblclick();
      if (!this.noDrag) { this.ondblclick(); }
    };
    div.show = function() {
      if (this.noDrag) { this.ondblclick(); }
    };
    div.toggleShowHide = function() {
      this.noDrag ? this.show() : this.hide();
    };
    
    div.onDragResetEndDivider = div.onDragResetEnd ? div.onDragResetEnd : null;
    div.onDragResetEnd = function(x, y) {
      if (this.noDrag) {
        var newPos = parseInt(this.dividerHide == 1 ? 0 : parseInt(this.dividerHide ?  this.dividerContainer.offsetHeight : this.dividerContainer.offsetWidth));
        var eqZero = newPos == 0;
        newPos = eqZero ? 0 : newPos - parseInt(this.dividerHorz ? this.offsetHeight : this.offsetWidth);
        if (this.dividerHideBuffer) {
          newPos = eqZero ? newPos + this.dividerHideBuffer : newPos - this.dividerHideBuffer;
        }
        this.style[this.dividerHorz ? 'top' : 'left'] = newPos + "px";
      }
      this.onDrag(parseInt(this.style.left), parseInt(this.style.top));
      if (this.onDragResetEndDivider) { this.onDragResetEndDivider(); }
    };
  }
  else {
    div.onDragResetStart = div.onDragResetStart ? div.onDragResetStart : div.onDragStart;
    div.onDragResetEnd = div.onDragResetEnd ? div.onDragResetEnd : div.onDrag;
  }
  
  Drag.init(div, div, horz ? parseInt(div.style.left) : min, horz ? parseInt(div.style.left) : max, horz ? min : parseInt(div.style.top), horz ? max : parseInt(div.style.top));
}