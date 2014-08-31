	var Cookie = {
		set: function(name, value){
			var t = new Date();
			t.setTime(t.getTime() + 5184000000); //two months: 2*30*24*60*60*1000
			document.cookie = name+'='+escape(value)+';path=/;expires='+t.toGMTString();
		},
		get: function(name){
			name += '=';
			var c = document.cookie, val = '', nl = name.length;
			if(c){
				c = c.replace(/\s/g, '').split(';');
				var i = c.length;
				while(i--){
					if(c[i].slice(0, nl)===name){
						val = unescape(c[i].slice(nl));
						break;
					}
				}
			}
			return val;
		}
	};

!function(window){
	if(window.Cpo){
		return;
	}
	function toJSON(str){
		try{
			return (new Function('return '+str))();
		}catch(e){return ''}
	}
	var _handlers = {}, //函数池
		_needlock = {}, //需要锁定的事件池，这些事件只允许单进程执行
		_busy = {}, //繁忙的事件池，在此池中的事件不允许再执行
		_kid = 1, //为需要锁定的事件动态分配一个值，解决“单进程”事件对不同元素可以同时执行的问题
		_bubble = true, //是否冒泡
		_KID = '_Cpo_8s1hj29c3x';

	window.Cpo = {
		//kname 事件名或事件集对象，支持“伪”命名空间。例如：feed.reblog
		on: function(kname, handler){
			if(handler){
				if(kname.charAt(0)==='-'){
					kname = kname.substr(1);
					_handlers[kname] || (_needlock[kname] = true);
				}
				//_handlers[kname] ? trace.err('Click handler "'+kname+'" has been defined!')
				//	: (_handlers[kname] = handler);
				_handlers[kname] || (_handlers[kname] = handler);
			}else{
				for(var k in kname){
					kname.hasOwnProperty(k) && this.on(k, kname[k]);
				}
			}
		},
		//从函数池中删除指定名称的处理函数，也可起到取消事件绑定的效果
		del: function(kname){
			delete _handlers[kname];
			delete _needlock[kname];
		},
		//给节点绑定事件
		click: function(elem, kname, handler){
			var kn = elem.getAttribute('cpo-name'),
				n = kname;
			kname.charAt(0)==='-' && (kname = kname.substr(1));
			if(!kn){
				elem.setAttribute('cpo-name', kname);
			}else if( (' '+kn+' ').indexOf(' '+kname+' ')<0 ){
				elem.setAttribute('cpo-name', kn+' '+kname);
			}
			if(handler){
				this.on(n, handler);
			}
		},
		//取消某节点上的事件绑定，取消绑定不会从函数池中删除处理函数，因为可能其它节点也在用
		off: function(elem, kname){
			var kn = elem.getAttribute('cpo-name');
			if(!kname || kn===kname){
				elem.removeAttribute('cpo-name');
			}else if(kn){
				elem.setAttribute('cpo-name', (' '+kn+' ').replace(' '+kname+' ', ' ').replace(/^\s|\s$/g, ''));
			}
		},
		//触发事件
		//ktarget, target, event参数可选（当然也可以是其他意义的参数，JS形参类型不固定哦）
		emit: function(kname, ktarget, target, event){
			if( _needlock[kname] && ktarget){
				ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
				if( _busy[kname+ktarget[_KID]] ){return}
				_busy[kname+ktarget[_KID]] = true;
			}
			var handler = _handlers[kname];
			handler && handler(ktarget, target, event);
		},
		data: function(elem, data){
			var kdata = elem.getAttribute('cpo-data'),
				newtype = typeof data;
			
			if(newtype==='undefined'){
				return kdata ? kdata.charAt(0)==='{' ? toJSON(kdata) : kdata : '';
			}else if(newtype==='object'){
				if(data===null){
					elem.setAttribute('cpo-data', '');
					return;
				}
				var k, v;
				if(kdata && kdata.charAt(0)==='{'){
					kdata = toJSON(kdata);
					if(kdata){
						for(k in data){
							kdata[k] = data[k];
						}
					}else{
						kdata = data;
					}
				}else{
					kdata = data;
				}
				data = [];
				for(k in kdata){
					v = kdata[k];
					data.push(k + ":" + (typeof v==="string" ? "'" + v.replace(/'/g, "\\\'") + "'" : v));
				}
				data = "{" + data.join(",") + "}";
			}
			elem.setAttribute('cpo-data', data);
		},
		//释放繁忙的事件（free 请翻译成“空闲的”。。）
		free: function(ktarget, kname){
			ktarget && delete _busy[kname+ktarget[_KID]];
		},
		//阻止Cpo事件向上冒泡
		stop: function(){_bubble=false}
	};
	
var addEvent = document.addEventListener ? function(elem, type, handler){
	if( elem && elem.addEventListener ){
		elem.addEventListener(type, handler, false);
	}
} : function(elem, type, handler){
	if( elem && elem.attachEvent ){
		elem.attachEvent('on'+type, handler);
	}
};
$(function(){
	//一切从这里开始
	addEvent(document.body, 'click', function(event){
		event || (event=window.event);
		var target = event.target || event.srcElement,
			ktarget = target,
			kname;
		
		while( ktarget && ktarget.nodeType===1 && _bubble ){
			kname = ktarget.getAttribute('cpo-name');
			if(kname){
				if( _needlock[kname] ){
					ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
					if( _busy[kname+ktarget[_KID]] ){
						ktarget = ktarget.parentNode;
						continue;
					}
					_busy[kname+ktarget[_KID]] = true;
				}
				var handler = _handlers[kname];
				if(handler){
					handler(ktarget, target, event);
				}else{
					var knames = kname.split(' '),
						i = 0, len = knames.length;
					for(; i<len; i++){
						kname = knames[i];
						if( _needlock[kname] ){
							ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
							if( _busy[kname+ktarget[_KID]] ){continue}
							_busy[kname+ktarget[_KID]] = true;
						}
						handler = _handlers[kname];
						handler && handler(ktarget, target, event);
					}
				}
			} //if kname end
			ktarget = ktarget.parentNode;
		}

		_bubble = true;
	});
});
	window.$007 = _handlers; //方便调试时查看函数列表，也可注释掉
}(window);

	var Url = {
		//私有属性
		_query: null,
		getQuery: function(name){
			var query = this._query;
			if(query===null){
				query = this._query = this.parseQuery(window.location.search.slice(1));
			}
			return name ? (query[name.toLowerCase()] || '') : query;
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
		}
	};

	//业务级功能开始
	var M = {};
	
	navigator.userAgent.toLowerCase().indexOf('msie')>0 && function(){
		$(document.body).prepend('<div style="text-align:center;background-color:#FFFCA8;padding:10px;">'+
			'请使用Chrome、Firefox等非IE浏览器浏览本站。不是我鄙视IE，我只是懒得兼容IE。。。</div>');
	}();

	//高亮左边的列表
	/* $('#article_list').length && function(){
		var $as = $('#article_list').find('a'),
			len = $as.length, i = 0,
			uri = location.pathname.replace('index.html', '');
		for(; i < len; i++){
			if($as[i].getAttribute('href')===uri && $as[i].className!=='folder'){
				$as[i].className += ' cur';
				break;
			}
		}
	}();*/

	$('#article_list').length && function(){
		var al = $('#article_list')[0], $win = $(window), fixing = false;
		al.style.top = '0px';
		$win.on('scroll', function(){
			var top = $win.scrollTop();
			if(top>132){
				fixing || (al.style.position = 'fixed', fixing = true);
			}else if(top<130){
				fixing && (al.style.position = '', fixing=false);
			}
		});
	}();

