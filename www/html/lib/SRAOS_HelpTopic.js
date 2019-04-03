// {{{ Header
/*
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 | SIERRA::OS : PHP RIA Framework      http://code.google.com/p/sierra-os  |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 | Copyright 2005 Jason Read                                               |
 |                                                                         |
 | Licensed under the Apache License, Version 2.0 (the "License");         |
 | you may not use this file except in compliance with the License.        |
 | You may obtain a copy of the License at                                 |
 |                                                                         |
 |     http://www.apache.org/licenses/LICENSE-2.0                          |
 |                                                                         |
 | Unless required by applicable law or agreed to in writing, software     |
 | distributed under the License is distributed on an "AS IS" BASIS,       |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.|
 | See the License for the specific language governing permissions and     |
 | limitations under the License.                                          |
 +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
 */
// }}}

// {{{ SRAOS_HelpTopic
/**
 * represents a plugin help-topic
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
SRAOS_HelpTopic = function(id, pluginId, hasContent, expanded, helpTopics, icon, iconUri, label) {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  
  /**
	 * the unique help topic identifier
	 * @type string
	 */
	this._id = id;
  
  /**
	 * the identifier of the plugin this help topic pertains to
	 * @type SRAOS_Plugin
	 */
	this._pluginId = pluginId;
  
  /**
	 * whether or not this help topic should be expanded initially. this only 
   * applies to help topics that contain sub-topics. by default, nodes are 
   * initially collapsed
	 * @type boolean
	 */
	this._expanded = expanded;
  
  /**
	 * whether or not this topic has content associated with it
	 * @type boolean
	 */
	this._hasContent = hasContent;
  
  /**
	 * nested help topics
	 * @type SRAOS_HelpTopic[]
	 */
	this._helpTopics = helpTopics && helpTopics.length > 0 ? helpTopics : null;
  
  /**
	 * an optional icon to use to represent this help topic in the help manual 
   * hierarchy. default icons are provided by the help manual if none is 
   * specified
	 * @type string
	 */
	this._icon = icon;
  
  /**
	 * the base icon uri
	 * @type string
	 */
	this._iconUri = iconUri;
  
  /**
	 * the label for this help topic
	 * @type string
	 */
	this._label = label;
	
  // }}}
  
  // {{{ Operations
	
  
  // public operations
  
  // getters/setters
  
	// {{{ getId
	/**
	 * returns the id of this help topic
   * @access  public
	 * @return string
	 */
	this.getId = function() {
		return this._id;
	};
	// }}}
  
	// {{{ getPluginId
	/**
	 * returns the pluginId of this help topic
   * @access  public
	 * @return string
	 */
	this.getPluginId = function() {
		return this._pluginId;
	};
	// }}}
  
	// {{{ getChildren
	/**
	 * returns the children of this help topic
   * @access  public
	 * @return SRAOS_HelpTopic[]
	 */
	this.getChildren = function() {
		return this._helpTopics;
	};
	// }}}
  
	// {{{ isExpanded
	/**
	 * returns the true if this help topic should be expanded initially
   * @access  public
	 * @return boolean
	 */
	this.isExpanded = function() {
		return this._expanded;
	};
	// }}}
  
	// {{{ isHasContent
	/**
	 * returns the true if this help topic has content associated with it
   * @access  public
	 * @return boolean
	 */
	this.isHasContent = function() {
		return this._hasContent;
	};
	// }}}
  
	// {{{ getHelpTopic
	/**
	 * returns the help topic specified or null if id is not valid
   * @param string id the id of the help topic to return
   * @access  public
	 * @return SRAOS_HelpTopic
	 */
	this.getHelpTopic = function(id) {
		for(var i=0; i<this._helpTopics.length; i++) {
      if (this._helpTopics[i].getId() == id) {
        return this._helpTopics[i];
      }
    }
    return null;
	};
	// }}}
  
	// {{{ getHelpTopics
	/**
	 * returns the helpTopics of this help topic
   * @access  public
	 * @return SRAOS_HelpTopic[]
	 */
	this.getHelpTopics = function() {
		return this._helpTopics;
	};
	// }}}
  
	// {{{ getIcon
	/**
	 * returns the full uri path to the icon of the specified size
   * @access  public
	 * @return string
	 */
	this.getIcon = function(size) {
		return this._icon && size ?  this._iconUri + size + '/' + this._icon : (this._helpTopics && this._helpTopics.length > 0 ? SRAOS_HelpTopic.TOPIC_ICON : SRAOS_HelpTopic.TOPIC_LEAF_ICON);
	};
	// }}}
  
	// {{{ getIconExpanded
	/**
	 * returns the full uri path to the expanded icon of the specified size 
   * (applies to non-leaf nodes only)
   * @access  public
	 * @return string
	 */
	this.getIconExpanded = function(size) {
    return SRAOS_HelpTopic.TOPIC_EXPANDED_ICON;
  };
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this help topic
   * @access  public
	 * @return string
	 */
	this.getLabel = function() {
		return this._label;
	};
	// }}}
	
	
	// Static methods
	
  
  // private operations

  
};
// }}}


// constants
/**
 * icon to use for a help topic with children
 * @type String
 */
SRAOS_HelpTopic.TOPIC_ICON = "topic.png";

/**
 * icon to use for an expanded help topic with children
 * @type String
 */
SRAOS_HelpTopic.TOPIC_EXPANDED_ICON = "topic-expanded.png";

/**
 * icon to use for a help topic without children
 * @type String
 */
SRAOS_HelpTopic.TOPIC_LEAF_ICON = "topic-leaf.png";
