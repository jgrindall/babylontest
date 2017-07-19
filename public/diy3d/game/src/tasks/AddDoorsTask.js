define(["diy3d/game/src/builders/DoorBuilder"], function(DoorBuilder){

	"use strict";

	var AddDoorsTask = function(game){
		game.doorIds = [];
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var doors = game.grid.types["door"];
		_.each(doors, function(obj){
			var id, mesh;
			id = manager.createEntity(['DoorComponent', 'MeshComponent']);
			DoorBuilder.addDoor(obj.data.position, scene, meshCache, manager, id, obj);
			game.doorIds.push(id);
			mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
		});
	};

	return AddDoorsTask;

});