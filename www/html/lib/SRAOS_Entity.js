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

// {{{ SRAOS_Entity
/**
 * defines a searchable element within the OS as well as how access to that 
 * element should be obtained. a user will ONLY have access to an entity if they 
 * have access to it's corresponding viewer through their application 
 * permissions
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_Entity = function(id, pluginId, attrConnective, attrLabels, attrsCallback, autoDisplMax, canCopy, canCreate, canDelete, canMove, canRename, displAttrs, displCallback, headerCallback, helpTopic, icon, iconUri, includeActions, includeNotFound, includeNotInvoked, label, labelNotFound, lineHeight, lookupService, matchRegex, pkAttr, searchAttrs, serviceGlobal, sortable, sortCallback, tableClass, valueCallback, viewer) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique entity identifier
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this entity pertains to
	 * @type string
	 */
	this._pluginId = pluginId;
  
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
  this._attrConnective = attrConnective;
  
  /**
   * a hash containing the default attribute resource indexed by attribute name
   * for non-global entities
   * @type Array
   */
  this._attrLabels = attrLabels;
  
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
  this._attrsCallback = attrsCallback;
  
  /**
   * if the # of results returned by a given search are less then or equal to 
   * this attribute value then _displayCallack will be invoked once for each 
   * result after a 1 second delay. the default value for this attribute is 0, 
   * meaning auto-display will not occur. the maximum value for this attribute 
   * is 5.
   * @type int
   */
  this._autoDisplMax = autoDisplMax;
  
  /**
   * whether or not this entity can be copied when it is represented in the file 
   * system. the 'copy' method of the corresponding entity instance will be used 
   * to create a copy and then commit that copy as a new instance. if that 
   * invocation returns an SRA_Error object, the copy will be aborted and a 
   * generic error message returned
   * @type boolean
   */
  this._canCopy = canCopy;
  
  /**
   * whether or not this entity supports empty instantiations. if true, the user 
   * will be able to create a blank instance of this entity. when this occurs 
   * within the file system a new instance of the entity will be created using 
   * the constructor with no initialization parameters and that instance will be 
   * inserted into the database. an entity node within the file system will then 
   * be able to be created based on the id of that new entity instance
   * @type boolean
   */
  this._canCreate = canCreate;
  
  /**
   * whether or not this entity can be deleted when it is represented in the 
   * file system. the 'delete' method of the corresponding entity instance will 
   * be invoked. if that invocation returns an SRA_Error object, the delete will 
   * be aborted and a generic error message returned
   * @type boolean
   */
  this._canDelete = canDelete;
  
  /**
   * whether or not this entity can be moved when it is represented in the file 
   * system. this includes moving it to the trash
   * @type boolean
   */
  this._canMove = canMove;
  
  /**
   * whether or not this entity can be renamed when it is represented in the 
   * file system
   * @type boolean
   */
  this._canRename = canRename;
  
  /**
   * the attributes that should be included in the display of this entity in the 
   * search results view. each entity returned by the ajax service must be 
   * indexed according to these attribute names. for global services, 1 or more 
   * _displAttrs elements are required. for non-global services, they are not 
   * required and if they are not, whatever attributes returned by the service 
   * will be rendered in the order they are specified
   * @type SRAOS_EntityDisplAttr[]
   */
  this._displAttrs = displAttrs;
  
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
  this._displCallback = displCallback;
  
  /**
   * an optional static method to invoke using eval to populate the table header 
   * for each displayed attribute column. if not specified, the 
   * SRAOS_EntityDisplAttr::resource or entity model attribute label will be 
   * used. this method should have the following signature: 
   * (attribute : String, entity : String) : String
   * @type string
   */
  this._headerCallback = headerCallback;
  
  /**
	 * the identifier of the plugin help topic that should be displayed for help 
   * related information about this entity
	 * @type string
	 */
	this._helpTopic = helpTopic;
  
  /**
	 * the icon to display to represent an object instance of this entity type
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
   * whether or not actions should be included in the display results for this 
   * entity. if true, the last column in the display results will display action 
   * links (using the 16 pixel action image) for each entity rendered
   * @type boolean
   */
  this._includeActions = includeActions;
  
  /**
   * whether or not a grouping for this entity should be displayed with the 
   * _resourceNotFound message when no entities match the search criteria. 
   * by default, this attribute is TRUE. if FALSE, and no entities are returned 
   * in the search, the entire grouping for this entity will be left out of the 
   * search results
   * @type boolean
   */
  this._includeNotFound = includeNotFound;
  
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
  this._includeNotInvoked = includeNotInvoked;
  
  /**
   * the label for this entity. this should reference a string in the plugin's 
   * resources properties files. this attribute is mandatory when _serviceGlobal 
   * is TRUE, otherwise, if not specified, the corresponding entity's resource 
   * will be used instead
   * @type string
   */
  this._label = label;
  
  /**
   * the resource bundle string to display when no results are returned for this 
   * entity in a given search. the default string is "No Matches". based on the 
   * values for the _includeNotFound and _includeNotInvoked attributes for this 
   * entity, the grouping representing it may be left out of the search results 
   * entirely
   * @type string
   */
  this._labelNotFound = labelNotFound;
  
  /**
   * in order for the search results ajax-scroll pagination to work properly, 
   * the line height for each entity must be uniform. if _valueCallback is 
   * specified, and the line height will exceed the default, then this attribute 
   * should be specified. the value of this attribute is pixels
   * @type int
   */
  this._lineHeight = lineHeight;
  
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
  this._lookupService = lookupService;
  
  /**
   * a regular expression that must match the search term in order for this 
   * entity to be included in a search. search attribute specific regular 
   * expressions can also be specified in the _entitySearchAttrs attributes (for 
   * non-global services only)
   * @type string
   */
  this._matchRegex = matchRegex;
  
  /**
   * the primary key attribute. specify this IF you wish for the primary key to 
   * be retrieved in the ajax service request, but not displayed in the search 
   * results
   * @type string
   */
  this._pkAttr = pkAttr;
  
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
  this._searchAttrs = searchAttrs;
  
  /**
   * whether or not _lookupService is a global ajax service
   * @type boolean
   */
  this._serviceGlobal = serviceGlobal;
  
  /**
   * whether or not the attributes displayed for this entity are sortable. if 
   * they are, their corresponding columns in the entity table will be sortable. 
   * _entityDisplAttrs elements may override this value
   * @type boolean
   */
  this._sortable = sortable;
  
  /**
   * static javascript code that will return an a hash containing attribute 
   * names/sort method pairs specifying the default sort attributes/sort method. 
   * the value should be equal to one of the SRAOS_AjaxConstraint.OP_SORT_* sort 
   * operators (64=ascending, 128=descending)
   * @type String
   */
  this._sortCallback = sortCallback;
  
  /**
   * an alternate class to utilize to format the search results for this entity. 
   * the first row in this table will consist of th cells containing the 
   * attribute headers, with one row following for each entity instance returned 
   * by the searchs
   * @type String
   */
  this._tableClass = tableClass;
  
  /**
   * an optional static method to invoke using eval to populate the table value 
   * for each displayed attribute. if not specified, the raw value of the 
   * attribute will be used. this method should have the following signature: 
   * (attribute : String, entityInstance : Object, entity : String) : String
   * @type string
   */
  this._valueCallback = valueCallback;
  
  /**
   * the application responsible for viewing entities of this entity type. an 
   * instance of this application will be obtained the first time that the user 
   * attempts to view an entity of this type. the _displCallback will be invoked 
   * against this same application instance for all subsequent entity display 
   * requests
   * @type string
   */
  this._viewer = viewer;
	
  // }}}
  
  // {{{ Operations
	
  
  // public operations
  
  // {{{ getAttrLabel
  /**
   * returns the label for the attribute specified
   * @param String attr the name of the attribute
   * @return String
   */
  this.getAttrLabel = function(attr) {
    for(var i in this._displAttrs) {
      if (this._displAttrs[i].getId() == attr) {
        if (this._displAttrs[i].getLabel()) {
          return this._displAttrs[i].getLabel();
        }
        break;
      }
    }
    return this._attrLabels[attr];
  };
  // }}}
  
	// {{{ getCode
	/**
	 * returns the unique code for this entity ([plugin id]:[entity id])
   * @access  public
	 * @return string
	 */
	this.getCode = function() {
		return this._pluginId + ':' + this._id;
	};
	// }}}
  
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this entity
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this entity
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getAttrConnective
	/**
	 * returns the attrConnective of this entity
   * @access  public
	 * @return string
	 */
	this.getAttrConnective = function() {
		return this._attrConnective;
	};
	// }}}
  
	// {{{ getAttrLabels
	/**
	 * returns the attrResources of this entity
   * @access  public
	 * @return Array
	 */
	this.getAttrLabels = function() {
		return this._attrLabels;
	};
	// }}}
  
	// {{{ getAttrsCallback
	/**
	 * returns the attrsCallback of this entity
   * @access  public
	 * @return string
	 */
	this.getAttrsCallback = function() {
		return this._attrsCallback;
	};
	// }}}
  
	// {{{ getAutoDisplMax
	/**
	 * returns the autoDisplMax of this entity
   * @access  public
	 * @return int
	 */
	this.getAutoDisplMax = function() {
		return this._autoDisplMax;
	};
	// }}}
  
	// {{{ isCanCopy
	/**
	 * returns the canCopy of this entity
   * @access  public
	 * @return boolean
	 */
	this.isCanCopy = function() {
		return this._canCopy;
	};
	// }}}
  
	// {{{ isCanCreate
	/**
	 * returns the canCreate of this entity
   * @access  public
	 * @return boolean
	 */
	this.isCanCreate = function() {
		return this._canCreate;
	};
	// }}}
  
	// {{{ isCanDelete
	/**
	 * returns the canDelete of this entity
   * @access  public
	 * @return boolean
	 */
	this.isCanDelete = function() {
		return this._canDelete;
	};
	// }}}
  
	// {{{ isCanMove
	/**
	 * returns the canMove of this entity
   * @access  public
	 * @return boolean
	 */
	this.isCanMove = function() {
		return this._canMove;
	};
	// }}}
  
	// {{{ isCanRename
	/**
	 * returns the canRename of this entity
   * @access  public
	 * @return boolean
	 */
	this.isCanRename = function() {
		return this._canRename;
	};
	// }}}
  
	// {{{ getDisplAttr
	/**
	 * returns the displAttr specified, or null if it is not present
   * @param String id the id of the attribute to return
   * @access  public
	 * @return SRAOS_EntityDisplAttr
	 */
	this.getDisplAttr = function(id) {
		for(var i in this._displAttrs) {
      if (this._displAttrs[i].getId() == id) {
        return this._displAttrs[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getDisplAttrs
	/**
	 * returns the displAttrs of this entity
   * @access  public
	 * @return SRAOS_EntityDisplAttr[]
	 */
	this.getDisplAttrs = function() {
		return this._displAttrs;
	};
	// }}}
  
	// {{{ getDisplCallback
	/**
	 * returns the displCallback of this entity
   * @access  public
	 * @return string
	 */
	this.getDisplCallback = function() {
		return this._displCallback;
	};
	// }}}
  
	// {{{ getHeaderCallback
	/**
	 * returns the headerCallback of this entity
   * @access  public
	 * @return string
	 */
	this.getHeaderCallback = function() {
		return this._headerCallback;
	};
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the help topic of this entity or null if it does not have one
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	this.getHelpTopic = function() {
		return this._helpTopic;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the icon of this entity
   * @access  public
	 * @return string
	 */
	this.getIcon = function() {
		return this._icon;
	};
	// }}}
  
	// {{{ getIconPath
	/**
	 * returns the full uri path to the icon of the specified size
   * @access  public
	 * @return string
	 */
	this.getIconPath = function(size) {
		return this._icon && size ?  this._iconUri + size + '/' + this._icon : null;
	};
	// }}}
  
	// {{{ getIconUri
	/**
	 * returns the iconUri of this application
   * @access  public
	 * @return string
	 */
	this.getIconUri = function() {
		return this._iconUri;
	};
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label of this window
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
  
	// {{{ getLabelNotFound
	/**
	 * returns the labelNotFound of this window
   * @access  public
	 * @return string
	 */
	this.getLabelNotFound = function() {
		return this._labelNotFound;
	};
	// }}}
  
	// {{{ isIncludeActions
	/**
	 * returns the includeActions of this entity
   * @access  public
	 * @return boolean
	 */
	this.isIncludeActions = function() {
		return this._includeActions;
	};
	// }}}
  
	// {{{ isIncludeNotFound
	/**
	 * returns the includeNotFound of this entity
   * @access  public
	 * @return boolean
	 */
	this.isIncludeNotFound = function() {
		return this._includeNotFound;
	};
	// }}}
  
  
	// {{{ isIncludeNotInvoked
	/**
	 * returns the includeNotInvoked of this entity
   * @access  public
	 * @return boolean
	 */
	this.isIncludeNotInvoked = function() {
		return this._includeNotInvoked;
	};
	// }}}
  
	// {{{ getLineHeight
	/**
	 * returns the lineHeight of this entity
   * @access  public
	 * @return int
	 */
	this.getLineHeight = function() {
		return this._lineHeight ? this._lineHeight : (this.isIncludeActions() ? SRAOS_Entity.ACTION_ROW_HEIGHT : SRAOS_Entity.DEFAULT_ROW_HEIGHT);
	};
	// }}}
  
	// {{{ getLookupService
	/**
	 * returns the lookupService of this entity
   * @access  public
	 * @return string
	 */
	this.getLookupService = function() {
		return this._lookupService;
	};
	// }}}
  
	// {{{ getMatchRegex
	/**
	 * returns the matchRegex of this object
   * @access  public
	 * @return string
	 */
	this.getMatchRegex = function() {
		return this._matchRegex;
	};
  // }}}
  
	// {{{ getPkAttr
	/**
	 * returns the pkAttr of this entity
   * @access  public
	 * @return string
	 */
	this.getPkAttr = function() {
		return this._pkAttr;
	};
	// }}}
  
	// {{{ getSearchAttr
	/**
	 * returns the searchAttrs specified, or null if it is not present
   * @param String id the id of the attribute to return
   * @access  public
	 * @return SRAOS_EntitySearchAttr
	 */
	this.getSearchAttr = function(id) {
		for(var i in this._searchAttrs) {
      if (this._searchAttrs[i].getId() == id) {
        return this._searchAttrs[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getSearchAttrs
	/**
	 * returns the searchAttrs of this entity
   * @access  public
	 * @return SRAOS_EntitySearchAttr[]
	 */
	this.getSearchAttrs = function() {
		return this._searchAttrs;
	};
	// }}}
  
	// {{{ isServiceGlobal
	/**
	 * returns the serviceGlobal of this entity
   * @access  public
	 * @return boolean
	 */
	this.isServiceGlobal = function() {
		return this._serviceGlobal;
	};
	// }}}
  
	// {{{ isSortable
	/**
	 * returns the sortable of this object
   * @access  public
	 * @return string
	 */
	this.isSortable = function() {
		return this._sortable;
	};
	// }}}
  
	// {{{ getSortCallback
	/**
	 * returns the sortCallback of this entity
   * @access  public
	 * @return string
	 */
	this.getSortCallback = function() {
		return this._sortCallback;
	};
	// }}}
  
	// {{{ getTableClass
	/**
	 * returns the tableClass of this entity
   * @access  public
	 * @return string
	 */
	this.getTableClass = function() {
		return this._tableClass;
	};
	// }}}
  
	// {{{ getValueCallback
	/**
	 * returns the valueCallback of this entity
   * @access  public
	 * @return string
	 */
	this.getValueCallback = function() {
		return this._valueCallback;
	};
	// }}}
  
	// {{{ getViewer
	/**
	 * returns the viewer of this entity
   * @access  public
	 * @return string
	 */
	this.getViewer = function() {
		return this._viewer;
	};
	// }}}
	
	
	// Static methods
	
  
  // private operations

  
};

// static methods

// {{{ appTerminated
/**
 * displays the entity instance specified using the default entity viewer
 * @param String id the entity id
 * @param Object obj the entity instance
 * @return void
 */
SRAOS_Entity.appTerminated = function(pid) {
  var newApps = new Array();
  for(var i in SRAOS_Entity._applications) {
    if (SRAOS_Entity._applications[i] != pid) {
      newApps[i] = SRAOS_Entity._applications[i];
    }
  }
  SRAOS_Entity._applications = newApps;
};
// }}}

// {{{ display
/**
 * displays the entity instance specified using the default entity viewer
 * @param String id the entity id
 * @param Object obj the entity instance
 * @return void
 */
SRAOS_Entity.display = function(id, obj) {
  var win = OS.getFocusedWin();
  var entity = SRAOS_Entity.getEntity(id);
  
  // launch application
  if (!SRAOS_Entity._applications[id] || !OS.getAppInstance(SRAOS_Entity._applications[id])) {
    // find first instance of this application currently running
    var applications = OS.getApplications();
    for(var i in applications) {
      var app = applications[i].getApplication();
      if (app.getPluginId() == entity.getPluginId() && app.getId() == entity.getViewer()) {
        SRAOS_Entity._applications[id] = applications[i].getPid();
      }
    }
    if (!SRAOS_Entity._applications[id]) {
      SRAOS_Entity._applications[id] = OS.launchApplication(entity.getPluginId(), entity.getViewer()).getPid();
      OS.focus(win);
    }
  }
  // check for error
  if (!SRAOS_Entity._applications[id]) {
    OS.displayErrorMessage(OS.getString(SRAOS.SYS_ERROR_RESOURCE));
  }
  else {
    var app = OS.getAppInstance(SRAOS_Entity._applications[id]);
    var win = app.getPrimaryWindow();
    if (win && win.getManager()[entity.getDisplCallback()]) {
      win.getManager()[entity.getDisplCallback()](obj);
    }
    else if (app.getManager()[entity.getDisplCallback()]) {
      app.getManager()[entity.getDisplCallback()](obj);
    }
    else {
      SRAOS_Entity._tmpObj = obj;
      eval(entity.getDisplCallback() + "(SRAOS_Entity._tmpObj);");
    }
  }
};
// }}}
  
  
// {{{ getEntity
/**
 * returns the entity specified by the encoded id specified
 * @param String id the encoded id to return the entity for. the encoding uses 
 * the following struction: [plugin id]:[entity id]
 * @access  public
 * @return SRAOS_Entity
 */
SRAOS_Entity.getEntity = function(id) {
  var plugin = id ? OS.getPlugin(id.substring(0, id.indexOf(':'))) : null;
  return plugin ? plugin.getEntity(id.substring(id.indexOf(':') + 1)) : null;
};
// }}}


// {{{ newInstanceFromPk
/**
 * returns and instance of the entity specified by the encoded id and primary 
 * key value
 * @param String id the encoded id to return the instance of. the encoding uses 
 * the following struction: [plugin id]:[entity id]
 * @param String pk the primary key value of the entity instance
 * @access  public
 * @return Object
 */
SRAOS_Entity.newInstanceFromPk = function(id, pk) {
  var entity = SRAOS_Entity.getEntity(id);
  if (entity && entity._pkAttr) {
    var obj = new Array();
    obj[entity._pkAttr] = pk;
    return obj;
  }
  return null;
};
// }}}

// static attributes
/**
 * used to store temporary references to applications launched through the 
 * static "display" method
 * @type Array
 */
SRAOS_Entity._applications = new Array();


// constants
/**
 * the default row height for search results
 * @type int
 */
SRAOS_Entity.DEFAULT_ROW_HEIGHT = 18; 

/**
 * the row height for search results when actions are displayed
 * @type int
 */
SRAOS_Entity.ACTION_ROW_HEIGHT = 20; 

// }}}