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
 
// {{{
/**
 * this class is used to manage all external interraction with the virtual file 
 * system. the global variable (VFS) may be used to reference a single instance 
 * of this class. additional instances should not be instantiated. this class 
 * contains primarily methods similiar to those used within a unix file system
 * 
 * all of the methods in this class are invoked asynchronously, meaning a return 
 * result will be not immediately available. most methods have similiar 
 * parameters with the following definitions:
 * 
 * 'nodes': the ids of the nodes to apply the operation to. alternatively, this 
 * array may contain one of the following identifiers:
 *  Core_Vfs.FOLDER_DESKTOP: the active desktop (workspace) folder node
 *  Core_Vfs.FOLDER_HOME:    the user's home folder node
 *  Core_Vfs.FOLDER_NETWORK: the root network folder node
 *  Core_Vfs.FOLDER_TRASH:   the user's trash folder node
 *  null:                    the virtual root node
 * or a string path identifier. the wildcard character '*' is supported in 
 * path strings. if this parameter is null, the operation will apply to the 
 * virtual root folder node. if this parameter is a single scalar value instead 
 * of an array, then the return results
 * 
 * 'target': the object to invoke the callback methods on. if null, the 
 * callbacks will be invoked statically. if target is a string, the callback 
 * methods will be searched for using the following search order:
 *   1) OS.getWindowInstance(document.getElementById(target)).getAppInstance().getManager()
 *   2) OS.getWindowInstance(document.getElementById(target)).getAppInstance()
 *   3) OS.getWindowInstance(document.getElementById(target)).getManager()
 *   4) OS.getWindowInstance(document.getElementById(target))
 *   5) document.getElementById(target)
 * callbacks will not be invoked if target cannot be located
 * 
 * 'callback': the method to invoke when results are available for the requested 
 * operation. the signature for this and the 'updateCallback' method should be:
 * (results : hash, status : int) : void or 
 * (result : mixed, status : int) : void when 'nodes' is a single scalar 
 * value, is not a path ending in the wildcard character, and 'recursive' is not 
 * true. The results hash will be an associative array indexed by node id (or 
 * by the 'nodes' 'id' value if an error occurs) and 'status' is an 
 * SRAOS.AJAX_STATUS_* code (SRAOS.AJAX_STATUS_SUCCESS == success, all others 
 * signify a problem). The status code will be set to SRAOS.AJAX_STATUS_FAILED 
 * if a method specified error has occurred. the value(s) returned in the 
 * result(s) will be dependent on the operation invoked. for 'getNodes' they 
 * will be either a CoreVfsNode object or an error String.
 * 
 * 'updateCallback': similiar to 'callback', but invoked whenever a change to 
 * nodes returned previously via 'callback' is detected
 * 
 * 'recursive': operate on directories recursively
 *
 * 'preserveRoot': do not operate recursively on the root directory (/)
 *
 * 'traverseLinks': whether or not to traverse links when operation is recursive
 *
 * 'linkStopDir': traverse symbolic links until a directory is encountered when 
 * operation is recursive
 *
 * 'maxRecursion': the max # of levels to apply recursion in this operation (1 
 * indicates only the directory being operated on and that directory's immediate 
 * children)
 * 
 */
