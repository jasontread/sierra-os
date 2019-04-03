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

// {{{ SRA_AjaxServiceParam
/**
 * used to pass runtime parameteers to a global ajax service
 * 
 * @author  Jason Read <jason@idir.org>
 */
SRAOS_AjaxServiceParam = function(param, value, valueType) {
  // {{{ Attributes
  // public attributes
	
  /**
	 * the name of the parameter
	 * @type string
	 */
	this.param = param;
  
  /**
	 * the value of the parameter (see documentation for 
   * SRA_AjaxConstraint::valueType)
	 * @type string
	 */
	this.value = value;
  
  /**
	 * the value type. should correspond with one of the 
   * SRAOS_AjaxConstraint.CONSTRAINT_TYPE_* constants
	 * @type string
	 */
	this.valueType = valueType;
  
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
		return '<ws-param name="' + SRAOS_Util.escapeDoubleQuotes(this.param, '&quot;') + '"' + (this.valueType ? ' value-type="' + this.valueType + '"' : '') + '><![CDATA[' + SRAOS_AjaxServiceParam.encodeValue(this.value) + ']]></ws-param>';
	};
	// }}}
  
  // }}}
};


/**
 * encodes a value
 * @param String value the value to encode
 * @param boolean recursive whether or not this method has been recursively 
 * called
 * @return String
 */
SRAOS_AjaxServiceParam.encodeValue = function(value, recursive) {
  var noQuotes = false;
  if (value && value.getPHPDate) {
    value = "new SRA_GregorianDate('" + value.getPHPDate('Y-m-d H:i:s') + "')";
    noQuotes = true;
  }
  else if (value === null || typeof(value) == 'undefined') {
    value = 'NULL';
    noQuotes = true;
  }
  else if (value === true) {
    value = 'TRUE';
    noQuotes = true;
  }
  else if (value === false) {
    value = 'FALSE';
    noQuotes = true;
  }
  else if (SRAOS_Util.isArray(value) || SRAOS_Util.isObject(value)) {
    noQuotes = true;
    var isArray = SRAOS_Util.isArray(value);
    var tmp = "array(";
    var started = false;
    for(var i in value) {
      tmp += started ? ', ' : '';
      tmp += (!isArray ? SRAOS_AjaxServiceParam.encodeValue(i, true) + ' => ' : '') + SRAOS_AjaxServiceParam.encodeValue(value[i], true);
      started = true;
    }
    tmp += ")";
    value = tmp;
  }

  if (!noQuotes && recursive && SRAOS_Util.isString(value)) {
    value = '"' + SRAOS_Util.escapeDoubleQuotes(value) + '"';
  }
  return value;
};
// }}}

