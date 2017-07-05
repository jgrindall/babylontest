define([], function(){

	var FRICTION = 0.7;

	var UpdateHUDProcessor = function(manager, engine, scene, hud, solid){
		this.hud = hud;
		this.engine = engine;
		this.manager = manager;
		this.scene = scene;
		this.solid = solid;
		this.init();
	};

	UpdateHUDProcessor.prototype.init = function(){
		return [];
	};
	
	UpdateHUDProcessor.prototype.getWalls = function () {
		return [];
	};
	
	UpdateHUDProcessor.prototype.getWater = function () {
		return [];
	};
	
	UpdateHUDProcessor.prototype.getFire = function () {
		return [];
	};
	
	UpdateHUDProcessor.prototype.getPlayer = function () {
		return [];
	};
	
	UpdateHUDProcessor.prototype.getBaddies = function () {
		return [];
	};

	UpdateHUDProcessor.prototype.update = function () {
		var data = {
			"walls":this.getWalls(),
			"water":this.getWater(),
			"fire":this.getFire(),
			"player":this.getPlayer(),
			"baddies":this.getBaddies()
		};
		this.hud.update(data);
	};

	return UpdateHUDProcessor;

});
