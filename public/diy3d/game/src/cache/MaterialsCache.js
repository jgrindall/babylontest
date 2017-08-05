
define(["diy3d/game/src/Textures", "diy3d/game/src/utils/MeshUtils", "diy3d/game/src/cache/MaterialConsts"],

    function(Textures, MeshUtils, MaterialConsts){

	"use strict";

	var MaterialsCache = function(scene){
	    this.scene = scene;
	};

    MaterialsCache.prototype.getMaterial = function(name){
        return this.scene.getMaterialByID(name);
    };

    MaterialsCache.prototype._edit = function(data){
        var _this = this;
        _.each(data, function(url, name){
            var material = _this.getMaterial(name);
            if(material){
                material.unfreeze();
                MeshUtils.destroyTextures(material);
                material.diffuseTexture = Textures.getTextureFromURL(name, url, _this.scene);
                material.diffuseTexture.hasAlpha = true;
                material.freeze();
            }
            else{
                throw "material not found " + name;
            }
        });
    };

    MaterialsCache.prototype._createStandard = function(names){
        var scene = this.scene;
        _.each(names, function(name){
            new BABYLON.StandardMaterial(name, scene);
        });
    };

    MaterialsCache.prototype._createFire = function(){
        var fireTexture, fireMaterial;
        fireMaterial = this.getMaterial("fire");
        if(fireMaterial){
            return;
        }
        fireTexture = new BABYLON.FireProceduralTexture("fire", 4, this.scene);
        fireTexture.speed = new BABYLON.Vector2(8, 5);
        fireMaterial = new BABYLON.StandardMaterial("fire", this.scene);
        fireMaterial.diffuseTexture = fireTexture;
        fireMaterial.opacityTexture = fireTexture;
        fireMaterial.ambientColor = new BABYLON.Color4(0.95, 0.1, 0.2, 0.9);
        fireMaterial.freeze();
    };

    MaterialsCache.prototype._createWater = function(){
        var waterTexture, waterMaterial;
        waterMaterial = this.getMaterial("water");
        if(waterMaterial){
            return;
        }
        waterTexture = new BABYLON.FireProceduralTexture("water", 4, this.scene); // water is a blue fire.
        waterMaterial = new BABYLON.StandardMaterial("water", this.scene);
        waterMaterial.diffuseColor = MaterialConsts.BLUE1;
        waterMaterial.opacityTexture = waterTexture;
        waterMaterial.bumpTexture = waterTexture;
        waterTexture.speed = new BABYLON.Vector2(0.5, 0.5);
        waterTexture.fireColors = MaterialConsts.WATER;
        waterMaterial.freeze();
    };

    MaterialsCache.prototype.createMaterials = function(names, type){
        if(type === "water"){
            this._createWater();
        }
        else if(type === "fire"){
            this._createFire();
        }
        else {
            this._createStandard(names);
        }
    };

	MaterialsCache.prototype.update = function(textureList){
        this._textureList = textureList;
        _.each(this._textureList, this._edit.bind(this));
	};

	MaterialsCache.prototype.getBase64ForKey = function(type, name){
		return this._textureList[type][name];
	};

	MaterialsCache.prototype.applyToMesh = function(mesh, type, name){
	    var material = this.getMaterial(name);
        if(material){
            mesh.material = material;
	    }
	    else{
	        throw "not found" + name;
        }
	};

	return MaterialsCache;
});

