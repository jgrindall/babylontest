

var MAX = 24;



var makeEmpty = function(){
    var a = [];
    for(var _i = 0; _i < MAX; _i++){
        a[_i] = [];
        for(var _j = 0; _j < MAX; _j++){
            a[_i][_j] = 0;
        }
    }
    return a;
};

var makeRnd = function(){
    var a = [];
    for(var _i = 0; _i < MAX; _i++){
        a[_i] = [];
        for(var _j = 0; _j < MAX; _j++){
            a[_i][_j] = (Math.random() < 0.5) ? 0 : 1;
        }
    }
    return a;
};

var img = makeRnd();

var greedymesh = function(a){
    var i = 0, j = 0, quads = [];
    var visited = makeEmpty();
    var moveToNext = function(){
        var ok = function(){
            return ( i<= MAX && j <= MAX && !visited[i][j] && a[i][j]);
        };
        var step = function(){
            j++;
            if(j > MAX){
                j = 0;
                i++;
            }
        };
        while(!ok() && i <= MAX && j <= MAX){
            step();
        }
        return (i <= MAX && j <= MAX);
    };
    var rectIsFullAndNotVisited = function(i, j, w, h){
        for(var _i = i; _i < i + h; _i++){
            for(var _j = j; _j < j + w; _j++){
                if(!a[_i][_j] || visited[_i][_j]){
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
        while(j + w <= MAX + 1 && rectIsFullAndNotVisited(i, j, w, h) ){
            w++;
        }
        w--;
        while(i + h <= MAX + 1 && rectIsFullAndNotVisited(i, j, w, h) ){
            h++;
        }
        h--;
        console.log('found', i, j, ', ', w, h);
        mark(i, j, w, h);
        quads.push([i, j, w, h]);
    };
    while(moveToNext()){
        buildQuad();
    }
    console.log('quads', quads);
};

greedymesh(img);
