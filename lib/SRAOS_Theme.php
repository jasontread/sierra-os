<?php
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

// {{{ Imports

// }}}

// {{{ Constants
/**
 * the app relative base themes directory
 * @type string
 */
define('SRAOS_THEME_BASE_DIR', '/www/html/themes/');

/**
 * the base uril to the themes directory
 * @type string
 */
define('SRAOS_THEME_BASE_URI', '/themes/');
// }}}

// {{{ SRAOS_Theme
/**
 * managed SIERRA::OS themes
 * 
 * @author  Jason Read <jason@idir.org>
 * @package sraos
 */
class SRAOS_Theme {
  // {{{ Attributes
  // public attributes
	
  // private attributes
  /**
	 * the unique name of the theme
	 * @type string
	 */
	var $_name;
	
  // }}}
  
  // {{{ Operations
  // constructor(s)
	// {{{ SRAOS_Theme
	/**
	 * this class should not be instantiated directly. instead, use the 
   * SRAOS_Theme::getTheme($name) singleton method to obtain a reference to an 
   * instance of this class
   * @access  private
	 */
	function SRAOS_Theme($name) {
		$this->setName($name);
	}
	// }}}
	
  
  // public operations
  // {{{ getBaseUri
	/**
	 * returns the base uri for this theme including trailing /
   * @param boolean $includePrefix whether or not to include the uri relative 
   * prefix
   * @access  public
	 * @return string
	 */
	function getBaseUri($includePrefix=TRUE) {
		return ($includePrefix ? SRAOS_URI_PREFIX : '') . SRAOS_THEME_BASE_URI . $this->getName() . '/';
	}
	// }}}
	
	// {{{ getName
	/**
	 * returns the name of this index
   * @access  public
	 * @return string
	 */
	function getName() {
		return $this->_name;
	}
	// }}}
	
	// {{{ setName
	/**
	 * sets the index name
	 * @param string $name the name to set
   * @access  public
	 * @return void
	 */
	function setName($name) {
		$this->_name = $name;
	}
	// }}}
	
	
	// Static methods
  
	// {{{ getTheme
	/**
	 * returns a SRAOS_Theme instance for the identified theme. This method should 
   * be used in place of direct instantiation to avoid unecessary object 
   * replication
	 *
	 * @param  string $name the unique name for the theme to return
	 * @access	public
	 * @return	SRAOS_Theme
	 */
	function & getTheme($name) {
    $themes =& SRAOS_Theme::getThemes();
		return isset($themes[$name]) ? $themes[$name] : NULL;
	}
	// }}}
  
	// {{{ getThemeOptions
	/**
	 * returns an associative array of theme name/label values that can be used 
   * to display a theme selection field for example
	 *
	 * @access	public
	 * @return	array
	 */
	function getThemeOptions() {
		$options = array();
    $themes =& SRAOS_Theme::getThemes();
    $rb =& SRA_Controller::getAppResources();
    $keys = array_keys($themes);
    foreach ($keys as $key) {
      $options[$themes[$key]->getName()] = $rb->getString('themes.' . $themes[$key]->getName());
    }
    return $options;
	}
	// }}}
  
	// {{{ getThemes
	/**
	 * returns a SRAOS_Theme instance for the identified theme. This method should 
   * be used in place of direct instantiation to avoid unecessary object 
   * replication
	 *
	 * @param  string $name the unique name for the theme to return
	 * @access	public
	 * @return	SRAOS_Theme[]
	 */
	function & getThemes() {
		static $themes = array();
    if (!count($themes)) {
      $dirs = SRA_File::getFileList(SRA_Controller::getAppDir() . SRAOS_THEME_BASE_DIR, '*', FALSE, 2);
      foreach ($dirs as $dir) {
        if (is_dir($dir) && substr(basename($dir), 0, 1) != '.') {
          $themes[basename($dir)] = new SRAOS_Theme(basename($dir));
        }
      }
    }
    return $themes;
	}
	// }}}
	
	// {{{ isValid
	/**
	 * Static method that returns true if the object parameter is a SRAOS_Theme object.
	 *
	 * @param  Object $object The object to validate
	 * @access	public
	 * @return	boolean
	 */
	function isValid( & $object ) {
		return (is_object($object) && (!isset($object->err) || !SRA_Error::isError($object->err)) && strtolower(get_class($object)) == 'sraos_theme');
	}
	// }}}
	
  
  // private operations

  
}
// }}}
?>