define([], function(){

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

	Materials.makeMaterials = function(scene, callback){
		Materials.brickMaterial = new BABYLON.StandardMaterial("brickMaterial", scene);
		Materials.crateMaterial = new BABYLON.StandardMaterial("crateMaterial", scene);
		Materials.brickMaterial_low = new BABYLON.StandardMaterial("brickMaterial_low", scene);
		Materials.steelMaterial = new BABYLON.StandardMaterial("steelMaterial", scene);
		Materials.steelMaterial_low = new BABYLON.StandardMaterial("steelMaterial_low", scene);
		Materials.base64Material = new BABYLON.StandardMaterial("base64Material", scene);
		Materials.brickMaterial.diffuseTexture = Materials.getTexture("brick");
		Materials.steelMaterial.diffuseTexture = Materials.getTexture("steel");
		Materials.crateMaterial.diffuseTexture = Materials.getTexture("crate");
		Materials.brickMaterial_low.diffuseColor = RED;
		Materials.steelMaterial_low.diffuseColor = GREEN;
		Materials.brickMaterial.freeze();
		Materials.steelMaterial.freeze();
		Materials.crateMaterial.freeze();
		Materials.brickMaterial_low.freeze();
		Materials.steelMaterial_low.freeze();
		var img = new Image();
		img.onload = function(){
			console.log("loaded img");
			Materials.base64Material.diffuseTexture = Materials.getTextureFromImg2(img, scene);
			Materials.base64Material.freeze();
			callback();
		};
		img.src = "data:image/png;base64,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";
		//img.src = "http://aminoapps.com/static/bower/emojify.js/images/emoji/dog.png";
	};

	Materials.getTextureFromImg2 = function(img, scene){
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var context = canvas.getContext("2d");
		console.log('canvas', canvas.width, canvas.height, img.width, img.height);
		context.translate(0, canvas.height);
		context.scale(1, -1);
		canvas.getContext("2d").drawImage(img, 0, 0);
		var url = canvas.toDataURL();
		console.log(url);
		return new BABYLON.Texture("data:b64", scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, url, true);
	};

	Materials.getTextureFromImg = function(img, scene){
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		console.log('canvas', canvas.width, canvas.height, img.width, img.height);
		canvas.getContext("2d").drawImage(img, 0, 0);
		console.log(canvas.toDataURL());
		$("body").append(canvas);
		$("body").append(img);
		$(canvas).css({"position":"fixed", "z-index":1000, "top":0, "left":0, "border":"1px solid red"});
		$(img).css({"position":"fixed", "z-index":1000, "top":0, "left":'64px', "border":"1px solid blue"});
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
