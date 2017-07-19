define([], function(){
	"use strict";

	var PlaySoundCommand = function(game){
		this.game = game;
	};

	PlaySoundCommand.prototype.exec = function(){
		var music = new BABYLON.Sound("ouch", "/images/diy3d/assets/alarm.mp3", this.game.scene, null, { loop: false, autoplay: true });
	};

	return PlaySoundCommand;

});
