define([], function(){
	"use strict";

	var Health = function(){
		this.$el = $("<div/>");
		this.$el.css({
			"border":"2px solid black",
			"position":"fixed",
			"background":"rgba(200,200,200,0.2)",
			"bottom":0,
			"right":0,
			"left":0,
			"width":"200px",
			"height":"20px",
			"z-index":100
		});
		$("body").append(this.$el);
		this.update(100);
	};

	Health.prototype.destroy = function(){
		this.$el.remove();
	};

	Health.prototype.update = function(health){
		this.$el.text(health);
	};

	return Health;

});
