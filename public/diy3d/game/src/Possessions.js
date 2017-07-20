define([], function(){
	"use strict";

	var _count = function(arr){
		var c = {};
		_.each(arr, function(obj){
			c[obj.data.texture] = c[obj.data.texture] || 0;
			c[obj.data.texture]++;
		});
		return c;
	};

	var Possessions = function(manager, materialsCache, selector){
		this.$el = $("<div/>").addClass("possessionsContainer").hide();
		this.$button = $("<button>Do it!</button>")
		.hide()
		.css({
		    "position": "absolute",
		    "right": 0,
		    "top": "-30px",
		    "font-size":"20px"
		})
		.on("click", this.onClick.bind(this));
		this.materialsCache = materialsCache;
		this.manager = manager;
		this._state = "none";
		this.$el.append(this.$button);
		$(selector).append(this.$el);
	};

	Possessions.prototype.show = function(){
		this.$el.show();
	};

	Possessions.prototype.onClick = function(){
		this.setState("active");
		this.manager.listener.emit("doorInteraction", {"id":this._doorId});
	};

	Possessions.prototype.destroy = function(){
		this.$el.remove();
	};

	Possessions.prototype.add = function(count, val, i){
		var $el = $("<div/>").addClass("possession");
		var GAP = 140;
		var $inner = $("<div/>").addClass("possessionInner");
		$el.append($inner);
		var img = new Image();
		var base64 = this.materialsCache.getBase64ForKey(val);
		img.src = base64;
		this.$el.append($el);
		$inner.append(img).append("<span>" + count + "</span>");
		$el.css({
			"left":"20px"
		});
	};

	Possessions.prototype.updateState = function(s){
		this._state = s;
		if(s === "activatable"){
			this.$button.show();
		}
		else{
			this.$button.hide();
		}
		return this;
	};

	Possessions.prototype.setDoorId = function(id){
		this._doorId = id;
		return this;
	};

	Possessions.prototype.setState = function(s){
		if(this._state !== s){
			this.updateState(s);
		}
		return this;
	};

	Possessions.prototype.update = function(arr){
		this.$el.find(".possession").remove();
		var _this = this, i = 0;
		var count = _count(arr);
		_.each(count, function(count, val){
			_this.add(count, val, i);
			i++;
		});
	};

	return Possessions;

});
