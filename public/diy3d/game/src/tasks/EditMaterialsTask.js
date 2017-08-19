define(["diy3d/game/src/builders/EnvironmentBuilder"], function(EnvironmentBuilder){

	"use strict";

	var EditMaterialsTask = function(game){
        var fireMaterial, fireTexture, color;
        color = game.json.data.materials.fire.color;
        fireMaterial = game.materialsCache.getMaterial("fire");
        if(fireMaterial){
        	fireMaterial.unfreeze();
        	var c = new BABYLON.Color4(color[0], color[1], color[2], color[3]);
        	var c1 = new BABYLON.Color4(color[0]*1.2, color[1]*1.2, color[2]*1.2, color[3]);
        	var c2 = new BABYLON.Color4(color[0]*0.8, color[1]*0.8, color[2]*0.8, color[3]);
        	console.log(c);
        	fireMaterial.ambientColor = c;
        	fireTexture = fireMaterial.diffuseTexture;
        	fireTexture.fireColors = [
				c,
				c1,
				c,
				c2,
				c,
				c1
			];
			fireMaterial.freeze();
		}
		if(game.scene.particleSystems.length === 1){
			game.scene.particleSystems[0].color1 = c;
			game.scene.particleSystems[0].color2 = c;
			console.log(c);
		}
	};

	return EditMaterialsTask;

});
