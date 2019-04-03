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
require_once('MyProjectsTemplate.php');
require_once('MyToolboxArtifact.php');
require_once('MyToolboxTrigger.php');
// }}}

// {{{ Constants

// }}}

// {{{ MyToolboxProcess
/**
 * used to represent the data associated with the "process" element in an xml 
 * document based on my-toolbox_1_0.dtd. it defines something that is done in an 
 * automated fashion such as deployment or building a software release. projects 
 * define 1 or more processes associated to them. additionally processes may 
 * define nested processes which are processes that can only be invoked within 
 * the context of the parent process. for example, a deployment process might 
 * have a sub-process for rolling back the deployment
 * 
 * processes can also define artifacts associated to them. artifacts are 
 * resources including files or uris that are generated as a result of 
 * successful invocation of that process. these artifacts are stored along with 
 * the process invocation record
 * 
 * processes can be manually invoked, automatically triggered or scheduled by a 
 * MyToolbox user
 * 
 * a process invocation has a start-to-finish lifecycle. this lifecycle is 
 * monitored using statuses. the following statuses are used:
 * 
 *   initialized: prior to invocation, while setup data is being collected 
 *                (viewSetup) which does not have to occur all at once (user may 
 *                save data and return later to complete)
 *   wait:        waiting for completion of "project" or "projectWfStep"
 *   pending:     when the process is currently in progress but not yet 
 *                completed. this status is used for asynchronous processes 
 *                where the build tool is being periodically queried for an 
 *                updated status
 *   success:     after successful build tool invocation
 *   failed:      after failed build tool invocation
 *   
 * process status is determined by the build tool. the latter 3 statuses above 
 * are the statuses that the build tool uses. for more information, see the api 
 * documentation provided in lib/MyToolboxBuildTool.php
 * 
 * the 'params' attribute defines build tool specific process configuration 
 * parameters. for more information on which such process parameters are 
 * available/required, review the documentation provided for the build tool 
 * selected (usually provided in the class header api)
 * @author  Jason Read <jason@idir.org>
 */
class MyToolboxProcess {
  // public attributes
  /**
   * the unique referencing identifier for this process
   * @type string
   */
  var $id;
  
  /**
   * a hash of all of the artifacts associated with this process. this hash is 
   * indexed by the artifact "key"
   * @type MyToolboxArtifact[]
   */
  var $artifacts = array();
  
  /**
   * the unique referencing identifier for this process. this will either be the 
   * process specific $basedir or the project $basedir if a process specific one 
   * was not specified
   * @type string
   */
  var $basedir;
  
  /**
   * the build tool to use for this specific process. this value may be 
   * different from the project build tool if it was overriden in the xml 
   * configuration for this process
   * @type string
   */
  var $buildTool;
  
  /**
   * the params to pass to the $buildTool constructor. this will be a reference 
   * to the project $params UNLESS a different build tool has been specified for 
   * this process in which case it will be a reference to the process params 
   * (when this occurs the $params passed to both the build tool constructor and 
   * to the invokeProcess method will be the same)
   * @type SRA_Params
   */
  var $buildToolParams;
  
  /**
   * the absolute path to the PHP source file containing the $buildTool class
   * @type string
   */
  var $buildToolSrc;
  
  /**
   * the local specific description to use for this process (if applicable)
   * @type string
   */
  var $description;
  
