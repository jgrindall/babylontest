define([], function(){

	var Materials = {};

	Materials.makeMaterials = function(scene){
		Materials.brickMaterial = new BABYLON.StandardMaterial("brickMaterial", scene);
		Materials.brickMaterial.diffuseTexture = new BABYLON.Texture("assets/brick.jpg", scene);
		Materials.brickMaterial.backFaceCulling = false
		Materials.brickMaterial.freeze();
		Materials.steelMaterial = new BABYLON.StandardMaterial("steelMaterial", scene);
		Materials.steelMaterial.diffuseTexture = new BABYLON.Texture("assets/steel.jpg", scene);
		Materials.steelMaterial.backFaceCulling = false
		Materials.steelMaterial.freeze();
		//myMaterial.diffuseTexture.uScale = 5.0;
		//myMaterial.diffuseTexture.vScale = 5.0;

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


