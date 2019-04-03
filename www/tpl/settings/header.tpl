<?xml version="1.0" encoding="UTF-8"?>
{$Template->assign('workspace', $user->getActiveWorkspace())}{assign var=sectionKey value="settings"}{if $section neq 'settings'}{assign var=sectionKey value="settings."|cat:$section}{/if}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{$Locale->getLanguage()}" lang="{$Locale->getLanguage()}">
<head>
  <title>{$resources->getString($sectionKey)} - {$Controller->getAppShortName()}</title>
  <link rel="stylesheet" type="text/css" href="{$workspace->myTheme->getBaseUri()}settings.css" />
  {if $File->getRelativePath('www/html/themes', 'custom.css')}<link rel="stylesheet" type="text/css" href="/themes/custom.css" />{/if}
  {if $reloadOs}
  <script type="text/javascript">
    window.opener.OS.reload();
  </script>
  {/if}
</head>

<body id="popup">

<form action="" enctype="multipart/form-data" method="post">

<h1><img alt="{$resources->getString($sectionKey)}" src="{$workspace->myTheme->getBaseUri()}icons/32/{$section}.png" />{$resources->getString($sectionKey)}</h1>

{if $errs}
<span id="msg">{$resources->getString('text.pleaseCorrect')}</span>
<ul id="errorMsg">
{foreach from=$errs item=err}
<li>{$resources->getString($err)}</li>
{/foreach}
</ul>
{elseif $msg}
<span id="msg">{$resources->getString($msg)}</span>
{/if}