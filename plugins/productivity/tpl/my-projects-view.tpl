<div class="myProjects">

<div id="viewProjectTabs" style="overflow: hidden;"></div>

<h1 id="viewProjectHeader" class="projectHeader">{$plugins.productivity->resources->getString('MyProjects.viewProject')}</h1>

<div id="viewProject" class="hiddenScrollingContainer" style="overflow: auto; visibility: visible;"></div>

<div id="viewProjectInit" class="hiddenScrollingContainerView" style="overflow: auto;"></div>

<div id="viewProjectBase" class="hiddenContainerView">
  <h3 id="myProjectsLabelWhatName1">{$plugins.productivity->resources->getString('MyProjects.newProject.whatName')}</h3>
  <span id="myProjectsLabelWhatNameHelp1" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.whatNameHelp')}</span>
  <div class="myProjectFields">
  <label id="myProjectsLabelProjectName1" for="myProjectName1">{$plugins.productivity->resources->getString('MyProject.name')}:</label>
  <input id="myProjectName1" class="textBox" name="name" onclick="this.select()" />
  </div>
  
  <h3 id="myProjectsLabelProjectArchived">{$plugins.productivity->resources->getString('MyProjects.viewProject.archived')}</h3>
  <span id="myProjectsLabelProjectArchivedHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.viewProject.archivedHelp')}</span>
  <div class="myProjectFields">
  <label for="myProjectArchivedYes">{$plugins.productivity->resources->getString('MyProject.archived')}:</label>
  <input id="myProjectArchivedYes" name="archived" type="radio" value="1" /> {$resources->getString('text.yes')}
  <input id="myProjectArchivedNo" name="archived" type="radio" value="0" /> {$resources->getString('text.no')}
  </div>
  
  <h3 id="myProjectsLabelProjectStatus">{$plugins.productivity->resources->getString('MyProjects.viewProject.status')}</h3>
  <span id="myProjectsLabelProjectStatusHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.viewProject.statusHelp')}</span>
  <div class="myProjectFields">
  <label for="myProjectStatus">{$plugins.productivity->resources->getString('MyProject.status')}:</label>
  <select id="myProjectStatus" name="status" size="1">
    <option value="active">{$plugins.productivity->resources->getString('text.status.active')}</option>
    <option value="cancelled">{$plugins.productivity->resources->getString('text.status.cancelled')}</option>
    <option value="completed">{$plugins.productivity->resources->getString('text.status.completed')}</option>
    <option value="hold">{$plugins.productivity->resources->getString('text.status.hold')}</option>
  </select>
  </div>
</div>

<div id="viewProjectOtherInfo" class="hiddenContainerView">
  <h3 id="myProjectsLabelProjectSummary1">{$plugins.productivity->resources->getString('MyProjects.newProject.projectSummary')}</h3>
  <span id="myProjectsLabelProjectSummaryHelp1" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.projectSummaryHelp')}</span>
  <div class="myProjectFields"><textarea id="myProjectSummary1" class="textArea" name="summary" cols="" rows=""></textarea></div>
  
  <h3 id="myProjectsLabelProjectDueDate1">{$plugins.productivity->resources->getString('MyProjects.newProject.projectDueDate')}</h3>
  <span id="myProjectsLabelProjectDueDateHelp1" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.projectDueDateHelp')}</span>
  <div class="myProjectFields">
  <label id="myProjectsLabelDueDate1" for="myProjectOtherInfo">{$plugins.productivity->resources->getString('MyProject.dueDate')}:</label>
  <input id="myProjectDueDate1" class="myProjectsDateChooser" name="dueDate" onclick="this.select()" />
  <span id="dueDateChooser1"></span>
  </div>
</div>

