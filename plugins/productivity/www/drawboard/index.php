<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
require_once('plugins/productivity/MyProjectsManager.php');
// }}}

$tpl =& SRA_Controller::getAppTemplate();

if ($_GET['whiteboardId']) {
  $tpl->assign('redirect', TRUE);
  $tpl->assign('whiteboardId', $_GET['whiteboardId']);
}
else {
  $tpl->assignByRef('drawboardConf', MyProjectsManager::getDrawboardConf());
  
  if ($_POST['whiteboardId']) {
    $dao =& SRA_DaoFactory::getDao('MyProjectWhiteboard');
    $whiteboard =& $dao->findByPk($_POST['whiteboardId']); 
  }
  if (!$whiteboard || SRA_Error::isError($whiteboard) || !(MyProjectVO::getUserPermissions($whiteboard->getProjectId()) & MY_PROJECT_PERMISSIONS_WHITEBOARDS_READ)) { $whiteboard = NULL; }
  $tpl->assignByRef('whiteboard', $whiteboard);
}
$resources =& SRA_ResourceBundle::getBundle('etc/plugins/productivity/l10n/productivity');
$tpl->assignByRef('productivityResources', $resources);
$tpl->display('plugins/productivity/my-projects-drawboard.tpl');
?>
