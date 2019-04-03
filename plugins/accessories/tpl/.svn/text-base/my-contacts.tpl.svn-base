<div id="myContactsContacts" class="myContactsContacts">
  <h1 id="myContactsNameHeader" class="myContactsColumnHeader">{$plugins.accessories->resources->getString('MyContacts.name')}</h1>
  <div id="myContactsSearch" class="myContactsSearch">
    <img alt="{$resources->getString('form.cancel')}" onclick="OS.getWindowInstance(this).getManager().hideSearch()" src="{$workspace->myTheme->getBaseUri()}icons/16/delete.png" title="{$resources->getString('form.cancel')}" />
    <img alt="{$resources->getString('text.search')}" onclick="OS.getWindowInstance(this).getManager().search()" src="{$workspace->myTheme->getBaseUri()}icons/16/search.png" title="{$resources->getString('text.search')}" />
    <input id="myContactsSearchField" name="myContactsSearch" onblur="if (SRAOS_Util.trim(this.value) == '') {ldelim} this.value='{$plugins.accessories->resources->getString('MyContacts.search')}'; {rdelim}" onclick="this.select()" onfocus="this.select()" value="{$plugins.accessories->resources->getString('MyContacts.search')}" />
  </div>
  <div id="myContactsContactsList" class="myContactsCards" style="overflow: auto"></div>
</div>
<div id="myContactsGroups" class="myContactsGroups">
  <h1 class="myContactsColumnHeader">{$plugins.accessories->resources->getString('MyContacts.group')}</h1>
  <div id="myContactsGroupsList" style="overflow: auto"></div>
</div>

<div id="myContactsCanvas" class="myContactsCanvas" style="overflow: auto">
  <div id="myContactsControls" class="myContactsControls"></div>
  <div id="myContactsTabs" class="myContactsCanvasTabs"></div>
  <div id="myContact" class="myContactsContact"></div>
</div>
<div id="myContactsVertDividerContacts" class="vertDivider"></div>
<div id="myContactsVertDividerGroups" class="vertDivider"></div>
<script type="text/javascript">
{foreach from=$MyContactsManager->getAddlHelpEntries() key=id item=helpEntry}
OS.addMenuItemDelayed('accessories', 'mycontacts_{$helpEntry.plugin}_{$helpEntry.type}_help', 'myContactsHelpMenu', '{$helpEntry.label}', {if $helpEntry.icon}'{$helpEntry.icon}'{else}OS.getIconUri(16, 'help.png'){/if}, "Core_HelpManager.load('{$helpEntry.plugin}', '{$helpEntry.topic}')");
{/foreach}
</script>