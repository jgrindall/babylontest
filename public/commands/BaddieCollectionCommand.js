define(["commands/ReduceHealthCommand", "commands/ShowDamageCommand", "commands/PlaySoundCommand", "commands/BecomeInvulnerableCommand", "commands/BecomeVulnerableCommand"],

	function(ReduceHealthCommand, ShowDamageCommand, PlaySoundCommand, BecomeInvulnerableCommand, BecomeVulnerableCommand){
	"use strict";

	var BaddieCollectionCommand = function(game){
		this.game = game;
	};

	BaddieCollectionCommand.prototype.exec = function(){
		new ShowDamageCommand(this.game).exec();
		new ReduceHealthCommand(this.game, 10).exec();
		new BecomeInvulnerableCommand(this.game).exec();
		new PlaySoundCommand(this.game).exec();
		this.game.addToQueue(new BecomeVulnerableCommand(this.game), 5);
	};

	return BaddieCollectionCommand;

});
