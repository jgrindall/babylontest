define(["diy3d/game/src/builders/WallBuilder"], function(WallBuilder){

	"use strict";

	var _add = function(diff, game, name){
        _.each(diff, function(obj){
            var mesh = game.makeMesh("wall", name, obj.id);
            WallBuilder.update(mesh, obj.data.position, obj.data.direction, obj);
        });
    };
    var _edit = function(diff, game){
        _.each(diff, function(obj){
            var mesh = game.scene.getMeshByID(obj.from.id);
            WallBuilder.update(mesh, obj.to.data.position, obj.to.data.direction, obj.to);
        });
    };
    var _remove = function(diff, game){
        _.each(diff, function(obj){
            game.removeMesh("wall", obj.id);
        });
    };

	return function(game){
	    var diffs, walls = game.data.types["wallfaces"];
        diffs = game.meshStore.addAndGetDiff("wall", walls);
        _.each(diffs, function(diffData){
            _edit(diffData.diff.edit, game);
            _add(diffData.diff.add, game, diffData.name);
            _remove(diffData.diff.remove, game);
        });
	};

});