Core_Vfs = function() {
  // attributes
  
  /**
   * this array stores a single reference to previously retrieved nodes indexed 
   * by node path
   * @type Array
   */
  this._cache = new Array();
  
  /**
   * this array stores references to targets and updateCallback methods that 
   * should be invoked when a particular node is updated in this._cache. the 
   * index in this array is the node id, and the value is a hash containing the 
   * keys "target" and "updateCallback"
   * @type Array
   */
  this._cacheUpdateCallbacks = new Array();
  
  /**
   * queue used to store the pending requests
   * @type Array
   */
  this._queue = new Array();
  
  /**
   * semaphore for the request queue
   * @type boolean
   */
  this._queueSem = true;
  

	// {{{ chgrp
	/**
	 * changes the group ownership of a node or nodes
   * @param mixed nodes (see class api comments)
   * @param mixed groupId the gid or name of the new group
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @access  public
	 * @return void
	 */
	this.chgrp = function(nodes, groupId, target, callback, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    var params = this._getBaseParams(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion);
    params.push(new SRAOS_AjaxServiceParam('group', groupId));
    OS.ajaxInvokeService('core_chgrp', this, '_processResponse', null, null, params, this._enQueue('chgrp', target, callback));
	};
	// }}}
  
  
	// {{{ chmod
	/**
	 * changes the permissions of node or nodes
   * @param mixed nodes (see class api comments)
   * @param String[] mode the permissions mode to apply to the 'nodes' specified. 
   * this may be either a symbolic or an octal representation
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @access  public
	 * @return void
	 */
	this.chmod = function(nodes, mode, target, callback, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    var params = this._getBaseParams(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion);
    params.push(new SRAOS_AjaxServiceParam('permissions', Core_Vfs.convertPermissions(mode)));
    if (mode.indexOf('-') != -1 || mode.indexOf('+') != -1) { params.push(new SRAOS_AjaxServiceParam('op', mode.indexOf('-') != -1 ? '-' : '+')); }
    OS.ajaxInvokeService('core_chmod', this, '_processResponse', null, null, params, this._enQueue('chmod', target, callback));
	};
	// }}}
  
  
	// {{{ chown
	/**
	 * changes the ownership of a node or nodes
   * @param mixed nodes (see class api comments)
   * @param mixed ownerId the uid or name of the new owner
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @access  public
	 * @return void
	 */
	this.chown = function(nodes, ownerId, target, callback, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    var params = this._getBaseParams(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion);
    params.push(new SRAOS_AjaxServiceParam('user', ownerId));
    OS.ajaxInvokeService('core_chown', this, '_processResponse', null, null, params, this._enQueue('chown', target, callback));
	};
	// }}}
  
  
	// {{{ cp
	/**
	 * copies a node or nodes
   * @param mixed nodes (see class api comments)
   * @param mixed dest path to or id of the directory to copy 'nodes' to
   * @param boolean force Force overwrite (do not prompt for confirmation) of 
   * existing files (CAREFUL: existing files and directories will be deleted)
   * @param boolean link Link nodes in 'dest' instead of copying
   * @param String[] preserve node attributes to preserve. attribute options 
   * include:
   *  mode:       the file permissions
   *  ownership:  the file ownership (user and group)
   *  timestamps: the created and updated timestamps
   *  created:    the created timestamp
   *  updated:    the last updated timestamp
   *  all:        preserve all attributes
   *  none:       do not preserve any attributes
   * @param boolean update copy only when the source file is newer than the 
   * destination file or when the destination file does not exist
   * @param boolean useOverwriteCode if 'force' is false, this parameter 
   * determines whether the return value for overwriting 'nodes' should be the 
   * overwrite code Core_Vfs.OVERWRITING or an error message
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @access  public
	 * @return void
	 */
	this.cp = function(nodes, dest, force, link, preserve, update, useOverwriteCode, target, callback, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    var params = this._getBaseParams(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion);
    params.push(new SRAOS_AjaxServiceParam('dest', dest));
    params.push(new SRAOS_AjaxServiceParam('force', force));
    params.push(new SRAOS_AjaxServiceParam('link', link));
    params.push(new SRAOS_AjaxServiceParam('preserve', preserve));
    params.push(new SRAOS_AjaxServiceParam('update', update));
    params.push(new SRAOS_AjaxServiceParam('useOverwriteCode', useOverwriteCode));
    OS.ajaxInvokeService('core_cp', this, '_processResponse', null, null, params, this._enQueue('cp', target, callback));
	};
	// }}}
  
  
	// {{{ getNodes
	/**
	 * retrieves vfs nodes
   * @param mixed nodes (see class api comments)
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments) - if an individual node 
   * could not be retrieved, that value in the return value will be an error 
   * string
   * @param String updateCallback (nodes : Core_VfsNode[]) - (see class api comments)
   * @param boolean refresh whether or not to retrieve the node via ajax from 
   * the server even if it is already cached on the client
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @param String property if specified, ONLY this attribute of the valid 
   * nodes instances returned by the method invocation will be returned. Use 
   * this option to reduce data transfer for operations where only a specific 
   * property is needed. this value MUST be one of the common attributes between 
   * the local javascript class Core_VfsNode and the server-side PHP class 
   * CoreVfsNodeVO
   * @access  public
	 * @return void
	 */
	this.getNodes = function(nodes, target, callback, updateCallback, refresh, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion, property) {
    // check if cache has been initialized
    var homePath = OS.user.homeDir.getPathString(true);
    if (!VFS._cache[homePath]) {
      for(var i in OS.user.commonPlaces) {
        VFS._cache[OS.user.commonPlaces[i].getPathString(true)] = OS.user.commonPlaces[i];
      }
      VFS._cache[homePath] = OS.user.homeDir;
      VFS._cache[OS.user.trashDir.getPathString(true)] = OS.user.trashDir;
      VFS._cache[OS.user.workspacesDir.getPathString(true)] = OS.user.workspacesDir;
      VFS._cache[OS.user.workspaceDir.getPathString(true)] = OS.user.workspaceDir;
      VFS._cache[OS.homeDir.getPathString(true)] = OS.homeDir;
      VFS._cache[OS.networkDir.getPathString(true)] = OS.networkDir;
      VFS._cache[OS.rootDir.getPathString(true)] = OS.rootDir;
    }
    
    // check for cached results
    if (!refresh) {
      var missing = false;
      var cached = new Array();
      var evalNodes = SRAOS_Util.isArray(nodes) ? nodes : [nodes];
      for(var i in evalNodes) {
        var nodeMissing = false;
        var id = evalNodes[i];
        if (this._cache[id]) {
          cached[this._cache[id].id] = property ? this._cache[id][property] : this._cache[id];
        }
        else if (id == Core_Vfs.FOLDER_DESKTOP) {
          cached[OS.user.workspaceDir.id] = property ? OS.user.workspaceDir[property] : OS.user.workspaceDir;
        }
        else if (id == Core_Vfs.FOLDER_HOME) {
          cached[OS.user.homeDir.id] = property ? OS.user.homeDir[property] : OS.user.homeDir;
        }
        else if (id == Core_Vfs.FOLDER_NETWORK) {
          cached[OS.networkDir.id] = property ? OS.networkDir[property] : OS.networkDir;
        }
        else if (id == Core_Vfs.FOLDER_TRASH) {
          cached[OS.user.trashDir.id] = property ? OS.user.trashDir[property] : OS.user.trashDir;
        }
        else if (!id) {
          cached[0] = property ? OS.rootDir[property] : OS.rootDir;
        }
        else {
          nodeMissing = true;
          missing = true;
        }
        // remove from request if already cached
        if (!nodeMissing) {
          evalNodes = SRAOS_Util.removeFromArray(i, evalNodes);
        }
      }
      if (!missing) {
        var firstNode;
        for(var i in cached) { firstNode = cached[i]; break; }
        if (callback) { this._executeCallback(target, callback, SRAOS_Util.isArray(nodes) ? cached : firstNode, SRAOS.AJAX_STATUS_SUCCESS); }
        return;
      }
    }
    
    var firstNode;
    for(var i in evalNodes) { firstNode = evalNodes[i]; break; }
    nodes = SRAOS_Util.isArray(nodes) ? evalNodes : firstNode;
    var params = this._getBaseParams(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion);
    var queueId = this._enQueue('getNodes', target, callback, updateCallback);
    
    if (property) { 
      params.push(new SRAOS_AjaxServiceParam('property', property));
      this._queue['property'] = property;
    }
    OS.ajaxInvokeService('core_getNodes', this, '_processResponse', null, null, params, queueId);
	};
	// }}}
  
  
	// {{{ ln
	/**
	 * makes a link between 2 nodes
   * @param mixed node (see class api comments) - singular
   * @param mixed dest where the link should be created. either a reference to a 
   * Core_VfsNode instance or a string path identifier to that node
   * @param String name the name for the linked node. if not specified, the name 
   * of the linked to node will be used
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @access  public
	 * @return void
	 */
	this.ln = function(node, dest, name, target, callback) {
    // TODO
	};
	// }}}
  
  
	// {{{ ls
	/**
	 * lists a folder nodes contents
   * @param mixed node (see class api comments) - singular
   * @param mixed target (see class api comments)
   * @param String callback (nodes : Core_VfsNode[]) - (see class api comments)
   * @param String updateCallback (nodes : Core_VfsNode[]) - (see class api comments)
   * @param boolean refresh whether or not to retrieve the contents via ajax 
   * from the server even if they are already cached on the client
   * @access  public
	 * @return void
	 */
	this.ls = function(node, target, callback, updateCallback, refresh) {
    // TODO
	};
	// }}}
  
  
	// {{{ mkdir
	/**
	 * creates a new directory node or nodes
   * @param mixed dest where the directory should be created. either a reference 
   * to a Core_VfsNode instance or a string path identifier to that node. if a 
   * path string is specified, it may also contain the new directory name in 
   * which case the name parameter will not be required
   * @param mixed name the name or names of the directory to create. this may be 
   * either a single value or an array of strings containing 1 element per 
   * directory to be created
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @access  public
	 * @return void
	 */
	this.mkdir = function(dest, names, target, callback) {
    // TODO
	};
	// }}}
  
  
	// {{{ mv
	/**
	 * moves a node or nodes
   * @param mixed nodes (see class api comments) 
   * @param mixed dest where the node should be moved to. either a reference to 
   * a Core_VfsNode instance or a string path identifier to that node. if nodes 
   * contains only a single value and this value is a path string, it may also 
   * specify a new name within the destination to assign to the node (in which 
   * case the 'name' parameter will be unecessary)
   * @param String name a new name to assign to node. if not specified, the name 
   * will not be changed
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @access  public
	 * @return void
	 */
	this.mv = function(nodes, dest, name, target, callback) {
    // TODO
	};
	// }}}
  
  
	// {{{ rm
	/**
	 * permanently removes a node or nodes
   * @param mixed nodes (see class api comments) 
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @access  public
	 * @return void
	 */
	this.rm = function(nodes, target, callback, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    // TODO
	};
	// }}}
  
  
	// {{{ touch
	/**
	 * creates a new entity node
   * @param String name the name of the node. either the name to use within 
   * dest, or a full string path to the new node beginning with '/' (e.g. 
   * '/home/root/test') (required)
   * @param mixed dest the folder node where the node should be created 
   * (required). either a reference to a Core_VfsNode instance or a string path 
   * identifier to that node. if name already constains the path, this parameter 
   * is not required
   * @param int permissions the node permissions. if not specified, the user's 
   * umask will be used when the node is created anywhere except under the 
   * root network folder. in the case of the latter, the permissions of dest 
   * will automatically be assigned. see the Core_Vfs.chmod api documentation 
   * for more information on permissions
   * @param int size the node size
   * @param String type a valid entity code (see SRAOS_Entity) (required)
   * @param int entityId the primary key of the entity this node represents. if 
   * not specified, the entity type specified MUST support empty instance 
   * instantiation (using the 'can-create' attribute in the entity definition)
   * @param String icon a custom icon to use to represent this node. if not 
   * specified, the entity's icon will be used. the value specified will either 
   * be the name of an icon in the corresponding entity's 'icons' path or an 
   * absolute uri (beginning with '/' or 'http') with the keyword '#size#' 
   * imbedded (#size# will be replaced at runtime with the correct size)
   * @param boolean hideExtension whether or not the file extension in this 
   * node's name should be hidden (the substring following the last '.' in name)
   * @param SRAOS_AjaxServiceParam[] params if entityId is not specified, this 
   * parameter may be specified to provide the instantiation values for the new 
   * instance of this entity. these values will be passed to the constructor for 
   * that entity and will be persisted automatically by the vfs
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @access  public
	 * @return void
	 */
	this.touch = function(name, dest, permissions, size, type, entityId, icon, hideExtension, params, target, callback) {
    // TODO
	};
	// }}}
  
  
  // {{{ _enQueue
  /**
   * adds a request to the queue and returns the unique request id for that 
   * request
   * @param String method the name of the method invoked for this request
   * @param mixed target (see class api comments)
   * @param String callback (see class api comments)
   * @param String updateCallback (see class api comments)
   * @return int
   */
  this._enQueue = function(method, target, callback, updateCallback) {
    this._lockQueue();
    var id = this._queue.length;
    this._queue.push({ "method": method, "target": target, "callback": callback, "updateCallback": updateCallback });
    this._releaseQueue();
    return id;
  };
  // }}}
  
  // {{{ _executeCallback
  /**
   * performs a method invocation
   * @param mixed target the target containing the callback to invoke
   * @param string callback the callback to invoke
   * @param mixed args the callback invocation arguments
   * @param int status the results status code
   * @access  public
	 * @return void
	 */
  this._executeCallback = function(target, callback, args, status) {
    if (SRAOS_Util.isString(target)) {
      target = null;
      var windowInstance = OS.getWindowInstance(document.getElementById(target));
      var targets = [ windowInstance && windowInstance.getAppInstance() ? windowInstance.getAppInstance().getManager() : null, windowInstance ? windowInstance.getAppInstance() : null, windowInstance ? windowInstance.getManager() : null, windowInstance ? windowInstance : null, document.getElementById(target) ];
      for(var i in targets) {
        if (targets[i] && targets[i][callback]) {
          target = targets[i];
        }
      }
    }
    
    if (target && callback) {
      target[callback](args, status);
    }
    else if (callback) {
      Core_Vfs._tmp[callback] = response.results;
      Core_Vfs._tmp[callback + '_status'] = status;
      eval(callback + '(Core_Vfs._tmp["' + callback + '"], Core_Vfs._tmp["' + callback + '_status"])');
      Core_Vfs._tmp[callback] = null;
      Core_Vfs._tmp[callback + '_status'] = null;
    }
    
  };
  // }}}
  
  // {{{ _getBaseParams
  /**
   * constructs the base ajax request params array for a request
   * @param mixed nodes (see class api comments) 
   * @param boolean recursive (see class api comments)
   * @param boolean preserveRoot (see class api comments)
   * @param boolean traverseLinks (see class api comments)
   * @param boolean linkStopDir (see class api comments)
   * @param int maxRecursion (see class api comments)
   * @return Array
   */
  this._getBaseParams = function(nodes, recursive, preserveRoot, traverseLinks, linkStopDir, maxRecursion) {
    var params = new Array(new SRAOS_AjaxServiceParam('workspaceId', OS.workspace.workspaceId));
    if (nodes) { params.push(new SRAOS_AjaxServiceParam('ids', nodes)); }
    if (recursive) { params.push(new SRAOS_AjaxServiceParam('recursive', true)); }
    if (preserveRoot) { params.push(new SRAOS_AjaxServiceParam('preserveRoot', true)); }
    if (traverseLinks) { params.push(new SRAOS_AjaxServiceParam('traverseLinks', true)); }
    if (linkStopDir) { params.push(new SRAOS_AjaxServiceParam('linkStopDir', true)); }
    if (maxRecursion) { params.push(new SRAOS_AjaxServiceParam('maxRecursion', maxRecursion)); }
    return params;
  };
  // }}}
  
  // {{{ _processResponse
  /**
   * handles ajax request responses
   *   Target Search Order
   *   1) OS.getWindowInstance(document.getElementById(target)).getAppInstance().getManager()
   *   2) OS.getWindowInstance(document.getElementById(target)).getAppInstance()
   *   3) OS.getWindowInstance(document.getElementById(target)).getManager()
   *   4) OS.getWindowInstance(document.getElementById(target))
   *   5) document.getElementById(target)
   * @param Object response the ajax response
   * @access  public
	 * @return void
	 */
  this._processResponse = function(response) {
    var plugin = OS.getPlugin('core');
    var request = this._queue[response.requestId];
    var target = request.target;
    
    // cache nodes
    if (request.method == 'getNodes' && response.status == SRAOS.AJAX_STATUS_SUCCESS) {
      // cache if request was not for a single property
      if (!request.property) {
        if (response.results.getPathString) {
          response.results = Core_VfsNode.newInstanceFromEntity(response.results);
          this._cache[response.results.getPathString(true)] = response.results;
        }
        else {
          for(var i in response.results) {
            if (SRAOS_Util.isObject(response.results[i])) {
              response.results[i] = Core_VfsNode.newInstanceFromEntity(response.results[i]);
              this._cache[response.results[i].getPathString(true)] = response.results[i];
            }
          }
        }
      }
    }
    else if (response.status != SRAOS.AJAX_STATUS_SUCCESS) {
      response.results = OS.getString(SRAOS.SYS_ERROR_RESOURCE);
    }
    else {
      // detect method specific errors
      if ((request.method == 'chgrp' || request.method == 'chown' || request.method == 'chmod' || request.method == 'cp') && (!response.results || SRAOS_Util.isString(response.results))) {
        response.results = response.results ? response.results : OS.getString(SRAOS.SYS_ERROR_RESOURCE);
        response.status = SRAOS.AJAX_STATUS_FAILED;
      }
    }
    
    this._lockQueue();
    this._queue = SRAOS_Util.removeFromArray(response.requestId, this._queue);
    this._releaseQueue();
    this._executeCallback(request.target, request.callback, response.results, response.status);
  };
  // }}}
  
  
  // {{{ _lockQueue
  /**
   * used to get a lock on the request queue using the queue semaphore. a queue
   * lock must be followed by a release using the _releaseQueue method
   * @return void
   */
  this._lockQueue = function() {
    while(!this._queueSem) { }
    this._queueSem = false;
  };
  // }}}
  
  
  // {{{ _releaseQueue
  /**
   * used to release a lock on the request queue
   * @return void
   */
  this._releaseQueue = function() {
    this._queueSem = true;
  };
  // }}}
  
  
};

