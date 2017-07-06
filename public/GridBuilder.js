define(["GridUtils", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var GridBuilder = {

	};

	GridBuilder.build = function(scene, gridComponent, meshCache){
		GridUtils.addFacesInfoToGrid(gridComponent.grid);
		gridComponent.empty = _.shuffle(GridUtils.getMatchingLocations(gridComponent.grid, function(obj){
			return obj.type === "empty";
		}));
		gridComponent.solid = GridUtils.getSolid(gridComponent.grid);
		gridComponent.greedy = GreedyMeshAlgo.get(gridComponent.solid);
		gridComponent.greedyWater = GreedyMeshAlgo.get(GridUtils.getByType(gridComponent.grid, "water"));
		gridComponent.greedyFire = GreedyMeshAlgo.get(GridUtils.getByType(gridComponent.grid, "fire"));
		// cache the boxes
		_.each(gridComponent.greedy.dims, function(size){
			meshCache.addBoxToCache(scene, size, SIZE);
		});
		// cache the planes for the walls
		_.each(GridUtils.getLengthsNeeded(gridComponent.grid), function(lengths, key){
			meshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		// cache bits and bobs
		meshCache.addBillboardBoxToCache(scene);
		meshCache.addBaddieToCache(scene, "bird");
		meshCache.addBaddieToCache(scene, "baddie");
		// cache water and fire
		_.each(gridComponent.greedyWater.dims, function(size){
			meshCache.addWaterToCache(scene, size);
		});
		_.each(gridComponent.greedyFire.dims, function(size){
			meshCache.addFireToCache(scene, size);
		});
		_.each(gridComponent.objects, function(obj){
			meshCache.addObjectToCache(scene, obj.data.texture);
		});
	};

	return GridBuilder;

});