<div id="viewProjectParticipants" class="hiddenContainerView" style="overflow: hidden">
  <h3 id="myProjectsLabelWhichParticipants2">{$plugins.productivity->resources->getString('MyProjects.newProject.whichParticipants')}</h3>
  <span id="myProjectsLabelSelectParticipantsHelp1" class="helpText">{$plugins.productivity->resources->getString('MyProjects.newProject.selectParticipantsHelp')}</span>
  <div class="myProjectFields">
    <table>
      <tr>
        <td>
          <strong>{$plugins.productivity->resources->getString('MyProjects.availableParticipants')}</strong><br />
          <select id="newAvailableParticipantsField1" class="myProjectsParticipantDropDown" size="1">
            <option value="">{$resources->getString('form.select')}</option>
            {foreach from=$user->getProjectParticipantsHash() key=id item=val}
            <option value="{$id}">{$val}</option>
            {/foreach}
          </select><br />
          <a id="myProjectsAddParticipantLink1" href="#" onclick="this.permissionsForm.addParticipant()">{$resources->getString('form.add')}</a>
        </td>
        <td>
          <strong>{$plugins.productivity->resources->getString('MyProjects.currentParticipants')} (<span id="newCurrentParticipantsCount1">0</span>)</strong><br />
          <select id="newCurrentParticipantsField1" class="myProjectsParticipantDropDown" name="newCurrentParticipantsField" onchange="this.permissionsForm.selectParticipant()" size="1">
            <option value="">{$resources->getString('form.select')}</option>
          </select><br />
          <a id="myProjectsRemoveParticipantLink1" href="#" onclick="this.permissionsForm.removeParticipant()">{$resources->getString('form.remove')}</a>
          <a id="myProjectsUpdateParticipantLink1" href="#" onclick="this.permissionsForm.updateParticipant()">{$resources->getString('form.update')}</a>
        </td>
      </tr>
      </table>
      <table>
      <tr><td colspan="2"><strong>{$plugins.productivity->resources->getString('MyProjects.participantsCan')}:</strong></td></tr>
      <tr>
        <td><input id="viewProjectPermissions1" type="checkbox" value="1" /><label for="viewProjectPermissions1">{$plugins.productivity->resources->getString('text.permissions.fileRead')}</label></td>
        <td><input id="viewProjectPermissions3" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="3" /><label for="viewProjectPermissions3">{$plugins.productivity->resources->getString('text.permissions.fileWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="viewProjectPermissions4" type="checkbox" value="4" /><label for="viewProjectPermissions4">{$plugins.productivity->resources->getString('text.permissions.messageRead')}</label></td>
        <td><input id="viewProjectPermissions12" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="12" /><label for="viewProjectPermissions12">{$plugins.productivity->resources->getString('text.permissions.messageWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="viewProjectPermissions16" type="checkbox" value="16" /><label for="viewProjectPermissions16">{$plugins.productivity->resources->getString('text.permissions.taskRead')}</label></td>
        <td><input id="viewProjectPermissions48" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="48" /><label for="viewProjectPermissions48">{$plugins.productivity->resources->getString('text.permissions.taskWrite')}</label></td>
      </tr>
      <tr>
        <td><input id="viewProjectPermissions64" type="checkbox" value="64" /><label for="viewProjectPermissions64">{$plugins.productivity->resources->getString('text.permissions.whiteboardRead')}</label></td>
        <td><input id="viewProjectPermissions192" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="192" /><label for="viewProjectPermissions192">{$plugins.productivity->resources->getString('text.permissions.whiteboardWrite')}</label></td>
      </tr>
      <tr><td colspan="2"><input id="viewProjectPermissions255" checked="checked" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="255" /><label for="viewProjectPermissions255"><strong>{$plugins.productivity->resources->getString('text.permissions.fullParticipant')}</strong></label></td></tr>
      <tr><td colspan="2"><input id="viewProjectPermissions511" onchange="this.permissionsForm.updatePermissionFields()" type="checkbox" value="511" /><label for="viewProjectPermissions511"><strong>{$plugins.productivity->resources->getString('text.permissions.all')}</strong></label></td></tr>
      <tr><td colspan="2" class="myProjectsSendIntroEmailCell"><input id="viewProjectPermissionsSendIntroEmail1" checked="checked" type="checkbox" /><label for="viewProjectPermissionsSendIntroEmail1">{$plugins.productivity->resources->getString('text.permissions.sendIntroEmail')}</label></td></tr>
    </table>
  </div>
</div>

<div id="viewProjectCategories" class="hiddenContainerView" style="overflow: hidden">
  <h3 id="myProjectsLabelFileCategories">{$plugins.productivity->resources->getString('MyProject.fileCategories')}</h3>
  <span id="myProjectsLabelFileCategoriesHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.fileCategoriesHelp')}</span>
  <div class="myProjectFields">
    <table>
      <tr>
        <td>
          <select id="fileCategories1" size="1"><option></option></select>
          <a href="#" onclick="OS.getWindowInstance(this).getManager().removeFileCategory()">{$resources->getString('form.remove')}</a>
        </td>
        <td>
          <input id="addFileCategory" type="text" />
          <a href="#" onclick="OS.getWindowInstance(this).getManager().addFileCategory()">{$resources->getString('form.add')}</a>
        </td>
      </tr>
    </table>
  </div>
  
  <h3 id="myProjectsLabelMessageCategories">{$plugins.productivity->resources->getString('MyProject.messageCategories')}</h3>
  <span id="myProjectsLabelMessageCategoriesHelp" class="helpText">{$plugins.productivity->resources->getString('MyProjects.messageCategoriesHelp')}</span>
  <div class="myProjectFields">
    <table>
      <tr>
        <td>
          <select id="messageCategories1" size="1"><option></option></select>
          <a href="#" onclick="OS.getWindowInstance(this).getManager().removeMessageCategory()">{$resources->getString('form.remove')}</a>
        </td>
        <td>
          <input id="addMessageCategory" type="text" />
          <a href="#" onclick="OS.getWindowInstance(this).getManager().addMessageCategory()">{$resources->getString('form.add')}</a>
        </td>
      </tr>
    </table>
  </div>
</div>

<div id="viewProjectButtons" class="myProjectButtons" style="visibility: hidden">
  <input onclick="OS.getWindowInstance(this).getManager().deleteProject()" type="button" value="{$resources->getString('text.delete')}" />
  <input onclick="OS.getWindowInstance(this).getManager().saveProject()" type="button" value="{$resources->getString('text.save')}" />
</div>

<div class="myProjectCancelView">
  <a id="editProjectToggle" href="#" onclick="OS.getWindowInstance(this).getManager().toggleEditMode()" style="visibility: hidden">{$resources->getString('text.edit')}</a> 
  <a id="myProjectsViewCloseWindowLink" href="#" onclick="OS.closeWindow(OS.getWindowInstance(this))">{$resources->getString('form.close')}</a>
</div>

</div>
