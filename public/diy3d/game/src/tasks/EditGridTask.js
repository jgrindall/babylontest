define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/commands/UpdateGridCommand"], function(GridUtils, UpdateGridCommand){

	"use strict";

	var EditGridTask = function(game){
		game.data = {
            "grid": game.json.data.data
        };
        GridUtils.addPositions(game.data.grid);
        GridUtils.addDirectionsOfWalls(game.data.grid);
        new UpdateGridCommand(game).exec();
	};

	return EditGridTask;

});

