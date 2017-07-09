define([], function(){
	"use strict";

	var ObjectCollectionCommand = function(){

	};

	ObjectCollectionCommand.prototype.exec = function(game, toDeleteIds){
		var possComp = game.manager.getComponentDataForEntity('PossessionsComponent', game.playerId);
		var objectIds = game.objectIds;
		while(toDeleteIds.length >= 1){
			var objectId = toDeleteIds.pop(), index = objectIds.indexOf(objectId), objectData;
			objectData = game.manager.getComponentDataForEntity('ObjectComponent', objectId).data;
			game.manager.getComponentDataForEntity('MeshComponent', objectId).mesh.dispose();
			game.manager.removeEntity(objectId);
			objectIds.splice(index, 1);
			possComp.possessions.push(objectData);
			game.possessions.update(possComp.possessions);
		}
	};

	return ObjectCollectionCommand;

});

