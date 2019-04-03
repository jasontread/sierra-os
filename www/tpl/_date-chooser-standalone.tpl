{*
  use to imbed a stand alone date chooser field. this template allows the 
  following template variables to be set:
  
    dateChooserFieldName:  the name of the date field
    dateChooserValue:      an SRA_GregorianDate object representing the initial 
                           value to imbed
*}

{assign var='id' value=$Util->rand(1000, 1000000)}
{if !$workspace}{$Template->assignByRef('workspace', $user->getActiveWorkspace())}{/if}

<span onmouseover="if (!this._initialized) {ldelim} this._initialized=true; var manager=OS.getWindowInstance(this) &amp;&amp; OS.getWindowInstance(this).getElementById('date{$id}') ? OS.getWindowInstance(this) : document; var field=manager.getElementById('date{$id}'); var chooser=OS.addDateChooser(field, manager.getElementById('date{$id}Chooser')); {rdelim}">
<input class="dateChooserField" id="date{$id}" onclick="this.select()" onfocus="this.parentNode.onmouseover()"{if $dateChooserFieldName} name="{$dateChooserFieldName}"{/if}{if $dateChooserValue} value="{$dateChooserValue->format($smarty.const.SRAOS_DATE_CHOOSER_FORMAT)}"{/if} />
<span id="date{$id}Chooser"><img alt="{$resources->getString('text.chooseDate')}" src="{$workspace->myTheme->getBaseUri()}datechooser.gif" title="{$resources->getString('text.chooseDate')}" style="cursor: pointer;" /></span>
</span>
