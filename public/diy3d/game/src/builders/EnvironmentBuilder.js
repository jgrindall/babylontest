var baseURL = "http://" + window.location.host;

define(["diy3d/game/src/utils/GeomUtils", "diy3d/game/src/utils/ImageUtils", "diy3d/game/src/utils/MeshUtils", "diy3d/game/src/consts/Consts"],

	function(GeomUtils, ImageUtils, MeshUtils, Consts){

	"use strict";

	var GROUND_ID = "_ground";
    var SKY_ID = "_sky";

	var _addGround = function(game){
        var ground, groundWidth, groundHeight;
        groundWidth = Consts.SIZE_J * Consts.BOX_SIZE;
        groundHeight = Consts.SIZE_I * Consts.BOX_SIZE;
        ground = BABYLON.MeshBuilder.CreatePlane(GROUND_ID, {"height": groundHeight, "width": groundWidth}, game.scene);
        ground.material = new BABYLON.StandardMaterial(GROUND_ID, game.scene);
        ground.position = new BABYLON.Vector3(groundWidth/2, 0, groundHeight/2);
        ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        ground.freezeWorldMatrix();
        return ground;
        //or
        //ground = BABYLON.Mesh.CreateGround(GROUND_ID, groundHeight, groundWidth, 100, game.scene);
        //ground.optimize(100);
        //ground.rotation 
    };

	var _addSky = function(game){
        var skybox = BABYLON.MeshBuilder.CreateBox(SKY_ID, {size:Consts.SKY_SIZE}, game.scene);
        skybox.material = new BABYLON.StandardMaterial(SKY_ID, game.scene);
        skybox.material.backFaceCulling = false;
        skybox.infiniteDistance = true;
        skybox.material.disableLighting = true;
        skybox.setEnabled(false);
        skybox.isVisble = false;
        return skybox;
    };

	var EnvironmentBuilder = {
        updateGround:function(game){
            var ground = game.scene.getMeshByID(GROUND_ID) || _addGround(game);
            MeshUtils.destroyTextures(ground.material);
            ground.material.diffuseTexture = new BABYLON.Texture("/images/diy3d/assets/groundMat.jpg", game.scene);
            console.log(ground.material.diffuseTexture);
        },
		updateSky: function(game){
            //todo - do not do this if it has not changed
            var skybox = game.scene.getMeshByID(SKY_ID);
            if(game.json.data.sky) {
                skybox = skybox || _addSky(game);
                MeshUtils.destroyTextures(skybox.material);
                skybox.material.reflectionTexture = new BABYLON.CubeTexture(SKY_ID, game.scene, null, false, game.json.data.sky);
                skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skybox.setEnabled(true);
                skybox.isVisble = true;
            }
            else if(skybox){
                skybox.setEnabled(false);
                skybox.isVisble = false;
            }
		},
        addParticles:function(){
		    /*
		    * particleSystem = new BABYLON.ParticleSystem("particles", 256, scene);
             particleSystem.particleTexture = new BABYLON.Texture("/images/diy3d/assets/fire.png", scene);
             particleSystem.emitter = plane;
             particleSystem.color1 = new BABYLON.Color4(1.1, 0.2, 0.2, 1.0);
             particleSystem.color2 = new BABYLON.Color4(1.1, 0.1, 0.1, 1.0);
             particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.0, 1.0);
             particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
             particleSystem.maxEmitBox = new BABYLON.Vector3(quad[2]*SIZE/2, 0, quad[3]*SIZE/2);
             particleSystem.minSize = 0.1;
             particleSystem.maxSize = 0.6;
             particleSystem.minLifeTime = 0.25;
             particleSystem.maxLifeTime = 0.75;
             particleSystem.emitRate = 1000;
             particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
             particleSystem.gravity = new BABYLON.Vector3(0, -10, 0);
             particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
             particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
             particleSystem.minEmitPower = 1;
             particleSystem.maxEmitPower = 3;
             particleSystem.updateSpeed = 0.005;
             particleSystem.start();
             */
        },
		addFire: function(scene, quads, meshCache, materialsCache){
            return;
            /*
			var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
			_.each(quads, function(quad){
				var plane = meshCache.getFire(scene, [quad[2], quad[3]]);
				if(quad[3] < quad[2]){
					plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
				}
				plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
				plane.position.y = 0.001;
				plane.freezeWorldMatrix();
				//EnvironmentBuilder.addParticles(plane, scene);
			});
			*/
		}
	};

	return EnvironmentBuilder;

});



        /*
        *
        * addCeil :function(scene, meshCache, materialsCache){
         return;
         /*
         var img = new Image();
         var groundWidth = SIZE_J*SIZE;
         var groundHeight = SIZE_I*SIZE;
         var ground = BABYLON.MeshBuilder.CreatePlane("ground", {height: groundHeight, width:groundWidth, sideOrientation:BABYLON.Mesh.BACKSIDE}, scene);
         ground.material = new BABYLON.StandardMaterial("groundMat", scene);
         ground.position = new BABYLON.Vector3(groundWidth/2, SIZE, groundHeight/2);
         ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
         img.onload = function(){
         var c = document.createElement("canvas");
         c.width = img.width;
         c.height = img.height;
         var scaleX = img.width / SIZE_J;
         var scaleY = img.height / SIZE_I;
         c.getContext("2d").drawImage(img, 0, 0);
         var base64 = c.toDataURL();
         ground.material.diffuseTexture = new BABYLON.Texture("data:b6423", scene, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, base64, true);
         };
         img.src = "assets/roof.jpg";
        * */