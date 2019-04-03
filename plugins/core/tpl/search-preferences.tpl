<table class="preferencesTable">
<tr><th>{$plugins.core->resources->getString('Search.text.preferences')}:</th></tr>
{foreach from=$user->getEntityPermissions() key=entityId item=searchEntity}
<tr><td>
<input id="{$entityId}" name="{$entityId}" type="checkbox" value="{$entityId}" />
<img alt="{$searchEntity->getLabel()}" src="{$searchEntity->getIconPath(16)}" title="{$searchEntity->getLabel()}" />
{$searchEntity->getLabel()}
</td></tr>
{/foreach}
</table>
<div class="preferencesButtons">
<input onclick="OS.getWindowInstance(this).getManager().updateSearchEntities()" type="button" value="{$resources->getString('form.update')}" />
<input onclick="OS.getWindowInstance(this).getManager().setDefaultSearchEntities()" type="button" value="{$resources->getString('text.default')}" />
</div>
