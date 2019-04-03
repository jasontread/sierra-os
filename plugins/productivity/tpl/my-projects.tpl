<div id="myProjectsLookup" class="myProjectsLookup" style="overflow: hidden">

<div id="myProjectsSearchTabs" style="overflow: hidden"></div>

<div id="myProjectsLookupBasic" class="myProjectsLookupBasic" style="overflow: hidden">
  <input id="myProjectsSearch" class="textBoxLarge" onclick="this.select()" />
  <img alt="{$plugins.productivity->resources->getString('MyProjects.search')}" onclick="MyProjects.getManager().search()" src="{$workspace->myTheme->getBaseUri()}icons/16/search.png" title="{$plugins.productivity->resources->getString('MyProjects.search')}" />
</div>


<div id="myProjectsLookupAdv" class="myProjectsLookupAdv" style="overflow: hidden">

<table>

<tr>
  <td><label for="myProjectsSavedSearches">{$plugins.productivity->resources->getString('OsUser.savedSearches')}</label></td>
  <td><select id="myProjectsSavedSearches" class="textBox" onchange="MyProjects.getManager().loadSavedSearch(this.options[this.selectedIndex].value)" size="1"><option></option></select></td>
</tr>

<tr>
  <td><label for="partcipant">{$plugins.productivity->resources->getString('MyProjects.participant')}</label></td>
  <td>
    <select id="partcipant" class="textBox" size="1">
      <option value="{$user->getPrimaryKey()}">{$plugins.productivity->resources->getString('text.me')} ({$user->getName()})</option>
      <option value="NULL">{$plugins.productivity->resources->getString('text.anyone')}</option>
      {foreach from=$user->getAllGroups() key=gid item=group}
      <option value="g{$gid}">{$group->getName()} ({$resources->getString('OsGroup')})</option>
      {/foreach}
      {foreach from=$user->getAllUidsHash('name', $user->_uid) key=uid item=name}
      <option value="{$uid}">{$name}</option>
      {/foreach}
    </select>
  </td>
</tr>

<tr>
  <td><label for="owner">{$plugins.productivity->resources->getString('MyProjects.ownedBy')}</label></td>
  <td>
    <select id="owner" class="textBox" size="1">
      <option value="NULL">{$plugins.productivity->resources->getString('text.anyone')}</option>
      <option value="{$user->getPrimaryKey()}">{$plugins.productivity->resources->getString('text.me')}</option>
      {foreach from=$user->getAllUidsHash('name', $user->_uid) key=uid item=name}
      <option value="{$uid}">{$name}</option>
      {/foreach}
    </select>
  </td>
</tr>

<tr>
  <td><label for="overdue">{$plugins.productivity->resources->getString('MyProjects.scheduleIs')}</label></td>
  <td>
    <select id="overdue" class="textBox" size="1">
      <option value="NULL">{$plugins.productivity->resources->getString('text.any')}</option>
      <option value="1">{$plugins.productivity->resources->getString('text.schedule.overdue')}</option>
      <option value="0">{$plugins.productivity->resources->getString('text.schedule.ontime')}</option>
    </select>
  </td>
</tr>

<tr>
  <td><label for="status">{$plugins.productivity->resources->getString('MyProjects.statusIs')}</label></td>
  <td>
    <select id="status" class="textBox" size="1">
      <option value="active">{$plugins.productivity->resources->getString('text.status.active')}</option>
      <option value="NULL">{$plugins.productivity->resources->getString('text.any')}</option>
      <option value="hold">{$plugins.productivity->resources->getString('text.status.hold')}</option>
      <option value="completed">{$plugins.productivity->resources->getString('text.status.completed')}</option>
      <option value="cancelled">{$plugins.productivity->resources->getString('text.status.cancelled')}</option>
      <option value="error">{$plugins.productivity->resources->getString('text.status.error')}</option>
    </select>
  </td>
</tr>

<tr>
  <td><label for="projectType">{$plugins.productivity->resources->getString('MyProjects.typeIs')}</label></td>
  <td>
    <select id="projectType" class="textBox" size="1">
      <option value="NULL">{$plugins.productivity->resources->getString('text.any')}</option>
      {foreach from=$MyProjectsTemplate->getAppTemplates() key=id item=template}
      <option value="{$id}">{$template->getType()}</option>
      {/foreach}
    </select>
  </td>
