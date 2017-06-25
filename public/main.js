require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMeshAlgo", "Materials", "GamePad", "GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent", "components/MeshComponent", "components/VComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/MatchPlayerProcessor", "processors/MovementProcessor", "processors/MovementProcessorB",

"processors/CollisionProcessor"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, VComponent,

	CameraComponent, PossessionsComponent, MatchPlayerProcessor, MovementProcessor, MovementProcessorB,

	CollisionProcessor) {

		"use strict";


		window.SIZE_I = 16;
		window.SIZE_J = 16;
		window.SIZE = 7;
		window.SIZE = 7;
		var grid, empty, scene, cameraId, playerId, gamePad, manager, canvas, baddieIds = [], boxes, canHit;

		canvas = document.querySelector("#renderCanvas");

		var addControls = function(){
			gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(manager, gamePad, playerId);
		};

		var makeScene = function () {
			scene = SceneBuilder.makeScene(engine);
			scene.enablePhysics();
		};

		var makeCamera = function () {
			var comp;
			cameraId = manager.createEntity(['CameraComponent']);
			console.log("cameraId", cameraId);
			comp = manager.getComponentDataForEntity('CameraComponent', cameraId);
			comp.camera = SceneBuilder.makeCamera(scene);
		};

		var makeGrid = function(){
			grid = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.0, values:[0, 1, 2, 3, 4]});
			empty = _.shuffle(GridUtils.getMatchingLocations(grid, 0));
		};

		var build = function(){
			boxes = SceneBuilder.addFromData(scene, grid);
			canHit = GridUtils.getBoxesCanHit(grid, boxes);
		};

		var addPlayer = function(){
			var comp;
			playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			console.log("playerId", playerId);
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
			_.each(_.range(1, SIZE_I-2), function(i){
				var comp, id, v;
				id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'VComponent']);
				comp = manager.getComponentDataForEntity('MeshComponent', id);
				//comp.mesh = SceneBuilder.addBaddie(empty[i], scene);
				comp.mesh = SceneBuilder.addBaddie([i, 5], scene);
				v = manager.getComponentDataForEntity('VComponent', id);
				v.vel = {'x':1, 'z':0};
				console.log("baddieid", id);
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
			manager.addProcessor(new MovementProcessorB(manager, baddieIds, boxes, canHit));
			manager.addProcessor(new CollisionProcessor(manager, playerId, baddieIds));
			startRender();
		};

		window.engine = new BABYLON.Engine(canvas, false, null, false);

		makeScene();
		Materials.makeMaterials(scene, init);
	}
);
