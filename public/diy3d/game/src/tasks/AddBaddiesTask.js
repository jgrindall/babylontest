define(["diy3d/game/src/builders/CharacterBuilder"], function(CharacterBuilder){

	"use strict";

	var AddBaddiesTask = function(game){
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache, baddies, grid;
		game.baddieIds = [];
		baddies = game.grid.types["baddie"];
		grid = game.grid;
		_.each(baddies, function(obj){
			var id = manager.createEntity(['MessageComponent', 'PossessionsComponent', 'MeshComponent', 'BaddieStrategyComponent']);
			CharacterBuilder.addBaddie(obj.data.position, scene, meshCache, manager, id, obj, grid);
			game.baddieIds.push(id);
		});
	};

	return AddBaddiesTask;

});