<?php
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

// {{{ Imports

// }}}

// {{{ Constants

// }}}

// {{{ SRAOS_ResizeComponent
/**
 * represents a plugin window resize component
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_ResizeComponent {
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
	var $_id;
  
  /**
	 * the identifier of the plugin this help topic pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * whether or not to apply height resizing for this component
	 * @type boolean
	 */
	var $_height;
  
  /**
	 * whether or not to apply width resizing for this component
	 * @type boolean
	 */
	var $_width;
  
  /**
	 * the number of resizable components within the same x-axis as this component
	 * @type int
	 */
	var $_xFactor;
  
  /**
	 * the number of resizable components within the same y-axis as this component
	 * @type int
	 */
	var $_yFactor;

	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_ResizeComponent
	/**
	 * instantiates a new SRAOS_ResizeComponent object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the menu
   * @param array $config the data to use to instantiate this menu
   * @param SRAOS_Plugin $plugin the plugin that this menu pertains to
   * @access  public
	 */
	function SRAOS_ResizeComponent($id, & $config, & $plugin) {
    if (!$id || !$plugin) {
			$msg = "SRAOS_ResizeComponent::SRAOS_ResizeComponent: Failed - insufficient data to instantiate menu ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_height = isset($config['attributes']['height']) && $config['attributes']['height'] == '0' ? FALSE : TRUE;
    $this->_width = isset($config['attributes']['width']) && $config['attributes']['width'] == '0' ? FALSE : TRUE;
    $this->_xFactor = isset($config['attributes']['x-factor']) ? $config['attributes']['x-factor'] : 1;
    $this->_yFactor = isset($config['attributes']['y-factor']) ? $config['attributes']['y-factor'] : 1;
	}
	// }}}
	
  
  // public operations
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_ResizeComponent(id, pluginId, height, width, xFactor, yFactor)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_ResizeComponent("' . $this->_id . '", "' . $this->_pluginId . '", ';
    $code .= $this->_height ? 'true, ' : 'false, ';
    $code .= $this->_width ? 'true, ' : 'false, ';
    $code .= $this->_xFactor . ', ';
    $code .= $this->_yFactor . ')';
    
    return $code;
  }
  // }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this plugin
   * @access  public
	 * @return string
	 */
	function getId() {
		return $this->_id;
	}
	// }}}
	
	// {{{ setId
	/**
	 * sets the plugin id
	 * @param string $id the id to set
   * @access  public
	 * @return void
	 */
	function setId($id) {
		$this->_id = $id;
	}
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this plugin
   * @access  public
	 * @return string
	 */
	function getPluginId() {
		return $this->_pluginId;
	}
	// }}}
	
	// {{{ setPluginId
	/**
	 * sets the plugin pluginId
	 * @param string $pluginId the pluginId to set
   * @access  public
	 * @return void
	 */
	function setPluginId($pluginId) {
		$this->_pluginId = $pluginId;
	}
	// }}}
  
	// {{{ getHeight
	/**
	 * returns the height of this plugin
   * @access  public
	 * @return boolean
	 */
	function isHeight() {
		return $this->_height;
	}
	// }}}
	
	// {{{ setHeight
	/**
	 * sets the plugin height
	 * @param boolean $height the height to set
   * @access  public
	 * @return void
	 */
	function setHeight($height) {
		$this->_height = $height;
	}
	// }}}
  
	// {{{ getWidth
	/**
	 * returns the width of this plugin
   * @access  public
	 * @return boolean
	 */
	function isWidth() {
		return $this->_width;
	}
	// }}}
	
	// {{{ setWidth
	/**
	 * sets the plugin width
	 * @param boolean $width the width to set
   * @access  public
	 * @return void
	 */
	function setWidth($width) {
		$this->_width = $width;
	}
	// }}}
  
	// {{{ getXFactor
	/**
	 * returns the xFactor of this plugin
   * @access  public
	 * @return int
	 */
	function getXFactor() {
		return $this->_xFactor;
	}
	// }}}
	
	// {{{ setXFactor
	/**
	 * sets the plugin xFactor
	 * @param int $xFactor the xFactor to set
   * @access  public
	 * @return void
	 */
	function setXFactor($xFactor) {
		$this->_xFactor = $xFactor;
	}
	// }}}
  
	// {{{ getYFactor
	/**
	 * returns the yFactor of this plugin
   * @access  public
	 * @return int
	 */
	function getYFactor() {
		return $this->_yFactor;
	}
	// }}}
	
	// {{{ setYFactor
	/**
	 * sets the plugin yFactor
	 * @param int $yFactor the yFactor to set
   * @access  public
	 * @return void
	 */
	function setYFactor($yFactor) {
		$this->_yFactor = $yFactor;
	}
	// }}}
  
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_ResizeComponent object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_resizecomponent');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>