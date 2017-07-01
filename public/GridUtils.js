define(["GeomUtils"], function(GeomUtils){
	/* helper functions */

	"use strict";


	var GridUtils = {};

	GridUtils.makeEmpty = function(SIZE_I, SIZE_J){
		var a = [], _i, _j;
		for(_i = 0; _i < SIZE_I; _i++){
			a[_i] = [];
			for(_j = 0; _j < SIZE_J; _j++){
				a[_i][_j] = 0;
			}
		}
		return a;
	};

	GridUtils.log = function(a){
		var _i, _j, s;
		for(_i = 0; _i < a.length; _i++){
			s = "";
			for(_j = 0; _j < a[0].length; _j++){
				s += a[_i][_j].val + " ";
			}
			console.log(_i + "\t" + s);
		}
	};

	GridUtils.addDirectionsOfWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, EMPTY, getWallsAt, fillFaceAt, fillWithDir, isInside;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		isInside = function(i, j){
			return (i >= 0 && j >= 0 && i < SIZE_I && j < SIZE_J);
		};
		fillWithDir = function(f, _i, _j, dir, di, dj){
			var checkI = _i + di, checkJ = _j + dj;
			if(a[_i][_j].val > 0 && isInside(checkI, checkJ) && a[checkI][checkJ].val === 0){
				f[dir] = 1;
			}
		};
		getWallsAt = function(_i, _j){
			// fill the array with n,s,w,e if there is a wall in that direction of the cell
			// eg. n:1 if there is a wall on my north side
			var f = _.extend({}, EMPTY);
			fillWithDir(f, _i, _j, "n", -1, 0);
			fillWithDir(f, _i, _j, "s", +1, 0);
			fillWithDir(f, _i, _j, "w", 0, -1);
			fillWithDir(f, _i, _j, "e", 0, +1);
			return f;
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				a[_i][_j].walls = getWallsAt(_i, _j);
			}
		}
	};

	GridUtils.getBoxesCanHit = function(a, boxes){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length;
		var canHit = GridUtils.makeEmpty(SIZE_I, SIZE_J);
		var getCanHit = function(i, j){
			var rect = {left:i*SIZE - SIZE, right:i*SIZE + SIZE, bottom:j*SIZE - SIZE, top:j*SIZE + SIZE};
			var hit = [];
			_.each(boxes, function(box, i){
				var boxRect = GeomUtils.getBoxRect(box);
				if(GeomUtils.rectIntersectRect(boxRect, rect)){
					hit.push(box);
				}
			});
			return hit;
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				canHit[_i][_j] = getCanHit(_i, _j);
			}
		}
		return canHit;
	};

	GridUtils.ijToBabylon = function(i, j){
		var topLeft = {"x":0, "z":SIZE_I * SIZE};
		return {
			x:topLeft.x + j*SIZE,
			z:topLeft.z - i*SIZE
		};
	};

	GridUtils.extendWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length;
		var addInDir = function(dir, _i, _j, di, dj){
			var steps = 1, fCheck, f = a[_i][_j].walls, val = a[_i][_j].val;
			if(f[dir] >= 1){
				while(_j + dj*steps < SIZE_J && _i + di*steps < SIZE_I){
					fCheck = a[_i + di][_j + dj].walls;
					if(fCheck[dir] >= 1 && a[_i][_j].val === a[_i + di*steps][_j + dj*steps].val){
						f[dir]++;
						fCheck[dir]--;
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
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, val, wallData, lengthsNeeded = {};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				val = a[_i][_j].val;
				if(val >= 1){
					wallData = a[_i][_j].walls;
					lengthsNeeded[val] = lengthsNeeded[val] || [];
					lengthsNeeded[val] = lengthsNeeded[val].concat([wallData["n"], wallData["s"], wallData["w"], wallData["e"]]);
					lengthsNeeded[val] = _.without(lengthsNeeded[val], 0);
				 	lengthsNeeded[val] = _.uniq(lengthsNeeded[val]);
				}
			}
		}
		return lengthsNeeded;
	};

	GridUtils.addFacesInfoToGrid = function(a){
		// start off with just a list of cells and add info describing where the walls are
		GridUtils.addDirectionsOfWalls(a);
		GridUtils.extendWalls(a);
	};

	GridUtils.getPath = function(strategy, pos, grid){
		var i = pos[0], j = pos[1], i0, j0, i1, j1;
		if(strategy === "north-south"){
			while(grid[i][j].val === 0){
				i--;
			}
			i++;
			i0 = i;
			i = pos[0];
			while(grid[i][j].val === 0){
				i++;
			}
			i--;
			i1 = i;
			return {
				"i0":i0,
				"i1":i1,
				"j":j
			};
		}
		else if(strategy === "west-east"){
			while(grid[i][j].val === 0){
				j--;
			}
			j++;
			j0 = j;
			j = pos[1];
			while(grid[i][j].val === 0){
				j++;
			}
			j--;
			j1 = j;
			return {
				"j0":j0,
				"j1":j1,
				"i":i
			};
		}
	};

	GridUtils.getMatchingLocations = function(a, testFn){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, matching = [], _temp;
		if(typeof testFn === "number"){
			_temp = testFn;
			testFn = function(val){
				return (val === _temp);
			};
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(testFn(a[_i][_j].val)){
					matching.push([_i, _j]);
				}
			}
		}
		return matching;
	};

	GridUtils.makeRnd = function(SIZE_I, SIZE_J, options){
		var _i, _j, a = [], getVal;
		options = _.defaults(options || {}, {"rnd":0.5, "values":[0, 1]});
		getVal = function(){
			var n = options.values.length - 1;
			return options.values[Math.floor(Math.random()*n) + 1];
		};
		for(_i = 0; _i < SIZE_I; _i++){
			a[_i] = [];
			for(_j = 0; _j < SIZE_J; _j++){
				if(_i === 0 || _j === 0 || _i === SIZE_I - 1 || _j === SIZE_J - 1){
					a[_i][_j] = {"val":getVal()};
				}
				else{
					a[_i][_j] = {"val":(Math.random() > options.rnd) ? 0 : getVal()};
				}
			}
		}
		return a;
	};

	return GridUtils;

});
