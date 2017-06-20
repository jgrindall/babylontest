define([], function(){
	
	var GamePadUtils = {
		
	};
	
	GamePadUtils.linkGamePadToId = function(manager, gamePad, id){
		var ROT_ANGLE = 50, ROT_SPEED = 0.03, SPEED = 0.5, MIN_DIST = 0.25;;
		gamePad.update.add({
			update : function(name, obj){
				var sf, data = manager.getComponentDataForEntity('SpeedComponent', id);
				if(name === "end"){
					data.ang_speed = 0;
					data.speed = 0;
					data.mode = "off";
				}
				else{
					data.mode = "on";
					if(obj.d < MIN_DIST){
						// not moved it much
						return;
					}
					sf = (obj.d - MIN_DIST) / (1 - MIN_DIST);
					sf = Math.sqrt(sf);
					if(obj.a < ROT_ANGLE || obj.a > 360 - ROT_ANGLE){
						data.ang_speed = ROT_SPEED * sf;
					}
					else if(obj.a > 180 - ROT_ANGLE && obj.a < 180 + ROT_ANGLE){
						data.ang_speed = -ROT_SPEED * sf;
					}
					else{
						data.speed = sf * Math.sin(obj.a*Math.PI/180) * SPEED;
						data.ang_speed = 0;
					}
				}
			}
		});
	};
	
	GamePadUtils.unlinkGamePad = function(manager, gamepad, id){
		//TODO gamePad.update.remove();
	};

	return GamePadUtils;
	
});
