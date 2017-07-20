define([], function(){
	"use strict";

	var CommandQueue = function(){
		this.timeouts = [];
	};

	CommandQueue.prototype.clear = function(){
		_.each(this.timeouts, function(interval){
			clearTimeout(interval);
		});
		this.timeouts = [];
	};

	CommandQueue.prototype.add = function(c, time){
		this.timeouts.push(setTimeout(function(){
			c.exec();
		}, time * 1000));
	};

	return CommandQueue;

});
