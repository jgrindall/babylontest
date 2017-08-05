define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){

	"use strict";

	var UpdateHUDProcessor = function(game){
		this.game = game;
	};

	UpdateHUDProcessor.prototype.getBaddies = function () {
		var manager = this.game.manager;
        //OPTIMISE
		return _.map(this.game.ids["baddie"], function(id){
			var position = manager.getComponentDataForEntity('MeshComponent', id).mesh.position;
			return {
				"position":GridUtils.babylonToIJ(position)
			};
		});
	};

	UpdateHUDProcessor.prototype.getObjects = function () {
		var visibleMeshes = [], manager = this.game.manager;
        //OPTIMISE
		_.each(this.game.ids["object"], function(id) {
            var mesh = manager.getComponentDataForEntity('MeshComponent', id).mesh;
            if (mesh.isVisible) {
                visibleMeshes.push(mesh);
            }
        });
		return _.map(visibleMeshes, function(mesh){
		    return {
                "position":GridUtils.babylonToIJ(mesh.position)
            };
		});
	};

	UpdateHUDProcessor.prototype.update = function () {
        var speedComp;
        if(!this.game.hud){
            return;
	    }
        speedComp = this.game.manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
		this.game.hud.update({
            "walls":this.game.data.types["wall"],
            "objects":this.getObjects(),
            "playerPos":GridUtils.babylonToIJ(this.game.camera.position),
            "playerAngle":speedComp.angle,
            "baddies":this.getBaddies(),
            "water":this.game.data.types["water"],
            "fire":this.game.data.types["fire"]
        });
	};

	return UpdateHUDProcessor;

});
