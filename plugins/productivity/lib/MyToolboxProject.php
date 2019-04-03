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
require_once('MyToolboxProcess.php');
// }}}

// {{{ Constants
/**
 * the path to the default build tool source file
 * @type string
 */
define('MY_TOOLBOX_PROJECT_DEFAULT_BUILD_TOOL_SRC', 'plugins/productivity/MyToolboxBuildToolAnt');

/**
 * the default process notification template
 * @type string
 */
define('MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_TPL', 'plugins/productivity/my-toolbox-notify.tpl');

/**
 * the default artifact notification template
 * @type string
 */
define('MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_ARTIFACT_TPL', 'plugins/productivity/my-toolbox-notify-artifact.tpl');
// }}}

// {{{ MyToolboxProject
/**
 * used to represent the data associated with the "project" element in an xml 
 * document based on my-toolbox_1_0.dtd. it defines a single project that will 
 * be visible in MyToolbox as well as the processes that may be invoked in the 
 * context of that project. 
 *
 * a project also specifies the default build tool that will be used to invoke 
 * processes associated with it
 * @author  Jason Read <jason@idir.org>
 */
class MyToolboxProject {
  // public attributes
  /**
   * the base directory from where processes should be invoked for this project. 
   * relative path determinations will be calculated first based on this 
   * directory
   * @type string
   */
  var $basedir;
  
  /**
   * the name of the PHP class defined in $buildToolSrc that will be used to 
   * manage interaction with the underlying build tool responsible for the 
   * processes defined for this project. this class should extend the base class 
   * template defined in lib/MyToolboxBuildTool.php. the default build tool if 
   * another is MY_TOOLBOX_PROJECT_DEFAULT_BUILD_TOOL. this class must provide 
   * certain standard methods used by MyToolbox in order to complete the 
   * processes defined for this project. for more information, see the 
   * documentation provided in lib/MyToolboxBuildTool.php
   * @type string
   */
  var $buildTool;
  
  /**
   * the absolute path to the PHP source file containing the $buildTool class
   * @type string
   */
  var $buildToolSrc;
  
  /**
   * the local specific description to use for this project (if applicable)
   * @type string
   */
  var $description;
  
  /**
   * the resource to use for for the build revision type label. if not 
   * specified, a default "Build" label will be used
   * @type string
   */
  var $labelRevisionBuild;
  
  /**
   * the resource to use for for the major revision type label. if not 
   * specified, a default "Major" label will be used
   * @type string
   */
  var $labelRevisionMajor;
  
  /**
   * the resource to use for for the minor revision type label. if not 
   * specified, a default "Minor" label will be used
   * @type string
   */
  var $labelRevisionMinor;
  
  /**
   * the resource to use for for the revision/maintenance revision type label. 
   * if not specified, a default "Revision" label will be used
   * @type string
   */
  var $labelRevisionRevision;
  
  /**
   * label to use for the failed status
   * @type string
   */
  var $labelStatusFailed;
  
  /**
   * label to use for the initialized status
   * @type string
   */
  var $labelStatusInitialized;
  
  /**
   * label to use for the pending status
   * @type string
   */
  var $labelStatusPending;
  
  /**
   * label to use for the success status
   * @type string
   */
  var $labelStatusSuccess;
  
  /**
   * label to use for the wait status
   * @type string
   */
  var $labelStatusWait;
  
  /**
   * the name label to use for this project
   * @type string
   */
  var $name;
  
  /**
   * space separated list of users, groups and/or email addresses that should be 
   * notified by email whenever a process from this project is initiated. each 
   * process "notify" method will inherit this value unless another is specified. the search 
   * order for values in this attribute will be 1) username, 2) group name, 
   * 3) email address, 4) uid (prefix uids with "u" and 5) gid (prefix gids with 
   * "g"). notifications will be sent using the creator's email address and name 
   * as the from address and name
   * @type string
   */
  var $notify;
  
