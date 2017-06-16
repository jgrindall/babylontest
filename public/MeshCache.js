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
			console.log("cache ", key);
			box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
			box.convertToUnIndexedMesh();
			box.checkCollisions = true;
			box.setEnabled(false);
			cache[key] = box;
			scene.meshes.pop();
		}
	};

	MeshCache.addPlanesToCache = function(scene, lengths, material, SIZE){
		_.each(lengths, function(len){
			var key = "plane_" + material + "_" + len, plane;
			if(!cache[key]){
				console.log("cache ", key);
				plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE, width:SIZE*len}, scene);
				cache[key] = plane;
				plane.convertToUnIndexedMesh();
				plane.material = Materials.base64Material;
				MeshUtils.setUVOffsetAndScale(plane, 0, material/5, len, 1/5);
				plane.setEnabled(false);
				scene.meshes.pop();
			}
		});
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
		console.log("get plane", key);
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

	return MeshCache;

});