// {{{ convertOctalPermissions
/**
 * converts an octal permission string to a numeric representation of that 
 * octal value
 * @param String octal the octal value to convert. missing digits will be 
 * assumed to be leading zeros
 * @return int
 */
Core_Vfs.convertOctalPermissions = function(octal) {
  // make sure it is a string
  octal = octal + '';
  var numeric = 0;
  for(var i=0; i<octal.length; i++) {
    numeric += ((octal[octal.length - i - 1] * 1) << (i*3));
  }
  return numeric;
};
// }}}

// {{{ convertPermissions
/**
 * converts an octal or symbolic permission string to a numeric representation 
 * of that value
 * @param String mode the octal or symbolic permissions string to convert
 * @return int
 */
Core_Vfs.convertPermissions = function(mode) {
  return SRAOS_Util.isNumeric(mode) ? Core_Vfs.convertOctalPermissions(mode) : Core_Vfs.convertSymbolicPermissions(mode);
};
// }}}

// {{{ convertSymbolicPermissions
/**
 * converts a symbolic permissions string ([target][op][permissions]) to a 
 * numeric value representing the [target] and [permissions] bits defined in 
 * this string. this value can then be used according the [op] to adjust the 
 * permissions accordingly
 * @param String symbolic the symbolic permissions string to convert
 * @return int
 */
