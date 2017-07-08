define(["TerrainCollectionCommand", "GeomUtils"], function(TerrainCollectionCommand, GeomUtils){
	"use strict";

	var TerrainCollisionProcessor = function(manager, playerId, greedyFire){
		this.manager = manager;
		this.greedyFire = greedyFire;
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
		var quads = this.greedyFire.quads;
		var playerMesh = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		var playerPos = playerMesh.position;
		_.each(quads, function(quad){
			var r = {'left':0, 'right':10, 'bottom':0, 'top':10};
			if(GeomUtils.pointInRect(playerPos, r){
				console.log('hit');
			}
			console.log(quad, playerPos);
		});
		if(1){
			//new TerrainCollectionCommand().exec(this.manager, this.playerId, firstBaddieHit);
		}
	};

	return TerrainCollisionProcessor;

});
