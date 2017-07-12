define(["builders/ObjectBuilder"], function(ObjectBuilder){

	"use strict";

	var AddObjectsTask = function(game){
		game.objectIds = [];
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var objects = game.grid.objects;
		_.each(objects, function(obj){
			var id = manager.createEntity(['MeshComponent', 'ObjectComponent']);
			manager.getComponentDataForEntity('MeshComponent', id).mesh = ObjectBuilder.addObject(obj.data.position, scene, obj.data.texture, meshCache);
			manager.getComponentDataForEntity('ObjectComponent', id).data = obj;
			game.objectIds.push(id);
		});
	};

	return AddObjectsTask;

});