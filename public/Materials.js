define(["lib/Deferred", "Base64", "Textures"], function(Deferred, Base64, Textures){

	var Materials = {};

	Materials.makeMaterials = function(scene, callback){
		Textures.createCanvasFromURLArray([Base64.dog, Base64.bird, Base64.bricks, Base64.crate, Base64.steel])
		.then(function(canvas){
			Materials.base64Material = new BABYLON.StandardMaterial("base64Material", scene);
			Materials.base64Material.diffuseTexture = Textures.getTextureFromCanvas(canvas, scene);
			Materials.base64Material.freeze();
			callback();
		});
	};

	return Materials;

});
