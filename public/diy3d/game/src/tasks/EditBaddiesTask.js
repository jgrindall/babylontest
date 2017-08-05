define(["diy3d/game/src/builders/BaddieBuilder"], function(BaddieBuilder){

	"use strict";

	var _edit = function(diff, game){
        _.each(diff, function(obj){
            var mesh, entityId;
            mesh = game.scene.getMeshByID(obj.from.id);
            entityId = game.getEntityIdFromMeshId("baddie", obj.from.id);
            BaddieBuilder.update(game, mesh, entityId, obj.to.data.position, obj.to);
        });
    };

	var _add = function(diff, game, name){
        console.log("add baddies", diff.length);
        _.each(diff, function(obj){
            var mesh, entityId;
            mesh = game.makeMesh("baddie", name, obj.id);
            entityId = game.manager.createEntity(['MeshComponent', 'BaddieStrategyComponent']);
            BaddieBuilder.update(game, mesh, entityId, obj.data.position, obj);
            game.addToIds("baddie", entityId);
        });
    };

    var _remove = function(diff, game){
        _.each(diff, function(obj){
            game.removeMeshAndEntity("baddie", obj.id);
        });
    };

	var EditBaddiesTask = function(game){
	    var diffs, baddies = game.data.types["baddie"];
        diffs = game.meshStore.addAndGetDiff("baddie", baddies);
        _.each(diffs, function(diffData){
            _edit(diffData.diff.edit, game);
            _add(diffData.diff.add, game, diffData.name);
            _remove(diffData.diff.remove, game);
        });
	};

	return EditBaddiesTask;

});

////scene.beginDirectAnimation(mesh, [AnimationCache.get("rot")], 0, 20, true);

