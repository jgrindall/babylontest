define(["diy3d/game/src/builders/ObjectBuilder"], function(ObjectBuilder){

	"use strict";

	var _add = function(diff, game, name){
        console.log("add objects", diff.length);
        _.each(diff, function(obj){
            var mesh, entityId;
            mesh = game.makeMesh("object", name, obj.id);
            entityId = game.manager.createEntity(['MeshComponent', 'ObjectComponent', 'SoundComponent']);
            ObjectBuilder.update(game, mesh, entityId, obj.data.position, obj);
            game.addToIds("object", entityId);
        });
    };
    var _edit = function(diff, game){
        console.log("move objects", diff.length);
        _.each(diff, function(obj){
            var mesh, entityId;
            mesh = game.scene.getMeshByID(obj.from.id);
            entityId = game.getEntityIdFromMeshId("object", obj.from.id);
            ObjectBuilder.update(game, mesh, entityId, obj.to.data.position, obj.to);
        });
    };
    var _remove = function(diff, game){
        _.each(diff, function(obj){
            console.log("remove objects", obj);
            game.removeMeshAndEntity("object", obj.id);
        });
    };

	var EditObjectsTask = function(game){
		var diffs, objects;
		objects = game.data.types["object"];
        diffs = game.meshStore.addAndGetDiff("object", objects);
        _.each(diffs, function(diffData){
            _edit(diffData.diff.edit, game);
            _add(diffData.diff.add, game, diffData.name);
            _remove(diffData.diff.remove, game);
        });
	};

	return EditObjectsTask;

});

