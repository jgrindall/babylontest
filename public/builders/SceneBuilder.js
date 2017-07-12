define(["builders/LightBuilder", "builders/EffectBuilder"],

	function(LightBuilder, EffectBuilder){

	"use strict";

	var SceneBuilder = {

	};

	SceneBuilder.makeScene = function(engine){
		var scene = new BABYLON.Scene(engine);
		scene.collisionsEnabled = true;
		LightBuilder.build(scene, window._LIGHTS);
		EffectBuilder.build(scene, window._EFFECTS);
		return scene;
	};

	SceneBuilder.makeCamera = function(scene){
		return new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), scene);
	};

	return SceneBuilder;

});


/*SceneBuilder.addWater2 = function(scene, pos){
		var y = SIZE/2, container, billboard, babylonPos;
		babylonPos = GridUtils.ijToBabylon(pos[0], pos[1]);
		container = MeshCache.getBillboardBoxFromCache();
		container.position = new BABYLON.Vector3(babylonPos.x + SIZE/2, y, babylonPos.z - SIZE/2);

		var particleSystem = new BABYLON.ParticleSystem("particles", 50, scene);
		particleSystem.particleTexture = new BABYLON.Texture("assets/red.jpg", scene);
		particleSystem.emitter = container;

    	particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    	particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

	    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
	    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
	    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

	    particleSystem.minSize = 0.25;
	    particleSystem.maxSize = 1;

	    particleSystem.minLifeTime = 0.3;
	    particleSystem.maxLifeTime = 1.5;

	    particleSystem.emitRate = 500;

	    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

	    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

	    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
	    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

	    particleSystem.minAngularSpeed = 0;
	    particleSystem.maxAngularSpeed = Math.PI;

	    particleSystem.minEmitPower = 1;
	    particleSystem.maxEmitPower = 3;
	    particleSystem.updateSpeed = 0.005;

	    particleSystem.start();


		return container;
	};
	*/