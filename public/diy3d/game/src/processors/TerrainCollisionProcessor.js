define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/commands/TerrainCollisionCommand"], function(GridUtils, TerrainCollisionCommand){
	"use strict";

	var TerrainCollisionProcessor = function(game){
		this.game = game;
		this.init();
	};

	TerrainCollisionProcessor.prototype.init = function(){
		//
	};

	TerrainCollisionProcessor.prototype.update = function () {
		var health, playerPos, obj;
		health = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		if(health.isRegenerating){
			return;
		}
		playerPos = GridUtils.babylonToIJ(this.game.camera.position);
		obj = this.game.data.grid[playerPos.i][playerPos.j];
		if(obj.type === "fire"){
            new TerrainCollisionCommand(this.game).exec({"obj":obj});
		}
	};

	return TerrainCollisionProcessor;

});

