define(["lib/Deferred_", "Base64", "Textures"], function(Deferred, Base64, Textures){


	"use strict";

	var Materials = {};

	Materials.makeMaterials = function(scene, callback){
		Textures.createCanvasFromURLArray([Base64.dog, Base64.bricks, Base64.crate, Base64.steel, Base64.bird])
		.then(function(canvas){
			Materials.base64Material = new BABYLON.StandardMaterial("base64Material", scene);
			Materials.base64Material.diffuseTexture = Textures.getTextureFromCanvas(canvas, scene);
			Materials.base64Material.diffuseTexture.hasAlpha = true;
			Materials.base64Material.freeze();

			Materials.keyMaterial = new BABYLON.StandardMaterial("keyMaterial", scene);
			Materials.keyMaterial.diffuseTexture = new BABYLON.Texture("assets/key.png", scene);
			Materials.keyMaterial.freeze();

			Materials.baddieMaterial = new BABYLON.StandardMaterial("baddieMaterial", scene);
			Materials.baddieMaterial.diffuseTexture = new BABYLON.Texture("assets/baddie.png", scene);
			Materials.baddieMaterial.freeze();

			Materials.redMaterial = new BABYLON.StandardMaterial("red", scene);
			Materials.redMaterial.diffuseColor = BABYLON.Color3.Red();
			Materials.redMaterial.alpha = 0.7;
			Materials.redMaterial.freeze();

			callback();
		});
	};

	return Materials;

});
