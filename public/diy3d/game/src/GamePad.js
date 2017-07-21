define([], function(){
	"use strict";

	var SIZE = 200, SIZE2 = SIZE/2, HANDLE = 60;

	var GamePad = function(selector){
		this.onMoveHandler = this.onMove.bind(this);
		this.canvas = document.createElement("canvas");
		this.canvas.width = SIZE;
		this.canvas.height = SIZE;
		this.ctx = this.canvas.getContext("2d");
		$(selector).append(this.canvas);
		$(this.canvas).on("mousedown touchstart", this.onStart.bind(this));
		$(document).on("mouseup touchend", this.onEnd.bind(this));
		this.rect = this.canvas.getBoundingClientRect();
		this.mx = this.rect.left + this.rect.width/2;
		this.my = this.rect.top + this.rect.height/2;
		this.dx = 0;
		this.dy = 0;
		this.redraw();
	};

	GamePad.prototype.onEnd = function(){
		$(this.canvas).off("mousemove touchmove", this.onMoveHandler);
		this.dx = 0;
		this.dy = 0;
		this.redraw();
	};

	GamePad.prototype.redraw = function(){
		var cx = SIZE2 + this.dx*SIZE2;
		var cy = SIZE2 + this.dy*SIZE2;
		this.ctx.clearRect(0, 0, SIZE, SIZE);
		this.ctx.fillStyle = "rgba(220,10,10,0.5)";
    	this.ctx.beginPath();
    	this.ctx.arc(cx, cy, HANDLE, 0, 2 * Math.PI);
    	this.ctx.fill();
	};

	GamePad.prototype.onStart = function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this.canvas).on("mousemove touchmove", this.onMoveHandler);
	};

	GamePad.prototype.onMove = function(e){
		e.preventDefault();
		e.stopPropagation();
		this.dx = (e.originalEvent.pageX - this.mx) / SIZE2;
		this.dy = (e.originalEvent.pageY - this.my) / SIZE2;
		this.redraw();
	};

	GamePad.prototype.getData = function(){
		return {
			dx:this.dx,
			dy:this.dy
		};
	};

	GamePad.prototype.show = function(){
		//$(this.manager.get(0).el).show();
	};

	GamePad.prototype.pause = function(){
		//this.manager.off();
	};

	GamePad.prototype.unpause = function(){
		//
	};

	GamePad.prototype.destroy = function(){
		//this.manager.off();
		//this.update = null;
		//this.manager = null;
	};

	return GamePad;

});
