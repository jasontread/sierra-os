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

// {{{ SRAOS_HelpTopic
/**
 * represents a plugin help-topic
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_HelpTopic {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique help topic identifier
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the plugin this help topic pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this application pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
	 * the content to display for this help topic. this may be any of the 
   * following values:
   *  1. a plugin resource bundle string identifier
   *  2. a platform relative localized file name. for example, if 
   *     this value is "myhelp.txt", the help topic content should 
   *     exist in a file "plugin-dir/etc/l10n/myhelp.txt". 
   *     additional country/language specific help files may also 
   *     be specified using the convention described in the 
   *     following api documentation:
   *     sierra/lib/util/l10n/SRA_ResourceBundle::findLocaleFile()
   * all content should be html formatted including line breaks
	 * @type string
	 */
	var $_content;
  
  /**
	 * whether or not this help topic should be expanded initially. this only 
   * applies to help topics that contain sub-topics. by default, nodes are 
   * initially collapsed
	 * @type boolean
	 */
	var $_expanded;
  
  /**
	 * nested help topics
	 * @type SRAOS_HelpTopic[]
	 */
	var $_helpTopics = array();
  
  /**
	 * an optional icon to use to represent this help topic in the help manual 
   * hierarchy. default icons are provided by the help manual if none is 
   * specified
	 * @type string
	 */
	var $_icon;
  
  /**
   * the id of the parent help topic if this is a sub-topic
   * @type string
   */
  var $_parentId;
  
  /**
	 * the label for this help topic. this should reference a string value in one 
   * of the plugin resources properties files
	 * @type string
	 */
	var $_resource;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_HelpTopic
	/**
	 * instantiates a new SRAOS_HelpTopic object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the help topic
   * @param array $config the data to use to instantiate this help topic
   * @param SRAOS_Plugin $plugin the plugin that this application pertains to
   * @param String parentId (optional) the id of the parent help topic if this 
   * is a sub-topic
   * @access  public
	 */
	function SRAOS_HelpTopic($id, & $config, & $plugin, $parentId) {
    if (!$id || !$plugin || !is_array($config) || (!isset($config['attributes']['content']) && !isset($config['help-topic']))) {
			$msg = "SRAOS_HelpTopic::SRAOS_HelpTopic: Failed - insufficient data to instantiate help topic ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['icon']) && !SRAOS_PluginManager::validateIcon($plugin->getId(), $config['attributes']['icon'])) {
			$msg = "SRAOS_HelpTopic::SRAOS_HelpTopic: Failed - icon " . $config['attributes']['icon']. " is not valid for help topic ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $this->_content = isset($config['attributes']['content']) ? $config['attributes']['content'] : NULL;
    $file = SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $plugin->getId() . '/etc/l10n/' . $this->_content;
    if (isset($this->_content) && !$plugin->resources->containsKey($this->_content) && !file_exists($file)) {
			$msg = "SRAOS_HelpTopic::SRAOS_HelpTopic: Failed - content " . $config['attributes']['content']. " is not valid for help topic ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    $this->_expanded = isset($config['attributes']['expanded']) && $config['attributes']['expanded'] == '1' ? TRUE : FALSE;
    $this->_icon = $config['attributes']['icon'];
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $id;
    $this->_parentId = $parentId;
    
    // add sub-help-topics
    if (isset($config['help-topic'])) {
      $keys = array_keys($config['help-topic']);
      foreach ($keys as $key) {
        $this->_helpTopics[$key] = new SRAOS_HelpTopic($key, $config['help-topic'][$key], $plugin, $this->_id);
        if (SRA_Error::isError($this->_helpTopics[$key]->err)) {
          $msg = "SRAOS_HelpTopic::SRAOS_HelpTopic: Failed - Unable to instantiate SRAOS_HelpTopic ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
	}
	// }}}
	
  
  // public operations
  
	// {{{ getIconPath
	/**
	 * returns the full path to this icon for the size specified
   * @param int $size the size of the icon
   * @access  public
	 * @return string
	 */
	function getIconPath($size) {
		return $this->_icon ? SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . "${size}/" . $this->_icon : NULL;
	}
	// }}}
  
	// {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   * 
   * SRAOS_HelpTopic(id, pluginId, content, helpTopics, icon, label)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_HelpTopic("' . $this->_id . '", "' . $this->_pluginId . '", '; 
    $code .= $this->_content ? 'true, ' : 'false, ';
    $code .= $this->_expanded ? 'true, ' : 'false, ';
    
    // helpTopics
    $code .= '[';
    $keys = array_keys($this->_helpTopics);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_helpTopics[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    
    $code .= $this->_icon ? '"' . $this->_icon . '", ' : 'null, ';
    $code .= $this->_icon ? '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ' : 'null, ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '"';
    $code .= ')';
    
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this help topic
   * @access  public
	 * @return string
	 */
	function getLabel() {
		return $this->_plugin->resources->getString($this->_resource);
	}
	// }}}
  
	// {{{ getLocalizedContent
	/**
	 * returns the full localized content for this help topic
   * @access  public
	 * @return string
	 */
	function & getLocalizedContent() {
		return SRAOS_PluginManager::getLocalizedContent($this->_plugin, $this->_content);;
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
  
	// {{{ getContent
	/**
	 * returns the content of this plugin
   * @access  public
	 * @return string
	 */
	function getContent() {
		return $this->_content;
	}
	// }}}
	
	// {{{ setContent
	/**
	 * sets the plugin content
	 * @param string $content the content to set
   * @access  public
	 * @return string
	 */
	function setContent($content) {
		$this->_content = $content;
	}
	// }}}
  
	// {{{ isExpanded
	/**
	 * returns the expanded of this plugin
   * @access  public
	 * @return string
	 */
	function isExpanded() {
		return $this->_expanded;
	}
	// }}}
	
	// {{{ setExpanded
	/**
	 * sets the plugin expanded
	 * @param string $expanded the expanded to set
   * @access  public
	 * @return string
	 */
	function setExpanded($expanded) {
		$this->_expanded = $expanded;
	}
	// }}}
  
	// {{{ getHelpTopics
	/**
	 * returns the helpTopics of this plugin
   * @access  public
	 * @return SRAOS_HelpTopic[]
	 */
	function & getHelpTopics() {
		return $this->_helpTopics;
	}
	// }}}
	
	// {{{ setHelpTopics
	/**
	 * sets the plugin helpTopics
	 * @param SRAOS_HelpTopic[] $helpTopics the helpTopics to set
   * @access  public
	 * @return void
	 */
	function setHelpTopics(& $helpTopics) {
		$this->_helpTopics =& $helpTopics;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this plugin
   * @access  public
	 * @return string
	 */
	function getIcon() {
		return $this->_icon;
	}
	// }}}
	
	// {{{ setIcon
	/**
	 * sets the plugin icon
	 * @param string $icon the icon to set
   * @access  public
	 * @return void
	 */
	function setIcon($icon) {
		$this->_icon = $icon;
	}
	// }}}
  
	// {{{ getParentId
	/**
	 * returns the parentId of this plugin
   * @access  public
	 * @return string
	 */
	function getParentId() {
		return $this->_parentId;
	}
	// }}}
	
	// {{{ setParentId
	/**
	 * sets the plugin parentId
	 * @param string $parentId the parentId to set
   * @access  public
	 * @return void
	 */
	function setParentId($parentId) {
		$this->_parentId = $parentId;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this plugin
   * @access  public
	 * @return string
	 */
	function getResource() {
		return $this->_resource;
	}
	// }}}
	
	// {{{ setResource
	/**
	 * sets the plugin resource
	 * @param string $resource the resource to set
   * @access  public
	 * @return void
	 */
	function setResource($resource) {
		$this->_resource = $resource;
	}
	// }}}
	
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_HelpTopic object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_helptopic');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>