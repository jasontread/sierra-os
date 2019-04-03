{$productivityResources->getString('subscriberEmail.intro')}
{if $Controller->getAppParams('email', 'my-projects') && $subscriber->canAddComments()}

{$productivityResources->getString('subscriberEmail.replyCreateComment')}
{/if}
{if $updated}

{$productivityResources->getString('subscriberEmail.updated')}
{/if}

{$creatorName} {$productivityResources->getString('subscriberEmail.wrote')}:
----------
{$message}


{$productivityResources->getString('subscriberEmail.unsubscribeLink')}
{$subscriber->getUnsubscribeLink()}
