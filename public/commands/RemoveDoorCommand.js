define([],

	function(){
	"use strict";

	var RemoveDoorCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	RemoveDoorCommand.prototype.exec = function(){
		var doorMesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.id).mesh;
	    doorMesh.dispose();
		this.game.doorIds.splice(this.game.doorIds.indexOf(this.id), 1);
		var doorMeshPos = doorMesh.position;
		var meshes = this.game.scene.getMeshesByTags("box");
		var meshToRemove = _.find(meshes, function(mesh){
			var box = mesh.getBoundingInfo().boundingBox;
			var vec = box.vectorsWorld;
			var x = Math.min(vec[0].x, vec[2].x);
			var z = Math.min(vec[0].z, vec[4].z);
			var dx = Math.abs(vec[2].x - vec[0].x);
			var dz = Math.abs(vec[4].z - vec[0].z);
			return (doorMeshPos.x > x && doorMeshPos.x < x + dx && doorMeshPos.z > z && doorMeshPos.z < z + dz);
		});
		if(meshToRemove){
			meshToRemove.dispose();
		}
		console.log(this.game.grid.greedy.solid);
	};

	return RemoveDoorCommand;

});
