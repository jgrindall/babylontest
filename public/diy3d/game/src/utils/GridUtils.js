define([], function(){
	/* helper functions */

	"use strict";

	var TOP_LEFT = {"x":0, "z":SIZE_I * SIZE};

	var SIZE2 = SIZE/2;

	var GridUtils = {};

	GridUtils.makeEmpty = function(SIZE_I, SIZE_J, entry){
		var a = [], _i, _j;
		if(typeof entry === "undefined"){
			entry = 0;
		}
		for(_i = 0; _i < SIZE_I; _i++){
			a[_i] = [];
			for(_j = 0; _j < SIZE_J; _j++){
				if(typeof entry === "object"){
					a[_i][_j] = _.extend({}, entry);
				}
				else if(typeof entry === "number"){
					a[_i][_j] = entry;
				}
			}
		}
		return a;
	};

	GridUtils.log = function(a){
		var _i, _j, s;
		for(_i = 0; _i < a.length; _i++){
			s = "";
			for(_j = 0; _j < a[0].length; _j++){
				s += a[_i][_j].type + "\t";
			}
			console.log(_i + "\t" + s);
		}
	};

	GridUtils.addDirectionsOfWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, EMPTY, isWall, getWallsAt, fillWithDir, isInside;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		isWall = function(i, j){
			return (a[i][j].type === "wall");
		};
		isInside = function(i, j){
			return (i >= 0 && j >= 0 && i < SIZE_I && j < SIZE_J);
		};
		fillWithDir = function(walls, _i, _j, dir, di, dj){
			var checkI = _i + di, checkJ = _j + dj;
			if(isInside(_i, _j) && isWall(_i, _j) && isInside(checkI, checkJ) && !isWall(checkI, checkJ)){
				walls[dir] = 1;
			}
		};
		getWallsAt = function(_i, _j){
			// fill the array with n,s,w,e if there is a wall in that direction of the cell
			// eg. n:1 if there is a wall on my north side
			var walls = _.extend({}, EMPTY);
			fillWithDir(walls, _i, _j, "n", -1, 0);
			fillWithDir(walls, _i, _j, "s", +1, 0);
			fillWithDir(walls, _i, _j, "w", 0, -1);
			fillWithDir(walls, _i, _j, "e", 0, +1);
			return walls;
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				a[_i][_j].data.walls = getWallsAt(_i, _j);
			}
		}
	};

	GridUtils.ijToBabylon = function(i, j, y){
		return new BABYLON.Vector3(TOP_LEFT.x + j*SIZE + SIZE2, y, TOP_LEFT.z - i*SIZE - SIZE2);
	};

	GridUtils.babylonToIJ = function(pos){
		return {
			j:Math.floor(pos.x / SIZE),
			i:Math.floor((TOP_LEFT.z - pos.z) / SIZE)
		};
	};

	GridUtils.ijToBabylonUnrounded = function(i, j, y){
		return new BABYLON.Vector3(TOP_LEFT.x + j*SIZE, y, TOP_LEFT.z - i*SIZE);
	};

	GridUtils.babylonToIJUnrounded = function(pos){
		return {
			j: pos.x / SIZE,
			i: (TOP_LEFT.z - pos.z) / SIZE
		};
	};

	GridUtils.arrayToGrid = function(a){
		var g = GridUtils.makeEmpty(SIZE_I, SIZE_J, {"type":"empty", "data":{}});
		_.each(a, function(obj){
			g[obj.data.position[0]][obj.data.position[1]] = obj;
		});
		return g;
	};

	GridUtils.listByType = function(a, typeArr){
		var arr = [];
		if(!_.isArray(typeArr)){
			typeArr = [typeArr];
		}
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(typeArr.indexOf(a[_i][_j].type) >= 0){
					arr.push(a[_i][_j]);
				}
			}
		}
		return arr;
	};

	GridUtils.markByType = function(a, typeArr){
		if(!_.isArray(typeArr)){
			typeArr = [typeArr];
		}
		return GridUtils.map(a, function(obj){
			return (typeArr.indexOf(obj.type) >= 0) ? 1 : 0;
		});
	};

	GridUtils.getPath = function(strategy, pos, solid, playerPos){
		var i = pos[0], j = pos[1], i0, j0, i1, j1;
		var TOP_LEFT = {"x":0, "z":window.SIZE_I * window.SIZE};
		if(strategy === "north-south"){
			while(solid[i][j] === 0){
				i--;
			}
			i++;
			i0 = i;
			i = pos[0];
			while(solid[i][j] === 0){
				i++;
			}
			i--;
			i1 = i;
			return {
				"x":SIZE*j,
				"zmax":TOP_LEFT.z - i0 * SIZE - SIZE/2,
				"zmin":TOP_LEFT.z - i1 * SIZE - SIZE/2
			};
		}
		else if(strategy === "west-east"){
			while(solid[i][j] === 0){
				j--;
			}
			j++;
			j0 = j;
			j = pos[1];
			while(solid[i][j] === 0){
				j++;
			}
			j--;
			j1 = j;
			return {
				"z":SIZE*i,
				"xmin":j0 * SIZE + SIZE/2,
				"xmax":j1 * SIZE + SIZE/2
			};
		}
	};

	GridUtils.transpose = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, trans = GridUtils.makeEmpty(SIZE_J, SIZE_I);
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				trans[_j][_i] = a[_i][_j];
			}
		}
		return trans;
	};

	GridUtils.map = function(a, f){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, output = GridUtils.makeEmpty(SIZE_I, SIZE_J);
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				output[_i][_j] = f(a[_i][_j]);
			}
		}
		return output;
	};

	return GridUtils;

});
