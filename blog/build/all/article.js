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


/* ===== biz/title.js ===== */
mok["biz/title"]=function(require, module, exports){

	var trim = require('trim');

	var name = '    title   !  ';

	console.log(trim(name));


};


/* ===== core/string/parseJSON.js ===== */
mok["core/string/parseJSON"]=function(require, module, exports){

	
	module.exports = function(jsonString){
		try{
			return (new Function('return '+jsonString))();
		}catch(e){console.log(e);return null}
	};

};


/* ===== biz/content.js ===== */
mok["biz/content"]=function(require, module, exports){

	var trim = require('trim');

	var content = '      content   !    ';

	console.log(trim(content));


	var parseJSON = require('core/string/parseJSON');
	console.log( parseJSON('{a:1}') );


};


/* ===== main/article.js ===== */
mok["main/article"]=function(require, module, exports){

	require('biz/title');
	require('biz/content');

};

require("main/article");
