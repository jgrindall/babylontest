define([], function(){
	"use strict";
	
	var FREQUENCY = 50; // do not execute every tick
	
	var _toGrid = function(pos){
		return {
			x:Math.floor(pos.x / SIZE),
			z:Math.floor(pos.z / SIZE)
		};
	};
	
	var UpdateHuntProcessor = function(manager, baddieIds, playerId, pfGrid){
		this.num = 0;
		this.manager = manager;
		this.playerId = playerId;
		this.pfGrid = pfGrid;
		this.init();
	};

	UpdateHuntProcessor.prototype.init = function(){
		//
	};
	
	UpdateHuntProcessor.prototype._update = function () {
		console.log("update hunt");
		var manager = this.manager, pfGrid = this.pfGrid;
		var position = manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh.position;
		var playerPos = _toGrid(position);
		_.each(this.baddieIds, function(id){
			var sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
			if(sComp.strategy === "hunt"){
				var mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
				var baddiePos = _toGrid(mesh.position);
				sComp.path = GridUtils.getAStarPath(baddiePos, pfGrid, playerPos);
			}
		});
	};

	UpdateHuntProcessor.prototype.update = function () {
		//baddieIds
		if(this.num % FREQUENCY === 0){
			this._update();
		}
		this.num++;
	};

	return UpdateHuntProcessor;

});
