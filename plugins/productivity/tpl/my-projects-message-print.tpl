{$Template->assignByRef('project', $entity->getProject())}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
  <title>{$entity->getTitle()}</title>
  <link rel="stylesheet" type="text/css" href="plugins/productivity/css/productivity.css" />
</head>

<body onload="window.print(); window.close()">
  <div class="myProjectsMessagePrint">
    <div class="header"><img alt="{$entity->getEntityResourcesString('MyProjectMessage')}" src="plugins/productivity/icons/32/message.png" title="{$entity->getEntityResourcesString('MyProjectMessage')}" />{$entity->getTitle()}</div>
    <h5>{$entity->getStatusLabel()}</h5>
    {$entity->getMessageHtml()}
    
    <div class="commentsHeader"><img alt="{$entity->getEntityResourcesString('MyProjectComment')}" src="plugins/productivity/icons/16/comment.png" title="{$entity->getEntityResourcesString('MyProjectComment')}" />{$entity->getEntityResourcesString('text.comments')}</div>
    {if $entity->getComments()}
    {foreach from=$entity->getComments() item=comment}
    <h5>{$comment->getStatusLabel()}</h5>
    {$comment->getCommentHtml()}
    {/foreach}
    {else}
    {$entity->getEntityResourcesString('MyProjectMessage.print.noComments')}
    {/if}
  </div>
</body>
</html>

