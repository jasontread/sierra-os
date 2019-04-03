<div class="coreFileUploadFields">
{foreach from=$Util->getArray($smarty.const.CORE_BROWSER_MAX_UPLOAD_FILES) item=num}
<div id="uploadFile{$num}" class="coreFileUploadDiv{cycle name="coreUploadFileCycle" values=",Alt"}"{if $num eq 1} style="visibility: inherit"{/if}>
<span id="uploadFile{$num}LabelSpan">{$plugins.core->resources->getString('CoreFile')} {$num} </span><span id="uploadFile{$num}FieldSpan">{if $num eq 1}<input id="coreFileData{$num}" name="coreFileData{$num}" type="file" />{/if}</span>
<span id="uploadFile{$num}AddSpan"{if $num eq $smarty.const.CORE_BROWSER_MAX_UPLOAD_FILES} style="position: absolute; visibility: hidden"{/if}>{if $num eq 1}<img onclick="OS.getWindowInstance(this).getManager().addField()" src="{$workspace->myTheme->getBaseUri()}more.gif" />{/if}</span>
{if $num > 1}<span id="uploadFile{$num}RemoveSpan">{if $num eq 2}<img onclick="OS.getWindowInstance(this).getManager().removeField()" src="{$workspace->myTheme->getBaseUri()}less.gif" />{/if}</span>{/if}
</div>
{/foreach}
</div>
<div class="coreFileUploadButtons">
<input type="button" value="{$resources->getString('form.upload')}" onclick="OS.getWindowInstance(this).getManager().submit()" />
<input type="button" value="{$resources->getString('form.cancel')}" onclick="OS.closeWindow(this)" />
</div>