  /**
   * resource to use for process notification subjects. this resource may use 
   * any of the following imbedded keys:
   *  {$projectName}, {$process} (process "key") or {$processName}
   * if not specified, a default subject will be used
   * @type string
   */
  var $notifySubject;
  
  /**
   * same as $notifySubject but used for artifacts only. if not specified, 
   * a default value will be used. this resource may use any of the following 
   * imbedded keys:
   *   {$projectName}, {$process} (process "key") {$processName}, {$artifact} 
   *   (artifact "key"), {$artifactName}, {$timestamp_[format string]} (where 
   *   [format string] is a SRA_GregorianDate::format() compatible string), or 
   *   {$version}
   * if not specified, a default subject will be used
   * @type string
   */
  var $notifySubjectArtifact;
  
  /**
   * smarty template to use for process email notifications. this template will 
   * have access to any of the below $notifySubject values in the form of 
   * smarty variables as well as the following: $projectDescription, 
   * $processDescription, $email (the email address for the notification), $name 
   * (the name for the notification - not available for email recipients) and 
   * $processObj (a reference to the MyToolboxProcessVO instance). if not 
   * specified, the default template MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_TPL will 
   * be used
   * @type string
   */
  var $notifyTpl;
  
  /**
   * smarty template to use for artifact email notifications. this template will 
   * have access to any of the below $notifySubjectArtifact values in the form 
   * of smarty variables as well as the following: $artifactDescription, 
   * $projectDescription, $processDescription, $email (the email address for the 
   * notification), $name (the name for the notification - not available for 
   * email recipients) and $processObj (a reference to the MyToolboxProcessVO 
   * instance). if not specified, the default template 
   * MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_ARTIFACT_TPL will be used
   * @type string
   */
  var $notifyTplArtifact;
  
  /**
   * same as $notifyTpl but may be used to specify an html formatted 
   * notification template (multipart email message will be sent)
   * @type string
   */
  var $notifyTplHtml;
  
  /**
   * same as $notifyTplArtifact but may be used to specify an html formatted 
   * notification template (multipart email message will be sent)
   * @type string
   */
  var $notifyTplHtmlArtifact;
  
  /**
   * any parameters associated with this project including those used by the 
   * build tool
   * @type SRA_Params
   */
  var $params;
  
  /**
   * a hash of all of the processes associated with this project. this hash is 
   * indexed by the process "key"
   * @type MyToolboxProcess[]
   */
  var $processes = array();
  
  /**
   * the resource bundle to use to lookup strings used by this project (project 
   * name, description, etc.)
   * @type SRA_ResourceBundle
   */
  var $resources;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to have access to this project and its' processes. use 
   * the 'canAccess' method in order to determine whether or not the current 
   * user (or another user) has permission based on these roles
   * @type string
   */
  var $roles;
  
  // private attributes
  /**
   * uri to a custom icon to use to represent this project (if applicable). this 
   * value will contain the value "{$size}" which should be replaced with the 
   * corresponding desired size (16|32|64) using the "getIcon" method
   * @type string
   */
  var $_icon;
  
  /**
   * if a process contains any artifacts that utilize automated revisioning, 
   * this attribute may be used to specify the resource to use as the header for 
   * the revision type selection area in the setup form for that process. if may 
   * use any of the following imbedded keys: {$projectName}, {$artifact} 
   * (artifact key) or {$artifactName}. If not specified, a default "Select a 
   * revision type for {$artifactName}" label will be used. use the 
   * 'getLabelRevision' method in order to access this string
   * @type string
   */
  var $_labelRevision;
  
