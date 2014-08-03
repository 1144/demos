/* MOKJS v1.0.0 */
if(!this.mok){
	var mok = {}, require = function(){
		var m = mok, done = {};
		return function(modname){
			if(done.hasOwnProperty(modname)){
				return done[modname];
			}
			done[modname] = function(){}; //jiandan-cubao-di break circular dependency
			var x = m[modname], module = {exports:{}};
			x(require, module, module.exports);
			m[modname] = null;
			return done[modname] = module.exports;
		}
	}();
	this.global || (global = this);
}


/* ===== biz/foo.js ===== */
mok["biz/foo"]=function(require, module, exports){

console.log('foo log.');

};


/* ===== biz/baz.js ===== */
mok["biz/baz"]=function(require, module, exports){

	console.log('baz log.');

	require('biz/foo');


};


/* ===== main/index.js ===== */
mok["main/index"]=function(require, module, exports){

	require('biz/baz');

};

require("main/index");
