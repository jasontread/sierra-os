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
 * This class provides event handlers associated with an instance of SRAOS_Tree.
 * It may be overriden to implement different behaviors
 */
SRAOS_TreeManager = function() {
  // {{{ Attributes
  // public attributes
  
  /**
   * the instance of SRAOS_Tree that this manager pertains to
   * @type SRAOS_Tree
   */
  this.tree;
   
  // private attributes
  
  // }}}
  
  
  // public methods
  
	// {{{ treeNodeExpanded
	/**
	 * invoked when a non-leaf node with children is expanded
   * @param SRAOS_Tree tree the tree that the node has been expanded in
   * @param SRAOS_TreeNode node the node that was expanded
   * @access  public
	 * @return void
	 */
  this.treeNodeExpanded = function(tree, node) {
    
  };
  // }}}
  
	// {{{ treeNodeRetracted
	/**
	 * invoked when a non-leaf node with children is retracted
   * @param SRAOS_Tree tree the tree that the node has been retracted in
   * @param SRAOS_TreeNode node the node that was retracted
   * @access  public
	 * @return void
	 */
  this.treeNodeRetracted = function(tree, node) {
    
  };
  // }}}
  
	// {{{ treeNodeSelected
	/**
	 * invoked when a user clicks on the label for a given node. if this method 
   * returns true, that node will change to a selected (highlighted) state. 
   * also invoked when a non-leaf node is expanded
   * @param SRAOS_Tree tree the tree that the node has been selected in
   * @param SRAOS_TreeNode node the node that was selected
   * @param boolean leaf whether or not node is a leaf
   * @access  public
	 * @return boolean
	 */
  this.treeNodeSelected = function(tree, node, leaf) {
    return leaf;
  };
  // }}}
  
	// {{{ treeNodeUnselected
	/**
	 * invoked when a user clicks on the label for a given node that is already 
   * selected. if this method returns true, that node will change to an 
   * unselected (unhighlighted) state. also invoked when a non-leaf node is 
   * retracted
   * @param SRAOS_Tree tree the tree that the node has been unselected in
   * @param SRAOS_TreeNode node the node that was selected
   * @param boolean leaf whether or not node is a leaf
   * @access  public
	 * @return boolean
	 */
  this.treeNodeUnselected = function(tree, node, leaf) {
    return leaf;
  };
  // }}}
  
	// {{{ treeRenderEnd
	/**
	 * called when the tree's render is method is invoked. the return string will 
   * be postpended to the tree html
   * @param SRAOS_Tree tree the tree where the rendering is occurring
   * @access  public
	 * @return String
	 */
  this.treeRenderEnd = function(tree) {
    return "";
  };
  // }}}
  
	// {{{ treeRenderStart
	/**
	 * called when the tree's render is method is invoked. the return string will 
   * be prepended to the tree html
   * @param SRAOS_Tree tree the tree where the rendering is occurring
   * @access  public
	 * @return String
	 */
  this.treeRenderStart = function(tree) {
    return "";
  };
  // }}}
  
  // private methods
  
  
};


// {{{ populateMethods
/**
 * this static method populates any missing SRAOS_TreeManager methods in 
 * object obj
 * @param Object obj the object to populate missing methods in
 * @access  public
 * @return SRAOS_TreeManager
 */
SRAOS_TreeManager.populateMethods = function(obj) {
  var base = new SRAOS_TreeManager();
  if (!obj.treeNodeExpanded) { obj.treeNodeExpanded = base.treeNodeExpanded; }
  if (!obj.treeNodeRetracted) { obj.treeNodeRetracted = base.treeNodeRetracted; }
  if (!obj.treeNodeSelected) { obj.treeNodeSelected = base.treeNodeSelected; }
  if (!obj.treeNodeUnselected) { obj.treeNodeUnselected = base.treeNodeUnselected; }
  if (!obj.treeRenderEnd) { obj.treeRenderEnd = base.treeRenderEnd; }
  if (!obj.treeRenderStart) { obj.treeRenderStart = base.treeRenderStart; }
  return obj;
};
// }}}
