
window.SIZE_I = 26;
window.SIZE_J = 26;
window.SIZE = 10;

require(["Game", "DATA", "tasks/BuildTerrainTask", "tasks/AddBaddiesTask", "tasks/AddControlsTask", "tasks/AddDoorsTask", "tasks/AddObjectsTask", "tasks/AddPlayerTask", "tasks/AddMusicTask"],

	function(Game, DATA, BuildTerrainTask, AddBaddiesTask, AddControlsTask, AddDoorsTask, AddObjectsTask, AddPlayerTask, AddMusicTask) {

		"use strict";

		window._DATA = DATA.data;
		window._LIGHTS = DATA.lights;
		window._EFFECTS = DATA.effects;
		window._TEXTURES = DATA.textures;

		window.engine = new BABYLON.Engine(document.querySelector("#renderCanvas"), false, null, false);

		var launch;

		launch = function(){
			var g = new Game(window.engine)
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
