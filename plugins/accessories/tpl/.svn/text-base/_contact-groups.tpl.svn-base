    <td class="contactLeftCol contactTableCell" style="vertical-align: top">{$attributeLabel}</td>
    <td class="contactTableCell">
{foreach from=$addressBook->getMemberGroups($contact->getContactId()) item=group}
      <a href="#" onclick="if (MyContacts._currentInstance) {ldelim} MyContacts._currentInstance.loadGroup({$group->getGroupId()}); {rdelim}">{$group->getName()}</a><br />
{/foreach}
    </td>
