<div class="myProjects">
  <div id="editFileTabs" style="overflow: hidden"></div>
  
  <div id="editFileTabFile" class="hiddenContainerView">
    <h3>{$plugins.productivity->resources->getString('MyProjects.file.file')}</h3>
    <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.file.fileHelp')}</span>
    <div class="myProjectFields">
      <label for="myProjectFieldFile">{$plugins.productivity->resources->getString('MyProjectFile.file')}:</label>
      <input id="myProjectFieldFile" class="textBox" name="file" type="file" />
      <div id="editFileRevisionType" style="display:none">
        <label for="myProjectFieldRevisionType">{$plugins.productivity->resources->getString('MyProjectFile.revisionType')}:</label>
        <select id="myProjectFieldRevisionType" name="revisionType" size="1"><option></option></select>
      </div>
    </div>
    
    <h3>{$plugins.productivity->resources->getString('MyProjects.file.name')}</h3>
    <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.file.nameHelp')}</span>
    <div class="myProjectFields">
      <label for="myProjectFieldFileName">{$plugins.productivity->resources->getString('MyProjectFile.name')}:</label>
      <input id="myProjectFieldFileName" class="textBox" name="name" onclick="this.select()" />
    </div>
    
    <h3>{$plugins.productivity->resources->getString('MyProjects.file.changeRestriction')}</h3>
    <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.file.changeRestrictionHelp')}</span>
    <div class="myProjectFields">
      <span id="myProjectFileChangeRestriction" style="margin-right: 10px"><strong>{$user->getName()}</strong><br /></span>
      <a id="myProjectFileChangeRestrictionLink" href="#" onclick="OS.getWindowInstance(this).getManager().selectChangeRestriction()">{$resources->getString('form.select')}</a>
      <div><input id="myProjectFieldFileReadOnly" name="readOnly" type="checkbox" value="1" /> {$plugins.productivity->resources->getString('MyProjects.file.readOnly')} <font class="lightFont">({$plugins.productivity->resources->getString('MyProjects.file.readOnlyExpl')})</font></div>
    </div>
  </div>
  
  <div id="editFileTabVersioning" class="hiddenScrollingContainerView">
    <h3>{$plugins.productivity->resources->getString('MyProjects.file.versioning')}</h3>
    <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.file.versioningHelp')}</span>
    <div id="editFileVersioning" class="myProjectFields">
      <label for="myProjectFieldVersioning">{$plugins.productivity->resources->getString('MyProjectFile.versioning')}:</label>
      <select id="myProjectFieldVersioning" name="versioning" onchange="OS.getWindowInstance(this).getManager().updateVersioning()" size="1">
        <option value="0">{$plugins.productivity->resources->getString('MyProjectFile.versioning.0')}</option>
        <option value="1">{$plugins.productivity->resources->getString('MyProjectFile.versioning.1')}</option>
        <option value="2">{$plugins.productivity->resources->getString('MyProjectFile.versioning.2')}</option>
        <option value="3">{$plugins.productivity->resources->getString('MyProjectFile.versioning.3')}</option>
      </select>
    </div>
    
    <div id="editFileVersionsDiv" style="display:none">
      <h3>{$plugins.productivity->resources->getString('MyProjects.file.versions')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.file.versionsHelp')}</span>
      <div id="editFileVersions" class="myProjectFields"></div>
    </div>
  </div>
  
  <div id="editFileTabAssociations" class="hiddenContainerView">
    <h3>{$plugins.productivity->resources->getString('MyProjects.file.project')}</h3>
    <div class="myProjectFields myProjectsProjectTaskSelectors">
      <label for="myProjectFileProject">{$plugins.productivity->resources->getString('MyProjects.file.projectCategory')}:</label>
      <select id="myProjectFileProject" onchange="OS.getWindowInstance(this).getManager().updateProjectId()"><option>{$plugins.productivity->resources->getString('MyProjects.loadingCategories')}</option></select>
      <div>
        <label for="myProjectFileTask">{$plugins.productivity->resources->getString('MyProjects.file.task')}:</label>
        <select name="taskId" id="myProjectFileTask"><option>{$plugins.productivity->resources->getString('MyProjects.loadingTasks')}</option></select>
      </div>
    </div>
  </div>
  
  <div id="editFileTabProperties" class="hiddenContainerView">
    <h1 id="myProjectsFileHeader" class="projectHeader" style="background-image: url(plugins/productivity/icons/32/file.png)"></h1>
    <table>
      <tr>
        <th>{$plugins.productivity->resources->getString('MyProjectFile.fileSize')}</th>
        <td id="myProjectsFilePropertiesSize"></td>
      </tr>
      <tr id="myProjectsFilePropertiesVersionRow">
        <th>{$plugins.productivity->resources->getString('text.version')}</th>
        <td id="myProjectsFilePropertiesVersion"></td>
      </tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('text.created1')}</th>
        <td id="myProjectsFilePropertiesCreated"></td>
      </tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('text.lastUpdated1')}</th>
        <td id="myProjectsFilePropertiesLastUpdated"></td>
      </tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('MyProjects.file.task')}</th>
        <td id="myProjectsFilePropertiesTask"></td>
      </tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('MyProjects.file.message')}</th>
        <td id="myProjectsFilePropertiesMessage"></td>
      </tr>
    </table>
  </div>
  
  <div id="editFileButtons" class="myProjectButtons">
    <input id="myProjectFileDeleteBtn" onclick="OS.getWindowInstance(this).getManager().deleteFile()" type="button" value="{$resources->getString('text.delete')}" />
    <input id="myProjectFileSaveBtn" onclick="OS.getWindowInstance(this).getManager().saveFile()" type="button" value="{$resources->getString('text.save')}" />
  </div>
  
  <div id="editFileCancel" class="myProjectCancelView"> 
    <a href="#" onclick="OS.closeWindow(this)">{$resources->getString('form.cancel')}</a>
  </div>
</div>
