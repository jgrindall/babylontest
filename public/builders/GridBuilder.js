define(["utils/GridUtils", "utils/GreedyMeshAlgo"],

	function(GridUtils, GreedyMeshAlgo){

	"use strict";

	var SOLID_TYPES = ["water", "wall", "door"];

	var GridBuilder = {

	};

	GridBuilder.cache = function(){
		//
	};

	GridBuilder.build = function(scene, meshCache){
		var g = {};
		g.grid = GridUtils.arrayToGrid(window._DATA);
		GridUtils.addDirectionsOfWalls(g.grid);
		GridUtils.extendWalls(g.grid);
		g.objects = GridUtils.listByType(g.grid, ["object"]);
		g.baddies = GridUtils.listByType(g.grid, ["baddie"]);
		g.doors = GridUtils.listByType(g.grid, ["door"]);
		g.solid = GridUtils.markByType(g.grid, SOLID_TYPES);
		g.greedy = {
			"solid":GreedyMeshAlgo.get(g.solid),
			"water":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "water")),
			"fire":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "fire"))
		};
		return g;
	};

	return GridBuilder;

});
