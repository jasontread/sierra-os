<html>
  <head>
    <title>{$resources->getString('MyProjectTask.notify.1')} '{$task->getTitle()}'</title>
  </head>
  <body>
  {if $name}<p>{$name},</p>{/if}
  
  <p>{$resources->getString('MyProjectTask.notify.1')} <strong>{$task->getTitle()}</strong> {$resources->getString('MyProjectTask.notify.10')} <strong>{$project->getName()}</strong>.{if $task->getDueDate()} {$resources->getString('MyProjectTask.notify.2')} <em>{$task->getDueDate(0, 1)}</em>{if $project->getDueDate()} {$resources->getString('MyProjectTask.notify.7')} <em>{$project->getDueDate(0, 1)}</em>{/if}.{/if}{if !$task->getDueDate() && $project->getDueDate()} {$resources->getString('MyProjectTask.notify.6')} <em>{$project->getDueDate(0, 1)}</em>.{/if}</p>
  
  {if $task->getDescription()}
  <p>
    {$resources->getString('MyProjectTask.notify.3')}:
    <div style="background-color: #eee; margin: 0 8px 0 8px; padding: 1px 5px 1px 5px">{$task->getDescriptionHtml()}</div>
  </p>
  {/if}
  
  {if $project->getSummary()}
  <p>
    {if $task->getDescription()}{$resources->getString('MyProjectTask.notify.9')}{else}{$resources->getString('MyProjectTask.notify.8')}{/if}:
    <div style="background-color: #eee; margin: 0 8px 0 8px; padding: 1px 5px 1px 5px">{$project->getSummaryHtml()}</div>
  </p>
  {/if}
  
  <hr />
  <p>
    {$resources->getString('MyProjectTask.notify.4')}:<br />
    <a href="{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}">{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}</a>
  </p>
  
  {if !$uid}<p>{$resources->getString('MyProjectTask.notify.5')}{if $projectAdmin->getName()} <em>{$projectAdmin->getName()}</em>{/if}: <a href="mailto:{$projectAdmin->getEmail()}">{$projectAdmin->getEmail()}</a></p>{/if}
  </body>
</html>
