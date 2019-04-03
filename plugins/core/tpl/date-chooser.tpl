<div class="core_DateChooser">
  <div id="coreDateChooserLabel" class="core_DateChooserLabel">{$plugins.core->resources->getString('DateChooser.prompt')}</div>
  {$Template->assign('dateChooserFieldName', 'dateChooserDate')}
  <div class="core_DateChooserField">{include file='_date-chooser-standalone.tpl'}</div>
  <div class="core_DateChooserButtons">
    <input id="coreDateChooserCancelBtn" onclick="OS.closeWindow(this)" type="button" value="{$resources->getString('form.cancel')}" />
    <input onclick="OS.getWindowInstance(this).getManager().save()" type="button" value="{$resources->getString('text.ok')}" />
  </div>
</div>
