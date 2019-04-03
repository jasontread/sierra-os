{assign var=workspace value=$user->getActiveWorkspace()}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{$Locale->getLanguage()}" lang="{$Locale->getLanguage()}">
<head>
  <title>{$Controller->getAppName()}</title>
{if $smarty.const.SRAOS_DEBUG}
  <link rel="stylesheet" type="text/css" href="{$workspace->myTheme->getBaseUri()}workspace.css" />
  <link rel="stylesheet" type="text/css" href="{$workspace->myTheme->getBaseUri()}datechooser.css" />
  <link rel="stylesheet" type="text/css" href="{$smarty.const.SRAOS_URI_PREFIX}/lib/transmenus/transmenu.css" />
  {if $File->getRelativePath('www/html/themes', 'custom.css')}
  <link rel="stylesheet" type="text/css" href="{$smarty.const.SRAOS_URI_PREFIX}/themes/custom.css" />
  {/if}
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_AjaxConstraint.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_AjaxConstraintGroup.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_AjaxRequestObj.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_AjaxScrollPaginator.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_AjaxServiceParam.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Application.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_ApplicationInstance.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_ApplicationManager.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_CliArg.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_DateChooser.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Divider.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Drag.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_DragAndDrop.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Entity.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_EntityAction.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_EntityDisplAttr.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_EntitySearchAttr.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_HelpTopic.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Menu.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Plugin.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Resize.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_ResizeComponent.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Tab.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_TabSet.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Tree.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_TreeNode.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_TreeManager.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_ToolbarButton.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Util.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_ViewToggle.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_Window.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_WindowInstance.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/SRAOS_WindowManager.js"></script>
  <script type="text/javascript" src="{$smarty.const.SRAOS_URI_PREFIX}/lib/transmenus/transmenu.js"></script>
{* load plugin css and javascript source files *}
{foreach from=$plugins item=plugin}

  <!-- javascript/css includes for the {$plugin->getId()} plugin -->
{foreach from=$plugin->getCssUris() item=cssUri}
  <link rel="stylesheet" type="text/css" href="{$cssUri}" />
{/foreach}
{foreach from=$plugin->getJavascriptUris() item=javascriptUri}
  <script type="text/javascript" src="{$javascriptUri}"></script>
{/foreach}
{/foreach}
{else}
  <style type="text/css">
{if $smarty.const.SRAOS_URI_PREFIX}{assign var='absolutePath' value=$smarty.const.SRAOS_URI_PREFIX|cat:'/'}{else}{assign var='absolutePath' value='/'}{/if}
{$File->renderMergedFiles($cssFiles, 2, 0, 1, '../../../|../../', $absolutePath)}
  </style>
{/if}
  <script type="text/javascript">
  <!--
{if !$smarty.const.SRAOS_DEBUG}
{$File->renderMergedFiles($jsFiles, 1)}
{/if}
  var plugins = new Array();
{foreach from=$plugins item=plugin}
  plugins.push({$plugin->getJavascriptInstanceCode()});
{/foreach}
  SRAOS.MAX_WINDOWS={$smarty.const.SRAOS_WORKSPACES_MAX_WINDOWS};
  SRAOS.MAX_LAYERS={$smarty.const.SRAOS_WORKSPACES_MAX_FORM_LAYERS};
  var OS = new SRAOS("{$smarty.const.SRAOS_URI_PREFIX}", "{$Template->getWsGatewayUri()}", "{$Controller->getCurrentAppId()}", "{$Controller->getAppName()}", "{$Controller->getAppShortName()}", {$workspace->toJson('workspaceId dockApplications dockHide dockSize')}, plugins, {$resources->toJson()}, '{$workspace->myTheme->getBaseUri()}', {$user->toJson()}, '{$smarty.const.SRAOS_DATE_CHOOSER_FORMAT}', '{$Controller->getAppDateFormat()}', '{$Controller->getAppDateOnlyFormat()}', '{$Controller->getServerUri()}');
  SRAOS.PIXEL_IMAGE = "{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif";
  var BACKSLASH_CHAR = '\\';
  -->
  </script>
{$Template->assign('skipFields', 1)}
{$Template->display('model/sra-form-input-ajax-tips.tpl')}
{$Template->assign('skipFields', 0)}
</head>

<body onload="OS.onLoad()" {if $workspace->getBackgroundUri()} style="background: url({$workspace->getBackgroundUri()})"{/if}>

<div id="bodyLoading" class="loading"><span><img alt="{$resources->getString('text.wait')}" src="{$workspace->myTheme->getBaseUri()}wait.gif" title="{$resources->getString('text.wait')}" /><br />{$resources->getString('text.wait')}</span></div>

