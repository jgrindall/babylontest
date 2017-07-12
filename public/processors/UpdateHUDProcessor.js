define(["utils/GridUtils"], function(GridUtils){

	"use strict";

	var UpdateHUDProcessor = function(game){
		this.game = game;
		this.init();
	};

	UpdateHUDProcessor.prototype.init = function(){
		return [];
	};

	UpdateHUDProcessor.prototype.getWalls = function () {
		return this.game.grid.greedy.quads;
	};

	UpdateHUDProcessor.prototype.getWater = function () {
		return this.game.grid.greedyWater.quads;
	};

	UpdateHUDProcessor.prototype.getFire = function () {
		return this.game.grid.greedyFire.quads;
	};

	UpdateHUDProcessor.prototype.getDoors = function () {
		return this.game.grid.doors;
	};

	UpdateHUDProcessor.prototype.getPlayer = function () {
		var position = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		return {
			"position":GridUtils.babylonToIJ(position)
		};
	};

	UpdateHUDProcessor.prototype.getBaddies = function () {
		var manager = this.game.manager;
		return _.map(this.game.baddieIds, function(id){
			var position = manager.getComponentDataForEntity('MeshComponent', id).mesh.position;
			return {
				"path":manager.getComponentDataForEntity('BaddieStrategyComponent', id).path,
				"position":GridUtils.babylonToIJ(position)
			};
		});
	};

	UpdateHUDProcessor.prototype.getObjects = function () {
		var manager = this.game.manager;
		return _.map(this.game.objectIds, function(id){
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
			"doors":this.getDoors(),
			"objects":this.getObjects()
		};
		this.game.hud.update(data);
	};

	return UpdateHUDProcessor;

});



