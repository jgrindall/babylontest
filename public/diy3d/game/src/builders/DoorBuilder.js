define(["diy3d/game/src/utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var DoorBuilder = {

	};

	DoorBuilder.addDoor = function(pos, scene, meshCache, manager, id, obj){
		var mesh = meshCache.getDoor(scene, obj.data.texture);
		mesh.position = GridUtils.ijToBabylon(pos[0], pos[1], SIZE/2);
		manager.getComponentDataForEntity('MeshComponent', id).mesh = mesh;
	};

	return DoorBuilder;

});
