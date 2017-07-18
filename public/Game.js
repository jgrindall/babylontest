define(["cache/MeshCache",

	"cache/MaterialsCache", "lib/entity-manager", "Listener", "CommandQueue",

"components/Components"],

	function(MeshCache,

		MaterialsCache, EntityManager, Listener, CommandQueue,

	Components) {

		"use strict";

		var Game = function(data, canvas){
			this._paused = false;
			this.data = data;
			this.renderFn = this.render.bind(this);
			this.engine = new BABYLON.Engine(canvas, false, null, false);
			this.scene = new BABYLON.Scene(this.engine);
			this.scene.collisionsEnabled = true;
			this._processorClasses = [];
			this._processors = [];
			this.manager = new EntityManager(new Listener(this));
			Components.addTo(this.manager);
			this._tasks = [];
			this.queue = new CommandQueue();
		};

		Game.prototype.loadJSON = function(){

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
			}
			if(this.manager){
				this.manager.update(this.scene.getLastFrameDuration());
			}
		};

		Game.prototype.executeTask = function(task){
			task(this);
		};

		Game.prototype.onMaterialsLoaded = function(){
			_.each(this._tasks, this.executeTask.bind(this));
			_.each(this._processorClasses, this.addProcessor.bind(this));
			this.engine.runRenderLoop(this.renderFn);
			this.trigger("loaded");
		};

		Game.prototype.start = function(){
			this.materialsCache = new MaterialsCache(this.data.textureCache);
			this.meshCache = new MeshCache(this.materialsCache);
			this.materialsCache.load(this.scene, this.onMaterialsLoaded.bind(this));
			return this;
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