Core_Vfs.convertSymbolicPermissions = function(symbolic) {
  var op = symbolic.indexOf('=') != -1 ? '=' : (symbolic.indexOf('+') != -1 ? '+' : '-');
  var target = symbolic.indexOf(op) ? symbolic.substr(0, symbolic.indexOf(op)) : 'a';
  target = target.indexOf('a') != -1 ? 'ugo' : target;
  var permissions = symbolic.substr(symbolic.indexOf(op) + 1);
  var numeric = 0;
  for(var i=0; i<target.length; i++) {
    for(var n=0; n<permissions.length; n++) {
      if (permissions[n] == 'i') { numeric = numeric | Core_Vfs.PBIT_INHERIT; continue; }
      if (permissions[n] == 'h') { numeric = numeric | Core_Vfs.PBIT_HIDDEN; continue; }
      if (permissions[n] == 's' && target[i] == 'u') { numeric = numeric | Core_Vfs.PBIT_USERID; continue; }
      if (permissions[n] == 's' && target[i] == 'g') { numeric = numeric | Core_Vfs.PBIT_GROUPID; continue; }
      if (permissions[n] == 't' && target[i] == 'o') { numeric = numeric | Core_Vfs.PBIT_STICKY; continue; }
      numeric = numeric | ((permissions[n] == 'r' ? Core_Vfs.PBIT_READ : (permissions[n] == 'w' ? Core_Vfs.PBIT_WRITE : (permissions[n] == 'x' ? Core_Vfs.PBIT_EXECUTE : 0))) >> (target[i] == 'g' ? 3 : (target[i] == 'o' ? 6 : 0)));
    }
  }
  return numeric;
};
// }}}

