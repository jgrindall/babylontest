define(["MeshCache", "GridUtils"], function(MeshCache, GridUtils){
	
	var GridCache = function(g, scene){
		MeshCache.clear();
		// cache the boxes
		_.each(g.greedy.dims, function(size){
			MeshCache.addBoxToCache(scene, size, SIZE);
		});
		// cache the planes for the walls
		_.each(GridUtils.getLengthsNeeded(g.grid), function(lengths, key){
			MeshCache.addPlanesToCache(scene, lengths, key, SIZE);
		});
		// cache bits and bobs
		MeshCache.addBillboardBoxToCache(scene);
		MeshCache.addBillboardPlaneToCache(scene, 4);
		MeshCache.addBillboardPlaneToCache(scene, 5);
		// cache water and fire
		_.each(g.greedyWater.dims, function(size){
			MeshCache.addWaterToCache(scene, size);
		});
		_.each(g.greedyFire.dims, function(size){
			MeshCache.addFireToCache(scene, size);
		});
	};
	
	return GridCache;
	
});

