define(["TerrainCollectionCommand", "GeomUtils", "GridUtils"], function(TerrainCollectionCommand, GeomUtils, GridUtils){
	"use strict";

	var TerrainCollisionProcessor = function(manager, playerId, grid){
		this.manager = manager;
		this.grid = grid;
		console.log(this.grid);
		this.playerId = playerId;
		this.init();
	};

	TerrainCollisionProcessor.prototype.init = function(){
		console.log("init", this.manager);
	};

	TerrainCollisionProcessor.prototype.update = function () {
		var health = this.manager.getComponentDataForEntity('HealthComponent', this.playerId);
		if(health.isRegenerating){
			return;
		}
		//TODO - better, get the sqr froim the position
		var playerMesh = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		var playerPos = playerMesh.position;
		playerPos = GridUtils.babylonToIJ(playerPos);
		var obj = this.grid[playerPos.i][playerPos.j];
		console.log();
		if(obj.type === "fire"){
			new TerrainCollectionCommand().exec(this.manager, this.playerId, obj);
		}
	};

	return TerrainCollisionProcessor;

});
