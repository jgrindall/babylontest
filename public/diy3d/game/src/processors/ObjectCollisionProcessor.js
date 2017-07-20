define([], function(){
	"use strict";

	var TOL_SQR = SIZE*SIZE/4;

	var ObjectCollisionProcessor = function(game){
		this.game = game;
		this.init();
	};

	ObjectCollisionProcessor.prototype.init = function(){
		//
	};

	ObjectCollisionProcessor.prototype.update = function () {
		var manager = this.game.manager, _this = this, toDeleteIds = [], playerPos, meshes;
		playerPos = this.game.camera.position;
		toDeleteIds = _.filter(this.game.objectIds, function(objectId){
			var mesh, dx, dz;
			mesh = manager.getComponentDataForEntity('MeshComponent', objectId).mesh;
			dx = mesh.position.x - playerPos.x;
			dz = mesh.position.z - playerPos.z;
			if(dx < -SIZE || dx > SIZE || dz < -SIZE || dz > SIZE){
				return false;
			}
			return (dx*dx + dz*dz < TOL_SQR);
		});
		if(toDeleteIds.length >= 1){
			this.game.manager.listener.emit("objectCollect", {"toDeleteIds": toDeleteIds});
		}
	};

	return ObjectCollisionProcessor;

});
