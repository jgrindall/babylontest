define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){
	"use strict";

	var WaterAndFireBuilder = {
		update:function(mesh, position, obj){
            mesh.unfreezeWorldMatrix();
            mesh.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
            mesh.position = GridUtils.ijToBabylon(position[0], position[1], 0.5); // just on top of the ground
            mesh.freezeWorldMatrix();
            mesh.id = obj.id;
            mesh.name = obj.id;
		}
	};

	return WaterAndFireBuilder;

});

