define([], function(){

	"use strict";

	var MeshCache = function(materialsCache){
		this.materialsCache = materialsCache;
		this._cache = {};
		this._cacheI = 0;
	};

	MeshCache.prototype.clear = function(){
		this.materialsCache = null;
		_.each(this._cache, function(mesh, key){
			mesh.material = null;
			mesh.dispose();
		});
		this._cache = {};
		this._cacheI = 0;
	};

	MeshCache.prototype.add = function(scene, mesh, key, options){
		mesh.setEnabled(false);
		this._cache[key] = mesh;
		scene.meshes.pop(); // remove it from the display list because it was added automatically
	};

	MeshCache.prototype.get = function(key){
		var cached = this._cache[key];
		if(cached){
			this._cacheI++;
			return cached.createInstance(key + "_index_" + this._cacheI);
		}
		return null;
	};

	MeshCache.prototype.getPlaneWithTexture = function(key, scaleW, scaleH, texture, scene){
		var mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*scaleH, "width":SIZE*scaleW}, scene);
		this.materialsCache.applyToMesh(mesh, 1, texture);
		return mesh;
	};

	MeshCache.prototype.getObject = function(scene, texture){
		var mesh, key = "object_" + texture;
		mesh = this.get(key);
		if(mesh){
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			return mesh;
		}
		else{
			mesh = this.getPlaneWithTexture(key, 0.333, 0.333, texture, scene);
			mesh.convertToUnIndexedMesh();
			this.add(scene, mesh, key);
			return this.getObject(scene, texture);
		}
	};

	MeshCache.prototype.getBox = function(scene, size){
		size = (size[0] >= size[1]) ? [size[0], size[1]] : [size[1], size[0]];
		var mesh, w, h, key;
		w = size[0];
		h = size[1];
		key = "box_" + w + "_" + h;
		mesh = this.get(key);
		if(mesh){
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			mesh = BABYLON.MeshBuilder.CreateBox(key, {"height": SIZE, width:SIZE*size[0], "depth":SIZE*size[1]}, scene);
			mesh.convertToUnIndexedMesh()
			this.add(scene, mesh, key);
			return this.getBox(scene, size);
		}
	};

	MeshCache.prototype.getPlane = function(scene, size, texture){
		var mesh, key = "plane_" + texture + "_" + size;
		mesh = this.get(key);
		if(mesh){
			return mesh;
		}
		else{
			mesh = this.getPlaneWithTexture(key, size, 1, texture, scene);
			mesh.convertToUnIndexedMesh();
			this.add(scene, mesh, key);
			return this.getPlane(scene, size, texture);
		}
	};

	MeshCache.prototype.getDoor = function(scene, texture){
		var mesh, key = "door_" + texture, mesh0, mesh1, mesh2, mesh3;
		mesh = this.get(key);
		if(mesh){
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			mesh0 = this.getPlaneWithTexture(key, 1, 1, "door", scene);
			mesh1 = this.getPlaneWithTexture(key, 1, 1, "door", scene);
			mesh2 = this.getPlaneWithTexture(key, 1, 1, "door", scene);
			mesh3 = this.getPlaneWithTexture(key, 1, 1, "door", scene);
			mesh1.position.z = SIZE/2;
			mesh3.position.z = -SIZE/2;
			mesh0.position.x = -SIZE/2;
			mesh2.position.x = SIZE/2;
			mesh0.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh2.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI/2, BABYLON.Space.Local);
			mesh1.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.Local);
			this.add(scene, BABYLON.Mesh.MergeMeshes([mesh0, mesh1, mesh2, mesh3]), key);
			return this.getDoor(scene, texture);
		}
	};

	MeshCache.prototype.getFire = function(scene, size){
		size = (size[0] >= size[1]) ? [size[0], size[1]] : [size[1], size[0]];
		var mesh, key, w, h;
		w = size[0];
		h = size[1];
		key = "fire" + "_" + w + "_" + h;
		mesh = this.get(key);
		if(mesh){
			return mesh;
		}
		else{
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*w, "width":SIZE*h}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh.material = this.materialsCache.fireMaterial;
			this.add(scene, mesh, key);
			return this.getFire(scene, size);
		}
	};

	MeshCache.prototype.getWater = function(scene, size){
		size = (size[0] >= size[1]) ? [size[0], size[1]] : [size[1], size[0]];
		var mesh, key, w, h;
		key  = "water" + "_" + w + "_" + h;
		mesh = this.get(key);
		if(mesh){
			return mesh;
		}
		else{
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*w, "width":SIZE*h}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh.material = this.materialsCache.waterMaterial;
			this.add(scene, mesh, key);
			return this.getWater(scene, size);
		}
	};

	MeshCache.prototype.getBaddie = function(scene, texture){
		var mesh, key = "baddie_" + texture;
		mesh = this.get(key);
		if(mesh){
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			return mesh;
		}
		else{
			mesh = this.getPlaneWithTexture(key, 0.75, 0.75, texture, scene);
			mesh.convertToUnIndexedMesh();
			this.add(scene, mesh, key);
			return this.getBaddie(scene, texture);
		}
	};

	return MeshCache;

});
