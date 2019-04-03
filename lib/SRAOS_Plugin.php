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
require_once('SRAOS_Application.php');
require_once('SRAOS_Entity.php');
require_once('SRAOS_EntityAction.php');
require_once('SRAOS_HelpTopic.php');
require_once('SRAOS_Window.php');
// }}}

// {{{ Constants

// }}}

// {{{ SRAOS_Plugin
/**
 * represents a single SIERRA::OS plugin
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Plugin {
  // {{{ Attributes
  // public attributes
  /**
	 * the ResourceBundle containing only strings contained in resource bundles 
   * in this plugin's l10n directory
	 * @type SRA_ResourceBundle
	 */
	var $baseResources;
  
  /**
	 * the ResourceBundle for this plugin
	 * @type SRA_ResourceBundle
	 */
	var $resources;
	
  // private attributes
  /**
	 * the unique plugin identifier
	 * @type string
	 */
	var $_id;
  
  /**
	 * the applications this plugin defines
	 * @type SRAOS_Application[]
	 */
	var $_applications = array();
  
  /**
	 * array of plugin identifiers that this plugin is dependent upon
	 * @type string[]
	 */
	var $_dependencies = array();
  
  /**
	 * the entities this plugin defines
	 * @type SRAOS_Entity[]
	 */
	var $_entities = array();
  
  /**
	 * the entity actions this plugin defines
	 * @type SRAOS_EntityAction[]
	 */
	var $_entityActions = array();
  
  /**
	 * the help topics this plugin defines
	 * @type SRAOS_HelpTopic[]
	 */
	var $_helpTopics = array();
  
  /**
	 * space separated list of entity-model xml file names located in the plugin 
   * etc/ directory that should be initialized and maintained when this plugin 
   * is present. changes to these files will automatically reload the 
   * corresponding classes in that entity model. be careful of entity naming 
   * conflicts between plugins. to avoid this, prefix your entities with the 
   * plugin identifier
	 * @type string[]
	 */
	var $_models = array();
  
  /**
	 * the label for this plugin. this should reference a string value in one of 
   * the resources properties files
	 * @type string
	 */
	var $_resource;
  
  /**
	 * the global windows this plugin defines
	 * @type SRAOS_Window[]
	 */
	var $_windows = array();
  
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Plugin
	/**
	 * instantiates a new SRAOS_Plugin object based on the $id specified. if there 
   * are problems with the xml configuration for this plugin, an SRA_Error 
   * object will be set to the instance variable $this->err
   * @param string $id the identifier of the plugin
   * @param array $config the data to use to instantiate this plugin. this should 
   * be retrieved from the xml parser for this plugin's configuration file
   * @access  public
	 */
	function SRAOS_Plugin($id, & $config) {

    if (!$id || !is_array($config)) {
			$msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - insufficient data to instantiate plugin ${id}";
			$this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
      return;
    }
    $this->_models = isset($config['attributes']) && isset($config['attributes']['models']) ? $this->_dependencies = explode(' ', $config['attributes']['models']) : array();
    // validate models 
    foreach($this->_models as $model) {
      if (!SRAOS_PluginManager::validateModel($id, $model)) {
        $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - model ${model} is not valid for plugin ${id}";
        $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return;
      }
    }
    
		$this->_id = $id;
    
    // set dependencies & resource
    $this->_dependencies = isset($config['attributes']) && isset($config['attributes']['dependencies']) ? $this->_dependencies = explode(' ', $config['attributes']['dependencies']) : array();
    $this->_resource = isset($config['attributes']) && isset($config['attributes']['resource']) ? $config['attributes']['resource'] : $id;
    
    // resources
    $this->resources =& SRA_Controller::getAppResources();
    $files = SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $this->_id . '/etc/l10n/');
    foreach ($files as $file) {
      if (SRA_Util::endsWith($file, '.properties')) {
        $bundle =& SRA_ResourceBundle::getBundle(SRAOS_PLUGIN_DIR . $this->_id . '/etc/l10n/' . str_replace('.properties', '', basename($file)));
        $this->baseResources = !isset($this->baseResources) ? $bundle : SRA_ResourceBundle::merge($this->baseResources, $bundle);
        $this->resources =& SRA_ResourceBundle::merge($this->resources, $bundle);
      }
    }
    
    // add help-topics
    if (isset($config['help-topic'])) {
      $keys = array_keys($config['help-topic']);
      foreach ($keys as $key) {
        $this->_helpTopics[$key] = new SRAOS_HelpTopic($key, $config['help-topic'][$key], $this);
        if (SRA_Error::isError($this->_helpTopics[$key]->err)) {
          $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - Unable to instantiate SRAOS_HelpTopic ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    
    // add applications
    if (isset($config['application'])) {
      $keys = array_keys($config['application']);
      foreach ($keys as $key) {
        $this->_applications[$key] = new SRAOS_Application($key, $config['application'][$key], $this);
        if (SRA_Error::isError($this->_applications[$key]->err)) {
          $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - Unable to instantiate SRAOS_Application ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    
    // add entities
    if (isset($config['entity'])) {
      $keys = array_keys($config['entity']);
      foreach ($keys as $key) {   
        $this->_entities[$key] = new SRAOS_Entity($key, $config['entity'][$key], $this);
        if (SRA_Error::isError($this->_entities[$key]->err)) {
          $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - Unable to instantiate SRAOS_Entity ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    
    // add entity actions
    if (isset($config['entity-action'])) {
      $keys = array_keys($config['entity-action']);
      foreach ($keys as $key) {   
        $this->_entityActions[$key] = new SRAOS_EntityAction($key, $config['entity-action'][$key], $this);
        if (SRA_Error::isError($this->_entityActions[$key]->err)) {
          $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - Unable to instantiate SRAOS_EntityAction ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
    
    // add windows
    if (isset($config['window'])) {
      $keys = array_keys($config['window']);
      foreach ($keys as $key) {
        $this->_windows[$key] = new SRAOS_Window($key, $config['window'][$key], $this);
        if (SRA_Error::isError($this->_windows[$key]->err)) {
          $msg = "SRAOS_Plugin::SRAOS_Plugin: Failed - Unable to instantiate SRAOS_Window ${key}";
          $this->err =& SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
          return;
        }
      }
    }
	}
	// }}}
	
  
  // public operations
  
	// {{{ getAllWindows
	/**
	 * returns all of the windows associated with this plugin. this includes any 
   * plugin specific windows as well as all of the application windows merged 
   * into one array
   * @access  public
	 * @return SRAOS_Window[]
	 */
	function & getAllWindows() {
		$windows =& $this->_windows;
    $keys = array_keys($this->_applications);
    foreach($keys as $key) {
      $appWindows =& $this->_applications[$key]->getWindows();
      $wkeys = array_keys($appWindows);
      foreach($wkeys as $wkey) {
        $windows[$wkey] =& $appWindows[$wkey];
      }
    }
    return $windows;
	}
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this plugin
   * @access  public
	 * @return string
	 */
	function getLabel() {
		return $this->resources->getString($this->_resource);
	}
	// }}}
  
	// {{{ satisfiesDepedencies
	/**
	 * returns TRUE if the depedencies of this plugin are satisfied based on the 
   * $plugins specified. if the dependencies are not satisfied, an error will 
   * also be logged
   * @param string[] $plugins an array of plugin identifiers that are installed 
   * @access  public
	 * @return boolean
	 */
	function satisfiesDepedencies($plugins) {
		foreach ($this->_dependencies as $dependency) {
      if (!in_array($dependency, $plugins)) {
        $msg = "SRAOS_Plugin::satisfiesDepedencies: failed - Dependency ${dependency} is not satisfied for plugin " . $this->_id;
        SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
        return FALSE;
      }
    }
    return TRUE;
	}
	// }}}
  
  
  // getters/setters
	// {{{ getCssFiles
	/**
	 * returns the path to all of the css files for this plugin
   * @access  public
	 * @return string[]
	 */
	function getCssFiles() {
    return SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $this->_id . '/www/css/', '/^.*css$/');
	}
	// }}}
  
	// {{{ getCssUris
	/**
	 * returns the uri path to all of the css files for this plugin
   * @access  public
	 * @return string[]
	 */
	function getCssUris() {
    $uris = array();
    $files = $this->getCssFiles();
    foreach ($files as $file) {
      $uris[] = SRAOS_URI_PREFIX . '/plugins/' . $this->_id . '/css/' . basename($file);
    }
    return $uris;
	}
	// }}}
  
	// {{{ getJavascriptFiles
	/**
	 * returns the path to all of the javascript source files for this plugin
   * @access  public
	 * @return string[]
	 */
	function getJavascriptFiles() {
    return SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_PLUGIN_DIR . $this->_id . '/www/lib/', '/^.*js$/');
	}
	// }}}
  
	// {{{ getJavascriptUris
	/**
	 * returns the uri path to all of the javascript source files for this plugin
   * @access  public
	 * @return string[]
	 */
	function getJavascriptUris() {
    $uris = array();
    $files = $this->getJavascriptFiles();
    foreach ($files as $file) {
      $uris[] = SRAOS_URI_PREFIX . '/plugins/' . $this->_id . '/lib/' . basename($file);
    }
    return $uris;
	}
	// }}}
  
	// {{{ getJavascriptInstanceCode
	/**
	 * returns the javascript code necessary in order to instantiate an instance 
   * of this object in a mirrored javascript object
   * 
   * SRAOS_Plugin(id, applications, entities, entityActions, helpTopics, label, resources, windows)
   * 
   * @access  public
	 * @return string
	 */
  function getJavascriptInstanceCode() {
    global $user;
    
    $code = 'new SRAOS_Plugin("' . $this->_id . '", ';
    
    // applications
    $code .= '[';
    $keys = array_keys($this->_applications);
    $started = FALSE;
    foreach($keys as $key) {
      // user must have access to this application
      if ($user && $user->hasAppAccess($this->_id, $key)) {
        $code .= $started ? ', ' : '';
        $code .= $this->_applications[$key]->getJavascriptInstanceCode();
        $started = TRUE;
      }
    }
    $code .= '], ';

    // entities
    $code .= '[';
    $keys = array_keys($this->_entities);
    $started = FALSE;
    foreach($keys as $key) {
      // skip when user does not have permission to access the entity's viewer
      if ($user && !$user->hasAppAccess($this->_id, $this->_entities[$key]->getViewer())) { continue; }
      $code .= $started ? ', ' : '';
      $code .= $this->_entities[$key]->getJavascriptInstanceCode();
      $started = TRUE;
    }
    $code .= '], ';
    
    // entity actions
    $code .= '[';
    $keys = array_keys($this->_entityActions);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_entityActions[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    
    // helpTopics
    $code .= '[';
    $keys = array_keys($this->_helpTopics);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_helpTopics[$key]->getJavascriptInstanceCode();
    }
    $code .= '], ';
    
    $code .= '"' . str_replace('"', '\"', $this->getLabel()) . '", ';
    $code .= $this->baseResources ? $this->baseResources->toJson() . ', ' : 'null, ';
    
    // windows
    $code .= '[';
    $keys = array_keys($this->_windows);
    foreach($keys as $key) {
      $code .= $keys[0] != $key ? ', ' : '';
      $code .= $this->_windows[$key]->getJavascriptInstanceCode();
    }
    $code .= '])';
    
    return $code;
  }
  // }}}
  
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
  
	// {{{ getApplication
	/**
	 * returns the application specified
   * @access  public
	 * @return SRAOS_Application
	 */
	function & getApplication($appId) {
		return $this->_applications[$appId];
	}
	// }}}
  
	// {{{ getApplications
	/**
	 * returns the applications of this plugin
   * @access  public
	 * @return SRAOS_Application[]
	 */
	function & getApplications() {
		return $this->_applications;
	}
	// }}}
	
	// {{{ setApplications
	/**
	 * sets the plugin applications
	 * @param SRAOS_Application[] $applications the applications to set
   * @access  public
	 * @return void
	 */
	function setApplications(& $applications) {
		$this->_applications =& $applications;
	}
	// }}}
  
	// {{{ getDependencies
	/**
	 * returns the dependencies of this plugin
   * @access  public
	 * @return string[]
	 */
	function getDependencies() {
		return $this->_dependencies;
	}
	// }}}
	
	// {{{ setDependencies
	/**
	 * sets the plugin dependencies
	 * @param string[] $dependencies the dependencies to set
   * @access  public
	 * @return void
	 */
	function setDependencies($dependencies) {
		$this->_dependencies = $dependencies;
	}
	// }}}
  
	// {{{ getEntity
	/**
	 * returns the entity specified by $id
   * @parma string $id the name of the entity to return
   * @access  public
	 * @return SRAOS_Entity
	 */
	function & getEntity($id) {
		return $this->_entities[$id];
	}
	// }}}
  
	// {{{ getEntities
	/**
	 * returns the entities of this plugin
   * @access  public
	 * @return SRAOS_Entity[]
	 */
	function & getEntities() {
		return $this->_entities;
	}
	// }}}
	
	// {{{ setEntities
	/**
	 * sets the plugin entities
	 * @param SRAOS_Entity[] $entities the entities to set
   * @access  public
	 * @return void
	 */
	function setEntities(& $entities) {
		$this->_entities =& $entities;
	}
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * recursively searchs for and returns the help topic identified by $id
   * @param string $id the id of the help topic to return
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	function & getHelpTopic($id) {
		return $this->_getHelpTopic($id, $this->_helpTopics);
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
  
	// {{{ getModels
	/**
	 * returns the models of this plugin
   * @access  public
	 * @return string[]
	 */
	function getModels() {
		return $this->_models;
	}
	// }}}
	
	// {{{ setModels
	/**
	 * sets the plugin models
	 * @param string[]$models the models to set
   * @access  public
	 * @return void
	 */
	function setModels($models) {
		$this->_models = $models;
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
  
	// {{{ getWindow
	/**
	 * returns the window specified
   * @access  public
	 * @return SRAOS_Application
	 */
	function & getWindow($winId) {
		return $this->_windows[$winId];
	}
	// }}}
  
	// {{{ getWindows
	/**
	 * returns the windows of this plugin
   * @access  public
	 * @return SRAOS_Window[]
	 */
	function & getWindows() {
		return $this->_windows;
	}
	// }}}
	
	// {{{ setWindows
	/**
	 * sets the plugin windows
	 * @param SRAOS_Window[] $windows the windows to set
   * @access  public
	 * @return void
	 */
	function setWindows(& $windows) {
		$this->_windows =& $windows;
	}
	// }}}
	
	// Static methods
  
	// {{{ getApplicationsArray
	/**
	 * returns a sorted array of plugin applications/groups where the groups will 
   * be represented as an array of SRAOS_Application objects
	 *
	 * @param  SRAOS_Application[] $applications 
	 * @access	public
	 * @return	array
	 */
	function getApplicationsArray( & $applications ) {
		$apps = array();
    $keys = array_keys($applications);
    foreach($keys as $key) {
      if ($applications[$key]->isHidden() || $applications[$key]->isService()) {
        continue;
      }
      if ($applications[$key]->getGroup()) {
        $resource = $applications[$key]->_plugin->resources->getString($applications[$key]->getGroup());
        if (!isset($apps[$resource])) {
          $apps[$resource] = array();
        }
        $apps[$resource][$applications[$key]->getId()] =& $applications[$key];
        ksort($apps[$resource][$applications[$key]->getId()]);
      }
      else {
        $apps[$applications[$key]->getId()] =& $applications[$key];
        ksort($apps[$applications[$key]->getId()]);
      }
    }
    ksort($apps);
    return $apps;
	}
	// }}}
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Plugin object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_plugin');
	}
	// }}}
	
  
  // private operations

	// {{{ _getHelpTopic
	/**
	 * recursively searchs for and returns the help topic identified by $id
   * @param string $id the id of the help topic to return
   * @param SRAOS_HelpTopic[] searchTopics the help topics to search. if not 
   * found in this array, this method will make recursive calls using their 
   * sub-topics
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	function & _getHelpTopic($id, $searchTopics) {
    // first search searchTopics
		$keys = array_keys($searchTopics);
    foreach($keys as $key) {
      if ($searchTopics[$key]->getId() == $id) {
        return $searchTopics[$key];
      }
    }
    // now search children
    foreach($keys as $key) {
      $children =& $searchTopics[$key]->getHelpTopics();
      if ($children && count($children) && ($topic =& $this->_getHelpTopic($id, $children))) {
        return $topic;
      }
    }
    return NULL;
	}
	// }}}
  
  
}
// }}}
?>
