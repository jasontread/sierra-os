<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
// }}}

// {{{ index
SRAOS_PluginManager::init();
$tpl =& SRA_Controller::getAppTemplate();

// check if this is the first time the user has logged in to this workspace. set
// template variable $loggingIn to TRUE if yes
if (!session_id()) { session_start(); }
if (!isset($_SESSION['activatedWorkspaces'])) {
  $tpl->assign("osStartup", true);
  $_SESSION['activatedWorkspaces'] = array();
  $_SESSION['workspaceState'] = array();
}
$workspace =& $user->getActiveWorkspace();
$loggingIn = !isset($_SESSION['activatedWorkspaces'][$workspace->getWorkspaceId()]);
$tpl->assign('loggingIn', ($loggingIn));
$_SESSION['activatedWorkspaces'][$workspace->getWorkspaceId()] = TRUE;

// check for/save workspace state
if ($_POST['currentWorkspaceId'] && $_POST['workspaceState']) {
  $_SESSION['workspaceState'][$_POST['currentWorkspaceId']] = $_POST['workspaceState'];
}
if ($_POST['workspaceId']) {
  $tpl->assign('workspaceState', $_SESSION['workspaceState'][$_POST['workspaceId']]);
}

$tpl->assignByRef('firstPlugin', SRAOS_PluginManager::getFirstPlugin());
$cssFiles = getCssFileUris();
$jsFiles = getJsFileUris();

// use cached workspace output if applicable
$cachable = !SRAOS_DEBUG && !count($_POST);
if ($cachable && SRA_File::mergedFilesCached($cssFiles, 2) && SRA_File::mergedFilesCached($jsFiles, 1) && isset($_SESSION['cachedWorkspace' . $workspace->getWorkspaceId()])) {
  echo preg_replace('/OS.loadTime = ([0-9]*\.[0-9]*)/', 'OS.loadTime = "' . SRA_Controller::getRunTime() . '(c)"', $_SESSION['cachedWorkspace' . $workspace->getWorkspaceId()]);
  exit;
}

$tpl->assignByRef('cssFiles', $cssFiles);
$tpl->assignByRef('jsFiles', $jsFiles);

// display workspace template
if ($cachable) { ob_start(); }
$tpl->assignByRef('workspace', $workspace);
$tpl->display('workspace.tpl');

if ($cachable) {
  $_SESSION['cachedWorkspace' . $workspace->getWorkspaceId()] = ob_get_contents();
  ob_end_flush();
}
// }}}
?>