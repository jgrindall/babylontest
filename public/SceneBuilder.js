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
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, addWallAt, TOP_LEFT, plane, y = SIZE/2, walls = [];
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
			walls.push(plane);
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
		return walls;
	};

	SceneBuilder.addBoxes = function(quads){
		var y = SIZE/2, boxes = [], TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			var box = MeshCache.getBoxFromCache(size);
			var x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			var z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			if(quad[2] < quad[3]){
				box.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			box.isVisible = false;
			box.position.x = x;
			box.position.z = z;
			box.position.y = y;
			box.freezeWorldMatrix();
			boxes.push(box);
		});
		return boxes;
	};

	SceneBuilder.cache = function(scene, data, greedy){
		var greedy, lengthsNeeded;
		MeshCache.clear();
		lengthsNeeded = GridUtils.getLengthsNeeded(data);
		_.each(greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		_.each(lengthsNeeded, function(lengths, key){
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
	};

	SceneBuilder.addFromData = function(scene, data){
		var greedy, boxes, walls;
		greedy = GreedyMesh.get(data);
		GridUtils.addFaces(data);
		SceneBuilder.cache(scene, data, greedy);
		boxes = SceneBuilder.addBoxes(greedy.quads);
		walls = SceneBuilder.addWalls(data);
	};

	SceneBuilder.addBill = function(pos, scene){
		var y = SIZE/2;
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var plane = BABYLON.Mesh.CreatePlane("", 2, scene);
		var mat = new BABYLON.StandardMaterial("keyMaterial", scene);
		var cMat = new BABYLON.StandardMaterial("keyMaterial", scene);
		var bill = BABYLON.MeshBuilder.CreateBox("character", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		bill.checkCollisions = true;
		bill.material = cMat;
		cMat.diffuseColor = BABYLON.Color3.Red();
		cMat.alpha = 0.2;
		bill.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		mat.diffuseTexture = new BABYLON.Texture("assets/key.png", scene);
		mat.diffuseTexture.hasAlpha = true;
		mat.backFaceCulling = false
		mat.freeze();
		plane.parent = bill;
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		plane.material = mat;
		return bill;
	};

	SceneBuilderaddCharacters = function(posns){
		_.each(posns, function(pos, i){
			if(i<= 20){
				addCharacter(pos, i);
			}
		})
	};

	SceneBuilderaddCharacter = function(pos, i){
		var y = SIZE/2;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		if(Math.random() < 0.5){
			character = MeshCache.getBillboard("key");
		}
		else{
			character = MeshCache.getBillboard("baddie");
		}
		character.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		character.v = new BABYLON.Vector3(Math.random(), 0, Math.random());
		characters.push(character);
	};

	SceneBuilder.addPlayer = function(pos, scene){
		console.log("add player at ", pos);
		var y = SIZE/2;
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseColor = new BABYLON.Color3(0.7, 0, 0.7); // purple
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.material = mat;
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		player.ellipsoid = new BABYLON.Vector3(SIZE/3, SIZE/3, SIZE/3);
		return player;
	};

	SceneBuilder.addCharacter = function(pos, scene){
		var y = SIZE/2;
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/red.jpg", scene);
		mat.backFaceCulling = false;
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var character = BABYLON.MeshBuilder.CreateBox("character", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		character.material = mat;
		character.checkCollisions = true;
		character.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		return character;
	};

	SceneBuilder.addSky = function(scene){
		var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:512}, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skybox.material = skyboxMaterial;
	};

	SceneBuilder.addGround = function(scene){
		var SIZE_MAX = Math.max(SIZE_I, SIZE_J);
		var ground = BABYLON.Mesh.CreatePlane("ground", SIZE_MAX*SIZE, scene);
		ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		ground.material.diffuseTexture = new BABYLON.Texture("assets/groundMat.jpg", scene);
		ground.material.backFaceCulling = false;
		ground.position = new BABYLON.Vector3(SIZE_MAX*SIZE/2, 0, SIZE_MAX*SIZE/2);
		ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
		ground.checkCollisions = true;
	};


	return SceneBuilder;

});
