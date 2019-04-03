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

/**
 * This class manages the behavior associated with a collapsable tree menu. 
 * TODO: enable ajax functionality (not currently enabled)
 * @param id see api below
 * @param container see api below
 * @param rootNodes see api below
 * @param idPrefix see api below
 * @param manager see api below
 * @param iconLookupObj see api below
 * @param iconSize see api below
 * @param iconMappings see api below
 * @param selectEvent see api below
 * @param multipleSelect see api below
 * @param noSelect see api below
 * @param ajaxService see api below
 * @param ajaxConstraintGroups see api below
 * @param ajaxParams see api below
 * @param ajaxIdAttr see api below
 * @param ajaxIdAttrTree see api below
 * @param ajaxIdParam see api below
 * @param ajaxIdParamTree see api below
 * @param ajaxWaitStr see api below
 */
SRAOS_Tree = function(id, container, rootNodes, idPrefix, manager, iconLookupObj, iconSize, iconMappings, selectEvent, multipleSelect, noSelect, ajaxService, ajaxConstraintGroups, ajaxParams, ajaxIdAttr, ajaxIdAttrTree, ajaxIdParam, ajaxIdParamTree, ajaxWaitStr, ajaxChildrenBuffer) {
  // {{{ Attributes
  // public attributes
  /**
   * the unique identifier for this tree. this must be unique within the entire 
   * dom for the current html document
   * @type String
   */
  this.id = id;
  
  /**
   * the # of levels of children to buffer from the current active node. these 
   * children will be retrieved from the ajax service even before they are 
   * needed to fascilitate improved tree responsiveness
   * @type int
   */
  this.ajaxChildrenBuffer = ajaxChildrenBuffer;
  
  /**
	 * constraint groups to add to the ajax service invocation for children in 
   * this tree. constraint groups are only applicable if the ajax service is 
   * non-global (entity specific)
	 * @type String
	 */
	this.ajaxConstraintGroups = ajaxConstraintGroups;
  
  /**
	 * the name of the attribute that should be assigned the id value of the node 
   * parent of children retrieved through the ajax service. this is only 
   * applicable if the ajax service is non-global (entity specific). a 
   * constraint and constraint group will be created to represent the id value
   * both ajaxIdAttr and ajaxIdAttrTree will be part of the same constraint 
   * group
	 * @type String
	 */
	this.ajaxIdAttr = ajaxIdAttr;
  
  /**
	 * the name of the attribute that should be assigned the id value of the tree 
   * of children retrieved through the ajax service. this is only 
   * applicable if the ajax service is non-global (entity specific). a 
   * constraint and constraint group will be created to represent the id value
   * both ajaxIdAttr and ajaxIdAttrTree will be part of the same constraint 
   * group
	 * @type String
	 */
	this.ajaxIdAttrTree = ajaxIdAttrTree;
  
  /**
	 * the name of the parameter that should be assigned the id value of the node 
   * parent of children retrieved through the ajax service. this is only 
   * applicable if the ajax service is global. an ajax service param will be 
   * created to represent the id value
	 * @type String
	 */
	this.ajaxIdParam = ajaxIdParam;
  
  /**
	 * the name of the parameter that should be assigned the id value of the tree 
   * of children retrieved through the ajax service. this is only 
   * applicable if the ajax service is global. an ajax service param will be 
   * created to represent the id value
	 * @type String
	 */
	this.ajaxIdParamTree = ajaxIdParamTree;
  
  /**
	 * params to add to the ajax service invocation for children in this tree. 
   * params are only applicable if the ajax service is global
	 * @type String
	 */
	this.ajaxParams = ajaxParams;
  
  /**
	 * the name of the ajax service responsible for returning children nodes in 
   * this tree. this service should accept a constraint or param containing the 
   * tree or parent node id, and return the corresponding children of that 
   * object as an array of objects each containing the properties defined in 
   * SRAOS_TreeNode. additional properties may be included if necessary for 
   * custom node rendering. 
	 * @type String
	 */
	this.ajaxService = ajaxService;
  
  /**
	 * the string to display while the tree is waiting for the children to be 
   * returned by the ajax service
	 * @type String
	 */
	this.ajaxWaitStr = ajaxWaitStr;
  
  /**
	 * the container where this trees' root nodes should be written into when the 
   * render method is invoked. any existing content in this xhtml area will be 
   * overwritten via the innerHTML property. if the container instantiation 
   * parameter is a string, it should be the dom id of the container
	 * @type Object
	 */
	this.container = container;
  
  /**
   * an object containing a method with the following signature: 
   * getIconUri(size, icon) - if not specified, the OS object will be used
   * @type Object
   */
  this.iconLookupObj = iconLookupObj ? iconLookupObj : OS;
  
  /**
	 * a hash containing "file" extension/icon uri mappings. the file extension of 
   * a node is considered the string following the last period in the label. if 
   * this attribute is specified for the tree and a match occurs for a given 
   * node, that corresponding icon will be utilized instead of default icons
	 * @type Array
	 */
  this.iconMappings = iconMappings;
  
  /**
	 * the icon size to use for this tree. if not specified, the 16 pixel icon 
   * will be used
	 * @type int
	 */
  this.iconSize = iconSize ? iconSize : 16;
  
  /**
   * prefix to for any xhtml id attributes generated by this tree
   * @type String
   */
  this.idPrefix = idPrefix ? idPrefix : "";
  
  /**
	 * an implementation of SRAOS_TreeManager used to handle tree related events
   * SRAOS_TreeManager.js for more information
	 * @type SRAOS_TreeManager
	 */
	this.manager = manager ? SRAOS_TreeManager.populateMethods(manager) : new SRAOS_TreeManager();
  this.manager.tree = this;
  
  /**
   * whether or not this tree supports multiple concurrently selected nodes
   * @type boolean
   */
  this.multipleSelect = multipleSelect;
  
  /**
   * whether or not none of the nodes in this tree (including the leaf nodes) is 
   * selectable. when true, the manager treeNodeSelected and treeNodeUnselected
   * methods will not be invoked
   * @type boolean
   */
  this.noSelect = noSelect;
  
  /**
	 * the root nodes of this tree. if rootNodes is SRAOS_Tree.AJAX_NODES, 
   * they will be loaded via the ajax service definition specified
	 * @type SRAOS_TreeNode[]
	 */
	this.rootNodes = rootNodes;
  
  /**
   * the event that should trigger node selection in this tree. the default is 
   * "onclick". alternatively, this may be "ondblclick" or some other user 
   * event
   * @type String
   */
  this.selectEvent = selectEvent ? selectEvent : "onclick";
  
  // private attributes
  
  /**
   * keeps track of the expanded state of the nodes in this tree
   * @type Array
   */
  this._expanded;
  
  /** 
   * used to keep track of whether or not _expanded needs to be initialized
   * @type Array
   */
  this._loadExpandedState;
  
  /**
   * reference to the currently selected nodes. will always be just one node 
   * unless multipleSelect is true
   * @type SRAOS_TreeNode[]
   */
  this._selectedNodes = new Array();
    
  var selected = SRAOS_Tree._loadDefaultSelectedNodes(rootNodes, multipleSelect);
  for(var i in selected) {
    if (this.manager.treeNodeSelected(this, selected[i], !selected[i].children || selected[i].children.length == 0)) {
      this._selectedNodes.push(selected[i]);
    }
  }
  
  // }}}
  
  
  // public methods
  
  // {{{ getNodeDivId
  /**
   * returns the div id for the node specified
   * @param SRAOS_TreeNode the node to return the id for
   * @access  public
   * @return String
   */
  this.getNodeDivId = function(node) {
    var id = node.getId ? node.getId() : node.id;
    return this.getTreeDivId() + "_" + id;
  };
  // }}}
  
  // {{{ getNodeChildrenDivId
  /**
   * returns the div id for the node's children specified
   * @param SRAOS_TreeNode the node to return the id for
   * @access  public
   * @return String
   */
  this.getNodeChildrenDivId = function(node) {
    return this.getNodeDivId(node) + "_children";
  };
  // }}}
  
  // {{{ getTreeDivId
  /**
   * returns the div id for this tree
   * @access  public
   * @return String
   */
  this.getTreeDivId = function() {
    return this.idPrefix + this.id + "Tree";
  };
  // }}}
  
	// {{{ render
	/**
	 * renders this tree's root nodes into the container specified for the tree. 
   * any expanded rootNodes will also be rendered
   * @access  public
	 * @return void
	 */
  this.render = function() {
    if (!this._expanded) {
      this._expanded = new Array();
      this._loadExpandedState = true;
    }
    if (SRAOS_Util.isString(this.container)) { this.container = document.getElementById(this.container); }
    this._renderNodes(this.rootNodes, new Array(), this.container);
    this.container._tree = this;
    this._loadExpandedState = false;
  };
  // }}}
  
	// {{{ selectNode
	/**
	 * select's the node specified by id in the tree. this node MUST exist 
   * within the currently loaded nodes if ajax node loading is utilized by the 
   * tree. returns a reference to the node specified
   * @param String id the id of the node to select. any required node 
   * expansion will automatically be performed. if the manager 
   * treeNodeSelected/treeNodeUnselected do not return true and this node is not 
   * a leaf, this method invocation will result in the collapse/expand of that 
   * node
   * @access  public
	 * @return SRAOS_TreeNode
	 */
  this.selectNode = function(id) {
    var node = null;
    var path = this._selectNode(id, this.rootNodes);
    // select node
    if (path) {
      // expand nodes
      if (path.length > 1) {
        for(var i=0; i<path.length - 1; i++) {
          var img = document.getElementById(this.getNodeDivId(path[i]) + "Img");
          if (!img._expanded) {
            SRAOS_Tree.toggleNodeState(img);
          }
        }
      }
      node = path[path.length - 1];
      
      // unselect node
      if (SRAOS_Util.inArray(node, this._selectedNodes)) {
        if (this.manager.treeNodeUnselected(this, node, SRAOS_Tree.isLeaf(node))) {
          document.getElementById(this.getNodeDivId(node) + "Label").className = "nodeLabel";
          this._selectedNodes = SRAOS_Util.removeFromArray(node, this._selectedNodes);
        }
      }
      // select node
      else if (this.manager.treeNodeSelected(this, node, SRAOS_Tree.isLeaf(node))) {
        if (!this.multipleSelect && this._selectedNodes.length > 0) {
          var selLabel = document.getElementById(this.getNodeDivId(this._selectedNodes[0]) + "Label");
          if (selLabel) { selLabel.className = "nodeLabel"; }
          this._selectedNodes = new Array();
        }
        this._selectedNodes.push(node);
        document.getElementById(this.getNodeDivId(node) + "Label").className = "nodeLabelSelected";
      }
      // toggle collapse/expanded state
      else if (!SRAOS_Tree.isLeaf(node) && document.getElementById(this.getNodeDivId(node) + "Img")) {
        SRAOS_Tree.toggleNodeState(document.getElementById(this.getNodeDivId(node) + "Img"));
      }
    }
    return node;
  };
  // }}}
  
  // private methods
  
	// {{{ _renderNodes
	/**
	 * renders the nodes specified
   * @param SRAOS_TreeNode[] nodes the nodes to render
   * @param SRAOS_TreeNode parent the parent node
   * @param Array position stack specifying the current nodes position and 
   * whether or not those nodes are in the bottom position of their 
   * corresponding parent nodes
   * @param Object container the xhtml element into which the nodes should be 
   * rendered
   * @param SRAOS_TreeNode parent the parent of nodes
   * @access  public
	 * @return void
	 */
  this._renderNodes = function(nodes, position, container, parent) {
    var html = "";
    if (position.length == 0) {
      html += this.manager.treeRenderStart(this);
      html += "<div id='" + this.getTreeDivId() + "' class='tree' style='margin: 0; padding: 0'>";
    }
    if (nodes != SRAOS_Tree.AJAX_NODES) {
      for(var i=0; i<nodes.length; i++) {
        var iconLookupObj = nodes[i].iconLookupObj ? nodes[i].iconLookupObj : this.iconLookupObj;
        var id = SRAOS_Tree.getId(nodes[i]);
        var children = nodes[i].getChildren ? nodes[i].getChildren() : nodes[i].children;
        var icon = nodes[i].getIcon ? nodes[i].getIcon(this.iconSize) : nodes[i].icon;
        var iconExpanded = nodes[i].getIconExpanded ? nodes[i].getIconExpanded(this.iconSize) : nodes[i].iconExpanded;
        var label = nodes[i].getLabel ? nodes[i].getLabel() : nodes[i].label;
        this._expanded[id] = this._loadExpandedState ? (nodes[i].isExpanded ? nodes[i].isExpanded() : nodes[i].expanded) : this._expanded[id];
        nodes[i]._treeParentNode = parent;
        
        // set dynamic node properties
        nodes[i]._nodePosition = new Array();
        for(var n=0; n<position.length; n++) {
          nodes[i]._nodePosition.push(position[n]);
        }
        nodes[i]._nodePosition.push(i == (nodes.length - 1));
        nodes[i]._tree = this;
        
        
        html += "<div id='" + this.getNodeDivId(nodes[i]) + "' class='treeNode" + this.iconSize + "' style='margin: 0; padding: 0'>";
        // add necessary lead padding
        for(var n=0; n<position.length; n++) {
          html += '<img alt="" src="';
          html += !position[n] ? OS.getIconUri(this.iconSize, 'tree-expanded.gif') : SRAOS.PIXEL_IMAGE + '" height="' + this.iconSize + '" width="16';
          html += '" />';
        }
        
        // use standard rendering
        var img;
        
        // non-leaf node
        if (!SRAOS_Tree.isLeaf(nodes[i])) {
          var suffix = i == 0 && position.length == 0 ? '-top' : (i == (nodes.length - 1) ? '-bottom' : '');
          var collapseImg = 'tree-collapse' + suffix + '.gif';
          var expandImg = 'tree-expand' + suffix + '.gif';
          var collapsedIcon = icon ? icon : SRAOS_Tree.ICON_NODE;
          var expandedIcon = iconExpanded ? iconExpanded : (icon ? icon : SRAOS_Tree.ICON_NODE_EXPANDED);
          nodes[i]._collapseImg = collapseImg;
          nodes[i]._expandImg = expandImg;
          nodes[i]._collapsedIcon = collapsedIcon;
          nodes[i]._expandedIcon = expandedIcon;
          
          img = this._expanded[id] ? collapseImg : expandImg;
          icon = this._expanded[id] ? expandedIcon : collapsedIcon;
        }
        // leaf node
        else {
          img = 'tree-leaf';
          img += i == 0 && position.length == 0 ? '-top' : (i == (nodes.length - 1) ? '-bottom' : '');
          img += '.gif';
          var ext = SRAOS_Tree.getExtension(label);
          if (this.iconMappings && ext && this.iconMappings[ext]) {
            icon = this.iconMappings[ext];
            label = label.substring(0, label.indexOf('.' + ext));
          }
          icon = icon ? icon : SRAOS_Tree.ICON_LEAF;
        }
        icon = icon == SRAOS_Tree.ICON_LEAF || icon == SRAOS_Tree.ICON_NODE_EXPANDED || icon == SRAOS_Tree.ICON_LEAF ? OS.getIconUri(this.iconSize, icon) : icon;
        html += '<img id="' + this.getNodeDivId(nodes[i]) + 'Img" alt="" src="' + OS.getIconUri(this.iconSize, img) + '"' + (!SRAOS_Tree.isLeaf(nodes[i]) ? ' onclick="SRAOS_Tree.toggleNodeState(this)"' : '') + ' />';
        var escapedLabel = !SRAOS_Util.isHtml(label) ? SRAOS_Util.escapeDoubleQuotes(label) : '';
        html += '<img id="' + this.getNodeDivId(nodes[i]) + 'Icon" alt="' + escapedLabel + '" class="nodeIcon" ' + (!this.noSelect ? this.selectEvent + '="SRAOS_Tree.selectNode(this, \'' + id +'\')"' : '') + ' src="' + (icon.indexOf('/') == -1 ? iconLookupObj.getIconUri(this.iconSize, icon) : icon) + '" title="' + escapedLabel + '" />';
        html += '<span id="' + this.getNodeDivId(nodes[i]) + 'Label" class="' + (SRAOS_Util.inArray(nodes[i], this._selectedNodes) ? 'nodeLabelSelected' : 'nodeLabel') + '" ' + (!this.noSelect ? this.selectEvent + '="SRAOS_Tree.selectNode(this, \'' + id +'\')"' : '') + '>' + label + '</span>';
        // children
        if (!SRAOS_Tree.isLeaf(nodes[i])) {
          html += "<div id='" + this.getNodeChildrenDivId(nodes[i]) + "' style='margin: 0; padding: 0'></div>";
        }
        html += "</div>";
      }
    }
    else {
      // TODO make ajax call for child nodes
      html += this.ajaxWaitStr;
    }
    if (position.length == 0) {
      html += "</div>";
      html += this.manager.treeRenderEnd(this);
    }
    container.innerHTML = html;
    
    // render expanded children
    if (nodes != SRAOS_Tree.AJAX_NODES) {
      for(var i=0; i<nodes.length; i++) {
        if (!SRAOS_Tree.isLeaf(nodes[i])) {
          var id = SRAOS_Tree.getId(nodes[i]);
          var img = document.getElementById(this.getNodeDivId(nodes[i]) + 'Img');
          img._treeNode = nodes[i];
          img._tree = this;
          img._expanded = this._expanded[id];
          img._collapsedIcon = nodes[i]._collapsedIcon;
          img._expandedIcon = nodes[i]._expandedIcon;
          img._collapseImg = nodes[i]._collapseImg;
          img._expandImg = nodes[i]._expandImg;
          img._nodePosition = nodes[i]._nodePosition;
          if (this._expanded[id]) {
            var children = nodes[i].getChildren ? nodes[i].getChildren() : nodes[i].children;
            position.push(i == (nodes.length - 1));
            this._renderNodes(children, position, document.getElementById(this.getNodeChildrenDivId(nodes[i])), nodes[i]);
            position.pop();
          }
        }
      }
    }
  };
  // }}}
  
  
	// {{{ _selectNode
	/**
	 * select's the node specified by id in the tree. this node MUST exist 
   * within the currently loaded nodes if ajax node loading is utilized by the 
   * tree. returns the path to the node specified, where the bottom value in 
   * that array is the desired node
   * @param String id the id of the node to select. any required node 
   * expansion will automatically be performed
   * @param Array nodes where the search should begin
   * @access  public
	 * @return SRAOS_TreeNode[]
	 */
  this._selectNode = function(id, nodes) {
    if (nodes != SRAOS_Tree.AJAX_NODES) {
      // try to find node in start nodes
      for(var i=0; i<nodes.length; i++) {
        var nodeId = nodes[i].getId ? nodes[i].getId() : nodes[i].id;
        if (nodeId == id) {
          return new Array(nodes[i]);
        }
      }
      // try to find in children
      for(var i=0; i<nodes.length; i++) {
        var children = nodes[i].getChildren ? nodes[i].getChildren() : nodes[i].children;
        if (children) {
          nodePath = this._selectNode(id, children);
          if (nodePath) {
            var path = new Array(nodes[i]);
            for(var n=0; n<nodePath.length; n++) {
              path.push(nodePath[n]);
            }
            return path;
          }
        }
      }
    }
    return null;
  };
  // }}}
  
};



