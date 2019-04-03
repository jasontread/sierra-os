<div class="core_sc_phrase">&nbsp;</div>
<div class="core_sc_suggestions">
{$plugins.core->resources->getString('SpellChecker.text.suggestions')}:
<select name="suggestions"><option></option></select>
<input name="core_sc_change" class="inputField" value="" />
</div>
<div class="core_sc_buttons">
<input id="core_sc_ignore" onclick="OS.getWindowInstance(this).getManager().ignore()" type="button" value="{$plugins.core->resources->getString('SpellChecker.text.ignore')}" />
<input id="core_sc_ignoreAll" onclick="OS.getWindowInstance(this).getManager().ignoreAll()" type="button" value="{$plugins.core->resources->getString('SpellChecker.text.ignoreAll')}" />
<input id="core_sc_add" onclick="OS.getWindowInstance(this).getManager().add()" type="button" value="{$plugins.core->resources->getString('SpellChecker.text.add')}" />
<input id="core_sc_change" onclick="OS.getWindowInstance(this).getManager().change()" class="change" type="button" value="{$plugins.core->resources->getString('SpellChecker.text.change')}" />
<input id="core_sc_changeAll" onclick="OS.getWindowInstance(this).getManager().changeAll()" type="button" value="{$plugins.core->resources->getString('SpellChecker.text.changeAll')}" />
</div>
<div class="core_sc_dictionary">
{$plugins.core->resources->getString('SpellChecker.text.dictionary')}:<br />
{$user->renderAttribute('coreDictionary', 'input')}
<input onclick="OS.getWindowInstance(this).getManager().updateDictionary()" type="button" value="{$plugins.core->resources->getString('text.default')}" />
</div>
<div class="core_sc_close"><input type="button" value="{$resources->getString('form.close')}" onclick="OS.closeWindow(this)" /></div>
