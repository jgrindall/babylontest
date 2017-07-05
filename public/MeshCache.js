define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var cache = {};
	var cacheI = 0;

	var MeshCache = function(){

	};

	MeshCache.clear = function(){
		cache = {};
		cacheI = 0;
	};

	MeshCache.cache = function(scene, mesh, key, options){
		mesh.setEnabled(false);
		cache[key] = mesh;
		scene.meshes.pop(); // remove it from the display list
	};

	MeshCache.addBoxToCache = function(scene, size, SIZE){
		var key = "box" + "_" + size[0] + "_" + size[1], mesh;
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
			mesh.convertToUnIndexedMesh();
			MeshCache.cache(scene, mesh, key);
		}
	};

	MeshCache.addPlanesToCache = function(scene, lengths, material){
		_.each(lengths, function(len){
			var key = "plane_" + material + "_" + len, mesh;
			if(!cache[key]){
				mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE, width:SIZE*len}, scene);
				mesh.convertToUnIndexedMesh();
				mesh.material = Materials.base64Material;
				MeshUtils.setUVOffsetAndScale(mesh, 0, 1 - (material/Materials.NUM_MATS), 1, 1/Materials.NUM_MATS);
				MeshCache.cache(scene, mesh, key);
			}
		});
	};
	
	MeshCache.addObjectToCache = function(scene, material){
		var key = "object_" + material, mesh, h;
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.5, width:SIZE*0.5}, scene);
			mesh.convertToUnIndexedMesh();
			mesh.material = Materials.base64Material;
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			MeshUtils.setUVOffsetAndScale(mesh, 0, 1 - (material/Materials.NUM_MATS), 1, 1/Materials.NUM_MATS);
			MeshCache.cache(scene, mesh, key);
		}
	};
	
	MeshCache.getObjectFromCache = function(scene, material){
		var cached, mesh, key = "object_" + material;
		cached = cache[key];
		if(cached){
			mesh = cached.createInstance("object index: " + cacheI);
			//mesh.material = cached.material;
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			cacheI++;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.addBillboardBoxToCache = function(scene){
		var key, mesh;
		key = "billboardbox";
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE, depth:SIZE}, scene);
			mesh.convertToUnIndexedMesh();
			mesh.checkCollisions = true;
			mesh.material = Materials.redMaterial;
			MeshCache.cache(scene, mesh, key);
		}
	};

	MeshCache.addBaddieToCache = function(scene, material){
		var key = "billboardplane_" + material, mesh;
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.75, width:SIZE*0.75}, scene);
			mesh.convertToUnIndexedMesh();
			mesh.material = Materials.base64Material;
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			var h = 1/Materials.NUM_MATS;
			MeshUtils.setUVOffsetAndScale(mesh, 0, (Materials.NUM_MATS - material)*h, 1, h);
			MeshCache.cache(scene, mesh, key);
		}
	};

	MeshCache.getBoxFromCache = function(size){
		var cached, mesh, key = "box_" + size[0] + "_" + size[1];
		cached = cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + cacheI);
			cacheI++;
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getPlaneFromCache = function(size, key){
		var cached, mesh, key = "plane_" + key + "_" + size;
		cached = cache[key];
		if(cached){
			cacheI++;
			mesh = cached.createInstance("index: " + cacheI);
	 		mesh.material = cached.material;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getBillboardBoxFromCache = function(){
		var cached, mesh, key = "billboardbox";
		cached = cache[key];
		if(cached){
			mesh = cached.createInstance("box index: " + cacheI);
			cacheI++;
			mesh.checkCollisions = true;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.addWaterToCache = function(scene, size){
		var key, mesh;
		key = "water" + "_" + size[0] + "_" + size[1];
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			cache[key] = mesh;
			mesh.material = Materials.waterMaterial;
			scene.meshes.pop();
		}
	};

	MeshCache.getFireFromCache = function(size){
		var cached, mesh, key = "fire" + "_" + size[0] + "_" + size[1];
		cached = cache[key];
		if(cached){
			cacheI++;
			mesh = cached.createInstance("index: " + cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.addFireToCache = function(scene, size){
		var key, mesh;
		key = "fire" + "_" + size[0] + "_" + size[1];
		if(!cache[key]){
			mesh = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2, BABYLON.Space.Local);
			cache[key] = mesh;
			mesh.material = Materials.fireMaterial;
			scene.meshes.pop();
		}
	};

	MeshCache.getWaterFromCache = function(size){
		var cached, mesh, key = "water" + "_" + size[0] + "_" + size[1];
		cached = cache[key];
		if(cached){
			cacheI++;
			mesh = cached.createInstance("index: " + cacheI);
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getBaddieFromCache = function(key){
		var cached, mesh, key = "billboardplane_" + key;
		cached = cache[key];
		if(cached){
			cacheI++;
			mesh = cached.createInstance("index: " + cacheI);
	 		//mesh.material = cached.material;
			mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			return mesh;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	return MeshCache;

});
