<div class="myProjects">
<h1 id="newProjectHeader" class="projectHeader">{$plugins.productivity->resources->getString('MyProjects.createNewProject')}</h1>

<div id="newProjectInit" class="hiddenScrollingContainer" style="overflow: auto;"></div>

<div id="newProjectBase" class="hiddenContainer">
  <h3 id="myProjectsLabelWhatName">{$plugins.productivity->resources->getString('MyProjects.newProject.whatName')}</h3>
  <span id="myProjectsLabelWhatNameHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.whatNameHelp')}</span>
  <div class="myProjectFields">
  <label id="myProjectsLabelProjectName" for="myProjectName">{$plugins.productivity->resources->getString('MyProject.name')}:</label>
  <input id="myProjectName" class="textBox" onclick="this.select()" />
  </div>
  
  <h3 id="myProjectsLabelWhichParticipants">{$plugins.productivity->resources->getString('MyProjects.newProject.whichParticipants')}</h3>
  <span id="myProjectsLabelWhichParticipantsHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.whichParticipantsHelp')}</span>
  <div class="myProjectFields">
  <input id="myProjectAddParticipants" onchange="OS.getWindowInstance(this).getManager().updateNextButtonText()" type="checkbox" />
  <label id="myProjectsLabelAddParticipants" for="myProjectAddParticipants">{$plugins.productivity->resources->getString('MyProjects.newProject.addParticipants')}</label>
  </div>
  
  <h3 id="myProjectsLabelOtherInfo">{$plugins.productivity->resources->getString('MyProjects.newProject.otherInfo')}</h3>
  <span id="myProjectsLabelOtherInfoHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.otherInfoHelp')}</span>
  <div class="myProjectFields">
  <input id="myProjectOtherInfo" onchange="OS.getWindowInstance(this).getManager().updateNextButtonText()" type="checkbox" />
  <label id="myProjectsLabelSpecifyOtherInfo" for="myProjectOtherInfo">{$plugins.productivity->resources->getString('MyProjects.newProject.specifyOtherInfo')}</label>
  </div>
</div>

<div id="newProjectOtherInfo" class="hiddenContainer">
  <h3 id="myProjectsLabelProjectSummary">{$plugins.productivity->resources->getString('MyProjects.newProject.projectSummary')}</h3>
  <span id="myProjectsLabelProjectSummaryHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.projectSummaryHelp')}</span>
  <div class="myProjectFields"><textarea id="myProjectSummary" class="textArea" cols="" rows=""></textarea></div>
  <h3 id="myProjectsLabelProjectDueDate">{$plugins.productivity->resources->getString('MyProjects.newProject.projectDueDate')}</h3>
  <span id="myProjectsLabelProjectDueDateHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.projectDueDateHelp')}</span>
  <div class="myProjectFields">
  <label id="myProjectsLabelDueDate" for="myProjectOtherInfo">{$plugins.productivity->resources->getString('MyProject.dueDate')}:</label>
  <input id="myProjectDueDate" class="myProjectsDateChooser" onclick="this.select()" />
  <span id="dueDateChooser"></span>
  </div>
</div>

