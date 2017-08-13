define(["diy3d/game/src/commands/BaddieCollisionCommand", "diy3d/game/src/consts/Consts"], function(BaddieCollisionCommand, Consts){
	"use strict";

	var SIZESQR = Consts.BOX_SIZE*Consts.BOX_SIZE/4;

	var BaddieCollisionProcessor = function(game){
		this.game = game;
		this.manager = game.manager;
	};

	BaddieCollisionProcessor.prototype._getFirstBaddieHit = function(playerPos){
		var manager = this.game.manager;
		return _.find(this.game.ids["baddie"], function(id){
			var mesh, dx, dz;
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			dx = mesh.position.x - playerPos.x;
			dz = mesh.position.z - playerPos.z;
			return dx*dx + dz*dz < SIZESQR;
		});
	};

	BaddieCollisionProcessor.prototype.update = function () {
		var health, playerPos, baddieId;
		health = this.manager.getComponentDataForEntity('HealthComponent', this.game.playerId);
		if(health.isRegenerating){
			return;
		}
		playerPos = this.game.camera.position;
		baddieId = this._getFirstBaddieHit(playerPos);
		if(baddieId){
            new BaddieCollisionCommand(this.game).exec({"baddieId": baddieId});
		}
	};

	return BaddieCollisionProcessor;

});

