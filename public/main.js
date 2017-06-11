require(["MeshUtils", "MeshCache", "GreedyMesh", "Materials", "GamePad"], function(MeshUtils, MeshCache, GreedyMesh, Materials, GamePad) {
	
	var SIZE_I = 24;
	var SIZE_J = 32;
	var SIZE = 5;
	var FRICTION = 0.4;
	var ROT_SPEED = 0.03, SPEED = 0.5;
	
	var canvas, scene, engine, player, character, angle = 0, speed = 0, ang_speed = 0, angle = 0, _mode = "off";
	
	var BIRDSEYE = 0;

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
		scene.enablePhysics();
		var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
		var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
		camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(SIZE_I*SIZE/2, 250, SIZE_J*SIZE/2), scene);
		scene.gravity = new BABYLON.Vector3(0, 0, 0);
		scene.collisionsEnabled = true;
		camera.checkCollisions = true;
		camera.applyGravity = true;
		camera.ellipsoid = new BABYLON.Vector3(5, 1, 5);
	}

	var addSky = function(){
		var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skybox.material = skyboxMaterial;
			
	};

	var addGround = function(){
		var ground = BABYLON.Mesh.CreatePlane("ground", 2000.0, scene);
		ground.material = new BABYLON.StandardMaterial("groundMat", scene);
		ground.material.diffuseTexture = new BABYLON.Texture("assets/groundMat.jpg", scene);
		ground.material.backFaceCulling = false;
		ground.position = new BABYLON.Vector3(5, -10, -15);
		ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
		ground.checkCollisions = true;
	};


	var movePlayer = function(){
		var dx, dz, scaleFactor = (60/engine.getFps());
		angle += ang_speed * scaleFactor;
		player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		dx = speed*Math.sin(angle) * scaleFactor;
		dz = speed*Math.cos(angle) * scaleFactor;
		player.checkCollisions = true;
		if(!BIRDSEYE){
			player.isVisible = false;
		}
		player.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
	}
	
	var matchPlayer = function(){
		camera.position = player.position.clone();
		camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		console.log();
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
		var y = -SIZE*1.5
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/skybox_nx.jpg", scene);
		mat.backFaceCulling = false;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		player.material = mat;
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		player.ellipsoid = new BABYLON.Vector3(SIZE/3, SIZE/3, SIZE/3);
		player.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0, restitution:0.5, friction:0.5 });
	};
	
	var addCharacter = function(pos){
		var y = -SIZE*1.5
		var mat = new BABYLON.StandardMaterial("Mat", scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/red.jpg", scene);
		mat.backFaceCulling = false;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		character = BABYLON.MeshBuilder.CreateBox("character", {height: SIZE, width:SIZE, depth:SIZE}, scene);
		character.material = mat;
		character.checkCollisions = true;
		character.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
	};

	var checkCollisions = function(){
		if (character.intersectsMesh(player, false)) {
			console.log("HIT");
		}
	};

	var addBill = function(pos){
		var y = -SIZE*1.5;
		var babylonPos = ijToBabylon(pos[0], pos[1]);
		var plane = BABYLON.Mesh.CreatePlane("", 2, scene);
		var mat = new BABYLON.StandardMaterial("keyMaterial", scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/key.png", scene);
		mat.diffuseTexture.hasAlpha = true;
		mat.backFaceCulling = false
		mat.freeze();
		plane.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		plane.material = mat;
		plane.checkCollisions = true;
	};

	var addWalls = function(quads){
		var y = -SIZE*1.5, arr = [];
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			var wall = MeshCache.getFromCache(size, "brick");
			if(quad[2] < quad[3]){
				wall.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			wall.position.x = topLeft.x + (quad[1] + quad[2]/2)*SIZE;
			wall.position.z = topLeft.z - (quad[0] + quad[3]/2)*SIZE;
			wall.position.y = y;
			wall.freezeWorldMatrix();
		});
	};
	var birdsEye = function(){
		camera.rotation = new BABYLON.Vector3(Math.PI/2, 0 , 0);
	};
	engine = new BABYLON.Engine(canvas, false, null, false);
	var img = MeshUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.025});
	makeScene();
	addControls();
	Materials.makeMaterials(scene);
	var greedy = GreedyMesh.getBest(img);
	MeshCache.setForDims(scene, greedy.dims, SIZE, "brick");
	addWalls(greedy.quads);
	var empty = _.shuffle(MeshUtils.getMatchingLocations(img, 0));
	addPlayer(empty[0]);
	addCharacter(empty[1]);
	addGround();
	addSky();
	addBill(empty[2]);
	if(BIRDSEYE){
		birdsEye();
	}

	//scene.debugLayer.show();
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
		scene.render();
	});
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

	
});


