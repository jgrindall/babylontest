define([], function(){

	"use strict";

	var CacheTask = function(game){
        game.meshStore.cache();
        game.meshStore.clear();
	};

	return CacheTask;

});