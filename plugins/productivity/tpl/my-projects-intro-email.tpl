{if $name}{$name}, 

{/if}{$resources->getString('MyProject.introEmail.1')} '{$project->getName()}'.{if $project->getDueDate()} {$resources->getString('MyProject.introEmail.2')} {$project->getDueDate(0, 1)}{/if}.
{if $project->getSummary()}

{$resources->getString('MyProject.introEmail.3')}:
"{$project->getSummary()}"
{/if}

{if $uid}
{* TODO: re-enable external access when /ep/ controller is implemented (remove the enclosing: if $uid) *}
{$resources->getString('MyProject.introEmail.4')}: 
{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}

{if !$uid}

{$resources->getString('MyProject.introEmail.5')}:
{$resources->getString('MyProjectEmailParticipant.email')}: {$participant->getEmail()}
{$resources->getString('MyProjectEmailParticipant.password')}: {$participant->getPassword()}
{/if}
{/if}

{$resources->getString('MyProject.introEmail.6')}{if $projectAdmin->getName()} {$projectAdmin->getName()}{/if}: {$projectAdmin->getEmail()}