  /**
   * the optional name of an entity that may be used to collect process 
   * invocation parameters, display process related information to the user, and 
   * provide other customization functionality for this process. this entity 
   * will be instantiated and inserted when the invocation is invoked (but 
   * following the display of "view-setup" and setting of the data associated 
   * with that view). if any validation error occur in attempting to insert the 
   * entity instance, these will be displayed to the user and the process 
   * invocation will not be allowed. the following attributes/methods may be 
   * defined for this entity (if the entity instance becomes dirty after any of 
   * these method invocations it will automatically be updated):
   * 
   *   pid : int - when this attribute exists, it will automatically 
   *     be set to the process invocation identifier (the $pid value 
   *     used in conjunction with the build tool method invocations)
   *   
   *   canProcessProcessBeInvoked($id : string, &$msg : string) : boolean - 
   *     invoked prior to the process invocation (but after display 
   *     and processing of "view-setup"), where $id is the 
   *     identifier ("key") of this process. process invocation 
   *     will only be allowed if TRUE is returned. optionally, this 
   *     method may set the $msg parameter to an error message that 
   *     should be displayed to the user when FALSE is returned
   *     
   *   getProcessArtifactRevisionType($id : string) : string - 
   *     this method is invoked after display and processing of 
   *     "view-setup" but prior to display of the revision type 
   *     selection form. if this method exists and returns a valid 
   *     revision type for the artifact identified by $id (the 
   *     artifact "key"), then the user will not be prompted to 
   *     select a revision type for that artifact in the revision 
   *     type seleciton form
   *     
   *   getProcessArtifactPath($id : string, $path : string) : string - 
   *     this method may be used to change the default path for the 
   *     artifact identified by $id (the artifact "key"). the $path 
   *     parameter is the default path. if this method returns NULL 
   *     or an invalid path, $path will be used instead
   *     
   *   getProcessArtifactVersion($id : string, $version : string) : string - 
   *     this method may be used to customize the public version 
   *     identifier for the artifact identified by $id (the artifact 
   *     "key"). the $version parameter is the MyToolbox generated 
   *     public version identifier. if this method returns NULL 
   *     $version will be used instead
   *     
   *   getProcessLabel() : string - by default a process invocation 
   *     label displayed in MyToolbox will be a combination of the 
   *     process name, invoking username, and timestamp. if 
   *     defined, this method may be used to provide a customized 
   *     label to use for the process invocation instead of this 
   *     default value
   *     
   *   getProcessNotify() : string[] - overrides "notify" for this 
   *     process (each value in the return array should adhere to 
   *     the same format described for the "notify" process 
   *     attribute described in the project element above)
   *     
   *   getProcessNotifyArtifact($id : string) : string[] - 
   *     overrides "notify" in the enclosed artifact element 
   *     identified by $id (each value in the return array should 
   *     adhere to the same format described for the "notify" 
   *     process attribute described in the project element above)
   *   
   *   getProcessProjectSetup() : hash - if "project" is specified, 
   *     this method may be used to provide the setup data for that 
   *     project (may cause the project template setup screent to 
   *     be bypassed)
   *     
   *   processEnd($success : boolean, $duration : int, $log : string, $err : string) : void - 
   *     invoked when the build tool invocation ends where $success 
   *     is TRUE if the invocation was successful 
   *     (status==MY_TOOLBOX_BUILD_TOOL_STATUS_SUCCESS), $duration 
   *     is how long the invocation took in milliseconds, $log is 
   *     the return value from the build tool class 
   *     'getProcessResultsLog' method (if applicable), and $err is 
   *     the SRA_Error message (if build tool class instantiation 
   *     or 'invokeProcess'/'getProcessStatus' calls results in an 
   *     SRA_Error object)
   *     
   *   processStart(&$params : SRA_Params, &$env : hash) : void - 
   *     invoked prior to process invocation. $params is the 
   *     'invokeProcess' $params argument. when this value is 
   *     passed by reference (variable name must be preceded with 
   *     & in the build tool class) any changes made to it by this 
   *     method will be maintained through the call to 
   *     'invokeProcess'. the same is true of the $env argument 
   *     which is a hash containing the current environment 
   *     variables that will be set prior to the 'invokeProcess' 
   *     method call
   *     
   *   queryProcessStatus($status : string) : void - invoked each 
   *     time that the 'getProcessStatus' method is invoked (used 
   *     when the process execution is asynchronous). $status is 
   *     the status returned from that invocation
   *     
   *   replaceWithWfEntity(&$wfEntity : object) : void - invoked if 
   *     "project-wf-entity" is specified and the process is 
   *     invoked signifying that this entity will be replaced with 
   *     $wfEntity (this method may perform cleanup tasks such as 
   *     deleting itself from the database or copying data over to 
   *     $wfEntity)
   *     
   *   setProcessArtifact($id : string, $path : string, $fileName : string, $version : string) : void - 
   *     invoked for each enclosed "artifact" where $id is the 
   *     artifact id ("key"), $path is the absolute path (or 
   *     uri) to that artifact, $fileName is the "file-name" for 
   *     the artifact, and $version is the artifact version (if 
   *     applicable). invoked after successful process invocation. 
   *     the artifact file will be deleted from the file system 
   *     after invocation of this method if "delete-original" is 
   *     true for that artifact
   *     
   *   setProcessStatus($status : string) : void - invoked whenever 
   *     the status of the process changes
   *     
   *   setProcessTimeToCompletion($minutes : int) : void - invoked 
   *     if the process execution is asynchronous and the build 
   *     tool class has the method 'getProcessTimeToCompletion' 
   *     which returns a valid time for this process. $minutes will 
   *     be the current time to completion in minutes
   *     
   *   setupProcess($properties : hash) : void - invoked when a 
   *     process is initialized where $properties is a hash with 
   *     the following values:
   *       pid:         the unique process invocation id ($pid)
   *       processId:   the id of the process ("key")
   *       processName: the name of the project
   *       projectName: the name of the project
   *       uid:         the id of the user initializing the process
   * @type string
   */
  var $entity;
  
