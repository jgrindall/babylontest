define(["diy3d/game/src/utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var TreeBuilder = {

	};

	TreeBuilder.addTree = function(pos, scene, texture, meshCache){
		var mesh = meshCache.getTree(scene, texture);
		mesh.position = GridUtils.ijToBabylon(pos[0], pos[1], SIZE/2);
		return mesh;
	};

	return TreeBuilder;

});
