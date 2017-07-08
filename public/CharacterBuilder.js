define(["GridUtils", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var CharacterBuilder = {

	};

	CharacterBuilder.addBaddie = function(pos, scene, meshCache, manager, id, obj, grid, playerPos){
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
	};

	CharacterBuilder.addPlayer = function(pos, scene){
		var y = SIZE/2;
		var babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		var player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.checkCollisions = true;
		player.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		player.ellipsoid = new BABYLON.Vector3(SIZE/4, SIZE/4, SIZE/4);
		return player;
	};

	return CharacterBuilder;

});
