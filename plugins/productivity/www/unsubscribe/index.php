<?php
/**
 * this script is used to manage email-based unsubscribes to MyProjects 
 * discussion threads. uses the following url format:
 *  When rewrite rule is in place:
 *   [sierra os uri]/plugins/productivity/unsubscribe/(m|w)(message id|whiteboard id)/(u|)(uid|participant id)
 *  Otherwise:
 *   [sierra os uri]/plugins/productivity/unsubscribe/?id=(m|w)(message id|whiteboard id)&pid=(u|)(uid|participant id)
 * 
 * When rewrite rule is working, set the app-config param 'unsubscribeRewrite'
 * (type="my-projects") to the value "1"
 */
do {
  $app = $tmp1;
  $tmp1 = basename(getcwd());
  chdir('..');
} while(basename(getcwd()) != 'sierra');
require_once(getcwd() . '/lib/core/SRA_Controller.php');
SRA_Controller::init($app, TRUE);
$tpl =& SRA_Controller::getAppTemplate();
$resources =& SRA_ResourceBundle::getBundle('etc/plugins/productivity/l10n/productivity');
$tpl->assignByRef('productivityResources', $resources);
if (isset($_GET['id']) && isset($_GET['pid'])) {
  $dao =& SRA_DaoFactory::getDao('MyProjectDiscussionSubscriber');
  require_once('plugins/productivity/MyProjectsManager.php');
  $params = array('id' => (SRA_Util::beginsWith($_GET['id'], 'm') ? 'message:' : 'whiteboard:') . substr($_GET['id'], 1));
  !SRA_Util::beginsWith($_GET['pid'], 'u') ? $params['participantId'] = $_GET['pid'] : $params['uid'] = substr($_GET['pid'], 1);
  $results =& MyProjectsManager::unsubscribe($params);
  $tpl->assign('msg', $resources->getString($results && !SRA_Error::isError($results) ? 'unsubscribe.success' : 'unsubscribe.notSubscribed'));
}
else {
  $tpl->assign('msg', $resources->getString('unsubscribe.fail'));
}
$tpl->display('plugins/productivity/my-projects-unsubscribe.tpl');
?>
