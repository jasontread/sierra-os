<?php
/**
 * this script is used to display a comment, message or task description. it 
 * uses the following url format:
 *  When rewrite rule is in place:
 *   [server]/plugins/productivity/rss/show/[item id]/
 *  Otherwise:
 *   [server]/plugins/productivity/rss/show/?id=[item id]
 * 
 * When rewrite rule is working, set the app-config param 'rssRewrite'
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
$resources =& SRA_ResourceBundle::getBundle('etc/plugins/productivity/etc/l10n/productivity');
$tpl->assignByRef('productivityResources', $resources);
global $user;
if ($user && isset($_GET['id'])) {
  $type = substr($_GET['id'], 0, 1);
  $id = substr($_GET['id'], 1);
  $db =& SRA_Controller::getAppDb();
  if (!SRA_Error::isError($results =& $db->fetch('SELECT ' . ($type == 'c' ? 'comment_html, message_id, whiteboard_id' : ($type == 'm' ? 'title, message_html' : 'title, description_html')) . 
                          ' FROM ' . ($type == 'c' ? 'my_project_comment' : ($type == 'm' ? 'my_project_message' : 'my_project_task')) . 
                          ' WHERE ' . ($type == 'c' ? 'comment_id' : ($type == 'm' ? 'message_id' : 'task_id')) . '=' . $db->convertInt($id))) && $results->count()) {
    $row =& $results->next();
    if ($type == 'c') {
      $tpl->assign('description', $row[0]);
      $results =& $db->fetch('SELECT title FROM ' . ($row[1] ? 'my_project_message' : 'my_project_whiteboard') . ' WHERE ' . ($row[1] ? 'message_id' : 'whiteboard_id') . '=' . $db->convertInt($row[1] ? $row[1] : $row[2]));
      $row =& $results->next();
      $tpl->assign('title', $row[0]);
    }
    else {
      $tpl->assign('title', $row[0]);
      $tpl->assign('description', $row[1]);
    }
    $tpl->assign('icon', '/plugins/productivity/icons/32/' . ($type == 'c' ? 'comment.png' : ($type == 'm' ? 'message.png' : 'task.png')));
  }
}
$tpl->display('plugins/productivity/my-projects-rss-show.tpl');
?>
