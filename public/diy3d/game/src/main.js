requirejs.config({
	"baseUrl": '/'
});

window.SIZE_I = 18;
window.SIZE_J = 18;
window.SIZE = 10;

require(["diy3d/game/src/Game", "diy3d/game/src/DATA", "diy3d/game/src/components/Components", "diy3d/game/src/tasks/BuildTerrainTask",

	"diy3d/game/src/tasks/BuildTreesTask", "diy3d/game/src/tasks/BuildEnvironmentTask",

	"diy3d/game/src/tasks/AddBaddiesTask", "diy3d/game/src/tasks/AddControlsTask", "diy3d/game/src/tasks/BuildGridTask",

	"diy3d/game/src/tasks/AddDoorsTask", "diy3d/game/src/tasks/AddLightsTask",

	"diy3d/game/src/tasks/AddObjectsTask", "diy3d/game/src/tasks/AddPlayerTask", "diy3d/game/src/tasks/AddMusicTask", "diy3d/game/src/processors/CameraMatchPlayerProcessor",

"diy3d/game/src/processors/UpdateHUDProcessor", "diy3d/game/src/Listener",

"diy3d/game/src/processors/PlayerMovementProcessor", "diy3d/game/src/processors/TerrainCollisionProcessor",

"diy3d/game/src/processors/BaddieMovementProcessor", "diy3d/game/src/processors/UpdateHuntProcessor", "diy3d/game/src/processors/DoorCollisionProcessor",

"diy3d/game/src/processors/BaddieCollisionProcessor", "diy3d/game/src/processors/ObjectCollisionProcessor"],

	function(Game, DATA, Components, BuildTerrainTask,

		BuildTreesTask, BuildEnvironmentTask,

		AddBaddiesTask, AddControlsTask, BuildGridTask,

		AddDoorsTask, AddLightsTask,

		AddObjectsTask, AddPlayerTask, AddMusicTask, CameraMatchPlayerProcessor,

		UpdateHUDProcessor, Listener,

	PlayerMovementProcessor, TerrainCollisionProcessor,

	BaddieMovementProcessor, UpdateHuntProcessor, DoorCollisionProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor) {

		"use strict";

		var canvas, engine;

		var launch = function(){

			canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 768;
            $(canvas).attr("id", "gameCanvas");
            var $container = $("body");
		    $container
                .append($("<div/>").attr("id", "zone_hud"))
                .append($("<div/>").attr("id", "zone_health"))
                .append($("<div/>").attr("id", "zone_possessions"))
                .append($("<div/>").attr("id", "zone_joystick"));   // joystick last since it comes on top
            $("body").append(canvas);
            engine = new BABYLON.Engine(canvas, false, null, false);
			var g = new Game(DATA, canvas, engine, $container)
			.registerComponents(Components.ALL)
			.registerTask(AddLightsTask)
			.registerTask(BuildGridTask)
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
			.registerProcessor(BaddieMovementProcessor)
			.registerProcessor(ObjectCollisionProcessor)
			.registerProcessor(BaddieCollisionProcessor)
			.registerProcessor(UpdateHUDProcessor);
			g.setListener(new Listener(g))
			.start()
			.on("loaded", function(){
				alert("loaded");
			});
		};

		launch();
	}
);

