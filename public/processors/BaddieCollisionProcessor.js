define([], function(){
	"use strict";

	var BaddieCollisionProcessor = function(game){
		this.game = game;
		this.init();
	};

	BaddieCollisionProcessor.prototype.init = function(){
		//
	};

	BaddieCollisionProcessor.prototype.getFirstBaddieHit = function(playerPos){
		var manager = this.game.manager, DSQR = SIZE*SIZE/4;
		return _.find(this.game.baddieIds, function(id){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			var dx = mesh0.position.x - playerPos.x;
			var dz = mesh0.position.z - playerPos.z;
			return dx*dx + dz*dz < DSQR;
		});
	};

	BaddieCollisionProcessor.prototype.update = function () {
		var health = this.game.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		if(health.isRegenerating){
			return;
		}
		var playerPos = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		var firstBaddieHit = this.getFirstBaddieHit(playerPos);
		if(firstBaddieHit){
			this.game.manager.listener.emit("baddieCollision", {"firstBaddieHit": firstBaddieHit});
		}
	};

	return BaddieCollisionProcessor;

});
