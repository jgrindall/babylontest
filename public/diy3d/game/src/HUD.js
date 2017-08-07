define([], function(){
	"use strict";

	var BLOCK_SIZE = 		14;
	var BLOCK_SIZE2 = 		BLOCK_SIZE/2;
	var SIZE = 				250;
	var SIZE2 = 			SIZE/2;

	var PI2 = 2*Math.PI;

	var HUD = function(selector){
	    var $selector = $(selector);
		this.canvas = document.createElement("canvas");
		this.canvas.width = $selector.width();
		this.canvas.height = $selector.height();
		this.ctx = this.canvas.getContext("2d");
		this.$canvas = $(this.canvas).hide();
		this.$canvas.attr("id", "hudCanvas");
		this.terrainCanvas = document.createElement("canvas"); // cache the walls and stuff that never move
		this.terrainCanvas.width = $selector.width();
		this.terrainCanvas.height = $selector.height();
		this.terrainImg = new Image();
		this.terrainCtx = this.terrainCanvas.getContext("2d");
		$(selector).append(this.canvas);
	};

	HUD.prototype.cacheGrid = function(data){
		this.drawWalls(this.terrainCtx, data.types["wall"]);
		this.drawWater(this.terrainCtx, data.types["water"]);
		this.drawFire(this.terrainCtx, data.types["fire"]);
		this.terrainImg.src = this.terrainCanvas.toDataURL();
	};

	HUD.prototype.show = function(){
		this.$canvas.show();
	};

	HUD.prototype.destroy = function(){
		this.$canvas.remove();
	};

	HUD.prototype.drawTerrain = function(ctx){
		var c = this.centre;
		this.ctx.drawImage(this.terrainImg, -c.x, -c.y);
	};

	HUD.prototype.drawWalls = function(ctx, walls){
		var i, len = walls.length;
		ctx.fillStyle = "#777777";
		for(i = 0; i < len; i++){
            ctx.fillRect(walls[i].data.position[1]*BLOCK_SIZE, walls[i].data.position[0]*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
	};

	HUD.prototype.drawWater = function(ctx, water){
		var i, len = water.length;
		ctx.fillStyle = "#389dee";
        for(i = 0; i < len; i++) {
            ctx.fillRect(water[i][1]*BLOCK_SIZE, water[i][0]*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
	};

	HUD.prototype.drawFire = function(ctx, fire){
		var i, len = fire.length;
		ctx.fillStyle = "#dd792f";
        for(i = 0; i < len; i++) {
			ctx.fillRect(fire[i][1]*BLOCK_SIZE, fire[i][0]*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		}
	};

	HUD.prototype.addPlayer = function(ctx){
		var p = this.data.playerPos, c = this.centre;
		this.ctx.fillStyle = "#3cdd5b";
        this.ctx.beginPath();
        this.ctx.arc(p.j*BLOCK_SIZE - c.x + BLOCK_SIZE2, p.i*BLOCK_SIZE - c.y + BLOCK_SIZE2, BLOCK_SIZE2, 0, PI2);
        this.ctx.closePath();
        this.ctx.fill();
	};

	HUD.prototype.addObjects = function(ctx){
		var i, ctx = this.ctx, c = this.centre, len = this.data.objects.length;
		ctx.fillStyle = "#ffff33";
        for(i = 0; i < len; i++) {
            ctx.fillRect(this.data.objects[i].j*BLOCK_SIZE - c.x, this.data.objects[i].i*BLOCK_SIZE - c.y, BLOCK_SIZE, BLOCK_SIZE);
        }
	};

	HUD.prototype.addBaddies = function(ctx){
		var i, ctx = this.ctx, c = this.centre, len = this.data.baddies.length;
		ctx.fillStyle = "#dd2222";
        for(i = 0; i < len; i++) {
            ctx.fillRect(this.data.baddies[i].j*BLOCK_SIZE - c.x, this.data.baddies[i].i*BLOCK_SIZE - c.y, BLOCK_SIZE, BLOCK_SIZE);
        }
	};

	HUD.prototype.update = function(data){
		this.data = data;
		this.centre = {
		    "x":this.data.playerPos.j*BLOCK_SIZE + BLOCK_SIZE2 - SIZE2,
            "y":this.data.playerPos.i*BLOCK_SIZE + BLOCK_SIZE2 - SIZE2
		};
		this.ctx.clearRect(0, 0, SIZE, SIZE);
		this.ctx.save();
		this.ctx.translate(SIZE2, SIZE2);
  		this.ctx.rotate(-this.data.playerAngle);
  		this.ctx.translate(-SIZE2, -SIZE2);
  		this.drawTerrain(this.terrainCtx);
		this.addPlayer(this.ctx);
		this.addBaddies(this.ctx);
		this.addObjects(this.ctx);
		this.ctx.restore();
	};

	return HUD;

});
