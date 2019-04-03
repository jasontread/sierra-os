<html>
  <head>
    <title>{$productivityResources->getString('MyProjectWhiteboard')}: {if $whiteboard}{$whiteboard->getTitle()}{elseif $redirect}{$productivityResources->getString('MyProjects.whiteboardRedirect')}{else}{$productivityResources->getString('MyProjects.error.whiteboardFailed')}{/if}</title>
  </head>
  <body{if $redirect} onload="document.forms.redirect.submit()"{/if}>
{if $whiteboard && $whiteboard->isActive()}
    <applet archive="drawboard.jar" code="drawboard.Main.class" height="{if $whiteboard->isUserReadOnly()}{$whiteboard->getHeight()}{else}{$whiteboard->getHeight()+50}{/if}" width="{if $whiteboard->isUserReadOnly()}{$whiteboard->getWidth()}{else}{$whiteboard->getWidth()+100}{/if}">
      <param name="port" value="{$whiteboard->getActivePort()}">
      <param name="pencolor" value="{$drawboardConf.pencolor}">
      <param name="skindef" value="{$drawboardConf.skin}">
{if $whiteboard->isUserReadOnly()}
      <param name="onlyview" value="true">
{/if}
    </applet>
{elseif $redirect}
    <form action="./" method="post" name="redirect">
      <input name="whiteboardId" type="hidden" value="{$whiteboardId}" />
      <span id="reloadLink" style="visibility: hidden"><a href="#" onclick="document.forms.redirect.submit()">{$productivityResources->getString('MyProjects.whiteboardClickHere')}</a></span>
      <script>setTimeout('document.getElementById("reloadLink").style.visibility="visible"', 3000);</script>
    </form>
{else}
    {$productivityResources->getString('MyProjects.error.whiteboardNotActive')}
{/if}
  </body>
</html>
