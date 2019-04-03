<div class="coreUserGroupSelector">
  <h1 id="userGroupSelectorHeader" style="background-image: url({$workspace->myTheme->getBaseUri()}icons/32/accounts.png)"></h1>
  
  <div id="userGroupSelectorUsers" class="coreToggle">
    <div id="userGroupSelectorUsersToggle" class="coreToggler"></div>
    <h3>{$plugins.core->resources->getString('UserGroupSelector.users')}</h3>
    <div id="userGroupSelectorUsersDiv" class="toggleDiv groupUserList"></div>
  </div>
  
  <div id="userGroupSelectorGroups" class="coreToggle">
    <div id="userGroupSelectorGroupsToggle" class="coreToggler"></div>
    <h3>{$plugins.core->resources->getString('UserGroupSelector.groups')}</h3>
    <div id="userGroupSelectorGroupsDiv" class="toggleDiv groupUserList"></div>
  </div>
  
  <div class="coreUserGroupSelectorButtons">
    <input onclick="OS.getWindowInstance(this).getManager().initCancel()" type="button" value="{$resources->getString('form.cancel')}" />
    <input onclick="OS.getWindowInstance(this).getManager().select()" type="button" value="{$plugins.core->resources->getString('UserGroupSelector.select')}" />
  </div>
</div>
