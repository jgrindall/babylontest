define(["GridUtils", "MeshCache", "GreedyMeshAlgo", "Materials"],

	function(GridUtils, MeshCache, GreedyMeshAlgo, Materials){

	"use strict";


	var SceneBuilder = {

	};

	SceneBuilder.makeScene = function(engine){
		var scene = new BABYLON.Scene(engine);
		scene.ambientColor = new BABYLON.Color3(0.8, 0.8, 0.2);
		scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
		scene.fogDensity = 0.02;
		scene.fogStart = 10.0;
		scene.fogEnd = 40.0;
		scene.fogColor = new BABYLON.Color3(0.2, 0.2, 0.3);
		scene.gravity = new BABYLON.Vector3(0, 0, 0);
		scene.collisionsEnabled = true;
		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
		var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, 150, -2), scene);
		light1.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);
		light0.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
		light0.groundColor = new BABYLON.Color3(0.6, 0.6, 0.6);
		light0.intensity = 0.75;
		light1.intensity = 0.75;
		return scene;
	};

	SceneBuilder.addWater = function(scene, pos){
		var y = SIZE/2, container, billboard, babylonPos;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		container = MeshCache.getBillboardBoxFromCache();
		container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);

		var particleSystem = new BABYLON.ParticleSystem("particles", 50, scene);
		particleSystem.particleTexture = new BABYLON.Texture("assets/red.jpg", scene);
		particleSystem.emitter = container;

    	particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    	particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

	    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
	    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
	    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

	    particleSystem.minSize = 0.25;
	    particleSystem.maxSize = 1;

	    particleSystem.minLifeTime = 0.3;
	    particleSystem.maxLifeTime = 1.5;

	    particleSystem.emitRate = 500;

	    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

	    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

	    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
	    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

	    particleSystem.minAngularSpeed = 0;
	    particleSystem.maxAngularSpeed = Math.PI;

	    particleSystem.minEmitPower = 1;
	    particleSystem.maxEmitPower = 3;
	    particleSystem.updateSpeed = 0.005;

	    particleSystem.start();


		return container;
	};

	SceneBuilder.makeCamera = function(scene){
		var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(SIZE_I*SIZE/2, 200, SIZE_J*SIZE/2), scene);
		return camera;
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
					var wallData = a[_i][_j].walls;
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
			box.__quad = quad;
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
		MeshCache.addBillboardBoxToCache(scene);
		MeshCache.addBillboardPlaneToCache(scene, 4);
		MeshCache.addBillboardPlaneToCache(scene, 5);
	};

	SceneBuilder.addFromData = function(scene, grid){
		var greedy, boxes;
		greedy = GreedyMeshAlgo.get(grid);
		GridUtils.addFacesInfoToGrid(grid);
		SceneBuilder.cache(scene, grid, greedy);
		boxes = SceneBuilder.addBoxes(greedy.quads);
		SceneBuilder.addWalls(grid);
		return boxes;
	};

	SceneBuilder.addBaddie = function(pos, i, scene){
		var y = SIZE/2, container, billboard, babylonPos;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var mat = Math.random() < 0.5 ? 4 : 5;
		billboard = MeshCache.getBillboardPlaneFromCache(mat);
		billboard.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		return billboard;
	};

	SceneBuilder.addPlayer = function(pos, scene){
		var y = SIZE/4;
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseColor = new BABYLON.Color3(0.7, 0, 0.7); // purple
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.material = mat;
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		player.ellipsoid = new BABYLON.Vector3(SIZE/4, SIZE/4, SIZE/4);
		return player;
	};

	SceneBuilder.addSky = function(scene){
		var SIZE_MAX = Math.max(SIZE_I, SIZE_J);
		var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skybox.material = skyboxMaterial;
	};

	SceneBuilder.addGround = function(scene){
		var SIZE_MAX = Math.max(SIZE_I, SIZE_J);
		var ground = BABYLON.Mesh.CreateGround("ground", SIZE_MAX*SIZE, SIZE_MAX*SIZE, 32, scene);
		//ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		//ground.material.diffuseTexture = new BABYLON.Texture("assets/groundMat.jpg", scene);
		//ground.material.backFaceCulling = false;
		ground.position = new BABYLON.Vector3(SIZE_MAX*SIZE/2, 0, SIZE_MAX*SIZE/2);
		ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
		//ground.checkCollisions = true;
		//var bumpMaterial = new BABYLON.StandardMaterial("texture1", scene);
		//ground.material.bumpTexture = new BABYLON.Texture("assets/worldHeightMap.jpg", scene)


		//var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene);

		var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);
		lavaMaterial.noiseTexture = new BABYLON.Texture("assets/bricks.png", scene); // Set the bump texture
		lavaMaterial.diffuseTexture = new BABYLON.Texture("assets/key.png", scene); // Set the diffuse texture

		ground.material = lavaMaterial;


		return;


		var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);
		lavaMaterial.noiseTexture = new BABYLON.Texture("assets/bricks.png", scene); // Set the bump texture
		lavaMaterial.diffuseTexture = new BABYLON.Texture("assets/key.png", scene); // Set the diffuse texture
		lavaMaterial.speed = 1.5;
		ground.material = lavaMaterial;




		var water = new BABYLON.WaterMaterial("water", scene);
		var waterMesh = BABYLON.Mesh.CreateSphere("waterMesh", 32, 120, scene);
		water.backFaceCulling = false;
		water.bumpTexture = new BABYLON.Texture("assets/key.png", scene);
		water.windForce = -45;
		water.waveHeight = 1.3;
		//water.addToRenderList(skybox);
		//water.addToRenderList(ground);
		water.waterColor = new BABYLON.Color3(1, 0, 1);
		water.colorBlendFactor = 0.5;
		water.specularColor = new BABYLON.Color3(0, 0, 0);
		waterMesh.material = water;





	};

	return SceneBuilder;

});
