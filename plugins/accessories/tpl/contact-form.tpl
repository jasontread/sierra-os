{$Template->assignByRef('contact', $entity)}
{$Template->assign('inputCiFieldClass', 'myContactCardField')}
<table id="contactTable" class="myContactsTable">
  <tbody>
    <tr>
      <td class="contactLeftCol contactTableCell" colspan="2" style="vertical-align: top">{$contact->renderAttribute('picture', 'input')}</td>
      <td class="contactTableCell"><span id="contact{$entity->getContactId()}_name_view">{$contact->render('input-name')}</span></td>
    </tr>
  </tbody>
  
{if $user->displayContactField('otherNames')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="otherNames_body">
    {$contact->renderAttribute('otherNames', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactNameVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('phones')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="phones_body">
    {$contact->renderAttribute('phones', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactPhoneVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('emails')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="emails_body">
    {$contact->renderAttribute('emails', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactEmailVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('urls')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="urls_body">
    {$contact->renderAttribute('urls', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactUrlVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('dates')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="dates_body">
    {$contact->renderAttribute('dates', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactDateVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('relations')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="relations_body">
    {$contact->renderAttribute('relations', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactRelationVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('imIds')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="imIds_body">
    {$contact->renderAttribute('imIds', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactImIdVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if $user->displayContactField('addresses')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody id="addresses_body">
    {$contact->renderAttribute('addresses', 'input')}
    {assign var='obj' value=$Template->getClassInstance('ContactAddressVO', $contact->getContactIdInitArray())}
    {$obj->render('input')}
  </tbody>
{/if}

{if !$cexcludeGroups && $user->displayContactField('groups')}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody>
    <tr>
      <td class="contactLeftCol contactTableCell" colspan="2" style="vertical-align: top">{$contact->getGroupsLabel()}</td>
      <td class="contactTableCell">{$contact->renderAttribute('groups', 'input')}</td>
    </tr>
  </tbody>
{/if}

{if $nonBaseFields}
  <tr><td class="contactTableSpacer" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody>
{foreach from=$nonBaseFields item=field}
    <tr>
      <td class="contactLeftCol contactTableCell" colspan="2" style="vertical-align: top">{$contact->getEntityLabel($field)}</td>
      <td class="contactTableCell">{$contact->renderAttribute($field, 'input')}</td>
    </tr>
{/foreach}
  </tbody>
{/if}
  
  <tr><td class="contactTableSpacerNote" colspan="3"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody>
    <tr>
      <td class="contactLeftCol contactTableCell contactTableNoteCell" colspan="2" style="vertical-align: top">{$contact->getNoteLabel()}</td>
      <td class="contactTableCell contactTableNoteCell">{$contact->renderAttribute('note', 'input')}</td>
    </tr>
  </tbody>
</table>
<div id="contactRemove"></div>
{$contact->renderAttribute('imbedded', 'output')}
{$Template->assign('inputCiFieldClass', 0)}
