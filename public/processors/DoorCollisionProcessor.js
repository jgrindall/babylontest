define(["utils/GridUtils"], function(GridUtils){
	"use strict";

	var DoorCollisionProcessor = function(game){
		this.game = game;
	};

	DoorCollisionProcessor.prototype.update = function () {
		var DSQR = SIZE*SIZE;
		var manager = this.game.manager;
		var playerPos = manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh.position;
		var door = _.find(this.game.doorIds, function(id){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			var dx = mesh0.position.x - playerPos.x;
			var dz = mesh0.position.z - playerPos.z;
			return dx*dx + dz*dz < DSQR;
		});
		console.log(door);
	};

	return DoorCollisionProcessor;

});