/**
 * used to store temp variables for static method invocations
 * @type Array
 */
Core_Vfs._tmp = new Array();

// constants

/**
 * Core_VfsNode.type for a file entity node
 * @type String
 */
Core_Vfs.FILE = 'core:CoreFile';

/**
 * Core_VfsNode.type for a folder node
 * @type String
 */
Core_Vfs.FOLDER = 'folder';

/**
 * Core_VfsNode.type for a desktop folder node (system)
 * @type String
 */
Core_Vfs.FOLDER_DESKTOP = 'folder_desktop';

/**
 * Core_VfsNode.type for a home folder node (system)
 * @type String
 */
Core_Vfs.FOLDER_HOME = 'folder_home';

/**
 * Core_VfsNode.type for the root network folder node (system)
 * @type String
 */
Core_Vfs.FOLDER_NETWORK = 'folder_network';

/**
 * Core_VfsNode.type for a system folder node (system)
 * @type String
 */
Core_Vfs.FOLDER_SYSTEM = 'folder_system';

/**
 * Core_VfsNode.type for a user's trash folder node (system)
 * @type String
 */
Core_Vfs.FOLDER_TRASH = 'folder_trash';

/**
 * the overwrite code - used to identify when a node will overwrite an existing 
 * node in a copy or move operation
 * @type int
 */
Core_Vfs.OVERWRITING = -1;

/**
 * an integer with the default permission bits set (00666)
 * @type int
 */
Core_Vfs.PBIT_DEFAULT_PERMISSIONS = 438;

/**
 * an integer with the default directory permission bits set (00777)
 * @type int
 */
Core_Vfs.PBIT_DEFAULT_PERMISSIONS_DIR = 511;

/**
 * an integer with all of the permission bits set. used for boolean operations
 * @type int
 */
Core_Vfs.PBIT_ALL = 16383;

/**
 * an integer with all of the default user permission bits set
 * @type int
 */
Core_Vfs.PBIT_DEFAULT_UALL = 448;

