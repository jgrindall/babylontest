define([], function(){
	"use strict";

	var SIZE, SIZE2, ONEOVER, PI2, HANDLE;

	SIZE = 200;
	SIZE2 = SIZE/2;
    ONEOVER = 1/SIZE2;
	PI2 = 2*Math.PI;
	HANDLE = 60;

	var $document = $(window.document);

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
		var cx = SIZE2 + this.dx*SIZE2;
		var cy = SIZE2 + this.dy*SIZE2;
		this.ctx.clearRect(0, 0, SIZE, SIZE);
		this.ctx.fillStyle = "rgba(220,10,10,0.75)";
    	this.ctx.beginPath();
    	this.ctx.arc(cx, cy, HANDLE, 0, PI2);
    	this.ctx.fill();
	};

	GamePad.prototype.onStart = function(e){
		e.preventDefault();
		e.stopPropagation();
		this.$canvas.on("mousemove touchmove", this.onMoveHandler);
	};

	GamePad.prototype.onMove = function(e){
		e.preventDefault();
		e.stopPropagation();
		this.dx = (e.originalEvent.pageX - this.mx) * ONEOVER;
		this.dy = (e.originalEvent.pageY - this.my) * ONEOVER;
		this.redraw();
	};

	GamePad.prototype.getData = function(){
		return {
			dx:this.dx,
			dy:this.dy
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
