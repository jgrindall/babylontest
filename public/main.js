require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMesh", "Materials", "GamePad", "GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent", "components/MeshComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/MatchPlayerProcessor", "processors/MovementProcessor"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMesh, Materials, GamePad, GamePadUtils, EntityManager,
		
	HealthComponent, SpeedComponent, MessageComponent, MeshComponent,
	
	CameraComponent, PossessionsComponent, MatchPlayerProcessor, MovementProcessor) {
			
		window.SIZE_I = 24;
		window.SIZE_J = 24;
		window.SIZE = 7;
		window.SIZE = 7;
		var grid, scene, cameraId, playerId, gamePad, manager, canvas;
			
		canvas = document.querySelector("#renderCanvas");
		
		var addControls = function(){
			gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(manager, gamePad, playerId);
		};

		var makeScene = function () {
			scene = SceneBuilder.makeScene(engine);
		};
		
		var makeCamera = function () {
			var comp;
			cameraId = manager.createEntity(['CameraComponent', 'MeshComponent']);
			comp = manager.getComponentDataForEntity('MeshComponent', cameraId);
			comp.mesh = SceneBuilder.makeCamera(scene);
		};

		var matchPlayer = function(){
			//camera.position = player.position.clone();
			//camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), angle);
		};

		var addBill = function(pos){
			var y = SIZE/2, babylonPos;
			container = MeshCache.getBillboard("key", scene);
			babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
			container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);
		};
		
		var makeGrid = function(){
			grid = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.0, values:[0, 1, 2, 3, 4]});
		};
		
		var cache = function(){
			MeshCache.cacheBillboardPlane("key", scene);
			MeshCache.cacheBillboardPlane("baddie", scene);
			MeshCache.cacheBillboardContainer(scene);
			MeshCache.cacheBillboard("key", scene);
			MeshCache.cacheBillboard("baddie", scene);
		};
		
		var build = function(){
			SceneBuilder.addFromData(scene, grid);
		};
		
		var addPlayer = function(){
			var empty, comp;
			playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			empty = _.shuffle(GridUtils.getMatchingLocations(grid, 0));
			comp = manager.getComponentDataForEntity('MeshComponent', playerId);
			comp.mesh = SceneBuilder.addPlayer(empty[0], scene);
		};
		
		var startRender = function(){
			window.engine.runRenderLoop(function () {
				if(scene){
					scene.render();
				}
				if(manager){
					manager.update();
				}
			});	
		};
		
		var addEnvironment = function(){
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
		};
		
		var setupManager = function(){
			manager = new EntityManager();
			_.each([HealthComponent, MessageComponent, PossessionsComponent, MeshComponent, SpeedComponent, CameraComponent], function(c){
				manager.addComponent(c.name, c);
			});
			manager.addProcessor(new MovementProcessor(manager, engine));
			manager.addProcessor(new MatchPlayerProcessor(manager, engine));
		};
		
		var init = function(){
			setupManager();
			makeCamera();
			makeGrid();
			cache();
			build();
			addPlayer();
			addEnvironment();
			addControls();
			startRender();
		};

		var moveBaddies = function(){
			_.each(characters, function(c){
				//c.moveWithCollisions(new BABYLON.Vector3(c.v.x/20, 0, c.v.z/20));
				//if(Math.random() < 0.01){
					//c.v = new BABYLON.Vector3(Math.random()-0.5, 0, Math.random()-0.5);
				//}
			});
		};
		var moveAll = function(){
			//moveBaddies();
		};
		window.engine = new BABYLON.Engine(canvas, false, null, false);
		
		makeScene();
		Materials.makeMaterials(scene, init);
	}
);
