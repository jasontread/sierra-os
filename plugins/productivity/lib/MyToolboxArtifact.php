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
/**
 * identifier for the build revision type
 * @type string
 */
define('MY_TOOLBOX_ARTIFACT_REVISION_TYPE_BUILD', 'build');

/**
 * identifier for the revision/maintenance revision type
 * @type string
 */
define('MY_TOOLBOX_ARTIFACT_REVISION_TYPE_MAINTENANCE', 'maintenance');

/**
 * identifier for the major revision type
 * @type string
 */
define('MY_TOOLBOX_ARTIFACT_REVISION_TYPE_MAJOR', 'major');

/**
 * identifier for the minor revision type
 * @type string
 */
define('MY_TOOLBOX_ARTIFACT_REVISION_TYPE_MINOR', 'minor');
// }}}

// {{{ MyToolboxArtifact
/**
 * used to associate an artifact or file with the invocation of a process. an 
 * artifact is a file or uri that has been "built" as a result of invoking a 
 * process. artifacts may be stored permanently or temporarily based on the 
 * keep* configuration attributes. artifacts may also be versioned automatically 
 * by MyToolbox using the version* configuration attributes
 * @author  Jason Read <jason@idir.org>
 */
class MyToolboxArtifact {
  // public attributes
  /**
   * the unique referencing identifier for this artifact
   * @type string
   */
  var $id;
  
  /**
   * whether or not to delete the original copy of this file
   * @type boolean
   */
  var $deleteOriginal;
  
  /**
   * if this artifact should be automatically deleted after a certain amount of 
   * time, this attribute may be used to specify the # of days after creation of 
   * the artifact when it should be deleted. fractional values are allowed
   * @type float
   */
  var $keepDays;
  
  /**
   * if only a certain # of artifacts of this type should be maintained by 
   * MyToolbox (accross all users), then this attribute may specify that #. set 
   * this value to 0 if you do not want to maintain any instances of this 
   * artifact in MyToolbox (notifications/attachments will still occur). then 
   * when deletion occurs, oldest artifacts will be deleted first
   * @type int
   */
  var $keepNum;
  
  /**
   * $path may be a uri. if the artifact should be linked to this uri instead of 
   * the file being copied, this attribute should be set to true
   * @type boolean
   */
  var $link;
  
  /**
   * optional notification recipients for this artifact. if not specified, and 
   * the process entity "getProcessNotifyArtifact" method does not exist or does 
   * not return a value, no notification will occur for this artifact. 
   * notifications will be sent using the creator's email address and name as 
   * the from address and name
   * @type string
   */
  var $notify;
  
  /**
   * whether or not to attach the artifact file (using a mime attachment) to any 
   * email notifaction messages sent
   * @type boolean
   */
  var $notifyAttach;
  
  /**
   * smarty template to use for process email notifications. this template will 
   * have access to any of the below $_notifySubject values in the form of 
   * smarty variables as well as the following: $artifactDescription, 
   * $projectDescription, $processDescription, $email (the email address for the 
   * notification), $name (the name for the notification - not available for 
   * email recipients) and $processObj (a reference to the MyToolboxProcessVO 
   * instance)
   * @type string
   */
  var $notifyTpl;
  
  /**
   * same as $notifyTpl but may be used to specify an html formatted 
   * notification template (multipart email message will be sent)
   * @type string
   */
  var $notifyTplHtml;
  
  /**
   * the basedir/app relative or absolute path to the file that should be used 
   * for this artifact. the path may be a regular expression, but if multiple 
   * files exist matching that expression, only the first match will be used
   * @type string
   */
  var $path;
  
  /**
   * if the enclosing process has a project defined and this attribute is true, 
   * this artifact will be attached to that project when it is created
   * @type boolean
   */
  var $projectAttach;
  
  /**
   * if $projectAttach is true, this attribute may be used to specify a project 
   * file category that this artifact should automatically be assigned to (the 
   * "key" value for the "file-category" in the project template)
   * @type string
   */
  var $projectCategory;
  
