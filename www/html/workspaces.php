<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
// }}}

// {{{ workspaces
$tpl =& SRA_Controller::getAppTemplate();
if ($_POST['submitted'] == '1') {
  $formUser =& OsUserVO::newInstanceFromForm(SRA_ENTITY_VO_POST_FORM, 'workspaces');
  
  // check that user has access to this workspace
  if ($_POST['workspaces_0_workspaceId'] && !$user->getWorkspaces($_POST['workspaces_0_workspaceId'])) {
    $tpl->assign('msg', 'error.sys');
  }
  else {
    $formUser->validate();
    $formUser->validateSubEntities();
    $tpl->assign('errs', $formUser->validateErrors);
    if (!$formUser->validateErrors) {
      $formUser->update(TRUE);
      $formUser->reload();
      $tpl->assign('reloadOs', TRUE);
    }
  }
  $tpl->assignByRef('formUser', $formUser);
}
else {
  $tpl->assignByRef('formUser', $user);
}
$tpl->assign('section', 'workspaces');
$tpl->display('settings/workspaces.tpl');
// }}}
?>
