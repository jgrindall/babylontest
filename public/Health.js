define([], function(){
	"use strict";

	var Health = function(){
		this.$el = $("<div/>");
		this.$bar = $("<div/>");
		this.$inner = $("<div/>");
		this.$el.css({
			"border":"1px solid #222",
			"position":"fixed",
			"background":"rgba(180,180,180,0.85)",
			"top":"10px",
			"left":"50%",
			"margin-left":"-125px",
			"width":"250px",
			"height":"30px",
			"z-index":100,
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
			"background":"green",
			"border-radius": "2px",
    		"background": "rgba(200,200,200,0.12)"
		});
		this.$el.append(this.$bar);
		this.$bar.append(this.$inner);
		$("body").append(this.$el);
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