// {{{ getExtension
/**
 * returns the file extension from the node's label. the extension is 
 * considered the string following the last period in the label
 * @param String label the label containing the extension to return
 * @access  public
 * @return String
 */
SRAOS_Tree.getExtension = function(label) {
  return label.indexOf(".") != -1 ? label.substring(label.lastIndexOf(".") + 1) : null;
};
// }}}

// {{{ getId
/**
 * returns the id for node
 * @param SRAOS_TreeNode node the node to return the id for
 * @access  public
 * @return String
 */
SRAOS_Tree.getId = function(node) {
  return node.getId ? node.getId() : node.id
};
// }}}

// {{{ isLeaf
/**
 * returns true if the node is a leaf node. leaf nodes have no children
 * @param SRAOS_TreeNode node the node to evaluate
 * @access  public
 * @return boolean
 */
SRAOS_Tree.isLeaf = function(node) {
  var children = node.getChildren ? node.getChildren() : node.children;
  return children && (children == SRAOS_Tree.AJAX_NODES || children.length > 0) ? false : true;
};
// }}}

// {{{ selectNode
/**
 * 
 * @param Object obj a reference to the node label that was selected
 * @access  public
 * @return boolean
 */
SRAOS_Tree.selectNode = function(obj, id) {
  var component = obj;
  while(component && !component._tree) {
    component = component.parentNode;
  }
  if (component._tree) {
    component._tree.selectNode(id);
  }
};
// }}}

