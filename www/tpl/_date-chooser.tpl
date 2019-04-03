{*
  used to render a date chooser field. for more information on available params
  see sierra/www/tpl/model/sra-form-input.tpl (textarea field is not allowed)
  
  usesCi: set this parameter to true (1) to enable sra-view-ci.tpl functionality
*}

{assign var="myParams" value=$Template->getVarByRef('params')}
{assign var="fieldName" value=$params->getParam('fieldName', $fieldName)}
{assign var="fieldNamePre" value=$params->getParam('fieldNamePre', $Template->getVar('fieldNamePre'))}
{assign var="fieldNamePost" value=$params->getParam('fieldNamePost', $Template->getVar('fieldNamePost'))}
{assign var="fieldName" value=$fieldNamePre|cat:$fieldName|cat:$fieldNamePost}
{assign var='id' value=$Util->rand(1000, 1000000)}
{assign var="usesCi" value=$params->getParam('usesCi')}
{$myParams->concat('class', 'dateChooserField', 'input-attrs')}
{$myParams->concat('onfocus', 'this.parentNode.onmouseover();', 'input-attrs')}
{if !$workspace}{$Template->assignByRef('workspace', $user->getActiveWorkspace())}{/if}

<span onmouseover="if (!this._initialized) {ldelim} this._initialized=true; var manager=OS.getWindowInstance(this) &amp;&amp; OS.getWindowInstance(this).getElementById('date{$id}') ? OS.getWindowInstance(this) : document; var field=manager.getElementById('date{$id}'); var chooser=OS.addDateChooser(field, manager.getElementById('date{$id}Chooser'));{if $usesCi} field.updateCiLabel=function() {ldelim} if (this._ciLabel &amp;&amp; this._ciLabel.style.visibility=='inherit') this._ciLabel.innerHTML=this.value; if (this._ciLabel) this._ciLabel.className=null; {rdelim}; chooser.setUpdateFunction('updateCiLabel', field); {/if} {rdelim}" style="white-space:nowrap">
{$Template->renderOpen($tplName, 'input', $myParams, '', 0)} id="date{$id}" onclick="this.select()" name="{$fieldName}"{if $attribute && $myParams->getParam('imbedValue', '1')} value="{$attribute->format($smarty.const.SRAOS_DATE_CHOOSER_FORMAT)}"{/if} />
<span id="date{$id}Chooser"><img alt="{$resources->getString('text.chooseDate')}" src="{$workspace->myTheme->getBaseUri()}datechooser.gif" title="{$resources->getString('text.chooseDate')}" style="cursor: pointer;" /></span>
</span>
