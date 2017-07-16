define(["utils/GridUtils", "utils/GreedyMeshAlgo"],

	function(GridUtils, GreedyMeshAlgo){

	"use strict";

	var GridBuilder = {

	};

	GridBuilder.update = function(g){
		g.objects = GridUtils.listByType(g.grid, ["object"]);
		g.baddies = GridUtils.listByType(g.grid, ["baddie"]);
		g.trees = GridUtils.listByType(g.grid, ["tree"]);
		g.doors = GridUtils.listByType(g.grid, ["door"]);
		g.solid = GridUtils.markByType(g.grid, ["water", "wall", "door"]);
		g.pfGrid = new PF.Grid(GridUtils.transpose(g.solid));
		g.greedy = {
			"wall":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "wall")),
			"boxes":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, ["water", "wall", "tree"])),
			"door":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "door")),
			"water":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "water")),
			"fire":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, "fire"))
		};
	};

	GridBuilder.build = function(scene, meshCache){
		var g = {
			//
		};
		g.grid = GridUtils.arrayToGrid(window._DATA);
		GridUtils.addDirectionsOfWalls(g.grid);
		GridUtils.extendWalls(g.grid);
		GridBuilder.update (g);
		return g;
	};

	return GridBuilder;

});
