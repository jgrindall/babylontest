define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var cache = {};
	var cacheI = 0;

	var MeshCache = function(){

	};

	MeshCache.clear = function(){
		cache = {};
		cacheI = 0;
	};

	MeshCache.addBoxToCache = function(scene, size, SIZE){
		var key, box;
		key = "box" + "_" + size[0] + "_" + size[1];
		if(!cache[key]){
			box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
			box.convertToUnIndexedMesh();
			box.setEnabled(false);
			cache[key] = box;
			scene.meshes.pop();
		}
	};

	MeshCache.addPlanesToCache = function(scene, lengths, material){
		_.each(lengths, function(len){
			var key = "plane_" + material + "_" + len, plane;
			console.log(key);
			if(!cache[key]){
				plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE, width:SIZE*len}, scene);
				cache[key] = plane;
				plane.convertToUnIndexedMesh();
				plane.material = Materials.base64Material;
				var h = 1/Materials.NUM_MATS;
				MeshUtils.setUVOffsetAndScale(plane, 0, (Materials.NUM_MATS - material)*h, len, h);
				plane.setEnabled(false);
				scene.meshes.pop();
			}
		});
	};

	MeshCache.addBillboardBoxToCache = function(scene){
		var key, box;
		key = "billboardbox";
		if(!cache[key]){
			box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE, depth:SIZE}, scene);
			box.convertToUnIndexedMesh();
			box.checkCollisions = true;
			box.material = Materials.redMaterial;
			cache[key] = box;
			scene.meshes.pop();
		}
	};

	MeshCache.addBillboardPlaneToCache = function(scene, material){
		var key = "billboardplane_" + material, plane;
		if(!cache[key]){
			plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.75, width:SIZE*0.75}, scene);
			cache[key] = plane;
			plane.convertToUnIndexedMesh();
			plane.material = Materials.base64Material;
			plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			var h = 1/Materials.NUM_MATS;
			MeshUtils.setUVOffsetAndScale(plane, 0, (Materials.NUM_MATS - material)*h, 1, h);
			plane.setEnabled(false);
			scene.meshes.pop();
		}
	};

	MeshCache.getBoxFromCache = function(size){
		var cached, box, key = "box_" + size[0] + "_" + size[1];
		cached = cache[key];
		if(cached){
			box = cached.createInstance("box index: " + cacheI);
			cacheI++;
			box.checkCollisions = true;
			return box;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getPlaneFromCache = function(size, key){
		var cached, plane, key = "plane_" + key + "_" + size;
		cached = cache[key];
		if(cached){
			cacheI++;
			plane = cached.createInstance("index: " + cacheI);
	 		plane.material = cached.material;
			return plane;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getBillboardBoxFromCache = function(){
		var cached, box, key = "billboardbox";
		cached = cache[key];
		if(cached){
			box = cached.createInstance("box index: " + cacheI);
			cacheI++;
			box.checkCollisions = true;
			return box;
		}
		else{
			throw new Error("not found " + key);
		}
	};
	
	MeshCache.addWaterToCache = function(scene, size){
		var key, plane;
		key = "water" + "_" + size[0] + "_" + size[1];
		console.log("add water to cache", key);
		if(!cache[key]){
			plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			plane.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
			cache[key] = plane;
			plane.convertToUnIndexedMesh();
			plane.material = Materials.waterMaterial;
			//plane.setEnabled(false);
			scene.meshes.pop();
		}
	};
	
	MeshCache.getFireFromCache = function(size){
		var cached, plane, key = "fire" + "_" + size[0] + "_" + size[1];
		console.log("get fire from cache", key);
		cached = cache[key];
		if(cached){
			cacheI++;
			plane = cached.createInstance("index: " + cacheI);
	 		plane.material = cached.material;
			return plane;
		}
		else{
			throw new Error("not found " + key);
		}
	};
	
	MeshCache.addFireToCache = function(scene, size){
		var key, plane;
		key = "fire" + "_" + size[0] + "_" + size[1];
		console.log("add fire to cache", key);
		if(!cache[key]){
			plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*size[0], width:SIZE*size[1]}, scene);
			plane.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
			cache[key] = plane;
			plane.convertToUnIndexedMesh();
			plane.material = Materials.fireMaterial;
			//plane.setEnabled(false);
			scene.meshes.pop();
		}
	};
	
	MeshCache.getWaterFromCache = function(size){
		var cached, plane, key = "water" + "_" + size[0] + "_" + size[1];
		console.log("get water from cache", key);
		cached = cache[key];
		if(cached){
			cacheI++;
			plane = cached.createInstance("index: " + cacheI);
	 		plane.material = cached.material;
			return plane;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getBaddieFromCache = function(key){
		var cached, plane, key = "billboardplane_" + key;
		cached = cache[key];
		if(cached){
			cacheI++;
			plane = cached.createInstance("index: " + cacheI);
	 		plane.material = cached.material;
			plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			return plane;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	return MeshCache;

});
