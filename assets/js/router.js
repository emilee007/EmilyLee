window.router = (function(match){

	if(typeof match !== 'function'){
		throw 'routeMatcher is not loaded or defined.';
	}

	var _my = {
		navigateAwayCallback: null,
		ignoreHashChange: false,
		controllers: {},
		routes: []
	};

	function getHash(){
		if (window.location.hash) {
			return window.location.hash.substring(1);
		} else {
			return false;
		}
	}

	function _callControllerFromObj(id, params) {
		if (_my.controllers[id]) {
			_my.controllers[id].call(undefined, params);
		} else {
			throw("router: controller[" + id + '] does not exist.');
		}
	}

	/**
	 * Returns a hash string from a route ID and parameter map. If id does not exist, throws an Exception.
	 * @param id
	 * @param params
	 * @returns {*|String}
	 * @private
	 */
	function _getHashFromObj(id, params) {
		var hash = _my.routes[id];
		if (!hash) {
			throw("Undefined route '" + id + "'");
		}
		var rm = match(hash);
		return rm.stringify(params || {});
	}

	/**
	 * Returns an object with the id and params object {id:[String],params:{}} from a hash string. Returns false if no
	 * match was found.
	 * @param hash
	 * @returns {*}
	 * @private
	 */
	function _getObjFromHash(hash) {
		if (!hash) {
			return false;
		}

		for (var k in _my.routes) {
			if (_my.routes.hasOwnProperty(k)) {
				var rm = match(_my.routes[k]);
				var p = rm.parse(hash);
				if (p !== null) {
					return {id:k, params:p};
				}
			}
		}

		return false;
	}

	/**
	 * onHashChange event handler.
	 */
	function onHashChange() {

		var o = _getObjFromHash(getHash());
		if (o) {

			if(_my.ignoreHashChange){
				//ignore just once, then reset.
				_my.ignoreHashChange = false;
				return;
			}

			if(_my.navigateAwayCallback){
				if(!_my.navigateAwayCallback()){
					//halt if callback returns false, and go back to the previous route
					_my.ignoreHashChange = true;
					window.history.go(-1)
					return;
				}
			}

			_callControllerFromObj(o.id, o.params);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns an object which represents the current hash.
	 * @return {*}
	 */
	function status() {
		return _getObjFromHash(getHash());
	}

	/**
	 * Changes the hash, which then is handled by onHashChange, which calls the controller.
	 * @param id
	 * @param params
	 * @param {boolean=} doNotRoute //change the hash without actually routing
	 */
	function go2(id, params, doNotRoute) {

		var new_hash = _getHashFromObj(id, params || {});
		_my.ignoreHashChange = doNotRoute;

		//if the hashes are the same, just ignore.
		if(new_hash == window.location.hash.replace('#','')){
			return;
		}

		window.location.hash = new_hash;
	}

	/**
	 * Routes based on current hash. Returns true if a match was found, false otherwise.
	 * NavigateAwayCallback is ignored.
	 * @return bool
	 */
	function route() {
		var o = status(); //get current hash object.
		if (o) {
			_callControllerFromObj(o.id, o.params);
			return true;
		} else {
			return false;
		}
	}

	function init() {
		window.onhashchange = onHashChange;
	}

	/**
	 * Registers a callback to be called when navigating to a different route. If the callback DOESNT return true,
	 * the route change is cancelled. This callback must be unregistered with unregisterNavigateAwayCallback() when
	 * no longer needed.
	 * @param callback
	 */
	function registerNavigateAwayCallback(callback){
		_my.navigateAwayCallback = callback;
	}

	/**
	 * Unregisters the callback.
	 */
	function unregisterNavigateAwayCallback(){
		_my.navigateAwayCallback = null;
	}

	init();

	return {
		route:route,
		status:status,
		go2:go2,
		registerNavigateAwayCallback: registerNavigateAwayCallback,
		unregisterNavigateAwayCallback: unregisterNavigateAwayCallback,
		getObjFromHash: _getObjFromHash,
		setRoutes: function(routes){ _my.routes = routes; },
		setControllers: function(controllers){ _my.controllers = controllers; }
	};
})(routeMatcher);