<div class="preferences">
  <div id="myContactsPreferences"></div>
  <div id="myContactsPreferencesButtons" class="preferencesButtons" style="visibility: hidden">
    <input type="button" value="{$resources->getString('form.updatePreferences')}" onclick="OS.getWindowInstance(this).submitForm(MyContactsPreferences.SERVICE_UPDATE_PREFERENCES, SRAOS_AjaxRequestObj.TYPE_UPDATE, OS.user.myContactsPreferences, null, null, true, false, OS.getWindowInstance(this).getManager(), 'updatePreferences')" />
    <input type="button" value="{$resources->getString('form.close')}" onclick="OS.closeWindow(this)" />
  </div>
</div>
<script type="text/javascript">
OS.user.myContactsPreferences = {$user->getAttribute('myContactsPreferences_preferencesId')};
</script>
