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

	var Possessions = function(materialsCache){
		this.$el = $("<div/>");
		this.materialsCache = materialsCache;
		this.$el.css({
			"border":"2px solid black",
			"position":"fixed",
			"background":"rgba(200,200,200,0.2)",
			"bottom":0,
			"right":0,
			"left":0,
			"height":"100px",
			"z-index":100
		});
		$("body").append(this.$el);
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
			"left":0
		});
	};

	Possessions.prototype.update = function(arr){
		this.$el.empty();
		var _this = this, i = 0;
		var count = _count(arr);
		_.each(count, function(count, val){
			_this.add(count, val, i);
			i++;
		});
	};

	return Possessions;

});
