define([], function(){
	"use strict";
	
	var HUD_SIZE = 20;
	
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
		var ctx = this.ctx;
		ctx.fillStyle = "#999999";
		_.each(this.data.walls, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE, wall[0]*HUD_SIZE, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};
	
	HUD.prototype.addPlayer = function(){
		var p = this.data.player.position;
		this.ctx.fillStyle = "#222299";
		this.ctx.fillRect(p.j*HUD_SIZE, p.i*HUD_SIZE, 1*HUD_SIZE, 1*HUD_SIZE);
	};
	
	HUD.prototype.addBaddies = function(){
		
	};

	HUD.prototype.update = function(data){
		this.ctx.clearRect(0, 0, 300, 200);
		this.data = data;
		this.drawWalls();
		this.addPlayer();
		this.addBaddies();
	};
	
	return HUD;

});
