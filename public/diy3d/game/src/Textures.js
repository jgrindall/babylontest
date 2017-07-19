define(["diy3d/game/src/utils/ImageUtils"], function(ImageUtils){

	"use strict";

	var Textures = {};

	Textures.loadImage = function(url){
		return new Promise(function(resolve) {
	    	var image = new Image();
	    	image.onload = function() {
	      		resolve(image);
	    	};
	    	image.src = url;
	  	});
	};

	Textures.createCanvasFromURLArray = function(urls){
		// one big tall canvas with uv offset and uvscale is better than a lot of separate ones
		var c = document.createElement("canvas"), context = c.getContext("2d"), SIZE = 64, loadImages, drawImages;
		c.width = SIZE;
		c.height = SIZE*urls.length;
		var PADDING_Y = 1;
		loadImages = function(){
			return Promise.all(_.map(urls, Textures.loadImage));
		};
		drawImages = function(images){
			_.each(images, function(img, i){
				context.drawImage(img, 0, SIZE*i + PADDING_Y, SIZE, SIZE - 2*PADDING_Y);
			});
			return c;
		};
		return new Promise(function(resolve) {
			resolve(
				loadImages()
				.then(drawImages)
			);
		});
	};

	Textures.getTextureFromCanvas = function(canvas, scene){
		return new BABYLON.Texture("data:b64", scene, false, true, BABYLON.Texture.PLANAR_MODE, null, null, canvas.toDataURL(), true);
	};

	return Textures;

});
