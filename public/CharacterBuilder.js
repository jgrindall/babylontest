define(["GridUtils", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var CharacterBuilder = {

	};

	CharacterBuilder.addBaddie = function(pos, scene, meshCache, manager, id, obj, gridComponent, playerPos){
		var y = SIZE/2, container, billboard, babylonPos, texture;
		var meshComp = manager.getComponentDataForEntity('MeshComponent', id);
		var strategyComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		texture = Math.random() < 0.5 ? "bird" : "baddie";
		billboard = meshCache.getBaddieFromCache(texture);
		billboard.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		meshComp.mesh = billboard;
		strategyComp.strategy = obj.data.strategy;
		strategyComp.vel = {'x':1, 'z':0};
		strategyComp.path = GridUtils.getPath(obj.data.strategy, obj.data.position, gridComponent.grid, playerPos);
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
