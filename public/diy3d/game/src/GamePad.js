define([], function(){
	"use strict";

	var SIZE, SIZE2, ONEOVER, PI2, MAX_DISP_SQR, HANDLE_RAD;

	SIZE = 				200;
	SIZE2 = 			SIZE/2;
    ONEOVER = 			1/SIZE2;
	PI2 = 				2*Math.PI;
	HANDLE_RAD = 		56;
	MAX_DISP_SQR = 		(SIZE2 - HANDLE_RAD)*(SIZE2 - HANDLE_RAD);

	var $document = $(window.document);

	var _guard = function(a, min, max){
		return Math.min(Math.max(a, min), max);
	};

	var GamePad = function(selector){
        this.dx = 0;
        this.dy = 0;
		this.onMoveHandler = this.onMove.bind(this);
        this.onStartHandler = this.onStart.bind(this);
        this.onEndHandler = this.onEnd.bind(this);
		this.canvas = document.createElement("canvas");
        $(selector).append(this.canvas);
		this.$canvas = $(this.canvas);
		this.canvas.width = SIZE;
		this.canvas.height = SIZE;
		this.ctx = this.canvas.getContext("2d");
		this.onResizeHandler = _.debounce(this.onResize.bind(this), 500);
		$(window).on("resize", this.onResizeHandler);
		this.updateRect();
		this.redraw();
		this.unpause();
        this.$canvas.hide();
	};

	GamePad.prototype.onEnd = function(e){
        this.$canvas.off("mousemove touchmove", this.onMoveHandler);
		this.dx = 0;
		this.dy = 0;
		this.r = 0;
		this.redraw();
	};

	GamePad.prototype.updateRect = function(){
        this.rect = this.canvas.getBoundingClientRect();
        this.mx = this.rect.left + this.rect.width/2;
        this.my = this.rect.top + this.rect.height/2;
    };

	GamePad.prototype.onResize = function(){
	    this.updateRect();
    };

	GamePad.prototype.redraw = function(){
		var cx, cy;
		cx = SIZE2 + this.dx;
		cy = SIZE2 + this.dy;
		this.ctx.clearRect(0, 0, SIZE, SIZE);
		this.ctx.fillStyle = "rgba(220,10,10,0.25)";
    	this.ctx.beginPath();
    	this.ctx.arc(SIZE2, SIZE2, SIZE2, 0, PI2);
    	this.ctx.fill();
    	this.ctx.fillStyle = "rgba(220,10,10,0.85)";
    	this.ctx.beginPath();
    	this.ctx.arc(cx, cy, HANDLE_RAD, 0, PI2);
    	this.ctx.fill();
	};

	GamePad.prototype.onStart = function(e){
		e.preventDefault();
		e.stopPropagation();
		this.$canvas.on("mousemove touchmove", this.onMoveHandler);
	};

	GamePad.prototype.onMove = function(e){
		var rSqr, sf;
		e.preventDefault();
		e.stopPropagation();
		this.dx = e.originalEvent.pageX - this.mx;
		this.dy = e.originalEvent.pageY - this.my;
		rSqr = this.dx*this.dx + this.dy*this.dy;
		this.r = Math.sqrt(rSqr/MAX_DISP_SQR); // from 0 to 1
		if(rSqr > MAX_DISP_SQR){
			sf = Math.sqrt(MAX_DISP_SQR/rSqr);
			this.dx *= sf;
			this.dy *= sf;
			rSqr = 1;
			this.r = 1;
		}
        this.theta = Math.atan2(this.dy, this.dx);
		this.redraw();
	};

	GamePad.prototype.getData = function(){
		return {
			theta:this.theta,
			r:this.r
		};
	};

	GamePad.prototype.show = function(){
	    var _this = this;
        _this.onResize();
	    setTimeout(function(){
            _this.onResize();
        }, 1000);
        this.$canvas.show();
	};

	GamePad.prototype.pause = function(){
        this.dx = 0;
        this.dy = 0;
        this.$canvas.off("mousedown touchstart", this.onStartHandler);
        $document.off("mouseup touchend", this.onEndHandler);
        this.redraw();
	};

	GamePad.prototype.unpause = function(){
        this.$canvas.on("mousedown touchstart", this.onStartHandler);
        $document.on("mouseup touchend", this.onEndHandler);
	};

	GamePad.prototype.destroy = function(){
        this.$canvas.off();
        $document.off("mouseup touchend", this.onEndHandler);
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.$canvas.remove();
	};

	return GamePad;

});