<div id="newProjectParticipants" class="hiddenContainer">
  <h3 id="myProjectsLabelWhichParticipants1">{$plugins.productivity->resources->getString('MyProjects.newProject.whichParticipants')}</h3>
  <span id="myProjectsLabelSelectParticipantsHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.selectParticipantsHelp')}</span>
  <div class="myProjectFields">
    <table>
      <tr>
        <td>
          <strong>{$plugins.productivity->resources->getString('MyProjects.availableParticipants')}</strong><br />
          <select id="newAvailableParticipantsField" class="myProjectsParticipantDropDown" size="1">
            <option value="">{$resources->getString('form.select')}</option>
            {foreach from=$user->getProjectParticipantsHash() key=id item=val}
            <option value="{$id}">{$val}</option>
            {/foreach}
          </select><br />
          <a id="myProjectsAddParticipantLink" href="#" onclick="this.permissionsForm.addParticipant()">{$resources->getString('form.add')}</a>
        </td>
        <td>
          <strong>{$plugins.productivity->resources->getString('MyProjects.currentParticipants')} (<span id="newCurrentParticipantsCount">0</span>)</strong><br />
          <select id="newCurrentParticipantsField" class="myProjectsParticipantDropDown" onchange="this.permissionsForm.selectParticipant()" size="1">
            <option value="">{$resources->getString('form.select')}</option>
          </select><br />
          <a id="myProjectsRemoveParticipantLink" href="#" onclick="this.permissionsForm.removeParticipant()">{$resources->getString('form.remove')}</a>
          <a id="myProjectsUpdateParticipantLink" href="#" onclick="this.permissionsForm.updateParticipant()">{$resources->getString('form.update')}</a>
        </td>
      </tr>
    </table>
    <table>
      <tr><td colspan="2"><strong>{$plugins.productivity->resources->getString('MyProjects.participantsCan')}:</strong></td></tr>
      <tr>
        <td><input id="newProjectPermissions1" type="checkbox" value="1" /><label for="newProjectPermissions1">{$plugins.productivity->resources->getString('text.permissions.fileRead')}</label></td>
        <td><input id="newProjectPermissions3" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="3" /><label for="newProjectPermissions3">{$plugins.productivity->resources->getString('text.permissions.fileWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="newProjectPermissions4" type="checkbox" value="4" /><label for="newProjectPermissions4">{$plugins.productivity->resources->getString('text.permissions.messageRead')}</label></td>
        <td><input id="newProjectPermissions12" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="12" /><label for="newProjectPermissions12">{$plugins.productivity->resources->getString('text.permissions.messageWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="newProjectPermissions16" type="checkbox" value="16" /><label for="newProjectPermissions16">{$plugins.productivity->resources->getString('text.permissions.taskRead')}</label></td>
        <td><input id="newProjectPermissions48" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="48" /><label for="newProjectPermissions48">{$plugins.productivity->resources->getString('text.permissions.taskWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="newProjectPermissions64" type="checkbox" value="64" /><label for="newProjectPermissions64">{$plugins.productivity->resources->getString('text.permissions.whiteboardRead')}</label></td>
        <td><input id="newProjectPermissions192" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="192" /><label for="newProjectPermissions192">{$plugins.productivity->resources->getString('text.permissions.whiteboardWrite')}</label></td>
      </tr>
      <tr><td colspan="2"><input id="newProjectPermissions255" checked="checked" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="255" /><label for="newProjectPermissions255"><strong>{$plugins.productivity->resources->getString('text.permissions.fullParticipant')}</strong></label></td></tr>
      <tr><td colspan="2"><input id="newProjectPermissions511" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="511" /><label for="newProjectPermissions511"><strong>{$plugins.productivity->resources->getString('text.permissions.all')}</strong></label></td></tr>
      <tr><td colspan="2" class="myProjectsSendIntroEmailCell"><input id="viewProjectPermissionsSendIntroEmail" checked="checked" type="checkbox" /><label for="viewProjectPermissionsSendIntroEmail">{$plugins.productivity->resources->getString('text.permissions.sendIntroEmail')}</label></td></tr>
    </table>
  </div>
</div>

<div class="myProjectButtons">
  <input id="myProjectBackButton" onclick="OS.getWindowInstance(this).getManager().back()" style="visibility: hidden" type="button" value="{$plugins.productivity->resources->getString('text.back')}" />
  <input id="myProjectNextButton" onclick="OS.getWindowInstance(this).getManager().next()" type="button" value="{$plugins.productivity->resources->getString('MyProjects.createProjectNow')}" />
</div>

<a class="myProjectCancel" href="#" onclick="OS.closeWindow(OS.getWindowInstance(this))">{$resources->getString('text.cancel')}</a>

</div>
