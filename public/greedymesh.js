

var makeEmpty = function(SIZE_I, SIZE_J){
    var a = [];
    for(var _i = 0; _i < SIZE_I; _i++){
        a[_i] = [];
        for(var _j = 0; _j < SIZE_J; _j++){
            a[_i][_j] = 0;
        }
    }
    return a;
};

var log = function(a){
	var _i, _j, s;
	for(_i = 0; _i < a.length; _i++){
		s = "";
        for(_j = 0; _j < a[0].length; _j++){
			s += a[_i][_j] + " ";
        }
		console.log(s);
    }
};

var makeRnd = function(){
    var _i, _j, a = [];
    for(_i = 0; _i < SIZE_I; _i++){
        a[_i] = [];
        for(_j = 0; _j < SIZE_J; _j++){
            a[_i][_j] = (Math.random() < 0.5) ? 0 : 1;
        }
    }
    return a;
};

var rectPassesTest = function(i, j, w, h, test){
	var _i, _j;
    for(_i = i; _i < i + h; _i++){
        for(_j = j; _j < j + w; _j++){
            if(!test(_i, _j)){
                return false;
            }
        }
    }
    return true;
};

var greedyMesh = function(a, options){
    var i = 0, j = -1; // start just off the grid because we will make one step in to point 0,0.
	var shouldVisitCell, quads = [], SIZE_I, SIZE_J, visited = [], isInside, moveToNext, rectIsFullAndNotVisited, mark, buildQuad;
	SIZE_I = a.length;
	SIZE_J = a[0].length;
	visited = makeEmpty(SIZE_I, SIZE_J);
	isInside = function(){
		return (i < SIZE_I && j < SIZE_J && i >= 0 && j >= 0);
	};
	shouldVisitCell = function(){
		return (isInside() && a[i][j] && !visited[i][j]);
	};
    moveToNext = function(){
		var step = function(){
			j++;
			if(j >= SIZE_J){
				j = 0;
				i++;
			}
			if(!isInside()){
				throw new Error("out of bounds");
			}
        };
		if(shouldVisitCell()){
			return;
		}
		try{
			while(!shouldVisitCell()){
				step();
			}
		}
		catch(e){
			return false;
		}
        return isInside();
    };
    rectIsFullAndNotVisited = function(i, j, w, h){
		return rectPassesTest(i, j, w, h, function(_i, _j){
			return (a[_i][_j] && !visited[_i][_j]);
		});
    };
    markVisited = function(i, j, w, h){
        var _i, _j;
		for(_i = i; _i < i + h; _i++){
            for(_j = j; _j < j + w; _j++){
                visited[_i][_j] = 1;
            }
        }
    };
	buildHoriz = function(w, h){
		while(w <= SIZE_J - j && rectIsFullAndNotVisited(i, j, w, h) ){
            w++;
        }
        w--;
		return w;
	};
	buildVertic = function(w, h){
		while(h <= SIZE_I - i && rectIsFullAndNotVisited(i, j, w, h) ){
            h++;
        }
        h--;
		return h;
	};
	buildQuad = function(){
        var w = 1, h = 1;
		if(options && options.dir === "horiz"){
			w = buildHoriz(w, h);
			h = buildVertic(w, h);
		}
		else{
			h = buildVertic(w, h);
			w = buildHoriz(w, h);
		}
		markVisited(i, j, w, h);
        quads.push([i, j, w, h]);
    };
    while(moveToNext()){
        buildQuad();
    }
    return quads;
};

var getDimensions = function(quads){
	var _contains, dims = [];
	_contains = function(arr, needle){
		var found = _.filter(arr, function(a){
			return (a[0] === needle[0] && a[1] === needle[1]);
		});
		return (found.length >= 1);
	}; 
	_.each(quads, function(quad){
		var dim = (quad[2] >= quad[3]) ? [quad[2], quad[3]] : [quad[3], quad[2]]; // long and thin only
		if(!_contains(dims, dim)){
			dims.push(dim);
		}
	});
	return dims;
};

var getBestGreedyMesh = function(img){
	var quadsH, quadsV, dimsV, dimsH;
	quadsH = greedyMesh(img, {dir:"horiz"});
	quadsV = greedyMesh(img, {dir:"vertic"});
	dimsV = getDimensions(quadsV);
	dimsH = getDimensions(quadsH);
	// best one please
	return (dimsH.length <= dimsV.length) ? {"quads":quadsH, "dims":dimsH} : {"quads":quadsV, "dims":dimsV};
};

