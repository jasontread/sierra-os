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
 * the max # of fields to allow in the upload file window
 * @type int
 */
define('CORE_BROWSER_MAX_UPLOAD_FILES', 9);
// }}}

// {{{ Core_Browser
/**
 * implements global ajax service and utility methods for the core Browser 
 * application
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_Browser {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_Browser
	/**
	 * not used
   * @access  public
	 */
	function Core_Browser() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
  
	// {{{ ajaxDisplayFile
	/**
	 * returns the base nodes for a given browser view. these are 1) the desktop 
   * node, 2) the user's home node, and 3) the trash node
   * @param array $params must contain 1 parameter 'workspace' providing the id 
   * of the current displayed user workspace
   * @access  public
   * @return CoreVfsNode[]
	 */
	function ajaxDisplayFile($params) {
    global $user;
    $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
    if ($user && $params['node']) {
      $dao =& SRA_DaoFactory::getDao('CoreFile');
      if (SRA_Error::isError($file =& $dao->findByPk($params['node']))) {
        $msg = 'Core_Browser::ajaxDisplayFile: Failed - file specified is not valid: ' . $params['node'];
        return SRA_Error::logError($msg, __FILE__, __LINE__);
      }
      else {
        if ($file && ($attr =& $file->getData())) {
          header('Location: ' . $attr->getUri());
          exit;
        }
        else {
          return $resources->getString('Browser.error.noPermissionToDisplayFile');
        }
      }
    }
    else {
      $msg = 'Core_Browser::ajaxDisplayFile: Failed - no user session is active or insufficient data to perform query. file id: ' . $params['node'];
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
    return $resources->getString('Browser.error.unableToDisplayFile');
  }
	// }}}
  
  
	// {{{ ajaxEmptyTrash
	/**
	 * used to empty the user's trash
   * @param array $params NA
   * @access  public
   * @return NULL on success or an error string otherwise
	 */
	function ajaxEmptyTrash($params) {
    global $user;
    require_once('model/CoreVfsNodeVO.php');
    if ($user && CoreVfsNodeVO::isValid($trash =& $user->getVfsTrashDir())) {
      $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
      $nodes =& $trash->getChildNodes();
      $errs = array();
      $keys = array_keys($nodes);
      foreach($keys as $key) {
        if (SRA_Error::isError($nodes[$key]->delete())) {
          $errs[] = $resources->getString('Browser.error.unableToDeleteNode', array('path' => $nodes[$key]->getPathString()));
        }
      }
      return count($errs) ? $errs : NULL;
    }
    else {
      $msg = 'Core_Browser::ajaxEmptyTrash: Failed - no user session is active';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
	// {{{ ajaxFileSearch
	/**
	 * returns any files matching the search criteria specified. this service 
   * @param array $params contains the following values:
   *  search : the search string
   *  [attr] : any sorting constraints
   * @param int $limit the query limit
   * @param int $offset the query offset
   * @access  public
   * @return CoreVfsNode[]
	 */
	function & ajaxFileSearch($params, $limit, $offset) {
    global $user;
    if ($user && isset($params['search'])) {
      $db =& SRA_Controller::getAppDb();
      $query = 'SELECT n.node_id, MATCH(f.data_txt) AGAINST (' . $db->convertText($params['search']). ') AS score ';
      $query .= 'FROM core_vfs_node n, core_file f WHERE n.node_owner=' . $user->getAttrDbValue() . ' AND (MATCH(f.data_txt) AGAINST (' . $db->convertText($params['search']). ') ';
      $query .= 'OR n.name like ' . $db->convertText('%' . $params['search'] . '%') . ') ';
      $query .= 'AND n.type=' . $db->convertText('core:CoreFile') . ' AND n.entity_id=f.file_id ORDER BY score DESC';
      $rows =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT), $limit, $offset);
      if (!SRA_Error::isError($rows)) {
        $pks = array();
        while($row =& $rows->next()) {
          $pks[] = $row[0];
        }
      }
      else {
        return $rows;
      }
      $results = array();
      if (count($pks)) {
        $dao =& SRA_DaoFactory::getDao('CoreVfsNode');
        $results =& $dao->findByPks($pks);
      }
      $results[SRA_WS_RESULT_COUNT_KEY] = $rows->getTotalCount();
      return $results;
    }
    $msg = 'Core_Browser::ajaxFileSearch: Failed - no user session is active or insufficient data to perform query. search: ' . $params['search'];
    return SRA_Error::logError($msg, __FILE__, __LINE__);
  }
	// }}}
  
  
	// {{{ ajaxFileUpload
	/**
	 * handles the file upload process within the browser. returns an array of 
   * error messages when applicable, FALSE otherwise
   * @param array $params contains the following values:
   *  parent : the id of the parent node that the files are being uploaded to
   *  fileId : if a file is being updated, the id of that file (parent is not 
   *           required in this case). the first file in the $_FILES global will
   *           be used when fileId is specified
   *  fileN  : the files being upload where 1 >= N <= CORE_BROWSER_MAX_UPLOAD_FILES
   * @access  public
   * @return String[]
	 */
	function & ajaxFileUpload($params) {
    global $user;
    if ($user && (isset($params['parent']) || isset($params['fileId']) || isset($params['file1']))) {
      $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
      if (!file_exists($params['file1']['tmp_name'])) {
        return array($resources->getString('Browser.error.missingFile'));
      }
      $nodeDao =& SRA_DaoFactory::getDao('CoreVfsNode');
      $fileDao =& SRA_DaoFactory::getDao('CoreFile');
      $node = isset($params['fileId']) ? $nodeDao->findBySqlConstraints(array("entity_id" => $params['fileId'], 'type' => '"core:CoreFile"')) : $nodeDao->findByPk($params['parent']);
      if (is_array($node) && count($node) == 1) { $node =& $node[0]; }
      if (CoreVfsNodeVO::isValid($node)) {
        if (!$node->hasPermission(CORE_VFS_NODE_WRITE)) {
          $msg = 'Core_Browser::ajaxFileUpload: Failed - User ' . $user->getUserName() . ' attempted write to node: ' . $node->getPathString();
          SRA_Error::logError($msg, __FILE__, __LINE__);
          return array($resources->getString('Browser.error.invalidPermissions', array('access' => CoreVfsNodeVO::getPermissionsString(CORE_VFS_NODE_WRITE), 'path' => $node->getPathString())));
        }
        else {
          // update existing file
          if (isset($params['fileId'])) {
            $fileDao =& SRA_DaoFactory::getDao('CoreFile');
            if (!CoreFileVO::isValid($file =& $fileDao->findByPk($params['fileId']))) {
              $msg = 'Core_Browser::ajaxFileUpload: Failed - Unable to lookup file: ' . $params['fileId'];
              return SRA_Error::logError($msg, __FILE__, __LINE__);
            }
            else {
              $file->setData($params['file1']);
              if (!$file->validate()) {
                return $file->validateErrors;
              }
              else {
                if (SRA_Error::isError($err = $fileDao->update($file))) {
                  return $err;
                }
              }
            }
          }
          // upload new files
          else {
            $errs = array();
            $files = array();
            for($i=1; $i<=CORE_BROWSER_MAX_UPLOAD_FILES; $i++) {
              if (isset($params['file' . $i]) && file_exists($params['file' . $i]['tmp_name'])) {
                $files[$i] = new CoreFileVO(array('data' => $params['file' . $i], 'node_parent' => $params['parent']));
                if (!$files[$i]->validate()) {
                  $errs = array_merge($errs, $files[$i]->validateErrors);
                }
              }
            }
            if (count($errs)) {
              return $errs;
            }
            else {
              $keys = array_keys($files);
              foreach($keys as $key) {
                if (SRA_Error::isError($err = $fileDao->insert($files[$key]))) {
                  return $err;
                }
              }
            }
          }
        }
        return FALSE;
      }
      else {
        $msg = 'Core_Browser::ajaxFileUpload: Failed - Unable to lookup node for parent: ' . $params['parent'] . ' fileId: ' . $params['fileId'];
        return SRA_Error::logError($msg, __FILE__, __LINE__);
      }
    }
    $msg = 'Core_Browser::ajaxFileUpload: Failed - no user session is active or insufficient data to perform query. parent: ' . $params['parent'] . ' fileId: ' . $params['fileId'] . ' file1: ' . $params['file1'];
    return SRA_Error::logError($msg, __FILE__, __LINE__);
  }
	// }}}
  
  
	// {{{ ajaxGetBaseNodes
	/**
	 * returns the base nodes for a given browser view. these are 1) the desktop 
   * node, 2) the user's home node, and 3) the trash node
   * @param array $params must contain 1 parameter 'workspace' providing the id 
   * of the current displayed user workspace
   * @access  public
   * @return CoreVfsNode[]
	 */
	function & ajaxGetBaseNodes($params) {
    global $user;
    return $user && $params['workspace'] ? $user->getBaseNodes($params['workspace']) : NULL;
  }
	// }}}
  
  
	// {{{ ajaxGetRootBrowserNodes
	/**
	 * returns the root nodes within the file system that the user has access to
   * @param array $params not used
   * @access  public
   * @return CoreVfsNode[]
	 */
	function & ajaxGetRootBrowserNodes($params) {
    global $user;
    if ($user) {
      require_once('model/CoreVfsNodeVO.php');
      $root =& CoreVfsNodeVO::getVirtualRootNode();
      return $root->getChildNodes();
    }
    return NULL;
  }
	// }}}
  
  
	// {{{ ajaxGetSidebarNodes
	/**
	 * returns the nodes that should be placed in the user's sidebar
   * @param array $params may contain 1 parameter 'workspace' providing the id 
   * of the current displayed user workspace
   * @access  public
   * @return CoreVfsNode[]
	 */
	function & ajaxGetSidebarNodes($params) {
    global $user;
    if ($user) {
      return $user->getSidebarNodes($params['workspace']);
    }
    return NULL;
  }
	// }}}
  
  
	// {{{ ajaxGetTrashNode
	/**
	 * returns the user's trash node
   * @param array $params not used
   * @access  public
   * @return CoreVfsNode
	 */
	function & ajaxGetTrashNode($params) {
    global $user;
    require_once('model/CoreVfsNodeVO.php');
    return $user ? $user->getVfsTrashDir() : NULL;
  }
	// }}}
  
  
	// {{{ ajaxMoveNodes
	/**
	 * returns the nodes that should be placed in the user's sidebar
   * @param array $params constains the following parameters
   *   nodeN: 1..* ids of the nodes to be moved
   *   dest:  the id of the destination node. alternatively, this may be a 
   *          system node identifier (one of the CORE_VFS_NODE_TYPE_FOLDER_* 
   *          constants)
   * @access  public
   * @return CoreVfsNodeVO[] on success, or an error message otherwise
	 */
	function & ajaxMoveNodes($params) {
    global $user;
    $dao =& SRA_DaoFactory::getDao('CoreVfsNode');
    if ($user && !is_numeric($params['dest'])) { $dest =& $user->getCoreVfsUserNodes($params['dest'], NULL, TRUE); };
    if ($user && $params['dest'] && (CoreVfsNodeVO::isValid($dest) || ($dest =& $dao->findByPk($params['dest']))) && count($params) > 1) {
      $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
      if (!$dest->hasPermission(CORE_VFS_NODE_WRITE)) {
        $msg = 'Core_Browser::ajaxMoveNodes: Failed - User ' . $user->getUserName() . ' attempted write to node: ' . $dest->getPathString();
        SRA_Error::logError($msg, __FILE__, __LINE__);
        return $resources->getString('Browser.error.invalidPermissions', array('access' => CoreVfsNodeVO::getPermissionsString(CORE_VFS_NODE_WRITE), 'path' => $dest->getPathString()));
      }
      else {
        $nodes = array();
        $keys = array_keys($params);
        foreach($keys as $key) {
          if (SRA_Util::beginsWith($key, 'node')) {
            if (!CoreVfsNodeVO::isValid($node =& $dao->findByPk($params[$key]))) {
              $msg = 'Core_Browser::ajaxMoveNodes: Failed - node ' . $key . ' is not valid';
              return SRA_Error::logError($msg, __FILE__, __LINE__);
            }
            else if (!$node->hasPermission(CORE_VFS_NODE_WRITE) || $node->isSystemNode()) {
              $msg = 'Core_Browser::ajaxMoveNodes: Failed - User ' . $user->getUserName() . ' attempted move node: ' . $node->getPathString();
              SRA_Error::logError($msg, __FILE__, __LINE__);
              return $resources->getString($node->isSystemNode() ? 'Browser.error.cannotMoveToTrash' : 'Browser.error.invalidPermissions', array('access' => CoreVfsNodeVO::getPermissionsString(CORE_VFS_NODE_WRITE), 'path' => $node->getPathString()));
            }
            $nodes[$key] =& $node;
          }
        }
        $keys = array_keys($nodes);
        foreach($keys as $key) {
          $nodes[$key]->setParent($dest);
          if (!$nodes[$key]->validate()) {
            return implode('\n', $nodes[$key]->validateErrors);
          }
        }
        foreach($keys as $key) {
          $dao->update($nodes[$key]);
        }
        return $nodes;
      }
    }
    else {
      $msg = 'Core_Browser::ajaxMoveNodes: Failed - no user session is active or insufficient data to perform query. dest: ' . $params['dest'];
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a Core_Browser object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'core_browser');
	}
	// }}}
	
  
  // private operations
  
}
// }}}
?>
