define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/cache/AnimationCache"],

	function(GridUtils, AnimationCache){

	"use strict";

	var CharacterBuilder = {

	};

	CharacterBuilder.addBaddie = function(pos, scene, meshCache, manager, id, obj, grid, playerPos){
		var y = SIZE/2, mesh, meshComp, strategyComp, babylonPos, texture;
		meshComp = manager.getComponentDataForEntity('MeshComponent', id);
		strategyComp = manager.getComponentDataForEntity('BaddieStrategyComponent', id);
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = meshCache.getBaddie(scene, obj.data.texture);
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		meshComp.mesh = mesh;
		strategyComp.move = obj.data.strategy.move;
		//scene.beginDirectAnimation(mesh, [AnimationCache.get("rot")], 0, 20, true);
	};

	CharacterBuilder.addPlayer = function(pos, scene){
		var y = SIZE/2, babylonPos, mesh;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		mesh = BABYLON.MeshBuilder.CreateBox("player", {height: SIZE*0.75, width:SIZE*0.75, depth:SIZE*0.75}, scene);
		mesh.checkCollisions = true;
		mesh.setEnabled(false);
		mesh.isVisible = false;
		mesh.position = new BABYLON.Vector3(babylonPos.x, y, babylonPos.z);
		mesh.ellipsoid = new BABYLON.Vector3(SIZE/4, SIZE/4, SIZE/4);
		return mesh;
	};

	return CharacterBuilder;

});
