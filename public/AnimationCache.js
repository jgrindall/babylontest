define([], function(){
	/* helper functions */

	"use strict";


	var AnimationCache = {};

	AnimationCache.get = function(type){
		if(type === "rot"){
			var a = new BABYLON.Animation("rot", "rotation.z", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			a.setKeys([{
			    frame: 0,
			    value: 2
			},{
			    frame: 10,
			    value: -2
			},{
			    frame: 2 * 10,
			    value: 2
			}]);
			return a;
		}
	};

	return AnimationCache;

});