  /**
   * a reference to the productivity resource bundle
   * @type SRA_ResourceBundle
   */
  var $_productivityResources;
  
  
	// {{{ MyToolboxProject
	/**
	 * instantiates this object including setting and validating of the attributes
   * included in the xml configuraiton $conf
   * @param mixed $conf the raw xml configuration for this project
   * @param string $confDir the directory containing the xml configuration
   * @access public
	 */
	function MyToolboxProject($conf, $confDir) {
    if (!($this->basedir = MyToolboxProject::_getBaseDir($conf['attributes']['basedir'], $confDir))) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - basedir "' . $conf['attributes']['basedir'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!($this->buildToolSrc = MyToolboxProject::_getBuildToolSrc(isset($conf['attributes']['build-tool-src']) ? $conf['attributes']['build-tool-src'] : MY_TOOLBOX_PROJECT_DEFAULT_BUILD_TOOL_SRC, $this->basedir))) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - build-tool-src "' . $conf['attributes']['build-tool-src'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!($this->buildTool = MyToolboxProject::_getBuildTool($this->buildToolSrc, $conf['attributes']['build-tool']))) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - build-tool "' . $conf['attributes']['build-tool'] . '" is not a valid class or is not a sub-class of MyToolboxBuildTool', __FILE__, __LINE__);
      return;
    }
    
    if (isset($conf['attributes']['resources'])) {
      $resources = $conf['attributes']['resources'];
      if (!SRA_Util::endsWith($resources, '.' . SRA_RESOURCE_BUNDLE_FILE_EXT)) { $resources .= '.' . SRA_RESOURCE_BUNDLE_FILE_EXT; }
      if (!SRA_Util::beginsWith($resources, '/')) { $resources = '/' . $resources; }
      if (file_exists($this->basedir . $resources)) { $resources = $this->basedir . $resources; }
      else if (file_exists(SRA_Controller::getAppLibDir() . $resources)) { $resources = SRA_Controller::getAppLibDir() . $resources; }
      else if (file_exists(SRA_Controller::getSysLibDir() . $resources)) { $resources = SRA_Controller::getSysLibDir() . $resources; }
      if (file_exists($resources)) { 
        $this->resources =& SRA_ResourceBundle::getBundle(str_replace('.' . SRA_RESOURCE_BUNDLE_FILE_EXT, '', $resources)); 
      }
      else {
        $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - resources "' . $conf['attributes']['resources'] . '" is not a valid', __FILE__, __LINE__);
        return;
      }
    }
    else {
      $this->resources =& SRA_Controller::getAppResources();
    }
    $this->_productivityResources =& SRA_ResourceBundle::getBundle(MY_TOOLBOX_MANAGER_PRODUCTIVITY_RESOURCES);
    
    $this->description = isset($conf['attributes']['description']) ? $this->resources->getString($conf['attributes']['description']) : NULL;
    $this->_icon = isset($conf['attributes']['icon']) ? $conf['attributes']['icon'] : NULL;
    if ($this->_icon && strpos($this->_icon, '{$size}') === FALSE) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - icon "' . $conf['attributes']['icon'] . '" does not contain required "{$size}" sub-string', __FILE__, __LINE__);
      return;
    }
    
    $this->_labelRevision = isset($conf['attributes']['label-revision']) ? $conf['attributes']['label-revision'] : 'MyToolbox.labelRevision';
    $this->labelRevisionBuild = isset($conf['attributes']['label-revision-build']) ? $this->resources->getString($conf['attributes']['label-revision-build']) : $this->_productivityResources->getString('MyToolbox.labelRevisionBuild');
    $this->labelRevisionMajor = isset($conf['attributes']['label-revision-major']) ? $this->resources->getString($conf['attributes']['label-revision-major']) : $this->_productivityResources->getString('MyToolbox.labelRevisionMajor');
    $this->labelRevisionMinor = isset($conf['attributes']['label-revision-minor']) ? $this->resources->getString($conf['attributes']['label-revision-minor']) : $this->_productivityResources->getString('MyToolbox.labelRevisionMinor');
    $this->labelRevisionRevision = isset($conf['attributes']['label-revision-revision']) ? $this->resources->getString($conf['attributes']['label-revision-revision']) : $this->_productivityResources->getString('MyToolbox.labelRevisionRevision');
    $this->labelStatusFailed = isset($conf['attributes']['label-status-failed']) ? $this->resources->getString($conf['attributes']['label-status-failed']) : $this->_productivityResources->getString('MyToolbox.labelStatusFailed');
    $this->labelStatusInitialized = isset($conf['attributes']['label-status-initialized']) ? $this->resources->getString($conf['attributes']['label-status-initialized']) : $this->_productivityResources->getString('MyToolbox.labelStatusInitialized');
    $this->labelStatusPending = isset($conf['attributes']['label-status-pending']) ? $this->resources->getString($conf['attributes']['label-status-pending']) : $this->_productivityResources->getString('MyToolbox.labelStatusPending');
    $this->labelStatusSuccess = isset($conf['attributes']['label-status-success']) ? $this->resources->getString($conf['attributes']['label-status-success']) : $this->_productivityResources->getString('MyToolbox.labelStatusSuccess');
    $this->labelStatusWait = isset($conf['attributes']['label-status-wait']) ? $this->resources->getString($conf['attributes']['label-status-wait']) : $this->_productivityResources->getString('MyToolbox.labelStatusWait');
    if (!isset($conf['attributes']['name'])) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - required "name" not specified for this project', __FILE__, __LINE__);
      return;
    }
    $this->name = $this->resources->getString($conf['attributes']['name']);
    $this->notify = isset($conf['attributes']['notify']) ? $conf['attributes']['notify'] : NULL;
    $this->notifySubject = isset($conf['attributes']['notify-subject']) ? $conf['attributes']['notify-subject'] : 'MyToolbox.notifySubject';
    $this->notifySubjectArtifact = isset($conf['attributes']['notify-subject-artifact']) ? $conf['attributes']['notify-subject-artifact'] : 'MyToolbox.notifySubjectArtifact';
    $this->notifyTpl = isset($conf['attributes']['notify-tpl']) ? $conf['attributes']['notify-tpl'] : MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_TPL;
    $this->notifyTplArtifact = isset($conf['attributes']['notify-tpl-artifact']) ? $conf['attributes']['notify-tpl-artifact'] : MY_TOOLBOX_PROJECT_DEFAULT_NOTIFY_ARTIFACT_TPL;
    $this->notifyTplHtml = isset($conf['attributes']['notify-tpl-html']) ? $conf['attributes']['notify-tpl-html'] : NULL;
    $this->notifyTplHtmlArtifact = isset($conf['attributes']['notify-tpl-html-artifact']) ? $conf['attributes']['notify-tpl-html-artifact'] : NULL;
    if (!SRA_Template::validateTemplate($this->notifyTpl)) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - notify-tpl "' . $this->notifyTpl . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!SRA_Template::validateTemplate($this->notifyTplArtifact)) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - notify-tpl-artifact "' . $this->notifyTplArtifact . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if ($this->notifyTplHtml && !SRA_Template::validateTemplate($this->notifyTplHtml)) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - notify-tpl-html "' . $this->notifyTplHtml . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if ($this->notifyTplHtmlArtifact && !SRA_Template::validateTemplate($this->notifyTplHtmlArtifact)) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - notify-tpl-html-artifact "' . $this->notifyTplHtmlArtifact . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->roles = isset($conf['attributes']['roles']) ? $conf['attributes']['roles'] : NULL;
    
    $this->params = new SRA_Params(isset($conf['param']) ? $conf['param'] : NULL);
    
    // processes
    if (isset($conf['process'])) {
      $keys = array_keys($conf['process']);
      foreach($keys as $key) {
        if (!MyToolboxProcess::isValid($this->processes[$key] = new MyToolboxProcess($conf['process'][$key], $this))) {
          $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - process "' . $key . '" is not valid', __FILE__, __LINE__);
          return;
        }
      }
    }
    if (!count($this->processes)) {
      $this->err = SRA_Error::logError('MyToolboxProject::MyToolboxProject: Failed - at least 1 process must be defined for this project', __FILE__, __LINE__);
      return;
    }
  }
	// }}}
  
  // {{{ canAccess
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * access this project based on the $roles defined for it
	 * @param int $uid the id of another user to evaluate. if not specified, the 
   * current active user will be used
	 * @access public
	 * @return boolean
	 */
	function canAccess($uid=NULL) {
		if ($this->roles && !$uid) {
      global $user;
      if (OsUserVO::isValid($user)) { $uid = $user->getUid(); }
    }
    return MyToolboxProject::_canAccess($this->roles, $uid);
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the uri for the icon (using size $size) to use to represent this 
   * project if one has been specified, NULL otherwise
	 * @param int $size the size of the icon uri to return (16|32|64)
	 * @access public
	 * @return string
	 */
	function getIcon($size=16) {
		return $this->_icon ? str_replace('{$size}', $size, $this->_icon) : NULL;
	}
	// }}}
  
	// {{{ getLabelRevision
	/**
	 * returns the revision type selector label
	 * @param string $artifact the artifact key (substituted with the imbedded key 
   * {$artifact})
   * @param string $name the artifact label (substituted with the imbedded key 
   * {$artifactName})
	 * @access public
	 * @return string
	 */
	function getLabelRevision($artifact, $name) {
		$params = array('projectName' => $this->name, 'artifact' => $artifact, 'artifactName' => $name);
    return $this->resources->containsKey($this->_labelRevision) ? $this->resources->getString($this->_labelRevision, $params) : $this->_productivityResources->getString($this->_labelRevision, $params);
	}
	// }}}
  
	// {{{ getProcess
	/**
	 * returns the process config in this project for the process identified by 
   * $id. the search for this process is recursive through the entire process 
   * hierarchy (processes and sub-processes)
	 * @param string $id the identifier of the process to return (the process 
   * "key")
	 * @access public
	 * @return MyToolboxProcess
	 */
	function &getProcess($id) {
		$keys = array_keys($this->processes);
    foreach($keys as $key) {
      if ($this->processes[$key]->id == $id) {
        return $this->processes[$key];
      }
    }
    foreach($keys as $key) {
      if ($process =& $this->processes[$key]->getProcess($id)) {
        return $process;
      }
    }
	}
	// }}}
  
  
	// static methods
	
  // {{{ _canAccess
	/**
	 * returns TRUE if the user identified by $uid has access based on the $roles 
   * specified
   * @param string $roles a space separated list of group names or gids one of 
   * which $uid must be a member of in order for access to be granted. if $roles 
   * is not set, TRUE will be returned always
	 * @param int $uid the id of the user to evaluate
	 * @access public
	 * @return boolean
	 */
	function _canAccess($roles, $uid) {
    $canAccess = $uid ? TRUE : FALSE;
		if ($roles && is_numeric($uid)) {
      $canAccess = FALSE;
      $pieces = explode(' ', $roles);
      foreach($pieces as $piece) {
        if (OsGroupVO::isMember($uid, is_numeric($piece) ? $piece : OsGroupVO::getGidFromName($piece))) {
          $canAccess = TRUE;
          break;
        }
      }
    }
    return $canAccess;
	}
	// }}}
  
  // {{{ _getBaseDir
	/**
	 * translates a relative basedir to an absolute path and returns the absolute 
   * path. if $basedir is already an absolute path, that same value will be 
   * returned. if $basedir is not specified, $default will be used for the 
   * calculations. $basedir may also be relative to $default
   * @param string $basedir the basedir value from the configuration
	 * @param string $default the default basedir value to use if $basedir is not 
   * specified
	 * @access public
	 * @return string
	 */
  function _getBaseDir($basedir, $default) {
    $basedir = $basedir ? $basedir : $default;
    if (!is_dir($basedir)) {
      if (!SRA_Util::beginsWith($basedir, '/')) { $basedir = '/' . $basedir; }
      if (is_dir($default . $basedir)) { $basedir = $default . $basedir; }
      else if (is_dir(SRA_Controller::getAppDir() . $basedir)) { $basedir = SRA_Controller::getAppDir() . $basedir; }
      else if (is_dir(SRA_Controller::getSysDir() . $basedir)) { $basedir = SRA_Controller::getSysDir() . $basedir; }
    }
    return is_dir($basedir) ? $basedir : NULL;
  }
  // }}}
  
  // {{{ _getBuildTool
	/**
	 * returns the class name to use for the build tool $src specified. returns 
   * NULL if the the class could not be determined
   * @param string $src the relative source path
	 * @param string $buildTool the name of the class to validate. if not 
   * specified, the base name of $src (minus the .php extension) will be used 
   * @param string $className the class to validate
	 * @access public
	 * @return string
	 */
  function _getBuildTool($src, $buildTool, $className='MyToolboxBuildTool') {
    $buildTool = $buildTool ? $buildTool : str_replace('.' . SRA_SYS_PHP_EXTENSION, '', basename($src));
    include_once($src);
    return class_exists($buildTool) && is_subclass_of($buildTool, $className) ? $buildTool : NULL;
  }
  // }}}
  
  // {{{ _getBuildToolSrc
	/**
	 * translates a relative build tool source path to an absolute path and 
   * returns the absolute path. if $src is already an absolute path, that same 
   * value will be returned. $src can also be relative to $basedir. the ".php" 
   * file extension is also optional for $src
   * @param string $src the relative source path
	 * @param string $basedir the base directory
	 * @access public
	 * @return string
	 */
  function _getBuildToolSrc($src, $basedir) {
    if (!file_exists($src)) {
      if (!SRA_Util::beginsWith($src, '/')) { $src = '/' . $src; }
      if (!SRA_Util::endsWith($src, '.' . SRA_SYS_PHP_EXTENSION)) { $src .= '.' . SRA_SYS_PHP_EXTENSION; }
      if (file_exists(dirname(__FILE__) . $src)) { $src = dirname(__FILE__) . $src; }
      else if (file_exists($basedir . $src)) { $src = $basedir . $src; }
      else if (file_exists(SRA_Controller::getAppLibDir() . $src)) { $src = SRA_Controller::getAppLibDir() . $src; }
      else if (file_exists(SRA_Controller::getSysLibDir() . $src)) { $src = SRA_Controller::getSysLibDir() . $src; }
    }
    return file_exists($src) ? $src : NULL;
  }
  // }}}
  
	// {{{ notifyToHash
	/**
	 * returns the notification recipients for this project as a hash where the 
   * key is the email address and the value is the name
   * @param string $notify space separated list of users, groups and/or email 
   * addresses. the search order for values in this attribute will be 1) 
   * username, 2) group name, 3) email address, 4) uid (prefix uids with "u" and 
   * 5) gid (prefix gids with "g")
   * @access public
   * @return hash
	 */
  function notifyToHash($notify) {
    $hash = array();
    if ($pieces = explode(' ', $notify)) {
      foreach($pieces as $piece) {
        if (preg_match(SRA_ATTRIBUTE_VALIDATOR_EMAIL_REGEX, $piece)) {
          $hash[$piece] = '';
        }
        else if (strtolower(substr($piece, 0, 1)) == 'u' && is_numeric($uid = substr($piece, 1)) && ($email = OsUserVO::getEmailFromUid($uid))) {
          $hash[$email] = OsUserVO::getNameFromUid($uid);
        }
        else if (strtolower(substr($piece, 0, 1)) == 'g' && is_numeric($gid = substr($piece, 1)) && ($ghash = OsUserVO::getUserHash($gid, 'name', NULL, NULL, 'email'))) {
          array_merge($hash, $ghash);
        }
        else if ($uid = OsUserVO::getUidFromUserName($piece)) {
          $hash[OsUserVO::getEmailFromUid($uid)] = OsUserVO::getNameFromUid($uid);
        }
        else if ($gid = OsGroupVO::getGidFromName($piece) && ($ghash = OsUserVO::getUserHash($gid, 'name', NULL, NULL, 'email'))) {
          array_merge($hash, $ghash);
        }
      }
    }
    return $hash;
  }
  // }}}
  
  
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxProject is valid
	 * @param object $object the object to validate
	 * @access public
	 * @return boolean
	 */
	function isValid(&$object) {
		return is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'mytoolboxproject';
	}
	// }}}
  
}
// }}}
?>
