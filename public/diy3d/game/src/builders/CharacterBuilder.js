define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/cache/AnimationCache"],

	function(GridUtils, AnimationCache){

	"use strict";

	var CharacterBuilder = {

	};

	CharacterBuilder.addBaddie = function(pos, scene, meshCache, manager, id, obj, grid, playerPos){
		var y = SIZE/2, mesh, texture, meshComp, strategyComp;
		meshComp = manager.getComponentDataForEntity('MeshComponent', id);
		strategyComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		mesh = meshCache.getBaddie(scene, obj.data.texture);
		mesh.position = GridUtils.ijToBabylon(pos[0], pos[1], SIZE/2);
		meshComp.mesh = mesh;
		strategyComp.move = obj.data.strategy.move;
		//scene.beginDirectAnimation(mesh, [AnimationCache.get("rot")], 0, 20, true);
	};

	CharacterBuilder.addPlayer = function(pos, scene){
		var player = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		player.checkCollisions = true;
		player.position = GridUtils.ijToBabylon(pos[0], pos[1], SIZE/2);
		player.ellipsoid = new BABYLON.Vector3(SIZE/4, SIZE/4, SIZE/4);
		return player;
	};

	return CharacterBuilder;

});
