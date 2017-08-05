/*
* do this whenever the grid changes - eg. something disappears.
*/

define(["diy3d/game/src/utils/GridUtils"],

	function(GridUtils){
	"use strict";

    var ALL_TYPES = ["water", "wall", "tree", "fire", "object", "baddie"]; // add any more here

    var SOLID = ["water", "wall", "tree"];  //for pathfinder

	var UpdateGridCommand = function(game){
		this.game = game;
	};

	UpdateGridCommand.prototype.exec = function(){
        var data = this.game.data;
        data.solid = GridUtils.markByType(data.grid, SOLID);
        data.types = {};
        _.each(ALL_TYPES, function(type){
            data.types[type] = GridUtils.listByType(data.grid, type);
        });
        data.types["wallfaces"] = GridUtils.getWalls(data.types["wall"]);
        data.pfGrid = new window.PF.Grid(GridUtils.transpose(data.solid));
	};

	return UpdateGridCommand;

});


