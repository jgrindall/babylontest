define(["GridUtils", "MeshCache", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, MeshCache, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var ObjectBuilder = {

	};

	ObjectBuilder.addObject = function(pos, scene, texture){
		var y = SIZE/4, container, mesh, babylonPos, mat;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = MeshCache.getObjectFromCache(scene, texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		return mesh;
	};

	return ObjectBuilder;

});
