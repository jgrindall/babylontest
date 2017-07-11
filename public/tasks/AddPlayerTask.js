define(["CharacterBuilder"], function(CharacterBuilder){

	var AddPlayerTask = function(game){
		game.playerId = game.manager.createEntity(['HealthComponent', 'MessageComponent', 'PossessionsComponent', 'SpeedComponent', 'MeshComponent']);
		game.manager.getComponentDataForEntity('MeshComponent', game.playerId).mesh = CharacterBuilder.addPlayer([2, 13], game.scene, game.meshCache);
	};

	return AddPlayerTask;

});