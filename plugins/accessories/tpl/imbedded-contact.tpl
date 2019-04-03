{* 
used to display an imbedded contact. imbedded contacts are those that are only 
displayed within the context of another entity. they do not appear in the 
MyContacts application. this view will provide a 'create' link when the contact 
does not already exist and 'edit'/'remove' links when it does. imbedded contacts 
will be displayed in a popup window and do not have the tabbed extension views. 
when cardinality exists for the attribute, an 'add' link will also be included 
in the view. imbedded contacts MUST have 'on-delete-cascade' and 
'on-remove-delete' constraints (when cardinality is used) set for the attribute 
used to represent them or they will become zombie records when they are removed 
or if the entity that contains them is deleted. when an imbedded contact is 
added/set the association to the corresponding entity is automatic. however, 
when an imbedded contact is removed/unset a corresponding hidden 'input' field 
will be rendered, but the entity will need to be updated by the underlying 
application

[attr]            (type='init') optional initialization attributes to use to set 
                  the default values for new contacts. for example, if you 
                  wanted all new contacts to be 'company' cards, you would use 
                  the following param:
                  <param id="company" type="init" value="1" />
                  these values will be set before rendering the new contact form
                  AND before setting the user specified form values when 
                  attempting to save the new contact record (in which case form 
                  values - if specified - will override these values). strings 
                  should be enclosed in single quotes. the values will be 
                  already enclosed in double quotes, so double quotes should not 
                  be used within them
                  
[attr]            (type='initParseString') optional initialization attributes to 
                  use to set the default values for new contacts based on 
                  'parseString' values from the entity it belongs to. for 
                  example, if the imbedded contact company name should be the 
                  same as the enclosing entity company name, the following 
                  parameter would be used:
                  <param id="companyName" type="init" value="~'{$companyName}'" />
                  Note: the return value should not contain either single or 
                  double quotes unless they are escaped (preceded with a 
                  backslash), otherwise, the rendered javascript will be invalid
                  for more information, see the api for the 'parseString' method 
                  in the value object
                  
display           an optional entity 'parseString' method value that should be 
                  used to return the value that will be displayed for the 
                  contact. if not specified the 'getContactLabel()' method will 
                  be used
                  
fields            an optional space separated list of base fields that should be 
                  displayed in the contact view/form popup views. the user will 
                  NOT be able to view or enter values for fields that are not 
                  included in this list. ONLY those fields listed in 
                  'accessories/etc/l10n/contact-fields.properties' can be 
                  included in this list
                  
[card field name] (type='fixed-cardinality') used to define fixed cardinality 
                  fields. 'id' should be the name of the base contact attribute 
                  (that uses cardinality), and the value should be a cardinality 
                  expression (n..m where n is the lower bound and m is the upper 
                  bound) such as "1..2" (1 or 2). if value is not specified, 
                  "1..1" will be assumed
                  
[card field name] (type='fixed-cardinality-types') used to define fixed types 
                  for fixed cardinality fields (previously defined using 
                  type='fixed-cardinality'). 'id' should correspond to a 
                  'fixed-cardinality' field, and 'value' should be a space 
                  separated list of fixed types to assign to those fields. if 
                  the # of types in this list does not match the upper bound 
                  of the corresponding 'fixed-cardinality' definition, the 
                  remaining types will be free-form (the user can select the 
                  type). for example, to create an imbedded contact that 
                  requires the user to specify the home address, the following 
                  view parameters would be used:
                  <param id="addresses" type="fixed-cardinality" />
                  <param id="addresses" type="fixed-cardinality-types" value="home" />
                  another example, require 1 address, either 'home', 'work' or 
                  both:
                  <param id="addresses" type="fixed-cardinality" value="1..2" />
                  <param id="addresses" type="fixed-cardinality-types" value="home work" />
                  
validate          an optional contact validation constraint to trigger when 
                  creating or updating this contact. when this validation 
                  constraint fails, the corresponding 'resource' will be 
                  displayed to the user using an error popup dialog
                  
viewOnly          whether or not this is for a view-only rendering (the add/set 
                  and remove links will not be rendered)
*}
<div>
{assign var='icParams' value="'attribute': '"|cat:$attributeName|cat:"', 'attributeLabel': '"|cat:$entity->getEntityLabel($attributeName)|cat:"', 'container': this, 'entity': '"|cat:$entityName|cat:"', 'entityId': "|cat:$entity->getPrimaryKey()|cat:", 'entityLabel': '"|cat:$entity->getEntityLabel()|cat:"', 'fieldName': '"|cat:$fieldName|cat:"'"}
{if $entity->getAttributeCardinality($attributeName)}{assign var='icParams' value=$icParams|cat:", 'hasCardinality': true"}{/if}
{if $params->getParams('fixed-cardinality')}
{assign var='icParams' value=$icParams|cat:", 'cardinality': "|cat:$smarty.ldelim}
{assign var='started' value=0}
{foreach from=$params->getParams('fixed-cardinality') key=attr item=card}
{if $started}{assign var='icParams' value=$icParams|cat:", "}{/if}
{assign var='icParams' value=$icParams|cat:"'"|cat:$attr|cat:"': '"|cat:$card|cat:"'"}
{assign var='started' value=1}
{/foreach}
{assign var='icParams' value=$icParams|cat:$smarty.rdelim}
{/if}
{if $params->getParams('fixed-cardinality-types')}
{assign var='icParams' value=$icParams|cat:", 'cardinalityTypes': "|cat:$smarty.ldelim}
{assign var='started' value=0}
{foreach from=$params->getParams('fixed-cardinality-types') key=attr item=card}
{if $started}{assign var='icParams' value=$icParams|cat:", "}{/if}
{assign var='icParams' value=$icParams|cat:"'"|cat:$attr|cat:"': '"|cat:$card|cat:"'"}
{assign var='started' value=1}
{/foreach}
{assign var='icParams' value=$icParams|cat:$smarty.rdelim}
{/if}
{if $params->getParam('display')}{assign var='icParams' value=$icParams|cat:", 'display': '"|cat:$params->getParam('display')|cat:"'"}{/if}
{if $params->getParam('fields')}{assign var='icParams' value=$icParams|cat:", 'fields': '"|cat:$params->getParam('fields')|cat:"'"}{/if}
{if $params->getParams('init') || $params->getParams('initParseString')}
{assign var='icParams' value=$icParams|cat:", 'init': "|cat:$smarty.ldelim}
{assign var='started' value=0}
{if $params->getParams('init')}
{foreach from=$params->getParams('init') key=attr item=val}
{if $started}{assign var='icParams' value=$icParams|cat:", "}{/if}
{assign var='icParams' value=$icParams|cat:"'"|cat:$attr|cat:"': "|cat:$val}
{assign var='started' value=1}
{/foreach}
{/if}
{if $params->getParams('initParseString')}
{foreach from=$params->getParams('initParseString') key=attr item=val}
{if $started}{assign var='icParams' value=$icParams|cat:", "}{/if}
{assign var='icParams' value=$icParams|cat:"'"|cat:$attr|cat:"': '"|cat:$entity->parseString($val)|cat:"'"}
{assign var='started' value=1}
{/foreach}
{/if}
{assign var='icParams' value=$icParams|cat:$smarty.rdelim}
{/if}
{if $params->getParam('validate')}{assign var='icParams' value=$icParams|cat:", 'validate': '"|cat:$params->getParam('validate')|cat:"'"}{/if}
{if $params->getParam('viewOnly')}{assign var='icParams' value=$icParams|cat:", 'viewOnly': true"}{/if}

