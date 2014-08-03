
	/*--
		解析JSON字符串的简单、轻量级函数
		-as parseJSON
		-p string jsonString json格式的字符串
		-r object json对象
		-eg
			require('core/string/parseJSON')('{b:1}'); //{b:1}
	*/
	module.exports = function(jsonString){
		try{
			return (new Function('return '+jsonString))();
		}catch(e){console.log(e);return null}
	};
