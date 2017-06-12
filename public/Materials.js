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
	};

	Materials.getTextureFromCanvas = function(rect, color){
		var canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		canvas.getContext("2d").fillStyle = "red";
		canvas.getContext("2d").fillRect(20,20,150,100);
		return new BABYLON.DynamicTexture("dynamic texture", canvas, scene, true);
	};

	Materials.getMultiMaterial = function(scene, image0, image1){
		var text0 = new BABYLON.Texture(image0, scene);
		var text1 = new BABYLON.Texture(image1, scene);

		var boxMat_0 = new BABYLON.StandardMaterial('mat0', scene);
		boxMat_0.diffuseTexture = text0;

		var boxMat_1 = new BABYLON.StandardMaterial('mat1', scene);
		boxMat_1.diffuseTexture = text1;

		var boxMat_2 = new BABYLON.StandardMaterial('mat2', scene);
		boxMat_2.diffuseTexture = text0;

		var boxMat_3 = new BABYLON.StandardMaterial('mat3', scene);
		boxMat_3.diffuseTexture = text1;

		var boxMat_4 = new BABYLON.StandardMaterial('mat4', scene);
		boxMat_4.diffuseTexture = text0;

		var boxMat_5 = new BABYLON.StandardMaterial('mat5', scene);
		boxMat_5.diffuseTexture = text1;

		var boxMat_6 = new BABYLON.StandardMaterial('mat6', scene);
		boxMat_6.diffuseTexture = text1;

		var boxMat = new BABYLON.MultiMaterial('Box Multi Material', scene);
		boxMat.subMaterials[0] = boxMat_0;
		boxMat.subMaterials[1] = boxMat_1;
		boxMat.subMaterials[2] = boxMat_2;
		boxMat.subMaterials[3] = boxMat_3;
		boxMat.subMaterials[4] = boxMat_4;
		boxMat.subMaterials[5] = boxMat_5;
		return boxMat;
	};

	return Materials;

});


