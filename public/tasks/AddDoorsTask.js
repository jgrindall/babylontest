define(["DoorBuilder"], function(DoorBuilder){

	var AddDoorsTask = function(game){
		return;
		/*
		game.doorIds = [];
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var grid = game.grid;
		_.each(window._DOORS, function(obj){
			var id = manager.createEntity(['DoorComponent', 'MeshComponent']);
			DoorBuilder.addDoor(obj.data.position, scene, meshCache, manager, id, obj);
			game.doorIds.push(id);
		});
		*/
	};

	return AddDoorsTask;

});