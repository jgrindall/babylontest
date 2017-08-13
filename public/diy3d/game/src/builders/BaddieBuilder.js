define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"], function(GridUtils, Consts){
	"use strict";

	var BaddieBuilder = {
		update:function(game, mesh, entityId, position, obj){
		    mesh.position = GridUtils.ijToBabylon(position[0], position[1], 3*Consts.BOX_SIZE/8);
            game.manager.getComponentDataForEntity('MeshComponent', entityId).mesh = mesh;
            game.manager.getComponentDataForEntity('BaddieStrategyComponent', entityId).move = obj.data.move;
            game.manager.getComponentDataForEntity('BaddieStrategyComponent', entityId).vel = null;
            game.manager.getComponentDataForEntity('BaddieStrategyComponent', entityId).path = null;
            mesh.id = obj.id;
            mesh.name = obj.id;
		}
	};

	return BaddieBuilder;

});

