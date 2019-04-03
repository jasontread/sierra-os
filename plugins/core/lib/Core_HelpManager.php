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

// {{{ Core_HelpManager
/**
 * 
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos.plugins.core
 */
class Core_HelpManager {
  // {{{ Attributes
  // public attributes
  
  // private attributes
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ Core_HelpManager
	/**
	 * not used
   * @access  public
	 */
	function Core_HelpManager() { }
	// }}}
	
  
  // public operations
	
	
	// Static methods
  
	// {{{ getHelpContent
	/**
	 * returns the localized help contents for the plugin and help topic specified
   * @param array $params contains 2 values: plugin - the id of the plugin, 
   * topic - the id of the help topic
   * @access  public
   * @return String
	 */
	function & getHelpContent($params) {
    global $user;
    if ($user) {
      if ($params['plugin'] && $params['topic'] && ($plugin =& SRAOS_PluginManager::getPlugin($params['plugin'])) && ($topic =& $plugin->getHelpTopic($params['topic']))) {
        return $topic->getLocalizedContent();
      }
      $msg = 'Core_HelpManager::getHelpContent: Failed - Invalid params: plugin - ' . $params['plugin'] . ', topic - ' . $params['topic'];
      return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
    }
    $msg = 'Core_HelpManager::printHelpArticle: Failed - no user session is active';
    return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
  }
	// }}}
  
	// {{{ printHelpArticle
	/**
	 * returns the localized help contents for the plugin and help topic specified
   * @param array $params contains 2 values: plugin - the id of the plugin, 
   * topic - the id of the help topic to display
   * @access  public
   * @return String
	 */
	function & printHelpArticle($params) {
    global $user;
    if ($user) {
      if ($tpl =& SRA_Controller::getAppTemplate() && $params['plugin'] && $params['topic'] && ($plugin =& SRAOS_PluginManager::getPlugin($params['plugin'])) && ($topic =& $plugin->getHelpTopic($params['topic']))) {
        $cur =& $topic;
        while($cur->getParentId() && ($cur =& $plugin->getHelpTopic($cur->getParentId()))) {}
        $tpl->assign('source', $cur);
        $tpl->assign('topic', $topic);
        $article = $tpl->fetch('plugins/core/print-help-article.tpl');
        $skipAttrs = explode(' ', 'adminGroups adminUsers adminWorkspaces allApps appPermissions children defaultWorkspace groups ownedGroups ownerUid passwordConfirm sharedWorkspaces workspaces');
        $attrs = $user->getAttributeNames();
        foreach($attrs as $attr) {
          if (!in_array($attr, $skipAttrs)) {
            $article = str_replace('#' . $attr, $user->getAttribute($attr), $article);
          }
        }
        $article = str_replace('#appName', SRA_Controller::getAppName(), $article);
        $article = str_replace('#appShortName', SRA_Controller::getAppShortName(), $article);
        return $article;
      }
      $msg = 'Core_HelpManager::getHelpContent: Failed - Invalid params: plugin - ' . $params['plugin'] . ', topic - ' . $params['topic'];
      return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
    }
    $msg = 'Core_HelpManager::printHelpArticle: Failed - no user session is active';
    return SRA_Error::logError($msg, __FILE__, __LINE__, SRA_ERROR_PROBLEM, SRAOS_PLUGIN_DEBUG);
  }
	// }}}
  
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a Core_HelpManager object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'core_helpmanager');
	}
	// }}}
	
  
  // private operations
  
}
// }}}
?>
