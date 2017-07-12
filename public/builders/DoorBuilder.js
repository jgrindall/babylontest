define(["utils/GridUtils", "cache/AnimationCache", "utils/GreedyMeshAlgo", "MaterialsCache", "Textures", "builders/LightBuilder", "builders/EffectBuilder"],

	function(GridUtils, AnimationCache, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var DoorBuilder = {

	};

	DoorBuilder.addDoor = function(pos, scene, meshCache, manager, id, obj){
		var y = SIZE/2, container, billboard, babylonPos, texture;
		var meshComp = manager.getComponentDataForEntity('MeshComponent', id);
		var strategyComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		billboard = meshCache.getBaddieFromCache(obj.data.texture);
		billboard.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		meshComp.mesh = billboard;
		strategyComp.move = obj.data.strategy.move;
		strategyComp.vel = {'x':0, 'z':0};
		if(strategyComp.move === "north-south"){
			strategyComp.vel = {'x':0, 'z':1};
		}
		else if(strategyComp.move === "west-east"){
			strategyComp.vel = {'x':1, 'z':0};
		}
		strategyComp.path = GridUtils.getPath(obj.data.strategy.move, obj.data.position, grid.grid, playerPos);
		scene.beginDirectAnimation(billboard, [AnimationCache.get("rot")], 0, 20, true);
	};

	return DoorBuilder;

});
