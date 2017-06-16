require(["MeshUtils", "GridUtils", "MeshCache", "GreedyMesh", "Materials", "GamePad", "lib/entity-manager"],

function(MeshUtils, GridUtils, MeshCache, GreedyMesh, Materials, GamePad, EntityManager) {

	var SIZE_I = 16;
	var SIZE_J = 16;
	var SIZE = 13;
	var FRICTION = 0.4;
	var ROT_SPEED = 0.03, SPEED = 0.5;

	var container, canvas, scene, engine, player, character, angle = 0, speed = 0, ang_speed = 0, angle = 0, _mode = "off";

	var BIRDSEYE = 0, BOXES = true;

	canvas = document.querySelector("#renderCanvas");

	var addControls = function(){
		this.gamePad = new GamePad("zone_joystick");
		this.gamePad.update.add({
			update : function(name, obj){
				if(name === "end"){
					_mode = "off";
					ang_speed = 0;
					speed = 0;
					ang_speed = 0;
					speed = 0;
				}
				else{
					_mode = "on";
					if(obj.d < 0.25){
						// not moved it much
						return;
					}
					var ROT_ANGLE = 50;
					var sf = (obj.d - 0.25) / 0.75;
					sf = Math.sqrt(sf);
					if(obj.a < ROT_ANGLE|| obj.a > 360 - ROT_ANGLE){
						ang_speed = ROT_SPEED * sf;
					}
					else if(obj.a > 180 - ROT_ANGLE && obj.a < 180 + ROT_ANGLE){
						ang_speed = -ROT_SPEED * sf;
					}
					else{
						speed = sf * Math.sin(obj.a*Math.PI/180) * SPEED;
						ang_speed = 0;
					}
				}
			}
		});
	};

	var makeScene = function () {
		scene = new BABYLON.Scene(engine);
		//scene.enablePhysics();
		//var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
		var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, 150, -2), scene);
		//var light2 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);
		//light2.position = new BABYLON.Vector3(0, 20, 0);
		//light2.diffuse = new BABYLON.Color3(1, 1, 1);
		//light2.specular = new BABYLON.Color3(1, 1, 1);
		//var light3 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(2, 5, -2), scene);
		camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(SIZE_I*SIZE/2, 200, SIZE_J*SIZE/2), scene);
		scene.gravity = new BABYLON.Vector3(0, 0, 0);
		scene.collisionsEnabled = true;
		camera.checkCollisions = true;
		camera.applyGravity = true;
		camera.ellipsoid = new BABYLON.Vector3(5, 1, 5);
		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
		light0.groundColor = new BABYLON.Color3(1, 1, 1);
	};

	var addSky = function(){
		var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skybox.material = skyboxMaterial;
	};

	var addGround = function(){
		var SIZE_MAX = Math.max(SIZE_I, SIZE_J);
		var ground = BABYLON.Mesh.CreatePlane("ground", SIZE_MAX*SIZE, scene);
		ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		ground.material.diffuseTexture = new BABYLON.Texture("assets/groundMat.jpg", scene);
		ground.material.backFaceCulling = false;
		ground.position = new BABYLON.Vector3(SIZE_MAX*SIZE/2, 0, SIZE_MAX*SIZE/2);
		//ground.position = new BABYLON.Vector3(0, 0, 0);
		ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
		ground.checkCollisions = true;
	};

	var movePlayer = function(){
		var dx, dz, scaleFactor = (60/engine.getFps());
		angle += ang_speed * scaleFactor;
		player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		dx = speed*Math.sin(angle) * scaleFactor;
		dz = speed*Math.cos(angle) * scaleFactor;
		if(!BIRDSEYE){
			player.isVisible = false;
		}
		player.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
	}

	var matchPlayer = function(){
		//console.log(player.position);
		camera.position = player.position.clone();
		camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
	};

	var ijToBabylon = function(i, j){
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		return {
			x:topLeft.x + j*SIZE,
			z:topLeft.z - i*SIZE
		};
	};

	var addPlayer = function(pos){
		console.log("add player at ", pos);
		var y = SIZE/2;
		//pos = [1, 1];
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseColor = new BABYLON.Color3(0.7, 0, 0.7); // purple
		//mat.backFaceCulling = false;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.material = mat;
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		//player.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0, restitution:0.5, friction:0.5 });
		player.ellipsoid = new BABYLON.Vector3(SIZE/3, SIZE/3, SIZE/3);
	};

	var addCharacter = function(pos){
		var y = SIZE/2;
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/red.jpg", scene);
		mat.backFaceCulling = false;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		character = BABYLON.MeshBuilder.CreateBox("character", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		//character.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution:0.5, friction:0.5 });
		character.material = mat;
		character.checkCollisions = true;
		character.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
	};

	var checkCollisions = function(){
		if (character && player && character.intersectsMesh(player, false)) {
			console.log("HIT");
		}
		if(player && container && player.intersectsMesh(container, false)){
			console.log("HIT CHAR");
		}
	};

	var addBill = function(pos){
		var y = SIZE/2;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		var plane = BABYLON.Mesh.CreatePlane("", 2, scene);
		var mat = new BABYLON.StandardMaterial("keyMaterial", scene);
		var cMat = new BABYLON.StandardMaterial("keyMaterial", scene);
		container = BABYLON.MeshBuilder.CreateBox("character", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		container.checkCollisions = true;
		container.material = cMat;
		cMat.diffuseColor = BABYLON.Color3.Red();
		cMat.alpha = 0.2;
		container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		mat.diffuseTexture = new BABYLON.Texture("assets/key.png", scene);
		mat.diffuseTexture.hasAlpha = true;
		mat.backFaceCulling = false
		mat.freeze();
		plane.parent = container;
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		plane.material = mat;
		//container.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution:0.5, friction:0.5 });
		console.log(container, player);
	};

	var addWalls = function(a){
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


	var addBoxes = function(quads){
		var y = SIZE/2;
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			var wall = MeshCache.getBoxFromCache(size);
			var x = topLeft.x + (quad[1] + quad[2]/2)*SIZE;
			var z = topLeft.z - (quad[0] + quad[3]/2)*SIZE;
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

	var birdsEye = function(){
		camera.rotation = new BABYLON.Vector3(Math.PI/2, 0 , 0);
	};




	var start = function(){

	};



	engine = new BABYLON.Engine(canvas, false, null, false);


	makeScene();
	addControls();



	var init = function(){
		var data = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.1, values:[0, 1, 2, 3, 4]});
		var greedy = GreedyMesh.get(data);
		GridUtils.addFaces(data);
		var lengthsNeeded = GridUtils.getLengthsNeeded(data);
		MeshCache.clear();
		_.each(greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		console.log("lengthsNeeded, ", lengthsNeeded);
		_.each(lengthsNeeded, function(lengths, key){
			console.log("planes, ", lengths, key);
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		addBoxes(greedy.quads);
		addWalls(data);


		//console.log(greedy);
		var empty = _.shuffle(GridUtils.getMatchingLocations(data, 0));
		addPlayer(empty[0]);
		//addCharacter(empty[1]);
		//addGround();
		//addSky();
		//addBill(empty[2]);

		if(BIRDSEYE){
			birdsEye();
		}

		engine.setHardwareScalingLevel(1);


		engine.runRenderLoop(function () {
			if(_mode !== "off"){
				movePlayer();
				if(!BIRDSEYE){
					matchPlayer();
				}
			}
			if(_mode === "off"){
				ang_speed *= FRICTION;
				speed *= FRICTION;
				if(Math.abs(speed) < 0.1){
					speed = 0;
				}
				if(Math.abs(ang_speed) < 0.1){
					ang_speed = 0;
				}
			}
			checkCollisions();
			//console.log("render");
			scene.render();
		});
	};

	Materials.makeMaterials(scene, init);
	scene.debugLayer.show();

	window.addEventListener("resize", function () {
	   engine.resize();
	});

	document.onkeydown = function(e){
		if(e.which === 38){
			// fd
			speed = SPEED;
			_mode = "on";
		}
		else if(e.which === 40){
			// fd
			speed = -SPEED;
			_mode = "on";
		}
		else if(e.which === 37){
			// fd
			speed = 0;
			ang_speed = -ROT_SPEED;
			_mode = "on";
		}
		else if(e.which === 39){
			// fd
			speed = 0;
			ang_speed = ROT_SPEED;
			_mode = "on";
		}
	};

	document.onkeyup = function(){
		speed = 0;
		_mode = "off";
	};


	var manager = new EntityManager();


	var PlayerComponent = {
	    name: 'Player',
	    description: "The player's state",
	    state: {
	        life: 100,
	        strength: 18,
	        charisma: 3,
	    }
	};

	var MessageComponent = {
	    name: 'Message',
	    description: "The message",
	    state: {
	        text:"HELLO THERE!!"
	    }
	};

	var PossessionsComponent = {
		name: 'Possessions',
	    description: "The Possessions",
	    state: {
	        objects:[]
	    }
	};

	console.log(manager);
	manager.addComponent(PlayerComponent.name, PlayerComponent);
	manager.addComponent(MessageComponent.name, MessageComponent);
	manager.addComponent(PossessionsComponent.name, PossessionsComponent);
	var playerId = manager.createEntity(['Player', 'Message', 'Possessions']);
	var playerData = manager.getComponentDataForEntity('Player', playerId);
	playerData.life = 80;
	console.log(playerData);


	var playerData2 = manager.getComponentDataForEntity('Possessions', playerId);
	console.log(playerData2);
});