  /**
   * whether or not to hide this process from users in the MyToolbox interface. 
   * this might be set to true if the process uses only triggers
   * @type boolean
   */
  var $hidden;
  
  /**
   * the local specific name to use for this process. this is the value that 
   * will be displayed in MyToolbox for any process reference
   * @type string
   */
  var $name;
  
  /**
   * space separated list of users, groups and/or email addresses that should be 
   * notified by email whenever this process is initiated. each process "notify" 
   * method will inherit this value unless another is specified. the search 
   * order for values in this attribute will be 1) username, 2) group name, 
   * 3) email address, 4) uid (prefix uids with "u" and 5) gid (prefix gids with 
   * "g"). this value will either be the same as project $notify or different 
   * if a custom notify value has been specified for the process. notifications 
   * will be sent using the creator's email address and name as the from address 
   * and name. instances of this process should use the 'sendNotifications' to 
   * send notifications based on this configuration
   * @type string
   */
  var $notify;
  
  /**
   * smarty template to use for process email notifications. this template will 
   * have access to any of the below $notifySubject values in the form of 
   * smarty variables as well as the following: $projectDescription, 
   * $processDescription, $email (the email address for the notification), $name 
   * (the name for the notification - not available for email recipients) and 
   * $processObj (a reference to the MyToolboxProcessVO instance)
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
   * the locale specific notification subject line to use for this process. for 
   * additional information, see the dtd documentation
   * @type string
   */
  var $notifySubject;
  
  /**
   * any parameters associated with this process including those used by the 
   * build tool
   * @type SRA_Params
   */
  var $params;
  
  /**
   * a hash of all of the sub-processes associated with this process. this hash 
   * is indexed by the process "key"
   * @type MyToolboxProcess[]
   */
  var $processes = array();
  
  /**
   * if invocation of this process is dependent on completion of a workflow or 
   * certain tasks, this attribute may be used to specify the identifier of a 
   * project template that should be used for this purpose. when used, the 
   * process invocation will allow the user to go through the setup process 
   * ($viewSetup & revision types), but will then require the user to create an 
   * instance of and complete this project before the process invocation can 
   * occur
   * @type string
   */
  var $project;
  
  /**
   * if this process can start once a project template task is completed instead 
   * of when the project itself is completed, this attribute may specify the id 
   * of that task (the task "key" in the project template definition)
   * @type string
   */
  var $projectTask;
  
  /**
   * if this process is dependent on a workflow-based project template, and the 
   * "entity" that should be used once the process starts is an entity from the 
   * workflow, this attribute should specify the workflow identifier for that 
   * entity. if the process already has an entity associated with it, that 
   * entity will be replaced with this one (after invocation of the 
   * 'replaceWithWfEntity' method)
   * @type string
   */
  var $projectWfEntity;
  
  /**
   * if this process can start once a project workflow step is completed instead 
   * of when the project itself is completed, this attribute may specify the id 
   * of that step (the step "key" in the workflow definition)
   * @type string
   */
  var $projectWfStep;
  
  /**
   * if a recurring instance of this process fails, setting this attribute to 
   * true will result in the no record of that process being recorded. this 
   * includes both the failed status and if errors occur
   * @type boolean
   */
  var $recurIgnoreFail;
  
