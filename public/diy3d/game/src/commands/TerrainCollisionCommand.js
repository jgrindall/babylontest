define(["diy3d/game/src/commands/ReduceHealthCommand", "diy3d/game/src/commands/ShowDamageCommand", "diy3d/game/src/commands/PlaySoundCommand", "diy3d/game/src/commands/BecomeInvulnerableCommand", "diy3d/game/src/commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, ShowDamageCommand, PlaySoundCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var TerrainCollisionCommand = function(game){
		this.game = game;
	};

	TerrainCollisionCommand.prototype.exec = function(){
		new ShowDamageCommand(this.game).exec();
		new ReduceHealthCommand(this.game, 2).exec();
		new BecomeInvulnerableCommand(this.game).exec();
		new PlaySoundCommand(this.game).exec();
		this.game.addToQueue(new BecomeVulnerableCommand(this.game), 5);
	};

	return TerrainCollisionCommand;

});
