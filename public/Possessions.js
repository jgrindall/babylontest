define(["GridUtils"], function(GridUtils){
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

	Possessions.prototype.update = function(arr){
		this.$el.empty();
		var _this = this;
		var count = _count(arr);
		_.each(count, function(count, val){
			var img = new Image();
			var base64 = _this.materialsCache.getBase64ForKey(val);
			console.log(base64, count);
			img.src = base64;
			_this.$el.append(img).append("x " + count);
		});
	};

	return Possessions;

});
