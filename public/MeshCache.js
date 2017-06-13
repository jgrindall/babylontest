define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var cache = {};
	var cacheI = 0;

	var MeshCache = function(){

	};

	MeshCache.clear = function(){
		cache = {};
		cacheI = 0;
	};

	MeshCache.addToCache = function(scene, size, SIZE, materialName, options){
		var key_box, box, key_plane0, key_plane1, plane0, plane1;
		key_box = "box" + "_" + size[0] + "_" + size[1];
		key_plane0 = materialName + "_" + size[0], key_plane1 = materialName + "_" + size[1];
		if(options.BOXES){
			if(!cache[key_box]){
				console.log("cache", key_box);
				box = BABYLON.MeshBuilder.CreateBox(key_box, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
				box.convertToUnIndexedMesh();
				box.setEnabled(false);
				cache[key_box] = box;
				scene.meshes.pop();
			}
		}
		if(!cache[key_plane0]){
			console.log("cache", key_plane0);
			plane0 = BABYLON.MeshBuilder.CreatePlane(key_plane0, {height: SIZE, width:SIZE*size[0]}, scene);
			cache[key_plane0] = plane0;
			plane0.convertToUnIndexedMesh();
			plane0.material = (materialName === "brick" ? Materials.brickMaterial : Materials.steelMaterial);
			MeshUtils.setUVScale(plane0, size[0], 1);
			plane0.setEnabled(false);
			scene.meshes.pop();
		}
		if(!cache[key_plane1]){
			console.log("cache", key_plane1);
			plane1 = BABYLON.MeshBuilder.CreatePlane(key_plane1, {height: SIZE, width:SIZE*size[1]}, scene);
			cache[key_plane1] = plane1;
			plane1.convertToUnIndexedMesh();
			plane1.material = (materialName === "brick" ? Materials.brickMaterial : Materials.steelMaterial);
			MeshUtils.setUVScale(plane1, size[1], 1);
			plane1.setEnabled(false);
			scene.meshes.pop();
		}
	};

	MeshCache.addToCache2 = function(scene, size, SIZE, materialName){
		var key, box, VERT_COUNT = 24;
		key = "brick_" + size[0] + "_" + size[1];
		box = BABYLON.MeshBuilder.CreateBox(key, {height: SIZE, width:SIZE*size[0], depth:SIZE*size[1]}, scene);
		box.setVerticesData("_width", _.map(_.range(VERT_COUNT), function(){return size[0];}), false, 1);
		box.setVerticesData("_depth", _.map(_.range(VERT_COUNT), function(){return size[1];}), false, 1);
		box.convertToUnIndexedMesh();
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
		cache[key] = box;
		scene.meshes.pop();
	};

	MeshCache.setForDims = function(scene, dims, SIZE, materialName, options){
		_.each(dims, function(size){
			MeshCache.addToCache(scene, size, SIZE, materialName, options);
		});
	};

	MeshCache.getBoxFromCache = function(size, materialName){
		var cached, box, key = "box_" + size[0] + "_" + size[1];
		cached = cache[key];
		if(cached){
			box = cached.createInstance("index: " + cacheI);
			cacheI++;
			box.checkCollisions = true;
			box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:10, restitution:0.5, friction:0.5});
			return box;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	MeshCache.getPlaneFromCache = function(size, materialName){
		var cached, plane, key = materialName + "_" + size;
		console.log("get", key);
		cached = cache[key];
		cacheI++;
		plane = cached.createInstance("index: " + cacheI);
 		plane.material = cached.material;
		return plane;
	};

	return MeshCache;

});

