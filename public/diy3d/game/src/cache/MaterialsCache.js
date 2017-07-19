define(["diy3d/game/src/Textures", "diy3d/game/src/utils/MeshUtils", "diy3d/game/src/cache/MaterialConsts"], function(Textures, MeshUtils, MaterialConsts){

	"use strict";

	var MaterialsCache = function(textures){
		this.keys = _.sortBy(_.keys(textures), _.identity);
		this.textures = textures;
	};

	MaterialsCache.prototype.destroy = function(){
		this.waterMaterial.opacityTexture = null;
		this.fireMaterial.diffuseTexture = null;
		this.fireMaterial.opacityTexture = null;
		this.base64Material.diffuseTexture = null;
		this.waterMaterial.dispose();
		this.fireMaterial.dispose();
		this.fireMaterial.dispose();
		this.base64Material.dispose();
	};

	MaterialsCache.prototype.load = function(scene, callback){
		var _this = this;
		this.redMaterial = new BABYLON.StandardMaterial("red", scene);
		this.redMaterial.diffuseColor = BABYLON.Color3.Red();
		this.redMaterial.alpha = 0.7;
		this.redMaterial.freeze();
		var waterTexture = new BABYLON.FireProceduralTexture("water", 4, scene); // water is a blue fire.
		var fireTexture = new BABYLON.FireProceduralTexture("fire", 4, scene);
		fireTexture.speed = new BABYLON.Vector2(10, 8);
		this.waterMaterial = new BABYLON.StandardMaterial("water", scene);
		this.waterMaterial.diffuseColor = MaterialConsts.BLUE1;
		this.waterMaterial.opacityTexture = waterTexture;
		this.waterMaterial.bumpTexture =  waterTexture;
		waterTexture.speed = new BABYLON.Vector2(0.15, 0.15);
		waterTexture.fireColors = MaterialConsts.WATER;
		this.fireMaterial = new BABYLON.StandardMaterial("fire", scene);
		this.fireMaterial.diffuseTexture = fireTexture;
		this.fireMaterial.opacityTexture = fireTexture;
		this.fireMaterial.ambientColor = new BABYLON.Color4(0.95, 0.1, 0.2, 0.4);

		Textures
		.createCanvasFromURLArray(_.map(this.keys, function(key){
			return _this.textures[key];
		}))
		.then(function(canvas){
			_this.base64Material = new BABYLON.StandardMaterial("base64Material", scene);
			_this.base64Material.diffuseTexture = Textures.getTextureFromCanvas(canvas, scene);
			_this.base64Material.diffuseTexture.hasAlpha = true;
			_this.base64Material.freeze();
			callback();
		});
	};

	MaterialsCache.prototype.getBase64ForKey = function(key){
		return this.textures[key];
	};

	MaterialsCache.prototype.applyToMesh = function(mesh, len, texture){
		var index = this.keys.indexOf(texture);
		if(index >= 0){
			index = this.keys.length - 1 - index;
			mesh.material = this.base64Material;
			MeshUtils.setUVOffsetAndScale(mesh, 0, index/this.keys.length, len, 1/this.keys.length);
		}
		else{
			throw new Error("not found", texture);
		}
	};
	return MaterialsCache;
});
