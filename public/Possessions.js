define(["GridUtils"], function(GridUtils){
	"use strict";

	var Possessions = function(options){
		this.$el = $("<div/>");
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
		this.$el.append("<p>" + JSON.stringify(arr, null, 2) + "</p>");
	};

	return Possessions;

});
