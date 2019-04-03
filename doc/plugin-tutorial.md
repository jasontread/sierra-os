# sierra-os - PluginTutorial

## Introduction
sierra-os utilizes an extensible plugin architecture whereby additional applications, help content, entities, search items, and other content can be added to the OS. Plugins can be very simple or very complicated. The ProductivityPlugin is an example of a very complex plugin. This tutorial will walk you through creating your first very simple plugin. After completing this tutorial you can inspect the standard plugins to gain a better understanding of all of the features available to plugin authors.

### Creating the plugin shell
The first step to creating a plugin is to create the necessary directories and files: 

```
cd /path/to/sierra-os/plugins 
mkdir testplugin 
cd testplugin 
touch plugin.xml 
mkdir -p etc/l10n 
touch etc/l10n/testplugin.properties 
mkdir -p lib 
mkdir -p tpl 
mkdir -p www/css 
mkdir -p www/icons/16 
mkdir -p www/icons/32 
mkdir -p www/icons/64 
mkdir -p www/images 
mkdir -p www/lib
```

### Plugin shell file/directory descriptions

  * `plugin.xml` see below
  * `lib` directory containing php source files used by the plugin
  * `tpl` directory containing smarty templates used by the plugin
  * `www/css` css used by the plugin. any files in this directory will automatically be added to the sierra-os workspace
  * `www/icons` used to store 16, 32, and 64 pixel square icons used to represent applications and windows defined in plugin.xml
  * `www/images` used to store image files used by the plugin. accessible via the uri plugins/[plugin id]/images
  * `www/lib` used to store javascript source files used by the plugin. these files will automatically be added to the sierra-os workspace
  
### plugin.xml
`plugin.xml` is used to define applications, windows, entities, entity models, and help content provided by a given plugin. During this tutorial, we will create a very simple plugin with a single application named `HelloWorld`. For simplicity sake we will use a standard sierra-os icon (`info.png`) to represent this application. Had we wanted to use a custom icon, we would have created a 16, 32 and 64 pixel version of that icon and upload them to the plugin `www/icons` directories. For more information on the options available in `plugin.xml`, review the documentation provided in the `plugin.dtd`

```
<?xml version="1.0" encoding="ISO-8859-1"?> 
<!DOCTYPE plugin PUBLIC "-//SIERRA//DTD SRAOS PLUGIN//EN" "http://sierra-os.googlecode.com/svn/trunk/etc/plugin.dtd"> 
<plugin> 
  <application key="HelloWorld" about="HelloWorld.about" icon="info.png" main-window="HelloWorldWin"> 
    <window key="HelloWorldWin" default-height="300" default-maximize="0" default-width="400" tpl="hello-world.tpl"> 
      <button key="te_new" icon="filenew.png" method="alert('new')" resource="text.new" /> 
      <menu key="te_file" resource="text.file"> 
        <menu key="tem_new" icon="filenew.png" method="alert('new')" resource="text.new" /> 
      </menu> 
    </window> 
  </application> 
</plugin>
```

### etc/l10n/testplugin.properties
sierra-os attempts to enforces some best practices including externalization of language-specific strings into properties files. these properties files are then dynamically chosen based on the user's browser specified locale preferences. In our example, we have created 1 properties file: `etc/l10n/testplugin.properties` which is the default properties file used if a better match is not found. 

If we wanted to also support german language strings, we would simply create another properties file `etc/l10n/testplugin_de.properties` and populate it with the same language strings as `etc/l10n/testplugin.properties`. Then if the application was accessed using a browser with a higher preference for german language, that properties file would automatically be used. 

The following is the content of `etc/l10n/testplugin.properties` for the purposes of this tutorial: 

```
HelloWorld=My Test App Hello
World.about=This is my first application 
HelloWorld.content=This is the content that will be displayed in my window These strings correspond with our application key and about attributes where key is the application name, and about is the string displayed when the user selects About from the application menu
```

### tpl/hello-world.tpl
The last step of this tutorial is to create the smarty template that will be used as the content of our HelloWorld application window. Note our use of the smarty object reference $plugins.testplugin->resources which is a reference to our resource bundle `etc/l10n/testplugin.properties` which is used for locale-safe output of: "This is the content that will be displayed in my window"

```
{$plugins.testplugin->resources->getString('HelloWorld.content')}
```

### Testing
Now reload sierra-os in your browser window. if all was successful, you should see "My Test App" in your applications menu. Clicking on that should load your application.

## Conclusion
Once you are done with this tutorial you can delete your plugin from sierra-os simply by recursively deleting its directory: `rm -rf /path/to/sierra-os/plugins/testplugin`

This tutorial has not addressed some of the more powerful and complex capabilities provided by sierra-os including entity models, adding entities to the sierra-os federated search, ajax and dynamic application behavior and much more. If you are interested in utilizing these features, please review the plugin.dtd documentation and look through the files and code provided by the AccessoriesPlugin and the ProductivityPlugin.
