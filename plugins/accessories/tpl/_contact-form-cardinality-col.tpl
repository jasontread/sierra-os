    <td class="contactCardinalityCol">
      <img alt="{$resources->getString('form.remove')}" onclick="MyContacts._currentInstance.removeAttribute(this{if $entity->getPrimaryKey()}, {$entity->getPrimaryKey()}{/if})" src="plugins/accessories/images/remove.png" title="{$resources->getString('form.remove')}" />
      <img alt="{$resources->getString('form.add')}" onclick="MyContacts._currentInstance.addAttribute(this)" src="plugins/accessories/images/add.png" title="{$resources->getString('form.add')}" />
    </td>
