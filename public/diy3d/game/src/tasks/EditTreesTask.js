define(["diy3d/game/src/builders/TreeBuilder"], function(TreeBuilder){

    "use strict";

    var _add = function(diff, game, name){
        _.each(diff, function(obj){
            var mesh = game.makeMesh("tree", name, obj.id);
            TreeBuilder.update(mesh, obj.data.position, obj);
        });
    };

    var _edit = function(diff, game){
        _.each(diff, function(obj){
            var mesh = game.scene.getMeshByID(obj.from.id);
            TreeBuilder.update(mesh, obj.to.data.position, obj.to);
        });
    };

    var _remove = function(diff, game){
        _.each(diff, function(obj){
            game.removeMesh("object", obj.id);
        });
    };

    var EditTreesTask = function(game){
        var diffs, trees;
        trees = game.data.types["tree"];
        diffs = game.meshStore.addAndGetDiff("tree", trees);
        _.each(diffs, function(diffData){
            _edit(diffData.diff.edit, game);
            _add(diffData.diff.add, game, diffData.name);
            _remove(diffData.diff.remove, game);
        });
    };

    return EditTreesTask;

});

