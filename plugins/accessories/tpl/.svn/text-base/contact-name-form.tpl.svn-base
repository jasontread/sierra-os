  <tr id="otherNames_{if !$entity->getPrimaryKey()}blank{else}{$entity->getPrimaryKey()}_existingAttr{/if}"{if !$entity->getPrimaryKey()} style="display: none;"{/if}>
    {include file='_contact-form-cardinality-col.tpl'}
    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$entity->renderAttribute('label', 'input')}</td>
    <td class="contactTableCell">
      <img alt="{$resources->getString('text.show')}" onclick="var div=SRAOS_Util.getDomElements(this.parentNode, {ldelim} 'nodeName': 'div', 'style': null {rdelim}, true, false, 1); var hidden=div.style.visibility=='hidden'; div.style.visibility=hidden ? 'visible' : 'hidden'; div.style.position=hidden ? 'static' : 'absolute'; this.alt=hidden ? '{$resources->getString('text.hide')}' : '{$resources->getString('text.view')}'; this.title=hidden ? '{$resources->getString('text.hide')}' : '{$resources->getString('text.view')}'; this.src='{$workspace->myTheme->getBaseUri()}' + (hidden ? 'less' : 'more') + '.gif';" src="{$workspace->myTheme->getBaseUri()}more.gif" title="{$resources->getString('text.show')}" />
      <span>{$entity->render('fields')}</span>
    </td>
  </tr>
