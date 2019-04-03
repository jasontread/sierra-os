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

// {{{ SRAOS_EntityDisplAttr
/**
 * defines an attribute that should be included in the display of an entity in 
 * the search results view
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_EntityDisplAttr {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the name of the attribute as specified in the entity model for non-global 
   * ajax services or internally for global ones
	 * @type string
	 */
	var $_id;
  
  /**
	 * the plugin this object pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
   * the resouce bundle string that should be used as a header for this 
   * attribute. this value will only be used if a _headerCallback is not 
   * specified for its entity. for global services either the _headerCallback or 
   * this value MUST be specified. for non-global services, if neither are 
   * specified, the default entity label will be used
   * @type string
   */
  var $_resource;
  
  /**
   * the default sort method to apply for this attribute. this value will only 
   * be used if a _sortCallback is not specified for the entity. it should be 
   * equal to SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_ASC or 
   * SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_DESC
   * @type int
   */
  var $_sort;
  
  /**
   * whether or not this attribute should be sortable. if specified, this value 
   * will override the sortable flag in the enclosing entity element
   * @type boolean
   */
  var $_sortable;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_EntityDisplAttr
	/**
	 * instantiates a new SRAOS_EntityDisplAttr object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the object
   * @param array $config the data to use to instantiate this object
   * @param SRAOS_Entity $entity the entity that this object pertains to
   * @access  public
	 */
	function SRAOS_EntityDisplAttr($id, & $config, & $entity) {
    if (!$id || !$entity || !is_array($config)) {
			$msg = "SRAOS_EntityDisplAttr::SRAOS_EntityDisplAttr: Failed - insufficient data to instantiate object ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
		$this->_id = $id;
    $this->_plugin =& $entity->_plugin;
    $this->_resource = isset($config['attributes']['resource']) ? $config['attributes']['resource'] : NULL;
    $this->_sort = isset($config['attributes']['sort']) ? $config['attributes']['sort'] : NULL;
    if ($this->_sort && $this->_sort != SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_ASC && $this->_sort != SRA_QUERY_BUILDER_CONSTRAINT_TYPE_SORT_DESC) {
			$msg = "SRAOS_EntityDisplAttr::SRAOS_EntityDisplAttr: Failed - sort " . $this->_sort . " is not valid for attr ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $this->_sortable = isset($config['attributes']['sortable']) && $config['attributes']['sortable'] == '1' ? TRUE : (isset($config['attributes']['sortable']) ? FALSE : $entity->isSortable());
    
	}
	// }}}
	
  
  // public operations
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_EntityDisplAttr(id, label, sort, sortable)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    return 'new SRAOS_EntityDisplAttr("' . $this->_id . '", ' . ($this->_resource ? '"' . $this->_plugin->resources->getString($this->_resource) . '"' : 'null') . ', ' . ($this->_sort ? $this->_sort : 'null') . ', ' . ($this->_sortable ? 'true' : 'false') . ')';
  }
  // }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this object
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
  
	// {{{ getResource
	/**
	 * returns the resource of this object
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
	 * @return voresource
	 */
	function setResource($resource) {
		$this->_resource = $resource;
	}
	// }}}
  
	// {{{ getSort
	/**
	 * returns the sort of this object
   * @access  public
	 * @return string
	 */
	function getSort() {
		return $this->_sort;
	}
	// }}}
	
	// {{{ setSort
	/**
	 * sets the plugin sort
	 * @param string $sort the sort to set
   * @access  public
	 * @return vosort
	 */
	function setSort($sort) {
		$this->_sort = $sort;
	}
	// }}}
  
	// {{{ isSortable
	/**
	 * returns the sortable of this object
   * @access  public
	 * @return string
	 */
	function isSortable() {
		return $this->_sortable;
	}
	// }}}
	
	// {{{ setSortable
	/**
	 * sets the plugin sortable
	 * @param string $sortable the sortable to set
   * @access  public
	 * @return vosortable
	 */
	function setSortable($sortable) {
		$this->_sortable = $sortable;
	}
	// }}}
	
	// Static methods
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_EntityDisplAttr object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_entitydisplattr');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>
