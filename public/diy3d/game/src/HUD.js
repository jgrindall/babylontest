define([], function(){
	"use strict";

    //TODO OPTIMISE ALL

	var HUD_SIZE = 14;

	var PI2 = 2*Math.PI;

	var HUD = function(selector){
	    var $selector = $(selector);
		this.canvas = document.createElement("canvas");
		this.canvas.width = $selector.width();
		this.canvas.height = $selector.height();
		this.ctx = this.canvas.getContext("2d");
		this.$canvas = $(this.canvas).hide();
		this.$canvas.attr("id", "hudCanvas");
		$(selector).append(this.canvas);
	};

	HUD.prototype.show = function(){
		this.$canvas.show();
	};

	HUD.prototype.destroy = function(){
		this.$canvas.remove();
	};

	HUD.prototype.drawWalls = function(){
		var i, ctx = this.ctx, c = this.centre, len = this.data.walls.length;
		ctx.fillStyle = "#777777";
		for(i = 0; i < len; i++){
            ctx.fillRect(this.data.walls[i].data.position[1]*HUD_SIZE - c.x, this.data.walls[i].data.position[0]*HUD_SIZE - c.y, HUD_SIZE, HUD_SIZE);
        }
	};

	HUD.prototype.drawWater = function(){
		var i, ctx = this.ctx, c = this.centre, len = this.data.water.length;
		ctx.fillStyle = "#389dee";
        for(i = 0; i < len; i++) {
            ctx.fillRect(this.data.water[i][1]*HUD_SIZE - c.x, this.data.water[i][0]*HUD_SIZE - c.y, this.data.water[i][2]*HUD_SIZE, this.data.water[i][3]*HUD_SIZE);
        }
	};

	HUD.prototype.drawFire = function(){
		var i, ctx = this.ctx, c = this.centre, len = this.data.fire.length;
		ctx.fillStyle = "#dd792f";
        for(i = 0; i < len; i++) {
			ctx.fillRect(this.data.fire[i][1]*HUD_SIZE - c.x, this.data.fire[i][0]*HUD_SIZE - c.y, this.data.fire[i][2]*HUD_SIZE, this.data.fire[i][3]*HUD_SIZE);
		}
	};

	HUD.prototype.addPlayer = function(){
		var p = this.data.playerPos, c = this.centre;
		this.ctx.fillStyle = "#3cdd5b";
        this.ctx.beginPath();
        this.ctx.arc(p.j*HUD_SIZE - c.x + HUD_SIZE/2, p.i*HUD_SIZE - c.y + HUD_SIZE/2, HUD_SIZE/2, 0, PI2);
        this.ctx.closePath();
        this.ctx.fill();
	};

	HUD.prototype.addObjects = function(){
		var i, ctx = this.ctx, c = this.centre, len = this.data.objects.length;
		ctx.fillStyle = "#ffff33";
        for(i = 0; i < len; i++) {
            ctx.fillRect(this.data.objects[i].position.j*HUD_SIZE - c.x, this.data.objects[i].position.i*HUD_SIZE - c.y, HUD_SIZE, HUD_SIZE);
        }
	};

	HUD.prototype.addBaddies = function(){
		var i, ctx = this.ctx, c = this.centre, len = this.data.baddies.length;
		ctx.fillStyle = "#dd2222";
        for(i = 0; i < len; i++) {
            ctx.fillRect(this.data.baddies[i].position.j*HUD_SIZE - c.x, this.data.baddies[i].position.i*HUD_SIZE - c.y, HUD_SIZE, HUD_SIZE);
        }
	};

	HUD.prototype.update = function(data){
		this.data = data;
		this.centre = {
		    "x":this.data.playerPos.j*HUD_SIZE + HUD_SIZE/2 - 125,
            "y":this.data.playerPos.i*HUD_SIZE + HUD_SIZE/2 - 125
		};
		this.ctx.clearRect(0, 0, 250, 250);
		this.ctx.save();
		this.ctx.translate(125, 125);
  		this.ctx.rotate(-this.data.playerAngle);
  		this.ctx.translate(-125, -125);
  		this.drawWalls();
		this.drawWater();
		this.drawFire();
		this.addPlayer();
		this.addBaddies();
		this.addObjects();
		this.ctx.restore();
	};

	return HUD;

});
