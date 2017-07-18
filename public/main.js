
window.SIZE_I = 18;
window.SIZE_J = 18;
window.SIZE = 10;

require(["Game", "DATA", "components/Components", "tasks/BuildTerrainTask", "tasks/BuildTreesTask", "tasks/BuildEnvironmentTask",

	"tasks/AddBaddiesTask", "tasks/AddControlsTask", "tasks/BuildGridTask",

	"tasks/AddCameraTask", "tasks/AddDoorsTask", "tasks/AddLightsTask",

	"tasks/AddObjectsTask", "tasks/AddPlayerTask", "tasks/AddMusicTask", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor", "Listener",

"processors/PlayerMovementProcessor", "processors/TerrainCollisionProcessor",

"processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor", "processors/DoorCollisionProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor"],

	function(Game, DATA, Components, BuildTerrainTask, BuildTreesTask, BuildEnvironmentTask,

		AddBaddiesTask, AddControlsTask, BuildGridTask, AddCameraTask, AddDoorsTask, AddLightsTask,

		AddObjectsTask, AddPlayerTask, AddMusicTask, CameraMatchPlayerProcessor, UpdateHUDProcessor, Listener,

	PlayerMovementProcessor, TerrainCollisionProcessor, BaddieMovementProcessor, UpdateHuntProcessor, DoorCollisionProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor) {

		"use strict";

		var launch = function(){
			var g = new Game(DATA, document.querySelector("#renderCanvas"))
			.registerComponents(Components.ALL)
			.registerTask(AddLightsTask)
			.registerTask(BuildGridTask)
			.registerTask(AddCameraTask)
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
			.registerProcessor(DoorCollisionProcessor);

			g.setListener(new Listener(g))
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

