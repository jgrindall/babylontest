define([], function(){

	"use strict";


	var ImageUtils = {};

	ImageUtils.loadURL = function(url) {
		return new Promise(function(resolve, reject){
			var img = new Image();
			img.onload = function(){
				resolve(img);
			};
			img.src = url;
		});
	};

	ImageUtils.loadURLs = function(urls) {
	 	return Promise.all(_.map(urls, ImageUtils.loadURL));
	};

	return ImageUtils;

});
