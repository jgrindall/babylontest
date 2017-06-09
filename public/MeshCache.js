define(["MeshUtils", "Materials"], function(MeshUtils, Materials){
	
	var MeshCache = {};
	
	var cache = {};
	
	var cacheI = 0;
	
	MeshCache.clear = function(){
		cache = {};
	};
	
	MeshCache.addToCache = function(scene, size, SIZE, materialName){
		var key, box;
		key = "brick_" + size[0] + "_" + size[1];
		box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
		box.convertToUnIndexedMesh();
		box.material = Materials[materialName + "Material"];
		MeshUtils.setUVScale(box, size[0], size[1]);
		cache[key] = box;
		scene.meshes.pop();
	};
	
	MeshCache.setForDims = function(scene, dims, SIZE, materialName){
		MeshCache.clear();
		_.each(dims, function(size){
			MeshCache.addToCache(scene, size, SIZE, materialName);
		});
	};
	
	MeshCache.getFromCache = function(size, materialName){
		var cached, box, key = materialName + "_" + size[0] + "_" + size[1];
		cached = cache[key];
		cacheI++;
		box = cached.createInstance("_" + cacheI);
		box.checkCollisions = true;
		box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:10, restitution:0.5, friction:0.5});
		return box;
	};

	return MeshCache;

});

