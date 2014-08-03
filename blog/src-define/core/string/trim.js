define(function(require, exports, module){

	var rtrimLeft = /^\s\s*/g,
		rtrimRight = /\s\s*$/g;

	function trim(str){
		return str ? String(str).replace(rtrimLeft, '').replace(rtrimRight, '') : String(str);
	}
	
	module.exports = trim;

});
