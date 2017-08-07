define([], function(){

	"use strict";


	var ImageUtils = {};

    ImageUtils.resize = function(url, w, h, data) {
        return new Promise(function(resolve, reject) {
            var canvas, img = new Image();
            $(img).one("error", function () {
                reject("failed to load", url);
            });
            $(img).one("load", function () {
                if(img.width === w && img.height === h){
                    resolve({"url":url, "data":data});
                }
                else{
                    canvas = document.createElement("canvas");
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                    resolve({"url":canvas.toDataURL(), "data":data});
                }
            });
            img.src = url;
        });
    };

	ImageUtils.loadURL = function(url, img) {
	    return new Promise(function(resolve){
		    if(!img){
		        img = new Image();
            }
			$(img).one("load", function(){
                resolve(img);
            });
			img.src = "";
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
