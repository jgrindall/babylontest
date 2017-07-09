define([], function(){
	"use strict";

	var ObjectCollisionProcessor = function(manager, playerId, objectIds){
		this.manager = manager;
		this.objectIds = objectIds;
		this.playerId = playerId;
		this.init();
	};

	ObjectCollisionProcessor.prototype.init = function(){
		//
	};

	ObjectCollisionProcessor.prototype.update = function () {
		var manager = this.manager, _this = this, toDeleteIds = [];
		var playerMesh = manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		$("span").text("No");
		_.each(this.objectIds, function(objectId){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', objectId).mesh;
			var dx = mesh0.position.x - playerMesh.position.x;
			var dz = mesh0.position.z - playerMesh.position.z;
			var dSqr = dx*dx + dz*dz;
			if (dSqr < SIZE*SIZE/4) {
				toDeleteIds.push(objectId);
			}
		});
		if(toDeleteIds.length >= 1){
			this.manager.listener.emit("objectCollect", {"toDeleteIds": toDeleteIds});
		}
	};

	return ObjectCollisionProcessor;

});
