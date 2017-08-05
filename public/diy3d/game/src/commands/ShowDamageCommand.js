var baseURL = "http://" + window.location.host;

define([], function(){
	"use strict";

	//TODO

	var ShowDamageCommand = function(game){
		this.game = game;
	};

	ShowDamageCommand.prototype.exec = function(){
		var camera = this.game.camera;
		var postProcess = this.game.damagePostProcess;
		var maxN = 70;
		var N = maxN;
		var DEGREE = 0.5;
		if(camera._postProcesses.length === 0){
            camera.attachPostProcess(postProcess);
            postProcess.onApply = function (effect) {
                effect.setFloat("degree", DEGREE);
            };
            postProcess.onBeforeRender = function (effect) {
                var d = DEGREE * N/maxN;
                effect.setFloat("degree", d);
                N--;
                if(N === 0){
                    camera.detachPostProcess(postProcess);
                }
            };
        }
	};

	return ShowDamageCommand;

});
