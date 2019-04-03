{$Template->assignByRef('project', $entity->getProject())}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
  <title>{$entity->getTitle()}</title>
  <link rel="stylesheet" type="text/css" href="plugins/productivity/css/productivity.css" />
</head>

<body onload="window.print(); window.close()">
  <div class="myProjectsTasksPreviewPrint">
    <div class="header"><img alt="{$entity->getEntityResourcesString('MyProjectTask')}" src="plugins/productivity/icons/32/task.png" title="{$entity->getEntityResourcesString('MyProjectTask')}" />{$entity->getTitle()}</div>
    <table border="1">
      <tr><th colspan="4">{$entity->getEntityResourcesString('MyProjects.task.headerGeneral')}</th></tr>
      <tr>
        <th>{$entity->getEntityResourcesString('MyProject')}</th>
        <th>{$entity->getEntityResourcesString('MyProjectTask.title')}</th>
        <th>{$entity->getEntityResourcesString('MyProjects.task.headerStatus')}</th>
        <th>{$entity->getEntityResourcesString('text.assignedTo')}</th>
      </tr>
      <tr>
        <td>{$project->getName()}</td>
        <td>{$entity->getTitle()}</td>
        <td>{$entity->getStatus(0, 1)}</td>
        <td>{$entity->getOwnerNames()}</td>
      </tr>
    </table>
    
    <table border="1">
      <tr><th colspan="3">{$entity->getEntityResourcesString('MyProjects.task.headerSchedule')}</th></tr>
      <tr>
        <th>{$entity->getEntityResourcesString('MyProjects.task.headerDates')}</th>
        <th>{$entity->getEntityResourcesString('MyProjects.task.headerDuration')}</th>
        <th>{$entity->getEntityResourcesString('MyProjects.task.headerPercentComplete')}</th>
      </tr>
      <tr>
        <td>{$entity->getLabelDates()}</td>
        <td>{$entity->getLabelDuration()}</td>
        <td>{$entity->getLabelPercentComplete()}</td>
      </tr>
    </table>
    
    <table border="1">
      <tr><th>{$entity->getEntityResourcesString('MyProjects.task.headerDescription')}</th></tr>
      <tr><td>{$entity->renderAttribute('descriptionHtml')}</td></tr>
    </table>
  </div>
</body>
</html>

