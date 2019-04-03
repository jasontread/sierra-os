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

// {{{
/**
 * manages the Search application in the core plugin
 */
Core_Search = function() {
  /**
   * the entities that this instance of this search application has been 
   * instantiated for
   * @type SRAOS_Entity[]
   */
  this._entities = null;
  
  /**
   * the search string that this application instance was launched for
   * @type String
   */
  this._search = null;
  
  
	// {{{ getEntities
	/**
	 * returns the entities that this instance of search was instantiated for
   * @access  public
	 * @return SRAOS_Entity[]
	 */
	this.getEntities = function() {
		return this._entities;
	};
  // }}}
  
  // {{{ getSearch
	/**
	 * returns the search string that this instance of search was instantiated for
   * @access  public
	 * @return string
	 */
	this.getSearch = function() {
		return this._search;
	};
	// }}}
  
  
  // {{{ application event methods
	this.init = function(params) {
    this._entities = params ? params.entities : null;
		this._search = params ? params.search : null;
	};
	this.onLaunch = function() {
		return this._search ? true : false;
	};
	// }}}
  
};
// }}}


// {{{
/**
 * manages the Search window in the core plugin
 */
Core_SearchWin = function() {
  /**
   * the entities that this instance of this search application has been 
   * instantiated for
   * @type SRAOS_Entity[]
   */
  this._entities = null;
  
  /**
   * used to provide unique div ids for individual rendered entity instances
   * @type int
   */
  this._entityCounter = 1;
  
  /**
   * used to store the results of the search including reference to the 
   * entities included, result counts and paginators
   * @type Array
   */
  this._entityGroups;
  
  /**
   * keeps track of the total # of results
   * @type int
   */
  this._numResults = 0;
  
  /**
   * was this window restored from a workspace toggle event
   * @type boolean
   */
  this._restored = false;
  
  /**
   * the search string that this application instance was launched for
   * @type String
   */
  this._search = null;
  
  /**
   * tracks the sorting status for displayed attributes
   * @type Array
   */
  this._sortAttrs = new Array();
  
  
  // {{{ window event methods
	this.getState = function() {
    var entities = new Array();
    for(var i in this._entities) {
      entities.push(this._entities[i].getCode());
    }
		return { "entities": entities, "search": this._search, "sortAttrs": this._sortAttrs, "restore": true };
	};
	this.init = function(params) {
    if (params["restore"]) {
      var plugin = OS.getPlugin(params["plugin"]);
      this._entities = new Array();
      for(var i in params["entities"]) {
        this._entities.push(SRAOS_Entity.getEntity(params["entities"][i]));
      }
      this._search = params["search"];
      this._sortAttrs = params["sortAttrs"];
      this._restored = true;
    }
	};
	this.onOpen = function() {
    var search = this._search;
    if (!this._restored) {
      this._entities = this.win.getAppInstance().getManager().getEntities();
      search = this.win.getAppInstance().getManager().getSearch();
      
      // set initial sorting values
      this.updateSortValues();
    }
    else {
      this._search = null;
    }
    // insufficient data to instantiate search
    if (!this._entities || this._entities.length == 0 || !search) { return false; }
    
    var searchInput = document.getElementById(this.win.getDivId() + 'coreSearch');
    SRAOS_Util.addOnEnterEvent(searchInput, this, "search");
    searchInput.value = search;
    this.search(search);
    
    return true;
	};
	this.onMaximize = function(height, width) {
		this.updateDivSizes();
    return true;
	};
	this.onResizeEnd = function(height, width) {
		this.updateDivSizes();
	};
	this.onRestoreMaximized = function(height, width) {
		this.updateDivSizes();
    return true;
	};
	// }}}
  
  
  // {{{ addEntityEvents
  /**
   * used to add optional drag and drop capabilities to rendered entities
   * @param String id the entity id
   * @param Object[] objs the entity instances that were rendered
   * @return void
   */
   this.addEntityEvents = function(id, objs) {
     var entity = this.getEntity(id);
     for(var i in objs) {
       var div = document.getElementById(objs[i]._searchDivId);
       if (div) {
         div._searchManager = this;
         div._searchEntity = entity.getCode();
         div._searchObj = objs[i];
         
         // click
         div.onclick = function() {
           if (!Core_Search._skipNextDisplay) {
             SRAOS_Entity.display(this._searchEntity, this._searchObj);
           }
         };
       }
     }
   };
   // }}}
  
	// {{{ addResultsGroup
	/**
	 * adds an entity results group to the search results
   * @param SRAOS_Entity entity the entity that the group is being added for
   * @param boolean notInvoked true if the service was not invoked
   * @access  public
	 * @return void
	 */
	this.addResultsGroup = function(entity, notInvoked) {
    var resultsDiv = document.getElementById(this.getDivId());
    var entityDiv = '<div id="' + this.getDivId(entity.getId()) + '"><div class="coreSearchEntityHeader">';
    entityDiv += '<span class="coreSearchEntityHeaderToggle"><img id="' + this.getDivId(entity.getId(), 3) + '" alt="' + OS.getString('text.show') + '" class="coreSearchToggleShow" onclick="OS.getWindowInstance(this).getManager().toggleEntityGroup(\'' + entity.getId() + '\')" src="' + SRAOS.PIXEL_IMAGE + '" title="' + OS.getString('text.show') + '" /></span>';
    entityDiv += '<span class="coreSearchEntityHeaderIcon"' + (entity.getHelpTopic() ? ' style="cursor: pointer" onclick="OS.getPlugin(\'' + entity.getPluginId() + '\').displayHelp(\'' + entity.getHelpTopic() + '\')"' : '') + '><img alt="' + entity.getLabel() + '" onclick="" src="' + entity.getIconPath(16) + '" title="' + entity.getLabel() + '" /></span>';
    entityDiv += '<span class="coreSearchEntityHeaderLabel" id="' + this.getDivId(entity.getId(), 1) + '">' + entity.getLabel() + '</span></div>';
    entityDiv += '<div id="' + this.getDivId(entity.getId(), 2) + '" class="coreSearchEntityResults">' + (notInvoked ? entity.getLabelNotFound() : OS.getString(Core_SearchWin.SEARCHING_RESOURCE)) + '</div></div>';    
    resultsDiv.innerHTML += entityDiv;
    this._entityGroups[entity.getId()] = null;
	};
	// }}}
  
	// {{{ getDivId
	/**
	 * returns the div id specified
   * @param string id the id of the entity to return the div id for. if 
   * not specified, the base div id for the search results will be returned
   * @param int subDiv the specific entity div to return. 0 = NA, 1 = header, 
   * and 2 = results, 3 = toggle image
   * @access  public
	 * @return String
	 */
	this.getDivId = function(id, subDiv) {
		return this.win.getDivId() + "core_searchResults" + (id ? id : '') + (subDiv == 1 ? 'Header' : (subDiv == 2 ? 'Results' : (subDiv == 3 ? 'Toggle' : '')));
	};
	// }}}
  
	// {{{ getEntity
	/**
	 * returns the entity specified or null if id is not valid
   * @param string id the id of the entity to return
   * @access  public
	 * @return SRAOS_Entity
	 */
	this.getEntity = function(id) {
		for(var i=0; i<this._entities.length; i++) {
      if (this._entities[i].getId() == id) {
        return this._entities[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getEntities
	/**
	 * returns the entities that this instance of search was instantiated for
   * @access  public
	 * @return SRAOS_Entity[]
	 */
	this.getEntities = function() {
		return this._entities;
	};
  // }}}
  
  // {{{ getEntityAttrs
  /**
   * returns the ajax invocation include attrs for the paginator to utilize for 
   * the entity specified
   * @param String id the entity id
   * @return String[]
   */
   this.getEntityAttrs = function(id) {
     var attrs = new Array();
     var entity = this.getEntity(id);
     if (entity.getAttrsCallback()) {
       var code = "Core_SearchWin._tmpAttrs=" + entity.getAttrsCallback() + ';';
       eval(code);
       attrs = Core_SearchWin._tmpAttrs;
     }
     else {
       var displAttrs = entity.getDisplAttrs();
       for(var i in displAttrs) {
         attrs.push(displAttrs[i].getId());
       }
     }
     if (entity.getPkAttr()) {
       attrs.push(entity.getPkAttr());
     }
     return attrs.length > 0 ? attrs : null;
   };
   // }}}
  
  // {{{ getEntityConstraints
  /**
   * returns the ajax invocation constraints for the paginator to utilize for 
   * the entity specified
   * @param String id the entity id
   * @return SRAOS_AjaxConstraintGroup[]
   */
  this.getEntityConstraints = function(id) {
    var entity = id && id.getId ? id : this.getEntity(id);
    var constraints = new Array();
    if (!entity.isServiceGlobal()) {
      var searchAttrs = entity.getSearchAttrs();
      for(var i=0; i<searchAttrs.length; i++) {
        if (searchAttrs[i].includeInSearch(this._search)) {
          constraints.push(new SRAOS_AjaxConstraint(searchAttrs[i].getId(), this._search, searchAttrs[i].getOperator()));
        }
      }
      for(var attr in this._sortAttrs[id]) {
        if (this._sortAttrs[id][attr]) {
          var found = false;
          for(var i=0; i<constraints.length; i++) {
            if (constraints[i].attr == attr) {
              found = true;
              constraints[i].operator = constraints[i].operator & this._sortAttrs[id][attr];
              break;
            }
          }
          if (!found) {
            constraints.push(new SRAOS_AjaxConstraint(attr, null, this._sortAttrs[id][attr]));
          }
        }
      }
    }
    return constraints.length > 0 ? [new SRAOS_AjaxConstraintGroup(constraints, entity.getAttrConnective())] : null;
  };
  // }}}
  
  // {{{ getEntityParams
  /**
   * returns the ajax invocation params for the paginator to utilize for the 
   * entity specified
   * @param String id the entity id
   * @return SRAOS_AjaxServiceParam[]
   */
  this.getEntityParams = function(id) {
    var entity = id.getId ? id : this.getEntity(id);
    var params = new Array();
    if (entity.isServiceGlobal()) {
      params.push(new SRAOS_AjaxServiceParam("search", this._search));
      for(var attr in this._sortAttrs[id]) {
        if (this._sortAttrs[id][attr]) {
          var found = false;
          for(var i=0; i<params.length; i++) {
            if (params[i].param == attr) {
              found = true;
              params[i].value = params[i].value & this._sortAttrs[id][attr];
              break;
            }
          }
          if (!found) {
            params.push(new SRAOS_AjaxServiceParam(attr, this._sortAttrs[id][attr]));
          }
        }
      }
    }
    return params.length > 0 ? params : null;
  };
  // }}}
  
	// {{{ paginatorError
	/**
	 * handles paginator errors
   * @param String id the entity id
   * @param Object div the contents div for this entity
	 * @return void
	 */
  this.paginatorError = function(id, div) {
    div.innerHTML = OS.getString(SRAOS.SYS_ERROR_RESOURCE);
  };
  // }}}
  
  // {{{ renderEntity
  /**
   * renders the table row for a given entity instance
   * @param String id the entity id
   * @param Object obj the entity instance
   * @return String
   */
   this.renderEntity = function(id, obj) {
     var entity = this.getEntity(id);
     obj._searchDivId = this.getDivId(id) + this._entityCounter++;
     html = '<tr id="' + obj._searchDivId + '">';
     var attrs = this.getEntityAttrs(id);
     for(var i in attrs) {
       if (attrs[i] == entity.getPkAttr()) { continue; }
       html += "<td>";
       if (entity.getValueCallback()) {
         Core_SearchWin._tmpValObj = obj;
         var code = 'Core_SearchWin._tmpVal=' + entity.getValueCallback() + '("' + attrs[i] + '", Core_SearchWin._tmpValObj, "' + id + '");';
         eval(code);
         html += Core_SearchWin._tmpVal;
       }
       else {
         html += obj[attrs[i]];
       }
       html += "</td>";
     }
     if (entity.isIncludeActions()) {
       html += "<td onclick='Core_Search._skipNextDisplay=true;setTimeout(\"Core_Search._skipNextDisplay=false\", 1);'>" + OS.getActions(entity.getCode(), obj, "document.getElementById('" + obj._searchDivId + "')._searchObj", this.win.getWindow(), 16) + "</td>\n";
     }
     html += "</tr>";
     return html;
   };
   // }}}
  
  // {{{ renderEntityHeader
  /**
   * renders the table header for a given entity
   * @param String id the entity id
   * @return String
   */
   this.renderEntityHeader = function(id) {
     var entity = this.getEntity(id);
     html = '<tr>';
     var attrs = this.getEntityAttrs(id);
     for(var i in attrs) {
       if (attrs[i] == entity.getPkAttr()) { continue; }
       
       var displAttr = entity.getDisplAttr(attrs[i]);
       html += "<th" +  ((!displAttr && entity.isSortable()) || (displAttr && displAttr.isSortable()) ? ' onclick="OS.getWindowInstance(this).getManager().toggleSortMethod(\'' + id + '\', \'' + attrs[i] + '\')" style="cursor: pointer"' : '') + ">";
       var sortImg = this._sortAttrs[id][attrs[i]] == SRAOS_AjaxConstraint.OP_SORT_DESC ? Core_SearchWin.IMG_SORT_DESC : (this._sortAttrs[id][attrs[i]] == SRAOS_AjaxConstraint.OP_SORT_ASC ? Core_SearchWin.IMG_SORT_ASC : null);
       html += sortImg ? "<img alt='' class='sortImg' src='" + this.win.getPlugin().getBaseUri() + "images/" + sortImg + "' />" : '';
       if (entity.getHeaderCallback()) {
         var code = 'Core_SearchWin._tmpHeaderVal=' + entity.getHeaderCallback() + '("' + attrs[i] + '", "' + id + '");';
         eval(code);
         html += Core_SearchWin._tmpHeaderVal;
       }
       else {
         html += entity.getAttrLabel(attrs[i]);
       }
       html += "</th>\n";
     }
     if (entity.isIncludeActions()) {
       html += "<th>" + this.win.getPlugin().getString('Search.text.actions') + "</th>\n";
     }
     html += "</tr>";
     return html;
   };
   // }}}
  
  // {{{ search
  /**
   * performs a search based on the value specified
   * @param String search the search term
   * @return void
   */
  this.search = function(search) {
    search = search ? search : document.getElementById(this.win.getDivId() + 'coreSearch').value;
    if (this._search == search) { return; }
    
    this._search = search;
    this.win.clearStatusBarText();
    document.getElementById(this.getDivId()).innerHTML = '';
    this._numResults = 0;
    this._entityGroups = new Array();
    var entities = new Array();
    for(var i=0; i<this._entities.length; i++) {
      var constraintGroups = this.getEntityConstraints(this._entities[i]);
      var params = this.getEntityParams(this._entities[i]);
      var matchedRegex = !this._entities[i].getMatchRegex() || this._search.search(new RegExp(this._entities[i].getMatchRegex())) != -1;
      if (matchedRegex && (constraintGroups || params)) {
        entities[this._entities[i].getId()] = this._entities[i].isServiceGlobal() ? params : constraintGroups;
        this.addResultsGroup(this._entities[i]);
      }
      else if (this._entities[i].isIncludeNotInvoked()) {
        entities[this._entities[i].getId()] = null;
        this.addResultsGroup(this._entities[i], true);
      }
    }
    var found = false;
    for(var id in entities) {
      if (entities[id]) {
        var entity = this.getEntity(id);
        OS.ajaxInvokeService(entity.getLookupService(), this, "_processSearchResults", (entity.isServiceGlobal() ? null : entities[id]), null, (entity.isServiceGlobal() ? entities[id] : null), entity.getId(), null, null, entity.getAutoDisplMax() > 0 ? entity.getAutoDisplMax() : 1, 0);
      }
      found = true;
    }
    if (!found) {
      document.getElementById(this.getDivId()).innerHTML = OS.getString(Core_SearchWin.DEFAULT_NO_MATCHES_RESOURCE);
    }
    this.win.setTitleText(this.win.getWindow().getLabel() + ": " + this._search);
    document.getElementById(this.win.getDivId() + 'coreSearch').focus();
    document.getElementById(this.win.getDivId() + 'coreSearch').select();
  };
  // }}}
  
	// {{{ setEntities
	/**
	 * sets the entities for this search window instance. the search will be 
   * refreshed when this method is invoked
   * @param SRAOS_Entity[] entities the new entities
   * @access  public
	 * @return void
	 */
	this.setEntities = function(entities) {
		this._entities = entities;
    var search = this._search;
    this._search = null;
    this.updateSortValues();
    this.search(search);
	};
  // }}}
  
  // {{{ toggleEntityGroup
  /**
   * toggles the displayed/hidden state of a particular entity's results
   * @param String id the id of the entity
   * @param Object img the toggle image
   * @return void
   */
  this.toggleEntityGroup = function(id) {
    var div = document.getElementById(this.getDivId(id, 2));
    var img = document.getElementById(this.getDivId(id, 3));
    if (div && img) {
      div.style.height = img.className == 'coreSearchToggleShow' ? div._resultsHeight : "1px";
      div.className = img.className == 'coreSearchToggleShow' ? "coreSearchEntityResultsVisible" : "coreSearchEntityResults";
      img.alt = img.className == 'coreSearchToggleShow' ? OS.getString('text.hide') : OS.getString('text.show');
      img.title = img.className == 'coreSearchToggleShow' ? OS.getString('text.hide') : OS.getString('text.show');
      img.className = img.className == 'coreSearchToggleShow' ? 'coreSearchToggleHide' : 'coreSearchToggleShow';
    }
  };
  // }}}
  
  // {{{ toggleSortMethod
  /**
   * toggles the sort method for the specified entity and attribute. the toggle 
   * order is descending, ascending, none
   * @param String entity the id of the entity
   * @param String attr the id of the attribute 
   * @access  public
	 * @return void
	 */
  this.toggleSortMethod = function(entity, attr) {
    this._sortAttrs[entity][attr] = !this._sortAttrs[entity][attr] ? SRAOS_AjaxConstraint.OP_SORT_DESC : (this._sortAttrs[entity][attr] == SRAOS_AjaxConstraint.OP_SORT_DESC ? SRAOS_AjaxConstraint.OP_SORT_ASC : null);
    // remove sort method if applicable
    if (!this._sortAttrs[entity][attr]) {
      var sortAttrs = new Array();
      for(var i in this._sortAttrs[entity]) {
        if (this._sortAttrs[entity][i]) {
          sortAttrs[i] = this._sortAttrs[entity][i];
        }
      }
      this._sortAttrs[entity] = sortAttrs;
    }
    if (this._entityGroups[entity]) { this._entityGroups[entity].reset(true); }
  };
  // }}}
  
  // {{{ updateDivSizes
  /**
   * updates the div sizes for the results panel
   * @param String entityId optional entity id
   * @param int entityCount optional count for entityId
   * @return void
   */
  this.updateDivSizes = function(entityId, entityCount) {
    var canvasHeight = document.getElementById(this.win.getDivId()).offsetHeight - 52;
    for(var id in this._entityGroups) {
      var entity = this.getEntity(id);
      var count = entityId == id ? entityCount : (this._entityGroups[id] ? this._entityGroups[id].getItemsCount() : 0);
      var baseHeight = document.getElementById(this.getDivId(entity.getId(), 2))._resultsHeight;
      var newHeight = (this._entities.length == 1 ? canvasHeight : (count < Core_SearchWin.MAX_RESULT_ROWS ? (count + 1) * entity.getLineHeight() : Core_SearchWin.MAX_RESULT_ROWS * entity.getLineHeight())) + "px";
      document.getElementById(this.getDivId(id, 2))._resultsHeight = newHeight;
      if (baseHeight && baseHeight != newHeight && this._entityGroups[id]) {
        document.getElementById(this.getDivId(id, 2)).style.height = newHeight;
        this._entityGroups[id].refresh();
      }
    }
  };
  // }}}
  
  // {{{ updateSortValues
  /**
   * updates the sorting constraints for this search instance
   * @return void
   */
  this.updateSortValues = function() {
    for(var i in this._entities) {
      if (this._entities[i].getSortCallback()) {
        eval("Core_SearchWin._tmpSortAttrs = " + this._entities[i].getSortCallback() + ";");
        this._sortAttrs[this._entities[i].getId()] = Core_SearchWin._tmpSortAttrs;
      }
      if (!this._sortAttrs[this._entities[i].getId()]) {
        this._sortAttrs[this._entities[i].getId()] = new Array();
        var displAttrs = this._entities[i].getDisplAttrs();
        for(var n in displAttrs) {
          if (displAttrs[n].getSort()) {
            this._sortAttrs[this._entities[i].getId()][displAttrs[n].getId()] = displAttrs[n].getSort();
          }
        }
      }
    }
  };
  // }}}
  
  // {{{ updateStatusText
  /**
   * updates the status bar text to display the total # of results
   * @return void
   */
  this.updateStatusText = function() {
    this.win.setStatusBarText(this._numResults + ' ' + this.win.getPlugin().getString('Search.text.totalResults'));
  };
  // }}}
  
  // {{{ waitEntity
  /**
   * invoked when a paginator attempts to load additional entity instances
   * @param String id the entity id
   * @return String
   */
   this.waitEntity = function(id) {
     var entity = this.getEntity(id);
     this.win.setStatusBarText(this.win.getPlugin().getString('Search.text.loadingObjectOfType') + ' ' + entity.getLabel());
   };
   // }}}
  
  
	// {{{ _processSearchResults
	/**
	 * handles the response from the initial ajax request used to determine 
   * whether or not a particular entity has any results for current search term
   * @param Object response the response received
   * @access  public
	 * @return void
	 */
	this._processSearchResults = function(response) {
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      document.getElementById(this.getDivId(response.requestId, 2)).innerHTML = OS.getString(SRAOS.SYS_ERROR_RESOURCE);
    }
    else {
      var entity = this.getEntity(response.requestId);
      document.getElementById(this.getDivId(response.requestId, 1)).innerHTML = entity.getLabel() + ' (' + response.count + ')';
      if (response.count > 0) {
        this._numResults += response.count;
        this.updateDivSizes(response.requestId, response.count);
        this.toggleEntityGroup(response.requestId);
        this._entityGroups[response.requestId] = new SRAOS_AjaxScrollPaginator(entity.getId(), document.getElementById(this.getDivId(entity.getId(), 2)), entity.getLookupService(), entity.getLineHeight(), this, "paginatorError", Core_SearchWin.RESULTS_BUFFER, "renderEntityHeader", '<table class="' + (entity.getTableClass() ? entity.getTableClass() : 'coreSearchResults') + '">', "</table>", "renderEntity", "waitEntity", "updateStatusText", "addEntityEvents", "getEntityParams", "getEntityConstraints", null, "getEntityAttrs");
        this._entityGroups[response.requestId].setItemsCount(response.count);
        this._entityGroups[response.requestId].render();
        if (entity.getAutoDisplMax() > 0 && response.count <= entity.getAutoDisplMax()) {
          Core_SearchWin._display(this, response.requestId, response.results);
        }
      }
      else {
        if (entity.isIncludeNotFound()) {
          document.getElementById(this.getDivId(response.requestId, 2)).innerHTML = entity.getLabelNotFound();
        }
        else {
          document.getElementById(this.getDivId(response.requestId)).innerHTML = "";
        }
        this.updateDivSizes();
      }
      this.updateStatusText();
    }
	};
	// }}}
  
};

// {{{ _display
/**
 * used to buffer the auto-display of multiple entity instances
 * @param Core_SearchWin manager the manager
 * @param String id the entity id
 * @param Object[] objs the entity instances
 * @return void
 */
Core_SearchWin._display = function(manager, id, objs) {
  Core_SearchWin._displManager = manager;
  Core_SearchWin._displId = id;
  Core_SearchWin._displObjs = objs;
  Core_SearchWin._displPointer = 0;
  setTimeout("Core_SearchWin._displayNext()", 500);
};
// }}}

// {{{ _displayNext
/**
 * displays the next entity instance in the buffered auto-display instances
 * @return void
 */
Core_SearchWin._displayNext = function() {
  SRAOS_Entity.display(Core_SearchWin._displId, Core_SearchWin._displObjs[Core_SearchWin._displPointer++]);
  if (Core_SearchWin._displPointer < Core_SearchWin._displObjs.length) {
    setTimeout("Core_SearchWin._displayNext()", 10);
  }
  else {
    Core_SearchWin._displManager = null;
    Core_SearchWin._displId = null;
    Core_SearchWin._displObjs = null;
    Core_SearchWin._displPointer = null;
  }
};
// }}}


// {{{ static attributes
/**
 * used to store references to running applications
 * @type SRAOS_ApplicationInstance[]
 */
Core_SearchWin._applications = new Array();
// }}}

// {{{ constants
/**
 * the default resource to display when no matches are found for a given entity
 * @type String
 */
Core_SearchWin.DEFAULT_NO_MATCHES_RESOURCE = "text.noMatches"; 

/**
 * the image to display when a column is sorted in ascending order
 * @type String
 */
Core_SearchWin.IMG_SORT_ASC = "sort-asc.gif";

/**
 * the image to display when a column is sorted in descending order
 * @type String
 */
Core_SearchWin.IMG_SORT_DESC = "sort-desc.gif";

/**
 * the max # of rows to display for a given entity search results
 * @type int
 */
Core_SearchWin.MAX_RESULT_ROWS = 5;

/**
 * the pagination buffer to apply
 * @type int
 */
Core_SearchWin.RESULTS_BUFFER = 2;

/**
 * the resource to display while the initial search is being performed
 * @type String
 */
Core_SearchWin.SEARCHING_RESOURCE = "text.searching"; 
// }}}
// }}}



// {{{
/**
 * manages the Search preferences window in the core plugin
 */
Core_SearchPreferences = function() {
  // {{{ window event methods
	this.onOpen = function() {
    var entities = this.win.getOpener().getManager().getEntities();
    for(var i=0; i<entities.length; i++) {
      this.win.getDomElements({ "name": entities[i].getPluginId() + ':' + entities[i].getId() })[0].checked = true;
    }
    this.win.setDirtyFlags();
    return true;
	};
	// }}}
  
  
  // {{{ setDefaultSearchEntities
  /**
   * sets the current entity select as the user's default entity search 
   * selection and updates the current search according to the current 
   * selection. the is closed after this method is invoked
   * @return void
   */
  this.setDefaultSearchEntities = function() {
    if (this.updateSearchEntities(true)) {
      var checkboxes = this.win.getDomElements({ "type": "checkbox" });
      var newSearchExclude = new Array();
      for(var i=0; i<checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
          newSearchExclude.push(SRAOS_Entity.getEntity(checkboxes[i].value).getCode());
        }
      }
      var changeCount = 0;
      var attrs = new Array();
      if (!OS.user.coreSearchExclude) { OS.user.coreSearchExclude = new Array(); }
      
      // added
      for(var i=0; i<newSearchExclude.length; i++) {
        if (!SRAOS_Util.inArray(newSearchExclude[i], OS.user.coreSearchExclude)) {
          changeCount++;
          if (!attrs['coreSearchExclude']) {
            attrs['coreSearchExclude'] = new Array();
          }
          attrs['coreSearchExclude'].push(newSearchExclude[i]);
        }
      }
      // removed
      for(var i=0; i<OS.user.coreSearchExclude.length; i++) {
        if (!SRAOS_Util.inArray(OS.user.coreSearchExclude[i], newSearchExclude)) {
          changeCount++;
          if (!attrs['coreSearchExclude_remove']) {
            attrs['coreSearchExclude_remove'] = new Array();
          }
          attrs['coreSearchExclude_remove'].push(OS.user.coreSearchExclude[i]);
        }
      }
      if (changeCount > 0) {
        OS.ajaxInvokeService("core_updateUser", this, "_updateUserPreferences", null, new SRAOS_AjaxRequestObj(OS.user.uid, attrs));
      }
      OS.user.coreSearchExclude = newSearchExclude;
      OS.closeWindow(this.win);
    }
  };
  // }}}
  
  
  // {{{ updateSearchEntities
  /**
   * if the entity selection has changed, it will be updated according to the 
   * entities that the user has selected. at least 1 entity much be selected or 
   * an error will occur. the window is closed after this method is invoked
   * @param boolean dontCloseWindow whether or not to close the window if this 
   * method invocation is successful
   * @return SRAOS_Entity[]
   */
  this.updateSearchEntities = function(dontCloseWindow) {
    if (this.win.isDirty()) {
      var entities = new Array();
      var checkboxes = this.win.getDomElements({ "type": "checkbox" });
      for(var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          entities.push(SRAOS_Entity.getEntity(checkboxes[i].value));
        }
      }
      if (entities.length == 0) {
        OS.displayErrorMessage(this.win.getPlugin().getString('Search.error.mustSelectAnEntity'));
        return null;
      }
      this.win.getOpener().getManager().setEntities(entities);
    }
    if (!dontCloseWindow) { OS.closeWindow(this.win); }
    return entities;
  };
  // }}}
  
  
  // {{{ _updateUserPreferences
  /**
   * handles the response of an ajax request to update the user's search  
   * preferences
   * @access  public
	 * @return void
	 */
  this._updateUserPreferences = function(response) {
    // could not update
    if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      OS.displayErrorMessage(this.win.getPlugin().getString("Search.error.unableToUpdatePreferences"), response);
    }
  };
  // }}}
  
};
// }}}
