require(["MeshUtils", "MeshCache", "GreedyMesh", "Materials", "GamePad"], function(MeshUtils, MeshCache, GreedyMesh, Materials, GamePad) {
	
	var SIZE_I = 24;
	var SIZE_J = 32;
	var SIZE = 5;
	var FRICTION = 0.4;
	var ROT_SPEED = 0.03, SPEED = 0.6;
	
	var canvas, scene, engine, player, angle = 0, speed = 0, ang_speed = 0, angle = 0, _mode = "off";
	
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
					if(obj.d < 0.1){
						// not moved it much
						return;
					}
					if(obj.a < 30 || obj.a > 330){
						ang_speed = ROT_SPEED;
					}
					else if(obj.a > 150 && obj.a < 210){
						ang_speed = -ROT_SPEED;
					}
					else{
						speed = obj.d * Math.sin(obj.a*Math.PI/180) * SPEED;
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
		angle += ang_speed;
		player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		dx = speed*Math.sin(angle) * scaleFactor;
		dz = speed*Math.cos(angle) * scaleFactor;
		player.checkCollisions = true;
		//player.isVisible = false;
		player.moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
		//camera.position.x = player.position.x;
		//camera.position.y = player.position.y;
		//camera.position.z = player.position.z;
		//camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
	}

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
		//player.isVisible = false;
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		player.ellipsoid = new BABYLON.Vector3(SIZE/3, SIZE/3, SIZE/3);
		player.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0 });
	};

	var addWalls = function(quads){
		var y = -SIZE*1.5;
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
			wall.opacity = 0.5;
		});
	};
	var birdsEye = function(){
		camera.rotation = new BABYLON.Vector3(Math.PI/2, 0 , 0);
	};
	engine = new BABYLON.Engine(canvas, false, null, false);
	var img = MeshUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.1});
	makeScene();
	addControls();
	Materials.makeMaterials(scene);
	var greedy = GreedyMesh.getBest(img);
	MeshCache.setForDims(scene, greedy.dims, SIZE);
	addWalls(greedy.quads);
	addPlayer(MeshUtils.getEmptyLocation(img));
	addGround();
	addSky();
	birdsEye();

	scene.debugLayer.show();
	engine.runRenderLoop(function () {
		if(_mode !== "off"){
			movePlayer();
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
		scene.render();
	});
	window.addEventListener("resize", function () {
	   engine.resize();
	});
});


