define([], function(){
	"use strict";

	var ObjectCollectionCommand = function(){

	};

	ObjectCollectionCommand.prototype.exec = function(manager, playerId, objectIds, toDeleteIds){
		var possComp = manager.getComponentDataForEntity('PossessionsComponent', playerId);
		while(toDeleteIds.length >= 1){
			var objectId = toDeleteIds.pop(), index = objectIds.indexOf(objectId), objectData;
			objectData = manager.getComponentDataForEntity('ObjectComponent', objectId).data;
			manager.getComponentDataForEntity('MeshComponent', objectId).mesh.dispose();
			manager.removeEntity(objectId);
			objectIds.splice(index, 1);
			possComp.possessions.push(objectData);
			manager.listener.emit("a", playerId, "PossessionsComponent");
		}
	};

	return ObjectCollectionCommand;

});

