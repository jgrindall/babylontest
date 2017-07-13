define(["utils/GeomUtils", "utils/ImageUtils"],

	function(GeomUtils, ImageUtils){

	"use strict";

	var _getWallAt = function(scene, start, dir, key, len, meshCache){
		var plane = meshCache.getPlane(scene, len, key);
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

	var TerrainBuilder = {
		
	};

	TerrainBuilder.addWalls = function(scene, a, meshCache){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, walls = [];
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				_.each(["n", "s", "w", "e"], function(dir){
					var wallData = a[_i][_j].data.walls;
					if(wallData[dir] >= 1){
						walls.push(_getWallAt(scene, [_i, _j], dir, a[_i][_j].data.texture, wallData[dir], meshCache));
					}
				});
			}
		}
		return walls;
	};

	TerrainBuilder.addBoxes = function(scene, quads, meshCache){
		var y = SIZE/2, TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var size, box, x, z;
			size = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]];
			box = meshCache.getBox(scene, size);
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

	return TerrainBuilder;

});
