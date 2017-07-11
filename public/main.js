
window.SIZE_I = 16;
window.SIZE_J = 16;
window.SIZE = 10;
window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);
window._NUM_BADDIES = 4;

require(["Game", "DATA", "tasks/BuildTerrainTask", "tasks/AddBaddiesTask", "tasks/AddControlsTask", "tasks/AddDoorsTask", "tasks/AddObjectsTask", "tasks/AddPlayerTask", "tasks/AddMusicTask"],

	function(Game, DATA, BuildTerrainTask, AddBaddiesTask, AddControlsTask, AddDoorsTask, AddObjectsTask, AddPlayerTask, AddMusicTask) {

		"use strict";

		window._DATA = DATA.landscape;
		window._OBJECTS = DATA.objects;
		window._BADDIES = DATA.baddies;
		window._TEXTURES = DATA.textures;
		window._LIGHTS = DATA.lights;
		window._EFFECTS = DATA.effects;
		window._DOORS = DATA.doors;
		window.engine = new BABYLON.Engine(document.querySelector("#renderCanvas"), false, null, false);

		var launch;

		launch = function(){
			var g = new Game(engine)
			.registerTask(BuildTerrainTask)
			.registerTask(AddPlayerTask)
			.registerTask(AddBaddiesTask)
			.registerTask(AddControlsTask)
			.registerTask(AddDoorsTask)
			.registerTask(AddObjectsTask)
			.registerTask(AddMusicTask)
			.start()
			.on("loaded", function(){
				//g.destroy();
				setTimeout(function(){
					//g.pause();
				}, 5000);
				setTimeout(function(){
					//g.unpause();
				}, 10000);
			});
		};

		launch();
	}
);
