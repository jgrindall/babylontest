define(["GridUtils", "MeshCache", "GreedyMesh", "Materials"],

	function(GridUtils, MeshCache, GreedyMesh, Materials){

	var SceneBuilder = {

	};

	SceneBuilder.makeScene = function(engine){
		var scene = new BABYLON.Scene(engine);
		var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, 150, -2), scene);
		var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(SIZE_I*SIZE/2, 200, SIZE_J*SIZE/2), scene);
		scene.gravity = new BABYLON.Vector3(0, 0, 0);
		scene.collisionsEnabled = true;
		camera.checkCollisions = true;
		camera.applyGravity = true;
		camera.ellipsoid = new BABYLON.Vector3(5, 1, 5);
		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
		light0.groundColor = new BABYLON.Color3(1, 1, 1);
		return {
			"scene":scene,
			"camera":camera
		};
	};

	SceneBuilder.addWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, addWallAt, TOP_LEFT, plane, y = SIZE/2;
		TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		addWallAt = function(start, dir, key, len){
			plane = MeshCache.getPlaneFromCache(len, key);
			if(dir === "s"){
				plane.position.x = TOP_LEFT.x + (start[1] + len/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (start[0] + 1)*SIZE;
				plane.position.y = y;
			}
			else if(dir === "n"){
				plane.position.x = TOP_LEFT.x + (start[1] + len/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (start[0])*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, Math.PI, 0);
			}
			else if(dir === "w"){
				plane.position.x = TOP_LEFT.x + (start[1])*SIZE;
				plane.position.z = TOP_LEFT.z - (start[0] + len/2)*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			else if(dir === "e"){
				plane.position.x = TOP_LEFT.x + (start[1] + 1)*SIZE;
				plane.position.z = TOP_LEFT.z - (start[0] + len/2)*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
			}
			plane.freezeWorldMatrix();
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				_.each(["n", "s", "w", "e"], function(dir){
					wallData = a[_i][_j].walls;
					if(wallData[dir] >= 1){
						addWallAt([_i, _j], dir, a[_i][_j].val, wallData[dir]);
					}
				});
			}
		}
	};

	SceneBuilder.addBoxes = function(quads){
		var y = SIZE/2;
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			var wall = MeshCache.getBoxFromCache(size);
			var x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			var z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			if(quad[2] < quad[3]){
				wall.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			wall.isVisible = false;
			wall.position.x = x;
			wall.position.z = z;
			wall.position.y = y;
			wall.freezeWorldMatrix();
		});
	};

	SceneBuilder.cache = function(scene, data){
		var greedy, lengthsNeeded;
		MeshCache.clear();
		greedy = GreedyMesh.get(data);
		lengthsNeeded = GridUtils.getLengthsNeeded(data);
		_.each(greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		_.each(lengthsNeeded, function(lengths, key){
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
	};

	SceneBuilder.addFromData = function(scene, data){
		GridUtils.addFaces(data);
		SceneBuilder.cache(scene, data);
		var greedy = GreedyMesh.get(data);
		SceneBuilder.addBoxes(greedy.quads);
		SceneBuilder.addWalls(data);
	};

	return SceneBuilder;

});