</tr>

<tr>
  <td><label for="includeArchived">{$plugins.productivity->resources->getString('MyProjects.includeArchived')}</label></td>
  <td>
    <select id="includeArchived" class="textBox" size="1">
      <option value="0">{$resources->getString('text.no')}</option>
      <option value="1">{$resources->getString('text.yes')}</option>
    </select>
  </td>
</tr>

<tr>
  <td><label for="start">{$plugins.productivity->resources->getString('MyProjects.startedAfter')}</label></td>
  <td>
    <input id="start" class="myProjectsDateChooser" onclick="this.select()" />
    <span id="startChooser"></span>
  </td>
</tr>

<tr>
  <td><label for="end">{$plugins.productivity->resources->getString('MyProjects.endedBefore')}</label></td>
  <td>
    <input id="end" class="myProjectsDateChooser" onclick="this.select()" />
    <span id="endChooser"></span>
  </td>
</tr>

<tr>
  <td><label for="myProjectsKeyword">{$plugins.productivity->resources->getString('MyProjects.keyword')}</label></td>
  <td><input id="myProjectsKeyword" class="textBox" onclick="this.select()" /></td>
</tr>

<tr>
  <td><label for="keyword">{$plugins.productivity->resources->getString('MyProject.projectId')}</label></td>
  <td><input id="projectId" class="textBox" onclick="this.select()" /></td>
</tr>

<tr><td colspan="2" align="right"><img alt="{$plugins.productivity->resources->getString('MyProjects.search')}" onclick="MyProjects.getManager().searchAdv()" src="{$workspace->myTheme->getBaseUri()}icons/16/search.png" title="{$plugins.productivity->resources->getString('MyProjects.search')}" /></td></tr>

</table>
</div>

</div>

