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

	MeshUtils.getEmptyLocations = function(a){
		var coords = [], _i, _j, k, SIZE_I = a.length, SIZE_J = a[0].length, empty = [];
		for(_i = 0; _i < SIZE_I; _i++){
			for(_j = 0; _j < SIZE_J; _j++){
				coords.push([_i, _j]);
			}
		}
		coords = _.shuffle(coords);
		for(k = 0; k < coords.length; k++){
			if(a[coords[k][0]][coords[k][1]] === 0){
				empty.push(coords[k]);
			}
		}
		return empty;
	};

	MeshUtils.makeRnd = function(SIZE_I, SIZE_J, options){
		var _i, _j, a = [];
		options = _.defaults(options || {}, {"rnd":0.5});
		for(_i = 0; _i < SIZE_I; _i++){
			a[_i] = [];
			for(_j = 0; _j < SIZE_J; _j++){
				if(_i === 0 || _j === 0 || _i === SIZE_I - 1 || _j === SIZE_J - 1){
					a[_i][_j] = 1;
				}
				else{
					a[_i][_j] = (Math.random() > options.rnd) ? 0 : 1;
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