<div id="modalWindowBg"></div>

<div id="header">
{if $File->getRelativePath('www/tpl', 'custom-header.tpl')}{include file='custom-header.tpl'}{/if}
<div id="menu">
<span id="leftCorner"></span>
<span id="rightCorner"></span>
<span id="userMenu"><img alt="{$resources->getString('workspace.userMenu')}" src="{$workspace->myTheme->getBaseUri()}icons/16/account.png" title="{$resources->getString('workspace.userMenu')}" /></span>
{if $user->canUseSearch()}<span id="search" onclick="OS.showSearchPanel()"><img alt="{$resources->getString('workspace.search')}" src="{$workspace->myTheme->getBaseUri()}icons/16/search.png" title="{$resources->getString('workspace.search')}" /></span>{/if}
<span id="osTitle">{$Controller->getAppName()}</span>

{* window menus *}
{foreach from=$plugins item=plugin}
{foreach from=$plugin->getAllWindows() item=window}
{if $window->getMenus()}
  <div id="{$plugin->getId()}:{$window->getId()}:menu" class="menu">
{foreach from=$window->getMenus() key=id item=menu}
    <span id="{$plugin->getId()}:{$window->getId()}:menu:{$menu->getId()}"{if $id eq $smarty.const.SRAOS_APPLICATION_MENU_ID} class="appMenu"{/if}>{$menu->getLabel()}</span>
{/foreach}
  </div>
{/if}
{/foreach}
{/foreach}
</div>
</div>

<div id="workspace">

<span id="windowMenu"><img id="windowMenuImg" alt="" height="16" src="{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif" title="" width="16" /></span>
<form id="workspaceForm" action="" method="post">
<input id="currentWorkspaceId" name="currentWorkspaceId" type="hidden" value="{$workspace->getPrimaryKey()}" />
<input id="workspaceId" name="workspaceId" type="hidden" value="{$workspace->getPrimaryKey()}" />
<input id="workspaceState" name="workspaceState" type="hidden" value="" />
<input id="serviceState" name="serviceState" type="hidden" value="" />
</form>

{* render window base canvas contents *}
{foreach from=$plugins item=plugin}
{foreach from=$plugin->getAllWindows() item=window}
<div id="{$plugin->getId()}:{$window->getId()}" class="baseWindowCanvas">{$Template->display($window->getTplPath())}</div>
{/foreach}
{/foreach}

{* render container divs *}
{foreach from=$Util->getArray($smarty.const.SRAOS_WORKSPACES_MAX_WINDOWS) item=num}
<form id="window{$num}Form" action="" enctype="multipart/form-data" method="post" target="window{$num}FormTarget">
<div id="window{$num}" class="window"></div>
<iframe id="window{$num}FormTarget" name="window{$num}FormTarget" class="iframeFormTarget"></iframe>
</form>
{/foreach}

{* render hidden form action layers *}
{foreach from=$Util->getArray($smarty.const.SRAOS_WORKSPACES_MAX_FORM_LAYERS) item=num}
<iframe id="iframe{$num}" name="iframe{$num}"></iframe>
{/foreach}

</div>

<form id="searchForm" action="javascript:OS.search();">
<div id="searchPanel">
{$resources->getString('text.search')}<input id="searchField" type="text" onblur="OS.hideSearchPanel()" onclick="this.select()" />
</div>
</form>

{* (-1 * ((([icon size] * [num icons])/2) + (4 * [num icons]))) *}
{assign var=numDockIcons value=2}
<div id="launchbarPanel">
{if $user->getNumWorkspaces() > 1}
{assign var=numDockIcons value=$numDockIcons+1}
<img alt="" src="{$workspace->myTheme->getBaseUri()}icons/{$workspace->getDockSize()}/dock-active.gif" />
{/if}
<div id="dockAppsBg"></div>
<img id="dockBorder" alt="" height="{$workspace->getDockSize()+3}" src="{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif" width="5" />
<img alt="" height="{$workspace->getDockSize()}" src="{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif" width="{$workspace->getDockSize()}" />
<div id="dockMinimizedAppsBg"></div>
{if $user->hasAppAccess('core', 'Browser')}
<img alt="" height="{$workspace->getDockSize()}" src="{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif" width="{$workspace->getDockSize()}" />
{else}
<img alt="" height="{$workspace->getDockSize()}" src="{$smarty.const.SRAOS_URI_PREFIX}/images/pixel.gif" width="2" />
{/if}
</div>

