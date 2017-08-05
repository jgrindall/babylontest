define([], function(){
	"use strict";

	var ObjectCollectionCommand = function(game, objectIds){
		this.game = game;
		this.objectIds = objectIds;
	};

	ObjectCollectionCommand.prototype.exec = function(){
		var objectId, objectData, possComp, meshComp;
		possComp = this.game.manager.getComponentDataForEntity('PossessionsComponent', this.game.playerId);
		while(this.objectIds.length >= 1){
			objectId = this.objectIds.pop();
			objectData = this.game.manager.getComponentDataForEntity('ObjectComponent', objectId).data;
			meshComp = this.game.manager.getComponentDataForEntity('MeshComponent', objectId);
            meshComp.mesh.setEnabled(false);
            meshComp.mesh.isVisible = false;
            possComp.possessions.push(objectData.name);
			this.game.possessions.update(possComp.possessions);
		}
	};

	return ObjectCollectionCommand;

});

