define(["builders/DoorBuilder"], function(DoorBuilder){

	"use strict";

	var AddDoorsTask = function(game){
		game.doorIds = [];
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var doors = game.grid.doors;
		_.each(doors, function(obj){
			var id = manager.createEntity(['DoorComponent', 'MeshComponent']);
			DoorBuilder.addDoor(obj.data.position, scene, meshCache, manager, id, obj);
			game.doorIds.push(id);
		});
	};

	return AddDoorsTask;

});