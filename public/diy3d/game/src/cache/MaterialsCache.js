var baseURL = "http://" + window.location.host;

define(["diy3d/game/src/Textures", "diy3d/game/src/utils/MeshUtils", "diy3d/game/src/utils/ImageUtils", "diy3d/game/src/cache/MaterialConsts"],

    function(Textures, MeshUtils, ImageUtils, MaterialConsts){

	"use strict";

	var _hasFire = function(data){
	    return 1;
    };

    var _hasWater = function(data){
        return 1;
    };

	var MaterialsCache = function(scene){
	    this.images = {};
	    this.materials = {};
	    this.scene = scene;
	};

	MaterialsCache.prototype.destroy = function(){
	    _.each(this.materials, function(material, key){
            material.opacityTexture = null;
            material.diffuseTexture = null;
            material.bumpTexture = null;
            material.dispose();
        });
        this.images = [];
        this.scene = null;
        this.materials = {};
        this.keys = null;
        this.textures = null;
	};

    MaterialsCache.prototype.addFire = function(){
        var fireTexture, fireMaterial;
        fireTexture = new BABYLON.FireProceduralTexture("fire", 2, this.scene);
        fireTexture.speed = new BABYLON.Vector2(10, 8);
        fireMaterial = new BABYLON.StandardMaterial("fire", this.scene);
        fireMaterial.diffuseTexture = fireTexture;
        fireMaterial.opacityTexture = fireTexture;
        fireMaterial.ambientColor = new BABYLON.Color4(0.95, 0.1, 0.2, 0.4);
        fireMaterial.freeze();
        this.materials["fire"] = fireMaterial;
    };

    MaterialsCache.prototype.addWater = function(){
        var waterTexture, waterMaterial;
        waterTexture = new BABYLON.FireProceduralTexture("water", 4, this.scene); // water is a blue fire.
        waterMaterial = new BABYLON.StandardMaterial("water", this.scene);
        waterMaterial.diffuseColor = MaterialConsts.BLUE1;
        waterMaterial.opacityTexture = waterTexture;
        waterMaterial.bumpTexture = waterTexture;
        waterTexture.speed = new BABYLON.Vector2(0.15, 0.15);
        waterTexture.fireColors = MaterialConsts.WATER;
        waterMaterial.freeze();
        this.materials["water"] = waterMaterial;
    };

    MaterialsCache.prototype.getImage = function(name){
        return this.images[name];
    };

    MaterialsCache.prototype.getMaterial = function(name){
        return this.materials[name];
    };

    MaterialsCache.prototype.loadImages = function(){
        var toLoad, images = this.images;
        toLoad = [
            {
                "name":"lava",
                "url":"/images/diy3d/assets/Lava-0.png"
            },
            {
                "name":"ground",
                "url":"/images/diy3d/assets/groundMat.jpg"
            }
        ];
        return new Promise(function(resolve){
            ImageUtils
            .loadURLs(_.pluck(toLoad, "url"))
            .then(function(imgs){
                _.each(imgs, function(img, i){
                    images[toLoad[i].name] = img;
                });
                resolve();
            });
        });
    };


    MaterialsCache.prototype.loadTextures = function(){
        var _this = this, urls, scene = this.scene;
        urls = _.map(this.keys, function(key){
            return _this.getBase64ForKey(key);
        });
        return new Promise(function(resolve){
            Textures
            .createCanvasFromURLArray(urls)
            .then(function(canvas){
                var material = new BABYLON.StandardMaterial("base64Material", scene);
                material.diffuseTexture = Textures.getTextureFromCanvas(canvas, scene);
                material.diffuseTexture.hasAlpha = true;
                material.freeze();
                _this.materials["base64"] = material;
                resolve();
            });
        });
    };

	MaterialsCache.prototype.load = function(data, callback){
		this.textures = data.textureCache;
        this.keys = _.sortBy(_.keys(this.textures), _.identity);
        if(_hasFire(data)){
		    this.addFire();
        }
        if(_hasWater(data)){
            this.addWater();
        }
        Promise.all([this.loadImages(), this.loadTextures()]).then(function (){
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
			mesh.material = this.materials["base64"];
			MeshUtils.setUVOffsetAndScale(mesh, 0, index/this.keys.length, len, 1/this.keys.length);
		}
		else{
			throw new Error("not found", texture);
		}
	};
	return MaterialsCache;
});
