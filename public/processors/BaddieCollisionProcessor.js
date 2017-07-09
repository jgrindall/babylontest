define([], function(){
	"use strict";

	var BaddieCollisionProcessor = function(manager, playerId, baddieIds){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.playerId = playerId;
		this.init();
	};

	BaddieCollisionProcessor.prototype.init = function(){
		console.log("init", this.manager);
	};

	BaddieCollisionProcessor.prototype.getFirstBaddieHit = function(playerPos){
		var manager = this.manager, DSQR = SIZE*SIZE/4;
		return _.find(this.baddieIds, function(id){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			var dx = mesh0.position.x - playerPos.x;
			var dz = mesh0.position.z - playerPos.z;
			return dx*dx + dz*dz < DSQR;
		});
	};

	BaddieCollisionProcessor.prototype.update = function () {
		var health = this.manager.getComponentDataForEntity('HealthComponent', this.playerId);
		if(health.isRegenerating){
			return;
		}
		var playerMesh = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		var playerPos = playerMesh.position;
		var firstBaddieHit = this.getFirstBaddieHit(playerPos);
		if(firstBaddieHit){
			this.manager.listener.emit("baddieCollision", {"firstBaddieHit": firstBaddieHit});
		}
	};

	return BaddieCollisionProcessor;

});
