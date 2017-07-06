
define(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "TerrainBuilder", "CharacterBuilder", "GridBuilder", "ObjectBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/Components", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent", "components/GridComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor",

"processors/PlayerMovementProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor", "DATA", "HUD"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, TerrainBuilder, CharacterBuilder, GridBuilder, ObjectBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, Components, MessageComponent, MeshComponent, BaddieStrategyComponent, GridComponent,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, UpdateHUDProcessor, PlayerMovementProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor, DATA, HUD) {

		"use strict";

		var Game = function(engine){
			this.engine = engine;
			this.processors = [];
			this.scene = SceneBuilder.makeScene(this.engine);
			this.manager = new EntityManager();
			this.gridId = null;
			this.playerId = null;
			this.baddieIds = [];
			this.objectIds = [];
			this.cameraId = null;
			Components.addTo(this.manager);
			Materials.makeMaterials(this.scene, window._TEXTURES, this.init.bind(this));
		};

		Game.prototype.loadJSON = function(){

		};

		Game.prototype.makeGrid = function(){
			var gridComponent;
			this.gridId = this.manager.createEntity(['GridComponent']);
			gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			gridComponent.grid = window._DATA;
			gridComponent.objects = window._OBJECTS;
			GridBuilder.build(this.scene, gridComponent);
		};

		Game.prototype.makeTerrain = function(){
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			TerrainBuilder.addFromData(this.scene, gridComponent);
			TerrainBuilder.addGround(this.scene, gridComponent);
			TerrainBuilder.addCeil(this.scene);
			TerrainBuilder.addSky(this.scene);
		};

		Game.prototype.addBaddies = function(){
			var manager = this.manager, scene = this.scene;
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId), baddieIds = this.baddieIds;
			_.each(_.range(0, window._NUM_BADDIES), function(i){
				var id, v;
				id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
				var pos = gridComponent.empty[i + 1];
				manager.getComponentDataForEntity('MeshComponent', id).mesh = CharacterBuilder.addBaddie(pos, scene);
				v = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
				var ns = Math.random();
				if(ns < 0.5){
					v.vel = {'x':0, 'z':1};
					v.strategy = "north-south";
					v.path = GridUtils.getPath(v.strategy, pos, gridComponent.grid, gridComponent.empty[i]);
				}
				else if(ns < 0.67){
					v.vel = {'x':1, 'z':0};
					v.strategy = "west-east";
					v.path = GridUtils.getPath(v.strategy, pos, gridComponent.grid, gridComponent.empty[i]);
				}
				else{
					v.strategy = "hunt";
				}
				baddieIds.push(id);
			});
		};

		Game.prototype.addPlayer = function(){
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			this.playerId = this.manager.createEntity(['MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh = CharacterBuilder.addPlayer(gridComponent.empty[0], this.scene);
		};

		Game.prototype.addObjects = function(){
			var manager = this.manager, scene = this.scene, objectIds = this.objectIds;
			var objects = this.manager.getComponentDataForEntity('GridComponent', this.gridId).objects;
			_.each(objects, function(obj){
				var id = manager.createEntity(['MeshComponent']);
				manager.getComponentDataForEntity('MeshComponent', id).mesh = ObjectBuilder.addObject( obj.data.position, scene, obj.data.texture);
				objectIds.push(id);
			});
		};

		Game.prototype.makeScene = function(){
			this.cameraId = this.manager.createEntity(['CameraComponent']);
			this.manager.getComponentDataForEntity('CameraComponent', this.cameraId).camera = SceneBuilder.makeCamera(this.scene);
		};

		Game.prototype.startProcessors = function(){
			var manager = this.manager;
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			this.processors.push(new PlayerMovementProcessor(this.manager, this.engine, this.playerId));
			this.processors.push(new CameraMatchPlayerProcessor(this.manager, this.engine, this.playerId, this.cameraId));
			this.processors.push(new BaddieMovementProcessor(this.manager, this.baddieIds));
			this.processors.push(new BaddieCollisionProcessor(this.manager, this.playerId, this.baddieIds));
			this.processors.push(new ObjectCollisionProcessor(this.manager, this.playerId, this.objectIds));
			this.processors.push(new UpdateHuntProcessor(this.manager, this.baddieIds, this.playerId, gridComponent.solid));
			this.processors.push(new UpdateHUDProcessor(this.manager, this.engine, this.scene, this.hud, this.playerId, this.baddieIds, this.objectIds, gridComponent));
			_.each(this.processors, manager.addProcessor.bind(manager));
		};

		Game.prototype.addControls = function(){
			this.gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(this.manager, this.gamePad, this.playerId);
			this.hud = new HUD();
		};

		Game.prototype.render = function(){
			if(this.scene){
				this.scene.render();
				$("p").text(this.engine.getFps().toFixed(0));
			}
			if(this.manager){
				this.manager.update(this.scene.getLastFrameDuration());
			}
		};

		Game.prototype.init = function(){
			this.makeGrid();
			this.makeScene();
			this.makeTerrain();
			this.addPlayer();
			this.addBaddies();
			this.addObjects();
			this.addControls();
			this.startProcessors();
			this.engine.runRenderLoop(this.render.bind(this));
		};

		console.log("reurn Game", Game);

		return Game;
	}
);

