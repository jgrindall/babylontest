define(["diy3d/game/src/builders/GridBuilder", "diy3d/game/src/utils/GridUtils"],

	function(GridBuilder, GridUtils){
	"use strict";

	var RemoveDoorCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	RemoveDoorCommand.prototype.exec = function(){
		var doorMesh, doorMeshPos, meshes, meshToRemove, meshToRemovePos, ij;
		doorMesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.id).mesh;
	    doorMeshPos = doorMesh.position;
	    doorMesh.dispose();
		this.game.doorIds.splice(this.game.doorIds.indexOf(this.id), 1);
		ij = GridUtils.babylonToIJ(doorMeshPos);
		console.log("remove ", ij.i, ij.j);
		this.game.grid.grid[ij.i][ij.j] = {
			"type":"empty",
			"data":{
				//
			}
		};
		GridBuilder.update(this.game.grid);
	};

	return RemoveDoorCommand;

});
