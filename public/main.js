require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMesh", "Materials", "GamePad", "GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent", "components/MeshComponent", "components/PossessionsComponent",

"processors/MovementProcessor"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMesh, Materials, GamePad, GamePadUtils, EntityManager,
		
	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, PossessionsComponent,
	
	MovementProcessor) {
			
		window.SIZE_I = 24;
		window.SIZE_J = 24;
		window.SIZE = 7;
		window.SIZE = 7;

		var scene, engine, playerId, gamePad;
				
		var manager = new EntityManager();
			
		canvas = document.querySelector("#renderCanvas");
		
		var addControls = function(){
			gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToPlayer(this.gamePad, playerId);
		};

		var makeScene = function () {
			var obj = SceneBuilder.makeScene(engine);
			scene = obj.scene;
			camera = obj.camera;
		};

		var matchPlayer = function(){
			camera.position = player.position.clone();
			camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		};

		var addBill = function(pos){
			var y = SIZE/2;
			container = MeshCache.getBillboard("key", scene);
			var babylonPos = ijToBabylon(pos[0], pos[1]);
			container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		};

		engine = new BABYLON.Engine(canvas, false, null, false);

		makeScene();
		addControls();

		var init = function(){
			var data, empty;
			data = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.0, values:[0, 1, 2, 3, 4]});
			SceneBuilder.addFromData(scene, data);
			empty = _.shuffle(GridUtils.getMatchingLocations(data, 0));
			player = SceneBuilder.addPlayer(empty[0], scene);
			//character = SceneBuilder.addCharacter(empty[1], scene);
			MeshCache.cacheBillboardPlane("key", scene);
			MeshCache.cacheBillboardPlane("baddie", scene);
			MeshCache.cacheBillboardContainer(scene);
			MeshCache.cacheBillboard("key", scene);
			MeshCache.cacheBillboard("baddie", scene);
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
			empty.shift();
			empty.shift();
			//SceneBuilder.addCharacters(empty, scene);
			var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);
			var plane  = BABYLON.Mesh.CreatePlane("box", 4.0, scene);
			plane.parent = box;
			var m = new BABYLON.StandardMaterial("texture1", scene);
		    m.diffuseTexture = new BABYLON.Texture("assets/bricks.png", scene);
			plane.material = m;
			var redMaterial = new BABYLON.StandardMaterial("red", scene);
			redMaterial.diffuseColor = BABYLON.Color3.Red();
			redMaterial.alpha = 0.3;
			box.material = redMaterial;
		    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
			box.checkCollisions = true;
			var p = empty[16];
			console.log(p);
			p = GridUtils.ijToBabylon(p[0], p[1]);
			console.log(p);
			box.position = new BABYLON.Vector3(p.x, 4, p.z);
			var mesh = BABYLON.Mesh.MergeMeshes([box, plane], true, true);
			return scene;
		};

		var moveBaddies = function(){
			_.each(characters, function(c){
				c.moveWithCollisions(new BABYLON.Vector3(c.v.x/20, 0, c.v.z/20));
				if(Math.random() < 0.01){
					c.v = new BABYLON.Vector3(Math.random()-0.5, 0, Math.random()-0.5);
				}
			});
		};

		var moveAll = function(){
			moveBaddies();
		};

		engine.runRenderLoop(function () {
			scene.render();
			manager.update();
		});

		Materials.makeMaterials(scene, init);

		var comps = [HealthComponent, MessageComponent, PossessionsComponent, MeshComponent, SpeedComponent];
		_.each(comps, function(c){
			manager.addComponent(c.name, c);
		});
		var playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent']);
		var playerData = manager.getComponentDataForEntity('MessageComponent', playerId);
		manager.addProcessor(new MovementProcessor(manager, engine));
		playerData.life = 80;
		console.log(playerData);

		var playerData2 = manager.getComponentDataForEntity('PossessionsComponent', playerId);
		console.log(playerData2);
	}
);
