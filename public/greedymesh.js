var img = [[0, 1, 0, 1], [1, 1, 1, 1], [0, 1, 0, 0], [0, 0, 1, 1]];

var MAX = 3;

var greedymesh = function(a){
    var i = 0, j = 0, quads = [];
    var visited = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
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
        mark(i, j, w, h);
        quads.push([i, j, w, h]);
    };
    var _N = 0;
    while(moveToNext() && _N < 10){
        buildQuad();
        _N++;
    }
    console.log('quads', quads);
};

greedymesh(img);
