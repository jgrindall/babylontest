require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMesh", "Materials", "GamePad", "GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent", "components/MeshComponent", "components/VComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/MatchPlayerProcessor", "processors/MovementProcessor", "processors/MovementProcessorB"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMesh, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, VComponent,

	CameraComponent, PossessionsComponent, MatchPlayerProcessor, MovementProcessor, MovementProcessorB) {

		window.SIZE_I = 24;
		window.SIZE_J = 24;
		window.SIZE = 7;
		window.SIZE = 7;
		var grid, empty, scene, cameraId, playerId, gamePad, manager, canvas, baddieIds = [];

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
			cameraId = manager.createEntity(['CameraComponent']);
			comp = manager.getComponentDataForEntity('CameraComponent', cameraId);
			comp.camera = SceneBuilder.makeCamera(scene);
		};

		var makeGrid = function(){
			grid = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.001, values:[0, 1, 2, 3, 4]});
			empty = _.shuffle(GridUtils.getMatchingLocations(grid, 0));
		};

		var build = function(){
			SceneBuilder.addFromData(scene, grid);
		};

		var addPlayer = function(){
			var comp;
			playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
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
			_.each([HealthComponent, MessageComponent, PossessionsComponent, MeshComponent, SpeedComponent, VComponent, CameraComponent], function(c){
				manager.addComponent(c.name, c);
			});
		};

		var addBaddies = function(){
			_.each([1, 2, 3, 4, 5, 6, 7, 8], function(i){
				var comp, id, v;
				id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'VComponent']);
				comp = manager.getComponentDataForEntity('MeshComponent', id);
				comp.mesh = SceneBuilder.addBaddie(empty[i], scene);
				v = manager.getComponentDataForEntity('VComponent', id);
				v.vel = {x:Math.random() - 0.5, y:Math.random() - 0.5};
				baddieIds.push(id);
			});
		};

		var init = function(){
			scene.debugLayer.show();
			setupManager();
			makeCamera();
			makeGrid();
			build();
			addPlayer();
			addEnvironment();
			addControls();
			addBaddies();
			manager.addProcessor(new MovementProcessor(manager, engine, playerId));
			manager.addProcessor(new MatchPlayerProcessor(manager, engine, playerId, cameraId));
			manager.addProcessor(new MovementProcessorB(manager));
			startRender();
		};

		window.engine = new BABYLON.Engine(canvas, false, null, false);

		makeScene();
		Materials.makeMaterials(scene, init);
	}
);
