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

	return Materials;

});