<div id="launchbar">
{if $user->getNumWorkspaces() > 1}
<div id="dockWorkspaces"><img alt="{$resources->getString('dock.workspaces')}" src="{$workspace->myTheme->getBaseUri()}icons/{$workspace->getDockSize()}/workspaces.png" title="{$resources->getString('dock.workspaces')}" /></div>
{/if}
<div id="dockApps"></div>
<div id="dockApplications"><img alt="{$resources->getString('dock.applications')}" src="{$workspace->myTheme->getBaseUri()}icons/{$workspace->getDockSize()}/applications.png" title="{$resources->getString('dock.applications')}" /></div>
<div id="dockMinimizedApps"></div>
{if $user->hasAppAccess('core', 'Browser')}
<div id="dockTrash"><img id="dockTrashImg" alt="{$resources->getString('dock.trash')}" height="{$workspace->getDockSize()}" src="{$workspace->myTheme->getBaseUri()}icons/{$workspace->getDockSize()}/trashcan_empty.png" title="{$resources->getString('dock.trash')}" width="{$workspace->getDockSize()}" /></div>
{/if}
</div>

<div id="dragObject" class="dragObject"></div>

<script type="text/javascript">
<!--
{* initialize the dock *}
  OS.initDock();
{if $user->getNumWorkspaces() > 1}
{assign var=offset value=$user->getNumWorkspaces()*25}
{assign var=offset value=$offset+17}
  OS.addMenu("dockWorkspaces", "onclick", null, null, -{$workspace->getDockSize()+$offset}, TransMenu.direction.bottom);
{foreach from=$user->getAllWorkspaces() item=menuWorkspace}
  OS.addMenuItem("", "dockWorkspaces_{$menuWorkspace->getPrimarykey()}", "dockWorkspaces", "{$menuWorkspace->getName()}", '{$workspace->myTheme->getBaseUri()}icons/16/{if $workspace->equals($menuWorkspace)}check{else}workspace{/if}.png'{if !$menuWorkspace->equals($workspace)}, "OS.changeWorkspace({$menuWorkspace->getPrimarykey()})"{/if});
{/foreach}
{/if}
{assign var=offset value=17}
{foreach from=$firstPlugin->getApplicationsArray($user->getApplications()) item=application}{assign var=offset value=$offset+25}{/foreach}
  var appMenu = OS.addMenu("dockApplications", "onclick", null, null, -{$workspace->getDockSize()+$offset}, TransMenu.direction.bottom);
{foreach from=$firstPlugin->getApplicationsArray($user->getApplications()) key=id item=application}
{if $Template->isArray($application)}
  var subMenu = appMenu.addMenu(OS.addMenuItem("", "dockApplications_{$id}", "dockApplications", "{$id}", '{$workspace->myTheme->getBaseUri()}icons/16/folder.png', null));
{foreach from=$application key=id item=application}
  OS.addMenuItem("", "dockApplications_{$application->getId()}", subMenu, "{$application->getLabel()}", '{$application->getIconPath(16)}', "OS.launchApplication('{$application->_plugin->getId()}', '{$application->getId()}')");
{/foreach}
{else}
  OS.addMenuItem("", "dockApplications_{$application->getId()}", "dockApplications", "{$application->getLabel()}", '{$application->getIconPath(16)}', "OS.launchApplication('{$application->_plugin->getId()}', '{$application->getId()}')");
{/if}
{/foreach}
  
{* add user menus *}
  menu = OS.addMenu("userMenu", "onclick");
  
{* about *}
  OS.addMenuItem("", "userMenu_about", "userMenu", "{$resources->getString('text.about')} {$Controller->getAppShortName()}", '{$workspace->myTheme->getBaseUri()}icons/16/about.png', "OS.about()");
  
{* user preferences *}
  OS.addMenuItem("", "userMenu_settings", "userMenu", "{$resources->getString('settings')}", '{$workspace->myTheme->getBaseUri()}icons/16/settings.png', "OS.displaySettings()", true);
  
{* logout *}
  OS.addMenuItem("", "userMenu_logout", "userMenu", "{$resources->getString('text.logout')} {$user->getName()}", '{$workspace->myTheme->getBaseUri()}icons/16/logout.png', "OS.logout()", true);
  
