{$Template->assignByRef('preferences', $user->getMyContactsPreferences())}
{$Template->assignByRef('contact', $entity)}
{$Template->assignByRef('addressBook', $user->getAddressBook())}
<table class="myContactsTable">
  <tr>
    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$contact->renderAttribute('picture', 'outputView')}</td>
    <td class="contactTableCell">
      {if $contact->isCompany()}<font class="contactLabel">{$contact->getContactLabel()}</font><br />{/if}
      {if $contact->getFirst() || $contact->getLast()}{if !$contact->isCompany()}<font class="contactLabel">{/if}{if $user->displayContactField('prefix') && $contact->getPrefix()}{$contact->getPrefix()} {/if}{if $contact->isCompany()}{$contact->getFullName()}{else}{$contact->getContactLabel()}{/if}{if $user->displayContactField('suffix') && $contact->getSuffix()} {$contact->getSuffix()}{/if}{if !$contact->isCompany()}</font>{/if}{if $user->displayContactField('maiden') && $contact->getMaiden()} ({$contact->getMaiden()}){/if}<br />{/if}
      {if $user->displayContactField('phonetic') && $contact->getPhoneticFirst() && $contact->getPhoneticLast()}{$contact->getPhoneticFullName()}<br />{/if}
      {if $user->displayContactField('nickname') && $contact->getNickName()}"{if !$contact->isCompany()}<strong>{/if}{$contact->getNickName()}{if !$contact->isCompany()}</strong>{/if}"<br />{/if}
      {if $user->displayContactField('gender') && ($contact->getFirst() || $contact->getLast()) && $contact->getGender()}{$contact->renderAttribute('gender', 'output')}<br />{/if}
      {if ($user->displayContactField('jobTitle') || $user->displayContactField('department')) && ($contact->getJobTitle() || $contact->getDepartment())}{if $user->displayContactField('jobTitle') && $contact->getJobTitle()}{$contact->getJobTitle()}{/if}{if $user->displayContactField('jobTitle') && $user->displayContactField('department') && $contact->getJobTitle() && $contact->getDepartment()} - {/if}{if $user->displayContactField('department') && $contact->getDepartment()}{$contact->getDepartment()}{/if}<br />{/if}
      {if !$contact->isCompany() && $contact->getCompanyName()}{$contact->getCompanyName()}{/if}
    </td>
  </tr>

