define([], function(){
	/* helper functions */
	"use strict";

	var PathFinding  = {};

	PathFinding.getAStarPath = function(pos, grid, targetPos){
		// TODO - cache new PF.AStarFinder()??
		// TODO - web worker?
		var i, points, numPoints, sections = [], _addDir;
		points = new PF.AStarFinder().findPath(pos.i, pos.j, playerPos.i, playerPos.j, grid.clone());
		if(!points || points.length <= 1){
			return null; // no path
		}
		numPoints = points.length;
		points = _.map(points, function(p){
			return GridUtils.ijToBabylon(p[0], p[1]);
		});
		for(i = 0; i <= numPoints - 2; i++){
			sections.push({
				"start":points[i],
				"end":points[i + 1]
			});
		}
		_addDir = function(obj){
			//TODO - these are integers in the original points array
			if(Math.abs(obj.start.x - obj.end.x) < 0.1){
				obj.dir = (obj.start.z < obj.end.z ? "n" : "s");
			}
			else{
				obj.dir = (obj.start.x < obj.end.x ? "e" : "w");
			}
		};
		_.each(sections, _addDir);
		return {
			"sections":sections,
			"currentNum":0
		};
	};

	return PathFinding;

});
