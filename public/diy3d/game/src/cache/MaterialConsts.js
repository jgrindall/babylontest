define([], function(){

	"use strict";

	var BLUE1 =  new BABYLON.Color4(0.35, 0.75, 0.9, 0.95);
	var BLUE2 =  new BABYLON.Color4(0.22, 0.85, 1.0, 0.95);
	var BLUE3 =  new BABYLON.Color4(0.35, 0.7, 0.95, 0.95);
	var BLUE4 =  new BABYLON.Color4(0.5, 0.8, 1.0, 0.95);
	var LTBLUE = new BABYLON.Color4(0.6, 0.75, 0.83, 0.95);
	var WHITE =  new BABYLON.Color4(1, 1, 1, 1);

	return {
		"BLUE1":BLUE1,
		"BLUE2":BLUE2,
		"BLUE3":BLUE3,
		"BLUE4":BLUE4,
		"LTBLUE":LTBLUE,
		"WHITE":WHITE,
		"WATER" : [
			WHITE,
			LTBLUE,
			BLUE4,
			WHITE,
			BLUE3,
			WHITE
		]
	};
});
