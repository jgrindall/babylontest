define([], function(){
	"use strict";

	var _vector3FromArray = function(a){
		return new BABYLON.Vector3(a[0], a[1], a[2]);
	};

	var _color3FromArray = function(a){
		return new BABYLON.Color3(a[0], a[1], a[2]);
	};

	var _default = function(light0, light1){
	    if(light0) {
            light0.diffuse = _color3FromArray([0.6, 0.6, 0.6]);
            light0.intensity = 0.7;
            light0.groundColor = _color3FromArray([0.8, 0.8, 0.8]);
        }
        if(light1){
            light1.diffuse = _color3FromArray([0.6, 0.6, 0.6]);
            light1.intensity = 0.7;
        }
	};

	var _dark = function(light0, light1){
        if(light0) {
            light0.diffuse = _color3FromArray([0.4, 0.4, 0.4]);
            light0.intensity = 0.4;
            light0.groundColor = _color3FromArray([0.5, 0.5, 0.5]);
        }
        if(light1){
            light1.diffuse = _color3FromArray([0.4, 0.4, 0.4]);
            light1.intensity = 0.4;
        }
    };


	var LightBuilder = {
		build:function(scene, lightData){
		    var light0, light1;
		    if(scene.lights.length === 0) {
                new BABYLON.HemisphericLight("light0", _vector3FromArray([0, 3, 0]), scene);
		        new BABYLON.DirectionalLight("light1", _vector3FromArray([1, 0.5, 1]), scene);
            }
            light0 = scene.lights[0];
            light1 = scene.lights[1];
            if (lightData.type === "default") {
                _default(light0, light1);
            }
            else if (lightData.type === "dark") {
                _dark(light0, light1);
            }
		}
	};


	return LightBuilder;

});

