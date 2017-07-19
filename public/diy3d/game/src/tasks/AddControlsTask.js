define(["diy3d/game/src/HUD", "diy3d/game/src/GamePad", "diy3d/game/src/Possessions", "diy3d/game/src/utils/GamePadUtils", "diy3d/game/src/Health"], function(HUD, GamePad, Possessions, GamePadUtils, Health){

	"use strict";

	var AddControlsTask = function(game){
		game.hud = new HUD("#zone_hud");
        game.health = new Health("#zone_health");
        game.possessions = new Possessions(game.manager, game.materialsCache, "#zone_possessions");
        game.gamePad = new GamePad("zone_joystick");
        GamePadUtils.linkGamePadToId(game.manager, game.gamePad, game.playerId);
	};

	return AddControlsTask;

});