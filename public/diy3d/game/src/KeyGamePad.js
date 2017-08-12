define([], function(){
	"use strict";

	var $document = $(window.document);

	var R = 0.8;

	var MAPPING = {
		"0001":{
			theta:Math.PI/2,
			r:R
		},
		"0010":{
			theta:-Math.PI/2,
			r:R
		},
		"0100":{
			theta:0,
			r:R
		},
		"1000":{
			theta:Math.PI,
			r:R
		},
		"1010":{
			theta:-3*Math.PI/4,
			r:R
		},
		"0110":{
			theta:-Math.PI/4,
			r:R
		},
		"0101":{
			theta:Math.PI/4,
			r:R
		},
		"1001":{
			theta:3*Math.PI/4,
			r:R
		}
	}

	var _guard = function(a, min, max){
		return Math.min(Math.max(a, min), max);
	};

	var KeyGamePad = function(selector){
        this.canvas = document.createElement("canvas");
        $(selector).append(this.canvas);
		this.$canvas = $(this.canvas);
		this.canvas.width = 360;
		this.canvas.height = 240;
		this.ctx = this.canvas.getContext("2d");
        this.$canvas.hide();
        this._isDown = [0,0,0,0];
        this.init();
        this.load();
		this.unpause();
	};

	KeyGamePad.prototype.init = function(){
		var _this = this;
		kd.LEFT.down(function () {
			_this.set(0, 1);
		});
		kd.LEFT.up(function () {
			_this.set(0, 0);
		});
		kd.RIGHT.down(function () {
			_this.set(1, 1);
		});
		kd.RIGHT.up(function () {
			_this.set(1, 0);
		});
		kd.UP.down(function () {
			_this.set(2, 1);
		});
		kd.UP.up(function () {
			_this.set(2, 0);
		});
		kd.DOWN.down(function () {
			_this.set(3, 1);
		});
		kd.DOWN.up(function () {
			_this.set(3, 0);
		});
	};

	KeyGamePad.prototype.set = function(index, val){
		this._isDown[index] = val;
		this.redraw();
	};

	KeyGamePad.prototype.redraw = function(){
		if(this._loaded){
			this.ctx.clearRect(0, 0, 360, 240);
			this.ctx.drawImage(this.img, (this._isDown[0] ? 120 : 0), 0, 	120, 120, 0, 120, 120, 120);
			this.ctx.drawImage(this.img, (this._isDown[1] ? 120 : 0), 120, 	120, 120, 240, 120, 120, 120);
			this.ctx.drawImage(this.img, (this._isDown[2] ? 120 : 0), 240, 	120, 120, 120, 0, 120, 120);
			this.ctx.drawImage(this.img, (this._isDown[3] ? 120 : 0), 360, 	120, 120, 120, 120, 120, 120);
		}
	};

	KeyGamePad.prototype.load = function(){
		var _this = this;
		this.img = new Image();
		this.img.onload = function(){
			_this._loaded = true;
		};
		this.img.src = "/images/diy3d/keys.png";
	};

	KeyGamePad.prototype.getData = function(){
		return MAPPING[this._isDown.join("")] || {
			theta:0,
			r:0
		};
	};

	KeyGamePad.prototype.show = function(){
        this.$canvas.show();
	};

	KeyGamePad.prototype.pause = function(){
        kd.stop();
	};

	KeyGamePad.prototype.unpause = function(){
        kd.run(function () {
		  kd.tick();
		});
	};

	KeyGamePad.prototype.destroy = function(){
        kd.stop();
	};

	return KeyGamePad;

});
