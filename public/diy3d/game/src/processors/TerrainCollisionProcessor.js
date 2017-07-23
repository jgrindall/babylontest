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
		var health, playerMesh, playerPos, obj;
		health = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		if(health.isRegenerating){
			return;
		}
		playerMesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh;
		playerPos = GridUtils.babylonToIJ(playerMesh.position);
		obj = this.game.grid.grid[playerPos.i][playerPos.j];
		if(obj.type === "fire"){
			this.game.manager.listener.emit("terrainCollision", {"obj":obj});
		}
	};

	return TerrainCollisionProcessor;

});
