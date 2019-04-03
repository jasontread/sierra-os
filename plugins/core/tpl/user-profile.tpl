{assign var="coreResources" value=$resources->getBundle('etc/plugins/core/etc/l10n/core')}
<table class="coreProfile">
<tr>
  <td class="coreProfilePicture">
    <img alt="{$entity->getName()}" src="{$entity->getThumbnailUri()}" title="{$entity->getName()}" />
  </td>
  <td>
    <div class="coreProfileName">{$entity->getName()}</div>
    <div class="coreProfileActions"></div>
  </td>
</tr>
<tr>
  <td class="coreProfileLabel">{$resources->getString('OsUser.userName')}</td>
  <td>{$entity->getUserName()}</td>
</tr>
{if $entity->getEmail()}
<tr>
  <td class="coreProfileLabel">{$resources->getString('OsUser.email')}</td>
  <td>{$entity->getEmail()}</td>
</tr>
{/if}
</table>
