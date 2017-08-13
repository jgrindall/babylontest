define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts", "diy3d/game/src/commands/ObjectCollectionCommand"],

    function(GridUtils, Consts, ObjectCollectionCommand){
	"use strict";

	var SIZESQR = Consts.BOX_SIZE*Consts.BOX_SIZE/4;

	var ObjectCollisionProcessor = function(game){
		this.game = game;
	};

	ObjectCollisionProcessor.prototype.update = function () {
		var manager = this.game.manager, objectIds = [], playerPos, playerPosIJ, i, ids, id, len, mesh, dx, dz, dSqr;
		if(manager.getComponentDataForEntity('SpeedComponent', this.game.playerId).speed === 0){
			return;
		}
		playerPos = this.game.camera.position;
		playerPosIJ = GridUtils.babylonToIJ(playerPos);
		if(this.game.data.grid[playerPosIJ.i][playerPosIJ.j] && this.game.data.grid[playerPosIJ.i][playerPosIJ.j].type !== "object"){
			return;
		}
		ids = this.game.ids["object"] || [];
		len = ids.length;
		for(i = 0; i < len; i++){
			id = ids[i];
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
			if(!mesh.isVisible){
			    continue;
            }
			dx = mesh.position.x - playerPos.x;
			dz = mesh.position.z - playerPos.z;
			if(dx < -Consts.BOX_SIZE || dx > Consts.BOX_SIZE || dz < -Consts.BOX_SIZE || dz > Consts.BOX_SIZE){
				continue;
			}
			dSqr = dx*dx + dz*dz;
			if (dSqr < SIZESQR) {
                objectIds.push(id);
			}
		}
		if(objectIds.length >= 1){
            new ObjectCollectionCommand(this.game, objectIds[0]).exec();
		}
	};

	return ObjectCollisionProcessor;

});