<div id="myProjectsCanvas" class="myProjectsCanvas" style="overflow: hidden">
  <div id="myProjectsCanvasTabs" style="overflow: hidden"></div>
  <div id="myProjectsDashboard" class="myProjectsPanel">
    <div id="myProjectsDashboardContent" class="myProjectsPanelContentLeft" style="overflow: auto;">
      <div id="myProjectsDashboardLateContainer" class="myProjectsContainer myProjectsLate">
        <div id="myProjectsDashboardLateToggle" class="myProjectsToggle"></div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.dashboard.lateItems')}</h3>
        <div id="myProjectsDashboardLate"></div>
      </div>
      
      <div class="myProjectsContainer myProjectsUpcoming">
        <div id="myProjectsDashboardUpcomingToggle" class="myProjectsToggle"></div>
        <h3 id="myProjectsDashboardUpcomingHeader">{$plugins.productivity->resources->getString('MyProjects.dashboard.upcomingItems')}</h3>
        <div id="myProjectsDashboardUpcoming"></div>
      </div>
      
      <div class="myProjectsContainer myProjectsLatestActivity">
        <div id="myProjectsDashboardLatestActivityToggle" class="myProjectsToggle"></div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.dashboard.latestActivity')}</h3>
        <div id="myProjectsDashboardLatestActivity"></div>
      </div>
      
    </div>
    <div class="myProjectsPanelContentRight myProjectsCalendar">
      <div id="myProjectsDashboardCalendar1"></div>
      <div id="myProjectsDashboardCalendar2"></div>
      <div id="myProjectsDashboardCalendar3"></div>
    </div>
  </div>
  <div id="myProjectsDiscussion" class="myProjectsPanel">
    <div id="myProjectsDiscussionContent" class="myProjectsPanelContentLeft" style="overflow: auto">
      <div class="myProjectsContainer myProjectsDiscussion"></div>
    </div>
    <div class="myProjectsPanelContentRight">
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.showDiscussionFrom')}</h3>
        <select id="myProjectsDiscussionShowFrom" size="1"><option></option></select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('text.show')}</h3>
        <select id="myProjectsDiscussionShow" size="1">
          <option value="both">{$plugins.productivity->resources->getString('text.bothMessagesAndWhiteboards')}</option>
          <option value="messages">{$plugins.productivity->resources->getString('text.messagesOnly')}</option>
          <option value="whiteboards">{$plugins.productivity->resources->getString('text.whiteboardsOnly')}</option>
        </select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.hideOlderThan')}</h3>
        <select id="myProjectsDiscussionHideOlder" size="1">
          <option value="">{$plugins.productivity->resources->getString('text.noLimit')}</option>
          <option value="1w">1 {$plugins.productivity->resources->getString('text.week')}</option>
          <option value="2w">2 {$plugins.productivity->resources->getString('text.weeks')}</option>
          <option value="1m">1 {$plugins.productivity->resources->getString('text.month')}</option>
          <option value="3m">3 {$plugins.productivity->resources->getString('text.months')}</option>
          <option value="6m">6 {$plugins.productivity->resources->getString('text.months')}</option>
          <option value="1y">1 {$plugins.productivity->resources->getString('text.year')}</option>
        </select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('text.groupBy')}</h3>
        <select id="myProjectsDiscussionGroupBy" onchange="MyProjects.getManager()._renderDiscussionPanel()" size="1">
          <option value="date">{$plugins.productivity->resources->getString('text.date')}</option>
          <option value="project">{$plugins.productivity->resources->getString('MyProject')}</option>
          <option value="type">{$plugins.productivity->resources->getString('MyProject.type')}</option>
        </select>
      </div>
      <div style="text-align: center">
        <input onclick="MyProjects.getManager().refreshDiscussion()" type="button" value="{$resources->getString('text.refresh')}" />
      </div>
    </div>
  </div>
  <div id="myProjectsTasks" class="myProjectsPanel">
    <div id="myProjectsTasksContent" class="myProjectsPanelContentLeft" style="overflow: auto"></div>
    <div class="myProjectsPanelContentRight">
      <div class="myProjectsTasksCalendars myProjectsCalendar">
        <div id="myProjectsTasksCalendar1"></div>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.showTasksFrom')}</h3>
        <select id="myProjectsTasksShowFrom" onchange="MyProjects.getManager().refreshTasksAssignedTo()" size="1"><option></option></select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('text.assignedTo')}</h3>
        <select id="myProjectsTasksAssignedTo" size="1"><option></option></select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.statusIs')}</h3>
        <select id="myProjectsTasksStatus" size="1">
          <option value="NULL">{$plugins.productivity->resources->getString('text.any')}</option>
          <option value="active wait">{$plugins.productivity->resources->getString('text.status.active')}</option>
          <option value="hold">{$plugins.productivity->resources->getString('text.status.hold')}</option>
          <option value="completed">{$plugins.productivity->resources->getString('text.status.completed')}</option>
          <option value="cancelled">{$plugins.productivity->resources->getString('text.status.cancelled')}</option>
          <option value="error">{$plugins.productivity->resources->getString('text.status.error')}</option>
        </select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('text.groupBy')}</h3>
        <select id="myProjectsTasksGroupBy" onchange="MyProjects.getManager()._renderTasksPanel()" size="1">
          <option value="project">{$plugins.productivity->resources->getString('MyProject')}</option>
          <option value="type">{$plugins.productivity->resources->getString('MyProject.type')}</option>
          <option value="status">{$plugins.productivity->resources->getString('text.status')}</option>
        </select>
      </div>
      <div>
        <input id="myProjectsTasksShowLateUpcoming" checked="checked" onclick="MyProjects.getManager()._renderTasksPanel()" type="checkbox" />{$plugins.productivity->resources->getString('MyProjects.showLateUpcomingTasks')}
      </div>
      <div style="text-align: center">
        <input onclick="MyProjects.getManager().refreshTasks()" type="button" value="{$resources->getString('text.refresh')}" />
      </div>
    </div>
  </div>
  <div id="myProjectsFiles" class="myProjectsPanel">
    <div id="myProjectsFilesContent" class="myProjectsPanelContentLeft" style="overflow: auto"></div>
    <div class="myProjectsPanelContentRight">
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.showFilesFrom')}</h3>
        <select id="myProjectsFilesShowFrom" size="1"><option></option></select>
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('MyProjects.search')}</h3>
        <input id="myProjectsFilesSearch" class="textBox" onclick="this.select()" />
      </div>
      <div>
        <h3>{$plugins.productivity->resources->getString('text.groupBy')}</h3>
        <select id="myProjectsFilesGroupBy" onchange="MyProjects.getManager()._renderFilesPanel()" size="1">
          <option value="project">{$plugins.productivity->resources->getString('MyProject')}</option>
          <option value="type">{$plugins.productivity->resources->getString('MyProject.type')}</option>
          <option value="date">{$plugins.productivity->resources->getString('text.date')}</option>
        </select>
      </div>
      <div style="text-align: center">
        <input onclick="MyProjects.getManager().refreshFiles()" type="button" value="{$resources->getString('text.refresh')}" />
      </div>
    </div>
    <div id="myProjectsFilesPopup" class="myProjectsFilesPopup" onmouseover="if (this._timer) {ldelim} clearTimeout(this._timer); this._timer=null; {rdelim}" onmouseout="this._timer=setTimeout('MyProjects.getManager()._divFilesPopup.style.display=\'none\';', 1500)"></div>
  </div>
  
  <div id="myProjectsNoSelection" class="myProjectsPanel">
    <div class="noProjects">
      <img alt="{$plugins.productivity->resources->getString('text.noProjectSelected')}" src="plugins/productivity/icons/64/my-projects.png" /><br />
      {$plugins.productivity->resources->getString('text.noProjectSelected')}
    </div>
  </div>

  <div id="myProjectsCalendarPopup" class="myProjectsCalendarPopup" onmouseout="this._manager.hideCalendarPopup()" onmouseover="this._manager.resetCalendarPopupTimer()"></div>
  
