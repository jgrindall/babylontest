define(["GridUtils", "GreedyMeshAlgo"], function(GridUtils, GreedyMeshAlgo){
	
	var GridComponentExtended = function(g){
		// update all the stuff on the grid
		GridUtils.addFacesInfoToGrid(g.grid);
		g.empty = _.shuffle(GridUtils.getMatchingLocations(g.grid, function(obj){
			return obj.type === "empty";
		}));
		g.empty = [[1, 1], [6, 6]];
		g.solid = GridUtils.getSolid(g.grid);
		g.greedy = GreedyMeshAlgo.get(g.solid);
		g.greedyWater = GreedyMeshAlgo.get(GridUtils.getByType(g.grid, "water"));
		g.greedyFire = GreedyMeshAlgo.get(GridUtils.getByType(g.grid, "fire"));
	};
	
	return GridComponentExtended;
	
});

