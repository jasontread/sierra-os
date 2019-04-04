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


// {{{ Constants

/**
 * the date format for date chooser fields
 */
define('SRAOS_DATE_CHOOSER_FORMAT', 'm/d/Y');

/**
 * uri prefix to use
 */
define('SRAOS_URI_PREFIX', dirname($_SERVER['SCRIPT_NAME']) != '/' ? dirname($_SERVER['SCRIPT_NAME']) : '') ;

/**
 * max # of OS instance windows
 */
define('SRAOS_WORKSPACES_MAX_WINDOWS', 20);

/**
 * max # form post layers
 */
define('SRAOS_WORKSPACES_MAX_FORM_LAYERS', 10);

/**
 * debug flag
 */
define('SRAOS_DEBUG', TRUE);
// }}}

// check for logout and destroy session is it has occurred
if (isset($_GET['logout']) && $_GET['logout'] == '1') {
  session_start();
  $_SESSION = array();
  if (isset($_COOKIE[session_name()])) {
     setcookie(session_name(), '', time()-42000, '/');
  }
  session_destroy();
}

// returns all of the css file uris
function getCssFileUris($includeWorkspace=TRUE) {
  global $user;
  $activeWorkspace =& $user->getActiveWorkspace();
  $dir = dirname(dirname(__FILE__)) . '/www/html';
  
  $cssFiles = $includeWorkspace ? array($dir . $activeWorkspace->myTheme->getBaseUri(FALSE) . 'workspace.css', $dir . $activeWorkspace->myTheme->getBaseUri(FALSE) . 'datechooser.css', $dir . '/lib/transmenus/transmenu.css') : array();
  if (file_exists($dir . '/themes/custom.css')) {
    $cssFiles[] = $dir . '/themes/custom.css';
  }
  $plugins =& SRAOS_PluginManager::getPlugins();
  $keys = array_keys($plugins);
  foreach($keys as $key) {
    $pluginCssFiles = $plugins[$key]->getCssFiles();
    if ($pluginCssFiles) { $cssFiles = array_merge($cssFiles, $pluginCssFiles); }
  }
  return $cssFiles;
}

// returns all of the javascript file uris
function getJsFileUris() {
  global $user;
  $activeWorkspace =& $user->getActiveWorkspace();
  $dir = dirname(dirname(__FILE__)) . '/www/html';
  
  $jsFiles = SRA_File::getFileList($dir . '/lib', '/^.*js$/', true);
  $plugins =& SRAOS_PluginManager::getPlugins();
  $keys = array_keys($plugins);
  foreach($keys as $key) {
    $pluginJsFiles = $plugins[$key]->getJavascriptFiles();
    if ($pluginJsFiles) { $jsFiles = array_merge($jsFiles, $pluginJsFiles); }
  }
  return $jsFiles;
}


// returns the models to import into the base entity model
function getImportModels() {
  $models = 'app-aop.xml';
  $plugins =& SRAOS_PluginManager::getPlugins();
  
  $keys = array_keys($plugins);
  foreach($keys as $key) {
    if ($pluginModels = $plugins[$key]->getModels()) {
      foreach($pluginModels as $model) {
        $models .= ' plugins/' . $plugins[$key]->getId() . '/' . $model;
      }
    }
  }
  return $models;
}

// returns the resources to use in the entity models
function getImportResources() {
  $resources = '';
  $plugins =& SRAOS_PluginManager::getPlugins();
  $keys = array_keys($plugins);
  foreach($keys as $key) {
    if ($plugins[$key]->getModels()) {
      $base = 'etc/plugins/' . $plugins[$key]->getId() . '/l10n/' . $plugins[$key]->getId();
      if (file_exists(SRA_Controller::getAppDir() . '/' . $base . '.properties')) {
        $resources .= $resources != '' ? ' ' : '';
        $resources .= $base;
      }
    }
  }
  return $resources;
}

// renders $tpl within a styled xhtml container document ($tpl is rendered 
// within the body elements)
function &getOsStyledContent($title, $template, $print=FALSE) {
  $tpl =& SRA_Controller::getAppTemplate();
  $tpl->assign('cssFiles', getCssFileUris(FALSE));
  $tpl->assign('title', $title);
  $tpl->assign('tpl', $template);
  $tpl->assign('print', $print);
  return $tpl->fetch('styled-content.tpl');
}
?>
