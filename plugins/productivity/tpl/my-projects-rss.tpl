<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[{$Controller->getAppShortName()} - {$productivityResources->getString('MyProjects')}{if $search}: {$search->getName()}{/if}]]></title>
    <link>{$Controller->getServerUri()}</link>
    <description>{$productivityResources->getString('MyProjects.dashboard.latestActivity')} {if $search}{$productivityResources->getString('text.fromThe')} {$search->getName()} {$productivityResources->getString('text.rssFeed')}{/if}</description>
    <docs>http://blogs.law.harvard.edu/tech/rss</docs>
    <generator>SIERRA::OS {$productivityResources->getString('MyProjects')}</generator>
    <image>
      <height>64</height>
      <link>{$Controller->getServerUri()}</link>
      <title>{$Controller->getAppShortName()} - {$productivityResources->getString('MyProjects')}</title>
      <url>{$Controller->getRequestUri()}/plugins/productivity/icons/64/rss.png</url>
      <width>64</width>
    </image>
    <language>{$Controller->getAppDefaultLanguage()|lower}-{$Controller->getAppDefaultCountry()|lower}</language>
    <ttl>{if $Controller->getAppParams('rssTtl', 'my-projects')}{$Controller->getAppParams('rssTtl', 'my-projects')}{else}{$smarty.const.MY_PROJECTS_RSS_TTL}{/if}</ttl>
{foreach from=$items item=item}
    <item>
{if $item.description || ($item.fileId && !$item.commentId)}
      <description><![CDATA[<div>{if $item.fileId && !$item.commentId}<a href="{$Controller->getRequestUri()}{$item.uri}"><img alt="{$item.name}" border="0" src="{$Controller->getServerUri()}{$item.iconUri32}" title="{$item.name}" /></a><br /><a href="{$Controller->getServerUri()}{$item.uri}">{$resources->getString('text.view')}</a>{elseif $item.whiteboardId && !$item.commentId}<a href="{$Controller->getServerUri()}{$item.uri}"><img alt="{$item.name}" border="0" src="{$Controller->getServerUri()}{$item.description}" title="{$item.name}" /></a>{else}{$item.description}{/if}</div>]]></description>
{/if}
      <guid isPermaLink="false">{$item.id}</guid>
      <link><![CDATA[{if $item.uri}{$Controller->getRequestUri()}{$item.uri}{else}{$Controller->getRequestUri()}/plugins/productivity/rss/show/{if $Controller->getAppParams('rssRewrite', 'my-projects')}{$item.id}/{else}?id={$item.id}{/if}{/if}]]></link>
      <pubDate>{$item.lastUpdated->format('r')}</pubDate>
      <title><![CDATA[{if $item.projectName}{$item.projectName}: {/if}{if $item.commentId}{$productivityResources->getString('text.commentAdded')}{elseif $item.fileId}{$productivityResources->getString('text.fileUploaded')}{elseif $item.messageId}{$productivityResources->getString('text.messagePosted')}{elseif $item.taskId}{if $item.status eq 'completed'}{$productivityResources->getString('text.taskCompleted')}{else}{$productivityResources->getString('text.taskUpdated')}{/if}{elseif $item.whiteboardId}{$productivityResources->getString('text.whiteboardUpdated')}{/if} - {if $item.commentId}{$productivityResources->getString('text.re')} {/if}{$item.name}]]></title>
      <dc:creator>{$item.lastUpdatedBy}</dc:creator>
    </item>
{/foreach}
  </channel>
</rss>
