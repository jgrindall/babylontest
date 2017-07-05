define(["GridUtils"], function(GridUtils){

	var FRICTION = 0.7;

	var UpdateHUDProcessor = function(manager, engine, scene, hud, playerId, baddieIds, objectIds, g){
		this.hud = hud;
		this.playerId = playerId;
		this.baddieIds = baddieIds;
		this.engine = engine;
		this.manager = manager;
		this.objectIds = objectIds;
		this.scene = scene;
		this.g = g;
		this.init();
	};

	UpdateHUDProcessor.prototype.init = function(){
		return [];
	};
	
	UpdateHUDProcessor.prototype.getWalls = function () {
		return this.g.greedy.quads;
	};
	
	UpdateHUDProcessor.prototype.getWater = function () {
		return this.g.greedyWater.quads;
	};
	
	UpdateHUDProcessor.prototype.getFire = function () {
		return this.g.greedyFire.quads;
	};
	
	UpdateHUDProcessor.prototype.getPlayer = function () {
		var position = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh.position;
		return {
			"position":GridUtils.babylonToIJ(position)
		}
	};
	
	UpdateHUDProcessor.prototype.getBaddies = function () {
		var manager = this.manager;
		return _.map(this.baddieIds, function(id){
			var position = manager.getComponentDataForEntity('MeshComponent', id).mesh.position;
			return {
				"path":manager.getComponentDataForEntity('BaddieStrategyComponent', id).path,
				"position":GridUtils.babylonToIJ(position)
			};
		});
	};
	
	UpdateHUDProcessor.prototype.getObjects = function () {
		var manager = this.manager;
		return _.map(this.objectIds, function(id){
			var position = manager.getComponentDataForEntity('MeshComponent', id).mesh.position;
			return {
				"position":GridUtils.babylonToIJ(position)
			};
		});
	};

	UpdateHUDProcessor.prototype.update = function () {
		var data = {
			"walls":this.getWalls(),
			"water":this.getWater(),
			"fire":this.getFire(),
			"player":this.getPlayer(),
			"baddies":this.getBaddies(),
			"objects":this.getObjects()
		};
		this.hud.update(data);
	};

	return UpdateHUDProcessor;

});



