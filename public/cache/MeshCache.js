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

	MeshCache.prototype.get = function(){

	};

	MeshCache.prototype.addBoxToCache = function(scene, size, SIZE){
		var key = "box" + "_" + size[0] + "_" + size[1], mesh;
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {"height": SIZE, width:SIZE*size[0], "depth":SIZE*size[1]}, scene);
			mesh.convertToUnIndexedMesh();
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.addPlanesToCache = function(scene, lengths, texture){
		var _this = this;
		_.each(lengths, function(len){
			var key = "plane_" + texture + "_" + len, mesh;
			if(!_this._cache[key]){
				mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE, "width":SIZE*len}, scene);
				mesh.convertToUnIndexedMesh();
				_this.materialsCache.applyToMesh(mesh, len, texture);
				_this.add(scene, mesh, key);
			}
		});
	};

	MeshCache.prototype.addObjectToCache = function(scene, texture){
		var key = "object_" + texture, mesh, h;
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*0.33, "width":SIZE*0.33}, scene);
			mesh.convertToUnIndexedMesh();
			this.materialsCache.applyToMesh(mesh, 1, texture);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.getObjectFromCache = function(scene, texture){
		var cached, mesh, key = "object_" + texture;
		cached = this._cache[key];
		if(cached){
			mesh = cached.createInstance("object index: " + this._cacheI);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this._cacheI++;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.addBillboardBoxToCache = function(scene){
		var key, mesh;
		key = "billboardbox";
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {"height": SIZE, "width":SIZE, "depth":SIZE}, scene);
			mesh.convertToUnIndexedMesh();
			mesh.checkCollisions = true;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.addBaddieToCache = function(scene, texture){
		var key = "billboardplane_" + texture, mesh;
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*0.75, "width":SIZE*0.75}, scene);
			mesh.convertToUnIndexedMesh();
			this.materialsCache.applyToMesh(mesh, 1, texture);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.getBoxFromCache = function(size){
		var cached, mesh, key = "box_" + size[0] + "_" + size[1];
		cached = this._cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + this._cacheI);
			this._cacheI++;
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getPlaneFromCache = function(size, texture){
		var cached, mesh, key = "plane_" + texture + "_" + size;
		cached = this._cache[key];
		if(cached){
			this._cacheI++;
			mesh = cached.createInstance("index: " + this._cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getBillboardBoxFromCache = function(){
		var cached, mesh, key = "billboardbox";
		cached = this._cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + this.cacheI);
			this._cacheI++;
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.addWaterToCache = function(scene, size){
		var key, mesh;
		key = "water" + "_" + size[0] + "_" + size[1];
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*size[0], "width":SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh.material = this.materialsCache.waterMaterial;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.addDoor = function(scene, texture){
		var key, mesh0, mesh1, mesh2, mesh3;
		key = "door_" + texture;
		if(!this._cache[key]){
			mesh0 = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE, "width":SIZE}, scene);
			mesh1 = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE, "width":SIZE}, scene);
			mesh2 = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE, "width":SIZE}, scene);
			mesh3 = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE, "width":SIZE}, scene);
			this.materialsCache.applyToMesh(mesh0, 1, "door");
			this.materialsCache.applyToMesh(mesh1, 1, "door");
			this.materialsCache.applyToMesh(mesh2, 1, "door");
			this.materialsCache.applyToMesh(mesh3, 1, "door");
			mesh1.position.z = SIZE/2;
			mesh3.position.z = -SIZE/2;
			mesh0.position.x = -SIZE/2;
			mesh2.position.x = SIZE/2;
			mesh0.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh2.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI/2, BABYLON.Space.Local);
			mesh1.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.Local);
			this.add(scene, BABYLON.Mesh.MergeMeshes([mesh0, mesh1, mesh2, mesh3]), key);
		}
	};

	MeshCache.prototype.getDoorFromCache = function(texture){
		var cached, mesh, key = "door_" + texture;
		cached = this._cache[key];
		if(cached){
			this._cacheI++;
			mesh = cached.createInstance("index: " + this._cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getFireFromCache = function(size){
		var cached, mesh, key = "fire" + "_" + size[0] + "_" + size[1];
		cached = this._cache[key];
		if(cached){
			this._cacheI++;
			mesh = cached.createInstance("index: " + this._cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.addFireToCache = function(scene, size){
		var key, mesh;
		key = "fire" + "_" + size[0] + "_" + size[1];
		if(!this._cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": SIZE*size[0], "width":SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			mesh.material = this.materialsCache.fireMaterial;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.getWaterFromCache = function(size){
		var cached, mesh, key = "water" + "_" + size[0] + "_" + size[1];
		cached = this._cache[key];
		if(cached){
			this._cacheI++;
			return cached.createInstance("index: " + this._cacheI);
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getBaddieFromCache = function(texture){
		var cached, mesh, key = "billboardplane_" + texture;
		cached = this._cache[key];
		if(cached){
			mesh = cached.createInstance("index: " + this._cacheI);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this._cacheI++;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	return MeshCache;

});
