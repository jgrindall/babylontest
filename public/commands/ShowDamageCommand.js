define([], function(){
	"use strict";

	var ShowDamageCommand = function(game){
		this.game = game;
	};

	ShowDamageCommand.prototype.exec = function(){
		var camera = this.game.manager.getComponentDataForEntity('CameraComponent', this.game.cameraId).camera;
		var postProcess = new BABYLON.PostProcess("Down sample", "/downsample", ["degree"], null, 1, camera);
		var N = 0;
		var maxN = 200;
		postProcess.onApply = function (effect) {
			effect.setFloat("degree", 0.6);
		};
		postProcess.onBeforeRender = function (effect) {
			var d = 1 - N/maxN;
			effect.setFloat("degree", d);
			N++;
			if(N === maxN){
				camera.detachPostProcess(postProcess);
			}
		};
	};

	return ShowDamageCommand;

});
