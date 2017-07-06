define(["lib/Deferred_"], function(Deferred){

	var Textures = {};

	Textures.loadImage = function(url){
		return new Promise(function(resolve, reject) {
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
		loadImages = function(){
			return Promise.all(_.map(urls, Textures.loadImage));
		};
		drawImages = function(images){
			_.each(images, function(img, i){
				context.drawImage(img, 0, SIZE*i, SIZE, SIZE);
			});
			return c;
		};
		return new Promise(function(resolve, reject) {
			resolve(
				loadImages()
				.then(drawImages)
			);
		});
	};

	Textures.flipCanvas = function(canvas){
		var c, context;
		c = document.createElement("canvas");
		c.width = canvas.width;
		c.height = canvas.height;
		context = c.getContext("2d");
		context.translate(0, c.height);
		context.scale(1, -1);
		context.drawImage(canvas, 0, 0);
		return c;
	};

	Textures.getTextureFromCanvas = function(canvas, scene){
		var url = canvas.toDataURL();
		return new BABYLON.Texture("data:b64", scene, false, true, BABYLON.Texture.PLANAR_MODE, null, null, url, true);
	};

	return Textures;

});
