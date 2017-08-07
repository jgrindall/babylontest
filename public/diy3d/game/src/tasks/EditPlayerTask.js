define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"],

    function(GridUtils, Consts){

	"use strict";

	var EditPlayerTask = function(game){
	    if(typeof game.playerId === "undefined") {
            game.playerId = game.manager.createEntity(['HealthComponent', 'PossessionsComponent', 'SpeedComponent']);
        }
        game.camera.position = GridUtils.ijToBabylon(game.json.data.player.position[0], game.json.data.player.position[1], Consts.BOX_SIZE2);
	};

	return EditPlayerTask;

});
