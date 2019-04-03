{if $entity->isCompany() || $entity->isOccupation()}{assign var='isCompany' value=1}{else}{assign var='isCompany' value=0}{/if}
{$Template->assign('inputCiStyle', 'font-weight:bold;')}{if !$isCompany && $user->displayContactField('prefix')}{$entity->renderAttribute('prefix', 'input')}{/if}{if $isCompany}{$entity->renderAttribute('companyName', 'input')}{else}{if $user->getAttribute('myContactsPreferences_nameFormat') eq 'last_first'}{$entity->renderAttribute('last', 'input')},{$entity->renderAttribute('first', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('middle', 'input')}{/if}{else}{$entity->renderAttribute('first', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('middle', 'input')}{/if}{$entity->renderAttribute('last', 'input')}{/if}{/if}{if !$isCompany && $user->displayContactField('suffix')}{$entity->renderAttribute('suffix', 'input')}{/if}{$Template->assign('inputCiStyle', 0)}{if !$isCompany && $user->displayContactField('maiden')}({$entity->renderAttribute('maiden', 'input')}){/if} 
<div style="position: absolute; visibility: hidden">
{if !$entity->isOccupation()}
{if $isCompany}{if $user->displayContactField('prefix')}{$entity->renderAttribute('prefix', 'input')}{/if}{if $user->getAttribute('myContactsPreferences_nameFormat') eq 'last_first'}{$entity->renderAttribute('last', 'input')}, {$entity->renderAttribute('first', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('middle', 'input')}{/if}{else}{$entity->renderAttribute('first', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('middle', 'input')}{/if}{$entity->renderAttribute('last', 'input')}{/if}{if $user->displayContactField('suffix')}{$entity->renderAttribute('suffix', 'input')}{/if}{if $user->displayContactField('maiden')}({$entity->renderAttribute('maiden', 'input')}){/if}<br />{/if}
{if $user->displayContactField('phonetic')}{if $user->getAttribute('myContactsPreferences_nameFormat') eq 'last_first'}{$entity->renderAttribute('phoneticLast', 'input')}, {$entity->renderAttribute('phoneticFirst', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('phoneticMiddle', 'input')}{/if}{else}{$entity->renderAttribute('phoneticFirst', 'input')}{if $user->displayContactField('middle')}{$entity->renderAttribute('phoneticMiddle', 'input')}{/if}{$entity->renderAttribute('phoneticLast', 'input')}{/if}<br />{/if}
{if $user->displayContactField('nickname')}"{$entity->renderAttribute('nickname', 'input')}"<br />{/if}
{/if}
{if $user->displayContactField('jobTitle') || $user->displayContactField('department')}{if $user->displayContactField('jobTitle')}{$entity->renderAttribute('jobTitle', 'input')}{/if}{if $user->displayContactField('jobTitle') && $user->displayContactField('department')} - {/if}{if $user->displayContactField('department')}{$entity->renderAttribute('department', 'input')}{/if}<br />{/if}
{if !$isCompany}{$entity->renderAttribute('companyName', 'input')}<br />{/if}
{if $entity->isOccupation()}
{$entity->renderAttribute('dateStart', 'input')} - {$entity->renderAttribute('dateEnd', 'input')}<br />
{/if}
{$entity->renderAttribute('company', 'input')}<br />
{$entity->renderAttribute('occupation', 'input')}<br />
<div class="nameNote">
  <strong>{$entity->getEntityResourcesString('ContactName.nameNote')}:</strong><br />
  {$entity->renderAttribute('nameNote', 'input')}
</div>
</div>
{$entity->renderAttribute('nameId', 'output')}
