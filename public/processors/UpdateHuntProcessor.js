define(["GridUtils"], function(GridUtils){
	"use strict";

	var FREQUENCY = 250; // do not execute every tick

	var UpdateHuntProcessor = function(game){
		this.num = 0;
		this.game = game;
		this.pfGrid = new PF.Grid(GridUtils.transpose(game.grid.solid));
		this.init();
	};

	UpdateHuntProcessor.prototype.init = function(){
		//
	};

	UpdateHuntProcessor.prototype._update = function () {
		var manager = this.game.manager, pfGrid = this.pfGrid;
		var position = manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		var playerPos = GridUtils.babylonToIJ(position);
		_.each(this.game.baddieIds, function(id){
			var sComp, mesh, baddiePos;
			sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
			if(sComp.move === "hunt"){
				mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
				baddiePos = GridUtils.babylonToIJ(mesh.position);
				sComp.path = GridUtils.getAStarPath(baddiePos, pfGrid, playerPos);
			}
		});
	};

	UpdateHuntProcessor.prototype.update = function () {
		if(this.num % FREQUENCY === 0){
			this._update();
		}
		this.num++;
	};

	return UpdateHuntProcessor;

});
