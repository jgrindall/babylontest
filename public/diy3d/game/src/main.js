requirejs.config({
	"baseUrl": '/'
});

window.SIZE_I = 14;
window.SIZE_J = 18;
window.SIZE = 10;


require(["diy3d/game/src/Game", "diy3d/game/src/components/Components", "diy3d/game/src/components/Catalogue",

        "diy3d/game/src/tasks/EditWallsTask", "diy3d/game/src/tasks/EditTreesTask",

        "diy3d/game/src/tasks/EditWaterAndFireTask",

	"diy3d/game/src/tasks/EditBaddiesTask", "diy3d/game/src/tasks/AddControlsTask",

        "diy3d/game/src/tasks/EditGridTask", "diy3d/game/src/tasks/CacheTask", "diy3d/game/src/tasks/CleanCacheTask",

	"diy3d/game/src/tasks/EditLightsTask", "diy3d/game/src/tasks/EditGroundAndSkyTask",

	"diy3d/game/src/tasks/EditObjectsTask", "diy3d/game/src/tasks/EditPlayerTask", "diy3d/game/src/tasks/EditMusicTask",

"diy3d/game/src/processors/UpdateHUDProcessor",

"diy3d/game/src/processors/PlayerMovementProcessor", "diy3d/game/src/processors/TerrainCollisionProcessor",

"diy3d/game/src/processors/BaddieMovementProcessor", "diy3d/game/src/processors/UpdateHuntProcessor",

"diy3d/game/src/processors/BaddieCollisionProcessor", "diy3d/game/src/processors/ObjectCollisionProcessor"],

	function(Game, Components, Catalogue, EditWallsTask, EditTreesTask,

             EditWaterAndFireTask,

		EditBaddiesTask, AddControlsTask, EditGridTask, CacheTask, CleanCacheTask,

             EditLightsTask, EditGroundAndSkyTask,

		EditObjectsTask, EditPlayerTask, EditMusicTask, UpdateHUDProcessor,

	PlayerMovementProcessor, TerrainCollisionProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor) {

		"use strict";

		var rows = [];

		var makeRow = function(){
            var row = [];
            for(var i = 0; i < SIZE_J; i++){
                if(i <= 6){
                    row.push({"type": "wall", "name": "wall0", "data":{}});
                }
                else{
                    row.push({"type": "empty", "data":{}});
                }
            }
            return row;
        };
        for(var i = 0; i < SIZE_I; i++){
            rows.push(makeRow());
        }


        rows[6][9] = {"type": "wall", "name": "wall0", "data":{}};
        rows[8][9] = {"type": "wall", "name": "wall0", "data":{}};
        rows[6][11] = {"type": "wall", "name": "wall0", "data":{}};
        rows[8][11] = {"type": "wall", "name": "wall0", "data":{}};

		var json = {
			"textureList":{
                "wall":{
                    "wall0":"/images/diy3d/features/bricks.png",
                    "wall1":"/images/diy3d/features/crate.png"
                },
                "baddie":{
                    "baddie0":"/images/diy3d/features/baddie0.png",
                    "baddie1":"/images/diy3d/features/baddie1.png"
                },
                "object":{
                    "object0":"/images/diy3d/features/obj0.png",
                    "object1":"/images/diy3d/features/obj1.png",
                    "object2":"/images/diy3d/features/obj2.png"
                },
                "tree": {
                    "tree0": "/images/diy3d/features/tree0.png",
                    "tree1": "/images/diy3d/features/tree1.png"
                }
            },
            "data":{
                "data" : rows,
                "light":{
                    "type":"default"
                },
                "player":{
                    "position":[10, 8]
                },
                "ground": "/images/diy3d/features/grassfull.png",
                "sky":"/images/diy3d/features/skyfull.png"
            }
		}

            var game = new Game($("#gameCanvas")[0], $(".gamecontainer"), Components.ALL, Catalogue.ALL)
                .registerTask(CacheTask)
                .registerTask(EditLightsTask)
                .registerTask(EditGridTask)
                .registerTask(EditGroundAndSkyTask)
                .registerTask(EditWaterAndFireTask)
                .registerTask(EditWallsTask)
                .registerTask(EditTreesTask)
                .registerTask(EditPlayerTask)
                .registerTask(EditBaddiesTask)
                .registerTask(AddControlsTask)
                .registerTask(EditObjectsTask)
                .registerTask(EditMusicTask)
                .registerTask(CleanCacheTask)
                .registerProcessor(PlayerMovementProcessor)
                .registerProcessor(BaddieMovementProcessor)
                .registerProcessor(TerrainCollisionProcessor)
                .registerProcessor(UpdateHUDProcessor)
                .registerProcessor(BaddieCollisionProcessor)
                .registerProcessor(UpdateHuntProcessor)
                .registerProcessor(ObjectCollisionProcessor);
               game.load(json);
        }
);
