{assign var=coreCommonPlaces value=$user->getCoreCommonPlaces()}
{assign var=coreUserHomeDir value=$user->getVfsHomeDir()}
{assign var=coreTrashDir value=$user->getVfsTrashDir()}
{assign var=coreWorkspacesDir value=$user->getVfsWorkspacesDir()}
{assign var=coreWorkspaceDir value=$user->getVfsWorkspaceDir($workspace->getPrimaryKey())}
{assign var=coreHomeDir value=$coreUserHomeDir->getHomeRootNode()}
{assign var=coreNetworkDir value=$coreUserHomeDir->getNetworkRootNode()}
{assign var=coreRootDir value=$coreUserHomeDir->getVirtualRootNode()}
<script type="text/javascript">
<!--
OS.user.commonPlaces = [{assign var=started value=0}{foreach from=$coreCommonPlaces item=node}{if $started}, {/if}Core_VfsNode.newInstanceFromEntity({$node->toJson()}){assign var=started value=1}{/foreach}];
OS.user.homeDir = Core_VfsNode.newInstanceFromEntity({$coreUserHomeDir->toJson()});
OS.user.trashDir = Core_VfsNode.newInstanceFromEntity({$coreTrashDir->toJson()});
OS.user.workspacesDir = Core_VfsNode.newInstanceFromEntity({$coreWorkspacesDir->toJson()});
OS.user.workspaceDir = Core_VfsNode.newInstanceFromEntity({$coreWorkspaceDir->toJson()});
OS.homeDir = Core_VfsNode.newInstanceFromEntity({$coreHomeDir->toJson()});
OS.networkDir = Core_VfsNode.newInstanceFromEntity({$coreNetworkDir->toJson()});
OS.rootDir = Core_VfsNode.newInstanceFromEntity({$coreRootDir->toJson()});
-->
</script>
<input id="coreTerminalInput" class="coreTerminalInput" type="text" />
<div class="coreTerminalInputBorderHorz"></div>
<div class="coreTerminalInputBorderHorz"></div>
<div class="coreTerminalInputBorderVert"></div>
<div class="coreTerminalInputBorderVert"></div>
<div class="coreTerminal"></div>
