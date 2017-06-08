define(["MeshUtils", "Materials"], function(MeshUtils, Materials){
	/* helper functions */
	
	var MeshCache = {};
	
	var cache = {};
	
	var cacheI = 0;
	
	MeshCache.clear = function(){
		cache = {};
	};
	
	MeshCache.addToCache = function(scene, size, SIZE){
		var key, box;
		key = "brick_" + size[0] + "_" + size[1];
		box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
		box.convertToUnIndexedMesh();
		box.material = Materials.brickMaterial;
		MeshUtils.setUVScale(box, size[0], size[1]);
		cache[key] = box;
		scene.meshes.pop();
	};
	
	MeshCache.setForDims = function(scene, dims, SIZE){
		MeshCache.clear();
		_.each(dims, function(size){
			MeshCache.addToCache(scene, size, SIZE);
		});
	};
	
	MeshCache.getFromCache = function(size, material){
		var cached, box, key = material + "_" + size[0] + "_" + size[1];
		cached = cache[key];
		cacheI++;
		box = cached.createInstance("_" + cacheI);
		box.checkCollisions = true;
		return box;
	};

	return MeshCache;

});

