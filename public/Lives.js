define(["utils/GridUtils"], function(GridUtils){
	"use strict";

	var Lives = function(options){
		this.div = document.createElement("div");
		$("body").append(this.div);
	};

	Lives.prototype.update = function(data){
		//
	};

	return Lives;

});
