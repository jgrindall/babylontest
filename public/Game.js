define(["cache/MeshCache", "builders/GridBuilder", "builders/SceneBuilder",

	"cache/MaterialsCache", "lib/entity-manager", "Listener", "CommandQueue",

"components/Components"],

	function(MeshCache, GridBuilder, SceneBuilder,

		MaterialsCache, EntityManager, Listener, CommandQueue,

	Components) {

		"use strict";

		var Game = function(engine){
			this._paused = false;
			this.renderFn = this.render.bind(this);
			this.engine = engine;
			window.engine = engine;
			this._processorClasses = [];
			this._processors = [];
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

		Game.prototype.registerProcessor = function(Klass){
			this._processorClasses.push(Klass);
			return this;
		};

		Game.prototype.addProcessor = function(Klass){
			var p = new Klass(this);
			this._processors.push(p);
			this.manager.addProcessor(p);
		};

		Game.prototype.addToQueue = function(comm, time){
			this.queue.add(comm, time);
		};

		Game.prototype.startProcessors = function(){
			_.each(this._processorClasses, this.addProcessor.bind(this));
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
				//$("p.fps").text(this.engine.getFps().toFixed(0));
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
