<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
  <title>{$entity->getName()}</title>
  <link rel="stylesheet" type="text/css" href="plugins/productivity/css/productivity.css" />
</head>

<body onload="window.print(); window.close()">
  <div class="myProjectsTasksPreviewPrint">
    <div class="header"><img alt="{$entity->getEntityResourcesString('MyProject')}" src="plugins/productivity/icons/32/my-projects.png" title="{$entity->getEntityResourcesString('MyProject')}" />{$entity->getName()}</div>
    <table border="1">
      <tr><th colspan="4">{$entity->getEntityResourcesString('MyProjects.task.headerGeneral')}</th></tr>
      <tr>
        <th>{$entity->getEntityResourcesString('MyProject.projectId')}</th>
        <th>{$entity->getEntityResourcesString('MyProject.name')}</th>
        {if $entity->getType()}<th>{$entity->getEntityResourcesString('MyProject.type')}</th>{/if}
        {if $entity->verifyPermissions($smarty.const.MY_PROJECT_PERMISSIONS_ADMIN)}<th>{$entity->getEntityResourcesString('MyProject.participants')}</th>{/if}
      </tr>
      <tr>
        <td>{$entity->getProjectId()}</td>
        <td>{$entity->getName()}</td>
        {if $entity->getType()}<td>{$entity->getType()}</td>{/if}
{if $entity->verifyPermissions($smarty.const.MY_PROJECT_PERMISSIONS_ADMIN)}
        <td>
          <strong>{$entity->getCreatorName()}</strong>: {$entity->getEntityResourcesString('text.permissions.projectAdmin')}<br />
          {foreach from=$entity->getParticipants() item=participant}
          <strong>{$participant->getLabel()}</strong>: {$participant->getPermissionsDescription()}<br />
          {/foreach}
          {foreach from=$entity->getEmailParticipants() item=participant}
          <strong>{$participant->getLabel()}</strong>: {$participant->getPermissionsDescription()}<br />
          {/foreach}
        </td>
{/if}
      </tr>
    </table>
    
    <table border="1">
      <tr><th colspan="4">{$entity->getEntityResourcesString('MyProjects.print.headerState')}</th></tr>
      <tr>
        <th>{$entity->getEntityResourcesString('MyProject.status')}</th>
        <th>{$entity->getEntityResourcesString('MyProject.dueDate')}</th>
        <th>{$entity->getEntityResourcesString('MyProject.archived')}</th>
      </tr>
      <tr>
        <td>{$entity->renderAttribute('status', 'view')}</td>
        <td>{if $entity->getDueDate()}{$entity->renderAttribute('dueDate', 'view')}{else}{$resources->getString('text.none')}{/if}</td>
        <td>{$entity->renderAttribute('archived', 'view')}</td>
      </tr>
    </table>
    
    <table border="1">
      <tr><th>{$entity->getEntityResourcesString('MyProject.summary')}</th></tr>
      <tr><td>{if $entity->getSummary()}{$entity->getSummaryHtml()}{else}{$resources->getString('text.none')}{/if}</td></tr>
    </table>
    
{if $entity->getWfId() && $entity->getWfParams() && $entity->getWfViewTpl()}
    <table border="1">
      <tr><th colspan="4">{$entity->getEntityResourcesString('MyProjects.print.headerOther')}</th>
      <tr><td>{$entity->renderWfViewTpl()}</td></tr>
    </table>
{/if}
  </div>
</body>
</html>

