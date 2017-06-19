require(["MeshUtils", "MeshCache", "GreedyMesh", "Materials", "GamePad", "lib/entity-manager"], function(MeshUtils, MeshCache, GreedyMesh, Materials, GamePad, EntityManager) {

	var SIZE_I = 24;
	var SIZE_J = 24;
	var SIZE = 7;
	window.SIZE = 7;
	var FRICTION = 0.4;
	var ROT_SPEED = 0.03, SPEED = 0.5;

	var container, canvas, scene, engine, player, characters = [], angle = 0, speed = 0, ang_speed = 0, angle = 0, _mode = "off";

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
	
	var addCharacters = function(posns){
		_.each(posns, function(pos, i){
			if(i<= 20){
				addCharacter(pos, i);
			}
		})
	};

	var addCharacter = function(pos, i){
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

	var checkCollisions = function(){
		_.each(characters, function(character){
			if (character && player && character.intersectsMesh(player, false)) {
				console.log("HIT " + character);
			}
		})
		if(player && container && player.intersectsMesh(container, false)){
			console.log("HIT CHAR");
		}
	};

	var addBill = function(pos){
		var y = SIZE/2;
		container = MeshCache.getBillboard("key");
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
	};

	var addWalls = function(L){
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		var plane, y = SIZE/2;
		_.each(L, function(obj){
			plane = MeshCache.getPlaneFromCache(obj.len, obj.key);
			if(obj.dir === "s"){
				plane.position.x = topLeft.x + (obj.start[1] + obj.len/2)*SIZE;
				plane.position.z = topLeft.z - (obj.start[0] + 1)*SIZE;
				plane.position.y = y;
			}
			else if(obj.dir === "n"){
				plane.position.x = topLeft.x + (obj.start[1] + obj.len/2)*SIZE;
				plane.position.z = topLeft.z - (obj.start[0])*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, Math.PI, 0);
			}
			else if(obj.dir === "w"){
				plane.position.x = topLeft.x + (obj.start[1])*SIZE;
				plane.position.z = topLeft.z - (obj.start[0] + obj.len/2)*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			else if(obj.dir === "e"){
				plane.position.x = topLeft.x + (obj.start[1] + 1)*SIZE;
				plane.position.z = topLeft.z - (obj.start[0] + obj.len/2)*SIZE;
				plane.position.y = y;
				plane.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
			}
			plane.freezeWorldMatrix();
		});
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

	var addExtra4 = function(){
		var y = -3;
		var plane = BABYLON.MeshBuilder.CreatePlane("extra4", {height: 20, width:20}, scene);
		plane.position.x = 0;
		plane.position.z = 0;
		plane.position.y = y;
		plane.checkCollisions = true;
		var mat = new BABYLON.StandardMaterial("brickMaterial2", scene);
		mat.backFaceCulling = false;
		Materials.brickMaterial.diffuseTexture = new BABYLON.Texture("assets/brick.jpg", scene);
		plane.material = mat;
		plane.scaling.z = 5;
		//plane.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution:0.5, friction:0.5 });
		console.log(plane.physicsImpostor);
		plane.physicsImpostor.object.scaling.x = 3;
		plane.physicsImpostor.object.scaling.y = 3;
		plane.physicsImpostor.object.scaling.z = 3;
		console.log(plane.physicsImpostor.object);
		//plane.freezeWorldMatrix();
		//plane.rotation = new BABYLON.Vector3(0, 0 , 0);
		//MeshUtils.setUVScale(plane, 20, 1);

	};
	var birdsEye = function(){
		camera.rotation = new BABYLON.Vector3(Math.PI/2, 0 , 0);
	};




var start = function(){

};



	engine = new BABYLON.Engine(canvas, false, null, false);


	makeScene();
	addControls();
	
	
	var moveBaddies = function(){
		_.each(characters, function(c){
			c.moveWithCollisions(new BABYLON.Vector3(c.v.x/20, 0, c.v.z/20));
			if(Math.random() < 0.2){
				c.v = new BABYLON.Vector3(Math.random(), 0, Math.random());
			}
		});
	};
	
	var moveAll = function(){
		moveBaddies();
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
	};
	
	var addBB = function(pos){
		var y = SIZE/2;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		var plane = BABYLON.MeshBuilder.CreatePlane("bb", {height: SIZE*0.75, width:SIZE*0.75}, scene);
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		//plane.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution:0.5, friction:0.5 });
	    var baddieMaterial = new BABYLON.StandardMaterial("baddieMaterial", scene);
		baddieMaterial.diffuseTexture = new BABYLON.Texture("assets/baddie.png", scene);
		baddieMaterial.freeze();
		plane.material = baddieMaterial;
		plane.checkCollisions = true;
		plane.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
	};

	var init = function(){
		var img = MeshUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.000, values:[0, 1, 2, 3]});
		var greedy = GreedyMesh.get(img);
		var faces = MeshUtils.getFaces(img);

		MeshCache.clear();
		_.each(greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		_.each(faces.lengthsNeeded, function(lengths, key){
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		//MeshCache.cacheBillboardContainer(scene);
		//MeshCache.cacheBillboard("key", scene);
		//MeshCache.cacheBillboard("baddie", scene);
		addBoxes(greedy.quads);
		addWalls(faces.L);


		//console.log(greedy);
		var empty = _.shuffle(MeshUtils.getMatchingLocations(img, 0));
		addPlayer(empty[0]);
		//empty.shift();
		//addBill(empty[1]);
		//empty.shift();
		//addCharacters(empty);
		//addGround();
		//addSky();
		addBB(empty[1]);

		if(BIRDSEYE){
			birdsEye();
		}

		engine.setHardwareScalingLevel(1);
		
		

		engine.runRenderLoop(function () {
			moveAll();
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
