define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var MeshCache = function(){
		this.clear();
	};

	MeshCache.prototype.clear = function(){
		this.cache = {};
		this.cacheI = 0;
	};

	MeshCache.prototype.add = function(scene, mesh, key, options){
		mesh.setEnabled(false);
		this.cache[key] = mesh;
		scene.meshes.pop(); // remove it from the display list because it was added automatically
	};

	MeshCache.prototype.addBoxToCache = function(scene, size, SIZE){
		var key = "box" + "_" + size[0] + "_" + size[1], mesh;
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
			mesh.convertToUnIndexedMesh();
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.addPlanesToCache = function(scene, lengths, texture){
		var _this = this;
		_.each(lengths, function(len){
			var key = "plane_" + texture + "_" + len, mesh;
			if(!_this.cache[key]){
				mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE, width:SIZE*len}, scene);
				mesh.convertToUnIndexedMesh();
				Materials.applyToMesh(mesh, len, texture);
				_this.add(scene, mesh, key);
			}
		});
	};

	MeshCache.prototype.addObjectToCache = function(scene, texture){
		var key = "object_" + texture, mesh, h;
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.33, width:SIZE*0.33}, scene);
			mesh.convertToUnIndexedMesh();
			Materials.applyToMesh(mesh, 1, texture);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.getObjectFromCache = function(scene, texture){
		var cached, mesh, key = "object_" + texture;
		cached = this.cache[key];
		if(cached){
			mesh = cached.createInstance("object index: " + this.cacheI);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.cacheI++;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.addBillboardBoxToCache = function(scene){
		var key, mesh;
		key = "billboardbox";
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE, depth:SIZE}, scene);
			mesh.convertToUnIndexedMesh();
			mesh.checkCollisions = true;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.addBaddieToCache = function(scene, texture){
		var key = "billboardplane_" + texture, mesh;
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.75, width:SIZE*0.75}, scene);
			mesh.convertToUnIndexedMesh();
			Materials.applyToMesh(mesh, 1, texture);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.add(scene, mesh, key);
		}
	};

	MeshCache.prototype.getBoxFromCache = function(size){
		var cached, mesh, key = "box_" + size[0] + "_" + size[1];
		cached = this.cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + this.cacheI);
			this.cacheI++;
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getPlaneFromCache = function(size, texture){
		var cached, mesh, key = "plane_" + texture + "_" + size;
		cached = this.cache[key];
		if(cached){
			this.cacheI++;
			mesh = cached.createInstance("index: " + this.cacheI);
	 		mesh.material = cached.material;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getBillboardBoxFromCache = function(){
		var cached, mesh, key = "billboardbox";
		cached = this.cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + cacheI);
			this.cacheI++;
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
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			this.cache[key] = mesh;
			mesh.material = Materials.waterMaterial;
			scene.meshes.pop();
		}
	};

	MeshCache.prototype.getFireFromCache = function(size){
		var cached, mesh, key = "fire" + "_" + size[0] + "_" + size[1];
		cached = this.cache[key];
		if(cached){
			cacheI++;
			mesh = cached.createInstance("index: " + cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.addFireToCache = function(scene, size){
		var key, mesh;
		key = "fire" + "_" + size[0] + "_" + size[1];
		if(!this.cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			this.cache[key] = mesh;
			mesh.material = Materials.fireMaterial;
			scene.meshes.pop();
		}
	};

	MeshCache.prototype.getWaterFromCache = function(size){
		var cached, mesh, key = "water" + "_" + size[0] + "_" + size[1];
		cached = this.cache[key];
		if(cached){
			this.cacheI++;
			return cached.createInstance("index: " + this.cacheI);
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.prototype.getBaddieFromCache = function(key){
		var cached, mesh, key = "billboardplane_" + key;
		cached = this.cache[key];
		if(cached){
			mesh = cached.createInstance("index: " + this.cacheI);
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			this.cacheI++;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	return MeshCache;

});
