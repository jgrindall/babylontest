define([], function(){

	"use strict";

	var ParticleManager  = function(){
		this.images = {};
	}

	ParticleManager.prototype.get = function(name){
		return this.images[name];
	};

	return ParticleManager;

});
