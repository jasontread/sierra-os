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
include_once('plugins/productivity/MyProjectsTemplate.php');
// }}}

// {{{ Constants
/**
 * the workflow step complete confirm message resource key. can be overriden by 
 * project templates by simply adding the same key to the corresponding project 
 * template properties files
 * @type string
 */
define('MY_PROJECTS_MANAGER_COMPLETE_STEP_CONFIRM', 'MyProjects.completeStepConfirm');

/**
 * the workflow task complete confirm message resource key. can be overriden by 
 * project templates by simply adding the same key to the corresponding project 
 * template properties files. applies only to non-step workflow tasks
 * @type string
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_CONFIRM', 'MyProjects.completeTaskConfirm');

/**
 * status code if a compleTask invocation failed because it requires display of 
 * a confirm message (the 'confirm' message will also be provided)
 * @type int
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_CONFIRM', 1);

/**
 * status code if a compleTask invocation resulted in a validation error (the 
 * 'error' message will also be provided)
 * @type int
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR', 2);

/**
 * status code if a compleTask invocation could not be completed because a 
 * workflow task form must be displayed and the data returned and validated 
 * first
 * @type int
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_FORM', 3);

/**
 * status code if a compleTask invocation was successful
 * @type int
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_SUCCESS', 4);

/**
 * status code if a compleTask invocation could not be completed because a 
 * workflow task view must be displayed first
 * @type int
 */
define('MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_VIEW', 5);

/**
 * the default drawboard background
 * @type string
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_BG', 'FFFFFF');

/**
 * the default drawboard language
 * @type string
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_LANG', 'en');

/**
 * the default drawboard pen color
 * @type string
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_PENCOLOR', '000000');

/**
 * the default drawboard skin
 * @type string
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_SKIN', 'default.def');

/**
 * the default max drawboard clients
 * @type int
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_MAX_CLIENTS', 15);

/**
 * the default # of minutes to wait before shutting down a drawboard
 * @type int
 */
define('MY_PROJECTS_MANAGER_DRAWBOARD_IDLEWAIT', 120);

/**
 * the default getDueDates statuses
 * @type string
 */
define('MY_PROJECTS_MANAGER_DUE_DATE_STATUS', 'active wait');

/**
 * the uri suffix for the MyProjects email participant login
 * @type string
 */
define('MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI', 'plugins/productivity/ep/');

/**
 * the base uri for MyProjects file icons
 * @type string
 */
define('MY_PROJECTS_MANAGER_ICONS_BASE_URI', 'plugins/core/icons/mimetypes/{$size}/');

/**
 * the default my projects introduction email template
 * @type string
 */
define('MY_PROJECTS_MANAGER_INTRO_EMAIL_TPL', 'plugins/productivity/my-projects-intro-email.tpl');

/**
 * the default my projects introduction email html template
 * @type string
 */
define('MY_PROJECTS_MANAGER_INTRO_EMAIL_TPL_HTML', 'plugins/productivity/my-projects-intro-email-html.tpl');

/**
 * the default per-project latest activity limit used in the getLatestActivity 
 * method
 * @type int
 */
define('MY_PROJECTS_MANAGER_LATEST_ACTIVITY_LIMIT', 5);

/**
 * the default task notification subject resource identifier
 * @type string
 */
define('MY_PROJECTS_MANAGER_NOTIFY_SUBJECT', 'MyProjectTask.notify.subject');

/**
 * the default task notification template
 * @type string
 */
define('MY_PROJECTS_MANAGER_NOTIFY_TPL', 'plugins/productivity/my-projects-task-notification.tpl');

/**
 * the default task notification html template
 * @type string
 */
define('MY_PROJECTS_MANAGER_NOTIFY_TPL_HTML', 'plugins/productivity/my-projects-task-notification-html.tpl');

/**
 * the path to the productivity resources
 * @type string
 */
define('MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES', 'etc/plugins/productivity/l10n/productivity');

/**
 * the max # of projects that will be returned by the search method
 * @type int
 */
define('MY_PROJECTS_MANAGER_SEARCH_LIMIT', 100);

/**
 * the max # of files that can be attached to a message or comment
 * @type int
 */
define('MY_PROJECTS_MAX_FILES_ATTACH', 10);

/**
 * bit identifier for the user that created the project
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_CREATOR', 1);

/**
 * bit identifier for a MyProjectEmailParticipant
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL', 2);

/**
 * bit identifier for a group type MyProjectParticipant
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_GROUP', 4);

/**
 * bit identifier for a user within a group type MyProjectParticipant
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_GROUP_USER', 8);

/**
 * bit identifier for an user type MyProjectParticipant
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_USER', 16);

/**
 * bit identifier for an all participants. see 'getParticipants' below
 * @type int
 */
define('MY_PROJECTS_MANAGER_PARTICIPANT_ALL', 31);

/**
 * the number of days to maintain log entries (see retrievePopMessages)
 * @type int
 */
define('MY_PROJECTS_MANAGER_POP_LOG_KEEP', 14);

/**
 * frequency to check for new messages in minutes (see retrievePopMessages)
 * @type int
 */
define('MY_PROJECTS_MANAGER_POP_LOGIN_FREQ', 5);

/**
 * the max allowed pop message size in megabytes (see retrievePopMessages)
 * @type int
 */
define('MY_PROJECTS_MANAGER_POP_MAX_SIZE', 14);

/**
 * the discussion subscriber email template
 * @type string
 */
define('MY_PROJECTS_SUBSCRIBER_EMAIL_TPL', 'plugins/productivity/my-projects-subscriber-email.tpl');

/**
 * the discussion subscriber html email template
 * @type string
 */
define('MY_PROJECTS_SUBSCRIBER_EMAIL_TPL_HTML', 'plugins/productivity/my-projects-subscriber-email-html.tpl');
// }}}

// {{{ MyProjectsManager
/**
 * contains static method used by the MyProjects application
 * 
 * @author  Jason Read <jason@idir.org>
 */
class MyProjectsManager {
  
