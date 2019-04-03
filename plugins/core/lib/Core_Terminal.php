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
 * identifies that a node identifier is not valid. this includes an invalid node 
 * id or an invalid path
 * @type int
 */
define('CORE_VFS_ERROR_INVALID_ID', 1);

/**
 * identifies that a wildcard node identifier is valid but returned no matches
 * @type int
 */
define('CORE_VFS_ERROR_NO_MATCHES', 2);

/**
 * identifies that a particular operation is not permitted. for example, when 
 * attempting to change permissions or ownership of a node that a user does not 
 * own
 * @type int
 */
define('CORE_VFS_ERROR_OPERATION_NOT_PERMITTED', 4);

/**
 * identifies that the user does not have permission to perform an particular 
 * operation
 * @type int
 */
define('CORE_VFS_ERROR_PERMISSION_DENIED', 8);

// }}}

// {{{ Core_Terminal
/**
 * implements global ajax service and utility methods for the Terminal app
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_Terminal {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_Terminal
	/**
	 * not used
   * @access  public
	 */
	function Core_Terminal() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
	// {{{ clearTermEnv
	/**
	 * clears the user's current terminal buffer aliases, environment variables, 
   * or command history
   * @param array params 'type': the term environment value to clear - 
   * alias, env, or history, 'propagate': whether or not to propagate this 
   * change to all of the user's the current user has either directly or 
   * indirectly created
   * @access  public
	 * @return boolean
	 */
	function clearTermEnv($params) {
    global $user;
    if ($user && $params['type'] && ($params['type'] == 'alias' || $params['type'] == 'env' || $params['type'] == 'history')) {
      $db =& SRA_Controller::getAppDb();
      $uids = $params['propagate'] ? $user->getAllUids() : array($user->getPrimaryKey());
      foreach($uids as $uid) {
        $db->execute('DELETE FROM core_term_' . $params['type'] . " WHERE uid=$uid");
      }
      return TRUE;
    }
    
    return FALSE;
	}
	// }}}
  
  
	// {{{ addTermEnv
	/**
	 * adds an aliases or environment variables
   * @param array params 'type': the term environment value to add - 
   * 'alias' or 'env', 'id': string - the environment variable or alias name to 
   * add, 'value': string - the value for the alias/environment variable, and 
   * 'propagate': whether or not to propagate this change to all of the user's 
   * the current user has either directly or indirectly created
   * @access  public
	 * @return boolean
	 */
	function addTermEnv($params) {
    global $user;
    if ($user && $params['type'] && ($params['type'] == 'alias' || $params['type'] == 'env') && $params['id'] && $params['value']) {
      $db =& SRA_Controller::getAppDb();
      $uids = $params['propagate'] ? $user->getAllUids() : array($user->getPrimaryKey());
      $table = 'core_term_' . $params['type'];
      $col = $params['type'] == 'alias' ? 'alias' : 'name';
      foreach($uids as $uid) {
        // see if it already exists
        $results = $db->fetch("SELECT count(*) FROM $table WHERE uid=$uid  AND $col=" . $db->convertText($params['id']), array(SRA_DATA_TYPE_INT));
        $row =& $results->next();
        if ($row[0] == 1) {
          $query = "UPDATE $table SET value=" . $db->convertText($params['value']) . " WHERE uid=$uid AND $col=" . $db->convertText($params['id']);
        }
        else {
          $query = "INSERT INTO $table (uid, value, $col) VALUES ($uid, " . $db->convertText($params['value']) . ', ' . $db->convertText($params['id']) . ')';
        }
        $db->execute($query);
      }
      return TRUE;
    }
    
    return FALSE;
	}
	// }}}
  
  
	// {{{ removeTermEnv
	/**
	 * removes an aliases or environment variables
   * @param array params 'type': the term environment value to remove - 
   * 'alias' or 'env', 'id': string - the environment variable or alias name to 
   * remove, 'propagate': whether or not to propagate this change to all of the 
   * user's the current user has either directly or indirectly created
   * @access  public
	 * @return boolean
	 */
	function removeTermEnv($params) {
    global $user;
    if ($user && $params['type'] && ($params['type'] == 'alias' || $params['type'] == 'env') && $params['id']) {
      $db =& SRA_Controller::getAppDb();
      $uids = $params['propagate'] ? $user->getAllUids() : array($user->getPrimaryKey());
      foreach($uids as $uid) {
        $db->execute('DELETE FROM core_term_' . $params['type'] . " WHERE uid=$uid AND " . ($params['type'] == 'alias' ? 'alias' : 'name') . ' = ' . $db->convertText($params['id']));
      }
      return TRUE;
    }
    
    return FALSE;
	}
	// }}}
  
  
	// {{{ updateTermUserAttr
	/**
	 * updates a terminal user property
   * @param array params 'attr': the attribute to update: 
   * 'coreTermHistoryBuffer' or 'umask', 'value': the value to set, and 
   * 'propagate': whether or not to propagate this change to all of the 
   * user's the current user has either directly or indirectly created
   * @access  public
	 * @return boolean
	 */
	function updateTermUserAttr($params) {
    global $user;
    if ($user && $params['attr'] && ($params['attr'] == 'coreTermHistoryBuffer' || $params['attr'] == 'umask') && isset($params['value'])) {
      $db =& SRA_Controller::getAppDb();
      $uids = $params['propagate'] ? $user->getAllUids() : array($user->getPrimaryKey());
      $col = $params['attr'] == 'umask' ? 'umask' : 'core_term_history_buffer';
      $val = $db->convertInt($params['value']);
      foreach($uids as $uid) {
        $db->execute("UPDATE os_user SET $col=$val WHERE uid=$uid");
      }
      return TRUE;
    }
    
    return FALSE;
	}
	// }}}
  
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a Core_Terminal object.
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
?>
