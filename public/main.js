require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMesh", "Materials", "GamePad", "lib/entity-manager"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMesh, Materials, GamePad, EntityManager) {
		window.SIZE_I = 24;
		window.SIZE_J = 24;
		window.SIZE = 7;
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
			var obj = SceneBuilder.makeScene(engine);
			scene = obj.scene;
			camera = obj.camera;
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
		};

		var matchPlayer = function(){
			camera.position = player.position.clone();
			camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
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

		var birdsEye = function(){
			camera.rotation = new BABYLON.Vector3(Math.PI/2, 0 , 0);
		};

		engine = new BABYLON.Engine(canvas, false, null, false);

		makeScene();
		addControls();

		var init = function(){
			var data, empty;
			var makeWalls = function(){
				data = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.1, values:[0, 1, 2, 3, 4]});
				SceneBuilder.addFromData(scene, data);
			};
			makeWalls();
			empty = _.shuffle(GridUtils.getMatchingLocations(data, 0));
			player = SceneBuilder.addPlayer(empty[0], scene);
			character = SceneBuilder.addCharacter(empty[1], scene);
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
			//bill = SceneBuilder.addBill(empty[2], scene);
			if(BIRDSEYE){
				birdsEye();
			}
			engine.setHardwareScalingLevel(1);
		};

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

		engine.runRenderLoop(function () {
			moveAll();
			checkCollisions();
			scene.render();
		});

		var destroy = function(){
			alert("destroy");
			_.each(sceneData.walls, function(m){
				m.dispose();
			});
			_.each(sceneData.boxes, function(m){
				m.dispose();
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
	}
);