// {{{ toggleNodeState
/**
 * toggles the expanded state of a non-leaf node
 * @param Object obj the node image
 * @access  public
 * @return void
 */
SRAOS_Tree.toggleNodeState = function(obj) {
  if (obj._tree) {
    obj.src = OS.getIconUri(obj._tree.iconSize, obj._expanded ? obj._expandImg : obj._collapseImg);
    var icon = obj._expanded ? obj._collapsedIcon : obj._expandedIcon;
    var iconLookupObj = obj._treeNode.iconLookupObj ? obj._treeNode.iconLookupObj : obj._tree.iconLookupObj;
    document.getElementById(obj._tree.getNodeDivId(obj._treeNode) + 'Icon').src = icon.indexOf('/') == -1 ? iconLookupObj.getIconUri(obj._tree.iconSize, icon) : icon;
    var div = document.getElementById(obj._tree.getNodeChildrenDivId(obj._treeNode));
    obj._expanded ? div.innerHTML = "" : obj._tree._renderNodes(obj._treeNode.getChildren ? obj._treeNode.getChildren() : obj._treeNode.children, obj._nodePosition, div, obj._treeNode);
    obj._expanded = !obj._expanded;
    obj._tree._expanded[SRAOS_Tree.getId(obj._treeNode)] = obj._expanded;
    obj._tree.manager[obj._expanded ? 'treeNodeExpanded' : 'treeNodeRetracted'](obj._tree, obj._treeNode);
  }
};
// }}}


