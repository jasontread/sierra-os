<div class="coreWikiSandbox">
  <h1>{$plugins.core->resources->getString('WikiSandbox')}</h1>
  
  {$plugins.core->resources->getString('WikiSandbox.intro')}
  
  <textarea id="coreWikiSandboxInput" cols="" rows=""></textarea>
  
  <div><input onclick="OS.getWindowInstance(this).getManager().preview()" type="button" value="{$plugins.core->resources->getString('WikiSandbox.showPreview')}" /></div>
  
  <span><a href="#" onclick="OS.closeWindow(OS.getWindowInstance(this))">{$resources->getString('form.close')}</a></span>
</div>
