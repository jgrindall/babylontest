define(["builders/CharacterBuilder"], function(CharacterBuilder){

	"use strict";

	var AddBaddiesTask = function(game){
		game.baddieIds = [];
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var baddies = game.grid.types["baddie"];
		var playerPos = [2, 13];
		var grid = game.grid;
		_.each(baddies, function(obj){
			console.log(obj);
			var id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
			CharacterBuilder.addBaddie(obj.data.position, scene, meshCache, manager, id, obj, grid, playerPos);
			game.baddieIds.push(id);
		});
	};

	return AddBaddiesTask;

});