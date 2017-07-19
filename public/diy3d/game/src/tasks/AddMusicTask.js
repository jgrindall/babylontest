var baseURL = window.location.host;

define([], function(){

	"use strict";

	var AddMusicTask = function(game){
		var music = new BABYLON.Sound("Music", baseURL + "/images/diy3d/assets/sea.mp3", game.scene, null, { loop: true, autoplay: true });
		music.setVolume(0.1);
	};

	return AddMusicTask;

});