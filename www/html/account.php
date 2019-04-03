<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
// }}}

// {{{ account
$tpl =& SRA_Controller::getAppTemplate();
if ($_POST['submitted'] == '1') {
  $formUser =& OsUserVO::newInstanceFromForm(SRA_ENTITY_VO_POST_FORM, 'account');
  $formUser->validate();
  $tpl->assign('errs', $formUser->validateErrors);
  if ($_POST['password']) {
    $formUser->validate('password', FALSE);
  }
  if (!$formUser->validateErrors) {
    $formUser->update();
    $formUser->reload();
  }
  $tpl->assignByRef('formUser', $formUser);
}
else {
  $tpl->assignByRef('formUser', $user);
}
$tpl->assign('section', 'account');
$tpl->display('settings/account.tpl');
// }}}
?>
