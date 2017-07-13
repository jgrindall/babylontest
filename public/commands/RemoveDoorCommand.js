define([],

	function(){
	"use strict";

	var RemoveDoorCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	RemoveDoorCommand.prototype.exec = function(){
		var mesh = this.game.manager.getComponentDataForEntity('MeshComponent', this.id).mesh;
	    mesh.dispose();
		this.game.doorIds.splice(this.game.doorIds.indexOf(this.id), 1);
	};

	return RemoveDoorCommand;

});
