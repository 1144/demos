
	/*--
		计算字符串长度，将unicode字符计算为2个单位
		-p string str 源字符串
		-eg
			var byteLength = require('air/string/byteLength');
			byteLength('中国'); //4
			byteLength('中国2'); //5
	*/
	var byteLength = function(str){
		return (str || '').replace(/[^\x00-\xff]/g, '00').length;
	};

	module.exports = byteLength;
