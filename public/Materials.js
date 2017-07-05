define(["lib/Deferred_", "Base64", "Textures"], function(Deferred, Base64, Textures){

	"use strict";

	var BLUE1 =  new BABYLON.Color4(0.35, 0.4, 0.9, 1);
	var BLUE2 =  new BABYLON.Color4(0.22, 0.8, 1.0, 0.5);
	var BLUE3 =  new BABYLON.Color4(0.35, 0.7, 0.9, 0.8);
	var BLUE4 =  new BABYLON.Color4(0.2, 0.5, 1.0, 0.7);
	var LTBLUE = new BABYLON.Color4(0.8, 0.25, 0.33, 0.99);
	var WHITE =  new BABYLON.Color4(0.9, 1, 1, 1);

	var Materials = {};

	Materials.NUM_MATS = 6;

	Materials.ONE_OVER = 1/Materials.NUM_MATS;

	Materials.destroy = function(){

	};

	Materials.makeMaterials = function(scene, callback){
		Textures.createCanvasFromURLArray([Base64.bricks, Base64.crate, Base64.steel, Base64.baddie, Base64.bird, Base64.key])
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

			var waterTexture = new BABYLON.FireProceduralTexture("water", 8, scene); // water is a blue fire.
			var fireTexture = new BABYLON.FireProceduralTexture("fire", 8, scene);
			fireTexture.speed  = new BABYLON.Vector2(10, 8);

			Materials.waterMaterial = new BABYLON.StandardMaterial("water", scene);
			Materials.waterMaterial.ambientColor = BLUE1;
			Materials.waterMaterial.diffuseColor = BLUE1;
			Materials.waterMaterial.opacityTexture = waterTexture;
			Materials.waterMaterial.bumpTexture =  waterTexture;
			waterTexture.speed  = new BABYLON.Vector2(0.2, 0.5);
			waterTexture.fireColors = [
				BLUE2,
				LTBLUE,
				BLUE4,
				WHITE,
				BLUE3,
				WHITE
			];
			Materials.fireMaterial = new BABYLON.StandardMaterial("fire", scene);
			Materials.fireMaterial.diffuseTexture = fireTexture;
			Materials.fireMaterial.opacityTexture = fireTexture;
			callback();
		});
	};

	return Materials;

});
