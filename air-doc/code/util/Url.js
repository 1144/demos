	/*--
		url相关工具
		-author hahaboy
		-eg
			var Url = require('air/util/Url');
	*/
	var Url = {
		//私有属性
		_query: null,
		/*--
			获取URL中的参数
			-p str name 参数名
			-r 参数值
			-note 所有返回值都是字符串
			-eg
				//URL: http://open.api.letv.com/ms?from=pc&or=1&dt=2
				Url.getQuery('dt'); //返回'2'
				Url.getQuery(); //返回对象：{from:'pc', or:'1', dt:'2'}
		*/
		getQuery: function(name){
			var query = this._query;
			if(query===null){
				query = this._query = this.parseQuery(window.location.search.slice(1));
			}
			return name ? (query[name.toLowerCase()]||'') : query;
		},
		/*--
			把一个对象序列化成URL参数字符串
			-p object query 参数对象
			-note 空字符串不能传
			-note 参数值会被进行encodeURIComponent编码
			-eg
				//返回 a=1&c=false&d=0
				Url.serializeQuery({a:1, b:'', c:false, d:0});
		*/
		serializeQuery: function(query){
			var k, v, p = [];
			for(k in query){
				v = query[k];
				v!=='' && query.hasOwnProperty(k) && p.push(k+'='+encodeURIComponent(v));
			}
			return p.join('&');
		},
		/*--
			解析URL参数格式的字符串
			-p string url 可以是url但不一定是url
		*/
		parseQuery: function(url){
			if(url.indexOf('?')>0){
				url = url.split('?')[1];
			}
			url = url.split('&');
			var query = {},
				i = url.length,
				p, j;
			while(i--){
				p = url[i];
				if(p){
					j = p.indexOf('=');
					v = p.slice(j+1);
					v && j>0 && (query[p.slice(0,j).toLowerCase()] = decodeURIComponent(v));
				}
			}
			return query;
		},
		/*--
			把一个URL拼接上一个参数对象
			-p string url url地址
			-p object query 参数对象
			-eg
				//返回 http://xyz.com/?a=1&e=0
				Url.serializeQuery('http://xyz.com/', {a:1, b:'', e:0});
		*/
		setQuery: function(url, query){
			if(url.indexOf('?')>0){
				var query = this.parseQuery(url);
				for(var k in query){
					query.hasOwnProperty(k) || 
						(query.hasOwnProperty(k) && (query[k] = query[k]));
				}
				url = url.split('?')[0];
			}
			return url + '?' + this.serializeQuery(query);
		}
	};

	module.exports = Url;
