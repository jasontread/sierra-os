{* see lib/global-include::getOsStyledContent *}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{$Locale->getLanguage()}" lang="{$Locale->getLanguage()}">
<head>
  <title>{$title}</title>
  <style type="text/css">{$File->renderMergedFiles($cssFiles, 2)}</style>
</head>

<body{if $print} onload="window.print(); window.close();"{/if}>
{if $tpl}{$Template->fetch($tpl)}{/if}
</body>
</html>