</div>

<div id="myProjectsVertDivider" class="vertDivider"></div>

<span id="selectProjectLabel" class="myProjectsSelector" onclick="this._manager.toggleProjectList()" onmouseout="this._manager.hideProjectList()" onmouseover="this._manager.resetProjectListTimer()"></span>
<div id="myProjectsList" class="myProjectsList" onmouseout="this._manager.hideProjectList()" onmouseover="this._manager.resetProjectListTimer()" style="overflow: hidden; visibility: hidden"></div>

<script type="text/javascript">
{foreach from=$MyProjectsTemplate->getAppTemplates() key=id item=template}
{if $template->_includeNewMenu}
OS.addMenuItemDelayed('productivity', '{$id}', 'newProjects', '{$template->getType(1)}', '{$template->getIcon(16)}', "OS.getFocusedWin().getManager().newProject('{$id}')");
{/if}
{if $template->getHelpTopicLabel() && $template->getPluginForHelpTopic()}
OS.addMenuItemDelayed('productivity', '{$id}_help', 'help', '{$template->getHelpTopicLabel()}', '{$template->getIcon(16)}', "Core_HelpManager.load('{$template->getPluginForHelpTopic()}', '{$template->getHelpTopic()}')");
{/if}
{/foreach}
MyProjects.ICAL_URL = '{$Controller->getRequestUri()}/plugins/productivity/ical/{if $Controller->getAppParams('icalRewrite', 'my-projects')}{ldelim}$id{rdelim}/{else}?id={ldelim}$id{rdelim}{/if}';
MyProjects.ICAL_WEBCAL_URL = 'webcal{if $Controller->isSecure()}s{/if}://{$Controller->getRequestUri(0)}/plugins/productivity/ical/{if $Controller->getAppParams('icalRewrite', 'my-projects')}{ldelim}$id{rdelim}/{else}?id={ldelim}$id{rdelim}{/if}';
MyProjects.RSS_URL = '{$Controller->getRequestUri()}/plugins/productivity/rss/{if $Controller->getAppParams('rssRewrite', 'my-projects')}{ldelim}$id{rdelim}/{else}?id={ldelim}$id{rdelim}{/if}';
MyProjects.RSS_FEED_URL = 'feed{if $Controller->isSecure()}s{/if}://{$Controller->getRequestUri(0)}/plugins/productivity/rss/{if $Controller->getAppParams('rssRewrite', 'my-projects')}{ldelim}$id{rdelim}/{else}?id={ldelim}$id{rdelim}{/if}';
MyProjects.MAX_FILES_ATTACH = {$smarty.const.MY_PROJECTS_MAX_FILES_ATTACH};
</script>