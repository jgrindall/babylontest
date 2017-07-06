define(["GridUtils", "MeshCache", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, MeshCache, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var SceneBuilder = {

	};

	SceneBuilder.makeScene = function(engine){
		var scene = new BABYLON.Scene(engine);
		scene.collisionsEnabled = true;
		LightBuilder.build(scene, window._LIGHTS);
		EffectBuilder.build(scene, window._EFFECTS);
		return scene;
	};

	SceneBuilder.addFire = function(){};

	/*SceneBuilder.addWater2 = function(scene, pos){
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
	*/

	SceneBuilder.makeCamera = function(scene){
		var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(SIZE_I*SIZE/2, 200, SIZE_J*SIZE/2), scene);
		//var postProcess = new BABYLON.RefractionPostProcess("Refraction", "assets/normal.png", new BABYLON.Color3(1.0, 1.0, 1.0), 0.5, 0.5, 1.0, camera);
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
					var wallData = a[_i][_j].data.walls;
					if(wallData[dir] >= 1){
						addWallAt([_i, _j], dir, a[_i][_j].data.texture, wallData[dir]);
					}
				});
			}
		}
		return walls;
	};

	SceneBuilder.addObject = function(pos, scene, texture){
		var y = SIZE/4, container, mesh, babylonPos, mat;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = MeshCache.getObjectFromCache(scene, texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		return mesh;
	};

	SceneBuilder.addBoxes = function(quads){
		var y = SIZE/2, TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, box, x, z;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			box = MeshCache.getBoxFromCache(size);
			x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			if(quad[2] < quad[3]){
				box.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			box.isVisible = false;
			box.position.x = x;
			box.position.z = z;
			box.position.y = y;
			box.freezeWorldMatrix();
		});
	};

	SceneBuilder.addFromData = function(scene, g){
		SceneBuilder.addBoxes(g.greedy.quads);
		SceneBuilder.addWalls(g.grid);
		SceneBuilder.addWater(g.greedyWater.quads);
		SceneBuilder.addFire(g.greedyFire.quads);
	};

	SceneBuilder.addWater = function(quads){
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, plane;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			plane = MeshCache.getWaterFromCache(size);
			plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			plane.position.y = 0.001;
			if(quad[3] < quad[2]){
				plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
			}
			plane.freezeWorldMatrix();
		});
	};

	SceneBuilder.addFire = function(quads){
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, plane;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			plane = MeshCache.getFireFromCache(size);
			if(quad[3] < quad[2]){
				plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
			}
			plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			plane.position.y = 0.001;
			plane.freezeWorldMatrix();
		});
	};

	SceneBuilder.addBaddie = function(pos, i, scene){
		var y = SIZE/2, container, billboard, babylonPos, texture;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		texture = Math.random() < 0.5 ? "bird" : "baddie";
		billboard = MeshCache.getBaddieFromCache(texture);
		billboard.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		return billboard;
	};

	SceneBuilder.addPlayer = function(pos, scene){
		var y = SIZE/2;
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
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

	SceneBuilder.addCeil = function(scene, g){
		return;
		var img = new Image();
		var groundWidth = SIZE_J*SIZE;
		var groundHeight = SIZE_I*SIZE;
		var ground = BABYLON.MeshBuilder.CreatePlane("ground", {height: groundHeight, width:groundWidth, sideOrientation:BABYLON.Mesh.BACKSIDE}, scene);
		ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		ground.position = new BABYLON.Vector3(groundWidth/2, SIZE, groundHeight/2);
		ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
		img.onload = function(){
			var c = document.createElement("canvas");
			c.width = img.width;
			c.height = img.height;
			var scaleX = img.width / SIZE_J;
			var scaleY = img.height / SIZE_I;
			c.getContext("2d").drawImage(img, 0, 0);
			var base64 = c.toDataURL();
			ground.material.diffuseTexture = new BABYLON.Texture("data:b6423", scene, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, base64, true);
		};
		img.src = "assets/roof.jpg";
	};

	SceneBuilder.addGround = function(scene, g){
		var img = new Image();
		var waterQuads = g.greedyWater.quads;
		var fireQuads = g.greedyFire.quads;
		var groundWidth = SIZE_J*SIZE;
		var groundHeight = SIZE_I*SIZE;
		var ground = BABYLON.MeshBuilder.CreatePlane("ground", {height: groundHeight, width:groundWidth}, scene);
		ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		ground.position = new BABYLON.Vector3(groundWidth/2, 0, groundHeight/2);
		ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
		img.onload = function(){
			var c = document.createElement("canvas");
			c.width = img.width;
			c.height = img.height;
			var scaleX = img.width / SIZE_J;
			var scaleY = img.height / SIZE_I;
			c.getContext("2d").drawImage(img, 0, 0);
			c.getContext("2d").fillStyle = "#4dc9ff";
			_.each(waterQuads, function(quad){
				c.getContext("2d").fillRect(scaleX*quad[1], scaleY*quad[0], scaleX*quad[2], scaleY*quad[3]);
			});
			c.getContext("2d").fillStyle = "#FFA500";
			_.each(fireQuads, function(quad){
				c.getContext("2d").fillRect(scaleX*quad[1], scaleY*quad[0], scaleX*quad[2], scaleY*quad[3]);
			});
			var base64 = c.toDataURL();
			ground.material.diffuseTexture = new BABYLON.Texture("data:b642", scene, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, base64, true);
		};
		img.src = "assets/groundMat.jpg";
	};

	return SceneBuilder;

});
