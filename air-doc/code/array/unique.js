
	/*--
		删除数组里的重复元素。
		-as unique
		-author hahaboy
		-ver 0.0.1
		-p array arr 数组
		-p string [prop] 可选。如果是一个对象数组，那么根据每个对象的prop这个字段排重。
		-eg
			var unique = require('air/array/unique');
			unique([1, 3, 2, 1, 5, 1, '2', '1', null, 'null', null, '']); //返回[1, 3, 2, 5, '2', '1', null, 'null', '']
			unique([{a:1, b:3}, {a:2, b:1}, {a:5, b:1}], 'b'); //返回[{a:1, b:3}, {a:2, b:1}]
	*/
	module.exports = function(arr, prop){
		var map = {},
			res = [],
			i = 0,
			len = arr.length,
			v, k;

		if(prop){
			for(; i < len; i++){
				v = arr[i][prop];
				k = typeof v==='string' ? '_'+v : String(v);
				if(!map.hasOwnProperty(k)){
					res.push(arr[i]);
					map[k] = 1;
				}
			}
			return res;
		}
		for(; i < len; i++){
			v = arr[i];
			k = typeof v==='string' ? '_'+v : String(v);
			if(!map.hasOwnProperty(k)){
				res.push(v);
				map[k] = 1;
			}
		}
		return res;
	};
