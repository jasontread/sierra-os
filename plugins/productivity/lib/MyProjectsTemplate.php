<?php
if (!class_exists('myprojectstemplate') && !class_exists('MyProjectsTemplate')) {
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
require_once('SRAOS_PluginManager.php');
require_once('workflow/SRA_WorkflowManager.php');
// }}}

// {{{ Constants
/**
 * default icon for project templates
 * @type int
 */
define('MY_PROJECTS_TEMPLATE_DEFAULT_ICON', 'plugins/productivity/icons/${size}/my-projects.png');

/**
 * default email participant permissions
 * @type int
 */
define('MY_PROJECTS_TEMPLATE_DEFAULT_EMAIL_PERMISSIONS', 12);

/**
 * default user permissions
 * @type int
 */
define('MY_PROJECTS_TEMPLATE_DEFAULT_PERMISSIONS', 255);

/**
 * default whiteboard height
 * @type int
 */
define('MY_PROJECTS_TEMPLATE_DEFAULT_WHITEBOARD_HEIGHT', 480);

/**
 * default whiteboard width
 * @type int
 */
define('MY_PROJECTS_TEMPLATE_DEFAULT_WHITEBOARD_WIDTH', 640);

/**
 * the date format for the due date
 * @type string
 */
define('MY_PROJECTS_DUE_DATE_FORMAT', 'm/d/Y');

/**
 * the default help resource to use for custom project help entries
 * @type string
 */
define('MY_PROJECTS_TEMPLATE_HELP_RESOURCE', 'MyProjects.templateHelp');
// }}}

// {{{ MyProjectsTemplate
/**
 * represents a single project template as defined in my-projects_1_0.dtd
 * 
 * @author  Jason Read <jason@idir.org>
 */
class MyProjectsTemplate {
  // {{{ attributes
  
  /**
   * the identifier for this project template. this value will be stored in the 
   * "type" attribute for projects created based on this template
   * @type string
   */
  var $_id;
  
  /**
   * the resource identifier for an optional completion confirm message. the 
   * user will be required to read this message and click 'OK' before projects 
   * based on this template can be completed
   * @type string
   */
  var $_completeConfirm;
  
  /**
   * a relative date expression defining the the default due-date for projects 
   * based on this template. for more information, see the 
   * SRA_GregorianDate::fromRelativeStr() api. if a "wf" is defined for the 
   * template, and that workflow has a due date, that due date will take 
   * precedence over the template due date
   * @type SRA_GregorianDate
   */
  var $_dueDate;
  
  /**
   * whether or not the template due-date specified should be fixed. if true, 
   * the user will not be able to change that value. workflow due dates are 
   * always fixed
   * @type boolean
   */
  var $_dueDateFixed;
  
  /**
   * the email participants configuration for this template
   * @type array
   */
  var $_emailParticipantConf;
  
  /**
   * the files configuration for this template
   * @type array
   */
  var $_fileConf;
  
  /**
   * the file categories configuration for this template
   * @type array
   */
  var $_fileCategoryConf;
  
  /**
   * if a help menu entry should be added to MyProjects for this project 
   * template, this attribute should reference the id of that help topic in 
   * _pluginForHelpTopic
   * @type string
   */
  var $_helpTopic;
  
  /**
   * if _helpTopic is specified, this attribute may be used to also specify a 
   * resource to use for the help topic label. if not specified, a default label 
   * "[project template name] Help" will be used
   * @type string
   */
  var $_helpTopicResource;
  
  /**
   * the uri to the icon to use to represent this project template. this icon 
   * must be available in 16, 32, and 64 pixel sizes. this value MUST contain 
   * the substring "${size}" which will be replaced with the correct icon size
   * @type string
   */
  var $_icon;
  
  /**
   * whether or not this project template should be included in the MyProjects 
   * "File -> New" menu
   * @type boolean
   */
  var $_includeNewMenu;
  
  /**
   * the messages configuration for this template
   * @type array
   */
  var $_messageConf;
  
  /**
   * the message categories configuration for this template
   * @type array
   */
  var $_messageCategoryConf;
  
  /**
   * the resource identifier for the default name to assign projects based on 
   * this template. this resource value may reference params from _wfTpl using 
   * the format "${param}"
   * @type string
   */
  var $_name;
  
  /**
   * whether or not to notify users whenever they are assigned to a task. this 
   * includes both the creator of the task (when _strictPermissions is not 
   * true) as well as the user(s) specific through the _changeRestriction. 
   * these users will only be notified once when the task is created, or 
   * whenever re-assignment of the _changeRestriction occurs. the email settings 
   * that will be used for the from address are the same documented in the 
   * MyProjectsManager::retrievePopMessages api. all tasks within this template 
   * will automatically inherit this template configuration unless they specify 
   * another value
   * @type boolean
   */
  var $_notify;
  
  /**
   * if _notify is true, this attribute can be used to define a custom 
   * notification subject resource identifier in _resources. if not specified, 
   * the default 'MyProjectTask.notify.subject' (in the productivity resources 
   * files) will be used. all tasks within this template will automatically 
   * inherit this template configuration unless they specify another value
   * @type string
   */
  var $_notifySubject;
  
  /**
   * if _notify is true, this attribute can be used to define a custom 
   * notification template. this template will have access to the follow smarty 
   * variables: 
   *   email: the email address
   *   name:  the name of the person the email is being sent to
   *   project: a reference to the task project
   *   projectAdmin: a reference to the project administrator user object
   *   resources: a reference to the template resource bundle
   *   task:  a reference to the MyProjectTask object
   *   uid:   if the email is for an actual user of the system, this value will 
   *          be the uid of the user. otherwise (for an email participant), this 
   *          value will be NULL
   * if not specified, the default 
   * 'productivity/tpl/my-projects-task-notification.tpl' template will be used. 
   * all tasks within this template will automatically inherit this template 
   * configuration unless they specify another value
   * @type string
   */
  var $_notifyTpl;
  
  /**
   * if _notify is true, this attribute can be used to define a custom html 
   * notification template. this template will have access to the same smarty 
   * variable as _notifyTpl. if not specified, the default 
   * 'productivity/tpl/my-projects-task-notification-html.tpl' template will be 
   * used. if both _notifyTpl and _notifyTplHtml are specified, most users will 
   * only see the html version of the notification unless they do not have a 
   * multipart/html email client. all tasks within this template will 
   * automatically inherit this template configuration unless they specify 
   * another value
   * @type string
   */
  var $_notifyTplHtml;
  
  /**
   * the participants configuration for this template
   * @type array
   */
  var $_participantConf;
  
  /**
   * the id of the plugin containing _helpTopic and whose resources should be 
   * used for _helpTopicResource
   * @type string
   */
  var $_pluginForHelpTopic;
  
  /**
   * the id of the plugin whose resources should be used for the project labels. 
   * these labels are displayed on the new project wizard and edit project popup 
   * window and include the following (default values below will be used if 
   * resource key is not defined):
   * 
   *  MyProjects.newProject.whatName=What would you like to name this project?
   *  MyProjects.newProject.whatNameHelp=e.g. "Dissertation", "Website Redesign"
   *  MyProject.name=Project Name
   *  MyProjects.newProject.whichParticipants=Who will participate in this project?
   *  MyProjects.newProject.whichParticipantsHelp=Check this box if you want to give other users of INDI the ability to participate in this project. If you don't check this box, only you will have access.
   *  MyProjects.newProject.addParticipants=Give other users/groups access to this project
   *  MyProjects.newProject.otherInfo=Would you like to specify other project information?
   *  MyProjects.newProject.otherInfoHelp=Check this box if you would like to specify additional information such as a project due date and/or summary.
   *  MyProjects.newProject.specifyOtherInfo=Yes, I would like to specify additional project information
   *  MyProjects.newProject.selectParticipantsHelp=Use this section to give other users of INDI the ability to participate in this project and to specify the permissions they should be granted. You may select either individual users or entire groups of users. You only have access to add groups that you are a member of yourself, as well as other members of those groups.
   *  MyProjects.newProject.projectSummary=How would you summarize this project?
   *  MyProjects.newProject.projectSummaryHelp=Use this field to provide a more descriptive project summary. Users will be able to view this summary when working with this project.
   *  MyProjects.newProject.projectDueDate=Would you like to specify a project due date?
   *  MyProjects.newProject.projectDueDateHelp=Use this field to specify a specific date by which this project should be completed. If the project is not completed by this date, it will appear highlighted in the MyProjects Dashboard.
   *  MyProject.dueDate=Due Date
   *  MyProjects.viewProject.archived=Is this project archived?
   *  MyProjects.viewProject.archivedHelp=Archived projects are not included in your default project list
   *  MyProject.archived=Archived?
   *  MyProjects.viewProject.status=What is the status of this project?
   *  MyProjects.viewProject.statusHelp=Only active projects are included in your default project list
   *  MyProject.status=Status
   *  MyProject.fileCategories=File Categories
   *  MyProject.fileCategoriesHelp=What categories would you like to be able to classify files to in this project (for example, "Contracts", "Correspondence")?
   *  MyProject.messageCategories=Message Categories
   *  MyProject.messageCategoriesHelp=What categories would you like to be able to classify messages to in this project (for example, "General Discussion", "Manager Comments")?
   *
   * Only use this attribute IF you want to override 1 or more of the default 
   * values
   * @type string
   */
  var $_pluginForLabels;
  
  /**
   * an optional prefix to use for the label keys above
   * @type string
   */
  var $_pluginLabelsPrefix;
  
  /**
   * the resource bundle associated with this template (if applicable)
   * @type SRA_ResourceBundle
   */
  var $_rb;
  
  /**
   * the path to the resource bundle to use for this project. if not specified, 
   * the app resources will be used
   * @type string
   */
  var $_resources;
  
  /**
   * the resource identifier for the default summary to assign projects based on 
   * this template. this resource value may reference params from _wfTpl using 
   * the format "${param}"
   * @type string
   */
  var $_summary;
  
  /**
   * the tasks configuration for this template
   * @type array
   */
  var $_taskConf;
  
  /**
   * the resource identifier for this template. this value will be used to allow 
   * users to filter search results based on project type, as an option in the 
   * new projects menu, and within the project summary
   * @type string
   */
  var $_type;
  
  /**
   * if this project template should be based on an application workflow, this 
   * value should be the identifier for that workflow as specified in app-config 
   * (the "use-workflow" element). when a project is based on a workflow, tasks 
   * will automatically be created based on the workflow definition and progress
   * @type string
   */
  var $_wf;
  
  /**
   * if wfTpl is used, this attribute may be used to specify a global ajax 
   * service that should be used to validate the data that was provided by the 
   * user and return the data that should be included as the workflow initiation 
   * parameters. this method should return either an error message (this message 
   * will be displayed to the user and they will not be allowed to continue), or 
   * TRUE if the validation was successful and the workflow should be 
   * initialized with the same values from the form, or an array representing 
   * the values that should be used to initialize the workflow
   * @type string
   */
  var $_wfAjaxValidator;
  
  /**
   * whether or not workflow notification files should be attached to the 
   * associated myprojects task. these are files defined using the 
   * "notify-att-*" attributes in the workflow definition only files associated 
   * with interractive tasks will be added
   * @type boolean
   */
  var $_wfAttachFiles;
  
  /**
   * whether or not to send standard MyProjects task notifications for workflow 
   * step generated tasks
   * @type string
   */
  var $_wfNotifyStep;
  
  /**
   * whether or not to send standard MyProjects task notifications for workflow 
   * task generated tasks
   * @type string
   */
  var $_wfNotifyTask;
  
  /**
   * a form template that should be displayed in the first step of the project 
   * creation prompting the user to enter data that will be used by the 
   * workflow. this data will be extracted from the form and used as the 
   * initiation params for the workflow
   * @type string
   */
  var $_wfTpl;
  
  /**
   * an initialization function for wfTpl. this function should be global with 
   * the following signature: "(divId : String) : void" where divId is the base 
   * window div id enclosing wfTpl (any nested elements in this page will have 
   * their id prefixed with this value)
   * @type string
   */
  var $_wfTplInit;
  
  /**
   * if wfTpl is used, this attribute may be used to specify a javascript 
   * function that should be invoked to validate the data. this method should 
   * return true if the data validates successfully, an error message otherwise. 
   * if both wfValidator and wfAjaxValidator are specified, this validator will 
   * be invoked first. this function should have the following signature: 
   * "(params : hash) : mixed"
   * @type string
   */
  var $_wfValidator;
  
  /**
   * template that should be used to display the wf initialization parameters 
   * from _wfTpl in a read-only format. when this template is rendered, the 
   * values for each of the _wfTpl values will be set as template variables. 
   * once a project is created, the _wfTpl form values cannot be changed. this 
   * attribute is required if _wfTpl is specified
   * @type string
   */
  var $_wfViewTpl;
  
  /**
   * the whiteboards configuration for this template
   * @type array
   */
  var $_whiteboardConf;
  
  // }}}
  
  
  // instance methods
  
	// {{{ MyProjectsTemplate
	/**
	 * instantiates a new instance of this class. this method should NOT be 
   * invoked directly. instead, the static MyProjectsTemplate::getTemplates 
   * or MyProjectsTemplate::getTemplate methods should be used
   * @param array $conf the xml configuration data (based on 
   * my-projects_1_0.dtd) for this project template instance
   * @access  private
	 */
	function MyProjectsTemplate(&$conf) {
    // for static invocations
    if ($conf == FALSE) { return; }
    
    $this->_id = $conf['attributes']['key'];
    $this->_dueDate = isset($conf['attributes']['due-date']) ? $conf['attributes']['due-date'] : NULL;
    if ($this->_dueDate && !SRA_GregorianDate::isValid(SRA_GregorianDate::fromRelativeStr($this->_dueDate))) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: Due date is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    $this->_completeConfirm = isset($conf['attributes']['complete-confirm']) ? $conf['attributes']['complete-confirm'] : NULL;
    $this->_dueDateFixed = isset($conf['attributes']['due-date-fixed']) ? $conf['attributes']['due-date-fixed'] == '1' : FALSE;
    $this->_emailParticipantConf = isset($conf['email-participant']) ? $conf['email-participant'] : NULL;
    $this->_fileConf = isset($conf['file']) ? $conf['file'] : NULL;
    $this->_fileCategoryConf = isset($conf['file-category']) ? $conf['file-category'] : NULL;
    $this->_helpTopic = isset($conf['attributes']['help-topic']) ? $conf['attributes']['help-topic'] : NULL;
    $this->_helpTopicResource = isset($conf['attributes']['help-topic-resource']) ? $conf['attributes']['help-topic-resource'] : NULL;
    $this->_icon = isset($conf['attributes']['icon']) ? $conf['attributes']['icon'] : MY_PROJECTS_TEMPLATE_DEFAULT_ICON;
    $this->_includeNewMenu = isset($conf['attributes']['include-new-menu']) ? $conf['attributes']['include-new-menu'] == '1' : TRUE;
    $this->_messageConf = isset($conf['message']) ? $conf['message'] : NULL;
    $this->_messageCategoryConf = isset($conf['message-category']) ? $conf['message-category'] : NULL;
    $this->_name = isset($conf['attributes']['name']) ? $conf['attributes']['name'] : NULL;
    $this->_notify = isset($conf['attributes']['notify']) ? $conf['attributes']['notify'] == '1' : FALSE;
    if ($this->_notify) {
      $this->_notifySubject = isset($conf['attributes']['notify-subject']) ? $conf['attributes']['notify-subject'] : NULL;
      $this->_notifyTpl = isset($conf['attributes']['notify-tpl']) ? $conf['attributes']['notify-tpl'] : NULL;
      $this->_notifyTplHtml = isset($conf['attributes']['notify-tpl-html']) ? $conf['attributes']['notify-tpl-html'] : NULL;
    }
    $this->_participantConf = isset($conf['participant']) ? $conf['participant'] : NULL;
    $this->_pluginForHelpTopic = isset($conf['attributes']['plugin-for-help-topic']) ? $conf['attributes']['plugin-for-help-topic'] : NULL;
    $this->_pluginForLabels = isset($conf['attributes']['plugin-for-labels']) ? $conf['attributes']['plugin-for-labels'] : NULL;
    $this->_pluginLabelsPrefix = isset($conf['attributes']['plugin-labels-prefix']) ? $conf['attributes']['plugin-labels-prefix'] : NULL;
    $this->_resources = isset($conf['attributes']['resources']) ? $conf['attributes']['resources'] : NULL;
    $this->_summary = isset($conf['attributes']['summary']) ? $conf['attributes']['summary'] : NULL;
    $this->_taskConf = isset($conf['task']) ? $conf['task'] : NULL;
    $this->_type = isset($conf['attributes']['type']) ? $conf['attributes']['type'] : NULL;
    $this->_wf = isset($conf['attributes']['wf']) ? $conf['attributes']['wf'] : NULL;
    $this->_wfAjaxValidator = isset($conf['attributes']['wf-ajax-validator']) ? $conf['attributes']['wf-ajax-validator'] : NULL;
    $this->_wfAttachFiles = isset($conf['attributes']['wf-attach-files']) && $conf['attributes']['wf-attach-files'] == '1' ? TRUE : FALSE;
    $this->_wfNotifyStep = isset($conf['attributes']['wf-notify-step']) && $conf['attributes']['wf-notify-step'] == '1' ? TRUE : FALSE;
    $this->_wfNotifyTask = isset($conf['attributes']['wf-notify-task']) && $conf['attributes']['wf-notify-task'] == '1' ? TRUE : FALSE;
    $this->_wfTpl = isset($conf['attributes']['wf-tpl']) ? $conf['attributes']['wf-tpl'] : NULL;
    $this->_wfTplInit = isset($conf['attributes']['wf-tpl-init']) ? $conf['attributes']['wf-tpl-init'] : NULL;
    $this->_wfValidator = isset($conf['attributes']['wf-validator']) ? $conf['attributes']['wf-validator'] : NULL;
    $this->_wfViewTpl = isset($conf['attributes']['wf-view-tpl']) ? $conf['attributes']['wf-view-tpl'] : NULL;
    $this->_whiteboardConf = isset($conf['whiteboard']) ? $conf['whiteboard'] : NULL;
    
    $tpl =& SRA_Controller::getAppTemplate();
    if (!$this->err && $this->_notifyTpl && !$tpl->validate($this->_notifyTpl)) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: notify-tpl "' . $this->_notifyTpl . '" is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    if (!$this->err && $this->_notifyTplHtml && !$tpl->validate($this->_notifyTplHtml)) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: notify-tpl-email "' . $this->_notifyTplHtml . '" is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    
    if (!$this->err && !$this->_type) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: type is required for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    else if ($this->_resources && !SRA_ResourceBundle::isValid($resources =& SRA_ResourceBundle::getBundle($this->_resources))) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: resource bundle is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    else if ($this->_wf && !SRA_Workflow::isValid(SRA_WorkflowManager::getWorkflowSetup($this->_wf))) {
      $this->err =& SRA_Error::logError('MyProjectsTemplate: workflow is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
    }
    else if ($this->_wfTpl) {
      $tpl =& SRA_Controller::getAppTemplate();
      if (!$tpl->validate($this->_wfTpl)) {
        $this->err =& SRA_Error::logError('MyProjectsTemplate: wf-tpl "' . $this->_wfTpl . '" is not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
      }
      if (!$this->_wfViewTpl || !$tpl->validate($this->_wfViewTpl)) {
        $this->err =& SRA_Error::logError('MyProjectsTemplate: wf-view-tpl "' . $this->_wfViewTpl . '" is not specified or not valid for MyProjectsTemplate ' . $this->_id, __FILE__, __LINE__);
      }
    }
    // validate email participant conf
    if (!$this->err && $this->_emailParticipantConf) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $keys = array_keys($this->_emailParticipantConf);
      foreach($keys as $key) {
        if (!isset($this->_emailParticipantConf[$key]['attributes']['permissions'])) { $this->_emailParticipantConf[$key]['attributes']['permissions'] = MY_PROJECTS_TEMPLATE_DEFAULT_EMAIL_PERMISSIONS; }
        $this->_emailParticipantConf[$key]['attributes']['send-intro-email'] = isset($this->_emailParticipantConf[$key]['attributes']['send-intro-email']) && $this->_emailParticipantConf[$key]['attributes']['send-intro-email'] == '1';
        $this->_emailParticipantConf[$key]['attributes']['permissions'] *= 1;
        $permissions = $this->_emailParticipantConf[$key]['attributes']['permissions'];
        if (!isset($this->_emailParticipantConf[$key]['attributes']['email']) || !SRA_AttributeValidator::email($this->_emailParticipantConf[$key]['attributes']['email'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: email specified is not valid in MyProjectsTemplate ' . $this->_id . ' and email participant ' . $key, __FILE__, __LINE__);
        }
        if (!isset($this->_emailParticipantConf[$key]['attributes']['password']) || strlen($this->_emailParticipantConf[$key]['attributes']['password']) < 6) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: password specified is not valid in MyProjectsTemplate ' . $this->_id . ' and email participant ' . $key, __FILE__, __LINE__);
        }
        else if (!($permissions & MY_PROJECT_PERMISSIONS_EMAIL_MAX_PERMISSIONS) || $permissions < 0 || $permissions > MY_PROJECT_PERMISSIONS_EMAIL_MAX_PERMISSIONS) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: permissions ' . $permissions . ' are not valid in MyProjectsTemplate ' . $this->_id . ' and email participant ' . $key, __FILE__, __LINE__);
        }
      }
    }
    // validate file conf
    if (!$this->err && $this->_fileConf) {
      $keys = array_keys($this->_fileConf);
      foreach($keys as $key) {
        if (!isset($this->_fileConf[$key]['attributes']['name']) || !isset($this->_fileConf[$key]['attributes']['path'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: name and path must be specified in MyProjectsTemplate ' . $this->_id . ' and file ' . $key, __FILE__, __LINE__);
        }
        else if (!isset($this->_fileConf[$key]['attributes']['wf-step']) && !SRA_File::getRelativePath(NULL, $this->_fileConf[$key]['attributes']['path'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: file path "' . $this->_fileConf[$key]['attributes']['path']. '" is not valid in MyProjectsTemplate ' . $this->_id . ' and file ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_fileConf[$key]['attributes']['category']) && !isset($this->_fileCategoryConf[$this->_fileConf[$key]['attributes']['category']])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: category is not valid in MyProjectsTemplate ' . $this->_id . ' and file ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_fileConf[$key]['attributes']['change-restriction']) && !isset($this->_participantConf[$this->_fileConf[$key]['attributes']['change-restriction']])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: change-restriction is not valid in MyProjectsTemplate ' . $this->_id . ' and file ' . $key, __FILE__, __LINE__);
        }
      }
    }
    // validate file categories
    if (!$this->err && $this->_fileCategoryConf) {
      $keys = array_keys($this->_fileCategoryConf);
      foreach($keys as $key) {
        if (!isset($this->_fileCategoryConf[$key]['attributes']['name'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: name must be specified in MyProjectsTemplate ' . $this->_id . ' and file category ' . $key, __FILE__, __LINE__);
        }
      }
    }
    // validate message conf
    if (!$this->err && $this->_messageConf) {
      $keys = array_keys($this->_messageConf);
      foreach($keys as $key) {
        if (!isset($this->_messageConf[$key]['attributes']['message']) || !isset($this->_messageConf[$key]['attributes']['title'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: message and title must be specified in MyProjectsTemplate ' . $this->_id . ' and message ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_messageConf[$key]['attributes']['category']) && !isset($this->_messageCategoryConf[$this->_messageConf[$key]['attributes']['category']])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: category is not valid in MyProjectsTemplate ' . $this->_id . ' and message ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_messageConf[$key]['attributes']['files'])) {
          foreach(explode(' ', $this->_messageConf[$key]['attributes']['files']) as $file) {
            if (!isset($this->_fileConf[$file])) {
              $this->err =& SRA_Error::logError('MyProjectsTemplate: file "' . $file . '" is not valid in MyProjectsTemplate ' . $this->_id . ' and message ' . $key, __FILE__, __LINE__);
              break;
            }
          }
        }
      }
    }
    // validate message categories
    if (!$this->err && $this->_messageCategoryConf) {
      $keys = array_keys($this->_messageCategoryConf);
      foreach($keys as $key) {
        if (!isset($this->_messageCategoryConf[$key]['attributes']['name'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: name must be specified in MyProjectsTemplate ' . $this->_id . ' and message category ' . $key, __FILE__, __LINE__);
        }
      }
    }
    // validate participant conf
    if (!$this->err && $this->_participantConf) {
      $keys = array_keys($this->_participantConf);
      foreach($keys as $key) {
        $this->_participantConf[$key]['attributes']['group'] = isset($this->_participantConf[$key]['attributes']['group']) && $this->_participantConf[$key]['attributes']['group'] == '1';
        $this->_participantConf[$key]['attributes']['send-intro-email'] = isset($this->_participantConf[$key]['attributes']['send-intro-email']) && $this->_participantConf[$key]['attributes']['send-intro-email'] == '1';
        if (!isset($this->_participantConf[$key]['attributes']['permissions'])) { $this->_participantConf[$key]['attributes']['permissions'] = MY_PROJECTS_TEMPLATE_DEFAULT_PERMISSIONS; }
        $this->_participantConf[$key]['attributes']['permissions'] *= 1;
        $permissions = $this->_participantConf[$key]['attributes']['permissions'];
        if (!isset($this->_participantConf[$key]['attributes']['id'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: id must be specified in MyProjectsTemplate ' . $this->_id . ' and participant ' . $key, __FILE__, __LINE__);
        }
        else if ($this->_participantConf[$key]['attributes']['id']) {
          $dao =& SRA_DaoFactory::getDao($this->_participantConf[$key]['attributes']['group'] ? 'OsGroup' : 'OsUser');
          if (SRA_Error::isError($dao->findByPk($this->_participantConf[$key]['attributes']['id']))) {
            $this->err =& SRA_Error::logError('MyProjectsTemplate: id specified ' . $this->_participantConf[$key]['attributes']['id'] . ' is not valid in MyProjectsTemplate ' . $this->_id . ' and participant ' . $key, __FILE__, __LINE__);
          }
        }
        else if (!($permissions & MY_PROJECT_PERMISSIONS_ADMIN) || $permissions < 0 || $permissions > MY_PROJECT_PERMISSIONS_ADMIN) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: permissions ' . $permissions . ' are not valid in MyProjectsTemplate ' . $this->_id . ' and participant ' . $key, __FILE__, __LINE__);
        }
      }
    }
    // validate tasks
    if (!$this->err && $this->_taskConf) {
      $keys = array_keys($this->_taskConf);
      foreach($keys as $key) {
        $this->_taskConf[$key]['attributes']['change-restriction-email'] = isset($this->_taskConf[$key]['attributes']['change-restriction-email']) && $this->_taskConf[$key]['attributes']['change-restriction-email'] == '1';
        $this->_taskConf[$key]['attributes']['list'] = isset($this->_taskConf[$key]['attributes']['list']) && $this->_taskConf[$key]['attributes']['list'] == '1';
        $this->_taskConf[$key]['attributes']['read-only'] = isset($this->_taskConf[$key]['attributes']['read-only']) && $this->_taskConf[$key]['attributes']['read-only'] == '1';
        
        $cr = isset($this->_taskConf[$key]['attributes']['change-restriction']) ? $this->_taskConf[$key]['attributes']['change-restriction'] : NULL;
        $cre = $this->_taskConf[$key]['attributes']['change-restriction-email'];
        
        $this->_taskConf[$key]['attributes']['strict-permissions'] = $cr && isset($this->_taskConf[$key]['attributes']['strict-permissions']) && $this->_taskConf[$key]['attributes']['strict-permissions'] == '1';
        
        if (!isset($this->_taskConf[$key]['attributes']['title'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: title must be specified in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
        }
        else if ($cr && ((!$cre && !isset($this->_participantConf[$cr])) || ($cre && !isset($this->_emailParticipantConf[$cr])))) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: change-restriction is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
        }
        if (!$this->err && isset($this->_taskConf[$key]['attributes']['files'])) {
          foreach(explode(' ', $this->_taskConf[$key]['attributes']['files']) as $file) {
            if (!isset($this->_fileConf[$file])) {
              $this->err =& SRA_Error::logError('MyProjectsTemplate: file "' . $file . '" is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
              break;
            }
          }
        }
        if (!$this->err && $this->_taskConf[$key]['attributes']['list'] && !count($this->_taskConf[$key]['task'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: list tasks must have 1 or more sub-tasks in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
          break;
        }
        if (!$this->err && isset($this->_taskConf[$key]['attributes']['messages'])) {
          foreach(explode(' ', $this->_taskConf[$key]['attributes']['messages']) as $message) {
            if (!isset($this->_messageConf[$message])) {
              $this->err =& SRA_Error::logError('MyProjectsTemplate: message "' . $message . '" is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
              break;
            }
          }
        }
        if (!$this->err && $this->_taskConf[$key]['attributes']['notify-tpl'] && !$tpl->validate($this->_taskConf[$key]['attributes']['notify-tpl'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: notify-tpl is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
        }
        if (!$this->err && $this->_taskConf[$key]['attributes']['notify-tpl-html'] && !$tpl->validate($this->_taskConf[$key]['attributes']['notify-tpl-html'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: notify-tpl-html is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
        }
        if (!$this->err && isset($this->_taskConf[$key]['attributes']['whiteboards'])) {
          foreach(explode(' ', $this->_taskConf[$key]['attributes']['whiteboards']) as $whiteboard) {
            if (!isset($this->_whiteboardConf[$whiteboard])) {
              $this->err =& SRA_Error::logError('MyProjectsTemplate: whiteboard "' . $whiteboard . '" is not valid in MyProjectsTemplate ' . $this->_id . ' and task ' . $key, __FILE__, __LINE__);
              break;
            }
          }
        }
      }
    }
    // validate whiteboards
    if (!$this->err && $this->_whiteboardConf) {
      $keys = array_keys($this->_whiteboardConf);
      foreach($keys as $key) {
        if (!isset($this->_whiteboardConf[$key]['attributes']['height'])) { $this->_whiteboardConf[$key]['attributes']['height'] = MY_PROJECTS_TEMPLATE_DEFAULT_WHITEBOARD_HEIGHT; }
        if (!isset($this->_whiteboardConf[$key]['attributes']['width'])) { $this->_whiteboardConf[$key]['attributes']['width'] = MY_PROJECTS_TEMPLATE_DEFAULT_WHITEBOARD_WIDTH; }
        
        if (!isset($this->_whiteboardConf[$key]['attributes']['title'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: title must be specified in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_whiteboardConf[$key]['attributes']['change-restriction']) && !isset($this->_whiteboardConf[$this->_whiteboardConf[$key]['attributes']['change-restriction']])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: change-restriction is not valid in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
        else if ($this->_whiteboardConf[$key]['attributes']['height'] < 100 || $this->_whiteboardConf[$key]['attributes']['height'] > 1200) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: height ' . $this->_whiteboardConf[$key]['attributes']['height'] . ', must be between 100 and 1200 in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
        else if ($this->_whiteboardConf[$key]['attributes']['width'] < 100 || $this->_whiteboardConf[$key]['attributes']['width'] > 1600) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: width ' . $this->_whiteboardConf[$key]['attributes']['width']. ', must be between 100 and 1600 in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_whiteboardConf[$key]['attributes']['init-bg-path']) && !SRA_File::getRelativePath(NULL, $this->_whiteboardConf[$key]['attributes']['init-bg-path'])) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: init-bg-path "' . $this->_whiteboardConf[$key]['attributes']['init-bg-path']. '" is not valid in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
        else if (isset($this->_whiteboardConf[$key]['attributes']['init-bg-path']) && !SRA_Util::endsWith(strtolower($this->_whiteboardConf[$key]['attributes']['init-bg-path']), '.png')) {
          $this->err =& SRA_Error::logError('MyProjectsTemplate: init-bg must be a PNG image in MyProjectsTemplate ' . $this->_id . ' and whiteboard ' . $key, __FILE__, __LINE__);
        }
      }
    }
    
  }
  // }}}
  
	// {{{ getId
	/**
	 * returns the identifier of this project template
	 * @access public
	 * @return	string
	 */
	function getId() {
    return $this->_id;
	}
	// }}}
  
	// {{{ getCompleteConfirm
	/**
	 * returns the localized complete confirm message for this project template
	 * @access public
	 * @return	string
	 */
	function getCompleteConfirm() {
    $rb =& $this->getRb();
    return $this->_completeConfirm && $rb ? $rb->getString($this->_completeConfirm) : $this->_completeConfirm;
	}
	// }}}
  
	// {{{ getDueDate
	/**
	 * returns the due date for this project template. this is either the due date 
   * defined for the template, or the due date of the template workflow (if 
   * applicable) or NULL if no due date is specified for the template. workflow 
   * due dates take precedence over template due dates
	 * @access public
	 * @return	string
	 */
	function getDueDate() {
    return $this->_wf && SRA_Workflow::isValid($wf =& SRA_WorkflowManager::getWorkflowSetup($this->_wf)) && $wf->dueDate ? $wf->dueDate : $this->_dueDate;
	}
	// }}}
  
	// {{{ getEmailParticipants
	/**
	 * returns an array of hashes with the following keys: 
   *  email:       the participant email address
   *  comments:    whether or not this participant can add comments
   *  name:        the participants name
   * returns NULL if there are no email participants defined for the project 
   * template
	 * @access public
	 * @return	array
	 */
	function getEmailParticipants() {
    if ($this->_emailParticipantConf) {
      $participants = array();
      $keys = array_keys($this->_emailParticipantConf);
      foreach($keys as $key) {
        $participants[] = array('email' => $this->_emailParticipantConf[$key]['attributes']['email'], 'name' => $this->_emailParticipantConf[$key]['attributes']['name'], 'password' => $this->_emailParticipantConf[$key]['attributes']['password'], 'permissions' => $this->_emailParticipantConf[$key]['attributes']['permissions'], 'sendIntroEmail' => $this->_participantConf[$key]['attributes']['send-intro-email']);
      }
      return $participants;
    }
    else {
      return NULL;
    }
	}
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the _helpTopic attribute value
	 * @access public
	 * @return	string
	 */
	function getHelpTopic() {
    return $this->_helpTopic;
	}
	// }}}
  
	// {{{ getHelpTopicLabel
	/**
	 * returns the label to use to represent _helpTopic in the MyProjects help 
   * menu
	 * @access public
	 * @return	string
	 */
	function getHelpTopicLabel() {
    if ($this->_helpTopicResource && $this->_pluginForHelpTopic && SRAOS_Plugin::isValid($plugin =& SRAOS_PluginManager::getPlugin($this->_pluginForHelpTopic)) && $plugin->resources->containsKey($this->_helpTopicResource)) {
      return $plugin->resources->getString($this->_helpTopicResource);
    }
    else {
      $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      return $resources->getString(MY_PROJECTS_TEMPLATE_HELP_RESOURCE, array('template' => $this->getType()));
    }
	}
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the uri to the icon of the specified size. if $size is not 
   * specified, the size token ${size} will be left in the uri string
   * @param int $size the size of the icon to return the uri for (16|32|64)
	 * @access public
	 * @return	string
	 */
	function getIcon($size=NULL) {
    return $size ? str_replace('${size}', $size, $this->_icon) : $this->_icon;
	}
	// }}}
  
	// {{{ getName
	/**
	 * returns the localized name for this project template
   * @param array $params an optional hash of parameters to substitute in the 
   * name. for example, if the default template name was 'Taxes for ${year}' 
   * and $params contained a key value 'year' = 2007, the returned value would 
   * be 'Taxes for 2007'
	 * @access public
	 * @return	string
	 */
	function getName($params=NULL) {
    $rb =& $this->getRb();
    $name = $this->_name && $rb ? $rb->getString($this->_name) : $this->_name;
    if ($params) { $name = SRA_Util::substituteParams($name, $params); }
    return $name;
	}
	// }}}
  
	// {{{ getNotifySubject
	/**
	 * returns the _notifySubject attribute value
	 * @access public
	 * @return	string
	 */
	function getNotifySubject() {
    return $this->_notifySubject;
	}
	// }}}
  
	// {{{ getNotifyTpl
	/**
	 * returns the _notifyTpl attribute value
	 * @access public
	 * @return	string
	 */
	function getNotifyTpl() {
    return $this->_notifyTpl;
	}
	// }}}
  
	// {{{ getNotifyTplHtml
	/**
	 * returns the _notifyTplHtml attribute value
	 * @access public
	 * @return	string
	 */
	function getNotifyTplHtml() {
    return $this->_notifyTplHtml;
	}
	// }}}
  
	// {{{ getParticipants
	/**
	 * returns an array of hashes with the following keys: 
   *  id:          the participant id
   *  group:       whether or not the participant is a group
   *  permissions: the participant permissions
   * returns NULL if there are no participants defined for the project template
	 * @access public
	 * @return	array
	 */
	function getParticipants() {
    if ($this->_participantConf) {
      $participants = array();
      $keys = array_keys($this->_participantConf);
      foreach($keys as $key) {
        $participants[] = array('id' => $this->_participantConf[$key]['attributes']['id'], 'group' => $this->_participantConf[$key]['attributes']['group'], 'permissions' => $this->_participantConf[$key]['attributes']['permissions'], 'sendIntroEmail' => $this->_participantConf[$key]['attributes']['send-intro-email']);
      }
      return $participants;
    }
    else {
      return NULL;
    }
	}
	// }}}
  
	// {{{ getPluginForHelpTopic
	/**
	 * returns the _pluginForHelpTopic attribute value
	 * @access public
	 * @return	string
	 */
	function getPluginForHelpTopic() {
    return $this->_pluginForHelpTopic;
	}
	// }}}
  
	// {{{ getPluginForLabels
	/**
	 * returns the _pluginForLabels attribute value
	 * @access public
	 * @return	string
	 */
	function getPluginForLabels() {
    return $this->_pluginForLabels;
	}
	// }}}
  
	// {{{ getPluginLabelsPrefix
	/**
	 * returns the _pluginLabelsPrefix attribute value
	 * @access public
	 * @return	string
	 */
	function getPluginLabelsPrefix() {
    return $this->_pluginLabelsPrefix;
	}
	// }}}
  
	// {{{ getRb
	/**
	 * returns the resource bundle associated with this template (if applicable)
	 * @access public
	 * @return	SRA_ResourceBundle
	 */
	function &getRb() {
    if (($this->_wf || $this->_resources) && !isset($this->_rb)) {
      if ($this->_wf) {
        $wf =& SRA_WorkflowManager::getWorkflowSetup($this->_wf);
        $this->_rb =& $wf->resources;
      }
      else {
        $this->_rb =& SRA_ResourceBundle::getBundle($this->_resources);
      }
    }
    return $this->_rb;
	}
	// }}}
  
	// {{{ getSummary
	/**
	 * returns the localized summary string for this project template
	 * @access public
	 * @return	string
	 */
	function getSummary() {
    $rb =& $this->getRb();
    return $this->_summary && $rb ? $rb->getString($this->_summary) : $this->_summary;
	}
	// }}}
  
	// {{{ getType
	/**
	 * returns the localized type string for this project template
   * @param boolean $escapeSingleQuotes whether or not to escape single quotes
	 * @access public
	 * @return	string
	 */
	function getType($escapeSingleQuotes) {
    $rb =& $this->getRb();
    $type = $rb ? $rb->getString($this->_type) : $this->_type;
    if ($escapeSingleQuotes) { $type = str_replace("'", "\\'", $type); }
    return $type;
	}
	// }}}
  
	// {{{ getWf
	/**
	 * returns the value of _wf
	 * @access public
	 * @return	string
	 */
	function getWf() {
    return $this->_wf;
	}
	// }}}
  
	// {{{ getWfViewTpl
	/**
	 * returns the value of _wfViewTpl
	 * @access public
	 * @return	string
	 */
	function getWfViewTpl() {
    return $this->_wfViewTpl;
	}
	// }}}
  
	// {{{ initializeProject
	/**
	 * initializes a project based on the project template details
   * @param MyProjectVO $project the project to initialize
	 * @access public
	 * @return void
	 */
	function initializeProject(&$project) {
    $rb =& $this->getRb();
    
    // complete confirm
    if ($this->_completeConfirm) {
      $project->setCompleteConfirm($this->_completeConfirm);
      $update = TRUE;
    }
    
    // due date
    if ((!$project->getDueDate() || $this->_dueDateFixed) && ($dueDate = $this->getDueDate())) {
      $project->setDueDate(SRA_GregorianDate::fromRelativeStr($dueDate));
      $project->setDueDateFixed($this->_dueDateFixed);
      $update = TRUE;
    }
    
    
    // file categories
    $fileCategories = array();
    if ($this->_fileCategoryConf) {
      $dao =& SRA_DaoFactory::getDao('MyProjectFileCategory');
      $keys = array_keys($this->_fileCategoryConf);
      foreach($keys as $key) {
        $fileCategories[$key] =& $dao->newInstance();
        $fileCategories[$key]->setName($rb ? $rb->getString($this->_fileCategoryConf[$key]['attributes']['name']) : $this->_fileCategoryConf[$key]['attributes']['name']);
        $fileCategories[$key]->setProjectId($project->getProjectId());
        $fileCategories[$key]->insert();
      }
    }
    
    
    // files
    $files = array();
    if ($this->_fileConf) {
      $keys = array_keys($this->_fileConf);
      foreach($keys as $key) {
        if (!isset($this->_fileConf[$key]['attributes']['wf-step'])) { $files[$key] =& $this->_addFile($project, $this->_fileConf[$key]); }
      }
    }
    
    
    // message categories
    $messageCategories = array();
    if ($this->_messageCategoryConf) {
      $dao =& SRA_DaoFactory::getDao('MyProjectMessageCategory');
      $keys = array_keys($this->_messageCategoryConf);
      foreach($keys as $key) {
        $messageCategories[$key] =& $dao->newInstance();
        $messageCategories[$key]->setName($rb ? $rb->getString($this->_messageCategoryConf[$key]['attributes']['name']) : $this->_messageCategoryConf[$key]['attributes']['name']);
        $messageCategories[$key]->setProjectId($project->getProjectId());
        $messageCategories[$key]->insert();
      }
    }
    
    
    // messages
    $messages = array();
    if ($this->_messageConf) {
      $keys = array_keys($this->_messageConf);
      foreach($keys as $key) {
        if (!isset($this->_messageConf[$key]['attributes']['wf-step'])) { $messages[$key] =& $this->_addMessage($project, $this->_messageConf[$key], $files); }
      }
    }
    
    
    // notifications
    if ($this->isNotify()) {
      if ($this->getNotifySubject()) { $project->setNotifySubject($this->getNotifySubject()); }
      if ($this->getNotifyTpl()) { $project->setNotifyTpl($this->getNotifyTpl()); }
      if ($this->getNotifyTplHtml()) { $project->setNotifyTplHtml($this->getNotifyTplHtml()); }
      $update = TRUE;
    }
    
    if ($update) { $project->update(); }
    
    
    // whiteboards
    $whiteboards = array();
    if ($this->_whiteboardConf) {
      $keys = array_keys($this->_whiteboardConf);
      foreach($keys as $key) {
        if (!isset($this->_whiteboardConf[$key]['attributes']['wf-step'])) { $whiteboards[$key] =& $this->_addWhiteboard($project, $this->_whiteboardConf[$key]); }
      }
    }
    
    
    // tasks
    $nl = NULL;
    MyProjectsTemplate::_initializeTasks($project, $this->_taskConf, $nl, $nl, $files, $messages, $whiteboards, $this->isNotify());
    
    
    // workflow
    if ($this->_wf && !SRA_Error::isError($wf =& SRA_WorkflowManager::initializeWorkflow($this->_wf, $project->getWfParams() ? unserialize($project->getWfParams()) : NULL))) {
      $wf->start();
      $project->setWfId($wf->getWorkflowId());
      $project->update();
      MyProjectsTemplate::syncWfTasks($project, $nl);
    }
    
	}
	// }}}
  
	// {{{ isDueDateFixed
	/**
	 * returns TRUE if the due date for this template is fixed. this occurs when 
   * "dueDateFixed" is TRUE, or if the template references a workflow that has 
   * a due date
	 * @access public
	 * @return	boolean
	 */
	function isDueDateFixed() {
    return $this->_wf && SRA_Workflow::isValid($wf =& SRA_WorkflowManager::getWorkflowSetup($this->_wf)) && $wf->dueDate ? TRUE : $this->_dueDateFixed;
	}
	// }}}
  
	// {{{ isNotify
	/**
	 * returns the _notify attribute value
	 * @access public
	 * @return	string
	 */
	function isNotify() {
    return $this->_notify;
	}
	// }}}
  
	// {{{ isTask
	/**
	 * returns TRUE if the task identified by $id is valid
   * @param string $id the id of the task (the task "key") to evaluate
	 * @access public
	 * @return	string
	 */
	function isTask($id) {
    return isset($this->_taskConf) && isset($this->_taskConf[$id]) ? TRUE : FALSE;
	}
	// }}}
  
	// {{{ isWfAttachFiles
	/**
	 * returns the _wfAttachFiles attribute value
	 * @access public
	 * @return	string
	 */
	function isWfAttachFiles() {
    return $this->_wfAttachFiles;
	}
	// }}}
  
	// {{{ isWfNotifyStep
	/**
	 * returns the _wfNotifyStep attribute value
	 * @access public
	 * @return	string
	 */
	function isWfNotifyStep() {
    return $this->_wfNotifyStep;
	}
	// }}}
  
	// {{{ isWfNotifyTask
	/**
	 * returns the _wfNotifyTask attribute value
	 * @access public
	 * @return	string
	 */
	function isWfNotifyTask() {
    return $this->_wfNotifyTask;
	}
	// }}}
  
  
	// Static methods
  
	// {{{ ajaxGetProjectTemplate
	/**
	 * ajax service method used to retrieve a project template and the relevant 
   * data associated with that template. the return value will be an associative 
   * array with the following keys:
   *  id:              the template id
   *  dueDate:         the due date for this project
   *  dueDateFixed:    whether or not the due date should be fixed
   *  emailParticipants: array of hashes with the following keys:
   *                   email:   the participant email address
   *                   comments:whether or not this participant can add comments
   *                   name:    the participants name
   *  icon16:          the 16 pixel icon uri for this project template
   *  icon32:          the 32 pixel icon uri for this project template
   *  icon64:          the 64 pixel icon uri for this project template
   *  name:            the default project name ("${param}" should be 
   *                   substituted)
   *  notify:          whether or not to send task assignment notifications
   *  participants:    array of hashes with the following keys: 
   *                   id:          the participant id
   *                   group:       whether or not the participant is a group
   *                   permissions: the participant permissions
   *  pluginForLabels  the id of the plugin whose resources should be used to 
   *                   override the default project labels (see _pluginForLabels 
   *                   api comments above)
   *  pluginLabelsPrefix an optional prefix to use for the label keys above
   *  summary:         the default project summary ("${param}" should be 
   *                   substituted)
   *  type:            the localized project type
   *  wfAjaxValidator: if the template is based on a workflow and uses 
   *                   initiation params, this is the name of the global ajax  
   *                   service that will validate those parameeters
   *  wfStart:         the xhtml for the params screen of this template. this is 
   *                   the first screen displayed to the user when a project 
   *                   based on the template is created
   *  wfStartInit:     a static javascript function that should be invoked to 
   *                   initialize wfStart
   *  wfValidator:     same as wfAjaxValidator, but used to apply synchronous 
   *                   client-side javascript validation
   *  
   * @param array $params contains a single value: 'id' which is the identifier 
   * of the project template to return. if this id is not valid, an error will 
   * be returned (ajax response code SRA_AJAX_GATEWAY_STATUS_FAILED)
	 * @access public
	 * @return	array
	 */
	function &ajaxGetProjectTemplate($params) {
    global $user;
    if (OsUserVO::isValid($user) && isset($params['id']) && MyProjectsTemplate::isValid($template =& MyProjectsTemplate::getAppTemplate($params['id']))) {
      $hash = array();
      $hash['id'] = $template->getId();
      if ($dueDate = $template->getDueDate()) {
        $dueDate = SRA_GregorianDate::fromRelativeStr($dueDate);
        $hash['dueDate'] = $dueDate->format(MY_PROJECTS_DUE_DATE_FORMAT);
        $hash['dueDateFixed'] = $template->isDueDateFixed();
      }
      $hash['emailParticipants'] = $template->getEmailParticipants();
      $hash['icon16'] = $template->getIcon(16);
      $hash['icon32'] = $template->getIcon(32);
      $hash['icon64'] = $template->getIcon(64);
      $hash['name'] = $template->getName();
      $hash['participants'] = $template->getParticipants();
      $hash['pluginForLabels'] = $template->getPluginForLabels();
      $hash['pluginLabelsPrefix'] = $template->getPluginLabelsPrefix();
      $hash['summary'] = $template->getSummary();
      $hash['type'] = $template->getType();
      if ($template->_wfTpl) {
        $tpl =& SRA_Controller::getAppTemplate();
        $hash['wfAjaxValidator'] = $template->_wfAjaxValidator;
        $hash['wfStart'] = $tpl->fetch($template->_wfTpl);
        $hash['wfStartInit'] = $template->_wfTplInit;
        $hash['wfValidator'] = $template->_wfValidator;
      }
      return $hash;
    }
    else {
      return SRA_Error::logError('MyProjectsTemplate::ajaxGetProjectTemplate: id param invalid or not specified (or no global $user) - ' . $params['id'], __FILE__, __LINE__);
    }
	}
	// }}}
  
	// {{{ getAppTemplate
	/**
	 * returns the MyProjectsTemplate specified by $id
   * @param  string $id the id of the template to return. all of the app 
   * template configurations will be searched
	 * @access public
	 * @return	MyProjectsTemplate
	 */
	function &getAppTemplate($id) {
		$templates =& MyProjectsTemplate::getAppTemplates();
    $nl = NULL;
    return isset($templates[$id]) ? $templates[$id] : $nl;
	}
	// }}}
  
	// {{{ getAppTemplates
	/**
	 * returns all of the valid MyProjectsTemplate objects associated with the 
   * current running application. this is based on the template configurations 
   * specified for the application in the app-config using the "param" element 
   * where the type is "my-projects" and the id is the app "/etc" relative path 
   * to the xml file (or absolute path). the array returned will be indexed by 
   * template identifier
	 * @access public
	 * @return	MyProjectsTemplate[]
	 */
	function &getAppTemplates() {
    static $_templates = array();
    if (SRA_Controller::getCurrentAppId() && !isset($_templates[SRA_Controller::getCurrentAppId()])) {
      $_templates[SRA_Controller::getCurrentAppId()] = array();
      if ($templateConfs = SRA_Controller::getAppParams(NULL, 'my-projects')) {
        foreach(array_keys($templateConfs) as $conf) {
          if ((($file = SRA_File::getRelativePath('etc', $conf)) || ($file = SRA_File::getRelativePath(NULL, $conf))) && !SRA_Error::isError($templates =& MyProjectsTemplate::_getTemplates($file))) {
            $keys = array_keys($templates);
            foreach($keys as $key) {
              $_templates[SRA_Controller::getCurrentAppId()][$key] =& $templates[$key];
            }
          }
        }
      }
    }
    return $_templates[SRA_Controller::getCurrentAppId()];
	}
	// }}}
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a MyProjectsTemplate object.
	 * @param  Object $object The object to validate
	 * @access public
	 * @return	boolean
	 */
	function isValid(&$object) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'myprojectstemplate');
	}
	// }}}
  
	// {{{ syncWfTasks
	/**
	 * synchronizes workflow tasks generated for the project specified
   * @param mixed $projectId the identifier of the project to synchronize the 
   * tasks for or the actual MyProjectVO instance
   * @param MyProjectTaskVO $predecessor an optional predecessor task
	 * @access public
	 * @return void
	 */
	function syncWfTasks(&$projectId, &$predecessor) {
    MyProjectVO::isValid($projectId) ? $project =& $projectId : $projectDao =& SRA_DaoFactory::getDao('MyProject');
    $wfDao =& SRA_DaoFactory::getDao('SraWorkflow');
    if ((MyProjectVO::isValid($project) || MyProjectVO::isValid($project =& $projectDao->findByPk($projectId))) && $project->getWfId() && SraWorkflowVO::isValid($workflow =& $wfDao->findByPk($project->getWfId()))) {
      
      // first synchronize workflow tasks
      $tasks =& $workflow->getTasks();
      $keys = array_keys($tasks);
      $nl = NULL;
      foreach($keys as $key) {
        MyProjectsTemplate::_syncWfTask($tasks[$key], $project, $nl, $predecessor);
      }
      
      // next synchronize workflow steps (task groups)
      $steps =& $workflow->getSteps();
      $keys = array_keys($steps);
      foreach($keys as $key) {
        MyProjectsTemplate::_syncWfStep($steps[$key], $project, $predecessor);
      }
      
    }
	}
	// }}}
  
  
  // {{{ _addFile
  /**
   * used to add a template defined file to a project
   * @param MyProjectVO $project the project to add the file to
   * @param array $conf the file configuration
   * @param object $entity optional entity to pass the name through parseString 
   * @param string $path optional path to the file to use for this file
   * @param int $taskId optional id of a task to associate this file to
   * @return MyProjectFileVO
   */
  function &_addFile(&$project, $conf, &$entity, $path=NULL, $taskId=NULL) {
    
    $rb =& $this->getRb();
    $file = new MyProjectFileVO(array('projectId' => $project->getProjectId()));
    if (isset($conf['attributes']['category']) && isset($this->_fileCategoryConf[$conf['attributes']['category']])) { $file->setCategory($this->_fileCategoryConf[$conf['attributes']['category']]['attributes']['name']); }
    if (isset($conf['attributes']['change-restriction']) && ($participantId = $project->getParticipantIdFromTemplate($this->_participantConf[$conf['attributes']['change-restriction']]))) {
      $file->setChangeRestriction($participantId); 
    }
    if (!$path) { $path = isset($conf['attributes']['mime-type']) ? array('tmp_name' => $conf['attributes']['path'], 'name' => basename($conf['attributes']['path']), 'size' => filesize($conf['attributes']['path']), 'type' => $conf['attributes']['mime-type']) : $conf['attributes']['path']; }
    $file->setFile($path);
    $name = $rb ? $rb->getString($conf['attributes']['name']) : $conf['attributes']['name'];
    $file->setName(method_exists($entity, 'parseString') ? $entity->parseString($name) : $name);
    $file->setReadOnly(isset($conf['attributes']['read-only']) && $conf['attributes']['read-only'] == '1');
    if ($taskId) { $file->setTaskId($taskId); }
    $file->insert();
    return $file;
  }
  // }}}
  
  // {{{ _addMessage
  /**
   * used to add a template defined message to a project
   * @param MyProjectVO $project the project to add the message to
   * @param array $conf the message configuration
   * @param MyProjectFileVO[] optional project files reference
   * @param object $entity optional entity to pass the message/title through 
   * parseString
   * @param int $taskId optional id of a task to associate this message to
   * @return MyProjectMessageVO
   */
  function &_addMessage(&$project, $conf, &$files, &$entity, $taskId=NULL) {
    $rb =& $this->getRb();
    $message = new MyProjectMessageVO(array('projectId' => $project->getProjectId()));
    if (isset($conf['attributes']['category']) && isset($this->_messageCategoryConf[$conf['attributes']['category']])) { $message->setCategory($this->_messageCategoryConf[$conf['attributes']['category']]['attributes']['name']); }
    $msg = $rb ? $rb->getString($conf['attributes']['message']) : $conf['attributes']['message'];
    $message->setMessage(method_exists($entity, 'parseString') ? $entity->parseString($msg) : $msg);
    $title = $rb ? $rb->getString($conf['attributes']['title']) : $conf['attributes']['title'];
    $message->setTitle(method_exists($entity, 'parseString') ? $entity->parseString($title) : $title);
    if ($taskId) { $message->setTaskId($taskId); }
    $message->insert();
    if ($files && isset($conf['attributes']['files'])) {
      foreach(explode(' ', $conf['attributes']['files']) as $fileRef) {
        $files[$fileRef]->setMessageId($message->getMessageId());
        $files[$fileRef]->update();
      }
    }
    return $message;
  }
  // }}}
  
  // {{{ _addWhiteboard
  /**
   * used to add a template defined whiteboard to a project
   * @param MyProjectVO $project the project to add the whiteboard to
   * @param array $conf the whiteboard configuration
   * @param object $entity optional entity to pass the title through parseString 
   * @param int $taskId optional id of a task to associate this whiteboard to
   * @return MyProjectWhiteboardVO
   */
  function &_addWhiteboard(&$project, $conf, &$entity, $taskId=NULL) {
    $rb =& $this->getRb();
    $whiteboard = new MyProjectWhiteboardVO(array('projectId' => $project->getProjectId()));
    if (isset($conf['attributes']['change-restriction']) && ($participantId = $project->getParticipantIdFromTemplate($this->_participantConf[$conf['attributes']['change-restriction']]))) {
      $whiteboard->setChangeRestriction($participantId); 
    }
    $whiteboard->setHeight($conf['attributes']['height']);
    if (isset($conf['attributes']['init-bg-path'])) { $whiteboard->setWhiteboard(SRA_File::getRelativePath(NULL, $conf['attributes']['init-bg-path'])); }
    $whiteboard->setReadOnly(isset($conf['attributes']['read-only']) && $conf['attributes']['read-only'] == '1');
    $title = $rb ? $rb->getString($conf['attributes']['title']) : $conf['attributes']['title'];
    $whiteboard->setTitle(method_exists($entity, 'parseString') ? $entity->parseString($title) : $title);
    $whiteboard->setWidth($conf['attributes']['width']);
    if ($taskId) { $whiteboard->setTaskId($taskId); }
    $whiteboard->insert();
  }
  // }}}
  
	// {{{ _getTemplates
	/**
	 * returns the MyProjectsTemplate instance based on the $conf specified
	 * @param  string $conf the template configuration
	 * @access	private
	 * @return	MyProjectsTemplate[]
	 */
	function &_getTemplates($conf) {
		if (SRA_Error::isError($xmlParser =& SRA_XmlParser::getXmlParser($conf, TRUE))) {
      return $xmlParser;
    }
    else {
      $templates = array();
      $data =& $xmlParser->getData('my-projects');
      $keys = array_keys($data['template']);
      foreach($keys as $key) {
        if (isset($data['attributes']['resources']) && !isset($data['template'][$key]['attributes']['resources'])) {
          $data['template'][$key]['attributes']['resources'] = $data['attributes']['resources'];
        }
        if (!MyProjectsTemplate::isValid($templates[$key] = new MyProjectsTemplate($data['template'][$key]))) {
          unset($templates[$key]);
        }
      }
      return $templates;
    }
	}
	// }}}
  
	// {{{ _initializeTasks
	/**
	 * initializes tasks for the project specified
   * @param MyProjectVO $project the project to initialize the tasks for
   * @param array $taskConf the task configuration to initialize
   * @param MyProjectTaskVO $parent the parent task
   * @param MyProjectTaskVO $predecessor the predecessor task
   * @param MyProjectFileVO[] $files files created from the template
   * @param MyProjectFileVO[] $messages messages created from the template
   * @param MyProjectFileVO[] $whiteboards whiteboards created from the template
   * @param boolean $notifyDefault whether or not to send task notifications by 
   * default
	 * @access public
   * @return void;
	 */
	function &_initializeTasks(&$project, &$taskConf, &$parent, &$predecessor, &$files, &$messages, &$whiteboards, $notifyDefault) {
    
    // tasks
    $tasks = array();
    if ($taskConf) {
      $template =& MyProjectsTemplate::getAppTemplate($project->getTemplate());
      $rb =& $template->getRb();
      $dao =& SRA_DaoFactory::getDao('MyProjectTask');
      $keys = array_keys($taskConf);
      foreach($keys as $key) {
        $tasks[$key] =& $dao->newInstance();
        $cr = $taskConf[$key]['attributes']['change-restriction'];
        $cre = $taskConf[$key]['attributes']['change-restriction-email'];
        if (isset($cr) && ($participantId = $project->getParticipantIdFromTemplate(!$cre ? $template->_participantConf[$cr] : $template->_emailParticipantConf[$cr]))) {
          $tasks[$key]->setChangeRestriction($participantId); 
          $tasks[$key]->setChangeRestrictionEmail($cre);
        }
        if (isset($taskConf[$key]['attributes']['complete-confirm'])) { $tasks[$key]->setCompleteConfirm($taskConf[$key]['attributes']['complete-confirm']); }
        if (isset($taskConf[$key]['attributes']['description'])) { $tasks[$key]->setDescription($rb ? $rb->getString($taskConf[$key]['attributes']['description']) : $taskConf[$key]['attributes']['description']); }
        if (isset($taskConf[$key]['attributes']['due-date'])) { $tasks[$key]->setDueDate(SRA_GregorianDate::fromRelativeStr($taskConf[$key]['attributes']['due-date'])); }
        if (isset($taskConf[$key]['attributes']['duration-planned'])) { $tasks[$key]->setDurationPlanned($taskConf[$key]['attributes']['duration-planned']); }
        $tasks[$key]->setList($taskConf[$key]['attributes']['list']);
        $tasks[$key]->setNotify(isset($taskConf[$key]['attributes']['notify']) ? $taskConf[$key]['attributes']['notify'] == '1' : $notifyDefault);
        $tasks[$key]->setNotifySubject(isset($taskConf[$key]['attributes']['notify-subject']) ? $taskConf[$key]['attributes']['notify-subject'] : $project->getNotifySubject());
        $tasks[$key]->setNotifyTpl(isset($taskConf[$key]['attributes']['notify-tpl']) ? $taskConf[$key]['attributes']['notify-tpl'] : (!isset($taskConf[$key]['attributes']['notify-tpl-html']) ? $project->getNotifyTpl() : NULL));
        $tasks[$key]->setNotifyTplHtml(isset($taskConf[$key]['attributes']['notify-tpl-html']) ? $taskConf[$key]['attributes']['notify-tpl-html'] : (!isset($taskConf[$key]['attributes']['notify-tpl']) ? $project->getNotifyTplHtml() : NULL));
        if (isset($taskConf[$key]['attributes']['show-percentage']) && $taskConf[$key]['attributes']['show-percentage'] == '1') { $tasks[$key]->setPercentComplete(0); }
        $tasks[$key]->setReadOnly($taskConf[$key]['attributes']['read-only']);
        if (isset($taskConf[$key]['attributes']['start-date'])) { $tasks[$key]->setStartDate(SRA_GregorianDate::fromRelativeStr($taskConf[$key]['attributes']['start-date'])); }
        $tasks[$key]->setStrictPermissions($taskConf[$key]['attributes']['strict-permissions']);
        $tasks[$key]->setTitle($rb ? $rb->getString($taskConf[$key]['attributes']['title']) : $taskConf[$key]['attributes']['title']);
        $tasks[$key]->setProjectId($project->getProjectId());
        if ($parent) { $tasks[$key]->setParent($parent); }
        if ($predecessor) { $tasks[$key]->setPredecessor($predecessor); }
        $tasks[$key]->insert();
        if (isset($taskConf[$key]['attributes']['files'])) {
          foreach(explode(' ', $taskConf[$key]['attributes']['files']) as $fileRef) {
            $files[$fileRef]->setTaskId($tasks[$key]->getTaskId());
            $files[$fileRef]->update();
          }
        }
        if (isset($taskConf[$key]['attributes']['messages'])) {
          foreach(explode(' ', $taskConf[$key]['attributes']['messages']) as $messageRef) {
            $messages[$messageRef]->setTaskId($tasks[$key]->getTaskId());
            $messages[$messageRef]->update();
          }
        }
        if (isset($taskConf[$key]['attributes']['whiteboards'])) {
          foreach(explode(' ', $taskConf[$key]['attributes']['whiteboards']) as $whiteboardRef) {
            $whiteboards[$whiteboardRef]->setTaskId($tasks[$key]->getTaskId());
            $whiteboards[$whiteboardRef]->update();
          }
        }
      }
    }
    // set task predecessors
    if ($taskConf) {
      foreach($keys as $key) {
        if (isset($taskConf[$key]['attributes']['predecessor'])) {
          $tasks[$key]->setPredecessor($tasks[$taskConf[$key]['attributes']['predecessor']]);
          $tasks[$key]->update();
        }
      }
    }
    // sub-tasks
    if ($taskConf) {
      foreach($keys as $key) {
        if (isset($taskConf[$key]['task'])) { 
          MyProjectsTemplate::_initializeTasks($project, $taskConf[$key]['task'], $tasks[$key], $tasks[$key]->getPredecessor(), $files, $messages, $whiteboards, $notifyDefault);
        }
      }
    }
	}
	// }}}
  
	// {{{ _setTaskPermissions
	/**
	 * sets a task permission based on the following criteria:
   *   neither $user nor $role specified: task will be 'created' by the project 
   *                                      creator and editable by any project 
   *                                      user with task write permissions
   *   both $user and $role specified:    task creator will be $user and 
   *                                      change restriction will be $role. both 
   *                                      will be added to the project if they 
   *                                      do not already belong to it. only 
   *                                      $user or $role (or the project 
   *                                      administrator) will have access to 
   *                                      update the task
   *   only $user specified:              $user will have sole permissions to 
   *                                      change the task
   *   only $role specified:              $role will have sole permissions to 
   *                                      change the task
   * @param MyProjectTaskVO $task the task to set the permissions for
   * @param MyProjectVO $project the project that the task is a part of
   * @param int $user the id of the user that should be designated as the 
   * creator
   * @param int $role the id of the group that should be designated as the 
   * change restriction
   * @param SraWorkflowVO $workflow the workflow that the task belongs to
	 * @access public
	 * @return void
	 */
	function _setTaskPermissions(&$task, &$project, $user, $role, &$workflow) {
    $db =& SRA_Controller::getAppDb();
    
    if ($user && OsUserVO::isValid($user =& $workflow->getUser($user))) {
      if ($user->getPrimaryKey() == $project->getCreator()) {
        $task->setCreator($user->getPrimaryKey());
        if (!$role) { $task->setReadOnly(TRUE); }
      }
      else {
        if ($participantId = SRA_Database::getQueryValue($db, 'SELECT participant_id FROM my_project_participant WHERE project_id=' . 
                                                              $project->getPrimaryKey() . ' AND id=' . $user->getPrimaryKey() . 
                                                              ' AND is_group=' . $db->convertBoolean(FALSE), SRA_DATA_TYPE_INT)) {
          $role ? $task->setCreator($user->getPrimaryKey()) : $task->setChangeRestriction($participantId);
        }
        else {
          $results =& $db->execute('INSERT INTO my_project_participant (project_id, id, is_group, permissions) VALUES (' . 
                                   $project->getPrimaryKey() . ', ' . $user->getPrimaryKey() . ', ' . $db->convertBoolean(FALSE) . ', ' . 
                                   MY_PROJECT_PERMISSIONS_FULL_PARTICIPANT . ')', 'participant_id');
          $role ? $task->setCreator($user->getPrimaryKey()) : $task->setChangeRestriction($results->getSequenceValue());
        }
      }
      $role ? $task->setReadOnly(TRUE) : $task->setStrictPermissions(TRUE);
    }
    else {
      $task->setCreator($project->getCreator());
    }
    
    if ($role && OsGroupVO::isValid($role =& $workflow->getRole($role))) {
      if ($participantId = SRA_Database::getQueryValue($db, 'SELECT participant_id FROM my_project_participant WHERE project_id=' . 
                                                              $project->getPrimaryKey() . ' AND id=' . $role->getPrimaryKey() . 
                                                              ' AND is_group=' . $db->convertBoolean(TRUE), SRA_DATA_TYPE_INT)) {
        $task->setChangeRestriction($participantId);
      }
      else {
        $results =& $db->execute('INSERT INTO my_project_participant (project_id, id, is_group, permissions) VALUES (' . 
                                 $project->getPrimaryKey() . ', ' . $role->getPrimaryKey() . ', ' . $db->convertBoolean(TRUE) . ', ' . 
                                 MY_PROJECT_PERMISSIONS_FULL_PARTICIPANT . ')', 'participant_id');
        $task->setChangeRestriction($results->getSequenceValue());
      }
      $user ? $task->setReadOnly(TRUE) : $task->setStrictPermissions(TRUE);
    }
	}
	// }}}
  
	// {{{ _syncWfStep
	/**
	 * synchronizes the step and project specified if it has not already been done
   * @param SraWorkflowStepVO $step the workflow step to synchronize
   * @param MyProjectVO $project the project to synchronize the step to
	 * @access public
	 * @return void
	 */
	function _syncWfStep(&$step, &$project, &$predecessor) {
    $db =& SRA_Controller::getAppDb();
    if ($step->isInteractive() && !SRA_Database::getRecordCount($db, 'SELECT wf_step_id FROM my_project_task WHERE project_id=' . $project->getProjectId() . ' AND wf_step_id=' . $step->getStepId())) {
      $template =& MyProjectsTemplate::getAppTemplate($project->getTemplate());
      $rb =& $template->getRb();
      $dao =& SRA_DaoFactory::getDao('MyProjectTask', FALSE, FALSE, TRUE);
      $setup =& $step->getSetup();
      $projectTask =& $dao->newInstance();
      MyProjectsTemplate::_setTaskPermissions($projectTask, $project, $setup->user, $setup->role, $step->getWorkflow());
      if ($step->getDueDate()) { $projectTask->setDueDate($step->getDueDate()); }
      if ($predecessor) { $projectTask->setPredecessor($predecessor); }
      $projectTask->setProjectId($project->getProjectId());
      $projectTask->setStatus($step->isTerminal() ? $task->getStatus() : 'active');
      $projectTask->setTitle($rb ? $rb->getString($setup->resource) : $setup->resource);
      $projectTask->setWfLocked($step->isTerminal() ? TRUE : FALSE);
      $projectTask->setWfStepId($step->getStepId());
      $projectTask->setNotify($template->isWfNotifyStep());
      $dao->insert($projectTask);
      
      // syncronize step files/messages/whiteboards
      // files
      if ($template->_fileConf) {
        $keys = array_keys($template->_fileConf);
        foreach($keys as $key) {
          if (isset($template->_fileConf[$key]['attributes']['wf-step']) && in_array($setup->id, explode(' ', $template->_fileConf[$key]['attributes']['wf-step']))) {
            $taskId = $projectTask->getTaskId();
            if (isset($template->_fileConf[$key]['attributes']['wf-step-assoc'])) {
              $taskId = SRA_Database::getQueryValue($db, 'SELECT task_id FROM my_project_task WHERE wf_step_id=' . SRA_Database::getQueryValue($db, 'SELECT step_id FROM sra_workflow_step WHERE workflow_id=' . $step->getWorkflowId() . ' AND step=' . $db->convertText($template->_fileConf[$key]['attributes']['wf-step-assoc']), SRA_DATA_TYPE_INT), SRA_DATA_TYPE_INT);
            }
            if (isset($template->_fileConf[$key]['attributes']['wf-entity'])) {
              $wf =& $step->getWorkflow();
              $entity =& $wf->getEntityObj($template->_fileConf[$key]['attributes']['wf-entity']);
            }
            else {
              $entity =& $step->getEntityObj();
            }
            $path = $template->_fileConf[$key]['attributes']['path'];
            if (isset($template->_fileConf[$key]['attributes']['wf-view'])) {
              $path = SRA_Controller::getAppTmpDir() . '/' . $entity->parseString(basename($path));
              $entity->renderToFile($template->_fileConf[$key]['attributes']['wf-view'], $path);
            }
            $template->_addFile($project, $template->_fileConf[$key], $entity, $path, $taskId); 
          }
        }
      }
      // messages
      if ($template->_messageConf) {
        $keys = array_keys($template->_messageConf);
        foreach($keys as $key) {
          if (isset($template->_messageConf[$key]['attributes']['wf-step']) && in_array($setup->id, explode(' ', $template->_messageConf[$key]['attributes']['wf-step']))) { 
            $nl = NULL;
            $taskId = $projectTask->getTaskId();
            if (isset($template->_messageConf[$key]['attributes']['wf-step-assoc'])) {
              $taskId = SRA_Database::getQueryValue($db, 'SELECT task_id FROM my_project_task WHERE wf_step_id=' . SRA_Database::getQueryValue($db, 'SELECT step_id FROM sra_workflow_step WHERE workflow_id=' . $step->getWorkflowId() . ' AND step=' . $db->convertText($template->_messageConf[$key]['attributes']['wf-step-assoc']), SRA_DATA_TYPE_INT), SRA_DATA_TYPE_INT);
            }
            $template->_addMessage($project, $template->_messageConf[$key], $nl, $step->getEntityObj(), $taskId); 
          }
        }
      }
      // whiteboards
      $whiteboards = array();
      if ($template->_whiteboardConf) {
        $keys = array_keys($template->_whiteboardConf);
        foreach($keys as $key) {
          if (isset($template->_whiteboardConf[$key]['attributes']['wf-step']) && in_array($setup->id, explode(' ', $template->_whiteboardConf[$key]['attributes']['wf-step']))) {
            $taskId = $projectTask->getTaskId();
            if (isset($template->_whiteboardConf[$key]['attributes']['wf-step-assoc'])) {
              $taskId = SRA_Database::getQueryValue($db, 'SELECT task_id FROM my_project_task WHERE wf_step_id=' . SRA_Database::getQueryValue($db, 'SELECT step_id FROM sra_workflow_step WHERE workflow_id=' . $step->getWorkflowId() . ' AND step=' . $db->convertText($template->_whiteboardConf[$key]['attributes']['wf-step-assoc']), SRA_DATA_TYPE_INT), SRA_DATA_TYPE_INT);
            }
            $template->_addWhiteboard($project, $template->_whiteboardConf[$key], $step->getEntityObj(), $taskId); 
          }
        }
      }
      
      // syncronize step tasks
      $tasks =& $step->getTasks();
      $keys = array_keys($tasks);
      foreach($keys as $key) {
        MyProjectsTemplate::_syncWfTask($tasks[$key], $project, $projectTask, $predecessor);
      }
    }
	}
	// }}}
  
	// {{{ _syncWfTask
	/**
	 * synchronizes the task and project specified if it has not already been done
   * @param SraWorkflowTaskVO $task the workflow task to synchronize
   * @param MyProjectVO $project the project to synchronize the task to
   * @param MyProjectTaskVO $parent the parent of this task (optional)
	 * @access public
	 * @return void
	 */
	function _syncWfTask(&$task, &$project, &$parent, &$predecessor) {
    if ($task->isInteractive() && !SRA_Database::getRecordCount(SRA_Controller::getAppDb(), 'SELECT wf_task_id FROM my_project_task WHERE project_id=' . $project->getProjectId() . ' AND wf_task_id=' . $task->getTaskId())) {
      $template =& MyProjectsTemplate::getAppTemplate($project->getTemplate());
      $rb =& $template->getRb();
      $dao =& SRA_DaoFactory::getDao('MyProjectTask');
      $setup =& $task->getSetup();
      $projectTask =& $dao->newInstance();
      MyProjectsTemplate::_setTaskPermissions($projectTask, $project, $setup->user, $setup->role, $task->getTaskWorkflow());
      if ($setup->resourceDescr) { $projectTask->setDescription($rb ? $rb->getString($setup->resourceDescr) : $setup->resourceDescr); }
      if ($task->getDueDate()) { $projectTask->setDueDate($task->getDueDate()); }
      if ($parent) { $projectTask->setParent($parent); }
      if ($predecessor) { $projectTask->setPredecessor($predecessor); }
      $projectTask->setProjectId($project->getProjectId());
      $projectTask->setStatus($task->isTerminal() ? $task->getStatus() : 'active');
      $projectTask->setTitle($rb ? $rb->getString($setup->resource) : $setup->resource);
      if ($task->isTerminal()) { $projectTask->setWfLocked(TRUE); }
      $projectTask->setWfTaskId($task->getTaskId());
      $projectTask->setNotify($template->isWfNotifyTask());
      $dao->insert($projectTask);
    }
	}
	// }}}
  
}
// }}}


// add an instance of MyProjectsTemplate to the template
$tpl =& SRA_Controller::getAppTemplate();
$fl = FALSE;
$tpl->assignByRef('MyProjectsTemplate', new MyProjectsTemplate($fl));
}
?>
