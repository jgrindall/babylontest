define([], function(){

	var i, j, d = [];
	for(i = 0; i < SIZE_I; i++){
		d[i] = d[i] || [];
		for(j = 0; j < SIZE_J; j++){
			if(i === 0 || i === SIZE_I - 1 || j === 0 || j === SIZE_J - 1){
				d[i][j] = {
					"type":"wall",
					"data":{
						"texture": Math.random() < 0.5 ? 1 : 2
					}
				};
			}
			else{
				d[i][j] = {
					"type":"empty",
					"data":{

					}
				};
			}
		}
	}

	d[4][3] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	d[4][4] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	d[4][5] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	d[4][6] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};

	d[4][7] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	d[4][8] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	d[4][9] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};
	
	
	/*
	d[1][1] = {
		"type":"water",
		"data":{

		}
	};

	d[1][2] = {
		"type":"water",
		"data":{

		}
	};

	d[2][1] = {
		"type":"water",
		"data":{

		}
	};

	d[2][2] = {
		"type":"water",
		"data":{

		}
	};


	d[6][6] = {
		"type":"fire",
		"data":{

		}
	};
	d[6][7] = {
		"type":"fire",
		"data":{

		}
	};
	d[6][8] = {
		"type":"fire",
		"data":{

		}
	};
	*/

	return d;

});
