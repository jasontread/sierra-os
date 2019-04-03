<div class="myProjects">
  <h1 id="myProjectsTaskFormHeader" class="projectHeader" style="background-image: url(plugins/productivity/icons/32/task.png)"></h1>
  
  <div id="myProjectsTaskForm"></div>
  
  <div id="myProjectsTaskFormButtons" class="myProjectPopupButtons">
    <input id="myProjectsTaskFormId" name="_taskId" type="hidden" />
    <input id="myProjectsTaskFormValidate" name="_validate" type="hidden" />
    <input id="myProjectsTaskFormButtonSave" onclick="OS.getWindowInstance(this).getManager().save()" type="button" value="{$resources->getString('text.save')}" />
    <input id="myProjectsTaskFormButtonSaveComplete" onclick="OS.getWindowInstance(this).getManager().saveComplete()" type="button" value="{$plugins.productivity->resources->getString('MyProjectTask.saveAndComplete')}" />
  </div>
  
  <div class="myProjectCancelView"> 
    <a href="#" onclick="OS.closeWindow(this)">{$resources->getString('form.cancel')}</a>
  </div>
</div>
