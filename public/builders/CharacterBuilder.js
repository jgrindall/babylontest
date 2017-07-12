define(["utils/GridUtils", "cache/AnimationCache", "utils/GreedyMeshAlgo", "MaterialsCache", "Textures", "builders/LightBuilder", "builders/EffectBuilder"],

	function(GridUtils, AnimationCache, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

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
		scene.beginDirectAnimation(billboard, [AnimationCache.get("rot")], 0, 20, true);
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
