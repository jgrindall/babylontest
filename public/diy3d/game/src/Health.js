define([], function(){
	"use strict";

	var Health = function(selector){
		this.$el = $("<div/>").addClass("bg");
		this.$bar = $("<div/>").addClass("bar");
		this.$inner = $("<div/>").addClass("inner");
		this.$el.css({
			"border":"1px solid #222",
			"position":"absolute",
			"background":"rgba(180,180,180,0.85)",
			"top":"0",
			"left":"0",
			"width":"100%",
			"height":"100%",
			"border-radius": "4px"
		});
		this.$bar.css({
			"position":"absolute",
			"top":0,
			"left":0,
			"width":"100%",
			"height":"30px",
			"background":"green",
			"border-radius": "3px",
			"box-shadow":"inset 0 5px 5px -1px rgba(50,50,50, 0.33)"
		});
		this.$inner.css({
			"position":"absolute",
			"top":"2px",
			"left":"2px",
			"right":"2px",
			"bottom":"2px",
			"border-radius": "2px",
    		"background": "rgba(200,200,200,0.12)"
		});
		this.$el.append(this.$bar);
		this.$bar.append(this.$inner);
		$(selector).append(this.$el);
		this.update(100);
	};

	Health.prototype.destroy = function(){
		this.$el.remove();
	};

	Health.prototype.updateRegnerating = function(reg){
		if(reg){
			this.$el.addClass("reg");
		}
		else{
			this.$el.removeClass("reg");
		}
	};

	Health.prototype.update = function(health){
		this.$bar.css({
			"width":health + "%"
		});
		if(health < 25){
			this.$bar.css({"background":"red"});
		}
		else if(health < 50){
			this.$bar.css({"background":"orange"});
		}
		else if(health < 67){
			this.$bar.css({"background":"yellow"});
		}
		else{
			this.$bar.css({"background":"green"});
		}
	};

	return Health;

});
