
define(["utils/MeshUtils", "utils/GridUtils", "MeshCache", "builders/SceneBuilder", "builders/TerrainBuilder", "builders/CharacterBuilder", "GridBuilder", "builders/ObjectBuilder", "builders/DoorBuilder",

	"utils/GreedyMeshAlgo", "MaterialsCache", "GamePad",

"utils/GamePadUtils", "lib/entity-manager", "Listener", "CommandQueue",

"components/HealthComponent", "components/SpeedComponent", "components/Components", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor", "Possessions", "Health",

"processors/PlayerMovementProcessor", "processors/TerrainCollisionProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor", "DATA", "HUD"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, TerrainBuilder, CharacterBuilder, GridBuilder, ObjectBuilder, DoorBuilder,

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
			Components.addTo(this.manager);
			this.playerId = null;
			this._tasks = [];
			this.baddieIds = [];
			this.objectIds = [];
			this.doorIds = [];
			this._tasks = [];
			this.materialsCache = new Materials(window._TEXTURES);
			this.meshCache = new MeshCache(this.materialsCache);
			this.queue = new CommandQueue();
		};

		Game.prototype.loadJSON = function(){

		};

		Game.prototype.start = function(){
			this.materialsCache.makeMaterials(this.scene, this.init.bind(this));
			return this;
		};

		Game.prototype.registerTask = function(task){
			this._tasks.push(task);
			return this;
		};

		Game.prototype.addToQueue = function(comm, time){
			this.queue.add(comm, time);
		};

		Game.prototype.startProcessors = function(){
			var manager = this.manager;
			//TODO - make them all "this"
			this.processors.push(new PlayerMovementProcessor(this));
			this.processors.push(new CameraMatchPlayerProcessor(this));
			this.processors.push(new BaddieMovementProcessor(this));
			this.processors.push(new BaddieCollisionProcessor(this));
			this.processors.push(new TerrainCollisionProcessor(this));
			this.processors.push(new ObjectCollisionProcessor(this));
			this.processors.push(new UpdateHuntProcessor(this));
			this.processors.push(new UpdateHUDProcessor(this));
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

		Game.prototype.executeTask = function(task){
			task(this);
		};

		Game.prototype.init = function(){
			this.grid = GridBuilder.build(this.scene, this.meshCache);
			this.cameraId = this.manager.createEntity(['CameraComponent']);
			this.manager.getComponentDataForEntity('CameraComponent', this.cameraId).camera = SceneBuilder.makeCamera(this.scene);
			_.each(this._tasks, this.executeTask.bind(this));
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
