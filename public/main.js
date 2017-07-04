
window.SIZE_I = 16;
window.SIZE_J = 16;
window.SIZE = 10;
window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);


require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/PlayerMovementProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "DATA"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, PlayerMovementProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, DATA) {

		"use strict";

		var grid, solid, empty, scene, cameraId, playerId, gamePad, manager, canvas, baddieIds = [], canHit, processors = [];

		window._DATA = DATA;
		
		var NUM_BADDIES = 1;

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

		var build = function(){
			SceneBuilder.addFromData(scene, grid);
		};

		var addPlayer = function(){
			var comp;
			playerId = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			comp = manager.getComponentDataForEntity('MeshComponent', playerId);
			comp.mesh = SceneBuilder.addPlayer(empty[0], scene);
			console.log("add player", empty[0]);
		};

		var __render = function(){
			if(scene){
				scene.render();
				$("p").text(engine.getFps().toFixed(0));
			}
			if(manager){
				manager.update(scene.getLastFrameDuration());
			}
		};

		var startRender = function(){
			window.engine.runRenderLoop(__render);
		};

		var addParticles = function(){
			//SceneBuilder.addParticles(scene, [5, 5]);
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
				console.log("add baddie", pos);
				v = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
				var ns = Math.random();
				if(ns < -0.33){
					v.vel = {'x':0, 'z':1};
					v.strategy = "north-south";
				}
				else if(ns < -0.67){
					v.vel = {'x':1, 'z':0};
					v.strategy = "west-east";
				}
				else{
					v.strategy = "hunt";
				}
				v.path = GridUtils.getPath(v.strategy, pos, grid, empty[0]);
				baddieIds.push(id);
			});
		};

		var init = function(){
			grid = window._DATA;
			//scene.debugLayer.show();
			setupManager();
			makeCamera();
			solid = GridUtils.getSolid(grid);
			empty = _.shuffle(GridUtils.getMatchingLocations(grid, function(obj){
				return obj.type === "empty";
			}));
			build();
			addPlayer();
			addParticles();
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
			addControls();
			addBaddies();
			//var octahedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 1, size: 1}, scene);
			//octahedron.position = new BABYLON.Vector3(30, 7, 30);
			processors.push(new PlayerMovementProcessor(manager, engine, playerId));
			processors.push(new CameraMatchPlayerProcessor(manager, engine, playerId, cameraId));
			processors.push(new BaddieMovementProcessor(manager, baddieIds));
			processors.push(new BaddieCollisionProcessor(manager, playerId, baddieIds));
			processors.push(new UpdateHuntProcessor(manager, baddieIds, playerId, solid));
			manager.addProcessor(processors[0]);
			manager.addProcessor(processors[1]);
			manager.addProcessor(processors[2]);
		    manager.addProcessor(processors[3]);
			manager.addProcessor(processors[4]);
			startRender();
		};

		window.engine = new BABYLON.Engine(canvas, false, null, false);

		var launch = function(){
			makeScene();
			Materials.makeMaterials(scene, init);
		};

		setTimeout(function(){
			return;
			engine.stopRenderLoop(__render);
			manager.removeProcessor(processors[0]);
			manager.removeProcessor(processors[1]);
			manager.removeProcessor(processors[2]);
			manager.removeProcessor(processors[3]);
			processors = [];
			scene.dispose();
			Materials.destroy();

		}, 5000);

		setTimeout(function(){
			//launch();
		}, 10000);

		launch();

	}
);
