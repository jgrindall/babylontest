
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
			this.renderFn = this.render.bind(this);
			this.engine = engine;
			this.processors = [];
			this.scene = SceneBuilder.makeScene(this.engine);
			this.manager = new EntityManager();
			this.gridId = null;
			this.playerId = null;
			this.baddieIds = [];
			this.objectIds = [];
			this.cameraId = null;
			this.materialsCache = new Materials();
			this.meshCache = new MeshCache(this.materialsCache);
			Components.addTo(this.manager);
			this.materialsCache.makeMaterials(this.scene, window._TEXTURES, this.init.bind(this));
		};

		Game.prototype.loadJSON = function(){

		};

		Game.prototype.makeGrid = function(){
			var gridComponent;
			this.gridId = this.manager.createEntity(['GridComponent']);
			gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			gridComponent.grid = window._DATA;
			gridComponent.objects = window._OBJECTS;
			GridBuilder.build(this.scene, gridComponent, this.meshCache);
		};

		Game.prototype.makeTerrain = function(){
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId);
			TerrainBuilder.addFromData(this.scene, gridComponent, this.meshCache);
			TerrainBuilder.addGround(this.scene, gridComponent, this.meshCache);
			TerrainBuilder.addCeil(this.scene, this.meshCache);
			TerrainBuilder.addSky(this.scene, this.meshCache);
		};

		Game.prototype.addBaddies = function(){
			var manager = this.manager, scene = this.scene, meshCache = this.meshCache;
			var gridComponent = this.manager.getComponentDataForEntity('GridComponent', this.gridId), baddieIds = this.baddieIds;
			_.each(_.range(0, window._NUM_BADDIES), function(i){
				var id, v;
				id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
				var pos = gridComponent.empty[i + 1];
				manager.getComponentDataForEntity('MeshComponent', id).mesh = CharacterBuilder.addBaddie(pos, scene, meshCache);
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
			this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh = CharacterBuilder.addPlayer(gridComponent.empty[0], this.scene, this.meshCache);
		};

		Game.prototype.addObjects = function(){
			var manager = this.manager, scene = this.scene, objectIds = this.objectIds, meshCache = this.meshCache;
			var objects = this.manager.getComponentDataForEntity('GridComponent', this.gridId).objects;
			_.each(objects, function(obj){
				var id = manager.createEntity(['MeshComponent']);
				manager.getComponentDataForEntity('MeshComponent', id).mesh = ObjectBuilder.addObject( obj.data.position, scene, obj.data.texture, meshCache);
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
			this.engine.runRenderLoop(this.renderFn);
			this.trigger("loaded");
		};

		Game.prototype.destroy = function(){
			// /So I dispose the textures of the material first, then the material itself and afterwards I dispose the mesh.
			this.engine.stopRenderLoop(this.renderFn);
			this.materialsCache.destroy();
			this.meshCache.clear();
			this.hud.destroy();
			this.gamePad.destroy();
			_.each(this.processors, this.manager.removeProcessor.bind(this.manager));
			this.scene.dispose();
			this.manager = null;
			// remove component from entity and remove components
		};

		_.extend(Game.prototype, Backbone.Events);

		return Game;
	}
);

