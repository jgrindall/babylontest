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
		// cache the boxes
		_.each(g.greedy.dims, function(size){
			meshCache.addBoxToCache(scene, size, SIZE);
		});
		// cache the planes for the walls
		_.each(GridUtils.getLengthsNeeded(g.grid), function(lengths, key){
			meshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		// cache bits and bobs
		meshCache.addBillboardBoxToCache(scene);
		meshCache.addDoor(scene, "door");
		meshCache.addBaddieToCache(scene, "bird");
		meshCache.addBaddieToCache(scene, "baddie");
		// cache water and fire
		_.each(g.greedyWater.dims, function(size){
			meshCache.addWaterToCache(scene, size);
		});
		_.each(g.greedyFire.dims, function(size){
			meshCache.addFireToCache(scene, size);
		});
		_.each(g.objects, function(obj){
			meshCache.addObjectToCache(scene, obj.data.texture);
		});
		return g;
	};

	return GridBuilder;

});
