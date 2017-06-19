define(["MeshUtils", "Materials"], function(MeshUtils, Materials){

	var cache = {};
	var cacheI = 0;

	var MeshCache = function(){

	};

	MeshCache.clear = function(){
		cache = {};
		cacheI = 0;
	};

	MeshCache.cacheBillboardContainer = function(scene){
		var box, plane;
		if(!cache["billboard_container"]){
			box = BABYLON.MeshBuilder.CreateBox("billboard_container", {height: SIZE, width:SIZE, depth:SIZE}, scene);
			box.convertToUnIndexedMesh();
			box.setEnabled(false);
			cache["billboard_container"] = box;
			box.material = Materials.redMaterial;
			//scene.meshes.pop();
		}
	};

	MeshCache.cacheBillboardPlane = function(materialName, scene){
		var key = "billboardplane_" + materialName;
		var plane = BABYLON.MeshBuilder.CreatePlane(key, {height: SIZE*0.75, width:SIZE*0.75}, scene);
		if(!cache[key]){
			plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			//plane.setEnabled(false);
			if(materialName === "key"){
				plane.material = Materials.keyMaterial;
			}
			else{
				plane.material = Materials.baddieMaterial;
			}
			cache[key] = plane;
			//scene.meshes.pop();
		}
	};

	MeshCache.cacheBillboard = function(materialName, scene){
		var key = "billboard_" + materialName, container, plane;
		if(!cache[key]){
			container = cache["billboard_container"].clone("container_" + Math.random());
			plane = cache["billboardplane_" + materialName].clone("plane_" + Math.random());
			plane.parent = container;
			cache[key] = container;
		}
	};

	MeshCache.addBoxToCache = function(scene, size, SIZE){
		var key, box;
		key = "box" + "_" + size[0] + "_" + size[1];
		if(!cache[key]){
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

	MeshCache.getBillboard = function(materialName, scene){
		var box = BABYLON.MeshBuilder.CreateBox("billboard_container", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		box.material = Materials.redMaterial;
		var plane = cache["billboardplane_" + materialName].clone("name" + Math.random());
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		if(materialName === "key"){
			plane.material = Materials.keyMaterial;
		}
		else{
			plane.material = Materials.baddieMaterial;
		}
		box.checkCollisions = true;
		plane.parent = box;
		return box;
	};

	MeshCache.getBillboard2 = function(materialName){
		var key = "billboard_" + materialName;
		var cached = cache[key];
		if(cached){
			cacheI++;
			bill = cached.createInstance("index: " + cacheI);
			bill.checkCollisions = true;
			return bill;
		}
		else{
			throw new Error("not found " + key);
		}
	};

	return MeshCache;

});
