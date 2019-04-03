{if $name}{$name}, 

{/if}{$resources->getString('MyProjectTask.notify.1')} '{$task->getTitle()}' {$resources->getString('MyProjectTask.notify.10')} '{$project->getName()}'.{if $task->getDueDate()} {$resources->getString('MyProjectTask.notify.2')} {$task->getDueDate(0, 1)}{if $project->getDueDate()} {$resources->getString('MyProjectTask.notify.7')} {$project->getDueDate(0, 1)}{/if}.{/if}{if !$task->getDueDate() && $project->getDueDate()} {$resources->getString('MyProjectTask.notify.6')} {$project->getDueDate(0, 1)}.{/if}

{if $task->getDescription()}

{$resources->getString('MyProjectTask.notify.3')}:
"{$task->getDescription()}"
{/if}
{if $project->getSummary()}

{if $task->getDescription()}{$resources->getString('MyProjectTask.notify.9')}{else}{$resources->getString('MyProjectTask.notify.8')}{/if}:
"{$project->getSummary()}"
{/if}

{$resources->getString('MyProjectTask.notify.4')}: 
{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}
{if !$uid}

{$resources->getString('MyProjectTask.notify.5')}{if $projectAdmin->getName()} {$projectAdmin->getName()}{/if}: {$projectAdmin->getEmail()}
{/if}
