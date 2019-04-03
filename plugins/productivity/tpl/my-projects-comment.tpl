<div class="myProjects myProjectFields myProjectsAddComment">
  <h1 id="myProjectsCommentHeader" class="projectHeader"></h1>
  
  <textarea id="myProjectsComment" cols="" rows=""></textarea>
  
  <div id="myProjectsCommentFiles" class="myProjectsCommentFiles">
{foreach from=$Util->getArray($smarty.const.MY_PROJECTS_MAX_FILES_ATTACH) item=num}
    <div id="myProjectsCommentFile{$num}" style="position: absolute; visibility: hidden;">
      <a href="#" onclick="OS.getWindowInstance(this).getManager().removeFile({$num})"><img alt="{$plugins.productivity->resources->getString('text.removeFile')}" src="plugins/productivity/images/remove.png" title="{$plugins.productivity->resources->getString('text.removeFile')}" /></a>
      <input name="myProjectsCommentFile{$num}" type="file" />
    </div>
{/foreach}
    <div id="myProjectsAddCommentFileDiv">
      <a href="#" onclick="OS.getWindowInstance(this).getManager().addFile()"><img alt="{$plugins.productivity->resources->getString('text.attachFile')}" src="plugins/productivity/icons/16/file.png" title="{$plugins.productivity->resources->getString('text.attachFile')}" /></a>
      <a id="myProjectsAddCommentFileLink" href="#" onclick="OS.getWindowInstance(this).getManager().addFile()">{$plugins.productivity->resources->getString('text.attachFile')}</a>
    </div>
  </div>
  
  <div class="myProjectPopupButtons">
    <input onclick="OS.getWindowInstance(this).getManager().preview()" type="button" value="{$plugins.productivity->resources->getString('text.preview')}" />
    <input onclick="OS.getWindowInstance(this).getManager().save()" type="button" value="{$resources->getString('text.save')}" />
  </div>
  
  <a class="myProjectCancel" href="#" onclick="OS.closeWindow(OS.getWindowInstance(this))">{$resources->getString('text.cancel')}</a>
</div>
