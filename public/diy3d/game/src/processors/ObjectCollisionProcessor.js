define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){
	"use strict";

	var SIZESQR = SIZE*SIZE/4;

	var ObjectCollisionProcessor = function(game){
		this.game = game;
		this.init();
	};

	ObjectCollisionProcessor.prototype.init = function(){
		//
	};

	ObjectCollisionProcessor.prototype.update = function () {
		var manager = this.game.manager, toDeleteIds = [], playerMesh, playerPos, playerPosIJ, i, ids, id, len, mesh, dx, dz, dSqr;
		playerMesh = manager.getComponentDataForEntity('MeshComponent', this.game.playerId).mesh;
		if(manager.getComponentDataForEntity('SpeedComponent', this.game.playerId).speed === 0){
			return;
		}
		playerPos = playerMesh.position;
		playerPosIJ = GridUtils.babylonToIJ(playerMesh.position);
		if(this.game.grid.grid[playerPosIJ.i][playerPosIJ.j].type !== "object"){
			return;
		}
		ids = this.game.objectIds;
		len = ids.length;
		for(i = 0; i < len; i++){
			id = ids[i];
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			dx = mesh.position.x - playerPos.x;
			dz = mesh.position.z - playerPos.z;
			if(dx < -SIZE || dx > SIZE || dz < -SIZE || dz > SIZE){
				continue;
			}
			dSqr = dx*dx + dz*dz;
			if (dSqr < SIZESQR) {
				toDeleteIds.push(id);
			}
		}
		if(toDeleteIds.length >= 1){
			this.game.manager.listener.emit("objectCollect", {"toDeleteIds": toDeleteIds});
		}
	};

	return ObjectCollisionProcessor;

});
