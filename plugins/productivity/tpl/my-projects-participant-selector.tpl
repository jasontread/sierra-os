<div class="myProjects">
  
  <h3 id="myProjectsParticipantSelectorHeader"></h3>
  <div id="myProjectsParticipantSelector" class="myProjectFields"></div>
  
  <div class="myProjectPopupButtons">
    <input onclick="OS.closeWindow(this)" type="button" value="{$resources->getString('form.cancel')}" />
    <input onclick="OS.getWindowInstance(this).getManager().selectParticipants()" type="button" value="{$plugins.productivity->resources->getString('MyProjects.participantSelector.select')}" />
  </div>
  
</div>
