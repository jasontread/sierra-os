<?php
// {{{ Imports
require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/lib/core/SRA_Controller.php');
SRA_Controller::init('sraos');
// }}}

// {{{ settings
$tpl =& SRA_Controller::getAppTemplate();
$tpl->assign('section', 'settings');
$tpl->display('settings/settings.tpl');
// }}}
?>
