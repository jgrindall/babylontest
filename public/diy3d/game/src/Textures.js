define([], function(){

	"use strict";

	var Textures = {
	    index:-1
    };

	var SAMPLE_MODE = BABYLON.Texture.BILINEAR_SAMPLINGMODE;

	//NEAREST_SAMPLINGMODE

	Textures.loadImage = function(url){
		return new Promise(function(resolve) {
	    	var image = new Image();
	    	image.onload = function() {
	      		resolve(image);
	    	};
	    	image.src = url;
	  	});
	};

	Textures.getTextureFromURL = function(name, url, scene){
        Textures.index++;
        name = name + "_" + Textures.index;  // unique each time.  wall0_1, wall0_2, wall0_3...
        return BABYLON.Texture.CreateFromBase64String(url, name, scene, true, true, SAMPLE_MODE, null, null);
        //FYI CreateFromBase64String(data, name, scene, noMipmap, invertY, samplingMode, onLoad, onError, format)
    };

	Textures.getTextureFromCanvas = function(canvas, scene){
        return Textures.getTextureFromURL("canvas" + Textures.index, canvas.toDataURL(), scene);
	};

	return Textures;

});