{if $entity->getAttributeCardinality($attributeName)}
{assign var='cardinality' value=1}
{assign var='clower' value=$entity->getAttributeCardinality($attributeName, 0)}
{assign var='cupper' value=$entity->getAttributeCardinality($attributeName, 1)}
{else}
{assign var='cardinality' value=0}
{/if}
{if $entity}
{$Template->assign('icardinality', $cardinality)}
{$Template->assign('icParams', $icParams)}
{$Template->assign('idisplay', $params->getParam('display'))}
{$Template->assign('iviewOnly', $params->getParam('viewOnly'))}
{if $cardinality}
{foreach from=$attribute item=icontact}
{$Template->assignByRef('icontact', $icontact)}
{include file='_imbedded-contact.tpl'}
{/foreach}
{else}
{if $attribute}{$Template->assignByRef('icontact', $attribute)}{else}{$Template->assign('icontact', 0)}{/if}
{include file='_imbedded-contact.tpl'}
{/if}
{/if}
{if !$params->getParam('viewOnly')}
{if $cardinality}{assign var='addStr' value=$resources->getString('form.add')}{else}{assign var='addStr' value=$resources->getString('form.new')}{/if}
<span onclick="var params={ldelim} {$icParams} {rdelim}; OS.launchWindow('accessories', 'ImbeddedContact', params);"{if !$cardinality && $attribute} style="display: none;"{/if}><img alt="{$addStr}" src="plugins/accessories/images/add.png" style="float: left; margin-right: 3px;" title="{$addStr}" /><a href="#">{$addStr}</a></span>
{/if}
</div>
