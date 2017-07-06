
window.SIZE_I = 38;
window.SIZE_J = 44;
window.SIZE = 10;
window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);


require(["Game", "DATA"],

	function(Game, DATA) {

		"use strict";

		console.log("Game12", Game);

		window.SIZE_I = 38;
		window.SIZE_J = 44;
		window.SIZE = 10;
		window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);

		window._DATA = DATA.landscape;
		window._OBJECTS = DATA.objects;
		window._TEXTURES = DATA.textures;
		window._LIGHTS = DATA.lights;
		window._EFFECTS = DATA.effects;
		window.NUM_BADDIES = 4;
		window.engine = new BABYLON.Engine(document.querySelector("#renderCanvas"), false, null, false);
		new Game(engine);

	}
);
