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

// }}}

// {{{ Core_Services
/**
 * implements misc core related global ajax services
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_Services {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_Services
	/**
	 * not used
   * @access  public
	 */
	function Core_Services() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
	// {{{ userGroupSelector
	/**
	 * looks up users/groups to include in the core plugin user/group selector. 
   * this ajax service uses the following parameters:
   *   excludeGids:  an array of gids for groups that should NOT be included
   *   excludeUids:  an array of uids for users that should NOT be included
   *   expandGroups: whether or not to include the users of the groups that are 
   *                 not already included in the results. default is true. if 
   *                 this parameter is false, ONLY sub-users are included
   *   groupsOnly:   only include groups
   *   includeGids:  an array of gids for groups that should be included (all 
   *                 other groups will be left out)
   *   includeUids:  an array of uids for users that should be included (all 
   *                 other users will be left out)
   *   includeUser:  whether or not to include the current user in the results 
   *                 (default is false)
   *   usersOnly:    only include users
   *   valueGroups:  the value attribute to use for groups. default is 'name'
   *   valueUsers:   the value attribute to use for users. default is 'name'
   * and returns a hash with 2 keys: 'groups' and 'users' which each reference 
   * hashes of gid/uid and value pairs corresponding with the matching groups 
   * and users and the value attributes specified for them. if no matches are 
   * found for groups or users (or if groupsOnly or usersOnly is TRUE) those 
   * value will be left out of the results. if no matching 'users' or 'groups' 
   * are found, the return value will be NULL
   * @param array $params the invocation parameters for this method (see above)
   * @access  public
   * @return array
	 */
	function &userGroupSelector($params) {
    global $user;
    if (!$user) {
      $msg = 'Core_Services::userGroupSelector: Failed - no valid user session';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
    else {
      $params['expandGroups'] = isset($params['expandGroups']) ? $params['expandGroups'] : TRUE;
      $params['valueGroups'] = isset($params['valueGroups']) ? $params['valueGroups'] : 'name';
      $params['valueUsers'] = isset($params['valueUsers']) ? $params['valueUsers'] : 'name';
      
      $results = array();
      if (!$params['usersOnly']) {
        $dao =& SRA_DaoFactory::getDao('OsGroup');
        $results['groups'] = $user->getAllGidsHash($dao->getColumnName($params['valueGroups']), $params['includeGids'], $params['excludeGids']);
      }
      
      if (!$params['groupsOnly']) {
        $dao =& SRA_DaoFactory::getDao('OsUser');
        $results['users'] = $user->getAllUidsHash($dao->getColumnName($params['valueUsers']), NULL, $params['includeUids'], $params['excludeUids']);
      }
      if (!$params['groupsOnly'] && $params['expandGroups'] && isset($results['groups']) && count($results['groups'])) {
        if (!$results['users']) { $results['users'] = array(); }
        $dao =& SRA_DaoFactory::getDao('OsGroup');
        $gids = array_keys($results['groups']);
        foreach($gids as $gid) {
          if ($groupUsers = OsGroupVO::getUserHash($gid, $dao->getColumnName($params['valueUsers']), $params['includeUids'], $params['excludeUids'])) {
            foreach($groupUsers as $uid => $value) {
              $results['users'][$uid] = $value;
            }
          }
        }
      }
      if (!$params['groupsOnly'] && $params['includeUser']) {
        if (!$results['users']) { $results['users'] = array(); }
        $results['users'][$user->getUid()] = $user->getAttribute($params['valueUsers']);
      }
      
      if (isset($results['groups']) && !count($results['groups'])) { unset($results['groups']); }
      if (isset($results['users']) && !count($results['users'])) { unset($results['users']); }
      if (isset($results['groups'])) { asort($results['groups']); }
      if (isset($results['users'])) { asort($results['users']); }
      if (!count($results)) { $results = NULL; }
      return $results;
    }
  }
	// }}}
  
	// {{{ wikiToHtml
	/**
	 * converts wiki markup to html
   * @param array $params contains a single parameter 'wiki' which is the value 
   * to convert
   * @access  public
   * @return String
	 */
	function &wikiToHtml($params) {
    global $user;
    if ($user && isset($params['wiki'])) {
      return Core_Services_wikiToHtml($params['wiki']);
    }
    else {
      $msg = 'Core_Services::wikiToHtml: Failed - wiki parameter was not provided or no valid user session';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
	
  
  // private operations
  
}
// }}}


// {{{ Core_Services_wikiToHtml
/**
 * static method used to convert wiki markup based on PmWiki to html. for more 
 * information on the wiki syntax and formatting that is supported, see 
 * http://www.pmwiki.org/wiki/PmWiki/TextFormattingRules#Tables
 * @param string $wiki the wiki to convert
 * @access  public
 * @return String
 */
function Core_Services_wikiToHtml($wiki) {
  global $user;
  
  $wiki = str_replace('~~~~', '{$name} {$date}', $wiki);
  $wiki = str_replace('~~~', '{$name}', $wiki);
  $wiki = str_replace('{$thumbnailUri}', SRA_Controller::getServerUri() . '{$thumbnailUri}', $wiki);
  $wiki = str_replace('{$serverUri}', SRA_Controller::getServerUri(), $wiki);
  $now = new SRA_GregorianDate();
  $now->setDateOnly(TRUE);
  $wiki = str_replace('{$date}', $now->format(), $wiki);
  $wiki = str_replace('{$datetime}', $now->format(), $wiki);
  if ($user) { 
    $wiki = $user->parseString($wiki); 
  }
  else {
    $dao =& SRA_DaoFactory::getDao('OsUser');
    $tmpUser =& $dao->newInstance();
    $wiki = $tmpUser->parseString($wiki);
  }
  
  ob_start();
  require_once('plugins/core/pmwiki/pmwiki.php');
  ob_end_clean();
  return MarkupToHTML(NULL, $wiki);
}
// }}}
?>
