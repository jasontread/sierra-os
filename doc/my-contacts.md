# sierra-os - MyContacts
MyContacts is a multi-user, collaborative contact manager modeled after the OS X AddressBook application. MyContacts is part of the AccessoriesPlugin. Using MyContacts, each user maintains an individual database of contacts and may share or subscribe to contact groups containing additional contact records. Additionally, users of sierra-os appear in MyContacts as cards.

## Extensibility
MyContacts also provides CRM extensibility allowing developers to add tabs to individual cards wherein additional contact related information can be displayed and edited. Implementing this extensibility involves extending the "Contact" entity in another plugin entity model with additional attributes and views. These views can then be used to create different tabs/displays in the view and/or edit displays of individual users. The following are the specific steps required to extend MyContacts:

1. Add additional attributes to the Contact entity in your plugin entity model. For more information on entity models, review the accessories entity model in `plugins/accessories/etc/accessories-model.xml` and the [sierra-php](http://api.sierra-php.org) framework entity model dtd
2. Create additional Contact entity `views` to display and/or edit that data
3. Add `/path/to/sraos/etc/app-config.xml` params for each additional view you wish to include in MyContacts where the param attributes should be used in the following manner:
    * `type=my-contacts-view-[view id]`: each grouping of params with the same type are considered a single MyContacts view
    * `id/value` (type should be the same for each of these view options)
      * `id="edit" value="[1|0]"` whether this is a display-mode or edit mode view. edit mode views should only be used to edit Contact attributes when possible. These attributes must map in some way to the Contact entity. For more information on naming conventions, see the API for Contact::setAttributes. edit mode views will only be displayed when the contact is in edit mode and vise-versa for display-mode views. if this parameter is not specified for a view, it will assumed to be the display view
      * `id="help" value="help-topic id"` an optional help topic defined for your plugin that should be included in the MyContacts help menu
      * `id="helpIcon"` value="[help topic icon uri]" if id="help" is specified, this value may optionally be used to pecify a custom 16x16 pixel icon to use to represent that item in the menu. if not specified, a default icon ill be used
      * `id="label" value="[label resource]"` required the identifier of the plugin specific resource to use for the MyContacts view tab
      * `id="plugin" value="[plugin name]"` required the id of the plugin that this view pertains to. this is the name of the plugin folder
      * `id="validate" value="[Contact entity validation id]"` an optional non-mandatory validation constraint to invoke which if not passing, will result in the view NOT being displayed for a Contact. this can be used to conditionally show tabs for contacts
      * `id="view" value="[Contact entity view id]"` required the name of the Contact view to use for the content of the view. for more information, see the entity-model DTD documentation. if the view contains javascript, it will be extracted and evaluated after the view is displayed
    * `type=my-contacts-search`: MyContacts search indexing can also be extended with additional Contact attributes using this param type, where the value (id is not used) is a Contact attribute identifier (including sub-attributes). the type for each of these attributes should be scalar or a scalar array. these values will be added to the contact search index
    
NOTE: tabs will be displayed in the order defined in app-config

### Example
In this entity model, we are extending the `Contact` entity by adding 2 attributes, 2 views and 1 validation constraint: `myplugin/etc/myplugin-model.xml`

```
<entity key="Contact"> 
  <attribute key="customerId"> 
    <view key="output" extends="text" /> 
    <view key="input" extends="input" /> 
  </attribute> 
  <attribute key="customerType"> 
    <view key="output" extends="text" /> 
    <view key="input" extends="input" /> 
  </attribute> 
  <view key="customerView" template="plugins/myplugin/customer-view.tpl" /> 
  <view key="customerEdit" template="plugins/myplugin/customer-edit.tpl" /> 
  <validate key="isCustomer" attrs="customerId" /> 
</entity>
```

Next we need to add the labels to use for those new attributes: `myplugin/etc/myplugin.properties `

```
Contact.customerId=Customer ID
Contact.customerType=Type of customer
CustomerHelp=Help on working with customers
Customer.tab=Customer Information
```

the smarty template for the customer view tab. NOTE: the "output" and "input" views extend base views defined in `/path/to/sraos/etc/app-model.xml`: `myplugin/tpl/customer-view.tpl`

```
{$entity->getCustomerIdLabel()}: {$entity->renderAttribute('customerId', 'output')}
<br /> 
{$entity->getCustomerTypeLabel()}: {$entity->renderAttribute('customerId', 'output')}
```

the smarty template for the customer edit tab: `myplugin/tpl/customer-edit.tpl`

```
{$entity->getCustomerIdLabel()}: {$entity->renderAttribute('customerId', 'input')}
<br />
{$entity->getCustomerTypeLabel()}: {$entity->renderAttribute('customerId', 'input')}
```

`myplugin/plugin.xml`

```
<plugin...> ... <help-topic key="CustomerHelp" content="customer-help.html" /> ... </plugin>
```

`<plugin...> ... <help-topic key="CustomerHelp" content="customer-help.html" /> ... </plugin>`

```
<html> 
<head>
  <title>Working with customers</title>
</head>
<body> 
  Working with customers is easy in MyContacts. My click on the <i>Customer Information</i> tabs to view or edit their information 
</body>
</html>
```

this is where we extend MyContacts using the views and attributes we have defined: `/path/to/sraos/etc/app-config.xml`
