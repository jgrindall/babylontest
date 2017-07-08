define([], function(){
	"use strict";

	var ObjectCollectionCommand = function(){

	};

	ObjectCollectionCommand.prototype.exec = function(manager, playerId, objectIds, toDeleteIds){
		while(toDeleteIds.length >= 1){
			var objectId = toDeleteIds.pop(), index = objectIds.indexOf(objectId), objectData;
			objectData = manager.getComponentDataForEntity('ObjectComponent', objectId).data;
			manager.getComponentDataForEntity('MeshComponent', objectId).mesh.dispose();
			manager.removeEntity(objectId);
			objectIds.splice(index, 1);
			manager.getComponentDataForEntity('PossessionsComponent', playerId).possessions.push(objectData);
			window.updateP(manager.getComponentDataForEntity('PossessionsComponent', playerId).possessions);
		}
	};

	return ObjectCollectionCommand;

});

