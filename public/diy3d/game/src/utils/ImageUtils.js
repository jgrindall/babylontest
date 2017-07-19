define([], function(){

	"use strict";


	var ImageUtils = {};

	ImageUtils.loadURL = function(url) {
		return new Promise(function(resolve){
			var img = new Image();
			img.onload = function(){
				resolve(img);
			};
			img.src = url;
		});
	};

    ImageUtils.flipCanvas = function(canvas){
        var c, context;
        c = document.createElement("canvas");
        c.width = canvas.width;
        c.height = canvas.height;
        context = c.getContext("2d");
        context.translate(0, c.height);
        context.scale(1, -1);
        context.drawImage(canvas, 0, 0);
        return c;
    };

	ImageUtils.loadURLs = function(urls) {
	 	return Promise.all(_.map(urls, ImageUtils.loadURL));
	};

	return ImageUtils;

});
