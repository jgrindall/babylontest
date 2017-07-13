define(["utils/GeomUtils", "utils/ImageUtils"],

	function(GeomUtils, ImageUtils){

	"use strict";

	var EnvironmentBuilder = {
		addCeil :function(scene){
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
		addGround: function(scene, gridComponent){
			ImageUtils
			.loadURLs(["assets/groundMat.jpg", "assets/Lava-0.png"])
			.then(function(imgs){
				var waterQuads = gridComponent.greedy.water.quads;
				var fireQuads = gridComponent.greedy.fire.quads;
				var groundWidth = SIZE_J*SIZE;
				var groundHeight = SIZE_I*SIZE;
				var ground = BABYLON.MeshBuilder.CreatePlane("ground", {"height": groundHeight, "width":groundWidth}, scene);
				ground.material = new BABYLON.StandardMaterial("groundMat", scene);
				ground.position = new BABYLON.Vector3(groundWidth/2, 0, groundHeight/2);
				ground.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
				var c = document.createElement("canvas");
				c.width = imgs[0].width;
				c.height = imgs[0].height;
				var scaleX = imgs[0].width / SIZE_J;
				var scaleY = imgs[0].height / SIZE_I;
				var RADIUS = 12, RADIUS_2 = 12/Math.sqrt(2), D_RADIUS = RADIUS - RADIUS_2 + 2;
				c.getContext("2d").drawImage(imgs[0], 0, 0);
				c.getContext("2d").fillStyle = "#4dc9ff";
				_.each(waterQuads, function(quad){
					GeomUtils.roundRect(c.getContext("2d"), scaleX*quad[1] - D_RADIUS, scaleY*quad[0] - D_RADIUS, scaleX*quad[2] + 2*D_RADIUS, scaleY*quad[3] + 2*D_RADIUS, RADIUS, true, false);
				});
				c.getContext("2d").fillStyle = "#FFA500";
				_.each(fireQuads, function(quad){
					c.getContext("2d").drawImage(imgs[1], scaleX*quad[1], scaleY*quad[0], scaleX*quad[2], scaleY*quad[3]);
					//c.getContext("2d").fillRect(scaleX*quad[1], scaleY*quad[0], scaleX*quad[2], scaleY*quad[3]);
				});
				var base64 = c.toDataURL();
				ground.material.diffuseTexture = new BABYLON.Texture("data:b642", scene, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, base64, true);
			});
		},
		addSky: function(scene){
			var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skybox.material = skyboxMaterial;
		},
		addWater: function(scene, quads, meshCache){
			var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
			var music = new BABYLON.Sound("Violons", "assets/water.wav", scene, function () {}, { loop: true, autoplay: true,  maxDistance: 12 });
			_.each(quads, function(quad){
				var size, plane;
				size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
				plane = meshCache.getWater(scene, size);
				plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
				plane.position.y = 0.001;
				if(quad[3] < quad[2]){
					plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
				}
				plane.freezeWorldMatrix();
				music.attachToMesh(plane);
			});
		},
		addFire: function(scene, quads, meshCache){
			var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
			var music = new BABYLON.Sound("Violons", "assets/fire.mp3", scene, function () {}, { loop: true, autoplay: true,  maxDistance: 12 });
			_.each(quads, function(quad){
				var size, plane;
				size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
				plane = meshCache.getFire(scene, size);
				if(quad[3] < quad[2]){
					plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
				}
				plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
				plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
				plane.position.y = 0.001;
				plane.freezeWorldMatrix();
				music.attachToMesh(plane);
				//https://doc.babylonjs.com/overviews/playing_sounds_and_music#creating-a-spatial-3d-sound
			});
		}
	};

	return EnvironmentBuilder;

});
