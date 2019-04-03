{assign var=coreResources value=$resources->getBundle('etc/plugins/core/etc/l10n/core')}
<html>
<head>
<style type="text/css">
body {ldelim}
  background: #fff;
  color: #000;
	font-family: arial, helvetica, sans-serif;
  font-size: 10pt;
	padding: 5px;
{rdelim}
h1 {ldelim}
  border-bottom: 1px solid #8c8c8c;
  font-size: 20px;
  margin: 0;
  margin-bottom: 5px;
{rdelim}
h2 {ldelim}
  border: 0;
  font-size: 16px;
  margin: 0;
  margin-bottom: 5px;
{rdelim}
</style>
<title>{$source->getLabel()} - {$topic->getLabel()}</title>
</head>
<body onload="window.print(); window.close();">
<h1>{$source->getLabel()}</h1>
<h2>{$topic->getLabel()}</h2>
{$topic->getLocalizedContent()}
</body>
</html>
