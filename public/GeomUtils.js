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

	GeomUtils.rectIntersectRect = function(r1, r2) {
  		return !(r2.left > r1.right || r1.left > r2.right || r2.top < r1.bottom || r1.top < r2.bottom);
	};

	GeomUtils.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
		console.log("rr", ctx, x, y, width, height, radius, fill, stroke);
	 	if (typeof stroke == "undefined" ) {
	    	stroke = true;
	  	}
	  	if (typeof radius === "undefined") {
	    	radius = 5;
	  	}
	  	ctx.beginPath();
	  	ctx.moveTo(x + radius, y);
	  	ctx.lineTo(x + width - radius, y);
	  	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	  	ctx.lineTo(x + width, y + height - radius);
	  	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	  	ctx.lineTo(x + radius, y + height);
	  	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	  	ctx.lineTo(x, y + radius);
	  	ctx.quadraticCurveTo(x, y, x + radius, y);
	  	ctx.closePath();
	  	if (stroke) {
	    	ctx.stroke();
	  	}
	  	if (fill) {
	    	ctx.fill();
	  	}
	};

	return GeomUtils;

});
