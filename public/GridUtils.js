define([], function(){
	/* helper functions */

	"use strict";


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

	GridUtils.ijToBabylon = function(i, j){
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		return {
			x:topLeft.x + j*SIZE + SIZE/2,
			z:topLeft.z - i*SIZE - SIZE/2
		};
	};

	GridUtils.babylonToIJ = function(pos){
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		return {
			j:Math.floor(pos.x / SIZE),
			i:Math.floor((topLeft.z - pos.z) / SIZE)
		};
	};

	GridUtils.extendWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length;
		var addInDir = function(dir, _i, _j, di, dj){
			var steps = 1, wallCheck, walls = a[_i][_j].data.walls;
			if(walls[dir] >= 1){
				while(_j + dj*steps < SIZE_J && _i + di*steps < SIZE_I){
					wallCheck = a[_i + di][_j + dj].data.walls;
					if(wallCheck[dir] >= 1 && a[_i][_j].data.texture === a[_i + di*steps][_j + dj*steps].data.texture){
						walls[dir]++;
						wallCheck[dir]--;
					}
					else{
						break;
					}
					steps++;
				}
			}
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				addInDir("n", _i, _j, 0, 1);
				addInDir("s", _i, _j, 0, 1);
				addInDir("w", _i, _j, 1, 0);
				addInDir("e", _i, _j, 1, 0);
			}
		}
	};

	GridUtils.getLengthsNeeded = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, texture, wallData, lengthsNeeded = {};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(a[_i][_j].type === "wall"){
					texture = a[_i][_j].data.texture;
					wallData = a[_i][_j].data.walls;
					lengthsNeeded[texture] = lengthsNeeded[texture] || [];
					lengthsNeeded[texture] = lengthsNeeded[texture].concat([wallData["n"], wallData["s"], wallData["w"], wallData["e"]]);
					lengthsNeeded[texture] = _.without(lengthsNeeded[texture], 0);
				 	lengthsNeeded[texture] = _.uniq(lengthsNeeded[texture]);
				}
			}
		}
		return lengthsNeeded;
	};

	GridUtils.getByType = function(a, typeArr){
		if(!_.isArray(typeArr)){
			typeArr = [typeArr];
		}
		return GridUtils.map(a, function(obj){
			return (typeArr.indexOf(obj.type) >= 0) ? 1 : 0;
		});
	};

	GridUtils.getSolid = function(a){
		return GridUtils.getByType(a, ["water", "wall"]);
	};

	GridUtils.addFacesInfoToGrid = function(a){
		// start off with just a list of cells and add info describing where the walls are
		GridUtils.addDirectionsOfWalls(a);
		GridUtils.extendWalls(a);
	};

	GridUtils.getPath = function(strategy, pos, grid, playerPos){
		var i = pos[0], j = pos[1], i0, j0, i1, j1;
		var TOP_LEFT = {"x":0, "z":window.SIZE_I * window.SIZE};
		if(strategy === "north-south"){
			while(grid[i][j].type === "empty"){
				i--;
			}
			i++;
			i0 = i;
			i = pos[0];
			while(grid[i][j].type === "empty"){
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
			while(grid[i][j].type === "empty"){
				j--;
			}
			j++;
			j0 = j;
			j = pos[1];
			while(grid[i][j].type === "empty"){
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

	GridUtils.getAStarPath = function(pos, grid, playerPos){
		// TODO - cache new PF.AStarFinder()??
		// TODO - web worker?
		var i, points, numPoints, sections = [], _addDir;
		points = new PF.AStarFinder().findPath(pos.i, pos.j, playerPos.i, playerPos.j, grid.clone());
		if(!points || points.length <= 1){
			return null; // no path
		}
		numPoints = points.length;
		points = _.map(points, function(p){
			return GridUtils.ijToBabylon(p[0], p[1]);
		});
		for(i = 0; i <= numPoints - 2; i++){
			sections.push({
				"start":points[i],
				"end":points[i + 1]
			});
		}
		_addDir = function(obj){
			//TODO - these are integers in the original points array
			if(Math.abs(obj.start.x - obj.end.x) < 0.1){
				obj.dir = (obj.start.z < obj.end.z ? "n" : "s");
			}
			else{
				obj.dir = (obj.start.x < obj.end.x ? "e" : "w");
			}
		};
		_.each(sections, _addDir);
		console.log("SECTIONS", sections);
		return {
			"sections":sections,
			"currentNum":0
		};
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

	GridUtils.getMatchingLocations = function(a, testFn){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, matching = [];
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(testFn(a[_i][_j])){
					matching.push([_i, _j]);
				}
			}
		}
		return matching;
	};

	return GridUtils;

});
