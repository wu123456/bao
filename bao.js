+function(window){
	// Bao
		var Bao = function(object){
			var bao_object = new BaoObject();
			bao_object.extend(object);
			return bao_object;
		}

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

		Bao.createBaoObject = function(bao_class, params){
			if (bao_class instanceof Function || (typeof bao_class == "string" && (bao_class = eval(bao_class)) && (bao_class instanceof Function))) {
				return new bao_class(params);
			};
		}

		Bao.classof = function(o){
			if (o === null) {return "NULL"};
			if (o === undefined) {return "UNDEFINED"};
			return Object.prototype.toString.call(o).slice(8, -1);
		}

		Bao.drawTPL = function(tpl,data){
	        var html ="";
	        if (Bao.classof(data) == "Array") {
	        	for(var i in data) {
		            var content = tpl.replace(/\{(\w+)\}/g, function(m, key) {
		                if(typeof(data[i][key]) != "undefined") {
		                    return data[i][key];
		                } else {
		                    return m;
		                }
		            });
		            html+=content;
		        }
	        }else if(Bao.classof(data) == "Object"){
	        	var content = tpl.replace(/\{(\w+)\}/g, function(m, key) {
	                if(typeof(data[key]) != "undefined") {
	                    return data[key];
	                } else {
	                    return m;
	                }
	            });
	            html+=content;
	        }
	        return html;
	    }

	    Bao.render = function(tpl, data, container, type){
	    	// 老版本的render
	    	var html = Bao.drawTPL(tpl, data);
	    	if (type === 'append') {
	    		$(container).append(html);
	    		return;
	    	};
	    	$(container).html(html);
	    }

	// BaoObject
		function BaoObject(){
		}

		BaoObject.prototype.extend = function(source){
			Bao.extend(this, source);
		}

	// BaoComponent
		+function(){
			var revent = /<[\w\W]*@(onclick)="(\w*)"\s*[\s|>]/i;
			function BaoComponent(params){
				BaoObject.call(this);
				this.node = null;
				this.html = '';
				Bao.extend(this, params);
				this.props = params.props || {}; // 用于储存不变的数据
				this.state = params.state || {}; // 用于储存变化的数据（通过setState调用，引发变化后，会重新绘图）
				this.tpl = params.tpl; // 用于绘图的模板
				this.preHandleFunc = params.preHandleFunc; // 用于预处理数据的函数
			}
			BaoComponent.prototype =  new BaoObject();
			BaoComponent.prototype.constructor = BaoComponent;

			Bao.extend(BaoComponent.prototype,{
				defaultPreHandleFunc : function(){
					return Bao.extend({},this.props, this.state);
				},
				setState : function(params){
					this.state = Bao.extend(this.state, params);
					var data = (typeof this.preHandleFunc === "function") ? this.preHandleFunc() : this.defaultPreHandleFunc();
					var html = Bao.drawTPL(this.tpl, data);
					// 没有变化，不需要重新渲染
					if (html === this.html) {
						return;
					};
					// 变化之后，重新渲染
					var node = $(html);
					this.node.html(node.html());
				},
				render : function(){
					var data = (typeof this.preHandleFunc === "function") ? this.preHandleFunc() : this.defaultPreHandleFunc();
					this.html = Bao.drawTPL(this.tpl, data);
					this.node = $(this.html);
					this.html && this._bindEvent();
					return this.node;
				},
				destory : function(){
					this.node.remove();
				},
				_bindEvent : function(){
					var res = revent.exec(this.html);
					console.log(res);
					res && this.events && typeof this.events[res[2]] === 'function' && this.node.on('click', function(){
						(this.events[res[2]].bind(this))();
					}.bind(this))
				}
			})
			BaoComponent.prototype.toString = BaoComponent.prototype.render;

			Bao.extend(Bao, {
				// params contains tpl, preHandleFunc
				createBaoComponent : function(params){
					var BComponent = function(p){
						BaoComponent.call(this, Bao.extend({}, params, p));
					}
					BComponent.prototype = BaoComponent.prototype;
					return BComponent;
				},
				renderBaoComponent : function(c, target){
					var i;
					if (Bao.classof(c) == "Array") {
						str = c.forEach(function(cur){
							$(target).append(cur.render());
						});
					}else if(c instanceof BaoComponent){
						$(target).append(c.render());
					}else if(Bao.classof(c) == "Object"){
						for( i in c ){
							$(target).append(c[i].render());
						}
					}else{
						$(target).append(c);
					}
				}
			});
		}()
		

	// BaoConnect
		function BaoConnect(){
			BaoObject.call(this);
		}

		BaoConnect.prototype =  new BaoObject();
		BaoConnect.prototype.constructor = BaoConnect;

	// BaoHttpConnect
		function BaoHttpConnect(params){
			BaoConnect.call(this);
			this['url'] = params['url'];
			this['method'] = params['method'];
		}

		BaoHttpConnect.prototype =  new BaoConnect();
		BaoHttpConnect.prototype.constructor = BaoHttpConnect;

		BaoHttpConnect.prototype.request = function(){

			var params = arguments[0]['params'];
			var successCallback = arguments[0]['success'];
			var beforeFunction = arguments[0]['before'];
			var errorCallback = arguments[0]['error'];
			var timeout = arguments[0]['timeout'] || 10000;

			var url = this['url'];
		    var method = this['method'];

		    if (Bao.classof(beforeFunction) == "Function") {
		    	beforeFunction();
		    };
			$.ajax({
			    type: method,
			    url: url,
			    data: params,
			    dataType: "json",
			    timeout: timeout,
			    success: function(data, textStatus){
			    	if (Bao.classof(successCallback) == "Function") {
			    		successCallback(data, textStatus);
			    	};
			    },
			    error: function(XMLHttpRequest, textStatus, errorThrown){
			    	if (Bao.classof(errorCallback) == "Function") {
			    		errorCallback(XMLHttpRequest, textStatus, errorThrown);
			    	};
			    }
			 });
		}

	// BaoModule
		function BaoModule(connects){
			BaoObject.call(this);
			this.connects = connects;
			this.init();

		}

		BaoModule.prototype =  new BaoObject();
		BaoModule.prototype.constructor = BaoModule;

		BaoModule.prototype.init = function(){

		}

		BaoModule.prototype.request = function(){
			var name, params, successCallback, beforeFunction, errorCallback, timeout;
			if (arguments.length == 1) {
				name = arguments[0]['name'];
				params = arguments[0]['params'];
				successCallback = arguments[0]['success'];
				beforeFunction = arguments[0]['before'];
				errorCallback = arguments[0]['error'];
				timeout = arguments[0]['timeout'];
			}else{
				name = arguments[0];
				params = arguments[1];
				successCallback = arguments[2];
				beforeFunction = arguments[3];
				errorCallback = arguments[4];
				timeout = arguments[5];
			}

			if (!(this.connects[name] instanceof BaoConnect)) {
				this.connects[name] = Bao.createBaoObject(this.connects[name]['class'], this.connects[name]);
			};

			this.connects[name].request(
				{
					params : params,
					success : successCallback,
					before : beforeFunction,
					error : errorCallback,
					timeout : timeout
				}
			);
		}

	window.Bao = Bao;
	window.BaoObject = BaoObject;
	window.BaoConnect = BaoConnect;
	window.BaoModule = BaoModule;
}(window)