
define(["diy3d/game/src/BASE64", "diy3d/game/src/consts/Consts"], function(BASE64, Consts){

	var i, j, data = [];
	for(i = 0; i < Consts.SIZE_I; i++){
		for(j = 0; j < Consts.SIZE_J; j++){
			if(i === 0 || i === Consts.SIZE_I - 1 || j === 0 || j === Consts.SIZE_J - 1){
				data.push({
					"type":"baddie",
                    "name":"baddie0",
					"data":{
						"position":[i, j],
                        "move":"hunt"
					}
				});
			}
		}
	}

    data.push({
        "type":"tree",
        "name":"tree0",
        "data":{
            "position":[11, 5]
        }
    });

    data.push({
        "type":"object",
        "name":"object0",
        "data":{
            "position":[12, 12]
        }
    });

    data.push({
        "type":"wall",
        "name":"wall0",
        "data":{
            "position":[6, 6]
        }
    });

    data.push({
        "type":"wall",
        "name":"wall0",
        "data":{
            "position":[6, 8]
        }
    });

    data.push({
        "type":"wall",
        "name":"wall0",
        "data":{
            "position":[8, 8]
        }
    });

    data.push({
        "type":"wall",
        "name":"wall0",
        "data":{
            "position":[8, 6]
        }
    });

    data.push({
        "type":"baddie",
        "name":"baddie0",
        "data":{
            "position":[6, 12],
            "move":"hunt"
        }
    });

    data.push({
        "type":"water",
        "name":"water",
        "data":{
            "position":[10, 2]
        }
    });

    data.push({
        "type":"water",
        "name":"water",
        "data":{
            "position":[10, 3]
        }
    });

    data.push({
        "type":"fire",
        "name":"fire",
        "data":{
            "position":[10, 4]
        }
    });

	return {
		"textureList":{
		    "wall":{
                "wall0":BASE64.wall0,
                "wall1":BASE64.wall1
            },
            "object":{
                "object0":BASE64.object0
            },
            "baddie":{
                "baddie0":BASE64.dog
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
            "type":"default"
        },
        "sky":BASE64.sky
	};

});
