

var SIZE_I = 8;
var SIZE_J = 8;



var makeEmpty = function(){
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
	for(var _i = 0; _i < SIZE_I; _i++){
		var s = "";
        for(var _j = 0; _j < SIZE_J; _j++){
			s += a[_i][_j] + " ";
        }
		console.log(s);
    }
};

var makeRnd = function(){
    var a = [];
    for(var _i = 0; _i < SIZE_I; _i++){
        a[_i] = [];
        for(var _j = 0; _j < SIZE_J; _j++){
            a[_i][_j] = (Math.random() < 0.5) ? 0 : 1;
        }
    }
    return a;
};

var img = makeRnd();

//img = [[1,0,1],[0,0,1],[1,1,1]];

log(img);

var greedymesh = function(a){
    var i = 0, j = -1, quads = [];
    var visited = makeEmpty();
	var isInside = function(){
		return (i < SIZE_I && j < SIZE_J && i >= 0 && j >= 0);
	};
    var moveToNext = function(){
		//console.log("I start at", i, j);
		var shouldVisitCell = function(){
			return (isInside() && a[i][j] && !visited[i][j]);
		};
		var step = function(){
            j++;
            if(j >= SIZE_J){
                j = 0;
                i++;
				if(i >= SIZE_I){
					throw new Error("out of bounds");
				}
            }
			//console.log("I stepped to", i, j);
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
			// outside
			return false;
		}
		//console.log("ended up at", i, j);
        return isInside();
    };
    var rectIsFullAndNotVisited = function(i, j, w, h){
		//console.log("check rect is full and not vis", i, j, "  ", w, h);
        for(var _i = i; _i < i + h; _i++){
            for(var _j = j; _j < j + w; _j++){
                if(!a[_i][_j] || visited[_i][_j]){
					// no, break!
                    return false;
                }
            }
        }
        return true;
    };
    var mark = function(i, j, w, h){
        for(var _i = i; _i < i + h; _i++){
            for(var _j = j; _j < j + w; _j++){
                visited[_i][_j] = 1;
            }
        }
    };
    var buildQuad = function(){
        var w = 1, h = 1;
		//console.log("build at", i, j);
        while(w <= SIZE_J - j && rectIsFullAndNotVisited(i, j, w, h) ){
            w++;
        }
        w--;
		//console.log("got w", w);
        while(h <= SIZE_I - i && rectIsFullAndNotVisited(i, j, w, h) ){
            h++;
        }
        h--;
		//console.log("got h", h);
        //console.log('found!!  ', i, j, ', ', w, h);
        mark(i, j, w, h);
        quads.push([i, j, w, h]);
    };
    while(moveToNext()){
        buildQuad();
    }
    console.log('quads', JSON.stringify(quads, null, 2));
	return quads;
};


var quads = greedymesh(img);
