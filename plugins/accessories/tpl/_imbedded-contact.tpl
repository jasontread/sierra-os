{if $icontact}
{if $idisplay}{assign var='label' value=$icontact->parseString($idisplay)}{else}{assign var='label' value=$icontact->getContactLabel()}{/if}
<div style="margin-bottom: 3px">
{if !$iviewOnly}<img alt="{$resources->getString('form.remove')}" onclick="ImbeddedContact.remove(this, '{$fieldName}', {$icontact->getPrimaryKey()}, {if $icardinality}true{else}false{/if})" src="plugins/accessories/images/remove.png" style="float: left; margin-right: 3px;" title="{$resources->getString('form.remove')}" />{/if}
<a href="#" onclick="var params={ldelim} {$icParams}, 'contactId': {$icontact->getContactId()} {rdelim}; OS.launchWindow('accessories', 'ImbeddedContact', params);">{$label}</a>
</div>
{/if}