// {{{ _loadDefaultSelectedNodes
/**
 * loads the default selected nodes
 * @param SRAOS_TreeNode[] nodes the nodes to search
 * @param boolean multipleSelect whether or not multiple node selection is 
 * allowed
 * @access  public
 * @return Array
 */
SRAOS_Tree._loadDefaultSelectedNodes = function(nodes, multipleSelect) {
  var selected = new Array();
  for(var i in nodes) {
    if (nodes[i].selected) { 
      selected.push(nodes[i]);
      if (!multipleSelect) { break; }
    }
    if (nodes[i].children && nodes[i].children.length > 0) { selected = SRAOS_Util.arrayMerge(selected, SRAOS_Tree._loadDefaultSelectedNodes(nodes[i].children, multipleSelect)); }
    if (!multipleSelect && selected && selected.length > 0) { break; }
  }
  return selected;
};
// }}}


// {{{ constants
  
/**
 * the image file name to use for a leaf node in this tree. a leaf node is a 
 * node that does not contain any children
 * @type String
 */
SRAOS_Tree.ICON_LEAF = 'unknown.png';

/**
 * the image file name to use for a non-leaf node in this tree. a non-leaf node 
 * is a node that does contain children
 * @type String
 */
SRAOS_Tree.ICON_NODE = 'folder.png';

/**
 * the image file name to use for a non-leaf node in this tree when it is in an 
 * expanded state. a non-leaf node is a node that does contain children
 * @type String
 */
SRAOS_Tree.ICON_NODE_EXPANDED = 'folder_open.png';


/**
 * identifies that a node's children should be retrieved via the tree's node 
 * ajax service
 * @type int
 */
SRAOS_Tree.AJAX_NODES = 1;

// }}}
