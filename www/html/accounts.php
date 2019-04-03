<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
// }}}

// {{{ accounts
$tpl =& SRA_Controller::getAppTemplate();
if ($_POST['submitted'] == '1') {
  $formUser =& OsUserVO::newInstanceFromForm(SRA_ENTITY_VO_POST_FORM, 'children');
  // check that user has access to this child
  if ($_POST['children_0_uid'] && !$user->getChildren($_POST['children_0_uid'])) {
    $tpl->assign('msg', 'error.sys');
  }
  else {
    $formUser->validate();
    $formUser->validateSubEntities();
    $tpl->assign('errs', $formUser->validateErrors);
    if (!$formUser->validateErrors) {
      $formUser->update(TRUE);
      $formUser->reload();
    }
  }
  $tpl->assignByRef('formUser', $formUser);
}
else {
  $tpl->assignByRef('formUser', $user);
}

$tpl->assign('section', 'accounts');
$tpl->display('settings/accounts.tpl');
// }}}
?>
