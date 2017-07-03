define([], function(){
	
	window.SIZE_I = 10;
	window.SIZE_J = 10;
	window.SIZE = 10;
	window.SIZE_MAX = Math.max(SIZE_I, SIZE_J);
	
	var d = [];
	for(var i = 0; i < SIZE_I; i++){
		d[i] = d[i] || [];
		for(var j = 0; j < SIZE_J; j++){
			if(i === 0 || i === SIZE_I - 1 || j === 0 || j === SIZE_J - 1){
				d[i][j] = {
					"type":"wall",
					"data":{
						"texture":3
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
	
	d[3][3] = {
		"type":"water",
		"data":{
			
		}
	};
	
	d[4][4] = {
		"type":"baddie",
		"data":{
			"strategy":"north-south"
		}
	};
	
	d[5][5] = {
		"type":"player",
		"data":{
			
		}
	};
	
	d[6][6] = {
		"type":"fire",
		"data":{
			
		}
	};
	
	d[7][7] = {
		"type":"character",
		"data":{
			
		}
	};
	
	d[8][8] = {
		"type":"object",
		"data":{
			
		}
	};
	
	return d;

});
