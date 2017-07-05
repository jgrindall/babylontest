define([], function(){
	"use strict";

	var HUD = function(options){
		this.canvas = document.createElement("canvas");
		this.canvas.width = 300;
		this.canvas.height = 200;
		this.ctx = this.canvas.getContext("2d");
		this.$canvas = $(this.canvas);
		this.$canvas.css({
			"border":"2px solid black",
			"position":"fixed",
			"top":0,
			"right":0,
			"z-index":100
		});
		$("body").append(this.canvas);
	};
	
	HUD.prototype.drawWalls = function(){
		//this.data.walls...
		this.ctx.fillRect(20,20,150,100);
	};
	
	HUD.prototype.addPlayer = function(){
		
	};
	
	HUD.prototype.addBaddies = function(){
		
	};

	HUD.prototype.update = function(data){
		console.log("update hud");
		this.ctx.clearRect(0, 0, 300, 200);
		this.data = data;
		this.drawWalls();
		this.addPlayer();
		this.addBaddies();
	};
	
	return HUD;

});
