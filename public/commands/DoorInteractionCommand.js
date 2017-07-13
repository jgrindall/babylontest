define(["commands/RemoveDoorCommand"],

	function(RemoveDoorCommand){
	"use strict";

	var DoorInteractionCommand = function(game, id){
		this.game = game;
		this.id = id;
	};

	DoorInteractionCommand.prototype.exec = function(){
		var game = this.game, id = this.id;
		game.pause();
		$("body").append("<div class='box' style='position:absolute;left:50%;top:50%;width:300px;height:200px;background:white;'></div>");
		$(".box").click(function(){
			$(".box").remove();
			game.unpause();
		});
		setTimeout(function(){
			new RemoveDoorCommand(game, id).exec();
		}, 3000);
	};

	return DoorInteractionCommand;

});