  /**
   * processes may be invoked on remote systems. in order to do so, the script 
   * lib/_my-toolbox-remote-process.php MUST be installed on that remote system 
   * and made visible through this uri (where PHP is also enabled for that 
   * script on the Apache web server for that system) accessible from the 
   * primary system (the MyToolbox host). this value should be the uri to that 
   * script. for more information, see the documentation provided in the header 
   * of _my-toolbox-remote-process.php
   * @type string
   */
  var $remoteUri;
  
  /**
   * a reference to the resources to use for this process. these are the same as 
   * the project resources
   * @type SRA_ResourceBundle
   */
  var $resources;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to have access to this process. use the 'canAccess' 
   * method in order to determine whether or not the current user (or another 
   * user) has permission based on these roles
   * @type string
   */
  var $roles;
  
  /**
   * a space separated list of group names or gids one of which a user must be a 
   * member of in order to have access to schedule this process (if $schedule is 
   * true), including recurrence. use the 'canSchedule' method in order to 
   * determine whether or not the current user (or another user) has permission 
   * based on these roles
   * @type string
   */
  var $rolesSchedule;
  
  /**
   * can this process be scheduled by a MyToolbox user?
   * @type boolean
   */
  var $schedule;
  
  /**
   * if $schedule is true, can the user use recurrence in the process schedule 
   * (i.e. schedule to occur every Sunday night at 1AM)
   * @type boolean
   */
  var $scheduleRecur;
  
  /**
   * if $scheduleRecur is true, this attribute may be used to specify the max # 
   * of recurrening schedules that may exist for this process accross all users
   * @type int
   */
  var $scheduleRecurMax;
  
  /**
   * a hash of all of the triggers associated with this process. this hash is 
   * indexed by the trigger "key"
   * @type MyToolboxTrigger[]
   */
  var $triggers = array();
  
  /**
   * if a triggered instance of this process fails, no record of that process 
   * being recorded will result if this attribute is true. this includes both 
   * the failed status and if errors occur
   * @type boolean
   */
  var $triggerIgnoreFail;
  
  /**
   * if $entity is specified, this value may specify a view to display as the 
   * summary for the process when the process invocation results in a system 
   * error
   * @type string
   */
  var $viewError;
  
  // private attributes
  /**
   * uri to a custom icon to use to represent this process (if applicable). this 
   * value will contain the value "{$size}" which should be replaced with the 
   * corresponding desired size (16|32|64) using the "getIcon" method
   * @type string
   */
  var $_icon;
  
  /**
   * a reference to the project that this process pertains to
   * @type MyToolboxProject
   */
  var $_project;
  
  /**
   * a hash of environment variables/values to set prior to process invocation
   * @type hash
   */
  var $_setenv = array();
  
