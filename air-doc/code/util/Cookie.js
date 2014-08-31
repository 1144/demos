
	/*--
		cookie操作对象。
	*/
	Cookie = {
		/*--
			设置Cookie
			-p string name cookie名
			-p string|number value cookie值
			-p object [opt] opt里应该提供：
				<p>domain: cookie种到什么域，默认值letv.com</p>
				<p>path: cookie种到什么路径，默认值/</p>
				<p>exp: cookie过期时间，以小时为单位，默认是会话cookie。
					如果是一个数字，表示多少小时后cookie失效；
					如果是一个时间对象，表示在那个时间后失效；
					如果要存一个长期有效的cookie，该值写为'forever'，50年后过期。</p>
			-note 删除cookie：Cookie.set(name, null);
			-eg
				//最简单的种cookie
				Cookie.set('ts_env11', 'x-x_x,x.x=x%x;x$x\\x'); //只有-_.这3个字符不会被转义
				Cookie.set('ts_env12', 2);
				//5小时后过期的cookie
				Cookie.set('ts112', 'ffd892', {exp:5});
				//永远有效的cookie
				Cookie.set('ts2', 'some value', {exp:'forever'});
				trace(Cookie.get('ts_env11'));
				trace(Cookie.get('ts_env12'));
				//删除cookie
				Cookie.set('ts_env12', null);
				trace(Cookie.get('ts11'));
		*/
		set: function(name, value, opt){
			opt || (opt = {});
			var t = new Date(), exp = opt.exp;
			if(typeof exp==='number'){
				t.setTime(t.getTime() + exp*3600000); //60m * 60s * 1000ms
			}else if(exp==='forever'){
				t.setFullYear(t.getFullYear()+50); //专业种植cookie 50年
			}else if(value===null){ //删除cookie
				value = '';
				t.setTime(t.getTime() - 3600000);
			}else if(exp instanceof Date){ //传的是一个时间对象
				t = exp;
			}else{
				t = '';
			}
			document.cookie = name+'='+encodeURIComponent(value)+(t && '; expires='+t.toUTCString())+
				'; domain='+(opt.domain || '.letv.com')+'; path='+(opt.path || '/')+(opt.secure ? '; secure' : '');
		},
		/*--
			读取Cookie
			-p string name cookie名
			-r string cookie值
		*/
		get: function(name){
			name += '=';
			var cookies = (document.cookie || '').split(';'),
				cookie,
				nameLength = name.length,
				i = cookies.length;
			while(i--){
				cookie = cookies[i].replace(/^\s+/,'');
				if(cookie.slice(0,nameLength)===name){
					return decodeURIComponent(cookie.slice(nameLength)).replace(/\s+$/,'');
				}
			}
			return '';
		}
	};
