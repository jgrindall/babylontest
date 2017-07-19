define(["diy3d/game/src/cache/MeshCache",

	"diy3d/game/src/cache/MaterialsCache", "diy3d/game/lib/entity-manager", "diy3d/game/src/CommandQueue"],

	function(MeshCache,

		MaterialsCache, EntityManager, CommandQueue) {

		"use strict";

		var Game = function(data, canvas, engine, $container){
		    this._paused = false;
            this._RENDERCOUNT = 0;
			this.data = data;
			this.$container = $container;
			this.engine = engine;
			this.scene = new BABYLON.Scene(this.engine);
			this.scene.collisionsEnabled = true;
            this.onResizeHandler = this.onResize.bind(this);
            this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), this.scene);
			this._components = 			[];
			this._processorClasses = 	[];
			this._tasks = 				[];
			this.manager = 				new EntityManager();
			this.queue = 				new CommandQueue();
            $(window).on('resize', this.onResizeHandler);
		};

        Game.prototype.onResize = function(){
            this.engine.resize();
        };

		Game.prototype.setListener = function(listener){
			this.manager.listener = listener;
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
			this.manager.addProcessor(new Klass(this));
		};

		Game.prototype.addToQueue = function(comm, time){
			this.queue.add(comm, time);
		};

		Game.prototype.registerComponents = function(arr){
			this._components = this._components.concat(arr);
			return this;
		};

		Game.prototype.addComponent = function(comp){
			this.manager.addComponent(comp.name, comp);
		};

		Game.prototype.pause = function(){
		    if(this._paused){
		        return;
            }
		    if(this.gamePad) {
                this.gamePad.pause();
            }
            this.engine.stopRenderLoop(this.renderFn);
			this._paused = true;
		};

		Game.prototype.unpause = function(){
            if(!this._paused){
                return;
            }
            if(this.gamePad) {
                this.gamePad.unpause();
            }
            this.engine.runRenderLoop(this.renderFn);
			this._paused = false;
		};

		Game.prototype.render = function(){
		    this._RENDERCOUNT++;
		    if(this._RENDERCOUNT === 20){
                this.trigger("loaded");
            }
			if(this._paused){
				return;
			}
			if(this.scene){
				console.log("r");
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
			_.each(this._components,            this.addComponent.bind(this));
			_.each(this._tasks,                 this.executeTask.bind(this));
			_.each(this._processorClasses,      this.addProcessor.bind(this));
			this.renderFn = this.render.bind(this);
			this.engine.runRenderLoop(this.renderFn);
		};

		Game.prototype.start = function(){
			this.materialsCache =       new MaterialsCache(this.scene);
			this.meshCache =            new MeshCache(this.materialsCache);
			this.materialsCache.load(this.data, this.onMaterialsLoaded.bind(this));
			return this;
		};

		Game.prototype.destroy = function(){
            this.engine.stopRenderLoop(this.renderFn);
            $(window).off("resize", this.resizeHandler);
            this.engine.clear(BABYLON.Color3.Black(), false, false);
            if(this.hud) {
                this.hud.destroy();
                this.hud = null;
            }
            if(this.gamePad) {
                this.gamePad.destroy();
                this.gamePad = null;
            }
            if(this.health){
                this.health.destroy();
                this.health = null;
            }
            if(this.possessions){
                this.possessions.destroy();
                this.possessions = null;
            }
            this.materialsCache.destroy();
            this.meshCache.clear();
			this.manager.listener = null;
			_.each(this.processors, this.manager.removeProcessor.bind(this.manager));
			this.scene.dispose();
			this.engine = null;
			this.manager = null;
			this.scene = null;
			// TODO - also remove component from entity and remove components
		};

		_.extend(Game.prototype, Backbone.Events);

		return Game;
	}
);
