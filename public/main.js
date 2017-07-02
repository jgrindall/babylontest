require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/PlayerMovementProcessor", "processors/BaddieMovementProcessor",

"processors/BaddieCollisionProcessor"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, PlayerMovementProcessor, BaddieMovementProcessor,

	BaddieCollisionProcessor) {

		"use strict";

		window.SIZE_I = 20;
		window.SIZE_J = 20;
		var NUM_BADDIES = 6;
		window.SIZE = 10;

		var grid, empty, scene, cameraId, playerId, gamePad, manager, canvas, baddieIds = [], boxes, canHit;

		canvas = document.querySelector("#renderCanvas");

		var addControls = function(){
			gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(manager, gamePad, playerId);
		};

		var makeScene = function () {
			scene = SceneBuilder.makeScene(engine);
			//scene.enablePhysics();
		};

		var makeCamera = function () {
			var comp;
			cameraId = manager.createEntity(['CameraComponent']);
			console.log("cameraId", cameraId);
			comp = manager.getComponentDataForEntity('CameraComponent', cameraId);
			comp.camera = SceneBuilder.makeCamera(scene);
		};

		var makeGrid = function(){
			grid = GridUtils.makeRnd(SIZE_I, SIZE_J, {rnd:0.0, values:[1, 2]});
			GridUtils.log(grid);
			empty = _.shuffle(GridUtils.getMatchingLocations(grid, 0));
			var pf = new PF.Grid(GridUtils.getPF(grid));
			var backup = pf.clone();
			var finder = new PF.AStarFinder();
			var paths = finder.findPath(3, 3, 7, 7, pf);
			console.log(paths);
		};

		var build = function(){
			boxes = SceneBuilder.addFromData(scene, grid);
			canHit = GridUtils.getBoxesCanHit(grid, boxes);
		};

		var addPlayer = function(){
			var comp;
			playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			comp = manager.getComponentDataForEntity('MeshComponent', playerId);
			comp.mesh = SceneBuilder.addPlayer(empty[0], scene);
		};

		var __render = function(){
			if(scene){
				scene.render();
			}
			if(manager){
				manager.update(scene.getLastFrameDuration());
			}
		};

		var startRender = function(){
			window.engine.runRenderLoop(__render);
		};

		var addWater = function(){
			SceneBuilder.addWater(scene, [5, 5]);
		};

		var addEnvironment = function(){
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
		};

		var setupManager = function(){
			manager = new EntityManager();
			_.each([HealthComponent, MessageComponent, PossessionsComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent], function(c){
				manager.addComponent(c.name, c);
			});
		};

		var addBaddies = function(){
			var _grid = grid;
			_.each(_.range(1, 1 + NUM_BADDIES), function(i){
				var id, v;
				id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
				var pos = empty[i + 1]
				manager.getComponentDataForEntity('MeshComponent', id).mesh = SceneBuilder.addBaddie(pos, scene);
				v = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
				var ns = Math.random();
				if(ns < 0.33){
					v.vel = {'x':0, 'z':1};
					v.strategy = "north-south";
				}
				else if(ns < 0.67){
					v.vel = {'x':1, 'z':0};
					v.strategy = "west-east";
				}
				else{
					v.vel = {'x':1, 'z':0};
					v.strategy = "hunt";
				}
				v.path = GridUtils.getPath(v.strategy, pos, grid);
				console.log(pos, v.strategy, v.path);
				baddieIds.push(id);
			});
		};

		var init = function(){
			//scene.debugLayer.show();
			setupManager();
			makeCamera();
			makeGrid();
			build();
			addPlayer();
			addWater();
			addEnvironment();
			addControls();
			addBaddies();
			var octahedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 1, size: 1}, scene);
			octahedron.position = new BABYLON.Vector3(30, 7, 30);
			manager.addProcessor(new PlayerMovementProcessor(manager, engine, playerId));
			manager.addProcessor(new CameraMatchPlayerProcessor(manager, engine, playerId, cameraId));
			manager.addProcessor(new BaddieMovementProcessor(manager, baddieIds, boxes, canHit));
		    manager.addProcessor(new BaddieCollisionProcessor(manager, playerId, baddieIds));
			startRender();
		};

		window.engine = new BABYLON.Engine(canvas, false, null, false);

		makeScene();
		Materials.makeMaterials(scene, init);


		setTimeout(function(){
			engine.stopRenderLoop(__render);
			scene.dispose();
			//scene.render();


		}, 5000);
	}
);
