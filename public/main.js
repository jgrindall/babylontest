
window.SIZE_I = 8;
window.SIZE_J = 8;
window.SIZE = 10;
window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);


require(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent", "components/GridComponent", "components/GridComponentExtended",

"components/GridCache",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor",

"processors/PlayerMovementProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "DATA", "HUD"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent, GridComponent, GridComponentExtended,
	
	GridCache,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, UpdateHUDProcessor, PlayerMovementProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, DATA, HUD) {

		"use strict";

		var scene, cameraId, playerId, gamePad, manager, canvas, baddieIds = [], processors = [], hud, gridId;

		window._DATA = DATA;

		var NUM_BADDIES = 1;

		canvas = document.querySelector("#renderCanvas");

		var addControls = function(){
			gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(manager, gamePad, playerId);
		};
		
		var addHUD = function(){
			hud = new HUD();
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

		var addPlayer = function(){
			var comp, empty = manager.getComponentDataForEntity('GridComponent', gridId).empty;
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

		var setupManager = function(){
			manager = new EntityManager();
			_.each([HealthComponent, MessageComponent, GridComponent, PossessionsComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent], function(c){
				manager.addComponent(c.name, c);
			});
		};

		var addBaddies = function(){
			var empty = manager.getComponentDataForEntity('GridComponent', gridId).empty;
			_.each(_.range(0, NUM_BADDIES), function(i){
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
				//v.path = GridUtils.getPath(v.strategy, pos, grid, empty[0]);
				baddieIds.push(id);
			});
		};
		
		var makeGrid = function(){
			var g;
			gridId = manager.createEntity(['GridComponent']);
			g = manager.getComponentDataForEntity('GridComponent', gridId);
			g.grid = window._DATA;
			GridComponentExtended(g);
			GridCache(g, scene);
		};
		
		var init = function(){
			setupManager();
			makeGrid();
			var g = manager.getComponentDataForEntity('GridComponent', gridId);
			//scene.debugLayer.show();
			makeCamera();
			SceneBuilder.addFromData(scene, manager.getComponentDataForEntity('GridComponent', gridId));
			addPlayer();
			SceneBuilder.addGround(scene);
			SceneBuilder.addSky(scene);
			addControls();
			addHUD();
			addBaddies();
			//var octahedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 1, size: 1}, scene);
			//octahedron.position = new BABYLON.Vector3(30, 7, 30);
			processors.push(new PlayerMovementProcessor(manager, engine, playerId));
			processors.push(new CameraMatchPlayerProcessor(manager, engine, playerId, cameraId));
			processors.push(new BaddieMovementProcessor(manager, baddieIds));
			processors.push(new BaddieCollisionProcessor(manager, playerId, baddieIds));
			processors.push(new UpdateHuntProcessor(manager, baddieIds, playerId, g.solid));
			processors.push(new UpdateHUDProcessor(manager, engine, scene, hud, playerId, g.greedy));
			_.each(processors, function(p){
				manager.addProcessor(p);
			});
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
			_.each(processors, function(p){
				manager.removeProcessor(p);
			});
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
