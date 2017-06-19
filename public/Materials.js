define(["lib/Deferred", "Base64"], function(Deferred, Base64){

	var Materials = {};
	
	Materials.loadImage = function(url){
		return new Promise(function(resolve, reject) {
	    	var image = new Image();
	    	image.onload = function() {
	      		resolve(image);
	    	};
	    	image.src = url;
	  	});
	};
	
	Materials.createCanvasFromURLArray = function(urls){
		// one big tall canvas with uv offset and uvscale is better than a lot of separate ones
		var c = document.createElement("canvas"), context = c.getContext("2d"), SIZE = 64, loadImages, drawImages;
		c.width = SIZE;
		c.height = SIZE*urls.length;
		loadImages = function(){
			return Promise.all(_.map(urls, Materials.loadImage));
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
		
	Materials.makeMaterials = function(scene, callback){
		Materials.createCanvasFromURLArray([Base64.dog, Base64.bird, Base64.bricks, Base64.crate, Base64.steel])
		.then(function(canvas){
			Materials.base64Material = new BABYLON.StandardMaterial("base64Material", scene);
			Materials.base64Material.diffuseTexture = Materials.getTextureFromCanvas(canvas, scene);
			Materials.base64Material.freeze();
			
			Materials.keyMaterial = new BABYLON.StandardMaterial("keyMaterial", scene);
			Materials.keyMaterial.diffuseTexture = new BABYLON.Texture("assets/key.png", scene);
			Materials.keyMaterial.freeze();
			
			Materials.baddieMaterial = new BABYLON.StandardMaterial("baddieMaterial", scene);
			Materials.baddieMaterial.diffuseTexture = new BABYLON.Texture("assets/baddie.png", scene);
			Materials.baddieMaterial.freeze();
			
			Materials.redMaterial = new BABYLON.StandardMaterial("red", scene);
			Materials.redMaterial.diffuseColor = BABYLON.Color3.Red();
			Materials.redMaterial.alpha = 0.2;
			Materials.redMaterial.freeze();
			
			callback();
		});
	};
	
	Materials.flipCanvas = function(canvas){
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

	Materials.getTextureFromCanvas = function(canvas, scene){
		var url;
		canvas = Materials.flipCanvas(canvas);
		url = canvas.toDataURL();
		return new BABYLON.Texture("data:b64", scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, url, true);
	};

	return Materials;

});
