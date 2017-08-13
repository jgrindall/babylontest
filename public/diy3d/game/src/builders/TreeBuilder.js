define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"],

	function(GridUtils, Consts){

	"use strict";

	var TreeBuilder = {
        update:function(mesh, position, obj){
            mesh.position = GridUtils.ijToBabylon(position[0], position[1], 3*Consts.BOX_SIZE/8);
            mesh.id = obj.id;
            mesh.name = obj.id;
        }
	};

	return TreeBuilder;

});
