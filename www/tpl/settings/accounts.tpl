{include file="header.tpl"}

{$formUser->render('children')}

<div id="buttons">
<input name="submitted" type="hidden" value="" />
{if $Template->getFormValue('toggleChildId') || $Template->getFormValue('submitted')}
<input onclick="document.forms[0].submitted.value='1';" type="submit" value="{$resources->getString('form.update')}" />
<input onclick="window.location.href = unescape(window.location.pathname)" type="button" value="{$resources->getString('form.reset')}" />
{/if}
<input onclick="window.close()" type="button" value="{$resources->getString('form.close')}" />
</div>

{include file="footer.tpl"}
