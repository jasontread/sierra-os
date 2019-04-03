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

// {{{ SRA_AjaxConstraintGroup
/**
 * used to specify 1 or more ajax-constraint sub-elements that will be evaluated 
 * as a whole based on the "connective" specified for the group (either 
 * conjunction or disjunction). the evaluation includes short-circuiting for 
 * conjunction join types (and). any constraint groups defined for a service 
 * request will be ADDED to those defined for the service. Thus, all of the 
 * service defined constraint groups must match AND those defined for the 
 * service request
 * 
 * @param SRAOS_AjaxConstraint[] constraints the constraints that should be
 * applied to this constraint group
 * @param String connective the constraint group connective. the default 
 * connective (if not specified) is CONNNECTIVE_CONJUNCTIVE
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_AjaxConstraintGroup = function(constraints, connective) {
  // {{{ Attributes
  // public attributes
  
  /**
   * this constraint group's unique identifier
   * @type int
   */
  this._id = SRAOS_AjaxConstraintGroup._nextId++;
  
  /**
	 * nested constraints
	 * @type SRA_AjaxConstraint[]
	 */
	this.constraints = constraints;
  
  /**
	 * whether the connective between constraints of this group should be 
   * conjunctively or disjunctively joined. this value will correspond with one 
   * of the CONNNECTIVE_* constants
	 * @type string
	 */
	this.connective = connective;
  
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
		var xml = '<ws-constraint-group key="' + this._id + '"' + (this.connective ? ' connective="' + this.connective + '"' : '') + '>';
    if (this.constraints) {
      for(var i=0; i<this.constraints.length; i++) {
        xml += "\n    " + this.constraints[i].toXml();
      }
    }
    xml += '</ws-constraint-group>';
    return xml;
	};
	// }}}
  
  // }}}
};


/**
 * used to uniquely identify constraint groups
 * @type int
 */
SRAOS_AjaxConstraintGroup._nextId = 1;

// constants

/**
 * constant identifying a conjunctive constraint group
 * @type String
 */
SRAOS_AjaxConstraintGroup.CONNNECTIVE_CONJUNCTIVE = "and";

/**
 * constant identifying a disjunctive constraint group
 * @type String
 */
SRAOS_AjaxConstraintGroup.CONNNECTIVE_DISJUNCTIVE = "or";


// }}}
