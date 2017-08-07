define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts", "diy3d/game/src/utils/MeshUtils"],

	function(GridUtils, Consts, MeshUtils){

	"use strict";

	var SCALE = 12;

	var WallBuilder = {
        update:function(mesh, pos, dir, obj){
            var babylonPos;
            mesh.unfreezeWorldMatrix();
            babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
            if(dir === "s"){
                mesh.position.x = babylonPos.x;
                mesh.position.z = babylonPos.z - Consts.BOX_SIZE/2;
                mesh.rotation = new BABYLON.Vector3(0, 0, 0);
            }
            else if(dir === "n"){
                mesh.position.x = babylonPos.x;
                mesh.position.z = babylonPos.z + Consts.BOX_SIZE/2;
                mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            }
            else if(dir === "w"){
                mesh.position.x = babylonPos.x - Consts.BOX_SIZE/2;
                mesh.position.z = babylonPos.z;
                mesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
            }
            else if(dir === "e"){
                mesh.position.x = babylonPos.x + Consts.BOX_SIZE/2;
                mesh.position.z = babylonPos.z;
                mesh.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
            }
            mesh.position.y = SCALE*Consts.BOX_SIZE2;
            mesh.scaling.y = SCALE;
            mesh.material.diffuseTexture.vScale = SCALE;
            mesh.freezeWorldMatrix();
            mesh.id = obj.id;
            mesh.name = obj.id;
        }
	};

	return WallBuilder;

});
