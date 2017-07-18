define(["utils/GridUtils", "utils/GreedyMeshAlgo"],

	function(GridUtils, GreedyMeshAlgo){

	"use strict";

	var GridBuilder = {

	};

	var SOLID = ["water", "wall", "door", "tree"];  //for pathfinder

	var BOX = ["water", "wall", "tree"]; //permanent boxes should be drawn

	GridBuilder.update = function(g){
		var types = _.uniq(_.pluck(_.flatten(g.grid), "type"));
		g.solid = GridUtils.markByType(g.grid, SOLID);
		g.types = {};
		_.each(types, function(type){
			g.types[type] = GridUtils.listByType(g.grid, type);
		});
		g.pfGrid = new PF.Grid(GridUtils.transpose(g.solid));
		g.greedy = {
			"boxes":GreedyMeshAlgo.get(GridUtils.markByType(g.grid, BOX))
		};
		_.each(types, function(type){
			g.greedy[type] = GreedyMeshAlgo.get(GridUtils.markByType(g.grid, type));
		});
	};

	GridBuilder.build = function(scene, meshCache, data){
		var g = {};
		g.grid = GridUtils.arrayToGrid(data);
		GridUtils.addDirectionsOfWalls(g.grid);
		GridUtils.extendWalls(g.grid);
		GridBuilder.update(g);
		return g;
	};

	return GridBuilder;

});
