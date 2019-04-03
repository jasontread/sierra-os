<p>{$productivityResources->getString('subscriberEmail.introHtml')}</p>

{if $Controller->getAppParams('email', 'my-projects') && $subscriber->canAddComments()}
<p>{$productivityResources->getString('subscriberEmail.replyCreateComment')}</p>
{/if}

{if $updated}
<p>{$productivityResources->getString('subscriberEmail.updated')}</p>
{/if}

<p>
  <strong>{$creatorName} {$productivityResources->getString('subscriberEmail.wrote')}:</strong>
  <div style="background-color: #eee; margin: 0 8px 0 8px; padding: 1px 5px 1px 5px">{$messageHtml}</div>
</p>


<p>
<a href="{$subscriber->getUnsubscribeLink()}">{$productivityResources->getString('subscriberEmail.clickToUnsubscribe')}</a>
</p>
