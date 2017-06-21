define([], function(){

	var CollisionProcessor = function(manager, playerId, baddieIds){
		this.manager = manager;
		this.baddieIds = baddieIds;
		this.playerId = playerId;
		this.init();
	};

	CollisionProcessor.prototype.init = function(){
		console.log("init", this.manager);
	};

	CollisionProcessor.prototype.update = function () {
		var manager = this.manager;
		var playerMesh = manager.getComponentDataForEntity('MeshComponent', this.playerId).mesh;
		_.each(this.baddieIds, function(id){
			var mesh0 = manager.getComponentDataForEntity('MeshComponent', id).mesh[0];
			if (mesh0 && playerMesh && mesh0.intersectsMesh(playerMesh, false)) {
				console.log("HIT");
			}
		})
		//if(player && container && player.intersectsMesh(container, false)){
			//console.log("HIT CHAR");
		//}
	};

	return CollisionProcessor;

});
