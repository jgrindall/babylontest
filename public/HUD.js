define(["GridUtils"], function(GridUtils){
	"use strict";
	
	var HUD_SIZE = 10;
	
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
	
	HUD.prototype.drawWater = function(){
		var ctx = this.ctx;
		ctx.fillStyle = "#0077ee";
		_.each(this.data.water, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE, wall[0]*HUD_SIZE, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};
	
	HUD.prototype.drawFire = function(){
		var ctx = this.ctx;
		ctx.fillStyle = "#cc44dd";
		_.each(this.data.fire, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE, wall[0]*HUD_SIZE, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};
	
	HUD.prototype.addPlayer = function(){
		var p = this.data.player.position;
		this.ctx.fillStyle = "#22dd99";
		this.ctx.fillRect(p.j*HUD_SIZE, p.i*HUD_SIZE, 1*HUD_SIZE, 1*HUD_SIZE);
	};
	
	HUD.prototype.addBaddies = function(){
		var ctx = this.ctx;
		ctx.fillStyle = "#dd2222";
		ctx.lineStyle = "#dddddd";
		_.each(this.data.baddies, function(baddie){
			var p = baddie.position;
			ctx.fillRect(p.j*HUD_SIZE, p.i*HUD_SIZE, 1*HUD_SIZE, 1*HUD_SIZE);
			var path = baddie.path;
			if(!path){
				return;
			}
			_.each(path.sections, function(section){
				var start, end;
				start = GridUtils.babylonToIJ(section.start);
				end = GridUtils.babylonToIJ(section.end);
				ctx.beginPath();
				ctx.moveTo(start.j*HUD_SIZE + HUD_SIZE/2, start.i*HUD_SIZE + HUD_SIZE/2);
				ctx.lineTo(end.j*HUD_SIZE + HUD_SIZE/2, end.i*HUD_SIZE + HUD_SIZE/2);
				ctx.stroke();
			});
		});
	};

	HUD.prototype.update = function(data){
		this.ctx.clearRect(0, 0, 300, 200);
		this.data = data;
		this.drawWalls();
		this.drawWater();
		this.drawFire();
		this.addPlayer();
		this.addBaddies();
	};
	
	return HUD;

});
