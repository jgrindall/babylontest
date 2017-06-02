//http://chaosinmotion.com/blog/?p=893

var findNorthWestCell = function(cells){
    var i, j;
    for(i = 0; i < NUM_X; i++){
        for(j = 0; j < NUM_Y; j++){
            if(cells[i][j]){
                return [i, j];
            }
        }
    }
    return null;
};

var removeCellsInsidePath = function(walls, path){
    var cellsNotInsidePath = makeCells(), obj, i, j, midPoint;
    for(i = 0; i < NUM_X; i++){
        for(j = 0; j < NUM_Y; j++){
            midPoint = [i + 0.5, j + 0.5];
            obj = walls[i][j];
            if(obj){
                if(!pointinpoly(midPoint, path)){
                    cellsNotInsidePath[i][j] = obj;
                }
            }
        }
    }
    return cellsNotInsidePath;
};

var getBoundaries = function(cells){
    var path = getBoundaryPath(cells), paths = [];
    while(path){
        paths.push(path);
        cells = removeCellsInsidePath(cells, path);
        path = getBoundaryPath(cells);
    }
    return paths;
};

var buildMesh = function(cells){
    var boundaryPaths = getBoundaries(cells);
    
};

var getBoundaryPath = function(cells){
    var F = false, T = true, path = [], pos, startPos, dir, neigh;
    var add = function(){
        path.push([pos[0], pos[1]]);
    };
    var getNeighbours = function(){
        var _get = function(i, j){
            if(i >= 0 && i <= NUM_X - 1 && j >= 0 && j <= NUM_Y - 1){
                return cells[i][j];
            }
            return null;
        }
        var topLeft = _get(pos[0] - 1, pos[1] - 1);
        var topRight = _get(pos[0] - 1, pos[1]);
        var bottomLeft = _get(pos[0], pos[1] - 1);
        var bottomRight = _get(pos[0], pos[1]);
        return [!!topLeft, !!topRight, !!bottomLeft, !!bottomRight];
    };
    var getNewDir = function(){
        if(dir === null){
            return "e";
        }
        else if(dir === "e"){
            if(_.isEqual(neigh, [F,F,T,F])){
                return "s";
            }
            else if(_.isEqual(neigh, [F,T,T,F])){
                return "s";
            }
            else if(_.isEqual(neigh, [F,F,T,T])){
                return "e";
            }
            else if(_.isEqual(neigh, [F,T,T,T])){
                return "n";
            }
        }
        else if(dir === "s"){
            if(_.isEqual(neigh, [T,F,F,F])){
                return "w";
            }
            else if(_.isEqual(neigh, [T,F,T,F])){
                return "s";
            }
            else if(_.isEqual(neigh, [T,F,F,T])){
                return "w";
            }
            else if(_.isEqual(neigh, [T,F,T,T])){
                return "e";
            }
        }
        else if(dir === "w"){
            if(_.isEqual(neigh, [F,T,F,F])){
                return "n";
            }
            else if(_.isEqual(neigh, [T,T,F,F])){
                return "w";
            }
            else if(_.isEqual(neigh, [F,T,T,F])){
                return "n";
            }
            else if(_.isEqual(neigh, [T,T,T,F])){
                return "s";
            }
        }
        else if(dir === "n"){
            if(_.isEqual(neigh, [F,F,F,T])){
                return "e";
            }
            else if(_.isEqual(neigh, [T,F,F,T])){
                return "e";
            }
            else if(_.isEqual(neigh, [F,T,F,T])){
                return "n";
            }
            else if(_.isEqual(neigh, [T,T,F,T])){
                return "w";
            }
        }
    };
    var move = function(){
        if(dir === "e"){
            pos[1] += 1;
        }
        else if(dir === "s"){
            pos[0] += 1;
        }
        else if(dir === "w"){
            pos[1] -= 1;
        }
        else if(dir === "n"){
            pos[0] -= 1;
        }
    };
    pos = findNorthWestCell(cells)
    if(!pos){
        return null;
    }
    startPos = pos.concat();
    dir = null;
    neigh = getNeighbours();
    add();
    while(true){
        neigh = getNeighbours();
        dir = getNewDir();
        move();
        if(_.isEqual(pos, startPos)){
            break;
        }
        else{
            add();
        }
    }
    return path;
};