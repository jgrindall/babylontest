define(["diy3d/game/src/builders/WaterAndFireBuilder"], function(WaterAndFireBuilder){

    "use strict";

    var _add = function(diff, game, name, type){
        _.each(diff, function(obj){
            var mesh = game.makeMesh(type, name, obj.id);
            WaterAndFireBuilder.update(mesh, obj.data.position, obj);
        });
    };
    var _edit = function(diff, game){
         console.log("move ", diff.length);
        _.each(diff, function(obj){
            var mesh = game.scene.getMeshByID(obj.from.id);
            WaterAndFireBuilder.update(mesh, obj.to.data.position, obj.to);
        });
    };
    var _remove = function(diff, game, type){
        _.each(diff, function(obj){
            game.removeMesh(type, obj.id);
        });
    };

    var EditWaterAndFireTask = function(game){
        var waterDiffs, fireDiffs, water, fire;
        water = game.data.types["water"];
        fire = game.data.types["fire"];
        waterDiffs = game.meshStore.addAndGetDiff("water", water);
        fireDiffs = game.meshStore.addAndGetDiff("fire", fire);
        _.each(waterDiffs, function(diffData){
            _edit(diffData.diff.edit, game, "water");
            _add(diffData.diff.add, game, diffData.name, "water");
            _remove(diffData.diff.remove, game, "water");
        });
        _.each(fireDiffs, function(diffData){
            _edit(diffData.diff.edit, game, "fire");
            _add(diffData.diff.add, game, diffData.name, "fire");
            _remove(diffData.diff.remove, game, "fire");
        });
    };

    return EditWaterAndFireTask;

});