  /**
   * if $version is true, this attribute will specify the # of levels of 
   * revisioning to allow for this artifact. the default is 4 where each 
   * successive level is specified in the numeric auto-incrementing format: 
   * major.minor.maintenance.build. if you wish to use fewer revision levels, 
   * you may change this attribute value to 1, 2 or 3
   * @type int
   */
  var $revisionLevels;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to have access to this artifact. use the 'canAccess' 
   * method in order to determine whether or not the current user (or another 
   * user) has permission based on these roles
   * @type string
   */
  var $roles;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to be able to create a major revision to this artifact. 
   * if the user is not in one of these groups, this revision type will not be 
   * an option when they setup the process invocation. use the 
   * 'canAddMajorRevision' method in order to determine whether or not the 
   * current user (or another user) has permission based on these roles
   * @type string
   */
  var $rolesMajor;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to be able to create a minor revision to this artifact. 
   * if the user is not in one of these groups, this revision type will not be 
   * an option when they setup the process invocation. use the 
   * 'canAddMinorRevision' method in order to determine whether or not the 
   * current user (or another user) has permission based on these roles
   * @type string
   */
  var $rolesMinor;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to be able to create a maintenance revision to this 
   * artifact. if the user is not in one of these groups, this revision type 
   * will not be an option when they setup the process invocation. use the 
   * 'canAddMaintenanceRevision' method in order to determine whether or not the 
   * current user (or another user) has permission based on these roles
   * @type string
   */
  var $rolesRevision;
  
  /**
   * whether or not to automatically version this artifact. when true, MyToolbox 
   * will automatically assign a unique, numerically incrementing version # 
   * (based on the revision type selected when the process is invoked) to every 
   * new instance of this artifact. the versioning schema used by MyToolbox is 
   * a standard, 4-part string where each part is a numeric value corresponding 
   * with 1 of 4 revision types. the revision types used are major, minor, 
   * revision/maintenance and build where the first type corresponds with the 
   * left-most value and the last type corresponds with the right-most value. 
   * when a process has a revisioned artifact, part of the setup process for 
   * that process invocation will require the user to select a revision type for 
   * that artifact. then, when/if the process invocation is successful, and the 
   * artifact created, the version assigned to that artifact will be the 
   * previous (or initial) version with the corresponding revision type value 
   * incremented by 1. the $versionPrefix, $versionSuffix attributes and entity 
   * "getProcessArtifactVersion" method, may be used to modify the publicly 
   * visible version value
   * 
   * For more information, see the documentation provided at: 
   *   http://en.wikipedia.org/wiki/Software_versioning
   * @type boolean
   */
  var $version;
  
  /**
   * an optional prefix for the publicly visible version value for this artifact 
   * (may be a resource string)
   * @type string
   */
  var $versionPrefix;
  
  /**
   * the starting software version. if $revisionLevels has been specified, this 
   * value should not contain any more version points than are necessary. if not 
   * specified, 0.0.0.0 will be used (or the correct starting version based on 
   * the $revisionLevels specified)
   * @type string
   */
  var $versionStart;
  
  /**
   * an optional suffix for the publicly visible version value for this artifact 
   * (may be a resource string)
   * @type string
   */
  var $versionSuffix;
  
  /**
   * if an $entity is defined for the artifact process, this value may specify 
   * the id of a view to use for any notifications in place of $notifyTpl. this 
   * view will have access to the same smarty variables
   * @type string
   */
  var $viewNotify;
  
  /**
   * if an $entity is defined for the enclosing process, this value may specify 
   * the id of a view to use for any notifications in place of $notifyTplHtml. 
   * this view will have access to the same smarty variables
   * @type string
   */
  var $viewNotifyHtml;
  
  // private attributes
  /**
   * the category or categories to assign this artifact to. this value should be 
   * the resource identifier for that category. multiple categories can be 
   * specified each separated by a space. a category hierarchy can be specified 
   * by separating each level (starting from the top) with a pipe (|). each 
   * category resource may use the following imbedded keys: 
   *   {$artifact} (the artifact "key"), {$artifactName} or 
   *   {$timestamp_[format string]} (where [format string] is a 
   *   SRA_GregorianDate::format() compatible string)
   * additionally, each category may specify an icon uri to use to represent 
   * that category in the process navigator by separating the category resource 
   * identifier and the icon uri using a semi-colon. for example: 
   *   text.builds;/path/to/icons/16/icon.gif (icons should be 16 pixels square)
   * use the "getCategories" method to obtain a reference to the locale specific 
   * category strings (see api documentation provided below for more info)
   * method to return
   * @type string
   */
  var $_category;
  
