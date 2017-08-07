
define(["diy3d/game/src/BASE64", "diy3d/game/src/consts/Consts"], function(BASE64, Consts){

	var i, j, data = [];
	for(i = 0; i < Consts.SIZE_I; i++){
		for(j = 0; j < Consts.SIZE_J; j++){
			if(i === 0 || i === Consts.SIZE_I - 1 || j === 0 || j === Consts.SIZE_J - 1){
				data.push({
					"type":"wall",
                    "name":"wall0",
					"data":{
						"position":[i, j]
					}
				});
			}
		}
	}
    data.push({
        "type":"baddie",
        "name":"baddie0",
        "data":{
            "position":[6, 12],
            "move":"north-south"
        }
    });


    data.push({
        "type":"wall",
        "name":"wall1",
        "data":{
            "position":[8, 8]
        }
    });

    data.push({
        "type":"object",
        "name":"object0",
        "data":{
            "position":[12, 2]
        }
    });

    data.push({
        "type":"object",
        "name":"object0",
        "data":{
            "position":[12, 2]
        }
    });

    data.push({
        "type":"object",
        "name":"object0",
        "data":{
            "position":[12, 3]
        }
    });

	return {
		"textureList": {
            "wall":{
                "wall0":BASE64.wall1,
                "wall1":BASE64.wall0
            },
            "object":{
                "object0":BASE64.object0,
                "object1":BASE64.object1
            },
            "baddie":{
                "baddie0":BASE64.baddie0,
                "baddie1":BASE64.bird
            },
            "tree":{
                "tree0":BASE64.tree0
            }
        },
        "player":{
            "position":[10, 4]
        },
		"data":data,
		"light":{
            "type":"dark"
        }
	};

});
