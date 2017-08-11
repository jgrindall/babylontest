define(["diy3d/game/src/utils/ImageUtils"], function(ImageUtils){

	"use strict";

	var Preloader  = function(){
		this.images = {};
	}

	Preloader.prototype.add = function(arr){
		var _this = this;
		return Promise.all(_.map(arr, function(obj){
			return ImageUtils.loadURL(obj.src);
		}))
		.then(function(images){
			var i;
			for(i = 0; i < images.length; i++){
				_this.images[arr[i].name] = images[i];
			}
		});
	};

	Preloader.prototype.get = function(name){
		return this.images[name];
	};

	return Preloader;

});
