define([], function(){
	"use strict";

	var ObjectCollectionCommand = function(game, toDeleteIds){
		this.game = game;
		this.toDeleteIds = toDeleteIds;
	};

	ObjectCollectionCommand.prototype.exec = function(){
		var possComp = this.game.manager.getComponentDataForEntity('PossessionsComponent', this.game.playerId);
		var objectIds = this.game.objectIds;
		while(this.toDeleteIds.length >= 1){
			var objectId = this.toDeleteIds.pop(), index = objectIds.indexOf(objectId), objectData;
			objectData = this.game.manager.getComponentDataForEntity('ObjectComponent', objectId).data;
			this.game.manager.getComponentDataForEntity('MeshComponent', objectId).mesh.dispose();
			this.game.manager.removeEntity(objectId);
			objectIds.splice(index, 1);
			possComp.possessions.push(objectData);
			this.game.possessions.update(possComp.possessions);
		}
	};

	return ObjectCollectionCommand;

});

