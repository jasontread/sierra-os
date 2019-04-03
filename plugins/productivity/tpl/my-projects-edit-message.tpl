<div class="myProjects">
  <h1 id="myProjectsMessageHeader" class="projectHeader" style="background-image: url(plugins/productivity/icons/32/message.png)"></h1>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newMessage.project')}</h3>
  <div class="myProjectFields myProjectsProjectTaskSelectors">
    <label for="myProjectMessageProject">{$plugins.productivity->resources->getString('MyProjects.newMessage.projectCategory')}:</label>
    <select id="myProjectMessageProject" onchange="OS.getWindowInstance(this).getManager().updateProjectId()"><option>{$plugins.productivity->resources->getString('MyProjects.loadingCategories')}</option></select>
    <div>
      <label for="myProjectMessageTask">{$plugins.productivity->resources->getString('MyProjects.newMessage.task')}:</label>
      <select id="myProjectMessageTask"><option>{$plugins.productivity->resources->getString('MyProjects.loadingTasks')}</option></select>
    </div>
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newMessage.title')}</h3>
  <div class="myProjectFields">
    <label for="myProjectMessageTitle">{$plugins.productivity->resources->getString('text.title')}:</label>
    <input id="myProjectMessageTitle" class="textBox" name="title" onclick="this.select()" />
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newMessage.message')}</h3>
  <div class="myProjectFields"><textarea id="myProjectMessage" class="textArea" name="message" cols="" rows=""></textarea></div>
  
  <div class="myProjectsMessageFiles myProjectsPopupToggle">
    <div id="myProjectsMessageFilesToggle" class="myProjectsToggle"></div>
    <h3>{$plugins.productivity->resources->getString('MyProjects.newMessage.files')}</h3>
    <div id="myProjectsMessageFilesToggleDiv" class="myProjectsPopupToggleDiv">
      <div id="myProjectsMessageExistingFiles" style="position: absolute; visibility: hidden"></div>
{foreach from=$Util->getArray($smarty.const.MY_PROJECTS_MAX_FILES_ATTACH) item=num}
      <div id="myProjectsMessageFile{$num}" style="position: absolute; visibility: hidden;">
        <a href="#" onclick="OS.getWindowInstance(this).getManager().removeFile({$num})"><img alt="{$plugins.productivity->resources->getString('text.removeFile')}" src="plugins/productivity/images/remove.png" title="{$plugins.productivity->resources->getString('text.removeFile')}" /></a>
        <span id="myProjectsMessageFileExisting{$num}"></span>
        <span id="myProjectsMessageFileChooser{$num}"><input name="myProjectsMessageFile{$num}" type="file" /></span>
      </div>
{/foreach}
      <div id="myProjectsAddMessageFileDiv">
        <a href="#" onclick="OS.getWindowInstance(this).getManager().addFile()"><img alt="{$plugins.productivity->resources->getString('text.attachFile')}" src="plugins/productivity/icons/16/file.png" title="{$plugins.productivity->resources->getString('text.attachFile')}" /></a>
        <a id="myProjectsAddMessageFileLink" href="#" onclick="OS.getWindowInstance(this).getManager().addFile()">{$plugins.productivity->resources->getString('text.attachFile')}</a>
      </div>
    </div>
  </div>
  
  <div class="myProjectsPopupToggle">
    <div id="myProjectsMessageSubscriberToggle" class="myProjectsToggle"></div>
    <h3>{$plugins.productivity->resources->getString('MyProjects.newMessage.subscribers')}</h3>
    <div id="myProjectsMessageSubscriberToggleDiv" class="myProjectsPopupToggleDiv"></div>
  </div>
  
  <div class="myProjectPopupButtons">
    <input id="myProjectMessageDeleteBtn" onclick="OS.getWindowInstance(this).getManager().deleteMessage()" type="button" value="{$resources->getString('text.delete')}" />
    <input onclick="OS.getWindowInstance(this).getManager().preview()" type="button" value="{$plugins.productivity->resources->getString('text.preview')}" />
    <input id="myProjectMessageSaveBtn" onclick="OS.getWindowInstance(this).getManager().saveMessage()" type="button" value="{$resources->getString('text.save')}" />
  </div>
  
  <div class="myProjectCancelView"> 
    <a href="#" onclick="OS.closeWindow(this)">{$resources->getString('form.cancel')}</a>
  </div>
</div>
