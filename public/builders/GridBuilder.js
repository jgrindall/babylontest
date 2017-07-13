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
		g.data = window._DATA;
		g.grid = GridUtils.arrayToGrid(g.data);
		g.objects = GridUtils.listByType(g.grid, ["object"]);
		g.baddies = GridUtils.listByType(g.grid, ["baddie"]);
		g.doors = GridUtils.listByType(g.grid, ["door"]);
		GridUtils.addDirectionsOfWalls(g.grid);
		GridUtils.extendWalls(g.grid);
		g.solid = GridUtils.markByType(g.grid, SOLID_TYPES);
		g.greedy = GreedyMeshAlgo.get(g.solid);
		g.greedyWater = GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "water"));
		g.greedyFire = GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "fire"));
		return g;
	};

	return GridBuilder;

});
