define([], function(){
	"use strict";

	var CommandQueue = function(){
		this._comm = [];
		this.timeouts = [];
		this.keys = "";
	};

	CommandQueue.prototype.clear = function(){

	};

	CommandQueue.prototype.add = function(c, time){
		this._comm.push(c);
		var i = setTimeout(function(){
			c.exec();
		}, time * 1000);
		this.timeouts.push(i);
	};

	return CommandQueue;

});
