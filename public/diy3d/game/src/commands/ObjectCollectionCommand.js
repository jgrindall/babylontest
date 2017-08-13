define(["diy3d/game/src/commands/PlaySoundCommand"], function(PlaySoundCommand){
	"use strict";

	var ObjectCollectionCommand = function(game, objectId){
		this.game = game;
		this.objectId = objectId;
	};

	ObjectCollectionCommand.prototype.exec = function(){
		var objectData, possComp, meshComp, soundComp;
		possComp = this.game.manager.getComponentDataForEntity('PossessionsComponent', this.game.playerId);
		objectData = this.game.manager.getComponentDataForEntity('ObjectComponent', this.objectId).data;
		meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', this.objectId);
		soundComp = this.game.manager.getComponentDataForEntity('SoundComponent', this.objectId);
		new PlaySoundCommand(this.game, this.objectId).exec();
        meshComp.mesh.setEnabled(false);
        meshComp.mesh.isVisible = false;
        possComp.possessions.push(objectData.name);
		this.game.possessions.update(possComp.possessions);
	};

	return ObjectCollectionCommand;

});

