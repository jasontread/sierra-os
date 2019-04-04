<div class="myProjects">
  
  <div id="myProjectsTasksPreview" class="myProjectsTasksPreview">
    <h1 id="myProjectsTasksPreviewHeader"></h1>
    <table>
      <tr><th colspan="4">{$plugins.productivity->resources->getString('MyProjects.task.headerGeneral')}</th></tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('MyProject')}</th>
        <th>{$plugins.productivity->resources->getString('MyProjectTask.title')}</th>
        <th>{$plugins.productivity->resources->getString('MyProjects.task.headerStatus')}</th>
        <th>{$plugins.productivity->resources->getString('text.assignedTo')}</th>
      </tr>
      <tr>
        <td id="myProjectsTasksPreviewProject"></td>
        <td id="myProjectsTasksPreviewTitle"></td>
        <td id="myProjectsTasksPreviewStatus"></td>
        <td id="myProjectsTasksPreviewChangeRestriction"></td>
      </tr>
    </table>
    
    <table>
      <tr><th colspan="3">{$plugins.productivity->resources->getString('MyProjects.task.headerSchedule')}</th></tr>
      <tr>
        <th>{$plugins.productivity->resources->getString('MyProjects.task.headerDates')}</th>
        <th>{$plugins.productivity->resources->getString('MyProjects.task.headerDuration')}</th>
        <th>{$plugins.productivity->resources->getString('MyProjects.task.headerPercentComplete')}</th>
      </tr>
      <tr>
        <td id="myProjectsTasksPreviewDates"></td>
        <td id="myProjectsTasksPreviewDuration"></td>
        <td class="myProjectsTasksPreviewPercentComplete">
          <span id="myProjectsTasksPreviewPercentCompleteLabel"></span>
          <img id="myProjectsTasksPreviewPercentCompleteLeft" alt="" src="./images/pixel.gif" title="" /><img id="myProjectsTasksPreviewPercentCompleteRight" alt="" src="./images/pixel.gif" title="" />
        </td>
      </tr>
    </table>
    
    <table>
      <tr><th>{$plugins.productivity->resources->getString('MyProjects.task.headerDescription')}</th></tr>
      <tr><td id="myProjectsTasksPreviewDescription"></td></tr>
    </table>
  </div>
  
  <div id="myProjectsEditTask" style="display: none">
    <div id="viewTaskTabs" style="overflow: hidden"></div>
    
    <div id="viewTaskTabGeneral" class="hiddenContainerView">
      <div id="myProjectTaskMsg" class="errorFont" style="display: none; margin-top: 10px;"></div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.title')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.titleHelp')}</span>
      <div class="myProjectFields">
        <label for="myProjectFieldTaskTitle">{$plugins.productivity->resources->getString('MyProjectTask.title')}:</label>
        <input id="myProjectFieldTaskTitle" class="textBox" name="title" onclick="this.select()" />
      </div>
      
      <div id="myProjectsProjectStatus">
        <h3>{$plugins.productivity->resources->getString('MyProjects.task.status')}</h3>
        <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.statusHelp')}</span>
        <div class="myProjectFields">
          <label for="myProjectFieldTaskStatus">{$plugins.productivity->resources->getString('MyProject.status')}:</label>
          <select id="myProjectFieldTaskStatus" name="status" size="1">
            <option value="active">{$plugins.productivity->resources->getString('text.status.active')}</option>
            <option value="completed">{$plugins.productivity->resources->getString('text.status.completed')}</option>
            <option value="cancelled">{$plugins.productivity->resources->getString('text.status.cancelled')}</option>
            <option value="hold">{$plugins.productivity->resources->getString('text.status.hold')}</option>
          </select>
          <span id="myProjectLabelTaskStatus" style="display: none; font-weight: bold"></span>
        </div>
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.changeRestriction')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.changeRestrictionHelp')}</span>
      <div class="myProjectFields">
        <span id="myProjectTaskChangeRestriction" style="margin-right: 10px"><strong>{$user->getName()}</strong><br /></span>
        <a id="myProjectTaskChangeRestrictionLink" href="#" onclick="OS.getWindowInstance(this).getManager().selectChangeRestriction()">{$resources->getString('form.select')}</a>
        <div><input id="myProjectFieldTaskReadOnly" name="readOnly" type="checkbox" value="1" /> {$plugins.productivity->resources->getString('MyProjects.task.readOnly')} <font class="lightFont">({$plugins.productivity->resources->getString('MyProjects.task.readOnlyExpl')})</font></div>
        <div id="myProjectsTaskNotify"><input id="myProjectFieldTaskNotify" checked="checked" name="notify" type="checkbox" value="1" /> {$plugins.productivity->resources->getString('MyProjects.task.notify')}</div>
      </div>
    </div>
    
    <div id="viewTaskTabSchedule" class="hiddenContainerView">
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.dates')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.datesHelp')}</span>
      <div class="myProjectFields">
        <label for="myProjectFieldTaskStartDate">{$plugins.productivity->resources->getString('MyProjectTask.startDate')}:</label>
        <input id="myProjectFieldTaskStartDate" class="myProjectsDateChooser" name="startDate" onclick="this.select()" />
        <span id="taskStartDateChooser"></span>
        &nbsp;&nbsp; - &nbsp;&nbsp;
        <label for="myProjectFieldTaskDueDate">{$plugins.productivity->resources->getString('text.dueDate')}:</label>
        <input id="myProjectFieldTaskDueDate" class="myProjectsDateChooser" name="dueDate" onclick="this.select()" />
        <span id="taskDueDateChooser"></span>
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.duration')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.durationHelp')}</span>
      <div class="myProjectFields">
        <label for="myProjectFieldTaskDurationPlanned">{$plugins.productivity->resources->getString('MyProjectTask.durationPlanned')}:</label>
        <input id="myProjectFieldTaskDurationPlanned" class="textBoxSmall" name="durationPlanned" onclick="this.select()" />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label for="myProjectFieldTaskDurationActual">{$plugins.productivity->resources->getString('MyProjectTask.durationActual')}:</label>
        <input id="myProjectFieldTaskDurationActual" class="textBoxSmall" name="durationPlanned" onclick="this.select()" />
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.percentComplete')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.percentCompleteHelp')}</span>
      <div class="myProjectFields">
        <label for="myProjectFieldTaskPercentComplete">{$plugins.productivity->resources->getString('MyProjectTask.percentComplete')}:</label>
        <select id="myProjectFieldTaskPercentComplete" name="percentComplete"><option></option></select>%
      </div>
    </div>
    
    <div id="viewTaskTabAssociations" class="hiddenContainerView">
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.project')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.projectHelp')}</span>
      <div class="myProjectFields">
        <label for="myProjectFieldTaskProject">{$plugins.productivity->resources->getString('MyProject')}:</label>
        <select id="myProjectFieldTaskProject" name="projectId" onchange="OS.getWindowInstance(this).getManager().updateProjectId()"><option>{$plugins.productivity->resources->getString('MyProjects.loadingProjects')}</option></select>
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.task')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.taskHelp')}</span>
      <div class="myProjectFields myProjectsProjectTaskSelectors">
        <div>
          <label for="myProjectFieldTaskParent">{$plugins.productivity->resources->getString('MyProjects.task.parent')}:</label>
          <select id="myProjectFieldTaskParent" name="parent"><option>{$plugins.productivity->resources->getString('MyProjects.loadingTasks')}</option></select>
        </div>
        <div>
          <label for="myProjectFieldTaskPredecessor">{$plugins.productivity->resources->getString('MyProjects.task.predecessor')}:</label>
          <select id="myProjectFieldTaskPredecessor" name="predecessor"><option>{$plugins.productivity->resources->getString('MyProjects.loadingTasks')}</option></select>
        </div>
      </div>
      
      <div id="myProjectTaskLinksDiv">
        <h3>{$plugins.productivity->resources->getString('MyProjects.task.objects')}</h3>
        <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.objectsHelp')}</span>
        <div id="myProjectsTaskObjectLinks" class="myProjectFields"></div>
      </div>
    </div>
    
    <div id="viewTaskTabAdvanced" class="hiddenContainerView">
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.description')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.descriptionHelp')}</span>
      <div class="myProjectFields">
        <textarea id="myProjectFieldTaskDescription" class="textArea" name="description" cols="" rows=""></textarea>
        <div style="text-align: center">
          <a onclick="OS.getWindowInstance(this).getManager().preview()" style="cursor: pointer">{$plugins.productivity->resources->getString('MyProjects.task.descriptionPreview')}</a> | 
          <a onclick="Core_Services.displayWikiHelp()" style="cursor: pointer">{$plugins.productivity->resources->getString('MyProjects.task.descriptionWikiHelp')}</a>
        </div>
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.disabled')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.disabledHelp')}</span>
      <div class="myProjectFields">
        <input id="myProjectFieldTaskDisabled" name="disabled" type="checkbox" value="1" /> {$plugins.productivity->resources->getString('MyProjectTask.disabled')}
      </div>
      
      <h3>{$plugins.productivity->resources->getString('MyProjects.task.list')}</h3>
      <span class="helpText">{$plugins.productivity->resources->getString('MyProjects.task.listHelp')}</span>
      <div class="myProjectFields">
        <input id="myProjectFieldTaskList" name="list" type="checkbox" value="1" /> {$plugins.productivity->resources->getString('MyProjectTask.list')}
      </div>
    </div>
  </div>
  
  <div id="viewTaskButtons" class="myProjectButtons">
    <input id="myProjectTaskDeleteBtn" onclick="OS.getWindowInstance(this).getManager().deleteTask()" style="display: none" type="button" value="{$resources->getString('text.delete')}" />
    <input id="myProjectTaskSaveBtn" onclick="OS.getWindowInstance(this).getManager().saveTask()" style="display: none" type="button" value="{$resources->getString('text.save')}" />
  </div>
  
  <div class="myProjectCancelView">
    <span id="myProjectsTaskFormLink" class="myProjectsTaskFormLink"><a id="myProjectsTaskFormLinkA" href="#" onclick="OS.getWindowInstance(this).getManager().showForm()">{$plugins.productivity->resources->getString('MyProjects.task.showForm')}</a></span>
    <a id="myProjectTaskEditLink" href="#" onclick="OS.getWindowInstance(this).getManager().toggleEditMode()" style="display: none">{$resources->getString('text.edit')}</a>
    <a id="myProjectTaskCancelLink" href="#" onclick="OS.getWindowInstance(this).getManager().cancel()">{$resources->getString('form.close')}</a>
  </div>
</div>
