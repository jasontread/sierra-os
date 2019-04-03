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

// {{{ SRAOS_Plugin
/**
 * represents a single SIERRA::OS plugin
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_Plugin = function(id, applications, entities, entityActions, helpTopics, label, resources, windows) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique plugin identifier
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the applications this plugin defines
	 * @type SRAOS_Application[]
	 */
	this._applications = applications;
  
  /**
	 * the entities this plugin defines
	 * @type SRAOS_Entity[]
	 */
	this._entities = entities;
  
  /**
	 * the entity actions this plugin defines
	 * @type SRAOS_EntityAction[]
	 */
	this._entityActions = entityActions;
  
  /**
	 * the help topics this plugin defines
	 * @type SRAOS_HelpTopic[]
	 */
	this._helpTopics = helpTopics;
  
  /**
	 * the label for this plugin
	 * @type string
	 */
	this._label = label;
  
  /**
   * an associative array of strings used by this plugin where the key in the 
   * array is the resource identifier. strings in this array can be accessed 
   * using the getString(id) method
   * @type Array
   */
  this._resources = resources;
  
  /**
	 * the global windows this plugin defines
	 * @type SRAOS_Window[]
	 */
	this._windows = windows;
  
  /**
	 * the window instances that this application instance is using
	 * @type SRAOS_WindowInstance[]
	 */
	this._windowInstances = new Array();
  
  // }}}
  
  // {{{ Operations
	
  
  // public operations
  
	// {{{ closeWindow
	/**
	 * closes a specific active window instances for this plugin. returns 
   * true if windowInstance was valid and closed
   * @param SRAOS_WindowInstance windowInstance the window to close
   * @param boolean force whether or not to foce the window closure. if true, 
   * the return value of the window manager 'onClose' will be ignored
   * @access  public
	 * @return boolean
	 */
	this.closeWindow = function(windowInstance, force) {
    var windowInstances = new Array();
    var found = false;
    for(var i=0; i<this._windowInstances.length; i++) {
      if (this._windowInstances[i].getDivId() == windowInstance.getDivId() && (this._windowInstances[i].close(force) || force)) {
        found = true;
      }
      else {
        windowInstances.push(this._windowInstances[i]);
      }
    }
    this._windowInstances = windowInstances;
    return found;
  };
  // }}}
  
	// {{{ closeWindows
	/**
	 * closes all of the active window instances for this plugin 
   * @param boolean force whether or not to foce the windows closure. if true, 
   * the return value of the window managers 'onClose' will be ignored
   * @access  public
	 * @return void
	 */
	this.closeWindows = function(force) {
    for(var i=0; i<this._windowInstances.length; i++) {
      this._windowInstances[i].close(force);
    }
    this._windowInstances = new Array();
  };
  // }}}
  
	// {{{ displayHelp
	/**
	 * displays a help topic from this plugin. returns true on success
   * @param String topic the top level topic id in the plugin definition
   * @param String subTopic a sub-topic to display instead of the top-level node
   * @access  public
	 * @return boolean
	 */
	this.displayHelp = function(topic, subTopic) {
    var helpTopic = this.getHelpTopic(topic);
    if (helpTopic) {
      OS.isHelpManualEnabled() ? OS.launchApplication('core', 'HelpManual', { "library": helpTopic, "subTopic": subTopic } ) : OS.displayErrorMessage(OS.getString('error.HelpManualNotEnabled'));
      return true;
    }
    return false;
  };
  // }}}
  
	// {{{ displayWindow
	/**
	 * displays the window specified
   * @param int id the id of the SRAOS_Window to display. if not specified, the 
   * main window will be displayed
   * @param Array vars window content variables: see SRAOS.displayWindow
   * @param Array params initialization params if this plugin is being restored
   * @access  public
	 * @return SRAOS_WindowInstance
	 */
	this.displayWindow = function(id, vars, params) {
    var win = this.getWindow(id);
    var containers;
    if (win && (containers = OS.reserveWindowContainers(1))) {
      var window = new SRAOS_WindowInstance(null, this._id, id, containers[0]);
      this._windowInstances.push(window);
      window.init(false, vars, params);
      return window;
    }
    return null;
  };
  // }}}
  
  
  // accessors
  
	// {{{ getBaseUri
	/**
	 * returns the base uri for this plugin with a trailing forward slash
   * @access  public
	 * @return string
	 */
	this.getBaseUri = function() {
		return OS.uriPrefix + "/plugins/" + this._id + "/";
	};
	// }}}
  
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
  
	// {{{ getApplication
	/**
	 * returns the application specified or null if id is not valid
   * @param string id the id of the application to return
   * @access  public
	 * @return SRAOS_Application
	 */
	this.getApplication = function(id) {
		for(var i=0; i<this._applications.length; i++) {
      if (this._applications[i].getId() == id) {
        return this._applications[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getApplications
	/**
	 * returns the applications of this plugin
   * @access  public
	 * @return SRAOS_Application[]
	 */
	this.getApplications = function() {
		return this._applications;
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
	 * returns the entities of this plugin
   * @access  public
	 * @return SRAOS_Entity[]
	 */
	this.getEntities = function() {
		return this._entities;
	};
	// }}}
  
	// {{{ getEntityAction
	/**
	 * returns the entity action specified or null if no action has been defined 
   * for the entity specified
   * @param string entityId the entity code to return the action for. this value 
   * can be obtained using the entity.getCode method
   * @param Object obj an optional instance of the entity specified for which 
   * the action is being obtained. if specified, and the entity action has a 
   * condition, that condition will be evaluated and the action will only be 
   * returned if it evaluates to true
   * @param SRAOS_Window win an optional window instance specyfing where 
   * this action will be rendered. if specified, and the action for this entity 
   * contains this window's identifier in its _skipWindows attribute, null will 
   * be returned
   * @access  public
	 * @return SRAOS_EntityAction
	 */
	this.getEntityAction = function(entityId, obj, win) {
		for(var i=0; i<this._entityActions.length; i++) {
      if (this._entityActions[i].getEntity() == entityId) {
        // check skipWindows
        if (win && SRAOS_Util.inArray(win.getCode(), this._entityActions[i].getSkipWindows())) { return null; }
        
        // check condition
        if (obj && this._entityActions[i].getCondition()) {
          SRAOS_Plugin._tmpEntityActionObj = obj;
          eval("var cond=" + this._entityActions[i].getCondition() + "(SRAOS_Plugin._tmpEntityActionObj);");
          if (!cond) { return null; }
        }
        return this._entityActions[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getEntityActions
	/**
	 * returns the entityActions of this plugin
   * @access  public
	 * @return SRAOS_EntityAction[]
	 */
	this.getEntityActions = function() {
		return this._entityActions;
	};
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the help topic specified or null if id is not valid
   * @param string id the id of the help topic to return
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	this.getHelpTopic = function(id) {
		for(var i=0; i<this._helpTopics.length; i++) {
      if (this._helpTopics[i].getId() == id) {
        return this._helpTopics[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getHelpTopics
	/**
	 * returns the helpTopics of this plugin
   * @access  public
	 * @return SRAOS_HelpTopic[]
	 */
	this.getHelpTopics = function() {
		return this._helpTopics;
	};
	// }}}
  
  // {{{ getIconUri
	/**
	 * returns the uri to the icon specified
   * @param int size the icon size (16, 32, or 64)
   * @param int icon the filename of the icon
   * @access  public
	 * @return String
	 */
  this.getIconUri = function(size, icon) {
    return icon ? this.getBaseUri() + 'icons/' + size + '/' + icon : null;
  };
  // }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this plugin
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
  
	// {{{ getString
	/**
	 * returns a string from this plugin's resources
   * @param string id the identifier of the string to return
   * @param Array params a hash of key/value pairs that should be substituted in 
   * the resource string, where the key is imbedded into the original string in 
   * the format '{$[key]}'
   * @access  public
	 * @return string
	 */
	this.getString = function(id, params) {
    for (var key in this._resources) {
      if (id == key) {
        return SRAOS_Util.substituteParams(this._resources[key], params);
      }
    }
    return OS.getString(id);
	};
	// }}}
  
	// {{{ getWindow
	/**
	 * returns the window specified or null if id is not valid
   * @param string id the id of the window to return
   * @access  public
	 * @return SRAOS_Window
	 */
	this.getWindow = function(id) {
		for(var i=0; i<this._windows.length; i++) {
      if (this._windows[i].getId() == id) {
        return this._windows[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getWindows
	/**
	 * returns the windows of this plugin
   * @access  public
	 * @return SRAOS_Window[]
	 */
	this.getWindows = function() {
		return this._windows;
	};
	// }}}
  
	// {{{ getWindowInstances
	/**
	 * returns the windowInstances of this plugin
   * @access  public
	 * @return SRAOS_WindowInstance[]
	 */
	this.getWindowInstances = function() {
		return this._windowInstances;
	};
	// }}}
	
  
  // private operations

};
// }}}

