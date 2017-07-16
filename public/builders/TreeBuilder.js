define(["utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var ObjectBuilder = {

	};

	ObjectBuilder.addObject = function(pos, scene, texture, meshCache){
		var y = SIZE/4, container, mesh, babylonPos, mat;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = meshCache.getObject(scene, texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		return mesh;
	};

	return ObjectBuilder;

});
