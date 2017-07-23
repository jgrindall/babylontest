define(["diy3d/game/src/utils/GridUtils"],

	function(GridUtils){

	"use strict";

	var ObjectBuilder = {

	};

	ObjectBuilder.addObject = function(pos, scene, texture, meshCache){
		var mesh = meshCache.getObject(scene, texture);
		mesh.position = GridUtils.ijToBabylon(pos[0], pos[1], SIZE/4);
		return mesh;
	};

	return ObjectBuilder;

});
