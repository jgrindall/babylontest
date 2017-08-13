define([], function(){
	"use strict";

	var PlaySoundCommand = function(game, entityId){
		this.game = game;
		this.entityId = entityId;
	};

	PlaySoundCommand.prototype.exec = function(){
		var soundComp = this.game.manager.getComponentDataForEntity('SoundComponent', this.entityId);
		if(soundComp && soundComp.sound){
			try{
				soundComp.sound.play();
			}
			catch(e){
				// not loaded?
			}
		}
	};

	return PlaySoundCommand;

});
