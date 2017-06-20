define([], function(){
		
	var CollisionProcessor = function(manager){
		this.manager = manager;
		this.init();
	};
	
	CollisionProcessor.prototype.init = function(){
		console.log("init", this.manager);		
	};
	
	CollisionProcessor.prototype.update = function () {
		/*
		var checkCollisions = function(){
			_.each(characters, function(character){
				if (character && player && character.intersectsMesh(player, false)) {
					console.log("HIT " + character);
				}
			})
			if(player && container && player.intersectsMesh(container, false)){
				console.log("HIT CHAR");
			}
		};

		*/
	};

	return CollisionProcessor;
	
});
