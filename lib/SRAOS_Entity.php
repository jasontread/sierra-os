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
require_once('SRAOS_EntityDisplAttr.php');
require_once('SRAOS_EntitySearchAttr.php');
// }}}

// {{{ Constants
/**
 * the default resource string to display if this entity is not found in a 
 * search invocation
 * @type string
 */
define('SRAOS_ENTITY_DEFAULT_RESOURCE_NOT_FOUND', 'text.noMatches');

/**
 * the maximum value for _autoDisplMax
 * @type int
 */
define('SRAOS_ENTITY_MAX_AUTO_DISPLAY', 5);
// }}}

// {{{ SRAOS_Entity
/**
 * defines a searchable element within the OS as well as how access to that 
 * element should be obtained. a user will ONLY have access to an entity if they 
 * have access to it's corresponding viewer through their application 
 * permissions
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Entity {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique entity identifier. if lookup-service-global is FALSE, this value 
   * must correspond with a valid entity defined in one of the plugins' models
	 * @type string
	 */
	var $_id;
  
  /**
	 * the identifier of the plugin this entity pertains to
	 * @type string
	 */
	var $_pluginId;
  
  /**
	 * the plugin this entity pertains to
	 * @type SRAOS_Plugin
	 */
	var $_plugin;
  
  /**
   * if the lookup-service is non-global, 1..* _entitySearchAttrs MUST be 
   * specified to identify which attributes will be included in the search. this 
   * attribute may be used to specify the connective between those different 
   * search attributes. the default connective is "or", meaning a match will 
   * occur if any entities where the search attributes matches the search term. 
   * changing this to "and" will change that meaning to only those entities 
   * where all search attributes match the search term
   * @type string
   */
  var $_attrConnective;
  
  /**
   * may be specified instead of _displAttrs attributes. this should be 
   * javascript code that will return an array of attribute names that should be 
   * included in any ajax service invocations (include-attrs). if both a 
   * callback and _displAttrs attribute are specified, the callback 
   * attributes will be used. for global services, these values MUST be a 
   * sub-set of _displAttrs. for non-global services, 
   * _displAttrs nested elements are not required
   * @type string
   */
  var $_attrsCallback;
  
  /**
   * if the # of results returned by a given search are less then or equal to 
   * this attribute value then _displayCallack will be invoked once for each 
   * result after a 1 second delay. the default value for this attribute is 0, 
   * meaning auto-display will not occur. the maximum value for this attribute 
   * is 5.
   * @type int
   */
  var $_autoDisplMax;
  
  /**
   * whether or not this entity can be copied when it is represented in the file 
   * system. the 'copy' method of the corresponding entity instance will be used 
   * to create a copy and then commit that copy as a new instance. if that 
   * invocation returns an SRA_Error object, the copy will be aborted and a 
   * generic error message returned
   * @type boolean
   */
  var $_canCopy;
  
  /**
   * whether or not this entity supports empty instantiations. if true, the user 
   * will be able to create a blank instance of this entity. when this occurs 
   * within the file system a new instance of the entity will be created using 
   * the constructor with no initialization parameters and that instance will be 
   * inserted into the database. an entity node within the file system will then 
   * be able to be created based on the id of that new entity instance
   * @type boolean
   */
  var $_canCreate;
  
  /**
   * whether or not this entity can be deleted when it is represented in the 
   * file system. the 'delete' method of the corresponding entity instance will 
   * be invoked. if that invocation returns an SRA_Error object, the delete will 
   * be aborted and a generic error message returned
   * @type boolean
   */
  var $_canDelete;
  
  /**
   * whether or not this entity can be moved when it is represented in the file 
   * system. this includes moving it to the trash
   * @type boolean
   */
  var $_canMove;
  
  /**
   * whether or not this entity can be renamed when it is represented in the 
   * file system
   * @type boolean
   */
  var $_canRename;
  
  /**
   * the attributes that should be included in the display of this entity in the 
   * search results view. each entity returned by the ajax service must be 
   * indexed according to these attribute names. for global services, 1 or more 
   * _displAttrs elements are required. for non-global services, they are not 
   * required and if they are not, whatever attributes returned by the service 
   * will be rendered in the order they are specified
   * @type SRAOS_EntityDisplAttr[]
   */
  var $_displAttrs = array();
  
  /**
   * name of the method that should be invoked when the user clicks on one of 
   * the results for this entity. this method should have the following 
   * signature: (obj : [Entity Instance]) : void. this method will be searched 
   * for and invoked using the following order: 
   *    1. [viewer primary window instance].manager
   *    2. [viewer application instance].manager
   *    3. static call using eval
   * @type string
   */
  var $_displCallback;
  
  /**
   * an optional static method to invoke using eval to populate the table header 
   * for each displayed attribute column. if not specified, the 
   * SRAOS_EntityDisplAttr::resource or entity model attribute label will be 
   * used. this method should have the following signature: 
   * (entity : String, attribute : String) : String
   * @type string
   */
  var $_headerCallback;
  
  /**
	 * reference (help-topic key) to the help topic that can be displayed for help 
   * related information about this entity
	 * @type string
	 */
	var $_helpTopic;
  
  /**
	 * the icon to use to represent this entity in search results. if not 
   * specified, the _viewer icon will be used
	 * @type string
	 */
	var $_icon;
  
  /**
   * whether or not actions should be included in the display results for this 
   * entity. if true, the last column in the display results will display action 
   * links (using the 16 pixel action image) for each entity rendered
   * @type boolean
   */
  var $_includeActions;
  
  /**
   * whether or not a grouping for this entity should be displayed with the 
   * _resourceNotFound message when no entities match the search criteria. 
   * by default, this attribute is TRUE. if FALSE, and no entities are returned 
   * in the search, the entire grouping for this entity will be left out of the 
   * search results
   * @type boolean
   */
  var $_includeNotFound;
  
  /**
   * whether or not a grouping for this entity should be displayed with the 
   * _resourceNotFound message when the ajax service for this entity is not 
   * invoked because none of the _entitySearchAttrs _matchRegex expressions 
   * matched the search term. by default, this attribute is FALSE, meaning the 
   * grouping for this entity will be automatically excluded from the search 
   * results when this occurs. Change this to TRUE to display the grouping for 
   * this entity regardless of whether or not the search service was invoked
   * @type boolean
   */
  var $_includeNotInvoked;
  
  /**
   * in order for the search results ajax-scroll pagination to work properly, 
   * the line height for each entity must be uniform. if _valueCallback is 
   * specified, and the line height will exceed the default, then this attribute 
   * should be specified. the value of this attribute is pixels
   * @type int
   */
  var $_lineHeight;
  
  /**
   * the name of the ajax service that will respond to queries for this entity. 
   * both global and non-global lookup services are supported. both service 
   * types require 1 or more _entitySearchAttrs attributes to be defined which 
   * will form the basis for the ajax service invocation. for global services 
   * these will translate into the following parameters:
   *    [attr]: [attr] is the name of the attribute (either an _entityDisplAttrs 
   *            for sorting constraints or a _entitySearchAttrs search 
   *            constraints. the value for these parameters will be a bitmask 
   *            containing 1 or more of the SRA_AjaxConstraint::operator 
   *            constraint bit values according to the _operator specified 
   *            (entity-search-attr) or a sort constraint (64=ascending, 
   *            128=descending for entity-displ-attr)
   *    search: the search term
   * for non-global services, the standard AjaxConstraintGroup/AjaxConstraint 
   * model will be used as described in ajax-service-request_1_0.dtd. if any of 
   * the nested _entitySearchAttr elements contain _matchRegex attributes, the 
   * search term will be evaluated against that expression. if it matches, the 
   * attribute will be included in the service invocation, and if it does not, 
   * it will not. If NONE of the nested _entitySearchAttr elements _matchRegex 
   * expressions match the search term or if a entity _matchRegex has been 
   * specified and does not match, then the service WILL NOT be invoked for this 
   * entity. in order for pagination to function correctly if a global method 
   * based lookup service is utilized, that service MUST return the total result 
   * count utilizing the SRA_WS_RESULT_COUNT_KEY key in the service return value 
   * (see model/SRA_GlobalAjaxSerive for more information) AND apply the $limit 
   * and $offset parameters specified (for method based global services)
   * @type string
   */
  var $_lookupService;
  
  /**
   * a regular expression that must match the search term in order for this 
   * entity to be included in a search. search attribute specific regular 
   * expressions can also be specified in the _entitySearchAttrs attributes (for 
   * non-global services only)
   * @type string
   */
  var $_matchRegex;
  
  /**
   * when this entity is represented in the file system, and a corresponding 
   * property of the node representing it in the file system is modified, this 
   * attribute may be used to specify a callback on the instance of that entity 
   * (the value object/VO) that should be invoked when that occurs. this method 
   * will have the following signature: (attr : String, mixed : val) : void
   * where attr/val may be any of the following possible combination of values: 
   * "nodeId"/int, 'dateCreated'/SRA_GregorianDate, 
   * 'dateModified'/SRA_GregorianDate, 'name'/string, 'nodeGroup'/OsGroupVO, 
   * 'nodeOwner'/OsUserVO, 'parent'/CoreVfsNodeVO, 'permissions'/int, 
   * 'size'/int, 'linkedTo'/int
   * If after setting these properties (only the dirty ones will be set) the 
   * corresponding entity instance is dirty, it will be updated using the 
   * 'update' method. change restrictions can be added to the entity using the 
   * 'can-*' attributes
   * @type string
   */
  var $_propertySetter;
  
  /**
   * the primary key attribute. specify this IF you wish for the primary key to 
   * be retrieved in the ajax service request, but not displayed in the search 
   * results
   * @type string
   */
  var $_pkAttr;
  
  /**
   * the label for this entity. this should reference a string in the plugin's 
   * resources properties files. this attribute is mandatory when _serviceGlobal 
   * is TRUE, otherwise, if not specified, the corresponding entity's resource 
   * will be used instead
   * @type string
   */
  var $_resource;
  
  /**
   * the resource bundle string to display when no results are returned for this 
   * entity in a given search. the default string is "No Matches". based on the 
   * values for the _includeNotFound and _includeNotInvoked attributes for this 
   * entity, the grouping representing it may be left out of the search results 
   * entirely
   * @type string
   */
  var $_resourceNotFound;
  
  /**
   * 1 or more search constraints that should be applied when a search is 
   * invoked. for non-global services these are the names of the attributes 
   * within the entity that should be included in the search. for global 
   * services, these will be used internally by the service itself. all entity 
   * elements must have at least 1 nested element of this type. when a search is 
   * invoked, the constraints for that search will be constructed based on these 
   * elements
   * @type SRAOS_EntitySearchAttr[]
   */
  var $_searchAttrs = array();
  
  /**
   * whether or not _lookupService is a global ajax service
   * @type boolean
   */
  var $_serviceGlobal;
  
  /**
   * whether or not the attributes displayed for this entity are sortable. if 
   * they are, their corresponding columns in the entity table will be sortable. 
   * _entityDisplAttrs elements may override this value
   * @type boolean
   */
  var $_sortable;
  
  /**
   * static javascript code that will return an a hash containing attribute 
   * names/sort method pairs specifying the default sort attributes/sort method. 
   * the value should be equal to one of the SRAOS_AjaxConstraint.OP_SORT_* sort 
   * operators (64=ascending, 128=descending)
   * @type String
   */
  var $_sortCallback;
  
  /**
   * an alternate class to utilize to format the search results for this entity. 
   * the first row in this table will consist of th cells containing the 
   * attribute headers, with one row following for each entity instance returned 
   * by the searchs
   * @type String
   */
  var $_tableClass;
  
  /**
   * an optional static method to invoke using eval to populate the table value 
   * for each displayed attribute. if not specified, the raw value of the 
   * attribute will be used. this method should have the following signature: 
   * (entity : String, attribute : String, value : mixed) : String
   * @type string
   */
  var $_valueCallback;
  
  /**
   * the application responsible for viewing entities of this entity type. an 
   * instance of this application will be obtained the first time that the user 
   * attempts to view an entity of this type. the _displCallback will be invoked 
   * against this same application instance for all subsequent entity display 
   * requests
   * @type string
   */
  var $_viewer;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Entity
	/**
	 * instantiates a new SRAOS_Entity object based on the $id specified. if 
   * there are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the entity
   * @param array $config the data to use to instantiate this entity
   * @param SRAOS_Plugin $plugin the plugin that this application pertains to
   * @access  public
	 */
	function SRAOS_Entity($id, & $config, & $plugin) {
    if (!$id || !$plugin || !is_array($config) || !isset($config['attributes']['icon'])) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - insufficient data to instantiate entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['attr-connective']) && $config['attributes']['attr-connective'] != SRA_AJAX_CONSTRAINT_GROUP_CONNNECTIVE_CONJUNCTIVE && $config['attributes']['attr-connective'] != SRA_AJAX_CONSTRAINT_GROUP_CONNNECTIVE_DISJUNCTIVE) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - attr-connective " . $config['attributes']['attr-connective']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['auto-displ-max']) && !is_numeric($config['attributes']['auto-displ-max']) || $config['attributes']['auto-displ-max'] < 0 || $config['attributes']['auto-displ-max'] > SRAOS_ENTITY_MAX_AUTO_DISPLAY) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - auto-displ-max " . $config['attributes']['auto-displ-max']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (!isset($config['attributes']['displ-callback'])) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - displ-callback must be specified for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['help-topic']) && !SRAOS_HelpTopic::isValid($plugin->_helpTopics[$config['attributes']['help-topic']])) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - help topic " . $config['attributes']['help-topic']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['viewer']) && !($plugin->getApplication($config['attributes']['viewer']))) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - viewer " . $config['attributes']['viewer']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $config['attributes']['icon'] = $config['attributes']['icon'] ? $config['attributes']['icon'] : $viewer->getIcon();
    if (!SRAOS_PluginManager::validateIcon($plugin->getId(), $config['attributes']['icon'])) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - icon " . $config['attributes']['icon']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    if (isset($config['attributes']['line-height']) && !is_numeric($config['attributes']['line-height']) || $config['attributes']['line-height'] < 0) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - line-height " . $config['attributes']['line-height']. " is not valid for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $this->_serviceGlobal = isset($config['attributes']['service-global']) && $config['attributes']['service-global'] == '1' ? TRUE : FALSE;
    if (!$this->_serviceGlobal && (!isset($config['entity-search-attr']) || !is_array($config['entity-search-attr']) || count($config['entity-search-attr']) < 1)) {
			$msg = "SRAOS_Entity::SRAOS_Entity: Failed - at least 1 entity-search-attr must be specified for entity ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    
		$this->_id = $id;
    $this->_pluginId = $plugin->getId();
    $this->_plugin =& $plugin;
    $this->_attrConnective = isset($config['attributes']['attr-connective']) ? $config['attributes']['attr-connective'] : SRA_AJAX_CONSTRAINT_GROUP_CONNNECTIVE_DISJUNCTIVE;
    $this->_attrsCallback = isset($config['attributes']['attrs-callback']) ? $config['attributes']['attrs-callback'] : NULL;
    $this->_autoDisplMax = isset($config['attributes']['auto-displ-max']) ? $config['attributes']['auto-displ-max'] : 0;
    $this->_canCopy = isset($config['attributes']['can-copy']) && $config['attributes']['can-copy'] == '1' ? TRUE : FALSE;
    $this->_canCreate = isset($config['attributes']['can-create']) && $config['attributes']['can-create'] == '1' ? TRUE : FALSE;
    $this->_canDelete = isset($config['attributes']['can-delete']) && $config['attributes']['can-delete'] == '1' ? TRUE : FALSE;
    $this->_canMove = isset($config['attributes']['can-move']) && $config['attributes']['can-move'] == '1' ? TRUE : FALSE;
    $this->_canRename = isset($config['attributes']['can-rename']) && $config['attributes']['can-rename'] == '1' ? TRUE : FALSE;
    $this->_displCallback = $config['attributes']['displ-callback'];
    $this->_headerCallback = isset($config['attributes']['header-callback']) ? $config['attributes']['header-callback'] : NULL;
    $this->_helpTopic = isset($config['attributes']['help-topic']) ? $config['attributes']['help-topic'] : NULL;
    $this->_icon = $config['attributes']['icon'];
    $this->_includeActions = isset($config['attributes']['include-actions']) && $config['attributes']['include-actions'] == '1' ? TRUE : FALSE;
    $this->_includeNotFound = isset($config['attributes']['include-not-found']) && $config['attributes']['include-not-found'] == '0' ? FALSE : TRUE;
    $this->_includeNotInvoked = isset($config['attributes']['include-not-invoked']) && $config['attributes']['include-not-invoked'] == '1' ? TRUE : FALSE;
    $this->_lineHeight = isset($config['attributes']['line-height']) ? $config['attributes']['line-height'] : NULL;
    $this->_lookupService = $config['attributes']['lookup-service'];
    $this->_matchRegex = isset($config['attributes']['match-regex']) ? $config['attributes']['match-regex'] : NULL;
    $this->_pkAttr = isset($config['attributes']['pk-attr']) ? $config['attributes']['pk-attr'] : NULL;
    $this->_propertySetter = isset($config['attributes']['property-setter']) ? $config['attributes']['property-setter'] : NULL;
    if (isset($config['attributes']['resource'])) {
      $this->_resource = $config['attributes']['resource'];
    }
    $this->_resourceNotFound = isset($config['attributes']['resource-not-found']) ? $config['attributes']['resource-not-found'] : SRAOS_ENTITY_DEFAULT_RESOURCE_NOT_FOUND;
    $this->_sortable = isset($config['attributes']['sortable']) && $config['attributes']['sortable'] == '1' ? TRUE : FALSE;
    $this->_sortCallback = isset($config['attributes']['sort-callback']) ? $config['attributes']['sort-callback'] : NULL;
    $this->_tableClass = isset($config['attributes']['table-class']) ? $config['attributes']['table-class'] : NULL;
    $this->_valueCallback = isset($config['attributes']['value-callback']) ? $config['attributes']['value-callback'] : NULL;
    $this->_viewer = $config['attributes']['viewer'];
    
    // display attributes
    if (isset($config['entity-displ-attr'])) {
      $keys = array_keys($config['entity-displ-attr']);
      foreach ($keys as $key) {
        $this->_displAttrs[$key] = new SRAOS_EntityDisplAttr($key, $config['entity-displ-attr'][$key], $this);
        if (SRA_Error::isError($this->_displAttrs[$key]->err)) {
          $msg = "SRAOS_Entity::SRAOS_Entity: Failed - Unable to instantiate SRAOS_EntityDisplAttr ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    // search attrs
    if (!$this->_serviceGlobal && isset($config['entity-search-attr'])) {
      $keys = array_keys($config['entity-search-attr']);
      foreach ($keys as $key) {
        $this->_searchAttrs[$key] = new SRAOS_EntitySearchAttr($key, $config['entity-search-attr'][$key], $this);
        if (SRA_Error::isError($this->_searchAttrs[$key]->err)) {
          $msg = "SRAOS_Entity::SRAOS_Entity: Failed - Unable to instantiate SRAOS_EntitySearchAttr ${key}";
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
  
	// {{{ getInstance
	/**
	 * returns the instance of the actual class this entity represents using the 
   * primary key ($pk) specified
   * @param mixed $pk the primary key of the object to return
   * @access  public
	 * @return object
	 */
	function & getInstance($pk) {
    $nl = NULL;
    return $pk && ($dao =& SRA_DaoFactory::getDao($this->_id)) ? $dao->findByPk($pk) : $nl;
	}
	// }}}
  
  // {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   *
   * SRAOS_Entity(id, pluginId, attrConnective, attrLabels, attrsCallback, autoDisplMax, 
   *              canCopy, canCreate, canDelete, canMove, canRename
   *              displAttrs, displCallback, headerCallback, helpTopic, icon, iconUri, 
   *              includeActions, includeNotFound, includeNotInvoked, label, labelNotFound, lineHeight, 
   *              lookupService, matchRegex, pkAttr, searchAttrs, serviceGlobal, sortable, 
   *              sortCallback, valueCallback, viewer)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    $code = 'new SRAOS_Entity("' . $this->_id . '", "' . $this->_pluginId . '", ';
    $code .= '"' . $this->_attrConnective . '", ';
    $code .= '{';
    if (!$this->_serviceGlobal) {
      $dao =& SRA_DaoFactory::getDao($this->_id);
      $obj =& $dao->newInstance();
      $attrs = $obj->getAttributeNames();
      $started = FALSE;
      foreach($attrs as $attr) {
        $code .= $started ? ', ' : '';
        $code .= '"' . $attr . '": "' . str_replace('"', '\"', $obj->getEntityLabel($attr)) . '"';
        $started = TRUE;
      }
    }
    $code .= '}, ';
    $code .= $this->_attrsCallback ? '"' . $this->_attrsCallback . '", ' : 'null, ';
    $code .= $this->_autoDisplMax . ', ';
    $code .= $this->_canCopy ? 'true, ' : 'false, ';
    $code .= $this->_canCreate ? 'true, ' : 'false, ';
    $code .= $this->_canDelete ? 'true, ' : 'false, ';
    $code .= $this->_canMove ? 'true, ' : 'false, ';
    $code .= $this->_canRename ? 'true, ' : 'false, ';
    $code .= '[';
    $keys = array_keys($this->_displAttrs);
    foreach($keys as $key) {
      $code .= $key == $keys[0] ? '' : ', ';
      $code .= $this->_displAttrs[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    $code .= '"' . $this->_displCallback . '", ';
    $code .= $this->_headerCallback ? '"' . $this->_headerCallback . '", ' : 'null, ';
    $code .= $this->_helpTopic ? '"' . $this->_helpTopic . '", ' : 'null, ';
    $code .= '"' . $this->_icon . '", ';
    $code .= '"' . SRAOS_PluginManager::getIconUri($this->_plugin->getId(), $this->_icon) . '", ';
    $code .= $this->_includeActions ? 'true, ' : 'false, ';
    $code .= $this->_includeNotFound ? 'true, ' : 'false, ';
    $code .= $this->_includeNotInvoked ? 'true, ' : 'false, ';
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    $code .= $this->_resourceNotFound ? '"' . str_replace('"', '\"', $this->getLabelNotFound()) . '", ' : 'null, ';
    $code .= ($this->_lineHeight ? $this->_lineHeight : 'null') . ', ';
    $code .= '"' . $this->_lookupService . '", ';
    $code .= $this->_matchRegex ? '"' . str_replace('"', '\"', $this->_matchRegex) . '", ' : 'null, ';
    $code .= $this->_pkAttr ? '"' . $this->_pkAttr . '", ' : 'null, ';
    if ($this->_serviceGlobal) {
      $code .= 'null, ';
    }
    else {
      $code .= '[';
      $keys = array_keys($this->_searchAttrs);
      foreach($keys as $key) {
        $code .= $key == $keys[0] ? '' : ', ';
        $code .= $this->_searchAttrs[$key]->getJavascriptInstanceCode();
      }
      $code .= '], ';
    }
    $code .= $this->_serviceGlobal ? 'true, ' : 'false, ';
    $code .= $this->_sortable ? 'true, ' : 'false, ';
    $code .= $this->_sortCallback ? '"' . $this->_sortCallback . '", ' : 'null, ';
    $code .= $this->_tableClass ? '"' . $this->_tableClass . '", ' : 'null, ';
    $code .= $this->_valueCallback ? '"' . $this->_valueCallback . '", ' : 'null, ';
    $code .= '"' . $this->_viewer . '")';
    return $code;
  }
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this entity
   * @access  public
	 * @return string
	 */
	function getLabel() {
    if (!$this->_resource) {
      $dao =& SRA_DaoFactory::getDao($this->_id);
      $obj =& $dao->newInstance();
      return $obj->getEntityLabel();
    }
		return $this->_plugin->resources->getString($this->_resource);
	}
	// }}}
  
	// {{{ getLabelNotFound
	/**
	 * returns the not found label for this entity
   * @access  public
	 * @return string
	 */
	function getLabelNotFound() {
		return $this->_resourceNotFound ? $this->_plugin->resources->getString($this->_resourceNotFound) : NULL;
	}
	// }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this entity
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
	 * returns the pluginId of this entity
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
  
	// {{{ getAttrConnective
	/**
	 * returns the attrConnective of this entity
   * @access  public
	 * @return string
	 */
	function getAttrConnective() {
		return $this->_attrConnective;
	}
	// }}}
	
	// {{{ setAttrConnective
	/**
	 * sets the plugin attrConnective
	 * @param string $attrConnective the attrConnective to set
   * @access  public
	 * @return void
	 */
	function setAttrConnective($attrConnective) {
		$this->_attrConnective = $attrConnective;
	}
	// }}}
  
	// {{{ getAttrsCallback
	/**
	 * returns the attrsCallback of this entity
   * @access  public
	 * @return string
	 */
	function getAttrsCallback() {
		return $this->_attrsCallback;
	}
	// }}}
	
	// {{{ setAttrsCallback
	/**
	 * sets the plugin attrsCallback
	 * @param string $attrsCallback the attrsCallback to set
   * @access  public
	 * @return void
	 */
	function setAttrsCallback($attrsCallback) {
		$this->_attrsCallback = $attrsCallback;
	}
	// }}}
  
	// {{{ getAutoDisplMax
	/**
	 * returns the autoDisplMax of this entity
   * @access  public
	 * @return int
	 */
	function getAutoDisplMax() {
		return $this->_autoDisplMax;
	}
	// }}}
	
	// {{{ setAutoDisplMax
	/**
	 * sets the plugin autoDisplMax
	 * @param int $autoDisplMax the autoDisplMax to set
   * @access  public
	 * @return void
	 */
	function setAutoDisplMax($autoDisplMax) {
		$this->_autoDisplMax = $autoDisplMax;
	}
	// }}}
  
	// {{{ isCanCopy
	/**
	 * returns the canCopy of this entity
   * @access  public
	 * @return boolean
	 */
	function isCanCopy() {
		return $this->_canCopy;
	}
	// }}}
	
	// {{{ setCanCopy
	/**
	 * sets the plugin canCopy
	 * @param boolean $canCopy the canCopy to set
   * @access  public
	 * @return void
	 */
	function setCanCopy($canCopy) {
		$this->_canCopy = $canCopy;
	}
	// }}}
  
	// {{{ isCanCreate
	/**
	 * returns the canCreate of this entity
   * @access  public
	 * @return boolean
	 */
	function isCanCreate() {
		return $this->_canCreate;
	}
	// }}}
	
	// {{{ setCanCreate
	/**
	 * sets the plugin canCreate
	 * @param boolean $canCreate the canCreate to set
   * @access  public
	 * @return void
	 */
	function setCanCreate($canCreate) {
		$this->_canCreate = $canCreate;
	}
	// }}}
  
	// {{{ isCanDelete
	/**
	 * returns the canDelete of this entity
   * @access  public
	 * @return boolean
	 */
	function isCanDelete() {
		return $this->_canDelete;
	}
	// }}}
	
	// {{{ setCanDelete
	/**
	 * sets the plugin canDelete
	 * @param boolean $canDelete the canDelete to set
   * @access  public
	 * @return void
	 */
	function setCanDelete($canDelete) {
		$this->_canDelete = $canDelete;
	}
	// }}}
  
	// {{{ isCanMove
	/**
	 * returns the canMove of this entity
   * @access  public
	 * @return boolean
	 */
	function isCanMove() {
		return $this->_canMove;
	}
	// }}}
	
	// {{{ setCanMove
	/**
	 * sets the plugin canMove
	 * @param boolean $canMove the canMove to set
   * @access  public
	 * @return void
	 */
	function setCanMove($canMove) {
		$this->_canMove = $canMove;
	}
	// }}}
  
	// {{{ isCanRename
	/**
	 * returns the canRename of this entity
   * @access  public
	 * @return boolean
	 */
	function isCanRename() {
		return $this->_canRename;
	}
	// }}}
	
	// {{{ setCanRename
	/**
	 * sets the plugin canRename
	 * @param boolean $canRename the canRename to set
   * @access  public
	 * @return void
	 */
	function setCanRename($canRename) {
		$this->_canRename = $canRename;
	}
	// }}}
  
	// {{{ getDisplAttrs
	/**
	 * returns the displAttrs of this entity
   * @access  public
	 * @return SRAOS_EntityDisplAttr
	 */
	function getDisplAttrs() {
		return $this->_displAttrs;
	}
	// }}}
	
	// {{{ setDisplAttrs
	/**
	 * sets the plugin displAttrs
	 * @param SRAOS_EntityDisplAttr $displAttrs the displAttrs to set
   * @access  public
	 * @return void
	 */
	function setDisplAttrs($displAttrs) {
		$this->_displAttrs = $displAttrs;
	}
	// }}}
  
	// {{{ getDisplCallback
	/**
	 * returns the displCallback of this entity
   * @access  public
	 * @return string
	 */
	function getDisplCallback() {
		return $this->_displCallback;
	}
	// }}}
	
	// {{{ setDisplCallback
	/**
	 * sets the plugin displCallback
	 * @param string $displCallback the displCallback to set
   * @access  public
	 * @return void
	 */
	function setDisplCallback($displCallback) {
		$this->_displCallback = $displCallback;
	}
	// }}}
  
	// {{{ getHeaderCallback
	/**
	 * returns the headerCallback of this entity
   * @access  public
	 * @return string
	 */
	function getHeaderCallback() {
		return $this->_headerCallback;
	}
	// }}}
	
	// {{{ setHeaderCallback
	/**
	 * sets the plugin headerCallback
	 * @param string $headerCallback the headerCallback to set
   * @access  public
	 * @return void
	 */
	function setHeaderCallback($headerCallback) {
		$this->_headerCallback = $headerCallback;
	}
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the helpTopic of this entity
   * @access  public
	 * @return string
	 */
	function getHelpTopic() {
		return $this->_helpTopic;
	}
	// }}}
	
	// {{{ setHelpTopic
	/**
	 * sets the plugin helpTopic
	 * @param string $helpTopic the helpTopic to set
   * @access  public
	 * @return void
	 */
	function setHelpTopic($helpTopic) {
		$this->_helpTopic = $helpTopic;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this entity
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
  
	// {{{ isIncludeActions
	/**
	 * returns the includeActions of this entity
   * @access  public
	 * @return boolean
	 */
	function isIncludeActions() {
		return $this->_includeActions;
	}
	// }}}
	
	// {{{ setIncludeActions
	/**
	 * sets the plugin includeActions
	 * @param boolean $includeActions the includeActions to set
   * @access  public
	 * @return void
	 */
	function setIncludeActions($includeActions) {
		$this->_includeActions = $includeActions;
	}
	// }}}
  
	// {{{ isIncludeNotFound
	/**
	 * returns the includeNotFound of this entity
   * @access  public
	 * @return boolean
	 */
	function isIncludeNotFound() {
		return $this->_includeNotFound;
	}
	// }}}
	
	// {{{ setIncludeNotFound
	/**
	 * sets the plugin includeNotFound
	 * @param boolean $includeNotFound the includeNotFound to set
   * @access  public
	 * @return void
	 */
	function setIncludeNotFound($includeNotFound) {
		$this->_includeNotFound = $includeNotFound;
	}
	// }}}
  
	// {{{ isIncludeNotInvoked
	/**
	 * returns the includeNotInvoked of this entity
   * @access  public
	 * @return boolean
	 */
	function isIncludeNotInvoked() {
		return $this->_includeNotInvoked;
	}
	// }}}
	
	// {{{ setIncludeNotInvoked
	/**
	 * sets the plugin includeNotInvoked
	 * @param boolean $includeNotInvoked the includeNotInvoked to set
   * @access  public
	 * @return void
	 */
	function setIncludeNotInvoked($includeNotInvoked) {
		$this->_includeNotInvoked = $includeNotInvoked;
	}
	// }}}
  
	// {{{ getLineHeight
	/**
	 * returns the lineHeight of this entity
   * @access  public
	 * @return int
	 */
	function getLineHeight() {
		return $this->_lineHeight;
	}
	// }}}
	
	// {{{ setLineHeight
	/**
	 * sets the plugin lineHeight
	 * @param int $lineHeight the lineHeight to set
   * @access  public
	 * @return void
	 */
	function setLineHeight($lineHeight) {
		$this->_lineHeight = $lineHeight;
	}
	// }}}
  
	// {{{ getLookupService
	/**
	 * returns the lookupService of this entity
   * @access  public
	 * @return string
	 */
	function getLookupService() {
		return $this->_lookupService;
	}
	// }}}
	
	// {{{ setLookupService
	/**
	 * sets the plugin lookupService
	 * @param string $lookupService the lookupService to set
   * @access  public
	 * @return void
	 */
	function setLookupService($lookupService) {
		$this->_lookupService = $lookupService;
	}
	// }}}
  
	// {{{ getMatchRegex
	/**
	 * returns the matchRegex of this entity
   * @access  public
	 * @return string
	 */
	function getMatchRegex() {
		return $this->_matchRegex;
	}
	// }}}
	
	// {{{ setMatchRegex
	/**
	 * sets the plugin matchRegex
	 * @param string $matchRegex the matchRegex to set
   * @access  public
	 * @return void
	 */
	function setMatchRegex($matchRegex) {
		$this->_matchRegex = $matchRegex;
	}
	// }}}
  
	// {{{ getPkAttr
	/**
	 * returns the pkAttr of this entity
   * @access  public
	 * @return string
	 */
	function getPkAttr() {
		return $this->_pkAttr;
	}
	// }}}
	
	// {{{ setPkAttr
	/**
	 * sets the plugin pkAttr
	 * @param string $pkAttr the pkAttr to set
   * @access  public
	 * @return void
	 */
	function setPkAttr($pkAttr) {
		$this->_pkAttr = $pkAttr;
	}
	// }}}
  
	// {{{ getPropertySetter
	/**
	 * returns the propertySetter of this entity
   * @access  public
	 * @return string
	 */
	function getPropertySetter() {
		return $this->_propertySetter;
	}
	// }}}
	
	// {{{ setPropertySetter
	/**
	 * sets the plugin propertySetter
	 * @param string $propertySetter the propertySetter to set
   * @access  public
	 * @return void
	 */
	function setPropertySetter($propertySetter) {
		$this->_propertySetter = $propertySetter;
	}
	// }}}
  
	// {{{ getResource
	/**
	 * returns the resource of this entity
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
  
	// {{{ getResourceNotFound
	/**
	 * returns the resourceNotFound of this entity
   * @access  public
	 * @return string
	 */
	function getResourceNotFound() {
		return $this->_resourceNotFound;
	}
	// }}}
	
	// {{{ setResourceNotFound
	/**
	 * sets the plugin resourceNotFound
	 * @param string $resourceNotFound the resourceNotFound to set
   * @access  public
	 * @return void
	 */
	function setResourceNotFound($resourceNotFound) {
		$this->_resourceNotFound = $resourceNotFound;
	}
	// }}}
  
	// {{{ getSearchAttrs
	/**
	 * returns the searchAttrs of this entity
   * @access  public
	 * @return SRAOS_EntitySearchAttr[]
	 */
	function getSearchAttrs() {
		return $this->_searchAttrs;
	}
	// }}}
	
	// {{{ setSearchAttrs
	/**
	 * sets the plugin searchAttrs
	 * @param SRAOS_EntitySearchAttr[] $searchAttrs the searchAttrs to set
   * @access  public
	 * @return void
	 */
	function setSearchAttrs($searchAttrs) {
		$this->_searchAttrs = $searchAttrs;
	}
	// }}}
  
	// {{{ isServiceGlobal
	/**
	 * returns the serviceGlobal of this entity
   * @access  public
	 * @return boolean
	 */
	function isServiceGlobal() {
		return $this->_serviceGlobal;
	}
	// }}}
	
	// {{{ setServiceGlobal
	/**
	 * sets the plugin serviceGlobal
	 * @param boolean $serviceGlobal the serviceGlobal to set
   * @access  public
	 * @return void
	 */
	function setServiceGlobal($serviceGlobal) {
		$this->_serviceGlobal = $serviceGlobal;
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
  
	// {{{ getSortCallback
	/**
	 * returns the sortCallback of this entity
   * @access  public
	 * @return string
	 */
	function getSortCallback() {
		return $this->_sortCallback;
	}
	// }}}
	
	// {{{ setSortCallback
	/**
	 * sets the plugin sortCallback
	 * @param string $sortCallback the sortCallback to set
   * @access  public
	 * @return void
	 */
	function setSortCallback($sortCallback) {
		$this->_sortCallback = $sortCallback;
	}
	// }}}
  
	// {{{ getTableClass
	/**
	 * returns the tableClass of this entity
   * @access  public
	 * @return string
	 */
	function getTableClass() {
		return $this->_tableClass;
	}
	// }}}
	
	// {{{ setTableClass
	/**
	 * sets the plugin tableClass
	 * @param string $tableClass the tableClass to set
   * @access  public
	 * @return void
	 */
	function setTableClass($tableClass) {
		$this->_tableClass = $tableClass;
	}
	// }}}
  
	// {{{ getValueCallback
	/**
	 * returns the valueCallback of this entity
   * @access  public
	 * @return string
	 */
	function getValueCallback() {
		return $this->_valueCallback;
	}
	// }}}
	
	// {{{ setValueCallback
	/**
	 * sets the plugin valueCallback
	 * @param string $valueCallback the valueCallback to set
   * @access  public
	 * @return void
	 */
	function setValueCallback($valueCallback) {
		$this->_valueCallback = $valueCallback;
	}
	// }}}
  
	// {{{ getViewer
	/**
	 * returns the viewer of this entity
   * @access  public
	 * @return string
	 */
	function getViewer() {
		return $this->_viewer;
	}
	// }}}
	
	// {{{ setViewer
	/**
	 * sets the plugin viewer
	 * @param string $viewer the viewer to set
   * @access  public
	 * @return void
	 */
	function setViewer($viewer) {
		$this->_viewer = $viewer;
	}
	// }}}
	
	
	// Static methods
  
	// {{{ getEntity
	/**
	 * Static method that returns a reference to the SRAOS_Entity object 
   * identified by $code
	 * @param  String $code the encoded id to return the instance of. the 
   * encoding uses the following struction: [plugin id]:[entity id]
	 * @access	public
	 * @return	boolean
	 */
	function & getEntity($code) {
    include_once('SRAOS_PluginManager.php');
		$pieces = explode(':', $code);
    $nl = NULL;
    return count($pieces) == 2 && ($plugin =& SRAOS_PluginManager::getPlugin($pieces[0])) && ($entity =& $plugin->getEntity($pieces[1])) ? $entity : $nl;
	}
	// }}}
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Entity object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_entity');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>