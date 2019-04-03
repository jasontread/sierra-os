BEGIN:VCALENDAR
CALSCALE:GREGORIAN
X-WR-CALNAME:{$Controller->getAppShortName()} - {$productivityResources->getString('MyProjects')}{if $search}: {$search->getName()}{/if}
{assign var=tz value=$Controller->getAppTimeZone()}

X-WR-TIMEZONE:{$tz->getAbbr()}
VERSION:2.0

{if $projects}
{foreach from=$projects item=project}
{if $project->getDueDate()}
{assign var=created value=$project->getCreated()}
{assign var=dueDate value=$project->getDueDate()}
BEGIN:VEVENT
DTSTART;VALUE=DATE:{$created->format('Ymd')}
DTEND;VALUE=DATE:{$dueDate->format('Ymd')}
SUMMARY:{$Template->strReplace("\n", '\n', $project->getName())}
DESCRIPTION:{$Template->strReplace("\n", '\n', $project->getSummary())}{if $project->getSummary()}\n\n{/if}{$productivityResources->getString('text.formMoreInfo1')} {$Controller->getServerUri()} {$productivityResources->getString('text.formMoreInfo2')}
UID:P{$project->getProjectId()}
END:VEVENT
{/if}

{foreach from=$project->getTasks() item=task}
{if !$task->getDueDate()}
BEGIN:VTODO
{if $task->getRfc2445Status()}
STATUS:{$task->getRfc2445Status()}
{/if}
SUMMARY:{$Template->strReplace("\n", '\n', $task->getTitle())}
DESCRIPTION:{$Template->strReplace("\n", '\n', $task->getDescription())}{if $task->getDescription()}\n\n{/if}{$productivityResources->getString('text.formMoreInfo1')} {$Controller->getServerUri()} {$productivityResources->getString('text.formMoreInfo2')}
UID:T{$task->getTaskId()}
{if $task->getStatus() == 'completed'}
{assign var=completed value=$task->getLastUpdated()}
COMPLETED:{$completed->format('Ymd')}T{$completed->format('His')}Z
{/if}
END:VTODO

{else}{if $task->getStartDate()}{assign var=created value=$task->getStartDate()}{else}{assign var=created value=$task->getCreated()}{/if}{assign var=dueDate value=$task->getICalDueDate()}
BEGIN:VEVENT
DTSTART;VALUE=DATE:{$created->format('Ymd')}
DTEND;VALUE=DATE:{$dueDate->format('Ymd')}
SUMMARY:{$Template->strReplace("\n", '\n', $task->getTitle())}
DESCRIPTION:{$Template->strReplace("\n", '\n', $task->getDescription())}{if $task->getDescription()}\n\n{/if}{$productivityResources->getString('text.formMoreInfo1')} {$Controller->getServerUri()} {$productivityResources->getString('text.formMoreInfo2')}
UID:T{$task->getTaskId()}
END:VEVENT

{/if}
{/foreach}
{/foreach}
{/if}

END:VCALENDAR
