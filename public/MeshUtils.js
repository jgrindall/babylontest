define([], function(){
	/* helper functions */

	var MeshUtils = {};

	MeshUtils.makeEmpty = function(SIZE_I, SIZE_J){
		var a = [], _i, _j;
		for(_i = 0; _i < SIZE_I; _i++){
			a[_i] = [];
			for(_j = 0; _j < SIZE_J; _j++){
				a[_i][_j] = 0;
			}
		}
		return a;
	};

	MeshUtils.log = function(a){
		var _i, _j, s;
		for(_i = 0; _i < a.length; _i++){
			s = "";
			for(_j = 0; _j < a[0].length; _j++){
				s += a[_i][_j] + " ";
			}
			console.log(_i + "\t" + s);
		}
	};

	MeshUtils.getDirectionsOfWalls = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, walls, EMPTY, fillFaceAt, fillWithDir, isInside;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		walls = MeshUtils.makeEmpty(SIZE_I, SIZE_J);
		isInside = function(i, j){
			return (i >= 0 && j >= 0 && i < SIZE_I && j < SIZE_J);
		};
		fillWithDir = function(f, _i, _j, dir, di, dj){
			var checkI = _i + di, checkJ = _j + dj;
			if(a[_i][_j] > 0 && isInside(checkI, checkJ) && a[checkI][checkJ] === 0){
				f[dir] = 1;
			}
		};
		fillFaceAt = function(_i, _j){
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
				walls[_i][_j] = fillFaceAt(_i, _j);
			}
		}
		return walls;
	};

	MeshUtils.extendWalls = function(a, walls){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length;
		var addInDir = function(dir, _i, _j, di, dj){
			var steps = 1, fCheck, f = walls[_i][_j], val = a[_i][_j];
			if(f[dir] >= 1){
				while(_j + dj*steps < SIZE_J && _i + di*steps < SIZE_I){
					fCheck = walls[_i + di][_j + dj];
					if(fCheck[dir] >= 1 && a[_i][_j] === a[_i + di*steps][_j + dj*steps]){
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
				f = walls[_i][_j];
				addInDir("n", _i, _j, 0, 1);
				addInDir("s", _i, _j, 0, 1);
				addInDir("w", _i, _j, 1, 0);
				addInDir("e", _i, _j, 1, 0);
			}
		}
	};

	MeshUtils.getFaces = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, walls, f, fRight, fDown, temp, EMPTY, lengthsNeeded = {}, fillFaceAtDirection;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		walls = MeshUtils.getDirectionsOfWalls(a);
		console.log(walls);
		MeshUtils.extendWalls(a, walls);
		console.log(walls);
		var extendedWalls = [];
		var wallData, val;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(a[_i][_j] >= 1){
					val = a[_i][_j];
					wallData = walls[_i][_j];
					_.each(["n", "s", "w", "e"], function(dir){
						if(wallData[dir] >= 1){
							extendedWalls.push({"start":[_i, _j], "dir":dir, "key":val, "len":wallData[dir]});
						}
					});
					lengthsNeeded[val] = (lengthsNeeded[val] || []).concat([wallData["n"], wallData["s"], wallData["w"], wallData["e"]]);
					lengthsNeeded[val] = _.without(lengthsNeeded[val], 0);
				 	lengthsNeeded[val] = _.uniq(lengthsNeeded[val]);
				}
			}
		}
		return {
			"L":extendedWalls,
			"faces":walls,
			"lengthsNeeded":lengthsNeeded
		};
	};

	MeshUtils.getMatchingLocations = function(a, testFn){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, matching = [], _temp;
		if(typeof testFn === "number"){
			_temp = testFn;
			testFn = function(val){
				return (val === _temp);
			};
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(testFn(a[_i][_j])){
					matching.push([_i, _j]);
				}
			}
		}
		return matching;
	};

	MeshUtils.makeRnd = function(SIZE_I, SIZE_J, options){
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
					a[_i][_j] = getVal();
				}
				else{
					a[_i][_j] = (Math.random() > options.rnd) ? 0 : getVal();
				}
			}
		}
		return a;
	};

	MeshUtils.setUVOffsetAndScale = function(mesh, uOffset, vOffset, uScale, vScale) {
		var i, UVs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind), len = UVs.length;
		if (uScale !== 1 || uOffset !== 0) {
			for (i = 0; i < len; i += 2) {
				UVs[i] = uOffset + UVs[i]*uScale;
			}
		}
		if (vScale !== 1 || vOffset !== 0) {
			for (i = 1; i < len; i += 2) {
				UVs[i] = vOffset + UVs[i]*vScale;
			}
		}
		console.log("UVs now " + UVs);
		mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, UVs);
	};

	return MeshUtils;

});