{if $user->displayContactField('otherNames') && $contact->getOtherNames()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getOtherNames() item=name}
  <tr>
    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$name->getLabel()}</td>
    <td class="contactTableCell">
      <img alt="{$resources->getString('text.show')}" onclick="var div=document.getElementById('contact{$contact->getContactId()}_name{$name->getNameId()}'); var hidden=div.style.visibility=='hidden'; div.style.visibility=hidden ? 'inherit' : 'hidden'; div.style.position=hidden ? 'static' : 'absolute'; this.alt=hidden ? '{$resources->getString('text.hide')}' : '{$resources->getString('text.view')}'; this.title=hidden ? '{$resources->getString('text.hide')}' : '{$resources->getString('text.view')}'; this.src='{$workspace->myTheme->getBaseUri()}' + (hidden ? 'less' : 'more') + '.gif';" src="{$workspace->myTheme->getBaseUri()}more.gif" title="{$resources->getString('text.show')}" />
      <strong>{if !$name->isCompany() && !$name->isOccupation() && $user->displayContactField('prefix') && $name->getPrefix()}{$name->getPrefix()} {/if}{$name->getNameLabel()}{if !$name->isCompany() && !$name->isOccupation() && $user->displayContactField('suffix') && $name->getSuffix()} {$name->getSuffix()}{/if}</strong>{if !$name->isCompany() && !$name->isOccupation() && $user->displayContactField('maiden') && $name->getMaiden()} ({$name->getMaiden()}){/if} 
      <div id="contact{$contact->getContactId()}_name{$name->getNameId()}" style="position: absolute; visibility: hidden">
{if !$name->isOccupation()}
      {if $user->displayContactField('phonetic') && $name->getPhoneticFirst() && $name->getPhoneticLast()}{$name->getPhoneticFullName()}<br />{/if}
      {if ($name->isCompany() || $name->isOccupation()) && ($name->getFirst() || $name->getLast())}{if $user->displayContactField('prefix') && $name->getPrefix()}{$name->getPrefix()} {/if}{$name->getFullName()}{if $user->displayContactField('suffix') && $name->getSuffix()} {$name->getSuffix()}{/if}{if $user->displayContactField('maiden') && $name->getMaiden()} ({$name->getMaiden()}){/if}<br />{/if}
      {if $user->displayContactField('nickname') && $name->getNickName()}"{if !$name->isCompany()}<strong>{/if}{$name->getNickName()}{if !$name->isCompany()}</strong>{/if}"<br />{/if}
{/if}
      {if ($user->displayContactField('jobTitle') || $user->displayContactField('department')) && ($name->getJobTitle() || $name->getDepartment())}{if $user->displayContactField('jobTitle') && $name->getJobTitle()}{$name->getJobTitle()}{/if}{if $user->displayContactField('jobTitle') && $user->displayContactField('department') && $name->getJobTitle() && $name->getDepartment()} - {/if}{if $user->displayContactField('department') && $name->getDepartment()}{$name->getDepartment()}{/if}<br />{/if}
      {if !$name->isOccupation() && !$name->isCompany() && $name->getCompanyName()}{$name->getCompanyName()}<br />{/if}
      {if $name->getDateStart() || $name->getDateEnd()}{if $name->getDateStart()}{$name->getDateStart(0, 1)}{/if}{if $name->getDateStart() && $name->getDateEnd()} - {/if}{if $name->getDateEnd()}{$name->getDateEnd(0, 1)}{/if}<br />{/if}
      {if $name->getNameNote()}
      <div class="nameNote">
        <strong>{$name->getNameNoteLabel()}:</strong><br />
        {$Template->lineBreaksToBr($name->getNameNote())}
      </div>
      {/if}
      </div>
    </td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('phones') && $contact->getPhones()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getPhones() item=phone}
  <tr>
    <td class="contactLeftCol contactTableCell">{$phone->getType(0, 1)}</td>
    <td class="contactTableCell">{if $preferences->isFormatPhoneNumbers()}{$phone->getFormattedNumber()}{else}{$phone->getNumber()}{/if}</td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('emails') && $contact->getEmails()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getEmails() item=email}
  <tr>
    <td class="contactLeftCol contactTableCell">{$email->getType(0, 1)}</td>
    <td class="contactTableCell"><a href="mailto:{$email->getEmail()}">{$email->getEmail()}</a></td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('urls') && $contact->getUrls()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getUrls() item=url}
  <tr>
    <td class="contactLeftCol contactTableCell">{$url->getType(0, 1)}</td>
    <td class="contactTableCell"><a href="{$url->getUrl()}" target="_blank">{$url->getUrl()}</a></td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('dates') && $contact->getDates()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getDates() item=cdate}
  <tr>
    <td class="contactLeftCol contactTableCell">{$cdate->getType(0, 1)}</td>
    <td class="contactTableCell">{$cdate->getDate(0, 1)}{if $cdate->getLocation()} ({$cdate->getLocation()}){/if}</td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('relations') && $contact->getRelations()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getAllRelations() item=relation}
  <tr>
    <td class="contactLeftCol contactTableCell">{$relation->getType(0, 1)}</td>
    <td class="contactTableCell">{if $relation->canViewTarget()}<a href="#" onclick="if (MyContacts._currentInstance) {ldelim} MyContacts._currentInstance.loadContact({$relation->getTarget()}); {rdelim}">{/if}{$relation->getTargetName()}{if $relation->canViewTarget()}</a>{/if}{if $relation->getDateStart() || $relation->getDateEnd()} ({if $relation->getDateStart()}{$relation->getDateStart(0, 1)}{/if}{if $relation->getDateStart() && $relation->getDateEnd()} - {/if}{if $relation->getDateEnd()}{$relation->getDateEnd(0, 1)}{/if}){/if}</td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('imIds') && $contact->getImIds()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getImIds() item=im}
  <tr>
    <td class="contactLeftCol contactTableCell">{$im->getType(0, 1)}</td>
    <td class="contactTableCell">{$im->getId()}{if $im->getProtocolName()} ({$im->getProtocolName()}){/if}</td>
  </tr>
{/foreach}
{/if}

{if $user->displayContactField('addresses') && $contact->getAddresses()}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
{foreach from=$contact->getAddresses() item=address}
  <tr>
    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$address->getType(0, 1)}</td>
    <td class="contactTableCell">{$address->render('output')}</td>
  </tr>
{/foreach}
{/if}

{if !$cexcludeGroups && $user->displayContactField('groups')}
{if $addressBook->getMemberGroups($contact->getContactId())}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tr>{$contact->renderAttribute('groups', 'output')}</tr>
{/if}
{/if}

{if $nonBaseFields}
  <tr><td class="contactTableSpacer" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tbody>
{foreach from=$nonBaseFields item=field}
    <tr>
      <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$contact->getEntityLabel($field)}</td>
      <td class="contactTableCell">{$contact->renderAttribute($field, 'output')}</td>
    </tr>
{/foreach}
  </tbody>
{/if}

  <tr><td class="contactTableSpacerNote" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tr>
    <td class="contactLeftCol contactTableCell contactTableNoteCell" style="vertical-align: top">{$contact->getNoteLabel()|lower}</td>
    <td class="contactTableCell contactTableNoteCell">{if $contact->getNote()}{$contact->getNoteHtml()}{else}&nbsp;{/if}</td>
  </tr>
  
  <tr><td class="contactTableSpacerUpdated" colspan="2"><img alt="" src="./images/pixel.gif" /></td></tr>
  <tr><td class="contactLeftCol contactTableCell" colspan="2">{$contact->getLastUpdatedLabel()}: {$contact->getLastUpdated(0, 1)}</td></tr>
</table>


