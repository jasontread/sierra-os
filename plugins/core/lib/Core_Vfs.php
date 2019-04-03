<?php
if (!class_exists('core_vfs') && !class_exists('Core_Vfs')) {
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
 * identifies that the user does not have permission to perform an particular 
 * operation
 * @type int
 */
define('CORE_VFS_ERROR_PERMISSION_DENIED', 1);

/**
 * identifies that a node identifier is not valid. this includes an invalid node 
 * id or an invalid path
 * @type int
 */
define('CORE_VFS_ERROR_INVALID_ID', 2);

/**
 * identifies that a particular operation is not permitted. for example, when 
 * attempting to change permissions or ownership of a node that a user does not 
 * own
 * @type int
 */
define('CORE_VFS_ERROR_OPERATION_NOT_PERMITTED', 3);

/**
 * the overwrite code - used to identify when a node will overwrite an existing 
 * node in a copy or move operation
 * @type int
 */
define('CORE_VFS_OVERWRITING', -1);

// }}}

// {{{ Core_Vfs
/**
 * implements global ajax service and utility methods for the virtual file 
 * system
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_Vfs {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_Vfs
	/**
	 * not used
   * @access  public
	 */
	function Core_Vfs() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
	// {{{ vfs_chgrp
	/**
	 * changes the group ownership of a node or nodes. the return value will be 
   * an associative array indexed by file path where the value will be either 
   * TRUE (changed), FALSE (unchanged) or an error string. if a general error 
   * occurs such as an invalid group the return value will be a single error 
   * string
   * @param array params contains the same parameter values as the 'getNodes' 
   * method (ids, recursive, traverseLinks, linkStopDir, maxRecursion) as well 
   * as the value 'group' - the gid or name of the new group ownership for the 
   * nodes specified
   * @access  public
	 * @return void
	 */
	function vfs_chgrp($params) {
    $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
    
    // validate group
    if (isset($params['group'])) {
      $dao =& SRA_DaoFactory::getDao('OsGroup');
      if (is_numeric($params['group'])) {
        $group =& $dao->findByPk($params['group']);
      }
      else {
        $db =& SRA_Controller::getAppDb();
        $groups =& $dao->findBySqlConstraints(array('name' => $db->convertText($params['group'])));
        $group = is_array($groups) && count($groups) ? $groups[0] : NULL;
      }
    }
    $errMsg = NULL;
    $nodes = array();
    if (OsGroupVO::isValid($group) && ($group->isOwner() || $group->isMember())) {
      $nodes =& Core_Vfs::getNodes($params);
      $results = array();
      $keys = array_keys($nodes);
      foreach($keys as $key) {
        if (CoreVfsNodeVO::isValid($nodes[$key])) {
          if ($nodes[$key]->isRootNode()) {
            $results[$nodes[$key]->getPathString()] = $resources->getString('VFS.error.cannotModifyRoot', array('path' => $nodes[$key]->getPathString()));
          }
          else {
            $nodes[$key]->setNodeGroup($group);
            $nodes[$key]->validate();
            if (isset($nodes[$key]->validateErrors['nodeGroup'])) {
              $results[$nodes[$key]->getPathString()] = $nodes[$key]->validateErrors['nodeGroup'];
            }
            else {
              $results[$nodes[$key]->getPathString()] = $nodes[$key]->isDirty();
              $nodes[$key]->update();
            }
          }
        }
      }
    }
    else if (OsGroupVO::isValid($group)) {
      $errMsg = 'chgrp: ' . $resources->getString('VFS.error.notMemberOrOwnerOfGroup', array('name' => $group->getName()));
    }
    else {
      $errMsg = $resources->getString('VFS.error.invalidGroup', array('id' => $params['group']));
    }
    return $errMsg ? $errMsg : (count($results) ? $results : NULL);
	}
	// }}}
  
  
	// {{{ vfs_chmod
	/**
	 * changes the permissions of node or nodes
   * @param array params contains the same parameter values as the 'getNodes' 
   * method (ids, recursive, traverseLinks, linkStopDir, maxRecursion) as well 
   * as the value 'permissions' - the new numeric permissions mode to set, and 
   * 'op' - the operation that should be performed between 'permissions' and the 
   * current file permissions (either '+' to add or '-' to subtract)
   * @access  public
	 * @return void
	 */
	function vfs_chmod($params) {
    $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
    
    $nodes =& Core_Vfs::getNodes($params);
    $results = array();
    $keys = array_keys($nodes);
    foreach($keys as $key) {
      if (CoreVfsNodeVO::isValid($nodes[$key])) {
        if ($nodes[$key]->isRootNode()) {
          $results[$nodes[$key]->getPathString()] = $resources->getString('VFS.error.cannotModifyRoot', array('path' => $nodes[$key]->getPathString()));
        }
        else {
          $permissions = $params['permissions'] * 1;
          if ($params['op'] == '+') { $permissions = $permissions | $nodes[$key]->getPermissions(); }
          if ($params['op'] == '-') { $permissions = ~$permissions & $nodes[$key]->getPermissions(); }
          $nodes[$key]->setPermissions($permissions);
          $nodes[$key]->validate();
          if (isset($nodes[$key]->validateErrors['permissions'])) {
            $results[$nodes[$key]->getPathString()] = $nodes[$key]->validateErrors['permissions'];
          }
          else {
            $results[$nodes[$key]->getPathString()] = $nodes[$key]->isDirty();
            $nodes[$key]->update();
          }
        }
      }
    }

    return count($results) ? $results : NULL;
	}
	// }}}
  
  
	// {{{ vfs_chown
	/**
	 * changes the ownership of a node or nodes. the return value will be an 
   * associative array indexed by file path where the value will be either 
   * TRUE (changed), FALSE (unchanged) or an error string. if a general error 
   * occurs such as an invalid user the return value will be a single error 
   * string
   * @param array params contains the same parameter values as the 'getNodes' 
   * method (ids, recursive, traverseLinks, linkStopDir, maxRecursion) as well 
   * as the value 'user' - the uid or username of the new owner for the nodes 
   * specified
   * @access  public
	 * @return void
	 */
	function vfs_chown($params) {
    $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
    
    // validate user
    if (isset($params['user'])) {
      $dao =& SRA_DaoFactory::getDao('OsUser');
      if (is_numeric($params['user'])) {
        $user =& $dao->findByPk($params['user']);
      }
      else {
        $db =& SRA_Controller::getAppDb();
        $users =& $dao->findBySqlConstraints(array('user_name' => $db->convertText($params['user'])));
        $user = is_array($users) && count($users) ? $users[0] : NULL;
      }
    }
    $errMsg = NULL;
    $nodes = array();
    if (OsUserVO::isValid($user) && $user->isParent()) {
      $nodes =& Core_Vfs::getNodes($params);
      $results = array();
      $keys = array_keys($nodes);
      foreach($keys as $key) {
        if (CoreVfsNodeVO::isValid($nodes[$key])) {
          if ($nodes[$key]->isRootNode()) {
            $results[$nodes[$key]->getPathString()] = $resources->getString('VFS.error.cannotModifyRoot', array('path' => $nodes[$key]->getPathString()));
          }
          else {
            $nodes[$key]->setNodeOwner($user);
            $nodes[$key]->validate();
            if (isset($nodes[$key]->validateErrors['nodeOwner'])) {
              $results[$nodes[$key]->getPathString()] = $nodes[$key]->validateErrors['nodeOwner'];
            }
            else {
              $results[$nodes[$key]->getPathString()] = $nodes[$key]->isDirty();
              $nodes[$key]->update();
            }
          }
        }
      }
    }
    else if (OsUserVO::isValid($user)) {
      $errMsg = 'chown: ' . $resources->getString('VFS.error.notParentOfUser', array('name' => $user->getUserName()));
    }
    else {
      $errMsg = $resources->getString('VFS.error.invalidUser', array('id' => $params['user']));
    }
    return $errMsg ? $errMsg : (count($results) ? $results : NULL);
	}
	// }}}
  
  
	// {{{ vfs_cp
	/**
	 * copies a node or nodes. the return value will be an associative array 
   * indexed by file path where the value will be either TRUE (copied), 
   * FALSE or CORE_VFS_OVERWRITING (not copied) or an error string. if a general 
   * error occurs such as an invalid destination or insufficient permissions to 
   * dest, the return value will be a single error string
   * @param array params contains the same parameter values as the 'getNodes' 
   * method (ids, recursive, traverseLinks, linkStopDir, maxRecursion) as well 
   * as the following values:
   *  dest:             path to or id of the directory to copy 'nodes' to
   *  force:            Force overwrite (do not prompt for confirmation) of 
   *                    existing files (CAREFUL: existing files and directories 
   *                    will be deleted)
   *  link:             Link nodes in 'dest' instead of copying
   *  preserve:         node attributes to preserve. attribute options include:
   *                    mode:       the file permissions
   *                    ownership:  the file ownership (user and group)
   *                    timestamps: the created and updated timestamps
   *                    created:    the created timestamp
   *                    updated:    the last updated timestamp
   *                    all:        preserve all attributes
   *                    none:       do not preserve any attributes
   *  update:           copy only when the source file is newer than the 
   *                    destination file or when the destination file does not 
   *                    exist
   *  useOverwriteCode: if 'force' is false, this parameter determines whether 
   *                    the return value for overwriting 'nodes' should be the 
   *                    overwrite code CORE_VFS_OVERWRITING or an error message
   * @access  public
	 * @return void
	 */
	function vfs_cp($params) {
    // TODO
	}
	// }}}
  
  
	// {{{ getExecutableSource
	/**
	 * retrieves the javascript source from an executable file. if an error 
   * occurs for any reason, this code will output the corresponding error 
   * message. thus, the return value of invoking this method can always be 
   * eval'd
   * @param array params contains the hash value: 'file' - the path to the file 
   * to return the executable javascript source for
   * @access  public
	 * @return string
	 */
	function & getExecutableSource($params) {
    $errMsg = NULL;
    $code = NULL;
    $resources =& SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
    $node =& Core_Vfs::getNodes(array('ids' => $params['file']));
    if (CoreVfsNodeVO::isValid($node) && !$node->isFolder() && $node->hasPermission(CORE_VFS_NODE_PBIT_EXECUTE)) {
      if ($node->getType() == 'core:CoreFile' && $node->getEntityId()) {
        $db =& SRA_Controller::getAppDb();
        $results =& $db->fetch('SELECT data_txt FROM core_file WHERE file_id=' . $node->getEntityId());
        if (!SRA_Error::isError($results) && ($row =& $results->next())) {
          $code = $row[0];
        }
      }
    }
    else if (CoreVfsNodeVO::isValid($node) && $node->isFolder()) {
      $errMsg = $resources->getString('core.run.error.folder', array('path' => $node->getPathString()));
    }
    else if (CoreVfsNodeVO::isValid($node) && !$node->hasPermission(CORE_VFS_NODE_PBIT_EXECUTE)) {
      $errMsg = $resources->getString('core.run.error.permissions', array('name' => $node->getName()));
    }
    else {
      $errMsg = $node;
    }
    return $errMsg ? 'term.echo("' . str_replace('"', '\\"', $errMsg) . '")' : $code;
	}
	// }}}
  
  
	// {{{ getNodes
	/**
	 * retrieves vfs nodes. the return value is an associative array indexed by 
   * node id. if an error occurs for any value in params['ids'], an element 
   * will be added to the return value where the index is the 'id' and the value 
   * is the error string. the return value will be a single CoreVfsNodeVO 
   * reference or a single error string if 'ids' is a scalar value, does not end 
   * with the wildcard character, and 'recursive' is FALSE.
   * @param array params contains the hash values: 
   * 'ids' - an array of the ids of the nodes to retrieve. alternatively, this 
   * list may contain one of the following identifiers:
   *  CORE_VFS_NODE_TYPE_FOLDER_DESKTOP: the active desktop (workspace) folder
   *                                     node. additional params value 
   *                                     'workspaceId' must also be specified
   *  CORE_VFS_NODE_TYPE_FOLDER_HOME:    the user's home folder node
   *  CORE_VFS_NODE_TYPE_FOLDER_NETWORK: the root network folder node
   *  CORE_VFS_NODE_TYPE_FOLDER_TRASH:   the user's trash folder node
   *  null:                              the virtual root node
   * or a string path identifier (starting with / (root) or ~ (user's home 
   * directory)). the wildcard character '*' is supported in path strings only 
   * if it occurs as the final string of that path. the descend one directory 
   * identifier ('../') is supported in path names as well. if 'ids' is a single 
   * scalar value, is not a path ending with the wildcard character, and 
   * recursive is FALSE, the return value will be a single CoreVfsNodeVO 
   * reference OR a single error string. otherwise, the return value will be an 
   * associative array indexed by path name OR 'ids' value if an error has 
   * occurred for a particular node id
   * 
   * 'recursive' (default FALSE) - whether or not children of the nodes 
   * identified above should also be included in the return value
   *
   * 'preserveRoot': do not operate recursively on the root directory (/)
   * 
   * 'traverseLinks' (default FALSE) - if 'recursive' is TRUE, this option 
   * identifies whether or not the recursion should traverse linked directories.
   * circular recursion will be detected and aborted
   * 
   * 'linkStopDir' (default FALSE) - if 'traverseLinks' is TRUE, this option 
   * identifies whether or not the recursion should continue through directories
   * in the linked directories
   * 
   * 'maxRecursion' (default NULL) - if specified and 'recursive' is TRUE, the 
   * max allowed recursion depth will be this value. this includes both links 
   * and regular directories
   *
   * 'property' (default NULL) - if specified, ONLY this attribute of the valid 
   * CoreVfsNodeVO instanced returned by the method invocation will be returned. 
   * Use this option to reduce data transfer for operations where only a 
   * specific property is needed
   * 
   * @param int $uid the id of an alternate user to use for this lookup. if not 
   * specified, the global $user variable will be used
   * @access  public
	 * @return array
	 */
	function & getNodes($params, $uid) {
    require_once('model/CoreVfsNodeVO.php');
    $db =& SRA_Controller::getAppDb();
    $dao =& SRA_DaoFactory::getDao('CoreVfsNode');
    
    global $user;
    $nodeUser =& $user;
    if ($uid && (!$user || $user->getPrimaryKey() != $uid)) {
      $userDao =& SRA_DaoFactory::getDao('OsUser');
      $nodeUser =& $userDao->findByPk($uid);
    }
    $homePath = $nodeUser->getVfsHomeDirPath();
    
    $returnSingle = $params['ids'] && !is_array($params['ids']) && !SRA_Util::endsWith($params['ids'], '*') && !$params['recursive'];
    $params['ids'] = is_array($params['ids']) ? $params['ids'] : ($params['ids'] ? array($params['ids']) : NULL);

    if (!$nodeUser || !$params['ids'] || !is_array($params['ids']) || !count($params['ids']) || (in_array(CORE_VFS_NODE_TYPE_FOLDER_DESKTOP, $params['ids']) && (!isset($params['workspaceId']) || !WorkspaceVO::isValid($workspace =& $nodeUser->getWorkspaces($params['workspaceId']))))) {
      $msg = "Core_Vfs::getNodes: Failed - Insufficient data to invoke this method";
      SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM);
    }
    $keys = array_keys($params['ids']);
    
    // construct cache key, look for cache results
    static $_getNodesCache = array();
    $cacheKey = 'ids=';
    foreach($keys as $key) {
      $cacheKey .= $params['ids'][$key] . ',';
    }
    $cacheKey .= 'recursive=' . $params['recursive'] . ',traverseLinks=' . $params['traverseLinks'] . ',linkStopDir=' . $params['linkStopDir'] . ',maxRecursion=' . $params['maxRecursion'] . ',property=' . $params['property'] . ',uid=' . $uid . ',returnSingle=' . $returnSingle;
    if (isset($_getNodesCache[$cacheKey])) { return $_getNodesCache[$cacheKey]; }
    
    // results value variables
    $nodes = array();
    $invalidIds = array();
    $pks = array();
    $pathStrings = array();

    // iterate through each id in 'ids' and add corresponding results
    foreach($keys as $key) {
      $id = $params['ids'][$key];
      // primary key
      if (is_numeric($id)) {
        $pks[$id] = TRUE;
      }
      // user node
      else if ($id == CORE_VFS_NODE_TYPE_FOLDER_NETWORK) {
        array_push($nodes, CoreVfsNodeVO::getNetworkRootNode());
      }
      // root node
      else if (!$id || $id == '/') {
        array_push($nodes, CoreVfsNodeVO::getVirtualRootNode());
      }
      // invalid node id
      else if (!SRA_Util::beginsWith($id, '~') && !SRA_Util::beginsWith($id, '/') && !SRA_Util::beginsWith($id, '.') && !CoreVfsNodeVO::isSystemNode($id)) {
        array_push($invalidIds, $id);
      }
      // path string
      else {
        $id = CoreVfsNodeVO::isSystemNode($id) ? ($id == CORE_VFS_NODE_TYPE_FOLDER_DESKTOP ? $nodeUser->getVfsWorkspaceDirPath($workspace->getPrimaryKey()) : ($id == CORE_VFS_NODE_TYPE_FOLDER_TRASH ? $nodeUser->getVfsTrashDirPath() : $nodeUser->getVfsHomeDirPath())) : (SRA_Util::beginsWith($id, '~') ? $homePath . substr($id, SRA_Util::beginsWith($id, '~/') ? 2 : 1) : $id);
        $id = SRA_Util::endsWith($id, '/') ? substr($id, 0, -1) : $id;
        
        // stack to keep track of the path in terms of node ids
        $path = array();
        
        $dirs = explode('/', $id);
        $like = strstr($dirs[count($dirs) - 1], '*');
        for($i=1; $i<count($dirs); $i++) {
          // current directory
          if ($dirs[$i] == '.') { continue; }
          
          // is this the last lookup?
          $lastLookup = $i == (count($dirs) - 1);
          
          // up 1 directory
          if ($dirs[$i] == '..') { 
            array_pop($path);
            if ($lastLookup) {
              if (count($path)) {
                $pks[$path[count($path) - 1]] = TRUE;
              }
              else {
                array_push($nodes, CoreVfsNodeVO::getVirtualRootNode());
              }
            }
            continue; 
          }
          
          // determine parent id
          $parent = count($path) ? $path[count($path) - 1] : NULL;
          
          // lookup next node id(s)
          $query = 'SELECT node_id, linked_to, name FROM core_vfs_node WHERE parent ' . ($parent ? '=' . $parent : ' IS NULL') . ' AND name LIKE ' . ($db->isType(SRA_DB_TYPE_MYSQL) ? 'BINARY ' : '') . $db->convertText($like && $lastLookup ? str_replace('*', '%', $dirs[$i]) : $dirs[$i]);
          $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT));
          // add results either to the path stack or to the results if this is 
          // the last lookup
          if ($results->count() >= 1 && $lastLookup) {
            while($row =& $results->next()) {
              $pks[$row[0]] = TRUE;
              $pathStrings[$row[0]] = $like ? substr($id, 0, strrpos($id, '/') + 1) . $row[2] : $id;
            }
          }
          else if ($results->count() == 1) {
            $row =& $results->next();
            array_push($path, $row[1] ? $row[1] : $row[0]);
          }
          // error, invalid node id
          else {
            array_push($invalidIds, $params['ids'][$key]);
            break;
          }
        }
      }
    }
    
    // results array
    $results = array();
    // add nodes
    $keys = array_keys($nodes);
    foreach($keys as $key) {
      $results[$nodes[$key]->getPrimaryKey()] =& $nodes[$key];
    }
    
    // add nodes from primary keys
    if (count($pks)) {
      $nodes =& $dao->findByPks(array_keys($pks));
      $keys = array_keys($nodes);
      foreach($keys as $key) {
        $results[CoreVfsNodeVO::isValid($nodes[$key]) ? $nodes[$key]->getPrimaryKey() : $pathStrings[$pks[$key]]] =& $nodes[$key];
      }
    }
    
    // add errors elements
    if (count($invalidIds)) {
      $resources = SRA_ResourceBundle::getBundle('plugins/core/etc/l10n/core');
      foreach($invalidIds as $id) {
        $results[$id] = $resources->getString('VFS.error.invalidId', array('path' => $id));
      }
    }
    
    // perform recursion
    if ($params['recursive']) {
      $keys = array_keys($results);
      foreach($keys as $key) {
        if ($params['recursive'] && CoreVfsNodeVO::isValid($results[$key]) && $results[$key]->isFolder() && (!$results[$key]->getLinkedTo() || $params['traverseLinks']) && (!$params['preserveRoot'] || !$results[$key]->isRootNode())) {
          $nodes =& $results[$key]->getChildNodes($params['linkStopDir'] && $results[$key]->getLinkedTo() ? FALSE : TRUE, $params['preserveRoot'], $params['traverseLinks'], $params['linkStopDir'], isset($params['maxRecursion']) ? $params['maxRecursion'] - 1 : NULL);
          $nkeys = array_keys($nodes);
          foreach($nkeys as $nkey) {
            if (CoreVfsNodeVO::isValid($nodes[$nkey])) {
              $results[$nodes[$nkey]->getPrimaryKey()] =& $nodes[$nkey];
            }
          }
        }
      }
    }
    
    // return either singular or full array of results
    $keys = array_keys($results);
    
    // return just 1 property
    if ($params['property']) {
      foreach($keys as $key) {
        $results[$key] = CoreVfsNodeVO::isValid($results[$key]) ? $results[$key]->getAttribute($params['property']) : $results[$key];
      }
    }
    
    $_getNodesCache[$cacheKey] = $returnSingle && count($results) ? $results[$keys[0]] : $results;
    return $_getNodesCache[$cacheKey];
	}
	// }}}
  
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a Core_Vfs object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'core_vfs');
	}
	// }}}
	
  
  // private operations
  
}
// }}}
}
?>
