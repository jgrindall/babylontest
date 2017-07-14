define(["utils/GridUtils", "utils/PathFinding"], function(GridUtils, PathFinding){
	"use strict";

	var FREQUENCY = 250; // do not execute every tick

	var UpdateHuntProcessor = function(game){
		this.num = 0;
		this.game = game;
		this.init();
	};

	UpdateHuntProcessor.prototype.init = function(){
		//
	};

	UpdateHuntProcessor.prototype.updateId = function (playerPos, id) {
		var manager = this.game.manager;
		var sComp, mesh, baddiePos;
		sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		if(sComp.move === "hunt"){
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			baddiePos = GridUtils.babylonToIJ(mesh.position);
			sComp.path = PathFinding.getAStarPath(baddiePos, this.game.grid.pfGrid, playerPos);
		}
	};

	UpdateHuntProcessor.prototype._update = function () {
		var position = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		var playerPos = GridUtils.babylonToIJ(position);
		_.each(this.game.baddieIds, this.updateId.bind(this, playerPos));
	};

	UpdateHuntProcessor.prototype.update = function () {
		if(this.num % FREQUENCY === 0){
			this._update();
		}
		this.num++;
	};

	return UpdateHuntProcessor;

});
