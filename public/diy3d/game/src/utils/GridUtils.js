define(["diy3d/game/src/consts/Consts"], function(Consts){
	/* helper functions */

	"use strict";

	var GridUtils = {};

	GridUtils.makeEmpty = function(sizeI, sizeJ, entry){
		var a = [], _i, _j;
		if(typeof entry === "undefined"){
			entry = 0;
		}
		for(_i = 0; _i < sizeI; _i++){
			a[_i] = [];
			for(_j = 0; _j < sizeJ; _j++){
				if(typeof entry === "object"){
					a[_i][_j] = _.extend({}, entry);
				}
				else if(typeof entry === "number"){
					a[_i][_j] = entry;
				}
			}
		}
		return a;
	};

	GridUtils.log = function(a){
		var _i, _j, s;
		for(_i = 0; _i < a.length; _i++){
			s = "";
			for(_j = 0; _j < a[0].length; _j++){
				s += a[_i][_j].type + "\t";
			}
			console.log(_i + "\t" + s);
		}
	};

    GridUtils.addPositions = function(a){
        var _i, _j, sizeI = a.length, sizeJ = a[0].length;
        for(_i = 0; _i < sizeI; _i++){
            for(_j = 0; _j < sizeJ; _j++){
                a[_i][_j].data.position = [_i, _j];
            }
        }
    };

	GridUtils.addDirectionsOfWalls = function(a){
		var _i, _j, sizeI = a.length, sizeJ = a[0].length, EMPTY, isWall, getWallsAt, fillWithDir, isInside;
		EMPTY = {"n":0, "s":0, "w":0, "e":0};
		isWall = function(i, j){
			return (a[i][j].type === "wall");
		};
		isInside = function(i, j){
			return (i >= 0 && j >= 0 && i < sizeI && j < sizeJ);
		};
		fillWithDir = function(walls, _i, _j, dir, di, dj){
			var checkI = _i + di, checkJ = _j + dj;
			if(isInside(_i, _j) && isWall(_i, _j) && isInside(checkI, checkJ) && !isWall(checkI, checkJ)){
				walls[dir] = 1;
			}
		};
		getWallsAt = function(_i, _j){
			// fill the array with n,s,w,e if there is a wall in that direction of the cell
			// eg. n:1 if there is a wall on my north side
			var walls = _.extend({}, EMPTY);
			fillWithDir(walls, _i, _j, "n", -1, 0);
			fillWithDir(walls, _i, _j, "s", +1, 0);
			fillWithDir(walls, _i, _j, "w", 0, -1);
			fillWithDir(walls, _i, _j, "e", 0, +1);
			return walls;
		};
		for(_i = 0; _i < sizeI; _i++){
			for(_j = 0; _j < sizeJ; _j++){
			    if(isWall(_i, _j)){
                    a[_i][_j].data.walls = getWallsAt(_i, _j);
                }
			}
		}
	};

	GridUtils.isFullVertices = function(game, pos, radius){
		var posToCheck = {  //nw
            x: pos.x - radius,
            z: pos.z + radius
        };
        if(GridUtils.isFullPos(game, posToCheck)){
            return true;
        }
        posToCheck.x = pos.x + radius; //ne
        posToCheck.z = pos.z + radius;
        if(GridUtils.isFullPos(game, posToCheck)){
            return true;
        }
        posToCheck.x = pos.x + radius; //se
        posToCheck.z = pos.z - radius;
        if(GridUtils.isFullPos(game, posToCheck)){
            return true;
        }
        posToCheck.x = pos.x - radius; //sw
        posToCheck.z = pos.z - radius;
        if(GridUtils.isFullPos(game, posToCheck)){
            return true;
        }
        return false;
	};

	GridUtils.isFullPos = function(game, pos){
		return GridUtils.isFullIJ(game, GridUtils.babylonToIJ(pos));
	};

	GridUtils.isFullIJ = function(game, ij){
		if(ij.i < 0 || ij.i >= Consts.SIZE_I || ij.j < 0 || ij.j >= Consts.SIZE_J){
            return true;
        }
        return (game.data.solid[ij.i][ij.j] === 1);
	};

	GridUtils.ijToBabylon = function(i, j, y){
		return new BABYLON.Vector3(
		    Math.round(Consts.TOP_LEFT.x + j*Consts.BOX_SIZE + Consts.BOX_SIZE2),
            Math.round(y),
            Math.round(Consts.TOP_LEFT.z - i*Consts.BOX_SIZE - Consts.BOX_SIZE2)
        );
	};

	GridUtils.babylonToIJ = function(pos){
	    return {
			j:Math.floor(pos.x / Consts.BOX_SIZE),
			i:Math.floor((Consts.TOP_LEFT.z - pos.z) / Consts.BOX_SIZE)
		};
	};

    GridUtils.ijToBabylonUnrounded = function(i, j, y){
        return new BABYLON.Vector3(
            Consts.TOP_LEFT.x + j*Consts.BOX_SIZE,
            y,
            Consts.TOP_LEFT.z - i*Consts.BOX_SIZE - Consts.BOX_SIZE2
        );
    };

    GridUtils.babylonToIJUnrounded = function(pos){
        return {
            j:pos.x / Consts.BOX_SIZE,
            i:(Consts.TOP_LEFT.z - pos.z) / Consts.BOX_SIZE
        };
    };

    GridUtils.getWalls = function(arr){
        var output = [], WALLS = ["n", "s", "w", "e"];
        _.each(arr, function(obj){
            _.each(WALLS, function(dir){
                if(obj.data.walls && obj.data.walls[dir] === 1){
                    output.push({
                        "type":obj.type,
                        "name":obj.name,
                        "data":{
                            "position":obj.data.position,
                            "direction":dir
                        }
                    });
                }
            });
        });
        return output;
    };

	GridUtils.arrayToGrid = function(a){
		var g = GridUtils.makeEmpty(Consts.SIZE_I, Consts.SIZE_J, {"type":"empty", "data":{}});
		_.each(a, function(obj){
			g[obj.data.position[0]][obj.data.position[1]] = obj;
		});
		return g;
	};

	GridUtils.listByType = function(a, typeArr){
		var arr = [];
		if(!_.isArray(typeArr)){
			typeArr = [typeArr];
		}
		var _i, _j, sizeI = a.length, sizeJ = a[0].length;
		for(_i = 0; _i < sizeI; _i++){
			for(_j = 0; _j < sizeJ; _j++){
				if(typeArr.indexOf(a[_i][_j].type) >= 0){
					arr.push(a[_i][_j]);
				}
			}
		}
		return arr;
	};

	GridUtils.markByType = function(a, typeArr){
		if(!_.isArray(typeArr)){
			typeArr = [typeArr];
		}
		return GridUtils.map(a, function(obj){
			return (typeArr.indexOf(obj.type) >= 0) ? 1 : 0;
		});
	};

	GridUtils.getPath = function(strategy, pos, solid){
		var i = pos[0], j = pos[1], i0, j0, i1, j1;
		if(strategy === "north-south"){
			while(solid[i][j] === 0){
				i--;
			}
			i++;
			i0 = i;
			i = pos[0];
			while(solid[i][j] === 0){
				i++;
			}
			i--;
			i1 = i;
			return {
				"x":Consts.BOX_SIZE*j,
				"zmax":Consts.TOP_LEFT.z - i0 * Consts.BOX_SIZE - Consts.BOX_SIZE2,
				"zmin":Consts.TOP_LEFT.z - i1 * Consts.BOX_SIZE - Consts.BOX_SIZE2
			};
		}
		else if(strategy === "west-east"){
			while(solid[i][j] === 0){
				j--;
			}
			j++;
			j0 = j;
			j = pos[1];
			while(solid[i][j] === 0){
				j++;
			}
			j--;
			j1 = j;
			return {
				"z":Consts.BOX_SIZE*i,
				"xmin":j0 * Consts.BOX_SIZE + Consts.BOX_SIZE2,
				"xmax":j1 * Consts.BOX_SIZE + Consts.BOX_SIZE2
			};
		}
		else if(strategy === "random"){
			return "random";
		}
	};

	GridUtils.transpose = function(a){
		var _i, _j, sizeI = a.length, sizeJ = a[0].length, trans = GridUtils.makeEmpty(sizeJ, sizeI);
		for(_i = 0; _i < sizeI; _i++){
			for(_j = 0; _j < sizeJ; _j++){
				trans[_j][_i] = a[_i][_j];
			}
		}
		return trans;
	};

	GridUtils.map = function(a, f){
		var _i, _j, sizeI = a.length, sizeJ = a[0].length, output = GridUtils.makeEmpty(sizeI, sizeJ);
		for(_i = 0; _i < sizeI; _i++){
			for(_j = 0; _j < sizeJ; _j++){
				output[_i][_j] = f(a[_i][_j]);
			}
		}
		return output;
	};

	return GridUtils;

});
