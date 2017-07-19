define(["diy3d/game/src/utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var DoorBuilder = {

	};

	DoorBuilder.addDoor = function(pos, scene, meshCache, manager, id, obj){
		var y = SIZE/2, mesh, babylonPos;
		var meshComp = manager.getComponentDataForEntity('MeshComponent', id);
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = meshCache.getDoor(scene, obj.data.texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		meshComp.mesh = mesh;
	};

	return DoorBuilder;

});
