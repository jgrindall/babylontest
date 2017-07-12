define(["utils/GridUtils", "utils/GreedyMeshAlgo", "MaterialsCache", "Textures", "builders/LightBuilder", "builders/EffectBuilder"],

	function(GridUtils, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var GridBuilder = {

	};

	GridBuilder.build = function(scene, meshCache){
		var g = {};
		g.grid = window._DATA;
		g.objects = window._OBJECTS;
		g.baddies = window._BADDIES;
		GridUtils.addFacesInfoToGrid(g.grid);
		g.solid = GridUtils.getSolid(g.grid);
		g.greedy = GreedyMeshAlgo.get(g.solid);
		g.greedyWater = GreedyMeshAlgo.get(GridUtils.getByType(g.grid, "water"));
		g.greedyFire = GreedyMeshAlgo.get(GridUtils.getByType(g.grid, "fire"));
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
