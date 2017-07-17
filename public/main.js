
window.SIZE_I = 18;
window.SIZE_J = 18;
window.SIZE = 10;

require(["Game", "DATA", "tasks/BuildTerrainTask", "tasks/BuildTreesTask", "tasks/BuildEnvironmentTask",

	"tasks/AddBaddiesTask", "tasks/AddControlsTask", "tasks/AddDoorsTask",

	"tasks/AddObjectsTask", "tasks/AddPlayerTask", "tasks/AddMusicTask", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor",

"processors/PlayerMovementProcessor", "processors/TerrainCollisionProcessor",

"processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor", "processors/DoorCollisionProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor"],

	function(Game, DATA, BuildTerrainTask, BuildTreesTask, BuildEnvironmentTask,

		AddBaddiesTask, AddControlsTask, AddDoorsTask,

		AddObjectsTask, AddPlayerTask, AddMusicTask, CameraMatchPlayerProcessor, UpdateHUDProcessor,

	PlayerMovementProcessor, TerrainCollisionProcessor, BaddieMovementProcessor, UpdateHuntProcessor, DoorCollisionProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor) {

		"use strict";

		window._DATA = DATA.data;
		window._LIGHTS = DATA.lights;
		window._EFFECTS = DATA.effects;
		window._TEXTURES = DATA.textures;

		window.engine = new BABYLON.Engine(document.querySelector("#renderCanvas"), false, null, false);

		var launch;

		launch = function(){
			var g = new Game(window.engine)
			.registerTask(BuildEnvironmentTask)
			.registerTask(BuildTerrainTask)
			.registerTask(BuildTreesTask)
			.registerTask(AddPlayerTask)
			.registerTask(AddBaddiesTask)
			.registerTask(AddControlsTask)
			.registerTask(AddDoorsTask)
			.registerTask(AddObjectsTask)
			.registerTask(AddMusicTask)
			.registerProcessor(PlayerMovementProcessor)
			.registerProcessor(CameraMatchPlayerProcessor)
			.registerProcessor(BaddieMovementProcessor)
			.registerProcessor(BaddieCollisionProcessor)
			.registerProcessor(TerrainCollisionProcessor)
			.registerProcessor(ObjectCollisionProcessor)
			.registerProcessor(UpdateHuntProcessor)
			.registerProcessor(UpdateHUDProcessor)
			.registerProcessor(DoorCollisionProcessor)
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

