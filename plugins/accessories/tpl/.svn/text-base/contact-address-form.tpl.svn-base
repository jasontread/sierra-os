  <tr id="addresses_{if !$entity->getPrimaryKey()}blank{else}{$entity->getPrimaryKey()}_existingAttr{/if}"{if !$entity->getPrimaryKey()} style="display: none;"{/if}>
    {include file='_contact-form-cardinality-col.tpl'}
    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$entity->renderAttribute('type', 'input')}</td>
    <td class="contactTableCell"><div>{$entity->render('form')}</div>{$entity->renderAttribute('addressId', 'output')}</td>
  </tr>
