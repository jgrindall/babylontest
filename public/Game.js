
define(["cache/MeshCache", "builders/GridBuilder", "builders/SceneBuilder",

	"cache/MaterialsCache", "lib/entity-manager", "Listener", "CommandQueue",

"components/Components", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor",

"processors/PlayerMovementProcessor", "processors/TerrainCollisionProcessor",

"processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor", "processors/DoorCollisionProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor"],

	function(MeshCache, GridBuilder, SceneBuilder,

		MaterialsCache, EntityManager, Listener, CommandQueue,

	Components, CameraMatchPlayerProcessor, UpdateHUDProcessor,

	PlayerMovementProcessor, TerrainCollisionProcessor, BaddieMovementProcessor, UpdateHuntProcessor, DoorCollisionProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor) {

		"use strict";

		var Game = function(engine){
			this._paused = false;
			this.renderFn = this.render.bind(this);
			this.engine = engine;
			window.engine = engine;
			this.processors = [];
			this.scene = SceneBuilder.makeScene(this.engine);
			this.manager = new EntityManager(new Listener(this));
			Components.addTo(this.manager);
			this._tasks = [];
			this.materialsCache = new MaterialsCache(window._TEXTURES);
			this.meshCache = new MeshCache(this.materialsCache);
			this.queue = new CommandQueue();
		};

		Game.prototype.loadJSON = function(){

		};

		Game.prototype.start = function(){
			this.materialsCache.load(this.scene, this.init.bind(this));
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
			this.processors.push(new PlayerMovementProcessor(this));
			this.processors.push(new CameraMatchPlayerProcessor(this));
			this.processors.push(new BaddieMovementProcessor(this));
			this.processors.push(new BaddieCollisionProcessor(this));
			this.processors.push(new TerrainCollisionProcessor(this));
			this.processors.push(new ObjectCollisionProcessor(this));
			this.processors.push(new UpdateHuntProcessor(this));
			this.processors.push(new UpdateHUDProcessor(this));
			this.processors.push(new DoorCollisionProcessor(this));
			_.each(this.processors, this.manager.addProcessor.bind(this.manager));
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
			this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), this.scene);
			_.each(this._tasks, this.executeTask.bind(this));
			this.startProcessors();
			this.engine.runRenderLoop(this.renderFn);
			this.trigger("loaded");

			var mesh0 = this.manager.getComponentDataForEntity('MeshComponent', this.baddieIds[0]).mesh;
			var mesh1 = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
			console.log(mesh0, mesh1);
			var trigger = {
				trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger,
				parameter: mesh0
			};
			var crash = new BABYLON.ExecuteCodeAction(trigger, function() {alert('CRASH!!!!!! BURRRRRRRR EXPLODIE NOISES');});
			mesh1.actionManager = new BABYLON.ActionManager(this.scene);
			mesh1.actionManager.registerAction(crash);

		};

		Game.prototype.destroy = function(){
			this.engine.stopRenderLoop(this.renderFn);
			this.materialsCache.destroy();
			this.meshCache.clear();
			this.hud.destroy();
			this.gamePad.destroy();
			this.manager.listener = null;
			_.each(this.processors, this.manager.removeProcessor.bind(this.manager));
			this.scene.dispose();
			this.manager = null;
			// remove component from entity and remove components
		};

		_.extend(Game.prototype, Backbone.Events);

		return Game;
	}
);
