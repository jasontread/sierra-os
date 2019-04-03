{assign var=productivityResources value=$resources->getBundle('etc/plugins/productivity/l10n/productivity')}

<h3>{$productivityResources->getString('MyProject.projectId')}</h3>
<div class="myProjectFields">{$project->getProjectId()}</div>

<h3>{$productivityResources->getString('MyProject.name')}</h3>
<div class="myProjectFields">{$project->getName()}</div>

{if $project->getType()}
<h3>{$productivityResources->getString('MyProject.type')}</h3>
<div class="myProjectFields">{$project->getType()}</div>
{/if}

<h3>{$productivityResources->getString('MyProject.archived')}</h3>
<div class="myProjectFields">{$project->renderAttribute('archived', 'view')}</div>

<h3>{$productivityResources->getString('text.status')}</h3>
<div class="myProjectFields">{$project->renderAttribute('status', 'view')}</div>

{if $project->verifyPermissions($smarty.const.MY_PROJECT_PERMISSIONS_ADMIN)}
<h3>{$productivityResources->getString('MyProjects.currentParticipants')}</h3>
<div class="myProjectFields">
  <strong>{$project->getCreatorName()}</strong>: {$productivityResources->getString('text.permissions.projectAdmin')}<br />
{foreach from=$project->getParticipants() item=participant}
  <strong>{$participant->getLabel()}</strong>: {$participant->getPermissionsDescription()}<br />
{/foreach}
{foreach from=$project->getEmailParticipants() item=participant}
  <strong>{$participant->getLabel()}</strong>: {$participant->getPermissionsDescription()}<br />
{/foreach}
</div>
{/if}

<h3>{$productivityResources->getString('MyProjects.projectSummary')}</h3>
<div class="myProjectFields">{if $project->getSummary()}{$project->getSummaryHtml()}{else}{$resources->getString('text.none')}{/if}</div>
<h3>{$productivityResources->getString('text.dueDate')}</h3>
<div class="myProjectFields">{if $project->getDueDate()}{$project->renderAttribute('dueDate', 'view')}{else}{$resources->getString('text.none')}{/if}</div>

{$wfViewTpl}

