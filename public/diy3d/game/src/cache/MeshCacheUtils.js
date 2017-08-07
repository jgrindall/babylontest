define([], function(){

	"use strict";

	var MeshCacheUtils = {

    };

    MeshCacheUtils.getKeyForBox = function(w, h){
	    var temp;
	    if(w < h){
	        temp = w;
	        w = h;
	        h = temp;
        }
	    return "box_" + w + "_" + h;
    };

	return MeshCacheUtils;

});
