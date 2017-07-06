define(["GridUtils", "MeshCache", "GreedyMeshAlgo", "Materials", "Textures", "LightBuilder", "EffectBuilder"],

	function(GridUtils, MeshCache, GreedyMeshAlgo, Materials, Textures, LightBuilder, EffectBuilder){

	"use strict";

	var GridBuilder = {

	};

	GridBuilder.build = function(scene, gridComponent){
		GridUtils.addFacesInfoToGrid(gridComponent.grid);
		gridComponent.empty = _.shuffle(GridUtils.getMatchingLocations(gridComponent.grid, function(obj){
			return obj.type === "empty";
		}));
		gridComponent.solid = GridUtils.getSolid(gridComponent.grid);
		gridComponent.greedy = GreedyMeshAlgo.get(gridComponent.solid);
		gridComponent.greedyWater = GreedyMeshAlgo.get(GridUtils.getByType(gridComponent.grid, "water"));
		gridComponent.greedyFire = GreedyMeshAlgo.get(GridUtils.getByType(gridComponent.grid, "fire"));
		MeshCache.clear();
		// cache the boxes
		_.each(gridComponent.greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		// cache the planes for the walls
		_.each(GridUtils.getLengthsNeeded(gridComponent.grid), function(lengths, key){
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		// cache bits and bobs
		MeshCache.addBillboardBoxToCache(scene);
		MeshCache.addBaddieToCache(scene, "bird");
		MeshCache.addBaddieToCache(scene, "baddie");
		// cache water and fire
		_.each(gridComponent.greedyWater.dims, function(size){
			MeshCache.addWaterToCache(scene, size);
		});
		_.each(gridComponent.greedyFire.dims, function(size){
			MeshCache.addFireToCache(scene, size);
		});
		_.each(gridComponent.objects, function(obj){
			MeshCache.addObjectToCache(scene, obj.data.texture);
		});
	};

	return GridBuilder;

});
