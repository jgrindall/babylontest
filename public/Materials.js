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
	};

	Materials.makeMaterials = function(scene){
		Materials.brickMaterial = new BABYLON.StandardMaterial("brickMaterial", scene);
		Materials.brickMaterial_low = new BABYLON.StandardMaterial("brickMaterial_low", scene);
		Materials.steelMaterial = new BABYLON.StandardMaterial("steelMaterial", scene);
		Materials.steelMaterial_low = new BABYLON.StandardMaterial("steelMaterial_low", scene);
		Materials.brickMaterial.diffuseTexture = Materials.getTexture("brick");
		Materials.steelMaterial.diffuseTexture = Materials.getTexture("steel");
		Materials.brickMaterial_low.diffuseColor = RED;
		Materials.steelMaterial_low.diffuseColor = GREEN;
		Materials.brickMaterial.freeze();
		Materials.steelMaterial.freeze();
		Materials.brickMaterial_low.freeze();
		Materials.steelMaterial_low.freeze();
	};

	Materials.getTextureFromCanvas = function(rect, color){
		var canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		canvas.getContext("2d").fillStyle = "red";
		canvas.getContext("2d").fillRect(20,20,150,100);
		return new BABYLON.DynamicTexture("dynamic texture", canvas, scene, true);
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


