define(["diy3d/game/src/utils/GeomUtils", "diy3d/game/src/utils/ImageUtils"],

	function(GeomUtils, ImageUtils){

	"use strict";

	var _addWallAt = function(scene, start, dir, key, len, meshCache){
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

	TerrainBuilder.addWalls = function(scene, grid, meshCache){
		var _i, _j, SIZE_I = grid.length, SIZE_J = grid[0].length;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				var wallData = grid[_i][_j].data.walls;
				_.each(["n", "s", "w", "e"], function(dir){
					if(wallData[dir] >= 1){
						_addWallAt(scene, [_i, _j], dir, grid[_i][_j].data.texture, wallData[dir], meshCache);
					}
				});
			}
		}
	};

	TerrainBuilder.addBoxes = function(scene, quads, meshCache, tag){
		var y = SIZE/2, TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};
		_.each(quads, function(quad){
			var mesh, x, z;
			mesh = meshCache.getBox(scene, [quad[2], quad[3]]);
			if(tag){
				BABYLON.Tags.EnableFor(mesh);
				BABYLON.Tags.AddTagsTo(mesh, tag);
			}
			x = TOP_LEFT.x + (quad[1] + quad[2]/2)*SIZE;
			z = TOP_LEFT.z - (quad[0] + quad[3]/2)*SIZE;
			if(quad[2] < quad[3]){
				mesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
			}
			mesh.isVisible = false;
			mesh.position = new BABYLON.Vector3(x, y, z);
			mesh.freezeWorldMatrix();
		});
	};

	return TerrainBuilder;

});