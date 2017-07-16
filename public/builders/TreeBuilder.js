define(["utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var TreeBuilder = {

	};

	TreeBuilder.addTree = function(pos, scene, texture, meshCache){
		var y = SIZE/2, mesh, babylonPos, mat;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = meshCache.getTree(scene, texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		return mesh;
	};

	return TreeBuilder;

});