  /**
   * load all properties in this file and environment variables. duplicate 
   * properties specified in "setenv" will override these values. may be 
   * localized
   * @type string
   */
  var $_setenvPropertyfile;
  
  
	// {{{ MyToolboxProcess
	/**
	 * instantiates this object including setting and validating of the attributes
   * included in the xml configuraiton $conf
   * @param mixed $conf the raw xml configuration for this process
   * @access public
	 */
	function MyToolboxProcess($conf, &$project) {
    $this->_project =& $project;
    $this->id = isset($conf['attributes']['key']) ? $conf['attributes']['key'] : NULL;
    if (!$this->id) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - "key" is required', __FILE__, __LINE__);
      return;
    }
    if (!($this->basedir = MyToolboxProject::_getBaseDir($conf['attributes']['basedir'], $project->basedir))) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - basedir "' . $conf['attributes']['basedir'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!($this->buildToolSrc = isset($conf['attributes']['build-tool-src']) ? MyToolboxProject::_getBuildToolSrc($conf['attributes']['build-tool-src'], $this->basedir) : $project->buildToolSrc)) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - build-tool-src "' . $conf['attributes']['build-tool-src'] . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if (!($this->buildTool = isset($conf['attributes']['build-tool-src']) ? MyToolboxProject::_getBuildTool($this->buildToolSrc, $conf['attributes']['build-tool']) : $project->buildTool)) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - build-tool "' . $conf['attributes']['build-tool'] . '" is not a valid class or is not a sub-class of MyToolboxBuildTool', __FILE__, __LINE__);
      return;
    }
    $this->params = new SRA_Params(isset($conf['param']) ? $conf['param'] : NULL);
    $this->buildToolParams = isset($conf['attributes']['build-tool-src']) ? $this->params : $project->params;
    $this->resources =& $project->resources;
    $this->description = isset($conf['attributes']['description']) ? $this->resources->getString($conf['attributes']['description']) : NULL;
    $this->entity = isset($conf['attributes']['entity']) ? $conf['attributes']['entity'] : NULL;
    if ($this->entity && SRA_Error::isError($dao =& SRA_DaoFactory::getDao($this->entity))) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - entity "' . $this->entity . '" is not a valid', __FILE__, __LINE__);
      return;
    }
    $this->hidden = SRA_Util::convertBoolean($conf['attributes']['hidden']);
    $this->_icon = isset($conf['attributes']['icon']) ? $conf['attributes']['icon'] : NULL;
    if ($this->_icon && strpos($this->_icon, '{$size}') === FALSE) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - icon "' . $conf['attributes']['icon'] . '" does not contain required "{$size}" sub-string', __FILE__, __LINE__);
      return;
    }
    $this->name = $this->resources->getString(isset($conf['attributes']['name']) ? $conf['attributes']['name'] : $this->id);
    $this->notify = isset($conf['attributes']['notify']) ? $conf['attributes']['notify'] : $project->notify;
    $this->notifySubject = $this->resources->getString(isset($conf['attributes']['notify-subject']) ? $conf['attributes']['notify-subject'] : $project->notifySubject, array('projectName' => $project->name, 'process' => $this->id, 'processName' => $this->name));
    $this->notifyTpl = isset($conf['attributes']['notify-tpl']) ? $conf['attributes']['notify-tpl'] : $project->notifyTpl;
    $this->notifyTplHtml = isset($conf['attributes']['notify-tpl-html']) ? $conf['attributes']['notify-tpl-html'] : $project->notifyTplHtml;
    if (!SRA_Template::validateTemplate($this->notifyTpl)) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - notify-tpl "' . $this->notifyTpl . '" is not valid', __FILE__, __LINE__);
      return;
    }
    if ($this->notifyTplHtml && !SRA_Template::validateTemplate($this->notifyTplHtml)) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - notify-tpl-html "' . $this->notifyTplHtml . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->project = isset($conf['attributes']['project']) ? $conf['attributes']['project'] : NULL;
    if ($this->project && !($projectTemplate =& MyProjectsTemplate::getAppTemplate($this->project))) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - project "' . $this->project . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->projectTask = $this->project && isset($conf['attributes']['project-task']) ? $conf['attributes']['project-task'] : NULL;
    if ($this->projectTask && !$projectTemplate->isTask($this->projectTask)) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - project-task "' . $this->projectTask . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->projectWfEntity = $this->project && isset($conf['attributes']['project-wf-entity']) ? $conf['attributes']['project-wf-entity'] : NULL;
    $this->projectWfStep = $this->project && isset($conf['attributes']['project-wf-step']) ? $conf['attributes']['project-wf-step'] : NULL;
    if ($this->projectWfEntity || $this->projectWfStep) {
      require_once('workflow/SRA_WorkflowManager.php');
      if (!SRA_Workflow::isValid($wfSetup = SRA_WorkflowManager::getWorkflowSetup($projectTemplate->getWf()))) {
        $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - project-wf-step or project-wf-entity specified, but wf for project ' . $this->project . ' is not valid or does not exist', __FILE__, __LINE__);
        return;
      }
      else if ($this->projectWfStep && !isset($wfSetup->steps[$this->projectWfStep])) {
        $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - project-wf-step "' . $this->projectWfStep . '" is not valid', __FILE__, __LINE__);
        return;
      }
    }
    $this->recurIgnoreFail = SRA_Util::convertBoolean($conf['attributes']['recur-ignore-fail']);
    $this->remoteUri = isset($conf['attributes']['remote-uri']) ? $conf['attributes']['remote-uri'] : NULL;
    if ($this->remoteUri && !($fp = @fopen($this->remoteUri, 'r'))) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - remote-uri "' . $this->remoteUri . '" could not be opened', __FILE__, __LINE__);
      return;
    }
    $this->roles = isset($conf['attributes']['roles']) ? $conf['attributes']['roles'] : NULL;
    $this->schedule = SRA_Util::convertBoolean($conf['attributes']['schedule']);
    $this->rolesSchedule = $this->schedule && isset($conf['attributes']['roles-schedule']) ? $conf['attributes']['roles-schedule'] : NULL;
    $this->scheduleRecur = $this->schedule && SRA_Util::convertBoolean($conf['attributes']['schedule-recur']);
    $this->scheduleRecurMax = $this->schedule && isset($conf['attributes']['schedule-recur-max']) ? $conf['attributes']['schedule-recur-max'] : NULL;
    if (isset($conf['attributes']['setenv'])) {
      $pieces = explode('|', $conf['attributes']['setenv']);
      foreach($pieces as $piece) {
        if ($pos = strpos($piece, '=')) {
          $this->_setenv[substr($piece, 0, $pos)] = substr($piece, $pos+1);
        }
      }
    }
    $this->_setenvPropertyfile = isset($conf['attributes']['setenv-propertyfile']) ? $conf['attributes']['setenv-propertyfile'] : NULL;
    if ($this->_setenvPropertyfile && $this->getEnvVars(TRUE) === NULL) {
      $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - setenv-propertyfile "' . $this->_setenvPropertyfile . '" is not valid', __FILE__, __LINE__);
      return;
    }
    $this->triggerIgnoreFail = SRA_Util::convertBoolean($conf['attributes']['trigger-ignore-fail']);
    if ($dao && (isset($conf['attributes']['view-error']) || isset($conf['attributes']['view-fail']) || isset($conf['attributes']['view-notify']) || isset($conf['attributes']['view-notify-html']) || isset($conf['attributes']['view-pending']) || isset($conf['attributes']['view-setup']) || isset($conf['attributes']['view-success']))) {
      $obj = $dao->newInstance();
      $this->viewError = isset($conf['attributes']['view-error']) ? $conf['attributes']['view-error'] : NULL;
      $this->viewFail = isset($conf['attributes']['view-fail']) ? $conf['attributes']['view-fail'] : NULL;
      $this->viewNotify = isset($conf['attributes']['view-notify']) ? $conf['attributes']['view-notify'] : NULL;
      $this->viewNotifyHtml = isset($conf['attributes']['view-notify-html']) ? $conf['attributes']['view-notify-html'] : NULL;
      $this->viewPending = isset($conf['attributes']['view-pending']) ? $conf['attributes']['view-pending'] : NULL;
      $this->viewSetup = isset($conf['attributes']['view-setup']) ? $conf['attributes']['view-setup'] : NULL;
      $this->viewSuccess = isset($conf['attributes']['view-success']) ? $conf['attributes']['view-success'] : NULL;
      $err = NULL;
      if ($this->viewError && !$obj->hasView($this->viewError)) { $err = 'view-error'; }
      if ($this->viewFail && !$obj->hasView($this->viewFail)) { $err = 'view-fail'; }
      if ($this->viewNotify && !$obj->hasView($this->viewNotify)) { $err = 'view-notify'; }
      if ($this->viewNotifyHtml && !$obj->hasView($this->viewNotifyHtml)) { $err = 'view-notify-html'; }
      if ($this->viewPending && !$obj->hasView($this->viewPending)) { $err = 'view-pending'; }
      if ($this->viewSetup && !$obj->hasView($this->viewSetup)) { $err = 'view-setup'; }
      if ($this->viewSuccess && !$obj->hasView($this->viewSuccess)) { $err = 'view-success'; }
      if ($err) {
        $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - ' . $err . ' "' . $conf['attributes'][$err] . '" is not a valid view for ' . $this->entity, __FILE__, __LINE__);
        return;
      }
    }
    
    // artifacts
    if (isset($conf['artifact'])) {
      $keys = array_keys($conf['artifact']);
      foreach($keys as $key) {
        if (!MyToolboxArtifact::isValid($this->artifacts[$key] = new MyToolboxArtifact($conf['artifact'][$key], $this))) {
          $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - artifact "' . $key . '" is not valid', __FILE__, __LINE__);
          return;
        }
      }
    }
    
    // sub-processes
    if (isset($conf['process'])) {
      $keys = array_keys($conf['process']);
      foreach($keys as $key) {
        if (!MyToolboxProcess::isValid($this->processes[$key] = new MyToolboxProcess($conf['process'][$key], $project))) {
          $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - process "' . $key . '" is not valid', __FILE__, __LINE__);
          return;
        }
      }
    }
    
    // triggers
    if (isset($conf['trigger'])) {
      $keys = array_keys($conf['trigger']);
      foreach($keys as $key) {
        if (!MyToolboxTrigger::isValid($this->triggers[$key] = new MyToolboxTrigger($conf['trigger'][$key], $this))) {
          $this->err = SRA_Error::logError('MyToolboxProcess::MyToolboxProcess: Failed - trigger "' . $key . '" is not valid', __FILE__, __LINE__);
          return;
        }
      }
    }
  }
	// }}}
  
  // {{{ canAccess
	/**
	 * returns TRUE if the current user (or the user identified by $uid) can 
   * access this process based on the $roles defined for it
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
  
  // {{{ canSchedule
	/**
	 * returns TRUE if this process can be scheduled by the current user or by the 
   * user identified by $uid
	 * @param int $uid the id of another user to evaluate. if not specified, the 
   * current active user will be used
	 * @access public
	 * @return boolean
	 */
	function canSchedule($uid=NULL) {
		if ($this->schedule && $this->rolesSchedule && !$uid) {
      global $user;
      if (OsUserVO::isValid($user)) { $uid = $user->getUid(); }
    }
    return $this->schedule ? MyToolboxProject::_canAccess($this->rolesSchedule, $uid) : FALSE;
	}
	// }}}
  
	// {{{ getEnvVars
	/**
	 * 
	 * @param boolean $fileOnly 
	 * @access public
	 * @return hash
	 */
	function getEnvVars($fileOnly=FALSE) {
		$vars = $fileOnly ? array() : $this->_setenv;
    if ($this->_setenvPropertyfile) {
      $src = $this->_setenvPropertyfile;
      if (!file_exists($src) && file_exists($basedir . (SRA_Util::beginsWith($src, '/') ? '' : '/') . $src)) {
        $src = $basedir . (SRA_Util::beginsWith($src, '/') ? '' : '/') . $src;
      }
      if (!SRA_ResourceBundle::isValid($bundle =& SRA_ResourceBundle::getBundle($src))) {
        return NULL;
      }
      foreach($bundle->getData() as $key => $val) {
        if (!isset($vars[$key])) { $vars[$key] = $val; }
      }
    }
    return $vars;
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the uri for the icon (using size $size) to use to represent this 
   * process if one has been specified, NULL otherwise
	 * @param int $size the size of the icon uri to return (16|32|64)
	 * @access public
	 * @return string
	 */
	function getIcon($size=16) {
		return $this->_icon ? str_replace('{$size}', $size, $this->_icon) : NULL;
	}
	// }}}
  
	// {{{ getProcess
	/**
	 * returns the sub-process config in this process for the process identified 
   * by $id
	 * @param string $id the identifier of the process to return (the process 
   * "key")
	 * @access public
	 * @return MyToolboxProcess
	 */
	function &getProcess($id) {
    if ($this->processes) {
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
	}
	// }}}
  
	// {{{ sendNotifications
	/**
	 * used to send the email notifications for an instance of this process
	 * @param MyToolboxProcessVO $process the instance of this process to send the 
   * notifications for
	 * @access public
	 * @return void
	 */
	function sendNotifications(&$process) {
		if ($this->notify) {
      $tpl =& SRA_Controller::getAppTemplate();
      $recipients = MyToolboxProject::_notifyToHash($this->notify);
      foreach($recipients as $email => $name) {
        $tpl->assign('email', $email);
        $tpl->assign('name', $name);
        $tpl->assign('process', $this->id);
        $tpl->assign('processName', $this->name);
        $tpl->assign('processDescription', $this->description);
        $tpl->assign('projectName', $this->_project->name);
        $tpl->assign('projectDescription', $this->_project->description);
        $tpl->assignByRef('processObj', $process);
        $tpl->displayToEmail($email, $this->notifySubject, $this->notifyTpl, $this->notifyTplHtml, $process->getAttribute('creator_email'), $process->getAttribute('creator_name'), $name);
      }
    }
	}
	// }}}
  
  
	// static methods
	
	// {{{ isValid
	/**
	 * this method returns TRUE if an instance of MyToolboxProcess is valid
	 * @param object $object the object to validate
	 * @access public
	 * @return boolean
	 */
	function isValid(&$object) {
		return is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'mytoolboxprocess';
	}
	// }}}
}
// }}}
?>
