define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/utils/PathFinding"], function(GridUtils, PathFinding){
	"use strict";

	var FREQUENCY = 500; // do not execute every tick

	var UpdateHuntProcessor = function(game){
		this.num = 0;
		this.game = game;
		this.init();
	};

	UpdateHuntProcessor.prototype.init = function(){
		//
	};

	UpdateHuntProcessor.prototype.updateId = function (playerPos, id) {
		var sComp, mesh, baddiePos, manager = this.game.manager;
		sComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		if(sComp.move === "hunt"){
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			baddiePos = GridUtils.babylonToIJ(mesh.position);
			sComp.path = PathFinding.getAStarPath(baddiePos, this.game.data.pfGrid, playerPos);
		}
	};

	UpdateHuntProcessor.prototype._update = function () {
		_.each(this.game.ids["baddie"], this.updateId.bind(this, GridUtils.babylonToIJ(this.game.camera.position)));
	};

	UpdateHuntProcessor.prototype.update = function () {
        if(this.num === 0){
			this._update();
			this.num = FREQUENCY;
		}
		this.num--;
	};

	return UpdateHuntProcessor;

});
