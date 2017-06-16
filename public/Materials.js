define(["lib/Deferred", "Base64"], function(Deferred, Base64){

	var Materials = {};

	var Textures = {};

	var RED = new BABYLON.Color3(1.0, 0.2, 0.7);
	var GREEN = new BABYLON.Color3(0.5, 0.6, 0.3);

	Materials.getTexture = function(materialName){
		return Textures[materialName];
	};

	Materials.makeTextures = function(scene){
		Textures["brick"] = new BABYLON.Texture("assets/brick.jpg", scene);
		Textures["steel"] = new BABYLON.Texture("assets/steel.jpg", scene);
		Textures["crate"] = new BABYLON.Texture("assets/crate.png", scene);
	};
	
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
		var c = document.createElement("canvas"), context = c.getContext("2d"), SIZE = 64;
		c.width = SIZE;
		c.height = SIZE*urls.length;
		var loadImages = function(){
			return Promise.all(_.map(urls, Materials.loadImage));
		};
		var drawImages = function(images){
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
			Materials.base64Material.diffuseTexture = Materials.getTextureFromImg2(canvas, scene);
			Materials.base64Material.freeze();
			callback();
		});
	};
	
	Materials.flipCanvas = function(canvas){
		var c = document.createElement("canvas");
		c.width = canvas.width;
		c.height = canvas.height;
		var context = c.getContext("2d");
		context.translate(0, c.height);
		context.scale(1, -1);
		context.drawImage(canvas, 0, 0);
		return c;
	};

	Materials.getTextureFromImg2 = function(canvas, scene){
		canvas = Materials.flipCanvas(canvas);
		var url = canvas.toDataURL();
		return new BABYLON.Texture("data:b64", scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, url, true);
	};

	Materials.getTextureFromImg = function(img, scene){
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img, 0, 0);
		var texture = new BABYLON.DynamicTexture("dynamic texture", canvas, scene);
		var t = new BABYLON.Texture('data:my_image_name', scene, noMipmap, invertY, samplingMode, onLoad, onError, buffer, deleteBuffer);
		var tex = new BABYLON.Texture("data:grass", scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, "data:image/png;base64," + encode(bytes), true);
		texture.update();
		return texture;
	};

	Materials.getMultiMaterial = function(scene, images){
		var i, boxMat, mats = [];
		boxMat = new BABYLON.MultiMaterial('Box Multi Material', scene);
		for(i = 0; i < 5; i++){
			mats[i] = new BABYLON.StandardMaterial('mats' + i, scene);
			mats[i].diffuseTexture = new BABYLON.Texture(images[i], scene);
			boxMat.subMaterials[i] = mats[i];
		}
		return boxMat;
	};

	return Materials;

});
