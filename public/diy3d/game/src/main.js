requirejs.config({
	"baseUrl": '/'
});

window.SIZE_I = 18;
window.SIZE_J = 18;
window.SIZE = 10;

require(["diy3d/game/src/Game", "diy3d/game/src/DATA", "diy3d/game/src/components/Components", "diy3d/game/src/tasks/BuildTerrainTask", "diy3d/game/src/tasks/BuildTreesTask", "diy3d/game/src/tasks/BuildEnvironmentTask",

	"diy3d/game/src/tasks/AddBaddiesTask", "diy3d/game/src/tasks/AddControlsTask", "diy3d/game/src/tasks/BuildGridTask",

	"diy3d/game/src/tasks/AddCameraTask", "diy3d/game/src/tasks/AddDoorsTask", "diy3d/game/src/tasks/AddLightsTask",

	"diy3d/game/src/tasks/AddObjectsTask", "diy3d/game/src/tasks/AddPlayerTask", "diy3d/game/src/tasks/AddMusicTask", "diy3d/game/src/processors/CameraMatchPlayerProcessor",

"diy3d/game/src/processors/UpdateHUDProcessor", "diy3d/game/src/Listener",

"diy3d/game/src/processors/PlayerMovementProcessor", "diy3d/game/src/processors/TerrainCollisionProcessor",

"diy3d/game/src/processors/BaddieMovementProcessor", "diy3d/game/src/processors/UpdateHuntProcessor", "diy3d/game/src/processors/DoorCollisionProcessor",

"diy3d/game/src/processors/BaddieCollisionProcessor", "diy3d/game/src/processors/ObjectCollisionProcessor"],

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

