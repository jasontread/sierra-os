<div class="myContactsForm">
  <h1 id="MyContactsGroupHeader" style="background-image: url(plugins/accessories/icons/32/contacts-new.png)">{$plugins.accessories->resources->getString('MyContacts.newContactGroup')}</h1>
  
  <h2>{$plugins.accessories->resources->getString('MyContactsGroup.name')}</h2>
  <div class="myContactsFormFields">
    <label for="myContactsGroupName">{$plugins.accessories->resources->getString('ContactGroup.name')}:</label>
    <input id="myContactsGroupName" class="textField" name="name" />
  </div>
  
  <h2>{$plugins.accessories->resources->getString('MyContactsGroup.public')}</h2>
  <div class="myContactsFormFields">
    <input id="myContactsGroupPublicYes" name="public" onchange="OS.getWindowInstance(this).getManager().updateViewOfPublicAttrs()" type="radio" value="1" />{$resources->getString('text.yes')} 
    <input id="myContactsGroupPublicNo" checked="checked" onchange="OS.getWindowInstance(this).getManager().updateViewOfPublicAttrs()" name="public" type="radio" value="0" />{$resources->getString('text.no')} 
  </div>
  
  <div id="myContactsGroupPublicAttrs">
    <h2>{$plugins.accessories->resources->getString('MyContactsGroup.publicReadOnly')}</h2>
    <div class="myContactsFormFields">
       <input id="myContactsGroupPublicReadOnlyYes" checked="checked" name="publicReadOnly" type="radio" value="1" />{$resources->getString('text.yes')} 
       <input id="myContactsGroupPublicReadOnlyNo" name="publicReadOnly" type="radio" value="0" />{$resources->getString('text.no')}
    </div>
    <h2>{$plugins.accessories->resources->getString('MyContactsGroup.restrictAccess')}</h2>
    <div class="myContactsFormFields">
       <input id="myContactsGroupRestrictAccessYes" name="restrictAccess" onchange="OS.getWindowInstance(this).getManager().updateViewOfAccessRestrictions()" type="radio" value="1" />{$resources->getString('text.yes')} 
       <input id="myContactsGroupRestrictAccessNo" checked="checked" name="restrictAccess" onchange="OS.getWindowInstance(this).getManager().updateViewOfAccessRestrictions()" type="radio" value="0" />{$resources->getString('text.no')}
       <div id="myContactsGroupRestrictAccess"></div>
    </div>
  </div>
  
  <div class="myContactsFormButtons">
    <input id="myContactsGroupDeleteBtn" onclick="OS.getWindowInstance(this).getManager().deleteGroup()" style="visibility: hidden" type="button" value="{$resources->getString('text.delete')}" />
    <input id="myContactsGroupSaveBtn" onclick="OS.getWindowInstance(this).getManager().save()" type="button" value="{$resources->getString('text.create')}" />
  </div>
  
  <div class="myContactsCancelLink"> 
    <a href="#" onclick="OS.closeWindow(this)">{$resources->getString('form.cancel')}</a>
  </div>
  
</div>
