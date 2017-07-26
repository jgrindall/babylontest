define([], function(){
	"use strict";

	var SIZESQR = SIZE*SIZE/4;

	var BaddieCollisionProcessor = function(game){
		this.game = game;
		this.manager = game.manager;
		this.playerId = this.game.playerId;
	};

	BaddieCollisionProcessor.prototype._getFirstBaddieHit = function(playerPos){
		var manager = this.game.manager;
		return _.find(this.game.baddieIds, function(id){
			var mesh, dx, dz;
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			dx = mesh.position.x - playerPos.x;
			dz = mesh.position.z - playerPos.z;
			return dx*dx + dz*dz < SIZESQR;
		});
	};

	BaddieCollisionProcessor.prototype.update = function () {
		var health, playerPos, firstBaddieHit;
		health = this.manager.getComponentDataForEntity('HealthComponent', this.playerId);
		if(health.isRegenerating){
			return;
		}
		playerPos = this.manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh.position;
		firstBaddieHit = this._getFirstBaddieHit(playerPos);
		if(firstBaddieHit){
			this.game.manager.listener.emit("baddieCollision", {"firstBaddieHit": firstBaddieHit});
		}
	};

	return BaddieCollisionProcessor;

});
