
window.SIZE_I = 16;
window.SIZE_J = 16;
window.SIZE = 10;
window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);
window._NUM_BADDIES = 4;

require(["Game", "DATA"],

	function(Game, DATA) {

		"use strict";

		window._DATA = DATA.landscape;
		window._OBJECTS = DATA.objects;
		window._BADDIES = DATA.baddies;
		window._TEXTURES = DATA.textures;
		window._LIGHTS = DATA.lights;
		window._EFFECTS = DATA.effects;
		window.engine = new BABYLON.Engine(document.querySelector("#renderCanvas"), false, null, false);

		var launch;

		launch = function(){
			var g = new Game(engine);
			g.on("loaded", function(){
				//
			});
		};

		launch();
	}
);
