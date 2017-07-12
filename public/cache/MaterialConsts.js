define([], function(){

	"use strict";

	var BLUE1 =  new BABYLON.Color4(0.35, 0.4, 0.9, 1);
	var BLUE2 =  new BABYLON.Color4(0.22, 0.8, 1.0, 0.5);
	var BLUE3 =  new BABYLON.Color4(0.35, 0.7, 0.9, 0.8);
	var BLUE4 =  new BABYLON.Color4(0.2, 0.5, 1.0, 0.7);
	var LTBLUE = new BABYLON.Color4(0.8, 0.25, 0.33, 0.99);
	var WHITE =  new BABYLON.Color4(0.9, 1, 1, 1);

	return {
		"BLUE1":BLUE1,
		"BLUE2":BLUE2,
		"BLUE3":BLUE3,
		"BLUE4":BLUE4,
		"LTBLUE":LTBLUE,
		"WHITE":WHITE,
		"WATER" : [
			BLUE2,
			LTBLUE,
			BLUE4,
			WHITE,
			BLUE3,
			WHITE
		]
	};
});
