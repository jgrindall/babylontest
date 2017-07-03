define([], function(){

	window.SIZE_I = 10;
	window.SIZE_J = 10;
	window.SIZE = 10;
	window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);

	var i, j, d = [];
	for(i = 0; i < SIZE_I; i++){
		d[i] = d[i] || [];
		for(j = 0; j < SIZE_J; j++){
			if(i === 0 || i === SIZE_I - 1 || j === 0 || j === SIZE_J - 1){
				d[i][j] = {
					"type":"wall",
					"data":{
						"texture":1
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

	d[2][2] = {
		"type":"water",
		"data":{

		}
	};

	d[2][3] = {
		"type":"water",
		"data":{

		}
	};

	d[6][6] = {
		"type":"fire",
		"data":{

		}
	};

	return d;

});
