define([], function(){
	"use strict";

	var ShowDamageCommand = function(game){
		this.game = game;
	};

	ShowDamageCommand.prototype.exec = function(){
		var camera = this.game.camera;
		var postProcess = new BABYLON.PostProcess("Down sample", "/downsample", ["degree"], null, 1, camera);
		var maxN = 200;
		var N = maxN;
		var DEGREE = 5;
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
	};

	return ShowDamageCommand;

});
