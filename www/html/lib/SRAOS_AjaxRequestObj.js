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

// {{{ SRAOS_AjaxRequestObj
/**
 * used to identify an object that is being created, deleted, or updated via an 
 * ajax request
 * @param mixed id see below
 * @param (SRAOS_AjaxServiceParam[] | Array) attrs see below
 * @param int type see below
 * @param int workflowId see below
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_AjaxRequestObj = function(id, attrs, type, workflowId) {
  // {{{ Attributes
  // public attributes
  
  /**
	 * if the object is being retrieved, updated or deleted, this parameter should 
   * be the primary key of the object
	 * @type String
	 */
	this.id = id;
	
  /**
	 * if the object is being created or updated, this parameter should be an 
   * associative array of attribute name/value pairs representing the attributes 
   * values to use when creating/updating it
	 * @type SRAOS_AjaxServiceParam[]
	 */
  var newAttrs = new Array();
  for(var i in attrs) {
    newAttrs.push(attrs[i] && attrs[i].toXml ? attrs[i] : new SRAOS_AjaxServiceParam(i, attrs[i]));
  }
	this.attrs = newAttrs;
  
  /**
	 * the type of action that should occur to this object. this value must 
   * correspond with one of the SRAOS_AjaxRequestObj.TYPE_* constants. the 
   * default value is SRAOS_AjaxRequestObj.TYPE_RETRIEVE if id is specified but 
   * attrs is not, SRAOS_AjaxRequestObj.TYPE_UPDATE if both id and attrs are 
   * specified and SRAOS_AjaxRequestObj.TYPE_CREATE otherwise
	 * @type String
	 */
	this.type = type ? type : (id && attrs ? SRAOS_AjaxRequestObj.TYPE_UPDATE : (id ? SRAOS_AjaxRequestObj.TYPE_RETRIEVE : SRAOS_AjaxRequestObj.TYPE_CREATE));
  
  /**
	 * if the type is SRAOS_AjaxRequestObj.TYPE_RETRIEVE and the entity is stored 
   * within a workflow instance (see lib/workflow for more info), this attribute 
   * may be used to specify the workflow identifier. if this value is specified, 
   * this.id should be the identifier for that entity within the workflow
	 * @type int
	 */
	this.workflowId = workflowId;
  
  // private attributes
  
	
  // }}}
  
  // {{{ Operations

	// {{{ toXml
	/**
	 * returns the xml representation of this object
   * @access  public
	 * @return String
	 */
	this.toXml = function() {
		var tag = this.type == SRAOS_AjaxRequestObj.TYPE_CREATE ? "ws-create" : (this.type == SRAOS_AjaxRequestObj.TYPE_DELETE ? "ws-delete" : (this.type == SRAOS_AjaxRequestObj.TYPE_RETRIEVE ? "ws-retrieve" : "ws-update"));
    var xml = '\n  <' + tag + (this.id ? ' key="' + SRAOS_Util.escapeDoubleQuotes(this.id) + '"' : '') + (this.type == SRAOS_AjaxRequestObj.TYPE_RETRIEVE && this.workflowId ? ' workflow-id="' + SRAOS_Util.escapeDoubleQuotes(this.workflowId) + '"' : '') + '>';
    if (attrs) {
      for(i in this.attrs) {
        xml += '\n    ' + this.attrs[i].toXml();
      }
    }
    xml += '\n  </' + tag + '>';
    return xml;
	};
	// }}}
  
  // }}}
};

// constants
/**
 * identifies that the object should be created
 * @type int
 */
SRAOS_AjaxRequestObj.TYPE_CREATE = 1;

/**
 * identifies that the object should be deleted
 * @type int
 */
SRAOS_AjaxRequestObj.TYPE_DELETE = 2;

/**
 * identifies that the object should be retrieved
 * @type int
 */
SRAOS_AjaxRequestObj.TYPE_RETRIEVE = 3;

/**
 * identifies that the object should be updated
 * @type int
 */
SRAOS_AjaxRequestObj.TYPE_UPDATE = 4;

// }}}
