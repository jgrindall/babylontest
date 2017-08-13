define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts"], function(GridUtils, Consts){
	"use strict";

	var ObjectBuilder = {
		update:function(game, mesh, entityId, position, obj){
            var soundComp;
            mesh.position = GridUtils.ijToBabylon(position[0], position[1], 3*Consts.BOX_SIZE/8);
            game.manager.getComponentDataForEntity('MeshComponent', entityId).mesh = mesh;
            game.manager.getComponentDataForEntity('ObjectComponent', entityId).data = obj;  // so that you can collect it
            mesh.setEnabled(true);
            mesh.isVisible = true;
            soundComp = game.manager.getComponentDataForEntity('SoundComponent', entityId);
            if(soundComp.sound && obj.data.sfx && soundComp.sfx !== obj.data.sfx){
                  soundComp.sound.dispose();
            }
            game.manager.getComponentDataForEntity('SoundComponent', entityId).sfx = obj.data.sfx;
            if(obj.data.sfx && obj.data.sfx !== "none"){
                  game.manager.getComponentDataForEntity('SoundComponent', entityId).sound = new BABYLON.Sound("sfx_" + obj.id, obj.data.sfx, game.scene, null, {loop: false, autoplay: false});
            }
            mesh.id = obj.id;
            mesh.name = obj.id;
		}
	};

	return ObjectBuilder;

});

