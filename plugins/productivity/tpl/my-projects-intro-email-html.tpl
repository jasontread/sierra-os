<html>
  <head>
    <title>{$resources->getString('MyProject.introEmail.subject')}</title>
  </head>
  <body>
  {if $name}<p>{$name},</p>{/if}
  
  <p>{$resources->getString('MyProject.introEmail.1')} <strong>{$project->getName()}</strong>.{if $project->getDueDate()} {$resources->getString('MyProject.introEmail.2')} <em>{$project->getDueDate(0, 1)}</em>.{/if}</p>
  
  {if $project->getSummary()}
  <p>
    {$resources->getString('MyProject.introEmail.3')}:
    <div style="background-color: #eee; margin: 0 8px 0 8px; padding: 5px 5px 5px 5px">{$project->getSummaryHtml()}</div>
  </p>
  {/if}
  
  <hr />
{if $uid}
{* TODO: re-enable external access when /ep/ controller is implemented (remove the enclosing: if $uid) *}
  <p>
    {$resources->getString('MyProject.introEmail.4')}:<br />
    <a href="{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}">{$Controller->getServerUri()}{if !$uid}{$smarty.const.MY_PROJECTS_MANAGER_EMAIL_PARTICIPANT_URI}{/if}</a>
  </p>
  
  {if !$uid}
  <p>
    {$resources->getString('MyProject.introEmail.5')}:
    <div style="background-color: #eee; margin: 0 8px 0 8px; padding: 5px 5px 5px 5px">
      <label style="position: absolute"><em>{$resources->getString('MyProjectEmailParticipant.email')}:</em></label><span style="margin-left: 110px"><strong>{$participant->getEmail()}</strong></span><br />
      <label style="position: absolute"><em>{$resources->getString('MyProjectEmailParticipant.password')}:</em></label><span style="margin-left: 110px"><strong>{$participant->getPassword()}</strong></span>
    </div>
  </p>
  {/if}
{/if}
  
  <p>{$resources->getString('MyProject.introEmail.6')}{if $projectAdmin->getName()} <em>{$projectAdmin->getName()}</em>{/if}: <a href="mailto:{$projectAdmin->getEmail()}">{$projectAdmin->getEmail()}</a></p>
  
  </body>
</html>