	// {{{ activateWhiteboard
	/**
	 * ajax service method used to complete a project. this method accepts 1 param 
   * 'projectId' and returns a either true on success, false if the project 
   * still has outstanding pending tasks, or an array of error messages if any 
   * errors occur
   * @param array $params the method params. contains a single value: projectId
   * @access public
   * @return object
	 */
	function &activateWhiteboard($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProjectWhiteboard');
    if ($user && array_key_exists('whiteboardId', $params) && (!SRA_Error::isError($whiteboard =& $dao->findByPk($params['whiteboardId'])))) {
      if (!$whiteboard->isActive()) {
        $drawboardConf =& MyProjectsManager::getDrawboardConf();
        
        if (isset($drawboardConf['java']) && isset($drawboardConf['portStart']) && isset($drawboardConf['portEnd']) && isset($drawboardConf['internalPortStart']) && isset($drawboardConf['internalPortEnd'])) {
          if (file_exists($drawboardConf['java']) || is_executable($drawboardConf['java'])) {
            $db =& SRA_Controller::getAppDb();
            $maxPort = SRA_Database::getQueryValue($db, 'SELECT max(active_port) FROM my_project_whiteboard');
            $maxInternalPort = SRA_Database::getQueryValue($db, 'SELECT max(active_port_users) FROM my_project_whiteboard');
            if ($maxPort >= $drawboardConf['portEnd'] || ($maxInternalPort + 1) >= $drawboardConf['internalPortEnd']) {
              return SRA_Error::logError('MyProjectsManager::activateWhiteboard - Failed: there are not sufficient available ports to launch the drawboard', __FILE__, __LINE__);
            }
            else {
              $whiteboard->setActivePort(($maxPort && $maxPort >= $drawboardConf['portStart'] ? $maxPort : $drawboardConf['portStart']) + 1);
              $whiteboard->setActivePortPrinter(($maxInternalPort && $maxInternalPort >= $drawboardConf['internalPortStart'] ? $maxInternalPort : $drawboardConf['internalPortStart']) + 1);
              $whiteboard->setActivePortUsers(($maxInternalPort && $maxInternalPort >= $drawboardConf['internalPortStart'] ? $maxInternalPort : $drawboardConf['internalPortStart']) + 2);
              $whiteboard->setActive(TRUE);
              $whiteboard->update();
              $background =& $whiteboard->getWhiteboard();
              $locale =& SRA_Controller::getAppLocale(); 
              $cmd = $drawboardConf['java'] . ' -cp ' . SRA_Controller::getAppDir() . '/plugins/productivity/www/drawboard/drawboard.jar drawboard.Server -x ' . 
                     ($whiteboard->getWidth() + 100) . ' -y ' . ($whiteboard->getHeight() + 50) . ' -p ' . $whiteboard->getActivePort() . ' -i ' . $whiteboard->getActivePortUsers() . 
                     ' -r ' . $whiteboard->getActivePortPrinter() . ' -m ' . $drawboardConf['maxclients'] . ' -c ' . $drawboardConf['background'] . ' -s off -b ' . 
                     $whiteboard->getActiveBgFile() . ' -lang ' . (in_array($locale->getLanguage(), array('de', 'en', 'pl')) ? $locale->getLanguage() : MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_LANG);
              $pid = exec("$cmd > " . ($drawboardConf['log'] ? $drawboardConf['log'] . $whiteboard->getActivePort() : '/dev/null') . ' & echo $!');
              $db->execute('UPDATE my_project_whiteboard SET active_pid=' . $pid . ' WHERE whiteboard_id=' . $whiteboard->getPrimaryKey());
            }
          }
          else {
            return SRA_Error::logError('MyProjectsManager::activateWhiteboard - Failed: java configuration variable in drawboard.ini is not valid or not executable', __FILE__, __LINE__);
          }
        }
        else {
          return SRA_Error::logError('MyProjectsManager::activateWhiteboard - Failed: drawboard.ini is missing java, portStart, portEnd, internalPortStart or internalPortEnd configuration values', __FILE__, __LINE__);
        }
      }
      $results = array();
      $results[] =& $whiteboard;
      return $results;
    }
    else {
      SRA_Error::logError('MyProjectsManager::activateWhiteboard - Failed: no current active user or no whiteboardId param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
  // }}}
  
  
	// {{{ completeProject
	/**
	 * ajax service method used to complete a project. this method accepts 2 
   * parameters:
   *   projectId: the id of the project to complete
   *   confirmed: whether or not the confirm message has been agreed to (when 
   *              the project has a confirm message)
   * and returns a either true on success, false if the project still has 
   * outstanding pending tasks, a string representing the confirm message to 
   * display when one exists for the project and the 'confirm' parameter was not 
   * set, or an array of error messages if any errors occur
   * @param array $params the method params. 'projectId' and the optional 
   * 'confirmed' parameter
   * @access public
   * @return mixed
	 */
	function &completeProject($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProject');
    if ($user && array_key_exists('projectId', $params) && (MyProjectVO::isValid($project =& $dao->findByPk($params['projectId'])))) {
      if ($project->hasPendingTasks()) {
        $fl = FALSE;
        return $fl;
      }
      else if (!$params['confirmed'] && $project->getCompleteConfirm()) {
        return $project->getCompleteConfirmMsg();
      }
      else {
        $project->setStatus('completed');
        if (!$project->validate()) {
          return $project->validateErrors;
        }
        else {
          if (!SRA_Error::isError($err = $project->update())) {
            $tr = TRUE;
            return $tr;
          }
          else {
            return $err;
          }
        }
      }
    }
    else {
      SRA_Error::logError('MyProjectsManager::completeProject - Failed: no current active user or no projectId param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ completeTask
	/**
	 * ajax service method used to complete a task. this method accepts 2 
   * parameters:
   *   _taskId:   the id of the task to complete
   *   _confirmed:whether or not the confirm message has been agreed to (when 
   *              the task has a confirm message), or the view displayed (for 
   *              workflow tasks)
   *   *:         if the task is associated to a workflow task with a view and 
   *              a validation contraint, then these parameters may be used to 
   *              provide the data input by the user from that view. if the 
   *              view does not have a validation constraint, this parameter 
   *              should be true
   * the return value will be an associative array with the following keys:
   *   confirm:required confirmation message to display before task can be 
   *           completed
   *   error:  an error message if an error occurred
   *   parent: the id of the task parent (if applicable)
   *   status: the MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_* code representing 
   *           the results of the completion attempt
   *   view:   an html view to display to the user in order for this task to be 
   *           able to be completed. applies only to workflow based tasks with a 
   *           view defined
   * @param array $params the method params
   * @access public
   * @return mixed
	 */
	function &completeTask($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProjectTask');
    if ($user && array_key_exists('_taskId', $params) && (MyProjectTaskVO::isValid($task =& $dao->findByPk($params['_taskId'])))) {
      unset($params['_taskId']);
      
      $keys = array_keys($params);
      foreach($keys as $key) {
        if ($params[$key] === '') { $params[$key] = NULL; }
      }
              
      $results = array('parent' => $task->getParentId(), 'status' => MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_SUCCESS);
      
      if (!$params['_confirmed'] && ($task->getCompleteConfirm() || $task->getWfStepId())) {
        $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_CONFIRM;
        $results['confirm'] = $task->getCompleteConfirmMsg();
      }
      else {
        if (isset($params['_confirmed'])) {
          $confirmed = TRUE;
          unset($params['_confirmed']); 
        }
        
        $task->setStatus('completed');
        if (!$task->validate()) {
          $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR;
          $results['error'] = implode('<br />', $task->validateErrors);
        }
        
        $productivityResources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
        if ((!$results['error'] || strpos($results['error'], $productivityResources->getString('MyProjectTask.error.wfTaskNotCompleted')) !== FALSE) && ($task->getWfStepId() || $task->getWfTaskId())) {
          $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_SUCCESS;
          if (isset($results['error'])) { unset($results['error']); }
          
          $completeTasks = array();
          if ($task->getWfStepId()) {
            $subTasks =& $task->getSubTasks();
            $keys = array_keys($subTasks);
            foreach($keys as $key) {
              if ($subTasks[$key]->getWfTaskId()) {
                $completeTasks[] =& $subTasks[$key];
              }
            }
          }
          else {
            $completeTasks[] =& $task;
          }
          
          $processTasks = array();
          $keys = array_keys($completeTasks);
          foreach($keys as $key) {
            $dao =& SRA_DaoFactory::getDao('SraWorkflowTask');
            // lookup task
            if (!SraWorkflowTaskVO::isValid($wfTask =& $dao->findByPk($completeTasks[$key]->getWfTaskId()))) {
              return SRA_Error::logError('MyProjectsManager::completeTask - Failed: unable to retrieve SraWorkflowTaskVO instance ' . $completeTasks[$key]->getWfTaskId() . ' for project id ' . $completeTasks[$key]->getProjectId(), __FILE__, __LINE__);
            }
            
            // wf task is already completed
            if ($wfTask->getStatus() != 'in-progress') {
              $completeTasks[$key]->setStatus('completed');
              $completeTasks[$key]->setWfLocked(TRUE);
              $completeTasks[$key]->update();
              break;
            }
            // task view (does not apply to steps) has not been confirmed - prompt user with form/view
            else if ($task->getWfTaskId() && !$confirmed && $wfTask->getView()) {
              $results['confirm'] = $wfTask->getValidate() ? $task->getCompleteConfirmMsg() : (!$task->isPartOfWfStep() ? $productivityResources->getString('MyProjectTask.confirmView') : NULL);
              $results['status'] = $wfTask->getValidate() ? MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_FORM : MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_VIEW;
              $results['view'] = $wfTask->getViewContent();
              break;
            }
            // complete wf tasks
            else {
              // complete and lock
              if (!$task->isPartOfWfStep() || $task->getWfStepId()) {
                if (SRA_Error::isError($wfResults = $wfTask->process($params))) {
                  $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR;
                  $results['error'] = $wfResults->getErrorMessage();
                  $completeTasks[$key]->setStatus('error');
                  $completeTasks[$key]->update();
                  $wfTask->setStatus('error');
                  $wfTask->update();
                  break;
                }
                else if (is_array($wfResults)) {
                  $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR;
                  $results['error'] = implode('<br />', $wfResults);
                  break;
                }
                else if ($wfResults !== TRUE) {
                  $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR;
                  $results['error'] = $productivityResources->getString('MyProjects.error.wfTaskUnknownError');
                  break;
                }
                else {
                  $completeTasks[$key]->setStatus('completed');
                  $completeTasks[$key]->setWfLocked(TRUE);
                  $completeTasks[$key]->update();
                }
              }
              // step-based task, just validate data and update the entity
              else if ($task->getWfTaskId() && $wfTask->getView()) {
                if (!($entity =& $wfTask->getEntity())) {
                  return SRA_Error::logError('MyProjectsManager::completeTask - Failed: unable to retrieve entity instance for wf task ' . $task->getWfTaskId() . ' and project id ' . $task->getProjectId(), __FILE__, __LINE__);
                }
                
                $obj =& $entity->getEntity();
                if ($params) { $obj->setAttributes($params); }
                
                if ($errs = MyProjectsManager::_validateEntityObj($obj, $wfTask->getValidate(), TRUE)) {
                  $results['status'] = MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_ERROR;
                  $results['error'] = implode('<br />', $errs);
                  break;
                }
                else {
                  if ($params && $obj) { 
                    if (!$obj->recordExists) {
                      $entity->setEntity($obj);
                      $entity->update();
                    }
                  }
                  $completeTasks[$key]->update();
                }
              }
              // non-step interactive task
              else if ($wfTask->isInteractive()) {
                $completeTasks[$key]->setStatus('completed');
                $completeTasks[$key]->update();
              }
            }
          }
        }
        
        if (((!$task->getWfStepId() && !$task->getWfTaskId()) || $task->getWfStepId()) && $results['status'] == MY_PROJECTS_MANAGER_COMPLETE_TASK_STATUS_SUCCESS && SRA_Error::isError($err = $task->update())) {
          return $err;
        }
      }
      return $results;
    }
    else {
      SRA_Error::logError('MyProjectsManager::completeTask - Failed: no current active user or no _taskId param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getCategories
	/**
	 * ajax service method used to retrieve project categories. this method 
   * accepts the following params:
   *  projectId:  the id of the project to return the categories for
   *  projectIds: an array of project ids to return categories for (either 
   *              projectId or projectIds should be specified, but not both)
   *  fileOnly:   whether or not to just return file categories
   *  messageOnly:whether or not to just return message categories
   * the return value for this method is an array where each value in the array 
   * will be a hash with the following keys:
   *  projectId:  the project id for the category
   *  categoryId: the category id
   *  file:       either TRUE for file category or FALSE for message category
   *  name:       the category name
   * @param array $params the method params. contains a single value: projectIds
   * @access public
   * @return array
	 */
	function &getCategories($params) {
    global $user;
    if ($user && (array_key_exists('projectId', $params) || (array_key_exists('projectIds', $params) && is_array($params['projectIds']) && count($params['projectIds'])))) {
      $db =& SRA_Controller::getAppDb();
      
      $projectIds = isset($params['projectIds']) ? $params['projectIds'] : array($params['projectId']);
      $categories = array();
      if (!$params['messageOnly']) {
        $results =& $db->fetch('SELECT project_id, category_id, name FROM my_project_file_category WHERE project_id IN (' . implode(', ', $projectIds) . ') ORDER BY name', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT));
        while($row =& $results->next()) {
          $categories[] = array('projectId' => $row[0], 'categoryId' => $row[1], 'file' => TRUE, 'name' => $row[2]);
        }
      }
      if (!$params['fileOnly']) {
        $results =& $db->fetch('SELECT project_id, category_id, name FROM my_project_message_category WHERE project_id IN (' . implode(', ', $projectIds) . ') ORDER BY name', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT));
        while($row =& $results->next()) {
          $categories[] = array('projectId' => $row[0], 'categoryId' => $row[1], 'file' => FALSE, 'name' => $row[2]);
        }
      }
      return $categories;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getCategories - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getComments
	/**
	 * ajax service method used to retrieve project comments. this method accepts 
   * the following params (at least 1 must be provided):
   * 
   *  messsageId:     id of the message to return the comments for
   *  whiteboardId:   id of the whiteboard to return the comments for
   * 
   * the return value for this method is an array (sorted by lastUpdated in 
   * descending order) where each value in the array will be a hash with the 
   * following keys:
   * 
   *  commentId:      the comment id
   *  projectId:      the id of the project that this comment pertains to
   *  messageId:      the message id (for message comments only)
   *  whiteboardId:   the whiteboard id (for whiteboard comments only)
   *  comment:        the comment text
   *  commentHtml:    the comment html
   *  created:        javascript date object representing when this comment was 
   *                  created
   *  files:          an array of files that are currently linked to this 
   *                  comment. each value in this array will be a hash with the 
   *                  following keys:
   *    fileId:       the id of that file
   *    category:     the file category label (if applicable)
   *    icon:         the uri to the file icon
   *    name:         the name of the file
   *    uri:          the uri to the file
   *  lastUpdated:    javascript date object representing when this comment was 
   *                  last updated
   *  lastUpdatedBy:  the name of the user that last updated this comment
   *  readOnly:       whether or not the current user has read-only access to 
   *                  this comment. if false, they have full privileges
   *  thumbnailUri:   the uri to the thumbnail of the user that created this 
   *                  comment
   * @param array $params the method params (see above)
   * @access public
   * @return array
	 */
	function &getComments($params) {
    global $user;
    if ($user && (isset($params['messageId']) || isset($params['whiteboardId']))) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $tmp =& SRA_DaoFactory::getDao('MyProjectComment');
      $db =& SRA_Controller::getAppDb();
      
      $comments = array();
      $query = 'SELECT project_id, comment_id, message_id, whiteboard_id, comment, comment_html, created, last_updated, last_updated_by, creator FROM my_project_comment WHERE ' . (isset($params['messageId']) ? 'message_id=' . $db->convertInt($params['messageId']) : 'whiteboard_id=' . $db->convertInt($params['whiteboardId'])) . ' ORDER BY created DESC';
      $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT));
      while($row =& $results->next()) {
        if (!$projectAccess[$row[0]]) { $projectAccess[$row[0]]=MyProjectVO::getUserPermissions($row[0]); }
        if (($row[2] && !($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_MESSAGES_READ)) || ($row[3] && !($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_WHITEBOARDS_READ))) { continue; }
        
        $comment = array('projectId' => $row[0], 'commentId' => $row[1], 'messageId' => $row[2], 'whiteboardId' => $row[3], 'comment' => $row[4], 'commentHtml' => $row[5], 
                         'created' => $row[6] ? SRA_Util::attrToJavascript($row[6], NULL, NULL, TRUE) : NULL, 'lastUpdated' => $row[7] ? SRA_Util::attrToJavascript($row[7], NULL, NULL, TRUE) : NULL, 
                         'lastUpdatedBy' => $row[8], 'readOnly' => MyProjectCommentVO::isUserReadOnly($row[1]), 'thumbnailUri' => OsUserVO::getUserThumbnailUri($row[9]));
        $files =& $db->fetch('SELECT file_id, category, icon, name, file_uri FROM my_project_file WHERE comment_id=' . $row[1], array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
        if ($files->count()) {
          $comment['files'] = array();
          while($file =& $files->next()) {
            $comment['files'][] = array('fileId' => $file[0], 'category' => $file[1], 'icon' => MY_PROJECT_FILE_ICON_BASE_URI . '16/' . ($file[2] ? basename($file[2]) : 'unknown.png'), 'name' => $file[3], 'uri' => $file[4]);
          }
        }
        
        $comments[] = $comment;
      }
      return $comments;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getDiscussion - Failed: no current active user or messageId or whiteboardId is not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getDiscussion
	/**
	 * ajax service method used to retrieve project discussion items. this method 
   * accepts the following params:
   * 
   *  id:             the id of a specific discussion item to return using the 
   *                  format "message:[message id]" or 
   *                  "whiteboard:[whiteboard id]"
   *  projectIds:     an array of project ids to return discussion for
   *  categoryId:     an optional category filter (the id of the category to 
   *                  limit discussion to)
   *  messagesOnly:   whether or not to just return message discussions
   *  updatedWithin:  a last updated constraint. this value should be an integer 
   *                  value followed by a increment identifier (d=days, w=weeks, 
   *                  y=years). for example, to have this method only return 
   *                  discussion that has been created or updated within the 
   *                  past 1 week, the value for this parameter would be "1w"
   *                  (or "7d")
   *  whiteboardsOnly: whether or not to just return whiteboard discussions
   * 
   * the return value for this method is an array (sorted by lastUpdated in 
   * descending order) where each value in the array will be a hash with the 
   * following keys:
   * 
   *  projectId:      the project id for the discussion item
   *  messageId:      the message id (for message discussion only)
   *  whiteboardId:   the whiteboard id (for whiteboard discussion only)
   *  active:         if this dicussion item is a whiteboard, this value will be 
   *                  a boolean indicating whether or not that whiteboard is 
   *                  currently active
   *  activeUsers:    if this discussion item is a whiteboard and it is 
   *                  currently active, this value will be the # of users that 
   *                  are participating in the whiteboard session
   *  category:       if this dicussion item pertains to a category, this value 
   *                  will be the label for that category
   *  created:        javascript date object representing when this discussion 
   *                  item was created
   *  files:          an array of files that are currently linked to this 
   *                  discussion item (applies to messages only). each value in 
   *                  this array will be a hash with the following keys:
   *    fileId:       the id of that file
   *    category:     the file category label (if applicable)
   *    icon:         the uri to the 16 pixel file icon
   *    name:         the name of the file
   *    uri:          the uri to the file
   *  height:         the whiteboard png height (whiteboards only)
   *  lastUpdated:    javascript date object representing when this discussion 
   *                  item was last updated
   *  lastUpdatedBy:  the name of the user that last updated this dicussion item
   *  message:        message content (for message dicussion only)
   *  messageHtml:    message html (for message discussion only)
   *  numComments:    the # of comments that this dicussion item currently has
   *  readOnly:       whether or not the current user has read-only access to 
   *                  this discussion item. if false, they have full privileges
   *  sessionFull:    if this discussion item is a whiteboard and it is 
   *                  currently active, this value will be true if the max user 
   *                  limit has been reached, false otherwise
   *  subscribed:     whether or not the current user is subscribed to this 
   *                  discussion item
   *  taskId:         if this discussion item is linked to a task, this will be
   *                  the id of that task
   *  taskTitle:      if this discussion item is linked to a task, this will be
   *                  the title of that task
   *  thumbnailUri:   the uri to the thumbnail whiteboard png (whiteboards only)
   *  title:          the message or whiteboard title
   *  whiteboardUri:  the uri to the full-size whiteboard png (whiteboards only)
   *  width:          the whiteboard png width (whiteboards only)
   * @param array $params the method params (see above)
   * @access public
   * @return array
	 */
	function &getDiscussion($params) {
    global $user;
    if ($user && (array_key_exists('id', $params) || (array_key_exists('projectIds', $params) && is_array($params['projectIds']) && count($params['projectIds'])))) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $tmp =& SRA_DaoFactory::getDao('MyProjectMessage');
      $tmp =& SRA_DaoFactory::getDao('MyProjectWhiteboard');
      $db =& SRA_Controller::getAppDb();
      
      $discussion = array();
      
      if (array_key_exists('id', $params)) {
        $pieces = explode(':', $params['id']);
        $params[$pieces[0] == 'message' ? 'messagesOnly' : 'whiteboardsOnly'] = TRUE;
        $constraint = 'WHERE ' . ($pieces[0] == 'message' ? 'message_id' : 'whiteboard_id') . '=' . $db->convertInt($pieces[1]);
      }
      else {
        $constraint = 'WHERE project_id IN (' . implode(', ', $params['projectIds']) . ')';
        if ($params['categoryId']) {
          $results =& $db->fetch('SELECT name FROM my_project_message_category WHERE category_id=' . $db->convertInt($params['categoryId']));
          if ($results->count()) {
            $row =& $results->next();
            $constraint .= ' AND category=' . $db->convertText($row[0]);
          }
        }
        if ($params['updatedWithin']) {
          $id = $params['updatedWithin']{strlen($params['updatedWithin'])-1};
          $val = substr($params['updatedWithin'], 0, strlen($params['updatedWithin']) - 1) * -1;
          $dateConstraint = new SRA_GregorianDate();
          $dateConstraint->setHour(0);
          $dateConstraint->setMinute(0);
          $dateConstraint->setSecond(0);
          $dateConstraint->jump($id == 'y' ? SRA_GREGORIAN_DATE_UNIT_YEAR : ($id == 'w' ? SRA_GREGORIAN_DATE_UNIT_WEEK : SRA_GREGORIAN_DATE_UNIT_DAY), $val);
          $constraint .= ' AND last_updated>=' . $db->convertDate($dateConstraint);
        }
      }
      $projectAccess = array();
      
      // messages
      if (!$params['whiteboardsOnly']) {
        $query = 'SELECT project_id, message_id, category, created, last_updated, last_updated_by, message, message_html, task_id, title FROM my_project_message ' . $constraint;
        $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT));
        while($row =& $results->next()) {
          if (!$projectAccess[$row[0]]) { $projectAccess[$row[0]]=MyProjectVO::getUserPermissions($row[0]); }
          if (!($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_MESSAGES_READ)) { continue; }
          
          $message = array('projectId' => $row[0], 'messageId' => $row[1], 'category' => $row[2], 'created' => $row[3] ? SRA_Util::attrToJavascript($row[3], NULL, NULL, TRUE) : NULL, 
                           'lastUpdated' => $row[4] ? SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE) : NULL, 'lastUpdatedBy' => $row[5], 'lastUpdatedTime' => $row[4]->getUnixTimeStamp(), 
                           'message' => $row[6], 'messageHtml' => $row[7], 'readOnly' => MyProjectMessageVO::isUserReadOnly($row[1]), 'taskId' => $row[8], 'title' => $row[9]);
          if ($message['taskId']) { $message['taskTitle'] = SRA_Database::getQueryValue($db, 'SELECT title FROM my_project_task WHERE task_id=' . $message['taskId']); }
          $message['numComments'] = SRA_Database::getQueryValue($db, 'SELECT count(message_id) FROM my_project_comment WHERE message_id=' . $row[1]);
          
          if ($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_FILES_READ) {
            $files =& $db->fetch('SELECT file_id, category, icon, name, file_uri FROM my_project_file WHERE message_id=' . $row[1], array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
            if ($files->count()) {
              $message['files'] = array();
              while($file =& $files->next()) {
                $message['files'][] = array('fileId' => $file[0], 'category' => $file[1], 'icon' => MY_PROJECT_FILE_ICON_BASE_URI . '16/' . ($file[2] ? basename($file[2]) : 'unknown.png'), 'name' => $file[3], 'uri' => $file[4]);
              }
            }
          }
          $message['subscribed'] = SRA_Database::getQueryValue($db, 'SELECT count(message_id) FROM my_project_discussion_subscriber WHERE uid=' . $user->getUid() . ' AND message_id=' . $row[1]);
          $discussion[] = $message;
        }
      }
      
      // whiteboards
      if (!$params['messagesOnly']) {
        $drawboardConf =& MyProjectsManager::getDrawboardConf();
        $query = 'SELECT project_id, whiteboard_id, category, created, last_updated, last_updated_by, title, active, height, thumbnail_uri, whiteboard_uri, width, active_users, task_id FROM my_project_whiteboard ' . $constraint;
        $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT));
        while($row =& $results->next()) {
          if (!$projectAccess[$row[0]]) { $projectAccess[$row[0]]=MyProjectVO::getUserPermissions($row[0]); }
          if (!($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_WHITEBOARDS_READ)) { continue; }
          
          $whiteboard = array('projectId' => $row[0], 'whiteboardId' => $row[1], 'category' => $row[2], 'created' => $row[3] ? SRA_Util::attrToJavascript($row[3], NULL, NULL, TRUE) : NULL, 
                           'lastUpdated' => $row[4] ? SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE) : NULL, 'lastUpdatedBy' => $row[5], 'lastUpdatedTime' => $row[4]->getUnixTimeStamp(), 
                           'taskId' => $row[13], 'title' => $row[6], 'active' => $row[7], 'height' => $row[8], 'readOnly' => MyProjectWhiteboardVO::isUserReadOnly($row[1]), 'thumbnailUri' => $row[9], 
                           'whiteboardUri' => $row[10], 'width' => $row[11], 'activeUsers' => $row[12], 'sessionFull' => $row[7] && $row[12] >= $drawboardConf['maxclients']);
          if ($whiteboard['taskId']) { $whiteboard['taskTitle'] = SRA_Database::getQueryValue($db, 'SELECT title FROM my_project_task WHERE task_id=' . $whiteboard['taskId']); }
          $whiteboard['numComments'] = SRA_Database::getQueryValue($db, 'SELECT count(whiteboard_id) FROM my_project_comment WHERE whiteboard_id=' . $row[1]);
          $whiteboard['subscribed'] = SRA_Database::getQueryValue($db, 'SELECT count(whiteboard_id) FROM my_project_discussion_subscriber WHERE uid=' . $user->getUid() . ' AND whiteboard_id=' . $row[1]);
          $discussion[] = $whiteboard;
        }
      }
      
      $discussion =& SRA_Util::sortObjects($discussion, 'lastUpdatedTime', FALSE, TRUE, FALSE);
      return $discussion;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getDiscussion - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getDrawboardConf
	/**
	 * returns the drawboard configuration including with default values set
   * @access public
   * @return array
	 */
  function &getDrawboardConf() {
    $drawboardConf =& SRA_File::propertiesFileToArray(SRA_Controller::getAppDir() . '/plugins/productivity/etc/drawboard.ini');
    if (!isset($drawboardConf['background'])) { $drawboardConf['background'] = MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_BG; }
    if (!isset($drawboardConf['idlewait'])) { $drawboardConf['idlewait'] = MY_PROJECTS_MANAGER_DRAWBOARD_IDLEWAIT; }
    $drawboardConf['log'] = isset($drawboardConf['log']) && SRA_Util::beginsWith($drawboardConf['log'], '/') ? $drawboardConf['log'] : (isset($drawboardConf['log']) ? SRA_Controller::getAppLogDir() . '/' . $drawboardConf['log'] : NULL);
    if (!isset($drawboardConf['maxclients'])) { $drawboardConf['maxclients'] = MY_PROJECTS_MANAGER_DRAWBOARD_MAX_CLIENTS; }
    if (!isset($drawboardConf['pencolor'])) { $drawboardConf['pencolor'] = MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_PENCOLOR; }
    if (!isset($drawboardConf['skin'])) { $drawboardConf['skin'] = MY_PROJECTS_MANAGER_DRAWBOARD_DEFAULT_SKIN; }
    return $drawboardConf;
  }
  // }}}
  
  
	// {{{ getDueDates
	/**
	 * ajax service method used to load project due dates. these are either tasks 
   * or the projects themselves that have associated deadlines. this method 
   * accepts the following parameters:
   *   projectIds:   an array of ids identifying the projects that due dates 
   *                 should be returned for (REQUIRED)
   *   end:          end date threshold (<=) if not specified, none is applied
   *   lateOnly:     whether or not to just return due dates that are currently 
   *                 late. if true, start and end will be ignored. both lateOnly 
   *                 and upcomingOnly should not be specified
   *   readOnly:     whether or not to include read-only due dates. default 
   *                 is false
   *   start:        start date threshold (>=) if not specified, none is applied
   *   status:       a single value or array of project/task statuses to include 
   *                 in the results by default, ONLY active or wait events will  
   *                 be returned
   *   taskOnly:     whether or not to return ONLY task events
   *   unowned:      whether or not to include un-owned tasks (tasks that the 
   *                 user does not have responsibility for)
   *   upcomingOnly: whether or not to just return due dates within the user's 
   *                 upcoming theshold. if true, start and end will be ignored. 
   *                 both lateOnly and upcomingOnly should not be specified
   * 
   * and returns an array of due dates each of which is a hash with the 
   * following keys (sorted by dueDate ascending):
   *   projectId:    the project id for this due date
   *   taskId:       the task id for this due date (if it for a task, null 
   *                 otherwise)
   *   canToggleStatus:if the due date is a task, whether or not the status of 
   *                 the task can be toggled by the current user. this means, 
   *                 whether or not the user can change the status from active 
   *                 to completed and vise-versa. whether or not this is 
   *                 possible will depend on a variety of factors including the 
   *                 following: 
   *                    - whether or not the task is disabled
   *                    - whether or not the task is currently active/completed
   *                    - whether or not the task is locked by the workflow
   *                    - whether or not the user has task write permission
   *                    - if the status is active:
   *                        - children must be completed
   *                        - predecessor must be completed
   *                    - if the status is completed:
   *                        - all parent tasks must be completed
   *                        - no successor tasks can be completed
   *   canToggleStatusMsg: if the task status cannot be toggled, this value will 
   *                 be a message describing why it cannot be toggled
   *   creator       the name of the user that created the project/task
   *   disabled:     if the due date is a task, whether or not it is disabled or 
   *                 locked due to a workflow restriction
   *   dueDate:      the due date as a javascript date object
   *   icon:         the icon to use to represent the task (for tasks only)
   *   late:         whether or not the due date has passed
   *   lateDays:     if the due date is late, the # of days that it is late
   *   name:         the due date name (project.name or task.name)
   *   permissions:  the user's permissions to the project
   *   readOnly:     if the due date is a task, whether or not the task is 
   *                 read-only for the current user. if the due date is a 
   *                 project, then this will be true unless the current user has 
   *                 admin rights to that project. this only applies when the 
   *                 readOnly parameter is true
   *   status:       the project/task status identifier
   *   statusStr:    the project/task status string
   *   today:        whether or not the due date today
   *   upcoming:     whether or not the due date occurs within the user's 
   *                 upcoming theshold
   *   
   * @param array $params the method params. contains a single value: projectId
   * @access public
   * @return object
	 */
	function &getDueDates($params) {
    global $user;
    if ($user && array_key_exists('projectIds', $params) && count($params['projectIds'])) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $tmp =& SRA_DaoFactory::getDao('MyProjectTask');
      $db =& SRA_Controller::getAppDb();
      
      $pidSql = 'p.project_id IN (';
      foreach($params['projectIds'] as $pid) {
        $pidSql .= $pid != $params['projectIds'][0] ? ', ' : '';
        $pidSql .= $db->convertInt($pid);
      }
      $pidSql .= ')';
      
      // set default params
      if (!isset($params['status'])) { $params['status'] = explode(' ', MY_PROJECTS_MANAGER_DUE_DATE_STATUS); }
      $statuses = is_array($params['status']) ? $params['status'] : array($params['status']);
      $statusSql = 'p.status IN (';
      foreach($statuses as $status) {
        $statusSql .= $status != $statuses[0] ? ', ' : '';
        $statusSql .= $db->convertText($status);
      }
      $statusSql .= ')';
      
      $today = new SRA_GregorianDate();
      $today->jumpToStartOfDay();
      
      $start = NULL;
      $end = isset($params['end']) ? $params['end'] : NULL;
      if ($params['lateOnly']) {
        $end =& $today->copy();
        $end->jump(SRA_GREGORIAN_DATE_UNIT_SECOND, -1);
      }
      else if ($params['upcomingOnly']) {
        $start =& $today->copy();
        $end =& $user->getMyProjectsUpcomingThresholdDate();
      }
      $start = !$params['lateOnly'] && !$start && isset($params['start']) ? $params['start'] : $start;
      
      $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      $dueDates = array();
      $projectAccess = array();
      
      // projects
      if (!$params['taskOnly']) {
        $query = 'SELECT p.project_id, p.due_date, p.name, p.status, u.name 
                  FROM my_project p LEFT JOIN os_user u ON p.creator=u.uid 
                  WHERE p.due_date<>\'0000-00-00 00:00:00\' AND p.due_date IS NOT NULL AND ' . $pidSql . 
                  ' AND ' . $statusSql . ($end ? ' AND p.due_date <= ' . $db->convertDate($end) : '') . 
                  ($start ? ' AND p.due_date >= ' . $db->convertDate($start) : '');
        $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
        while($row =& $results->next()) {
          $projectAccess[$row[0]] = !$projectAccess[$row[0]] ? MyProjectVO::getUserPermissions($row[0]) : $projectAccess[$row[0]];
          if (!$projectAccess[$row[0]]) { continue; }
          
          $dueDates[] = array('projectId' => $row[0], 
                              'creator' => $row[4],
                              'dueDate' => $row[1] ? SRA_Util::attrToJavascript($row[1], NULL, NULL, TRUE) : NULL, 
                              'dueDateTime' => $row[1]->toInt(), 
                              'late' => !MyProjectVO::isStatusTerminal($row[3]) && $row[1]->compare($today) < 0,
                              'lateDays' => !MyProjectVO::isStatusTerminal($row[3]) && $row[1]->compare($today) < 0 ? $row[1]->getDayDelta($today) : 0,
                              'name' => $row[2],
                              'permissions' => $projectAccess[$row[0]], 
                              'readOnly' => $projectAccess[$row[0]] != MY_PROJECT_PERMISSIONS_ADMIN,
                              'status' => $row[3],
                              'statusStr' => $resources->getString($row[3]),
                              'today' => $row[1]->isToday(),
                              'upcoming' => !MyProjectVO::isStatusTerminal($row[3]) && $user->isInMyProjectsUpcomingThreshold($row[1]));
        }
      }
      // tasks
      $query = 'SELECT p.project_id, p.task_id, p.disabled, p.wf_locked, p.due_date, p.title, p.read_only, p.change_restriction, p.creator, p.strict_permissions, p.status, u.name, p.list 
                FROM my_project_task p LEFT JOIN os_user u ON p.creator=u.uid WHERE 
                p.due_date<>\'0000-00-00 00:00:00\' AND p.due_date IS NOT NULL AND ' . $pidSql . 
                ' AND ' . $statusSql . ($end ? ' AND p.due_date <= ' . $db->convertDate($end) : '') . 
                ($start ? ' AND p.due_date >= ' . $db->convertDate($start) : '');
      $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN));
      while($row =& $results->next()) {
        $projectAccess[$row[0]] = !$projectAccess[$row[0]] ? MyProjectVO::getUserPermissions($row[0]) : $projectAccess[$row[0]];
        if (!($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_TASKS_READ)) { continue; }
        
        // only return tasks that the current user has ownership of
        if (!$params['unowned'] && !MyProjectTaskVO::isResponsibleForPid('u' . $user->getUid(), $row[1])) { continue; }
        
        $dueDates[] = array('projectId' => $row[0], 
                            'taskId' => $row[1],
                            'canToggleStatus' => MyProjectTaskVO::canToggleStatus($row[1]), 
                            'canToggleStatusMsg' => MyProjectTaskVO::canToggleStatus($row[1], TRUE), 
                            'creator' => $row[11], 
                            'disabled' => $row[2] || $row[3],
                            'dueDate' => $row[4] ? SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE) : NULL, 
                            'dueDateTime' => $row[4]->toInt(),
                            'icon' => $row[12] ? 'task-list.png' : 'task.png', 
                            'late' => !MyProjectVO::isStatusTerminal($row[10]) && $row[4]->compare($today) < 0,
                            'lateDays' => !MyProjectVO::isStatusTerminal($row[10]) && $row[4]->compare($today) < 0 ? $row[4]->getDayDelta($today) : 0,
                            'name' => $row[5], 
                            'permissions' => $projectAccess[$row[0]], 
                            'readOnly' => MyProjectTaskVO::isUserReadOnly($row[1]),
                            'status' => $row[10],
                            'statusStr' => $resources->getString($row[10]),
                            'today' => $row[4]->isToday(),
                            'upcoming' => !MyProjectVO::isStatusTerminal($row[10]) && $user->isInMyProjectsUpcomingThreshold($row[4]));
      }
      // remove read-only due dates
      $includeReadOnly = isset($params['readOnly']) && $params['readOnly'];
      if (!$includeReadOnly) {
        $keys = array_keys($dueDates);
        foreach($keys as $key) {
          if ($dueDates[$key]['readOnly']) { unset($dueDates[$key]); }
        }
      }
      $dueDates =& SRA_Util::sortObjects($dueDates, 'dueDateTime', FALSE, FALSE, FALSE);
      
      return $dueDates;
    }
    else {
      SRA_Error::logError($params, __FILE__, __LINE__);
      return SRA_Error::logError('MyProjectsManager::getProjectEvents - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getFiles
	/**
	 * ajax service method used to retrieve project files. this method accepts the 
   * following params:
   * 
   *  fileId:         the id of a specific file to return. if specified, the 
   *                  return value will be a single file value and not an array
   *  projectIds:     an array (or single) of project ids to return files for
   *  categoryId:     an optional category filter (the label of the category to 
   *                  limit files to)
   *  preview:        whether or not to include 'preview' in the return. the 
   *                  default is true
   *  search:         an optional search string to filter for. when provided, 
   *                  the files returned will be sorted by relevance to this 
   *                  search string
   *  sortCol:        the my_project_file column to sort on. the default is name
   *                  does not apply when a 'search' parameter is specified
   *  sortDesc:       whether or not to sort DESC. default is ASC. does not 
   *                  apply when a 'search' parameter is specified
   *  versions:       whether or not to include 'versions' in the return. the 
   *                  default is false
   * 
   * the return value for this method is an array (sorted by name in descending 
   * order) where each value in the array will be a hash with the following 
   * keys:
   * 
   *  fileId:         the file id
   *  projectId:      the project id for the file
   *  category:       if this file pertains to a category, this value will be 
   *                  the label for that category
   *  changeRestriction: the file change restriction. this is a hash with the 
   *                  following keys:
   *                    label: the label to use for this participant
   *                    pid:   the participant id
   *  commentId:      if this file is linked to a comment, this will be the id 
   *                  of that comment
   *  created:        javascript date object when this file was created
   *  creator:        the name of the user that created this file
   *  icon:           the uri to the icon for this file. this uri will contain 
   *                  the substring "{$size}" which should be replaced with 
   *                  16|32|64 accordingly
   *  icon32:         the uri to the 32 pixel thumbnail icon for this file (if 
   *                  applicable)
   *  icon64:         the uri to the 64 pixel thumbnail icon for this file (if 
   *                  applicable)
   *  lastUpdated:    javascript date object when this file was last updated
   *  lastUpdatedBy:  the name of the user that last updated this file
   *  messageId:      if this file is linked to a message, this will be the id 
   *                  of that message
   *  messageTitle:   if this file is linked to a message, this will be the 
   *                  title of that message
   *  name:           the file name
   *  preview:        returned when the 'preview' parameter is true (or not 
   *                  specified). this value will be an array of hashes each 
   *                  with the following keys (null when does not exist):
   *                    previewPageId: the id for the preview page
   *                    pageNum:       the page number for this preview page. 
   *                                   the 'preview' array will be ordered by 
   *                                   this value in ascending order
   *                    uri:           the uri to the image for this preview 
   *                                   page. the image will 250 pixels wide 
   *                                   (the height will be variable and 
   *                                   proportionate to the width)
   *  readOnly:       whether or not the current user has read-only access to 
   *                  this file. if false, they have full privileges
   *  readOnlyFlag:   the current readOnly file attribute value
   *  score:          the full text search score. returned if 'search' specified
   *  size:           the label representing the size to use for this file
   *  taskId:         if this file is linked to a task, this will be the id of 
   *                  that task
   *  taskTitle:      if this file is linked to a task, this will be the title 
   *                  of that task
   *  uri:            the uri for this file
   *  version:        the current version # of this file
   *  versionLabel:   the label to use to represent the version
   *  versioning:     the versioning level for this file (0=no versioning)
   *  versions:       returned when the versioning>0 and the 'versions' 
   *                  parameter is true. this value will be an array (ordered 
   *                  with the most recent version first and the oldest last) of 
   *                  hashes each with the following keys (null when does no 
   *                  versions exist):
   *                    versionId:     the id for the version
   *                    created:       same meaning as enclosing file hash
   *                    creator:       same meaning as enclosing file hash
   *                    icon:          same meaning as enclosing file hash
   *                    icon32:        same meaning as enclosing file hash
   *                    icon64:        same meaning as enclosing file hash
   *                    lastUpdated:   same meaning as enclosing file hash
   *                    lastUpdatedBy: same meaning as enclosing file hash
   *                    name:          same meaning as enclosing file hash
   *                    readOnly:      same meaning as enclosing file hash
   *                    readOnlyFlag:  same meaning as enclosing file hash
   *                    size:          same meaning as enclosing file hash
   *                    uri:           the uri for this file version
   *                    version:       version # for this version of the file
   *                    versionLabel:  the version label
   * 
   * @param array $params the method params (see above)
   * @access public
   * @return array
	 */
	function &getFiles($params) {
    global $user;
    if (isset($params['projectIds']) && !is_array($params['projectIds'])) { $params['projectIds'] = array($params['projectIds']); }
    if ($user && (isset($params['fileId']) || (isset($params['projectIds']) && count($params['projectIds'])))) {
      $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      SRA_DaoFactory::getDao('MyProjectFile');
      $db =& SRA_Controller::getAppDb();
      $files = array();
      $category = isset($params['categoryId']) ? SRA_Database::getQueryValue($db, 'SELECT name FROM my_project_file_category WHERE category_id=' . $params['categoryId']) : NULL;
      $types = array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_FLOAT, SRA_DATA_TYPE_BOOLEAN);
      $query = 'SELECT file_id, project_id, category, comment_id, created, creator, icon, icon_thumbnail32_uri, icon_thumbnail64_uri, last_updated, last_updated_by, message_id, name, task_id, file_uri, version, versioning, change_restriction, file_size, read_only';
      if (isset($params['search'])) {
        $types[] = SRA_DATA_TYPE_FLOAT;
        $query .= ', MATCH(file_index) AGAINST (' . $db->convertText($params['search']) . ' IN BOOLEAN MODE) as score';
      }
      $query .= ' FROM my_project_file WHERE ' . (isset($params['fileId']) ? 'file_id=' . $params['fileId'] : 'project_id IN (' . implode(', ', $params['projectIds']) . ')');
      $query .= $category ? ' AND category=' . $db->convertText($category) : '';
      if (isset($params['search'])) {
        $query .= ' HAVING score>0';
        $query .= ' ORDER BY score DESC';
      }
      $sortCol = isset($params['sortCol']) ? $params['sortCol'] : 'name';
      $sortMethod = $params['sortDesc'] ? 'DESC' : 'ASC';
      $query .= ' ' . (strpos($query, 'ORDER BY') ? ', ' : ' ORDER BY') . " ${sortCol} ${sortMethod}";
      $results =& $db->fetch($query, $types);
      while($row =& $results->next()) {
        $file = array('fileId' => $row[0], 'projectId' => $row[1], 'category' => $row[2], 'commentId' => $row[3], 
                      'created' => SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE),
                      'icon' => MY_PROJECTS_MANAGER_ICONS_BASE_URI . ($row[6] ? basename($row[6]) : 'unknown.png'), 
                      'icon32' => $row[7], 'icon64' => $row[8], 
                      'lastUpdated' => SRA_Util::attrToJavascript($row[9], NULL, NULL, TRUE), 
                      'lastUpdatedBy' => $row[10], 'messageId' => $row[11], 'name' => $row[12], 
                      'readOnly' => MyProjectFileVO::isUserReadOnly($row[0]), 'taskId' => $row[13], 
                      'readOnlyFlag' => $row[19], 'size' => MyProjectFileVO::getFileSizeDesc($row[18]), 
                      'uri' => $row[14], 'version' => $row[15], 
                      'versionLabel' => $resources->getString('MyProjectFile.versionLabel', array('version' => $row[15])), 
                      'versioning' => $row[16]);
        $file['creator'] = OsUserVO::getNameFromUid($row[5]);
        if ($file['commentId']) { $file['messageId'] = SRA_Database::getQueryValue($db, 'SELECT message_id FROM my_project_comment WHERE comment_id=' . $file['commentId'], SRA_DATA_TYPE_INT); }
        if ($file['messageId']) { $file['messageTitle'] = SRA_Database::getQueryValue($db, 'SELECT title FROM my_project_message WHERE message_id=' . $file['messageId']); }
        if (!isset($params['preview']) || $params['preview']) {
          $file['preview'] = array();
          $presults =& $db->fetch('SELECT preview_page_id, page_num, preview_page_uri FROM my_project_file_preview_page WHERE file_id=' . $row[0] . ' ORDER BY page_num ASC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT));
          while($prow =& $presults->next()) {
            $file['preview'][] = array('previewPageId' => $prow[0], 'pageNum' => $prow[1], 'uri' => $prow[2]);
          }
          if (!count($file['preview'])) { $file['preview'] = NULL; }
        }
        if ($row[17]) {
          $dao =& SRA_DaoFactory::getDao('MyProjectParticipant');
          $participant =& $dao->findByPk($row[17]);
          $file['changeRestriction'] = array('label' => $participant->getLabel(), 'pid' => $participant->getPid());
        }
        else {
          $file['changeRestriction'] = NULL;
        }
        if (isset($params['search'])) { $file['score'] = $row[20]; }
        if ($file['taskId']) { $file['taskTitle'] = SRA_Database::getQueryValue($db, 'SELECT title FROM my_project_task WHERE task_id=' . $file['taskId']); }
        if ($file['versioning'] && isset($params['versions']) && $params['versions']) {
          $file['versions'] = array();
          $vresults =& $db->fetch('SELECT version_id, created, creator, icon, icon_thumbnail32_uri, icon_thumbnail64_uri, last_updated, last_updated_by, name, version, file_size, file_uri, read_only FROM my_project_file_version WHERE file_id=' . $row[0] . ' ORDER BY version_id DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_FLOAT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN));
          while($vrow =& $vresults->next()) {
            $file['versions'][] = array('versionId' => $vrow[0], 'created' => SRA_Util::attrToJavascript($vrow[1], NULL, NULL, TRUE), 
                             'creator' => OsUserVO::getNameFromUid($vrow[2]), 
                             'icon' => MY_PROJECTS_MANAGER_ICONS_BASE_URI . ($vrow[3] ? basename($vrow[3]) : 'unknown.png'), 
                             'icon32' => $vrow[4], 'icon64' => $vrow[5], 'lastUpdated' => SRA_Util::attrToJavascript($vrow[6], NULL, NULL, TRUE), 
                             'lastUpdatedBy' => $vrow[7], 'name' => $vrow[8], 'readOnly' => MyProjectFileVersionVO::isUserReadOnly($row[0]), 
                             'readOnlyFlag' => $vrow[12], 'size' => MyProjectFileVO::getFileSizeDesc($vrow[10]), 
                             'uri' => $vrow[11], 'version' => $vrow[9], 
                             'versionLabel' => $resources->getString('MyProjectFile.versionLabel', array('version' => $vrow[9])));
          }
          if (!count($file['versions'])) { $file['versions'] = NULL; }
        }
        $files[] = $file;
      }
      $nl = NULL;
      return isset($params['fileId']) ? (count($files) ? $files[0] : $nl) : $files;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getFiles - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getLatestActivity
	/**
	 * ajax service method used to load the latest project activity. project 
   * activity includes tasks, messages, comments, whiteboards and files
   *   projectIds:   an array of ids identifying the projects that the latest 
   *                 activity should be returned for (REQUIRED)
   *   end:          end date threshold (<=) if not specified, none is applied
   *   limit:        the max # of items per project to return. if not specified, 
   *                 MY_PROJECTS_MANAGER_LATEST_ACTIVITY_LIMIT will be used. no 
   *                 limit is applied when the rss param is true
   *   rss:          true when this method is being invoked for the rss feed. 
   *                 in this case, lastUpdated will be a regular 
   *                 SRA_GregorianDate object
   *   start:        start date threshold (>=) if not specified, none is applied
   * 
   * and returns an array of data (for which the user has read access to) each 
   * of which is a hash with the following keys (sorted by lastUpdated 
   * descending):
   *   id:           the item uid (c|f|m|t|w)[item id]
   *   projectId:    the project id for this activity
   *   projectName:  the project name for this activity (only when rss param is 
   *                 true AND there is more than 1 project in the results)
   *   commentId:    the comment id (if applicable - will also have a messageId 
   *                 or whiteboardId from below and the name will be the name 
   *                 of those activities)
   *   daysAgo:      how many days ago this activity occurred
   *   description:  if rss param is true, this will be the description of the 
   *                 item which is the full comment html text for comments, the 
   *                 html message body for messages, nothing for files, the 
   *                 thumbnail uri for whiteboards, and the html description for 
   *                 tasks
   *   fileId:       the file id (if applicable)
   *   icon:         the name of the icon to use to represent this item (not 
   *                 applicable for files)
   *   iconUri:      the uri to the 16 pixel icon (for files only)
   *   iconUri32:    the uri to the 32 pixel icon (for files only)
   *   messageId:    the message id (if applicable - messages or comments only)
   *   status:       the current task status (for tasks only)
   *   taskId:       the task id (if applicable)
   *   whiteboardId: the whiteboard id (if applicable)
   *   lastUpdated:  when the item was last updated as a javascript date object
   *                 unless the rss param is true, in which case it will be a 
   *                 standard SRA_GregorianDate object
   *   lastUpdatedBy:the name of the user that last updated this item
   *   name:         the item name (task/message/whiteboard title OR file name)
   *   permissions:  the user's permissions to the project
   *   uri:          the item uri (for files and whiteboards only)
   *   
   * @param array $params the method params. contains a single value: projectId
   * @access public
   * @return object
	 */
	function &getLatestActivity($params) {
    global $user;
    if ($user && array_key_exists('projectIds', $params) && count($params['projectIds'])) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $tmp =& SRA_DaoFactory::getDao('MyProjectFile');
      $db =& SRA_Controller::getAppDb(); 
      
      $latestActivity = array();
      $pids = $params['projectIds'];
      $activityCounts = array();
      $permissions = array();
      $limit = $params['rss'] ? 10000 : (isset($params['limit']) ? (int) $params['limit'] : MY_PROJECTS_MANAGER_LATEST_ACTIVITY_LIMIT);
      $commentIds = array();
      $today = new SRA_GregorianDate();
      
      foreach($pids as $pid) {
        $permissions[$pid] = MyProjectVO::getUserPermissions($pid);
        $activityCounts[$pid] = 0;
      }
      
      // files
      $filePids = NULL;
      $filePidCount = 0;
      foreach($pids as $pid) {
        if ($permissions[$pid] & MY_PROJECT_PERMISSIONS_FILES_READ) {
          !$filePids ? $filePids = 'project_id IN (' : $filePids .= ', ';
          $filePids .= $db->convertInt($pid);
          $filePidCount++;
        }
      }
      if ($filePids) {
        $filePids .= ')';
        $results =& $db->fetch('SELECT project_id, file_id, last_updated, last_updated_by, name, icon, file_uri FROM my_project_file WHERE ' . $filePids . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT), $limit*$filePidCount);
        while($row =& $results->next()) {
          $latestActivity[] = array('id' => 'f' . $row[1], 'projectId' => $row[0], 'fileId' => $row[1], 'daysAgo' => $row[2]->getDayDelta($today), 'lastUpdated' => (!$params['rss'] ? SRA_Util::attrToJavascript($row[2], NULL, NULL, TRUE) : $row[2]), 'lastUpdatedTime' => $row[2]->getUnixTimeStamp(), 'lastUpdatedBy' => $row[3], 'name' => $row[4], 'iconUri' => MY_PROJECT_FILE_ICON_BASE_URI . '16/' . ($row[5] ? basename($row[5]) : 'unknown.png'), 'iconUri32' => MY_PROJECT_FILE_ICON_BASE_URI . '32/' . ($row[5] ? basename($row[5]) : 'unknown.png'), 'permissions' => $permissions[$row[0]], 'uri' => $row[6]);
        }
      }
      
      // messages
      $messagePids = NULL;
      $messagePidCount = 0;
      foreach($pids as $pid) {
        if ($permissions[$pid] & MY_PROJECT_PERMISSIONS_MESSAGES_READ) {
          !$messagePids ? $messagePids = 'project_id IN (' : $messagePids .= ', ';
          $messagePids .= $db->convertInt($pid);
          $messagePidCount++;
        }
      }
      if ($messagePids) {
        $messagePids .= ')';
        $results =& $db->fetch('SELECT project_id, message_id, last_updated, last_updated_by, title' . ($params['rss'] ? ', message_html' : '') . ' FROM my_project_message WHERE ' . $messagePids . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT), $limit*$messagePidCount);
        while($row =& $results->next()) {
          $latestActivity[] = array('id' => 'm' . $row[1], 'projectId' => $row[0], 'messageId' => $row[1], 'icon' => 'message.png', 'daysAgo' => $row[2]->getDayDelta($today), 'lastUpdated' => (!$params['rss'] ? SRA_Util::attrToJavascript($row[2], NULL, NULL, TRUE) : $row[2]), 'lastUpdatedTime' => $row[2]->getUnixTimeStamp(), 'lastUpdatedBy' => $row[3], 'name' => $row[4], 'permissions' => $permissions[$row[0]]);
          if ($params['rss']) { $latestActivity[count($latestActivity) - 1]['description'] = $row[5]; }
        }
      }
      
      // tasks
      $taskPids = NULL;
      $taskPidCount = 0;
      foreach($pids as $pid) {
        if ($permissions[$pid] & MY_PROJECT_PERMISSIONS_TASKS_READ) {
          !$taskPids ? $taskPids = 'project_id IN (' : $taskPids .= ', ';
          $taskPids .= $db->convertInt($pid);
          $taskPidCount++;
        }
      }
      if ($taskPids) {
        $taskPids .= ')';
        $results =& $db->fetch('SELECT project_id, task_id, last_updated, last_updated_by, title, status, list' . ($params['rss'] ? ', description_html' : '') . ' FROM my_project_task WHERE ' . $taskPids . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN), $limit*$taskPidCount);
        while($row =& $results->next()) {
          $latestActivity[] = array('id' => 't' . $row[1], 'projectId' => $row[0], 'taskId' => $row[1], 'icon' => $row[6] ? 'task-list.png' : 'task.png', 'daysAgo' => $row[2]->getDayDelta($today), 'lastUpdated' => (!$params['rss'] ? SRA_Util::attrToJavascript($row[2], NULL, NULL, TRUE) : $row[2]), 'lastUpdatedTime' => $row[2]->getUnixTimeStamp(), 'lastUpdatedBy' => $row[3], 'name' => $row[4], 'status' => $row[5], 'permissions' => $permissions[$row[0]]);
          if ($params['rss']) { $latestActivity[count($latestActivity) - 1]['description'] = $row[7]; }
        }
      }
      
      // whiteboards
      $whiteboardPids = NULL;
      $whiteboardPidCount = 0;
      foreach($pids as $pid) {
        if ($permissions[$pid] & MY_PROJECT_PERMISSIONS_WHITEBOARDS_READ) {
          !$whiteboardPids ? $whiteboardPids = 'project_id IN (' : $whiteboardPids .= ', ';
          $whiteboardPids .= $db->convertInt($pid);
          $whiteboardPidCount++;
        }
      }
      if ($whiteboardPids) {
        $whiteboardPids .= ')';
        $types = array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT);
        if ($params['rss']) {
          $types[] = SRA_DATA_TYPE_TEXT;
        }
        $results =& $db->fetch('SELECT project_id, whiteboard_id, last_updated, last_updated_by, title, whiteboard_uri' . ($params['rss'] ? ', thumbnail_uri' : '') . ' FROM my_project_whiteboard WHERE ' . $whiteboardPids . ' ORDER BY last_updated DESC', $types, $limit*$whiteboardPidCount);
        while($row =& $results->next()) {
          $latestActivity[] = array('id' => 'w' . $row[1], 'projectId' => $row[0], 'whiteboardId' => $row[1], 'icon' => 'whiteboard.png', 'daysAgo' => $row[2]->getDayDelta($today), 'lastUpdated' => (!$params['rss'] ? SRA_Util::attrToJavascript($row[2], NULL, NULL, TRUE) : $row[2]), 'lastUpdatedTime' => $row[2]->getUnixTimeStamp(), 'lastUpdatedBy' => $row[3], 'name' => $row[4], 'permissions' => $permissions[$row[0]], 'uri' => $row[5]);
          if ($params['rss']) { $latestActivity[count($latestActivity) - 1]['description'] = $row[6]; }
        }
      }
      
      // comments
      $commentProjects = array();
      $keys = array_keys($latestActivity);
      $messagePids = NULL;
      $messageNames = array();
      $whiteboardNames = array();
      $whiteboardPids = NULL;
      foreach($keys as $key) {
        if (isset($latestActivity[$key]['messageId'])) {
          !$messagePids ? $messagePids = 'message_id IN (' : $messagePids .= ', ';
          $messagePids .= $db->convertInt($latestActivity[$key]['messageId']);
          $commentProjects[$latestActivity[$key]['projectId']] = TRUE;
          $messageNames[$latestActivity[$key]['messageId']] = $latestActivity[$key]['name'];
        }
        else if (isset($latestActivity[$key]['whiteboardId'])) {
          !$whiteboardPids ? $whiteboardPids = 'whiteboard_id IN (' : $whiteboardPids .= ', ';
          $whiteboardPids .= $db->convertInt($latestActivity[$key]['whiteboardId']);
          $commentProjects[$latestActivity[$key]['projectId']] = TRUE;
          $whiteboardNames[$latestActivity[$key]['whiteboardId']] = $latestActivity[$key]['name'];
        }
      }
      if ($messagePids || $whiteboardPids) {
        if ($messagePids) { $messagePids .= ')'; }
        if ($whiteboardPids) { $whiteboardPids .= ')'; }
        $pidsSql = $messagePids && $whiteboardPids ? $messagePids . ' OR ' . $whiteboardPids : ($messagePids ? $messagePids : $whiteboardPids);
        $results =& $db->fetch('SELECT project_id, comment_id, message_id, whiteboard_id, last_updated, last_updated_by' . ($params['rss'] ? ', comment_html' : '') . ' FROM my_project_comment WHERE ' . $pidsSql . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT), $limit*count($commentProjects));
        while($row =& $results->next()) {
          $latestActivity[] = array('id' => 'c' . $row[1], 'projectId' => $row[0], 'commentId' => $row[1], 'icon' => 'comment.png', 'daysAgo' => $row[4]->getDayDelta($today), 'lastUpdated' => (!$params['rss'] ? SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE) : $row[4]), 'lastUpdatedTime' => $row[4]->getUnixTimeStamp(), 'lastUpdatedBy' => $row[5], 'name' => ($row[2] ? $messageNames[$row[2]] : $whiteboardNames[$row[3]]), 'permissions' => $permissions[$row[0]]);
          if ($row[2]) { $latestActivity[count($latestActivity) - 1]['messageId'] = $row[2]; }
          if ($row[3]) { $latestActivity[count($latestActivity) - 1]['whiteboardId'] = $row[3]; }
          if ($params['rss']) { $latestActivity[count($latestActivity) - 1]['description'] = $row[6]; }
        }
      }
      
      shuffle($latestActivity);
      $latestActivity =& SRA_Util::sortObjects($latestActivity, 'lastUpdatedTime', FALSE, TRUE);
      
      // adjust for limits
      $adjustedLatestActivity = array();
      $keys = array_keys($latestActivity);
      foreach($keys as $key) {
        $pid = $latestActivity[$key]['projectId'];
        if ($activityCounts[$pid] < $limit) {
          $adjustedLatestActivity[] = $latestActivity[$key];
        }
        $activityCounts[$pid]++;
      }
      
      // add project names
      if ($params['rss'] && count($pids) > 1) {
        $keys = array_keys($adjustedLatestActivity);
        foreach($keys as $key) {
          $adjustedLatestActivity[$key]['projectName'] = SRA_Database::getQueryValue($db, 'SELECT name FROM my_project WHERE project_id=' . $adjustedLatestActivity[$key]['projectId']);
        }
      }
      
      return $adjustedLatestActivity;
    }
    else {
      SRA_Error::logError($params, __FILE__, __LINE__);
      return SRA_Error::logError('MyProjectsManager::getLatestActivity - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getParticipants
	/**
	 * ajax service method used to retrieve the participants for a project. this 
   * method uses the following params:
   *
   *   permissions:  a minimum permissions threshold. if not specified, no 
   *                 minimum permissions threshold will be applied
   *   projectId:    the id of the project to return the participants for 
   *                 (required). if this is an array, the return pids will be 
   *                 either e, u or g prefixed
   *   skip:         an array of pids to skip in the return results (see pid 
   *                 format description below). if a value in this array is 
   *                 numeric (not prefixed with c, p, e or u), then it will be 
   *                 treated as a uid and any participants with that uid will be
   *                 removed (of type c, p or u)
   *   types:        the types of participants to include. this is a bitmask 
   *                 containing one or more of the 
   *                 MY_PROJECTS_MANAGER_PARTICIPANT_* constant values. the 
   *                 default type is users, groups and email participants
   *   
   * and returns an array of participants with the following keys (indexed by 
   * pid):
   *  
   *   id:           the group or user id (for all types except MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL)
   *   label:        the participant label. the project name will be appended to 
   *                 this value in parenthesis if the 'projectId' parameter is 
   *                 an array
   *   participantId:the participant id (for all types except MY_PROJECTS_MANAGER_PARTICIPANT_CREATOR)
   *   permissions:  the participant permissions
   *   pid:          the unique identifier for this participant. will be one of 
   *                 the following values:
   *                   c[id]: id=creator uid (type=MY_PROJECTS_MANAGER_PARTICIPANT_CREATOR)
   *                   p[id]: id=participant id (type=MY_PROJECTS_MANAGER_PARTICIPANT_USER or MY_PROJECTS_MANAGER_PARTICIPANT_GROUP)
   *                   e[id]: id=participant id (type=MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL) - if 'projectId' parameter is an array id will be the email address
   *                   u[id]: id=uid (type=MY_PROJECTS_MANAGER_PARTICIPANT_GROUP_USER) - if 'projectId' parameter is an array, c and p prefixed pids are replaced with this prefix
   *                   g[id]: id=gid (type=MY_PROJECTS_MANAGER_PARTICIPANT_GROUP) - only used when 'projectId' parameter is an array - replaces group by p prefixed pids
   *   type:         the participant type. one of the 
   *                 MY_PROJECTS_MANAGER_PARTICIPANT_* constants. if not 
   *                 specified, only the MY_PROJECTS_MANAGER_PARTICIPANT_USER, 
   *                 MY_PROJECTS_MANAGER_PARTICIPANT_GROUP and 
   *                 MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL types will be 
   *                 returned
   *   
   * @param array $params the method params. contains a single value: projectId
   * @access public
   * @return object
	 */
	function &getParticipants($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProject');
    if ($user && array_key_exists('projectId', $params) && is_array($params['projectId']) && count($params['projectId']) != 1) {
      $results = array();
      foreach($params['projectId'] as $projectId) {
        $params['projectId'] = $projectId;
        $projectName = SRA_Database::getQueryValue(SRA_Controller::getAppDb(), 'SELECT name FROM my_project WHERE project_id=' . $projectId);
        if ($presults =& MyProjectsManager::getParticipants($params)) {
          $keys = array_keys($presults);
          foreach($keys as $key) {
            $newKey = $key;
            if (substr($key, 0, 1) == 'c' || substr($key, 0, 1) == 'p') {
              $newKey = (($presults[$key]['type'] & MY_PROJECTS_MANAGER_PARTICIPANT_GROUP) ? 'g' : 'u') . $presults[$key]['id'];
            }
            else if (substr($key, 0, 1) == 'e') {
              $newKey .= 'e' . SRA_Database::getQueryValue(SRA_Controller::getAppDb(), 'SELECT email FROM my_project_email_participant WHERE participant_id=' . $presults[$key]['participantId']);
            }
            if (!$params['skip'] || !in_array($newKey, $params['skip'])) {
              $results[$newKey] =& $presults[$key];
            }
          }
        }
      }
      return $results;
    }
    else if ($user && array_key_exists('projectId', $params) && (MyProjectVO::isValid($project =& $dao->findByPk(is_array($params['projectId']) && count($params['projectId']) == 1 ? $params['projectId'][0] : $params['projectId']))) && $project->verifyPermissions()) {
      $results = array();
      
      $permissions = $params['permissions'] ? $params['permissions'] * 1 : 0;
      $types = $params['types'] ? $params['types'] * 1 : MY_PROJECTS_MANAGER_PARTICIPANT_USER | MY_PROJECTS_MANAGER_PARTICIPANT_GROUP | MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL;
      $uids = array();
      if ($params['skip']) {
        foreach($params['skip'] as $pid) {
          if (is_numeric($pid)) {
            $uids[] = $pid;
            unset($params['skip'][$pid]);
          }
        }
      }
      
      // creator
      if ($types & MY_PROJECTS_MANAGER_PARTICIPANT_CREATOR && !in_array($project->getCreator(), $uids)) {
        $uid = $project->getCreator();
        $uids[] = $uid;
        $pid = (is_array($params['projectId']) ? 'u' : 'c') . $project->getCreator();
        $results[$pid] = array('id' => $uid, 'label' => $project->getCreatorName(), 'participantId' => NULL, 'permissions' => MY_PROJECT_PERMISSIONS_ADMIN, 'pid' => $pid, 'type' => MY_PROJECTS_MANAGER_PARTICIPANT_CREATOR);
      }
      
      // email participants
      if (($types & MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL) && ($participants =& $project->getEmailParticipants())) {
        $keys = array_keys($participants);
        foreach($keys as $key) {
          if (!$permissions || (($permissions & $participants[$key]->getPermissions()) == $permissions)) {
            $pid = 'e' . (is_array($params['projectId']) ? $participants[$key]->getEmail() : $participants[$key]->getParticipantId());
            $results[$pid] = array('id' => NULL, 'label' => $participants[$key]->getLabel(), 'participantId' => $participants[$key]->getParticipantId(), 'permissions' => $participants[$key]->getPermissions(), 'pid' => $pid, 'type' => MY_PROJECTS_MANAGER_PARTICIPANT_EMAIL);
          }
        }
      }
      
      // standard participants
      if (($types & (MY_PROJECTS_MANAGER_PARTICIPANT_USER | MY_PROJECTS_MANAGER_PARTICIPANT_GROUP | MY_PROJECTS_MANAGER_PARTICIPANT_GROUP_USER)) && ($participants =& $project->getParticipants())) {
        $keys = array_keys($participants);
        foreach($keys as $key) {
          if (!$permissions || (($permissions & $participants[$key]->getPermissions()) == $permissions)) {
            if ((!$participants[$key]->isIsGroup() && ($types & MY_PROJECTS_MANAGER_PARTICIPANT_USER)) || ($participants[$key]->isIsGroup() && ($types & MY_PROJECTS_MANAGER_PARTICIPANT_GROUP))) {
              if (!$participants[$key]->isIsGroup() && in_array($participants[$key]->getId(), $uids)) {
                continue;
              }
              else if (!$participants[$key]->isIsGroup()) {
                $uids[] = $participants[$key]->getId(); 
              }
              
              $pid = (is_array($params['projectId']) ? ($participants[$key]->isIsGroup() ? 'g' : 'u') : 'p') . (is_array($params['projectId']) ? $participants[$key]->getId() : $participants[$key]->getParticipantId());
              $results[$pid] = array('id' => $participants[$key]->getId(), 'label' => $participants[$key]->getLabel(), 'participantId' => $participants[$key]->getParticipantId(), 'permissions' => $participants[$key]->getPermissions(), 'pid' => $pid, 'type' => $participants[$key]->isIsGroup() ? MY_PROJECTS_MANAGER_PARTICIPANT_GROUP : MY_PROJECTS_MANAGER_PARTICIPANT_USER);
            }
            if ($participants[$key]->isIsGroup() && ($types & MY_PROJECTS_MANAGER_PARTICIPANT_GROUP_USER)) {
              if (!$group) {
                $dao =& SRA_DaoFactory::getDao('OsGroup');
                $group =& $dao->newInstance();
              }
              foreach($group->getUserHash($participants[$key]->getId()) as $uid => $name) {
                if (!in_array($uid, $uids)) {
                  $uids[] = $uid;
                  $pid = 'u' . $uid;
                  $results[$pid] = array('id' => $uid, 'label' => $name, 'participantId' => $participants[$key]->getParticipantId(), 'permissions' => $participants[$key]->getPermissions(), 'pid' => $pid, 'type' => MY_PROJECTS_MANAGER_PARTICIPANT_GROUP_USER);
                }
              }
            }
          }
        }
      }
      
      // remove skip pids
      if ($params['skip']) {
        foreach($params['skip'] as $pid) {
          if (isset($results[$pid])) { unset($results[$pid]); }
        }
      }
      
      return $results;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getParticipants - Failed: no current active user or no projectId param invalid or not specified or user does not have permission to access the project', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ getTasks
	/**
	 * ajax service method used to retrieve project tasks. this method accepts the 
   * following params:
   * 
   *  changeRestriction: whether or not to include the task change restriction. 
   *                  default is false
   *  description:    whether or not to include the task description. default is
   *                  false
   *  files:          whether or not to include files in the return. default is
   *                  false
   *  hierarchy:      whether or not to build and return the tasks as 
   *                  hierarchies representing the parent/child relationships 
   *                  between tasks. the default for thie parameter is false 
   *                  meaning the return will just be a flat array of matching 
   *                  tasks with no indication of the hierarchical relationship 
   *                  between them
   *  lateOnly:       whether or not to just return matching tasks that are 
   *                  currently late. both lateOnly and upcomingOnly should not 
   *                  be specified
   *  messages:       whether or not to include messaages in the return. default 
   *                  is false
   *  pid:            only return tasks assigned to this participant. this 
   *                  parameter should use the following convention: u[uid], 
   *                  g[gid], or e[email] (for email participants)
   *  projectIds:     the ids of projects to return tasks for. either this or 
   *                  the 'taskIds' parameter is required
   *  skipTasks:      an optional array ids (or a single id) of tasks to skip
   *  status:         only return tasks in this status. multiple statuses may be 
   *                  specified separated by a space
   *  taskId:         if being invoked for a single task, use this parameter 
   *                  instead of 'taskIds' and the return value will be a single 
   *                  hash with the keys below (instead of an array)
   *  taskIds:        the ids of specific tasks to return. either this or the 
   *                  'projectIds' parameter is required. if this parameter is 
   *                  provided, the 'hierarchy' and 'projectIds' parameters will 
   *                  be ignored
   *  topLevelOnly:   whether or not to just return the top/root level matching 
   *                  tasks. both hierarchy and this parameter should not be 
   *                  true
   *  upcomingOnly:   whether or not to just return matching tasks within the 
   *                  user's upcoming theshold. both lateOnly and upcomingOnly 
   *                  should not be specified
   *  view:           whether or not to return the view associated with this 
   *                  task (when applicable)
   *  whiteboards:    whether or not to include whiteboards in the return.  
   *                  default is false
   *  _parent:        used internally only to create a task hierarchy
   * 
   * the return value for this method is an array (sorted by dueDate in 
   * ascending order) where each value in the array will be a hash with the 
   * following keys:
   * 
   *  projectId:      the project id for the task
   *  taskId:         the taskId
   *  canToggleStatus:whether or not the status of this task can be toggled by 
   *                  the current user. this means, whether or not the user can 
   *                  change the status from active to completed and vise-versa. 
   *                  whether or not this is possible will depend on a variety 
   *                  of factors including the following: 
   *                    - whether or not the task is disabled
   *                    - whether or not the task is currently active/completed
   *                    - whether or not the task is locked by the workflow
   *                    - whether or not the user has task write permission
   *                    - whether or not the task is a list
   *                    - if the status is active:
   *                        - children must be completed
   *                        - predecessor must be completed
   *                    - if the status is completed:
   *                        - all parent tasks must be completed
   *                        - no successor tasks can be completed
   *  canToggleStatusCode: if the task status cannot be toggled, this value will 
   *                  be the code defining why it cannot be toggled. this value 
   *                  will be one of the following values:
   *                    1     = disabled
   *                    2     = wf locked
   *                    3     = not active or completed
   *                    4     = no write access
   *                    5     = active and predecessor is not completed
   *                    6     = active and a child is not completed
   *                    7     = completed and parent is completed
   *                    8     = completed and a successor is completed
   *                    9     = task is a list
   *                    FALSE = status toggle not allowed (error)
   *  canToggleStatusMsg: if the task status cannot be toggled, this value will 
   *                  be a message describing why it cannot be toggled
   *  changeRestriction: the task change restriction (only present when the 
   *                  'changeRestriction' parameter is true). this is a hash 
   *                  with the following keys:
   *    label:        the label to use for this participant
   *    pid:          the unique identifier for this participant. will be one of 
   *                  the following values:
   *                   p[id]: id=participant id (type=user or group)
   *                   e[id]: id=participant id (type=email)
   *  created:        javascript date object representing when this discussion 
   *                  item was created
   *  creator         the name of the task creator
   *  datesLabel:     the label to use for the task dates (start and due dates)
   *  description:    the task description (only present when the 'description' 
   *                  parameter is true)
   *  descriptionHtml:the task html formatted description (only present when the 
   *                  'description' parameter is true)
   *  disabled:       whether or not this task is currently disabled
   *  dueDate:        javascript date object representing when this task is due 
   *                  or null if the task does not have a due date
   *  dueDateTime:    the due date unix timestamp (or 0 for not due date)
   *  durationActual: the actual task duration
   *  durationLabel:  the label to use for the task duration
   *  durationPlanned:the planned task duration
   *  ended:          javascript date object representing when this task was 
   *                  ended or null if the task has not been ended
   *  files:          an array of files (only present when the 'files' parameter 
   *                  is true and user has file read permissions for the task 
   *                  project) that are currently linked to this task sorted 
   *                  descending by last updated date. each value in this array 
   *                  will be a hash with the following keys:
   *    fileId:       the id of that file
   *    category:     the file category label (if applicable)
   *    icon:         the uri to the 16 pixel file icon
   *    name:         the name of the file
   *    uri:          the uri to the file
   *  icon:           the name of the icon to use for this task (task or list)
   *  isCompleted:    whether or not the task is currently completed
   *  lastUpdated:    javascript date object representing when this task was 
   *                  last updated
   *  lastUpdatedBy:  the name of the user that last updated this task
   *  late:           whether or not the task is late
   *  lateDays:       if the task is late, the # of days that it is late
   *  list            a list task is a task that contains sub-tasks but does not 
   *                  require any effort outside of those sub-tasks to complete
   *  messages:       an array of messages (only present when the 'messages' 
   *                  parameter is true and user has message read permissions 
   *                  for the task project) that are currently linked to this 
   *                  task sorted descending by last updated date. each value in 
   *                  this array will be a hash with the following keys:
   *    messageId:    the id of that message
   *    category:     the message category label (if applicable)
   *    title:        the message title
   *  parent:         a hash with the 'taskId' and 'title' of the parent task 
   *                  or null if this task does not have a parent
   *  percentComplete:the task completion percentage
   *  percentCompleteLabel: the label to use for percent complete
   *  predecessor:    a hash with the 'taskId' and 'title' of the predecessor 
   *                  task. or null if this task does not have a predecessor
   *  readOnly:       whether or not the current user has read-only access to 
   *                  this task. if false, they have full privileges
   *  readOnlyAttr:   whether or not the read-only attribute is true for the 
   *                  task
   *  startDate:      the task start date (if applicable)
   *  status:         the task status (not the status label)
   *  strictPermissions: whether or not this task uses strict permissions
   *  subTasks:       an array of sub-tasks for this task (only present when the 
   *                  'hierarchy' parameter is true)
   *  title:          the task title
   *  upcoming:       whether or not the task is upcoming
   *  view:           whether or not this task has a view associated with it
   *  viewContent:    if this task is associated with a workflow task that 
   *                  references a view, this value will be the contents of that 
   *                  view (only returned when the 'view' parameter is true)
   *  viewForm:       whether or not the task view is a form
   *  wfGenerated:    whether or not this is a workflow generated task (when 
   *                  true, either 'wfStepId' or 'wfTaskId' will also be set)
   *  wfLocked:       whether or not this task is currently locked because it is 
   *                  associated to an underlying workflow
   *  wfStepId:       id of the workflow step this task is associated to (if 
   *                  applicable)
   *  wfTaskId:       id of the workflow task this task is associated to (if 
   *                  applicable)
   *  whiteboards:    an array of whiteboards (only present when the 
   *                  'whiteboards' parameter is true and user has whiteboard 
   *                  read permissions for the task project) that are currently 
   *                  linked to this task sorted descending by last updated 
   *                  date. each value in this array will be a hash with the 
   *                  following keys:
   *    whiteboardId: the id of that whiteboard
   *    active:       whether or not that whiteboard is currently active
   *    category:     the whiteboard category label (if applicable)
   *    title:        the whiteboard title
   * @param array $params the method params (see above)
   * @access public
   * @return array
	 */
	function &getTasks($params) {
    global $user;
    if ($params['projectIds'] && !is_array($params['projectIds']) && is_numeric($params['projectIds'])) { $params['projectIds'] = array($params['projectIds']); }
    if ($params['taskId'] && is_numeric($params['taskId'])) { $params['taskIds'] = array($params['taskId']); }
    if ($params['skipTasks'] && is_numeric($params['skipTasks'])) { $params['skipTasks'] = array($params['skipTasks']); }
    if ($user && ($params['_parent'] || ((array_key_exists('taskIds', $params) && is_array($params['taskIds']) && count($params['taskIds'])) || 
                  (array_key_exists('projectIds', $params) && is_array($params['projectIds']) && count($params['projectIds']))))) {
                    
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $tmp =& SRA_DaoFactory::getDao('MyProjectTask');
      $db =& SRA_Controller::getAppDb();
      $today = new SRA_GregorianDate();
      $today->jumpToStartOfDay();
      
      $query = 'SELECT t.project_id, t.task_id, t.created, t.disabled, t.due_date, 
                       t.ended, t.last_updated, t.last_updated_by, t.list, t.parent, 
                       p.title, t.predecessor, pr.title, t.status, t.title, 
                       t.change_restriction, t.change_restriction_email, t.creator, 
                       u.name, t.strict_permissions, t.wf_task_id, t.wf_locked, 
                       t.wf_step_id, t.read_only, t.start_date, t.duration_actual, 
                       t.duration_planned, t.percent_complete' . 
                       ($params['description'] ? ', t.description, t.description_html ' : '') . 
                       ' FROM (my_project_task t) LEFT JOIN my_project_task p ON 
                       t.parent=p.task_id LEFT JOIN my_project_task pr ON 
                       t.predecessor=pr.task_id INNER JOIN os_user u ON t.creator=u.uid WHERE ';
      $projectAccess = array();
      $tasks = array();
      if ($params['_parent']) {
        $query .= ' t.parent=' . $params['_parent'];
      }
      else if (array_key_exists('taskIds', $params) && is_array($params['taskIds']) && count($params['taskIds'])) {
        $query .= 't.task_id IN (' . implode(', ', $params['taskIds']) . ')';
      }
      else {
        foreach($params['projectIds'] as $key => $projectId) {
          if (!$projectAccess[$projectId]) { $projectAccess[$projectId]=MyProjectVO::getUserPermissions($projectId); }
          if (!($projectAccess[$projectId] & MY_PROJECT_PERMISSIONS_TASKS_READ)) { 
            unset($params['projectIds'][$key]);
          }
        }
        if (count($params['projectIds'])) {
          $query .= 't.project_id IN (' . implode(', ', $params['projectIds']) . ')';
          if ($params['hierarchy'] || $params['topLevelOnly']) { $query .= ' AND t.parent IS NULL'; }
        }
        else {
          return $tasks;
        }
      }
      
      // late and upcoming
      if ($params['lateOnly']) {
        $query .= ' AND t.due_date IS NOT NULL AND t.due_date <> \'0000-00-00 00:00:00\' AND t.due_date <' . $db->convertDateTime($today);
      }
      else if ($params['upcomingOnly']) {
        $query .= ' AND t.due_date IS NOT NULL AND t.due_date <> \'0000-00-00 00:00:00\' AND t.due_date >= ' . $db->convertDateTime($today) . ' AND t.due_date <=' . $db->convertDateTime($user->getMyProjectsUpcomingThresholdDate());
      }
      
      // status
      if ($params['status']) {
        $query .= ' AND (';
        $started = FALSE;
        foreach (explode(' ', $params['status']) as $status) {
          $query .= $started ? ' OR ' : '';
          $query .= 't.status=' . $db->convertText($status);
          $started = TRUE;
        }
        $query .= ')';
      }
      
      $query .= ' ORDER BY t.due_date ASC, t.title ASC';
      $types = array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_DATE, 
                     SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_DATE, 
                     SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN, 
                     SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, 
                     SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, 
                     SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, 
                     SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, 
                     SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, 
                     SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, 
                     SRA_DATA_TYPE_INT);
      if ($params['description']) {
        $types[] = SRA_DATA_TYPE_TEXT;
        $types[] = SRA_DATA_TYPE_TEXT;
      }
      
      $results =& $db->fetch($query, $types);
      while($row =& $results->next()) {
        // skip task
        if ($params['skipTasks'] && in_array($row[1], $params['skipTasks'])) { continue; }
        
        if (!$projectAccess[$row[0]]) { $projectAccess[$row[0]]=MyProjectVO::getUserPermissions($row[0]); }
        if (!($projectAccess[$row[0]] & MY_PROJECT_PERMISSIONS_TASKS_READ)) { continue; }
        
        // apply ownership filter
        if ($params['pid'] && !MyProjectTaskVO::isResponsibleForPid($params['pid'], $row[1])) { continue; }
        
        $key = count($tasks);
        $canToggleStatus = MyProjectTaskVO::canToggleStatus($row[1]);
        $tasks[$key] = array('projectId' => $row[0], 'taskId' => $row[1], 
                         'canToggleStatus' => $canToggleStatus, 
                         'canToggleStatusMsg' => !$canToggleStatus ? MyProjectTaskVO::canToggleStatus($row[1], TRUE) : NULL, 
                         'canToggleStatusCode' => !$canToggleStatus ? MyProjectTaskVO::canToggleStatus($row[1], FALSE, FALSE, TRUE) : NULL, 
                         'created' => $row[2] ? SRA_Util::attrToJavascript($row[2], NULL, NULL, TRUE) : NULL, 
                         'creator' => $row[18], 'disabled' => $row[3], 
                         'datesLabel' => MyProjectTaskVO::getLabelDates($row[24], $row[4]), 
                         'dueDate' => $row[4] ? SRA_Util::attrToJavascript($row[4], NULL, NULL, TRUE) : NULL,
                         'dueDateTime' => $row[4] ? $row[4]->toInt() : NULL, 
                         'durationActual' => $row[25], 
                         'durationLabel' => MyProjectTaskVO::getLabelDuration($row[26], $row[25]), 
                         'durationPlanned' => $row[26], 
                         'ended' => $row[5] ? SRA_Util::attrToJavascript($row[5], NULL, NULL, TRUE) : NULL,
                         'icon' => $row[8] ? 'task-list.png' : 'task.png', 
                         'isCompleted' => $row[13] == MY_PROJECT_STATUS_COMPLETED, 
                         'lastUpdated' => $row[6] ? SRA_Util::attrToJavascript($row[6], NULL, NULL, TRUE) : NULL, 
                         'lastUpdatedBy' => $row[7], 'late' => !MyProjectVO::isStatusTerminal($row[13]) ? ($row[4] && $today->compare($row[4]) > 0) : FALSE, 
                         'lateDays' => !MyProjectVO::isStatusTerminal($row[13]) && $row[4] && $today->compare($row[4]) > 0 ? $row[4]->getDayDelta($today) : 0, 
                         'list' => $row[8], 'readOnly' => MyProjectTaskVO::isUserReadOnly($row[1]), 
                         'percentComplete' => $row[27], 'percentCompleteLabel' => MyProjectTaskVO::getLabelPercentComplete($row[27]), 
                         'readOnlyAttr' => $row[23],
                         'startDate' => $row[24] ? SRA_Util::attrToJavascript($row[24], NULL, NULL, TRUE) : NULL,
                         'status' => $row[13], 'title' => $row[14], 'strictPermissions' => $row[19], 
                         'upcoming' => !MyProjectVO::isStatusTerminal($row[13]) && $user->isInMyProjectsUpcomingThreshold($row[4]), 
                         'wfGenerated' => $row[22] || $row[20] ? TRUE : FALSE, 'wfLocked' => $row[21], 'wfStepId' => $row[22], 'wfTaskId' => $row[20]);
        if ($params['description']) {
          $tasks[$key]['description'] = $row[28];
          $tasks[$key]['descriptionHtml'] = $row[29];
        }
        // parent
        if ($row[9]) {
          $tasks[$key]['parent'] = array('taskId' => $row[9], 'title' => $row[10]);
        }
        // predecessor
        if ($row[11]) {
          $tasks[$key]['predecessor'] = array('taskId' => $row[11], 'title' => $row[12]);
        }
        // change restriction
        if ($params['changeRestriction'] && $row[15]) {
          $dao =& SRA_DaoFactory::getDao($row[16] ? 'MyProjectEmailParticipant' : 'MyProjectParticipant');
          $participant =& $dao->findByPk($row[15]);
          $tasks[$key]['changeRestriction'] = array('label' => $participant->getLabel(), 'pid' => $participant->getPid());
        }
        // form
        if ($row[20]) {
          $dao =& SRA_DaoFactory::getDao('SraWorkflowTask');
          // lookup task
          if (!SraWorkflowTaskVO::isValid($wfTask =& $dao->findByPk($row[20]))) {
            return SRA_Error::logError('MyProjectsManager::getTasks - Failed: unable to retrieve SraWorkflowTaskVO instance ' . $row[20] . ' for task id ' . $row[1], __FILE__, __LINE__);
          }
          $tasks[$key]['view'] = $wfTask->getView() ? TRUE : FALSE;
          $tasks[$key]['viewForm'] = $wfTask->getValidate() ? TRUE : FALSE;
          if ($params['view'] && $tasks[$key]['view']) {
            $tasks[$key]['viewContent'] = $wfTask->getViewContent();
          }
        }
      }
      
      
      // add files
      if ($params['files']) {
        $keys = array_keys($tasks);
        foreach($keys as $key) {
          if (!($projectAccess[$tasks[$key]['projectId']] & MY_PROJECT_PERMISSIONS_FILES_READ)) { continue; }
          
          $results =& $db->fetch('SELECT file_id, category, icon, name, file_uri FROM my_project_file WHERE task_id=' . $tasks[$key]['taskId'] . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
          $tasks[$key]['files'] = array();
          while($row =& $results->next()) {
            $tasks[$key]['files'][] = array('fileId' => $row[0], 'category' => $row[1], 'icon' => MY_PROJECT_FILE_ICON_BASE_URI . '16/' . ($row[2] ? basename($row[2]) : 'unknown.png'), 'name' => $row[3], 'uri' => $row[4]);
          }
        }
      }
      
      // add messages
      if ($params['messages']) {
        $keys = array_keys($tasks);
        foreach($keys as $key) {
          if (!($projectAccess[$tasks[$key]['projectId']] & MY_PROJECT_PERMISSIONS_MESSAGES_READ)) { continue; }
          
          $results =& $db->fetch('SELECT message_id, category, title FROM my_project_message WHERE task_id=' . $tasks[$key]['taskId'] . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
          $tasks[$key]['messages'] = array();
          while($row =& $results->next()) {
            $tasks[$key]['messages'][] = array('messageId' => $row[0], 'category' => $row[1],  'title' => $row[2]);
          }
        }
      }
      
      // add whiteboards
      if ($params['whiteboards']) {
        $keys = array_keys($tasks);
        foreach($keys as $key) {
          if (!($projectAccess[$tasks[$key]['projectId']] & MY_PROJECT_PERMISSIONS_WHITEBOARDS_READ)) { continue; }
          
          $results =& $db->fetch('SELECT whiteboard_id, active, category, title FROM my_project_whiteboard WHERE task_id=' . $tasks[$key]['taskId'] . ' ORDER BY last_updated DESC', array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
          $tasks[$key]['whiteboards'] = array();
          while($row =& $results->next()) {
            $tasks[$key]['whiteboards'][] = array('whiteboardId' => $row[0], 'active' => $row[1], 'category' => $row[2],  'title' => $row[3]);
          }
        }
      }
      
      // build hierarchy when applicable
      if ($params['_parent'] || $params['hierarchy']) {
        $keys = array_keys($tasks);
        foreach($keys as $key) {
          $params['_parent'] = $tasks[$key]['taskId'];
          $tasks[$key]['subTasks'] =& MyProjectsManager::getTasks($params);
        }
      }
      // return a single task
      if ($params['taskId'] && is_numeric($params['taskId']) && count($tasks) <= 1) {
        if (count($tasks)) {
          $keys = array_keys($tasks);
          $tasks = $tasks[$keys[0]];
        }
        else {
          $tasks = NULL;
        }
      }
      //sra_error::logerror($params);
      //sra_error::logerror($tasks);
      return $tasks;
    }
    else {
      SRA_Error::logError('MyProjectsManager::getDiscussion - Failed: no current active user or no projectIds param invalid or not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ loadProject
	/**
	 * ajax service method used to load a project. this method accepts 1 param 
   * 'projectId' and returns a hash with the following keys:
   *   project:      a reference to the project object (using the toJavascript 
   *                 rendering)
   *   emailParticipants: if the user has project admin privileges this hash 
   *                 value will be included which is an array of all of the 
   *                 MyProjectEmailParticipant objects pertaining to the project 
   *                 (using the toJavascript rendering)
   *   participants: if the user has project admin privileges this hash value 
   *                 will be included which is an array of all of the 
   *                 MyProjectParticipant objects pertaining to the project 
   *                 (using the toJavascript rendering)
   *   pluginForLabels the id of the plugin whose resources should be used to 
   *                 override the default project labels
   *   pluginLabelsPrefix an optional prefix to use for the label keys above
   *   viewHtml:     the xhtml view for this project (or a not-authorized 
   *                 message if the user is not allowed to view the project). 
   *                 the view will include project participation details ONLY if 
   *                 the current user has project admin privileges
   *   wfViewTpl:    the output from the workflow view template rendering
   * @param array $params the method params. contains a single value: projectId
   * @access public
   * @return object
	 */
	function &loadProject($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProject');
    if ($user && array_key_exists('projectId', $params) && (MyProjectVO::isValid($project =& $dao->findByPk($params['projectId']))) && $project->verifyPermissions()) {
      $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      $results = array();
      if ($project->verifyPermissions()) {
        $tpl =& SRA_Controller::getAppTemplate();
        $tpl->assignByRef('project', $project);
        $wfViewTpl = $project->renderWfViewTpl();
        $tpl->assign('wfViewTpl', $wfViewTpl);
        if ($wfViewTpl) { $results['wfViewTpl'] = $wfViewTpl; }
        $results['viewHtml'] = $tpl->fetch('plugins/productivity/my-projects-view-div.tpl');
        $results['project'] =& $project;
        if ($project->verifyPermissions(MY_PROJECT_PERMISSIONS_ADMIN)) {
          $results['participants'] =& $project->getParticipants();
          $results['emailParticipants'] =& $project->getEmailParticipants();
        }
        if ((MyProjectsTemplate::isValid($template =& $project->getProjectTemplate())) && $template->getPluginForLabels()) {
          $results['pluginForLabels'] = $template->getPluginForLabels();
          if ($template->getPluginLabelsPrefix()) { $results['pluginLabelsPrefix'] = $template->getPluginLabelsPrefix(); }
        }
      }
      else {
        $results['viewHtml'] = $resources->getString('MyProjects.error.notPermittedToView');
      }
      return $results;
    }
    else {
      SRA_Error::logError($params, __FILE__, __LINE__);
      return SRA_Error::logError('MyProjectsManager::loadProject - Failed: no current active user or no projectId param invalid or not specified or user does not have permission to access the project', __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ manageActiveDrawboards
	/**
	 * this method performs cleanup operations for currently active drawboards. 
   * these operations include updating the whiteboard image and killing the 
   * drawboard once it becomes idle (when it has 0 active users)
   * @access public
   * @return void
	 */
	function manageActiveDrawboards() {
    $drawboardConf =& MyProjectsManager::getDrawboardConf();
    $cutoff = new SRA_GregorianDate();
    $cutoff->jump(SRA_GREGORIAN_DATE_UNIT_MINUTE, -1 * $drawboardConf['idlewait']);
    
    $db =& SRA_Controller::getAppDb();
    $dao =& SRA_DaoFactory::getDao('MyProjectWhiteboard');
    $results =& $db->fetch('SELECT whiteboard_id FROM my_project_whiteboard WHERE active=' . $db->convertBoolean(TRUE), array(SRA_DATA_TYPE_INT));
    while($row =& $results->next()) {
      $whiteboard =& $dao->findByPk($row[0]);
      $updated = $whiteboard->updateFromDrawboard();
      if (!$updated && $cutoff->compare($whiteboard->getLastUpdated()) > 0) {
        $whiteboard->setActive(FALSE);
        $whiteboard->update();
      }
    }
  }
	// }}}
  
  
	// {{{ retrievePopMessages
	/**
	 * this method is used to retrieve and process pop email messages when the 
   * plugin is configured to do so. pop messages are received in response to a 
   * message or comment and are added as comments to the message or whiteboard 
   * that they were generated from. the server will be logged into every 
   * MY_PROJECTS_MANAGER_POP_LOGIN_FREQ minutes. in order to support this 
   * functionality, the following app-config params must be configured (where 
   * type='my-projects'):
   *   apop:  whether or not to use APOP authentication (must be supported by 
   *          the mail server)
   *   email: the email address for the pop account
   *   host:  the pop3 email host
   *   name:  the name to use for the email address (optional)
   *   port:  tcp/ip port to connect on (default is 110 or 995 for tls)
   *   pswd:  the email account password
   *   skipTokens: a pipe (|) separated list of keywords that should be used to 
   *          skip messages if any of them are present in the message subject. 
   *          For example, to skip out of office and auto replies, you could use 
   *          the skipTokens: 'AutoReply|Out of Office'. the search is NOT 
   *          case-sensitive
   *   tls:   whether or not to use a tls secure connection to the server
   *   truncTokens: a pipe (|) separated list of delimeters that 
   *          will be used to truncate comments received via email. the message 
   *          will be truncated from the line where these delimeters are found 
   *          down. if a delimeter is not found, no action will be taken on the 
   *          message. 
   *   user:  the email account user name
   * this method will also automatically delete MyProjectsPopLog entries that 
   * are older than MY_PROJECTS_MANAGER_POP_LOG_KEEP days. 
   * @access public
   * @return boolean
	 */
	function retrievePopMessages() {
    $params = SRA_Controller::getAppParams(NULL, 'my-projects');
    
    // if any required params are missing, abort
    if (!$params['host'] || !$params['pswd'] || !$params['user']) { return; }
            
    // delete old log entries
    $cutoff = new SRA_GregorianDate();
    $cutoff->jump(SRA_GREGORIAN_DATE_UNIT_DAY, MY_PROJECTS_MANAGER_POP_LOG_KEEP * -1);
    $db =& SRA_Controller::getAppDb();
    $db->execute('DELETE FROM my_projects_pop_log WHERE created < ' . $db->convertDate($cutoff));
    
    $dao =& SRA_DaoFactory::getDao('MyProjectsPopLog');
    $log = $dao->newInstance();
    $results = '';
    require_once('util/SRA_Pop3Login.php');
    if (SRA_Pop3Login::isValid($pop3 = new SRA_Pop3Login($params['host'], $params['user'], $params['pswd'], isset($params['port']) ? $params['port'] : NULL, $params['tls'] ? TRUE : FALSE, $params['apop'] ? TRUE : FALSE))) {
      if (is_array($messages =& $pop3->getAllMessages(TRUE))) {
        if (count($messages)) {
          $results .= 'Retrieved ' . count($messages) . " messages for processing\n";
          $keys = array_keys($messages);
          foreach($keys as $key) {
            preg_match('/\[(.*)\]$/', $messages[$key]->subject, $matches);
            $id = $matches[1] ? $matches[1] : NULL;
            if ($id && (substr($id, 0, 1) == 'm' || substr($id, 0, 1) == 'w')) {
              $results .= 'Processing message: "' . $messages[$key]->subject . '" for id ' . $id . "\n";
              
              $entity = substr($id, 0, 1) == 'm' ? 'MyProjectMessage' : 'MyProjectWhiteboard';
              $dao =& SRA_DaoFactory::getDao($entity);
              if (!SRA_Error::isError($item =& $dao->findByPk(substr($id, 1)))) {
                // check permissions
                $db =& SRA_Controller::getAppDb();
                $uid = SRA_Database::getQueryValue($db, 'SELECT uid FROM os_user WHERE email=' . $db->convertText($messages[$key]->from));
                $creator = $uid;
                $permissions = $uid ? MyProjectVO::getUserPermissions($item->getProjectId(), $uid) : SRA_Database::getQueryValue($db, 'SELECT permissions FROM my_project_email_participant WHERE project_id=' . $item->getProjectId() . ' AND email=' . $db->convertText($messages[$key]->from));
                
                if (!isset($uid)) {
                  $uid = SRA_Database::getQueryValue($db, 'SELECT creator FROM my_project WHERE project_id=' . $item->getProjectId());
                  $creator = SRA_Database::getQueryValue($db, 'SELECT participant_id FROM my_project_email_participant WHERE project_id=' . $item->getProjectId() . ' AND email=' . $db->convertText($messages[$key]->from));
                }
                
                if (!($permissions & (substr($id, 0, 1) == 'm' ? MY_PROJECT_PERMISSIONS_MESSAGES_WRITE : MY_PROJECT_PERMISSIONS_WHITEBOARDS_WRITE))) {
                  $results .= $messages[$key]->from . " is not authorized to add $entity comments for project " . $item->getProjectId() . "\n";
                }
                else {
                  $skipMessage = FALSE;
                  if ($params['skipTokens']) {
                    $tokens = explode('|', $params['skipTokens']);
                    foreach($tokens as $token) {
                      if (strpos(strtolower($messages[$key]->subject), strtolower($token)) !== FALSE) {
                        $results .= "The subject '" . $messages[$key]->subject . "' contains a keyword from skipTokens and the message will be skipped for $entity comments and project " . $item->getProjectId() . "\n";
                        $skipMessage = TRUE;
                        break;
                      }
                    }
                  }
                  if (!$skipMessage) {
                    $comment = new MyProjectCommentVO(array('creator' => $creator, 'emailGenerated' => isset($uid) ? FALSE : TRUE, 'projectId' => $item->getProjectId()));
                    $comment->_skipPermissionsCheck = TRUE;
                    $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
                    
                    // attempt to remove the prior message
                    $messages[$key]->truncate($resources->getString('subscriberEmail.introTerminator'));
                    if ($params['truncTokens']) {
                      $tokens = explode('|', $params['truncTokens']);
                      foreach($tokens as $token) {
                        $messages[$key]->truncate($token);
                      }
                    }
                    
                    $comment->setComment($messages[$key]->message);
                    substr($id, 0, 1) == 'm' ? $comment->setMessageId($item->getPrimaryKey()) : $comment->setWhiteboardId($item->getPrimaryKey());
                    if ($messages[$key]->attachments) {
                      $lastUpdatedBy = $comment->getCreatorName() ? $comment->getCreatorName() : $comment->getCreatorEmail();
                      $akeys = array_keys($messages[$key]->attachments);
                      $files = array();
                      foreach($akeys as $akey) {
                        $files[$akey] = new MyProjectFileVO(array('creator' => $uid, 'lastUpdatedBy' => $lastUpdatedBy, 'projectId' => $item->getProjectId()));
                        $files[$akey]->setFile($messages[$key]->attachments[$akey]);
                        $files[$akey]->_bypassPermissionsCheck = TRUE;
                      }
                      $comment->addFiles($files);
                    }
                    
                    if (!SRA_Error::isError($comment->insert())) {
                      $results .= 'Comment created ' . $comment->getPrimaryKey() . ' from ' . $messages[$key]->from . ' successfully for discussion item ' . $item->_title . "\n";
                    }
                    else {
                      $results .= 'Unable to create comment for discussion item ' . $item->_title . "\n";
                    }
                  }
                }
              }
              else {
                $results .= "Id $id is not valid for " . $entity;
              }
            }
            else {
              $results .= 'Message "' . $messages[$key]->subject . "\" cannot be processed because it does not contain a valid messages or whiteboard identifier\n";
            }
          }
        }
        else {
          $results = $params['user'] . '@' . $params['host'] . ' mailbox is empty';
        }
      }
      else {
        $results = $pop3->err->getErrorMessage();
      }
    }
    else {
      $results = $pop3->err->getErrorMessage();
    }
    $log->setResults($results);
    $log->insert();
  }
	// }}}
  
  
	// {{{ search
	/**
	 * searches for and returns matching projects based on the criteria specified. 
   * this criteria is contained within a single search string in $params under 
   * the index 'search'. this string may contain certain delimeters in the 
   * format {delim}=value, where each delimeter is separated by a newline 
   * charager (\n) or semicolon (;). these are the search delimeters and their 
   * corresponding types/options and default values:
   *  ended:           [date string > null] - only projects ending before this
   *  includeArchived: [0|1 > 0] - include archived projects
   *  keyword:         [null] - search keyword
   *  overdue:         [0|1 > null] - overdue (1), on-time (0), any state (null)
   *  owner:           [uid > null] - uid of specific project owner
   *  participant:     [uid|("g".gid) > $user->getUid()] - participation filter
   *  projectId:       [projectId > null] - the id of the project. this 
   *                   parameter may be an array or a space separated list of 
   *                   multiple project ids
   *  type:            [project template id > null] - the project template id
   *  started:         [date string > null] - only projects starting after this
   *  status:          [active|hold|completed|cancelled|error > active] - status
   * 
   * on top of this criteria, only projects that the user is directly or 
   * indirectly (through child relationships) will ever be returned. the return 
   * value will be an array of hashes of all of the matching projects indexed by 
   * project id. only up to MY_PROJECTS_MANAGER_SEARCH_LIMIT matching projects 
   * will be returned. the return value will be sorted by project type followed 
   * by name in ascending order UNLESS a search keyword has been specified in 
   * which case the order will be by type followed by the full text matching 
   * score for each project based on the keyword specified. each project hash 
   * will contain the following keys:
   *  projectId:       the project id
   *  archived:        whether or not the project is archived
   *  created:         date string when the project was created
   *  creator:         the name of the project creator/owner
   *  creatorUid:      the uid of the project creator/owner
   *  dueDate:         due date as a javascript date object
   *  ended:           date string when the project ended
   *  icon16:          the uri to the 16 pixel icon for this project
   *  icon32:          the uri to the 32 pixel icon for this project
   *  icon64:          the uri to the 64 pixel icon for this project
   *  lastUpdated:     date string when the project was last updated
   *  lastUpdatedBy:   name of user that last updated the project
   *  late:            whether or not the project is late
   *  lateDays:        if the project is late, the # of days that it is late
   *  name:            the project name
   *  getUserPermissions: the user permissions to this project
   *  score:           the full text search score. returned if keyword specified
   *  status:          project status identifier
   *  statusStr:       the project status string
   *  type:            the project type key (when project is template-based)
   *  typeStr:         the project type string (when project is template-based)
   *  upcoming:        whether or not the project is upcoming
   *  wfId:            if the project has a workflow assigned, the id of that wf
   * @param array $params the method params. contains a single value: 'search'
   * @access public
   * @return array
	 */
	function &search($params, $limit, $offset) {
    global $user;
    if ($user && (array_key_exists('search', $params) || (is_array($params) && count($params)))) {
      $tmp =& SRA_DaoFactory::getDao('MyProject');
      $db =& SRA_Controller::getAppDb();
      
      $today = new SRA_GregorianDate();
      $today->jumpToStartOfDay();
      
      if (array_key_exists('search', $params)) {
        // construct search parameters
        if (!strstr($params['search'], '=')) { $params['search'] = 'keyword=' . $params['search']; }
        if (strstr($params['search'], ';')) { $params['search'] = str_replace(';', "\n", $params['search']); }
        $searchParams = $params['search'] ? SRA_File::propertiesFileToArray($params['search']) : array();
        $keys = array_keys($searchParams);
        foreach($keys as $key) {
          if ($searchParams[$key] == 'NULL') { $searchParams[$key] = NULL; }
        }
        
        // set default values
        if (!array_key_exists('includeArchived', $searchParams)) { $searchParams['includeArchived'] = FALSE; }
        if (!array_key_exists('participant', $searchParams)) { $searchParams['participant'] = $user->getUid(); }
        if (!array_key_exists('status', $searchParams)) { $searchParams['status'] = 'active'; }
        if (!array_key_exists('keyword', $searchParams)) { $searchParams['keyword'] = NULL; }
      }
      else {
        $searchParams = $params;
      }
      
      $uids = $user->getAllUids();
      $gids = $user->getAllGids();
      $uidSql = '(' . implode(', ', $uids) . ')';
      $gidSql = '(' . implode(', ', $gids) . ')';
      
      $columns = 'p.project_id, p.archived, p.created, u.name, u.uid, p.due_date, p.ended, p.last_updated, p.last_updated_by, p.name, p.status, p.template, p.wf_id, pp.id, pp.is_group';
      if ($searchParams['keyword']) { $columns .= ', MATCH(i.search_index) AGAINST (' . $db->convertText($searchParams['keyword']) . ' IN BOOLEAN MODE) as score'; }
      $query = 'SELECT ' . $columns . ' FROM (my_project p, my_project_search_index i, os_user u) LEFT JOIN my_project_participant pp ON p.project_id=pp.project_id WHERE p.project_id=i.project_id AND p.creator=u.uid';
      $query .= ' AND (p.creator IN ' . $uidSql;
      $query .= ' OR (pp.is_group=' . $db->convertBoolean(FALSE) . ' AND pp.id IN ' . $uidSql . ') OR (pp.is_group=' . $db->convertBoolean(TRUE) . ' AND pp.id IN ' . $gidSql . '))';
      if (isset($searchParams['ended'])) { $query .= ' AND p.ended IS NOT NULL AND p.ended<>' . $db->convertText('0000-00-00 00:00:00') . ' AND p.ended<=' . $db->convertDate(SRA_GregorianDate::isValid($searchParams['ended']) ? $searchParams['ended'] : new SRA_GregorianDate($searchParams['ended'])); }
      if (!$searchParams['includeArchived']) { $query .= ' AND (p.archived=' . $db->convertBoolean(FALSE) . ' OR p.archived IS NULL)'; }
      if (isset($searchParams['overdue'])) { $query .= ' AND (p.due_date IS' . ($searchParams['overdue'] == '1' ? ' NOT' : '') . ' NULL ' . ($searchParams['overdue'] == '1' ? 'AND p.due_date<>' . $db->convertText('0000-00-00 00:00:00') . 'AND' : 'OR p.due_date=' . $db->convertText('0000-00-00 00:00:00') . ' OR') . ' p.due_date' . ($searchParams['overdue'] == '1' ? '<' : '>=') . $db->convertDate($today) . ')'; }
      if (isset($searchParams['owner'])) { $query .= ' AND p.creator=' . $db->convertInt($searchParams['owner']); }
      if (isset($searchParams['projectId'])) {
        if (!is_array($searchParams['projectId'])) { $searchParams['projectId'] = explode(' ', $searchParams['projectId']); }
        $keys = array_keys($searchParams['projectId']);
        foreach($keys as $key) { $searchParams['projectId'][$key] = $db->convertInt($searchParams['projectId'][$key]); }
        $query .= ' AND p.project_id IN (' . implode(', ', $searchParams['projectId']) . ')'; 
      }
      if (isset($searchParams['type'])) { $query .= ' AND p.template=' . $db->convertText($searchParams['type']); }
      if (isset($searchParams['started'])) { $query .= ' AND p.created>=' . $db->convertDate(SRA_GregorianDate::isValid($searchParams['started']) ? $searchParams['started'] : new SRA_GregorianDate($searchParams['started'])); }
      if (isset($searchParams['status'])) { $query .= ' AND p.status=' . $db->convertText($searchParams['status']); }
      if ($searchParams['keyword']) { $query .= ' HAVING score>0'; }
      $query .= ' ORDER BY p.template ASC, ' . ($searchParams['keyword'] ? 'score DESC' : 'p.name ASC');
      
      $projects = array();
      $productivityResources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      $participantGid = NULL;
      $participantUids = NULL;
      if (isset($searchParams['participant']) && SRA_Util::beginsWith($searchParams['participant'], 'g')) {
        $participantGid = substr($searchParams['participant'], 1);
        $participantUids = array();
        $results =& $db->fetch('SELECT uid FROM user_groups WHERE gid=' . $db->convertInt($participantGid), array(SRA_DATA_TYPE_INT));
        while($row =& $results->next()) {
          $participantUids[] = $row[0];
        }
      }
      else if (isset($searchParams['participant']) && !SRA_Util::beginsWith($searchParams['participant'], 'g')) {
        $participantUids = array($searchParams['participant']);
      }
      // SRA_Error::logError($query, __FILE__, __LINE__);
      $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_DATE, SRA_DATA_TYPE_TIME, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_FLOAT), MY_PROJECTS_MANAGER_SEARCH_LIMIT);
      while($row =& $results->next()) {
        if ($participantGid && (!$row[14] || $row[13] != $participantGid)) { continue; }
        if ($participantUids && ($row[14] || !in_array($row[13], $participantUids)) && !in_array($row[4], $participantUids)) {
          $foundInGroup = FALSE;
          if ($row[14]) {
            $gresults =& $db->fetch('SELECT uid FROM user_groups WHERE gid=' . $db->convertInt($row[13]), array(SRA_DATA_TYPE_INT));
            while($grow =& $gresults->next()) {
              if (in_array($grow[0], $participantUids)) { 
                $foundInGroup = TRUE; 
                break;
              }
            }
          }
          if (!$foundInGroup) { continue; } 
        }
        
        if (isset($projects[$row[0]])) { continue; }
        $row[11] && MyProjectsTemplate::isValid(MyProjectsTemplate::getAppTemplate($row[11])) ? $template =& MyProjectsTemplate::getAppTemplate($row[11]) : $template = NULL;
        $projects[$row[0]] = array('projectId' => $row[0], 'archived' => $row[1], 'created' => $row[2], 'creator' => $row[3], 'creatorUid' => $row[4], 
                                   'dueDate' => $row[5] ? SRA_Util::attrToJavascript($row[5], NULL, NULL, TRUE) : NULL, 'ended' => $row[6], 
                                   'icon16' => ($template ? $template->getIcon(16) : str_replace('${size}', 16, MY_PROJECTS_TEMPLATE_DEFAULT_ICON)), 
                                   'icon32' => ($template ? $template->getIcon(32) : str_replace('${size}', 32, MY_PROJECTS_TEMPLATE_DEFAULT_ICON)), 
                                   'icon64' => ($template ? $template->getIcon(64) : str_replace('${size}', 64, MY_PROJECTS_TEMPLATE_DEFAULT_ICON)), 
                                   'lastUpdated' => $row[7], 'lastUpdatedBy' => $row[8], 'late' => !MyProjectVO::isStatusTerminal($row[10]) && $row[5] && $row[5]->compare($today) < 0, 
                                   'lateDays' => !MyProjectVO::isStatusTerminal($row[10]) && $row[5] && $row[5]->compare($today) < 0 ? $row[5]->getDayDelta($today) : 0, 
                                   'name' => $row[9], 'getUserPermissions' => MyProjectVO::getUserPermissions($row[0]), 
                                   'status' => $row[10], 'statusStr' => $productivityResources->getString($row[10]), 
                                   'upcoming' => !MyProjectVO::isStatusTerminal($row[10]) && $user->isInMyProjectsUpcomingThreshold($row[5]),
                                   'type' => $row[11], 'typeStr' => ($template ? $template->getType() : $productivityResources->getString('MyProject')), 'wfId' => $row[12]);
        if ($searchParams['keyword']) { $projects[$row[0]]['score'] = $row[15]; }
      }
      
      if (isset($limit) || isset($offset)) {
        $count = count($projects);
        $projects =& SRA_Util::applyLimitOffset($projects, $limit, $offset);
        $projects[SRA_GLOBAL_AJAX_SERVICE_RESULT_COUNT_KEY] = $count;
      }
      $nl = NULL;
      return !$projects || (count($projects) == 1 && isset($projects[SRA_GLOBAL_AJAX_SERVICE_RESULT_COUNT_KEY]) && !$projects[SRA_GLOBAL_AJAX_SERVICE_RESULT_COUNT_KEY]) ? $nl : $projects;
    }
    else {
      SRA_Error::logError('MyProjectsManager::search - Failed: no current active user or no search param specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ subscribe
	/**
	 * subscribes a user to a discussion item. returns TRUE on success
   * @param array $params the method params. contains the following values: 
   *   id: either "message:[message id]" or "whiteboard:[whiteboard id]"
   *   participantId: (optional) the email participant id, if not specified, the
   *   current user uid will be used
   * @access public
   * @return boolean
	 */
	function &subscribe($params) {
    global $user;
    if (($user || $params['participantId']) && array_key_exists('id', $params) && ($pieces = explode(':', $params['id'])) && count($pieces) == 2 && ($pieces[0] == 'message' || $pieces[0] == 'whiteboard') && is_numeric($pieces[1])) {
      $dao =& SRA_DaoFactory::getDao($pieces[0] == 'message' ? 'MyProjectMessage' : 'MyProjectWhiteboard');
      if (!SRA_Error::isError($item =& $dao->findByPk($pieces[1]))) {
        if (!SRA_Error::isError($err =& $item->getTitle())) {
          MyProjectsManager::unsubscribe($params);
          $subscriberDao =& SRA_DaoFactory::getDao('MyProjectDiscussionSubscriber');
          $subscriber = $subscriberDao->newInstance();
          $subscriber->setAttribute($params['participantId'] ? 'participantId' : 'uid', $params['participantId'] ? $params['participantId'] : $user->getUid());
          $subscriber->setAttribute($pieces[0] == 'message' ? 'messageId' : 'whiteboardId', $item->getPrimaryKey());
          $tr = TRUE;
          $fl = FALSE;
          return !SRA_Error::isError($subscriberDao->insert($subscriber)) ? $tr : $fl;
        }
        else {
          return $err;
        }
      }
      else {
        return $item;
      }
    }
    else {
      SRA_Error::logError('MyProjectsManager::subscribe - Failed: no current active user or no id param specified (or id is not valid)', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ unsubscribe
	/**
	 * unsubscribes a user from a discussion item. returns TRUE on success
   * @param array $params the method params. contains the following values: 
   *   id: either "message:[message id]" or "whiteboard:[whiteboard id]"
   *   participantId: (optional) the email participant id, if not specified, the
   *   current user uid will be used
   *   uid: (optional) the participant uid to unsubscribe. if not specified, the
   *   current user uid will be used
   * @access public
   * @return boolean
	 */
	function &unsubscribe($params) {
    global $user;
    if (($user || $params['participantId'] || $params['uid']) && array_key_exists('id', $params) && ($pieces = explode(':', $params['id'])) && count($pieces) == 2 && ($pieces[0] == 'message' || $pieces[0] == 'whiteboard') && is_numeric($pieces[1])) {
      $db =& SRA_Controller::getAppDb();
      $query = 'DELETE FROM my_project_discussion_subscriber WHERE ' . ($params['participantId'] ? 'participant_id' : 'uid') . '=' . 
               ($params['participantId'] ? $db->convertInt($params['participantId']) : ($params['uid'] ? $params['uid'] : $user->getUid())) . 
               ' AND ' . ($pieces[0] == 'message' ? 'message_id' : 'whiteboard_id') . '=' . $db->convertInt($pieces[1]);
      $tr = TRUE;
      $fl = FALSE;
      $results =& $db->execute($query);
      return !SRA_Error::isError($results) && $results->getNumRowsAffected() ? $tr : $fl;
    }
    else {
      SRA_Error::logError('MyProjectsManager::unsubscribe - Failed: no current active user or no id param specified (or id is not valid)', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ updateTaskForm
	/**
	 * ajax service method used to update a task form (but not complete the task). 
   * this method accepts 2 parameters:
   *   _taskId:   the id of the task form to complete
   *   _validate: whether or not to validate the form using the wf task 
   *              validation. if the entity object exists in the db, the 
   *              mandatory validation will always be triggered
   *   *:         the data to update the task entity with
   * returns TRUE on success, a validation error message (if applicable), or an 
   * error object if an error occurs
   * @param array $params the method params
   * @access public
   * @return mixed
	 */
	function &updateTaskForm($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('MyProjectTask');
    if ($user && isset($params['_taskId']) && (MyProjectTaskVO::isValid($task =& $dao->findByPk($params['_taskId']))) && $task->getWfTaskId() && count($params) > 1) {
      unset($params['_taskId']);
      $validate = isset($params['_validate']) && $params['_validate'];
      unset($params['_validate']);
      
      $productivityResources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      
      $dao =& SRA_DaoFactory::getDao('SraWorkflowTask');
      if (!SraWorkflowTaskVO::isValid($wfTask =& $dao->findByPk($task->getWfTaskId()))) {
        return SRA_Error::logError('MyProjectsManager::updateTaskForm - Failed: unable to retrieve SraWorkflowTaskVO instance ' . $task->getWfTaskId() . ' for project id ' . $task->getProjectId(), __FILE__, __LINE__);
      }
      if ($wfTask->getStatus() != 'in-progress') {
        return $productivityResources->getString('MyProjects.error.wfTaskStatusIsNotInProgress');
      }
      if (!($entity =& $wfTask->getEntity())) {
        return SRA_Error::logError('MyProjectsManager::updateTaskForm - Failed: unable to retrieve entity instance for wf task ' . $task->getWfTaskId() . ' and project id ' . $task->getProjectId(), __FILE__, __LINE__);
      }
      
      $obj =& $entity->getEntity();
      $obj->setAttributes($params);
      
      $results = TRUE;
      if ($errs = MyProjectsManager::_validateEntityObj($obj, $validate ? $wfTask->getValidate() : NULL, TRUE)) {
        $results = implode('<br />', $errs);
      }
      else if (!$obj->recordExists) {
        $entity->setEntity($obj);
        $entity->update();
      }
      return $results;
    }
    else {
      SRA_Error::logError('MyProjectsManager::updateTaskForm - Failed: no current active user or taskId param invalid or not specified or task is not tied to a workflow task or data not specified', __FILE__, __LINE__);
      return SRA_Error::logError($params, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
  // private methods
  
  
	// {{{ _sendParticipantIntroEmail
	/**
	 * sends an introduction email to $participant. a custom email template may 
   * be specified using the app-config parameters (type='my-projects') 
   * 'introEmailTpl' and 'introEmailTplHtml'. this template will have access to 
   * the following smarty variables:
   *   email:       the email address
   *   name:        the name of the email recipient
   *   participant: a reference to the MyProjectEmailParticipant or 
   *                MyProjectParticipant object for the notification
   *   project:     a reference to the MyProject object for the notification
   *   projectAdmin:a reference to the project administrator
   *   resources:   a reference to the productivity plugin SRA_ResourceBundle
   *   uid:         if the recipient is a user, the uid of that user (NULL for 
   *                email participants)
   * @param MyProjectEmailParticipantVO $participant 
   * @access public
   * @return void
	 */
	function _sendParticipantIntroEmail(& $participant) {
    if (MyProjectEmailParticipantVO::isValid($participant) || MyProjectParticipantVO::isValid($participant)) {
      $recipients = array();
      if ($participant->getEntityType() == 'MyProjectEmailParticipant') {
        $recipients[$participant->getEmail()] = $participant->getName();
      }
      else if (!$participant->isIsGroup()) {
        $recipients[$participant->getId()] = OsUserVO::getNameFromUid($participant->getId());
      }
      else {
        foreach(OsGroupVO::getUserHash($participant->getId()) as $uid => $name) {
          $recipients[$uid] = $name;
        }
      }
      if (count($recipients)) {
        $dao =& SRA_DaoFactory::getDao('MyProject');
        $project =& $dao->findByPk($participant->getProjectId() ? $participant->getProjectId() : SRA_Database::getQueryValue(SRA_Controller::getAppDb(), 'SELECT max(project_id) FROM my_project', SRA_DATA_TYPE_INT));
        
        $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
        $params = SRA_Controller::getAppParams(NULL, 'my-projects');
        
        $tpl =& SRA_Controller::getAppTemplate();
        $tpl->assignByRef('project', $project);
        $tpl->assignByRef('resources', $resources);
        $tpl->assignByRef('participant', $participant);
        $dao =& SRA_DaoFactory::getDao('OsUser');
        $tpl->assignByRef('projectAdmin', $dao->findByPk($project->getCreator()));
        foreach($recipients as $uid => $name) {
          $email = !is_numeric($uid) ? $uid : OsUserVO::getEmailFromUid($uid);
          $tpl->assign('email', $email);
          $tpl->assign('name', $name);
          $tpl->assign('uid', is_numeric($uid) ? $uid : NULL);
          $tpl->displayToEmail($email, $resources->getString('MyProject.introEmail.subject'), isset($params['introEmailTpl']) ? $params['introEmailTpl']: MY_PROJECTS_MANAGER_INTRO_EMAIL_TPL, isset($params['introEmailTplHtml']) ? $params['introEmailTplHtml']: MY_PROJECTS_MANAGER_INTRO_EMAIL_TPL_HTML, $params['email'], $params['name'], $name);
        }
      }
    }
  }
	// }}}
 
	// {{{ _sendSubscriberEmails
	/**
	 * used to send subscriber emails when a message is posted or updated or a 
   * comment is added to a message or whiteboard
   * @param mixed $item the item to send the message for, either a 
   * MyProjectMessage or a MyProjectComment object
   * @param boolean $updated if $item is a message, is this method being invoked 
   * because the message was updated?
   * @access public
   * @return void
	 */
	function _sendSubscriberEmails(& $item, $updated=FALSE) {
    static $_sentSubscriberEmails = array();
    
    $from = SRA_Controller::getAppParams('email', 'my-projects');
    
    // comment
    if ($item->getEntityType() == 'MyProjectComment') {
      $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
      $owner =& $item->getOwner();
      $subscribers =& $owner->getSubscribers();
      // use direct attribute references to avoid permissions errors
      $subject = $resources->getString('text.re') . ' ' . $owner->_title;
      $message = $item->_comment;
      $messageHtml = $item->_commentHtml;
      $creatorEmail = $item->getCreatorEmail();
      $creatorName = $item->getCreatorName();
      $id = $item->getMessageId() ? 'm' . $item->getMessageId() : 'w' . $item->getWhiteboardId();
      $sid = 'c' . $item->getCommentId();
    }
    // message
    else {
      $subscribers =& $item->getSubscribers();
      $subject = $item->getTitle();
      $message = $item->getMessage();
      $messageHtml = $item->getMessageHtml();
      $creatorEmail = OsUserVO::getEmailFromUid($item->getCreator());
      $creatorName = OsUserVO::getNameFromUid($item->getCreator());
      $id = 'm' . $item->getMessageId();
      $sid = $id;
    }
              
    if ($subscribers && !isset($_sentSubscriberEmails[$sid])) {
      $_sentSubscriberEmails[$sid] = array();
      
      $subject .= " [$id]";
      $tpl =& SRA_Controller::getAppTemplate();
      $tpl->assignByRef('creatorName', $creatorName);
      $tpl->assignByRef('message', $message);
      $tpl->assignByRef('messageHtml', $messageHtml);
      $tpl->assignByRef('productivityResources', SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES));
      $tpl->assign('updated', $updated);
      
      $attachments = NULL;
      if ($files =& $item->getFiles()) {
        $attachments = array();
        $keys = array_keys($files);
        foreach($keys as $key) {
          $attachments[] =& $files[$key]->getFile();
        }
      }
      $keys = array_keys($subscribers);
      foreach($keys as $key) {
        if (!$_sentSubscriberEmails[$sid][$subscribers[$key]->getPrimaryKey()]) {
          $tpl->assignByRef('subscriber', $subscribers[$key]);
          $fromEmail = $from && $subscribers[$key]->canAddComments() ? $from : $creatorEmail;
          $tpl->displayToEmail($subscribers[$key]->getEmail(), $subject, MY_PROJECTS_SUBSCRIBER_EMAIL_TPL, MY_PROJECTS_SUBSCRIBER_EMAIL_TPL_HTML, $fromEmail, $creatorName, $subscribers[$key]->getName(), NULL, NULL, $attachments);
          $_sentSubscriberEmails[$sid][$subscribers[$key]->getPrimaryKey()] = TRUE;
        }
      }
    }
  }
	// }}}
  
	// {{{ _sendTaskNotifications
	/**
	 * sends task assignment notifications
   * @param MyProjectTaskVO $task the task to send the notifications for
   * @param boolean $includeCreator whether or not to send a notification to the 
   * task creator (only occurs if strict permissions are not set for the task)
   * @param boolean $includeChangeRestriction whether or not to send 
   * notifications to the user(s) specified by the task changeRestriction
   * @access public
   * @return void
	 */
	function _sendTaskNotifications(& $task, $includeCreator, $includeChangeRestriction) {
    if (MyProjectTaskVO::isValid($task) && $task->isNotify()) {
      $recipients = array();
      if  ($includeCreator && $task->getCreator() && !$task->isStrictPermissions()) {
        $recipients[$task->getCreator()] = OsUserVO::getNameFromUid($task->getCreator());
      }
      if ($includeChangeRestriction && $task->getChangeRestriction()) {
        $dao =& SRA_DaoFactory::getDao($task->isChangeRestrictionEmail() ? 'MyProjectEmailParticipant' : 'MyProjectParticipant');
        $participant =& $dao->findByPk($task->getChangeRestriction());
        if ($task->isChangeRestrictionEmail()) {
          $recipients[$participant->getEmail()] = $participant->getName();
        }
        else if (!$participant->isIsGroup()) {
          $recipients[$participant->getId()] = OsUserVO::getNameFromUid($participant->getId());
        }
        else {
          foreach(OsGroupVO::getUserHash($participant->getId()) as $uid => $name) {
            $recipients[$uid] = $name;
          }
        }
      }
      
      if (count($recipients)) {
        $dao =& SRA_DaoFactory::getDao('MyProject');
        $project =& $dao->findByPk($task->getProjectId());
        
        $notifySubject = $task->getNotifySubject();
        $notifyTpl = $task->getNotifyTpl();
        $notifyTplHtml = $task->getNotifyTplHtml();
        // get defaults for project
        if (!$notifySubject || (!$notifyTpl && !$notifyTplHtml)) {
          if (!$notifySubject) { $notifySubject = $project->getNotifySubject(); }
          if (!$notifyTpl) { $notifyTpl = $project->getNotifyTpl(); }
          if (!$notifyTplHtml) { $notifyTplHtml = $project->getNotifyTplHtml(); } 
        }
        $resources =& $project->getProjectTemplateResources();
        if ($notifySubject) {
          if ($resources) { $notifySubject = $resources->getString($notifySubject); }
        }
        else {
          $productivityResources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
          $notifySubject = $productivityResources->getString(MY_PROJECTS_MANAGER_NOTIFY_SUBJECT);
        }
        if (!$notifyTpl && !$notifyTplHtml) {
          $notifyTpl = MY_PROJECTS_MANAGER_NOTIFY_TPL;
          $notifyTplHtml = MY_PROJECTS_MANAGER_NOTIFY_TPL_HTML;
          $resources =& SRA_ResourceBundle::getBundle(MY_PROJECTS_MANAGER_PRODUCTIVITY_RESOURCES);
        }
        if (!$resources) { $resources =& SRA_Controller::getAppResources(); }
        
        $params = SRA_Controller::getAppParams(NULL, 'my-projects');
        $tpl =& SRA_Controller::getAppTemplate();
        
        $tpl->assignByRef('project', $project);
        $tpl->assignByRef('resources', $resources);
        $tpl->assignByRef('task', $task);
        foreach($recipients as $uid => $name) {
          if (!is_numeric($uid) && !$projectAdmin) {
            $dao =& SRA_DaoFactory::getDao('OsUser');
            $projectAdmin =& $dao->findByPk($project->getCreator());
            $tpl->assignByRef('projectAdmin', $projectAdmin);
          }
          $email = !is_numeric($uid) ? $uid : OsUserVO::getEmailFromUid($uid);
          $tpl->assign('email', $email);
          $tpl->assign('name', $name);
          $tpl->assign('uid', is_numeric($uid) ? $uid : NULL);
          $tpl->displayToEmail($email, $notifySubject, $notifyTpl, $notifyTplHtml, $params['email'], $params['name'], $name);
        }
      }
    }
  }
	// }}}
  
  
	// {{{ _validateEntityObj
	/**
	 * used internally to validate a workflow entity. first the validation in 
   * $validate is invoked, followed by mandatory validation (if $obj exists in 
   * the database). returns an array of error messages, null if no validation 
   * errors occur
   * @param object $obj the entity object to validate
   * @param string[] $validate an optional array of custom validation to invoke
   * @param boolean $update whether or not to update $obj if it exists in the db 
   * and no validation errors occur
   * @access public
   * @return mixed
	 */
  function _validateEntityObj(&$obj, $validate, $update=FALSE) {
    $errs = NULL;
    if (method_exists($obj, 'validate')) {
      if ($validate) {
        foreach($validate as $vconstraint) {
          $obj->validate($vconstraint != '1' ? $vconstraint : NULL);
          if ($obj->validateErrors) { break; }
        }
      }
      
      if ($obj->recordExists && !$obj->validateErrors && (!$validate || !in_array('1', $validate))) {
        $obj->validate();
      }
      if (!($errs = $obj->validateErrors) && $update && $obj->recordExists) {
        $obj->update();
      }
    }
    
    return $errs;
  }
  // }}}
}
// }}}
?>
