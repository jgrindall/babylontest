define(["diy3d/game/src/HUD", "diy3d/game/src/GamePad", "diy3d/game/src/ExitButton", "diy3d/game/src/Possessions", "diy3d/game/src/Health"],

    function(HUD, GamePad, ExitButton, Possessions, Health){

	"use strict";

	var AddControlsTask = function(game){
	    if(!game.hud) {
            game.hud = new HUD("#zone_hud");
        }
        if(!game.health) {
            game.health = new Health("#zone_health");
        }
        if(!game.possessions) {
            game.possessions = new Possessions(game.manager, game.materialsCache, "#zone_possessions");
        }
        if(!game.gamePad) {
            game.gamePad = new GamePad("#zone_joystick");
        }
        if(!game.exitButton) {
            game.exitButton = new ExitButton("#zone_exit", game);
        }
	};

	return AddControlsTask;

});