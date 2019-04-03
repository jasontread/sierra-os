<div class="myProjects">
  <h1 id="myProjectsWhiteboardHeader" class="projectHeader" style="background-image: url(plugins/productivity/icons/32/whiteboard.png)"></h1>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.project')}</h3>
  <div class="myProjectFields myProjectsProjectTaskSelectors">
    <label for="myProjectWhiteboardProject">{$plugins.productivity->resources->getString('MyProjects.newMessage.projectCategory')}:</label>
    <select id="myProjectWhiteboardProject" onchange="OS.getWindowInstance(this).getManager().updateProjectId()"><option>{$plugins.productivity->resources->getString('MyProjects.loadingCategories')}</option></select>
    <div>
      <label for="myProjectWhiteboardTask">{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.task')}:</label>
      <select id="myProjectWhiteboardTask"><option>{$plugins.productivity->resources->getString('MyProjects.loadingTasks')}</option></select>
    </div>
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.title')}</h3>
  <div class="myProjectFields">
    <label for="myProjectWhiteboardTitle">{$plugins.productivity->resources->getString('text.title')}:</label>
    <input id="myProjectWhiteboardTitle" class="textBox" onclick="this.select()" />
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.dimensions')}</h3>
  <div class="myProjectFields">
    <label for="myProjectWhiteboardDimensions">{$plugins.productivity->resources->getString('MyProjectWhiteboard.width')} x {$plugins.productivity->resources->getString('MyProjectWhiteboard.height')}:</label>
    <select id="myProjectWhiteboardDimensions">
      <option value="640x480">640x480</option>
      <option value="1024x768">1024x768</option>
      <option value="1280x1024">1280x1024</option>
      <option value="480x640">480x640</option>
      <option value="768x1024">768x1024</option>
      <option value="1024x1280">1024x1280</option>
      <option value="auto">{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.autoCalculate')}</option>
    </select>
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.whiteboard')}</h3>
  <div class="myProjectFields">
    <label for="myProjectWhiteboardFile">{$plugins.productivity->resources->getString('MyProjectWhiteboard.whiteboard')}:</label>
    <input id="myProjectWhiteboardFile" name="myProjectWhiteboardFile" type="file" />
    <span id="myProjectWhiteboardFileThumbnail"></span>
  </div>
  
  <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.changeRestriction')}</h3>
  <div class="myProjectFields">
    <span id="myProjectWhiteboardChangeRestriction" style="margin-right: 10px">{$plugins.productivity->resources->getString('text.nobody')}</span>
    <a href="#" onclick="OS.getWindowInstance(this).getManager().selectChangeRestriction()">{$resources->getString('form.select')}</a>
  </div>
  
  <div class="myProjectsPopupToggle">
    <div id="myProjectsWhiteboardSubscriberToggle" class="myProjectsToggle"></div>
    <h3>{$plugins.productivity->resources->getString('MyProjects.newWhiteboard.subscribers')}</h3>
    <div id="myProjectsWhiteboardSubscriberToggleDiv" class="myProjectsPopupToggleDiv"></div>
  </div>
  
  <div class="myProjectPopupButtons">
    <input id="myProjectWhiteboardDeleteBtn" onclick="OS.getWindowInstance(this).getManager().deleteWhiteboard()" type="button" value="{$resources->getString('text.delete')}" />
    <input id="myProjectWhiteboardSaveBtn" onclick="OS.getWindowInstance(this).getManager().saveWhiteboard()" type="button" value="{$resources->getString('text.save')}" />
  </div>
  
  <div class="myProjectCancelView"> 
    <a href="#" onclick="OS.closeWindow(this)">{$resources->getString('form.cancel')}</a>
  </div>
</div>
