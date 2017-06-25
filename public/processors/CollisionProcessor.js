define([], function(){
	"use strict";

	var CollisionProcessor = function(manager, playerId, baddieIds){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.playerId = playerId;
		this.init();
	};

	CollisionProcessor.prototype.init = function(){
		console.log("init", this.manager);
	};

	CollisionProcessor.prototype.update = function () {
		var manager = this.manager;
		var playerMesh = manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		$("span").text("No");
		_.each(this.baddieIds, function(id){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', id).mesh[0];
			var dx = mesh0.position.x - playerMesh.position.x;
			var dz = mesh0.position.z - playerMesh.position.z;
			var dSqr = dx*dx + dz*dz;
			if (dSqr < SIZE*SIZE) {
				$("span").text("Yes");
			}
		});
	};

	return CollisionProcessor;

});