{* window menu *}
  menu = OS.addMenu("windowMenu", "onclick");
  OS.addMenuItem("", "windowMenu_minimize", "windowMenu", "{$resources->getString('window.minimize')}", '{$workspace->myTheme->getBaseUri()}minimize.gif', "OS.minimize(OS.getFocusedWin())");
  OS.addMenuItem("", "windowMenu_hide", "windowMenu", "{$resources->getString('window.hide')}", '{$workspace->myTheme->getBaseUri()}hide.gif', "OS.hide()");
  OS.addMenuItem("", "windowMenu_restore", "windowMenu", "{$resources->getString('window.restore')}", '{$workspace->myTheme->getBaseUri()}restore.gif', "OS.getFocusedWin().restore()");
  OS.addMenuItem("", "windowMenu_maximize", "windowMenu", "{$resources->getString('window.maximize')}", '{$workspace->myTheme->getBaseUri()}maximize.gif', "OS.getFocusedWin().maximize()");
  OS.addMenuItem("", "windowMenu_exit", "windowMenu", "{$resources->getString('text.exit')}", '{$workspace->myTheme->getBaseUri()}close.gif', "OS.closeWindow(OS.getFocusedWin())", true);
  
{if $user->hasAppAccess('core', 'Browser')}
{* trash menu *}
{assign var="trashNode" value=$user->getVfsTrashDir()}
OS.addMenu("dockTrash", "onclick", null, null, -{$workspace->getDockSize()+60}, TransMenu.direction.bottom);
OS.addMenuItem("", "dockTrash_empty", "dockTrash", "{$plugins.core->resources->getString('Browser.text.emptyTrash')}", '{$workspace->myTheme->getBaseUri()}icons/16/trashcan_full.png', "OS.emptyTrash()");
OS.addMenuItem("", "dockTrash_navigate", "dockTrash", "{$resources->getString('text.browse')}", '/plugins/core/icons/16/browser.png', "OS.launchApplication('core', 'BrowserApp', {ldelim}'selectNode': {$trashNode->getPrimaryKey()}{rdelim})");
{/if}
  
{* window menu items *}
  var currentParent;
  var menu;
  var menuItem;
  var menuSet;
  var menuStack = new Array();
{foreach from=$plugins key=pluginId item=plugin}
{foreach from=$plugin->getAllWindows() item=window}
{if $window->getMenus()}
  menuSet = new TransMenuSet(TransMenu.direction.down, 0, 0, TransMenu.reference.bottomLeft);
{foreach from=$window->getMenus() key=id item=menu}
  menu = menuSet.addMenu(document.getElementById("{$plugin->getId()}:{$window->getId()}:menu:{$menu->getId()}"), "onclick");
  OS._menus['{$pluginId}{$id}'] = menu;
  menu.onactivate = function() {ldelim} document.getElementById("{$plugin->getId()}:{$window->getId()}:menu:{$menu->getId()}").className = "menuHover{if $id eq $smarty.const.SRAOS_APPLICATION_MENU_ID}App{/if}"; {rdelim};
  menu.ondeactivate = function() {ldelim} document.getElementById("{$plugin->getId()}:{$window->getId()}:menu:{$menu->getId()}").className = {if $id eq $smarty.const.SRAOS_APPLICATION_MENU_ID}"appMenu"{else}null{/if}; {rdelim};
  menuStack.push(menu);
{foreach from=$menu->getMenus() item=subMenu}
  {$subMenu->getJavascriptAddMenuItemCode()}
{/foreach}
  menuStack.pop();
{/foreach}
{/if}
{/foreach}
{/foreach}
  
  OS.onBodyInitAfter();
  var restore = null;
{* launch/restore services *}
{if $osStartup}
{foreach from=$user->getApplications() item=application}
{if $application->isService()}
  OS.launchApplication('{$application->getPluginId()}', '{$application->getId()}');
{/if}
{/foreach}
{elseif $Template->getFormValue('serviceState')}
{if $loggingIn}
  OS.restore({$Template->getFormValue('serviceState')});
{else}
  restore = {$Template->getFormValue('serviceState')};
{/if}
{/if}
{* auto launch restore items *}
{if $loggingIn && $workspace->getWorkspaceLoginItems()}
  setTimeout("{assign var=started value="0"}{foreach from=$workspace->getWorkspaceLoginItems() key=plugin item=app}{if $started}; {/if}OS.launchApplication('{$plugin}', '{$app}'){assign var=started value="1"}{/foreach}", 1500);
{elseif $workspaceState}
  if (restore) {ldelim}
    var tmp = restore;
    restore = {$workspaceState};
    for(var i=0; i<tmp["applications"].length; i++) {ldelim}
      restore["applications"].push(tmp["applications"][i]);
    {rdelim}
  {rdelim}
{/if}
  if (restore) {ldelim}
    setTimeout('OS.restore(restore)', 1500);
  {rdelim}
  window.onresize = OS.onResize();
  OS.loadTime = {$Controller->getRunTime()};
-->
</script>

</body>
</html>