/**
 * an integer with all of the default group permission bits set
 * @type int
 */
Core_Vfs.PBIT_DEFAULT_GALL = 56;

/**
 * an integer with all of the default other permission bits set
 * @type int
 */
Core_Vfs.PBIT_DEFAULT_OALL = 7;

/**
 * an integer with all of the user permission bits set
 * @type int
 */
Core_Vfs.PBIT_UALL = 2496;

/**
 * an integer with all of the group permission bits set
 * @type int
 */
Core_Vfs.PBIT_GALL = 1080;

/**
 * an integer with all of the other permission bits set
 * @type int
 */
Core_Vfs.PBIT_OALL = 519;

/**
 * the bit utilized to identify that a node is hidden (not displayed with 
 * standard ls command)
 * @type int
 */
Core_Vfs.PBIT_HIDDEN = 8192;

/**
 * the bit utilized to identify inherit function in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_INHERIT = 4096;

/**
 * the bit utilized to identify set user ID function in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_USERID = 2048;

/**
 * the bit utilized to identify set group ID function in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_GROUPID = 1024;

/**
 * the bit utilized to identify set sticky function in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_STICKY = 512;

/**
 * the bit utilized to identify user read access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_READ = 256;

/**
 * the bit utilized to identify user write access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_WRITE = 128;

/**
 * the bit utilized to identify user exec access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_EXECUTE = 64;

/**
 * the bit utilized to identify group read access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_GREAD = 32;

/**
 * the bit utilized to identify group write access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_GWRITE = 16;

/**
 * the bit utilized to identify group exec access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_GEXECUTE = 8;

/**
 * the bit utilized to identify other read access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_OREAD = 4;

/**
 * the bit utilized to identify other write access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_OWRITE = 2;

/**
 * the bit utilized to identify other exec access in the permissions bit string
 * @type int
 */
Core_Vfs.PBIT_OEXECUTE = 1;

// }}}


// {{{
/**
 * used to represent a node within a browser navigation view. the parameters for 
 * the constructor are described in the attribute api documentation shown below
 */
