define(["diy3d/game/src/utils/MeshUtils", "diy3d/game/src/cache/MeshMaker"], function(MeshUtils, MeshMaker){

	"use strict";

	var MeshCache = function(game, type){
		this.game = game;
		this._type = type;
        this._maker = new MeshMaker(game, type);
	};

    MeshCache.prototype._add = function(name){
        var mesh = this._maker.make(MeshCache._getId(this._type, name));
        mesh.setEnabled(false);
        mesh.isVisble = false;
        this.game.materialsCache.applyToMesh(mesh, this._type, name);
    };

    MeshCache.prototype.get = function(name, newId){
        var mesh, cached = this.game.scene.getMeshByID(MeshCache._getId(this._type, name));
		if(cached){
		    mesh = cached.createInstance(newId);
            mesh.billboardMode = cached.billboardMode;
			return mesh;
		}
		else{
		    throw "cached mesh not found " + name;
        }
	};

    MeshCache.prototype.set = function(names){
        _.each(names, this._add.bind(this));
        return this;
    };

    MeshCache._getId = function(type, name){
        return type + "_" + name;
    };

    return MeshCache;

});
