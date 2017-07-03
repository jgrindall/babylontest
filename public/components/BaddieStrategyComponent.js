define([], function(){

	var BaddieStrategyComponent = {
		'state': {
		    'vel':{
				'x':0,
				'y':0
			},
			'strategy':"north-south",
			'path':{

			}
		}
	};

	BaddieStrategyComponent.name = "BaddieStrategyComponent";

	return BaddieStrategyComponent;

});