  /**
   * an optional resource to use for the artifact description. if not specified, 
   * no description will be available. this resource may use any of the imbedded 
   * keys defined in $fileName below. use the "getDescription" method to obtain 
   * a reference to this string
   * @type string
   */
  var $_description;
  
  /**
   * the name to assign to this file. this value may be a resource key and also 
   * may have any of the following imbedded keys:
   *   {$artifact} (the artifact "key"), {$artifactName}, 
   *   {$timestamp_[format string]} (where [format string] is a 
   *   SRA_GregorianDate::format() compatible string), or {$version} (if 
   *   $version is true)
   * if not specified, the original name of the file will be used. use the 
   * "getFileName" method to obtain a reference to this string
   * @type string
   */
  var $_fileName;
  
  /**
   * uri to a custom icon to use to represent this artifact (if applicable). 
   * this value will contain the value "{$size}" which should be replaced with 
   * the corresponding desired size (16|32|64) using the "getIcon" method
   * @type string
   */
  var $_icon;
  
  /**
   * an optional resource to use for the artifact label. if not specified, the 
   * $fileName value will be used. if $fileName is also not specified, the 
   * basename of the original file will be used. this resource value may use any 
   * of the imbedded keys defined in "file-name". use the "getLabel" method 
   * always to get the label to use to represent an artifact
   * @type string
   */
  var $_label;
  
  /**
   * the mime type for this artifact. if not specified, the mime type will be 
   * automatically determined (if possible) based on the extension of the 
   * original file. use the "getMimeType" method to get the actual value to use
   * @type string
   */
  var $_mimeType;
  
  /**
   * notification subject resource to use for this artifact. this resource may 
   * use any of the following imbedded keys:
   *   {$projectName}, {$process} (process "key") {$processName}, {$artifact} 
   *   (artifact "key"), {$artifactName}, {$timestamp_[format string]} (where 
   *   [format string] is a SRA_GregorianDate::format() compatible string), or 
   *   {$version}
   * use the "getNotifySubject" method always to get the actual value to use
   * @type string
   */
  var $_notifySubject;
  