Core_VfsNode = function(id, access, dateCreated, dateModified, entityId, group, hideExtension, icon, linkedTo, name, numChildren, owner, parent, pathString, permissions, size, type) {
  /**
   * the unique identifier for this node
   * @type String
   */
  this.id = id;
  
  /**
   * bit string representing the active user's access permissions to this node
   * @type int
   */
  this.access = access;
  
  /**
   * used by SRAOS_TreeManager to determine whether or not this node has 
   * children that should be retrieved via an ajax request
   * @type Array
   */
  this.children = Core_VfsNode.isFolder(type) && numChildren > 0 ? SRAOS_Tree.AJAX_NODES : null;
  
  /**
   * the date this node was created
   * @type String
   */
  this.dateCreated = dateCreated;
  
  /**
   * the date this node was last modified
   * @type String
   */
  this.dateModified = dateModified;
  
  /**
   * the primary key of the entity this node represents (for entity nodes only)
   * @type int
   */
  this.entityId = entityId;
  
  /**
   * whether or not to hide the extension for this node (all text following the 
   * last period in the name)
   * @type boolean
   */
  this.hideExtension = hideExtension;
  
  /**
   * an optional custom icon to use to represent this node. this value will be 
   * either the name of an icon in the corresponding entity's 'icons' path or an 
   * absolute uri (beginning with '/' or 'http') with the keyword '#size#' 
   * imbedded (#size# will be replaced at runtime with the correct size)
   * @type String
   */
  this.icon = icon;
  
  /**
   * the id of the node that this node is linked to (for linked nodes only)
   * @type int
   */
  this.linkedTo = linkedTo;
  
  /**
   * the name to use to represent this node
   * @type String
   */
  this.name = name;
  
  /**
   * a hash containing the 'gid' and 'name' of the node group owner
   * @type Object
   */
  this.nodeGroup = group;
  
  /**
   * the number of children contained in node (for folder nodes only)
   * @type int
   */
  this.numChildren = numChildren;
  
  /**
   * a hash containing the 'uid' and 'name' of the node owner
   * @type Object
   */
  this.nodeOwner = owner;
  
  /**
   * a hash containing the 'id' and 'name' of the node parent node. id will be 
   * null for root level nodes
   * @type Object
   */
  this.parent = parent;
  
  /**
   * the node permissions. see the Core_Vfs.chmod api documentation for more 
   * information on permissions
   * @type int
   */
  this.permissions = permissions;
  
  /**
   * the node size in bytes
   * @type int
   */
  this.size = size;
  
  /**
   * the node type. either one of the Core_Vfs.FOLDER_* constant values or an 
   * entity identifier
   * @type String
   */
  this.type = type;
  
  
  // private attributes
  /**
   * a reference to the entity this node represents
   * @type SRAOS_Entity
   */
  this._entity = null;
  
  /**
   * if this node is not a folder, this value will reference an instance of the 
   * corresponding entity reference by this node (with the primary key property 
   * set. this attribute is accessible via the getEntityInstance method)
   * @type Object
   */
  this._entityInstance;
  
  /**
   * the path string for this node
   * @type String
   */
  this._pathString = pathString;
  
  
  // {{{ canCopy
  /**
   * returns true if the user can copy this node
   * @return boolean
   */
  this.canCopy = function() {
    return this.hasAccess(Core_Vfs.PBIT_READ) && !this.isSystemNode() && (!this.getEntity() || this.getEntity().isCanCopy()) ? true : false;
  };
  // }}}
  
  // {{{ canMove
  /**
   * returns true if the user can move this node
   * @return boolean
   */
  this.canMove = function() {
    return this.hasAccess(Core_Vfs.PBIT_WRITE) && !this.isSystemNode() && (!this.getEntity() || this.getEntity().isCanMove()) ? true : false;
  };
  // }}}
  
  // {{{ canRemoveFromSidebar
  /**
   * returns true if the user can remove this node from the sidebar
   * @return boolean
   */
  this.canRemoveFromSidebar = function() {
    return Core_BrowserManager.SIDEBAR_NODES[this.id] && this.type != Core_Vfs.FOLDER_DESKTOP && this.type != Core_Vfs.FOLDER_HOME &&  this.type != Core_Vfs.FOLDER_TRASH &&  this.type != Core_Vfs.FOLDER_NETWORK;
  };
  // }}}
  
  // {{{ getDescription
  /**
   * returns the node description (displayed when dragging)
   * @return String
   */
  this.getDescription = function() {
    return this.getLabel();
  };
  // }}}
  
  // {{{ getEntity
  /**
   * if this node is not a folder, this method will return a reference to the 
   * entity it represents
   * @return SRAOS_Entity
   */
  this.getEntity = function() {
    if (!this.isFolder() && !this._entity) {
      this._entity = SRAOS_Entity.getEntity(this.type);
    }
    return this._entity;
  };
  // }}}
  
  
  // {{{ getEntityInstance
  /**
   * if this node is not a folder, this value will reference an instance of the 
   * corresponding entity reference by this node
   * @return Object
   */
  this.getEntityInstance = function() {
    if (!this._entityInstance && !this.isFolder() && this.entityId) {
      this._entityInstance = SRAOS_Entity.newInstanceFromPk(this.type, this.entityId);
    }
    return this._entityInstance;
  };
  // }}}
  
	// {{{ getIcon
	/**
	 * returns the full uri path to the icon of the specified size
   * @param int size the icon size to return. if not specified, the smallest 
   * icon uri (16x16) will be returned
   * @access  public
	 * @return string
	 */
	this.getIcon = function(size) {
    return Core_VfsNode.getIcon(this, size ? size : 16, false);
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
    return Core_VfsNode.getIcon(this, size, true);
  };
	// }}}
  
	// {{{ getLabel
	/**
	 * returns the label for this node
   * @param boolean commonPlaces whether or not this label is being displayed 
   * in the common places sidebar. when true, the home directory name will be 
   * replaced with 'Home' and the workspace directory will be replaced with 
   * 'Desktop' (both in their localized form)
   * @access  public
	 * @return string
	 */
	this.getLabel = function(commonPlaces) {
    var localizedString = OS.getPlugin('core').getString(commonPlaces && this.type == Core_Vfs.FOLDER_HOME ? 'Browser.folder.home' : (commonPlaces && this.type == Core_Vfs.FOLDER_DESKTOP ? 'Browser.folder.desktop' : 'Browser.folder.' + this.name));
    var name = this.name;
    if (this.hideExtension && name.lastIndexOf('.') != -1) {
      name = name.substring(0, name.lastIndexOf('.'));
    }
    return localizedString ? localizedString : name;
  };
	// }}}
  
	// {{{ getPathString
	/**
	 * returns the path string identifier for this node. the shortcut '~' will be 
   * used to represent the user's home directory
   * @param boolean full whether or not to abbreviate the path string with ~ for 
   * the user's home directory. if true, the abbreviation will not be made. 
   * @access  public
	 * @return string
	 */
	this.getPathString = function(full) {
    return !full && this._pathString.indexOf('/home/' + OS.user.userName) === 0 ? '~' + this._pathString.substr(6 + OS.user.userName.length) : this._pathString;
  };
	// }}}
  
	// {{{ getPermissionsString
	/**
	 * returns localize string to use to describe the permissions for this node
   * @access  public
	 * @return string
	 */
	this.getPermissionsString = function() {
    var str = this.isFolder() ? 'd' : '-';
    str += this.permissions & 16 ? 'r' : '-';
    str += this.permissions & 32 ? 'w' : '-';
    str += this.permissions & 4 ? 'r' : '-';
    str += this.permissions & 8 ? 'w' : '-';
    str += this.permissions & 1 ? 'r' : '-';
    str += this.permissions & 2 ? 'w' : '-';
    return str;
  };
	// }}}
  
	// {{{ getProperty
	/**
	 * returns the property specified for this node
   * @param String property the id of the property to return. this value should 
   * be one of the values in Core_BrowserManager.COLUMNS
   * @access  public
	 * @return string
	 */
	this.getProperty = function(property) {
    if (property == 'nodeOwner' || property == 'nodeGroup' || property == 'parent') {
      return this[property].name;
    }
    else if (property == 'permissions') {
      return this.getPermissionsString();
    }
    else if (property == 'type') {
      return this.getTypeLabel();
    }
    else if (property == 'name') {
      return this.getLabel();
    }
    else if (property == 'size') {
      return this.getSizeLabel();
    }
    return this[property];
  };
	// }}}
  
	// {{{ getSizeLabel
	/**
	 * returns the label to use for this node's size
   * @access  public
	 * @return string
	 */
	this.getSizeLabel = function() {
    var plugin = OS.getPlugin('core');
    var size = this.size;
    if (!size) { return '' };
    
    // bytes
    if (size < 1000) {
      return size + ' ' + plugin.getString('CoreVfsNode.size.byteAbbr');
    }
    // kilobytes
    size /= 1000;
    size = size.toFixed(2);
    if (size < 1000) {
      return size + ' ' + plugin.getString('CoreVfsNode.size.kbAbbr');
    }
    // megabytes
    size /= 1000;
    size = size.toFixed(2);
    return size + ' ' + plugin.getString('CoreVfsNode.size.mbAbbr');
  };
	// }}}
  
	// {{{ getType
	/**
	 * returns this objects type for dragging purposes
   * @access  public
	 * @return class
	 */
	this.getType = function() {
    return Core_VfsNode;
  };
	// }}}
  
	// {{{ getTypeLabel
	/**
	 * returns the label to use for this node's type
   * @access  public
	 * @return string
	 */
	this.getTypeLabel = function() {
    return this.isFolder() ? OS.getPlugin('core').getString('Browser.' + this.type) : SRAOS_Entity.getEntity(this.type).getLabel();
  };
	// }}}
  
	// {{{ hasAccess
	/**
	 * returns true if this node is an uploaded file
   * @access  public
	 * @return boolean
	 */
  this.hasAccess = function(level) {
    return (this.access & level) == level;
  };
  // }}}
  
	// {{{ isFile
	/**
	 * returns true if this node is an uploaded file
   * @access  public
	 * @return boolean
	 */
  this.isFile = function() {
    return this.type == Core_Vfs.FILE;
  };
  // }}}
  
	// {{{ isFolder
	/**
	 * returns true if this node is a folder
   * @access  public
	 * @return boolean
	 */
	this.isFolder = function() {
    return Core_VfsNode.isFolder(this.type);
  };
	// }}}
  
	// {{{ isSystemNode
	/**
	 * returns true if this is a system node (cannot be deleted, renamed or 
   * moved)
   * @access  public
	 * @return boolean
	 */
	this.isSystemNode = function() {
    return Core_VfsNode.isSystemNode(this.type);
  };
	// }}}
  
};


