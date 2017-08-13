define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"], function(GridUtils, Consts){
	"use strict";

	var ObjectBuilder = {
		update:function(game, mesh, entityId, position, obj){
            mesh.position = GridUtils.ijToBabylon(position[0], position[1], 3*Consts.BOX_SIZE/8);
            game.manager.getComponentDataForEntity('MeshComponent', entityId).mesh = mesh;
            game.manager.getComponentDataForEntity('ObjectComponent', entityId).data = obj;  // so that you can collect it
            mesh.setEnabled(true);
            mesh.isVisible = true;
            mesh.id = obj.id;
            mesh.name = obj.id;
		}
	};

	return ObjectBuilder;

});

