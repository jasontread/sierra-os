  <tr id="phones_{if !$entity->getPrimaryKey()}blank{else}{$entity->getPrimaryKey()}_existingAttr{/if}"{if !$entity->getPrimaryKey()} style="display: none;"{/if}>
    {include file='_contact-form-cardinality-col.tpl'}
    <td class="contactLeftCol contactTableCell">{$entity->renderAttribute('type', 'input')}</td>
    <td class="contactTableCell">{$entity->renderAttribute('number', 'input')}{$entity->renderAttribute('phoneId', 'output')}</td>
  </tr>
