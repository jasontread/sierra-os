<div class="preferences">
{$user->render('myProjectsPreferences')}
<div class="preferencesButtons">
<input type="button" value="{$resources->getString('form.updatePreferences')}" onclick="OS.getWindowInstance(this).submitForm('myProjectsUpdateUserPreferences', SRAOS_AjaxRequestObj.TYPE_UPDATE, {$user->getPrimaryKey()}, null, null, true, false, OS.getWindowInstance(this).getManager(), 'updatePreferences')" />
<input type="button" value="{$resources->getString('form.close')}" onclick="OS.closeWindow(this)" />
</div>
</div>
