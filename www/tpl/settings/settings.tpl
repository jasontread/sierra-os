{$Template->assign('workspace', $user->getActiveWorkspace())}{include file="header.tpl"}

<div id="settings">
<table>
<tr><th colspan="5">Personal</th></tr>
<tr>
<td>
  <a href="account.php"><img alt="{$resources->getString('settings.account')}" src="{$workspace->myTheme->getBaseUri()}icons/64/account.png" title="{$resources->getString('settings.account')}" /></a><br />
  <a href="account.php">{$resources->getString('settings.account')}</a>
</td>
<td>
{if $user->isAdminWorkspaces()}
  <a href="workspaces.php"><img alt="{$resources->getString('settings.workspaces')}" src="{$workspace->myTheme->getBaseUri()}icons/64/workspaces.png" title="{$resources->getString('settings.workspaces')}" /></a><br />
  <a href="workspaces.php">{$resources->getString('settings.workspaces')}</a>
{else}&nbsp;{/if}
</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
{if $user->isAdminUsers() || $user->isAdminGroups()}
<tr><th colspan="5">System</th></tr>
<tr>
<td>
{if $user->isAdminUsers()}
  <a href="accounts.php"><img alt="{$resources->getString('settings.accounts')}" src="{$workspace->myTheme->getBaseUri()}icons/64/accounts.png" title="{$resources->getString('settings.accounts')}" /></a><br />
  <a href="accounts.php">{$resources->getString('settings.accounts')}</a>
{else}&nbsp;{/if}
</td>
<td>
{if $user->isAdminGroups()}
  <a href="groups.php"><img alt="{$resources->getString('settings.groups')}" src="{$workspace->myTheme->getBaseUri()}icons/64/groups.png" title="{$resources->getString('settings.groups')}" /></a><br />
  <a href="groups.php">{$resources->getString('settings.groups')}</a>
{else}&nbsp;{/if}</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
{/if}
</table>
</div>

<div id="buttons">
<input onclick="window.close()" type="button" value="{$resources->getString('form.close')}" />
</div>

{include file="footer.tpl"}
