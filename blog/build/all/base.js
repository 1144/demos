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


/* ===== core/string/trim.js ===== */
mok["trim"]=function(require, module, exports){


	var rtrimLeft = /^\s\s*/g,
		rtrimRight = /\s\s*$/g;

	function trim(str){
		return str ? String(str).replace(rtrimLeft, '').replace(rtrimRight, '') : String(str);
	}
	
	module.exports = trim;

};


/* ===== main/base.js ===== */
mok["main/base"]=function(require, module, exports){

	require('trim'); //引用trim模块

};

require("main/base");
