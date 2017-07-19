define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){
	"use strict";

	var TerrainCollisionProcessor = function(game){
		this.game = game;
		this.init();
	};

	TerrainCollisionProcessor.prototype.init = function(){
		//
	};

	TerrainCollisionProcessor.prototype.update = function () {
		var health = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		if(health.isRegenerating){
			return;
		}
		var playerMesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh;
		var playerPos = playerMesh.position;
		playerPos = GridUtils.babylonToIJ(playerPos);
		var obj = this.game.grid.grid[playerPos.i][playerPos.j];
		if(obj.type === "fire"){
			this.game.manager.listener.emit("terrainCollision", {"obj":obj});
		}
	};

	return TerrainCollisionProcessor;

});