// {{{ getIcon
/**
 * returns the uri to the node's icon specified
 * @param Core_VfsNode node the node to return the icon uri for
 * @param int size the icon size to return. if not specified, the 16 pixel 
 * icon will be returned
 * @param boolean open whether or not to return the open icon for the node 
 * specified where applicable
 * @return String
 */
Core_VfsNode.getIcon = function(node, size, open) {
  size = size == 16 || size == 32 || size == 64 ? size : 16;
  var type = node.type;
  if (type == Core_Vfs.FOLDER || type == Core_Vfs.FOLDER_SYSTEM) {
    return OS.getIconUri(size, (!open ? 'folder.png' : 'folder_open.png'));
  }
  if (type == Core_Vfs.FOLDER_TRASH) {
    return OS.getIconUri(size, (node.numChildren > 0 ? 'trashcan_full.png' : 'trashcan_empty.png'));
  }
  var plugin = OS.getPlugin('core');
  if (type == Core_Vfs.FOLDER_DESKTOP) {
    return !open ? plugin.getIconUri(size, ('folder_desktop.png')) : OS.getIconUri(size, ('folder_open.png'));
  }
  if (type == Core_Vfs.FOLDER_HOME) {
    return !open ? plugin.getIconUri(size, ('folder_home.png')) : OS.getIconUri(size, ('folder_open.png'));
  }
  if (type == Core_Vfs.FOLDER_NETWORK) {
    return !open ? plugin.getIconUri(size, ('folder_network.png')) : OS.getIconUri(size, ('folder_open.png'));
  }
  // entity
  else {
    var entity = SRAOS_Entity.getEntity(type);
    var icon = node.icon ? (node.icon.indexOf('/') == 0 || node.icon.toLowerCase().indexOf('http') == 0 ? node.icon.replace(new RegExp("#size#", "gim"), size) : '/plugins/' + entity.getPluginId() + '/icons/' + size + '/' + node.icon) : entity.getIconPath(size);
    return icon;
  }
};
// }}}


// {{{ isFolder
/**
 * returns true if the node type specified is a folder, false if it is an 
 * entity
 * @param String type the node type
 * @return boolean
 */
Core_VfsNode.isFolder = function(type) {
  return type && type.indexOf && type.indexOf('folder') == 0;
};
// }}}


// {{{ isSystemNode
/**
 * returns true if this is a system node (cannot be deleted, renamed or moved)
 * @param String type the node type
 * @return boolean
 */
Core_VfsNode.isSystemNode = function(type) {
  return type.indexOf('folder_') == 0;
};
// }}}


// {{{ newInstanceFromEntity
/**
 * returns a new instance of Core_VfsNode from a CoreVfsNode object returned
 * from an ajax service invocation 
 * @param Object obj the CoreVfsNode dynamic javascript object
 * @return Core_VfsNode
 */
Core_VfsNode.newInstanceFromEntity = function(obj) {
  return new Core_VfsNode(obj.nodeId, obj.getUserPermissions, obj.dateCreated, obj.dateModified, obj.entityId, obj.getGroupHash, obj.hideExtension, obj.icon, obj.linkedTo, obj.name, obj.getNumChildren, obj.getOwnerHash, obj.getParentHash, obj.getPathString, obj.permissions, obj.size, obj.type);
};
// }}}


/**
 * global variable that may be used to reference the Core_Vfs instance
 * @type Core_Vfs
 */
var VFS = new Core_Vfs();
