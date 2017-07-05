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

	/*d[4][3] = {
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


	d[12][14] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};

	d[13][14] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};

	d[14][14] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};

	d[15][14] = {
		"type":"wall",
		"data":{
			"texture": 1
		}
	};

*/

	d[5][12] = {
		"type":"water",
		"data":{

		}
	};



	d[6][12] = {
		"type":"water",
		"data":{

		}
	};

	d[7][12] = {
		"type":"water",
		"data":{

		}
	};

	d[8][12] = {
		"type":"water",
		"data":{

		}
	};


	d[9][12] = {
		"type":"water",
		"data":{

		}
	};

	d[10][12] = {
		"type":"water",
		"data":{

		}
	};

	d[10][11] = {
		"type":"water",
		"data":{

		}
	};

	d[10][10] = {
		"type":"water",
		"data":{

		}
	};

	d[10][9] = {
		"type":"water",
		"data":{

		}
	};

	d[10][8] = {
		"type":"water",
		"data":{

		}
	};

	d[11][12] = {
		"type":"water",
		"data":{

		}
	};

	

	/*

	d[12][12] = {
		"type":"water",
		"data":{

		}
	};

	d[13][12] = {
		"type":"water",
		"data":{

		}
	};

	d[12][3] = {
		"type":"fire",
		"data":{

		}
	};
	d[12][4] = {
		"type":"fire",
		"data":{

		}
	};
	d[11][4] = {
		"type":"fire",
		"data":{

		}
	};
	d[12][5] = {
		"type":"fire",
		"data":{

		}
	};

	*/

	var objects = [
		{
			"type":"object",
			"data":{
				"texture":6,
				"position":[
					3,
					10
				]
			}
		},
		{
			"type":"object",
			"data":{
				"texture":6,
				"position":[
					15,
					7
				]
			}
		}
	];

	return {
		"landscape":d,
		"objects":objects
	};

});
