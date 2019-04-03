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
 
 MyContactsManager:    $Id: MyContactsManager.php,v 1.2 2006/02/04 07:30:34 simgar Exp $ 
 */
// }}}

// {{{ Imports
require_once('SRAOS_PluginManager.php');
// }}}

// {{{ Constants
/**
 * the path to the accessories resources
 * @type string
 */
define('MY_CONTACTS_MANAGER_ACCESSORIES_RESOURCES', 'etc/plugins/accessories/l10n/accessories');

/**
 * the default contact selector lookup limit (see: tpl/contact-selector.tpl)
 * @type int
 */
define('MY_CONTACTS_MANAGER_SELECTOR_LIMIT', 8);

/**
 * the default contact selector min size (see: tpl/contact-selector.tpl)
 * @type int
 */
define('MY_CONTACTS_MANAGER_SELECTOR_MIN_SIZE', 3);
// }}}

// {{{ MyContactsManager
/**
 * implements global contacts ajax service and other MyContacts related 
 * functionality
 * @author Jason Read <jason@idir.org>
 */
class MyContactsManager {
  
	// {{{ associateImbeddedContact
	/**
	 * used to associate a new imbedded contact to an entity/attribute. returns 
   * TRUE on success, FALSE otherwise
   * @param array $params contains the following:
   *   contactId: the id of the imbedded contact
   *   entity:    the name of the entity
   *   entityId:  the id of the entity
   *   attribute: the name of the attribute in entity
   * @access public
   * @return boolean
	 */
	function &associateImbeddedContact($params) {
    $results = FALSE;
    $methodBase = $params['attribute'] ? strtoupper(substr($params['attribute'], 0, 1)) . substr($params['attribute'], 1) : NULL;
    $adder = 'add' . $methodBase;
    $setter = 'set' . $methodBase;
    if (isset($params['contactId']) && isset($params['entity']) && isset($params['entityId']) && $methodBase && !SRA_Error::isError($dao =& SRA_DaoFactory::getDao($params['entity'])) && !SRA_Error::isError($entity =& $dao->findByPk($params['entityId'])) && method_exists($entity, $setter)) {
      $cdao =& SRA_DaoFactory::getDao('Contact');
      $contact =& $cdao->findByPk($params['contactId']);
      method_exists($entity, $adder) ? $entity->${adder}($contact) : $entity->${setter}($contact);
      $entity->validate();
      $results = !$entity->validateErrors && !SRA_Error::isError($dao->update($entity));
    }
    return $results;
  }
	// }}}
  
	// {{{ getAddlHelpEntries
	/**
	 * returns an array of hashes corresponding with any additional help entries 
   * that should be added to the MyContacts help menu. each hash in the array 
   * will contain the following keys:
   *   icon:   the uri to a custom icon to use for this menu item
   *   label:  the label to use for that help entry
   *   plugin: the plugin for the help entry
   *   topic:  the help topic identifier
   *   type:   the unique view type identifier
   * @access public
   * @return array
	 */
	function getAddlHelpEntries() {
    $helpEntries = array();
    if (SRA_Params::isValid($params =& SRA_Controller::getAppParams()) && ($types = $params->getTypes())) {
      foreach($types as $type) {
        if (SRA_Util::beginsWith($type, 'my-contacts-view-') && ($viewConfig = $params->getParams($type))) {
          if ($viewConfig['help'] && $viewConfig['plugin'] && SRAOS_Plugin::isValid($plugin =& SRAOS_PluginManager::getPlugin($viewConfig['plugin'])) && SRAOS_HelpTopic::isValid($helpTopic =& $plugin->getHelpTopic($viewConfig['help']))) {
            $helpEntries[] = array('icon' => $viewConfig['helpIcon'] ? $viewConfig['helpIcon'] : null, 'label' => $helpTopic->getLabel(), 'plugin' => $viewConfig['plugin'], 'topic' => $viewConfig['help'], 'type' => str_replace('my-contacts-view-', '', $type));
          }
        }
      }
    }
    return $helpEntries;
  }
	// }}}
  
