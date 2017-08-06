define(["diy3d/game/src/utils/GridUtils"], function(GridUtils){

	"use strict";

	var UpdateHUDProcessor = function(game){
		this.game = game;
	};

	UpdateHUDProcessor.prototype.getBaddies = function () {
		var arr = [], i, len, babylonPos, mesh;
		if(this.game.ids["baddie"]){
			len = this.game.ids["baddie"].length;
			for(i = 0; i < len; i++){
				mesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.ids["baddie"][i]).mesh;
				arr.push(GridUtils.babylonToIJ(mesh.position));
			}
		}
		return arr;
	};

	UpdateHUDProcessor.prototype.getObjects = function () {
		var arr = [], i, len, mesh;
		if(this.game.ids["object"]){
			len = this.game.ids["object"].length;
			for(i = 0; i < len; i++){
				mesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.game.ids["object"][i]).mesh;
				if (mesh.isVisible) {
	                arr.push(GridUtils.babylonToIJ(mesh.position));
	            }
			};
		}
        return arr;
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
