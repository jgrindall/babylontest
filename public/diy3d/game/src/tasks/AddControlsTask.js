define(["diy3d/game/src/HUD", "diy3d/game/src/GamePad", "diy3d/game/src/KeyGamePad", "diy3d/game/src/ExitButton", "diy3d/game/src/Possessions", "diy3d/game/src/Health"],

    function(HUD, GamePad, KeyGamePad, ExitButton, Possessions, Health){

	"use strict";

    var gamePadMaker = {
        make:function(sel){
            if(0){
                return new GamePad(sel);
            }
            else{
                return new KeyGamePad(sel);
            }
        }
    };

	var AddControlsTask = function(game){
	    if(!game.hud) {
            game.hud = new HUD("#zone_hud");
        }
        game.hud.cacheGrid(game.data);
        if(!game.health) {
            game.health = new Health("#zone_health");
        }
        if(!game.possessions) {
            game.possessions = new Possessions(game.manager, game.materialsCache, "#zone_possessions");
        }
        if(!game.gamePad) {
            game.gamePad = gamePadMaker.make("#zone_joystick");
        }
        if(!game.exitButton) {
            game.exitButton = new ExitButton("#zone_exit", game);
        }
	};

	return AddControlsTask;

});