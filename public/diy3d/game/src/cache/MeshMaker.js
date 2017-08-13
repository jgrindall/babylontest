define(["diy3d/game/src/consts/Consts"], function(Consts){

	"use strict";

	var MeshMaker = function(game, type){
        this.game = game;
	    this.type = type;
    };

	MeshMaker.prototype.make = function(key){
	    // meshes are made in slightly different shapes and sizes
	    var mesh;
	    if(this.type === "wall"){
            mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": Consts.BOX_SIZE, "width":Consts.BOX_SIZE}, this.game.scene);
        }
        else if(this.type === "object"){
            mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": Consts.BOX_SIZE*0.75, "width":Consts.BOX_SIZE*0.75}, this.game.scene);
            mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        }
        else if(this.type === "tree" || this.type === "baddie"){
            mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": Consts.BOX_SIZE*0.75, "width":Consts.BOX_SIZE*0.75}, this.game.scene);
            mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        }
        else if(this.type === "water" || this.type === "fire"){
            mesh = BABYLON.MeshBuilder.CreatePlane(key, {"height": Consts.BOX_SIZE, "width":Consts.BOX_SIZE}, this.game.scene);
        }
        return mesh;
    };

	return MeshMaker;

});
