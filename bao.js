+function(window){
	// Bao
		var Bao = function(){
		};

		Bao.extend = function (target) {
			var length = arguments.length, i = 1, p;
			for(; i < length; i++){
				for ( p in arguments[i] ) {
			        if (arguments[i].hasOwnProperty(p)) {
			            target[p] = arguments[i][p];
			        }
			    }
			}
		    return target;
		};

		Bao.classof = function(o){
			if (o === null) {return "NULL"};
			if (o === undefined) {return "UNDEFINED"};
			return Object.prototype.toString.call(o).slice(8, -1);
		};

	    Bao.random = function(){
	    	return (""+Math.random()).replace(".","");
	    };

	    Bao.getHtml = function(node){
	    	return node[0].outerHTML;
	    };


	// BaoComponent
		+function(){
			var revent = /<.*bao(\w*)="(\w*)"\s*[\s|>]/g;
			var rBaoSimple =  /(<.*)@(\w*="\w*"\s*[\s|>])/g;
			var events_map = {
				'onclick' : 'click',
				'onClick' : 'click'
			}
			function BaoComponent(params){
				this.node = null;
				this.html = '';
				Bao.extend(this, params);
				this.props = params.props || {}; // 用于储存不变的数据
				this.state = params.state || {}; // 用于储存变化的数据（通过setState调用，引发变化后，会重新绘图）
				this.tpl = params.tpl.replace(rBaoSimple, '$1bao$2'); // 用于绘图的模板
				this.preHandleFunc = params.preHandleFunc; // 用于预处理数据的函数
			}

			function drawNodeTPL(tpl,data){
				var hash = {};
	        	var content = tpl.replace(/\{(\w+)\}/g, function(m, key) {
	        		if (Bao.classof(data[key]) == "Array") {
	        			hash[key] = key + Bao.random();
	        			console.log(1111);
	        			return "<div class='" + hash[key] + "'></div>";
	        		} else if(data[key] instanceof BaoComponent){
	        			return data[key].render().html();
	        		} else if (typeof(data[key]) != "undefined") {
	                    return data[key];
	                } else {
	                    return m;
	                }
	            });
	            content = $(content);
	            for(var i in hash){
	            	Bao.renderBaoComponent(data[i], content.find("." + hash[i]), 'before');
	            	content.find("." + hash[i]).remove();
	            }
		        return content;
		    }

			Bao.extend(BaoComponent.prototype,{
				defaultPreHandleFunc : function(){
					return Bao.extend({},this.props, this.state);
				},
				setState : function(params){
					this.state = Bao.extend(this.state, params);
					var data = (typeof this.preHandleFunc === "function") ? this.preHandleFunc() : this.defaultPreHandleFunc();
					var node = drawNodeTPL(this.tpl, data);
					// 没有变化，不需要重新渲染
					if (Bao.getHtml(node) === this.html) {
						return;
					};
					// 变化之后，重新渲染
					this.html = Bao.getHtml(node);
					this.node.html(node.html());
					this.html && this._bindEvent();
				},
				_render : function(){
					var data = (typeof this.preHandleFunc === "function") ? this.preHandleFunc() : this.defaultPreHandleFunc();
					this.node = drawNodeTPL(this.tpl, data);
					this.html = Bao.getHtml(this.node);
					this.html && this._bindEvent();
					return this.node;
				},
				destory : function(){
					this.node.remove();
				},
				_bindEvent : function(){
					var res, event_type;
					while(res = revent.exec(this.html)){
						if (!(res && this.events && typeof this.events[res[2]] === 'function')) {
							return;
						};
						(function(res_t){
							event_type = events_map[res_t[1]] || res_t[1] || "";
							this.node.find("[bao"+res_t[1]+"='" + res_t[2] + "']").on(event_type, function(){
								return (this.events[res_t[2]].bind(this))();
							}.bind(this)).removeAttr("bao"+res_t[1]);
							this.node.attr("bao"+res_t[1]) === res_t[2] && this.node.on(event_type, function(){
								return (this.events[res_t[2]].bind(this))();
							}.bind(this)).removeAttr("bao"+res_t[1]);
						}.bind(this))(res)
					}
				},
				toString : function(){
					var data = (typeof this.preHandleFunc === "function") ? this.preHandleFunc() : this.defaultPreHandleFunc();
					return Bao.getHtml(drawNodeTPL(this.tpl, data));
				},
				render : function(target, method){
					method.apply($(target), this._render());
					(typeof this.componentDidMount === "function") && this.componentDidMount();
				}
			})

			var type2Method = {
				append : $.fn.append,
				after : $.fn.after,
				before : $.fn.before
			}
			Bao.extend(Bao, {
				// params contains tpl, preHandleFunc
				createBaoComponent : function(params){
					var BComponent = function(p){
						BaoComponent.call(this, Bao.extend({}, params, p));
					}
					BComponent.prototype = BaoComponent.prototype;
					return BComponent;
				},
				renderBaoComponent : function(c, target, type){
					if (type == undefined) {
						type = 'append';
					};
					var method = type2Method[type];
					var i;
					if (Bao.classof(c) == "Array") {
						str = c.forEach(function(cur){
							// method.apply($(target),cur.render());
							cur.render(target, method);
						});
					}else if(c instanceof BaoComponent){
						// method.apply($(target),c.render());
						c.render(target, method);
					}else if(Bao.classof(c) == "Object"){
						for( i in c ){
							c[i].render(target, method);
							// method.apply($(target),c[i].render());
						}
					}else{
						method.apply($(target),c);
					}
				}
			});
		}()

	window.Bao = Bao;
}(window)
