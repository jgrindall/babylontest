define(["builders/TreeBuilder"], function(TreeBuilder){

	"use strict";

	var BuildTreesTask = function(game){
		var manager = game.manager, scene = game.scene, meshCache = game.meshCache;
		var trees = game.grid.trees;
		_.each(trees, function(obj){
			var id = manager.createEntity(['MeshComponent']);
			manager.getComponentDataForEntity('MeshComponent', id).mesh = TreeBuilder.addTree(obj.data.position, scene, obj.data.texture, meshCache);
		});
	};

	return AddObjectsTask;

});