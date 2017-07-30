define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/utils/GreedyMeshAlgo"],

	function(GridUtils, GreedyMeshAlgo){

	"use strict";

	var GridBuilder = {

	};

	var ALL_TYPES = ["water", "wall", "door", "tree", "fire", "object", "baddie"]; // add any more here

	var SOLID = ["water", "wall", "door", "tree"];  //for pathfinder

	var BOX = ["water", "wall", "tree"]; //permanent boxes should be drawn

	GridBuilder.update = function(g){
		g.solid = GridUtils.markByType(g.grid, SOLID);
		g.types = {};
		_.each(ALL_TYPES, function(type){
			g.types[type] = GridUtils.listByType(g.grid, type);
		});
		g.pfGrid = new PF.Grid(GridUtils.transpose(g.solid));
		g.greedy = {
			"boxes":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, BOX))
		};
		_.each(ALL_TYPES, function(type){
			g.greedy[type] = GreedyMeshAlgo.get(GridUtils.markByType(g.grid, type));
		});
	};

	GridBuilder.build = function(scene, meshCache, data){
		var g = {};
		g.grid = GridUtils.arrayToGrid(data);
		GridUtils.addDirectionsOfWalls(g.grid);
		console.log(g.grid);
		//GridUtils.extendWalls(g.grid);
		GridBuilder.update(g);
		return g;
	};

	return GridBuilder;

});
