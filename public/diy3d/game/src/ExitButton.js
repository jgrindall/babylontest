define([], function(){
	"use strict";

	var ExitButton = function(selector, game){
	    this.game = game;
		this.button = $("<button/>")
            .addClass("game-exit")
            .hide();
        $(selector).append(this.button);
        this.button
            .on("click", this.onClick.bind(this))
            .on("touchstart", this.onClick.bind(this));
	};

    ExitButton.prototype.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        this.game.trigger("exit");
        return false;
    };

    ExitButton.prototype.show = function(){
        this.button.show();
    };

    ExitButton.prototype.destroy = function(){
        this.game = null;
        this.button
            .off()
            .remove();
	};

	return ExitButton;

});