	// {{{ getAvailableSubscriptions
	/**
	 * returns the ids, names, and owners of subscriptions that the current user 
   * may subscribe to. the return value will be a hash indexed by groupId where 
   * each value is a hash with the following keys:
   *   groupId:  the group id
   *   gid:      if this group pertains to an OsGroup, the id of that group
   *   name:     the name of the group
   *   owner:    the name of the user that owns the group
   *   readOnly: whether or not the group access is read-only
   * the return value will also be sorted by name. returns NULL if there are no 
   * available subscriptions
   * @param array $params not used
   * @access public
   * @return mixed
	 */
	function &getAvailableSubscriptions($params) {
    global $user;
    if ($user && ($addressBook =& $user->getAddressBook())) {
      $available = array();
      $current = array();
      if ($subscriptions =& $addressBook->getSubscriptions()) {
        $keys = array_keys($subscriptions);
        foreach($keys as $key) {
          $current[] = $subscriptions[$key]->getGroupId();
        }
      }
      $uids = $user->getAllUids();
      $gids = $user->getAllGids();
      
      $db =& SRA_Controller::getAppDb();
      $query = 'SELECT group_id, gid, name, public_read_only, address_book, public_gid, public_uid FROM contact_group';
      $query .= ' WHERE public=' . $db->convertBoolean(TRUE);
      if (count($current)) { $query .= ' AND group_id NOT IN (' . implode(',', $current) . ')'; }
      $query .= ' ORDER BY name ASC';
      $results =& $db->fetch($query, array(SRA_DATA_TYPE_INT, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_BOOLEAN, SRA_DATA_TYPE_INT, SRA_DATA_TYPE_TEXT, SRA_DATA_TYPE_TEXT));
      while($row =& $results->next()) {
        if ((!$row[5] && !$row[6]) || ($gids && $row[5] && count(array_intersect($gids, explode(SRA_AGGREGATE_CARDINALITY_DELIM, $row[5])))) || ($row[6] && count(array_intersect($uids, explode(SRA_AGGREGATE_CARDINALITY_DELIM, $row[6]))))) {
          $available[$row[0]] = array('groupId' => $row[0], 'gid' => $row[1], 'name' => $row[2], 'readOnly' => $row[3], 
                                      'owner' => SRA_Database::getQueryValue($db, 'SELECT u.name FROM os_user u,' . ($row[4] ? 'address_book a' : 'os_group g') . ' WHERE ' . 
                                                 ($row[4] ? 'a.address_book_id=' . $row[4] . ' AND a.uid' : 'g.gid=' . $row[1] . ' AND g.owner_uid') . '=u.uid'));
        }
      }
      $nl = NULL;
      return count($available) ? $available : $nl;
    }
    else {
      $msg = 'MyContactsManager::getAvailableSubscriptions: Failed - no user session';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
	// {{{ getContactAttributeView
	/**
	 * used to retrieve specific contact attribute views for an existing or a new 
   * contact
   * @param array $params contains the following:
   *   _attribute_: the name of the attribute to return the view for (null for 
   *                entity views)
   *   _view_:      the name of the contact/attribute view
   *   *:           the contact/attribute values. used to instantiate the 
   *                the contact that is used to render the view. should not 
   *                include the contactId
   * @access public
   * @return string
	 */
	function &getContactAttributeView($params) {
    global $user;
    $attribute = $params['_attribute_'];
    $view = $params['_view_'];
    unset($params['_attribute_']);
    unset($params['_view_']);
    
    $dao =& SRA_DaoFactory::getDao('Contact');
    $contact =& $dao->newInstance($params);
    if (count($params) && $view && $contact->canUpdate()) {
      $tpl =& SRA_Controller::getAppTemplate();
      $tpl->assign('inputCiFieldClass', 'myContactCardField');
      $tpl->assignByRef('user', $user);
      $tpl->assignByRef('workspace', $user->getActiveWorkspace());
      ob_start();
      $attribute ? $contact->renderAttribute($attribute, $view) : $contact->render($view);
      $results = &ob_get_contents();
      ob_end_clean();
      $keys = array_keys($params);
      if (preg_match('/(.*)_([0-9]+)_/', $keys[0], $matches)) {
        $results = str_replace($matches[1] . '_0_', $matches[0], $results);
      }
      return $results;
    }
    else {
      global $user;
      $msg = 'MyContactsManager::getContactAttributeView: View not specified or user does not have permissions to update this contact: ' . $contact->getContactId() . ' uid: ' . ($user ? $user->getUid() : 'unknown');
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
	// {{{ getContactView
	/**
	 * used to retrieve the views to display for an existing or a new contact. by 
   * default, the only views displayed are the "input" and "view" views defined 
   * in the accessories entity model. however, additional display/edit views 
   * can be defined as documented in ../etc/MyContacts_README. return value will 
   * be an associative array with the following keys:
   *   contactId: the id of the contact (if applicable)
   *   isCompany: whether or not the contact is a company
   *   label:     the label to use for this contact (getContactLabel() or the 
   *              parse string value for the '_label_' parameter if specified
   *   readOnly:  whether or not this contact is read-only
   *   views:     an associative array of xhtml views indexed by view label. 
   *              unless '_all_' is true, ONLY the view specified by '_view_'
   *              (OR the first view if '_view_' is not specified) will be 
   *              returned and the other view values will be false. if edit mode 
   *              views were requested, and 'readOnly' is TRUE, this value will 
   *              not be returned
   * returns an error if the current user does not have permission to view/edit 
   * the contact
   * @param array $params an associative array of attribute/value pairs to use 
   * to instantiate the Contact to retrieve the view for. for existing contacts, 
   * this should include a 'contactId' value. the values specified in $params 
   * will be used to temporarily update the Contact entity (will not be saved) 
   * prior to renedering the view(s). The $params key '_edit_' should be set to 
   * TRUE when requesting the Contact edit-mode views. otherwise, the 
   * display-mode views will be returned. The $params key '_view_' can be used 
   * to request a specific view where the value of that key is the label for the 
   * view. The $params key '_all_' can be used to specify that ALL views should 
   * be returned and not just the '_view_' specified (or the first view when 
   * '_view_' is not specified). if '_view_' is not a valid view for the contact 
   * the default card view will be returned instead. the $params key '_fields_' 
   * can be used specifying a space separated list of attribute names that 
   * should be displayed in the base view (fields listed in 
   * 'accessories/etc/l10n/contact-fields.properties' will be displayed first, 
   * followed by custom fields, and finally the "note" field if specified). if 
   * this parameter if specified ONLY these attributes will included in 
   * the base view that is returned. if '_label_' is specified, the 'label' 
   * value that is returned will be the results from invoking 'parseString' for 
   * that value. if '_excludeGroups_' is true, the contact groups attribute will 
   * not be displayed
   * @access public
   * @return mixed
	 */
	function &getContactView($params) {
    global $_myContactsDisplayFields;
    global $user;
    $resources =& SRA_ResourceBundle::getBundle(MY_CONTACTS_MANAGER_ACCESSORIES_RESOURCES);
    $editMode = $params && isset($params['_edit_']) && $params['_edit_'];
    $allViews = $params['_all_'] ? true : false;
    $view = $params['_view_'];
    $_myContactsDisplayFields = isset($params['_fields_']) ? explode(' ', $params['_fields_']) : NULL;
    $parseString = $params['_label_'];
    $excludeGroups = $params['_excludeGroups_'];
    $keys = array_keys($params);
    foreach($keys as $key) {
      if (SRA_Util::beginsWith('_', $key) && SRA_Util::endsWith('_', $key)) { unset($params[$key]); }
    }
    if (!$params['contactId']) { $view = $resources->getString('Contact'); }
    $viewLoaded = FALSE;
    
    $dao =& SRA_DaoFactory::getDao('Contact');
    $contact =& $dao->newInstance($params);
    if ($contact->getAccess() > 0) {
      $results = array('views' => array());
      $results['contactId'] = $contact->getContactId();
      $results['isCompany'] = $contact->isCompany();
      $results['label'] = $parseString ? $contact->parseString($parseString) : $contact->getContactLabel();
      $results['readOnly'] = !$contact->canUpdate();
      if (!$editMode || $contact->canUpdate()) {
        $tpl =& SRA_Controller::getAppTemplate();
        $tpl->assign('cexcludeGroups', $excludeGroups);
        $tpl->assignByRef('user', $user);
        $tpl->assignByRef('workspace', $user->getActiveWorkspace());
        $label = $resources->getString('Contact');
        if ($allViews || !$view || $view == $label) {
          if ($_myContactsDisplayFields) {
            $baseFields =& SRA_ResourceBundle::getBundle('etc/plugins/accessories/l10n/contact-fields');
            if ($nonBaseFields = array_diff($_myContactsDisplayFields, $baseFields->getKeys())) { $tpl->assign('nonBaseFields', $nonBaseFields); }
          }
          $viewLoaded = TRUE;
          ob_start();
          $contact->render($editMode ? 'input' : 'view');
          $results['views'][$label] = &ob_get_contents();
          ob_end_clean();
        }
        else {
          $results['views'][$label] = FALSE;
        }
        
        // get other views
        if ($contact->recordExists && !$contact->isImbedded() && SRA_Params::isValid($params =& SRA_Controller::getAppParams()) && ($types = $params->getTypes())) {
          foreach($types as $type) {
            if (SRA_Util::beginsWith($type, 'my-contacts-view-') && ($viewConfig = $params->getParams($type))) {
              if (!$viewConfig['label'] || !$viewConfig['plugin'] || !$viewConfig['view'] || !$contact->hasView($viewConfig['view'])) {
                $msg = 'MyContactsManager::getContactView: Failed - view configuration below is not valid';
                SRA_Error::logError($msg, __FILE__, __LINE__);
                SRA_Error::logError($viewConfig, __FILE__, __LINE__);
              }
              else if (!SRAOS_Plugin::isValid($plugin =& SRAOS_PluginManager::getPlugin($viewConfig['plugin']))) {
                $msg = 'MyContactsManager::getContactView: Failed - plugin "' . $viewConfig['plugin'] . '" is not valid for extended contact view configuration below';
                SRA_Error::logError($msg, __FILE__, __LINE__);
                SRA_Error::logError($viewConfig, __FILE__, __LINE__);
              }
              else if (((!$editMode && !$viewConfig['edit']) || ($editMode && $viewConfig['edit'])) && (!$viewConfig['validate'] || $contact->validate($viewConfig['validate']))) {
                $label = $plugin->resources->getString($viewConfig['label']);
                if ($allViews || $label == $view) {
                  $viewLoaded = TRUE;
                  ob_start();
                  $contact->render($viewConfig['view']);
                  $results['views'][$label] = &ob_get_contents();
                  ob_end_clean();
                }
                else {
                  $results['views'][$label] = FALSE;
                }
              }
            }
          }
        }
        if ($view && !$viewLoaded) {
          ob_start();
          $contact->render($editMode ? 'input' : 'view');
          $results['views'][$resources->getString('Contact')] = &ob_get_contents();
          ob_end_clean();
        }
      }
      else {
        unset($results['views']);
      }
      return $results;
    }
    else {
      global $user;
      $msg = 'MyContactsManager::getContactView: User does not have permissions to view this contact: ' . $contact->getContactId() . ' uid: ' . ($user ? $user->getUid() : 'unknown') . ' access: ' . ($contact ? $contact->getAccess() : 'unknown');
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
	// {{{ printContact
	/**
	 * returns the contact identified by the 'contactId' param in a printable html 
   * view
   * @param array $params only 'contactId' parameter is used
   * @access public
   * @return string
	 */
	function &printContact($params) {
    $dao =& SRA_DaoFactory::getDao('Contact');
    $contact =& $dao->newInstance($params);
    $params['_all_'] = TRUE;
    if (!SRA_Error::isError($views =& MyContactsManager::getContactView($params))) {
      if (!is_array($views['views'])) {
        $resources =& SRA_ResourceBundle::getBundle(MY_CONTACTS_MANAGER_ACCESSORIES_RESOURCES);
        $tmp[$resources->getString('Contact')] =& $views['views'];
        $views =& $tmp;
      }
      $tpl =& SRA_Controller::getAppTemplate();
      $tpl->assignByRef('views', $views['views']);
      return getOsStyledContent($contact->getContactLabel(), 'plugins/accessories/contact-print.tpl', TRUE);
    }
    else {
      return $views;
    }
  }
	// }}}
  
	// {{{ searchContacts
	/**
	 * searches a user's address book and returns matching contacts
   * @param array $params contains the following values:
   *  attr:    see api for the '_searchContacts' method/$attr parameter below
   *  groupId: if only a particular ContactGroup in the user's address book 
   *           should be searched, this parameter should be the id of that group
   *  search:  the search string (optional - if not specified, all contacts will 
   *           be returned subject to the $limit and $offset specified
   * @param int $limit the search limit
   * @param int $offset the search offset
   * @access public
   * @return mixed
	 */
	function &searchContacts($params, $limit, $offset) {
    global $user;
    if ($user && ($addressBook =& $user->getAddressBook())) {
      if (!$params['groupId'] || ($group =& $addressBook->getGroup($params['groupId']))) {
        return $params['groupId'] ? $group->searchContacts($params['search'], $params['attr'], $limit, $offset) : $addressBook->searchContacts($params['search'], $params['attr'], $limit, $offset);
      }
      // no access to group
      else {
        $results = array();
        return $results;
      }
    }
    else {
      $msg = 'MyContactsManager::searchContacts: Failed - no user session';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
  
  
  // private methods
  
	// {{{ _searchContacts
	/**
	 * searches contacts corresponding to the address book/groups specified and 
   * returns the matches ordered by the match score (when $search is specified) 
   * or according to the ordering preference specified by the current user
   * @param int $addressBookId the id of the address book to include in the 
   * search. if both this and $groupIds are specified, the join between the two 
   * will be inclusive (contact belongs to $addressBookId or is associated with 
   * $groupIds)
   * @param array $groupIds the ids of the groups to include in the search
   * @param string $search the search string
   * @param string $attr if the return value should be a hash of contact id/attr 
   * pairs, the name of the attribute/method that should be returned. otherwise, 
   * the return value will be an array of ContactVO objects indexed by contact 
   * id. $attr is passed to the VO parseString method (see api for more info). 
   * if $attr is the value 'label', then the contact label will be returned (see 
   * getContactLabel). if $attr is 'list', then each value in the results will 
   * be a hash with the following keys: contactId, isCompany, label. if $attr 
   * is specified and is NOT 'list', the return value will be a hash indexed by 
   * contact id. otherwise, the return value will be an array
   * @param int $limit the search limit
   * @param int $offset the search offset
   * @access private
   * @return mixed
	 */
	function & _searchContacts($addressBookId, $groupIds, $search, $attr=NULL, $limit, $offset) {
    if ($addressBookId || $groupIds) {
      global $user;
      if ($groupIds && !is_array($groupIds)) { $groupIds = array($groupIds); }
      
      $results = array();
      $db =& SRA_Controller::getAppDb();
      $cols = $attr == 'label' || $attr == 'list' ? 'c.contact_id, c.company, c.company_name, c.first, c.last, c.middle' : 'c.contact_id';
      if ($search) {
        $query = 'SELECT ' . $cols . ', MATCH(s.search_index) AGAINST(' . $db->convertText($search) . ' IN BOOLEAN MODE) AS score ' . 
                 'FROM contact_search_index s INNER JOIN contact c on s.contact_id=c.contact_id';
        $orderConstraint = 'HAVING score>0 ORDER BY score DESC';
      }
      else {
        $query = 'SELECT ' . $cols . ', IF(c.company=' . $db->convertBoolean(TRUE) . ',c.company_name,c.' . 
                 ($user ? $user->getAttribute('myContactsPreferences_sortBy') : 'last') . ') as sort_field FROM contact c';
        $orderConstraint = 'ORDER BY sort_field';
      }
      if ($groupIds) { $query .= ' LEFT JOIN group_contacts g ON c.contact_id=g.contact_id'; }
      $query .= ' WHERE (c.imbedded=' . $db->convertBoolean(FALSE) . ' OR c.imbedded IS NULL)';
      if ($addressBookId) { $query .= ' AND ' . ($groupIds ? '(' : '') . 'c.address_book_id=' . $db->convertInt($addressBookId); }
      if ($groupIds) { $query .= ($addressBookId ? ' OR' : ' AND') . ' g.group_id IN (' . implode(',', $groupIds) . ')' . ($addressBookId ? ')' : ''); }
      $query .= ' ' . $orderConstraint;
      $dbResults =& $db->fetch($query, array(SRA_DATA_TYPE_INT), $limit, $offset);
      $contactIds = array();
      $results[SRA_GLOBAL_AJAX_SERVICE_RESULT_COUNT_KEY] = $dbResults->getTotalCount();
      
      while($row =& $dbResults->next()) {
        if (!isset($contactIds[$row[0]]) && ($attr == 'label' || $attr == 'list')) {
          $middle = !$row[1] && $row[5] && $user && $user->displayContactField('middle') ? ' ' . $row[5] : '';
          $label = $row[1] ? $row[2] : ($user && $user->getAttribute('myContactsPreferences_nameFormat') == 'last_first' ? $row[4] . ', ' . $row[3] . $middle : $row[3] . $middle . ' ' . $row[4]);
          if ($attr == 'label') {
            $results[$row[0]] = $label;
          }
          else {
            $results[] = array('contactId' => $row[0], 'isCompany' => $row[1] ? TRUE : FALSE, 'label' => $label);
          }
        }
        $contactIds[$row[0]] = TRUE;
      }
      $contactIds = array_keys($contactIds);
      if ($attr != 'label' && $attr != 'list' && count($contactIds)) {
        $dao =& SRA_DaoFactory::getDao('Contact');
        $contacts =& $dao->findByPks($contactIds);
        $keys = array_keys($contacts);
        foreach($keys as $key) {
          if ($attr) {
            $results[$contacts[$key]->getContactId()] = $contacts[$key]->parseString($attr);
          }
          else {
            $results[] =& $contacts[$key];
          }
        }
      }
      return $results;
    }
    else {
      $msg = 'MyContactsManager::_searchContacts: Failed - addressBookId and groupIds were  not specified';
      return SRA_Error::logError($msg, __FILE__, __LINE__);
    }
  }
	// }}}
}

// add an instance of MyContactsManager to the template
$tpl =& SRA_Controller::getAppTemplate();
$tpl->assignByRef('MyContactsManager', new MyContactsManager());
// }}}
?>
