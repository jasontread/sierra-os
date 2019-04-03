<div class="preferences">
  <table class="preferencesTable">
    <tr>
      <td><label for="myProjectsEmailParticipantEmail">{$plugins.productivity->resources->getString('MyProjectEmailParticipant.email')}</label></td>
      <td><input id="myProjectsEmailParticipantEmail" class="textBox" type="text" /></td>
    </tr>
    <tr>
      <td><label for="myProjectsEmailParticipantName">{$plugins.productivity->resources->getString('MyProjectEmailParticipant.name')}</label></td>
      <td><input id="myProjectsEmailParticipantName" class="textBox" type="text" /></td>
    </tr>
    <tr>
      <td><label for="myProjectsEmailParticipantPassword">{$resources->getString('OsUser.password')}</label></td>
      <td><input id="myProjectsEmailParticipantPassword" class="textBox" type="password" /></td>
    </tr>
    <tr>
      <td><label for="myProjectsEmailParticipantPasswordConfirm">{$resources->getString('OsUser.passwordConfirm')}</label></td>
      <td><input id="myProjectsEmailParticipantPasswordConfirm" class="textBox" type="password" /></td>
    </tr>
  </table>
  <div class="preferencesButtons">
    <input type="button" value="{$resources->getString('form.cancel')}" onclick="OS.closeWindow(this)" />
    <input type="button" value="{$resources->getString('text.save')}" onclick="OS.getWindowInstance(this).getManager().save()" />
  </div>
</div>