  /**
   * a reference to the process that this artifact pertains to
   * @type MyToolboxProject
   */
  var $_process;
  
  
	// {{{ MyToolboxArtifact
	/**
	 * instantiates this object including setting and validating of the attributes
   * included in the xml configuraiton $conf
   * @param mixed $conf the raw xml configuration for this artifact
   * @param MyToolboxProcess $process the process that this artifact is 
   * associated with
   * @access public
	 */
	function MyToolboxArtifact($conf, &$process) {
    $this->_process =& $process;
    $this->id = isset($conf['attributes']['key']) ? $conf['attributes']['key'] : NULL;
    if (!$this->id) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - "key" is required', __FILE__, __LINE__);
      return;
    }
    $this->_category = isset($conf['attributes']['category']) ? $conf['attributes']['category'] : NULL;
    $this->deleteOriginal = isset($conf['attributes']['trigger-ignore-fail']) ? SRA_Util::convertBoolean($conf['attributes']['trigger-ignore-fail']) : TRUE;
    $this->_description = isset($conf['attributes']['description']) ? $conf['attributes']['description'] : NULL;
    $this->_fileName = isset($conf['attributes']['file-name']) ? $conf['attributes']['file-name'] : NULL;
    $this->_icon = isset($conf['attributes']['icon']) ? $conf['attributes']['icon'] : NULL;
    $this->keepDays = isset($conf['attributes']['keep-days']) ? $conf['attributes']['keep-days'] : NULL;
    if ($this->keepDays && (!is_numeric($this->keepDays) || $this->keepDays < 0)) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed -  "keep-days" ' . $this->keepDays . ' is not valid', __FILE__, __LINE__);
      return;
    }
    $this->keepNum = isset($conf['attributes']['keep-num']) ? $conf['attributes']['keep-num']*1 : NULL;
    if (isset($this->keepNum) && (!is_int($this->keepNum) || $this->keepNum < 0)) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed -  "keep-num" ' . $this->keepNum . ' is not valid', __FILE__, __LINE__);
      return;
    }
    $this->_label = isset($conf['attributes']['label']) ? $conf['attributes']['label'] : $this->_fileName;
    $this->link = SRA_Util::convertBoolean($conf['attributes']['link']);
    $this->_mimeType = isset($conf['attributes']['mime-type']) ? $conf['attributes']['mime-type'] : NULL;
    $this->notify = isset($conf['attributes']['notify']) ? $conf['attributes']['notify'] : $project->notify;
    $this->notifyAttach = SRA_Util::convertBoolean($conf['attributes']['notify-attach']);
    $this->_notifySubject = isset($conf['attributes']['notify-subject']) ? $conf['attributes']['notify-subject'] : $process->project->notifySubjectArtifact;
    $this->notifyTpl = isset($conf['attributes']['notify-tpl']) ? $conf['attributes']['notify-tpl'] : $project->notifyTpl;
    $this->notifyTplHtml = isset($conf['attributes']['notify-tpl-html']) ? $conf['attributes']['notify-tpl-html'] : $project->notifyTplHtml;
    if (!SRA_Template::validateTemplate($this->notifyTpl)) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - notify-tpl "' . $this->notifyTpl . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if ($this->notifyTplHtml && !SRA_Template::validateTemplate($this->notifyTplHtml)) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - notify-tpl-html "' . $this->notifyTplHtml . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->path = $conf['attributes']['path'];
    if (!$this->path) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - path is required', __FILE__, __LINE__);
      return;
    }
    $this->projectAttach = $process->project ? SRA_Util::convertBoolean($conf['attributes']['link']) : FALSE;
    $this->projectCategory = $this->projectAttach && isset($conf['attributes']['project-category']) ? $conf['attributes']['project-category'] : NULL;
    $this->revisionLevels = isset($conf['attributes']['revision-levels']) ? $conf['attributes']['revision-levels'] * 1 : 4;
    if ($this->revisionLevels && $this->revisionLevels != 1 && $this->revisionLevels != 2 && $this->revisionLevels != 3 && $this->revisionLevels != 4) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - revision-levels "' . $this->revisionLevels . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->roles = isset($conf['attributes']['roles']) ? $conf['attributes']['roles'] : NULL;
    $this->rolesMajor = isset($conf['attributes']['roles-major']) ? $conf['attributes']['roles-major'] : NULL;
    $this->rolesMinor = isset($conf['attributes']['roles-minor']) ? $conf['attributes']['roles-minor'] : NULL;
    $this->rolesRevision = isset($conf['attributes']['roles-revision']) ? $conf['attributes']['roles-revision'] : NULL;
    $this->version = SRA_Util::convertBoolean($conf['attributes']['version']);
    $this->versionPrefix = isset($conf['attributes']['version-prefix']) ? $conf['attributes']['version-prefix'] : NULL;
    if (isset($conf['attributes']['version-start'])) {
      $this->versionStart = $conf['attributes']['version-start'];
    }
    else {
      $this->versionStart = $this->revisionLevels == 1 ? '0' : ($this->revisionLevels == 2 ? '0.0' : ($this->revisionLevels == 3 ? '0.0.0' : '0.0.0.0'));
    }
    $pieces = explode('.', $this->versionStart);
    if (count($pieces) != $this->revisionLevels) {
      $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - version-start "' . $this->versionStart . '" does not contain the same # of revision points as revision-levels', __FILE__, __LINE__);
      return;
    }
    else {
      foreach($pieces as $piece) {
        if (!is_int($piece*1)) {
          $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - version-start "' . $this->versionStart . '" contains an invalid revision point: ' . $piece, __FILE__, __LINE__);
          return;
        }
      }
    }
    $this->versionSuffix = isset($conf['attributes']['version-suffix']) ? $conf['attributes']['version-suffix'] : NULL;
    if (isset($conf['attributes']['view-notify']) || isset($conf['attributes']['view-notify-html'])) {
      if (!$process->entity) {
        $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - view-notify or view-notify-html are specified, but no entity is specified for the process ' . $process->id, __FILE__, __LINE__);
        return;
      }
      else {
        $dao =& SRA_DaoFactory::getDao($process->entity);
        $obj = $dao->newInstance();
        $this->viewNotify = isset($conf['attributes']['view-notify']) ? $conf['attributes']['view-notify'] : NULL;
        $this->viewNotifyHtml = isset($conf['attributes']['view-notify-html']) ? $conf['attributes']['view-notify-html'] : NULL;
        if ($this->viewNotify && !$obj->hasView($this->viewNotify)) { $err = 'view-notify'; }
        if ($this->viewNotifyHtml && !$obj->hasView($this->viewNotifyHtml)) { $err = 'view-notify-html'; }
        if ($err) {
          $this->err = SRA_Error::logError('MyToolboxArtifact::MyToolboxArtifact: Failed - ' . $err . ' "' . $conf['attributes'][$err] . '" is not a valid view for ' . $process->entity, __FILE__, __LINE__);
          return;
        }
      }
    }
  }
	// }}}
  
  // {{{ canAccess
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * access this artifact based on the $roles defined for it
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
  
  // {{{ canAddMaintenanceRevision
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * add a maintenance revision to this artifact
	 * @param int $uid the id of another user to evaluate. if not specified, the 
   * current active user will be used
	 * @access public
	 * @return boolean
	 */
	function canAddMaintenanceRevision($uid=NULL) {
		if ($this->rolesRevision && !$uid) {
      global $user;
      if (OsUserVO::isValid($user)) { $uid = $user->getUid(); }
    }
    return MyToolboxProject::_canAccess($this->rolesRevision, $uid);
	}
	// }}}
  
  // {{{ canAddMajorRevision
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * add a major revision to this artifact
	 * @param int $uid the id of another user to evaluate. if not specified, the 
   * current active user will be used
	 * @access public
	 * @return boolean
	 */
	function canAddMajorRevision($uid=NULL) {
		if ($this->rolesMajor && !$uid) {
      global $user;
      if (OsUserVO::isValid($user)) { $uid = $user->getUid(); }
    }
    return MyToolboxProject::_canAccess($this->rolesMajor, $uid);
	}
	// }}}
  
  // {{{ canAddMinorRevision
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * add a minor revision to this artifact
	 * @param int $uid the id of another user to evaluate. if not specified, the 
   * current active user will be used
	 * @access public
	 * @return boolean
	 */
	function canAddMinorRevision($uid=NULL) {
		if ($this->rolesMinor && !$uid) {
      global $user;
      if (OsUserVO::isValid($user)) { $uid = $user->getUid(); }
    }
    return MyToolboxProject::_canAccess($this->rolesMinor, $uid);
	}
	// }}}
  
	// {{{ getCategories
	/**
	 * provides a hash containing all of the locale specific categories that this 
   * artifact pertains to if any have been specified. the return value will be 
   * an array of category strings, where each value is a hash containing the 
   * following keys:
   *   categories: an array of sub-categories where each value in this array 
   *               will also be a hash with the same keys. not set if no 
   *               sub-categories exist
   *   icon:       the icon to use for this category (16x16). not set if no icon 
   *               is specified
   *   label:      the category label
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource strings. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource strings (applies only when $this->version == TRUE)
	 * @access public
	 * @return string
	 */
	function getCategories($timestamp=NULL, $version='') {
		if ($this->_category) {
      $categories = array();
      $pieces = explode(' ', $this->_category);
      foreach($pieces as $piece) {
        $categories[] = $this->_getCategory($piece, $timestamp, $version);
      }
      return $categories;
    }
	}
	// }}}
  
	// {{{ getDescription
	/**
	 * provides the locale specific description for this artifact if one has been 
   * specified
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE)
	 * @access public
	 * @return string
	 */
	function getDescription($timestamp=NULL, $version='') {
		if ($this->_description) {
      $data =& $this->process->resources->getData();
      return $this->process->resources->getString($this->_description, $this->_getResourceParams(isset($data[$this->_description]) ? $data[$this->_description] : NULL, $timestamp, $version));
    }
	}
	// }}}
  
	// {{{ getFileName
	/**
	 * provides the locale specific file name for this artifact if one has been 
   * specified
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE)
	 * @access public
	 * @return string
	 */
	function getFileName($timestamp=NULL, $version='') {
		if ($this->_fileName) {
      $data =& $this->process->resources->getData();
      return $this->process->resources->getString($this->_fileName, $this->_getResourceParams(isset($data[$this->_fileName]) ? $data[$this->_fileName] : NULL, $timestamp, $version));
    }
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the uri for the icon (using size $size) to use to represent this 
   * artifact if one has been specified, NULL otherwise
	 * @param int $size the size of the icon uri to return (16|32|64)
	 * @access public
	 * @return string
	 */
	function getIcon($size=16) {
		return $this->_icon ? str_replace('{$size}', $size, $this->_icon) : NULL;
	}
	// }}}
  
	// {{{ getLabel
	/**
	 * provides the locale specific label to use for this artifact
   * @param string $filename the original name of the file
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE)
	 * @access public
	 * @return string
	 */
	function getLabel($filename, $timestamp=NULL, $version='') {
		if ($this->_label) {
      $data =& $this->process->resources->getData();
      return $this->process->resources->getString($this->_label, $this->_getResourceParams(isset($data[$this->_label]) ? $data[$this->_label] : NULL, $timestamp, $version));
    }
    else {
      return basename($filename);
    }
	}
	// }}}
  
	// {{{ getMimeType
	/**
	 * returns the mime type to use for this artifact. this will be either the 
   * value of "mime-type" from the configuration (if specified), or a guessed 
   * mime type based on the file extension of $filename
	 * @param string $filename the original name of the file
	 * @access public
	 * @return string
	 */
	function getMimeType($filename) {
		return $this->_mimeType ? $this->_mimeType : SRA_File::getMimeType($filename);
	}
	// }}}
  
	// {{{ getNotifySubject
	/**
	 * provides the locale specific description for this artifact if one has been 
   * specified
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE)
	 * @access public
	 * @return string
	 */
	function getNotifySubject($timestamp=NULL, $version='') {
    $data =& $this->process->resources->getData();
    return $this->process->resources->getString($this->_notifySubject, $this->_getResourceParams($data[$this->_notifySubject], $timestamp, $version));
	}
	// }}}
  
  
	// {{{ _getCategory
	/**
	 * returns a category hash for a single category string as defined above in 
   * the "getCategories" method
   * @param string $category the raw category value
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE
	 * @access public
	 * @return string
	 */
	function _getCategory($category, $timestamp, $version) {
    $cat = array();
    if (!$timestamp) { $timestamp = new SRA_GregorianDate(); }
    $pieces = explode('|', $category);
    $cpieces = explode(';', $pieces[0]);
    $data =& $this->process->resources->getData();
    $raw = isset($data[$cpieces[0]]) ? $data[$cpieces[0]] : NULL;
    $params = array('artifact' => $this->id, 'artifactName' => $this->name, 'version' => $version);
    if (preg_match('/\{\$timestamp_.*.\}/', $raw, $matches)) {
      foreach($matches as $match) {
        $pieces = explode('_', $match);
        $params['timestamp_' . substr($pieces[1], 0, -1)] = $timestamp->format(substr($pieces[1], 0, -1));
      }
    }
    $cat['label'] = $this->process->resources->getString($cpieces[0], $params);
    if (count($cpieces) == 2) { $cat['icon'] = $cpieces[1]; }
    if (count($pieces > 1)) {
      $cat['categories'] = array();
      for($i=1; $i<count($pieces); $i++) {
        $cat['categories'][] = $this->_getCategory($pieces[$i], $timestamp, $version);
      }
    }
    return $cat;
	}
	// }}}
  
	// {{{ _getResourceParams
	/**
	 * returns the $params to use to retrieve a given resource string
   * @param string $raw the raw resource value (without params substituted)
	 * @param SRA_GregorianDate $timestamp the timestamp to use for any imbedded 
   * {{$timestamp_[format string]} keys in the resource string. if not 
   * specified, the current time will be used
   * @param string $version the version string to replace with any {$version} 
   * keys in the resource string (applies only when $this->version == TRUE
	 * @access public
	 * @return string
	 */
	function _getResourceParams($raw, $timestamp, $version) {
    if (!$timestamp) { $timestamp = new SRA_GregorianDate(); }
    $params = array('artifact' => $this->id, 'artifactName' => $this->name, 'version' => $version, 'process' => $this->process->id, 'processName' => $this->process->name, 'projectName' => $this->process->project->name);
    if (preg_match('/\{\$timestamp_.*.\}/', $raw, $matches)) {
      foreach($matches as $match) {
        $pieces = explode('_', $match);
        $params['timestamp_' . substr($pieces[1], 0, -1)] = $timestamp->format(substr($pieces[1], 0, -1));
      }
    }
    return $params;
	}
	// }}}
  
  
	// static methods
	
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxArtifact is valid
	 * @param object $object the object to validate
	 * @access public
	 * @return boolean
	 */
	function isValid(&$object) {
		return is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'mytoolboxartifact';
	}
	// }}}
}
// }}}
?>
