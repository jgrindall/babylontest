define(["diy3d/game/src/cache/MeshCache", "diy3d/game/src/cache/MeshStore",

	"diy3d/game/src/cache/MaterialsCache", "diy3d/game/lib/entity-manager", "diy3d/game/src/CommandQueue", "diy3d/game/src/utils/Preloader"],

	function(MeshCache, MeshStore,

		MaterialsCache, EntityManager, CommandQueue, Preloader) {

		"use strict";

        var baseURL = "http://" + window.location.host;

        var _onceify = function(fn, context) {
            var result;
            return function() {
                if(fn) {
                    result = fn.apply(context || this, arguments);
                    fn = null;
                }
                return result;
            };
        };

		var Game = function(canvas, $container, components, catalogue){
            this._catalogue =           catalogue;                              // list of allowed objects to add
            this._components =          components;                             // for the entity manager. eg "Health"
            this.$container =           $container;
            this._meshCaches =          {};                                     // call createInstance to clone these
            this.ids =                  {};                                     // list of eg. baddie entity ids
            this._processorClasses = 	[];                                     // eg. "CheckCollision"
            this._tasks = 				[];                                     //
            this.engine =               new BABYLON.Engine(canvas, true, null, false);
            this.engine.setHardwareScalingLevel(1.0);
            this.renderFn =             this.render.bind(this);
            this.onResizeHandler =      this.onResize.bind(this);
            $(window).on('resize', this.onResizeHandler);
            this.addUI();
            this.engine.resize();
            this.setup = _onceify(this.setup, this);
            this.preloader = new Preloader();
            this.init();
		};

        Game.prototype.preload = function(urls){
            var _this = this;
            this.preloader.add(urls).then(function(){
                _this.trigger("ready");
            });
            return this;
        };

		Game.prototype.init = function(){
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            this.scene.debugLayer.show({popup:true});
            this.scene.defaultMaterial.dispose(true, true);
            this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), this.scene);
            this.damagePostProcess = new BABYLON.PostProcess("damage", baseURL + "/diy3d/game/src/damage", ["degree"], null, 1, this.camera, BABYLON.Texture.NEAREST_SAMPLINGMODE, this.engine, true);
            this.camera.detachPostProcess(this.damagePostProcess);
            this.camera.minZ = 0;
            this.manager = 				new EntityManager();
            this.queue = 				new CommandQueue();
            this.materialsCache =       new MaterialsCache(this.scene);
            this.meshStore =            new MeshStore();
        };

		Game.prototype.getEntityIdFromMeshId = function(type, meshId){
		    var manager = this.manager;
		    return _.find(this.ids[type], function(entityId){
                return (meshId === manager.getComponentDataForEntity('MeshComponent', entityId).mesh.id);
            });
        };

		Game.prototype.removeMeshAndEntity = function(type, id){
            this.removeEntity(type, this.getEntityIdFromMeshId(type, id));
            this.removeMesh(type, id);
        };

        Game.prototype.removeMesh = function(type, id){
            var mesh = this.scene.getMeshByID(id);
            if(mesh){
                mesh.dispose();
            }
            else{
                console.log("obj mesh not found", id);
            }
        };

        Game.prototype.addToIds = function(type, id){
            this.ids[type] = this.ids[type] || [];
            this.ids[type].push(id);
        };

        Game.prototype.makeMesh = function(type, name, id){
            return this._meshCaches[type].get(name, id);
        };

		Game.prototype.removeEntity = function(type, id){
		    if(typeof id === "undefined"){
                throw("entity not found " + type + " " + id);
            }
            this.manager.removeEntity(id);
            this.ids[type] = _.without(this.ids[type], id);
        };

		Game.prototype.stop = function(){
		    this.queue.clear();
            if(this.gamePad) {
                this.gamePad.pause();
            }
            this.engine.stopRenderLoop();
        };

        Game.prototype.play = function(){
            if(this.gamePad) {
                this.gamePad.unpause();
            }
            this.engine.runRenderLoop(this.renderFn);
            this.showUI();
        };

		Game.prototype.addUI = function(){
            this.$container
                .append($("<div/>").attr("id", "zone_hud"))
                .append($("<div/>").attr("id", "zone_health"))
                .append($("<div/>").attr("id", "zone_possessions"))
                .append($("<div/>").attr("id", "zone_joystick"))
                .append($("<div/>").attr("id", "zone_exit"));
        };

        Game.prototype.onResize = function(){
            this.engine.resize();
        };

		Game.prototype.registerTask = function(task){
			this._tasks.push(task);
			return this;
		};

		Game.prototype.registerProcessor = function(Klass, options){
		    if(!options || !options.if || !!options.if()) {
                this._processorClasses.push(Klass);
            }
			return this;
		};

		Game.prototype.addProcessor = function(Klass){
			this.manager.addProcessor(new Klass(this));
		};

		Game.prototype.addToQueue = function(comm, time){
			this.queue.add(comm, time);
		};

		Game.prototype.addComponent = function(comp){
			this.manager.addComponent(comp.name, comp);
		};

		Game.prototype.render = function(){
			if(this.scene){
				this.scene.render();
			}
			if(this.manager){
				this.manager.update(this.scene.getLastFrameDuration());
			}
		};

		Game.prototype.showUI = function(){
			if(this.hud) {
                this.hud.show();
            }
            if(this.gamePad) {
                this.gamePad.show();
            }
            if(this.health){
                this.health.show();
            }
            if(this.possessions){
                this.possessions.show();
            }
            if(this.exitButton){
                this.exitButton.show();
            }
		};

		Game.prototype.executeTask = function(task){
			task(this);
		};

		Game.prototype.addMeshesForType = function(names, type){
            this._meshCaches[type] = new MeshCache(this, type).set(names);
        };

        Game.prototype.addMaterialsForType = function(names, type){
            this.materialsCache.createMaterials(names, type);
        };

		Game.prototype.setup = function(){
		    // onceified
		    _.each(this._catalogue,             this.addMaterialsForType.bind(this));
            _.each(this._catalogue,             this.addMeshesForType.bind(this));
            _.each(this._components,            this.addComponent.bind(this));
            _.each(this._processorClasses,      this.addProcessor.bind(this));
        };

        Game.prototype.load = function(json){
            this.json = json;
            this.setup();
            this.materialsCache.update(this.json.textureList);
            _.each(this._tasks, this.executeTask.bind(this));
            this.play();
            return this;
        };

		Game.prototype.destroy = function(){
            //TODO
		};

		_.extend(Game.prototype, Backbone.Events);

		return Game;
	}
);
