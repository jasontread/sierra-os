# Overview
**sierra-os** is a PHP Single-Page Application (SPA) framework based on the [sierra-php](https://github.com/jasontread/sierra-php) framework created in 2006-2007. It is no longer under active development and being preserved for historical purposes only. sierra-os simulates a desktop UI in a browser window using only XHTML, CSS, Javascript and AJAX (no Flash, ActiveX, Java Applets, or other browser plugins are required). It provides a plugin-based archtecture for simple deployment of applications within the desktop environment. The framework itself provides the following features:

  * **Federated Search**: sierra-os includes federated search functionality allowing users to quickly search accross multiple plugin entities (searchable entities are defined in `plugin.xml`)
  * **User Management and Permissions**: sierra-os provides a highly granular multi-root, hierarchical user permissions system including the ability to restrict application usage, share workspaces, and designate user admin privileges. User management and permissions functionality can also be incorporated into plugin applications
  * **Group Management**: sierra-os provides Unix-like groups and group-based permissions which can be incorporated into plugin applications
  * **Workspace Management**: sierra-os allows users to maintain 1 or more distinct workspaces each of which maintains distinct settings including background, dock icons, dock size, dock visibility, login items, and theme preference. Additionally, a user may statefully toggle between workspaces
  * **Theme**: sierra-os utilizes a CSS-based theme architecture to provide full control of the look and feel
  * **Plugin Architecture**: sierra-os utilizes a plugin architecture wherein each plugin describes the applications, windows, searchable entities, and help manuals using an XML descriptor `plugin.xml` in the root directory of the plugin. Each plugin can additional implement custom entity (data) models, CSS, XHTML templates, properties files for localization, PHP classes and scripts, images, etc. as if they were standalone applications
  * **Localization**: sierra-os utilizes the localization features of the [sierra-php](https://github.com/jasontread/sierra-php) including externalization of all language strings into properties files and dynamic selection of the closest matching language/country strings based on the users' browser locale preferences
  * **Simple Ajax Integration**: sierra-os provides a runtime kernel that can be utilized to invoke Ajax calls and handle resonses from applications without the overhead of dealing with XMLHttpRequest and cross-browser compatibility issues
  * **Global Javascript Library**: sierra-os provides a Javascript library that applications may utilize for RIA behaviors including drag-and-drop, scrollbar pagination, Ajax service invocations, DOM manipulation, form processing and more
  
## Core Plugin
The base sierra-os distribution comes bundled with the core plugin. Although this plugin is optional, it is highly recommended and a common dependency of other plugins. The core plugin provides the following features:

  * **Federated Search**: the sierra-os federated search feature is made available using this application (accessible through the search icon in the upper right corner of the OS window)
  * **Spell Checker**: a spell checker application that can be invoked from any other applications. this application includes automated as well as callback-based corrections
  * **Help Manual**: the help manual entries defined in `plugin.xml` are made available using this application accessible automatically from the help menu or using a simple static Javascript call
  * **Terminal Application**: the core plugin provides a Unix-like terminal application with a limited, but extensible set of Unix-like commands
  * **Wiki Formatting**: the core plugin provides Wiki to XHTML conversion as well as a full help manual and sandbox for including wiki-based input formatting in other applications
  
## Screenshots
The desktop-like UI includes an application dock, windows, federated search, menus, and more

![Desktop](https://raw.githubusercontent.com/jasontread/sierra-os/master/doc/images/desktop-overview.png)

The `core` plugin provides a federated search application accessible from the search icon in the upper left corner of the desktop

![Search](https://raw.githubusercontent.com/jasontread/sierra-os/master/doc/images/core-federated-search.png)

The `core` plugin provides a spell checker application based on the [GNU Aspell](http://aspell.net) program. This spell checker supports multiple languages with automatic detection of the user's preferred language using browser locale settings

![Spell Checker](https://raw.githubusercontent.com/jasontread/sierra-os/master/doc/images/core-spell-checker.png)

The `core` plugin provides a help manual application used to display help manuals defined by plugins

![Wiki](https://raw.githubusercontent.com/jasontread/sierra-os/master/doc/images/core-wiki-sandbox.png)

The `core` plugin provides Wiki to XHTML conversion and a Wiki help manual and sandbox. Wiki conversion is performed using [PmWiki](https://www.pmwiki.org).

![Terminal](https://raw.githubusercontent.com/jasontread/sierra-os/master/doc/images/core-terminal.png)

The `core` plugin provides a Unix-like terminal application
