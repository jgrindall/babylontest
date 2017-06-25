define([], function(){
	/* helper functions */

	"use strict";


	var GeomUtils = {};

	GeomUtils.pointInRect = function(p, r, options){
		options = options || {'tolerance': 1};
		return (p.x > r.left + options.tolerance)
		&& (p.x < r.right - options.tolerance)
		&& (p.z > r.bottom + options.tolerance)
		&& (p.z < r.top - options.tolerance);
	};

	GeomUtils.getBoxRect = function(box){
		return {
			left:	box.position.x - SIZE*box.__quad[2]/2,
			right:	box.position.x + SIZE*box.__quad[2]/2,
			bottom:	box.position.z - SIZE*box.__quad[3]/2,
			top:	box.position.z + SIZE*box.__quad[3]/2
		};
	};

	GeomUtils.pointInBox = function(p, box){
		var boxRect = GeomUtils.getBoxRect(box);
		var inside = GeomUtils.pointInRect(p, boxRect);
		return inside;
	};

	GeomUtils.rectIntersectRect = function(r1, r2) {
  		return !(r2.left > r1.right || r1.left > r2.right || r2.top < r1.bottom || r1.top < r2.bottom);
	};

	return GeomUtils;

});
