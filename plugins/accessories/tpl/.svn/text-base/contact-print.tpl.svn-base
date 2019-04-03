{assign var='started' value='0'}
{foreach from=$views key='label' item='content'}
<p{if $started} style="page-break-before: always"{/if}>
<h1 class="myContactsPrintHeader">{$label}</h1>
{$content}
</p>
{assign var='started' value='1'}
{/foreach}
