define(["HUD", "GamePad", "Possessions", "utils/GamePadUtils", "Health"], function(HUD, GamePad, Possessions, GamePadUtils, Health){

	var AddControlsTask = function(game){
		game.gamePad = new GamePad("zone_joystick");
		GamePadUtils.linkGamePadToId(game.manager, game.gamePad, game.playerId);
		game.hud = new HUD();
		game.possessions = new Possessions(game.materialsCache);
		game.health = new Health();
	};

	return AddControlsTask;

});