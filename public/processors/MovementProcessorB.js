define([], function(){

	var MovementProcessorB = function(manager){
		this.manager = manager;
		this.init();
	};

	MovementProcessorB.prototype.init = function(){
		//
	};

	MovementProcessorB.prototype.update = function () {
		var speedData, sf = 0.1, manager = this.manager;
		vEntities = manager.getComponentsData('VComponent');
		for (var entity in vEntities) {
			var dx, dz, meshComp, speedComp;
			meshComp = manager.getComponentDataForEntity('MeshComponent', entity);
			vComp = manager.getComponentDataForEntity('VComponent', entity);
			dx = vComp.vel.x * sf;
			dz = vComp.vel.y * sf;
			meshComp.mesh[0].moveWithCollisions(new BABYLON.Vector3(dx, 0, dz));
			meshComp.mesh[1].position = meshComp.mesh[0].position;
		}
	};

	return MovementProcessorB;

});
