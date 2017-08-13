
define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"], function(GridUtils, Consts){

	"use strict";

        var _between = function(v0, v1){
                return v0 + Math.random()*(v1 - v0);
        };

	var EditParticlesTask = function(game){
                var system, fire, posns;
                system = game.scene.particleSystems[0];
                if(!system){
                        return;
                }
                fire = game.data.types["fire"],
                posns = _.map(fire, function(f){
                        return f.data.position;
                });
                console.log(posns);
                system.emitter = game.scene.getMeshByID("_ground");
                system.startPositionFunction = function(worldMatrix, positionToUpdate){
                        var r = posns[Math.floor(Math.random() * posns.length)];
                        console.log("chose", r);
                        positionToUpdate.x = Consts.TOP_LEFT.x + r[1]*SIZE + Math.random()*SIZE;
                        positionToUpdate.y = 0.01;
                        positionToUpdate.z = Consts.TOP_LEFT.z - r[0]*SIZE - Math.random()*SIZE;
                };
                system.start();
	};

	return EditParticlesTask;

});