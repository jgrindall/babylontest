define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var MeshCache = {};
	var cache = {};
	var cacheI = 0;

	MeshCache.clear = function(){
		cache = {};
	};

	MeshCache.addToCache = function(scene, size, SIZE, materialName){
		var key, box;
		console.log("cache", size);
		key = "brick_" + size[0] + "_" + size[1];
		if(!cache[key]){
			box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
			//box.material = Materials.brickMaterial;
			//box.material.alpha = 0;
			cache[key] = box;
			scene.meshes.pop();
		}
		var key_plane0 = "brick_" + size[0], key_plane1 = "brick_" + size[1];
		if(!cache[key_plane0]){
			var plane0 = BABYLON.MeshBuilder.CreatePlane(key_plane0, {height: SIZE, width:SIZE*size[0]}, scene);
			cache[key_plane0] = plane0;
			plane0.material = Materials.steelMaterial;
			MeshUtils.setUVScale(plane0, size[0], 1);
			scene.meshes.pop();
		}
		if(!cache[key_plane1]){
			var plane1 = BABYLON.MeshBuilder.CreatePlane(key_plane1, {height: SIZE, width:SIZE*size[1]}, scene);
			cache[key_plane1] = plane1;
			plane1.material = Materials.steelMaterial;
			MeshUtils.setUVScale(plane1, size[1], 1);
			scene.meshes.pop();
		}
	};

	MeshCache.addToCache2 = function(scene, size, SIZE, materialName){
		var key, box, VERT_COUNT = 24;
		key = "brick_" + size[0] + "_" + size[1];
		box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
		box.setVerticesData("_width", _.map(_.range(VERT_COUNT), function(){return size[0];}), false, 1);
		box.setVerticesData("_depth", _.map(_.range(VERT_COUNT), function(){return size[1];}), false, 1);
		//box.convertToUnIndexedMesh();
		var code = {
	        vertexElement: "vertexShaderCode",
	        fragmentElement: "fragmentShaderCode"
	    };
	    var vars = {
	        attributes: ["position", "uv", "normal", "_depth", "_width"],
	        uniforms: ["worldViewProjection", "worldViewProjectionInverse"]
	    };
		var shaderMaterial = new BABYLON.ShaderMaterial("shaderMaterial", scene, code, vars);
        shaderMaterial.setTexture("textureSampler", Materials.getTexture("brick"), scene);
        box.material = shaderMaterial;
		//MeshUtils.setUVScale(box, size[0], size[1]);
		cache[key] = box;
		scene.meshes.pop();
	};

	MeshCache.setForDims = function(scene, dims, SIZE, materialName){
		MeshCache.clear();
		_.each(dims, function(size){
			MeshCache.addToCache(scene, size, SIZE, materialName);
		});
	};

	MeshCache.getBoxFromCache = function(size, materialName){
		var cached, box, key = materialName + "_" + size[0] + "_" + size[1];
		cached = cache[key];
		cacheI++;
		box = cached.createInstance("index: " + cacheI);
 		//box.material = cached.material;
		box.checkCollisions = true;
		box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:10, restitution:0.5, friction:0.5});
		return box;
	};

	MeshCache.getPlaneFromCache = function(size, materialName){
		var cached, plane, key = materialName + "_" + size;
		cached = cache[key];
		cacheI++;
		plane = cached.createInstance("index: " + cacheI);
 		plane.material = cached.material;
		return plane;
	};

	return MeshCache;

});

