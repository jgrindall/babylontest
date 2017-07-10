
define(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "TerrainBuilder", "CharacterBuilder", "GridBuilder", "ObjectBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager", "Listener", "CommandQueue",

"components/HealthComponent", "components/SpeedComponent", "components/Components", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor", "Possessions", "Health",

"processors/PlayerMovementProcessor", "processors/TerrainCollisionProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor", "DATA", "HUD"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, TerrainBuilder, CharacterBuilder, GridBuilder, ObjectBuilder,

		GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager, Listener, CommandQueue,

	HealthComponent, SpeedComponent, Components, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, UpdateHUDProcessor, Possessions, Health,

	PlayerMovementProcessor, TerrainCollisionProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor, DATA, HUD) {

		"use strict";

		var Game = function(engine){
			this._paused = false;
			this.renderFn = this.render.bind(this);
			this.engine = engine;
			this.processors = [];
			this.scene = SceneBuilder.makeScene(this.engine);
			this.manager = new EntityManager(new Listener(this));
			this.gridId = null;
			this.playerId = null;
			this.baddieIds = [];
			this.objectIds = [];
			this.cameraId = null;
			this.materialsCache = new Materials(window._TEXTURES);
			this.meshCache = new MeshCache(this.materialsCache);
			Components.addTo(this.manager);
			this.materialsCache.makeMaterials(this.scene, this.init.bind(this));
			this.queue = new CommandQueue();
		};

		Game.prototype.loadJSON = function(){

		};

		Game.prototype.makeGrid = function(){
			this.grid = GridBuilder.build(this.scene, this.meshCache);
		};

		Game.prototype.makeTerrain = function(){
			TerrainBuilder.addFromData(this.scene, this.grid, this.meshCache);
			TerrainBuilder.addGround(this.scene, this.grid, this.meshCache);
			TerrainBuilder.addCeil(this.scene, this.meshCache);
			TerrainBuilder.addSky(this.scene, this.meshCache);
		};

		Game.prototype.addBaddies = function(){
			var manager = this.manager, scene = this.scene, baddieIds = this.baddieIds, meshCache = this.meshCache;
			var baddies = this.grid.baddies;
			var playerPos = this.grid.empty[0];
			var grid = this.grid;
			_.each(baddies, function(obj){
				var id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
				CharacterBuilder.addBaddie(obj.data.position, scene, meshCache, manager, id, obj, grid, playerPos);
				baddieIds.push(id);
			});
		};

		Game.prototype.addToQueue = function(comm, time){
			this.queue.add(comm, time);
		};

		Game.prototype.addPlayer = function(){
			this.playerId = this.manager.createEntity(['HealthComponent', 'MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
			this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh = CharacterBuilder.addPlayer([2, 13], this.scene, this.meshCache);
		};

		Game.prototype.addObjects = function(){
			var manager = this.manager, scene = this.scene, objectIds = this.objectIds, meshCache = this.meshCache;
			var objects = this.grid.objects;
			_.each(objects, function(obj){
				var id = manager.createEntity(['MeshComponent', 'ObjectComponent']);
				manager.getComponentDataForEntity('MeshComponent', id).mesh = ObjectBuilder.addObject(obj.data.position, scene, obj.data.texture, meshCache);
				manager.getComponentDataForEntity('ObjectComponent', id).data = obj;
				objectIds.push(id);
			});
		};

		Game.prototype.makeScene = function(){
			this.cameraId = this.manager.createEntity(['CameraComponent']);
			this.manager.getComponentDataForEntity('CameraComponent', this.cameraId).camera = SceneBuilder.makeCamera(this.scene);
		};

		Game.prototype.startProcessors = function(){
			var manager = this.manager;
			this.processors.push(new PlayerMovementProcessor(this.manager, this.engine, this.playerId));
			this.processors.push(new CameraMatchPlayerProcessor(this.manager, this.engine, this.playerId, this.cameraId));
			this.processors.push(new BaddieMovementProcessor(this.manager, this.baddieIds));
			this.processors.push(new BaddieCollisionProcessor(this.manager, this.playerId, this.baddieIds));
			this.processors.push(new TerrainCollisionProcessor(this.manager, this.playerId, this.grid.grid));
			this.processors.push(new ObjectCollisionProcessor(this.manager, this.playerId, this.objectIds));
			this.processors.push(new UpdateHuntProcessor(this.manager, this.baddieIds, this.playerId, this.grid.solid));
			this.processors.push(new UpdateHUDProcessor(this.manager, this.engine, this.scene, this.hud, this.playerId, this.baddieIds, this.objectIds, this.grid));
			_.each(this.processors, manager.addProcessor.bind(manager));
		};

		Game.prototype.pause = function(){
			this.gamePad.pause();
			this._paused = true;
		};

		Game.prototype.unpause = function(){
			this.gamePad.unpause();
			this._paused = false;
		};

		Game.prototype.addControls = function(){
			this.gamePad = new GamePad("zone_joystick");
			GamePadUtils.linkGamePadToId(this.manager, this.gamePad, this.playerId);
			this.hud = new HUD();
			this.possessions = new Possessions(this.materialsCache);
			this.health = new Health();
		};

		Game.prototype.render = function(){
			if(this._paused){
				return;
			}
			if(this.scene){
				this.scene.render();
				$("p.fps").text(this.engine.getFps().toFixed(0));
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
			var music = new BABYLON.Sound("Music", "assets/sea.mp3", this.scene, null, { loop: true, autoplay: true });
			music.setVolume(0.1);
			this.trigger("loaded");
		};

		Game.prototype.destroy = function(){
			this.engine.stopRenderLoop(this.renderFn);
			this.materialsCache.destroy();
			this.meshCache.clear();
			this.hud.destroy();
			this.gamePad.destroy();
			this.manager.listener = null;
			_.each(this.processors, this.manager.removeProcessor.bind(this.manager));
			this.manager = null;
			this.scene.dispose();
			this.manager = null;
			// remove component from entity and remove components
		};

		_.extend(Game.prototype, Backbone.Events);

		return Game;
	}
);
