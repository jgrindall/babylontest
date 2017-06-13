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
			console.log(s);
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
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, faces, f, fRight, fDown, temp;
		faces = MeshUtils.makeEmpty(SIZE_I, SIZE_J);
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				f = {
					"n":0,
					"s":0,
					"w":0,
					"e":0
				};
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
				faces[_i][_j] = f;
			}
		}
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				f = faces[_i][_j];
				if(f["n"] >= 1 && _j < SIZE_J - 1){
					fRight = faces[_i][_j + 1];
					for(temp = 1; temp <= SIZE_J - _j - 1; temp++){
						if(fRight["n"] >= 0){
							f["n"]++;
							fRight["n"]--;
						}
					}
				}
				if(f["s"] >= 1 && _j < SIZE_J - 1){
					fRight = faces[_i][_j + 1];
					for(temp = 1; temp <= SIZE_J - _j - 1; temp++){
						if(fRight["s"] >= 0){
							f["s"]++;
							fRight["s"]--;
						}
					}
				}
				if(f["w"] >= 1 && _i < SIZE_I - 1){
					fDown = faces[_i + 1][_j];
					for(temp = 1; temp <= SIZE_I - _i - 1; temp++){
						if(fDown["w"] >= 0){
							f["w"]++;
							fDown["w"]--;
						}
					}
				}
				if(f["e"] >= 1 && _i < SIZE_I - 1){
					fDown = faces[_i + 1][_j];
					for(temp = 1; temp <= SIZE_I - _j - 1; temp++){
						if(fDown["e"] >= 0){
							f["e"]++;
							fDown["e"]--;
						}
					}
				}
			}
		}
		return faces;
	};

	MeshUtils.getMatchingLocations = function(a, testFn){
		var _i, _j, SIZE_I = a.length, SIZE_J = a[0].length, matching = [], _temp;
		if(typeof testFn === "number"){
			_temp = testFn;
			testFn = function(val){
				return (val === _test);
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

	MeshUtils.setUVScale = function(mesh, uScale, vScale) {
		var i, UVs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind), len = UVs.length;
		if (uScale !== 1) {
			for (i = 0; i < len; i += 2) {
				UVs[i] *= uScale;
			}
		}
		if (vScale !== 1) {
			for (i = 1; i < len; i += 2) {
				UVs[i] *= vScale;
			}
		}
		mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, UVs);
	};

	return MeshUtils;

});


