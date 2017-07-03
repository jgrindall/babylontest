define([], function(){
	/* helper functions */
	"use strict";

	var PathFinding  = {};
	
	PathFinding.getAStarPath = function(pos, pfGrid, targetPos){
		/*
		var pf = new PF.Grid(GridUtils.formatForPF(grid));
		var backup = pf.clone();
		var finder = new PF.AStarFinder();
		var paths = finder.findPath(3, 3, 7, 7, pf);
		return paths;
		*/
	};
	
	PathFinding.formatForPF = function(a){
		//TODO - make this a common method 'map'
		/*
		var SIZE_I = a.length, SIZE_J = a[0].length;
		var e = GridUtils.makeEmpty(SIZE_I, SIZE_J);
		var _i, _j;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(a[_i][_j].val >= 1){
					e[_i][_j] = 1;
				}
			}
		}
		return e;
		*/
	};
	
	return PathFinding;

});
