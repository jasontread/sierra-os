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

// {{{ SRAOS_ResizeComponent
/**
 * represents a plugin window resize component
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_ResizeComponent = function(id, pluginId, height, width, xFactor, yFactor) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the hash required to find the component in the window. this is a 
   * combination of xhtml attribute name/value pairs in the 
   * format: [name]: "[value]". for example, to apply resizing to a div with the 
   * class name "myDiv", this value would be the following "className: 'myDiv'". 
   * multiple values can be specified each separated by a space. if multiple 
   * components are returned from this expression, they will each be resized
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this help topic pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
  /**
	 * whether or not to apply height resizing for this component
	 * @type boolean
	 */
	this._height = height;
  
  /**
	 * whether or not to apply width resizing for this component
	 * @type boolean
	 */
	this._width = width;
  
  /**
	 * the number of resizable components within the same x-axis as this component
	 * @type int
	 */
	this._xFactor = xFactor;
  
  /**
	 * the number of resizable components within the same y-axis as this component
	 * @type int
	 */
	this._yFactor = yFactor;

	
  // }}}
  
  // {{{ Operations
	
  
  // public operations
  
  // accessors
  
	// {{{ getId
	/**
	 * returns the id of this plugin
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this plugin
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getHeight
	/**
	 * returns the height of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isHeight = function() {
		return this._height;
	};
	// }}}
  
	// {{{ getWidth
	/**
	 * returns the width of this plugin
   * @access  public
	 * @return boolean
	 */
	this.isWidth = function() {
		return this._width;
	};
	// }}}
  
	// {{{ getXFactor
	/**
	 * returns the xFactor of this plugin
   * @access  public
	 * @return int
	 */
	this.getXFactor = function() {
		return this._xFactor;
	};
	// }}}
  
	// {{{ getYFactor
	/**
	 * returns the yFactor of this plugin
   * @access  public
	 * @return int
	 */
	this.getYFactor = function() {
		return this._yFactor;
	};
	// }}}
	
  
  // private operations

  
};
// }}}
