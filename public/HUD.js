define(["utils/GridUtils"], function(GridUtils){
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

	HUD.prototype.destroy = function(){
		this.$canvas.remove();
	};

	HUD.prototype.drawWalls = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#999999";
		_.each(this.data.walls, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE - c.x, wall[0]*HUD_SIZE - c.y, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};

	HUD.prototype.drawDoors = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#666666";
		_.each(this.data.doors, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE - c.x, wall[0]*HUD_SIZE - c.y, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};

	HUD.prototype.drawWater = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#0077ee";
		_.each(this.data.water, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE - c.x, wall[0]*HUD_SIZE - c.y, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};

	HUD.prototype.drawFire = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#cc44dd";
		_.each(this.data.fire, function(wall){
			ctx.fillRect(wall[1]*HUD_SIZE - c.x, wall[0]*HUD_SIZE - c.y, wall[2]*HUD_SIZE, wall[3]*HUD_SIZE);
		});
	};

	HUD.prototype.addPlayer = function(){
		var p = this.data.player.position, c = this.centre;
		this.ctx.fillStyle = "#22dd99";
		this.ctx.fillRect(p.j*HUD_SIZE - c.x, p.i*HUD_SIZE - c.y, 1*HUD_SIZE, 1*HUD_SIZE);
	};

	HUD.prototype.addObjects = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#ffff33";
		_.each(this.data.objects, function(obj){
			var p = obj.position;
			ctx.fillRect(p.j*HUD_SIZE - c.x, p.i*HUD_SIZE - c.y, 1*HUD_SIZE, 1*HUD_SIZE);
		});
	};

	HUD.prototype.addBaddies = function(){
		var ctx = this.ctx, c = this.centre;
		ctx.fillStyle = "#dd2222";
		ctx.lineStyle = "#dddddd";
		_.each(this.data.baddies, function(baddie){
			var p = baddie.position;
			ctx.fillRect(p.j*HUD_SIZE - c.x, p.i*HUD_SIZE - c.y, 1*HUD_SIZE, 1*HUD_SIZE);
		});
	};

	HUD.prototype.update = function(data){
		this.data = data;
		var p = this.data.player.position;
		this.centre = {"x":p.j*HUD_SIZE + HUD_SIZE/2 - 150, "y":p.i*HUD_SIZE + HUD_SIZE/2 - 100};
		var tx = -this.centre.x;
		var ty = -this.centre.y;
		this.ctx.clearRect(0, 0, 300, 200);
		this.ctx.save();
		this.ctx.translate(150, 100);
  		this.ctx.rotate(-this.data.player.angle);
  		this.ctx.translate(-150, -100);
  		this.drawWalls();
		this.drawDoors();
		this.drawWater();
		this.drawFire();
		this.addPlayer();
		this.addBaddies();
		this.addObjects();
		this.ctx.restore();
	};

	return HUD;

});
