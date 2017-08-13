define([], function(){
	/* helper functions */

	"use strict";


	var AnimationCache = {};

	var NUM_FRAMES = 10; // even please

	//no performance gain changing these - just change them to get the right speed

	AnimationCache.get = function(type){
		if(type === "rot"){
			var a = new BABYLON.Animation("rot", "rotation.z", NUM_FRAMES, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			a.setKeys([{
			    frame: 0,
			    value: 2
			},{
			    frame: NUM_FRAMES/2,
			    value: -2
			},{
			    frame: NUM_FRAMES,
			    value: 2
			}]);
			return a;
		}
	};

	return AnimationCache;

});
