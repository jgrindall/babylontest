var baseURL = "http://" + window.location.host;


define(["diy3d/game/src/utils/GeomUtils", "diy3d/game/src/utils/ImageUtils"],

	function(GeomUtils, ImageUtils){

	"use strict";

	var EnvironmentBuilder = {
		addCeil :function(scene, meshCache, materialsCache){
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
			*/
		},
		addGround: function(scene, gridComponent, meshCache, materialsCache){
            var RADIUS = 12, RADIUS_2 = RADIUS/Math.sqrt(2), D_RADIUS = RADIUS - RADIUS_2 + 2, groundImg, lavaImg;
            groundImg = materialsCache.getImage("ground");
            lavaImg = materialsCache.getImage("lava");
            var waterQuads = gridComponent.greedy.water.quads;
            var fireQuads = gridComponent.greedy.fire.quads;
            var groundWidth = SIZE_J*SIZE;
            var groundHeight = SIZE_I*SIZE;
            var ground = BABYLON.MeshBuilder.CreatePlane("ground", {"height": groundHeight, "width":groundWidth}, scene);
            ground.material = new BABYLON.StandardMaterial("groundMat", scene);
            ground.position = new BABYLON.Vector3(groundWidth/2, 0, groundHeight/2);
            ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
            var c = document.createElement("canvas");
            c.width = groundImg.width;
            c.height = groundImg.height;
            var scaleX = groundImg.width / SIZE_J;
            var scaleY = groundImg.height / SIZE_I;
            c.getContext("2d").drawImage(groundImg, 0, 0);
            c.getContext("2d").fillStyle = "#4dc9ff";
            _.each(waterQuads, function(quad){
                GeomUtils.roundRect(c.getContext("2d"), scaleX*quad[1] - D_RADIUS, scaleY*quad[0] - D_RADIUS, scaleX*quad[2] + 2*D_RADIUS, scaleY*quad[3] + 2*D_RADIUS, RADIUS, true, false);
            });
            _.each(fireQuads, function(quad){
                c.getContext("2d").drawImage(lavaImg, scaleX*quad[1], scaleY*quad[0], scaleX*quad[2], scaleY*quad[3]);
            });
            ground.material.diffuseTexture = new BABYLON.Texture("data:b642", scene, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, c.toDataURL(), true);
		},
		addSky: function(scene, meshCache, materialsCache){
			var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(baseURL + "/images/diy3d/assets/skybox", scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skybox.infiniteDistance = true;
			skyboxMaterial.disableLighting = true;
			skybox.material = skyboxMaterial;
		},
		addWater: function(scene, quads, meshCache, materialsCache){
			var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
			_.each(quads, function(quad){
				var plane = meshCache.getWater(scene, [quad[2], quad[3]]);
				plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
				plane.position.y = 0.001;
				if(quad[3] < quad[2]){
					plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
				}
				plane.freezeWorldMatrix();
			});
		},
		addFire: function(scene, quads, meshCache, materialsCache){
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
			});
		}
	};

	return EnvironmentBuilder;

});
