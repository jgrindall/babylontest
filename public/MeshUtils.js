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

	MeshUtils.logGrouped = function(grouped){
		_.each(grouped, function(group, key){
			console.log("key: ", key);
			MeshUtils.log(group);
		});
	};

	MeshUtils.getSolid = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, matching = 0;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				if(a[_i][_j] > 0){
					matching++;
				}
			}
		}
		return matching;
	};

	MeshUtils.getFaces = function(a){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, faces, f, fRight, fDown, temp, EMPTY, lengthsNeeded = {}, fillFaceAtDirection;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		faces = MeshUtils.makeEmpty(SIZE_I, SIZE_J);
		fillFaceAtDirection = function(_i, _j){
			var f = _.extend({}, EMPTY);
			if(a[_i][_j] > 0 && _i > 0 && a[_i - 1][_j] === 0){
				f["n"] = 1
			}
			if(a[_i][_j] > 0 && _i < SIZE_I - 1 && a[_i + 1][_j] === 0){
				f["s"] = 1
			}
			if(a[_i][_j] > 0 && _j > 0 && a[_i][_j - 1] === 0){
				f["w"] = 1
			}
			if(a[_i][_j] > 0 && _j < SIZE_J - 1 && a[_i][_j + 1] === 0){
				f["e"] = 1
			}
			return f;
		};
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				faces[_i][_j] = fillFaceAtDirection(_i, _j);
			}
		}
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				f = faces[_i][_j];
				if(f["n"] >= 1 && _j < SIZE_J - 1){
					for(temp = 1; temp <= SIZE_J - _j - 1; temp++){
						fRight = faces[_i][_j + temp];
						if(fRight["n"] >= 1 && a[_i][_j] === a[_i][_j + temp]){
							f["n"]++;
							fRight["n"]--;
						}
						else{
							break;
						}
					}
				}
				if(f["s"] >= 1 && _j < SIZE_J - 1){
					for(temp = 1; temp <= SIZE_J - _j - 1; temp++){
						fRight = faces[_i][_j + temp];
						if(fRight["s"] >= 1 && a[_i][_j] === a[_i][_j + temp]){
							f["s"]++;
							fRight["s"]--;
						}
						else{
							break;
						}
					}
				}
				if(f["w"] >= 1 && _i < SIZE_I - 1){
					for(temp = 1; temp <= SIZE_I - _i - 1; temp++){
						fDown = faces[_i + temp][_j];
						if(fDown["w"] >= 1 && a[_i][_j] === a[_i + temp][_j]){
							f["w"]++;
							fDown["w"]--;
						}
						else{
							break;
						}
					}
				}
				if(f["e"] >= 1 && _i < SIZE_I - 1){
					for(temp = 1; temp <= SIZE_I - _i - 1; temp++){
						fDown = faces[_i + temp][_j];
						if(fDown["e"] >= 1 && a[_i][_j] === a[_i + temp][_j]){
							f["e"]++;
							fDown["e"]--;
						}
						else{
							break;
						}
					}
				}
			}
		}
		var L = [];
		var f, val;
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				key = a[_i][_j];
				if(key >= 1){
					f = faces[_i][_j];
					if(!lengthsNeeded[key]){
						lengthsNeeded[key] = [];
					}
					_.each(["n", "s", "w", "e"], function(dir){
						if(f[dir] >= 1){
							L.push({"start":[_i, _j], "dir":dir, "key":key, "len":f[dir]});
							lengthsNeeded[key].push(f["n"]);
						}
					});
					lengthsNeeded[key].push(f["n"]);
					lengthsNeeded[key].push(f["s"]);
					lengthsNeeded[key].push(f["w"]);
					lengthsNeeded[key].push(f["e"]);
					lengthsNeeded[key] = _.without(lengthsNeeded[key], 0);
				 	lengthsNeeded[key] = _.uniq(lengthsNeeded[key]);
				}
			}
		}
		return {
			"L":L,
			"faces":faces,
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
					a[_i][_j] = 1;
				}
				else{
					a[_i][_j] = (Math.random() > options.rnd) ? 0 : getVal();
				}
			}
		}
		return a;
	};

	MeshUtils.setUVScaleAndOffset = function(mesh, uScale, vScale, uOffset, vOffset) {
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
		mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, UVs);
	};

	return MeshUtils;

});
