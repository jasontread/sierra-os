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
 * This class manages the behavior associated with a particular node in a 
 * collapsable tree menu
 * @param id see api below
 * @param label see api below
 * @param selected see api below
 * @param icon see api below
 * @param expanded see api below
 * @param iconExpanded see api below
 * @param iconLookupObj see api below
 * @param properties see api below
 */
SRAOS_TreeNode = function(id, label, selected, icon, children, expanded, iconExpanded, iconLookupObj, properties) {
  // {{{ Attributes
  // public attributes
  /**
	 * the identifier for this node. this value must be unique in the tree that 
   * this node belongs to
	 * @type String
	 */
	this.id = id;
  
  /**
	 * children of this node. node will be a leaf if children is null. if children 
   * should be retrieved via an ajax service, the initial value for children 
   * should be SRAOS_Tree.AJAX_NODES
	 * @type SRAOS_TreeNode[]
	 */
	this.children = children;
  
  /**
   * if this node is a non-leaf node, whether or not it is currently expanded
   * @type boolean
   */
  this.expanded = expanded;
  
  /**
	 * custom icon to use for this node. this can either be the base name of the 
   * icon which will be transformed according to the tree iconLookupObj and 
   * icon size, or the full uri path to the icon
	 * @type String
	 */
	this.icon = icon;
  
  /**
   * an object containing a method with the following signature: 
   * getIconUri(size, icon) - if not specified, the iconLookupObj of the node 
   * tree will be used
   * @type Object
   */
  this.iconLookupObj = iconLookupObj ? iconLookupObj : null;
  
  /**
	 * custom icon to use for this node if it is a non-leaf node and currently 
   * expanded. . this can either be the base name of the icon which will be 
   * transformed according to the tree iconLookupObj and icon size, or the full 
   * uri path to the icon. if the node is not a leaf and a custom icon is 
   * specified but not this value, the custom icon will be used when the node is 
   * expanded
	 * @type String
	 */
	this.iconExpanded = iconExpanded;
  
  /**
	 * the label to use for this node
	 * @type String
	 */
	this.label = label;
  
  /**
	 * optional user defined properties that should be associated with this node
	 * @type mixed
	 */
	this.properties = properties;
  
  /**
	 * whether or not this node is currently selected
	 * @type boolean
	 */
	this.selected = selected;
  
  // private attributes
  
  /**
   * the parent of this node. this attribute is set by the tree when this node 
   * is rendered
   * @type SRAOS_TreeNode
   */
  this._parent;
  
  // }}}
  
  
  // public methods
  
  /* the following methods MAY be implemented in classes used to represent tree 
     nodes. if a method is defined, it will be used in place of the instance 
     variable. these methods are commented out because the instance variables 
     are used instead */
  
	// {{{ getId
	/**
	 * returns the id of this node
   * @access  public
	 * @return string
	 */
	//this.getId = function() {}
	// }}}
  
	// {{{ getChildren
	/**
	 * returns the children of this node
   * @access  public
	 * @return SRAOS_TreeNode[]
	 */
	//this.getChildren = function() {}
	// }}}
  
	// {{{ isExpanded
	/**
	 * returns the true if this node should be expanded initially
   * @access  public
	 * @return boolean
	 */
	// this.isExpanded = function() {}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the full uri path to the icon of the specified size
   * @access  public
	 * @return string
	 */
	//this.getIcon = function(size) {}
	// }}}
  
	// {{{ getIconExpanded
	/**
	 * returns the full uri path to the expanded icon of the specified size 
   * (applies to non-leaf nodes only)
   * @access  public
	 * @return string
	 */
	//this.getIconExpanded = function(size) {}
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this node
   * @access  public
	 * @return string
	 */
	//this.getLabel = function() {}
	// }}}
  
  // private methods
  
  
};

