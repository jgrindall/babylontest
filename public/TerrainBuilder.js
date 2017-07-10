define(["GridUtils", "MeshCache", "GreedyMeshAlgo", "Materials", "Textures", "GeomUtils", "ImageUtils", "LightBuilder", "EffectBuilder"],

	function(GridUtils, MeshCache, GreedyMeshAlgo, Materials, Textures, GeomUtils, ImageUtils, LightBuilder, EffectBuilder){

	"use strict";

	var _getWallAt = function(start, dir, key, len, meshCache){
		var plane = meshCache.getPlaneFromCache(len, key);
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE}, y = SIZE/2;
		if(dir === "s"){
			plane.position.x = TOP_LEFT.x + (start[1] + len/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (start[0] + 1)*SIZE;
			plane.position.y = y;
		}
		else if(dir === "n"){
			plane.position.x = TOP_LEFT.x + (start[1] + len/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (start[0])*SIZE;
			plane.position.y = y;
			plane.rotation = new BABYLON.Vector3(0, Math.PI, 0);
		}
		else if(dir === "w"){
			plane.position.x = TOP_LEFT.x + (start[1])*SIZE;
			plane.position.z = TOP_LEFT.z - (start[0] + len/2)*SIZE;
			plane.position.y = y;
			plane.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
		}
		else if(dir === "e"){
			plane.position.x = TOP_LEFT.x + (start[1] + 1)*SIZE;
			plane.position.z = TOP_LEFT.z - (start[0] + len/2)*SIZE;
			plane.position.y = y;
			plane.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
		}
		plane.freezeWorldMatrix();
		return plane;
	};

	var _addWalls = function(a, meshCache){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, walls = [];
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				_.each(["n", "s", "w", "e"], function(dir){
					var wallData = a[_i][_j].data.walls;
					if(wallData[dir] >= 1){
						walls.push(_getWallAt([_i, _j], dir, a[_i][_j].data.texture, wallData[dir], meshCache));
					}
				});
			}
		}
		return walls;
	};

	var _addBoxes = function(quads, meshCache){
		var y = SIZE/2, TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, box, x, z;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			box = meshCache.getBoxFromCache(size);
			x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			if(quad[2] < quad[3]){
				box.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			box.isVisible = false;
			box.position.x = x;
			box.position.z = z;
			box.position.y = y;
			box.freezeWorldMatrix();
		});
	};

	var _addWater = function(scene, quads, meshCache){
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		var music = new BABYLON.Sound("Violons", "assets/water.wav", scene, function () {}, { loop: true, autoplay: true,  maxDistance: 20 });
		_.each(quads, function(quad){
			var size, plane;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			plane = meshCache.getWaterFromCache(size);
			plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			plane.position.y = 0.001;
			if(quad[3] < quad[2]){
				plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
			}
			plane.freezeWorldMatrix();
			console.log(plane.getBoundingInfo());
			console.log(plane.getBoundingInfo().boundingSphere.centerWorld);
			music.attachToMesh(plane);
		});
	};

	var _addFire = function(quads, meshCache){
		var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, plane;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			plane = meshCache.getFireFromCache(size);
			if(quad[3] < quad[2]){
				plane.rotate(new BABYLON.Vector3(0, 0, 1), Math.PI/2, BABYLON.Space.Local);
			}
			plane.position.x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			plane.position.z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			plane.position.y = 0.001;
			plane.freezeWorldMatrix();
		});
	};

	var _addSky = function(scene){
		var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skybox.material = skyboxMaterial;
	};

	var TerrainBuilder = {
		addFromData: function(scene, gridComponent, meshCache){
			_addBoxes(gridComponent.greedy.quads, meshCache);
			_addWalls(gridComponent.grid, meshCache);
			_addWater(scene, gridComponent.greedyWater.quads, meshCache);
			_addFire(gridComponent.greedyFire.quads, meshCache);
		},
		addCeil :function(scene){
			return;
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
		},
		addGround: function(scene, gridComponent){
			ImageUtils
			.loadURLs(["assets/groundMat.jpg", "assets/Lava-0.png"])
			.then(function(imgs){
				var waterQuads = gridComponent.greedyWater.quads;
				var fireQuads = gridComponent.greedyFire.quads;
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
					var RADIUS = 4;
					c.getContext("2d").drawImage(imgs[0], 0, 0);
					c.getContext("2d").fillStyle = "#4dc9ff";
					_.each(waterQuads, function(quad){
						GeomUtils.roundRect(c.getContext("2d"), scaleX*quad[1] - RADIUS, scaleY*quad[0] - RADIUS, scaleX*quad[2] + 2*RADIUS, scaleY*quad[3] + 2*RADIUS, RADIUS, true, false);
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
		}
	};

	return TerrainBuilder;

});

