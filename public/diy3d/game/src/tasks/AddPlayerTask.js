define(["diy3d/game/src/builders/CharacterBuilder"], function(CharacterBuilder){

	"use strict";

	var AddPlayerTask = function(game){
		game.playerId = game.manager.createEntity(['HealthComponent', 'MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
		game.manager.getComponentDataForEntity('MeshComponent', game.playerId).mesh = CharacterBuilder.addPlayer([2, 13], game.scene, game.meshCache);
	};

	return AddPlayerTask;

});