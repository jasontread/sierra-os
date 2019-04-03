{* 
used to display a contact lookup selector. accepts the following parameters:

PARAMS:
Key             Type          Value/Default    Description

[attr]          div-attrs     [attr value]     custom attributes to apply to the 
                                               "div" results element. for example 
                                               "class"/"some css class". if a css 
                                               class is not assigned using this 
                                               parameter, the class 'inputSuggestion' 
                                               will be assigned
                                               
[attr]          input-attrs   [attr value]     custom attributes to apply to the 
                                               "input" element used as the contact 
                                               lookup field. for example 
                                               "class"/"some css class"

attr                          parseString val/ the display value for contacts in 
                              'label'          the lookup results. if not specified 
                                               the contact label (person or company 
                                               name) will be used. for more 
                                               information see the documentation 
                                               for the $attr parameter in the
                                               MyContactsManager::searchContacts
                                               method
                                               
display                                        an optional entity 'parseString' method 
                                               value that should be used to return 
                                               the value that will be initially 
                                               displayed in the selector lookup 
                                               field. if not specified, no initial 
                                               lookup field value will be used

groupId                       group ids        if only a particular ContactGroup 
                                               in the users address book should 
                                               be searched, this parameter should 
                                               be the id of that group
                                               
limit                                          the max # of contacts to display in 
                                               the selector. if not specified, 
                                               MY_CONTACTS_MANAGER_SELECTOR_LIMIT
                                               will be used
                                               
minSize                                        the # of characters that must be 
                                               input before the contact lookup will 
                                               be performed. if not specified, 
                                               MY_CONTACTS_MANAGER_SELECTOR_MIN_SIZE
                                               will be used
*}

{$Template->includeOnce('plugins/accessories/MyContactsManager.php')}
{assign var="myParams" value=$Template->getVarByRef('params')}
{assign var="limit" value=$myParams->getParam('limit', $smarty.const.MY_CONTACTS_MANAGER_SELECTOR_LIMIT)}
{assign var="minSize" value=$myParams->getParam('minSize', $smarty.const.MY_CONTACTS_MANAGER_SELECTOR_MIN_SIZE)}
{assign var='lookupParams' value=$smarty.ldelim}
{assign var='tmp' value=$myParams->getParam('attr', 'label')}{assign var='lookupParams' value=$lookupParams|cat:"'attr': '"|cat:$tmp|cat:"'"}
{if $myParams->getParam('groupId')}{assign var='tmp' value=$myParams->getParam('groupId')}{assign var='lookupParams' value=$lookupParams|cat:", 'groupId': "|cat:$tmp}{/if}
{assign var='lookupParams' value=$lookupParams|cat:$smarty.rdelim}
{assign var='onfocus' value="if (!this._initialized) "|cat:$smarty.ldelim|cat:" this._initialized=true; ajaxTipsAddSelector(this, "|cat:$limit|cat:", "|cat:$minSize|cat:", 0, 'myContactsSearchContacts', 'search', 'inputSuggestion', 'selected', this.nextSibling, this.nextSibling.nextSibling, OS.getWaitImgUri(), OS.getString('text.wait'), null, null, true, "|cat:$lookupParams|cat:", true)"}
{assign var='onfocus' value=$onfocus|cat:$smarty.rdelim}
{$myParams->concat('onfocus', $onfocus, 'input-attrs')}
{if !$myParams->getParam1('class', 'div-attrs')}{$myParams->concat('class', 'inputSuggestion', 'div-attrs')}{/if}
{assign var='display' value=$myParams->getParam('display')}
{if $display}{assign var='display' value=$entity->parseString($display)}{else}{assign var='display' value=''}{/if}

{$Template->renderOpen($tplName, 'input', $myParams, '', 0)} autocomplete="off" name="{$fieldName}Tmp" type="text" value="{$Template->escapeHtmlQuotes($display)}" />{$Template->renderOpen($tplName, 'div', $myParams, '', 0)}></div><input name="{$fieldName}" type="hidden" value="{$attribute}" />
