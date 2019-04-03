<?php
/**
 * this script is used to manage ical subscriptions in MyProjects. it uses the 
 * following url format:
 *  When rewrite rule is in place:
 *   [sierra os uri]/plugins/productivity/ical/[MyProjectsSavedSearch::searchId]/
 *  Otherwise:
 *   [sierra os uri]/plugins/productivity/ical/?id=[MyProjectsSavedSearch::searchId]
 * 
 * When rewrite rule is working, set the app-config param 'icalRewrite'
 * (type="my-projects") to the value "1"
 */
do {
  $app = $tmp1;
  $tmp1 = basename(getcwd());
  chdir('..');
} while(basename(getcwd()) != 'sierra');
require_once(getcwd() . '/lib/core/SRA_Controller.php');
SRA_Controller::init($app);
$tpl =& SRA_Controller::getAppTemplate();
$resources =& SRA_ResourceBundle::getBundle('etc/plugins/productivity/l10n/productivity');
$tpl->assignByRef('productivityResources', $resources);
global $user;
$dao =& SRA_DaoFactory::getDao('MyProjectsSavedSearch');
if ($user && isset($_GET['id']) && !SRA_Error::isError($search =& $dao->findByPk($_GET['id'])) && $search) {
  require_once('plugins/productivity/MyProjectsManager.php');
  if ($user->getUid() != $search->getUid()) {
    SRA_Error::logError('plugins/productivity/ical/index.php - Error: User ' . $user->getName() . ' attempted to access search for UID ' . $search->getUid(), __FILE__, __LINE__);
  }
  else {
    $tpl->assignByRef('search', $search);
    if (count($pids = $search->getProjectIds())) {
      $dao =& SRA_DaoFactory::getDao('MyProject');
      $tpl->assignByRef('projects', $dao->findByPks($pids));
    }
  }
}
$tpl->display('plugins/productivity/my-projects-ical.tpl');
?>
